import { DonutSVGPathConfig, SegmentAttributes, SegmentCoordinates } from './types';

// convert between radians and degrees
const d2r = (d: number): number => d * (Math.PI / 180);
const r2d = (r: number): number => r / (Math.PI / 180);

/**
 * Find the angle that will produce an arc of a given length at a given radius.
 * Using this to allow for gaps between the segments. Returns angle in radians
 * arcLength = radius * angleInRadians
 *
 * @param {number} arcLength - the sought arc length in local coordinate space
 * @param {number} atRadius - the radius of the arc
 * @returns {number} - the angle in radians of an arc of the given length at the given radius
 */
const angleForArcLength = (arcLength: number, atRadius: number): number => arcLength / atRadius;

export default class DonutSVGPath {
  config: DonutSVGPathConfig;

  hole = 0; // The diameter of the chart's inner hole in local coordinate space units

  /**
   * Find the angle that will produce an arc of a given length at a given radius.
   * Using this to allow for gaps between the segments. Returns angle in radians
   * arcLength = radius * angleInRadians
   *
   * @param {number} arcLength - the sought arc length in local coordinate space
   * @param {number} atRadius - the radius of the arc
   * @returns {number} - the angle in radians of an arc of the given length at the given radius
   */
  static angleForArcLength = (arcLength: number, atRadius: number): number => arcLength / atRadius;

  /**
   * The thickness of the chart segments for the given size and hole
   */
  thickness = 10;

  /**
   * The outer radius of the chart
   */
  radiusOuter = 25;

  /**
   * The inner radius of the chart
   */
  radiusInner = 15;

  /**
   * The size of the gap between chart segments, in local coordinate space units
   */
  gapSize = 1;

  /**
   * Compute the angle offset required to establish the gaps between segments at the inner edge
   */
  gapAngleOffsetInner = 0;

  /**
   * Compute the angle offset required to establish the gaps between segments at the outer edge
   */
  gapAngleOffsetOuter = 0;

  /**
   * The minimum angle that won't be swallowed by the gap offsets at the inner edge.
   * Used to compute the minimum value that won't get swallowed (minimumValue defined below)
   */
  minimumAngleDeg = 0;

  /**
   * The minimum value that won't get swallowed by the gap offsets at the inner edge
   */
  minimumValue = 0;

  /**
   * Computes an x/y coordinate for the given angle and radius
   * @param {number} deg - The angle in degrees
   * @param {number} r  - The radius
   * @returns {Array} - An x/y coordinate for the point at the given angle and radius
   */
  private coords = (deg: number, r: number) => {
    const rad = d2r(deg);
    return [
      this.config.center - Math.cos(rad) * r,
      this.config.top - this.config.center - Math.sin(rad) * r
    ];
  };

  constructor(config: DonutSVGPathConfig = { size: 50, center: 0, innerRadius: 20, top: 0 }) {
    this.config = config;
    this.hole = this.config.size / 2;

    this.thickness = (this.config.size - this.hole) / 2;
    this.radiusOuter = this.config.size / 2;
    this.radiusInner = this.config.innerRadius;

    this.gapAngleOffsetInner = r2d(angleForArcLength(this.gapSize, this.radiusInner));

    this.gapAngleOffsetOuter = r2d(angleForArcLength(this.gapSize, this.radiusOuter));

    this.minimumAngleDeg = r2d(angleForArcLength(this.gapSize * 2, this.radiusInner));

    this.minimumValue = this.minimumAngleDeg / 360;
  }

  makeSegment = <Record>(
    { paths, subtotal }: SegmentCoordinates,
    { percent }: SegmentAttributes<Record>
  ) => {
    const startAngle = subtotal * 360 + 90; // +90 so we start at 12 o'clock
    const endAngle = startAngle + percent * 360;
    // no gaps for values beneath the minimum threshold
    const useGap = percent >= this.minimumValue;
    const innerGap = useGap ? this.gapAngleOffsetInner : 0;
    const outerGap = useGap ? this.gapAngleOffsetOuter : 0;

    const startAngleInner = startAngle + innerGap;
    const startAngleOuter = startAngle + outerGap;
    const endAngleInner = endAngle - innerGap;
    const endAngleOuter = endAngle - outerGap;

    const [x1, y1] = this.coords(startAngleInner, this.radiusInner); // start point on inner circle
    const [x2, y2] = this.coords(startAngleOuter, this.radiusOuter); // start point on outer circle
    const [x3, y3] = this.coords(endAngleOuter, this.radiusOuter); // end point on outer circle
    const [x4, y4] = this.coords(endAngleInner, this.radiusInner); // end point on inner circle

    const largeArc = percent > 0.5 ? 1 : 0;
    const sweepOuter = 1;
    const sweepInner = 0;
    const commands = [
      // move to start angle coordinate, inner radius
      `M${x1} ${y1}`,

      // line to start angle coordinate, outer radius
      `L${x2} ${y2}`,

      // arc to end angle coordinate, outer radius
      `A${this.radiusOuter} ${this.radiusOuter} 0 ${largeArc} ${sweepOuter} ${x3} ${y3}`,

      // line to end angle coordinate, inner radius
      `L${x4} ${y4}`,

      // arc back to start angle coordinate, inner radius
      `A${this.radiusInner} ${this.radiusInner} 0 ${largeArc} ${sweepInner} ${x1} ${y1}`
    ];

    paths.push(commands.join(' '));
    return {
      paths,
      subtotal: subtotal + percent
    };
  };
}
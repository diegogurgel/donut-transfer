import { IGroup, IShape } from '@antv/g6';
import { registerNode, BaseGlobal as Global, ModelConfig, ShapeStyle, Item } from '@antv/g6-core';

import { StringValueObject, Serie } from './types';

import DonutSVGPath from './donut-svg-path';
import { SegmentAttributes } from './types';
import { LegendCfg } from './donut-trasfer';
import ellipsis from '../utils/text';


type ShapeContext = {
  getShapeStyle: (cfg: ModelConfig | undefined) => ShapeStyle;
  drawLinkPoints: (cfg: ModelConfig | undefined, group: IGroup | undefined) => void;
  type: string;
};
export type DonutCustomConfig = ModelConfig & {
  size: number;
  series: Serie[];
  donutColorMap: { [key: string]: string };
  legendCfg: LegendCfg;
};

const defaultNodeOptions: ModelConfig = {
  style: {
    x: 0,
    y: 0,
    stroke: Global.defaultNode.style.stroke,
    fill: Global.defaultNode.style.fill,
    lineWidth: Global.defaultNode.style.lineWidth
  },
  labelCfg: {
    style: {
      fill: Global.nodeLabel.style.fill,
      fontSize: Global.nodeLabel.style.fontSize,
      fontFamily: Global.windowFontFamily
    }
  },
  linkPoints: {
    top: false,
    right: false,
    bottom: false,
    left: false,
    size: Global.defaultNode.linkPoints.size,
    lineWidth: Global.defaultNode.linkPoints.lineWidth,
    fill: Global.defaultNode.linkPoints.fill,
    stroke: Global.defaultNode.linkPoints.stroke
  },
  stateStyles: {
    ...Global.nodeStateStyles
  }
};

registerNode(
  'donut-custom',
  {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    options: defaultNodeOptions,
    shapeType: 'circle',
    labelPosition: 'top',
    drawShape(cfg: ModelConfig | undefined, group: IGroup | undefined): IShape {
      const context = this as ShapeContext;
      const style = context.getShapeStyle(cfg);
      const size = cfg?.size as number;
      const { series = [], donutColorMap = {}, legendCfg } = cfg as DonutCustomConfig;
      const disabledNode = series.every(({ disabled }) => disabled)

      const g2 = group as IGroup & {
        shapeMap: { [key: string]: IShape | undefined };
      };


      const attrs: SegmentAttributes<Serie>[] = [];
      const totalValue = series.reduce((total, { count }) => total + count, 0);
      series.forEach((serie) => {
        const id = serie.id || '';
        attrs.push({
          id,
          label: serie.name || serie.id || '',
          value: serie.count,
          color: !serie.disabled ? (donutColorMap[id]): '#ddd',
          percent: serie.count / totalValue,
          model: serie,

        });
      });
      if (totalValue) {
        const donutSVG = new DonutSVGPath({ size, center: 0, innerRadius: 30, top: disabledNode ? 10 : -8 });

        const segments = attrs.reduce<{ paths: string[]; subtotal: number }>(
          donutSVG.makeSegment,
          {
            paths: [],
            subtotal: 0
          }
        );

        attrs.forEach((attr, i) => {

          g2.shapeMap[`fan-shape-${i}`] = group?.addShape('path', {
            attrs: {
              path: segments.paths[i],
              lineWidth: 0,
              fill: attr.color,
              cursor: attr.model.disabled ? 'not-allowed' : 'pointer'
            },
            segmentAttrs: attr,
            name: !attr.model.disabled ? `fan-shape-${i}` : 'disabled-shape'
          });
        });

        group = drawPagination(
          attrs,
          donutColorMap,
          size,
          { currentPage: 0, pageSize: legendCfg.itemsPerPage || 3 },
          group
        );

        group?.addShape('text',{
          attrs: {
            text: `${(totalValue/1000).toFixed(1)}k`,
            fill: '#999',
            x: -17,
            y: 2,
            fontSize: 18,
            fontWeight: 'bold'
          },
          name: 'text-shape'
        })
      }

      const containerHeight = disabledNode ? 118 : group?.getBBox().height;
      const keyShapeStyle = {
        ...style,
        x: -size * 1.25,
        y: -containerHeight + containerHeight / 3.5,
        width: size * 2.5,
        height: containerHeight * 1.58,
        lineWidth: 0,
        radius: 12,
        fill: 'white',
        shadowBlur: 7,
        shadowColor: '#999',
        shadowOffsetX: 3,
        shadowOffsetY: 3
      };

      const keyShape = group?.addShape('rect', {
        attrs: keyShapeStyle,
        name: `rect-wrapper`
      });

      g2.shapeMap[`${context.type}-keyShape`] = keyShape;
      keyShape?.toBack();

      context.drawLinkPoints(cfg, group);
      return keyShape as IShape;
    },
    setState(_, value, item?: Item) {
      const group = item?.getContainer();
      group?.removeChild(group?.findById('legendGroup'));
      const {
        size,
        legendCfg: { itemsPerPage },
        donutColorMap,
        series
      } = item?._cfg?.model as DonutCustomConfig;
      const totalValue = series.reduce((total, { count }) => total + count, 0);
      const attrs: SegmentAttributes<Serie>[] = [];
      series.forEach((serie) => {
        const id = serie.id || '';
        attrs.push({
          id,
          label: serie.name || serie.id || '',
          value: serie.count,
          color: donutColorMap[id],
          percent: serie.count / totalValue,
          model: serie
        });
      });
      drawPagination(
        attrs,
        donutColorMap,
        size,
        { currentPage: Number(value), pageSize: itemsPerPage || 3 },
        group
      );
    }
  },
  'circle'
);

const drawPagination = (
  segments: SegmentAttributes<Serie>[] = [],
  donutColorMap: StringValueObject,
  nodeSize: number,
  paginationConfig: {
    currentPage: number;
    pageSize: number;
  },
  group?: IGroup
): IGroup | undefined => {
  let x = -(nodeSize / 2) - 35;
  let y = 0;
  const { currentPage, pageSize } = paginationConfig;
  const legendSize = 13;

  const lineSpacing = 7;
  const legendGroup = group?.addGroup({ id: 'legendGroup' });
  const sharedTextStyle = {
    fill: 'black',
    fontSize: legendSize,
    cursor: 'pointer'
  };
  segments.filter((attr) => !attr.model.disabled)
    .splice(currentPage > 0 ? currentPage * pageSize : 0, pageSize)
    .forEach((attr, index) => {
      y = (legendSize + lineSpacing) * index + nodeSize / 2;

      legendGroup?.addShape('circle', {
        name: `legend-shape-${index}`,
        segmentAttrs: attr,
        attrs: {
          x,
          y: y + 10,
          r: 6,
          fill: donutColorMap[attr.id],
          cursor: 'pointer'
        }
      });
      legendGroup?.addShape('text', {
        name: `legend-shape-text${index}`,
        segmentAttrs: attr,
        attrs: {
          ...sharedTextStyle,
          x: x + legendSize,
          y: y + legendSize + 6,
          text: `${ellipsis(`${attr.label}`, 12)}`
        }
      });
      legendGroup?.addShape('text', {
        name: `legend-shape-tex-percentt${index}`,
        segmentAttrs: attr,
        attrs: {
          ...sharedTextStyle,
          x: x + 154,
          y: y + legendSize + 6,
          text: `${attr.value} (${Math.round(attr.percent * 100)}%)`,
          textAlign: 'end'
        }
      });
    });

  return group;
};
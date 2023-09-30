export type DonutSVGPathConfig = {
  size: number; // The viewBox size. Coordinates are computed within this coordinate space
  center: number; // The center of the viewBox, center of the chart
  innerRadius: number; // Inner radius circle
  top: number; // Top position, it accepts negative numbers.
};
export type SegmentCoordinates = {
  paths: string[];
  subtotal: number;
};

export type SegmentAttributes<I> = {
  id: string;
  label: string;
  value: number;
  color: string;
  percent: number;
  model: I;
};

export type Serie = {
  id?: string;
  name?: string;
  count: number;
  disabled?: boolean;
};

export type Node = {
  id: string;
  name: string;
  label?: string;
  count?: string;
  series?: Serie[];
};

export type StringValueObject = {
  [key: string]: string;
};
export type NumberValueObject = {
  [key: string]: number;
};
export type KeyValueMap<ValueType> = {
  [key: string]: ValueType;
};
import React, { useEffect, useRef } from 'react';
import G6 from '@antv/g6';
import { GraphData, GraphOptions, IG6GraphEvent } from '@antv/g6-core';
import { deepMix } from '@antv/util';
import { Node, Serie } from './types';
import { SegmentAttributes } from './types';
import './donut-shape';

export const isSegmentInteractible = (event: IG6GraphEvent | undefined) => {
  if (!event) return false;
  const targetName = event.target.get('name') as string;
  return targetName.startsWith('fan-shape') || targetName.startsWith('legend-shape');
};

export const getTooltipContent = function(
  event: Partial<IG6GraphEvent> | undefined
) {
  if (!event) return '';
  const { segmentAttrs } = event?.target?.cfg as {
    segmentAttrs: SegmentAttributes<Serie>;
  };
  if (!segmentAttrs) return '';

  const content = document.createElement('div');
  content.style.height = '26px';
  content.style.fontFamily = 'Tahoma'
  content.innerHTML = `
      <div style='color: ${segmentAttrs.color}'>${
    segmentAttrs.label
  }</div>
          <b>${segmentAttrs.value}</b> 
          (${Math.round(segmentAttrs.percent * 100)}%)
        
      `;
  return content;
};

export const triggerSegmentClick = (
  event: IG6GraphEvent,
  onSegmentClick: ProcessProps['onSegmentClick']
) => {
  if (isSegmentInteractible(event)) {
    // eslint-disable-next-line no-underscore-dangle
    const nodeModel = event?.item?._cfg?.model as Node;
    const { segmentAttrs } = event.target.cfg as {
      segmentAttrs: SegmentAttributes<Serie>;
    };

    if (onSegmentClick) onSegmentClick(nodeModel, segmentAttrs.model);
  }
};

export type LegendCfg = {
  itemsPerPage?: number;
};

export type CustomGraphOptions = GraphOptions & {
  defaultNode: {
    donutColorMap?: { [key: string]: string } & GraphOptions['defaultNode'];
    legendCfg?: LegendCfg;
  };
};


const defaultOptions: CustomGraphOptions = {
  container: '',
  fitView: true,
  
  layout: {
    nodesep: 60,
    ranksep: 85,
    type: 'dagre',
    
    rankdir: 'LR',
    controlPoints: true,
    
  },
  defaultNode: {
    type: 'donut-custom',
    size: 75,
    capture: false,
    labelCfg: {
      style: {
        y: -55,
        textAlign: 'center',
        fill: 'black',
        fontSize: 16,
        fontWeight: 600,
        fontFamily: 'Tahoma',
        capture: false
      },
      capture: false
    },
    legendCfg: {
      itemsPerPage: 3
    }
  },
  defaultEdge: {
    type: 'polyline',
    size: 2,
    color: '#7D7D7D',
    style: {
      radius: 30,
      lineDash: [8],
      endArrow: {
        path: 'M 0,0 L 18,10 L 18,-10 Z',
        fill: '#999',
        stroke: 'transparent',
        }
    }
  }
};


export interface ProcessProps {
  data: GraphData;
  widgetContainerHeight?: number
  options?: Partial<CustomGraphOptions>;
  onSegmentClick?: (node: Node, serie: Serie) => void;
}

const DonutGraph: React.FC<ProcessProps & React.HtmlHTMLAttributes<HTMLDivElement>> = ({
  data,
  options = {},
  onSegmentClick,
  widgetContainerHeight = 450,
  
  ...props
}) => {
  const graphContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const tooltip = new G6.Tooltip({
      itemTypes: ['node'],
      shouldBegin: isSegmentInteractible,
      getContent: getTooltipContent
    });

    const mergedOptions = deepMix(defaultOptions, options);
    const graph = new G6.Graph({
      ...mergedOptions,
      container: graphContainerRef.current as HTMLDivElement,
      width: graphContainerRef.current?.scrollWidth,
      height: graphContainerRef.current?.scrollHeight
    });
    
    graph.addPlugin(tooltip)
    graph.data(data);
    
    graph.render();
    
    return () => {
      graph.destroy();
        
    };
    

  }, [data, options, graphContainerRef]);
  

  return <div style={{ height: widgetContainerHeight, width: '80vw', margin: 'auto', background: '#eee'}} ref={graphContainerRef} {...props} />;
};

export default DonutGraph;
import { useRegisterEvents, useSigma } from '@react-sigma/core';
import { useEffect, useState } from 'react';
import debounce from 'lodash/debounce'; 

const NODE_FADE_COLOR = "#eee";
const EDGE_FADE_COLOR = "#eee";

const GraphEvents = () => {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();
  // curr state and function to update it
  const [hoveredNode, setHoveredNode] = useState(null);
  
  const debouncedHoveredNode = useDebouncedValue(hoveredNode, 40);

  useEffect(() => {
    if (!sigma) return;
    
    const graph = sigma.getGraph();
    //change node before process
    sigma.setSetting(
      "nodeReducer",
      debouncedHoveredNode
        ? (node, data) =>
            node === debouncedHoveredNode ||
            graph.hasEdge(node, debouncedHoveredNode) ||
            graph.hasEdge(debouncedHoveredNode, node)
              ? { ...data, zIndex: 2, size: 12 }
              : { 
                  ...data, 
                  zIndex: 0, 
                  label: "", 
                  size: 8,
                  image: null,
                  color: NODE_FADE_COLOR,
                  type: 'circle' 
                }
        : null
    );
    console.log(debouncedHoveredNode)
    sigma.setSetting(
      "edgeReducer",
      debouncedHoveredNode
        ? (edge, data) =>
            graph.hasExtremity(edge, debouncedHoveredNode)
              ? { ...data, size: 4 }
              : { ...data, color: EDGE_FADE_COLOR, hidden: true}
        : null
    );
  }, [debouncedHoveredNode, sigma]);

  useEffect(() => {
    registerEvents({
      enterNode: (event) => {
        setHoveredNode(event.node);
      },
      leaveNode: () => {
        setHoveredNode(null);
      }
    });
  }, [registerEvents]);

  return null;
};


function useDebouncedValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default GraphEvents;
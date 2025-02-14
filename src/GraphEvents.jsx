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
  const [draggedNode, setDraggedNode] = useState(null);
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
              ? { ...data, zIndex: 2, size: 10 + ((graph.inDegree(node) + graph.outDegree(node)) * 1.5)}
              : { 
                  ...data, 
                  zIndex: 0, 
                  label: "", 
                  size: 10,
                  image: null,
                  color: NODE_FADE_COLOR,
                  type: 'circle' 
                }
               
        : null
    ); 

    sigma.setSetting(
      "edgeReducer",
      debouncedHoveredNode
        ? (edge, data) =>
            graph.hasExtremity(edge, debouncedHoveredNode)
              ? { ...data, size: 4, zIndex: 2}
              // or just set hidden: true
              : { ...data, color: EDGE_FADE_COLOR, zIndex: 0}
        : null
    );
    // when dependency changes, will run effect
  }, [debouncedHoveredNode, sigma]);

  useEffect(() => {
    registerEvents({
      enterNode: (event) => {
        setHoveredNode(event.node);
      },
      leaveNode: () => {
        setHoveredNode(null);
      },
      downNode: (event) => {
        setDraggedNode(event.node);
        console.log(event.node);
      },
      mousemove: (event) => {
        if (!draggedNode) return;
        const pos = sigma.viewportToGraph(event);
        sigma.getGraph().setNodeAttribute(draggedNode, 'x', pos.x);
        sigma.getGraph().setNodeAttribute(draggedNode, 'y', pos.y);

        // Prevent sigma to move camera:
        event.preventSigmaDefault();
        event.original.preventDefault();
        event.original.stopPropagation();
      },
      //mouse release
      mouseup: () => {
        if (draggedNode) {
          setDraggedNode(null);
        }
      },
      // pressed
      mousedown: () => {
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
      },
    });
  }, [registerEvents, draggedNode, sigma]);

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
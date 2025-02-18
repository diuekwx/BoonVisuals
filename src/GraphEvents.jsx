import { useRegisterEvents, useSigma } from '@react-sigma/core';
import { useEffect, useState } from 'react';
import debounce from 'lodash/debounce'; 
import MyModal from './Popup';
import boons from './all_boons.json'

const NODE_FADE_COLOR = "#eee";
const EDGE_FADE_COLOR = "#eee";

const boonData = (boonname) => {
  return boons.find((boon) => boon.name === boonname);
}

export const getNodeReducer = (highlightedNode, graph) => {
  return highlightedNode
    ? (node, data) => 
        node === highlightedNode ||
        graph.hasEdge(node, highlightedNode) ||
        graph.hasEdge(highlightedNode, node)
          ? { ...data, zIndex: 2, size: 10 + (graph.inDegree(node) * 1.5)}
          : { 
              ...data, 
              zIndex: 0, 
              label: "", 
              size: 10,
              image: null,
              color: NODE_FADE_COLOR,
              type: 'circle' 
            }
    : null;
};

export const getEdgeReducer = (highlightedNode, graph) => {
  return highlightedNode
    ? (edge, data) =>
        graph.hasExtremity(edge, highlightedNode)
          ? { ...data, size: 4, zIndex: 2}
          : { ...data, color: EDGE_FADE_COLOR, zIndex: 0}
    : null;
};

const GraphEvents = () => {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();
  // curr state and function to update it
  const [hoveredNode, setHoveredNode] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const debouncedHoveredNode = useDebouncedValue(hoveredNode, 40);

  const [position, setPosition] = useState({ x: 0, y: 0 });


  useEffect(() => {
    if (!sigma) return;
    
    const graph = sigma.getGraph();

    //change node before process
    sigma.setSetting("nodeReducer", getNodeReducer(debouncedHoveredNode, graph));
    sigma.setSetting("edgeReducer", getEdgeReducer(debouncedHoveredNode, graph));
    // when dependency changes, will run effect
  }, [debouncedHoveredNode, sigma]);

  useEffect(() => {
    const graph = sigma.getGraph();

    registerEvents({
      enterNode: (event) => {
        setHoveredNode(event.node);
      },
      leaveNode: () => {
        setHoveredNode(null);
      },
      downNode: (event) => {
        setDraggedNode(event.node);
      },
      doubleClickNode: (event) => {
        const node = graph.getNodeAttributes(event.node);
        const viewportPos = sigma.graphToViewport({
          x: node.x,
          y: node.y
        });
        
        setPosition({
          x: viewportPos.x,
          y: viewportPos.y
        });

        const clickedNode = boonData(event.node);
        if (clickedNode) {
          setSelectedNode(clickedNode);
          setIsOpen(true);
        }
        
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
        if (selectedNode){
          setSelectedNode(null);
        }
      },
      // pressed
      mousedown: () => {
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
 
      },
    });
  }, [registerEvents, draggedNode, sigma]);
  
  return (
    <>
      <MyModal 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
        boonData={selectedNode}
        position={position}
      />
    </>
  );
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
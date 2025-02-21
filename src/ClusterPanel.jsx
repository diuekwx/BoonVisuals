import React, { useState } from 'react';
import { useSigma} from '@react-sigma/core';
import { useRegisterEvents, useSetSettings } from '@react-sigma/core';

const GodClustersPanel = ({ godColors }) => {
  // Create clusters from godColors object
  const gods = Object.keys(godColors);
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const [selectedGods, setSelectedGods] = useState(
    Object.fromEntries(gods.map(god => [god, true]))
  );
  
  // Handle individual god toggle
  const handleGodToggle = (god) => {
    const newSelectedGods = {
      ...selectedGods,
      [god]: !selectedGods[god]
    };
    setSelectedGods(newSelectedGods);
    
    // Hide/show nodes based on god attribute
    graph.forEachNode((node, attributes) => {
      if (attributes.god === god) {
        graph.setNodeAttribute(node, 'hidden', !newSelectedGods[god]);
        
        // Optionally hide/show connected edges
        graph.forEachEdge(
          node,
          (edge, edgeAttributes, source, target) => {
            const sourceHidden = graph.getNodeAttribute(source, 'hidden');
            const targetHidden = graph.getNodeAttribute(target, 'hidden');
            graph.setEdgeAttribute(edge, 'hidden', sourceHidden || targetHidden);
          }
        );
      }
    });
  };

  // Handle check/uncheck all gods
  const handleCheckAll = (checked) => {
    const newSelectedGods = Object.fromEntries(
      gods.map(god => [god, checked])
    );
    setSelectedGods(newSelectedGods);
    
    // Update all nodes visibility
    graph.forEachNode((node, attributes) => {
      graph.setNodeAttribute(node, 'hidden', !checked);
    });
    
    // Update all edges visibility
    graph.forEachEdge((edge) => {
      graph.setEdgeAttribute(edge, 'hidden', !checked);
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Gods</h2>
        <div className="space-x-2">
          <button
            onClick={() => handleCheckAll(true)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Check all
          </button>
          <button
            onClick={() => handleCheckAll(false)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Uncheck all
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        {gods.map(god => (
          <div key={god} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={god}
              checked={selectedGods[god]}
              onChange={() => handleGodToggle(god)}
              className="rounded"
            />
            <label 
              htmlFor={god}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: godColors[god] }}
              />
              <span>{god}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GodClustersPanel;
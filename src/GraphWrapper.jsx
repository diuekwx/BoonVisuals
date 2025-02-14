import React, { useEffect, useState } from 'react';
import { SigmaContainer, useLoadGraph, useRegisterEvents, useSigma} from '@react-sigma/core';
import Graph from 'graphology';
import { NodeImageProgram } from '@sigma/node-image';
import text from './paste.txt'
import maps from './img_map.json'
import boons from './all_boons.json'
import GraphEvents from './GraphEvents';

function importAll(r) {
  let images = {};
    r.keys().forEach((item, index) => { images[item.replace('./', '')] = r(item); });
  return images
}
// https://shaquillegalimba.medium.com/how-to-import-multiple-images-in-react-1936efeeae7b
const images = importAll(require.context('./boon_images', false, /\.(png|jpe?g|svg)$/));
//console.log(images.find("Air_Quality_II.png"));

const sigmaSettings = {
  nodeProgramClasses: { image: NodeImageProgram },
  defaultNodeType: 'image',
  defaultEdgeType: 'arrow'
};


const GraphComponent = () => {
  const loadGraph = useLoadGraph();
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();

  // loading graphs
  useEffect(() => {
    const loadData = async () => {
      try{
        const godColors = {
                    'Aphrodite': '#ff69b4',
                    'Artemis': '#90ee90',
                    'Athena': '#ffd700',
                    'Chaos': '#4b0082',
                    'Demeter': '#21cbcb',
                    'Dionysus': '#800080',
                    'Hermes': '#ffa500',
                    'Poseidon': '#00bfff',
                    'Zeus': '#87ceeb',
                    'Apollo': '#ffd700',
                    'Hephaestus': '#cd853f',
                    'Hera': '#9370db',
                    'Hestia': '#ff4500'
                  };
        const graph = new Graph();

        boons.forEach((boon) => {
          if (!graph.hasNode(boon.name)) {
            graph.addNode(boon.name, {
              x  : Math.random(),
              y : Math.random(),
              label: boon.name,
              //god: boon.god,
              //type: boon.type,
              //description: boon.description,
              image: images[maps[boon.name]],
              
              color: godColors[boon.god] || '#808080',
              size: 10
            });
            //console.log(graph.getNodeAttributes(boon.name).image);

          }
        });
        
          boons.forEach((boon) => {
            const addPrereqEdges = (prereqs) => {
              if (Array.isArray(prereqs)) {
                prereqs.forEach(prereq => {
                  if (typeof prereq === 'object' && prereq.boon) {
                    if (graph.hasNode(prereq.boon) && !graph.hasEdge(prereq.boon, boon.name)) {
                      graph.addEdge(prereq.boon, boon.name, {
                        type: 'arrow',
                        size: 3,
                      });
                    }
                  }
                });
              }
            }
            if (boon.prerequisites.prereqs) {
                          if (Array.isArray(boon.prerequisites.prereqs)) {
                            boon.prerequisites.prereqs.forEach(prereq => {
                              if (Array.isArray(prereq)) {
                                // Handle element prerequisites
                              } else if (typeof prereq === 'object') {
                                addPrereqEdges([prereq]);
                              }
                            });
                          }
                        }
          });

        loadGraph(graph);

      }
      catch (error){
        console.error('Error in loadData:', error);
      }
    }
    loadData();
  }, [loadGraph]);

  // EFFECTS YAYYAYAYAYAYFYASDUIFGAEDFRIWUJGFVHUIRWEDHGVWRIOVNSFJKNGBSRFNLGBWERFOGNERNOIGWERBNKGSRNIGUJRD
  // useEffect(() => {
  //   if (!sigma) return;  // Add this check
    
  //   //TODO: just register the event after the effects are added 
  //   registerEvents({
  //     enterNode: (event) => console.log('enterNode', event.node),
  //     leaveNode: (event) => console.log('leaveNode', event.node)
  //     // enterNode: (event) => {
  //     //   console.log('Hovering over node:', event.node);
  //     //   const graph = sigma.getGraph();
  //     //   graph.setNodeAttribute(event.node, "size", 15);  
  //     // },
  //     // leaveNode: (event) => {
  //     //   console.log('Left node:', event.node);
  //     //   const graph = sigma.getGraph();
  //     //   graph.setNodeAttribute(event.node, "size", 10);  
  //     // },
  //     // clickNode: (event) => console.log('clickNode', event.event, event.node, event.preventSigmaDefault)
  //   });
  // }, [registerEvents, sigma]);


  return null;
}


const BoonGraph = () => {
  return (
    <div className="w-full h-screen bg-gray-900">
      <SigmaContainer settings={sigmaSettings} className="w-full h-full">
        <GraphComponent />
        <GraphEvents />
      </SigmaContainer>
    </div>
  );
};

export default BoonGraph;
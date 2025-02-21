import { useEffect, useState } from 'react';
import { useSigma} from '@react-sigma/core';
import { getNodeReducer, getEdgeReducer } from '../GraphEvents';


//FocusOnNode node={focusNode ?? selectedNode} move={focusNode ? false : true}
const FocusOnNode = ({ node, move }) => {
    if (!node) return null;

    const sigma = useSigma();
    const graph = sigma.getGraph();

    useEffect(() => {
        const focused = graph.getNodeAttributes(node);

        const nodeReducer = (node, data) => {
            const res = { ...data };
            // get it out of the hover effect sooner
            // Only apply visual effects if this is a final selection
            // (not just a focus while searching)
            if (!move) return res;  // If move is false, we're still searching
            
            if (node === focused.id) {
                res.zIndex = 5;
                res.size = res.size * 1.5;
                res.forceLabel = true;
            } else if (graph.areNeighbors(node, focused.id)) {
                res.color = '#808080';
                res.forceLabel = true;
            } else {
                res.color = '#eee',
                res.size = 10,
                res.zIndex= 0,
                res.label = "",  
                res.image = null
            }
            return res;
        };

        sigma.setSetting("nodeReducer", nodeReducer);
        const edgeReducer = (edge, data) => {
            const res = { ...data };
            if (graph.hasExtremity(edge, focused.id)) {
                res.size = 4,
                res.zIndex = 2
            } else {
                res.color = '#eee',
                res.zIndex = 0;
            }
            return res;
        };

        sigma.setSetting("edgeReducer", edgeReducer);

        const viewportPos = {
            x: focused.x,
            y: focused.y
        };
        
        const camera = sigma.getCamera();
        const pos = {x: viewportPos.x, y: viewportPos.y, ratio: 1/4};
        if (move){
            camera.animate(pos, {
                duration: 500,
                easing: 'linear'
            });
        }

        return () => {
            move = false;
            sigma.setSetting("nodeReducer", null);
            sigma.setSetting("edgeReducer", null);
        };

    }, [node, move, sigma, graph]);

    return null;
}

export default FocusOnNode;
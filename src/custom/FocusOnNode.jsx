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
        sigma.setSetting("nodeReducer", getNodeReducer(node, graph));
        sigma.setSetting("edgeReducer", getEdgeReducer(node, graph));

        const viewportPos = {
            x: focused.x,
            y: focused.y
        };
        console.log(viewportPos);
        const camera = sigma.getCamera();
        const pos = {x: viewportPos.x, y: viewportPos.y, ratio: 1/4};
        if (move){
            camera.animate(pos , {
                duration: 500,
                easing: 'linear'
            });
        }
        else{
            console.log('balls');
        }
        return () => {
            // reset
            sigma.setSetting("nodeReducer", null);
            sigma.setSetting("edgeReducer", null);
        };

    }, [node, move])

    return null;
}

export default FocusOnNode;
import { useState, useCallback } from 'react';
import { GraphSearch, GraphSearchOption } from '@react-sigma/graph-search';
import { useSigma, ControlsContainer } from '@react-sigma/core';
import FocusOnNode  from './custom/FocusOnNode';
// import '@react-sigma/core/lib/style.css';
import '@react-sigma/graph-search/lib/style.css';



const GraphSearcher = ({ hoveredNode, setHoveredNode }) => {
  const sigma = useSigma();
  if (!sigma) return null;
  const graph = sigma.getGraph();

  const [selectedNode, setSelectedNode] = useState(null);
  const [focusNode, setFocusNode] = useState(null);


  const onFocus = useCallback((value) => {
    if (value === null) setFocusNode(null);
      else if (value.type === 'nodes') setFocusNode(value.id);
    }, []);

  const onChange = useCallback((value) => {
  if (value === null) setSelectedNode(null);
  else if (value.type === 'nodes') setSelectedNode(value.id);
  }, []);

  const postSearchResult = useCallback((options) => {
      return options.length <= 10
        ? options
        : [
            ...options.slice(0, 10),
            {
              type: 'message',
              message: <span className="text-center text-muted">And {options.length - 10} others</span>,
            },
          ];
    }, []);
return (
  <>
  {console.log('Focus node:', focusNode)}
  
  {console.log('Selected node:', selectedNode)}
  <ControlsContainer position={'top-right'}>
    <GraphSearch
      type="nodes"
      value={selectedNode ? { type: 'nodes', id: selectedNode } : null}
      onFocus={onFocus}
      onChange={onChange}
      postSearchResult={postSearchResult}
    />
  </ControlsContainer>
  <FocusOnNode node={focusNode ?? selectedNode} move={focusNode ? false : true} />
  
  
  </>
);
}
export default GraphSearcher;
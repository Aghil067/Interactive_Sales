import React, { useEffect, useRef } from 'react';

export default function TableauDashboard() {
  const containerRef = useRef(null);

  const url = "https://public.tableau.com/views/Superstore_24/Overview";

  useEffect(() => {
    let vizElement = null;

    const initTableau = () => {
      // Check if the script is already loaded to prevent duplicates
      if (!window.tableau) {
        const script = document.createElement("script");
        script.type = "module";
        script.src = "https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js";
        
        script.onload = () => {
          createViz();
        };
        
        document.head.appendChild(script);
      } else {
        createViz();
      }
    };

    const createViz = () => {
      if (containerRef.current) {
        // Create the tableau-viz web component
        vizElement = document.createElement('tableau-viz');
        vizElement.src = url;
        vizElement.toolbar = 'bottom';
        vizElement.hideTabs = false;
        vizElement.style.width = '100%';
        vizElement.style.height = '800px';

        containerRef.current.appendChild(vizElement);
      }
    };

    initTableau();

    // Cleanup on unmount
    return () => {
      if (containerRef.current && vizElement) {
        containerRef.current.removeChild(vizElement);
      }
    };
  }, [url]);

  return (
    <div style={{ padding: '20px', width: '100%', height: '100%' }}>
      <h2>Real Tableau Integration (Embedded)</h2>
      <p>This component loads a live Tableau Public dashboard using the official Embedding API v3.</p>
      
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '800px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          overflow: 'hidden',
          marginTop: '20px'
        }}
      >
        {/* The tableau-viz web component will be injected here */}
      </div>
    </div>
  );
}

// Graph visualization code for CLARION website
// Global variables for graph data and visualization
let graphNodes = [];
let graphLinks = [];
let simulation;
let svg;
let nodeElements;
let linkElements;
// Color scheme for different node types
const nodeColors = {
    question: '#3b82f6',  // blue
    resource: '#10b981',  // green
    project: '#8b5cf6',   // purple
    concept: '#f59e0b'    // amber
};
// Initialize the hero graph preview
function initHeroGraph() {
    const heroGraph = document.getElementById('hero-graph');
    
    if (!heroGraph) return;
    
    // Create SVG
    const width = heroGraph.clientWidth;
    const height = heroGraph.clientHeight;
    
    const heroSvg = d3.select('#hero-graph')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`);
    
    // Create sample data for hero visualization
    const nodes = [
        { id: 'n1', type: 'concept', label: 'Knowledge Graph', x: width * 0.5, y: height * 0.5 },
        { id: 'n2', type: 'resource', label: 'Research Papers', x: width * 0.3, y: height * 0.3 },
        { id: 'n3', type: 'question', label: 'Quantum Theory', x: width * 0.7, y: height * 0.3 },
        { id: 'n4', type: 'project', label: 'Collaborative Research', x: width * 0.3, y: height * 0.7 },
        { id: 'n5', type: 'question', label: 'AI Ethics', x: width * 0.7, y: height * 0.7 }
    ];
    
    const links = [
        { source: 'n1', target: 'n2' },
        { source: 'n1', target: 'n3' },
        { source: 'n1', target: 'n4' },
        { source: 'n1', target: 'n5' },
        { source: 'n2', target: 'n3' },
        { source: 'n4', target: 'n5' }
    ];
    
    // Create links
    heroSvg.append('g')
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('x1', d => nodes.find(n => n.id === d.source).x)
        .attr('y1', d => nodes.find(n => n.id === d.source).y)
        .attr('x2', d => nodes.find(n => n.id === d.target).x)
        .attr('y2', d => nodes.find(n => n.id === d.target).y)
        .attr('stroke', '#cbd5e1')
        .attr('stroke-width', 2);
    
    // Create nodes
    const nodeGroups = heroSvg.append('g')
        .selectAll('g')
        .data(nodes)
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    
    // Add circles for nodes
    nodeGroups.append('circle')
        .attr('r', 25)
        .attr('fill', d => nodeColors[d.type])
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2);
    
    // Add labels to nodes
    nodeGroups.append('text')
        .text(d => d.label)
        .attr('text-anchor', 'middle')
        .attr('dy', 45)
        .attr('fill', '#1e293b')
        .attr('font-size', '12px')
        .attr('font-weight', 500);
    
    // Add animation
    nodeGroups.selectAll('circle')
        .transition()
        .duration(2000)
        .attr('r', 30)
        .transition()
        .duration(2000)
        .attr('r', 25)
        .on('end', function() {
            d3.select(this)
                .transition()
                .duration(2000)
                .attr('r', 30)
                .transition()
                .duration(2000)
                .attr('r', 25)
                .on('end', function() {
                    d3.select(this).call(d => this.parentNode.__transition__ = null);
                });
        });
}

// Initialize the main interactive graph
function initInteractiveGraph() {
    const graphContainer = document.getElementById('graph-container');
    
    if (!graphContainer) return;
    
    // Clear any existing content
    graphContainer.innerHTML = '';
    
    // Create SVG
    const width = graphContainer.clientWidth;
    const height = graphContainer.clientHeight;
    
    svg = d3.select('#graph-container')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`);
        
    // Create the force simulation
    simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id(d => d.id).distance(150))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(50));
    
    // Create the graph elements
    updateGraph();
    
    // Add zoom capabilities
    const zoom = d3.zoom()
        .scaleExtent([0.1, 3])
        .on('zoom', (event) => {
            svg.selectAll('g').attr('transform', event.transform);
        });
    
    svg.call(zoom);
}

// Update the graph visualization with current data
function updateGraph() {
    if (!svg) return;
    
    // Create links
    linkElements = svg.append('g')
        .selectAll('line')
        .data(graphLinks)
        .enter()
        .append('line')
        .attr('stroke', '#cbd5e1')
        .attr('stroke-width', 2);
    
    // Create nodes
    nodeElements = svg.append('g')
        .selectAll('g')
        .data(graphNodes)
        .enter()
        .append('g')
        .call(d3.drag()
            .on('start', dragStarted)
            .on('drag', dragged)
            .on('end', dragEnded));
    
    // Add circles for nodes
    nodeElements.append('circle')
        .attr('r', 30)
        .attr('fill', d => nodeColors[d.type])
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2);
    
    // Add labels to nodes
    nodeElements.append('text')
        .text(d => d.label)
        .attr('text-anchor', 'middle')
        .attr('dy', 45)
        .attr('fill', '#1e293b')
        .attr('font-size', '12px')
        .attr('font-weight', 500);
    
    // Add click event to show details
    nodeElements.on('click', showNodeDetails);
    
    // Update the simulation
    simulation.nodes(graphNodes).on('tick', ticked);
    simulation.force('link').links(graphLinks);
    simulation.alpha(1).restart();
}

// Handle the simulation tick event
function ticked() {
    linkElements
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
    
    nodeElements
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
}

// Drag functions for nodes
function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

// Add a node to the graph
function addNode(type, label) {
    const id = `node-${graphNodes.length + 1}`;
    graphNodes.push({ id, type, label });
    
    // Update the node selection dropdowns
    updateNodeSelections();
    
    // If the visualization is already initialized, update it
    if (svg) {
        svg.selectAll('*').remove();
        updateGraph();
    }
    
    // Return the new node id
    return id;
}

// Add an edge between nodes
function addEdge(sourceId, targetId) {
    // Check if nodes exist
    const sourceExists = graphNodes.some(n => n.id === sourceId);
    const targetExists = graphNodes.some(n => n.id === targetId);
    
    if (!sourceExists || !targetExists) return false;
    
    // Check if edge already exists
    const edgeExists = graphLinks.some(
        l => (l.source.id === sourceId && l.target.id === targetId) || 
             (l.source.id === targetId && l.target.id === sourceId)
    );
    
    if (edgeExists) return false;
    
    // Add the edge
    graphLinks.push({ source: sourceId, target: targetId });
    
    // If the visualization is already initialized, update it
    if (svg) {
        svg.selectAll('*').remove();
        updateGraph();
    }
    
    return true;
}

// Update node selection dropdowns
function updateNodeSelections() {
    const sourceSelect = document.getElementById('source-node');
    const targetSelect = document.getElementById('target-node');
    
    if (!sourceSelect || !targetSelect) return;
    
    // Clear existing options
    sourceSelect.innerHTML = '';
    targetSelect.innerHTML = '';
    
    // Add placeholder options
    sourceSelect.appendChild(new Option('Select source node', ''));
    targetSelect.appendChild(new Option('Select target node', ''));
    
    // Add node options
    graphNodes.forEach(node => {
        sourceSelect.appendChild(new Option(node.label, node.id));
        targetSelect.appendChild(new Option(node.label, node.id));
    });
}

// Show node details when clicked
function showNodeDetails(event, node) {
    const detailPanel = document.getElementById('detail-panel');
    const noSelection = document.getElementById('no-selection');
    const detailsContent = document.getElementById('details-content');
    const detailTitle = document.getElementById('detail-title');
    const detailType = document.getElementById('detail-type');
    const detailConnections = document.getElementById('detail-connections');
    const relatedNodes = document.getElementById('related-nodes');
    
    if (!detailPanel) return;
    
    // Show the details
    noSelection.classList.add('hidden');
    detailsContent.classList.remove('hidden');
    
    // Set the details content
    detailTitle.textContent = node.label;
    detailType.textContent = `Type: ${node.type.charAt(0).toUpperCase() + node.type.slice(1)}`;
    
    // Find connected nodes
    const connections = graphLinks.filter(l => 
        l.source.id === node.id || l.target.id === node.id
    );
    
    detailConnections.textContent = `Connections: ${connections.length}`;
    
    // Show related nodes
    relatedNodes.innerHTML = '';
    
    if (connections.length > 0) {
        const relatedTitle = document.createElement('h4');
        relatedTitle.textContent = 'Connected Nodes';
        relatedNodes.appendChild(relatedTitle);
        
        const relatedList = document.createElement('ul');
        relatedList.className = 'related-list';
        
        connections.forEach(conn => {
            const relatedNode = conn.source.id === node.id ? conn.target : conn.source;
            const listItem = document.createElement('li');
            const nodeIndicator = document.createElement('span');
            nodeIndicator.className = 'node-indicator';
            nodeIndicator.style.backgroundColor = nodeColors[relatedNode.type];
            
            listItem.appendChild(nodeIndicator);
            listItem.appendChild(document.createTextNode(relatedNode.label));
            relatedList.appendChild(listItem);
        });
        
        relatedNodes.appendChild(relatedList);
    }
}

// Load example graph
function loadExampleGraph() {
    // Clear existing data
    graphNodes = [];
    graphLinks = [];
    
    // Add example nodes
    const nodeIds = {
        kg: addNode('concept', 'Knowledge Graph'),
        ai: addNode('concept', 'Artificial Intelligence'),
        ml: addNode('concept', 'Machine Learning'),
        nlp: addNode('concept', 'Natural Language Processing'),
        papers: addNode('resource', 'Research Papers'),
        datasets: addNode('resource', 'Datasets Repository'),
        quantum: addNode('question', 'Quantum Computing Applications'),
        ethics: addNode('question', 'AI Ethics Considerations'),
        research: addNode('project', 'Collaborative Research'),
        application: addNode('project', 'Industry Applications')
    };
    
    // Add example edges
    addEdge(nodeIds.kg, nodeIds.ai);
    addEdge(nodeIds.kg, nodeIds.papers);
    addEdge(nodeIds.kg, nodeIds.research);
    addEdge(nodeIds.ai, nodeIds.ml);
    addEdge(nodeIds.ai, nodeIds.nlp);
    addEdge(nodeIds.ai, nodeIds.ethics);
    addEdge(nodeIds.ml, nodeIds.datasets);
    addEdge(nodeIds.ml, nodeIds.application);
    addEdge(nodeIds.nlp, nodeIds.application);
    addEdge(nodeIds.papers, nodeIds.quantum);
    addEdge(nodeIds.research, nodeIds.quantum);
    addEdge(nodeIds.research, nodeIds.ethics);
    
    // Update the visualization
    if (svg) {
        svg.selectAll('*').remove();
        updateGraph();
    }
}

// Reset the graph
function resetGraph() {
    graphNodes = [];
    graphLinks = [];
    
    // Update node selection dropdowns
    updateNodeSelections();
    
    // If the visualization is already initialized, update it
    if (svg) {
        svg.selectAll('*').remove();
        updateGraph();
    }
}

// Initialize all graph visualizations
function initAllGraphs() {
    initHeroGraph();
    initInteractiveGraph();
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', initAllGraphs);

// Event listeners for graph controls
document.addEventListener('DOMContentLoaded', () => {
    const addNodeBtn = document.getElementById('add-node');
    const addEdgeBtn = document.getElementById('add-edge');
    const resetGraphBtn = document.getElementById('reset-graph');
    const loadExampleBtn = document.getElementById('load-example');
    
    if (addNodeBtn) {
        addNodeBtn.addEventListener('click', () => {
            const nodeType = document.getElementById('node-type').value;
            const nodeTitle = document.getElementById('node-title').value.trim();
            
            if (nodeTitle) {
                addNode(nodeType, nodeTitle);
                document.getElementById('node-title').value = '';
                
                // Show confirmation toast
                showToast(`Added "${nodeTitle}" node to the graph`);
            }
        });
    }
    
    if (addEdgeBtn) {
        addEdgeBtn.addEventListener('click', () => {
            const sourceId = document.getElementById('source-node').value;
            const targetId = document.getElementById('target-node').value;
            
            if (sourceId && targetId && sourceId !== targetId) {
                const added = addEdge(sourceId, targetId);
                
                if (added) {
                    // Show confirmation toast
                    const sourceName = graphNodes.find(n => n.id === sourceId).label;
                    const targetName = graphNodes.find(n => n.id === targetId).label;
                    showToast(`Connected "${sourceName}" to "${targetName}"`);
                } else {
                    // Show error toast
                    showToast('Connection already exists or is invalid', 'error');
                }
            } else if (sourceId === targetId) {
                showToast('Cannot connect a node to itself', 'error');
            }
        });
    }
    
    if (resetGraphBtn) {
        resetGraphBtn.addEventListener('click', () => {
            resetGraph();
            showToast('Graph reset successfully');
        });
    }
    
    if (loadExampleBtn) {
        loadExampleBtn.addEventListener('click', () => {
            loadExampleGraph();
            showToast('Example graph loaded');
        });
    }
});

// Helper function to show toast notifications
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
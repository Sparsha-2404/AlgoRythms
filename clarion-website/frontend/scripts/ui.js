// UI helper functions for CLARION website

// Initialize UI components
function initUI() {
    // Create animation for the How It Works section
    createWorkflowAnimation();
}

// Create the workflow animation in the How It Works section
function createWorkflowAnimation() {
    const animationContainer = document.querySelector('.workflow-animation');
    
    if (!animationContainer) return;
    
    // Create SVG element for the animation
    const svg = d3.select('.workflow-animation')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', '0 0 800 400');
    
    // Add gradient definitions
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
        .attr('id', 'workflow-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%');
    
    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#2563eb');
    
    gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#8b5cf6');
    
    // Create nodes for the animation
    const nodes = [
        { id: 'node1', x: 150, y: 100, radius: 40, label: 'Create' },
        { id: 'node2', x: 400, y: 100, radius: 40, label: 'Connect' },
        { id: 'node3', x: 650, y: 100, radius: 40, label: 'Discover' },
        { id: 'node4', x: 400, y: 300, radius: 40, label: 'Collaborate' },
    ];
    
    // Create links between nodes
    const links = [
        { source: 'node1', target: 'node2' },
        { source: 'node2', target: 'node3' },
        { source: 'node3', target: 'node4' },
        { source: 'node4', target: 'node1' },
    ];
    
    // Draw the links
    svg.selectAll('.workflow-link')
        .data(links)
        .enter()
        .append('path')
        .attr('class', 'workflow-link')
        .attr('d', d => {
            const sourceNode = nodes.find(node => node.id === d.source);
            const targetNode = nodes.find(node => node.id === d.target);
            
            // Create a curved path between nodes
            if ((d.source === 'node3' && d.target === 'node4') || 
                (d.source === 'node4' && d.target === 'node1')) {
                return `M${sourceNode.x},${sourceNode.y} 
                        Q${(sourceNode.x + targetNode.x) / 2},${(sourceNode.y + targetNode.y) / 2 + 80} 
                        ${targetNode.x},${targetNode.y}`;
            } else {
                return `M${sourceNode.x},${sourceNode.y} 
                        Q${(sourceNode.x + targetNode.x) / 2},${(sourceNode.y + targetNode.y) / 2 - 40} 
                        ${targetNode.x},${targetNode.y}`;
            }
        })
        .attr('fill', 'none')
        .attr('stroke', 'url(#workflow-gradient)')
        .attr('stroke-width', 3)
        .attr('opacity', 0.7);
    
    // Draw the nodes
    const nodeGroups = svg.selectAll('.workflow-node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'workflow-node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    
    // Add node circles
    nodeGroups.append('circle')
        .attr('r', d => d.radius)
        .attr('fill', 'white')
        .attr('stroke', 'url(#workflow-gradient)')
        .attr('stroke-width', 3);
    
    // Add node labels
    nodeGroups.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.3em')
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .text(d => d.label);
    
    // Create animation loops
    animateWorkflow();
    
    function animateWorkflow() {
        // Animate links
        svg.selectAll('.workflow-link')
            .attr('stroke-dasharray', '10,5')
            .attr('stroke-dashoffset', 0)
            .transition()
            .duration(15000)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', -300)
            .on('end', function() {
                d3.select(this)
                    .attr('stroke-dashoffset', 0)
                    .transition()
                    .duration(15000)
                    .ease(d3.easeLinear)
                    .attr('stroke-dashoffset', -300)
                    .on('end', function() {
                        animateWorkflow();
                    });
            });
        
        // Pulse animation for nodes
        nodeGroups.selectAll('circle')
            .transition()
            .duration(2000)
            .attr('r', d => d.radius * 1.1)
            .transition()
            .duration(2000)
            .attr('r', d => d.radius)
            .on('end', function(d) {
                d3.select(this)
                    .transition()
                    .duration(2000)
                    .attr('r', d.radius * 1.1)
                    .transition()
                    .duration(2000)
                    .attr('r', d.radius);
            });
    }
}

// Modal handling functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}

// Toast notification function
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type);
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
// Global scripts for Kortex application

// Add any global utility functions here

console.log('Kortex application loaded');

// Knowledge Selector Functions
function toggleKnowledgeSelector() {
    const panel = document.getElementById('knowledgeSelectorPanel');
    const button = document.getElementById('knowledgeSelectorBtn');
    
    if (panel && button) {
        const isOpen = panel.classList.contains('open');
        
        if (isOpen) {
            panel.classList.remove('open');
            button.classList.remove('open');
        } else {
            panel.classList.add('open');
            button.classList.add('open');
        }
    }
}

function selectKnowledge(element) {
    // Remove selected class from all options
    const allOptions = document.querySelectorAll('.knowledge-option');
    allOptions.forEach(opt => opt.classList.remove('selected'));
    
    // Add selected class to clicked option
    element.classList.add('selected');
    
    // Update the button text
    const knowledgeName = element.querySelector('.knowledge-option-name').textContent;
    const selectedText = document.getElementById('selectedKnowledgeText');
    if (selectedText) {
        selectedText.textContent = knowledgeName;
    }
    
    // Close the panel
    toggleKnowledgeSelector();
    
    console.log('Selected knowledge base:', element.dataset.knowledge);
}

// Close knowledge selector when clicking outside
document.addEventListener('click', function(event) {
    const panel = document.getElementById('knowledgeSelectorPanel');
    const button = document.getElementById('knowledgeSelectorBtn');
    
    if (panel && button && panel.classList.contains('open')) {
        if (!panel.contains(event.target) && !button.contains(event.target)) {
            panel.classList.remove('open');
            button.classList.remove('open');
        }
    }
});

// Tools Sidebar Functions
function filterTools(searchTerm) {
    const term = searchTerm.toLowerCase();
    const serverSections = document.querySelectorAll('.mcp-server-section');
    const noResults = document.getElementById('toolsNoResults');
    let hasVisibleServers = false;

    serverSections.forEach(section => {
        const serverName = section.querySelector('.mcp-server-name')?.textContent.toLowerCase() || '';
        const serverDesc = section.querySelector('.mcp-server-desc')?.textContent.toLowerCase() || '';
        const toolItems = section.querySelectorAll('.tool-item');
        
        let serverMatches = serverName.includes(term) || serverDesc.includes(term);
        let hasVisibleTools = false;

        toolItems.forEach(toolItem => {
            const toolName = toolItem.querySelector('.tool-name')?.textContent.toLowerCase() || '';
            const toolDesc = toolItem.querySelector('.tool-description')?.textContent.toLowerCase() || '';
            
            const toolMatches = toolName.includes(term) || toolDesc.includes(term);
            
            if (term === '' || toolMatches || serverMatches) {
                toolItem.style.display = 'flex';
                hasVisibleTools = true;
            } else {
                toolItem.style.display = 'none';
            }
        });

        if (term === '' || serverMatches || hasVisibleTools) {
            section.style.display = 'block';
            hasVisibleServers = true;
        } else {
            section.style.display = 'none';
        }
    });

    // Show/hide no results message
    if (noResults) {
        noResults.style.display = hasVisibleServers ? 'none' : 'block';
    }
}

function toggleAutoSelect(checkbox) {
    if (checkbox.checked) {
        console.log('Auto-select enabled: Tools will be automatically selected based on context');
        // In a real implementation, this would integrate with AI to auto-select relevant tools
    } else {
        console.log('Auto-select disabled');
    }
}


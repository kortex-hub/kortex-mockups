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


# kortex-mockups

This repository is dedicated for live prototyping and UX explorations for Kortex.


## 📁 Directory Structure

```
kortex-mockups/
├── index.html                  # Landing page with welcome screen
├── README.md                   # Project documentation
│
├── assets/                     # Shared resources
│   ├── css/
│   │   └── styles.css         # Global stylesheet (all UI styles)
│   ├── js/
│   │   └── scripts.js         # Shared JavaScript functions
│   └── images/                # Shared images and icons
│
├── shared/                     # Shared components
│   └── components/
│       └── sidebar.html       # Reusable navigation sidebar (reference)
│
├── chat/                       # Chat section
│   └── index.html             # Chat interface with AI conversations
│
├── knowledges/                 # Knowledge bases section (RAG)
│   ├── index.html             # Knowledge bases list view
│   └── details.html           # Knowledge base details view
│
├── mcp/                        # MCP servers section
│   └── index.html             # MCP servers interface (placeholder)
│
├── flows/                      # Flows section
│   └── index.html             # Workflow orchestration (placeholder)
│
├── extensions/                 # Extensions section
│   └── index.html             # Extensions marketplace (placeholder)
│
└── settings/                   # Settings section
    └── index.html             # Application settings (placeholder)
```

## 🚀 Getting Started

1. Open `index.html` in a web browser to see the welcome screen
2. Navigate to different sections using:
   - Sidebar navigation (consistent across all pages)
   - Welcome screen navigation cards
3. Each section maintains:
   - Consistent left sidebar navigation
   - Active state highlighting (gray background + purple left border)
   - Hover states (purple background)
   - Shared styling from `assets/css/styles.css`
  

# Multi-Server MCP Architecture

The following diagram illustrates the communication flow of our cross-platform triage agent:

```mermaid
graph TD
    User(["Developer User"]) <--> UI["ADK Web Interface"]
    UI <--> Agent{"Triage Agent<br>(Gemini 3.0 Flash)"}
    
    subgraph Local Runtime
        Agent
    end
    
    subgraph External MCP Interface
        GH_MCP["GitHub Remote MCP Server<br>(Read-Only headers)"]
        LIN_MCP["Linear MCP Server<br>(Filtered Tools config)"]
    end
    
    Agent <-- "MCP Protocol" --> GH_MCP
    Agent <-- "MCP Protocol" --> LIN_MCP
    
    GH_MCP -. "GitHub REST API<br>(Github Token)" .-> GitHub[("GitHub Repository")]
    LIN_MCP -. "Linear GraphQL API<br>(Personal API Key)" .-> Linear[("Linear Workspace")]
    
    classDef runtime fill:#BBDEFB,stroke:#0D47A1,stroke-width:2px;
    classDef mcp fill:#E1BEE7,stroke:#4A148C,stroke-width:2px;
    classDef target fill:#C8E6C9,stroke:#1B5E20,stroke-width:2px;
    classDef user fill:#FFE0B2,stroke:#E65100,stroke-width:2px;
    
    class Agent runtime;
    class GH_MCP,LIN_MCP mcp;
    class GitHub,Linear target;
    class User user;
```

## Communication Flow

1. **User Input:** The developer provides a prompt containing the Linear Bug ID and the target repository to the Triage Agent via the ADK Interface.
2. **Context Resolution:** The Agent formulates a tool call over the standard Model Context Protocol (MCP) stream boundary to the `Linear MCP Server`. 
3. **Extraction:** The Linear Server fetches the live ticket via GraphQL and returns the text body back to the Agent.
4. **Cross-Reference:** The Agent extracts keywords from the ticket response and immediately submits a second, distinct set of MCP tool calls to the `GitHub Remote MCP Server`.
5. **Diff Analysis:** The GitHub Server leverages the GitHub REST API (constrained by read-only headers from the Agent's initial connection negotiation) to locate and download the source diff.
6. **Synthesis:** The Agent synthesizes both datastreams into a single summarized markdown table for the User.

# **Main idea of the demo**

Creating a new agent that we will deploy to openshift  
The agent to be deployed could be:  
**An automatic documentation updater**: Each time a new feature is added, it automatically checks if there are adjustments to be made on the project documentation. 

# **Prioritization Principle: CLI Workflow \+ desktop as control plane**

We focus on the CLI experience for usage of the coding agent. Users will go to their terminal and say "kdn workspace start" and then it will start the agent and that’s where the interaction will happen.

In the desktop app, we focus on installation of all dependencies and configuration of the different settings (Filesystem, network, tokens). 

**Why?**  
Story will be easier to tell and deliver, match current usage:  
“You install and wire things up once in the app and then you can do real work where you are already working today: the terminal”.

A `kdn workspace start` with a “reliable” sandbox is a complete loop for power users. If the UI is incomplete, that will be easier to forget and say that it is planned.

The value the desktop app will provide will already be there. Configuring env variables, tokens… could easily be a nightmare. The UI will make this simple.

# **Installation**

I’m starting from a fresh environment. Nothing was ever installed on my laptop.  
I’m going to [openkaiden.ai](http://openkaiden.ai)  and I’m finding the link to download the binary for my platform (in a similar fashion than on podman-desktop.io) 

Once downloaded, I have an installer that I can use for my OS. I’m starting the installation procedure.  
As part of the procedure, I’ll be installing the different extensions that Kaiden needs:

- **CLI Tools**  
  - Kaiden CLI  
  - Other (to be determined later)  
- **Credential Vault Provider**  
  - onecli  
- **Sandboxing Provider**  
  - Krunai ???  
- **Coding Agent Tools**  
  - OpenCode  
  - Claude  
- **LLM Provider**  
  - Ramalama  
  - Ollama  
  - VertX (so user internal to Red Hat can use it)  
  - OpenShift AI  
- **Skills in the Catalog**  
  - Hummingbird Skills  
- **MCP Server in the Catalog**  
  - OpenShift MCP  
- **Other tools**  
  - Semantic Router (important as key differentiator)

For the configuration of the different tools, we will be using the default onboarding sequence from Podman Desktop, with the guided steps.

Once, the installation is complete. Kaiden opens on the screen to get started creating agents.

# **Demo Environment**

- Full local, OpenCode, with a model running with Intel OpenVino llamacpp backend  
- Remote/bridged with a Coding Agent that is remote: Claude Code

# **Creating a “Project”**

For the user to be able to work on a project, in Kaiden the user will configure a new project as well as the different settings. We will be providing options so that the user can configure the following:

* The user has to provide a name, once the name is created, the user can go into the different project’s settings screen. To configure:   
  * What is the filesystem that the project can be using  
  * What network policies it has  
    * Deny Mode  
      * In this case, the user will have the ability to configure a set of hosts that are allowed  
      * Blocked addresses  
    * Access to everything  
  * Secrets and Tokens  
    * Project scope tokens  
      * For instance, the user will be able to configure a token for github, specifically for this project.  
  * Git Worktree policies

`CLI Experience`

# **Working with an Agent**

As a user of Kaiden, I use the coding agent from the **terminal** after the desktop app has configured the project and policies.

From **Projects** (policies already defined) and the **CLI** entry points, I can **bind** a coding agent to a project and choose the **agent runtime** (e.g. OpenCode locally or Claude Code when using the remote/bridged demo path).

When I click **Start**, Kaiden does **not** open a full in-app chat as the primary experience. Instead, the app shows **CLI next steps**: the exact command to run (e.g. `kdn workspace start` with the right project context), optional **copy to clipboard**, and **high-level status** (workspace starting, running, stopped, waiting for input **in the terminal**). Any detailed transcript or tool output lives in the terminal session.

# **Showing Sandboxing capability**

In order to show the sandboxing capabilities, we would like to highlight the following:

- Trying to reach the host system. Showing that it is not possible.  
- Trying to reach forbidden domains  
  - Showcasing an alert is raised in the UI, with allow/deny possibility.

# **Semantic routing flow**

I have an extension that is installed for the “Semantic Model Routing”.  
I can configure which **local models** are available to the Semantic Router (eligible backends for routing decisions).

When I create or start a workspace from the CLI, requests can be **classified and routed** to the appropriate local (or configured) model according to that policy—without requiring a separate in-app chat for the core loop.

# **Deploy DGX Spark**

*(Placeholder — see Out of Scope.)*

# **Deploy my agent on OpenShift**

*(Placeholder — see Out of Scope.)*

# **Upgrades**

*(Placeholder — see Out of Scope.)*

# **List of Taks**

**—- Default technical / architecture**

- Renaming CLI   
- Installer Desktop \+ CLI  
- Onboarding

**—- Sandboxing Mechanism**

- Philippe’s  
- krunAI  
- Devaipod ?   
- Multiple mechanism

**—- Credential Vaulting**

- [https://www.onecli.sh/](https://www.onecli.sh/) 

**—- Local LLM**

- Intel  
- Model hosted on OpenShift AI

**—- Deploy Story**

- Deploy of an agent running on DGX Spark  
- Deploy to OpenShift  
- Humminbird Skills   
- MCP OpenShift

**—- Project structure**

- Readme  
- Website  
- Documentation  
- [https://github.com/packit/ai-workflows?tab=readme-ov-file](https://github.com/packit/ai-workflows?tab=readme-ov-file) 

# **Out of Scope for this sprint**

- **Deploy DGX Spark** — no mockup or product surface required beyond placeholder headings.  
- **Deploy my agent on OpenShift** — same; long-term deploy story only.  
- **Upgrades** — installer/upgrade UX not part of this sprint’s demo.  
- **Full in-app agent chat** as the primary interaction model (replaced by CLI handoff per prioritization principle).  
- End-to-end **CI/CD**, unrelated **cost accounting**, and **flows** UI unless needed only as legacy navigation stubs.

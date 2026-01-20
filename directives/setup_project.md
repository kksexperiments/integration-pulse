# SOP: Setup Project & Architecture

## Goal
Instantiate and maintain the 3-layer architecture for the HR Analytics project to ensure reliability and scalability.

## Input
- `agents.md` (for core principles)
- Project requirements for HR Analytics

## Orchestration Flow
1. **Initialize Project**: Ensure `directives/`, `execution/`, and `.tmp/` directories exist.
2. **Setup Environment**: Populate `.env` with required API keys and install dependencies from `requirements.txt`.
3. **Define Directives**: For every major task, create a new SOP in `directives/`.
4. **Develop Scripts**: Implement deterministic logic in Python scripts within `execution/`.
5. **Manage Data**: Use `.tmp/` for intermediate data and cloud services for final deliverables.

## Execution Tools
- `mkdir` for directory creation.
- `pip install -r requirements.txt` for dependencies.
- `touch` or your writing tools for directive and script creation.

## Edge Cases
- **Missing API Keys**: The orchestration layer (you) must check `.env` before running execution scripts.
- **Dependency Conflicts**: Ensure `requirements.txt` is updated when new libraries are added.

## Summary
This directive establishes the baseline for how the project should be managed using the 3-layer architecture. Update this document as the system evolves.

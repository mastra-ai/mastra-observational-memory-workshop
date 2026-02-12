# Observational Memory Workshop

Workshop materials for building AI agents with Observational Memory using [Mastra](https://mastra.ai).

## Workshop Info

**Date**: February 12, 2026  
**Duration**: 1 hour  

## What You'll Learn

- **The Problem**: Why RAG and traditional memory systems struggle with long-context agents
- **How OM Works**: Observer + Reflector architecture, compression, prompt caching
- **Hands-On**: Building agents with Observational Memory
- **Benchmarks**: How OM achieves SOTA on LongMemEval (84.2% gpt-4o, 94.9% gpt-5-mini)

## Prerequisites

- Node.js v20+ installed
- OpenAI API key (or other supported provider)

## Quick Start

1. Install all examples at once:

```bash
pnpm install
```

2. Pick an example and add your API key:

```bash
cd examples/01-code-research-agent
cp .env.example .env
# Add your OpenAI API key to .env
```

3. Run it:

```bash
pnpm dev
```

## Workshop Examples

### [01-code-research-agent](./examples/01-code-research-agent)

A coding agent that explores codebases:

- Reads files, runs commands, greps for patterns
- Tool output is verbose (file contents, command output)
- OM compresses findings, drops raw text

### [02-playwright-agent](./examples/02-playwright-agent)

Browser automation with Playwright MCP:

- Navigates real websites, clicks elements, reads content
- DOM snapshots and accessibility trees generate massive context
- OM compresses massive tool output into concise observations

## Slides

The [slides](./slides) directory contains the interactive workshop presentation. Open `slides/index.html` in a browser.

## Key Concepts

### Observational Memory

Two background agents manage your agent's memory:

- **Observer**: Compresses messages into dense observations when they hit 30k tokens
- **Reflector**: Restructures observations when they hit 40k tokens

Your agent never queries or writes to memory — it just sees observations in context.

### Why It Works

1. **Stable context window** → Prompt caching works (4-10x cost savings)
2. **Event-based compression** → Preserves decisions, not just summaries
3. **No retrieval** → No noise from irrelevant results

### Compression Rates

- Text conversations: 3-6x
- Tool-heavy workloads: 5-40x

## Resources

- [Documentation](https://mastra.ai/docs/memory/observational-memory)
- [Blog Post](https://mastra.ai/blog/observational-memory)
- [Research Page](https://mastra.ai/research/observational-memory)
- [VentureBeat Article](https://venturebeat.com/data/observational-memory-cuts-ai-agent-costs-10x-and-outscores-rag-on-long)
- [GitHub](https://github.com/mastra-ai/mastra)

## Get Help

- **Discord**: [Join our community](https://discord.gg/BTYqqHKUrf)
- **Twitter**: [@mastra](https://twitter.com/mastra)

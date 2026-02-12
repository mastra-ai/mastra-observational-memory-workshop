# Example 1: Basic Observational Memory

The simplest way to add Observational Memory to a Mastra agent.

## What You'll Learn

- Enabling OM with a single config flag
- How the Observer creates observations from messages
- The observation log format (dated, prioritized entries)
- Watching compression happen in real-time

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Copy the environment file:
```bash
cp .env.example .env
```

3. Add your OpenAI API key to `.env`

## Running the Example

```bash
pnpm dev
```

This opens Mastra Studio in your browser. You'll see:
- The agent in the sidebar
- A chat interface to interact with it
- **Progress indicators** when the Observer/Reflector run
- The observation log in the memory panel

## How It Works

### Minimal Configuration

```typescript
import { Memory } from '@mastra/memory';
import { Agent } from '@mastra/core/agent';

const memory = new Memory({
  storage,
  options: {
    lastMessages: 10,
    observationalMemory: true,  // That's it!
  }
});

const agent = new Agent({
  name: 'my-agent',
  model: 'openai/gpt-4o',
  memory,
});
```

### What Happens

1. You chat with the agent normally
2. Messages accumulate in the context window
3. When messages hit 30k tokens, the Observer compresses them into observations
4. The original messages are replaced with dense observations
5. Your agent keeps working — it sees the observations in context automatically

### The Observation Format

Observations look like this in the agent's context:

```
## 2026-02-10

### Project Discussion
🔴 User wants to build a browser automation agent
🟡 Discussed using Playwright MCP for web interactions
⚪ Mentioned preference for TypeScript

### Technical Decisions  
🔴 Chose gpt-4o as the main model
🟡 Will use observational memory for long sessions
```

- **Dates** anchor events in time
- **Emoji priorities**: 🔴 critical, 🟡 important, ⚪ info
- **Grouped by topic** for easy scanning

## Next Steps

- Try sending many messages to trigger observation
- Look at the raw observations in Mastra Studio (`pnpm mastra dev`)
- Move on to [02-compression-demo](../02-compression-demo) to see token savings

# Example 4: Practical Agent with Observational Memory

Build a real-world agent that maintains memory across long sessions.

## What You'll Learn

- Production-ready OM configuration
- Viewing observations in Mastra Studio
- Resource-scoped memory for cross-session persistence
- Combining OM with tools for a complete agent

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

Opens Mastra Studio where you can:
- Chat with the project assistant
- See the **observation log** in the memory panel
- Watch **Observer/Reflector progress** indicators
- Inspect memory state across sessions

## The Agent

This example creates a "Project Assistant" that helps you manage projects:

- Remembers project details across sessions
- Tracks decisions and action items
- Maintains context about team members
- Uses tools to search and organize

## Configuration

```typescript
const memory = new Memory({
  storage,
  options: {
    lastMessages: 20,
    observationalMemory: {
      enabled: true,
      // Use resource scope for cross-session memory
      scope: 'resource',
      observation: {
        messageTokens: 30_000,  // Observer triggers at 30k tokens
        model: 'google/gemini-2.5-flash',  // Fast, cheap observer
      },
      reflection: {
        observationTokens: 40_000,  // Reflector triggers at 40k tokens
        model: 'google/gemini-2.5-flash',
      },
    },
  },
});
```

## Key Patterns

### Resource Scope

Using `scope: 'resource'` means observations persist across all threads for a user:

```typescript
// Session 1
await agent.generate("My project deadline is March 15", {
  threadId: 'session-1',
  resourceId: 'user-123',
});

// Session 2 (new thread, same user)
await agent.generate("When is my deadline?", {
  threadId: 'session-2',
  resourceId: 'user-123',  // Same resourceId = same memory
});
// Agent remembers: "March 15"
```

### Viewing Observations

In Mastra Studio, you can see the raw observation log:

```
## 2026-02-10

### Project: Website Redesign
🔴 Deadline: March 15, 2026
🔴 Blocker: Waiting on design assets from Sarah
🟡 Stack: Next.js, Tailwind, Vercel
🟡 Team: Tyler (lead), Sarah (design), Mike (backend)

### Decisions
🟡 Chose Vercel over AWS for simpler deployment
🟡 Using Tailwind instead of custom CSS
⚪ Considered but rejected: GraphQL (REST is simpler for this project)
```

### Prompt Caching Benefits

Because OM keeps a stable context window:
- Every turn gets a cache hit (until observation runs)
- 4-10x cost reduction vs uncached prompts
- Faster response times

## Next Steps

- Deploy this agent to production
- Add more tools (calendar, email, etc.)
- Experiment with different Observer/Reflector models
- Read the [full documentation](https://mastra.ai/docs/memory/observational-memory)

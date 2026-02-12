# Example 2: Compression Demo

See Observational Memory compression in action with real token counts.

## What You'll Learn

- How much compression OM achieves (3-6x for text, 5-40x for tool calls)
- Before/after token counts
- Why tool-heavy workloads compress better
- The difference between Observer and Reflector compression

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

This opens Mastra Studio with two agents:

1. **text-agent** — For text-heavy conversations (3-6x compression)
2. **tools-agent** — Has search/weather tools that generate verbose output (5-40x compression)

Chat with each agent and watch:
- The **progress indicator** when Observer runs
- The **token counts** before and after compression
- The **observation log** in the memory panel

## How Compression Works

### Observer (30k token threshold)

When unobserved messages hit ~30k tokens:

1. Observer agent reads the messages
2. Creates dated, prioritized observations
3. Original messages are dropped
4. Observations are appended to the observation block

**Text conversations**: ~6x compression (30k → 5k tokens)
**Tool-heavy workloads**: ~20-40x compression (30k → 750-1500 tokens)

### Reflector (40k token threshold)

When observations hit ~40k tokens:

1. Reflector agent reads all observations
2. Restructures and condenses them
3. Combines related items
4. Removes superseded information

This is less frequent but provides additional compression.

## Why Tool Calls Compress Better

Tool calls are full of "context rot" — verbose JSON schemas, repeated parameter structures, implementation details that don't matter for future decisions.

Example tool call (verbose):
```json
{
  "tool": "search_web",
  "parameters": {
    "query": "best restaurants in SF",
    "max_results": 10,
    "include_snippets": true
  },
  "result": {
    "status": "success",
    "results": [...]
  }
}
```

Observed as:
```
🟡 Searched for "best restaurants in SF", found 10 results
```

The decision is preserved. The noise is gone.

## Token Counting

The demo shows:
- **Raw messages**: Total tokens before observation
- **Observations**: Tokens after compression
- **Compression ratio**: How much smaller

## Next Steps

- Try the LongMemEval comparison in [03-longmemeval-comparison](../03-longmemeval-comparison)
- See how this affects costs with prompt caching

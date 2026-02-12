import { Mastra } from '@mastra/core/mastra';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { MCPClient } from '@mastra/mcp';
import { LibSQLStore } from '@mastra/libsql';

const storage = new LibSQLStore({
  url: 'file:./data/memory.db',
});

const memory = new Memory({
  storage,
  options: {
    lastMessages: 20,
    observationalMemory: {
      enabled: true,
      observation: {
        // Lower threshold for demo (normally 30k)
        messageTokens: 5000,
      },
    },
  },
});

// Connect to the Playwright MCP server
const mcp = new MCPClient({
  id: 'playwright-mcp',
  servers: {
    playwright: {
      command: 'npx',
      args: ['-y', '@playwright/mcp@latest'],
    },
  },
});

const playwrightAgent = new Agent({
  name: 'playwright-agent',
  instructions: `You are a browser automation agent. You can navigate the web, interact with pages, fill forms, click buttons, and extract information using Playwright.

When given a task:
1. Navigate to the relevant page
2. Interact with elements as needed
3. Extract and report the information found

Be thorough but concise in your responses.`,
  model: 'openai/gpt-4o',
  memory,
  tools: await mcp.listTools(),
  defaultOptions: {
    maxSteps: 50,
  },
});

export const mastra = new Mastra({
  agents: { 'playwright-agent': playwrightAgent },
});

import { Mastra } from '@mastra/core/mastra';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';

// Setup storage
const storage = new LibSQLStore({
  url: 'file:./data/memory.db',
});

// Setup memory with Observational Memory enabled
const memory = new Memory({
  storage,
  options: {
    lastMessages: 10,
    observationalMemory: true, // Enable OM with a single flag!
  },
});

// Create the agent
const agent = new Agent({
  name: 'assistant',
  instructions: `You are a helpful assistant. Have natural conversations and help the user with whatever they need.`,
  model: 'openai/gpt-4o',
  memory,
});

// Register with Mastra and export for Studio
export const mastra = new Mastra({
  agents: { assistant: agent },
});

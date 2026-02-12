import { Mastra } from '@mastra/core/mastra';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// Setup storage
const storage = new LibSQLStore({
  url: 'file:./data/memory.db',
});

// Setup memory with full OM configuration
const memory = new Memory({
  storage,
  options: {
    lastMessages: 20,
    observationalMemory: {
      enabled: true,
      scope: 'resource', // Persist across sessions
      observation: {
        messageTokens: 30_000,
        model: 'google/gemini-2.5-flash',
      },
      reflection: {
        observationTokens: 40_000,
        model: 'google/gemini-2.5-flash',
      },
    },
  },
});

// Create useful tools
const addTask = createTool({
  id: 'add_task',
  description: 'Add a task to the project backlog',
  inputSchema: z.object({
    title: z.string(),
    priority: z.enum(['high', 'medium', 'low']),
    assignee: z.string().optional(),
  }),
  execute: async ({ context }) => {
    return { success: true, taskId: `task-${Date.now()}`, title: context.title };
  },
});

const searchNotes = createTool({
  id: 'search_notes',
  description: 'Search through project notes and documentation',
  inputSchema: z.object({
    query: z.string(),
  }),
  execute: async ({ context }) => {
    return {
      results: [
        { title: 'Project Kickoff Notes', snippet: `Found mention of "${context.query}"...` },
        { title: 'Technical Decisions', snippet: 'Related discussion from last week...' },
      ],
    };
  },
});

// Create the agent
const agent = new Agent({
  name: 'project-assistant',
  instructions: `You are a helpful project assistant. You help users manage their projects, track decisions, and stay organized.

Key behaviors:
- Remember project details, deadlines, and team members
- Track decisions and the reasoning behind them
- Help prioritize tasks and identify blockers
- Reference past conversations naturally

Always be helpful and proactive about surfacing relevant context from memory.`,
  model: 'openai/gpt-4o',
  memory,
  tools: { addTask, searchNotes },
});

// Export for Mastra Studio
export const mastra = new Mastra({
  agents: { 'project-assistant': agent },
});

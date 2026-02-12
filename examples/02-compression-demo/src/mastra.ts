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

// Memory with lower threshold for demo (normally 30k)
const memory = new Memory({
  storage,
  options: {
    lastMessages: 100,
    observationalMemory: {
      enabled: true,
      observation: {
        messageTokens: 5000, // Lower for demo
      },
    },
  },
});

// Text-only agent for showing 3-6x compression
const textAgent = new Agent({
  name: 'text-agent',
  instructions: `You are a helpful assistant. Have detailed, informative conversations.
When asked about a topic, give thorough explanations with examples.`,
  model: 'openai/gpt-4o',
  memory,
});

// Tools that return verbose output
const searchWeb = createTool({
  id: 'search_web',
  description: 'Search the web for information',
  inputSchema: z.object({
    query: z.string(),
    maxResults: z.number().optional().default(10),
  }),
  execute: async ({ context }) => {
    const results = Array.from({ length: 10 }, (_, i) => ({
      title: `Result ${i + 1} for "${context.query}"`,
      url: `https://example.com/result-${i + 1}`,
      snippet: `This is a detailed snippet about ${context.query}. It contains lots of information that may or may not be relevant. The snippet continues with more context and details.`,
      metadata: {
        publishedDate: new Date().toISOString(),
        author: `Author ${i + 1}`,
        wordCount: Math.floor(Math.random() * 5000) + 1000,
      },
    }));
    return { results };
  },
});

const getWeather = createTool({
  id: 'get_weather',
  description: 'Get current weather for a location',
  inputSchema: z.object({
    location: z.string(),
  }),
  execute: async ({ context }) => ({
    location: context.location,
    current: {
      temperature: Math.floor(Math.random() * 30) + 50,
      humidity: Math.floor(Math.random() * 50) + 30,
      conditions: 'Partly cloudy',
      windSpeed: Math.floor(Math.random() * 20) + 5,
      pressure: 1013,
      visibility: 10,
    },
    forecast: Array.from({ length: 7 }, (_, i) => ({
      day: `Day ${i + 1}`,
      high: Math.floor(Math.random() * 20) + 60,
      low: Math.floor(Math.random() * 20) + 40,
      conditions: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
    })),
  }),
});

// Tool-heavy agent for showing 5-40x compression
const toolsAgent = new Agent({
  name: 'tools-agent',
  instructions: `You are a research assistant with web search and weather tools.
Always use your tools to gather information when asked about facts or current events.`,
  model: 'openai/gpt-4o',
  memory,
  tools: { searchWeb, getWeather },
});

// Export for Mastra Studio
export const mastra = new Mastra({
  agents: {
    'text-agent': textAgent,
    'tools-agent': toolsAgent,
  },
});

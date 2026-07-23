
// backend/ai/agent/llm.js
import OpenAI from "openai";
import memory from "./memory.js";
import createTaskTool from "../tools/createTask.js";
import searchTasksTool from "../tools/searchTasks.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const tools = [createTaskTool, searchTasksTool];

export async function aiAssistant(userMessage) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are an AI task assistant." },
      {
        role: "system",
        content: `User memory: ${JSON.stringify(memory.getAll())}`,
      },
      { role: "user", content: userMessage },
    ],
    tools,
    tool_choice: "auto",
  });

  // Simple: return the assistant’s main text
  const choice = response.choices[0];
  const msg = choice.message;

  // If tools were called, you can inspect msg.tool_calls here later
  return {
    output_text: msg.content,
  };
}

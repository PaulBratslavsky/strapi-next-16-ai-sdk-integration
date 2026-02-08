import type { Core } from "@strapi/strapi";
import type { UIMessage } from "ai";
import { convertToModelMessages } from "ai";
import { aiSDKManager, type StreamTextRawResult } from "../lib/init-ai-sdk";

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  async ask(prompt: string, options?: { system?: string }) {
    const result = await aiSDKManager.generateText(prompt, options);
    return result.text;
  },

  async askStream(prompt: string, options?: { system?: string }) {
    const result = await aiSDKManager.streamText(prompt, options);
    return result.textStream;
  },

  // ↓ New method
  async chat(messages: UIMessage[], options?: { system?: string }): Promise<StreamTextRawResult> {
    const modelMessages = await convertToModelMessages(messages);
    return aiSDKManager.streamRaw({
      messages: modelMessages,
      system: options?.system,
    });
  },

  isInitialized() {
    return aiSDKManager.isInitialized();
  },
});

export default service;
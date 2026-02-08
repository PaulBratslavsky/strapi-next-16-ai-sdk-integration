import { createAnthropic, type AnthropicProvider } from "@ai-sdk/anthropic";
import { generateText, streamText, type LanguageModel } from "ai";
import {
  CHAT_MODELS,
  DEFAULT_MODEL,
  DEFAULT_TEMPERATURE,
  isPromptInput,
  type PluginConfig,
  type ChatModelName,
  type GenerateInput,
} from "./types";

export interface StreamTextRawResult {
  readonly textStream: AsyncIterable<string>;
  toUIMessageStreamResponse(): Response;
}

class AISDKManager {
  private provider: AnthropicProvider | null = null;
  private model: ChatModelName = DEFAULT_MODEL;

  initialize(config: unknown): boolean {
    const cfg = config as Partial<PluginConfig> | undefined;

    if (!cfg?.anthropicApiKey) {
      return false;
    }

    this.provider = createAnthropic({
      apiKey: cfg.anthropicApiKey,
      baseURL: cfg.baseURL,
    });

    if (cfg.chatModel && CHAT_MODELS.includes(cfg.chatModel)) {
      this.model = cfg.chatModel;
    }

    return true;
  }

  private getLanguageModel(): LanguageModel {
    if (!this.provider) {
      throw new Error("AI SDK Manager not initialized");
    }
    return this.provider(this.model);
  }

  // ↓ New method
  private buildParams(input: GenerateInput) {
    const base = {
      model: this.getLanguageModel(),
      system: input.system,
      temperature: input.temperature ?? DEFAULT_TEMPERATURE,
      maxOutputTokens: input.maxOutputTokens,
    };

    return isPromptInput(input)
      ? { ...base, prompt: input.prompt }
      : { ...base, messages: input.messages };
  }

  async generateText(prompt: string, options?: { system?: string }) {
    const result = await generateText({
      model: this.getLanguageModel(),
      prompt,
      system: options?.system,
    });
    return { text: result.text };
  }

  async streamText(prompt: string, options?: { system?: string }) {
    const result = streamText({
      model: this.getLanguageModel(),
      prompt,
      system: options?.system,
    });
    return { textStream: result.textStream };
  }

  // ↓ New method
  streamRaw(input: GenerateInput): StreamTextRawResult {
    return streamText(this.buildParams(input)) as StreamTextRawResult;
  }

  getChatModel(): ChatModelName {
    return this.model;
  }

  isInitialized(): boolean {
    return this.provider !== null;
  }
}

export const aiSDKManager = new AISDKManager();
import type { Core } from "@strapi/strapi";
import type { Context } from "koa";
import { Readable } from "node:stream";
import { createSSEStream, writeSSE } from "../lib/utils";

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async ask(ctx: Context) {
    const { prompt, system } = (ctx.request as any).body as {
      prompt?: string;
      system?: string;
    };

    if (!prompt || typeof prompt !== "string") {
      ctx.badRequest("prompt is required and must be a string");
      return;
    }

    const service = strapi.plugin("ai-sdk").service("service");
    if (!service.isInitialized()) {
      ctx.badRequest("AI SDK not initialized");
      return;
    }

    const result = await service.ask(prompt, { system });
    ctx.body = { data: { text: result } };
  },

  async askStream(ctx: Context) {
    const { prompt, system } = (ctx.request as any).body as {
      prompt?: string;
      system?: string;
    };

    if (!prompt || typeof prompt !== "string") {
      ctx.badRequest("prompt is required");
      return;
    }

    const service = strapi.plugin("ai-sdk").service("service");
    if (!service.isInitialized()) {
      ctx.badRequest("AI SDK not initialized");
      return;
    }

    const textStream = await service.askStream(prompt, { system });
    const stream = createSSEStream(ctx);

    void (async () => {
      try {
        for await (const chunk of textStream) {
          writeSSE(stream, { text: chunk });
        }
        stream.write("data: [DONE]\n\n");
      } catch (error) {
        strapi.log.error("AI SDK stream error:", error);
        writeSSE(stream, { error: "Stream error" });
      } finally {
        stream.end();
      }
    })();
  },

  // ↓ New method
  async chat(ctx: Context) {
    const { messages, system } = (ctx.request as any).body as {
      messages?: any[];
      system?: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      ctx.badRequest("messages is required and must be a non-empty array");
      return;
    }

    const service = strapi.plugin("ai-sdk").service("service");
    if (!service.isInitialized()) {
      ctx.badRequest("AI SDK not initialized");
      return;
    }

    const result = await service.chat(messages, { system });
    const response = result.toUIMessageStreamResponse();

    ctx.status = 200;
    ctx.set("Content-Type", "text/event-stream; charset=utf-8");
    ctx.set("Cache-Control", "no-cache, no-transform");
    ctx.set("Connection", "keep-alive");
    ctx.set("X-Accel-Buffering", "no");
    ctx.set("x-vercel-ai-ui-message-stream", "v1");

    ctx.body = Readable.fromWeb(
      response.body as import("stream/web").ReadableStream
    );
  },
});

export default controller;
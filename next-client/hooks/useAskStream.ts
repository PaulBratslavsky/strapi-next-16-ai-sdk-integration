"use client";

import { useState, useCallback } from "react";
import { askStreamAI } from "@/lib/api";

export function useAskStream() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const askStream = useCallback(
    async (prompt: string, options?: { system?: string }) => {
      setLoading(true);
      setError(null);
      setResponse("");

      try {
        const res = await askStreamAI(prompt, options);
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error("No reader available");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.text) {
                  setResponse((prev) => prev + data.text);
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResponse("");
    setError(null);
  }, []);

  return { askStream, response, loading, error, reset };
}
/**
 * Test chat endpoint with UIMessage format
 *
 * In AI SDK v6, the useChat hook sends UIMessage format:
 * - id: unique message identifier
 * - role: "user" | "assistant" | "system"
 * - parts: array of content parts (text, tool calls, etc.)
 */
const API_URL = "http://localhost:1337/api/ai-sdk";

async function testChat() {
  console.log("Testing /chat endpoint...\n");

  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        {
          id: "msg-1",
          role: "user",
          parts: [{ type: "text", text: "Hello! What is Strapi?" }],
        },
      ],
    }),
  });

  if (!response.ok) {
    console.error("Request failed:", response.status, response.statusText);
    const error = await response.text();
    console.error(error);
    process.exit(1);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    process.stdout.write(decoder.decode(value));
  }

  console.log("\n\n✅ Chat test passed!");
}

testChat().catch(console.error);
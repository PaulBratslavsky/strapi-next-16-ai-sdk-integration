const API_URL = "http://localhost:1337/api/ai-sdk";

async function testStream() {
  console.log("Testing /ask-stream endpoint...\n");

  const response = await fetch(`${API_URL}/ask-stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "Count from 1 to 5" }),
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

  console.log("\n\n✅ Stream test passed!");
}

testStream().catch(console.error);
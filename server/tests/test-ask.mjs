const API_URL = "http://localhost:1337/api/ai-sdk";

async function testAsk() {
  console.log("Testing /ask endpoint...\n");

  const response = await fetch(`${API_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: "What is Strapi and why should I use it?",
    }),
  });

  if (!response.ok) {
    console.error("Request failed:", response.status, response.statusText);
    const error = await response.text();
    console.error(error);
    process.exit(1);
  }

  const data = await response.json();
  console.log("Response:", JSON.stringify(data, null, 2));

  if (data.data?.text) {
    console.log("\n✅ Test passed!");
  } else {
    console.error("\n❌ Test failed: unexpected response format");
    process.exit(1);
  }
}

testAsk().catch(console.error);
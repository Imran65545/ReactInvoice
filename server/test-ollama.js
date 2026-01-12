import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "http://127.0.0.1:11434/v1",
    apiKey: "ollama",
});

// 1x1 Transparent PNG
const dummyImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

async function testOllama() {
    try {
        console.log("Testing Ollama connection...");
        const models = await client.models.list();
        console.log("Available models:", models.data.map(m => m.id));

        console.log("Testing Generation with moondream and image...");
        const response = await client.chat.completions.create({
            model: "moondream",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "What color is this?" },
                        { type: "image_url", image_url: { url: dummyImage } }
                    ]
                },
            ],
            max_tokens: 10,
        });
        console.log("Response:", response.choices[0].message.content);
    } catch (error) {
        console.error("Ollama Test Failed:", error);
    }
}

testOllama();

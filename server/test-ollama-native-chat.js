
const dummyImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

async function testOllamaNativeChat() {
    try {
        console.log("Testing Native Ollama API /api/chat...");

        const response = await fetch("http://127.0.0.1:11434/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "moondream",
                messages: [
                    {
                        role: "user",
                        content: "Describe this image",
                        images: [dummyImage]
                    }
                ],
                stream: false
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP Error: ${response.status} ${errText}`);
        }

        const data = await response.json();
        console.log("Success! Response from Moondream:", data.message.content);

    } catch (error) {
        console.error("Native Ollama Chat Test Failed:", error);
    }
}

testOllamaNativeChat();

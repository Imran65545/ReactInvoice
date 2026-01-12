
// 1x1 Transparent PNG
const dummyImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

async function testOllamaNative() {
    try {
        console.log("Testing Native Ollama API /api/generate...");

        const response = await fetch("http://127.0.0.1:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "moondream",
                prompt: "Describe this image",
                images: [dummyImage],
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Success! Response from Moondream:", data.response);

    } catch (error) {
        console.error("Native Ollama Test Failed:", error);
    }
}

testOllamaNative();

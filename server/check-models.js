import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // There isn't a direct "listModels" on the client instance in some versions, 
        // but we can try to just run a simple prompt on a known fallback like 'gemini-pro' 
        // or use the API to list models if the SDK supports it.
        // Actually, the SDK doesn't always expose listModels easily without the admin API.

        // Let's try a few common ones and see which one *doesn't* throw 404.
        const candidates = [
            "gemini-pro",
            "gemini-1.5-flash-latest",
            "gemini-1.0-pro",
            "models/gemini-1.5-flash",
            "models/gemini-pro"
        ];

        console.log("Checking available models...");

        for (const modelName of candidates) {
            try {
                const m = genAI.getGenerativeModel({ model: modelName });
                // Try a minimal generation to see if it connects
                // For vision models, we need an image, but let's see if we can just init it.
                // Actually, getGenerativeModel doesn't validate until we make a call.

                console.log(`Testing ${modelName}...`);
                // We'll just try to generate text. If it's a vision-only model it might complain about missing image,
                // but if it's a 404 it means model not found.
                await m.generateContent("Hello");
                console.log(`SUCCESS: ${modelName} is available.`);
                return; // Found one!
            } catch (err) {
                if (err.message.includes("404") || err.message.includes("not found")) {
                    console.log(`FAILED: ${modelName} not found.`);
                } else if (err.message.includes("image")) {
                    // If it complains about image, it means the model EXISTS but needs image. Good enough!
                    console.log(`SUCCESS: ${modelName} is available (requires image).`);
                    return;
                } else {
                    console.log(`ERROR on ${modelName}: ${err.message}`);
                    // If it's not a 404, it might be valid but just failed generation.
                    // We'll assume it exists.
                    console.log(`POSSIBLE MATCH: ${modelName} (error was not 404).`);
                }
            }
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();

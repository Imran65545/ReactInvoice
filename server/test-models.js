import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Usually listModels is on the genAI instance or via API, but SDK doesn't expose it easily on the main class in older versions?
        // Actually typically:
        // const models = await genAI.listModels(); // This method might not exist on the top level in all versions.

        // Let's try a direct fetch if SDK doesn't support it easily, or just try to run a simple prompt with a fallback.

        console.log("Testing gemini-1.5-flash-001...");
        const model1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        const result1 = await model1.generateContent("Hello");
        console.log("gemini-1.5-flash-001 works!");

        // If that worked, we are good.
    } catch (error) {
        console.error("Error testing 1.5-flash-001:", error.message);

        try {
            console.log("Testing gemini-pro...");
            const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result2 = await model2.generateContent("Hello");
            console.log("gemini-pro works!");
        } catch (err2) {
            console.error("Error testing gemini-pro:", err2.message);
        }
    }
}

listModels();

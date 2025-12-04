import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("No API KEY found in .env");
    process.exit(1);
}

console.log(`API Key loaded: ${API_KEY.substring(0, 5)}...${API_KEY.substring(API_KEY.length - 4)}`);

async function checkModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    console.log(`Fetching models from: ${url.replace(API_KEY, "HIDDEN_KEY")}`);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            console.error("API Error:", data);
            return;
        }

        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                if (m.name.includes("gemini")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("No models returned (but request was successful).");
            console.log(data);
        }

    } catch (error) {
        console.error("Network Error:", error);
    }
}

checkModels();

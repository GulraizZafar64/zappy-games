
import * as dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY
    if (!apiKey) {
        console.error("No API key found in .env")
        return
    }

    try {
        console.log(`Testing with key: ${apiKey.substring(0, 10)}...`)
        const { GoogleGenerativeAI } = await import("@google/generative-ai")
        const genAI = new GoogleGenerativeAI(apiKey)
        // Try a very standard model first
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        console.log("Sending request...")
        const result = await model.generateContent("Say hello")
        console.log("Response text:", result.response.text())
    } catch (err: any) {
        console.error("FULL ERROR OBJECT:")
        console.error(err)
        if (err.response) {
            console.error("Response data:", await err.response.json())
        }
    }
}

testGemini()

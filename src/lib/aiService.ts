import { GoogleGenerativeAI } from "@google/generative-ai";
import { Transaction } from "./appwrite";

// Initialize two separate instances with different API keys
const insightsAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENERATIVE_AI_KEY);
const chatAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENERATIVE_AI_KEY2);

export const aiService = {
    async getTransactionInsights(transactions: Transaction[]) {
        try {
            console.log("Generating AI insights for transactions:", transactions);
            const model = insightsAI.getGenerativeModel({ model: "gemini-pro" });

            let prompt;
            if (transactions.length === 0) {
                prompt = `Provide 3 general financial tips for better money management. Focus on practical, actionable advice that can help someone improve their financial health. Format the response in clear bullet points.`;
            } else {
                prompt = `Analyze these financial transactions and provide 3 specific insights about spending patterns, savings opportunities, and financial advice. Here are the transactions: ${JSON.stringify(transactions)}. Format the response in clear bullet points.`;
            }

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            console.log("AI Insights generated:", text);
            return text;
        } catch (error) {
            console.error("Error generating AI insights:", error);
            return "• Start by tracking all your expenses to understand your spending patterns\n• Set up an emergency fund for unexpected expenses\n• Consider automating your savings to build consistent financial habits";
        }
    },

    async getCategoryRecommendation(description: string) {
        try {
            console.log("Getting category recommendation for:", description);
            const model = insightsAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `Based on this transaction description, suggest the most appropriate category for budgeting purposes. Only return the category name, nothing else: "${description}"`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            console.log("Category recommendation:", text);
            return text;
        } catch (error) {
            console.error("Error generating category recommendation:", error);
            return "General";
        }
    },

    async getChatResponse(message: string) {
        try {
            console.log("Getting chat response for:", message);
            const model = chatAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `You are a helpful financial assistant. Please provide a concise and helpful response to this question about personal finance: "${message}"`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            console.log("Chat response generated:", text);
            return text;
        } catch (error) {
            console.error("Error generating chat response:", error);
            return "I apologize, but I'm having trouble processing your request at the moment. Please try again or contact our support team for assistance.";
        }
    }
};
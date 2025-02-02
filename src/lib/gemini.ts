import { GoogleGenerativeAI } from "@google/generative-ai";

export const getFinancialInsights = async (transactions: any[]) => {
    try {
        console.log("Getting financial insights from Gemini AI");
        const genAI = new GoogleGenerativeAI("AIzaSyBxZDme6NVa44B0ytrOAakbQ_bA9A48q1M");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const totalIncome = transactions
            .filter(t => t.type === "income")
            .reduce((acc, curr) => acc + curr.amount, 0);

        const totalExpenses = transactions
            .filter(t => t.type === "expense")
            .reduce((acc, curr) => acc + curr.amount, 0);

        const categories = [...new Set(transactions.map(t => t.category).filter(Boolean))];
        
        const transactionsSummary = `
            Total Income: $${totalIncome}
            Total Expenses: $${totalExpenses}
            Categories: ${categories.join(', ')}
            
            Recent Transactions:
            ${transactions.slice(0, 5).map(t => 
                `- ${t.type}: $${t.amount} for ${t.description} (${t.category || 'uncategorized'})`
            ).join('\n')}
        `;

        const prompt = `As a financial advisor, analyze these transaction details and provide 1 specific, actionable insights about spending patterns and suggestions for improvement. Focus on practical advice:

        ${transactionsSummary}
        
        Format your response in clear bullet points.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Gemini AI insights generated:", text);
        return text;
    } catch (error) {
        console.error("Error getting financial insights:", error);
        return "Unable to generate insights at this time. Please try again later.";
    }
};
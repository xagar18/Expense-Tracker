import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { aiService } from "@/lib/aiService";
import { Transaction } from "@/lib/appwrite";
import { Sparkles, Brain, Lightbulb } from "lucide-react";

interface AISuggestionsProps {
    transactions: Transaction[];
}

export const AISuggestions = ({ transactions }: AISuggestionsProps) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const cleanSuggestion = (suggestion: string) => {
        return suggestion
            .replace(/\*\*/g, '')  // Remove markdown bold
            .replace(/^\s*[•-]\s*/, '')  // Remove bullet points
            .replace(/^Insights:\s*/i, '')  // Remove "Insights:" prefix
            .trim();
    };

    useEffect(() => {
        const getAISuggestions = async () => {
            console.log("Generating AI insights for transactions:", transactions);
            setIsLoading(true);
            try {
                const insights = await aiService.getTransactionInsights(transactions);
                const cleanedInsights = insights
                    .split('\n')
                    .map(cleanSuggestion)
                    .filter(item => item.trim());
                setSuggestions(cleanedInsights);
            } catch (error) {
                console.error("Error getting AI insights:", error);
                setSuggestions([
                    "Start by tracking all your expenses to understand your spending patterns",
                    "Set up an emergency fund for unexpected expenses",
                    "Consider automating your savings to build consistent financial habits"
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        getAISuggestions();
    }, [transactions]);

    return (
        <Card className="h-full p-6 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-800/90 dark:to-purple-900/50 backdrop-blur-xl shadow-xl border border-purple-100/50 dark:border-purple-900/50 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
                <Brain className="h-6 w-6 text-purple-500 animate-pulse" />
                <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    AI Financial Insights
                </h3>
            </div>
            {isLoading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-purple-100/50 dark:bg-purple-900/30 rounded w-3/4"></div>
                    <div className="h-4 bg-purple-100/50 dark:bg-purple-900/30 rounded w-2/3"></div>
                    <div className="h-4 bg-purple-100/50 dark:bg-purple-900/30 rounded w-5/6"></div>
                </div>
            ) : (
                <ul className="space-y-4">
                    {suggestions.map((suggestion, index) => (
                        <li 
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-purple-100/20 dark:border-purple-900/20 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-purple-50/50 dark:hover:bg-purple-900/30 hover:shadow-md group"
                        >
                            <span className="text-purple-500 mt-1 flex-shrink-0">
                                <Lightbulb className="h-5 w-5 group-hover:text-purple-600 transition-colors" />
                            </span>
                            <span className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                                {suggestion}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
};
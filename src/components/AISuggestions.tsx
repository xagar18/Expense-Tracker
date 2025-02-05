import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { aiService } from "@/lib/aiService";
import { Transaction } from "@/lib/appwrite";
import { Brain, Lightbulb, TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AISuggestionsProps {
    transactions: Transaction[];
}

export const AISuggestions = ({ transactions }: AISuggestionsProps) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const isMobile = useIsMobile();

    const cleanSuggestion = (suggestion: string) => {
        return suggestion
            .replace(/\*\*/g, '')
            .replace(/^\s*[•-]\s*/, '')
            .replace(/^Insights:\s*/i, '')
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
                // Only take first 2 suggestions for mobile, 3 for desktop
                setSuggestions(cleanedInsights.slice(0, isMobile ? 2 : 3));
            } catch (error) {
                console.error("Error getting AI insights:", error);
                setSuggestions([
                    "Consider setting up automatic savings transfers",
                    "Track your recurring expenses to identify savings opportunities"
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        getAISuggestions();
    }, [transactions, isMobile]);

    return (
        <Card className="h-full p-4 sm:p-6 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-800/90 dark:to-purple-900/50 backdrop-blur-xl shadow-xl border border-purple-100/50 dark:border-purple-900/50">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Smart Insights
                </h3>
            </div>
            {isLoading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-purple-100/50 dark:bg-purple-900/30 rounded w-3/4"></div>
                    <div className="h-4 bg-purple-100/50 dark:bg-purple-900/30 rounded w-2/3"></div>
                </div>
            ) : (
                <ul className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                        <li 
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-purple-100/20 dark:border-purple-900/20 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-purple-50/50 dark:hover:bg-purple-900/30 hover:shadow-md group"
                        >
                            <span className="text-purple-500 mt-1 flex-shrink-0">
                                {index === 0 ? (
                                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 group-hover:text-purple-600 transition-colors" />
                                ) : (
                                    <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 group-hover:text-purple-600 transition-colors" />
                                )}
                            </span>
                            <span className="text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed">
                                {suggestion}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
};
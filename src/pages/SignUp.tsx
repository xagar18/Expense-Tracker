import { SignUpForm } from "@/components/SignUpForm";
import { useNavigate } from "react-router-dom";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { getFinancialInsights } from "@/lib/gemini";
import { useEffect, useState } from "react";

const SignUp = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [aiSuggestion, setAiSuggestion] = useState<string>("");

    useEffect(() => {
        const getInitialInsight = async () => {
            console.log("Fetching initial AI insight for signup page");
            const insight = await getFinancialInsights([]);
            setAiSuggestion(insight);
        };
        getInitialInsight();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
            <div className="fixed top-4 right-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleTheme}
                    className="rounded-full"
                >
                    {theme === 'light' ? (
                        <SunIcon className="h-5 w-5" />
                    ) : (
                        <MoonIcon className="h-5 w-5" />
                    )}
                </Button>
            </div>
            
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Create Account
                    </h1>
                    <p className="text-muted-foreground">
                        Join FinTrack to manage your finances better
                    </p>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 space-y-6">
                    <SignUpForm 
                        onSuccess={() => navigate('/')}
                        onClose={() => {}}
                        switchToSignIn={() => navigate('/signin')}
                    />
                </div>

                {aiSuggestion && (
                    <div className="mt-8 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg">
                        <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            AI Financial Insight
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            {aiSuggestion}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignUp;
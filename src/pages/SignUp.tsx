
import { SignUpForm } from "@/components/SignUpForm";
import { useNavigate } from "react-router-dom";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

const SignUp = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
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
            
            <div className="flex min-h-screen">
                {/* Left Section - Form */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Create your account
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Start managing your finances with FinTrack
                            </p>
                        </div>

                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-lg shadow-xl">
                            <SignUpForm 
                                onSuccess={() => navigate('/')}
                                onClose={() => {}}
                                switchToSignIn={() => navigate('/signin')}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Section - Features */}
                <div className="hidden lg:flex flex-1">
                    <div className="w-full flex items-center justify-center p-12">
                        <div className="space-y-8 max-w-lg">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Why choose FinTrack?
                            </h2>
                            <div className="grid gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                        <span className="text-purple-600 dark:text-purple-400">1</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Easy Expense Tracking</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Log and categorize your expenses effortlessly</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                        <span className="text-purple-600 dark:text-purple-400">2</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Smart Budgeting</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Set and track budgets with intelligent insights</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                        <span className="text-purple-600 dark:text-purple-400">3</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Secure Platform</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Your financial data is protected with bank-grade security</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;

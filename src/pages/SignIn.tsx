
import { SignInForm } from "@/components/SignInForm";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Shield, Zap, Lock } from "lucide-react";

const SignIn = () => {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Navbar */}
            <nav className="absolute top-0 w-full p-4">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            FinTrack
                        </h1>
                        <Link 
                            to="/signup" 
                            className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                        >
                            Don't have an account? Sign up →
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="flex min-h-screen">
                 {/* Left Section - Features */}
                                <div className="flex-1 flex items-center justify-center p-8 ">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Sign in to FinTrack
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Access your financial dashboard
                            </p>
                        </div>

                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-lg shadow-xl">
                            <SignInForm 
                                onSuccess={() => navigate("/")}
                                onClose={() => {}}
                            />
                        </div>
                    </div>
                </div>
               {/* Right Section - Form */}
                <div className="hidden lg:flex flex-1">
                    <div className=" flex items-center justify-center p-12">
                        <div className="space-y-8 max-w-lg">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Welcome back!
                            </h2>
                            <div className="grid gap-6">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                        <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Secure Access</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Your data is protected with enterprise-level security</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                        <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Quick Resume</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Pick up right where you left off</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                        <Lock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Privacy First</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Your financial data stays private and secure</p>
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

export default SignIn;

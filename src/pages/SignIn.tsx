import { SignInForm } from "@/components/SignInForm";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SignIn = () => {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
            <div className="w-full max-w-md space-y-6">
                <SignInForm 
                    onSuccess={() => navigate("/")}
                    onClose={() => {}}
                />
                <div className="text-center">
                    <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
                    <Link 
                        to="/signup" 
                        className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
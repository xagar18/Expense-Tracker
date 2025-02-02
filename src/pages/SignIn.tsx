import { SignInForm } from "@/components/SignInForm";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
            <div className="w-full max-w-md">
                <SignInForm 
                    onSuccess={() => navigate("/")}
                    onClose={() => { }}
                />
            </div>
        </div>
    );
};

export default SignIn;
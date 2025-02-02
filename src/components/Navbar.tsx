import { Button } from "@/components/ui/button";
import { authService } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export const Navbar = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { theme, toggleTheme } = useTheme();

    const handleSignOut = async () => {
        try {
            await authService.signOut();
            navigate('/signin');
        } catch (error) {
            console.error("Sign out error:", error);
            toast({
                title: "Error signing out",
                description: "Please try again",
                variant: "destructive",
            });
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            FinTrack
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
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
                        <Button
                            onClick={handleSignOut}
                            variant="ghost"
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        >
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
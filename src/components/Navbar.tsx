import { Button } from "@/components/ui/button";
import { authService } from "@/lib/auth";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { MoonIcon, SunIcon, Menu, X, Home, PieChart, Settings, HelpCircle } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export const Navbar = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMobile = useIsMobile();

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

    const navItems = [
        { icon: Home, label: "Dashboard", path: "/" },
        { icon: PieChart, label: "Analytics", path: "/analytics" },
        { icon: Settings, label: "Settings", path: "/settings" },
        { icon: HelpCircle, label: "Help", path: "/help" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            FinTrack
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
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

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center space-x-2">
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
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && isMobile && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-3 space-y-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                        <Button
                            onClick={() => {
                                handleSignOut();
                                setIsMenuOpen(false);
                            }}
                            variant="ghost"
                            className="w-full justify-start text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        >
                            Sign Out
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
};
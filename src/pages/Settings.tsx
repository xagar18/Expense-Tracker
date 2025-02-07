import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/hooks/use-theme";
import { Bell, Mail, Shield, User } from "lucide-react";
import { useState, useEffect } from "react";
import { account } from "@/lib/appwrite";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const { toast } = useToast();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [pushNotifications, setPushNotifications] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const user = await account.get();
                setName(user.name || "");
                setEmail(user.email || "");
                
                // Load preferences from localStorage
                const storedEmailNotif = localStorage.getItem('emailNotifications');
                const storedPushNotif = localStorage.getItem('pushNotifications');
                setEmailNotifications(storedEmailNotif === 'true');
                setPushNotifications(storedPushNotif === 'true');
            } catch (error) {
                console.error("Error loading user data:", error);
            }
        };
        loadUserData();
    }, []);

    const handleProfileUpdate = async () => {
        try {
            await account.updateName(name);
            toast({
                title: "Success",
                description: "Profile updated successfully",
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            });
        }
    };

    const handlePasswordUpdate = async () => {
        try {
            await account.updatePassword(newPassword, currentPassword);
            setCurrentPassword("");
            setNewPassword("");
            toast({
                title: "Success",
                description: "Password updated successfully",
            });
        } catch (error) {
            console.error("Error updating password:", error);
            toast({
                title: "Error",
                description: "Failed to update password",
                variant: "destructive",
            });
        }
    };

    const handleNotificationChange = (type: 'email' | 'push', value: boolean) => {
        if (type === 'email') {
            setEmailNotifications(value);
            localStorage.setItem('emailNotifications', value.toString());
        } else {
            setPushNotifications(value);
            localStorage.setItem('pushNotifications', value.toString());
        }
        toast({
            title: "Success",
            description: "Notification preferences updated",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white/30 to-pink-50/30 dark:from-gray-900 dark:via-gray-800/50 dark:to-purple-900/30 transition-colors duration-500">
            <Navbar />
            <div className="container mx-auto pt-24 px-4 pb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-10 text-center md:text-center">
                    Settings
                </h1>

                <div className="grid gap-6 max-w-4xl mx-auto">
                    <Card className="p-6 backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/50">
                                <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Profile Settings</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                                <Input 
                                    id="name" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                <Input 
                                    id="email" 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email" 
                                    disabled
                                    className="bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
                                />
                            </div>
                            <Button onClick={handleProfileUpdate} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                                Save Changes
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-6 backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/50">
                                <Bell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Notifications</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="email-notif" className="text-sm font-medium">Email Notifications</Label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive email updates about your account</p>
                                </div>
                                <Switch 
                                    id="email-notif"
                                    checked={emailNotifications}
                                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                                    className="data-[state=checked]:bg-purple-600"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="push-notif" className="text-sm font-medium">Push Notifications</Label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications about your account</p>
                                </div>
                                <Switch 
                                    id="push-notif"
                                    checked={pushNotifications}
                                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                                    className="data-[state=checked]:bg-purple-600"
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/50">
                                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Security</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="current-password" className="text-sm font-medium">Current Password</Label>
                                <Input 
                                    id="current-password" 
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
                                <Input 
                                    id="new-password" 
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
                                />
                            </div>
                            <Button onClick={handlePasswordUpdate} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                                Update Password
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-6 backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/50">
                                <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Preferences</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-medium">Dark Mode</Label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark theme</p>
                                </div>
                                <Switch 
                                    checked={theme === 'dark'}
                                    onCheckedChange={toggleTheme}
                                    className="data-[state=checked]:bg-purple-600"
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;
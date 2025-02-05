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
import { ID } from "appwrite";

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
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
            <Navbar />
            <div className="container mx-auto pt-24 px-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
                    Settings
                </h1>

                <div className="grid gap-6">
                    <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80">
                        <div className="flex items-center gap-4 mb-6">
                            <User className="h-6 w-6 text-purple-600" />
                            <h2 className="text-xl font-semibold">Profile Settings</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input 
                                    id="name" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name" 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email" 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email" 
                                    disabled
                                />
                            </div>
                            <Button onClick={handleProfileUpdate} className="w-full">Save Changes</Button>
                        </div>
                    </Card>

                    <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80">
                        <div className="flex items-center gap-4 mb-6">
                            <Bell className="h-6 w-6 text-purple-600" />
                            <h2 className="text-xl font-semibold">Notifications</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="email-notif">Email Notifications</Label>
                                <Switch 
                                    id="email-notif"
                                    checked={emailNotifications}
                                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="push-notif">Push Notifications</Label>
                                <Switch 
                                    id="push-notif"
                                    checked={pushNotifications}
                                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80">
                        <div className="flex items-center gap-4 mb-6">
                            <Shield className="h-6 w-6 text-purple-600" />
                            <h2 className="text-xl font-semibold">Security</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input 
                                    id="current-password" 
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input 
                                    id="new-password" 
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <Button onClick={handlePasswordUpdate} className="w-full">Update Password</Button>
                        </div>
                    </Card>

                    <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80">
                        <div className="flex items-center gap-4 mb-6">
                            <Mail className="h-6 w-6 text-purple-600" />
                            <h2 className="text-xl font-semibold">Preferences</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Dark Mode</Label>
                                <Switch 
                                    checked={theme === 'dark'}
                                    onCheckedChange={toggleTheme}
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
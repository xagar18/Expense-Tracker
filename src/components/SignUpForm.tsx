
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { authService } from "@/lib/auth";
import { Shield, Lock, Zap } from "lucide-react";

interface SignUpFormProps {
  onSuccess: () => void;
  onClose: () => void;
  switchToSignIn: () => void;
}

export const SignUpForm = ({ onSuccess, onClose, switchToSignIn }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await authService.signUp(email, password, name, city);
      await authService.signIn(email, password);
      toast({
        title: "Welcome to FinTrack!",
        description: "Your account has been created successfully.",
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign up failed",
        description: "Please try again with a different email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      console.error("Google sign up error:", error);
      toast({
        title: "Google sign up failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Features Section */}
     

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="bg-white dark:bg-gray-800"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter your city"
            className="bg-white dark:bg-gray-800"
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
            className="bg-white dark:bg-gray-800"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="bg-white dark:bg-gray-800"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="bg-white dark:bg-gray-800"
          />
        </div>
        <Button
          onClick={handleSignUp}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          onClick={handleGoogleSignUp}
          variant="outline"
          className="w-full"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="w-4 h-4 mr-2"
          />
          Continue with Google
        </Button>
        <div className="text-center text-sm">
          <span className="text-gray-500">Already have an account?</span>{" "}
          <button
            onClick={switchToSignIn}
            className="text-purple-600 hover:underline font-medium"
          >
            Sign in instead
          </button>
        </div>
      </div>

      {/* Testimonial Section */}
     
    </div>
  );
};

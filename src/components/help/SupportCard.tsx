import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface SupportCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action: string;
    onClick: () => void;
}

export const SupportCard = ({ icon: Icon, title, description, action, onClick }: SupportCardProps) => {
    return (
        <Card className="p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
            <Icon className="h-12 w-12 text-purple-500 dark:text-purple-400 mb-4" />
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {description}
            </p>
            <Button 
                variant="outline" 
                className="w-full bg-white/50 dark:bg-gray-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                onClick={onClick}
            >
                {action}
            </Button>
        </Card>
    );
};
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface Message {
    role: string;
    content: string;
}

interface ChatInterfaceProps {
    chatHistory: Message[];
    chatMessage: string;
    setChatMessage: (message: string) => void;
    handleSendMessage: () => void;
    isLoading: boolean;
}

export const ChatInterface = ({
    chatHistory,
    chatMessage,
    setChatMessage,
    handleSendMessage,
    isLoading
}: ChatInterfaceProps) => {
    return (
        <Card className="p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                    {chatHistory.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-lg ${
                                    msg.role === "user"
                                        ? "bg-purple-600 text-white ml-auto"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <div className="mt-4 flex gap-2">
                <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            handleSendMessage();
                        }
                    }}
                />
                <Button 
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </Card>
    );
};
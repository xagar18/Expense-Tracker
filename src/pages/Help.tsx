import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { MessageCircle, Phone, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { aiService } from "@/lib/aiService";
import { ChatInterface } from "@/components/help/ChatInterface";
import { SupportCard } from "@/components/help/SupportCard";
import { FAQSection } from "@/components/help/FAQSection";

const Help = () => {
    const [chatMessage, setChatMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSendMessage = async () => {
        if (!chatMessage.trim()) return;

        try {
            setIsLoading(true);
            const newMessage = { role: "user", content: chatMessage };
            setChatHistory(prev => [...prev, newMessage]);

            const response = await aiService.getChatResponse(chatMessage);
            
            const aiMessage = { role: "assistant", content: response };
            setChatHistory(prev => [...prev, aiMessage]);
            
            setChatMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
            <Navbar />
            <div className="container mx-auto pt-24 px-4 space-y-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
                    Help & Support
                </h1>

                <div className="grid gap-20 md:grid-cols-3 mb-8">
                    <SupportCard
                        icon={MessageCircle}
                        title="AI Chat Support"
                        description="Chat with our AI assistant"
                        action="Start Chat"
                        onClick={() => {
                            const element = document.getElementById('chat-section');
                            element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    />
                    
                    <SupportCard
                        icon={Phone}
                        title="Phone Support"
                        description="Call us at +91-8591070791"
                        action="Call Now"
                        onClick={() => window.location.href = 'tel:+918591070791'}
                    />
                    
                    <SupportCard
                        icon={Mail}
                        title="Email Support"
                        description="sagaryadav6352@gmail.com"
                        action="Send Email"
                        onClick={() => window.location.href = 'mailto:sagaryadav6352@gmail.com'}
                    />
                </div>

                <div id="chat-section" className="mb-8">
                    <ChatInterface
                        chatHistory={chatHistory}
                        chatMessage={chatMessage}
                        setChatMessage={setChatMessage}
                        handleSendMessage={handleSendMessage}
                        isLoading={isLoading}
                    />
                </div>

                <FAQSection />
            </div>
        </div>
    );
};

export default Help;
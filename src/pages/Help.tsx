import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { 
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Phone, Mail } from "lucide-react";
import { aiService } from "@/lib/aiService";
import { useToast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
            <div className="container mx-auto pt-24 px-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
                    Help & Support
                </h1>

                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <Sheet>
                        <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 flex flex-col items-center text-center">
                            <MessageCircle className="h-12 w-12 text-purple-600 mb-4" />
                            <h3 className="font-semibold mb-2">AI Chat Support</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                Chat with our AI assistant
                            </p>
                            <SheetTrigger asChild>
                                <Button className="w-full">Start Chat</Button>
                            </SheetTrigger>
                        </Card>
                        <SheetContent side="left" className="w-[400px] sm:w-[540px]">
                            <SheetHeader>
                                <SheetTitle>Chat with AI Assistant</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col h-[calc(100vh-120px)]">
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                                                        ? "bg-purple-600 text-white"
                                                        : "bg-gray-100 dark:bg-gray-700"
                                                }`}
                                            >
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 border-t">
                                    <div className="flex gap-2">
                                        <Input
                                            value={chatMessage}
                                            onChange={(e) => setChatMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                    handleSendMessage();
                                                }
                                            }}
                                        />
                                        <Button 
                                            onClick={handleSendMessage}
                                            disabled={isLoading}
                                        >
                                            Send
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                    
                    <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 flex flex-col items-center text-center">
                        <Phone className="h-12 w-12 text-purple-600 mb-4" />
                        <h3 className="font-semibold mb-2">Phone Support</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            Call us at +1 (555) 123-4567
                        </p>
                        <Button variant="outline" className="w-full">Call Now</Button>
                    </Card>
                    
                    <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 flex flex-col items-center text-center">
                        <Mail className="h-12 w-12 text-purple-600 mb-4" />
                        <h3 className="font-semibold mb-2">Email Support</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            support@fintrack.com
                        </p>
                        <Button variant="outline" className="w-full">Send Email</Button>
                    </Card>
                </div>

                <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80">
                    <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>How do I add a new transaction?</AccordionTrigger>
                            <AccordionContent>
                                To add a new transaction, go to the Dashboard and click on the "Add Transaction" button. Fill in the required details like amount, category, and date, then click "Save".
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>How can I view my spending analytics?</AccordionTrigger>
                            <AccordionContent>
                                Navigate to the Analytics page from the main menu. Here you'll find detailed charts and graphs showing your spending patterns, trends, and category-wise breakdown.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Can I export my transaction history?</AccordionTrigger>
                            <AccordionContent>
                                Yes! Go to the Dashboard, click on the "Export" button, and choose your preferred format (CSV or PDF). Your transaction history will be downloaded automatically.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </Card>
            </div>
        </div>
    );
};

export default Help;
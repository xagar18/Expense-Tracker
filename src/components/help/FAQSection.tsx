import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const faqData = [
    {
        question: "How do I add a new transaction?",
        answer: "To add a new transaction, go to the Dashboard and click on the 'Add Transaction' button. Fill in the required details like amount, category, and date, then click 'Save'."
    },
    {
        question: "How can I view my spending analytics?",
        answer: "Navigate to the Analytics page from the main menu. Here you'll find detailed charts and graphs showing your spending patterns, trends, and category-wise breakdown."
    },
    {
        question: "Can I export my transaction history?",
        answer: "Yes! Go to the Dashboard, click on the 'Export' button, and choose your preferred format (CSV or PDF). Your transaction history will be downloaded automatically."
    }
];

export const FAQSection = () => {
    return (
        <Card className="p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="text-gray-900 dark:text-gray-100">
                {faqData.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index + 1}`} className="border-gray-200 dark:border-gray-700">
                        <AccordionTrigger className="hover:text-purple-600 dark:hover:text-purple-400">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 dark:text-gray-300">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </Card>
    );
};
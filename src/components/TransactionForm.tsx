import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { transactionService } from "@/lib/appwrite";

const transactionSchema = z.object({
    amount: z.string().min(1, "Amount is required"),
    description: z.string().min(1, "Description is required"),
    type: z.enum(["income", "expense"] as const),
    category: z.string().optional()
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
    onTransactionAdded: () => void;
    userId: string;
}

export const TransactionForm = ({ onTransactionAdded, userId }: TransactionFormProps) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            amount: "",
            description: "",
            type: "expense",
            category: ""
        }
    });

    const onSubmit = async (data: TransactionFormData) => {
        setIsLoading(true);
        try {
            await transactionService.createTransaction({
                user_id: userId,
                type: data.type,
                amount: parseFloat(data.amount),
                description: data.description,
                category: data.category,
            });
            
            form.reset();
            onTransactionAdded();
            toast({
                title: "Success",
                description: "Transaction added successfully",
            });
        } catch (error) {
            console.error("Error adding transaction:", error);
            toast({
                title: "Error",
                description: "Failed to add transaction",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Add Transaction
            </h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormControl>
                                    <select
                                        {...field}
                                        className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="expense">Expense</option>
                                        <option value="income">Income</option>
                                    </select>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Enter amount" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter description" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter category" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        disabled={isLoading}
                    >
                        <Plus className="mr-2 h-4 w-4" /> 
                        {isLoading ? "Adding..." : "Add Transaction"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};
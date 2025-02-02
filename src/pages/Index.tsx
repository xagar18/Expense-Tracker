import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { FinancialSummaryCards } from "@/components/FinancialSummaryCards";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionsTable } from "@/components/TransactionsTable";
import { AISuggestions } from "@/components/AISuggestions";
import { Transaction, transactionService } from "@/lib/appwrite";
import { authService } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const Index = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    const checkAuth = async () => {
        try {
            const user = await authService.getCurrentUser();
            console.log("Current user:", user);
            if (!user) {
                navigate('/signin');
                return;
            }
            setCurrentUser(user);
            return user;
        } catch (error) {
            console.error("Auth check error:", error);
            navigate('/signin');
        }
    };

    const fetchTransactions = async (userId: string) => {
        try {
            console.log("Fetching transactions for user:", userId);
            const fetchedTransactions = await transactionService.getTransactions(userId);
            setTransactions(fetchedTransactions);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            toast({
                title: "Error",
                description: "Failed to fetch transactions",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const initializeData = async () => {
            const user = await checkAuth();
            if (user) {
                fetchTransactions(user.$id);
            }
        };
        initializeData();
    }, []);

    if (!currentUser) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
            <Navbar />
            <div className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8 space-y-8">
                <FinancialSummaryCards transactions={transactions} />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
                    <TransactionForm 
                        onTransactionAdded={() => fetchTransactions(currentUser.$id)}
                        userId={currentUser.$id}
                    />
                    <AISuggestions transactions={transactions} />
                </div>

                <TransactionsTable 
                    transactions={transactions}
                    onTransactionDeleted={() => fetchTransactions(currentUser.$id)}
                />
            </div>
        </div>
    );
};

export default Index;
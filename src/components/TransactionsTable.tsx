import { Transaction } from "@/lib/appwrite";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Trash, DollarSign } from "lucide-react";
import { transactionService } from "@/lib/appwrite";
import { useToast } from "@/components/ui/use-toast";

interface TransactionsTableProps {
    transactions: Transaction[];
    onTransactionDeleted: () => void;
}

export const TransactionsTable = ({ transactions, onTransactionDeleted }: TransactionsTableProps) => {
    const { toast } = useToast();

    const handleDelete = async (transactionId: string) => {
        try {
            await transactionService.deleteTransaction(transactionId);
            onTransactionDeleted();
            toast({
                title: "Success",
                description: "Transaction deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting transaction:", error);
            toast({
                title: "Error",
                description: "Failed to delete transaction",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl overflow-hidden">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Recent Transactions
                </h2>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                                <TableCell>{new Date(transaction.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        transaction.type === 'income' 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                    }`}>
                                        {transaction.type === 'income' ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                                        {transaction.type}
                                    </span>
                                </TableCell>
                                <TableCell>{transaction.category || '-'}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell className={transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                    ${transaction.amount.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => handleDelete(transaction.id)}
                                        className="opacity-1 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
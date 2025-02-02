import { DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import { Transaction } from '@/lib/appwrite';

interface FinancialSummaryCardsProps {
    transactions: Transaction[];
}

export const FinancialSummaryCards = ({ transactions }: FinancialSummaryCardsProps) => {
    const balance = transactions.reduce((acc, curr) => 
        curr.type === "income" ? acc + curr.amount : acc - curr.amount, 0
    );

    const totalIncome = transactions
        .filter(t => t.type === "income")
        .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === "expense")
        .reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-white/50 to-purple-50/50 dark:from-gray-800/50 dark:to-purple-900/30 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Balance</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform">
                            ${balance.toFixed(2)}
                        </p>
                    </div>
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                        <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-400 group-hover:rotate-12 transition-transform" />
                    </div>
                </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-white/50 to-green-50/50 dark:from-gray-800/50 dark:to-green-900/30 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Income</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400 group-hover:scale-105 transition-transform">
                            ${totalIncome.toFixed(2)}
                        </p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full">
                        <ArrowUp className="h-8 w-8 text-green-600 dark:text-green-400 group-hover:translate-y-[-4px] transition-transform" />
                    </div>
                </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-white/50 to-red-50/50 dark:from-gray-800/50 dark:to-red-900/30 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Expenses</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400 group-hover:scale-105 transition-transform">
                            ${totalExpenses.toFixed(2)}
                        </p>
                    </div>
                    <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full">
                        <ArrowDown className="h-8 w-8 text-red-600 dark:text-red-400 group-hover:translate-y-[4px] transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    );
};
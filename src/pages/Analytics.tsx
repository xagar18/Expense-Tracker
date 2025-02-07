import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction, transactionService } from "@/lib/appwrite";
import { authService } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

const Analytics = () => {
    const { toast } = useToast();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [timeFrame, setTimeFrame] = useState<"month" | "year">("month");
    const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    useEffect(() => {
        const initializeData = async () => {
            try {
                const user = await authService.getCurrentUser();
                if (!user) {
                    navigate('/signin');
                    return;
                }
                console.log("Fetching transactions for analytics...");
                const fetchedTransactions = await transactionService.getTransactions(user.$id);
                console.log("Fetched transactions:", fetchedTransactions);
                setTransactions(fetchedTransactions);
            } catch (error) {
                console.error("Error fetching transactions for analytics:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load transaction data",
                });
            } finally {
                setIsLoading(false);
            }
        };

        initializeData();
    }, [navigate, toast]);

    const processTransactionsForChart = () => {
        if (timeFrame === "year") {
            const data: { [key: string]: { expenses: number; income: number } } = {};
            
            transactions.forEach(transaction => {
                const date = new Date(transaction.created_at);
                const period = date.toLocaleString('default', { month: 'short', year: '2-digit' });
                
                if (!data[period]) {
                    data[period] = { expenses: 0, income: 0 };
                }
                
                if (transaction.type === 'expense') {
                    data[period].expenses += transaction.amount;
                } else {
                    data[period].income += transaction.amount;
                }
            });

            return Object.entries(data)
                .map(([period, values]) => ({
                    period,
                    expenses: Number(values.expenses.toFixed(2)),
                    income: Number(values.income.toFixed(2)),
                    balance: Number((values.income - values.expenses).toFixed(2))
                }));
        } else {
            const [year, month] = selectedMonth.split('-');
            const filteredTransactions = transactions.filter(t => {
                const date = new Date(t.created_at);
                return date.getFullYear() === parseInt(year) && 
                       date.getMonth() === parseInt(month) - 1;
            });

            const data: { [key: string]: { expenses: number; income: number } } = {};
            const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();

            for (let i = 1; i <= daysInMonth; i++) {
                const day = i.toString().padStart(2, '0');
                data[`${day}`] = { expenses: 0, income: 0 };
            }

            filteredTransactions.forEach(transaction => {
                const date = new Date(transaction.created_at);
                const day = date.getDate().toString().padStart(2, '0');
                
                if (transaction.type === 'expense') {
                    data[day].expenses += transaction.amount;
                } else {
                    data[day].income += transaction.amount;
                }
            });

            return Object.entries(data)
                .map(([day, values]) => ({
                    period: day,
                    expenses: Number(values.expenses.toFixed(2)),
                    income: Number(values.income.toFixed(2)),
                    balance: Number((values.income - values.expenses).toFixed(2))
                }));
        }
    };

    const chartData = processTransactionsForChart();

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const averageMonthlyExpense = totalExpenses / (chartData.length || 1);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <p className="font-semibold mb-2">{timeFrame === 'year' ? label : `Day ${label}`}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: ${entry.value.toLocaleString()}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const generateMonthOptions = () => {
        const options = [];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        
        for (let i = 0; i < 12; i++) {
            const date = new Date(currentYear, currentDate.getMonth() - i, 1);
            const value = format(date, 'yyyy-MM');
            const label = format(date, 'MMMM yyyy');
            options.push({ value, label });
        }
        
        return options;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
                <Navbar />
                <div className="container mx-auto pt-24 px-4 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
            <Navbar />
            <div className="container mx-auto pt-24 px-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                    <div className="space-y-2">
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Financial Analytics
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Track your financial journey with detailed insights and analytics
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Select value={timeFrame} onValueChange={(value: "month" | "year") => setTimeFrame(value)}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Select time frame" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="month">Daily (Month View)</SelectItem>
                                <SelectItem value="year">Monthly (Year View)</SelectItem>
                            </SelectContent>
                        </Select>
                        {timeFrame === "month" && (
                            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {generateMonthOptions().map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-900">
                        <h3 className="font-semibold mb-2 text-gray-600 dark:text-gray-300">Total Expenses</h3>
                        <p className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">${totalExpenses.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 mt-2">Track all your spending in one place</p>
                    </Card>
                    <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-green-200 dark:border-green-900">
                        <h3 className="font-semibold mb-2 text-gray-600 dark:text-gray-300">Total Income</h3>
                        <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">${totalIncome.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 mt-2">Monitor your earnings effectively</p>
                    </Card>
                    <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-pink-200 dark:border-pink-900">
                        <h3 className="font-semibold mb-2 text-gray-600 dark:text-gray-300">Average Monthly Expense</h3>
                        <p className="text-2xl md:text-3xl font-bold text-pink-600 dark:text-pink-400">${averageMonthlyExpense.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 mt-2">Keep track of your monthly spending patterns</p>
                    </Card>
                </div>

                <Card className="p-4 md:p-6 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 mb-8">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white px-2">
                        {timeFrame === 'year' ? 'Monthly Income vs Expenses Trends' : 'Daily Income vs Expenses Trends'}
                    </h2>
                    <div className="h-[300px] md:h-[400px] w-full">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart 
                                    data={chartData} 
                                    margin={{ 
                                        top: 20, 
                                        right: isMobile ? 10 : 30, 
                                        left: isMobile ? 0 : 20, 
                                        bottom: 20 
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis 
                                        dataKey="period" 
                                        stroke="#718096"
                                        tick={{ fill: '#718096' }}
                                        tickLine={{ stroke: '#718096' }}
                                        fontSize={isMobile ? 10 : 12}
                                        interval={isMobile ? 2 : 0}
                                    />
                                    <YAxis 
                                        stroke="#718096"
                                        tick={{ fill: '#718096' }}
                                        tickLine={{ stroke: '#718096' }}
                                        fontSize={isMobile ? 10 : 12}
                                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                                        width={isMobile ? 50 : 80}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend 
                                        verticalAlign="top" 
                                        height={36}
                                        wrapperStyle={{
                                            paddingBottom: "20px",
                                            fontSize: isMobile ? "12px" : "14px"
                                        }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="expenses" 
                                        stroke="#e11d48" 
                                        strokeWidth={2}
                                        dot={{ fill: '#e11d48', strokeWidth: 2, r: isMobile ? 3 : 4 }}
                                        activeDot={{ r: isMobile ? 6 : 8 }}
                                        name="Expenses"
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="income" 
                                        stroke="#22c55e" 
                                        strokeWidth={2}
                                        dot={{ fill: '#22c55e', strokeWidth: 2, r: isMobile ? 3 : 4 }}
                                        activeDot={{ r: isMobile ? 6 : 8 }}
                                        name="Income"
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="balance" 
                                        stroke="#6366f1" 
                                        strokeWidth={2}
                                        dot={{ fill: '#6366f1', strokeWidth: 2, r: isMobile ? 3 : 4 }}
                                        activeDot={{ r: isMobile ? 6 : 8 }}
                                        name="Balance"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                No transaction data available
                            </div>
                        )}
                    </div>
                </Card>

                <div className="grid md:grid-cols-2 gap-6 pb-4">
                    <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Financial Tips</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Track your daily expenses for better financial control</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Set monthly budgets for different categories</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-300">Review your spending patterns regularly</span>
                            </li>
                        </ul>
                    </Card>
                    <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Quick Stats</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Monthly Savings Rate</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                        className="bg-purple-600 h-2 rounded-full" 
                                        style={{ 
                                            width: `${totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0}%` 
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Analytics;

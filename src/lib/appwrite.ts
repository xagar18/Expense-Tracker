import { Client, Account, Databases, Models, Query } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

export const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const TRANSACTIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;


export interface Transaction {
    id: string;
    $id: string; // Added $id field for Appwrite document ID
    user_id: string;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    created_at: string;
    category?: string;
    ai_insights?: string;
}

export const transactionService = {
    async createTransaction(transaction: Omit<Transaction, 'id' | '$id' | 'created_at'>) {
        console.log('Creating transaction:', transaction);
        try {
            const response = await databases.createDocument(
                APPWRITE_DATABASE_ID,
                TRANSACTIONS_COLLECTION_ID,
                'unique()',
                {
                    ...transaction,
                    created_at: new Date().toISOString(),
                }
            );
            return response as unknown as Transaction;
        } catch (error) {
            console.error('Error creating transaction:', error);
            throw error;
        }
    },

    async getTransactions(userId: string) {
        console.log('Fetching transactions for user:', userId);
        try {
            const response = await databases.listDocuments(
                APPWRITE_DATABASE_ID,
                TRANSACTIONS_COLLECTION_ID,
                [Query.equal('user_id', userId)]
            );
            return response.documents as unknown as Transaction[];
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }
    },

    async deleteTransaction(transactionId: string) {
        console.log('Deleting transaction:', transactionId);
        try {
            await databases.deleteDocument(
                APPWRITE_DATABASE_ID,
                TRANSACTIONS_COLLECTION_ID,
                transactionId
            );
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }
    }
};
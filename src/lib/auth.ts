import { account } from './appwrite';
import { ID } from 'appwrite';

export const authService = {
    async signUp(email: string, password: string, name?: string, city?: string) {
        try {
            const response = await account.create(
                ID.unique(),
                email,
                password,
                name
            );
            console.log("User signed up successfully:", response);
            
            if (name || city) {
                console.log("Additional user data:", { name, city });
            }
            
            return response;
        } catch (error) {
            console.error("Error signing up:", error);
            throw error;
        }
    },

    async signIn(email: string, password: string) {
        try {
            // First try to delete any existing session
            try {
                await account.deleteSession('current');
            } catch (e) {
                console.log("No existing session to delete");
            }
            
            const session = await account.createEmailSession(email, password);
            console.log("User signed in successfully:", session);
            return session;
        } catch (error) {
            console.error("Error signing in:", error);
            throw error;
        }
    },

    async signInWithGoogle() {
        try {
            // First try to delete any existing session
            try {
                await account.deleteSession('current');
            } catch (e) {
                console.log("No existing session to delete");
            }

            account.createOAuth2Session(
                'google',
                'https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/679c5284000cf54b1b13',
                'https://cloud.appwrite.io/v1/account/sessions/oauth2/failure'
            );
        } catch (error) {
            console.error("Error with Google sign in:", error);
            throw error;
        }
    },

    async signOut() {
        try {
            await account.deleteSession('current');
            console.log("User signed out successfully");
        } catch (error) {
            console.error("Error signing out:", error);
            throw error;
        }
    },

    async getCurrentUser() {
        try {
            const user = await account.get();
            console.log("Current user:", user);
            return user;
        } catch (error) {
            console.error("Error getting current user:", error);
            return null;
        }
    }
};
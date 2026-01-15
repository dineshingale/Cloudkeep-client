// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut as firebaseSignOut,
    User
} from 'firebase/auth';
import { auth } from '../firebase';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    // 1. Listen for Auth State Changes
    useEffect(() => {
        // --- TEST MODE BYPASS ---
        // Allows Playwright to inject a fake user without hitting Google Auth
        const testUserStr = window.localStorage.getItem('TEST_USER');
        if (testUserStr) {
            try {
                const testUser = JSON.parse(testUserStr);
                setUser(testUser);
                setIsAuthLoading(false);
                return;
            } catch (e) {
                console.error("Failed to parse TEST_USER", e);
            }
        }

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // 2. Action: Login with Popup (More stable for dev)
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            setAuthError(null);
            await signInWithPopup(auth, provider); // The browser opens a small window instead
        } catch (error) {
            console.error('Error signing in with Google', error);
            setAuthError('Unable to sign in. Please try again.');
        }
    };

    // 3. Action: Logout
    const logout = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return { user, isAuthLoading, authError, signInWithGoogle, logout };
}

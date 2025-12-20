// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup,      // CHANGED: Using Popup instead of Redirect
  onAuthStateChanged, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth } from '../firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // 1. Listen for Auth State Changes
  useEffect(() => {
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

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db, doc, getDoc } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

type UserType = 'laborer' | 'client' | null;

interface AuthContextProps {
  currentUser: any;
  userType: UserType;
  loading: boolean;
  signUp: (email: string, password: string, userType: UserType) => Promise<any>;
  logIn: (email: string, password: string) => Promise<any>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  async function signUp(email: string, password: string, type: UserType) {
    try {
      const { createUserWithEmailAndPassword } = await import('../lib/firebase');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { setDoc } = await import('../lib/firebase');
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        userType: type,
        createdAt: new Date().toISOString()
      });
      
      return userCredential;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
      throw error;
    }
  }

  async function logIn(email: string, password: string) {
    try {
      const { signInWithEmailAndPassword } = await import('../lib/firebase');
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
      throw error;
    }
  }

  async function logOut() {
    try {
      const { signOut } = await import('../lib/firebase');
      await signOut(auth);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message,
      });
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserType(userDoc.data().userType);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserType(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userType,
    loading,
    signUp,
    logIn,
    logOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

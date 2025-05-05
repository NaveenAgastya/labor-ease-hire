
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  collection,
  doc, 
  addDoc, 
  getDoc, 
  getDocs,
  updateDoc,
  setDoc,
  query,
  where
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBz5mwCxCR2FO-hkTJc7fQG_N0tg8_D9dQ", // Demo key - replace with your own
  authDomain: "labor-ease-hire.firebaseapp.com",
  projectId: "labor-ease-hire",
  storageBucket: "labor-ease-hire.appspot.com",
  messagingSenderId: "111111111111",
  appId: "1:111111111111:web:1111111111111111111111"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  auth,
  db,
  storage,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  query,
  where,
  ref,
  uploadBytes,
  getDownloadURL
};

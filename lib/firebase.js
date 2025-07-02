// lib/firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCk-dPYXap_UDHOYiU5q930-CXnG2oAySw",
  authDomain: "collabsphere-a9e79.firebaseapp.com",
  projectId: "collabsphere-a9e79",
  storageBucket: "collabsphere-a9e79.firebasestorage.app",
  messagingSenderId: "348723728399",
  appId: "1:348723728399:web:ab93efb86144002436137a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export {
  auth,
  provider,
  db,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
};



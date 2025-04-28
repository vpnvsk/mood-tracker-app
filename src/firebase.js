import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBonq2AaR6RPvyQJpx16WQxItqqD2Sy2Vc",
  authDomain: "mood-tracker-8cfa8.firebaseapp.com",
  projectId: "mood-tracker-8cfa8",
  storageBucket: "mood-tracker-8cfa8.firebasestorage.app",
  messagingSenderId: "263284993707",
  appId: "1:263284993707:web:1e7ad866b36f5cbbc3d1ee",
  measurementId: "G-RP0E4MZH8W"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

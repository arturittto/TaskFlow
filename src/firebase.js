import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ обязательно

const firebaseConfig = {
  apiKey: "AIzaSyB8DgdeA4mBtpcXYHZWeefDSTWExuUs3n4",
  authDomain: "taskflow-e9a27.firebaseapp.com",
  projectId: "taskflow-e9a27",
  storageBucket: "taskflow-e9a27.firebasestorage.app",
  messagingSenderId: "463014555998",
  appId: "1:463014555998:web:8ee3fdfce147bb62f69fcf",
  measurementId: "G-2C3BZY4YPT"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // ✅

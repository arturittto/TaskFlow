// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB8B9de4AmbtpcXYHZWeefDSTWExuUs3n4",
  authDomain: "taskflow-e9a27.firebaseapp.com",
  projectId: "taskflow-e9a27",
  storageBucket: "taskflow-e9a27.appspot.com",
  messagingSenderId: "463014555998",
  appId: "1:463014555998:web:8ee3fdfce147bb62f69fcf",
  measurementId: "G-2C3B2Y4YPT" // Можно оставить, но не обязателен
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

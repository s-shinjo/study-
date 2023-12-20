import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Firebaseの初期化
const firebaseApp = initializeApp(firebaseConfig);

// Firestoreの初期化
const db = getFirestore(firebaseApp);

const app = createApp(App);

app.use(router);
app.provide('db', db);
app.mount('#app');

export { db }; // dbをエクスポート

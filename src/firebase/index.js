import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
//alert('add your firebase config in models/Firebase.js');
const firebaseConfig = {
    apiKey: "AIzaSyAo2_E7v0sG8Re1wq5S_GrDZGLnBDQW_Rk",
    authDomain: "fir-demo-7246e.firebaseapp.com",
    projectId: "fir-demo-7246e",
    storageBucket: "fir-demo-7246e.firebasestorage.app",
    messagingSenderId: "823016188892",
    appId: "1:823016188892:web:1abdbc8b84fd82606d3d19"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence (optional; ignore errors for multi-tab)
enableIndexedDbPersistence(db).catch(() => {});

export { };
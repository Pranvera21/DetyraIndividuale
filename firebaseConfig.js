
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD_KsRiMEZ4S3kprVmgQzrl3EmLhtuCfVw",
  authDomain: "detyraindividuale-69f5e.firebaseapp.com",
  projectId: "detyraindividuale-69f5e",
  storageBucket: "detyraindividuale-69f5e.firebasestorage.app",
  messagingSenderId: "814234056487",
  appId: "1:814234056487:web:9dfcd00783504594b01b02",
  measurementId: "G-SPWYDP0S2K"
};



const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();


const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };

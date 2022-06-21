// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAs_uU4Sz8GdYgq_TJq1boFCn1MeSmeYEU",
  authDomain: "taporder.vercel.app",
  projectId: "selforder-39140",
  storageBucket: "selforder-39140.appspot.com",
  messagingSenderId: "1074527787113",
  appId: "1:1074527787113:web:cf448f7a9d5360b9eaaaf8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
export const storage = getStorage(app);
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
export { db };
export { firebase };
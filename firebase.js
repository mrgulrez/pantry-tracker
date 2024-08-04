// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWcAbWzOdFodWLiN9Rpil5hBaFmBJlAEo",
  authDomain: "pantry-trackerg.firebaseapp.com",
  databaseURL: "https://pantry-trackerg-default-rtdb.firebaseio.com",
  projectId: "pantry-trackerg",
  storageBucket: "pantry-trackerg.appspot.com",
  messagingSenderId: "741344411462",
  appId: "1:741344411462:web:bc731621b2b542ce37ef47",
  measurementId: "G-QXG0S3YW3H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);


export { firestore };
import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyBa5hz3kpjkltmF-aq1JmNkjgskbw3zFz4",
    authDomain: "tajweedmentor.firebaseapp.com",
    projectId: "tajweedmentor",
    storageBucket: "tajweedmentor.appspot.com",
    messagingSenderId: "1060466717857",
    appId: "1:1060466717857:web:09cf89cb5bc7ded09d2ce0",
    measurementId: "G-RFWM3ZZ255"
  };
  if (!firebase.getApps.length) {
    firebase.initializeApp(firebaseConfig);
  }
 
  

export default firebase;

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional


// // Initialize Firebase


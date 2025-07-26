// firebase.js
// Firebase configuration and initialization

export const firebaseConfig = {
  apiKey: "AIzaSyAyfsonnOU2zsmoZsbyEgA6X7cB9iwtCb8",
  authDomain: "notesapp-a8f31.firebaseapp.com",
  projectId: "notesapp-a8f31",
  storageBucket: "notesapp-a8f31.firebasestorage.app",
  messagingSenderId: "184190884818",
  appId: "1:184190884818:web:a86c86b795909bb313860b",
  measurementId: "G-VETZF2K6F3"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.firestore();

import firebase from "firebase";
import "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtFt6PO2hOfSN2YlatohKgMFyZBhfCEwo",
  authDomain: "simple-social-media-ab58e.firebaseapp.com",
  projectId: "simple-social-media-ab58e",
  storageBucket: "simple-social-media-ab58e.appspot.com",
  messagingSenderId: "739253825141",
  appId: "1:739253825141:web:2c83348a8c6ed29b74923c",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
export { auth, provider };
export default db;

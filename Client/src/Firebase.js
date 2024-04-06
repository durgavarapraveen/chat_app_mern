import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC3iGtqlw3cPNAeJCTrXOZFfu-NlB8ppaE",
  authDomain: "chat-app-84f82.firebaseapp.com",
  projectId: "chat-app-84f82",
  storageBucket: "chat-app-84f82.appspot.com",
  messagingSenderId: "847153028046",
  appId: "1:847153028046:web:edbc2dca2d15a5b673699f",
  measurementId: "G-79E0H8DNFS",
};

export const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIue5iOsEB1lh9arC9RUmtjUj8e7ansFA",
  authDomain: "webpreguntas-9fd83.firebaseapp.com",
  projectId: "webpreguntas-9fd83",
  storageBucket: "webpreguntas-9fd83.appspot.com",
  messagingSenderId: "135916464525",
  appId: "1:135916464525:web:ecd44927d9d34d42bc35c4",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;

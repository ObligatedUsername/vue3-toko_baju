import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD71-fQOcPcZaE_YGhU8MgIVQCLUfORhhQ",
    authDomain: "toko-baju-cc9e3.firebaseapp.com",
    projectId: "toko-baju-cc9e3",
    storageBucket: "toko-baju-cc9e3.appspot.com",
    messagingSenderId: "233221604192",
    appId: "1:233221604192:web:601511cfc4c3579a8b1405"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;

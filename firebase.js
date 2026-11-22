import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyBgsJ8lDq3Z1eieDq3XA8iZ8GXRRVTCBzQ",

    authDomain: "sgf-mobile-ed9e4.firebaseapp.com",

    projectId: "sgf-mobile-ed9e4",

    storageBucket: "sgf-mobile-ed9e4.firebasestorage.app",

    messagingSenderId: "621381698475",

    appId: "1:621381698475:web:7ae3bae855857a7b9708ee"

};

const app = initializeApp(
    firebaseConfig
);

const db = getFirestore(
    app
);

window.firebaseDB = db;
window.firebaseDoc = doc;
window.firebaseGetDoc = getDoc;
window.firebaseSetDoc = setDoc;
window.firebaseOnSnapshot = onSnapshot;
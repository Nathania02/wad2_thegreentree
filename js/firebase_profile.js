// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB930wEyfKpI2gBvgAUprBKWqhcbmcKJzk",
    authDomain: "wad2thegreentree.firebaseapp.com",
    databaseURL: "https://wad2thegreentree-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "wad2thegreentree",
    storageBucket: "wad2thegreentree.appspot.com",
    messagingSenderId: "731944801799",
    appId: "1:731944801799:web:ac8492d32f75b71ba3fca2",
    measurementId: "G-M4GNGPS1MD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth()

// collection ref
const colRef = collection(db, 'users');

// get collection data
getDocs(colRef)
    .then((snapshot) => {
        let users = []
        snapshot.docs.forEach((doc) => {
            users.push({ ...doc.data(), id: doc.id })
            // get data and id of array 
        })
        console.log(users)
    })
    .catch(err => {
        console.log(err.message)
    })

// signup 
const signUpForm = document.getElementById('signUpForm');
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = signUpForm.email.value
    console.log(email)
    const password = signUpForm.password.value
    console.log(password)
    //change later cause need check if valid
    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log('user created: ', cred.user)
            signUpForm.reset()
        })
        .catch((err) => {
            console.log(err.message)
        })
})


const analytics = getAnalytics(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// own functions
import { checkIfPasswordValid } from "./signup.js"

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
const auth = getAuth();

// collection ref
const colRef = collection(db, 'users');

// get collection data
getDocs(colRef)
    .then((snapshot) => {
        let users = [];
        snapshot.docs.forEach((doc) => {
            users.push({ ...doc.data(), id: doc.id });
            // get data and id of array 
        })
    })
    .catch(err => {
        console.log(err.message);
    })

onAuthStateChanged(auth, (user) => {
    console.log('user status changed: ', user);
})

const signUpAndAddToFirestore = (email, password) => {
    // Create user with email and password
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Add user data to Firestore
            addDoc(colRef, {
                userId: user.uid,
                email: user.email,
                password: user.password,
            })
                .then(() => {
                    console.log('User added to Firestore:', user.uid);
                })
                .catch((error) => {
                    console.error('Error adding user to Firestore:', error);
                });
        })
        .catch((error) => {
            console.error('Error creating user:', error);
        });
};

if (window.location.pathname.includes('signUp.html')) {
    // signup 
    const signUpForm = document.getElementById('signUpForm');
    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = signUpForm.email.value;
        const password = signUpForm.password.value;
        const confirmPassword = signUpForm.confirmPassword.value;

        let consolidatedErrors = [];

        // check if password valid
        const errors = checkIfPasswordValid(password, confirmPassword);
        for (err of errors) {
            consolidatedErrors.push(err);
        }

        if (consolidatedErrors.length == 0) {
            alert('Signup successful! Enjoy The Green Tree!');
            // Call the function to sign up and add user to Firestore
            signUpAndAddToFirestore(email, password);
        }
        else {
            for (err of consolidatedErrors) {
                alert(err);
            }
        }
    })
}
else if (window.location.pathname.includes('login.html')) {
    // login
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                window.location.href = 'profile.html';
            })
            .catch((err) => {
                console.log(err.message);
            })
    })
}

else if (window.location.pathname.includes('profile.html')) {
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                // console.log('user signed out')
                window.location.href = 'index.html';
            })
            .catch((err) => {
                console.log(err.message);
            })
    })
}

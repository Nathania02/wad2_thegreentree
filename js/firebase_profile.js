// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query, where } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
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

// check whether user signed in
onAuthStateChanged(auth, (user) => {
    console.log('User status changed: ', user);
})

// outputs user details
async function getUserData(userId) {
    try {
        const displayUserKey = document.getElementById('displayUserKey');
        const displayUserData = document.getElementById('displayUserData');
        const q = query(collection(db, "users"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let data = JSON.parse(JSON.stringify(doc.data()));
            let keyOrder = ['username', 'name', 'email', 'mobile', 'address', 'gender', 'dateofbirth'];
            let newUserObject = rearrangeObjectKeys(data, keyOrder);
            console.log(newUserObject);
            for (var field in newUserObject) {
                displayUserKey.innerHTML += `<p class="pb-4">${field}</p>`;
                displayUserData.innerHTML += `<p class="pb-4">${newUserObject[field]}</p>`;
            }
        })
    }
    catch (err) {
        console.log(err.message);
    }
};

// rearranges keys so that it displays in the same order everytime
function rearrangeObjectKeys(originalObject, keyOrder) {
    const reorderedObject = {};

    keyOrder.forEach(key => {
        if (originalObject.hasOwnProperty(key)) {
            reorderedObject[key] = originalObject[key];
        }
    });
    return reorderedObject;
}

// collection ref for users 
const userCollection = collection(db, 'users');

// // collection ref for posts
const postCollection = collection(db, 'post');

// // collection ref for orders
const ordersCollection = collection(db, 'orders');

const signUpAndAddToFirestore = (email, password) => {
    // Create user with email and password
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Add user data to Firestore
            addDoc(userCollection, {
                userId: user.uid,
                email: user.email,
            })
                .then(() => {
                    window.location.href = 'profile.html';
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
    const displayErrors = document.getElementById('displayErrors');
    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = signUpForm.email.value;
        const password = signUpForm.password.value;
        const confirmPassword = signUpForm.confirmPassword.value;

        // check if password valid
        const errors = checkIfPasswordValid(password, confirmPassword);

        if (errors.length == 0) {
            alert('Signup successful! Enjoy The Green Tree!');
            // Call the function to sign up and add user to Firestore
            signUpAndAddToFirestore(email, password);
        }
        else {
            for (var err of errors) {
                // console.log(err)
                displayErrors.innerHTML += `<li>${err}</li>`;
                signUpForm.reset();
            }
        }
    })
}
else if (window.location.pathname.includes('login.html')) {
    // login
    const loginForm = document.getElementById('loginForm');
    const authDisplay = document.getElementById('authDisplay');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                window.location.href = 'profile.html';
            })
            .catch((err) => {
                console.log(err);
                let errorMessage = 'Error logging in. Please check your credentials and try again.';

                if (err.code == 'auth/user-not-found') {
                    errorMessage = 'User not found. Please sign up to create an account.';
                } else if (err.code == 'auth/wrong-password') {
                    errorMessage = 'Incorrect password. Please try again'
                } // CHANGE THIS CODE 
                authDisplay.innerHTML += `${errorMessage}<br>`;
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

    onAuthStateChanged(auth, (user) => {
        console.log('User status changed: ', user);
        const userId = user.uid;
        getUserData(userId);
    })
}

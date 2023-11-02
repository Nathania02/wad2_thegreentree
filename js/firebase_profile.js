// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, query, where, doc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
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

function checkUserLoginStatus() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is logged in
                resolve({ loggedIn: true, user });
            } else {
                // User is not logged in
                resolve({ loggedIn: false, user: null });
            }
        }, (error) => {
            // An error occurred while checking the login status
            reject(error);
        });
    });
}

export { query, db, checkUserLoginStatus };

const profileLink = document.getElementById('profile_link');
const shopping_cart = document.getElementById('shopping_cart');
const listing_button = document.getElementById('list_item');
const atc_btn = document.getElementById('atc_btn_mkt');



checkUserLoginStatus()
    .then((result) => {
        if (result.loggedIn) {
            // User is logged in
            console.log('User is logged in:', result.user);
            profileLink.href = 'profile.html';
            shopping_cart.style.display = 'block';
            listing_button.style.display = 'block';
        

        } else {
            // User is not logged in
            console.log('User is not logged in.');
            atc_btn.style.display = 'none';
            profileLink.href = 'login.html';
        }
    })
    .catch((error) => {
        console.error('Error checking user login status:', error);
    });

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

// outputs user details
async function getUserData(userId) {
    try {
        const displayUserData = document.getElementById('displayUserData');
        const q = query(collection(db, "users"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let data = JSON.parse(JSON.stringify(doc.data()));
            let keyOrder = ['username', 'name', 'email', 'phoneNo', 'address', 'gender', 'dateofbirth'];
            let newUserObject = rearrangeObjectKeys(data, keyOrder);
            console.log(newUserObject);
            for (var field in newUserObject) {
                displayUserData.innerHTML += `<p class="pb-4">${newUserObject[field]}</p>`;
            }
        })
    }
    catch (err) {
        console.log(err.message);
    }
};

const createUserInFirestore = async (uid, username, email) => {
    const userDocRef = doc(db, 'users', uid);
    const userData = {
        userId: uid,
        username: username,
        name: '',
        email: email,
        phoneNo: '',
        address: '',
        gender: '',
        dateofbirth: '',
    };

    try {
        await setDoc(userDocRef, userData);
        console.log('User document created successfully.');
    } catch (error) {
        console.error('Error creating user document:', error);
    }
    window.location.href = 'addDetails.html';
};

if (window.location.pathname.includes('signUp.html')) {
    // signup 
    const signUpForm = document.getElementById('signUpForm');
    const displayErrors = document.getElementById('displayErrors');
    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = signUpForm.username.value;
        const email = signUpForm.email.value;
        const password = signUpForm.password.value;
        const confirmPassword = signUpForm.confirmPassword.value;
        displayErrors.innerHTML = '';

        // check if password valid
        const errors = checkIfPasswordValid(password, confirmPassword);

        if (errors.length == 0) {
            // Create user with email and password
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const uid = userCredential.user.uid;

                    // Create user in firestore
                    createUserInFirestore(uid, username, email);
                })
                .catch((error) => {
                    if (error.code == 'auth/email-already-in-use') {
                        displayErrors.innerHTML += `<p>Email already has an account</p>`
                        signUpForm.reset();
                    }
                });
        }
        else {
            for (var err of errors) {
                displayErrors.innerHTML += `<p>${err}</p>`;
            }
        }
        signUpForm.reset();
    })
}

else if (window.location.pathname.includes('addDetails.html')) {
    const addDetails = document.getElementById('addDetails');
    addDetails.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = addDetails.name.value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const phoneNo = addDetails.phoneNo.value;
        const DoB = addDetails.dob.value;
        const address = addDetails.address.value;

        onAuthStateChanged(auth, (user) => {
            console.log('User status changed: ', user);
            const userId = user.uid;
            setDoc(doc(db, 'users', userId), {
                name: name,
                gender: gender,
                phoneNo: phoneNo,
                dateofbirth: DoB,
                address: address
            }, {merge: true})
            .then(() => {
                console.log('Entire data has been updated successfully');
                window.location.href = 'profile.html';
            })
            .catch(error => {
                console.log(error);
            })
        })
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
        authDisplay.innerHTML = '';
        
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                window.location.href = 'profile.html';
            })
            .catch((err) => {
                console.log(err);
                let errorMessage = 'Error logging in. Please check your credentials and try again.';
                authDisplay.innerHTML += `${errorMessage}`;
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

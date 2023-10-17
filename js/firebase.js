// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
    import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
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
  console.log(db);
  const querySnapshot = await getDocs(collection(db, 'users'));

    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
    });
  const analytics = getAnalytics(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
// import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getFirestore, collection, addDoc, getDocs, setDoc, query, where, doc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
// import { set, ref } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
// import { ref as sRef } from 'firebase/storage'; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// import { checkUserLoginStatus } from "../firebase_profile";

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
const communities = await getDocs(collection(db, 'communities'));
const posts = await getDocs(collection(db, 'posts'));
const comments = await getDocs(collection(db, 'comments'));

var communitiesList = communities.docs.map(doc => doc.data());
var postList = posts.docs.map(doc => doc.data());
var commentsList = comments.docs.map(doc => doc.data());

const lastPageURL = document.referrer;

var url  = lastPageURL.split("_");
var url = url[2].split(".");
var community_category = url[0];

for(var j of communitiesList){
var name = j.name;
if(name.toLowerCase()==community_category){
    var id = j.id;
    }
}


// creating of post
var upload_picture = document.getElementById("input_file");
var topic_title = document.getElementById("topic_title");
var topic_about = document.getElementById("topic_about");
var post = document.getElementById("create_post");

const createPostInFirestore = async() => {
    const postRef = doc(collection(db, "posts"));
    const postDataRef = {
        // postid: post_id,
        title: topic_title.value,
        desc: topic_about.value,
        communityid: id,
        followercount: 0
        // picture: upload_picture.value
    }
    try{
        await setDoc(postRef, postDataRef);
        console.log("Post document created successfully");
    } catch(error) {
        console.log("Error creating post documnet:", error);
    }
}

post.addEventListener("click", createPostInFirestore);




// function create_post() {
//   console.log("hello");
//   set(sRef(db, "posts/"), {
//     title: topic_title.value,
//     about: topic_about.value,
//   }
//   .then(()=>{
//     alert("Post uploaded successfully");
//   })
//   .catch(()=>{
//     alert("There were some issues, try again")
//   })
//   )
// }

// const create_post = async (topic_title, topic_about, upload_picture) => {
    // checkUserLoginStatus()
    // .then((result) => {
    //     if (result.loggedIn) {
    //         // User is logged in
    //         console.log('User is logged in:', result.user);
    //     } else {
    //         // User is not logged in
    //         console.log('User is not logged in.');
    //         profileLink.href = 'login.html';
    //     }
    // })
    // .catch((error) => {
    //     console.error('Error checking user login status:', error);
    // });

//   const postDocRef = doc(db, 'posts');
//   const postData = {
//       title: topic_title,
//       desc: topic_about,
//       resources: upload_picture,
//   };
//   console.log("hello");
//   try {
//       await setDoc(postDocRef, postData);
//       console.log('Post uploaded successfully.');
//   } catch (error) {
//       console.error('Error creating post:', error);
//   }
// };

// create_post()
//   .then(()=>{
//     alert("Post uploaded successfully");
//   })
//   .catch(()=>{
//     alert("There were some issues, try again")
//   })

// delete comment




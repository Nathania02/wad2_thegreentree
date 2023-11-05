// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
// import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getFirestore, collection, addDoc, getDocs, setDoc, query, where, doc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

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
// const storage = getStorage();

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
        console.log("hello");
        var id = j.id;
        }
}

console.log(id);

// creating of post
// checkUserLoginStatus().then((result) => {
//     if(result.loggedIn){
//         var images = Array.from(ref.images_input.files);
//         getImages();
//     }
// })

// async function getImages(){
//     const imageUrls = await Promise.all(images.map)

// }

var rows = "";

var upload_picture = document.getElementById("input_file");
// console.log(upload_picture.file);
var topic_title = document.getElementById("topic_title");
var topic_about = document.getElementById("topic_about");
var post = document.getElementById("create_post");

const createPostInFirestore = async() => {
    // var storageRef = storage.ref();
    // if(upload_picture.length == 1){
    //     var imageRef = storageRef.child("images/" + upload_picture[0].name)
    //     imageRef.put()
    // } else{
    //     for(var i=0;i<upload_picture.length; i++){
    //         var imageRef = storageRef.child("images/" + upload_picture[i].name)
    //     }
    // }

    const postRef = doc(collection(db, "posts"));
    const postDataRef = {
        // postid: doc_ref.id,
        title: topic_title.value,
        desc: topic_about.value,
        communityid: id,
        followercount: 0
        // picture: upload_picture.value
    }
    try{
        event.preventDefault();
        await setDoc(postRef, postDataRef);
        alert("Post document created successfully");
        // rows += "<div class='modal fade' id='myModal' role='dialog'>"
        // + "<div class='modal-dialog'>"
        // + "<div class='modal-content'>"
        // +"<div class='modal-header'>"
        // +"<button type='button' class='close' data-dismiss='modal'>&times;</button>"
        // +"<h4 class='modal-title'>Modal Header</h4>"
        // +"</div><div class='modal-body'>"
        // +"<p>Some text in the modal.</p></div>"
        // +"<div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>"
        // +"</div></div>"
        // +"<div class='modal-footer'>"
        // +"<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button></div></div>"
        // +"</div></div>";
        // document.getElementById("button_create_post").innerHTML += rows;
    } catch(error) {
        event.preventDefault();
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




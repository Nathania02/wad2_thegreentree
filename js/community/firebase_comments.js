// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
// import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getFirestore, collection, addDoc, getDocs, setDoc, deleteDoc, query, where, doc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';

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


const communities = await getDocs(collection(db, 'communities'));
const posts = await getDocs(collection(db, 'posts'));
const comments = await getDocs(collection(db, 'comments'));
const users = await getDocs(collection(db, 'users'));

var communitiesList = communities.docs.map(doc => doc.data());
var postList = posts.docs.map(doc => doc.data());
var commentsList = comments.docs.map(doc => doc.data());
var usersList = users.docs.map(doc => doc.data());

var comments_array = []
var commentslist = query(collection(db, "comments"));
const querySnapshot = await getDocs(commentslist);
querySnapshot.forEach((doc) => {
  var docData = doc.data();
  console.log(docData);
  docData["commentsid"] = doc.id;
  comments_array.push(docData);
})

var queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var post_id = urlParams.get("postid");
var post_title = urlParams.get("posttitle");

for(var i of commentsList){
  var postid = i.postid;
  for(var j of postList){
    if(j.id==postid){
      var community_id = j.communityid;
      for(var k of communitiesList){
        if(k.id==community_id){
          var name = k.name;
        }
      }
    }
  }
}

if(document.getElementById("category")){
  document.getElementById("category").innerText = "Category: "+ name;
}

if(document.getElementById("title")){
  document.getElementById("title").innerText = "Title: "+ post_title;
}

//retrieving of comments
function retrieveComments(){
  try{
     var rows = "";
     var comments_list = [];
        for(var comment of comments_array){
          if(comment.postid == post_id){
            comments_list.push(comment.postid);
            }
          }
        if(comments_list.length != 0) {
          for(var comment of comments_array){
            if(comment.postid == post_id){  
              for(var user of usersList){
                if(user.userId == comment.userid){
                  rows +=
                  "<div class='container-fluid' id='postcontainer'>"
                  +"<div class='container-fluid' id='comment_container'>"
                  +"<p id='post'>"+comment.desc+"</p>"
                  +"<p id='username'>Commented By: "+user.username+"</p>"
                  +"<button id='delete'><img id='delete_img' src='images/bin.png'></button>"
                  +"<button id='like' @click='likeComment'><img id='like_img' src='images/thumb-up.png'></button>"
                  +"<button id='dislike' @click='dislikeComment'><img id='dislike_img' src='images/thumb-down.png'></button>"
                  +"</div></div><br/>";
                }
              }
            } 
          }
        } else{
          rows += "<p id='no-comments'>No Commments for now...Be the first to comment!</p>"; 
        }
        if(document.getElementById("comments_container")){
          document.getElementById("comments_container").innerHTML = rows;  
        }
      } catch (error) {
        console.log("Error retrieving comments", error);
      }
    }

retrieveComments()

checkUserLoginStatus() 
  .then((result) => {
    if(result.loggedIn){
      const postcomments_app = Vue.createApp({
        data(){
          return{
            description: "",
            postid: post_id,
            user_id: result.user.uid
          }
        },
        methods: {
          async post_comments(){
            this.description = document.getElementById("comments").value;
            var queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            this.post_id = urlParams.get("postid");
  
  
            let commentRef = doc(collection(db, "comments"));
            let commentDataRef = {
              desc: this.description,
              likecount: 0,
              dislikecount: 0,
              postid: post_id,
              userid: this.user_id
            }
            await setDoc(commentRef, commentDataRef)
            .then(() => {
              console.log("Comment created");
              window.location.reload();
            })
            .catch((error) => {
              console.log("Error creating comment documnet:", error);
            })
          }
        }
      }).mount("#main");
    } else {
      const nopostcommments_app = Vue.createApp({
        methods: {
          async post_comments(){
            alert("Please log in to post a comment");
          }
        }
      }).mount("#main");
    }
  })  




//delete comments
// async function delete_comments() {
//   console.log("hello");
//   try{
//     await deleteDoc(doc(db, "comments", 1));
//     console.log("Comment document deleted successfully");
//   } catch(error) {
//     console.log("Error deleting comment documnet:", error);
//   }
// }

// var deleteCommentbtn = document.getElementById("delete");
// deleteCommentbtn.addEventListener("click", delete_comments);



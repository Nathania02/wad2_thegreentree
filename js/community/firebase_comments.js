// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
// import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getFirestore, collection, addDoc, getDocs, setDoc, deleteDoc, updateDoc, query, where, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
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
var posts_array = []
var users_array = []

var commentslist = query(collection(db, "comments"));
var postlist = query(collection(db, "posts"));
var userslist = query(collection(db, "users"));

const querySnapshot_comments = await getDocs(commentslist);
const querySnapshot_post = await getDocs(postlist);
const querySnapshot_users = await getDocs(userslist);


querySnapshot_comments.forEach((doc) => {
  var docData = doc.data();
  docData["commentsid"] = doc.id;
  comments_array.push(docData);
})


querySnapshot_post.forEach((doc) => {
  var docData_post = doc.data();
  posts_array.push(docData_post);
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

function getDescForModal(){
    for(var post of posts_array){
    if(post.title == post_title) {
      var desc = post.desc;

      if(document.getElementById("topic_desc")) {
        document.getElementById("topic_desc").innerText = desc;
      }
      
    }
  }
}



if(document.getElementById("category")) {
  document.getElementById("category").innerText = "Category: "+ name;
}

if(document.getElementById("title")) {
  document.getElementById("title").innerText = "Title: "+ post_title;
}

getDescForModal();
retrieveComments();


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
                  console.log(comment.likecount);
                  // var number_of_likes = comment.likecount;
                  rows +=
                  "<div class='container-fluid' id='postcontainer'>"
                  +"<div class='container-fluid' id='comment_container'>"
                  +"<p id='post'>"+comment.desc+"</p>"
                  +"<p id='username'>Commented By: "+user.username+"</p>"
                  +"<p id='likes' class='"+comment.commentsid+"'>Likes: "+comment.likecount+"</p>"

                  // +"<p v-else id='likes' class='"+comment.commentsid+">Likes: "+comment.likecount+"</p>"
                  +"<p id='dislikes'>Dislikes: "+comment.dislikecount+"</p>"
                  +"<button id='delete' @click='delete_comment'><img id='delete_img' src='images/bin.png'></button>"
                  +"<button id='like' @click='add_like'><img id='like_img' src='images/thumb-up.png'></button>"
                  +"<button id='dislike' @click='add_dislike'><img id='dislike_img' src='images/thumb-down.png'></button>"
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


checkUserLoginStatus() 
  .then((result) => {
    if(result.loggedIn){
      const postcomments_app = Vue.createApp({
        data(){
          return{
            description: "",
            postid: post_id,
            user_id: result.user.uid,
            likes: 0,
            disliked: 0,
            comment_id: ""
          }
        },
        methods: {
          async post_comments() {
            this.description = document.getElementById("comments").value;
            var queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            this.post_id = urlParams.get("postid");

            querySnapshot_comments.forEach((doc) => {
              var docData = doc.data();
              docData["commentid"] = doc.id;
              comments_array.push(docData);
            })            
  
            let commentRef = doc(collection(db, "comments"));
            let commentDataRef = {
              desc: this.description,
              likecount: 0,
              dislikecount: 0,
              postid: post_id,
              userid: this.user_id,
            }
            await setDoc(commentRef, commentDataRef)
            .then(() => {
              console.log("Comment created");
              window.location.reload();
            })
            .catch((error) => {
              console.log("Error creating comment documnet:", error);
            })
          },
          
          async add_like() {
            const comment_desc = document.getElementById("post").innerText;
            for(var comment of comments_array){
              console.log(comments_array);
              if(comment.desc == comment_desc){
                var id_comment = comment.commentsid;
                const data = {
                  likecount: this.likes+1
                }
                let updatecommentRef = doc(db, "comments", id_comment);
                await updateDoc(updatecommentRef, data)
                .then(() => {
                  console.log("documnet updated");
                  // const documentRef = doc(db, "comments", id_comment);
                  // const updates = onSnapshot(doc(db, "comments", id_comment), (doc) => {
                  //   if(doc.exists) {
                  //     var updated_data = doc.data();
                  //     console.log(updated_data);
                  //     var likecount = updated_data.likecount;
                  //     for(comment of comments_array){
                  //       if(comment.commentsid == id_comment){
                  //         comments_array[comment] == updated_data;
                          // document.getElementsByClassName(id_comment)[0].innerText = "Likes: " + this.likes++;

                          // retrieveComments();
                      //   }
                      // }
                      // console.log(comments_array);
                      // console.log(likecount);
                    // }
                  // })
                  
                  document.getElementsByClassName(id_comment)[0].innerText = "Likes: " + this.likes++;
                  // window.location.reload();
                }) 
                .catch((error) => {
                  console.log(error);
                })
    
              }
            }
          },

          add_dislike() {
            this.dislike++;
            
          },

          async delete_comment() {
            const comment_desc = document.getElementById("post").innerText;
            for(var comment of comments_array){
              if(comment.desc == comment_desc){
                var id_comment = comment.commentsid;
                var id_user = comment.userid;

                // for(var user of users_array){
                //   console.log(user.userId);
                //   console.log(id_user);
                  if(this.user_id == id_user) {
                    await deleteDoc(doc(db, "comments", id_comment))
                    .then(() => {
                      console.log("Document succesfully deleted");
                      window.location.reload();
                    })
                    .catch((error) => {
                      console.log("Unable to delete document", error);
                    })
                  } else {
                    alert("You are unable to delete this comment as you are not the creator.");
                    break;
                  }
                }
              // }
            } 
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



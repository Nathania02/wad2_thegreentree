// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, where, query } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

"https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.18/vue.min.js"

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

checkUserLoginStatus()
  .then((result) => {
      var rows = "";
      // console.log(result.loggedIn);
      if(result.loggedIn){
          rows += "<button id='createPost'><img id='plus' src='images/plus.png'><a href='community_createpost.html'> Create"
          +"Post</a></button>";
          document.getElementById("heading").innerHTML += rows;
      }
  })

const communities = await getDocs(collection(db, 'communities'));
const posts_collection = await getDocs(collection(db, 'posts'));
const users = await getDocs(collection(db, 'users'));

var communitiesList = communities.docs.map(doc => doc.data());
var postList = posts_collection.docs.map(doc => doc.data());
var usersList = users.docs.map(doc => doc.data());

var comments_array = [];
var post_array = [];
var comments = query(collection(db, "comments"));
var posts = query(collection(db, "posts"));
const querySnapshot_comments = await getDocs(comments);
const querySnapshot_post = await getDocs(posts)

querySnapshot_comments.forEach((doc) => {
  var docData = doc.data();
  docData["postid"] = doc.id;
  comments_array.push(docData);
})

querySnapshot_post.forEach((doc) => {
  var docData = doc.data();
  docData["postid"] = doc.id;
  post_array.push(docData);
})

var currentUrl = window.location.href;

var url = currentUrl.split("_");
var url = url[2].split(".");
var community_category = url[0];

retrievePosts();


// function retrievePosts(){
//   var rows = "";
//   for(var j of communitiesList){
//     var name = j.name;
//     if( /[0-9]/.test(community_category)) {
//       var title = community_category;
//     } else {
//         if(name.toLowerCase()==community_category){
//           var id = j.id;
//           var title = name;
//       }
//     }
//         for(var i of postList){
//           if(i.communityid==id){
//             // var post_array = postList;
//               var topic_title = i.title;
//             var followercount = i.followercount;
//             var description = i.desc;

//             for(var post of post_array){
//               if(topic_title == post.title){
//                 var post_id = post.postid;
//                 for(var user of usersList){
//                   if(user.userId == post.userid){
//                     var images = post.images;
//                     var image = images[0];
                
//                     rows +=
//                     "<div class='col'>"
//                     +"<button id='post' type='button'><a id='postButton' href='community_comments.html?communityid="+id+"&postid="+post_id+"&posttitle="+topic_title+"'>"
//                     +"<h3>"+topic_title+"</h3>"
//                     +"<h5>Total Followers: "+followercount+"</h5>"
//                     // +"<button id='follow' type='button'>Follow</button>"
//                     +"<div class='container' id='postimage_container'>"
//                     +"<img id='post_image' src='"+image+"'>"
//                     +"<p id='about'>About: <br/>"+description+"<p>"
//                     +"</div><br/>"
//                     +"<p id='username'>Created By: "+user.username+"</p>";        
//                     +"<div class='col-12'>"
//                     +"<div id='carouselExampleControls' class='carousel slide' data-ride='carousel'>"
//                     +"<div class='carousel-inner'>";
//                     +"</a></button></div></div>";
//                     +"</div>"
//                   }
//                 }
//               }
//             }
//           }
//         }
//     }
//     document.getElementById("main").innerHTML += rows;
//     document.getElementById("category").innerText = "Topics under " + title;
  
//   }


  function retrievePosts(){
    var rows = "";
    for(var j of communitiesList){
      var name = j.name;
      if(name == community_category){
        var title = community_category;
        var id=j.id;
        for(var i of postList){
          if(i.communityid==id){
            var topic_title = i.title;
            var followercount = i.followercount;
            var description = i.desc;
  
            for(var post of post_array){
              if(topic_title == post.title){
                var post_id = post.postid;
                for(var user of usersList){
                  if(user.userId == post.userid){
                    var images = post.images;
                    var image = images[0];
                
                    rows +=
                    "<div class='col'>"
                    +"<button id='post' type='button'><a id='postButton' href='community_comments.html?communityid="+id+"&postid="+post_id+"&posttitle="+topic_title+"'>"
                    +"<h3>"+topic_title+"</h3>"
                    +"<h5>Total Followers: "+followercount+"</h5>"
                    // +"<button id='follow' type='button'>Follow</button>"
                    +"<div class='container' id='postimage_container'>"
                    +"<img id='post_image' src='"+image+"'>"
                    +"<p id='about'>About: <br/>"+description+"<p>"
                    +"</div><br/>"
                    +"<p id='username'>Created By: "+user.username+"</p>";        
                    +"<div class='col-12'>"
                    +"<div id='carouselExampleControls' class='carousel slide' data-ride='carousel'>"
                    +"<div class='carousel-inner'>";
                    +"</a></button></div></div>";
                    +"</div>"
                    }
                  }
                }
              }
            }
          }  
        }  else {
          if(name.toLowerCase()==community_category){
            var id = j.id;
            var title = name;
            for(var i of postList){
              if(i.communityid==id){
                // var post_array = postList;
                  var topic_title = i.title;
                var followercount = i.followercount;
                var description = i.desc;
    
                for(var post of post_array){
                  if(topic_title == post.title){
                    var post_id = post.postid;
                    for(var user of usersList){
                      if(user.userId == post.userid){
                        var images = post.images;
                        var image = images[0];

                        rows +=
                        "<div class='col'>"
                    +"<button id='post' type='button'><a id='postButton' href='community_comments.html?communityid="+id+"&postid="+post_id+"&posttitle="+topic_title+"'>"
                    +"<h3>"+topic_title+"</h3>"
                    +"<h5>Total Followers: "+followercount+"</h5>"
                    // +"<button id='follow' type='button'>Follow</button>"
                    +"<div class='container' id='postimage_container'>"
                    +"<img id='post_image' src='"+image+"'>"
                    +"<p id='about'>About: <br/>"+description+"<p>"
                    +"</div><br/>"
                    +"<p id='username'>Created By: "+user.username+"</p>";        
                    +"<div class='col-12'>"
                    +"<div id='carouselExampleControls' class='carousel slide' data-ride='carousel'>"
                    +"<div class='carousel-inner'>";
                    +"</a></button></div></div>";
                    +"</div>"
      
                        // "<button id='post' type='button'><a id='postButton' href='community_comments.html?communityid="+id+"&postid="+post_id+"&posttitle="+topic_title+"'>"
                        // +"<h3>"+topic_title+"</h3>"
                        // +"<h5>Total Followers: "+followercount+"</h5>"
                        // // +"<button id='follow' type='button'>Follow</button>"
                        // +"<div class='container' id='postimage_container'>"
                        // +"<img id='post_image' src='"+image+"'>"
                        // +"<p id='about'>About: <br/>"+description+"<p>"
                        // +"</div><br/>"
                        // +"<p id='username'>Created By: "+user.username+"</p>";        
                        // +"<div class='col-12'>"
                        // +"<div id='carouselExampleControls' class='carousel slide' data-ride='carousel'>"
                        // +"<div class='carousel-inner'>";
                        // +"</a></button></div></div>";
                      }
                    }
                  }
                }
              }
            }  
          }
        }
      }
      
      document.getElementById("main_search").innerHTML += rows;
      document.getElementById("category").innerText = "Topics under " + title;
    }
  


// const fetchData = () => {
  // const comments_array = [];
  // const post_array = [];
  // var comments = query(collection(db, "comments"));
  // const querySnapshot_comments = getDocs(comments)
  // .then((querySnapshot_comments) => {
  //   querySnapshot_comments.forEach((doc) => {
  //     var docData = doc.data();
  //     docData["postid"] = doc.id;
  //     comments_array.push(docData);
  //   }) .catch((error) => {
  //     console.log("Error getting documents", error);
  //   });
  //   var posts = query(collection(db, "posts"));
  //   const querySnapshot_post = getDocs(posts)
  //   .then((querySnapshot_post) => {
  //     querySnapshot_post.forEach((doc) => {
  //     var docData = doc.data();
  //     docData["postid"] = doc.id;
  //     post_array.push(docData);
  //   })
  //  }).catch((error) => {
  //     console.log("Error getting documents", error);
  //   });
//     const search_app = Vue.createApp({
//       data() {
//         return {
//           post_items: post_array,
//           search: "",
//         };
//       },
//       methods: {
//         search_items() {
//           if (this.search.trim() === "") {
//             this.post_items = post_array;
//           } else {
//             const search_query = this.search.toLowerCase();
//             this.post_items = this.post_items.filter(topic => topic.title.toLowerCase().includes(search_query));
//             console.log(this.post_items);
//           }
//         }
//       },
//         components: {
//           'item-card' : {
//             props: ['topic'],
//             // data() {
//             //   return {
//             //     showButtons: false,
//             //   };
//             // },
//             template: `
//             "<button id='post' type='button'><a id='postButton' href='community_comments.html?communityid="+id+"&posttitle="+i.title+"'>"
//             "<h3>"+{{ topic.title }}+"</h3>"
//             "<h5>Total Followers: "+{{ topic.followercount}} +"</h5>"
//             "<p id='about'>About: <br/>"+{{ topic.desc }}+"<p></a></button>";
//             `
//           }
//         }
//       }).mount("#main")
//     };
// //   }).mount("#main")
// // };

// fetchData();





    // })
//   }).mount("#main")
  
//   // app.mount("#main");
// };

// fetchData();




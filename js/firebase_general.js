// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, where, query } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';

"https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.18/vue.min.js"

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
      if(result.loggedIn){
          rows += "<button id='createPost'><img id='plus' src='images/plus.png'><a href='community_createpost.html'> Create"
          +"Post</a></button>";
          document.getElementById("heading").innerHTML += rows;
      }
  })


retrievePosts();

  async function retrievePosts(){

    try{
      const communities = await getDocs(collection(db, 'communities'));
      const posts_collection = await getDocs(collection(db, 'posts'));
      const users = await getDocs(collection(db, 'users'));
      
      var communities_list = communities.docs.map(doc => doc.data());
      var users_list = users.docs.map(doc => doc.data());
      
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
      
      //sort the posts by dateposted
      
      post_array.sort(function(a,b){
        return b.dateposted - a.dateposted;
      });
      
      console.log(post_array);
      
      // store the date and time alone in a variable in the post array
      for(let post of post_array){
        post["date"] = post['dateposted'].toDate().toLocaleDateString();
        post["time"] = post['dateposted'].toDate().toLocaleTimeString();
      }
      
      var currentUrl = window.location.href;
      
      var url = currentUrl.split("_");
      var url = url[2].split(".");
      var community_category = url[0];
          var rows = "";
      for(var j of communities_list){
        var name = j.name;
        if(name == community_category){
          var title = community_category;
          var id=j.id;
    
              for(var post of post_array){
                if(post.communityid == id){
                  var topic_title = post.title;
                  var description = post.desc;
                  var post_id = post.postid;
                  var post_date = post.date;
                  var post_time = post.time;
                  for(var user of users_list){
                    if(user.userId == post.userid){
                      var images = post.images;
                      var image = images[0];
                  

                      rows += `
                      <div class="col-12 d-flex justify-content-center mb-4" id="post">
                          <a style="text-decoration:none;color:#5c7345;" href="community_comments.html?communityid=${id}&postid=${post_id}&posttitle=${topic_title}">
                              <div class="mt-2 topic-title d-flex justify-content-center mb-3">
                                  <h3>${topic_title}</h3>
                              </div>
                              <div class="row image-and-about">
                                  <div class="col-md-6 col-lg-6">
                                      <div class="image-container mb-5">
                                          <img class="w-100" src='${image}'>
                                      </div>
                                  </div>
                                  <div class="col-md-6 col-lg-6">
                                      <div class="about">
                                          <p id='about'>About: <br/>${description}</p>
                                      </div>
                                  </div>
                              </div>
                              <div class="createdby d-flex justify-content-center">
                                  <p id='username'>Created by <b> ${user.username} </b> on <b>${post_date}, ${post_time}</b></p>
                              </div>
                          </a>
                      </div>
                  `;
                      }
                    }
                
              }
            }  
          }  else {
            if(name.toLowerCase()==community_category){
              var id = j.id;
              var title = name;
      
              for(var post of post_array){
                if(post.communityid == id){
                  var topic_title = post.title;
                  var description = post.desc;
                  var post_id = post.postid;
                  var post_date = post.date;
                  var post_time = post.time;
                  for(var user of users_list){
                    if(user.userId == post.userid){
                      var images = post.images;
                      var image = images[0];


                  rows += `
                      <div class="col-12 d-flex justify-content-center mb-4" id="post">
                          <a style="text-decoration:none;color:#5c7345;" href="community_comments.html?communityid=${id}&postid=${post_id}&posttitle=${topic_title}">
                              <div class="mt-3 topic-title d-flex justify-content-center mb-3">
                                  <h3>${topic_title}</h3>
                              </div>
                              <div class="row image-and-about">
                                  <div class="col-md-6 col-lg-6">
                                      <div class="image-container">
                                          <img class="w-100" src='${image}'>
                                      </div>
                                  </div>
                                  <div class="col-md-6 col-lg-6">
                                      <div class="about mb-5">
                                          <p id='about'>About: <br/>${description}</p>
                                      </div>
                                  </div>
                              </div>
                              <div class="createdby d-flex justify-content-center">
                                  <p id='username'>Created by <b> ${user.username} </b> on <b>${post_date}, ${post_time}</b></p>
                              </div>
                          </a>
                      </div>
                  `;

                        }
                      }
                    }
                  }
                }
              }  
            }   
            document.getElementById("main_search").innerHTML += rows;
            document.getElementById("category").innerText = "Topics under " + title;         
      } catch (error) {
      alert("There has been an error: ", error);
    }
  }
  

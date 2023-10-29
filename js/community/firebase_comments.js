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
const communities = await getDocs(collection(db, 'communities'));
const posts = await getDocs(collection(db, 'posts'));
const comments = await getDocs(collection(db, 'comments'));

var communitiesList = communities.docs.map(doc => doc.data());
var postList = posts.docs.map(doc => doc.data());
var commentsList = comments.docs.map(doc => doc.data());

for(var i of commentsList){
  var postid = i.postid;
  for(var j of postList){
    if(j.id==postid){
      var community_id = j.communityid;
      for(var k of communitiesList){
        if(k.id==community_id){
          var name = k.name;
          var posttitle = j.title;
        }
      }
    }
  }
}

var rows = "";
for(var i of commentsList){
  console.log(i.desc);
    rows +=
    "<div class='container-fluid rounded' id='comment_container'>"
    +"<p id='post'>"+i.desc+"</p>"
    +"<img id='delete' src='images/bin.png' onclick='delete()'>"
    +"<img id='like' src='images/thumb-up.png' onclick='like()'>"
    +"<img id='dislike' src='images/thumb-down.png' onclick='dislike()''>"
    +"</div>";
  }
  
document.getElementById("category").innerText = "Category: "+name;
document.getElementById("title").innerText = "Title: "+posttitle;
document.getElementById("postcontainer").innerHTML = rows;

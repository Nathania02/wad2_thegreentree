// Importing functions from firebase AND the firebase profile to eliminate redundancy

import { collection, doc, getDoc, query, where, getDocs, deleteDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { db, checkUserLoginStatus } from '../firebase_profile.js';

// Check if user is logged in
checkUserLoginStatus().then((user) => {
  if (user) {
    console.log("User is logged in");

    // if user logged in, fetch data and send logged in user as parameter
    fetch_data(user);
  } else {

    //if user not logged in, fetch data without any parameters
    console.log("User is not logged in");
    fetch_data(null);
  }
});

async function fetch_data(user) {

  // Get the logged in user id if exists, or else declare as null
  let logged_in_user_id;

  if(user){
    logged_in_user_id = user.user.uid;
  }else{
    logged_in_user_id = null;
  }

  try {
    // Get the post ID & community ID from the URL
    const url_params = new URLSearchParams(window.location.search);
    const post_id = url_params.get('postid');
    const comm_id = url_params.get('communityid');

    // Define post info array & comments array
    const post_information_array = [];
    const comments_array = [];

    // Retrieve post information from the db
    const post_ref = doc(collection(db, "posts"), post_id);
    const postDoc = await getDoc(post_ref);

    if (postDoc.exists()) {
      const post_data = postDoc.data();
      post_data['post_id'] = postDoc.id;
      post_information_array.push(post_data);
    } else {
      console.error("Post not found");
    }

    // Retrieve community category from the db
    console.log(comm_id);

    const comm_query = query(collection(db, "communities"), where("id", "==", Number(comm_id)));    
    try {
      const querySnapshot_community = await getDocs(comm_query);
    
      querySnapshot_community.forEach((comm_doc) => {
        console.log("HI!");
        let docData = comm_doc.data();
        docData['community_id'] = comm_doc.id;
        post_information_array[0]['community_name'] = docData.name;
      });
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
    
    // Retrieve poster information from the database

    const u = doc(collection(db, "users"), post_information_array[0]['userid']);
    const querySnapshot_users = await getDoc(u);

    if (querySnapshot_users.exists()) {
      const user_data = querySnapshot_users.data();
      post_information_array[0]['poster'] = user_data.username;
    }else{
      console.error("User not found");
    }

    // Retrieve relevant comments and the poster username from the database
    const c = query(collection(db, "comments"), where("postid", "==", post_id));
    const querySnapshot = await getDocs(c);

    querySnapshot.forEach((doc) => {
      let docData = doc.data();
      docData['comment_id'] = doc.id;
      comments_array.push(docData);
    });

    for (let comment of comments_array){
      const uq = doc(collection(db, "users"), comment['userid']);
      const querySnapshot_user = await getDoc(uq);

      if (querySnapshot_user.exists()) {
        const user_data = querySnapshot_user.data();
        comment['commenter'] = user_data.username;
      }
    }

    post_information_array[0]['comments'] = comments_array;

    // Retrieve relevant likes from like table

    for (let comment of comments_array) {

      const l = query(collection(db, "likes"), where("postid", "==", comment.comment_id));
      const querySnapshot_likes = await getDocs(l);

      let likes_array = [];
      querySnapshot_likes.forEach((doc) => {
        let docData = doc.data();
        docData['like_id'] = doc.id;
        likes_array.push(docData);
      });
      comment['likes'] = likes_array;
    }

    // Create the vue instance
    const app = Vue.createApp({
      data(){
        return{
          logged_in_user_id: logged_in_user_id,
          post_information: post_information_array[0],
          comment: "",
        }
      },
      methods:{
        add_like(comm_id, likes_array){
          if(this.logged_in_user_id == null){
            alert("You must be logged in to like a comment");
          }else{
            let like_exists = false;
            for (let like of likes_array){
              if(like['userid'] == this.logged_in_user_id && like['postid'] == comm_id){
                like_exists = true;
                break;
              }
            }
            if(like_exists){
              alert("You have already liked this comment");
            }else{
              let like_ref = collection(db, "likes");
              let like_data_ref = {
                postid: comm_id,
                userid: this.logged_in_user_id,
              }
              addDoc(like_ref, like_data_ref)
              .then((doc_ref) => {
                console.log("Like created with ID: ", doc_ref.id );
                location.reload();
              })
              .catch((error) => {
                console.log("Error creating like document:", error);
              })
            }
          }


        },
        delete_comment(comm_id, comm_poster_id){
          let is_confirmed = confirm("Are you sure you want to delete this comment?");
          if(is_confirmed){
            if (logged_in_user_id == comm_poster_id){
              const comment_ref = doc(collection(db, "comments"), comm_id);
              deleteDoc(comment_ref).then(() => {
                console.log("Comment successfully deleted!");
                location.reload();
              })
            }else{
              alert("You cannot delete this comment");
            }
          }
        },
        async post_comments() {  
          if(this.logged_in_user_id == null){
            alert("You must be logged in to post a comment");
            return;
          }else{
            if(this.comment == ""){
              alert("Comment cannot be empty");
              return;
            }else{
              let comment_ref = collection(db, "comments");
              let comment_data_ref = {
              desc: this.comment,
              likecount: 0,
              dislikecount: 0,
              postid: this.post_information.post_id,
              userid: this.logged_in_user_id,
            }

          console.log(comment_data_ref);
          await addDoc(comment_ref, comment_data_ref)
          .then((doc_ref) => {
            console.log("Comment created with ID: ", doc_ref.id );
            location.reload();
          })
          .catch((error) => {
            console.log("Error creating comment document:", error);
          })
            }
          }
        },
      }
    }).mount("#main");
  } catch (error) {
    console.error("Error:", error);
  }
}





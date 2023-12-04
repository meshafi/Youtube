import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import 'firebase/firestore';
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBKFm4RCZzAI5vLfyNSdMYthcYXr1XQMno",
  authDomain: "auth-d8d78.firebaseapp.com",
  projectId: "auth-d8d78",
  storageBucket: "auth-d8d78.appspot.com",
  messagingSenderId: "140802878156",
  appId: "1:140802878156:web:074c154b5211bb51c4b069"
};

export const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
const provider= new GoogleAuthProvider();



export const signInWithGoogle= ()=>{
    signInWithPopup(auth,provider).then((result)=>{
       console.log(result);
    }).catch( (error)=>{
     console.log(error)
    })
 }
 
export const signOutUser = () => {
     signOut(auth)
       .then(() => {
         console.log('User signed out successfully');
       })
       .catch((error) => {
         console.error('Error signing out:', error.message);
       });
   };


export const db =getFirestore(app);

 async function createChannel(userId, channelTitle, uniqueName) {
  try {
    const channelRef = await addDoc(collection('channels').add({
      user_id: userId,
      channel_title: channelTitle,
      unique_name: uniqueName,
    }));
    console.log('Channel added with ID: ', channelRef.id);
    return channelRef.id;
  } catch (error) {
    console.error('Error adding channel: ', error);
  }
}

// Function to create a new comment
async function createComment(userId, videoId, commentContent) {
  try {
    const commentRef = await db.collection('comments').add({
      user_id: 1,
      video_id: videoId,
      comment_content: commentContent,
    });
    console.log('Comment added with ID: ', commentRef.id);
    return commentRef.id;
  } catch (error) {
    console.error('Error adding comment: ', error);
  }
}

// Function to create a new subscription
async function createSubscription(subscriberId, channelId) {
  try {
    const subscriptionRef = await db.collection('subscriptions').add({
      subscriber_id: subscriberId,
      channel_id: channelId,
    });
    console.log('Subscription added with ID: ', subscriptionRef.id);
    return subscriptionRef.id;
  } catch (error) {
    console.error('Error adding subscription: ', error);
  }
}

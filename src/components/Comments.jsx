import React,{useState,useEffect} from "react";
import styled from "styled-components";
import Comment from "./Comment";
import { db } from "../Firebase";
import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";



const Container = styled.div`
font-family:Sans-serif;
`;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color:white;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid white;
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
  color:white;
`;

const Comments = ({video,user}) => {
  const [commentText, setCommentText] = useState(""); 
  const [commentsData,setCommentsData]=useState([]);
  async function userComment(commentId, userId, commentText,videoId,commentTime) {
    try {
        const commentRef = await addDoc(collection(db, "comments"), {
          id: commentId,
          user_id:userId,
          text:commentText,
          video_id:videoId,
          time:commentTime
        });
        console.log("comment added with ID: ", commentRef.id);
    } catch (error) {
      console.error("Error managing subscription ", error);
    }
  }
  

  const onEnter = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const timestamp = currentDate.getTime();
    let id = `${year}${month}${day}${timestamp}`;
    let time=`${day}-${month}-${year}`;

    userComment(id,user.uid,commentText,video.id,time);
    setCommentText("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onEnter();
    }
  };




  const fetchCommentDetails = async () => {
    const querySnapshot = await getDocs(collection(db, "comments"));
    const matchingComments = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data };
      })
      .filter((comment) => video && comment.video_id === video.id);

    if (matchingComments.length > 0) {
      setCommentsData(matchingComments);
    }
  }
  useEffect(() => {
    fetchCommentDetails();
  }, [video,commentText]);

  return (
      user ? (
        <Container>
          <NewComment>
            <Avatar src={user && user.photoURL} />
            <Input
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </NewComment>
          {commentsData.map((comment, index) => (
            <Comment key={index} comment={comment} />
          ))}
        </Container>
      ) : (
        <h3>Sign in to post comment</h3>
      )
    );
};


export default Comments;
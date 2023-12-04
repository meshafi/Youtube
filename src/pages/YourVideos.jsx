import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { useUser } from "../context/UserContext";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  background-color: #202020;
  padding: 40px 30px;
  margin-top:50px;
`;

const YourVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "videos"));
        const videoData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          if (user) {
            if (data.user_id === user.uid) {
              console.log(user.uid);
              return { id: doc.id, ...data };
            } else {
              return null;
            }
          }
          return null; 
        });
      
        const filteredVideos = videoData.filter(video => video !== null);
        
        setVideos(filteredVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]); 
  

  if (loading) {
    return <div style={{height:"90vh" ,backgroundColor:"#202020"}}></div>
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    user?(
    <Container>
      {videos.map((video,index) => (
        <Card key={index} video={video} />
      ))}
    </Container>)
    :(
      <h1>Sign in </h1>
    )
  );
};

export default YourVideos;
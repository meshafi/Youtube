import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../Firebase";
import { useUser } from "../context/UserContext";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  background-color: #202020;
  padding: 40px 30px;
  margin-top: 50px;
  color:white;
`;

const Subscriptions = () => {
  const [channel, setChannel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useUser();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "subscriptions"));
        const subData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          if (user) {
            if (data.user_id === user.uid) {
              return { id: doc.id, ...data };
            }
          }
        });

        const filteredSubs = subData.filter((sub) => sub !== undefined);
        setChannel((prevSubs) => [
            ...prevSubs,
            ...filteredSubs.filter((sub) => sub && !prevSubs.some((prevSub) => prevSub.id === sub.id)),
          ]);
          


      } catch (error) {
        console.error("Error fetching videos:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoPromises = channel.map(async (chnl) => {
          const querySnapshot = await getDocs(
            query(
              collection(db, "videos"),
              where("channel_id", "==", chnl.channel_id)
            )
          );

          return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        });
        const allVideos = await Promise.all(videoPromises);

        const flattenedVideos = allVideos.flat();

        setVideos(flattenedVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [channel]);

  console.log(videos);

  if (loading) {
    return <div style={{ height: "90vh", backgroundColor: "#202020" }}></div>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  return user ? (
    <Container>
      {videos.map((video) => (
        <Card video={video} />
      ))}
    </Container>
  ) : (
    <Container>
        <h2>Sign in to see Subscribed Videos</h2>
    </Container>
  );
};

export default Subscriptions;

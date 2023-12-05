import React from "react";
import { Button } from "@mui/material";
import Comments from "../components/Comments";
import Card from "../components/Card";
import { useUser } from "../context/UserContext";
import { useState, useEffect } from "react";
import { db } from "../Firebase";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
const Video = () => {
  const [videos, setVideos] = useState([]);
  const user = useUser();
  const { id } = useParams();
  const [allVideoData, setAllVideoData] = useState([]);
  const [channel, setChannel] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  //video

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "videos"));
    const matchingVideo = querySnapshot.docs.find((doc) => {
      const data = doc.data();
      return data.id === id;
    });

    return querySnapshot.docs.map((doc) => doc.data());
  };

  useEffect(() => {
    const fetchVideoData = async () => {
      const allVideoData = await fetchData();
      if (allVideoData) {
        const matchingVideoData = allVideoData.find((data) => data.id === id);
        setVideos(matchingVideoData ? [matchingVideoData] : []);
        setAllVideoData(allVideoData);
      }
    };

    fetchVideoData();
  }, [id]);

  const fetchRelatedVideos = () => {
    if (videos.length > 0 && Array.isArray(videos[0].tag)) {
      const tagValue = videos[0].tag;

      const filteredVideos = allVideoData.filter(
        (video) => !videos.some((v) => v.id === video.id)
      );

      const newVideos = filteredVideos.filter(
        (video) =>
          Array.isArray(video.tag) &&
          video.tag.some((tag) => tagValue.includes(tag))
      );

      setVideos((prevVideos) => [...prevVideos, ...newVideos]);
    }
  };

  useEffect(() => {
    fetchRelatedVideos();
  }, [allVideoData]);

  //channel
  const fetchChannelDetails = async () => {
    const querySnapshot = await getDocs(collection(db, "channels"));
    const matchingChannel = querySnapshot.docs.find((doc) => {
      const data = doc.data();
      return data.user_id === videos[0]?.user_id;
    });

    if (matchingChannel) {
      setChannel(matchingChannel.data());
    }
  };

  useEffect(() => {
    fetchChannelDetails();
  }, [videos]);

  const fetchSubsriptionDetails = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "subscriptions"));
      const matchingSubs = querySnapshot.docs.some((doc) => {
        const data = doc.data();
        if(user){
        return (data.user_id==user.uid)&&(channel.id==data.channel_id);
        }
      });
      if(matchingSubs){
      setIsSubscribed(true);
      }
    } catch (error) {
      console.error("Error fetching subscription details:", error);
    }
  };

  useEffect(() => {
    if (!isSubscribed) fetchSubsriptionDetails();
  }, [channel,user]);


  //subscription
  async function subscribeVideo(subscriptionId, channelId, userId) {
    try {
      if (!isSubscribed) {
        const subsRef = await addDoc(collection(db, "subscriptions"), {
          id: subscriptionId,
          channel_id: channelId,
          user_id: userId,
        });
        console.log("Subscription added with ID: ", subsRef.id);
      } else {
        const subsQuery = query(
          collection(db, "subscriptions"),
          where("channel_id", "==", channelId),
          where("user_id", "==", userId)
        );

        const subsSnapshot = await getDocs(subsQuery);

        subsSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
          console.log("Subscription deleted with ID: ", doc.id);
        });
      }
    } catch (error) {
      console.error("Error managing subscription ", error);
    }
  }
  useEffect(()=>{
    fetchSubsriptionDetails();
  },[isSubscribed])

  const currentTime = new Date();
  const hours = currentTime.getHours().toString().padStart(2, "0");
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const seconds = currentTime.getSeconds().toString().padStart(2, "0");
  const day = currentTime.getDate().toString().padStart(2, "0");
  const month = (currentTime.getMonth() + 1).toString().padStart(2, "0");
  const dayOfWeek = currentTime.getDay();

  const formattedTime = `${hours}:${minutes}:${seconds}-${dayOfWeek}-${day}-${month}`;

  const handleSubscribe = () => {
    subscribeVideo(formattedTime, channel.id, user.uid);  
    setIsSubscribed((prev) => !prev);

  };

  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        backgroundColor: "#202020",
        color: "white",
        marginTop: "100px",
        marginBottom:"40px",
      }}
    >
      <div style={{ flex: 5 }}>
        <div>
          <iframe
            width="80%"
            height="500px"
            src={videos[0] && videos[0].video}
            frameborder={0}
            title="YouTube video player"
            allow="accelerometer; autoplay;clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            marginBottom: "10px",
          }}
        >
          <div style={{ fontSize: "25px", fontEeight: "500", margin: "0" }}>
            {videos[0] && videos[0].title}
          </div>

          <div style={{ display: "flex" }}>
            <img
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                marginRight: "10px",
                marginTop: "10px",
              }}
              src={channel && channel.img}
            ></img>
            <h1
              style={{
                fontSize: "18px",
                fontWeight: 400,
                marginTop: "20px",
                marginBottom: "10px",
                color: "darkgray",
              }}
            >
              {channel.name && channel.name.toLowerCase()}
            </h1>
          </div>
          <div style={{ justifyContent: "space-between" }}>
          {videos[0] && user && user.uid != videos[0].user_id ? (
            <>
              <Button
                onClick={handleSubscribe}
                style={{
                  backgroundColor: isSubscribed ? "darkgray" : "#cc1a00",
                  color: "white",
                  fontWeight: 500,
                  border: "none",
                  borderRadius: "3px",
                  height: "max-content",
                  padding: "10px 20px",
                  cursor: "pointer",
                  marginTop:"10px",
                  marginBottom:"10px"
                }}
              >
                {isSubscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
              </Button>
            </>
          ) : (
            <></>
          )}
        </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: "white" }}>{`${videos[0]&&videos[0].time}`}</span>
        </div>
        <div style={{ marginTop: "20px", color: "darkgray" }}>
          {videos[0] && videos[0].description}
        </div>
        <hr style={{ margin: "15px 0px", border: "0.5px solid white" }} />
        <Comments video={videos[0]} user={user}/>
      </div>
      <div style={{ flex: 2 }}>
        {videos.slice(1).map((video, index) => (
          <Card key={index}video={video} />
        ))}
      </div>
    </div>
  );
};

export default Video;

import React, { useState,useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { collection, getDocs} from "firebase/firestore";
import { db } from "../Firebase";
const Container = styled.div`
  width: 360px;
  cursor: pointer;
  margin-left: 10px;
  color: white;
  font-family: sans-serif;
  margin-bottom:20px;
`;

const Image = styled.img`
  height: 200px;
  width: 350px;
  background-color: #999;
  flex: 1;
  border-radius: 5px;
`;

const Details = styled.div`
  display: flex;
  gap: 12px;
  flex: 1;
  margin-top: 20px;
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: "none";
`;

const Texts = styled.div`
   margin-top:"40px";
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 500;
  margin: 0;
`;

const ChannelName = styled.h2`
  font-size: 16px;
  font-weight: 50;
  color: darkgray;
`;

const Info = styled.div`
  font-size: 14px;
  color: darkgray;
`;

const Card = ({ video }) => { 
  const [channel,setChannel]=useState([]);
 
  let date;
  const currentDate = new Date();
  const day = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const videoDateParts = video&&video.time.split("-");
  const videoYear = video&&parseInt(videoDateParts[2], 10)+2000;
  const videoMonth = video&&parseInt(videoDateParts[1], 10);
  const videoDay = video&&parseInt(videoDateParts[0], 10);

  if (currentMonth > videoMonth) {
    const monthDifference = currentMonth - videoMonth;
    if (monthDifference == 0) {
      date = "Today";
    } else {
      date = monthDifference+' month'+ (monthDifference !== 1 ? "s" : "" + " ago");
    }
  } else {
    const dayDifference = day - videoDay;
    if (dayDifference == 0) {
      date = "Today";
    } else {
      date = dayDifference+' day'+ (dayDifference !== 1 ? "s" : "" + " ago");
    }
  }





  const fetchChannelDetails = async () => {
    const querySnapshot = await getDocs(collection(db, "channels"));
    const matchingChannel = querySnapshot.docs.find((doc) => {
      const data = doc.data();
      return data.user_id === video.user_id; 
    });
  
    if (matchingChannel) {
      setChannel(matchingChannel.data());
    }
  };
  
useEffect(()=>{
  fetchChannelDetails();
},[video])


  return (
    <Link
      to={`/video/${video && video.id}`}
      style={{ color: "inherit", textDecoration: "none"}}
    >
          <Container>      
            <Image src={video && video.thumbnail} />
            <Details>
              <>
                <ChannelImage src={channel&&channel.img} />
                <Texts>
                  <Title>{video && video.title}</Title>
                  <ChannelName>{channel.name &&channel.name.toLowerCase()}</ChannelName>
                  <Info>{`630,908 views • ${date}`}</Info>
                </Texts>
              </>
            </Details>
            </Container>

    </Link>
  );
};

export default Card;

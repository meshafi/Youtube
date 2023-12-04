import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useUser } from "../context/UserContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const CommentDate = styled.span`
  font-size: 12px;
  color: darkgray;
  font-weight: 200;
  margin-left: 10px;
`;

const Text = styled.span`
  font-size: 14px;
`;

const Comment = (comment) => {
  const user = useUser();
  comment = comment.comment;

  const [userData, setUserData] = useState({});

  const fetchChannelDetails = async (comment) => {
    const q = query(
      collection(db, "channels"),
      where("user_id", "==", comment.user_id)
    );
    const querySnapshot = await getDocs(q);

    const matchingChannel = querySnapshot.docs.find((doc) => {
      const data = doc.data();
      return data.user_id === comment.user_id;
    });

    return matchingChannel
      ? { id: matchingChannel.id, ...matchingChannel.data() }
      : null;
  };
  useEffect(() => {
    const fetchData = async () => {
      const matchingChannel = await fetchChannelDetails(comment);

      if (matchingChannel) {
        setUserData(matchingChannel);
      }
    };

    fetchData();
  }, [comment]);

  console.log(userData);

  let date;
  const currentDate = new Date();
  const day = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const commentDateParts = comment && comment.time.split("-");
  const commentYear = comment && parseInt(commentDateParts[2], 10) + 2000;
  const commentMonth = comment && parseInt(commentDateParts[1], 10);
  const commentDay = comment && parseInt(commentDateParts[0], 10);

  if (currentMonth > commentMonth) {
    const monthDifference = currentMonth - commentMonth;
    if (monthDifference == 0) {
      date = "Today";
    } else {
      date =
        monthDifference +
        " month" +
        (monthDifference !== 1 ? "s" : "" + " ago");
    }
  } else {
    const dayDifference = day - commentDay;
    if (dayDifference == 0) {
      date = "Today";
    } else {
      date = dayDifference + " day" + (dayDifference !== 1 ? "s" : "" + " ago");
    }
  }
  return (
    <Container>
      <Avatar src={userData&&userData.img}/>
      <Details>
        <Name>
          {userData.name&&userData.name.toLowerCase()}
          <CommentDate>{date}</CommentDate>
        </Name>
        <Text>{comment.text}</Text>
      </Details>
    </Container>
  );
};

export default Comment;

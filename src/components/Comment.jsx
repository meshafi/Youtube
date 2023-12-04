import React from "react";
import styled from "styled-components";
import { useUser } from "../context/UserContext";

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
  color:darkgray;
  font-weight: 200;
  margin-left: 10px;
`;

const Text = styled.span`
  font-size: 14px;
`;

const Comment = (comment) => {
  const user = useUser();
  comment = comment.comment;
  console.log(comment);
  let date;
  const currentDate = new Date();
  const day = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const commentDateParts = comment&&comment.time.split("-");
  const commentYear = comment&&parseInt(commentDateParts[2], 10)+2000;
  const commentMonth = comment&&parseInt(commentDateParts[1], 10);
  const commentDay = comment&&parseInt(commentDateParts[0], 10);

  if (currentMonth > commentMonth) {
    const monthDifference = currentMonth - commentMonth;
    if (monthDifference == 0) {
      date = "Today";
    } else {
      date = monthDifference+' month'+ (monthDifference !== 1 ? "s" : "" + " ago");
    }
  } else {
    const dayDifference = day - commentDay;
    if (dayDifference == 0) {
      date = "Today";
    } else {
      date = dayDifference+' day'+ (dayDifference !== 1 ? "s" : "" + " ago");
    }
  }
  return (
    <Container>
      <Avatar src={user&&user.photoURL} />
      <Details>
        <Name>
          {user && user.displayName.toLowerCase()}
          <CommentDate>{date}</CommentDate>
        </Name>
        <Text>{comment.text}</Text>
      </Details>
    </Container>
  );
};

export default Comment;

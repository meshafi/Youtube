import React from "react";
import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  InputBase,
  Button,
  Avatar,
  Stack,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useUser } from "../context/UserContext.jsx";
import { signInWithGoogle, signOutUser } from "../Firebase.jsx";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import Upload from "./Upload.jsx";
import { collection, getDocs,addDoc } from "firebase/firestore";
import { db } from "../Firebase";

const Navbar = () => {
  
  const user = useUser();
  const [open, setOpen] = useState(false);

  const onClickSignIn = () => {
    signInWithGoogle();
  };

  useEffect(()=>{
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, "0");
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    const seconds = currentTime.getSeconds().toString().padStart(2, "0");
    const day = currentTime.getDate().toString().padStart(2, "0");
    const month = (currentTime.getMonth() + 1).toString().padStart(2, "0"); 
    const dayOfWeek = currentTime.getDay();

    const formattedTime = `${hours}:${minutes}:${seconds}-${day}-${month}-${dayOfWeek}`;
    if(user)
    createChannel(user.uid,formattedTime,user.photoURL,user.displayName);
  },[user]);


  async function createChannel(userId, channelId, channelImg, channelName) {
    try {
      const channelQuery = await getDocs(collection(db, "channels"));
      const existingChannel = channelQuery.docs.find((doc) => doc.data().user_id === userId);
       
      if (!existingChannel) {
        const channelRef = await addDoc(collection(db, "channels"), {
          user_id: userId,
          id: channelId,
          img: channelImg,
          name: channelName,
        });
  
        console.log("Channel added with ID: ", channelRef.id);
      } else {
        console.log("Channel already exists for this user.");
      }
    } catch (error) {
      console.error("Error creating/checking channel: ", error);
    }
  }

  return (
    <div>
      <AppBar
        sx={{
          position: "fixed",
          zIndex: 100,
          top: "0",
          backgroundColor: "#202020",
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <InputBase
            placeholder="Search"
            sx={{
              borderRadius: "5px",
              width: "30vw",
              border: "2px solid rgb(56, 56, 56)",
              padding: "4px",
              backgroundColor: "transparent",
              color: "white",
              marginLeft: "400px",
              marginRight: "8px",
            }}
            endAdornment={<SearchOutlinedIcon sx={{ color: "darkgray" }} />}
          />
          <Stack direction="row" alignItems="center" spacing={5}>
            {user ? (
              <>
                <VideoCallIcon
                  onClick={() => setOpen(true)}
                  sx={{ fontSize: "38px", cursor: "pointer" }}
                />
                <Avatar
                  src={user.photoURL}
                  alt="User Avatar"
                  sx={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
                <Button
                  onClick={signOutUser}
                  sx={{
                    padding: "5px 15px",
                    backgroundColor: "transparent",
                    border: "1px solid #3ea6ff",
                    color: "#3ea6ff",
                    borderRadius: "3px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Log out
                </Button>
              </>
            ) : (
              <Button
                onClick={onClickSignIn}
                sx={{
                  padding: "5px 15px",
                  backgroundColor: "transparent",
                  border: "1px solid #3ea6ff",
                  color: "#3ea6ff",
                  borderRadius: "3px",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <AccountCircleOutlinedIcon />
                SIGN IN
              </Button>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      {open && <Upload setOpen={setOpen} />}
    </div>
  );
};

export default Navbar;

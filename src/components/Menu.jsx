import React from "react";
import { Paper, Button, Divider } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import Youtube from "../assets/Youtube.png";
import { useUser } from "../context/UserContext.jsx";
import { Link } from "react-router-dom";
const Menu = () => {
  const user = useUser();
  return (
    <Paper
      style={{
        position: "sticky",
        zIndex: 200,
        flex: 1,
        top: 0,
        backgroundColor: "#202020",
        color: "white",
        fontSize: "16px",
        width: "12vw",
        height: "100vh",
        borderRadius: "0",
        boxShadow: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontWeight: "bold",
          marginLeft: "30px",
        }}
      >
        <img src={Youtube} style={{ height: "35px" }} alt="YouTube Logo" />
        <h2>YouTube</h2>
      </div>

      <div style={{ padding: "10px 26px" }}>
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              cursor: "pointer",
              padding: "7.5px 0px",
              borderRadius: "3px",
              transition: "background-color 0.3s",
            }}
            onClick={() => console.log("Home")}
            className="hover-effect"
          >
            <HomeIcon />
            Home
          </div>
        </Link>
        <Link to="/subscriptions"  style={{ color: "inherit", textDecoration: "none" }} >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            cursor: "pointer",
            padding: "7.5px 0px",
            borderRadius: "3px",
            transition: "background-color 0.3s",
          }}
          onClick={() => console.log("Subscriptions")}
          className="hover-effect"
        >
          <SubscriptionsOutlinedIcon />
          Subscriptions
        </div>
        </Link>
        <Divider style={{ margin: "15px 0px", backgroundColor: "gray" }} />
        <div>
          {user ? (
            <Link
              to="/yourvideos" 
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  cursor: "pointer",
                  padding: "7.5px 0px",
                  borderRadius: "3px",
                  transition: "background-color 0.3s",
                }}
                onClick={() => console.log("Your videos")}
                className="hover-effect"
              >
                <VideoLibraryOutlinedIcon />
                Your Videos
              </div>
            </Link>
          ) : (
            <div>
              Sign in to create videos and subscribe.
            </div>
          )}
        </div>
      </div>
      <style>
        {`
          .hover-effect:hover {
            background-color: #343434;
          }
        `}
      </style>
    </Paper>
  );
};

export default Menu;

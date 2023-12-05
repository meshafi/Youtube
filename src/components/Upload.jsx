import styled from "styled-components";
import { db } from "../Firebase";
import { useEffect, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../Firebase";
import { collection, addDoc ,getDocs} from "firebase/firestore";
import { useUser } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";


const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: black;
  top: 0;
  left: 0;
  color: white;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  padding: 20px;
  background-color: black;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;
const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;
const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid white;
  color: white;
  border-radius: 3px;
  padding: 10px;
  z-index: 999;
  background-color: black;
`;
const Desc = styled.textarea`
  border: 1px solid white;
  color: white;
  border-radius: 3px;
  padding: 10px;
  background-color: black;
`;
const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: #202020;
  color: white;
`;
const Label = styled.label`
  font-size: 14px;
`;

const Upload = ({ setOpen }) => {
  const user = useUser();
  const navigate = useNavigate();
  const [downloadImg, setDownloadImg] = useState(undefined);
  const [downloadVideo, setDownloadVideo] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [videoPerc, setVideoPerc] = useState(0);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");
  const [channel,setChannel]=useState({});

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        urlType === "imgUrl"
          ? setImgPerc(Math.round(progress))
          : setVideoPerc(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs((prev) => {
            return { ...prev, [urlType]: downloadURL };
          });
        });
      }
    );
  };
  
  
  const uploadDatabase = async () => {
    if (!inputs.title || !inputs.desc || !downloadImg || !downloadVideo) {
      setError("All fields are required!");
      return;
    }
    setError("");

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const timestamp = currentDate.getTime();

    let id = `${year}${month}${day}${timestamp}`;
    let time=`${day}-${month}-${year}`;
    id = id.toString();
    time.toString();
    await createVideo(
      user.uid,
      id,
      inputs.title,
      inputs.desc,
      inputs.imgUrl,
      inputs.videoUrl,
      tags,
      time,
      channel.id
    );
  };

  useEffect(() => {
    downloadVideo && uploadFile(downloadVideo, "videoUrl");
  }, [downloadVideo]);

  useEffect(() => {
    downloadImg && uploadFile(downloadImg, "imgUrl");
  }, [downloadImg]);


  const fetchChannelDetails = async () => {
    const querySnapshot = await getDocs(collection(db, "channels"));
    const matchingChannel = querySnapshot.docs.find((doc) => {
      const data = doc.data();
      if(user)
      return data.user_id === user.uid; 
    });
  
    if (matchingChannel) {
      setChannel(matchingChannel.data());
    }
  };
  
useEffect(()=>{
  fetchChannelDetails();
},[user])

  async function createVideo(
    userId,
    videoId,
    videoTitle,
    videoDescription,
    thumbnailLink,
    videoLink,
    videoTag,
    videoTime,
    channelId
  ) {
    try {
      const videoRef = await addDoc(collection(db, "videos"), {
        user_id: userId,
        id: videoId,
        title: videoTitle,
        description: videoDescription,
        thumbnail: thumbnailLink,
        video: videoLink,
        tag: videoTag,
        time:videoTime,
        channel_id:channelId
      });
      console.log("Video added with ID: ", videoRef.id);
    } catch (error) {
      console.error("Error adding video: ", error);
    }
    setOpen(false);
    navigate("/yourvideos"); 
  }



  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>X</Close>
        <Title>Upload a New Video</Title>
        <Label>Video:</Label>
        {videoPerc > 0 ? (
          "Uploading:" + videoPerc
        ) : (
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => setDownloadVideo(e.target.files[0])}
          />
        )}
        <Input
          type="text"
          placeholder="Title"
          name="title"
          onChange={handleChange}
        />
        <Desc
          placeholder="Description"
          name="desc"
          rows={8}
          onChange={handleChange}
        />
        <Input
          type="text"
          placeholder="Separate the tags with commas."
          onChange={handleTags}
        />
        <Label>Image:</Label>
        {imgPerc > 0 ? (
          "Uploading:" + imgPerc + "%"
        ) : (
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setDownloadImg(e.target.files[0])}
          />
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button onClick={uploadDatabase}>Upload</Button>
      </Wrapper>
    </Container>
  );
};

export default Upload;

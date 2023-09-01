import firebase from "firebase";
import { Avatar, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Close, PhotoLibrary, Videocam } from "@mui/icons-material";

import "./index.scss";

import Post from "../post";
import db from "../../firebase";
import { useStateValue } from "../../context/StateProvider";

function Feed() {
  const [{ user }, dispatch] = useStateValue();
  const [posts, setPosts] = useState([]);
  const storageRef = firebase.storage().ref();
  const [uploadPost, setUploadPost] = useState("");
  const [image, setImage] = useState(null);
  const [tempImage, setTempImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const checkImage = (imgLink) => {
    if (imgLink?.includes("undefined")) {
      return "";
    } else {
      return imgLink;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUploading(true);

    const uploadImage = storageRef.child("images/" + image?.name).put(image);
    uploadImage.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.error(error);
      },
      () => {
        storageRef
          .child("images/" + image?.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              message: uploadPost,
              timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
              profilePic: user.photoURL,
              username: user.displayName,
              image: checkImage(url),
            });
            setUploadPost("");
            setImage(null);
            setUploading(false);
          });
      }
    );
  };

  const handleImagePreview = (e) => {
    var file = e.target.files[0];
    setImage(file);
    if (file) {
      if (file) {
        const blob = new Blob([file], { type: "image/png" });
        const blobURL = URL.createObjectURL(blob);

        setTempImage(blobURL);
      }
    }
  };

  useEffect(() => {
    db.collection("posts")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapshot) =>
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })))
      );
  }, []);

  return (
    <>
      <div className="feed">
        <div className="feed__top">
          <div>
            <Avatar src={user.photoURL} />
          </div>

          <div className="feed__top-input">
            <input
              type="text"
              placeholder="Write a post"
              value={uploadPost}
              onChange={(e) => setUploadPost(e.target.value)}
            />
          </div>

          {(uploadPost || image) && (
            <Button
              style={{ color: "White", backgroundColor: "#c71d1d" }}
              variant="contained"
              onClick={handleSubmit}
              disabled={uploading}
            >
              {uploading ? "Uploading" : "Upload"}
            </Button>
          )}
        </div>

        {image && (
          <div
            style={{
              position: "relative",
              border: "dashed",
              height: "150px",
              width: "150px",
              borderColor: "#c9c9c9",
              borderWidth: "2px",
              marginLeft: "18px",
              marginTop: "12px",
            }}
          >
            <img
              src={tempImage}
              style={{
                objectFit: "contain",
                width: "150px",
                height: "150px",
                maxHeight: "150px",
                maxWidth: "150px",
              }}
            />
            <div className="feed__close-btn" onClick={(e) => setImage(null)}>
              <Close style={{ width: "16px" }} />
            </div>
          </div>
        )}
        <div className="feed__bottom">
          <div className="feed__upload-options">
            <Videocam style={{ color: "red" }} />
            <h3>Live Video</h3>
          </div>
          <div className="feed__upload-options">
            <label style={{ display: "flex", alignItems: "center" }}>
              <PhotoLibrary style={{ color: "green" }} />

              <h3>Photo</h3>

              <input
                type={"file"}
                className="input-section"
                accept="image/png, image/jpeg"
                onChange={(e) => handleImagePreview(e)}
              />
            </label>
          </div>
        </div>
      </div>
      {posts.map((post) => (
        <Post
          postId={post?.id}
          profilePic={post.data.profilePic}
          message={post.data.message}
          timeStamp={post.data.timeStamp}
          username={post.data.username}
          image={post.data.image}
          likes={post.data.likes}
          comments={post.data.comments}
        />
      ))}
    </>
  );
}

export default Feed;

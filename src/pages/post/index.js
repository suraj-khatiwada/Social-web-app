import moment from "moment";
import firebase from "firebase";
import classNames from "classnames";
import { v4 as uuidV4 } from "uuid";
import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Comment, Share, ThumbUp } from "@mui/icons-material";

import "./index.scss";

import db from "../../firebase";
import { useStateValue } from "../../context/StateProvider";
function Post({
  postId,
  profilePic,
  image,
  username,
  timeStamp,
  message,
  likes,
  comments,
}) {
  const [{ user }, dispatch] = useStateValue();
  const [comment, setComment] = useState("");
  const [showComment, setShowComments] = useState(false);

  const handleLike = (key, likes) => {
    const postRef = db.collection("posts").doc(key);
    if (likes?.includes(user?.uid)) {
      postRef.update({
        likes: firebase.firestore.FieldValue.arrayRemove(user.uid),
      });
    } else {
      postRef.update({
        likes: firebase.firestore.FieldValue.arrayUnion(user.uid),
      });
    }
  };

  const handleComment = (e, key) => {
    if (e.key === "Enter") {
      db.collection("posts")
        .doc(key)
        .update({
          comments: firebase.firestore.FieldValue.arrayUnion({
            userid: user?.uid,
            username: user?.displayName,
            userImg: user.photoURL,
            comment: comment,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
            commentId: uuidV4(),
          }),
        })
        .then(() => {
          setComment("");
        });
    }
  };

  return (
    <div className="post">
      <div className="post__top">
        <Avatar src={profilePic} className="post__avatar" />
        <div className="post__top-info">
          <h3>{username}</h3>
          {timeStamp && <p>{moment(timeStamp.toDate()).fromNow()}</p>}
        </div>
      </div>
      <div className="post__bottom">
        <p>{message}</p>
      </div>
      {image && (
        <div className="post__image">
          <img src={image} />
        </div>
      )}

      <div className="post__likes-comments-count">
        {likes?.length > "0" && (
          <div className="post__likes-count">
            {likes?.length} {likes?.length == "1" ? "Like" : "Likes"}
          </div>
        )}
        {comments !== undefined && comments.length > "0" && (
          <div style={{ marginLeft: "6px" }}>
            {comments.length} {comments.length == "1" ? "Comment" : "Comments"}
          </div>
        )}
      </div>
      <div className="post__options">
        <div
          className={classNames("post__option", {
            liked: likes?.includes(user.uid),
          })}
          onClick={() => handleLike(postId, likes)}
        >
          <ThumbUp />
          <p>Like</p>
        </div>
        <div
          className="post__option"
          onClick={() => {
            setShowComments((prevState) => !prevState);
          }}
        >
          <Comment />
          <p>Comment</p>
        </div>
        <div className="post__option">
          <Share />
          <p>Share</p>
        </div>
      </div>
      {showComment && (
        <>
          <div className="post__comments">
            <Avatar src={user?.photoURL} className="post__avatar" />
            <input
              type="text"
              placeholder="Write a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyUp={(e) => handleComment(e, postId)}
            />
          </div>
          <div className="post__comment-lists">
            {comments !== undefined &&
              comments.map((comment) => (
                <div key={comment?.commentId} className="post__comment">
                  <div>
                    <Avatar src={comment?.userImg} className="post__avatar" />
                  </div>

                  <div className="post__comment-detail">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <h5>{comment?.username}</h5>
                      {comment?.createdAt && (
                        <p style={{ fontSize: "10px" }}>
                          {moment(comment?.createdAt.toDate()).fromNow()}
                        </p>
                      )}
                    </div>
                    <p>{comment?.comment}</p>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Post;

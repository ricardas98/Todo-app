import { React, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { CommentLength, CommentLengthMax } from "../../ErrorMessages";

import "./Forms.css";
export const CommentForm = ({ taskId, addComment }) => {
  const username = useSelector((state) => state.data.user.username);
  const [commentNew, setCommentNew] = useState("");
  const [error, setError] = useState();

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setError();

    if (!commentNew) {
      setError(CommentLength());
      return;
    }

    if (commentNew?.length > 100) {
      setError(CommentLengthMax());
      return;
    }

    const payload = {
      text: commentNew,
    };

    await axios.post(`api/users/${username}/tasks/${taskId}/comments`, payload).then((res) => {
      addComment(res.data);
      setCommentNew("");
    });

    console.log(commentNew);
  };

  return (
    <div className="commentFormContent">
      <form className="commentForm" onSubmit={handleCommentSubmit}>
        <input type="text" className="inputFieldText" placeholder="New comment" value={commentNew} onChange={(e) => setCommentNew(e.target.value)} />
        <div className="commentFormButton">
          <button className="buttonRed" type="submit">
            Post
          </button>
        </div>
      </form>
      {error && (
        <>
          <div className="verticalSpacer" />
          <span className="errorMsg">{error}</span>
        </>
      )}
    </div>
  );
};

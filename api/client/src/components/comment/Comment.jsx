import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { convertDate } from "../../functions/DataManipulation";

import "./Comment.css";
import { CommentLength, CommentLengthMax } from "../../ErrorMessages";

export const Comment = ({ comment, taskId, removeComment, editComment }) => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.data.user.username);

  const [edit, setEdit] = useState(false);
  const [text, setText] = useState(comment.text);

  const [error, setError] = useState();

  const handleDelete = async () => {
    try {
      removeComment(comment._id);
      await axios.delete(`api/users/${username}/tasks/${taskId}/comments/${comment._id}`).then(() => {});
    } catch (err) {
      if (err.response?.status === 403) {
        dispatch(setError(err.response.status));
      }
    }
  };

  const toggleEdit = () => {
    setEdit(!edit);
    if (edit) setText("");
    else setText(comment.text);
  };

  const handleEdit = async () => {
    if (text?.length === 0) {
      setError(CommentLength());
      return;
    }

    if (text?.length > 100) {
      setError(CommentLengthMax());
      return;
    }

    if (text === comment.text) {
      toggleEdit();
    }

    const payload = {
      text: text,
    };

    try {
      await axios.put(`api/users/${username}/tasks/${taskId}/comments/${comment._id}`, payload).then((res) => {
        toggleEdit();
        editComment(res.data);
      });
    } catch (err) {
      if (err.response?.status === 403) {
        dispatch(setError(err.response.status));
      }
      console.log(err);
    }
  };

  return (
    <div className="listItem">
      <div className="listItemContent">
        {!edit ? (
          <>
            <div className="listItemContentLeft">
              <span className="listItemContentText">{comment.text}</span>
            </div>
            <div className="listItemContentRight">
              <span className="listItemContentCaption">{convertDate(comment.createdAt)}</span>
              <div className="commentActions">
                <span className="listItemIcon">
                  <button className="buttonTransparent" onClick={toggleEdit}>
                    <i className="fas fa-pen fa-sm"></i>
                  </button>
                </span>
                <span className="listItemIcon">
                  <button className="buttonTransparent" onClick={handleDelete}>
                    <i className="fas fa-times fa-lg"></i>
                  </button>
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="listItemContentLeft">
              <span className="listItemContentText">
                <textarea
                  rows="3"
                  className="listItemTextEditInput"
                  type="text"
                  value={text}
                  placeholder="Can't be empty"
                  onChange={(e) => setText(e.target.value)}
                ></textarea>
              </span>
              {error && (
                <>
                  <div className="verticalSpacer" />
                  <span className="errorMsg">{error}</span>
                </>
              )}
            </div>
            <div className="listItemContentRight">
              <div className="listItemContentActions">
                <span className="listItemIcon">
                  <button className="buttonTransparent" onClick={handleEdit}>
                    <i className="fas fa-check fa-lg"></i>
                  </button>
                </span>
                <span className="listItemIcon">
                  <button className="buttonTransparent" onClick={toggleEdit}>
                    <i className="fas fa-times fa-lg"></i>
                  </button>
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

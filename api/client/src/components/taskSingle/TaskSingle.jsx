import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { CategoryCell } from "../categoryCell/CategoryCell";
import { Comment } from "../comment/Comment";
import { CommentForm } from "../forms/CommentForm";

import { convertDate } from "../../functions/DataManipulation";
import { setError } from "../../redux/dataSlice";

import "./TaskSingle.css";
import "../task/Task.css";
import { Loader } from "../loader/Loader";

export const TaskSingle = ({ task, categories }) => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.data.user.username);

  const [dataReturned, setDataReturned] = useState(false);

  const [comments, setComments] = useState([]);

  function sortComments(comments) {
    return comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  function addComment(comment) {
    setComments(sortComments([...comments, comment]));
  }

  function removeComment(id) {
    setComments(comments.filter((x) => x._id !== id));
  }

  function editComment(comment) {
    let filteredComments = comments.filter((x) => x._id !== comment._id);
    filteredComments = [...filteredComments, comment];
    setComments(sortComments(filteredComments));
  }

  useEffect(() => {
    async function fetchData() {
      try {
        await axios.get(`api/users/${username}/tasks/${task._id}/comments`).then((res) => {
          setComments(res.data);
        });
      } catch (err) {
        if (err.response?.status === 403) {
          dispatch(setError(err.response.status));
        }
      }
      setDataReturned(true);
    }
    fetchData();
  }, []);

  return (
    <div className="taskSingle">
      <div className="taskSingleContent">
        <div className="taskSingleHeader">
          <div className="taskSingleInfo">
            <div className="taskSingleInfoLeft">
              <div className="taskSingleTitle">
                <div className="taskSingleName">
                  <h3>{task.name}</h3>
                </div>
              </div>
              <div className="taskSingleDate">
                <span className="taskDate">{convertDate(task.date)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="taskSingleCategoriesList">{categories && categories?.map((x) => <CategoryCell key={x._id} category={x} />)}</div>
        <div className="verticalSpacer" />
        {!dataReturned ? (
          <>
            <div className="verticalSpacer" />
            <Loader />
          </>
        ) : (
          <>
            <div className="taskSingleCommentFrom">
              <CommentForm taskId={task._id} addComment={addComment} />
            </div>
            <div className="taskSingleCommentList">
              {comments.map((x) => (
                <Comment key={x._id} taskId={task._id} comment={x} removeComment={removeComment} editComment={editComment} />
              ))}
            </div>
          </>
        )}

        <div className="verticalSpacer"></div>
      </div>
    </div>
  );
};

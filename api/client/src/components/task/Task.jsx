import { useModal } from "react-hooks-use-modal";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { Modal } from "../../components/modal/Modal";

import { CategoryCell } from "../categoryCell/CategoryCell";
import { Categories } from "../categories/Categories";
import { TaskSingle } from "../taskSingle/TaskSingle";

import { setTaskComplete, deleteTask, setError } from "../../redux/dataSlice";

import { convertDate } from "../../functions/DataManipulation";

import "./Task.css";
import { TaskForm } from "../forms/TaskForm";

export const Task = ({ task }) => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.data.user.username);
  let categories = [];
  useSelector((state) => state.data.categories).map((x) => {
    if (task.categories?.includes(x._id)) {
      categories = [...categories, x];
    }
  });

  const [ModalTask, openTask, closeTask] = useModal("root", {
    preventScroll: true,
    closeOnOverlayClick: false,
  });

  const [ModalCategories, openCategories, closeCategories] = useModal("root", {
    preventScroll: true,
    closeOnOverlayClick: false,
  });

  const [ModalEdit, openEdit, closeEdit] = useModal("root", {
    preventScroll: true,
    closeOnOverlayClick: false,
  });

  const handleDelete = async () => {
    try {
      await axios.delete(`api/users/${username}/tasks/${task._id}`).then(() => {
        dispatch(deleteTask(task._id));
      });
    } catch (err) {
      if (err.response?.status === 403) {
        dispatch(setError(err.response.status));
      }
      console.log(err);
    }
  };

  const handleComplete = async () => {
    let payload = {
      completed: !task.completed,
    };

    try {
      await axios.put(`api/users/${username}/tasks/${task._id}`, payload).then((res) => {
        dispatch(setTaskComplete(res.data));
      });
    } catch (err) {
      if (err.response?.status === 403) {
        dispatch(setError(err.response.status));
      }
      console.log(err);
    }
  };

  const handleOpen = () => {
    openTask();
  };

  return (
    <>
      <div className="listItem">
        <div className="listItemContent">
          {task.completed ? (
            <span className="listItemIcon" style={{ color: "#e44332" }}>
              <button className="buttonTransparent" onClick={() => handleComplete()}>
                <i className="fas fa-check-circle fa-lg"></i>
              </button>
            </span>
          ) : (
            <span className="listItemIcon">
              <button className="buttonTransparent">
                <i className="far fa-circle fa-lg" onClick={() => handleComplete()}></i>
              </button>
            </span>
          )}
          <div className="listItemContentLeft">
            <div className="taskInfo" onClick={handleOpen}>
              <span className="taskTitle">{task.name}</span>
              <span className="taskDate">{convertDate(task.date)}</span>
            </div>
          </div>
          <div className="listItemContentRight">
            <div className="taskCategoriesList" onClick={openCategories}>
              {categories.map((x) => (
                <CategoryCell key={x._id} category={x} />
              ))}
              {categories?.length === 0 && (
                <span className="listItemIcon">
                  <button type="button" className="buttonTransparent" onClick={openCategories}>
                    <i className="fas fa-plus fa-lg"></i>
                  </button>
                </span>
              )}
            </div>
            <span className="listItemIcon">
              <button className="buttonTransparent" onClick={openEdit}>
                <i className="fas fa-pen fa-md"></i>
              </button>
            </span>
            <span className="listItemIcon">
              <button className="buttonTransparent" onClick={() => handleDelete()}>
                <i className="fas fa-trash-alt fa-md"></i>
              </button>
            </span>
          </div>
        </div>
      </div>
      {
        <Modal Modal={ModalEdit} close={closeEdit}>
          <TaskForm task={task} close={closeEdit} />
        </Modal>
      }
      {
        <Modal Modal={ModalCategories} close={closeCategories}>
          <Categories task={task} />
        </Modal>
      }
      {
        <Modal Modal={ModalTask} close={closeTask}>
          <TaskSingle task={task} categories={categories} />
        </Modal>
      }
    </>
  );
};

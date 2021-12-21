import { React, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { Task } from "../task/Task";
import { TaskForm } from "../forms/TaskForm";

import { setError, addTasks, addTask, addCategories, toggleFetchingOn, toggleFetchingOff } from "../../redux/dataSlice";

import "./Tasks.css";
import { Loader } from "../loader/Loader";

export const Tasks = () => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.data.user.username);
  const isFetching = useSelector((state) => state.data.user.isFetching);

  const tasks = useSelector((state) => state.data.tasks);

  let sortedTasks = JSON.parse(JSON.stringify(useSelector((state) => state.data.tasks)));
  sortedTasks.sort((a, b) => new Date(a.date) - new Date(b.date)).sort((a, b) => a.completed - b.completed);
  useEffect(() => {
    sortedTasks = JSON.parse(JSON.stringify(tasks));
    sortedTasks.sort((a, b) => new Date(a.date) - new Date(b.date)).sort((a, b) => a.completed - b.completed);
  }, [tasks]);

  useEffect(() => {
    async function fetchData() {
      dispatch(toggleFetchingOn());
      try {
        await axios.get(`api/users/${username}/tasks`).then((res) => {
          dispatch(addTasks(res.data));
        });
      } catch (err) {
        if (err.response?.status === 403) {
          dispatch(setError(403));
        } else if (err.response?.status === 404) {
        }
      }

      try {
        await axios.get(`api/users/${username}/categories`).then((res) => {
          dispatch(addCategories(res.data));
        });
      } catch (err) {
        if (err.response?.status === 403) {
          dispatch(setError(403));
        } else if (err.response?.status === 404) {
        }
      }
      dispatch(toggleFetchingOff());
    }

    fetchData();
  }, []);

  function addNewTask(task) {
    dispatch(addTask(task));
  }

  return isFetching ? (
    <Loader />
  ) : (
    <div className="tasks">
      <div className="tasksContent">
        <div className="tasksList">
          {sortedTasks.map((x) => (
            <Task key={x._id} task={x} />
          ))}
        </div>

        <div className="taskForm">{<TaskForm actionTask={addNewTask} />}</div>
      </div>
    </div>
  );
};

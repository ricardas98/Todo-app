import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { setError, toggleFetching } from "../../redux/dataSlice";

import axios from "axios";
import { User } from "../user/User";

export const Users = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      dispatch(toggleFetching());
      try {
        await axios.get(`api/users`).then((res) => {
          setUsers(res.data);
        });
      } catch (err) {
        if (err.response?.status === 403) {
          dispatch(setError(403));
        } else if (err.response?.status === 404) {
        }
      }
      dispatch(toggleFetching());
    }
    fetchData();
  }, []);

  async function deleteUser(username) {
    try {
      await axios.delete(`api/users/${username}`).then(() => {
        const filteredUsers = users.filter((x) => x.username !== username);
        setUsers(filteredUsers);
      });
    } catch (err) {
      if (err.response?.status === 403) {
        dispatch(setError(403));
      } else if (err.response?.status === 404) {
      }
      console.log(err);
    }
  }

  return (
    <div className="users">
      <div className="usersContent">{users.map((x) => x.email !== "admin@gmail.com" && <User key={x._id} user={x} deleteUser={deleteUser} />)}</div>
    </div>
  );
};

import { React, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { updateUser } from "../../redux/dataSlice";

import { UsernameLength } from "../../ErrorMessages";
import { convertDate } from "../../functions/DataManipulation";

export const UserForm = ({ username, setUsername, email, setEmail, setUpdatedDate, close }) => {
  const [usernameNew, setUsernameNew] = useState(username);
  const [emailNew, setEmailNew] = useState(email);
  const [error, setError] = useState();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError();

    if (username.length < 3) {
      setError(UsernameLength());
      return;
    }

    const payload = {
      username: usernameNew,
      email: emailNew,
    };

    try {
      await axios.put(`api/users/${username}`, payload).then((res) => {
        dispatch(updateUser(res.data));
        setUpdatedDate(convertDate(res.data.userPayload.updatedAt));
        setUsername(res.data.userPayload.username);
        setEmail(res.data.userPayload.email);
        close();
      });
    } catch (err) {
      if (err.response?.status === 403) {
        setError(err.response.data.Error);
        console.log({ err });
      }
      console.log({ err });
    }
  };

  return (
    <div className="infoForm">
      <div className="infoFormContent">
        <h3>Edit user information</h3>
        <div className="verticalSpacer"></div>
        <div className="verticalSpacer"></div>
        <form className="form" onSubmit={handleSubmit}>
          <input type="text" className="inputFieldText" placeholder="Username" value={usernameNew} onChange={(e) => setUsernameNew(e.target.value)} />
          <input type="email" className="inputFieldText" placeholder="Email" value={emailNew} onChange={(e) => setEmailNew(e.target.value)} />
          <div className="verticalSpacer" />
          <button className="buttonRed" type="submit">
            Save
          </button>
        </form>
        {error && (
          <>
            <div className="verticalSpacer" />
            <span className="errorMsg">{error}</span>
          </>
        )}
      </div>
    </div>
  );
};

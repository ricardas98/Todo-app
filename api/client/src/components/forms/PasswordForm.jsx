import { React, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { updateUser } from "../../redux/dataSlice";

import { PasswordMatch, PasswordLength } from "../../ErrorMessages";
import { convertDate } from "../../functions/DataManipulation";

export const PasswordForm = ({ username, setUpdatedDate, close }) => {
  const [password, setPassword] = useState();
  const [passwordR, setPasswordR] = useState();
  const [error, setError] = useState();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError();

    if (password !== passwordR) {
      setError(PasswordMatch());
      return;
    }

    if (password.length < 6) {
      setError(PasswordLength());
      return;
    }

    const payload = {
      password: password,
    };
    try {
      await axios.put(`api/users/${username}`, payload).then((res) => {
        dispatch(updateUser(res.data));
        setUpdatedDate(convertDate(res.data.userPayload.updatedAt));
        console.log(res.data);
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
        <h3>Change password</h3>
        <div className="verticalSpacer"></div>
        <div className="verticalSpacer"></div>
        <form className="form" onSubmit={handleSubmit}>
          <input type="password" className="inputFieldText" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type="password" className="inputFieldText" placeholder="Confirm password" value={passwordR} onChange={(e) => setPasswordR(e.target.value)} />
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

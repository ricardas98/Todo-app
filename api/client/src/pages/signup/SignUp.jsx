import { React, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import axios from "axios";

import { login } from "../../redux/dataSlice";

import { AllFields, PasswordLength, PasswordMatch, UsernameLength } from "../../ErrorMessages";

import "../signin/SignInUp.css";

export const SignUp = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [passwordR, setPasswordR] = useState();
  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError();
    if (!email || !username || !password || !passwordR) {
      setError(AllFields());
      return;
    }
    if (password.length < 6) {
      setError(PasswordLength());
      return;
    }
    if (password !== passwordR) {
      setError(PasswordMatch());
      return;
    }
    if (password.length < 3) {
      setError(UsernameLength());
      return;
    }

    const payload = {
      email,
      username,
      password,
    };
    try {
      await axios.post("api/users", payload).then(async (res) => {
        dispatch(login(res.data));
        window.location.replace("/");
      });
    } catch (err) {
      setError(err.response.data.Error);
    }
  };

  return (
    <div className="sign">
      <div className="signContent">
        <div className="card-l">
          <h3>Sign Up</h3>
          <div className="verticalSpacer" />
          <div className="verticalSpacer" />
          <form className="form" onSubmit={handleSubmit}>
            <input type="email" className="inputFieldText" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="text" className="inputFieldText" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" className="inputFieldText" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <input type="password" className="inputFieldText" placeholder="Repeat Password" onChange={(e) => setPasswordR(e.target.value)} />
            <div className="verticalSpacer" />
            <button className="buttonRed" type="submit">
              Sign Up
            </button>
          </form>
          <div className="verticalSpacer" />
          {error && (
            <>
              <span className="errorMsg">{error}</span> <div className="verticalSpacer" />
            </>
          )}
          <h6>
            Already have an account?{" "}
            <Link to="/sign-in" className="linkRed">
              Sign In
            </Link>
          </h6>
        </div>
      </div>
    </div>
  );
};

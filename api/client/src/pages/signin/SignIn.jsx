import { React, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import axios from "axios";

import { AllFields, PasswordLength } from "../../ErrorMessages";
import { login } from "../../redux/dataSlice";

import "./SignInUp.css";

export const SignIn = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError();

    if (!email || !password) {
      setError(AllFields());
      return;
    }
    if (password.length < 6) {
      setError(PasswordLength());
      return;
    }

    const payload = {
      email,
      password,
    };
    try {
      await axios.post("api/users/login", payload).then(async (res) => {
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
          <h3>Sign In</h3>
          <div className="verticalSpacer" />
          <div className="verticalSpacer" />
          <form className="form" onSubmit={handleSubmit}>
            <input type="email" className="inputFieldText" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" className="inputFieldText" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <div className="verticalSpacer" />
            <button className="buttonRed" type="submit">
              Sign In
            </button>
          </form>
          <div className="verticalSpacer" />
          {error && (
            <>
              <span className="errorMsg">{error}</span> <div className="verticalSpacer" />
            </>
          )}
          <h6>
            Don't have an account?{" "}
            <Link to="/sign-up" className="linkRed">
              Sign Up
            </Link>
          </h6>
        </div>
      </div>
    </div>
  );
};

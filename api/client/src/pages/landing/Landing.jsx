import { React } from "react";

import headerImg from "../../images/LifeManagement.png";
import logosImg from "../../images/TechLogos.png";

import "./Landing.css";

export const Landing = () => {
  return (
    <div className="landingHeader">
      <div className="landingHeaderContent">
        <div className="landingHeaderTitle">
          <h1>ToDo-App</h1>
          <h6 className="landingHeaderSubtitle">Your everyday tasks in one space</h6>
          <button className="buttonRed" onClick={() => window.location.replace("/sign-up")}>
            Try now for free
          </button>
        </div>
        <img className="landingHeaderImg" src={headerImg} alt="headerImg"></img>
      </div>
      <hr className="solidDivider50-100" />
      <div className="landingAboutContent">
        <h3>About the project</h3>
        <div className="verticalSpacer" />
        <h6>The goal of this project is to provide a minimal environment where the user can track their everyday tasks without any extra complexity.</h6>
        <h6>This project was created React.js, Redux, Express.js, MongoDb. The project is hosted on Microsoft Azure server.</h6>
        <img className="landingLogosImg" src={logosImg} alt="techLogosImg"></img>
      </div>
    </div>
  );
};

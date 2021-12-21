import { useState } from "react";
import { useDispatch } from "react-redux";

import { Link } from "react-router-dom";
import { resetState } from "../../redux/dataSlice";

import { IsUserValid, IsUserAdmin } from "../../functions/UserValid";

import logoDesktop from "../../images/logo-desktop.svg";
import logoMobile from "../../images/logo-mobile.svg";
import "./NavBar.css";

export const NavBar = () => {
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSignOut = () => {
    dispatch(resetState());
    window.location.replace("/");
  };

  return (
    <>
      <div className="topBar">
        <div className="topBarContent">
          {/*********************************************DESKTOP**********************************************/}
          <div className="navigation">
            <div className="topLeft">
              <Link to="/" className="logoLink">
                <img src={logoDesktop} alt="logoDesktop" className="navLogoDesktop"></img>
              </Link>
            </div>
            <div className="topRight">
              <ul className="topList">
                <li className="topListItem">
                  <Link to="/" className="link">
                    {IsUserAdmin() ? "Panel" : "Home"}
                  </Link>
                </li>
                {!IsUserValid() && (
                  <>
                    <li className="topListItem">
                      <Link to="/sign-in" className="link">
                        Sign-in
                      </Link>
                    </li>
                    <li className="topListItem">
                      <Link to="/sign-up" className="link">
                        Sign-up
                      </Link>
                    </li>
                  </>
                )}
                {IsUserValid() && (
                  <>
                    <li className="topListItem">
                      <Link to="/profile" className="link">
                        Profile
                      </Link>
                    </li>
                    <li className="topListItem">
                      <a className="link" onClick={handleSignOut}>
                        Sign-out
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
          {/**********************************************MOBILE**********************************************/}
          <div className="navigationMobile">
            <div className="topLeft">
              <Link to="/" className="logoLink">
                <img src={logoMobile} alt="logoMobile" className="navLogoMobile"></img>
              </Link>
            </div>
            <div className="topRight">
              <span className="link">
                {menuOpen ? (
                  <button className="buttonTransparent" onClick={() => toggleMenu()}>
                    <i className="fas fa-times fa-2x"></i>
                  </button>
                ) : (
                  <button className="buttonTransparent" onClick={() => toggleMenu()}>
                    <i className="fas fa-bars fa-2x"></i>
                  </button>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/*******************************************MOBILE LINKS*******************************************/}
      {menuOpen && (
        <div className="mobileMenu">
          <ul className="topList">
            <li className="topListItem" onClick={() => toggleMenu()}>
              <Link to="/" className="link">
                {IsUserAdmin() ? "Panel" : "Home"}
              </Link>
            </li>
            {!IsUserValid() && (
              <>
                <li className="topListItem" onClick={() => toggleMenu()}>
                  <Link to="/sign-in" className="link">
                    Sign-in
                  </Link>
                </li>
                <li className="topListItem" onClick={() => toggleMenu()}>
                  <Link to="/sign-up" className="link">
                    Sign-up
                  </Link>
                </li>
              </>
            )}
            {IsUserValid() && (
              <>
                <li className="topListItem" onClick={() => toggleMenu()}>
                  <Link to="/profile" className="link">
                    Profile
                  </Link>
                </li>
                <li className="topListItem" onClick={() => toggleMenu()}>
                  <a className="link" onClick={handleSignOut}>
                    Sign-out
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

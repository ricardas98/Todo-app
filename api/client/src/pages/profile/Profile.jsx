import { React, useEffect, useState } from "react";
import { useModal } from "react-hooks-use-modal";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { setError, toggleFetchingOn, toggleFetchingOff, resetState } from "../../redux/dataSlice";

import { Loader } from "../../components/loader/Loader";

import { Modal } from "../../components/modal/Modal";
import { UserForm } from "../../components/forms/UserForm";
import { PasswordForm } from "../../components/forms/PasswordForm";
import { DeleteAccountForm } from "../../components/forms/DeleteAccountForm";

import { convertDate } from "../../functions/DataManipulation";
import { handleError } from "../../ErrorMessages";

import "./Profile.css";
import { IsUserAdmin, IsUserValid } from "../../functions/UserValid";
import { CategoryForm } from "../../components/forms/CategoryForm";

export const Profile = () => {
  const dispatch = useDispatch();

  const isFetching = useSelector((state) => state.data.user.isFetching);

  const [username, setUsername] = useState(useSelector((state) => state.data.user.username));
  const [email, setEmail] = useState();
  const [updatedDate, setUpdatedDate] = useState();

  const [ModalInfo, openInfo, closeInfo] = useModal("root", {
    preventScroll: true,
    closeOnOverlayClick: false,
  });

  const [ModalPass, openPass, closePass] = useModal("root", {
    preventScroll: true,
    closeOnOverlayClick: false,
  });

  const [ModalDelAcc, openDelAcc, closeDelAcc] = useModal("root", {
    preventScroll: true,
    closeOnOverlayClick: false,
  });

  const [ModalCategories, openCategories, closeCategories] = useModal("root", {
    preventScroll: true,
    closeOnOverlayClick: false,
  });

  useEffect(() => {
    async function fetchData() {
      dispatch(toggleFetchingOn());
      try {
        await axios.get(`api/users/${username}`).then((res) => {
          setEmail(res.data.email);
          setUpdatedDate(convertDate(res.data.updatedAt));
        });
      } catch (err) {
        if (err.response?.status === 403) {
          dispatch(setError(err.response.status));
        }
      }
      dispatch(toggleFetchingOff());
    }

    fetchData();
  }, []);

  async function deleteUser() {
    try {
      await axios.delete(`api/users/${username}`).then(() => {
        closeDelAcc();
        dispatch(resetState());
        window.location.replace("/");
      });
    } catch (err) {
      if (err.response?.status === 403) {
        setError(err.response.data.Error);
      }
    }
  }

  return IsUserValid() ? (
    <>
      <div className="profile">
        <div className="profileHeader">
          <div className="profileHeaderContent">
            <div className="profileHeaderTitle">
              <h2>My Profile</h2>
            </div>
          </div>
          <hr className="solidDivider50-50" />
          {isFetching ? (
            <Loader />
          ) : (
            <div className="profileInfo">
              <div className="profileInfoContent">
                <div className="profileInfoItem">
                  <span className="profileInfoTitle">Username:</span>
                  <span className="profileInfoValue"> {username}</span>
                </div>
                <div className="profileInfoItem">
                  <span className="profileInfoTitle">Email:</span>
                  <span className="profileInfoValue"> {email}</span>
                </div>
                <div className="profileInfoItem">
                  <span className="profileInfoTitle">Last time updated:</span>
                  <span className="profileInfoValue"> {updatedDate}</span>
                </div>
                <div className="verticalSpacer" />
                <div className="profileButtons">
                  <div className="profileButtonsTop">
                    <button className="buttonGrey  mr-10" onClick={openInfo}>
                      Edit account information
                    </button>
                    <button className="buttonGrey mr-10" onClick={openPass}>
                      Change password
                    </button>
                    {!IsUserAdmin() && (
                      <button className="buttonGrey" onClick={openCategories}>
                        Edit task categories
                      </button>
                    )}
                  </div>
                  <div className="profileButtonsBottom">
                    <button className="buttonRed " onClick={openDelAcc}>
                      Delete account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal Modal={ModalInfo} close={closeInfo}>
        <UserForm
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          updatedDate={updatedDate}
          setUpdatedDate={setUpdatedDate}
          close={closeInfo}
        />
      </Modal>
      <Modal Modal={ModalPass} close={closePass}>
        <PasswordForm username={username} setUpdatedDate={setUpdatedDate} close={closePass} />
      </Modal>
      <Modal Modal={ModalDelAcc} close={closeDelAcc}>
        <DeleteAccountForm close={closeDelAcc} deleteUser={deleteUser} />
      </Modal>
      <Modal Modal={ModalCategories} close={closeCategories}>
        <CategoryForm />
      </Modal>
    </>
  ) : (
    handleError()
  );
};

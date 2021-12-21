import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useModal } from "react-hooks-use-modal";

import { Users } from "../../components/users/Users";
import { Tasks } from "../../components/tasks/Tasks";
import { Modal } from "../../components/modal/Modal";
import { StayLoggedInForm } from "../../components/forms/StayLoggedInForm";

import { IsTokenCloseToExpiration, IsUserAdmin } from "../../functions/UserValid";

import "./Home.css";

export const Home = () => {
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const state = useSelector((state) => state.data);

  const [ModalRefresh, openRefresh, closeRefresh, isOpenRefresh] = useModal("root", {
    preventScroll: true,
    closeOnOverlayClick: false,
  });

  useEffect(() => {
    setNeedsRefresh(IsTokenCloseToExpiration());
    if (needsRefresh && !isOpenRefresh) openRefresh();
  }, [state]);
  return (
    <>
      <div className="home">
        <div className="homeHeader">
          <div className="homeHeaderContent">
            <div className="homeHeaderTitle">
              <h2>{IsUserAdmin() ? "Users" : "My tasks"}</h2>
            </div>
          </div>
          <div className="verticalSpacer" />
          <div className="homeContent">
            <div className="homeContentItem">{IsUserAdmin() ? <Users /> : <Tasks />}</div>
          </div>
        </div>
      </div>
      {
        <Modal Modal={ModalRefresh} close={closeRefresh}>
          <StayLoggedInForm close={closeRefresh} />
        </Modal>
      }
    </>
  );
};

import { React } from "react";
import { IsUserAdmin } from "../../functions/UserValid";

export const DeleteAccountForm = ({ username, deleteUser }) => {
  return (
    <div className="infoForm">
      <div className="infoFormContent">
        <h3>Are you sure you want to delete {IsUserAdmin() ? username + "'s" : "your"} account?</h3>
        <div className="verticalSpacer"></div>
        <div className="verticalSpacer"></div>
        <div className="form">
          <button className="buttonRed" onClick={() => deleteUser(username)}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

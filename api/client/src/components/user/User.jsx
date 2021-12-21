import { useModal } from "react-hooks-use-modal";

import { Modal } from "../../components/modal/Modal";
import { DeleteAccountForm } from "../../components/forms/DeleteAccountForm";

export const User = ({ user, deleteUser }) => {
  const [ModalDelAcc, openDelAcc, closeDelAcc] = useModal("root", {
    preventScroll: true,
    closeOnOverlayClick: false,
  });

  return (
    <>
      <div className="listItem">
        <div className="listItemContent">
          <div className="listItemContentLeft">
            <span className="listItemContentText">{user.username}</span>
          </div>
          <div className="listItemContentRight">
            <span className="listItemContentCaption">{user.email}</span>
            <span className="listItemIcon">
              <button className="buttonTransparent" onClick={() => openDelAcc()}>
                <i className="fas fa-trash-alt fa-md"></i>
              </button>
            </span>
          </div>
        </div>
      </div>
      <Modal Modal={ModalDelAcc} close={closeDelAcc}>
        <DeleteAccountForm close={closeDelAcc} username={user.username} deleteUser={deleteUser} />
      </Modal>
    </>
  );
};

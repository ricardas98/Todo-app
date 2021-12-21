import "../modal/Modal.css";

export const Modal = ({ children, Modal, close }) => {
  return (
    <Modal>
      <div className="modal">
        <div className="modalHeader">
          <button className="buttonTransparent" onClick={close}>
            <i className="fas fa-times fa-2x"></i>
          </button>
        </div>
        <div className="modalContent">{children}</div>
      </div>
    </Modal>
  );
};

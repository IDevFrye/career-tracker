import React from "react";
import "./ConfirmModal.scss";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  type = "danger",
}) => {
  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case "danger":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1H5C3.89,1 3,1.89 3,3V21A2,2 0 0,0 5,23H19A2,2 0 0,0 21,21V9M19,9H14V4H5V21H19V9Z" />
          </svg>
        );
      case "warning":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16" />
          </svg>
        );
      case "info":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,7H13A2,2 0 0,1 15,9V15A2,2 0 0,1 13,17H11A2,2 0 0,1 9,15V9A2,2 0 0,1 11,7M11,9V15H13V9H11Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="confirm-modal-overlay" onClick={handleBackdropClick}>
      <div className={`confirm-modal confirm-modal--${type}`}>
        <div className="confirm-modal__icon">{getIcon()}</div>
        <div className="confirm-modal__content">
          <h3 className="confirm-modal__title">{title}</h3>
          <p className="confirm-modal__message">{message}</p>
        </div>
        <div className="confirm-modal__actions">
          <button
            className="confirm-modal__btn confirm-modal__btn--cancel"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className={`confirm-modal__btn confirm-modal__btn--confirm confirm-modal__btn--${type}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

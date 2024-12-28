// @src/components/Modal/ConfirmDeleteModal.jsx
import { Modal } from "../Modal/Modal";

export const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, userName }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="h4">Confirm Deletion</h2>
            <p>Are you sure you want to delete {userName}? <br />This action cannot be undone.</p>
            <div className="flex gap-4 mt-4">
                <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
                <button className="btn btn-outline min-w-[139px]" onClick={onClose}>Cancel</button>
            </div>
        </Modal>
    );
};

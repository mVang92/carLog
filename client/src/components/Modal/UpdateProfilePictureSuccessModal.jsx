import React from "react";
import ReactModal from "react-modal";

const UpdateProfilePictureSuccessModal = props => {
    return (
        <ReactModal
            isOpen={props.showUpdateProfilePictureSuccessModal}
            contentLabel="Minimal Modal Example"
            className="Modal__Bootstrap modal-dialog"
            shouldCloseOnOverlayClick={true}
            closeTimeoutMS={150}
        >
            <div className="accountModal modal-content">
                <div className="modal-body modalShadow">
                    <div className="modalBody">
                        <div className="row modal-header">
                            <div className="col-md-12 text-center">
                                <label><strong>Profile picture updated!</strong></label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                title="Okay"
                                type="button"
                                className="cancelBtn"
                                onClick={props.hideUpdateProfilePictureSuccessModal}
                                data-dismiss="modal">
                                Okay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
};

export default UpdateProfilePictureSuccessModal;
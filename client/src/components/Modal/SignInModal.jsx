import React from "react";
import Modal from "react-modal";
import createAccountLogo from "../../images/createAccount.png"

const SignIn = props => {
    const { handleChange } = props;
    return (
        <Modal
            isOpen={props.showSignInModal}
            className="Modal__Bootstrap modal-dialog"
            shouldCloseOnOverlayClick={true}
            closeTimeoutMS={0}
            onRequestClose={props.requestHideSignInModal}
        >
            <div className="accountModal modal-content">
                <div className="modal-body modalShadow">
                    <form className="modalBody" onSubmit={props.handleSignIn}>
                        <div className="modal-header">
                            <span>
                                <img
                                    id="createAccountLogo"
                                    src={createAccountLogo}
                                    alt="account"
                                />
                                <label><strong>Sign-In to Your Account</strong></label>
                            </span>
                        </div>
                        <div className="modal-body">
                            <input
                                id="emailInput"
                                type="text"
                                value={props.email}
                                name="email"
                                onChange={handleChange}
                                placeholder="Email"
                                maxLength="128">
                            </input>
                            <br /><br />
                            <input
                                id="passwordInput"
                                type="password"
                                value={props.password}
                                name="password"
                                onChange={handleChange}
                                placeholder="Password"
                                maxLength="128">
                            </input>
                            <br /><br />
                            <span
                                id="signUpLink"
                                onClick={props.requestShowSignUpModal}
                                title="Sign Up">
                                I Need an Account
                            </span>
                            <br />
                            <span
                                id="forgotPassword"
                                onClick={props.requestShowForgotPasswordModal}
                                title="Forgot Password">
                                Forgot Password?
                            </span>
                        </div>
                        <div className="modal-footer">
                            <button
                                id="closeSignInModal"
                                title="Close"
                                type="button"
                                className="btn btn-light"
                                onClick={props.requestHideSignInModal}
                                data-dismiss="modal">
                                Close
                            </button>
                            <button
                                id="signInButton"
                                title="Sign In"
                                className="btn btn-light"
                                type="submit"
                                disabled={props.disableSignInButton}>
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default SignIn;

import React, { Component } from "react";
import Modal from "react-modal";
import { firebase } from "../../firebase"
import { themes } from "../../themes/Themes";
import { defaults } from "../../assets/Defaults";
import updateApi from "../../utils/updateApi";
import vehicleApi from "../../utils/API";
import UpdatePageDetails from "../../components/UpdatePageDetails";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";

export default class Updates extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: "",
      allUpdates: [],
      admin: false,
      pageLoaded: false,
      updateChanges: "",
      knownIssues: "",
      updateChangesToShowInModal: "",
      knownIssuesToShowInModal: "",
      theme: "",
      currentTheme: "",
      backgroundPicture: "",
      updateId: "",
      releaseNotesToUpdate: "",
      knownIssuesToUpdate: "",
      showEditOneUpdateModal: false,
      showDeleteOneUpdateModal: false,
      disableConfirmSaveEditReleaseNoteButton: false,
      disableConfirmDeleteReleaseNoteButton: false
    };
  };

  /**
   * Fetch all updates and release notes
   * Also check if the viewer is an admin user
   */
  componentDidMount = () => {
    Modal.setAppElement("body");
    this.getAllUpdates();
  };

  /**
   * Handle real-time changes
   */
  handleChange = e => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  /**
   * Scroll to the top of the page
   */
  backToTopOfPage = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  /**
   * Adds an update to the database
   */
  addOneUpdate = e => {
    e.preventDefault();
    vehicleApi.findUserInformationForOneUser(this.state.userId)
      .then(res => {
        if (res.data.admin) {
          const payload = {
            updateChanges: this.state.updateChanges,
            knownIssues: this.state.knownIssues,
            releaseNotesToUpdate: "",
            knownIssuesToUpdate: ""
          };
          updateApi.addOneUpdate(payload)
            .then(() => {
              this.getAllUpdates();
              this.successNotification(defaults.addOneReleaseNoteSuccess);
              this.setState({
                updateChanges: "",
                knownIssues: ""
              });
            })
            .catch(err => this.errorNotification(err));
        } else {
          alert(defaults.noAuthorizationToPerformAction);
          window.location = "/";
        }
      })
      .catch(err => this.errorNotification(err));
  };

  /**
   * Gets all of the updates and release notes from the database
   * If successful or if there is an error, then find the user information
   */
  getAllUpdates = () => {
    updateApi.getAllUpdates()
      .then(res => {
        this.setState({ allUpdates: res.data },
          () => this.findUserInformationForOneUser());
      })
      .catch(err => {
        this.errorNotification(err);
        this.findUserInformationForOneUser();
      });
  };

  /**
   * Get user information for the user logged in
   */
  findUserInformationForOneUser = () => {
    firebase.auth.onAuthStateChanged(user => {
      if (user) {
        vehicleApi.findUserInformationForOneUser(user.uid)
          .then(res => {
            try {
              this.setState({
                userId: user.uid,
                admin: res.data.admin,
                theme: res.data.theme,
                backgroundPicture: res.data.backgroundPicture,
                pageLoaded: true,
              }, () => {
                this.determineTheme();
              });
            } catch (err) {
              this.setState({ pageLoaded: true });
            }
          })
          .catch(err => this.errorNotification(err));
      } else {
        this.setState({ pageLoaded: true });
      }
    });
  };

  /**
   * Determine what the current theme is
   */
  determineTheme = () => {
    if (this.state.theme) {
      switch (this.state.theme) {
        case defaults.carSpaceTheme:
          this.renderTheme(themes.carSpace);
          break;
        case defaults.lightTheme:
          this.renderTheme(themes.light);
          break;
        case defaults.greyTheme:
          this.renderTheme(themes.grey);
          break;
        case defaults.darkTheme:
          this.renderTheme(themes.dark);
          break;
        case defaults.transparentLightTheme:
          this.renderTheme(themes.transparentLight);
          break;
        case defaults.transparentGreyTheme:
          this.renderTheme(themes.transparentGrey);
          break;
        case defaults.transparentDarkTheme:
          this.renderTheme(themes.transparentDark);
          break;
        default:
          this.errorNotification(defaults.themeSelectionError);
      }
    } else {
      if (this.state.backgroundPicture) {
        document.body.style.backgroundImage = "url(" + this.state.backgroundPicture + ")";
      } else {
        document.body.style.backgroundImage = "";
      }
    }
  };

  /**
   * Render the theme and background picture
   * 
   * @param theme The type of theme to render
   */
  renderTheme = theme => {
    this.setState({ currentTheme: theme });
    if (this.state.backgroundPicture) {
      document.body.style.backgroundImage = "url(" + this.state.backgroundPicture + ")";
    } else {
      document.body.style.backgroundColor = theme.backgroundColor;
    }
  };

  /**
   * Display the modal to edit one update
   * 
   * @param updateId      the update id to target
   * @param updateChanges the update or release notes to save
   * @param knownIssues   the known issues to save
   */
  editOneUpdateModal = (updateId, updateChanges, knownIssues) => {
    this.setState({
      showEditOneUpdateModal: true,
      updateId: updateId,
      updateChangesToShowInModal: updateChanges,
      knownIssuesToShowInModal: knownIssues,
      releaseNotesToUpdate: "",
      knownIssuesToUpdate: ""
    });
  };

  /**
   * Display the modal to delete one update
   */
  deleteOneUpdateModal = () => {
    this.setState({
      showDeleteOneUpdateModal: true,
      showEditOneUpdateModal: false
    });
  };

  /**
   * Validate the new data for editing a release note
   */
  checkUserEnteredUpdatedReleaseNoteInput = e => {
    e.preventDefault();
    let untouchedReleaseNote = this.state.updateChangesToShowInModal;
    let untouchedKnownIssues = this.state.knownIssuesToShowInModal;
    let releaseNotesToUpdate = this.state.releaseNotesToUpdate;
    let knownIssuesToUpdate = this.state.knownIssuesToUpdate;
    let newReleaseNotes = "";
    let newKnownIssues = "";
    if (releaseNotesToUpdate) {
      newReleaseNotes = releaseNotesToUpdate;
    } else {
      newReleaseNotes = untouchedReleaseNote;
    }
    if (knownIssuesToUpdate) {
      newKnownIssues = knownIssuesToUpdate;
    } else {
      newKnownIssues = untouchedKnownIssues;
    }
    if (this.checkIfStringIsBlank(newReleaseNotes) || this.checkIfStringIsBlank(newKnownIssues)) {
      this.releaseNoteInvalidInputErrorNotification();
    } else {
      this.handleUpdateOneReleaseNote(newReleaseNotes, newKnownIssues);
    }
  };

  /**
   * Check if the user input value is blank
   */
  checkIfStringIsBlank = string => {
    return (!string || /^\s*$/.test(string));
  };

  /**
   * Update the release note
   * 
   * @param newReleaseNotes The new release note to update the old one
   * @param newKnownIssues The known issues to update the old one
   */
  handleUpdateOneReleaseNote = (newReleaseNotes, newKnownIssues) => {
    vehicleApi.findUserInformationForOneUser(this.state.userId)
      .then(res => {
        if (res.data.admin) {
          let payload = {
            newReleaseNotes,
            newKnownIssues
          };
          this.setState({ disableConfirmSaveEditReleaseNoteButton: true });
          updateApi.updateOneReleaseNote(this.state.updateId, payload)
            .then(() => {
              this.getAllUpdates();
              this.successNotification(defaults.updateOneReleaseNoteSuccess);
              this.setState({
                showEditOneUpdateModal: false,
                disableConfirmSaveEditReleaseNoteButton: false
              });
            })
            .catch(err => {
              this.errorNotification(err);
              this.setState({ disableConfirmSaveEditReleaseNoteButton: false });
            });
        } else {
          alert(defaults.noAuthorizationToPerformAction);
          window.location = "/";
        }
      })
      .catch(err => this.errorNotification(err));
  };

  /**
   * Delete the release note from record
   */
  handleDeleteOneReleaseNote = () => {
    vehicleApi.findUserInformationForOneUser(this.state.userId)
      .then(res => {
        if (res.data.admin) {
          this.setState({ disableConfirmDeleteReleaseNoteButton: true });
          updateApi.deleteOneReleaseNote(this.state.updateId)
            .then(() => {
              this.getAllUpdates();
              this.successNotification(defaults.deleteOneReleaseNoteSuccess);
              this.setState({
                showDeleteOneUpdateModal: false,
                disableConfirmDeleteReleaseNoteButton: false
              });
            })
            .catch(err => {
              this.errorNotification(err);
              this.setState({ disableConfirmDeleteReleaseNoteButton: false });
            });
        } else {
          alert(defaults.noAuthorizationToPerformAction);
          window.location = "/";
        }
      })
      .catch(err => this.errorNotification(err));
  };

  /**
   * Hide the edit one update modal
   */
  hideEditOneUpdateModal = () => {
    this.setState({ showEditOneUpdateModal: false });
  };

  /**
   * Hide the delete one update modal
   */
  hideDeleteOneUpdateModal = () => {
    this.setState({ showDeleteOneUpdateModal: false });
  };

  /**
   * Display the success notification when the admin user performs an action successfully
   * 
   * @param message the message to display to the user
   */
  successNotification = message => {
    toast.success(message);
  };

  /**
   * Display the error notification when an error occurs while executing a database query
   * 
   * @param err the error message to display to the user
   */
  errorNotification = err => {
    toast.error(err.toString());
  };

  /**
   * Display the error notification when there is invalid input while updating a release note
   */
  releaseNoteInvalidInputErrorNotification = () => {
    toast.error(defaults.invalidInputDetected);
  };

  render() {
    return (
      <React.Fragment>
        {
          this.state.allUpdates ? (
            <React.Fragment>
              {
                this.state.pageLoaded ?
                  (
                    <UpdatePageDetails
                      currentTheme={this.state.currentTheme}
                      admin={this.state.admin}
                      handleChange={this.handleChange}
                      addOneUpdate={this.addOneUpdate}
                      updateChanges={this.state.updateChanges}
                      knownIssues={this.state.knownIssues}
                      allUpdates={this.state.allUpdates}
                      getActionValue={this.getActionValue}
                      backToTopOfPage={this.backToTopOfPage}
                      checkUserEnteredUpdatedReleaseNoteInput={this.checkUserEnteredUpdatedReleaseNoteInput}
                      showEditOneUpdateModal={this.state.showEditOneUpdateModal}
                      editOneUpdateModal={this.editOneUpdateModal}
                      deleteOneUpdateModal={this.deleteOneUpdateModal}
                      hideEditOneUpdateModal={this.hideEditOneUpdateModal}
                      updateChangesToShowInModal={this.state.updateChangesToShowInModal}
                      knownIssuesToShowInModal={this.state.knownIssuesToShowInModal}
                      disableConfirmSaveEditReleaseNoteButton={this.state.disableConfirmSaveEditReleaseNoteButton}
                      handleDeleteOneReleaseNote={this.handleDeleteOneReleaseNote}
                      showDeleteOneUpdateModal={this.state.showDeleteOneUpdateModal}
                      hideDeleteOneUpdateModal={this.hideDeleteOneUpdateModal}
                      disableConfirmDeleteReleaseNoteButton={this.state.disableConfirmDeleteReleaseNoteButton}
                    />
                  ) : (
                    <Loading />
                  )
              }
            </React.Fragment>
          ) : (
              <Loading />
            )
        }
      </React.Fragment>
    );
  };
};

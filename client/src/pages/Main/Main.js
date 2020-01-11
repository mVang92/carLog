import React, { Component } from "react";
import { firebase } from "../../firebase"
import Modal from "react-modal";
import API from "../../utils/API";
import AddVehicleYearNanErrorModal from "../../components/Modal/AddVehicleYearNanErrorModal";
import Container from "../../components/Container";
import Loading from "../../components/Loading";
import LoggedOut from "../../components/LoggedOut";
import LoggedIn from "../../components/LoggedIn";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddVehicleYearNanErrorModal: false,
      loggedin: false,
      pageLoaded: false,
      uid: "",
      vehicleData: [],
      vehicleCount: 0,
      message: "",
      email: "",
      password: "",
      userProfilePicture: "",
      defaultDisplayName: "CarSpace User"
    };
  };

  /**
   * Logs the user in if they are logged in
   */
  componentDidMount = () => {
    Modal.setAppElement("body");
    this.onAuthStateChanged();
  };

  /**
   * Show the display name to the main page
   */
  showDisplayName = displayName => {
    let displayNameToShow = document.createTextNode(displayName);
    document.getElementById("displayName").innerHTML = "";
    document.getElementById("displayName").appendChild(displayNameToShow);
  };

  /**
   * Upon page refresh, if the user is logged in, they will stay logged in
   */
  onAuthStateChanged = () => {
    firebase.auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          loggedin: true,
          pageLoaded: true,
          userProfilePicture: user.photoURL
        });
        let displayName = user.displayName;
        if (displayName) {
          this.showDisplayName(displayName);
        } else {
          this.showDisplayName(this.state.defaultDisplayName);
        }
        const userUniqueId = user.uid;
        API.getAllVehiclesForUser(userUniqueId)
          .then(res =>
            this.setState({
              vehicleData: res.data,
              uid: user.uid
            })
          )
          .catch(err => this.loadVehiclesFailNotification(err));
      };
    });
  };

  /**
   * Handle real-time changes
   */
  handleChange = e => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  /**
   * Add a new vehicle to the vehicle data for the user
   * 
   * @param newVehicle the new vehicle to record into data
   */
  handleAddOneVehicle = newVehicle => {
    const id = this.state.uid;
    if (isNaN(newVehicle.year) || (newVehicle.year < 1885)) {
      this.showAddVehicleYearNanErrorModal();
    } else {
      API.addOneVehicle(id, newVehicle)
        .then(() => {
          this.addOneVehicleSuccessNotification(newVehicle.year, newVehicle.make, newVehicle.model);
          this.onAuthStateChanged();
        })
        .catch(err => this.addOneVehicleFailNotification(err));
    };
  };

  /**
   * Display the error notification when an error occurs while loading vehicles
   * 
   * @param err the error message to display to the user
   */
  loadVehiclesFailNotification = err => {
    toast.error(`Loading Vehicles ${err.toString()}`);
  };

  /**
   * Display the success notification when a vehicle is successfully added
   * 
   * @param year  the year of the vehicle
   * @param make  the make of the vehicle
   * @param model the model of the vehicle
   */
  addOneVehicleSuccessNotification = (year, make, model) => {
    toast.success(`Added a ${year} ${make} ${model}.`);
  };

  /**
   * Display the error notification when an error occurs while adding a vehicle
   * 
   * @param err the error message to display to the user
   */
  addOneVehicleFailNotification = err => {
    toast.error(err.toString());
  };

  /**
   * Display the info notification when the user resets the fields to add a vehicle
   */
  handleResetAddVehicleFields = () => {
    toast.info(`Input Fields Reset`);
  };

  /**
   * Display the modal to notify the user the vehicle year must be a number
   */
  showAddVehicleYearNanErrorModal = () => {
    this.setState({ showAddVehicleYearNanErrorModal: true });
  };

  /**
   * Hide the modal to notify the user the vehicle year must be a number
   */
  hideAddVehicleYearNanErrorModal = () => {
    this.setState({ showAddVehicleYearNanErrorModal: false });
  };

  render() {
    return (
      <React.Fragment>
        {
          this.state.loggedin ?
            (
              this.state.pageLoaded ?
                (
                  <Container>
                    <LoggedIn
                      vehicleData={this.state.vehicleData}
                      handleChange={this.handleChange}
                      handleResetAddVehicleFields={this.handleResetAddVehicleFields}
                      addVehicle={this.handleAddOneVehicle}
                      userProfilePicture={this.state.userProfilePicture}
                    />
                  </Container>
                ) : (
                  <Loading />
                )
            ) : (
              <LoggedOut />
            )
        }
        <AddVehicleYearNanErrorModal
          showAddVehicleYearNanErrorModal={this.state.showAddVehicleYearNanErrorModal}
          hideAddVehicleYearNanErrorModal={this.hideAddVehicleYearNanErrorModal}
        />
        <ToastContainer />
      </React.Fragment>
    );
  };
};

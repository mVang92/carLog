import React, { Component } from "react";
import { firebase, auth } from "../../firebase"
import Modal from "react-modal";
import API from "../../utils/API";
import ModalConductor from "../../components/Modal/ModalConductor";
import Nav from "../../components/Nav";
import Container from "../../components/Container";
import LoggedOut from "../../components/LoggedOut";
import LoggedIn from "../../components/LoggedIn";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      loggedin: false,
      uid: "",
      currentModal: String,
      vehicleData: [],
      // User Authentication
      message: "",
      email: "",
      password: ""
    };
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  };

  componentWillMount = () => {
    Modal.setAppElement("body");
    this.onAuthStateChanged();
    this.setState({
      vehicleData: []
    });
  };

  loadVehicles = () => {
    API.getVehicles()
      .then(res =>
        this.setState({
          vehicleData: res.data,
          year: "",
          make: "", model: ""
        })
      )
      .catch(err => console.log(err));
  };

  authClick = e => {
    const { name } = e.target
    // console.log(name);
    this.setState({
      currentModal: name,
      showModal: true
    });
  };

  createUserData = () => {
    const bindThis = this;
    firebase.auth.onAuthStateChanged(function (user) {
      if (user) {
        API.createUserData(user.uid)
          .then(function (res) {
            console.log(res);
            bindThis.componentWillMount();
          });
      };
    });
  };

  // Upon page refresh, if the user is logged in, they will stay logged in
  onAuthStateChanged = () => {
    const bindThis = this;
    firebase.auth.onAuthStateChanged(user => {
      if (user) {
        bindThis.setState({ loggedin: true });
        let userName = document.createTextNode(user.email);
        document.getElementById("userEmail").innerHTML = "";
        document.getElementById("userEmail").appendChild(userName);
        const id = user.uid;
        API.getVehicles(id)
          .then(res => this.setState({
            vehicleData: res.data,
            uid: user.uid
          }))
          .catch(err => console.log(err));
      } else {
        console.log("Please sign-in or sign-up.");
      };
    });
  };

  handleSignUp = e => {
    e.preventDefault();
    auth
      .doCreateUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        console.log("signing up: " + this.state.email);
        this.setState({
          loggedin: true,
          message: ""
        });
        this.createUserData();
        this.handleCloseModal();
      })
      .catch(error => {
        this.setState({ message: error.message })
        const message = document.createTextNode(this.state.message);
        document.getElementById("error").innerHTML = "";
        document.getElementById("error").appendChild(message);
      });
  };

  handleSignIn = e => {
    e.preventDefault();
    auth
      .doSignInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        console.log("signing in: " + this.state.email);
        this.setState({
          loggedin: true,
          message: ""
        });
        this.handleCloseModal();
      })
      .catch(error => {
        this.setState({ message: error.message });
        const message = document.createTextNode(this.state.message);
        document.getElementById("error").innerHTML = "";
        document.getElementById("error").appendChild(message);
      });
  };

  handleSignOut = e => {
    e.preventDefault();
    auth
      .doSignOut()
      .then(() => {
        this.setState({
          loggedin: false,
          email: "",
          password: ""
        });
      });
    // Reloads the page upon sign out
    // Quick fix to prevent multiple user entries into db when signing up
    window.location.reload(true);
  };

  handleChange = e => {
    let { name, value } = e.target;
    this.setState({
      [name]: value,
    });
    // console.log(name, value);
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  // Receives our states from MyVehicles.js to be used in this main component
  handleAddVehicle = newVehicle => {
    console.log(newVehicle)
    const id = this.state.uid;
    const bindThis = this;
    let vehicles = this.state.vehicleData;
    vehicles.push(newVehicle);
    this.setState({
      vehicleData: vehicles
    });
    let element = this.state.vehicleData.length - 1;
    console.log(this.state.vehicleData[element].year)
    // Check to see if the year is a number.
    if (isNaN(this.state.vehicleData[element].year)) {
      alert("Please enter numerical values for year.");
      // Refreshes page, simple way of preventing
      // bad user input to populate dropdown menu
      this.loadVehicles();
    } else {
      const data = {
        year: this.state.vehicleData[element].year,
        make: this.state.vehicleData[element].make,
        model: this.state.vehicleData[element].model
      }
      // console.log(id, data)
      API.addVehicle(id, data)
        .then(function (res) {
          console.log(res.data);
          bindThis.onAuthStateChanged();
          bindThis.loadVehicles();
        })
    };
  };

  handleDeleteVehicle = id => {
    if (id) {
      API.deleteVehicle(id)
        .then(res => this.loadVehicles(),
          console.log("Deleted: " + id)
        );
    } else {
      alert("Error: Cannot process " + id);
    }
  };

  render() {
    return (
      <React.Fragment>
        <Nav
          loggedin={this.state.loggedin}
          authClick={this.authClick}
          signOut={this.handleSignOut}
        />
        <Container>
          {this.state.loggedin === true ? (
            // Here we pass in vehicles to the LoggedIn component
            <LoggedIn
              vehicles={this.state.vehicleData}
              handleChange={this.handleChange}
              addVehicle={this.handleAddVehicle.bind(this)}
              deleteVehicle={this.handleDeleteVehicle.bind(this)}
            />
          ) : (
              <LoggedOut />
            )}
        </Container>
        <ModalConductor
          currentModal={this.state.currentModal}
          handleCloseModal={this.handleCloseModal}
          showModal={this.state.showModal}
          handleSignIn={this.handleSignIn}
          handleSignOut={this.handleSignOut}
          handleSignUp={this.handleSignUp}
          handleChange={this.handleChange}
        />
      </React.Fragment>
    );
  };
};

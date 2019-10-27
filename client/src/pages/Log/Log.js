import React, { Component } from "react";
import API from "../../utils/API";
import Container from "../../components/Container";
import AddLog from "../../components/AddLog";
import DeleteOneVehicleModal from "../../components/Modal/DeleteOneVehicleModal";
import AddLogErrorModal from "../../components/Modal/AddLogErrorModal"
import MileageInputErrorModal from "../../components/Modal/MileageInputErrorModal"
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Log extends Component {
  state = {
    vehicle: [],
    vehicleId: "",
    make: "",
    model: "",
    date: "",
    mileage: "",
    service: "",
    comment: "",
    logArray: [],
    showDeleteOneVehicleModal: false,
    showAddLogErrorModal: false,
    showMileageInputErrorModal: false
  };

  /**
   * Display the service log information for the selected vehicle
   */
  componentWillMount = () => {
    Modal.setAppElement("body");
    this.setState({
      vehicleId: this.props.match.params.id
    });
    API.getOneVehicleForUser(this.props.match.params.id)
      .then(res => {
        //console.log(res.data)
        this.setState({
          vehicle: res.data,
          // vehicleId: res.data.creator,
          // logArray: res.data.logs
        })
        // .catch(err => console.log(err))
      });
  };

  /**
   * Handle real-time changes
   */
  handleChange = e => {
    let { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  /**
   * Records a service log fot the vehicle
   */
  handleSubmitOneServiceLog = e => {
    e.preventDefault();
    if (isNaN(this.state.mileage)) {
      this.showMileageInputErrorModal();
    } else {
      if (this.state.date === "" || this.state.mileage === "" || this.state.service === "") {
        this.showAddLogErrorModal();
      } else {
        console.log("date: " + this.state.date)
        console.log("mileage: " + this.state.mileage)
        console.log("service: " + this.state.service)
        console.log("comment: " + this.state.comment)
        let id = this.state.vehicleId;
        let log = {
          date: this.state.date,
          mileage: this.state.mileage,
          service: this.state.service,
          comment: this.state.comment
        };
        console.log("id: " + id)
        console.log(log)
        API.addOneLogForOneVehicle(id, log)
          .then(res => {
            console.log(res);
            this.addOneServiceLogSuccessNotification(this.state.date, this.state.mileage, this.state.service);
          })
          .catch(err =>
            this.addOneServiceLogFailNotification(err)
          );
        setTimeout(() => {
          this.setState({
            date: "",
            mileage: "",
            service: "",
            comment: ""
          });
        }, 500);
      };
    };
  };

  /**
   * Reset the date, mileage, service, and comment input boxes to empty
   */
  handleResetLogVehicleForm = () => {
    this.setState({
      date: "",
      mileage: "",
      service: "",
      comment: ""
    });
    this.resetFieldsNotification();
  };

  /**
   * Deletes one vehicle from record
   */
  handleDeleteOneVehicle = () => {
    API.deleteOneVehicle(this.state.vehicleId)
      .then(() => {
        this.deleteOneVehicleSuccessNotification();
      })
      .catch(err =>
        this.deleteOneVehicleFailNotification(err)
      );
  };

  /**
   * Display the success notification when the user adds a service log
   * 
   * @param date    the date when the service is logged
   * @param mileage the current mileage of the vehicle
   * @param service the service done to the vehicle
   */
  addOneServiceLogSuccessNotification = (date, mileage, service) => {
    toast.success(`Service Logged: ${service} at ${mileage} miles on ${date}.`);
  };

  /**
   * Display the error notification when an error occurs while adding a service log
   * 
   * @param err the error message to display to the user
   */
  addOneServiceLogFailNotification = err => {
    toast.error(err.toString());
  };

  /**
   * Display the success notification when the user deletes a vehicle
   */
  deleteOneVehicleSuccessNotification = () => {
    toast.success(`Vehicle Deleted Successfully`);
  };

  /**
   * Display the error notification when an error occurs while deleting a vehicle
   * 
   * @param err the error message to display to the user
   */
  deleteOneVehicleFailNotification = err => {
    toast.error(err.toString());
  };

  /**
   * Display the info notification when the user resets the fields to add a service log
   */
  resetFieldsNotification = () => {
    toast.info(`Input Fields Reset`);
  };

  /**
   * Display the modal to notify the user the vehicle has been deleted successfully
   */
  showDeleteOneVehicleModal = () => {
    this.setState({ showDeleteOneVehicleModal: true });
  };

  /**
   * Display the modal to notify the user about bad input while adding a service log
   */
  showAddLogErrorModal = () => {
    this.setState({ showAddLogErrorModal: true });
  };

  /**
   * Display the modal to notify the user about bad input to the mileage input field
   */
  showMileageInputErrorModal = () => {
    this.setState({ showMileageInputErrorModal: true });
  };

  /**
   * Hide the successfully deleted one vehicle modal
   */
  hideDeleteOneVehicleModal = () => {
    this.setState({ showDeleteOneVehicleModal: false });
  };

  /**
   * Hide the successfully added one service log modal
   */
  hideAddLogErrorModal = () => {
    this.setState({ showAddLogErrorModal: false });
  };

  /**
   * Hide the bad mileage input modal
   */
  hideMileageInputErrorModal = () => {
    this.setState({ showMileageInputErrorModal: false });
  };

  render() {
    return (
      <Container>
        <div className="box">
          <div className="row">
            <div className="col-md-12 text-center">
              {/* <label>Viewing logs for your {this.state.vehicle.year} {this.state.vehicle.make} {this.state.vehicle.model}</label> */}
            </div>
          </div>
          <hr />
          <div className="row innerBox">
            <div className="col-md-3">
              <label><strong>Date</strong></label>
              {/* {this.state.logArray.map(({ date }) => {
                return (
                  <div>
                    <div>{date}</div>
                  </div>
                );
              })} */}
            </div>
            <div className="col-md-3">
              <label><strong>Mileage</strong></label>
              {/* {this.state.logArray.map(({ mileage }) => {
                return (
                  <div>
                    <div>{mileage}</div>
                  </div>
                );
              })} */}
            </div>
            <div className="col-md-3">
              <label><strong>Service</strong></label>
              {/* {this.state.logArray.map(({ service }) => {
                return (
                  <div>
                    <div>{service}</div>
                  </div>
                );
              })} */}
            </div>
            <div className="col-md-3">
              <label><strong>Comments</strong></label>
              {/* {this.state.logArray.map(({ comment }) => {
                return (
                  <div>
                    <div>{comment}</div>
                  </div>
                );
              })} */}
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-12 text-center">
              <label><strong>Enter new service log</strong></label>
            </div>
          </div>
          <div className="innerBox">
            <AddLog
              date={this.state.date}
              mileage={this.state.mileage}
              service={this.state.service}
              comment={this.state.comment}
              handleChange={this.handleChange}
              handleResetLogVehicleForm={this.handleResetLogVehicleForm}
              handleSubmitOneServiceLog={this.handleSubmitOneServiceLog}
              showDeleteOneVehicleModal={this.showDeleteOneVehicleModal}
            />
          </div>
        </div>
        <DeleteOneVehicleModal
          handleDeleteOneVehicle={this.handleDeleteOneVehicle}
          showDeleteOneVehicleModal={this.state.showDeleteOneVehicleModal}
          hideDeleteOneVehicleModal={this.hideDeleteOneVehicleModal}
          state={this.state}
        />
        <AddLogErrorModal
          showAddLogErrorModal={this.state.showAddLogErrorModal}
          hideAddLogErrorModal={this.hideAddLogErrorModal}
          state={this.state}
        />
        <MileageInputErrorModal
          showMileageInputErrorModal={this.state.showMileageInputErrorModal}
          hideMileageInputErrorModal={this.hideMileageInputErrorModal}
          state={this.state}
        />
        <ToastContainer />
      </Container>
    );
  };
};

export default Log;

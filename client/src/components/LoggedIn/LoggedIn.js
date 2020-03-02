import React from "react";
import MyVehicles from "../MyVehicles";
import AddVehicle from "../AddVehicle";
import AddVehicleYearNanErrorModal from "../../components/Modal/AddVehicleYearNanErrorModal";

const LoggedIn = props => {
  return (
    <div className={`box ${props.currentTheme.background}`}>
      <AddVehicle
        handleResetAddVehicleFields={props.handleResetAddVehicleFields}
        addVehicle={props.addVehicle}
        userProfilePicture={props.userProfilePicture}
        disableAddVehicleButton={props.disableAddVehicleButton}
        currentTheme={props.currentTheme}
      />
      <hr className={props.currentTheme.hr} />
      <MyVehicles
        vehicleData={props.vehicleData}
        vehicleCountForUser={props.vehicleCountForUser}
        currentTheme={props.currentTheme}
        errorMessage={props.errorMessage}
        backgroundColor={props.backgroundColor}
        reloadPage={props.reloadPage}
      />
      <AddVehicleYearNanErrorModal
        showAddVehicleYearNanErrorModal={props.showAddVehicleYearNanErrorModal}
        hideAddVehicleYearNanErrorModal={props.hideAddVehicleYearNanErrorModal}
        currentTheme={props.currentTheme}
      />
    </div>
  );
};

export default LoggedIn;

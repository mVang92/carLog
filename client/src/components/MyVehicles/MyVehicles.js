import React, { Component } from "react";
import { VehicleItem } from "../VehicleItem";
import { Link } from "react-router-dom";

class MyVehicles extends Component {
  render() {
    const { vehicleData, vehicleCountForUser, actualEmailFromFirebase } = this.props;
    const userEmail = actualEmailFromFirebase;
    return (
      <div className="text-center">
        {
          vehicleData ?
            (
              vehicleData.vehicles ?
                (
                  vehicleData.vehicles.length ?
                    (
                      <React.Fragment>
                        {vehicleCountForUser(vehicleData.vehicles.length)}
                        <div className="row">
                          <div className="col-md-12">
                            <label><strong>My Vehicles</strong></label>
                          </div>
                        </div>
                        <div className="row innerBox">
                          <div className="col-md-12">
                            {
                              vehicleData.vehicles.map(vehicle => (
                                <div key={vehicle._id} className="row">
                                  <div className="col-md-2"></div>
                                  <div title={vehicle.year + " " + vehicle.make + " " + vehicle.model} className="col-md-8">
                                    <Link to={{
                                      pathname: "/account/" + this.props.vehicleData._id + "/vehicle/" + vehicle._id,
                                      state: [
                                        userEmail
                                      ]
                                    }}>
                                      <VehicleItem>
                                        <div className="text-dark">
                                          {vehicle.year} {vehicle.make} {vehicle.model}
                                        </div>
                                      </VehicleItem>
                                    </Link>
                                  </div>
                                  <div className="col-md-2"></div>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      </React.Fragment>
                    ) : (
                      <label className="text-danger"><strong>No Vehicles on Record</strong></label>
                    )
                ) : (
                  <label className="text-danger"><strong>No Vehicles on Record</strong></label>
                )
            ) : (
              <label className="text-danger"><strong>No Vehicles on Record</strong></label>
            )
        }
      </div>
    );
  };
};

export default MyVehicles;

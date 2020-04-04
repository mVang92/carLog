import React, { Component } from "react";
import Container from "../../components/Container";
import ForumDetails from "../../components/ForumDetails";
import vehicleApi from "../../utils/API";
import forumApi from "../../utils/forumApi";
import Loading from "../../components/Loading";
import { firebase } from "../../firebase"
import { themes } from "../../themes/Themes";
import { toast } from "react-toastify";
import { defaults } from "../../assets/Defaults";

export default class Forum extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedin: false,
      pageLoaded: false,
      uniqueCreatorId: "",
      displayName: "",
      userPhotoUrl: "",
      email: "",
      theme: "",
      currentTheme: "",
      backgroundPicture: "",
      threadDescription: "",
      allThreads: []
    };
  };

  /**
   * Perform these actions upon page load
   */
  componentDidMount = () => {
    this.getAllThreads();
  };

  /**
   * Handle real-time changes
   */
  handleChange = e => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  /**
   * Gets all of the threads from the database
   * If successful or if there is an error, then find the user information
   */
  getAllThreads = () => {
    forumApi.getAllThreads()
      .then(res => {
        this.setState({ allThreads: res.data }, () => this.getUserInformation());
      })
      .catch(err => {
        this.errorNotification(err);
        this.getUserInformation();
      });
  };

  /**
   * Retrieve the information for the user then load the page
   */
  getUserInformation = () => {
    firebase.auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          loggedin: true,
          uniqueCreatorId: user.uid,
          email: user.email,
          displayName: user.displayName
        }, () => {
          if (!user.photoURL) {
            this.setState({ userPhotoUrl: defaults.defaultProfilePicture });
          }
          if (!user.displayName) {
            this.setState({ displayName: defaults.defaultDisplayName });
          }
          // this.getVehicleData();
        });
        vehicleApi.findUserInformationForOneUser(user.uid)
          .then(res => {
            try {
              this.setState({
                theme: res.data.theme,
                backgroundPicture: res.data.backgroundPicture,
                pageLoaded: true
              }, () => {
                this.determineTheme();
              });
            } catch (err) {
              this.errorNotification(err);
              this.setState({ pageLoaded: true });
            }
          })
          .catch(err => {
            this.errorNotification(err);
            this.setState({ pageLoaded: true });
          });
      } else {
        this.setState({ pageLoaded: true });
      }
    });
  };

  /**
   * Add a new thread into the database
   */
  addOneThread = e => {
    e.preventDefault();
    let newThreadPayload = {
      creator: this.state.uniqueCreatorId,
      email: this.state.email,
      threadDescription: this.state.threadDescription,
      comments: []
    };
    forumApi.addOneThread(newThreadPayload)
      .then(res => {
        this.setState({
          // allThreads: res.data,
          threadDescription: ""
        });
      })
      .catch(err => this.errorNotification(err));
  };

  /**
   * Display the error notification when an error occurs while loading data from the database
   * 
   * @param err the error message to display to the user
   */
  errorNotification = err => {
    toast.error(err.toString());
  };

  /**
   * Determine what the current theme is
   */
  determineTheme = () => {
    if (this.state.theme) {
      switch (this.state.theme) {
        case "carSpace":
          this.renderTheme(themes.carSpace);
          break;
        case "light":
          this.renderTheme(themes.light);
          break;
        case "grey":
          this.renderTheme(themes.grey);
          break;
        case "dark":
          this.renderTheme(themes.dark);
          break;
        default:
          this.errorNotification("Error: Unable to process theme selection.");
      }
    }
  };

  /**
   * Render the theme and background picture
   */
  renderTheme = theme => {
    this.setState({ currentTheme: theme });
    if (this.state.backgroundPicture) {
      document.body.style.backgroundImage = "url(" + this.state.backgroundPicture + ")";
    } else {
      document.body.style.backgroundColor = theme.backgroundColor;
    }
  };

  render() {
    return (
      <React.Fragment>
        {
          this.state.pageLoaded ?
            (
              <React.Fragment>
                <Container>
                  <ForumDetails
                    loggedin={this.state.loggedin}
                    handleChange={this.handleChange}
                    addOneThread={this.addOneThread}
                    threadDescription={this.state.threadDescription}
                    allThreads={this.state.allThreads}
                    currentTheme={this.state.currentTheme}
                  />
                </Container>
              </React.Fragment>
            ) : (
              <Loading />
            )
        }
      </React.Fragment>
    );
  };
};

import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import Styles from "./styles";
import { TextField } from "react-native-material-textfield";
import { Icon, Header } from "react-native-elements";
import { Dropdown } from "react-native-material-dropdown";
import DatePicker from "react-native-datepicker";
import Snackbar from "react-native-snackbar";
import moment from "moment";
import Database from "../../src/LocalDB";
db = new Database();
let Limitation = [
  {
    value: "Door Locked",
  },
  {
    value: "Customer Is Not Interested",
  },
  {
    value: "Document Is Not Ready",
  },
  {
    value: "Refused Document Already Submitted",
  },
  {
    value: "Wrong Number",
  },
  {
    value: "Refused Appointment",
  },
  {
    value: "Appointment Given on",
  },
  {
    value: "Customer Is Out Of Station",
  },
  {
    value: "Address Unreachable",
  },
  {
    value: "Other",
  },
];
export default class ReschedulePickups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      startTime: "",
      endTime: "",
      comment: "",
      isModalVisible: false,
      resons: "",
      today: moment().format("YYYY-MM-DD"),
      loading: false,
      Resons: "",
      pickupId: "",
      activity_id: "",
    };
  }

  componentWillMount = async () => {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    await this.GetId();
  };

  GetId = async () => {
    this.Called = this.props.navigation.addListener("willFocus", () => {
      this.GetIds();
    });
  };

  GetIds = async () => {
    Id = this.props.navigation.state.params.ITEM;
    activity_id = this.props.navigation.state.params.ActivityId;
    await this.setState({ pickupId: Id, activity_id: activity_id });
    console.warn(this.state.pickupId);
  };

  componentDidMount = () => {
    console.warn("Todays date", this.state.today);

    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton); //hardware back button
  };

  handleBackButton = () => {
    this.props.navigation.replace("ChatScreen");
    return true;
  };

  validate = () => {
    let { date, startTime, resons } = this.state;
    if (date == "") {
      Snackbar.show({
        text: "Please Enter Valid Date",
        duration: Snackbar.LENGTH_LONG,
      });
    } else if (startTime == "") {
      Snackbar.show({
        text: "Please Enter Valid Time",
        duration: Snackbar.LENGTH_LONG,
      });
    } else if (resons == "") {
      Snackbar.show({
        text: "Please Enter Valid Reason",
        duration: Snackbar.LENGTH_LONG,
      });
    } else {
      this.save();
    }
  };

  deletePickup = async () => {
    let { pickupId } = this.state;
    await db.transaction(async function (tx) {
      let query = "DELETE FROM Pickups WHERE pickups_id = ?";
      tx.executeSql(
        query,
        [pickupId],
        function (tx, res) {
          console.log("removeId: " + res.pickups_id);
          console.log("rowsAffected: " + res.rowsAffected);
        },
        function (tx, error) {
          console.log("DELETE error: " + error.message);
        }
      );
    });
  };

  save = async () => {
    console.warn("pickup id" + this.state.pickupId);
    this.setState({ loading: true });
    console.warn(this.state.resons);

    await fetch("https://docboyz.in/docboyzmt/api/activity_reschedule", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pickupId: this.state.pickupId,
        pickup_date: this.state.date,
        start_time: this.state.startTime,
        end_time: this.state.startTime,
        comments:
          this.state.resons == "Other" ? this.state.comment : this.state.resons,
        activity_id: this.state.activity_id,
      }),
    })
      .then(
        (response) => response.json(), //ADDED >JSON() HERE
        (error) => console.log("An error occurred.", error)
      )
      .then(async (res) => {
        console.warn("Reschedule responce" + JSON.stringify(res));
        if (res.error == 0) {
          Snackbar.show({
            text: "Pickup Reschedule Successfully!!",
            duration: Snackbar.LENGTH_LONG,
          });
          //  this.updateStatus();
          if (this.state.resons === "Customer Is Not Interested") {
            await this.deletePickup();
          }

          Data = this.state;
          this.props.navigation.navigate("ChatScreen", {
            Data,
            reschedule: 1,
          });
        } else {
          Snackbar.show({
            text: "Pickup Not Available!!",
            duration: Snackbar.LENGTH_LONG,
          });
          this.props.navigation.navigate("ChatScreen", {
            Data: "",
          });
        }
        this.setState({
          startTime: "",
          comment: "",
          date: "",
          resons: "",
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loading: false,
        });
      });
  };

  updateStatus = async () => {
    let { pickupId, date, startTime } = this.state;
    db.transaction(async (tx) => {
      let query1 =
        "UPDATE Pickups SET pickup_date = ?,preferred_start_time = ?, preferred_end_time = ? WHERE pickups_id = ?";
      await tx.executeSql(
        query1,
        [date, startTime, startTime, pickupId],
        function (tx, res) {
          console.warn("update date and time " + res.insertId);
          console.log("rowsAffected: " + res.rowsAffected);
        },
        function (tx, error) {
          console.log("UPDATE error: " + error.message);
        }
      );
    });
  };

  _toggleModal = () => {
    this.props.navigation.navigate("pickupHome");
  };

  render = () => {
    let { comment } = this.state;
    if (this.state.loading) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          <ActivityIndicator size="large" color="black" />
        </View>
      );
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#FFF",
        }}
      >
        <Header
          leftComponent={{
            icon: "arrow-back",
            color: "#fff",
            onPress: () => {
              this.props.navigation.navigate("ChatScreen"),
                {
                  Data: "",
                  reschedule: 0,
                };
            },
          }}
          centerComponent={{
            text: "Reschedule Pickups",
            style: { 
              color: 'white',
            fontSize: normalize(20),
            fontWeight:'bold',
            letterSpacing:1
          },
          }}
          outerContainerStyles={{ backgroundColor: "#E41313", height: 55 }}
          innerContainerStyles={{ justifyContent: "space-between" }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <Icon
            type="material-community"
            name={"update"}
            size={80}
            color="red"
            containerStyle={{}}
          />
          <Text
            style={{
              alignSelf: "center",
              fontFamily: "sans-serif-condensed",
              fontSize: 25,
              marginTop: 10,
              fontWeight: "bold",
              color: "#1B547C",
            }}
          >
            Reschedule Pickup
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 25,
          }}
        >
          <Text style={{ marginTop: 10 }}> Date : </Text>
          <TouchableOpacity>
            <DatePicker
              style={{ width: 200 }}
              date={this.state.date == null ? 0 : this.state.date}
              mode="date"
              placeholder="Date"
              format="YYYY-MM-DD HH:mm"
              minDate={this.state.today}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              customStyles={{ dateInput: { marginLeft: 5 } }}
              onDateChange={(date) => {
                this.setState({ date: date });
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 20,
            marginRight: 3,
          }}
        >
          <Text style={{ marginTop: 10 }}> Time : </Text>
          <TouchableOpacity>
            <DatePicker
              style={{ width: 200 }}
              date={this.state.startTime}
              mode="time"
              placeholder="Start Time"
              // format = {"h:mm: a"}
              format={"h:mm"}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              customStyles={{
                dateInput: {
                  marginLeft: 5,
                },
              }}
              onDateChange={(date) => {
                this.setState({ startTime: date });
              }}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Dropdown
            label="Select Reason"
            data={Limitation}
            onChangeText={(value) => this.setState({ resons: value })}
            containerStyle={{
              marginBottom: -15,
              marginLeft: 10,
              marginRight: 10,
            }}
          />
          {this.state.resons == "Other" ? (
            <TextField
              label="Add Comment Here"
              tintColor={"black"}
              value={comment}
              onChangeText={(comment) => this.setState({ comment })}
              containerStyle={{
                marginBottom: -15,
                marginLeft: 10,
                marginRight: 10,
              }}
              multiline={true}
            />
          ) : null}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 50,
            marginBottom: 30,
          }}
        >
          <TouchableHighlight
            style={[
              Styles.common.button,
              { width: 130, height: 40, backgroundColor: "red" },
            ]}
            onPress={() => {
              this.props.navigation.navigate("ChatScreen", {
                Data: "",
                reschedule: 0,
              });
            }}
            underlayColor="deepskyblue"
          >
            <Text style={Styles.common.buttonText}>Cancel</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={[Styles.common.button, { width: 130, height: 40 }]}
            onPress={this.validate}
            underlayColor="deepskyblue"
          >
            <Text style={Styles.common.buttonText}>Save</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  };
}

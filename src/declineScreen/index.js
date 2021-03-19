import React, { Component } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  TouchableHighlight,
} from "react-native";
import Styles from "../src/helpers/styles";
import Snackbar from "react-native-snackbar";
import AsyncStorage from "@react-native-community/async-storage";
import { TextField } from "react-native-material-textfield";
import { Icon, Header } from "react-native-elements";
import Database from "../src/LocalDB";
db = new Database();

export default class Decline extends Component {
  constructor() {
    super();
    this.state = {
      date: "",
      startTime: "",
      endTime: "",
      comment: "",
      isModalVisible: false,
      pickupId: "",
      loading: false,
      agentId: "",
      transaction_id: "",
    };
  }

  componentWillMount = async () => {
    const agentId = await AsyncStorage.getItem("AGENT_ID");
    this.setState({
      agentId: agentId,
    });
    this.LoadData();

    this.Called = this.props.navigation.addListener("willFocus", () => {
      this.LoadData();
    });
  };

  LoadData = async () => {
    await this.setState({
      pickups_id: this.props.navigation.state.params.pickupId,
      transaction_id: this.props.navigation.state.params.t_id,
      selectedItems: this.props.navigation.state.params.Array_data,
    });
  };

  validate = () => {
    let { comment } = this.state;
    if (comment == "") {
      Snackbar.show({
        text: "Please Enter Comment",
        duration: Snackbar.LENGTH_LONG,
      });
    } else {
      this.save();
    }
  };

  save = async () => {
    console.warn(this.state.pickupId, this.state.comment);
    this.setState({ loading: true });
    fetch("https://docboyz.in/docboyzmt/api/activity_pickup_decline", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        activity_id: this.state.selectedItems,
        pickupId: this.state.pickups_id,
        comments: this.state.comment,
        agentId: this.state.agentId,
        transactionId: this.state.transaction_id,
      }),
    })
      .then(
        (response) => response.json(), //ADDED >JSON() HERE
        (error) => console.log("An error occurred.", error)
      )
      .then((res) => {
        console.warn(res);
        if (res.error == 0) {
          Snackbar.show({
            text: "Pickup Decline Sucessfully!!",
            duration: Snackbar.LENGTH_LONG,
          });

          this.setState({ loading: false, comment: "" });
          this.deleteActivity();
        } else {
          Snackbar.show({
            text: "Pickup Not Available!!",
            duration: Snackbar.LENGTH_LONG,
          });
          this.setState({ loading: false, comment: "" });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false });
      });
  };

  deleteActivity = async () => {
    let { pickups_id, selectedItems } = await this.state;

    selectedItems.map(async (deleteData) => {
      await db.transaction(async function (tx) {
        let query =
          "DELETE FROM PickupDocumentPictures WHERE pickups_id = ? AND activity_id = ?";
        let query1 =
          "DELETE FROM PickupDocument WHERE pickups_id = ? AND activity_id = ?";
        let query3 =
          "DELETE FROM Location WHERE pickups_id = ? AND activity_id = ?";
        var Activity =
          "DELETE FROM Activity WHERE pickups_id = ? AND activity_id = ?";
        var pickups = "DELETE FROM Pickups WHERE pickups_id = ? ";

        await tx.executeSql(
          pickups,
          [pickups_id],
          function (tx, res) {
            console.warn("remove from pickups:" + res.pickups_document_id);
            console.log("rowsAffected: " + res.rowsAffected);
          },
          function (tx, error) {
            console.warn("DELETE error: " + error.message);
          }
        );
        await tx.executeSql(
          query,
          [deleteData, pickups_id],
          function (tx, res) {
            console.warn(
              "remove from PickupDocumentPictures:" + res.pickups_document_id
            );
            console.log("rowsAffected: " + res.rowsAffected);
          },
          function (tx, error) {
            console.log("DELETE error: " + error.message);
          }
        );

        await tx.executeSql(
          query1,
          [deleteData, pickups_id],
          function (tx, res) {
            console.warn("remove PickupDocument: " + res.pickups_document_id);
            console.log("rowsAffected: " + res.rowsAffected);
          },
          function (tx, error) {
            console.log("DELETE error: " + error.message);
          }
        );

        await tx.executeSql(
          query3,
          [deleteData, pickups_id],
          function (tx, res) {
            console.warn("remove PickupDocument: " + res.pickups_document_id);
            console.log("rowsAffected: " + res.rowsAffected);
          },
          function (tx, error) {
            console.log("DELETE error: " + error.message);
          }
        );
        await tx.executeSql(
          Activity,
          [deleteData, pickups_id],
          function (tx, res) {
            console.warn("remove Activity: " + res.pickups_document_id);
            console.log("rowsAffected: " + res.rowsAffected);
          },
          function (tx, error) {
            console.log("DELETE error: " + error.message);
          }
        );
      });
      setTimeout(() => {
        this.props.navigation.replace("pickup");
      }, 1000);
    });
  };

  render() {
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
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Header
            leftComponent={{
              icon: "arrow-back",
              color: "#fff",
              onPress: () => {
                this.props.navigation.navigate("pickup");
              },
            }}
            centerComponent={{
              text: "Decline",
              style: { color: "#fff", fontSize: 20, fontFamily: "serif" },
            }}
            outerContainerStyles={{ backgroundColor: "#E41313", height: 55 }}
            innerContainerStyles={{ justifyContent: "space-between" }}
          />
        </View>
        <View>
          <Icon
            type="material-community"
            name={"close-box"}
            size={60}
            color="red"
            containerStyle={{}}
          />
          <Text
            style={{
              alignSelf: "center",
              fontFamily: "sans-serif-condensed",
              fontSize: 20,
              marginTop: 10,
              fontWeight: "bold",
              color: "#1B547C",
            }}
          >
            Decline Pickup
          </Text>
        </View>
        <View>
          <TextField
            label="Comment Here"
            tintColor={"black"}
            value={comment}
            onChangeText={(comment) => this.setState({ comment })}
            containerStyle={{
              marginBottom: 30,
              marginLeft: 25,
              marginRight: 25,
            }}
            multiline={true}
            labelTextStyle={{ color: "grey" }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginBottom: 40,
            }}
          >
            <TouchableHighlight
              style={[
                Styles.common.button,
                { width: 130, height: 40, backgroundColor: "red" },
              ]}
              onPress={() => this.props.navigation.navigate("pickup")}
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
      </View>
    );
  }
}

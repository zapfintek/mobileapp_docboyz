import React, { Component, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Appbar, Card } from "react-native-paper";
import { TextField } from "react-native-material-textfield";
import ImagePicker from "react-native-image-picker";
import AsyncStorage from "@react-native-community/async-storage";
import { Icon } from "react-native-elements";
import Snackbar from "react-native-snackbar";
import RadioForm from "react-native-simple-radio-button";
var accountType = 0;
let account = [
  { label: "Saving     ", value: "saving" },
  { label: "Current ", value: "current" },
];

export default class AccountInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bankName: "",
      ifsc: "",
      typeOfAccount: "saving",
      accountNumber: "",
      panNumber: "",
    };
  }
  componentDidMount = async () => {
    await AsyncStorage.getItem("Account", (error, result) => {
      getAccount = JSON.parse(result);
    });
    if (getAccount != null) {
      this.setState(
        {
          bankName: getAccount.bankName,
          accountNumber: getAccount.accountNumber,
          ifsc: getAccount.ifsc,
          typeOfAccount: getAccount.accountType,
          panNumber: getAccount.panNumber,
        },
        () => {
          if (this.state.typeOfAccount == "saving") {
            accountType = 0;
          } else {
            accountType = 1;
          }
        }
      );
    }
  };

  saveFistStep = () => {
    const validate = this.validation();
    if (validate) {
      var setAccount = {};
      setAccount.bankName = this.state.bankName;
      setAccount.accountNumber = this.state.accountNumber;
      setAccount.ifsc = this.state.ifsc;
      setAccount.panNumber = this.state.panNumber;
      if (this.state.typeOfAccount == "") {
        setAccount.accountType = "saving";
      } else {
        setAccount.accountType = this.state.typeOfAccount;
      }
      console.warn(
        "Ready to go",
        JSON.stringify(setAccount),
        this.state.typeOfAccount
      );

      AsyncStorage.setItem("Account", JSON.stringify(setAccount));

      this.props.navigation.navigate("RequireDocuments");
    }
  };

  saveFistStepBack = () => {
    var setAccount = {};
    if (this.state.typeOfAccount == "") {
      setAccount.accountType = "saving";
    } else {
      setAccount.accountType = this.state.typeOfAccount;
    }
    console.warn(
      "Ready to go",
      JSON.stringify(setAccount),
      this.state.typeOfAccount
    );

    AsyncStorage.setItem("Account", JSON.stringify(setAccount));

    this.props.navigation.navigate("AddressInfo");
  };

  validation = () => {
    // const regIFSC= /^[A-Za-z]{4}\d{7}$/;
    var regPAN = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

    if (this.state.bankName == "") {
      Snackbar.show({
        title: "Please enter the bank name",
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (this.state.accountNumber == "") {
      Snackbar.show({
        title: "Please enter the account number",
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (this.state.ifsc == "") {
      Snackbar.show({
        title: "Please enter the ifsc code",
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (this.state.panNumber == "") {
      Snackbar.show({
        title: "Please enter the pancard number",
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (regPAN.test(this.state.panNumber) != true) {
      Snackbar.show({
        title: "Pancard number is incorrect",
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else {
      return true;
    }
  };

  captureImage = () => {
    const options = {
      quality: 1.0,
      maxWidth: 300,
      maxHeight: 300,
      storageOptions: {
        skipBackup: false,
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log("Response = ", response);
      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        let profile = [{ uri: response.uri }];
        this.setState({ image: profile });
      }
    });
  };

  goBack = () => {
    this.props.navigation.replace("NewLogin");
  };

  render() {
    return (
      <View style={styles.PersonalContainer}>
        <StatusBar hidden={false} backgroundColor="red" />
        <Appbar.Header style={{ backgroundColor: "#E41313", height: 55 }}>
          <Appbar.BackAction onPress={() => this.goBack()} />
          <Appbar.Content
            style={{ alignItems: "center", marginRight: 50 }}
            title="Registration"
          />
        </Appbar.Header>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.loginSteps}>
            <Icon
              type="material-community"
              name="account-circle"
              size={30}
              iconStyle={{ color: "#d32f2f", padding: 0, margin: 0 }}
            />
            <Text
              style={{
                color: "#d32f2f",
                textAlignVertical: "center",
                fontSize: 16,
                marginBottom: 6,
              }}
            >
              ..........
            </Text>
            <Icon
              type="material-community"
              name="home-circle"
              size={30}
              iconStyle={{ color: "#d32f2f" }}
            />
            <Text
              style={{
                color: "#d32f2f",
                textAlignVertical: "center",
                marginBottom: 6,
              }}
            >
              ..........
            </Text>
            <Icon
              type="material-community"
              name="bank"
              size={25}
              iconStyle={{ color: "#d32f2f" }}
            />
            <Text
              style={{
                color: "green",
                textAlignVertical: "center",
                marginBottom: 6,
              }}
            >
              ..........
            </Text>
            <Icon
              type="material-community"
              name="folder-image"
              size={25}
              iconStyle={{ color: "grey" }}
            />
          </View>

          <Card style={styles.FirstCard}>
            <View
              style={{ backgroundColor: "lightgrey", marginTop: 0, padding: 5 }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  color: "black",
                  elevation: 5,
                }}
              >
                Bank Details
              </Text>
            </View>

            <TextField
              label="Bank Name"
              tintColor={"black"}
              labelFontSize={10}
              fontSize={15}
              value={this.state.bankName}
              //   editable={this.state.isEmail}   // use for autofill info
              onChangeText={(bankName) => this.setState({ bankName })}
              containerStyle={{
                marginBottom: 5,
                marginLeft: 25,
                marginRight: 25,
              }}
            />

            <TextField
              label="Account Number"
              tintColor={"black"}
              value={this.state.accountNumber}
              keyboardType="number-pad"
              labelFontSize={10}
              fontSize={15}
              // editable={this.state.isEmail}   // use for autofill info
              onChangeText={(accountNumber) => this.setState({ accountNumber })}
              containerStyle={{
                marginBottom: 5,
                marginLeft: 25,
                marginRight: 25,
              }}
            />

            <TextField
              label="IFSC code"
              tintColor={"black"}
              labelFontSize={10}
              fontSize={15}
              value={this.state.ifsc}
              //  editable={this.state.isEmail}   // use for autofill info
              onChangeText={(ifsc) => this.setState({ ifsc })}
              containerStyle={{
                marginBottom: 5,
                marginLeft: 25,
                marginRight: 25,
              }}
            />

            <RadioForm
              radio_props={account}
              initial={accountType}
              onPress={(value) => {
                this.setState({ typeOfAccount: value });
                console.warn("account " + value);
              }}
              formHorizontal={true}
              labelColor={"#000"}
              buttonColor={"gray"}
              selectedButtonColor={"gray"}
              style={{
                alignSelf: "center",
                marginTop: 10,
              }}
            />

            <TextField
              label="Pancard number"
              tintColor={"black"}
              value={this.state.panNumber}
              labelFontSize={10}
              fontSize={15}
              // editable={this.state.isEmail}   // use for autofill info
              onChangeText={(panNumber) => this.setState({ panNumber })}
              containerStyle={{
                marginBottom: 10,
                marginLeft: 25,
                marginRight: 25,
                marginTop: 0,
                paddingTop: 0,
              }}
            />

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => this.saveFistStepBack()}
                style={styles.backButton}
              >
                <Text style={{ color: "white", margin: 5 }}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.saveFistStep()}
                style={styles.button}
              >
                <Text style={{ color: "white", margin: 5 }}>Next</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  PersonalContainer: {
    flex: 1,
  },
  FirstCard: {
    flex: 1,
    // marginTop:50,
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 60,
    // padding:10,
    backgroundColor: "white",
    justifyContent: "center",
    elevation: 5,
    opacity: 0.9,
  },
  button: {
    backgroundColor: "#E41313",
    alignSelf: "flex-end",
    marginBottom: 15,
    marginRight: 20,
    marginTop: 20,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 5,
    elevation: 5,
  },
  backButton: {
    backgroundColor: "#1B547C",
    alignSelf: "flex-start",
    marginBottom: 15,
    marginLeft: 15,
    marginTop: 20,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 5,
    elevation: 5,
  },
  loginSteps: {
    height: 100,
    width: "100%",
    flexDirection: "row",
    //  /backgroundColor:'',
    justifyContent: "center",
  },
});

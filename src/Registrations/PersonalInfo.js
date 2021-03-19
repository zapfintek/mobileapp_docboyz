import React, { Component, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  NetInfo,
} from "react-native";
import { Appbar, Card } from "react-native-paper";
import { TextField } from "react-native-material-textfield";
import ImagePicker from "react-native-image-picker";
import AsyncStorage from "@react-native-community/async-storage";
import { Icon } from "react-native-elements";
import moment from "moment";
import Snackbar from "react-native-snackbar";
import RadioForm from "react-native-simple-radio-button";
import { DatePickerDialog } from "react-native-datepicker-dialog";
let gender = [
  { label: "Male    ", value: "male" },
  { label: "Female ", value: "female" },
];

var genderValue = 0;

export default class PersonalInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      email: "",
      mobile: "",
      dob: "",
      gender: "male",
      dobText: "",
      DateHolder: null,
      stateData: [],
      loading: false,
      isEmail: true,
      isMobile: true,
      PredefineData: "",
      name: "",
      isName: true,
    };
  }

  componentWillMount = () => {
    AsyncStorage.removeItem("firstStep");
    AsyncStorage.removeItem("Address");
    AsyncStorage.removeItem("Account");
    AsyncStorage.removeItem("Document");

    const prefieldData = this.props.navigation.state.params.Data;
    if (prefieldData != undefined) {
      this.setState({
        gstNumber: prefieldData.customerGST,
        company_name: prefieldData.customerCompanyName,
        PredefineData: prefieldData,
      });

      if (prefieldData.accontType == "") {
        console.warn("account is null");
      } else {
        this.setState({ account: prefieldData.accountType, desables: "true" });
      }

      if (prefieldData.panNo) {
        this.setState({
          isPanNo: false,
          panCardNo: prefieldData.panNo,
        });
      }
      if (prefieldData.ifsc) {
        this.setState({
          isIfsc: false,
          ifscCode: prefieldData.ifsc,
        });
      }
      if (prefieldData.bankName) {
        this.setState({
          isbankName: false,
          bankName: prefieldData.bankName,
        });
      }
      if (prefieldData.accountNo) {
        this.setState({
          isAccount: false,
          accountNumber: prefieldData.accountNo,
        });
      }
      if (prefieldData.emailID) {
        this.setState({ isEmail: false, email: prefieldData.emailID });
      }
      if (prefieldData.Name) {
        // for editable true false
        this.setState({ isName: false, name: prefieldData.Name });
      }
      if (prefieldData.Mobile) {
        this.setState({ isMobile: false, mobile: prefieldData.Mobile });
      }
    }
  };

  componentDidMount = async () => {
    var data = null;
    await AsyncStorage.getItem("firstStep", (error, result) => {
      data = JSON.parse(result);
      console.warn("Data of user info ", JSON.parse(result));
    });
    this.StateApi();
    if (data != null) {
      console.warn("Inside if ", data);
      if (data.gender == "male") {
        genderValue = 0;
      } else {
        genderValue = 1;
      }

      if (!this.state.mobile) {
        this.setState({ mobile: data.mobile });
      }

      console.warn("email is " + this.state.email);
      if (!this.state.email) {
        this.setState({ email: data.email });
      }

      this.setState(
        {
          image: data.profile,

          dobText: data.dob,
          gender: data.gender,
          name: data.name,
        },
        () => {
          if (this.state.image == null) {
            this.setState({ image: "" });
          }
          console.warn("data received ", this.state.gender);
        }
      );
    }
  };

  saveFistStep = () => {
    const validate = this.validation();
    if (validate) {
      var data = {};

      console.warn("Ready to go " + JSON.stringify(data));
      AsyncStorage.setItem("firstStep", JSON.stringify(data));

      this.props.navigation.navigate("AddressInfo", {
        stateData: this.state.stateData,
        AllData: this.state.PredefineData,
      });
    }
  };

  validation = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (this.state.image == "") {
      Snackbar.show({
        title: "Please capture your profile picture",
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (reg.test(this.state.email) !== true) {
      Snackbar.show({
        title: "Please Enter Valid Email",
        duration: Snackbar.LENGTH_LONG,
      });
    } else if (this.state.email == "") {
      Snackbar.show({
        title: "Enter the email id",
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    }
    if (this.state.name == "") {
      Snackbar.show({
        title: "Enter your fullname",
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (this.state.mobile == "") {
      Snackbar.show({
        title: "Enter the mobile number",
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (this.state.mobile.length != 10) {
      Snackbar.show({
        title: "Enter the 10 digit mobile number",
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (this.state.dobText == "") {
      Snackbar.show({
        title: "Select date of birth",
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else {
      return true;
    }
  };

  DatePickerMainFunctionCall = () => {
    Keyboard.dismiss();
    let DateHolder = this.state.DateHolder;
    if (!DateHolder || DateHolder == null) {
      DateHolder = new Date();
      this.setState({
        DateHolder: DateHolder,
      });
    }
    this.refs.DatePickerDialog.open({
      date: DateHolder,
      maxDate: new Date(),
    });
  };

  onDatePickedFunction = (date) => {
    var ageDifMs = Date.now() - date.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    dob = Math.abs(ageDate.getUTCFullYear() - 1970);
    console.warn("Date of birth", dob);
    if (dob >= 18) {
      this.setState({
        date: dob,
        dobText: moment(date).format("DD-MMM-YYYY"),
      });
    } else {
      this.setState({
        dobDate: "",
        dobText: "",
      });
      Snackbar.show({
        title: "Required age 18+ !",
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  //*****************************************State api call ********************************************/
  StateApi = async () => {
    console.warn("called");
    this.setState({ loading: true });

    await fetch("https://docboyz.in/docboyzmt/api/lookup_data", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Category: "State",
        parentID: "",
      }),
    })
      .then(
        (response) => response.json(), //ADDED >JSON() HERE
        (error) => console.log("An error occurred.", error)
      )
      .then((res) => {
        console.warn(res.message);
        let array = res.message;
        var tempMarker = [];
        for (var p in array) {
          tempMarker.push({
            value: array[p].value,
            key: array[p].id,
          });
        }
        console.warn(array, tempMarker);
        this.setState({ stateData: tempMarker, loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
        NetInfo.isConnected.fetch().then((isConnected) => {
          if (isConnected) {
            console.log("Internet is connected");
          } else {
            Snackbar.show({
              title: "please check Internet Connection",
              duration: Snackbar.LENGTH_LONG,
            });
          }
        });
        console.warn(error);
      });
  };

  //********************************************State api call stop****************************************** */

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
        let profile = { uri: response.uri };
        this.setState({ image: profile }, () => {
          console.warn("the profile data", this.state.image);
        });
      }
    });
  };

  goBack = () => {
    this.props.navigation.replace("NewLogin");
  };

  render() {
    console.warn(genderValue);
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
              iconStyle={{ color: "grey" }}
            />
            <Text
              style={{
                color: "grey",
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
              iconStyle={{ color: "grey" }}
            />
            <Text
              style={{
                color: "grey",
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
            <View style={styles.heading}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  color: "black",
                  elevation: 5,
                }}
              >
                User Information
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                this.captureImage();
              }}
            >
              <Image
                style={{
                  height: 80,
                  width: 80,
                  marginTop: 20,
                  borderRadius: 40,
                  backgroundColor: "lightgrey",
                  alignSelf: "center",
                }}
                source={
                  this.state.image != ""
                    ? this.state.image
                    : require("../assets/Edit.png")
                }
              />
            </TouchableOpacity>

            <TextField
              label="Email"
              tintColor={"black"}
              labelFontSize={10}
              fontSize={15}
              value={this.state.email}
              editable={this.state.isEmail} // use for autofill info
              onChangeText={(email) => this.setState({ email })}
              containerStyle={{
                marginBottom: 5,
                marginLeft: 25,
                marginRight: 25,
              }}
            />
            <TextField
              label="Full Name"
              tintColor={"black"}
              labelFontSize={10}
              fontSize={15}
              value={this.state.name}
              editable={this.state.isName} // use for autofill info
              onChangeText={(name) => this.setState({ name })}
              containerStyle={{
                marginBottom: 5,
                marginLeft: 25,
                marginRight: 25,
              }}
            />

            <TextField
              label="Mobile number"
              tintColor={"black"}
              value={this.state.mobile}
              keyboardType="number-pad"
              labelFontSize={10}
              fontSize={15}
              editable={this.state.isMobile} // use for autofill info
              onChangeText={(mobile) => this.setState({ mobile })}
              containerStyle={{
                marginBottom: 5,
                marginLeft: 25,
                marginRight: 25,
              }}
            />
            <TextField
              label="Birthday"
              tintColor={"black"}
              labelFontSize={10}
              fontSize={15}
              value={this.state.dobText}
              onFocus={this.DatePickerMainFunctionCall.bind(this)}
              onChangeText={(dobText) => this.setState({ dobText })}
              containerStyle={{
                marginBottom: 5,
                marginLeft: 25,
                marginRight: 25,
              }}
            />
            <DatePickerDialog
              ref="DatePickerDialog"
              onDatePicked={this.onDatePickedFunction.bind(this)}
            />

            <RadioForm
              radio_props={gender}
              initial={genderValue}
              onPress={(value) => {
                this.setState({ gender: value });
                console.warn("gender " + value);
              }}
              formHorizontal={true}
              labelColor={"#000"}
              buttonColor={"gray"}
              selectedButtonColor={"gray"}
              style={{
                alignSelf: "center",
                marginTop: 5,
              }}
            />

            <TouchableOpacity
              onPress={() => this.saveFistStep()}
              style={styles.button}
            >
              <Text style={{ color: "white", margin: 5 }}>Next</Text>
            </TouchableOpacity>
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
  loginSteps: {
    height: 100,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  heading: {
    backgroundColor: "lightgrey",
    marginTop: 0,
    padding: 5,
  },
});

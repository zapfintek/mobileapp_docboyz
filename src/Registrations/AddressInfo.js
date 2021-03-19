import React, { Component, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Appbar, Card } from "react-native-paper";
import { TextField } from "react-native-material-textfield";
import ImagePicker from "react-native-image-picker";
import AsyncStorage from "@react-native-community/async-storage";
import { Header, Icon } from "react-native-elements";
import Snackbar from "react-native-snackbar";
import { Dropdown } from "react-native-material-dropdown";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import Geolocation from "react-native-geolocation-service";

export default class AddressInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adds1: "",
      adds2: "",
      state: "",
      city: "",
      pincode: "",
      account: "",
      accountType: "d", // d - fc  p- partner  c- callcenter
      company_name: "",
      gstNumber: "",
      City: [],
      State: [],
      lat: "",
      lng: "",
      loading: true,
      yourAccount: [
        {
          value: "Fintech Correspondent",
        },
        {
          value: "Partner",
        },
        {
          value: "Call Center",
        },
      ],
    };
  }
  saveFistStep = () => {
    const validate = this.validation();
    if (validate) {
      var addsData = {};
      addsData.adds1 = this.state.adds1;
      addsData.adds2 = this.state.adds2;
      addsData.state = this.state.state;
      addsData.city = this.state.city;
      addsData.pincode = this.state.pincode;
      addsData.account = this.state.account;
      addsData.companyName = this.state.company_name;
      addsData.gstNumber = this.state.gstNumber;

      console.warn("Ready to go " + JSON.stringify(addsData));
      AsyncStorage.setItem("Address", JSON.stringify(addsData));
      this.props.navigation.navigate("AccountInfo");
    }
  };

  saveFistStepBack = () => {
    var addsData = {};

    console.warn("Ready to go " + addsData);
    AsyncStorage.setItem("Address", JSON.stringify(addsData));
    this.props.navigation.navigate("PersonalInfo");
  };

  Called = this.props.navigation.addListener("willFocus", async () => {
    this.componentMount();
  });

  componentMount = async () => {
    states = this.props.navigation.state.params.stateData;
    console.warn("The data of states " + JSON.stringify(states));
    if (states) {
      this.setState({ State: states });
    }
    await AsyncStorage.getItem("Address", (error, result) => {
      Data = JSON.parse(result);
      console.warn("Previlledge data", JSON.parse(result));
    });
    if (Data == null) {
      this.setState({ loading: false });
    } else {
      this.setState({
        adds1: Data.adds1,
        adds2: Data.adds2,
        state: Data.state,
        city: Data.city,
        pincode: Data.pincode,
        account: Data.account,
        company_name: Data.companyName,
        gstNumber: Data.gstNumber,
        loading: false,
      });
    }

    var Predefined = this.props.navigation.state.params.AllData;
    if (Predefined) {
      this.setState(
        {
          accountType: Predefined.type,
          company_name: Predefined.customerCompanyName,
          gstNumber: Predefined.customerGST,
        },
        () => {
          if (this.state.accountType == "p") {
            this.setState({ account: "Partner" });
          } else if (this.state.accountType == "c") {
            this.setState({ account: "Call Center" });
          }
        }
      );
    }
  };

  // ************************ Access current location*************************
  CurrentLocation = async () => {
    await LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message:
        "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
      ok: "OK",
      cancel: "",
      enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
      showDialog: true, // false => Opens the Location access page directly
      openLocationServices: true, // false => Directly catch method is called if location services are turned off
      preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
      preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
      providerListener: true, // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
    })
      .then(
        function (success) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              let initialPosition = JSON.stringify(position);
              console.warn("the location " + initialPosition);
              // this.setState({ initialPosition });
            },
            (error) => console.log(error),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
          );
        }.bind(this)
      )
      .catch((error) => {
        console.warn(error.message);
      });

    await this.ActalLocation();
  };

  ActalLocation = async () => {
    console.warn("The location calling");
    Geolocation.getCurrentPosition(
      (position) => {
        console.warn("Possition " + JSON.stringify(position));
        this.setState(
          {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          () => {
            this.callApi();
          }
        );
      },
      (error) => console.warn(error.message),
      { enableHighAccuracy: true, timeout: 25000, maximumAge: 3600000 }
    );
  };

  // *********************** Address fetching api************************************
  callApi = async () => {
    // 19.0760,72.8777
    // 20.617958, 74.760012

    var locationApi = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.lat},${this.state.lng}&sensor=false&key=AIzaSyA5lrSthouDIE-gNuyoFTfMoNVwc1259JU`;

    await fetch(locationApi, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((resData) => {
        console.warn("location data is" + JSON.stringify(resData));
        if (resData.status == "OK") {
          console.warn("the city and state" + resData.plus_code.compound_code);
          var data = resData.plus_code.compound_code.split(",");
          var city = data[0].split(" ");
          console.warn("city " + JSON.stringify(city));
          console.warn("Data of " + JSON.stringify(data));
          let obj = this.state.State.find((x) => x.value == data[1]);
          console.warn("matching in states " + obj);
          let index = this.state.State.indexOf(obj);
          console.warn("matching in states  index" + index);
        }
      })
      .catch((error) => {
        console.warn("Error in catch " + error.message);
      });
  };

  validation = () => {
    const regGST = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;

    if (this.state.adds1 == "" || this.state.adds2 == "") {
      Snackbar.show({
        title: "Please enter the address",
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (this.state.city == "" || this.state.state == "") {
      Snackbar.show({
        title: "Please select city and state",
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (this.state.pincode == "") {
      Snackbar.show({
        title: "Please enter the pincode",
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

  // ***************************** City Api Calling ***************************************************
  CityApi = async (val, k) => {
    console.warn("State cities " + JSON.stringify(this.state.State));
    var key = this.state.State[k].key;

    this.setState({ state: val });
    await fetch("https://docboyz.in/docboyzmt/api/lookup_data", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Category: "City",
        parentID: key,
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
          });
        }
        this.setState({ City: tempMarker }, () => {
          console.warn("The cities ", JSON.stringify(this.state.City));
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        NetInfo.isConnected.fetch().then((isConnected) => {
          if (isConnected) {
            console.log("Internet is connected");
          } else {
            console.warn(this.state.token);
            Snackbar.show({
              title: "please check Internet Connection",
              duration: Snackbar.LENGTH_LONG,
            });
          }
        });
        console.warn("error", error);
      });
  };

  goBack = () => {
    this.props.navigation.replace("NewLogin");
  };

  render() {
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
                Residence Details
              </Text>
            </View>

            <TextField
              label="Address line 1"
              tintColor={"black"}
              labelFontSize={10}
              fontSize={15}
              value={this.state.adds1}
              //   editable={this.state.isEmail}   // use for autofill info
              onChangeText={(adds1) => this.setState({ adds1 })}
              containerStyle={{
                marginBottom: 5,
                marginLeft: 25,
                marginRight: 25,
              }}
            />

            <TextField
              label="Address Line 2"
              tintColor={"black"}
              value={this.state.adds2}
              labelFontSize={10}
              fontSize={15}
              // editable={this.state.isEmail}   // use for autofill info
              onChangeText={(adds2) => this.setState({ adds2 })}
              containerStyle={{
                marginBottom: 5,
                marginLeft: 25,
                marginRight: 25,
              }}
            />

            <Dropdown
              label="State"
              data={this.state.State}
              labelFontSize={10}
              fontSize={15}
              value={this.state.state}
              onChangeText={(value, key) => this.CityApi(value, key)}
              containerStyle={{ marginLeft: 25, marginRight: 25 }}
            />

            <Dropdown
              label="City"
              labelFontSize={10}
              fontSize={15}
              data={this.state.City}
              value={this.state.city}
              onChangeText={(value) => this.setState({ city: value })}
              containerStyle={{ marginLeft: 25, marginRight: 25 }}
            />

            <TextField
              label="Pincode"
              tintColor={"black"}
              value={this.state.pincode}
              keyboardType="number-pad"
              labelFontSize={10}
              fontSize={15}
              // editable={this.state.isEmail}   // use for autofill info
              onChangeText={(pincode) => this.setState({ pincode })}
              containerStyle={{
                marginBottom: 5,
                marginLeft: 25,
                marginRight: 25,
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

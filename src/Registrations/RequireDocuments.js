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
  Linking,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Appbar, Card } from "react-native-paper";
import ImagePicker from "react-native-image-picker";
import AsyncStorage from "@react-native-community/async-storage";
import { Header, Icon } from "react-native-elements";
import Snackbar from "react-native-snackbar";
import CheckBox from 'react-native-checkbox-heaven';

export default class RequireDocuments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adhaarFront: "",
      adhaarBack: "",
      cheque: "",
      pan: "",
      image: "",
      loading: false,
      checked:true,
      values:"",
      text: "",
    };
  }

  handleOnChange(val) {
    this.setState({ checked: val })
  }
  componentWillMount = async () => {
    console.warn("Ready to go");
    var data = null;
    await AsyncStorage.getItem("Document", (error, result) => {
      console.warn("The previous data ", JSON.parse(result));
      data = JSON.parse(result);
    });
    //  console.warn("The  data ",data.pan);
  };

  saveFistStep = async () => {
    const validate = this.validation();
    if (validate) {
      console.warn("Ready to go");
      var data = {};
      data.front = this.state.adhaarFront;
      data.back = this.state.adhaarBack;
      data.pan = this.state.pan;
      data.cheque = this.state.cheque;

      await AsyncStorage.setItem("Document", JSON.stringify(data));
      console.warn("data " + data.pan);
      this.dataSend();
    }
  };
  saveFistStepBack = async () => {
    var data = {};
    data.front = this.state.adhaarFront;
    data.back = this.state.adhaarBack;
    data.pan = this.state.pan;
    data.cheque = this.state.cheque;

    await AsyncStorage.setItem("Document", JSON.stringify(data));
    this.props.navigation.navigate("AccountInfo");
  };

  dataSend = async () => {
    storeType = "";
    (first = ""), (second = ""), (third = ""), (forth = ""), (token = "");
    this.setState({ loading: true });
    await AsyncStorage.getItem("firstStep", (error, result) => {
      first = JSON.parse(result);
    });
    await AsyncStorage.getItem("Address", (error, result) => {
      second = JSON.parse(result);
    });
    await AsyncStorage.getItem("Account", (error, result) => {
      third = JSON.parse(result);
    });
    await AsyncStorage.getItem("Document", (error, result) => {
      forth = JSON.parse(result);
    });
    await AsyncStorage.getItem("token", (err, result) => {
      token = result;
    });

    console.warn("First " + JSON.stringify(first));
    console.warn("second " + JSON.stringify(second));
    console.warn("third " + JSON.stringify(third));
    console.warn("forth " + JSON.stringify(forth));
    console.warn("Token is ", token.replace(/"/g, ""));

    var data = new FormData();
    //*******************************/ first step data *******************************
    data.append("email", first.email);
    data.append("name", first.name);
    data.append("mobile", first.mobile);
    data.append("dob", first.dob);
    data.append("gender", first.gender);
    data.append("profile_pic", {
      uri: first.profile.uri, // the profile  uri
      type: "image/png", // or photo.type
      name: `${Date.now()}profilePicture.jpg`,
    });

    //*******************************second step data*************************************/
    data.append("address1", second.adds1);
    data.append("address2", second.adds2);
    data.append("state", second.state);
    data.append("city", second.city);
    data.append("pincode", second.pincode);
    // data.append('agentType',"d");

    if (second.account == "Partner") {
      data.append("agentType", "p");
      storeType = "p";
      data.append("agent_company_name", second.companyName);
      data.append("agent_gst_number", second.gstNumber);
    } else if (second.account == "Call Center") {
      data.append("agentType", "c");
      storeType = "c";
      data.append("agent_company_name", "");
      data.append("agent_gst_number", "");
    } else {
      data.append("agentType", "d");
      storeType = "d";
      data.append("agent_company_name", "");
      data.append("agent_gst_number", "");
    }
    //************************* Third step data*******************************************/

    data.append("account_type", third.accountType);
    data.append("bank_name", third.bankName);
    data.append("account_number", third.accountNumber);
    data.append("ifsc_code", third.ifsc);
    data.append("pan_number", third.panNumber);

    //*********************************Forth step data******************************************/
    data.append("adharcard", {
      uri: forth.front.uri, // the Adhaar  uri
      type: "image/png", // or photo.type
      name: `${Date.now()}AdharCard1.jpg`,
    });

    data.append("adharcard_back", {
      uri: forth.back.uri, // the Adhaar back  uri
      type: "image/png", // or photo.type
      name: `${Date.now()}AdharCard2.jpg`,
    });

    data.append("pancard", {
      uri: forth.pan.uri, // the pan  uri
      type: "image/png", // or photo.type
      name: `${Date.now()}Pancard.jpg`,
    });
    
    data.append("cheque", {
      uri: forth.cheque.uri, // the cheque uri
      type: "image/png", // or photo.type
      name: `${Date.now()}Cheque.jpg`,
    });

    data.append("status", "Pending");
    data.append("partnerID", ""); // send partner id
    data.append("partnerName", ""); // send partner name
    data.append("fcmTokenId", token);

    console.warn("Data to send ", JSON.stringify(data));

    await fetch("https://docboyz.in/docboyzmt/api/register_new", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: data,
    })
      .then((res) => res.json())
      .then((resData) => {
        console.warn("The response id ", resData);
        if (resData.error == 0) {
          AsyncStorage.setItem("FCnAME", first.name);
          AsyncStorage.setItem("AgentType", storeType);
          AsyncStorage.setItem("is_Existing", "true");
          AsyncStorage.setItem("AGENT_ID", JSON.stringify(resData.agentId));

          AsyncStorage.setItem("firstStep", "");
          AsyncStorage.setItem("Address", "");
          AsyncStorage.setItem("Account", "");
          AsyncStorage.setItem("Document", "");

          AsyncStorage.removeItem("firstStep");
          AsyncStorage.removeItem("Address");
          AsyncStorage.removeItem("Account");
          AsyncStorage.removeItem("Document");

          Snackbar.show({
            title: "Agent Register Successfully",
            duration: Snackbar.LENGTH_LONG,
          });
          this.props.navigation.replace("MyDrawer");
        } else if (resData.error == 1) {
          Snackbar.show({
            title: resData.message,
            duration: Snackbar.LENGTH_LONG,
          }),
            this.setState({
              loading: false,
            });
        } else if (resData.error == 2) {
          this.setState({
            loading: false,
          });
          Snackbar.show({
            title: "Something went wrong.Please try again!",
            duration: Snackbar.LENGTH_LONG,
          });
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });

        Snackbar.show({
          title: "Network error..!,please check internet connection",
          duration: Snackbar.LENGTH_LONG,
        });
      });
  };

  validation = () => {
    console.warn(this.state.values)
    if (this.state.adhaarFront == "") {
      Snackbar.show({
        title: "Capture the front image of adhaar card",
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (this.state.adhaarBack == "") {
      Snackbar.show({
        title: "Capture the back image of adhaar card",
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (this.state.pan == "") {
      Snackbar.show({
        title: "Capture the pan card image",
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (this.state.cheque == "") {
      Snackbar.show({
        title: "Capture the cheque image",
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    }else if (this.state.checked== false) {
      Snackbar.show({
        title: "Accept terms and conditions",
        duration: Snackbar.LENGTH_LONG,
      });
    } else {
      return true;
    }
  };

  captureImage = (imageFor) => {
    console.warn("calling from " + imageFor);
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
        var img = { uri: response.uri };
        if (imageFor == "panCard") {
          this.setState({ pan: img }, () => {
            console.warn("Pan  is " + this.state.pan);
          });
        } else if (imageFor == "cheque") {
          this.setState({ cheque: img }, () => {
            console.warn("cheque  is " + this.state.cheque);
          });
        }
      }
    });
  };

  captureAdhar = (AdharType) => {
    if (this.state.adhaarFront == "" || AdharType == "front") {
      Alert.alert("Adhaar Front", "Capture the front image of adhaar card", [
        {
          text: "Ok",
          onPress: () => {
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
                console.log(
                  "User tapped custom button: ",
                  response.customButton
                );
              } else {
                let img = { uri: response.uri };
                if (this.state.adhaarFront == "" || AdharType == "front") {
                  this.setState({ adhaarFront: img });
                } else {
                  this.setState({ adhaarBack: img });
                }
              }
            });
          },
        },
      ]);
    } else {
      Alert.alert("Adhaar Back", "Capture the back image of adhaar card", [
        {
          text: "Ok",
          onPress: () => {
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
                console.log(
                  "User tapped custom button: ",
                  response.customButton
                );
              } else {
                let img = { uri: response.uri };
                if (this.state.adhaarFront == "" || AdharType == "front") {
                  this.setState({ adhaarFront: img });
                } else {
                  this.setState({ adhaarBack: img });
                }
              }
            });
          },
        },
      ]);
    }
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
              name="folder-image"
              size={25}
              iconStyle={{ color: "#d32f2f" }}
            />
          </View>

          <Card style={styles.FirstCard}>
            <View
              style={{
                backgroundColor: "lightgrey",
                marginTop: 0,
                marginBottom: 6,
                padding: 5,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  color: "black",
                  elevation: 5,
                }}
              >
                KYC Documents
              </Text>
            </View>

            <Text
              style={{
                fontSize: 15,
                textAlign: "center",
                marginTop: 8,
                color: "black",
              }}
            >
              Adhaar Card
            </Text>

            <View style={{ marginTop: 10, flexDirection: "row", padding: 5 }}>
              <View
                style={{
                  height: 1,
                  backgroundColor: "lightgrey",
                  marginTop: 5,
                }}
              ></View>
              {this.state.adhaarFront == "" ? (
                <Text
                  style={{
                    width: "70%",
                    textAlignVertical: "center",
                    margin: 8,
                    fontSize: 13,
                  }}
                >
                  Click on add button and capture front and back image of adhaar
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    this.captureAdhar("front");
                  }}
                >
                  <Image
                    style={{
                      width: 80,
                      height: 80,
                      marginTop: 5,
                      alignSelf: "center",
                    }}
                    source={this.state.adhaarFront}
                  />
                </TouchableOpacity>
              )}
              {this.state.adhaarBack == "" ? null : (
                <TouchableOpacity
                  onPress={() => {
                    this.captureAdhar("back");
                  }}
                >
                  <Image
                    style={{
                      width: 80,
                      height: 80,
                      marginTop: 5,
                      marginLeft: 10,
                      alignSelf: "center",
                    }}
                    source={this.state.adhaarBack}
                  />
                </TouchableOpacity>
              )}

              {this.state.adhaarFront && this.state.adhaarBack ? null : (
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "grey",
                      borderRadius: 5,
                      padding: 5,
                      marginTop: 20,
                      marginBottom: 5,
                      marginRight: 5,
                      alignSelf: "flex-end",
                    }}
                    onPress={() => {
                      this.captureAdhar();
                    }}
                  >
                    <Text style={{ fontSize: 14, color: "white" }}>Add</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View
              style={{ height: 1, backgroundColor: "lightgrey", marginTop: 8 }}
            ></View>

            <Text
              style={{
                fontSize: 15,
                textAlign: "center",
                marginTop: 10,
                color: "black",
              }}
            >
              Pan Card
            </Text>
            <View style={{ flexDirection: "row", padding: 5 }}>
              {this.state.pan == "" ? (
                <Text
                  style={{
                    width: "70%",
                    textAlignVertical: "center",
                    margin: 8,
                    fontSize: 13,
                  }}
                >
                  Click on add button and capture the front image of pan card
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    this.captureImage("panCard");
                  }}
                >
                  <Image
                    style={{
                      width: 80,
                      height: 80,
                      marginTop: 5,
                      alignSelf: "center",
                    }}
                    source={this.state.pan}
                  />
                </TouchableOpacity>
              )}

              {this.state.pan == "" ? (
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "grey",
                      borderRadius: 5,
                      padding: 5,
                      marginTop: 20,
                      marginBottom: 10,
                      marginRight: 5,
                      alignSelf: "flex-end",
                    }}
                    onPress={() => {
                      this.captureImage("panCard");
                    }}
                  >
                    <Text style={{ fontSize: 14, color: "white" }}>Add</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            <View
              style={{ height: 1, backgroundColor: "lightgrey", marginTop: 8 }}
            ></View>
            <Text
              style={{
                fontSize: 15,
                textAlign: "center",
                marginTop: 10,
                color: "black",
              }}
            >
              Cheque
            </Text>

            <View style={{ flexDirection: "row", padding: 5 }}>
              {this.state.cheque == "" ? (
                <Text
                  style={{
                    width: "70%",
                    textAlignVertical: "center",
                    margin: 8,
                    fontSize: 13,
                  }}
                >
                  Click on add button and capture the front image of cheque
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    this.captureImage("cheque");
                  }}
                >
                  <Image
                    style={{
                      width: 80,
                      height: 80,
                      marginTop: 5,
                      alignSelf: "center",
                    }}
                    source={this.state.cheque}
                  />
                </TouchableOpacity>
              )}

              {this.state.cheque == "" ? (
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "grey",
                      borderRadius: 5,
                      padding: 5,
                      marginTop: 20,
                      marginBottom: 10,
                      marginRight: 5,
                      alignSelf: "flex-end",
                    }}
                    onPress={() => {
                      this.captureImage("cheque");
                    }}
                  >
                    <Text style={{ fontSize: 14, color: "white" }}>Add</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            <View
              style={{ height: 1, backgroundColor: "lightgrey", marginTop: 8 }}
            ></View>
              <View style={{  flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: 'center',marginLeft:20,
                backgroundColor: '#F5FCFF',
                height: 35, paddingLeft: 5}}  >
            <CheckBox
                labelStyle={styles.labelStyle}
                iconSize={24}
                iconName='matMix'
                checked={this.state.checked}
                checkedColor='#008080'
                uncheckedColor='#8b0000'
                onChange={this.handleOnChange.bind(this)}
              />
              <TouchableOpacity
                onPress={() =>
                Linking.openURL(
                  "https://docboyz.in/admin_/public/uploads/DocBoyzTerms&Condition.pdf"
                )
              }
              underlayColor="#E41313">
                <Text style={styles.text}>
                  Terms and Conditions
               </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{ height: 1, backgroundColor: "lightgrey", marginTop: 8 }}
            ></View>
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
                <Text style={{ color: "white", margin: 5 }}>Submit</Text>
              </TouchableOpacity>
            </View>
          
          </Card>
        </ScrollView>
      </View>
    );
  }
  checkeBoxVal=(val)=>{
    console.warn(val)
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
    // padding:5,
    backgroundColor: "white",
    elevation: 5,
    opacity: 0.9,
  },
  text: {
    margin: 7,
    fontSize: 15,
    fontWeight: "100",
    color: "black",
    fontFamily: "serif"

  },
  button: {
    backgroundColor: "#E41313",
    alignSelf: "flex-end",
    marginBottom: 10,
    marginRight: 10,
    marginTop: 20,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 5,
    elevation: 5,
  },
  backButton: {
    backgroundColor: "#1B547C",
    alignSelf: "flex-start",
    marginBottom: 10,
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
    justifyContent: "center",
  },
});

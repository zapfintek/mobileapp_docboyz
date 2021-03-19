import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  NetInfo,
  Linking,
  Dimensions,
} from "react-native";
import { List, ListItem, Icon, Divider, Header } from "react-native-elements";
import Snackbar from "react-native-snackbar";
import BackgroundFetch from "react-native-background-fetch";
import { BallIndicator } from "react-native-indicators";
import Geocoder from "react-native-geocoder";
import getDirections from "react-native-google-maps-directions";
import AsyncStorage from "@react-native-community/async-storage";
import Geolocation from "react-native-geolocation-service";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import { ScrollView } from "react-native-gesture-handler";
import { Card } from "react-native-paper";
let { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
import SimpleAccordion from "react-native-simple-accordian";
import * as _ from "lodash";
import Database from "../src/LocalDB";
db = new Database();
var Address = "Office";
var a = 0;
export default class PickupDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null, // ref for select deselect
      renderData: [], // here is the list of activity
      activity_selected: [], // it is used for callcenter multiselect
      callcenter_activity: [], // call center activity data
      callCenter_PickupsData: [], // the call center all data
      sendMessageid: 3, //  send call chat activity id by default 3
      pickups_id: "",
      agentType: "",
      agentId: "",
      Pickup_details: [],
      pickups_activity: "",
      Activity_data: [],
      PickupsData: [],
      activity_data: [],
      ActivityData: [],
      content: "",
      open: false,
      ClearData: [],
      Activity_id_Data: [],
      rowId: "",
      loading: false,
      ArrayData: [],
      QUE_ID: [],
      Data: [],
      stop: "",
      status3: 20,
      Address: "",
      location: "",
      status2: "Uploading",
      status: "",
      allCallcenterData: [], // all data for callcenter
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    };
    this.submit = this.submit.bind(this); //For select item from Model
  }

  Called = this.props.navigation.addListener("willFocus", async () => {
    await this.setState({ allCallcenterData: [] });
    this.CallAgain();
    console.log(this.props.navigation.state.params.status);
  });

  CallAgain = async () => {
    var agentType = await AsyncStorage.getItem("AgentType");
    console.log("Agent type " + agentType);
    if (agentType == "c") {
      await this.setState({ loading: true, agentType: agentType }); // it used for loading page
      // this.LoadData();
      await AsyncStorage.getItem("AGENT_ID", (err, result) => {
        if (result != "") {
          this.setState({
            agentId: result,
            pickups_id: this.props.navigation.state.params.pickupId,
            renderData: [],
            activity_selected: [],
            status: this.props.navigation.state.params.status,
          });
        }
      });
      await this.CallCenterApi();
      await this.LoadData();
      this.CurrentLocation();
    } else {
      this.setState({ loading: true }); // it used for loading page
      this.LoadData();
      this.CurrentLocation();
    }
  };

  callCeneterData = async () => {
    console.log(this.state.status);
    await fetch("https://docboyz.in/docboyzmt/api/callcenter_all_activity", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pickupId: this.state.pickups_id,
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        console.log("The data of all activity " + JSON.stringify(resData));
        if (resData.error == 0) {
          console.log("The data of all activity " + JSON.stringify(resData));
          this.setState({ allCallcenterData: resData.pickup_details }, () => {
            this.setState({});
          });
        }
      })
      .catch((error) => {
        console.log("error in catch " + error.message);
      });
  };

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
              this.setState({ initialPosition });
            },
            (error) => console.log(error),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
          );
        }.bind(this)
      )
      .catch((error) => {
        console.log(error.message);
      });

    await this.setState({
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    });
    await this.ActalLocation();
  };

  ActalLocation = async () => {
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          loading: false,
        });
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 25000, maximumAge: 3600000 }
    );

    this.watchID = Geolocation.watchPosition((position) => {
      this.setState({
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
      });
    });
    console.log(this.state.region);
  };

  LoadData = async () => {
    //load previous screen data in this function
    //  this.setState({loading:true});
    await this.setState({
      Pickup_details: [],
      pickups_activity: "",
      Activity_data: "",
      ActivityData: [],
      activity_data: [],
      activityData: [],
      Activity_id_Data: [],
    });
    console.log(
      "empty array",
      this.state.activity_data,
      this.state.ActivityData,
      this.state.pickups_activity
    );
    await AsyncStorage.getItem("AGENT_ID", (err, result) => {
      if (result != "") {
        this.setState({
          agentId: result,
          pickups_id: this.props.navigation.state.params.pickupId,
          status: this.props.navigation.state.params.status,
        });
      }
    });
    await this.activity_pickup(this.state.pickups_id); //call for activity pickups details api
  };
  activity_pickup = async (pickups_id) => {
    this.setState({ loading: true });
    var Activity = "SELECT * FROM Pickups where pickups_id = ?";

    await db.transaction(async (tx) => {
      this.state.ActivityData = [];
      tx.executeSql(Activity, [pickups_id], async (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          this.state.Pickup_details.push(row);
        }
      });
    });
    await this.activity_pickup_details(pickups_id);
  };

  activity_pickup_details = async (pickups_id) => {
    this.setState({ loading: true });
    console.log("Pickup id ", pickups_id);
    var Activity = "SELECT * FROM Activity where pickups_id = ?";
    this.state.ActivityData = await [];
    await db.transaction(async (tx) => {
      tx.executeSql(Activity, [pickups_id], async (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          this.state.ActivityData.push(row);
        }
      });

      setTimeout(async () => {
        console.log("ActivityData", this.state.ActivityData);
        await this.setState({ loading: true, PickupsData: [] });

        db.transaction(async (tx) => {
          var Pickups =
            "SELECT * FROM PickupDocument where pickups_id = ? AND activity_id = ?";
          this.state.ActivityData.map((k) => {
            tx.executeSql(
              Pickups,
              [pickups_id, k.activity_id],
              async (tx, results) => {
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  this.state.PickupsData.push(results.rows.item(i));
                }
                console.log("actually", this.state.PickupsData);
              }
            );
          });
        });
        setTimeout(() => {
          console.log("actually", this.state.PickupsData);

          this.activityData(this.state.ActivityData);
        }, 500);
      }, 1000);
    });
  };

  activityData = async () => {
    await this.setState({ loading: true, activity_data: [] });

    var Data = [];
    console.log("activity", activity);
    for (p = 0; p < this.state.ActivityData.length; p++) {
      var activity = [];
      for (q = 0; q < this.state.PickupsData.length; q++) {
        if (
          this.state.ActivityData[p].activity_id ==
          this.state.PickupsData[q].activity_id
        ) {
          await activity.push(this.state.PickupsData[q]);
        }
      }
      this.state.ActivityData[p].documents = activity;
      console.log("log", this.state.ActivityData);
    }

    if (this.state.agentType == "c") {
      this.setState({ activity_data: [] });
      this.state.ActivityData.map((x, index) => {
        if (x.name !== "Call Center") {
          this.state.activity_data.push(x);
        } else {
          this.setState({ sendMessageid: x.activity_id });
        }
      });
    }
    console.log("Activity data " + JSON.stringify(this.state.activity_data));
    await this.setState({ loading: false });
  };

  //*********************** Call Center Api Call start *********************************/

  CallCenterApi = async () => {
    console.warn(
      "Agent id " + this.state.agentId,
      this.state.status,
      this.state.pickups_id
    );
    await fetch("https://docboyz.in/docboyzmt/api/callcenter_pickup_details", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agentId: this.state.agentId,
        pickupId: this.state.pickups_id,
        type: this.state.status,
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        // this.callCeneterData()
        console.warn("Whole data of call center" + JSON.stringify(resData));
        if (resData.error == 0) {
          this.setState(
            {
              callCenter_PickupsData: resData.pickups,
              renderData: resData.pickups.activityNames,
              callcenter_activity: resData.pickups.call_center_activity,
              loading: false,
            },
            () => {
              // console.log("Question array "+JSON.stringify(this.state.activity_data[0].documents))
            }
          );
        }
      })
      .catch((error) => {
        console.log("Error in catch " + error.message);
      });
  };

  ///Submit Data call ti api
  submit = async (id) => {
    let { pickups_id } = this.state;
    var userData = [];
    var userData1 = [];
    var user = [];

    await db.transaction(async (tx) => {
      await tx.executeSql(
        "SELECT * FROM PickupDocument where pickups_id = ? AND activity_id = ?",
        [pickups_id, id],
        async (tx, results) => {
          console.log("PickupDocument Query completed", results);
          var len = results.rows.length;
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            await userData1.push(row);
          }
          await userData1.map((i) => {
            user.push(i.que_id);
          });
          await this.setState({ QUE_ID: user });
        }
      );

      await tx.executeSql(
        "SELECT * FROM PickupDocumentPictures where pickups_id = ? AND activity_id = ?",
        [pickups_id, id],
        async (tx, results) => {
          console.log(
            "PickupDocumentPictures Query Completed",
            pickups_id,
            results
          );

          var len = results.rows.length;
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            userData.push(row);
          }
          await this.setState({ Data: userData });
          console.log("current", this.state.Data);
          console.log(this.state.Data.length, this.state.QUE_ID.length);
          console.log(this.state.Data);
          console.log(this.state.Data);
          var flag = 0;
          if (this.state.Data.length == 0) {
            // console.log("Data 2 is empty")
            flag = 1;
          } else {
            for (i = 0; i < this.state.QUE_ID.length; i++) {
              if (flag == 1) {
                break;
              }
              for (j = 0; j < this.state.Data.length; j++) {
                if (
                  this.state.Data[j].pickups_document_id == this.state.QUE_ID[i]
                ) {
                  // console.log(this.state.Data[j].pickups_document_id, this.state.QUE_ID[i])
                  flag = 0;
                  break;
                } else {
                  flag = 1;
                  // console.log("flag 1")
                }
              }
            }
          }
          // console.log(flag)
          if (flag == 0) {
            if (Address !== "") {
              if (Address == "Home") {
                this.onButtonHomePress((p = id));
              } else {
                this.onButtonOfficePress((p = id));
              }
            } else {
              Snackbar.show({
                text: "Address not selected",
                duration: Snackbar.LENGTH_LONG,
              });
              this.setState({ loading: false });
            }
          } else {
            Snackbar.show({
              text: "Please Complete All Questions",
              duration: Snackbar.LENGTH_LONG,
            });
            flag = 1;
            this.setState({ loading: false });
          }
        }
      );
    });
  };

  // ****************** send call details to chat ************************
  sendCallCenterData = async (pickupid, customerid) => {
    //  console.log("Activity id 0000000 "+activityid);
    await fetch("https://docboyz.in/docboyzmt/api/activity_chat_store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id: this.state.agentId,
        pickup_id: pickupid,
        company_id: customerid,
        message: "You have called the customer",
        activity_id: this.state.sendMessageid,
      }),
    })
      .then((response) => response.json())
      .then((sendData) => {
        console.log("Send Data of assign", sendData);
      })
      .catch((error) => {
        console.log("catch error found", error.message);
        Snackbar.show({
          text: "Something wrong please try again",
          duration: Snackbar.LENGTH_LONG,
        });
      });
  };

  // ********************Send call data to chat*******************************

  call = (number, itemData) => {
    // console.log("ALLLLLL DDDDAAAAAta "+ JSON.stringify(itemData))
    if (this.state.agentType == "c") {
      this.callCeneterData(); // call to customer
      this.sendCallCenterData(itemData.id, itemData.customer_id);
    }
    Linking.openURL("tel:" + encodeURIComponent(number)); // call on system
  };

  onButtonHomePress = async (a) => {
    BackgroundFetch.registerHeadlessTask(this.SaveAllData(a));
  };

  onButtonOfficePress = async (a) => {
    BackgroundFetch.registerHeadlessTask(this.SaveAllData(a));
  };

  SaveAllData = async (activity_id) => {
    console.log("save function Activity Id", activity_id);

    var activity = activity_id;
    await this.setState({ stop: 0 });
    var CountVal = 1;
    let { pickups_id, status2 } = await this.state;
    await db.transaction(async (tx) => {
      let query1 =
        "UPDATE Activity SET activity_status = ? WHERE pickups_id = ? AND activity_id = ?";
      await tx.executeSql(
        query1,
        [status2, pickups_id, activity_id],
        function (tx, res) {
          console.log("update Status uploading statsus " + res.insertId);
          console.log("rowsAffected: " + res.rowsAffected);
        },
        function (tx, error) {
          console.log("UPDATE error: " + error.message);
        }
      );
      this.LoadData();
    });
    await this.setState({ loading: false });

    for (var i = 0; i < this.state.QUE_ID.length; i++) {
      this.setState({ documents: [] });
      let NData = [];

      for (let j = 0; j < this.state.Data.length; j++) {
        if (this.state.Data[j].pickups_document_id === this.state.QUE_ID[i]) {
          console.log(" Matching data", this.state.Data[j]);
          await NData.push(this.state.Data[j]);
        }
      }

      let p = 0;

      while (p < NData.length) {
        console.log("sending Data", NData);
        if (NData[p].is_upload != 2) {
          count = 0;
          const data = new FormData();

          await data.append("pickupId", NData[p].pickups_id.toString());
          await data.append(
            "documentId",
            NData[p].pickups_document_id.toString()
          );
          await data.append("latitude", NData[p].latitude);
          await data.append("longitude", NData[p].longitude);
          await data.append("activity_id", activity);
          await data.append("comments", NData[p].filename);

          if (NData[p].filepath != null) {
            var matchExtention = NData[p].filepath.includes(".mp4");
            if (matchExtention) {
              await data.append("photo", {
                uri: NData[p].filepath,
                type: "video/mp4", // or photo.type
                name: `${Date.now()}-${NData[
                  p
                ].pickups_id.toString()}docboyz.mp4`,
              });
              console.log("match found mp4 " + NData[p].filepath);
            } else {
              (await NData[p].filepath) != null
                ? await data.append("photo", {
                    uri: NData[p].filepath,
                    type: "image/jpg", // or photo.type
                    name: `${Date.now()}-${NData[
                      p
                    ].pickups_id.toString()}docboyz.jpg`,
                  })
                : null;
            }
          }

          await console.log("Np Data is " + JSON.stringify(data));

          await console.log(
            "File path of images " + JSON.stringify(NData[p].filename)
          );

          await console.log(
            "All uploading data to server ",
            JSON.stringify(data)
          );
          await fetch(
            "https://docboyz.in/docboyzmt/api/activity_pickup_upload_new",
            {
              method: "POST",
              headers: {
                "Content-Type": "multipart/form-data",
              },
              body: data,
            }
          )
            .then((response) => response.json())
            .then((response) => {
              console.log("uploading res ", response);
              if (response.error == 0) {
                Snackbar.show({
                  title: `Document Submit Successfully ${CountVal}`,
                  duration: Snackbar.LENGTH_LONG,
                });

                this.setState({
                  count: this.state.count + 1,
                });
                CountVal++;

                this.state.stop == 0
                  ? this.UpdateIsUpload(activity, NData[p].pickups_document_id)
                  : null;
              } else {
                Snackbar.show({
                  title: `Something Wrong`,
                  duration: Snackbar.LENGTH_LONG,
                });
                console.log("Responce in " + JSON.stringify(response));
                this.state.stop == 0
                  ? this.ResumePickup(CountVal, activity)
                  : null;

                this.setState({ stop: 1 });
              }
            })
            .catch(async (error) => {
              console.log("Error found in catch :", error.message);

              this.state.stop == 0
                ? this.ResumePickup(CountVal, activity)
                : null;

              this.setState({ stop: 1 });

              NetInfo.isConnected.fetch().then((isConnected) => {
                if (isConnected) {
                  console.log("Internet is connected");
                } else {
                  Snackbar.show({
                    title: "please check Internet Connection",
                    duration: Snackbar.LENGTH_LONG,
                  });
                }

                return false;
              });

              console.log("stop", this.state.stop);
            });
        } else {
          console.log("Document Alrady Uploaded");
        }

        p++;
      }
    }

    (await this.state.stop) == 0
      ? await this.PickupPdf(activity, CountVal)
      : null;
  };

  PickupPdf = async (activity, CountVal) => {
    let { pickups_id, status2 } = await this.state;
    var local = "";
    console.log(
      "Activity Id for pickupPdf PDF API CALL ",
      activity,
      pickups_id
    );
    await db.transaction(async (tx) => {
      tx.executeSql(
        "SELECT * FROM Location where pickups_id = ? AND activity_id = ?",
        [pickups_id, activity],
        async (tx, results) => {
          console.warn("Location Query completed", results);
          var len = results.rows.length;

          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            local = await row.activity_Location;
          }

          console.warn("llcation", local);
          await this.final(local, activity, CountVal);
        }
      );
    });
  };

  final = async (location, activity, CountVal) => {
    if (location != null) {
      let { pickups_id } = await this.state;
      let { latitude, longitude } = await this.state.region;
      console.warn(
        "locatio in final",
        location,
        pickups_id,
        latitude,
        longitude,
        activity
      );
      this.setState({ QUE_ID: [], count: 1 });
      await fetch("https://docboyz.in/docboyzmt/api/activity_pickup_pdf", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pickupId: pickups_id,
          activity_id: activity,
          action: "1",
          latitude: latitude,
          longitude: longitude,
          pickup_location: location,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          console.warn(" PDF API RESPONCE OK", res);
          if (res.error == 0) {
            this.DeletePickupFromLocalDb(activity);
          } else {
            this.ResumePickup(CountVal, activity);
          }
        })
        .catch((error) => {
          this.ResumePickup(CountVal, activity);

          console.log("Activity  error in pdf", error);

          this.setState({ QUE_ID: "", button_loading: 20 });
        });
    } else {
      let { pickups_id } = await this.state;
      let { latitude, longitude } = await this.state.region;
      console.warn(
        "locatio in final",
        location,
        pickups_id,
        latitude,
        longitude,
        activity
      );
      this.setState({ QUE_ID: [], count: 1 });
      await fetch("https://docboyz.in/docboyzmt/api/activity_pickup_pdf", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pickupId: pickups_id,
          activity_id: activity,
          action: "1",
          latitude: latitude,
          longitude: longitude,
          pickup_location: Home,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          console.warn(" PDF API RESPONCE OK", res);
          if (res.error == 0) {
            this.DeletePickupFromLocalDb(activity);
          } else {
            this.ResumePickup(CountVal, activity);
          }
        })
        .catch((error) => {
          this.ResumePickup(CountVal, activity);

          console.log("Activity  error in pdf", error);

          this.setState({ QUE_ID: "", button_loading: 20 });
        });
    }
  };

  DeletePickupFromLocalDb = async (a) => {
    let { pickups_id } = await this.state;

    console.log("Delete called ", a, pickups_id);
    await db.transaction(async function (tx) {
      let query =
        "DELETE FROM PickupDocumentPictures WHERE pickups_id = ? AND activity_id = ?";
      let query1 =
        "DELETE FROM PickupDocument WHERE pickups_id = ? AND activity_id = ?";
      let query2 =
        "DELETE FROM Activity WHERE pickups_id = ? AND activity_id = ?";

      await tx.executeSql(
        query,
        [pickups_id, a],
        function (tx, res) {
          console.log("remove from PickupDocumentPictures:" + res);
          console.log("rowsAffected: " + res.rowsAffected);
        },
        function (tx, error) {
          console.log("DELETE error: " + error.message);
        }
      );

      await tx.executeSql(
        query1,
        [pickups_id, a],
        function (tx, res) {
          console.log("remove PickupDocument: " + res);
          console.log("rowsAffected: " + res.rowsAffected);
        },
        function (tx, error) {
          console.log("DELETE error: " + error.message);
        }
      );
      await tx.executeSql(
        query2,
        [pickups_id, a],
        function (tx, res) {
          console.log("remove activity: " + res.pickups_document_id);
          console.log("rowsAffected: " + res.rowsAffected);
        },
        function (tx, error) {
          console.log("DELETE error: " + error.message);
        }
      );
    });

    BackgroundFetch.finish();

    await this.CallAgain();
  };

  UpdateIsUpload = async (a, i) => {
    db.transaction(async (tx) => {
      let query1 =
        "UPDATE PickupDocumentPictures SET is_upload = ? WHERE pickups_document_id = ? AND activity_id = ?";
      await tx.executeSql(
        query1,
        [2, i, a],
        function (tx, res) {
          console.log("update status Upload Is " + res.insertId);
          console.log("rowsAffected: " + res.rowsAffected);
        },
        function (tx, error) {
          console.log("UPDATE error: " + error.message);
        }
      );
    });
  };

  ResumePickup = async (newCount, a) => {
    let { pickups_id, status3 } = await this.state;
    await this.setState({
      ActivityData: [],
      activity_data: [],
      count: newCount,
      QUE_ID: [],
      button_loading: 20,
      Pickup_details: [],
      PickupsData: [],
    });

    db.transaction(async (tx) => {
      let query1 =
        "UPDATE Activity SET activity_status = ? WHERE pickups_id = ? AND activity_id = ?";
      await tx.executeSql(
        query1,
        [status3, pickups_id, a],
        function (tx, res) {
          console.log("update Status Resume " + res.insertId);
          console.log("rowsAffected: " + res.rowsAffected);
        },
        function (tx, error) {
          console.log("UPDATE error: " + error.message);
        }
      );
    });
    await this.CallAgain();

    this.props.navigation.replace("pickup");
  };

  onChangeAccordian(section) {
    this.setState({ open: section });
  }

  Map = (name) => {
    if (name == "Document Collection") {
      Alert.alert(
        "Location",
        "Please Select The Location",
        [
          {
            text: "Home",
            onPress: () => this.Home(),
          },
          {
            text: "Office",
            onPress: () => this.Office(),
          },
        ],
        {
          cancelable: false,
        }
      );
    } else {
      if (name == "CPVR+DC") {
        this.Home();
      } else if (name == "CPVO+DC") {
        this.Office();
      } else if (name == "CPVR") {
        this.Home();
      } else if (name == "CPVO") {
        this.Office();
      } else {
        Alert.alert(
          "Location",
          "Please Select The Location",
          [
            {
              text: "Home",
              onPress: () => this.Home(),
            },
            {
              text: "Office",
              onPress: () => this.Office(),
            },
          ],
          {
            cancelable: false,
          }
        );
      }
    }
  };
  Home = () => {
    // console.log("caleed")
    Geocoder.geocodeAddress(this.state.Pickup_details[0].home_address)
      .then((res) => {
        console.log(res);
        let [ok] = res;
        let { lng: Lng, lat: Lat } = ok.position;
        const data = {
          //  source: {
          //   //  latitude: -33.8356372,
          //   //  longitude: 18.6947617
          //  },
          destination: {
            latitude: Lat,
            longitude: Lng,
          },
          params: [
            {
              key: "travelmode",
              value: "driving", // may be "walking", "bicycling" or "transit" as well
            },
            {
              key: "dir_action",
              value: "navigate", // this instantly initializes navigation using the given travel mode
            },
          ],
        };
        getDirections(data);
      })
      .catch((err) => console.log(err.message));
  };

  Office = () => {
    Geocoder.geocodeAddress(this.state.Pickup_details[0].office_address)
      .then((res) => {
        let [ok] = res;
        let { lng: Lng, lat: Lat } = ok.position;
        const data = {
          //  source: {
          //   //  latitude: -33.8356372,
          //   //  longitude: 18.6947617
          //  },
          destination: {
            latitude: Lat,
            longitude: Lng,
          },
          params: [
            {
              key: "travelmode",
              value: "driving", // may be "walking", "bicycling" or "transit" as well
            },
            {
              key: "dir_action",
              value: "navigate", // this instantly initializes navigation using the given travel mode
            },
          ],
        };
        getDirections(data);
      })
      .catch((err) => console.log(err.message));
  };

  renderRow({ item }) {
    return (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          margin: 10,
          marginLeft: 7,
          marginRight: 7,
          marginBottom: 5,
          backgroundColor: "#F5F5F6",
          shadowOffset: { width: 20, height: 10 },
          shadowColor: "white",
          elevation: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginLeft: 20,
            marginRight: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              width: "70%",
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                fontSize: 18,
                color: "black",
                fontWeight: "bold",
              }}
            >
              {item.pickup_person}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", alignSelf: "center", width: "30%" }}
          >
            <Icon
              type="material-community"
              name={"phone"}
              size={15}
              color="mediumseagreen"
            />
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Call",
                  `Do you want to call ${item.mobile}`,
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "OK",
                      onPress: () => {
                        Linking.openURL(
                          "tel:" + encodeURIComponent(item.mobile)
                        );
                      }, // call on system this.call(item.mobile)
                    },
                  ],
                  {
                    cancelable: false,
                  }
                )
              }
            >
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 14,
                  color: "mediumseagreen",
                  fontWeight: "bold",
                }}
              >
                {item.mobile}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginLeft: 20,
            marginRight: 20,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
            <Icon
              type="material-community"
              name={"clipboard-text"}
              size={17}
              color="mediumseagreen"
            />

            <Text
              style={{ alignSelf: "center", fontWeight: "500", fontSize: 12 }}
            >
              {item.pickup_date}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Icon
              type="material-community"
              name={"clock-outline"}
              size={17}
              color="mediumseagreen"
            />
            <Text
              style={{ alignSelf: "center", fontWeight: "500", fontSize: 12 }}
            >
              {item.preferred_start_time} - {item.preferred_end_time}
            </Text>
          </View>
        </View>
        <Divider backgroundColor="black" alignSelf="center" width="80%" />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            width: "90%",
            marginTop: 10,
          }}
        >
          <Icon
            type="material-community"
            name={"home"}
            size={20}
            color="mediumseagreen"
            containerStyle={{ marginLeft: 8 }}
          />
          <Text style={{ fontSize: 10, fontWeight: "500", width: "80%" }}>
            {item.home_address}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
            <Icon
              type="material-community"
              name={"wallet-travel"}
              size={20}
              color="mediumseagreen"
              containerStyle={{ marginLeft: 8 }}
            />
            <Text style={{ fontSize: 10, fontWeight: "500", width: "80%" }}>
              {item.office_address}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    //console.log("the activity data ",JSON.stringify(this.state.ActivityData))
    console.log("Pickup_details", this.state.Pickup_details);
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <Header
            leftComponent={{
              icon: "arrow-back",
              color: "#fff",
              onPress: () => {
                this.props.navigation.replace("pickup");
              },
            }}
            centerComponent={{
              text: "PickUp Details",
              style: { color: "#fff", fontSize: 20, fontFamily: "serif" },
            }}
            outerContainerStyles={{ backgroundColor: "#E41313", height: 55 }}
            innerContainerStyles={{ justifyContent: "space-between" }}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <ActivityIndicator />
          </View>
        </View>
      );
    }

    if (this.state.agentType !== "c") {
      return (
        <View style={{ flex: 1, backgroundColor: "white  " }}>
          <Header
            leftComponent={{
              icon: "arrow-back",
              color: "#fff",
              onPress: () => {
                this.props.navigation.replace("pickup");
              },
            }}
            centerComponent={{
              text: "PickUp Details",
              style: { color: "#fff", fontSize: 20, fontFamily: "serif" },
            }}
            outerContainerStyles={{ backgroundColor: "#E41313", height: 55 }}
            innerContainerStyles={{ justifyContent: "space-between" }}
          />
          <List>
            <FlatList
              extraData={this.state}
              data={this.state.Pickup_details}
              renderItem={this.renderRow}
            />
          </List>
          <View style={styles.container}>
            <ScrollView>
              <SimpleAccordion
                style={{
                  borderRadius: 1,
                  margin: 10,
                  marginLeft: 7,
                  marginRight: 7,
                  marginBottom: 5,
                  padding: 10,
                  paddingLeft: 5,
                  paddingRight: 5,
                  paddingBottom: 5,
                  backgroundColor: "#ffffff",
                  shadowOffset: {
                    width: 20,
                    height: 10,
                  },
                  shadowColor: "white",
                  elevation: 10,
                }}
                activeSection={this.state.open}
                //   disabled={this.state.agentType=="c"&&this.state.activity_data[0].activity_name=="Call Center"?true:false}            // it is used for self assign activity
                sections={this.state.ActivityData}
                touchableComponent={TouchableOpacity}
                renderHeader={(p, i, isOpen) => {
                  console.log(p, isOpen);
                  return (
                    <View
                      style={{
                        backgroundColor: "#ffffff",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        height: 35,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          width: "50%",
                        }}
                      >
                        <Text
                          style={[
                            styles.headerText,
                            {
                              padding: 5,
                              textAlign: "left",
                              color: "black",
                              fontSize: 16,
                            },
                          ]}
                        >
                          {p.name}
                        </Text>
                        {isOpen === false ? (
                          <TouchableOpacity
                            style={{ marginLeft: 3, marginRight: 10 }}
                          >
                            <Icon
                              type="material-community"
                              name={"chevron-right"}
                              size={28}
                              color="mediumseagreen"
                              containerStyle={{}}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={{ marginLeft: 3, marginRight: 10 }}
                          >
                            <Icon
                              type="material-community"
                              name={"chevron-down"}
                              size={28}
                              color="mediumseagreen"
                              containerStyle={{}}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-around",
                          width: "50%",
                        }}
                      >
                        {
                          <TouchableHighlight
                            style={{ width: 40, height: 35 }}
                            onPress={() => this.Map(p.name)}
                            underlayColor="mediumseagreen"
                          >
                            <Icon
                              type="material-community"
                              name={"google-maps"}
                              size={25}
                              color="mediumseagreen"
                            />
                          </TouchableHighlight>
                        }

                        <TouchableHighlight
                          style={{
                            width: 40,
                            height: 35,
                            marginLeft: 8,
                            marginRight: 8,
                          }}
                          onPress={() =>
                            this.props.navigation.replace("ChatScreen", {
                              ITEM: this.state.Pickup_details[0],
                              ActivityId: p.activity_id,
                              Activity_name: p.name,
                              ActiveScreen: 1,
                              pickup_id: this.state.pickups_id,
                            })
                          }
                          underlayColor="mediumseagreen"
                        >
                          <Icon
                            type="material-community"
                            name={"forum"}
                            size={25}
                            color="mediumseagreen"
                          />
                        </TouchableHighlight>

                        {
                          <TouchableHighlight
                            style={{ width: 40, height: 35 }}
                            onPress={() =>
                              this.props.navigation.navigate("email", {
                                ITEM: this.state.Pickup_details.pickup_person,
                              })
                            }
                            underlayColor="mediumseagreen"
                          >
                            <Icon
                              type="material-community"
                              name={"email"}
                              size={25}
                              color="mediumseagreen"
                              containerStyle={{}}
                            />
                          </TouchableHighlight>
                        }
                      </View>
                    </View>
                  );
                }}
                renderContent={(i) => {
                  return (
                    <ScrollView>
                      <View style={styles.content}>
                        <List>
                          <FlatList
                            data={i.documents}
                            renderItem={({ item, index }) => (
                              <ListItem
                                roundAvatar
                                title={
                                  <View
                                    style={{
                                      flexDirection: "column",
                                      alignSelf: "center",
                                    }}
                                  >
                                    <TouchableOpacity
                                      onPress={() => {
                                        console.log(
                                          "the name send ",
                                          item.activity_name
                                        );
                                        this.props.navigation.navigate(
                                          "Robort",
                                          {
                                            name: item.question,
                                            Sequence: item.sequence,
                                            Index: index,
                                            pickup_person: item.product_name,
                                            pickup_id: item.pickups_id,
                                            id: item.que_id,
                                            activity_id: item.activity_id,
                                            activity_name: item.activity_name,
                                          }
                                        );
                                      }}
                                    >
                                      <View
                                        style={{
                                          flexDirection: "row",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <View
                                          style={{
                                            justifyContent: "flex-start",
                                            width: "85%",
                                          }}
                                        >
                                          <Text
                                            style={{
                                              fontWeight: "bold",
                                              fontSize: 12,
                                              fontFamily: "Gruppo",
                                            }}
                                          >
                                            {item.question}
                                          </Text>
                                        </View>
                                        <View
                                          style={{
                                            justifyContent: "flex-end",
                                            width: "15%",
                                          }}
                                        >
                                          {item.complete == "complete" ? (
                                            <Icon
                                              type="material-community"
                                              name={"check"}
                                              size={20}
                                              color="red"
                                              containerStyle={{ marginTop: 0 }}
                                            />
                                          ) : null}
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                }
                                contentContainerStyle={{ marginTop: 0 }}
                                containerStyle={{
                                  borderBottomWidth: 0,
                                  margin: 0,
                                  flex: 1,
                                  flexDirection: "column",
                                  fontSize: 20,
                                }}
                              />
                            )}
                            keyExtractor={(item) => item.question}
                            rightIcon={{ name: "none" }}
                          />
                          {i.activity_status == "Uploading" ? (
                            <View
                              style={{
                                flex: 1,
                                flexDirection: "row",
                                justifyContent: "center",
                                height: 35,
                                width: "80%",
                                borderColor: "#1B547C",
                                backgroundColor: "#800080",
                                borderWidth: 1,
                                borderRadius: 5,
                                marginBottom: 5,
                                alignSelf: "center",
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "column",
                                  justifyContent: "center",
                                }}
                              >
                                <BallIndicator
                                  color="white"
                                  size={15}
                                  style={{ alignSelf: "flex-start" }}
                                />
                              </View>
                              <View
                                style={{
                                  flexDirection: "column",
                                  justifyContent: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 15,
                                    color: "white",
                                    alignSelf: "center",
                                    fontWeight: "400",
                                    margin: 10,
                                    fontWeight: "400",
                                    fontFamily: "Regular",
                                  }}
                                >
                                  Pickup-Uploading...
                                </Text>
                              </View>
                            </View>
                          ) : i.activity_status == 30 ? (
                            <View
                              style={{
                                flexDirection: "column",
                                alignSelf: "center",
                                height: 35,
                                width: "80%",
                              }}
                            >
                              <TouchableHighlight
                                style={{
                                  flex: 1,
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  height: 35,
                                  width: "80%",
                                  borderColor: "red",
                                  backgroundColor: "red",
                                  borderWidth: 1,
                                  borderRadius: 5,
                                  marginBottom: 5,
                                  alignSelf: "center",
                                }}
                                onPress={() => this.submit(i.activity_id)}
                                underlayColor="red"
                              >
                                <Text
                                  style={{
                                    fontSize: 15,
                                    color: "white",
                                    alignSelf: "center",
                                    fontWeight: "400",
                                    margin: 10,
                                    fontWeight: "400",
                                    fontFamily: "Regular",
                                  }}
                                >
                                  Submit
                                </Text>
                              </TouchableHighlight>
                            </View>
                          ) : (
                            <View
                              style={{
                                flexDirection: "column",
                                alignSelf: "center",
                                height: 35,
                                width: "80%",
                              }}
                            >
                              <TouchableHighlight
                                style={{
                                  flex: 1,
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  height: 35,
                                  width: "80%",
                                  borderColor: "blue",
                                  backgroundColor: "blue",
                                  borderWidth: 1,
                                  borderRadius: 5,
                                  marginBottom: 5,
                                  alignSelf: "center",
                                }}
                                onPress={() => this.submit(i.activity_id)}
                                underlayColor="red"
                              >
                                <Text
                                  style={{
                                    fontSize: 15,
                                    color: "white",
                                    alignSelf: "center",
                                    fontWeight: "400",
                                    margin: 10,
                                    fontWeight: "400",
                                    fontFamily: "Regular",
                                  }}
                                >
                                  Resume
                                </Text>
                              </TouchableHighlight>
                            </View>
                          )}
                        </List>
                      </View>
                    </ScrollView>
                  );
                }}
                duration={700}
                onChange={this.onChangeAccordian.bind(this)}
              />
            </ScrollView>
          </View>
        </View>
      );
    } else {
      // Call Center Agent work start***********************************************
      return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <Header
            leftComponent={{
              icon: "arrow-back",
              color: "#fff",
              onPress: () => {
                this.props.navigation.replace("pickup");
              },
            }}
            centerComponent={{
              text: "PickUp Details",
              style: { color: "#fff", fontSize: 20, fontFamily: "serif" },
            }}
            outerContainerStyles={{ backgroundColor: "#E41313", height: 55 }}
            innerContainerStyles={{ justifyContent: "space-between" }}
          />
          <View
            style={{
              flexDirection: "column",
              margin: 10,
              marginLeft: 7,
              marginRight: 7,
              marginBottom: 5,
              backgroundColor: "#F5F5F6",
              shadowOffset: {
                width: 20,
                height: 10,
              },
              shadowColor: "white",
              elevation: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginLeft: 20,
                marginRight: 20,
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  width: "70%",
                }}
              >
                <Text
                  style={{ fontSize: 16, color: "black", fontWeight: "bold" }}
                >
                  {this.state.callCenter_PickupsData.product_name}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: "black",
                    fontWeight: "bold",
                    marginLeft: 10,
                  }}
                >
                  -
                </Text>
                <Text
                  style={{ fontSize: 16, color: "black", fontWeight: "bold" }}
                >
                  {this.state.callCenter_PickupsData.pickup_person}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  width: "30%",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      "Call",
                      `Do you want to call Customer`,
                      [
                        {
                          text: "Cancel",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel",
                        },
                        {
                          text: "OK",
                          onPress: () =>
                            this.call(
                              this.state.callCenter_PickupsData.mobile,
                              this.state.callCenter_PickupsData
                            ),
                        },
                      ],
                      {
                        cancelable: false,
                      }
                    )
                  }
                >
                  <View style={{ flexDirection: "row" }}>
                    <Icon
                      type="material-community"
                      name={"phone"}
                      size={20}
                      color="mediumseagreen"
                      style={{ margin: 5 }}
                    />
                    <Text
                      style={{
                        alignSelf: "center",
                        fontSize: 14,
                        color: "mediumseagreen",
                        fontWeight: "bold",
                      }}
                    >
                      Call Customer
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginLeft: 20,
                marginRight: 20,
                paddingBottom: 10,
              }}
            >
              <View
                style={{ flexDirection: "row", justifyContent: "flex-start" }}
              >
                <Icon
                  type="material-community"
                  name={"clipboard-text"}
                  size={17}
                  color="mediumseagreen"
                />

                <Text
                  style={{
                    alignSelf: "center",
                    fontWeight: "500",
                    fontSize: 12,
                  }}
                >
                  {this.state.callCenter_PickupsData.pickup_date}
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                <Icon
                  type="material-community"
                  name={"clock-outline"}
                  size={17}
                  color="mediumseagreen"
                />
                <Text
                  style={{
                    alignSelf: "center",
                    fontWeight: "500",
                    fontSize: 12,
                  }}
                >
                  {this.state.callCenter_PickupsData.preferred_start_time} -{" "}
                  {this.state.callCenter_PickupsData.preferred_end_time}
                </Text>
              </View>
            </View>
            <Divider backgroundColor="black" alignSelf="center" width="80%" />
          </View>
          <View style={styles.container}>
            <ScrollView>
              <FlatList
                //horizontal={true}
                data={this.state.renderData}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => this.onPressHandler(item.activity_id)}
                  >
                    <Card
                      style={
                        item.selected == true
                          ? {
                              borderRadius: 5,
                              backgroundColor: "white",
                              // borderColor:'grey',
                              // borderWidth:1,
                              margin: 5,
                              elevation: 5,
                            }
                          : {
                              borderRadius: 5,
                              backgroundColor: "white",
                              margin: 5,
                              elevation: 5,
                            }
                      }
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          flex: 1,
                          backgroundColor: "white",
                          padding: 10,
                          justifyContent: "space-between",
                          borderRadius: 5,
                        }}
                      >
                        <Text style={{ color: "black" }}>{item.name}</Text>
                        {item.selected == true ? (
                          <Icon
                            type="material-community"
                            name={"check"}
                            size={22}
                            color="green"
                            containerStyle={{ marginTop: 0, marginRight: 10 }}
                          />
                        ) : null}
                      </View>

                      <Text
                        style={{
                          fontSize: 12,
                          color: "grey",
                          marginLeft: 10,
                          paddingBottom: 5,
                        }}
                      >
                        {this.getstatus(item.status)}
                        {item.agent_name}{" "}
                        {item.agent_id == null ? null : "- " + item.agent_id}
                      </Text>
                    </Card>
                  </TouchableOpacity>
                )}
              />

              {this.state.activity_selected.length > 0 ? (
                <View style={{ alignItems: "center", marginTop: 10 }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.replace("ChatScreen", {
                        ITEM: this.state.callCenter_PickupsData,
                        ActivityId: this.state.callcenter_activity.activity_id,
                        Activity_name: this.state.callcenter_activity.name,
                        SelectedActivity: this.state.activity_selected,
                      })
                    }
                    style={{
                      backgroundColor: "red",
                      padding: 7,
                      borderRadius: 5,
                      elevation: 10,
                      marginLeft: 10,
                    }}
                  >
                    <Text style={{ color: "white" }}>Assign</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              {this.state.activity_data.length != 0 ? (
                <ScrollView>
                  <SimpleAccordion
                    style={{
                      flex: 1,
                      borderRadius: 1,
                      margin: 10,
                      marginLeft: 7,
                      marginRight: 7,
                      marginBottom: 5,
                      padding: 10,
                      paddingLeft: 5,
                      paddingRight: 5,
                      paddingBottom: 5,
                      backgroundColor: "#ffffff",
                      shadowOffset: {
                        width: 20,
                        height: 10,
                      },
                      shadowColor: "white",
                      elevation: 10,
                    }}
                    activeSection={this.state.open}
                    sections={this.state.activity_data}
                    touchableComponent={TouchableOpacity}
                    renderHeader={(p, i, isOpen) => {
                      console.log(p, isOpen);
                      return (
                        <View
                          style={{
                            backgroundColor: "#ffffff",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            height: 35,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "flex-start",
                              width: "50%",
                            }}
                          >
                            <Text
                              style={[
                                styles.headerText,
                                {
                                  padding: 5,
                                  textAlign: "left",
                                  color: "black",
                                  fontSize: 16,
                                },
                              ]}
                            >
                              {p.name}
                            </Text>
                            {isOpen === false ? (
                              <TouchableHighlight
                                style={{ marginLeft: 3, marginRight: 10 }}
                              >
                                <Icon
                                  type="material-community"
                                  name={"chevron-right"}
                                  size={28}
                                  color="mediumseagreen"
                                  containerStyle={{}}
                                />
                              </TouchableHighlight>
                            ) : (
                              <TouchableHighlight
                                style={{ marginLeft: 3, marginRight: 10 }}
                              >
                                <Icon
                                  type="material-community"
                                  name={"chevron-down"}
                                  size={28}
                                  color="mediumseagreen"
                                  containerStyle={{}}
                                />
                              </TouchableHighlight>
                            )}
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-around",
                              width: "50%",
                            }}
                          >
                            {
                              <TouchableHighlight
                                style={{ width: 40, height: 35 }}
                                onPress={() => this.Map(p.name)}
                                underlayColor="mediumseagreen"
                              >
                                <Icon
                                  type="material-community"
                                  name={"google-maps"}
                                  size={25}
                                  color="mediumseagreen"
                                />
                              </TouchableHighlight>
                            }
                            <TouchableHighlight
                              style={{
                                width: 40,
                                height: 35,
                                marginLeft: 8,
                                marginRight: 8,
                              }}
                              onPress={() =>
                                this.props.navigation.replace("ChatScreen", {
                                  ITEM: this.state.Pickup_details[0],
                                  ActivityId: p.activity_id,
                                  Activity_name: p.name,
                                  ActiveScreen: 1,
                                })
                              }
                              underlayColor="mediumseagreen"
                            >
                              <Icon
                                type="material-community"
                                name={"forum"}
                                size={25}
                                color="mediumseagreen"
                              />
                            </TouchableHighlight>

                            {
                              <TouchableHighlight
                                style={{ width: 40, height: 35 }}
                                onPress={() =>
                                  this.props.navigation.navigate("email", {
                                    ITEM: this.state.Pickup_details
                                      .pickup_person,
                                  })
                                }
                                underlayColor="mediumseagreen"
                              >
                                <Icon
                                  type="material-community"
                                  name={"email"}
                                  size={25}
                                  color="mediumseagreen"
                                  containerStyle={{}}
                                />
                              </TouchableHighlight>
                            }
                          </View>
                        </View>
                      );
                    }}
                    renderContent={(i) => {
                      console.log("Documnet lenght" + i.documents);
                      return (
                        <ScrollView>
                          <View style={styles.content}>
                            <List>
                              <FlatList
                                data={i.documents}
                                renderItem={({ item, index }) => (
                                  <ListItem
                                    roundAvatar
                                    title={
                                      <View
                                        style={{
                                          flexDirection: "column",
                                          alignSelf: "center",
                                        }}
                                      >
                                        <TouchableOpacity
                                          onPress={() => {
                                            console.log("the name send ", item);

                                            this.props.navigation.navigate(
                                              "Robort",
                                              {
                                                name: item.question,
                                                Sequence: item.sequence,
                                                Index: index,
                                                pickup_person:
                                                  item.product_name,
                                                pickup_id: item.pickups_id,
                                                id: item.que_id,
                                                activity_id: item.activity_id,
                                                activity_name:
                                                  item.activity_name,
                                              }
                                            );
                                          }}
                                        >
                                          <View
                                            style={{
                                              flexDirection: "row",
                                              justifyContent: "space-between",
                                            }}
                                          >
                                            <View
                                              style={{
                                                justifyContent: "flex-start",
                                                width: "85%",
                                              }}
                                            >
                                              <Text
                                                style={{
                                                  fontWeight: "bold",
                                                  fontSize: 12,
                                                  fontFamily: "Gruppo",
                                                }}
                                              >
                                                {item.question}
                                              </Text>
                                            </View>
                                            <View
                                              style={{
                                                justifyContent: "flex-end",
                                                width: "15%",
                                              }}
                                            >
                                              {item.complete == "complete" ? (
                                                <Icon
                                                  type="material-community"
                                                  name={"check"}
                                                  size={20}
                                                  color="red"
                                                  containerStyle={{
                                                    marginTop: 0,
                                                  }}
                                                />
                                              ) : null}
                                            </View>
                                          </View>
                                        </TouchableOpacity>
                                      </View>
                                    }
                                    contentContainerStyle={{ marginTop: 0 }}
                                    containerStyle={{
                                      borderBottomWidth: 0,
                                      margin: 0,
                                      flex: 1,
                                      flexDirection: "column",
                                      fontSize: 20,
                                    }}
                                  />
                                )}
                                keyExtractor={(item) => item.question}
                                rightIcon={{ name: "none" }}
                              />
                              {i.activity_status == "Uploading" ? (
                                <View
                                  style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    height: 35,
                                    width: "80%",
                                    borderColor: "#1B547C",
                                    backgroundColor: "#800080",
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    marginBottom: 5,
                                    alignSelf: "center",
                                  }}
                                >
                                  <View
                                    style={{
                                      flexDirection: "column",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <BallIndicator
                                      color="white"
                                      size={15}
                                      style={{ alignSelf: "flex-start" }}
                                    />
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: "column",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: 15,
                                        color: "white",
                                        alignSelf: "center",
                                        fontWeight: "400",
                                        margin: 10,
                                        fontWeight: "400",
                                        fontFamily: "Regular",
                                      }}
                                    >
                                      Pickup-Uploading...
                                    </Text>
                                  </View>
                                </View>
                              ) : i.activity_status == 30 ? (
                                <View
                                  style={{
                                    flexDirection: "column",
                                    alignSelf: "center",
                                    height: 35,
                                    width: "80%",
                                  }}
                                >
                                  <TouchableHighlight
                                    style={{
                                      flex: 1,
                                      flexDirection: "column",
                                      justifyContent: "center",
                                      height: 35,
                                      width: "80%",
                                      borderColor: "red",
                                      backgroundColor: "red",
                                      borderWidth: 1,
                                      borderRadius: 5,
                                      marginBottom: 5,
                                      alignSelf: "center",
                                    }}
                                    onPress={() => this.submit(i.activity_id)}
                                    underlayColor="red"
                                  >
                                    <Text
                                      style={{
                                        fontSize: 15,
                                        color: "white",
                                        alignSelf: "center",
                                        fontWeight: "400",
                                        margin: 10,
                                        fontWeight: "400",
                                        fontFamily: "Regular",
                                      }}
                                    >
                                      Submit
                                    </Text>
                                  </TouchableHighlight>
                                </View>
                              ) : (
                                <View
                                  style={{
                                    flexDirection: "column",
                                    alignSelf: "center",
                                    height: 35,
                                    width: "80%",
                                  }}
                                >
                                  <TouchableHighlight
                                    style={{
                                      flex: 1,
                                      flexDirection: "column",
                                      justifyContent: "center",
                                      height: 35,
                                      width: "80%",
                                      borderColor: "blue",
                                      backgroundColor: "blue",
                                      borderWidth: 1,
                                      borderRadius: 5,
                                      marginBottom: 5,
                                      alignSelf: "center",
                                    }}
                                    onPress={() => this.submit(i.activity_id)}
                                    underlayColor="red"
                                  >
                                    <Text
                                      style={{
                                        fontSize: 15,
                                        color: "white",
                                        alignSelf: "center",
                                        fontWeight: "400",
                                        margin: 10,
                                        fontWeight: "400",
                                        fontFamily: "Regular",
                                      }}
                                    >
                                      Resume
                                    </Text>
                                  </TouchableHighlight>
                                </View>
                              )}
                            </List>
                          </View>
                        </ScrollView>
                      );
                    }}
                    duration={700}
                    onChange={this.onChangeAccordian.bind(this)}
                  />
                </ScrollView>
              ) : null}
            </ScrollView>
            {this.state.allCallcenterData.length > 0
              ? this.props.navigation.navigate("AddressInfos", {
                  dataFromParent: this.state.allCallcenterData,
                })
              : null}
          </View>
        </View>
      );
    }
  }

  //********************************* */ call center function call *********************************

  onPressHandler(id) {
    let renderData = [...this.state.renderData];
    console.log("function calling " + JSON.stringify(renderData));
    for (let data of renderData) {
      if (data.activity_id == id) {
        data.selected = data.selected == null ? true : !data.selected;
        if (data.selected == true) {
          this.state.activity_selected.push(id);
        } else {
          const index = this.state.activity_selected.indexOf(id);
          this.state.activity_selected.splice(index, 1); // parameter: possition and second remove number of
        }
        console.log("selected " + this.state.activity_selected);
        break;
      }
    }
    this.setState({ renderData });
  }

  // **************************** Call center function code end********************************

  //**************** Get status of activity**************************** */
  getstatus = (status) => {
    if (status == 10) {
      return <Text>Unpublish : </Text>;
    } else if (status == 20) {
      return <Text>Published </Text>;
    } else if (status == 30) {
      return <Text>Accepted : </Text>;
    } else if (status == 40) {
      return <Text>Document Submit : </Text>;
    }
  };

  //**************** Get status of activity end**************************** */
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerText1: {
    color: "white",
    textAlign: "center",
    fontSize: 22,
    color: "white",
  },
  headerTextView: {
    height: 30,
    borderWidth: 1,
    backgroundColor: "red",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "300",
    color: "#ffffff",
  },
  header: {
    flex: 1,
  },
  headerText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    padding: 5,
    backgroundColor: "#ffffff",
  },
});
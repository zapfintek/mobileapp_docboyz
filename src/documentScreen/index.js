import React from "react";
import {
  Text,
  View,
  TouchableHighlight,
  StyleSheet,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  FlatList,
} from "react-native";
import { Header } from "react-native-elements";
import Styles from "../src/helpers/styles";
import { TextField } from "react-native-material-textfield";
import ImagePicker from "react-native-image-picker";
import Lightbox from "react-native-lightbox";
import SwiperFlatList from "react-native-swiper-flatlist";
import CompressImage from "react-native-compress-image";
import { Dropdown } from "react-native-material-dropdown";
const _ = require("lodash");
import Database from "../src/LocalDB";
import ImageCropper from "react-native-android-image-cropper";
import Snackbar from "react-native-snackbar";
import AsyncStorage from "@react-native-community/async-storage";
import Geolocation from "react-native-geolocation-service";
import VideoPlayer from "react-native-video-player";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
let { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
var getValue = 0;
db = new Database();
const options = {
  guideLines: "on-touch",
  cropShape: "rectangle",
  title: "Docboyz",
  // cropMenuCropButtonTitle:'Done',
  // requestedSizeHeight:400,
  // requestedSizeWidth:400,
  // allowCounterRotation:true,
  // allowFlipping:true,
  // aspectRatio:[1,1],
  // transferFileToExternalDir:true,
  // externalDirectoryName:'MyExample',
  // autoZoomEnabled:true,
  // maxZoom:9,
  // fixAspectRatio:true,
  // initialCropWindowPaddingRatio:0.4, //10% - Set to 0 for initial crop window to fully cover the cropping image. Max 0.5
  // borderCornerThickness:10,//dp - Set to 0 to remove.
  // borderCornerOffset:10, //dp - Set to 0 place on top of the border lines.
  // borderCornerLength:10, //dp
  // guidelinesThickness:5, //dp
  // snapRadius:5, //dp - Set to 0 to disable snapping.
  // showCropOverlay:true,
  // // showProgressBar:true
  // minCropWindowWidthHeight:[40,40], //dp - min 10 dp,
  // flipHorizontally:true,
  // flipVertically:true,
};
export default class Document extends React.Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: "deepskyblue",
    },
    headerLeft: null,
    headerTitleStyle: {
      flex: 1,
      textAlign: "center",
      fontFamily: "serif",
    },
    drawerLabel: "Robort Angre",
  };

  constructor(props) {
    super(props);
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
    this.state = {
      otherComment: "",
      commentsArray: [],
      Que: {},
      Data: [],
      links: "",
      videos: [],
      selectedVideo: [],
      Questions: {},
      prev: [],
      image: "",
      activity_id: "",
      comment: "",
      dataStorage: [],
      Pickups_Document_Id: "",
      status: "Initiate",
      complete: "complete",
      aadharPath: "",
      Alert_call: false,
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      pickupId: this.props.navigation.state.params.pickup_id,
      count: this.props.navigation.state.params.Index,
      que_id: this.props.navigation.state.params.id,
      id: this.props.navigation.state.params.Sequence,
      pickupPerson: this.props.navigation.state.params.pickup_person,
      activity_name: this.props.navigation.state.params.activity_name,
      custemerId: "",
      ZipImage: "",
      msg: "",
      initialPosition: "unknown",
      is_video: "",
      video: [],
      agentCompany: "",
      videoNumber: "",
      image_type: "", // it is used for image type eg. pan aadhar etc
      video_questions: [],
      videoStrings: "", // video string means questions with , seperated.
      Links: [],
      agentType: "",
      coment1: "",
    };
  }

  componentWillMount = async () => {
    await this.selectDataFromLocal();
  };

  Called = this.props.navigation.addListener("willFocus", async () => {
    this.CurrentLocation();

    await this.selectDataFromLocal();

    var agentType = await AsyncStorage.getItem("AgentType");
    if (agentType == "c") {
      this.setState({
        agentType: agentType,
      });
    }

    await this.setState(
      {
        videoNumber: this.props.navigation.state.params.is_video,
      },
      () => {
        console.log("Video call " + this.state.videoNumber);
        if (this.state.videoNumber == 1) {
          this.video();
        }
      }
    );
  });

  localData = async () => {
    try {
      const myArray = await AsyncStorage.getItem("companyArray");
      if (myArray !== null) {
        JSON.parse(myArray).map((x) => {
          if (x == 11) {
            this.setState({ agentCompany: x });
          }
        });
      }
    } catch (error) {
      console.log("error for agent company " + error.message);
    }

    this.setState({ data2: "", loading: true });
    await db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Pickups where pickups_id = ? AND activity_id=?",
        [this.state.pickupId, this.state.activity_id],
        (tx, results) => {
          console.log("Query completed", results);
          var userData = results.rows.item(0);

          console.log("local data call", userData);

          this.setState({
            custemerId: userData.customer_id,
          });
        }
      );
    });
  };

  CurrentLocation = async () => {
    this.localData();

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
  };

  handleBackButton = () => {
    this.props.navigation.navigate("pickupDetails");
    return true;
  };

  _TogglePrev = async () => {
    this.setState({ OtherComment: "" });
    this.CurrentLocation();
    var { pickupId } = this.state;
    if (this.state.count <= 0) {
      this.setState({ count: null, id: null, dataStorage: [] });
      this.props.navigation.replace("pickupDetails", {
        pickupId: pickupId,
      });
    } else {
      if (this.state.count != 0) {
        (Count = (await this.state.count) - 1),
          (Id = (await this.state.id) - 1),
          (questions = await this.state.Data[Count].question),
          (Que_id = await this.state.Data[Count].que_id),
          (Is_Image = await this.state.Data[Count].is_image),
          this.setState({
            count: Count,
            id: Id,
            Questions: questions,
            que_id: Que_id,
            is_image: Is_Image,
          });
      } else {
        this.setState({ count: null, id: null, dataStorage: [] });
        this.props.navigation.navigate("pickupDetails");
      }
    }
    await this.setState({
      dataStorage: [],
      comment: "",
      commentsArray: [],
      video: [],
      Links: [],
    });
    await this.SelectData(this.state.que_id);
  };

  _ToggleNext = async () => {
    await console.log(this.state.Data);
    this.setState({ OtherComment: "" });
    var count = await this.state.count;
    this.CurrentLocation();
    console.log("comment issss " + this.state.comment);
    if (this.state.comment == "" || this.state.comment == null) {
      console.log(
        "comment issss " + this.state.comment,
        this.state.Data[count].question
      );
      var str = this.state.Data[count].question;
      var osv1 = str.includes("ORIGINAL SEEN");
      var osv2 = str.includes("OSV");
      console.log("commeenee  " + str + osv1 + osv2);
      if (osv1 || osv2) {
        Alert.alert(
          "Select Comment",
          "Have you seen original and Verified.",
          [
            {
              text: "No",
              onPress: () =>
                this.setState({
                  comment: this.state.comment.concat(" OSV NO"),
                }),
            },
            {
              text: "Yes",
              onPress: () =>
                this.setState({
                  comment: this.state.comment.concat(" OSV YES"),
                }),
            },
          ],
          {
            cancelable: false,
          }
        );
      }
      if (this.state.image_type == "do_offline_aadhar") {
        Alert.alert(
          "Passcode is required",
          "Please enter the passscode",
          [
            {
              text: "Ok",
              onPress: () => console.log("cancel"),
            },
          ],
          {
            cancelable: false,
          }
        );
      } else {
        Alert.alert(
          "Comment is required",
          "Please enter the comment",
          [
            {
              text: "Ok",
              onPress: () => console.log("cancel"),
            },
          ],
          {
            cancelable: false,
          }
        );
      }
    } else {
      var str = this.state.Data[this.state.count].question;
      var osv1 = str.includes("ORIGINAL SEEN");
      var osv2 = str.includes("OSV");
      var check1 = this.state.comment.includes("OSV YES");
      var check2 = this.state.comment.includes("OSV NO");
      var checkis = "";

      if (check1 || check2) {
        checkis = 1;
      }

      if ((osv1 || osv2) && checkis != 1) {
        Alert.alert(
          "Select Comment",
          "Have you seen original and Verified.",
          [
            {
              text: "No",
              onPress: () =>
                this.setState({
                  comment: this.state.comment.concat(" OSV NO"),
                }),
            },
            {
              text: "Yes",
              onPress: () =>
                this.setState({
                  comment: this.state.comment.concat(" OSV YES"),
                }),
            },
          ],
          {
            cancelable: false,
          }
        );
      } else {
        console.log("Thhejhjeh  " + this.state.dataStorage, this.state.video);
        if (
          this.state.is_image === "1" ||
          this.state.image_type ||
          this.state.is_video == 1
        ) {
          if (this.state.dataStorage == "" && this.state.video == "") {
            console.log("the lenght " + this.state.video.length);
            if (this.state.image_type == "do_offline_aadhar") {
              Alert.alert(
                "Aadhaar",
                "Please do offline aadhaar",
                [
                  {
                    text: "Ok",
                    onPress: () => console.log("ok"),
                  },
                ],
                {
                  cancelable: false,
                }
              );
            } else if (
              this.state.image_type === "do_video_kyc" ||
              this.state.is_video == 1
            ) {
              Alert.alert(
                "Video Kyc",
                "Please do video kyc",
                [
                  {
                    text: "Ok",
                    onPress: () => console.log("ok"),
                  },
                ],
                {
                  cancelable: false,
                }
              );
            } else {
              Alert.alert(
                "Select image",
                "Please capture the image",
                [
                  {
                    text: "Ok",
                    onPress: () => console.log("ok"),
                  },
                ],
                {
                  cancelable: false,
                }
              );
            }
          } else if (
            (this.state.image_type == "do_video_kyc" ||
              this.state.is_video == 1) &&
            this.state.video.length <= 0
          ) {
            console.log("sdhfhsdufh " + this.state.video.length);
            Alert.alert(
              "Video Kyc",
              "Please do video kyc",
              [
                {
                  text: "Ok",
                  onPress: () => console.log("ok"),
                },
              ],
              {
                cancelable: false,
              }
            );
          } else {
            if (this.state.count == this.state.Data.length - 1) {
              console.log("Responce of  " + getValue);
              if (
                getValue == 1 ||
                this.state.image_type !== "do_offline_aadhar"
              ) {
                await this.DeleteData(this.state.que_id);
                await this.SelectNewData(this.state.que_id);

                this.props.navigation.navigate("pickupDetails");
              } else {
                alert("Passcode is incorrect");
                console.log("Responce of else " + getValue);
              }
            } else {
              if (
                getValue == 1 ||
                this.state.image_type !== "do_offline_aadhar"
              ) {
                await this.DeleteData(this.state.que_id);
                (Count = (await this.state.count) + 1),
                  (Id = (await this.state.id) + 1),
                  (questions = await this.state.Data[Count].question),
                  (Que_id = await this.state.Data[Count].que_id),
                  (Is_Image = await this.state.Data[Count].is_image),
                  this.setState({
                    count: Count,
                    id: Id,
                    Questions: questions,
                    que_id: Que_id,
                    is_image: Is_Image,
                  });
                await this.setState({
                  dataStorage: [],
                  comment: "",
                  commentsArray: [],
                  video: [],
                  Links: [],
                });
                await this.SelectNewData(this.state.que_id);
              }
            }
          }
        } else {
          if (this.state.count == this.state.Data.length - 1) {
            if (
              getValue == 1 ||
              this.state.image_type !== "do_offline_aadhar"
            ) {
              await this.DeleteData(this.state.que_id);
              await this.SelectNewData(this.state.que_id);

              this.props.navigation.navigate("pickupDetails");
            } else {
              alert("Passcode is incorrect");
            }
          } else {
            if (
              getValue == 1 ||
              this.state.image_type !== "do_offline_aadhar"
            ) {
              await this.DeleteData(this.state.que_id);
              (Count = (await this.state.count) + 1),
                (Id = (await this.state.id) + 1),
                (questions = await this.state.Data[Count].question),
                (Que_id = await this.state.Data[Count].que_id),
                (Is_Image = await this.state.Data[Count].is_image),
                this.setState({
                  count: Count,
                  id: Id,
                  Questions: questions,
                  que_id: Que_id,
                  is_image: Is_Image,
                });
              await this.setState({
                dataStorage: [],
                comment: "",
                commentsArray: [],
                video: [],
                Links: [],
              });
              await this.SelectNewData(this.state.que_id);
            }
          }
        }
      }
    }
    if (getValue == 1) {
      getValue = 0; // it is used for validation adhar
    }
  };

  SelectData = async (que_id) => {
    console.log("question id", this.state.pickupId, this.state.activity_id);
    await this.setState({ dataStorage: [], comment: "" });
    let query =
      "SELECT * FROM PickupDocumentPictures where pickups_document_id = ? AND activity_id = ?";
    await db.transaction(async (tx) => {
      await tx.executeSql(
        query,
        [que_id, this.state.activity_id],
        (tx, results) => {
          console.log("Query completed", results);
          var len = results.rows.length;
          var userData = [];
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            userData.push(row);
          }
          console.log(userData);
          if (userData.length == 1) {
            this.setState({ video: [] });
          }
          userData.map((i) => {
            this.state.dataStorage.push({
              uri: i.filepath,
            }),
              (this.state.comment = i.filename),
              (this.state.Pickups_Document_Id = i.pickups_document_id);
            this.state.video.push({
              uri: i.filepath,
            });
          });
          if (this.state.dataStorage != "") {
            let [URI] = this.state.dataStorage;
            console.log("uri", URI);
            if (URI.uri == null) {
              this.setState({
                dataStorage: "",
                comment: this.state.comment,
                Pickups_Document_Id: this.state.Pickups_Document_Id,
              });
            } else {
              this.setState({
                dataStorage: this.state.dataStorage,
                comment: userData[0].filename,
                Pickups_Document_Id: this.state.Pickups_Document_Id,
              });
            }
          }
        }
      );

      await tx.executeSql(
        "SELECT * FROM PickupDocument where pickups_id = ? AND activity_id= ?",
        [this.state.pickupId, this.state.activity_id],
        (tx, results) => {
          console.log("Query completed", results);
          var len = results.rows.length;
          var userData = [];
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            userData.push(row);
          }
          console.log("The all data is", JSON.stringify(userData));
          this.setState({
            Data: userData,
          });
        }
      );
      await tx.executeSql(
        "SELECT * FROM PickupDocument where que_id = ? AND activity_id= ?",
        [this.state.que_id, this.state.activity_id],
        (tx, results) => {
          console.log("Query completed", results);
          var len = results.rows.length;
          console.log(results.rows.is_image);
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            console.log(
              "local data is come from doc table " + JSON.stringify(row)
            );
            this.setState({
              is_image: row.is_image,
              is_video: row.is_video, // it is used for video kyc
              image_type: row.image_type, // it used for do adhar offline verification.
              videoStrings: row.video_questions,
            });
            LinkString = row.QuestionLinks;
          }
          if (LinkString != "") {
            this.setState({ Links: LinkString.split(",") });
            console.log("Questions links " + JSON.stringify(this.state.Links));
          }
        }
      );
      await tx.executeSql(
        "SELECT * FROM Comments where pickups_id = ? AND que_id= ?",
        [this.state.pickupId, que_id],
        (tx, results) => {
          console.log("Query Comments completed", results);
          var len = results.rows.length;
          var NewData = [];
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            NewData.push(row);
          }
          console.log("The all data is", JSON.stringify(NewData));
          this.setState({ commentsArray: NewData });
          console.log(this.state.commentsArray);
        }
      );
    });
  };

  SelectNewData = async (que_id) => {
    console.log("question id", que_id, this.state.activity_id);
    this.setState({ dataStorage: [], comment: "" });
    let querys =
      "SELECT * FROM PickupDocumentPictures where pickups_document_id = ? AND activity_id = ?";
    await db.transaction(async (tx) => {
      await tx.executeSql(
        querys,
        [que_id, this.state.activity_id],
        (tx, results) => {
          console.log("Query completed", results);
          var len = results.rows.length;
          var userData = [];
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            userData.push(row);
          }
          console.log("select data", userData);
          if (userData.length >= 1) {
            this.state.comment = userData[0].filename;
          } else {
            this.state.comment = "";
          }

          userData.map((i) => {
            this.state.dataStorage.push({
              uri: i.filepath,
            }),
              (this.state.Pickups_Document_Id = i.pickups_document_id),
              (this.state.is_image = i.is_image),
              this.state.video.push({
                uri: i.filepath, // store video path here
              });
          });
          if (this.state.dataStorage != "") {
            let [URI] = this.state.dataStorage;
            if (URI.uri == null) {
              this.setState({
                dataStorage: "",
                comment: this.state.comment,
                Pickups_Document_Id: this.state.Pickups_Document_Id,
              });
            } else {
              this.setState({
                dataStorage: this.state.dataStorage,
                comment: this.state.comment,
                Pickups_Document_Id: this.state.Pickups_Document_Id,
              });
            }
          }
        }
      );
    });

    await db.transaction(async (tx) => {
      await tx.executeSql(
        "SELECT * FROM PickupDocument where pickups_id = ? AND activity_id=?",
        [this.state.pickupId, this.state.activity_id],
        (tx, results) => {
          console.log("Query completed", results);
          var len = results.rows.length;
          var userData = [];
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            userData.push(row);
          }
          this.setState({ Data: userData });
        }
      );
      await tx.executeSql(
        "SELECT * FROM PickupDocument where que_id = ? AND activity_id=?",
        [this.state.que_id, this.state.activity_id],
        (tx, results) => {
          console.log("Query completed", results);
          var len = results.rows.length;
          console.log(results.rows.is_image);
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            console.log(
              "local data is come from doc table " + JSON.stringify(row)
            );
            this.setState({
              is_image: row.is_image,
              is_video: row.is_video, // it is used for video kyc
              image_type: row.image_type, // it is used for do offline adhar verification
              videoStrings: row.video_questions, // get the question from storage
            });

            LinkString = row.QuestionLinks;
          }

          if (LinkString != "") {
            this.setState({ Links: LinkString.split(",") }, () => {
              console.log(
                "Questions links " + JSON.stringify(this.state.Links)
              );
            });
          } else {
            console.log("Questions links ", JLinkString);
          }
        }
      );
      await tx.executeSql(
        "SELECT * FROM Comments where pickups_id = ? AND que_id= ?",
        [this.state.pickupId, que_id],
        (tx, results) => {
          console.log("Query Comments completed", results);
          var len = results.rows.length;
          var NewData = [];
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            NewData.push(row);
          }
          console.log("The all data is", JSON.stringify(NewData));
          this.setState({ commentsArray: NewData });
          console.log(this.state.commentsArray);
        }
      );
    });
  };

  DeleteData = async (id) => {
    var activity_id = this.state.activity_id;
    console.log("Delete called ", id, activity_id);

    await db.transaction(async function (tx) {
      let query =
        "DELETE FROM PickupDocumentPictures WHERE pickups_document_id = ? AND activity_id = ?";
      tx.executeSql(
        query,
        [id, activity_id],
        function (tx, res) {
          console.log("removeId: " + res.pickups_document_id);
          console.log("rowsAffected: " + res.rowsAffected);
        },
        function (tx, error) {
          console.log("DELETE error: " + error.message);
        }
      );
    });

    await this.InsertData(id);
  };

  InsertData = async (que_id) => {
    var activity_id = this.state.activity_id;
    console.log("Doc id", this.state.video);
    console.log("Doc id", que_id);
    let { otherComment, comment, dataStorage, pickupId } = this.state;
    let { latitude: lat, longitude: long } = this.state.region;
    if (this.state.video.length > 0 && this.state.video[0].uri != null) {
      let uri = { uri: this.state.video[0].uri };
      console.log("the uri is  " + JSON.stringify(uri));
      if (this.state.video[0] != "") {
        await this.state.dataStorage.push(uri);
        console.log(
          "Data insert in datastorage " + JSON.stringify(dataStorage)
        );
      }
    }

    console.log("Activity id dkkfdfj " + this.state.activity_id);
    await db.transaction(
      async (tx) => {
        let query =
          "INSERT INTO PickupDocumentPictures (pickups_document_id,filename,filepath,latitude,longitude,is_upload,created_at,updated_at,pickups_id,activity_id) VALUES( ? , ? , ? ,  ? , ? , ? , ? , ? , ? , ?)";
        let Data = [];
        for (i = 0; i < dataStorage.length; i++) {
          await Data.push(dataStorage[i].uri);
        }
        Data = [...new Set(Data)];
        console.log("data", Data);

        let INSERT_IMAGE = [];
        if (Data.length == 0) {
          if (comment == "") {
            // console.log("no insert")
          } else {
            if (otherComment == "") {
              INSERT_IMAGE.push({
                filepath: null,
                pickups_document_id: que_id,
                filename: comment,
                pickups_id: pickupId,
                latitude: lat,
                longitude: long,
                activity_id: activity_id,
              });
            } else {
              INSERT_IMAGE.push({
                filepath: null,
                pickups_document_id: que_id,
                filename: otherComment,
                pickups_id: pickupId,
                latitude: lat,
                longitude: long,
                activity_id: activity_id,
              });
            }

            console.log("insert data", INSERT_IMAGE);

            await INSERT_IMAGE.map((x, y) => {
              tx.executeSql(
                query,
                [
                  x.pickups_document_id,
                  x.filename,
                  x.filepath,
                  x.latitude,
                  x.longitude,
                  x.is_upload,
                  x.created_at,
                  x.updated_at,
                  x.pickups_id,
                  x.activity_id,
                ],
                (tx, res) => {
                  console.log(
                    "insertId: " + res.pickups_document_id + " -- probably 1"
                  );
                  console.log(
                    "rowsAffected: " + res.rowsAffected + " -- should be 1"
                  );
                },
                (err) => {
                  console.log("in pickps table", err);
                }
              );
            });
            this.Update(que_id);
          }
        } else {
          for (i = 0; i < Data.length; i++) {
            if (i == 0) {
              if (otherComment == "") {
                INSERT_IMAGE.push({
                  filepath: Data[i],
                  pickups_document_id: que_id,
                  filename: comment,
                  pickups_id: pickupId,
                  latitude: lat,
                  longitude: long,
                  activity_id: activity_id,
                });
              } else {
                INSERT_IMAGE.push({
                  filepath: Data[i],
                  pickups_document_id: que_id,
                  filename: otherComment,
                  pickups_id: pickupId,
                  latitude: lat,
                  longitude: long,
                });
              }
            } else {
              INSERT_IMAGE.push({
                filepath: Data[i],
                pickups_document_id: que_id,
                filename: comment,
                pickups_id: pickupId,
                latitude: lat,
                longitude: long,
                activity_id: activity_id,
              });
            }
          }
          console.log("insert data", INSERT_IMAGE);
          var newArray = [];
          await INSERT_IMAGE.forEach((obj) => {
            if (!newArray.some((o) => o.filepath === obj.filename)) {
              newArray.push({ ...obj });
            }
          });

          await newArray.map((x, y) => {
            tx.executeSql(
              query,
              [
                x.pickups_document_id,
                x.filename,
                x.filepath,
                x.latitude,
                x.longitude,
                x.is_upload,
                x.created_at,
                x.updated_at,
                x.pickups_id,
                x.activity_id,
              ],
              (tx, res) => {
                console.log(
                  "insertId: " + res.pickups_document_id + " -- probably 1"
                );
                console.log(
                  "rowsAffected: " + res.rowsAffected + " -- should be 1"
                );
              },
              (err) => {
                console.log("in pickps table", err);
              }
            );
          });
          this.Update(que_id);
        }
      },
      function (error) {
        console.log("transaction error: " + error.message);
      },
      function () {
        console.log("transaction ok");
      }
    );

    await this.setState({ dataStorage: [], comment: "" });
  };

  Update = (que_id) => {
    let { pickupId, status, complete, activity_id } = this.state;
    console.log(activity_id, complete, que_id);
    let query2 =
      "UPDATE PickupDocument SET complete = ? WHERE que_id = ? AND activity_id = ?";

    db.transaction(async (tx) => {
      await tx.executeSql(
        query2,
        [complete, que_id, activity_id],
        function (tx, res) {
          console.log("update row " + res.insertId);
          console.log("updated rowsAffected: " + res.rowsAffected);
        },
        function (tx, error) {
          console.log("UPDATE error: " + error.message);
        }
      );
    });
  };

  selectDataFromLocal = async () => {
    await this.setState({
      Questions: this.props.navigation.state.params.name,
      pickupPerson: this.props.navigation.state.params.pickup_person,
      pickupId: this.props.navigation.state.params.pickup_id,
      que_id: this.props.navigation.state.params.id,
      count: this.props.navigation.state.params.Index,
      id: this.props.navigation.state.params.Sequence,
      activity_id: this.props.navigation.state.params.activity_id,
      activity_name: this.props.navigation.state.params.activity_name,
    });
    db.transaction(async (tx) => {
      await tx.executeSql(
        "SELECT * FROM Location where pickups_id = ? AND activity_id=?",
        [this.state.pickupId, this.state.activity_id],
        (tx, results) => {
          console.log("Location Query completed", results);
          var len = results.rows.length;
          console.log("lenght", len);
          if (len === 0) {
            this.SelectLocation();
          } else {
            console.log("Don't Call");
          }
        }
      );
    });

    await this.SelectData(this.state.que_id);
  };

  SelectLocation = () => {
    console.log("Location fuction call", this.state.activity_name);

    if (this.state.activity_name == "Document Collection") {
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
      if (this.state.activity_name == "CPVR+DC") {
        this.Home();
      } else if (this.state.activity_name == "CPVO+DC") {
        this.Office();
      } else if (this.state.activity_name == "CPVR") {
        this.Home();
      } else if (this.state.activity_name == "CPVO") {
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
    console.log("Home fuction call", this.state.activity_name);

    let Home = "Home";
    let { pickupId, activity_id } = this.state;

    db.transaction(async (tx) => {
      let query =
        "INSERT INTO Location (pickups_id,activity_id,activity_Location) VALUES( ? , ? , ? )";
      tx.executeSql(
        query,
        [pickupId, activity_id, Home],
        (tx, res) => {
          console.log(
            "insertId: " + res.pickups_document_id + " -- probably 1"
          );
          console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
        },
        (err) => {
          console.log("in pickps table", err);
        }
      );
    });
    console.log(Home, pickupId, activity_id);
  };

  Office = () => {
    console.log("office fuction call", this.state.activity_name);

    let Office = "Office";
    let { pickupId, activity_id } = this.state;

    db.transaction(async (tx) => {
      let query =
        "INSERT INTO Location (pickups_id,activity_id,activity_Location) VALUES( ? , ? , ? )";
      tx.executeSql(
        query,
        [pickupId, activity_id, Office],
        (tx, res) => {
          console.log(
            "insertId: " + res.pickups_document_id + " -- probably 1"
          );
          console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
        },
        (err) => {
          console.log("in pickps table", err);
        }
      );
    });
    console.log(Office, pickupId, activity_id);
  };

  Custom_Camera = () => {
    if (this.state.agentCompany != "") {
      optionss = {
        maxHeight: 1000,
        quality: 1, // 0 to 1, photos only
        storageOptions: {
          skipBackup: false,
        },
      };
    } else {
      optionss = {
        maxHeight: 1000,
        quality: 1, // 0 to 1, photos only
        storageOptions: {
          skipBackup: false,
        },
      };
    }

    if (this.state.agentType == "c") {
      ImagePicker.showImagePicker(optionss, (response) => {
        console.log("Response = ", response);
        if (response.didCancel) {
          console.log("User cancelled photo picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else if (response.customButton) {
          console.log("User tapped custom button: ", response.customButton);
        } else {
          let dataStorage = { uri: response.uri };
          this.setState({ image: dataStorage });
          this.resize();
        }
      });
    } else {
      ImagePicker.launchCamera(optionss, (response) => {
        console.log("Response = ", response);
        if (response.didCancel) {
          console.log("User cancelled photo picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else if (response.customButton) {
          console.log("User tapped custom button: ", response.customButton);
        } else {
          let dataStorage = { uri: response.uri };
          this.setState({ image: dataStorage });
          this.resize();
        }
      });
    }
  };

  resize = () => {
    console.warn("RESIZE CALL", this.state.image.uri);
    CompressImage.createCompressedImage(this.state.image.uri, "Compress/Images")
      .then(({ uri }) => {
        let dataStorage = [{ uri: uri }, ...this.state.dataStorage];
        this.setState({ dataStorage: dataStorage });
        console.warn("new path",this.state.dataStorage)
      })
      .catch((err) => {
        Alert.alert(
          "Oops..",
          "Please allow the storage permission.",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed!"),
            },
            {
              text: "OK",
              onPress: () => this.selectPhotoTapped(),
            },
          ]
        );
        console.warn(err);
      });
  };

  selectPhotoTapped = async () => {
    await this.CurrentLocation();
    ImageCropper.selectImage(options, (response) => {
      if (
        response.originalPath ==
          "/storage/emulated/0/Android/data/com.docboyzpro/cache/pickImageResult.jpeg" ||
        response.originalPath ==
          "/storage/sdcard0/Android/data/com.docboyzpro/cache/pickImageResult.jpeg"
      ) {
        let dataStorage = { uri: response.uri };
        this.setState({ image: dataStorage , });
        this.resize();
      } else {
        Alert.alert(
          "Sorry..",
          "Please capture image from Camera,Dont use Gallary.",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed!"),
            },
            {
              text: "OK",
              onPress: () => this.selectPhotoTapped(),
            },
          ]
        );
      }
    });
  };

  // selectPhotoTapped = async () => {

  // await this.CurrentLocation();

  // var nach = await this.state.Questions.includes("NACH");

  // // if(nach==true){
  // //   Alert.alert(
  // //         'NACH Document',
  // //         'Are you looking for nach',
  // //         [{
  // //           text: 'No',
  // //           onPress: () => console.log("cancel")
  // //         },
  // //         {
  // //           text: 'Yes',
  // //           onPress: () => this.Image_Croper()
  // //         },
  // //         ]
  // //       )
  // // }else{
  // //     Alert.alert(
  // //     'Camera',
  // //     'Capture Image with',
  // //     [{
  // //       text: 'Custom Camera',
  // //       onPress: () => this.Custom_Camera()
  // //     },
  // //     {
  // //       text: 'Image Croper',
  // //       onPress: () => this.Image_Croper()
  // //     },
  // //     ]
  // //   )
  // //  }
  // }

  video = () => {
    if (
      typeof this.props.navigation.state !== "undefined" &&
      typeof this.props.navigation.state.params !== "undefined"
    ) {
      let video = this.props.navigation.state.params.videodata;
      this.setState(
        {
          que_id: this.props.navigation.state.params.que_id,
          count: this.props.navigation.state.params.count,
          id: this.props.navigation.state.params.sequence,
          Questions: this.props.navigation.state.params.ques,

          pickupPerson: this.props.navigation.state.params.person,
          pickupId: this.props.navigation.state.params.pickupid,
          activity_id: this.props.navigation.state.params.activity_id,
          videoNumber: 0,
        },
        () => {
          console.log("The activity id is " + this.state.activity_id);
        }
      );

      console.log("Video url" + video);
      if (video == undefined) {
        console.log("null");
      } else {
        let dataStorage = { uri: video };
        let videos = [dataStorage, ...this.state.video];
        this.setState({ video: videos });
        console.log(this.state.video);
      }
    } else {
      console.log("Add new name.");
    }
  };

  // ############### Comment api call ################################

  // *************************** Adhar calling *****************************************
  aadhaarVerification = () => {
    return this.props.navigation.navigate("adhar", {
      question_id: this.state.que_id,
      count: this.state.count,
      sequence: this.state.id, // sequence of question
      Questions: this.state.Questions,
      person: this.state.pickupPerson,
      pickupid: this.state.pickupId,
      activity_id: this.state.activity_id,
      image_type: this.state.image_type,
    });
  };

  // ############### Comment api call finish ################################

  _handleVideoUpload = () => {
    console.log("video string is " + this.state.videoStrings);
    if (this.state.videoStrings != null) {
      this.state.video_questions = this.state.videoStrings.split(",");
    }

    console.log(
      "array of questions " + JSON.stringify(this.state.video_questions)
    );
    return this.props.navigation.navigate("video", {
      question_id: this.state.que_id,
      count: this.state.count,
      sequence: this.state.id, // sequence of question
      Questions: this.state.Questions,
      person: this.state.pickupPerson,
      pickupid: this.state.pickupId,
      activity_id: this.state.activity_id,
      questionsArray: this.state.video_questions,
    });
  };

  deleteItem = () => {
    this.setState({ dataStorage: "", video: "" });
  };

  goBack = () => {
    this.props.navigation.navigate("pickupDetails", (this.state.que_id = null));
  };

  Link = () => {
    Snackbar.show({
      text: "Coming Soon",
      duration: Snackbar.LENGTH_LONG,
    });
  };

  Dropdowns = (com) => {
    console.warn("fiun", com);
    com == "Others"
      ? this.setState({ OtherComment: com, coment1: com, comment: "" })
      : this.setState({ comment: com });
  };

  render = () => {
    console.log(this.state.dataStorage);
    let { otherComment, video, dataStorage } = this.state;
    console.log(dataStorage);
    var newArray = [];
    if (dataStorage != "") {
      dataStorage.forEach((obj) => {
        if (!newArray.some((o) => o.uri === obj.uri)) {
          newArray.push({
            ...obj,
          });
        }
      });
    }

    if (video.length > 1 && dataStorage != "") {
      var videoArray = [];
      dataStorage.forEach((obj) => {
        if (!videoArray.some((o) => o.uri === obj.uri)) {
          videoArray.push({
            ...obj,
          });
        }
      });
    } else {
      var videoArray = [];
      videoArray = this.state.video;
    }

    return (
      <ScrollView
        style={{ flex: 1, flexDirection: "column", backgroundColor: "white" }}
      >
        <Header
          leftComponent={{
            icon: "arrow-back",
            color: "#fff",
            onPress: () => {
              this.props.navigation.navigate(
                "pickupDetails",
                (this.state.que_id = null)
              );
            },
          }}
          centerComponent={{
            text: this.state.pickupPerson,
            style: { color: "#fff", fontSize: 20, fontWeight: "bold" },
          }}
          outerContainerStyles={{
            backgroundColor: "#E41313",
            height: 55,
            marginBottom: -5,
          }}
          innerContainerStyles={{ justifyContent: "space-between" }}
        />
        <View style={{ flex: 1, backgroundColor: "#1B547C" }}>
          <Text
            style={{
              color: "white",
              fontSize: 15,
              margin: 10,
              fontWeight: "500",
            }}
          >
            Que : {this.state.id} - {this.state.Questions}
          </Text>
        </View>
        {this.state.is_video == 1 || this.state.image_type == "do_video_kyc" ? (
          <View style={styles.container}>
            {this.state.video == "" ? (
              <View
                style={{
                  width: 350,
                  height: 300,
                  flexDirection: "column",
                  justifyContent: "center",
                  marginTop: 5,
                  alignSelf: "center",
                  borderWidth: 0,
                  borderRadius: 5,
                }}
              >
                <TouchableOpacity onPress={this._handleVideoUpload}>
                  <Image
                    style={{
                      width: 75,
                      height: 75,
                      marginTop: 10,
                      alignSelf: "center",
                    }}
                    source={require("./assets/circle-add.png")}
                  />
                  <Text
                    style={{ color: "red", alignSelf: "center", marginTop: 10 }}
                  >
                    Click here and Capture The Video
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <View
                  style={{
                    width: 350,
                    height: 300,
                    flexDirection: "column",
                    flex: 1,
                    justifyContent: "center",
                    alignSelf: "center",
                    marginTop: 5,
                  }}
                >
                  <SwiperFlatList
                    ref="swiper"
                    autoplayLoop
                    autoplayDelay={2}
                    keyExtractor={(item, index) => index.toString()}
                    showPagination
                    paginationDefaultColor="lavender"
                    paginationActiveColor="red"
                    data={videoArray} // set array which removed duplicates item
                    renderItem={({ item: index }) => {
                      return (
                        <View
                          style={[
                            styles.avatar,
                            styles.avatarContainer,
                            { marginBottom: 0 },
                          ]}
                        >
                          <Lightbox
                            activeProps={
                              (style = {
                                height: "70%",
                                width: "100%",
                              })
                            }
                          >
                            {
                              <VideoPlayer
                                video={{ uri: index.uri }}
                                videoWidth={200}
                                videoHeight={300}
                                duration={90}
                                ref={(r) => (this.player = r)}
                              />
                            }
                          </Lightbox>
                        </View>
                      );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginTop: 20,
                    justifyContent: "space-around",
                  }}
                >
                  <TouchableOpacity
                    style={[
                      Styles.common.button,
                      {
                        width: 100,
                        height: 30,
                        backgroundColor: "white",
                        borderColor: "black",
                        borderRadius: 5,
                      },
                    ]}
                    onPress={this.deleteItem}
                  >
                    <Text
                      style={[
                        Styles.common.buttonText,
                        { color: "black", fontSize: 16 },
                      ]}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.container}>
            {this.state.image_type == "do_offline_aadhar" ? (
              <View
                style={{
                  width: 350,
                  height: 250,
                  flexDirection: "column",
                  justifyContent: "center",
                  marginTop: 5,
                  alignSelf: "center",
                  borderWidth: 0,
                  borderRadius: 5,
                }}
              >
                {this.state.ZipImage == "" ? (
                  <TouchableOpacity onPress={() => this.aadhaarVerification()}>
                    <Image
                      style={{
                        width: 75,
                        height: 75,
                        marginTop: 10,
                        alignSelf: "center",
                      }}
                      source={require("./assets/circle-add.png")}
                    />
                    <Text
                      style={{
                        color: "red",
                        alignSelf: "center",
                        marginTop: 10,
                      }}
                    >
                      please do offline adddhaar
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity>
                    <Image
                      style={{
                        width: 80,
                        height: 100,
                        marginTop: 10,
                        alignSelf: "center",
                      }}
                      source={require("./assets/zip_images.jpg")}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ) : this.state.is_image == 0 ? (
              <View
                style={{
                  width: 350,
                  height: 250,
                  flexDirection: "column",
                  justifyContent: "center",
                  marginTop: 5,
                  alignSelf: "center",
                  borderWidth: 0,
                  borderRadius: 5,
                }}
              >
                <TouchableOpacity>
                  <Text
                    style={{ color: "red", alignSelf: "center", marginTop: 25 }}
                  >
                    This Question Image Is Not Required
                  </Text>
                </TouchableOpacity>
              </View>
            ) : this.state.dataStorage == "" ? (
              <View
                style={{
                  width: 350,
                  height: 250,
                  flexDirection: "column",
                  justifyContent: "center",
                  marginTop: 5,
                  alignSelf: "center",
                  borderWidth: 0,
                  borderRadius: 5,
                }}
              >
                <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                  <Image
                    style={{
                      width: 75,
                      height: 75,
                      marginTop: 10,
                      alignSelf: "center",
                    }}
                    source={require("./assets/circle-add.png")}
                  />
                  <Text
                    style={{ color: "red", alignSelf: "center", marginTop: 10 }}
                  >
                    Capture Image with Location,{"\n"}go to Camera settings and
                    {"\n"}Enable geographic location
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <View
                  style={{
                    width: 350,
                    height: 250,
                    flexDirection: "column",
                    flex: 1,
                    justifyContent: "center",
                    alignSelf: "center",
                    marginTop: 5,
                  }}
                >
                  <SwiperFlatList
                    ref="swiper"
                    ItemSeparatorComponent={this.renderSeparator}
                    autoplayLoop
                    autoplayDelay={2}
                    keyExtractor={(item, index) => index.toString()}
                    showPagination
                    paginationDefaultColor="lavender"
                    paginationActiveColor="red"
                    data={newArray}
                    renderItem={({ item: index }) => {
                      return (
                        <View
                          style={[
                            styles.avatar,
                            styles.avatarContainer,
                            { marginBottom: 0 },
                          ]}
                        >
                          <Lightbox
                            activeProps={
                              (style = {
                                height: "70%",
                                width: "100%",
                              })
                            }
                          >
                            {
                              <Image
                                style={styles.avatar}
                                source={{ uri: index.uri }}
                              />
                            }
                          </Lightbox>
                        </View>
                      );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginTop: 20,
                    justifyContent: "space-around",
                  }}
                >
                  {this.state.image_type === "is_aadhar" &&
                  this.state.dataStorage.length > 2 ? null : (
                    <TouchableOpacity
                      style={[
                        Styles.common.button,
                        {
                          width: 100,
                          height: 30,
                          backgroundColor: "white",
                          borderColor: "black",
                          borderRadius: 5,
                        },
                      ]}
                      onPress={this.selectPhotoTapped.bind(this)}
                    >
                      <Text
                        style={[
                          Styles.common.buttonText,
                          { color: "black", fontSize: 16 },
                        ]}
                      >
                        Add Image
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[
                      Styles.common.button,
                      {
                        width: 100,
                        height: 30,
                        backgroundColor: "white",
                        borderColor: "black",
                        borderRadius: 5,
                      },
                    ]}
                    onPress={this.deleteItem}
                  >
                    <Text
                      style={[
                        Styles.common.buttonText,
                        { color: "black", fontSize: 16 },
                      ]}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
        <View
          style={
            this.state.Links.length > 0
              ? { alignSelf: "center", marginTop: 20, height: 100 }
              : { alignSelf: "center", marginTop: 20, height: 50 }
          }
        >
          <FlatList
            data={this.state.Links}
            keyExtractor={(item) => {
              item;
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => Linking.openURL(item)}
                underlayColor="#2980b9"
              >
                <Text
                  style={[
                    styles.underline,
                    {
                      color: "#2980b9",
                      fontSize: 16,
                      marginTop: 5,
                      fontSize: 16,
                      textAlign: "center",
                    },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        {this.state.commentsArray.length == 0 ? (
          <View style={{ backgroundColor: "#FFF" }}>
            <TextField
              label="Comment"
              tintColor={"black"}
              value={this.state.comment}
              onChangeText={(comment) => this.setState({ comment })}
              containerStyle={{
                marginBottom: -15,
                marginLeft: 30,
                marginRight: 30,
              }}
              multiline={true}
            />
          </View>
        ) : this.state.OtherComment == "Others" ? (
          <View style={{ backgroundColor: "#FFF" }}>
            <Dropdown
              label="Select comment"
              data={this.state.commentsArray}
              value={
                this.state.coment1 == "Others"
                  ? this.state.coment1
                  : this.state.comment
              }
              onChangeText={(comment) => this.Dropdowns(comment)}
              containerStyle={{
                marginBottom: 15,
                marginLeft: 30,
                marginRight: 30,
              }}
            />
            <TextField
              label="Comment"
              tintColor={"black"}
              value={this.state.comment}
              onChangeText={(comment) => this.setState({ comment })}
              containerStyle={{
                marginBottom: -15,
                marginLeft: 30,
                marginRight: 30,
              }}
              multiline={true}
            />
          </View>
        ) : (
          <View style={{ backgroundColor: "#FFF" }}>
            <Dropdown
              label="Select comment"
              data={this.state.commentsArray}
              value={this.state.comment}
              onChangeText={(comment) => this.Dropdowns(comment)}
              containerStyle={{
                marginBottom: 10,
                marginLeft: 30,
                marginRight: 30,
              }}
            />
          </View>
        )}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 50,
          }}
        >
          <TouchableHighlight
            style={[
              Styles.common.button,
              { width: 130, backgroundColor: "red" },
            ]}
            onPress={this._TogglePrev}
            underlayColor="red"
          >
            <Text style={Styles.common.buttonText}>Back</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={[Styles.common.button, { width: 130 }]}
            onPress={this._ToggleNext}
            underlayColor="#1B547C"
          >
            <Text style={Styles.common.buttonText}>Next</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-evenly",
    backgroundColor: "white",
  },
  avatarContainer: {
    borderColor: "#9B9B9B",
    borderWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  avatar: {
    width: 350,
    height: 250,
    marginBottom: 0,
    margin: -0,
    alignItems: "center",
    resizeMode: "contain",
  },
  underline: {
    textDecorationLine: "underline",
  },
});

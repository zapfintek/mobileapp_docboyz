import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,Dimensions,PixelRatio
} from "react-native";
import { Header } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import Snackbar from "react-native-snackbar";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
var tokenResult = "",
count = 1;
import styles from './styles';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}


export default class OTP extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor() {
    super();
    this.state = {
      isDesabled: true,
      seconds: 90,
      number: "",
      email: "",
      Otp: "",
      agentId: "",
      inputOtp: "",
      mobileText: "",
      token: "",
      modalVisible: false,
    };
  }

  dataFetch = () => {
    console.warn('called1',)
    var otpNum;
    if (data.OTP !== "") {
      otpNum = data.OTP.toString();
    }
    this.setState({ Otp: otpNum });
    this.setState({
      number: num,
      agentId: data.agentID,
      mobileText: num,
      email: Email,
    });
  };

  // async componentWillMount() {
  //   this.dataFetch();
  //   var res = "";
  //   await AsyncStorage.getItem("token", (err, result) => {
  //     this.setState({ token: result });
  //   });

  //   res = this.state.token;
  //   if (res != null) tokenResult = res.substring(1, res.length - 1);
  //   this.setState({ token: tokenResult });
  // }

  componentDidMount() {
    this.dataFetch();

    var timer = setInterval(() => {
      this.setState({ seconds: this.state.seconds - 1 });
      if (this.state.seconds === 0) {
        this.setState({ seconds: 90, isDesabled: false });
      }
    }, 1000);
  }

  OtpReset = (resData) => {
    // otp reset response is getting
    var otpNum;
    otpNum = resData.OTP.toString();
    this.setState({ Otp: otpNum, agentId: resData.agentID, isDesabled: true });
    console.warn("Resend generate" + otpNum);
  };

  OtpReset = (resData) => {
    // otp reset response is getting
    var otpNum;
    otpNum = resData.OTP.toString();
    this.setState({ Otp: otpNum, agentId: resData.agentID, isDesabled: true });
    console.warn("Resend generate" + otpNum);
  };

 

  resendCode = async () => {
    if (this.state.email == "") {
      this.apiPhone();
    } else {
      this.apiEmail();
    }

    this.setState({ seconds: 90 });
  };

  apiEmail = async () => {
    this.setState({ loading: true });

    await fetch("https://docboyz.in/docboyzmt/api/multitenantOtp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_id: this.state.email,
      }),
    })
      .then((response) => response.json())
      .then((resData) => {
        console.warn(resData);
        this.setState({ loading: false });
        this.OtpReset(resData); // reset otp call for reset response
        Snackbar.show({
          title: "OTP reset successfully",
          duration: Snackbar.LENGTH_LONG,
        });
      })
      .catch((error) => {
        console.warn("catch error found", error.message);
        this.setState({ modalVisible: false });
        Snackbar.show({
          title: "Something wrong please try again",
          duration: Snackbar.LENGTH_LONG,
        });
        this.props.navigation.replace("NewLogin");
      });
  };

  apiPhone = async () => {
    this.setState({ loading: true });

    await fetch("https://docboyz.in/docboyzmt/api/multitenantOtp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile_number: this.state.mobileText,
      }),
    })
      .then((response) => response.json())
      .then((resData) => {
        console.warn(resData);
        this.setState({ loading: false });
        this.OtpReset(resData);
        Snackbar.show({
          title: "OTP reset successfully",
          duration: Snackbar.LENGTH_LONG,
        });
      })
      .catch((error) => {
        console.warn("catch error found", error.message);
        this.setState({ modalVisible: false });
        Snackbar.show({
          title: "Something wrong please try again",
          duration: Snackbar.LENGTH_LONG,
        });
        this.props.navigation.replace("NewLogin");
      });
  };

  goBack = () => {
    this.setState({
      number: "",
      email: "",
      mobileText: "",
      inputOtp: "",
      agentId: "",
    });
    // this.props.navigation.replace("NewLogin");
  };
  confirmApi = async () => {
    console.warn("call confirm .............");
    this.setState({ loading: true, modalVisible: true });

    count = 0;
    await fetch("https://docboyz.in/docboyzmt/api/confirmOtp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile_number: this.state.mobileText,
        fcm_token: this.state.token,
        email_id: this.state.email,
        confirm_otp: this.state.inputOtp,
      }),
    })
      .then((response) => response.json())
      .then((resData) => {
        console.warn("The data is" + JSON.stringify(resData));

        if (resData.error == 111) {
          alert("Your account is already logged in on another device");
          this.setState({ modalVisible: false });
          count = 1;
          this.props.navigation.replace("NewLogin");
        } else {
          console.warn("Confirmation data", resData.type);
          AsyncStorage.setItem("AgentType", resData.type);
          // this.setState({ loading: false,modalVisible:false })
          this.callNextScreen(resData);
        }
      })
      .catch((error) => {
        console.warn("catch error found", error.message);
        count = 1;
        this.setState({ modalVisible: false });
        Snackbar.show({
          title: "Something wrong please try again",
          duration: Snackbar.LENGTH_LONG,
        });
        this.props.navigation.replace("NewLogin"); // if wrong then go previous
      });
  };

  callNextScreen = async (resData) => {
    console.warn("is existing ", resData);
    if (resData.isExisting == "true") {
      AsyncStorage.setItem("is_Existing", resData.isExisting);
      Existing = await AsyncStorage.getItem("is_Existing");
      AsyncStorage.setItem("AgentType", resData.type);
      console.warn("Existing", Existing);
      AsyncStorage.setItem("AGENT_ID", JSON.stringify(this.state.agentId));
      AsyncStorage.setItem("FCnAME", JSON.stringify(resData.Name));
      this.setState({ loading: false, modalVisible: false });
      Snackbar.show({
        title: "Login successfully",
        duration: Snackbar.LENGTH_LONG,
      });
      count = 1;
      this.props.navigation.replace("MyDrawer"); // into the dashboard screen
    } else {
      count = 1;
      Snackbar.show({
        title: "please fill all the data",
        duration: Snackbar.LENGTH_LONG,
      });
      AsyncStorage.setItem("AGENT_ID", JSON.stringify(this.state.agentId));
      this.setState({ loading: false, modalVisible: false });
      console.warn("Data for login" + JSON.stringify(resData));
      this.props.navigation.replace("PersonalInfo", {
        Data: resData,
      });
    }
  };

  render() {
    // console.warn(this.state.inputOtp.length,count)
    if (this.state.inputOtp.length === 6 && count == 1) {
      if (this.state.inputOtp === this.state.Otp) {
        console.warn("call confirm ready to go .............");
        this.confirmApi();
      } else {
        Snackbar.show({
          text: "Incorrect Otp",
          duration: Snackbar.LENGTH_LONG,
        });
        this.setState({ inputOtp: "" });
      }
    }

    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>

      <View style={styles.container}>
         <Header
         backgroundColor='red'
          leftComponent={{
            icon: "arrow-back",
            color: "#fff",
            onPress: () => {
              this.props.navigation.replace('Login');            },
          }}
          centerComponent={{
            text: "Login / SignUp",
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
        <View style={styles.first}>
          <Text style={{ fontSize: 20, marginTop: 100, color: "black" }}>
            Enter verification code
          </Text>
          <Text style={{ fontSize: 14, marginTop: 5 }}>
            We have sent you a 6 digit verification code on
          </Text>
          {this.state.email ? (
            <Text style={{ fontSize: 18, color: "black", marginTop: 5 }}>
              {this.state.email}
            </Text>
          ) : (
            <Text style={{ fontSize: 18, color: "black", marginTop: 5 }}>
              +91 {this.state.number}
            </Text>
          )}
        </View>
        <View style={styles.second}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter OTP"
            keyboardType={"number-pad"}
            maxLength={6}
            value={this.state.inputOtp}
            onChangeText={(text) => this.setState({ inputOtp: text })}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ textAlign: "center", fontSize: 16, color: "red" }}>
            {this.state.seconds}
          </Text>
          <TouchableOpacity
            disabled={this.state.isDesabled}
            style={this.state.isDesabled ? { opacity: 1 } : styles.resendCode}
            onPress={() => this.resendCode()}
          >
            <Text
              style={{
                textAlign: "center",
                elevation: 5,
                fontSize: 16,
                color: "white",
              }}
            >
              Resend code
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={
            this.state.modalVisible
              ? { height: 48, backgroundColor: "black", opacity: 0.7 }
              : null
          }
        >
          <Modal transparent={true} visible={this.state.modalVisible}>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "center",
                opacity: 0.7,
                backgroundColor: "black",
              }}
            >
              <View
                style={{
                  height: 100,
                  width: 300,
                  marginBottom: 200,
                  borderRadius: 10,
                  backgroundColor: "white",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingLeft: 30,
                }}
              >
          <ActivityIndicator size="large" color="black" />
                <Text style={{ color: "black", fontSize: 20, marginLeft: 20 }}>
                  Please wait
                </Text>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      </KeyboardAwareScrollView>
    );
  }
}


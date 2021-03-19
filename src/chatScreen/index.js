import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
  Modal,
  FlatList,
  BackHandler,
  Linking,
  TouchableHighlight,
  CheckBox,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Appbar, Card, Searchbar, Switch} from 'react-native-paper';
import Lightbox from 'react-native-lightbox'; // it is used for image showing full screen with zooming
import DatePicker from 'react-native-datepicker'; // pick the reschedule date
import {Icon} from 'react-native-elements';
// import CompressImage from "react-native-compress-image"; // Compress the image here
import ImagePicker from 'react-native-image-picker'; // image picker
import SwiperFlatList from 'react-native-swiper-flatlist'; // swiper flatlist it used for swiping the
import SimpleAccordion from 'react-native-simple-accordian'; // for activity drill to the questions
import Snackbar from 'react-native-snackbar';
import NetInfo from '@react-native-community/netinfo';

import moment from 'moment';
var AgenDataArray = [],
  AllAgentList = [];
var c = 1,
  customerMobile = '';
var typeCheck;

export default class ChatScreen extends Component {
  static navigationOptions = {
    drawerLockMode: 'locked-closed',
  };

  constructor() {
    super();
    this.state = {
      isToggle: false, // toggle swith button
      isLoad: false, // agent list loader
      sendDataModal: false, // sending the reason with data
      imgArray: [], // it is used for sending the image
      image: '', // single image acapture for the storing
      msg: '', // msg is a text to send server
      otherComment: '',
      loading: false,
      ok: [],
      time: false,
      rec: [],
      rec2: [],
      receiver: [],
      agentId: '',
      pickup_id: '',
      modalVisible: false,
      pickup_person: '',
      product_name: '',
      sendermsg: '',
      custemerId: '',
      // dt: date + '/' + month + '/' + year + ' ' + hours + ':' + min,
      agentList: [],
      isArray: true,
      partnerName: '',
      iscallCenter: '',
      callCenterAgentId: '',
      assignCustomerAgentId: '',
      onQuestions: false,
      questionsArray: [],
      comments: '',
      transaction_id: '',
      activityModal: false,
      activityData: [], //"CPVR","CPVO","Document Collection"
      reassignActivityData: [], // Activity reassign data in this array
      reassignAgentList: [], // activity reassign agent list data in this array
      reAssign: false,
      search: '',
      searchBar: false,
      selectedActivity: '',
      selectedActivityId: '', // select activity id for assign pickups to fc
      newSearchData: [],
      open: false,
      isChecked: false,
      selected_activity: [],
      allCallcenterData: [],
      reasonArray: [],
      callcenterReasonArray: [],
      isReasonModal: false, // ite used for reason
      isImage: '', // for image flag
      isReschedule: '', // reschedule flag
      today: moment().format('YYYY-MM-DD'),
      startTime: '',
      endTime: '',
      date: '',
      reason_id: '',
      reasonActive: false,
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.internet();
  }
  async internet() {
    NetInfo.fetch().then(async (state) => {
      if (state.isConnected == true) {
        this.Mount();
      } else {
        this.setState({
          pickup_id: this.props.route.params.pickup_id,
        });
        console.warn(this.state.pickup_id);
        Snackbar.show({
          text: 'No internet.',
          duration: Snackbar.LENGTH_LONG,
        });
      }
    });
  }

  async Mount() {
    typeCheck = await AsyncStorage.getItem('AgentType');
    typeCheck == 'c'
      ? this.setState({iscallCenter: typeCheck})
      : this.setState({iscallCenter: '', isReasonModal: true});

    activity_name = this.props.route.params.Activity_name;
    reschedule = this.props.route.params.reschedule; //visit reschedule
    data = this.props.route.params.Data; // reschedule data coming from here
    Id = this.props.route.params.ITEM; // Data coming from pickup details
    SelectedActivity = this.props.route.params.SelectedActivity;
    activity_id = this.props.route.params.ActivityId; // Data coming from pickup details
    ActiveScreen = this.props.route.params.ActiveScreen;
    console.warn(Id);
    const agentId = await AsyncStorage.getItem('AGENT_ID');
    console.warn('All Data  ' + JSON.stringify(Id));
    console.warn('Activity name  ' + activity_name, activity_id);

    if (SelectedActivity) {
      this.setState({selected_activity: SelectedActivity}, () => {
        console.warn('Selected Activities' + SelectedActivity);
      });
    }

    if (activity_name != 'Call Center') {
      typeCheck = '';
      this.setState({iscallCenter: ''}); // only visible for call center activity
    }

    this.setState({
      agentId: agentId,
    });

    console.warn('Pickup', Id.pickups_id, Id.customer_id);
    if (Id != undefined) {
      console.warn('data assign to parameters' + activity_id);
      customerMobile = Id.mobile;
      this.setState(
        {
          pickup_person: Id.pickup_person,
          product_name: Id.product_name,
          custemerId: Id.customer_id,
          callCenterAgentId: Id.call_center_agent_id,
          activity_id: activity_id,
        },
        () => {
          if (ActiveScreen) {
            this.setState({pickup_id: Id.pickups_id});
          } else {
            this.setState({pickup_id: Id.id});
          }
        },
      );
    }

    await fetch('https://docboyz.in/docboyzmt/api/activity_chat_list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: this.state.agentId,
        pickup_id: this.state.pickup_id,
        activity_id: this.state.activity_id,
      }),
    })
      .then((response) => response.json())
      .then((resData) => {
        console.warn('the console data is send' + JSON.stringify(resData));
        this.state.receiver = resData;
        this.state.rec.push(
          this.state.receiver.map((data) => {
            if (data.sender == 'admin') {
              // admin msg means server data
              let photoCheck = data.message.includes('https:');
              if (data.message.startsWith('{') && data.message.endsWith('}')) {
                //self image is display
                let path0 = data.message.replace('{', '');
                let path = path0.replace('}', '');
                console.warn('the image data ', path);
                return (
                  <View key={data.updated_at} style={{marginTop: 15}}>
                    <Lightbox
                      activeProps={(style = {width: '85%', marginTop: 20})}>
                      {
                        <Image
                          style={{
                            width: '60%',
                            height: 200,
                            justifyContent: 'flex-start',
                            backgroundColor: '#bdbdbd',
                            borderWidth: 1,
                            marginRight: 20,
                            borderRadius: 7,
                            elevation: 5,
                            padding: 10,
                            flex: 1,
                            alignSelf: 'flex-start',
                            resizeMode: 'stretch',
                          }}
                          source={{uri: path}}
                        />
                      }
                    </Lightbox>
                  </View>
                );
              } else {
                // this message is our sender sms
                return (
                  <View key={data.created_at} style={{marginTop: 15}}>
                    <Card style={styles.receive}>
                      <Text
                        style={{
                          fontSize: 16,
                          marginRight: 10,
                          color: 'black',
                          alignSelf: 'flex-start',
                        }}>
                        {data.message}
                      </Text>
                      <Text
                        style={{
                          textAlign: 'left',
                          fontSize: 8,
                        }}>
                        {data.created_at}
                      </Text>
                    </Card>
                  </View>
                );
              }
            } else {
              if (data.message.startsWith('{') && data.message.endsWith('}')) {
                //self image is display
                let path0 = data.message.replace('{', '');
                let path = path0.replace('}', '');
                console.warn('the image data ', path);
                return (
                  <View key={data.updated_at} style={{marginTop: 15}}>
                    <Lightbox
                      activeProps={
                        (style = {
                          width: '85%',
                          marginTop: 20,
                        })
                      }>
                      {
                        <Image
                          style={{
                            width: '60%',
                            height: 200,
                            justifyContent: 'flex-end',
                            backgroundColor: '#bdbdbd',
                            marginRight: 20,
                            borderRadius: 7,
                            borderWidth: 1,
                            padding: 10,
                            elevation: 5,
                            flex: 1,
                            alignSelf: 'flex-end',
                            resizeMode: 'stretch',
                          }}
                          source={{uri: path}}
                        />
                      }
                    </Lightbox>
                  </View>
                );
              } else {
                // self  message is print
                return (
                  <View key={data.updated_at} style={{marginTop: 15}}>
                    <Card style={styles.message}>
                      <Text
                        style={{
                          fontSize: 16,
                          marginRight: 10,
                          color: 'black',
                          alignSelf: 'flex-end',
                        }}>
                        {data.message}
                      </Text>
                      <Text
                        style={{
                          textAlign: 'right',
                          fontSize: 8,
                        }}>
                        {data.created_at}
                      </Text>
                    </Card>
                  </View>
                );
              }
            }
          }),
        );
        this.setState({loading: false});
      })
      .catch((error) => {
        console.warn('catch error found', error.message);
        this.state({loading: false});
      });

    if (typeCheck == 'c' && this.state.isArray) {
      if (!ActiveScreen) {
        this.agentListData();
      }
    }
  }

  loadReasonData = async () => {
    await fetch(
      'https://docboyz.in/docboyzmt/api/activity_reschedule_reasons',
      {
        method: 'POST',
        headers: {
          Accept: 'aplication/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then((res) => res.json())
      .then((response) => {
        console.warn('The res data ', response);
        if (response.error == 0) {
          response.data.map((item) => {
            if (item.name == 'Other') {
              this.state.callcenterReasonArray.push(item);
              this.state.reasonArray.push(item);
            } else {
              if (item.is_callcenter == 1) {
                this.state.callcenterReasonArray.push(item);
              } else {
                this.state.reasonArray.push(item);
              }
            }
          });
        }
      })
      .catch((error) => {
        console.warn('error in catch data ', error.message);
      });
  };

  sendReschedule = async (data) => {
    console.warn('activity id' + this.state.activity_id);
    // console.warn("Data is " + JSON.stringify(data));
    // if(this.state.pickup_id==""||this.state.pickup_id==undefined){
    //     // this.setState({pickup_id:pickup_id})
    //     console.warn("Pickup id"+this.state.pickup_id)
    // }
    console.warn('pickup id is', this.state.pickup_id);

    c = 0;
    // var date = "Reschedule Date :" + this.state.date;
    // var time = "Reschedule Time :" + this.state.startTime;
    // var reason = data.resons;
    // reason == "Other" ? reason = data.comment : reason;
    // console.warn("Reason of pickup" + reason)

    // var allData = date + "\n\n" + time + "\n\n Reason :" + this.state.msg;

    // console.warn("all data isss", data);

    await fetch('https://docboyz.in/docboyzmt/api/activity_chat_store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: this.state.agentId,
        pickup_id: this.state.pickup_id,
        company_id: this.state.custemerId,
        message: this.state.msg,
        activity_id: this.state.activity_id,
      }),
    })
      .then((response) => response.json())
      .then((sendData) => {
        c = 2;
        console.warn('Send Data successfull', sendData);
        this.setState({
          reason_id: '',
          imgArray: [],
          startTime: '',
          date: '',
          isImage: '',
          isReschedule: '',
          loading: false,
        });
      })
      .catch((error) => {
        console.warn('catch error found', error.message);
        console.log('catch error found in log', error);
        NetInfo.isConnected.fetch().then((isConnected) => {
          if (isConnected) {
            console.log('Internet is connected');
          } else {
            Snackbar.show({
              text: 'please check Internet Connection',
              duration: Snackbar.LENGTH_LONG,
            });
          }
        });
      });

    this.setState({
      rec: [],
      ok: [],
      msg: '',
    });
    console.warn('cccccccccccc  ' + c);
  };

  sendSms = async () => {
    console.warn('The pickup id', this.state.pickup_id);
    this.setState({loading: true});
    let {msg, otherComment} = this.state;
    var senderMessage = this.state.msg;

    if (otherComment != '' || otherComment != null) {
      senderMessage += '\n' + otherComment;
    }

    if (this.state.msg != '') {
      this.state.ok.push(
        <View key={this.state.msg} style={{marginTop: 15}}>
          <View style={styles.message}>
            <Text
              style={{
                fontSize: 16,
                marginRight: 10,
                color: 'black',
                alignSelf: 'flex-end',
              }}>
              {senderMessage}
            </Text>
            <Text
              style={{
                textAlign: 'right',
                fontSize: 8,
              }}></Text>
          </View>
        </View>,
      );
    }

    console.warn(senderMessage);
    await fetch('https://docboyz.in/docboyzmt/api/activity_chat_store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: this.state.agentId,
        pickup_id: this.state.pickup_id,
        company_id: this.state.custemerId,
        message: senderMessage,
        activity_id: this.state.activity_id,
      }),
    })
      .then((response) => response.json())
      .then((sendData) => {
        console.warn('Send Data', sendData);
        if (sendData.error == 0) {
          this.setState({
            reason_id: '',
            imgArray: [],
            startTime: '',
            date: '',
            isImage: '',
            isReschedule: '',
          });

          this.setState({
            rec: [],
            ok: [],
            msg: '',
            sendermsg: '',
            otherComment: '',
            loading: false,
          });

          this.Mount();
        } else {
          alert('Customer id is missing so can not send the message');
          // this.props.navigation.replace('pickup')
        }
      })
      .catch((error) => {
        console.warn('catch error found', error.message);
        console.log('catch error found', error.message);
      });
  };

  agentListData = async () => {
    var selfname = '';
    await AsyncStorage.getItem('FCnAME', (err, result) => {
      selfname = result;
    });
    //  console.warn("agent_id"+this.state.agentId+"pickup id"+this.state.pickup_id)

    await fetch('https://docboyz.in/docboyzmt/api/activity_agent_assign_list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: this.state.agentId,
        pickup_id: this.state.pickup_id,
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        console.warn('Agent list Data', resData);
        if (resData.data != '' && resData.data != undefined) {
          this.setState(
            {
              agentList: [resData.data, ...resData.all_agent_list],
              // questionsArray:resData.pickupDocs.activity,
              activityData: resData.pickupDocs.activity,
            },
            () => {
              console.warn('Activity Data  ', this.state.activityData);
              if (this.state.agentList.length <= 0) {
                AgenData = resData.data;
                AllAgentList = resData.all_agent_list;
                this.setState({isArray: false});
                console.warn('Is array ', this.state.isArray);
              } else {
                // AgenData = resData.data;
                // AllAgentList = resData.all_agent_list

                AgenDataArray = [...resData.data, ...resData.all_agent_list]; // add in 1 array all data

                AgenDataArray.splice(0, 0, {
                  agent_name: selfname,
                  agent_mobile: '',
                  agent_id: this.state.agentId,
                  company_id: '',
                  company_name: '',
                });
                this.setState({agentList: AgenDataArray});
                // AllAgentList.splice(0, 0, {
                //     "agent_name": selfname,
                //     "agent_mobile": "",
                //     "agent_id": this.state.agentId,
                //     "company_id": '',
                //     "company_name": ""
                // })

                this.setState({isArray: false, modalVisible: true});
                console.warn('Is array ', this.state.isArray);
              }
            },
          );
        } else {
          this.setState({modalVisible: false, isArray: false});
          alert('No agent available for this pickup');
        }
      })
      .catch((error) => {
        console.warn('Catch error found', error.message);
        this.setState({modalVisible: false});
        Snackbar.show({
          text: 'Something wrong please try again',
          duration: Snackbar.LENGTH_LONG,
        });
      });
  };

  //****************************** Call center all activities*********************************** */

  callCeneterData = async (pickupId) => {
    await fetch('https://docboyz.in/docboyzmt/api/callcenter_all_activity', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pickupId: this.state.pickup_id,
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        console.warn('The data of all activity ' + JSON.stringify(resData));
        if (resData.error == 0) {
          console.warn('The data of all activity ' + JSON.stringify(resData));
          this.setState({allCallcenterData: resData.pickup_details}, () => {
            this.setState({});
          });
        }
      })
      .catch((error) => {
        console.warn('error in catch ' + error.message);
      });
  };
  //****************************** Call center all activities code end*********************************** */

  componentWillMount() {
    this.loadReasonData();
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick() {
    AssignAgent = 0;
    this.props.navigation.replace('pickupDetails', {
      pickupId: this.state.pickup_id,
      status: '',
    });

    return true;
  }

  async componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({
        rec: [],
        ok: [],
        msg: '',
      });

      this.Mount();
    });
  }

  goBack = () => {
    AssignAgent = 0;
    this.props.navigation.replace('PickupDetailsScreen', {
      pickupId: this.state.pickup_id,
      status: '',
    });
  };

  onRefresh = () => {
    this.setState({
      rec: [],
      ok: [],
      msg: '',
      isArray: true,
    });
    this.Mount();
  };

  callReschedule = () => {
    c = 1;
    if (typeCheck === 'c') {
      ITEM = this.state.pickup_id;
    }

    this.props.navigation.navigate('ReschedulePickups', {
      ITEM: this.state.pickup_id,
      ActivityId: this.state.activity_id,
    });
  };

  call = (number, item) => {
    this.pickupAssignd(item, 1);

    Linking.openURL('tel:' + encodeURIComponent(number));
  };

  pickupAssignd = async (item, call) => {
    // for assign pickup set on chat
    // console.warn("Transaction id"+this.state.transaction_id);
    console.warn(
      'agent id',
      JSON.stringify(item) +
        'pickup_id' +
        this.state.pickup_id +
        'call id' +
        this.state.agentId,
    );
    var assignAgent = '';
    if (call == 1) {
      if (item) {
        var name = 'Called FC ' + item.agent_name + ' - ' + item.agent_id;
      } else {
        var name = 'You have called the customer';
      }
      this.sendCallCenterData(name, 0);
    } else {
      // assign pickups api ************************************
      var name = '';
      if (item == 1) {
        name = `${this.state.selectedActivity} activity assignd to self`;
        assignAgent = this.state.agentId;
      } else {
        name =
          `${this.state.selectedActivity} activity assignd to  ` +
          item.agent_name +
          ' - ' +
          item.agent_id;
        assignAgent = item.agent_id;
      }

      console.warn(
        'Agent id ' +
          assignAgent +
          ' pickup id ' +
          this.state.pickup_id +
          ' call_center_agent_id ' +
          this.state.agentId +
          ' activity id ' +
          this.state.selectedActivityId,
      );

      await fetch('https://docboyz.in/docboyzmt/api/activity_assign_agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: assignAgent, // assign to the another agent id
          pickup_id: this.state.pickup_id,
          call_center_agent_id: this.state.agentId, //self agent id of callcenter agent
          activity_id: this.state.selected_activity,
        }),
      })
        .then((res) => res.json())
        .then(async (resData) => {
          console.warn('Data assign call', resData);
          if (resData.error == 0) {
            Snackbar.show({
              text: 'Agent assign successfully',
              duration: Snackbar.LENGTH_LONG,
            });
            this.setState({modalVisible: false}); //  fc list is false here
            this.props.navigation.replace('pickup');

            this.sendCallCenterData(name, 1);

            //  await this.agentListData();         //
            //  if(this.state.activityData.length<=0){
            //     this.props.navigation.replace('pickup');
            //  }
            //  console.warn("The message to be send "+name);
          } else if (resData.error == 1) {
            console.warn('Error in assign agent ' + resData.message);
            Snackbar.show({
              text: 'Something went wrong! please try again',
              duration: Snackbar.LENGTH_LONG,
            });
            this.setState({modalVisible: true}); //  fc list is false here
          }
        })
        .catch((error) => {
          console.warn('Error fount', error.message);
        });
    }
  };
  sendCallCenterData = async (name, check) => {
    // this.setState({ modalVisible: false})
    // console.warn("Agent questions "+this.state.activityData.documets.length)
    //     if(this.state.questionsArray.length>0){  // use for question list
    //     }
    if (check != 1) {
      await this.callCeneterData();
      this.setState({onQuestions: true});
    }

    await fetch('https://docboyz.in/docboyzmt/api/activity_chat_store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: this.state.agentId,
        pickup_id: this.state.pickup_id,
        company_id: this.state.custemerId,
        message: name,
        activity_id: this.state.activity_id,
      }),
    })
      .then((response) => response.json())
      .then((sendData) => {
        console.warn('Send Data of assign', sendData);
      })
      .catch((error) => {
        console.warn('catch error found', error.message);
        Snackbar.show({
          text: 'Something wrong please try again',
          duration: Snackbar.LENGTH_LONG,
        });
      });

    this.setState({
      rec: [],
      ok: [],
      msg: '',
      isArray: true,
    });
    this.Mount();
    // if(check==1){
    //     this.props.navigation.replace('pickupDetails',{
    //     pickupId: this.state.pickup_id
    //     })
    // }
  };

  callForAssign = (item) => {
    Alert.alert(
      'Assign pickup',
      `Do you want to assign pickup to this fc`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            this.pickupAssignd(item);
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  callAgents = ({item}) => {
    return (
      <Card
        style={{
          flex: 1,
          margin: 2,
          paddingTop: 5,
          paddingLeft: 10,
          paddingRight: 5,
          paddingBottom: 15,
        }}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              width: 150,
              multiline: true,
              marginBottom: 10,
            }}>
            {item.agent_name} - {item.agent_id}
          </Text>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            {/* <Icon type='material-community' name={"phone"} size={20} color="green"
                    containerStyle={{}}
                    />  */}
            {this.state.agentId !== item.agent_id ? (
              <TouchableOpacity
                style={{
                  padding: 7,
                  borderRadius: 5,
                  backgroundColor: 'green',
                  elevation: 5,
                  alignItems: 'center',
                  marginRight: 5,
                }}
                onPress={() =>
                  Alert.alert(
                    'Call',
                    `Do you want to call ${item.agent_name}`,
                    [
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        onPress: () => this.call(item.agent_mobile, item),
                      },
                    ],
                    {
                      cancelable: false,
                    },
                  )
                }>
                <Text
                  style={{fontSize: 12, color: 'white', textAlign: 'center'}}>
                  Call
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={{
                padding: 7,
                borderRadius: 5,
                backgroundColor: '#E41313',
                alignItems: 'center',
                elevation: 5,
              }}
              onPress={() => this.callForAssign(item)}>
              <Text style={{fontSize: 12, color: 'white', textAlign: 'center'}}>
                Assign agent
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

  sendComment = async () => {
    this.setState({onQuestions: false});
    console.warn(
      this.state.agentId,
      this.state.pickup_id,
      this.state.custemerId,
      this.state.activity_id,
    );
    await fetch('https://docboyz.in/docboyzmt/api/activity_chat_store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: this.state.agentId,
        pickup_id: this.state.pickup_id,
        company_id: this.state.custemerId,
        message: this.state.comments,
        activity_id: this.state.activity_id,
      }),
    })
      .then((response) => response.json())
      .then((sendData) => {
        console.warn('Send Data', sendData);
        this.setState({onQuestions: false, comments: ''});
      })
      .catch((error) => {
        console.warn('catch error found', error.message);
        Snackbar.show({
          text: 'Something wrong for sending comment',
          duration: Snackbar.LENGTH_LONG,
        });
      });

    this.setState({
      rec: [],
      ok: [],
      msg: '',
    });
    this.Mount();
  };

  callForAgent = () => {
    this.agentListData();
  };

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

  // ************************************ Activities List function *************************
  activityFun = ({item, index}) => {
    return (
      <Card
        style={{
          flex: 1,
          margin: 5,
          paddingTop: 5,
          paddingLeft: 10,
          paddingRight: 5,
          paddingBottom: 15,
          elevation: 5,
        }}>
        <TouchableOpacity
          onPress={() => {
            console.warn('Clicked index = ' + index);
            this.setState({
              modalVisible: true,
              selectedActivity: item.name,
              selectedActivityId: item.activity_id,
            });
            if (this.state.reAssign == true) {
              this.agentReassignListData(); // if true then reassign call
            } else {
              this.agentListData(); // if false then assign list call
            }
          }}>
          <Text style={{fontSize: 14, margin: 5, color: 'black'}}>
            {item.name}
          </Text>
          <Text style={{fontSize: 12, color: 'grey', marginLeft: 5}}>
            {this.getstatus(item.status)}
            {item.agent_name}{' '}
            {item.agent_id == null ? null : '- ' + item.agent_id}
          </Text>
        </TouchableOpacity>
      </Card>
    );
  };
  // ************************************** Activity list function end *******************************

  // ************************************** Searching the list of agent  *******************************

  searchFunction = async (text) => {
    // console.warn("Agent lsit "+JSON.stringify(this.state.agentList),text);
    var newData;
    // if (this.state.isToggle) {
    newData = AgenDataArray;
    // } else {

    //     newData = AgenDataArray;           // every time backup all array data for searchin ontext change
    // }

    if (text == '') {
      this.state.isToggle == true
        ? this.setState({agentList: AgenDataArray, search: text})
        : this.setState({agentList: AgenDataArray, search: text});
    } else {
      agent_id = '';

      newData = newData.filter((l) => {
        //https://github.com/atasmohammadi/react-native-multiple-select-list

        if (!isNaN(text)) {
          searchText = text.toString().trim();
          // console.warn("the search text "+searchText);
          return l.agent_id.toString().match(searchText);
        } else {
          searchText = text.trim().toLowerCase();
          return l.agent_name.toLowerCase().match(searchText);
        }
      });

      this.state.isToggle == true
        ? this.setState({agentList: newData, search: text})
        : this.setState({agentList: newData, search: text});
    }
  };

  // ************************************** Searching the list of agent  *******************************

  onClearSearch = () => {
    this.state.isToggle == true
      ? this.setState({
          agentList: AgenDataArray,
          searchBar: false,
          search: '',
        })
      : this.setState({
          agentList: AgenDataArray,
          searchBar: false,
          search: '',
        });
  };

  // ***************************************** Question list function start *******************************

  allAgentList = () => {
    this.setState({isToggle: !this.state.isToggle, isLoad: true}, () => {
      this.state.isToggle
        ? this.setState({agentList: AgenDataArray, isLoad: false})
        : this.setState({agentList: AgenDataArray, isLoad: false});
    });
  };

  onChangeAccordian(section) {
    this.setState({open: section});
  }

  render() {
    if (this.state.loading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            backgroundColor: 'white',
          }}>
          <View>
            <StatusBar hidden={false} backgroundColor="red" />
            <Appbar.Header style={{backgroundColor: '#E41313', height: 55}}>
              <Appbar.BackAction
                style={{alignItems: 'flex-start'}}
                onPress={this.goBack}
              />
              <Appbar.Content
                style={{alignItems: 'center', marginRight: 50}}
                title={this.state.pickup_person}
                subtitle={this.state.product_name}
              />
              {this.state.iscallCenter == 'c' &&
              this.state.selected_activity.length > 0 ? (
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{
                      margin: 10,
                      backgroundColor: 'red',
                      padding: 7,
                      borderRadius: 5,
                      elevation: 10,
                    }}
                    onPress={() => {
                      if (this.state.agentList.length <= 0) {
                        alert('No activity available for assign to agent');
                      } else {
                        this.setState({modalVisible: true});
                      }
                    }}>
                    {/* <Image
                                    source={require('./agent2.png')}
                                    style={{ width: 40, height: 40, }}
                                /> */}

                    <Text style={{fontSize: 12, color: 'white', padding: 0}}>
                      Assign
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </Appbar.Header>
          </View>
          <ActivityIndicator size="large" color="black" />
          <View></View>
        </View>
      );
    }
    return (
      <View
        style={
          this.state.modalVisible ||
          this.state.onQuestions ||
          this.state.activityModal ||
          this.state.sendDataModal ||
          this.state.isReasonModal
            ? {flex: 1, backgroundColor: 'black', opacity: 0.9}
            : styles.Main
        }>
        <StatusBar hidden={false} backgroundColor="red" />
        <Appbar.Header style={{backgroundColor: '#E41313', height: 55}}>
          <Appbar.BackAction
            style={{alignItems: 'flex-start'}}
            onPress={this.goBack}
          />
          <Appbar.Content
            style={{alignItems: 'center', marginRight: 50}}
            title={this.state.pickup_person}
            subtitle={this.state.product_name}
          />
          {this.state.iscallCenter == 'c' &&
          this.state.selected_activity.length > 0 ? (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{
                  margin: 10,
                  backgroundColor: 'red',
                  padding: 7,
                  borderRadius: 5,
                  elevation: 10,
                }}
                onPress={() => {
                  if (this.state.agentList.length <= 0) {
                    alert('No activity available for assign to agent');
                  } else {
                    this.setState({modalVisible: true});
                  }
                }}>
                {/* <Image
                                    source={require('./agent2.png')}
                                    style={{ width: 40, height: 40, }}
                                /> */}

                <Text style={{fontSize: 12, color: 'white', padding: 0}}>
                  Assign
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </Appbar.Header>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.activityModal}
          onRequestClose={() => this.setState({modalVisible: false})}>
          <View style={styles.modal}>
            <View style={styles.modalDialog}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: 'white',
                  transparent: 0,
                }}>
                {this.state.reAssign == true ? (
                  <Text
                    style={{
                      fontSize: 16,
                      margin: 10,
                      color: 'black',
                      fontWeight: 'bold',
                    }}>
                    Select activity to reassign
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: 16,
                      margin: 10,
                      color: 'black',
                      fontWeight: 'bold',
                    }}>
                    Select activity to assign
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => {
                    this.state.reAssign == true
                      ? this.setState({activityModal: false, reAssign: false})
                      : this.setState({activityModal: false});
                  }}
                  style={{justifyContent: 'flex-end', margin: 10}}>
                  <Icon
                    type="material-community"
                    name={'close'}
                    size={25}
                    color="red"
                    containerStyle={{}}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  transparent: 0,
                  justifyContent: 'space-between',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    elevation: 5,
                    margin: 10,
                    flexDirection: 'row',
                    backgroundColor: '#9e9e9e',
                    borderRadius: 5,
                    padding: 7,
                    elevation: 5,
                  }}
                  onPress={() => {
                    this.call(customerMobile);
                    console.warn('The assign call ');
                  }}>
                  <Icon
                    type="material-community"
                    name={'phone-forward'}
                    size={25}
                    color="green"
                    containerStyle={{}}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      textAlign: 'center',
                      marginLeft: 3,
                    }}>
                    Call Customer
                  </Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={
                  this.state.reAssign == true
                    ? this.state.reassignActivityData
                    : this.state.activityData
                }
                renderItem={({item, index}) => this.activityFun({item, index})}
                keyExtractor={(text) => {
                  text.name;
                }}
              />
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({modalVisible: false})}>
          <View style={styles.modal}>
            <View style={styles.modalDialog}>
              {
                // the search bar check
                this.state.searchBar == true ? (
                  <View
                    style={{
                      backgroundColor: 'white',
                      margin: 5,
                      alignItems: 'center',
                    }}>
                    <Searchbar
                      placeholder="Search"
                      icon={() => (
                        <Icon
                          type="material-community"
                          name="arrow-left"
                          size={25}
                          color="#212121"
                        />
                      )}
                      onIconPress={() => this.onClearSearch()}
                      theme={{
                        colors: {
                          placeholder: 'grey',
                          text: 'black',
                          primary: '#313131',
                          background: 'white',
                        },
                      }}
                      onChangeText={(query) => {
                        this.searchFunction(query);
                      }}
                      value={this.state.search}
                      style={{margin: 5, height: 40}}
                      autoFocus={true}
                      inputStyle={{fontSize: 16, color: 'black'}}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      marginLeft: 5,
                      backgroundColor: 'white',
                      transparent: 0,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        margin: 10,
                        color: 'black',
                        fontWeight: 'bold',
                        width: '70%',
                      }}>
                      Select FC to assign {this.state.selectedActivity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => this.setState({searchBar: true})}
                      style={{
                        justifyContent: 'flex-end',
                        marginBottom: 10,
                        marginRight: 10,
                      }}>
                      <Icon
                        type="material-community"
                        name={'magnify'}
                        size={25}
                        color="grey"
                        containerStyle={{}}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => this.setState({modalVisible: false})}
                      style={{
                        justifyContent: 'flex-end',
                        marginBottom: 10,
                        marginRight: 10,
                      }}>
                      <Icon
                        type="material-community"
                        name={'close'}
                        size={25}
                        color="red"
                        containerStyle={{}}
                      />
                    </TouchableOpacity>
                  </View>
                )
              }

              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'grey',
                  transparent: 0,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    elevation: 5,
                    margin: 10,
                    flexDirection: 'row',
                    padding: 7,
                    elevation: 5,
                    backgroundColor: 'white',
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    this.call(customerMobile);
                    console.warn('The assign call ');
                  }}>
                  <Icon
                    type="material-community"
                    name={'phone-forward'}
                    size={25}
                    color="green"
                    containerStyle={{}}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      textAlign: 'center',
                      marginLeft: 3,
                    }}>
                    Call Customer
                  </Text>
                </TouchableOpacity>

                <View style={{}}>
                  {/* <Text style={{ color: 'black', marginTop: 3, fontSize: 14, marginLeft: 2, fontWeight: 'bold' }}>All FC</Text>
                                    <Switch  //**********************toggle switch button************** 
                                        value={this.state.isToggle}
                                        color={'green'}
                                        onValueChange={() => {
                                            this.allAgentList();
                                        }}
                                    /> */}
                </View>
              </View>

              {
                // is loading true then the api call
                this.state.isLoad == true ? (
                  <View
                    style={{
                      height: 100,
                      width: 300,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                    }}>
          <ActivityIndicator size="large" color="black" />
                  </View>
                ) : null
              }

              <FlatList
                data={
                  this.state.reAssign == true
                    ? this.state.reassignAgentList
                    : this.state.agentList
                }
                renderItem={({item}) => this.callAgents({item})}
                keyExtractor={(text) => {
                  text.agent_id;
                }}
              />
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.onQuestions}
          onRequestClose={() => this.setState({onQuestions: false})}>
          <View style={styles.modal}>
            <View style={styles.modalDialog}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: 'white',
                  transparent: 0,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    margin: 10,
                    color: 'black',
                    fontWeight: 'bold',
                  }}>
                  Activity Questions List
                </Text>
                <TouchableOpacity
                  onPress={() => this.setState({onQuestions: false})}
                  style={{justifyContent: 'flex-end', margin: 10}}>
                  <Icon
                    type="material-community"
                    name={'close'}
                    size={25}
                    color="red"
                    containerStyle={{}}
                  />
                </TouchableOpacity>
              </View>
              <ScrollView style={{marginBottom: 5}}>
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
                    backgroundColor: '#ffffff',
                    shadowOffset: {
                      width: 20,
                      height: 10,
                    },
                    shadowColor: 'white',
                    elevation: 10,
                  }}
                  activeSection={this.state.open}
                  sections={this.state.allCallcenterData}
                  touchableComponent={TouchableHighlight}
                  renderHeader={(p, i, isOpen) => {
                    //console.warn(p,isOpen)
                    return (
                      <View
                        style={{
                          backgroundColor: '#ffffff',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          height: 35,
                        }}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={[
                              {
                                textAlign: 'center',
                                fontSize: 14,
                                fontWeight: '500',
                              },
                              {padding: 5, textAlign: 'left', color: 'black'},
                            ]}>
                            {p.name}
                          </Text>
                          {isOpen === false ? (
                            <TouchableHighlight
                              style={{
                                justifyContent: 'flex-end',
                                marginRight: 10,
                                marginBottom: 5,
                              }}>
                              <Icon
                                type="material-community"
                                name={'chevron-right'}
                                size={28}
                                color="mediumseagreen"
                                containerStyle={{}}
                              />
                            </TouchableHighlight>
                          ) : (
                            <TouchableHighlight
                              onPress={this.onChangeAccordian.bind(this)}
                              style={{
                                justifyContent: 'flex-end',
                                marginRight: 10,
                                marginBottom: 5,
                              }}>
                              <Icon
                                type="material-community"
                                name={'chevron-down'}
                                size={28}
                                color="mediumseagreen"
                                containerStyle={{}}
                              />
                            </TouchableHighlight>
                          )}
                        </View>
                      </View>
                    );
                  }}
                  renderContent={(i) => {
                    console.warn(
                      'Data of object ' + JSON.stringify(i.documents),
                    );

                    return (
                      <ScrollView>
                        <FlatList
                          data={i.documents}
                          keyExtractor={(text) => {
                            text.sequence;
                          }}
                          renderItem={({item}) => (
                            <Card
                              style={{
                                flex: 1,
                                margin: 2,
                                paddingTop: 5,
                                paddingLeft: 10,
                                paddingRight: 5,
                                paddingBottom: 15,
                              }}>
                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  marginBottom: 10,
                                }}>
                                <Text style={{fontSize: 14, color: 'black'}}>
                                  {item.sequence})
                                </Text>

                                <Text
                                  style={{
                                    marginLeft: 5,
                                    fontSize: 14,
                                    color: 'black',
                                  }}>
                                  {item.question}
                                </Text>
                              </View>
                              <TouchableOpacity
                                onPress={() => {
                                  Linking.openURL(item.link);
                                }}>
                                <Text
                                  style={{
                                    marginLeft: 5,
                                    fontSize: 14,
                                    color: 'green',
                                  }}>
                                  {item.link}
                                </Text>
                              </TouchableOpacity>
                            </Card>
                          )}
                        />
                      </ScrollView>
                    );
                  }}
                  duration={500}
                  onChange={this.onChangeAccordian.bind(this)}
                />
              </ScrollView>
            </View>
          </View>
        </Modal>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
              progressBackgroundColor={{color: 'red'}}
            />
          }
          ref={(ref) => (this.scrollView = ref)}
          onContentSizeChange={(contentWidth, contentHeight) => {
            this.scrollView.scrollToEnd({animated: true});
          }}>
          <View>{this.state.rec}</View>
          <View>{this.state.ok}</View>
        </ScrollView>

        <View style={styles.bottom}>
          <Card
            style={{
              flex: 1,
              borderWidth: 0.5,
              paddingLeft: 5,
              marginLeft: 15,
              marginTop: 15,
              marginBottom: 10,
              marginRight: 15,
              borderColor: 'grey',
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 15,
            }}>
            <TouchableOpacity
              onPress={() => this.setState({isReasonModal: true})}>
              {this.state.msg == '' ? (
                <Text
                  style={{
                    fontSize: 15,
                    color: 'black',
                    marginLeft: 10,
                    width: '70%',
                    multiline: true,
                  }}>
                  Tap to select reason...
                </Text>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: 'black',
                      marginLeft: 10,
                      width: '70%',
                    }}>
                    {this.state.msg}
                  </Text>
                  {this.state.msg != 'Other' ? (
                    <TouchableOpacity
                      style={{alignItems: 'flex-end'}}
                      onPress={() => this.sendSms()}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 20,
                          textAlign: 'right',
                        }}>
                        Send
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}
            </TouchableOpacity>

            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.isReasonModal}
              onRequestClose={() => {
                this.setState({
                  isReasonModal: false,
                  msg: '',
                  isImage: '',
                  isReschedule: '',
                });
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  opacity: 0.9,
                }}>
                <View
                  style={{
                    width: '85%',
                    height: '80%',
                    backgroundColor: 'white',
                    borderRadius: 5,
                    marginBottom: 10,
                    shadowOffset: {
                      width: 5,
                      height: 5,
                    },
                    shadowColor: '#FFFFFF',
                    elevation: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      backgroundColor: '#eeeeee',
                      transparent: 0,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        margin: 10,
                        color: 'black',
                        fontWeight: 'bold',
                        width: '80%',
                        multiline: true,
                      }}>
                      Select reason
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          isReasonModal: false,
                          msg: '',
                          isImage: '',
                          isReschedule: '',
                        });
                      }}
                      style={{justifyContent: 'flex-end', margin: 10}}>
                      <Icon
                        type="material-community"
                        name={'close'}
                        size={25}
                        color="red"
                        containerStyle={{}}
                      />
                    </TouchableOpacity>
                  </View>

                  <FlatList // reason list is
                    data={
                      this.state.iscallCenter == 'c'
                        ? this.state.callcenterReasonArray
                        : this.state.reasonArray
                    }
                    style={{marginTop: 3}}
                    keyExtractor={(x) => x.id}
                    renderItem={({item}) => {
                      return (
                        <Card
                          key={(keyItem) => keyItem.id}
                          style={{margin: 5, padding: 10, elevation: 5}}>
                          <TouchableHighlight
                            style={{}}
                            onPress={() => this.calltoModal(item)}>
                            <Text
                              style={{
                                marginLeft: 5,
                                fontSize: 14,
                                color: 'black',
                              }}>
                              {item.name}
                            </Text>
                          </TouchableHighlight>
                        </Card>
                      );
                    }}
                  />
                </View>
              </View>
            </Modal>

            {
              // other comment is sending

              this.state.msg == 'Other' ? (
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      fontSize: 16,
                      marginTop: 5,
                      marginRight: 5,
                      marginBottom: 10,
                      width: '80%',
                      flexGrow: 1,
                    }}>
                    <TextInput
                      style={{
                        width: '100%',
                        height: 45,
                        marginLeft: 10,
                        marginRight: 40,
                        fontSize: 16,
                        borderBottomWidth: 0.5,
                        borderColor: 'black',
                      }}
                      placeholder="Type a message"
                      multiline={true}
                      maxLength={200}
                      numberOfLines={5}
                      onChangeText={(text) =>
                        this.setState({otherComment: text})
                      }
                      // value={this.state.msg}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      this.sendSms();
                    }}
                    style={{
                      justifyContent: 'center',
                      padding: 5,
                      marginBottom: 8,
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        textAlign: 'center',
                        color: 'black',
                      }}>
                      Send
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null
            }
          </Card>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.sendDataModal}
          onRequestClose={() => {
            this.setState({
              sendDataModal: false,
              msg: '',
              isImage: '',
              isReschedule: '',
              date: '',
              startTime: '',
              imgArray: [],
              reason_id: '',
            });
          }}>
          <View style={styles.modal}>
            <View style={styles.modalDialog}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#eeeeee',
                  transparent: 0,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    margin: 10,
                    color: 'black',
                    fontWeight: 'bold',
                    width: '80%',
                    multiline: true,
                  }}>
                  {this.state.msg}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      sendDataModal: false,
                      msg: '',
                      isImage: '',
                      isReschedule: '',
                      date: '',
                      startTime: '',
                      imgArray: [],
                      reason_id: '',
                    });
                  }}
                  style={{justifyContent: 'flex-end', margin: 10}}>
                  <Icon
                    type="material-community"
                    name={'close'}
                    size={25}
                    color="red"
                    containerStyle={{}}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  backgroundColor: 'white',
                }}>
                <ScrollView>
                  {this.state.isImage == 1 ? (
                    <View
                      style={{
                        width: 350,
                        height: 300,
                        flexDirection: 'column',
                        flex: 1,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        marginBottom: 30,
                      }}>
                      {this.state.imgArray.length > 0 ? (
                        <View style={{marginTop: 20}}>
                          <SwiperFlatList
                            ref="swiper"
                            ItemSeparatorComponent={this.renderSeparator}
                            keyExtractor={(item, index) => index.toString()}
                            showPagination
                            paginationStyleItem={{marginBottom: 20}}
                            paginationDefaultColor="lavender"
                            paginationActiveColor="red"
                            data={this.state.imgArray}
                            renderItem={({item, index}) => {
                              console.warn(
                                'The image data ' + JSON.stringify(item),
                                index,
                              );
                              return (
                                <View
                                  style={{
                                    width: 350,
                                    height: 250,
                                    marginBottom: 0,
                                    marginTop: 30,
                                    alignItems: 'center',
                                    resizeMode: 'contain',
                                  }}>
                                  <Lightbox
                                    activeProps={
                                      (style = {
                                        height: '100%',
                                        width: '100%',
                                      })
                                    }>
                                    {
                                      <Image
                                        style={{
                                          width: 350,
                                          height: 250,
                                          marginBottom: 0,
                                          margin: -0,
                                          alignItems: 'center',
                                          resizeMode: 'contain',
                                        }}
                                        source={{uri: item.uri}}
                                      />
                                    }
                                  </Lightbox>
                                </View>
                              );
                            }}
                            keyExtractor={(item, index) => index.toString()}
                            showsHorizontalScrollIndicator={false}
                          />

                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              marginTop: 20,
                              alignItems: 'center',
                              marginLeft: 15,
                              marginRight: 15,
                            }}>
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                width: 80,
                                height: 30,
                                backgroundColor: '#1B547C',
                                borderColor: 'black',
                                borderRadius: 5,
                                marginLeft: 20,
                                marginTop: 15,
                                justifyContent: 'center',
                              }}
                              onPress={this.captureImage}>
                              <Icon
                                type="material-community"
                                name={'plus-circle-outline'}
                                size={22}
                                color="white"
                                containerStyle={{margin: 2}}
                              />
                              <Text
                                style={{
                                  color: 'white',
                                  fontSize: 14,
                                  textAlign: 'center',
                                  textAlignVertical: 'center',
                                }}>
                                Add
                              </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                width: 80,
                                height: 30,
                                backgroundColor: '#E41313',
                                borderColor: 'black',
                                borderRadius: 5,
                                marginRight: 20,
                                marginTop: 10,
                                justifyContent: 'center',
                              }}
                              onPress={this.deleteItem}>
                              <Icon
                                type="material-community"
                                name={'trash-can-outline'}
                                size={22}
                                color="white"
                              />
                              <Text
                                style={{
                                  color: 'white',
                                  fontSize: 14,
                                  textAlign: 'center',
                                  textAlignVertical: 'center',
                                }}>
                                Delete
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <View style={{}}>
                          <TouchableOpacity onPress={this.captureImage}>
                            <Image
                              style={{
                                width: 85,
                                height: 85,
                                alignSelf: 'center',
                              }}
                              source={require('../assets/circle-add.png')}
                            />
                            <Text
                              style={{
                                color: 'black',
                                fontSize: 16,
                                textAlign: 'center',
                                marginTop: 5,
                              }}>
                              Click here and capture the image
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ) : null}

                  {this.state.isReschedule == 1 ? (
                    <View style={{marginTop: 20}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',
                          marginTop: 25,
                        }}>
                        <Text style={{marginTop: 10, color: 'black'}}>
                          {' '}
                          Date :{' '}
                        </Text>
                        <TouchableOpacity>
                          <DatePicker
                            style={{width: 200}}
                            date={this.state.date == null ? 0 : this.state.date}
                            mode="date"
                            placeholder="Date"
                            format="YYYY-MM-DD HH:mm"
                            minDate={this.state.today}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            showIcon={false}
                            customStyles={{dateInput: {marginLeft: 5}}}
                            onDateChange={(date) => {
                              this.setState({date: date});
                            }}
                          />
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',
                          marginTop: 20,
                          marginRight: 3,
                        }}>
                        <Text style={{marginTop: 10, color: 'black'}}>
                          {' '}
                          Time :{' '}
                        </Text>
                        <TouchableOpacity>
                          <DatePicker
                            style={{width: 200}}
                            date={this.state.startTime}
                            mode="time"
                            placeholder="Start Time"
                            // format = {"h:mm: a"}
                            format={'h:mm'}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            showIcon={false}
                            customStyles={{
                              dateInput: {
                                marginLeft: 5,
                              },
                            }}
                            onDateChange={(date) => {
                              this.setState({startTime: date});
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : null}
                </ScrollView>

                {
                  // send button
                  this.state.imgArray.length > 0 ||
                  (this.state.startTime && this.state.date) ? (
                    <TouchableOpacity
                      onPress={() => {
                        this.sendRescheduleData();
                      }}
                      style={{
                        width: '70%',
                        padding: 5,
                        height: 40,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: 'grey',
                        elevation: 5,
                        flexDirection: 'row',
                        backgroundColor: '#1B547C',
                        borderRadius: 5,
                        marginBottom: 10,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 20,
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          marginRight: 2,
                        }}>
                        Send
                      </Text>
                      <Icon
                        type="material-community"
                        name={'send-circle'}
                        size={25}
                        color="white"
                      />
                    </TouchableOpacity>
                  ) : null
                }
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // ************************** Dynamic alert for function**********************
  calltoModal = (item) => {
    item.name != 'Other'
      ? item.is_image == 1
        ? this.setState({
            sendDataModal: true,
            msg: item.name,
            isReasonModal: false,
            isImage: item.is_image,
            isReschedule: item.is_reshedule,
          })
        : this.setState({
            msg: item.name,
            isReasonModal: false,
            isImage: item.is_image,
            isReschedule: item.is_reshedule,
          })
      : this.setState({
          msg: item.name,
          isReasonModal: false,
          otherComment: 'Other',
        });

    if (item.name == 'Other') {
      this.setState({
        msg: item.name,
        isReasonModal: false,
        otherComment: 'Other',
      });
    }

    if (item.is_image == 1 || item.is_reshedule) {
      this.setState({
        sendDataModal: true,
        msg: item.name,
        isReasonModal: false,
        isImage: item.is_image,
        isReschedule: item.is_reshedule,
        reason_id: item.id,
      });
    } else {
      this.setState({
        msg: item.name,
        isReasonModal: false,
        reason_id: item.id,
      });
    }
  };
  //**************************** finish the code of dynamic function********************************/

  // ***************** Capture the image *************************************
  captureImage = () => {
    options = {
      maxHeight: 1000,
      quality: 1, // 0 to 1, photos only
      storageOptions: {
        skipBackup: false,
      },
    };

    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let dataStorage = {uri: response.uri};
        this.setState({image: dataStorage});
        console.warn('FIRST RESPONCE', this.state.image.uri);
        // this.resize();
      }
    });
  };

  //***************************** Compress the image *******************************************/
  // resize = () => {
  //   console.log("RESIZE CALL", this.state.image.uri);
  //   CompressImage.createCompressedImage(this.state.image.uri, "Compress/Images")
  //     .then(({ uri }) => {
  //       // console.log(uri);
  //       let dataStorage = [{ uri: uri }, ...this.state.imgArray];
  //       this.setState({ imgArray: dataStorage });
  //       // console.log(this.state.dataStorage)
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  //***********************Delete images ********************************* */
  deleteItem = () => {
    this.setState({imgArray: []});
  };

  //*******************************************Sending reschedule data********************************
  sendRescheduleData = async () => {
    this.setState({sendDataModal: false, loading: true});
    console.warn('The images array ', JSON.stringify(this.state.imgArray));
    data = new FormData();

    await data.append('pickupId', this.state.pickup_id);
    await data.append('pickup_date', this.state.date);
    await data.append('start_time', this.state.startTime);
    await data.append('agent_id', this.state.agentId);
    await data.append('comments', this.state.msg);
    await data.append('activity_id', this.state.activity_id);
    await data.append('reason_id', this.state.reason_id);
    await data.append('customer_id', this.state.custemerId);

    await this.state.imgArray.map(async (item, index) => {
      // images array
      await data.append('images[]', {
        uri: item.uri,
        name: `photo${index + 1}.jpg`,
        type: 'image/jpg',
      });
    });

    console.warn('the dta of all sending ' + JSON.stringify(data));

    await fetch('https://docboyz.in/docboyzmt/api/activity_reschedule_new', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: data,
    })
      .then((res) => res.json())
      .then((resData) => {
        console.warn('The  response data of reschedule is', resData);
        if (resData.error == 0) {
          console.warn('success');

          if (resData.status == 40 || resData.status == 50) {
            console.warn('Status is ' + this.state.msg);
            if (this.state.startTime && this.state.date) {
              var date = 'Reschedule Date :' + this.state.date;
              var time = 'Reschedule Time :' + this.state.startTime;
              this.state.msg =
                '\n' + date + '\n' + time + '\n' + this.state.msg;
              this.sendReschedule();
            } else {
              this.sendSms();
            }

            this.props.navigation.replace('pickup');
          } else if (this.state.startTime && this.state.date) {
            var date = 'Reschedule Date :' + this.state.date;
            var time = 'Reschedule Time :' + this.state.startTime;
            this.state.msg = '\n' + date + '\n' + time + '\n' + this.state.msg;
            this.sendReschedule();
          } else {
            this.sendSms();
          }
        } else if (resData.error == 1) {
          console.warn('Something went wrong');
        }
      })
      .catch((error) => {
        console.warn('catch error found ', error.message);
        this.setState({
          reason_id: '',
          imgArray: [],
          startTime: '',
          date: '',
          msg: '',
          isImage: '',
          isReschedule: '',
        });
      });
  };
  //*******************************************Sending reschedule data end********************************
}

const styles = StyleSheet.create({
  Main: {
    flex: 1,
    backgroundColor: '#eeeeee',
  },
  header: {},
  bottom: {
    flexDirection: 'row',
    marginTop: 10,
  },
  InputText: {
    fontSize: 16,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: 'black',
    borderRadius: 25,
    margin: 10,
    width: '75%',
    height: 45,
  },
  message: {
    width: '50%',
    justifyContent: 'flex-end',
    backgroundColor: '#bdbdbd',
    marginRight: 10,
    borderRadius: 7,
    padding: 10,
    flex: 1,
    alignSelf: 'flex-end',
  },
  receive: {
    width: '50%',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    marginLeft: 10,
    borderRadius: 7,
    padding: 10,
    flex: 1,
    alignSelf: 'flex-start',
  },
  modal: {
    flex: 1,
    // backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  modaltext: {
    color: '#3f2949',
    marginTop: 10,
  },
  modalDialog: {
    width: '85%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 30,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowColor: '#FFFFFF',
    elevation: 10,
  },
});

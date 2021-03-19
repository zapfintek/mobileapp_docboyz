import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableHighlight,
  Linking,
  Alert,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  StatusBar,
  LogBox,
} from 'react-native';
import {Icon, Divider} from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-community/async-storage';
import {TextInput} from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'Zapfin1.db'});
const pkg = require('../../package.json');
import styles, {normalize} from './styles';

export default class AcitveScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      pickup_Array: [],
      isModalVisible: true,
      Active_data: [], //Store Active data
      Accepted_data: [], //Store Accepted data
      Assign_data: [], //Sore Assign Data
      pictureData: [], // use for assign pickups pictures
      agentId: '', //Store Agent Id
      loading: '', //Loading
      scroll: '', //On Scroll
      Cancel: 1, //On Cancel the Button
      refreshing: false, //Refresh the page
      playStoreLink: '', //Store Sore Link,
      count: 1,
      totalPages: 0,
      PickupsData: [],
      ActivityData: [],
      internt: true,
      agentType: '', // Agent type eg. c , p ,d
      allCallcenterData: [],
    };
    this.onSelectedItems = this.onSelectedItems.bind(this); //For select item from Model
  }

  componentDidMount() {
    this.setState({value: ''});
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this.InterNetConnection();
    });
  }

  InterNetConnection = async () => {
    NetInfo.fetch().then(async (state) => {
      if (state.isConnected == true) {
        await AsyncStorage.getItem('AGENT_ID', (err, result) => {
          if (result != '') {
            this.setState({
              agentId: result,
              internt: true,
              loading: true,
              PickupsData: [],
              ActivityData: [],
              allCallcenterData: [],
            });
          }
        });
        // var agentType = await AsyncStorage.getItem('AgentType');
        // if (agentType == 'c') {
        //   this.setState({
        //     agentType: agentType,
        //     loading: true,
        //   });
        // }
        this.versionUpdate();
        await this.assign_Pickups();
      } else {
        this.selectDataFromLocal();

        Snackbar.show({
          text: 'No internet',
          duration: Snackbar.LENGTH_LONG,
        });
      }
    });
  };

  callCeneterData = async (pickupId) => {
    await fetch('https://docboyz.in/docboyzmt/api/callcenter_all_activity', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({pickupId: pickupId}),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.error == 0) {
          this.setState({allCallcenterData: resData.pickup_details}, () => {
            this.setState({});
          });
        }
      })
      .catch((error) => {
        console.log('error in catch ' + error.message);
      });
  };

  assign_Pickups = async () => {
    fetch('https://docboyz.in/docboyzmt/api/activity_assignPickupList', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId: this.state.agentId,
      }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        // console.warn('assing res', res);
        if (res.error == 0) {
          this.setState({assignData: res.assign_pickups});
          let NewInsertData = await res.assign_pickups.map((item) => {
            item.agent_Id = this.state.agentId;
            return item;
          });
          setTimeout(() => {
            this.RemoveAssignData(NewInsertData);
          }, 1000);
        } else {
          this.ActivePickupListData();
        }
      })
      .catch((error) => {
        this.ActivePickupListData();
        Snackbar.show({
          text: 'Something problem in assign pickups',
          duration: Snackbar.LENGTH_LONG,
        });
      });
  };

  // ******************** Send data in call center ******************
  sendCallCenterData = async (pickupid, activityid, customerid) => {
    await fetch('https://docboyz.in/docboyzmt/api/activity_chat_store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: this.state.agentId,
        pickup_id: pickupid,
        company_id: customerid,
        message: 'You have called the customer',
        activity_id: activityid,
      }),
    })
      .then((response) => response.json())
      .then((sendData) => {
        console.log('Send Data of assign', sendData);
      })
      .catch((error) => {
        console.log('catch error found', error.message);
        Snackbar.show({
          text: 'Something wrong please try again',
          duration: Snackbar.LENGTH_LONG,
        });
      });
  };
  //***************** Send data to chat it is finish *********************** */

  RemoveAssignData = async (removeData) => {
    await db.transaction(async function (tx) {
      var AllDataPickups = 'DELETE FROM Pickups';
      var AllDataPickupsDocs = 'DELETE FROM PickupDocument';
      var AllDataId = 'DELETE FROM PickupId';
      var AllDataActivity = 'DELETE FROM Activity';
      var Comments = 'DELETE FROM Comments';

      tx.executeSql(
        AllDataPickups,
        [],
        function (tx, res) {
          console.log('removeId: ' + res.id);
          console.log('remove rowsAffected Pickups: ' + res.rowsAffected);
        },
        function (tx, error) {
          console.log('DELETE error Pickups: ' + error.message);
        },
      );

      tx.executeSql(
        AllDataPickupsDocs,
        [],
        function (tx, res) {
          //Pickup Docs
          console.warn('removeId: ' + res.id);
          console.warn(
            'remove rowsAffected PickupDocument: ' + res.rowsAffected,
          );
        },
        function (tx, error) {
          console.log('DELETE error PickupDocument: ' + error.message);
        },
      );
      tx.executeSql(
        AllDataId,
        [],
        function (tx, res) {
          // Activity Id
          console.log('removeId: ' + res.id);
          console.log('remove rowsAffected PickupId: ' + res.rowsAffected);
        },
        function (tx, error) {
          console.log('DELETE error PickupId: ' + error.message);
        },
      );

      tx.executeSql(
        AllDataActivity,
        [],
        function (tx, res) {
          // Activity
          console.log('removeId: ' + res.id);
          console.log(
            'remove rowsAffected PickupActivity: ' + res.rowsAffected,
          );
        },
        function (tx, error) {
          console.log('DELETE error PickupActivity: ' + error.message);
        },
      );
      tx.executeSql(
        Comments,
        [],
        function (tx, res) {
          // pickups
          console.log('removeId: ' + res.id);
          console.log('remove rowsAffected Comments: ' + res.rowsAffected);
        },
        function (tx, error) {
          console.log('DELETE error Comments: ' + error.message);
        },
      );
    });

    setTimeout(() => {
      this.InsertAssignDataInDb(removeData);
    }, 1000);
  };

  InsertAssignDataInDb = async (NewInsertData) => {
    console.log(NewInsertData);
    db.transaction(async (tx) => {
      var pickup =
        'INSERT INTO Pickups ( pickups_id,customer_id,product_name,pickup_status, pickup_person, home_address, city, pincode, office_address,preferred_start_time,preferred_end_time, mobile,  pickup_date , activity_status, transaction_id,agent_id, total_activity,remaining_activity) VALUES(  ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ,?)';
      var pickupid =
        'INSERT INTO PickupId ( pickups_id,agent_id) VALUES(  ? , ? )';
      var activity =
        'INSERT INTO Activity ( activity_id,name,pickups_id, activity_status ) VALUES( ?, ? , ? , ? )';
      var PickupDocument =
        'INSERT INTO PickupDocument (que_id,question,is_image,sequence,comments,pickups_id,activity_id,activity_name,image_type,is_video,video_questions,QuestionLinks,product_name) VALUES( ? ,  ? , ? , ? , ? , ? ,?, ? , ? , ? , ?, ?, ?)';
      var Comments =
        'INSERT INTO Comments (que_id,value,pickups_id,activity_id) VALUES( ? ,  ? , ? , ? )';

      await NewInsertData.map((x, y) => {
        tx.executeSql(
          pickup,
          [
            x.pickup_id,
            x.customer_id,
            x.product_name,
            x.status,
            x.pickup_person,
            x.home_address,
            x.city,
            x.pincode,
            x.office_address,
            x.preferred_start_time,
            x.preferred_end_time,
            x.mobile,
            x.pickup_date,
            x.activity_status,
            x.transaction_id,
            x.agent_Id,
            x.total_activity,
            x.remain_activity,
          ],
          (tx, results) => {
            console.warn('insert pickups Results', results.rowsAffected);
          },
          (err) => {
            console.warn('insert pickups table', err);
          },
        );

        tx.executeSql(
          pickupid,
          [x.pickup_id, x.agent_Id],
          (tx, results) => {
            console.warn('insert pickupsId Results', results.rowsAffected);
          },
          (err) => {
            console.log('delete pickups table', err);
          },
        );

        x.activity.map(async (a, p) => {
          tx.executeSql(
            activity,
            [a.activity_id, a.name, a.pickup_id, a.activity_status],
            (tx, result) => {
              console.log('insert activity Results', result.rowsAffected);
            },
            (err) => {
              console.log('delete activity table', err);
            },
          );
          let activity_name = await a.name;
          let product_name = await x.pickup_person;
          let Document = await a.documents.map((item) => {
            item.activity_name = activity_name;
            item.product_name = product_name;
            return item;
          });

          Document.map(async (d, p) => {
            tx.executeSql(
              PickupDocument,
              [
                d.id,
                d.question,
                d.is_image,
                d.sequence,
                d.comments,
                d.pickup_id,
                d.activity_id,
                d.activity_name,
                d.type,
                d.is_video,
                d.addon_question,
                d.link,
                d.product_name,
              ],
              (tx, result) => {
                console.log(
                  'insert PickupDocument Results',
                  result.rowsAffected,
                );
              },
              (err) => {
                console.log('delete PickupDocument table', err);
              },
            );
            let QUI_ID = await d.id;
            let PICKUP_ID = await d.pickup_id;
            let ACTIVITY_ID = await d.active_id;
            let Storage = [];
            d.comentsArray.map(async (currElement, index) => {
              await Storage.push({
                value: currElement,
                pickupId: d.pickup_id,
                que_id: d.id,
                activity_id: d.activity_id,
              });
            });
            Storage.map(async (p) => {
              tx.executeSql(
                Comments,
                [p.que_id, p.value, p.pickupId, p.activity_id],
                (tx, result) => {
                  console.log('insert Comment Results', result.rowsAffected);
                },
                (err) => {
                  console.log('delete comeent table', err);
                },
              );
            });
          });
        });
        setTimeout(() => {
          this.selectDataFromLocal();
        }, 1000);
      });
    });
  };

  selectDataFromLocal = async () => {
    this.setState({loading: true});
    var {agentId} = this.state;
    var pickupid = 'SELECT * FROM PickupId where agent_id = ?';
    var pickupArray = [];
    console.warn('agent id', agentId);
    await db.transaction(async (tx) => {
      tx.executeSql(pickupid, [agentId], async (tx, results) => {
        console.log('Query Activity select', results);
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          await pickupArray.push(row);
        }
        console.warn('pickup is dara', pickupArray);
      });
      setTimeout(() => {
        this.LocalData(pickupArray);
      }, 1000);
    });
  };

  LocalData = async (pickup_Array) => {
    var LENGTH_LONG = (await pickup_Array.length) - 1;
    await db.transaction(async (tx) => {
      var Pickups = 'SELECT * FROM Pickups where pickups_id = ?';
      var Activity = 'SELECT * FROM Activity where pickups_id = ?';
      pickup_Array.map(async (a) => {
        this.state.ActivityData = [];
        tx.executeSql(Activity, [a.pickups_id], async (tx, results) => {
          var len = results.rows.length;
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            this.state.ActivityData.push(row);
          }
        });
      });

      for (p = 0; p < pickup_Array.length; p++) {
        tx.executeSql(
          Pickups,
          [pickup_Array[p].pickups_id],
          async (tx, results) => {
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              this.state.PickupsData.push(results.rows.item(i));
            }
            for (p = 0; p < this.state.PickupsData.length; p++) {
              var activity = [];
              for (q = 0; q < this.state.ActivityData.length; q++) {
                if (
                  this.state.ActivityData[q].pickups_id ==
                  this.state.PickupsData[p].pickups_id
                ) {
                  activity.push(this.state.ActivityData[q]);
                }
              }
              this.state.PickupsData[p].activity = activity;
            }
          },
        );
      }
      if (this.state.internt == true) {
        setTimeout(async () => {
          await this.ActivePickupListData(this.state.PickupsData);
        }, 1000);
      } else {
        setTimeout(async () => {
          if (this.state.PickupsData) {
            var Data3 = [...this.state.PickupsData];
            Snackbar.show({
              text: 'No new cases to accept',
              duration: Snackbar.LENGTH_LONG,
            });
            this.setState({data3: Data3, loading: false});
          }
        }, 2000);
      }
    });
  };

  versionUpdate = () => {
    fetch('https://docboyz.in/docboyzmt/api/vupdate', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(
        (response) => response.json(), //ADDED >JSON() HERE
        (error) => console.log('An error occurred.', error),
      )
      .then((res) => {
        this.setState({playStoreLink: res.url});
        if (res.vno !== pkg.version) {
          // Alert.alert(
          //   'Update',
          //   'Update New Version',
          //   [
          //     {
          //       text: 'Install',
          //       onPress: () => this.onButtonPress(),
          //     },
          //   ],
          //   {
          //     cancelable: false,
          //   },
          // );
        } else {
          console.log('version updated');
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  onButtonPress = async () => {
    Linking.openURL(this.state.playStoreLink);
  };

  search = () => {
    if (this.state.text) {
      this.setState({loading: true, Cancel: 0});
      fetch('https://docboyz.in/docboyzmt/api/searchpickup', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: this.state.agentId,
          searchdata: this.state.text,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.warn('search res', res);
          if (res.error == 0) {
            const {error, pickups: Search} = res;
            const {current_page, data: Data} = Search;
            this.setState({loading: false, data3: Data});
            this.setState({
              count: res.pickups.current_page,
              totalPages: res.pickups.last_page,
            });
          } else {
            this.setState({loading: false, text: ''});
            Snackbar.show({
              text: 'There Is No Search Pickup',
              duration: Snackbar.LENGTH_LONG,
            });
          }
        })
        .catch((error) => {
          this.setState({error, loading: false});
        });
    } else {
      this.setState({Cancel: 1});
      Snackbar.show({
        text: 'Please Enter The Text',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  Cancel = () => {
    this.setState({text: '', Cancel: 1});
    if (this.state.isCallCenter == 'c') {
      this.ActivePickupListData();
    } else {
      this.InterNetConnection();
    }
  };

  scroll = () => {
    this.setState({scroll: 1});
  };

  nextData = async () => {
    // use for pagination
    let {agentId, text} = this.state;
    console.log('the count' + this.state.count);
    var urlLink = '';
    if (text == '') {
      urlLink = 'activity_active_pickup_list?page';
    } else {
      urlLink = 'searchpickup?page';
    }

    await fetch(
      `"https://docboyz.in/docboyzmt/api/${urlLink}=${this.state.count}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: agentId,
        }),
      },
    )
      .then((res) => res.json())
      .then((res) => {
        console.log('pagination res', res);
        this.setState({
          count: res.pickups.current_page,
          totalPages: res.pickups.last_page,
        });
        this.setState({
          data3: [...this.state.data3, ...res.pickups.data],
        });
      })
      .catch((error) => {
        console.log('Active error', error);
        this.setState({error});
      });
  };

  cancel = () => {
    this.SectionedMultiSelect._removeAllItems();
  };

  onRefresh = () => {
    if (this.state.isCallCenter == 'c') {
      this.setState({allCallcenterData: []});
    } else {
      this.InterNetConnection();
    }
  };

  onSelectedItemsChange = (selectedItems) => {
    this.setState({selectedItems});
  };

  onSelectedItems = (id, transaction_id, decline) => {
    console.warn();
    this.SectionedMultiSelect._removeAllItems();
    if (decline == 'declinePickup') {
      if (this.state.selectedItems == '') {
        Alert.alert(
          'Oops,Something went wrong..!',
          'Please select the activity',
          [
            {
              text: 'OK',
              onPress: () => console.log('OK Pressed'),
            },
          ],
          {
            cancelable: false,
          },
        );
      } else {
        this.DeclinePickup(id, transaction_id, this.state.selectedItems); //Decline call for Decline pickup
      }
    } else {
      if (this.state.selectedItems == '') {
        Alert.alert(
          'Oops,Something went wrong..!',
          'Please select one activity',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
      } else {
        this.AcceptPickup(this.state.selectedItems, id, transaction_id); //Accept call for accept pickup
      }
    }
  };

  DeclinePickup = (id, transaction_id, selectedItems) => {
    this.props.navigation.navigate('Decline', {
      Array_data: selectedItems,
      pickupId: id,
      t_id: transaction_id,
    });
  };

  AcceptPickup = async (selectedItems, id, transaction_id) => {
    await fetch('https://docboyz.in/docboyzmt/api/activity_accept_pickup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId: this.state.agentId,
        pickupId: id,
        activity_id: selectedItems,
        transaction_id: transaction_id,
      }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        console.log('accept pickups list', res);
        if (res.error == 2) {
          Alert.alert(
            'Already accepted by other FC',
            res.message,
            [
              {
                text: 'OK',
                onPress: () => this.InterNetConnection(),
              },
            ],
            {
              cancelable: false,
            },
          );
        } else if (res.error == 0) {
          console.log('assign calll');
          this.setState({loading: true});
          this.InsertRepublushData(id, selectedItems);
          this.InterNetConnection();
          this.InsertRepublushData(id, selectedItems);
        }
      })
      .catch((error) => {
        this.setState({error, loading: false});
      });
  };

  InsertRepublushData = async (id, active_id) => {
    fetch('https://docboyz.in/docboyzmt/api/activity_get_old_data_signed', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId: this.state.agentId,
        pickupId: id,
        activity_id: active_id,
      }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        console.warn('republish res', res);
        if (res.doc_detail.length <= 0) {
          console.log('No republish data');
        } else {
          var array_new = await res.doc_detail;
          await db.transaction(async (tx) => {
            let query =
              'INSERT INTO PickupDocumentPictures (pickups_document_id,filename,filepath,latitude,longitude,pickups_id,activity_id ) VALUES( ?, ? , ? ,  ? , ? , ? , ?  )';

            for (i = 0; i < array_new.length; i++) {
              await array_new[i].documents.map(async (x, y) => {
                if (x.pictures.length > 0) {
                  tx.executeSql(
                    query,
                    [
                      x.id,
                      x.comments,
                      x.filename,
                      x.latitude,
                      x.longitude,
                      x.pickup_id,
                      x.activity_id,
                    ],
                    (tx, results) => {
                      console.warn('Results of accept insert', results);
                    },
                    (err) => {
                      console.log('Insert error' + err);
                    },
                  );
                } else {
                  tx.executeSql(
                    query,
                    [
                      x.id,
                      x.comments,
                      null,
                      x.latitude,
                      x.longitude,
                      x.pickup_id,
                      x.activity_id,
                    ],
                    (tx, results) => {
                      console.warn('Results of accept insert', results);
                    },
                    (err) => {
                      console.log('Insert error' + err);
                    },
                  );
                }
              });
            }
          });
        }
      })
      .catch((error) => {
        console.log('catch error', error);
      });
  };

  ActivePickupListData = async () => {
    await fetch(
      'https://docboyz.in/docboyzmt/api/activity_active_pickup_list',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({agentId: this.state.agentId}),
      },
    )
      .then((res) => res.json())
      .then((res) => {
        console.warn('active', res);
        if (res.error == 0) {
          if (res.pickups.data && this.state.PickupsData) {
            var Data3 = [...this.state.PickupsData, ...res.pickups.data];
            this.setState({data3: Data3, loading: false});
          } else if (res.pickups.data) {
            var Data3 = [...res.pickups.data];
            this.setState({data3: Data3, loading: false});
          } else if (this.state.PickupsData) {
            var Data3 = [...this.state.PickupsData];
            Snackbar.show({
              text: 'No new cases to accept.',
              duration: Snackbar.LENGTH_LONG,
            });
            this.setState({data3: Data3, loading: false});
          }
          this.setState({
            count: res.pickups.current_page,
            totalPages: res.pickups.last_page,
          });
        } else {
          var Data3 = [...this.state.PickupsData];
          this.setState({data3: Data3, loading: false});
          console.log(' data', this.state.data3);
          Snackbar.show({
            text: 'No new cases to accept.',
            duration: Snackbar.LENGTH_LONG,
          });
        }
      })
      .catch((error) => {
        this.setState({error, loading: false});
      });
  };

  startPickup = (id) => {
    console.log('Pickup id .... ', id);
    this.props.navigation.navigate('PickupDetailsScreen', {
      pickupId: id,
      status: '',
    });
  };

  call = async (number, item) => {
    console.log(this.state.agentType);
    if (this.state.agentType == 'c') {
      await fetch('https://docboyz.in/docboyzmt/api/update-ivr-data', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: this.state.agentId,
          pickup_id:
            item.activity_status == 30 ? item.pickups_id : item.pickup_id,
        }),
      })
        .then((res) => res.json())
        .then(async (res) => {
          console.warn('ivr', res);
          if (res.error == 0) {
            Snackbar.show({
              text: 'Call connected please wait',
              duration: Snackbar.LENGTH_LONG,
            });

            if (this.state.agentType == 'c' && item.activity_status == 20) {
              await this.callCeneterData(item.pickup_id);
              var PICKUPID = item.pickup_id;
              var ACTIVITYID = [];
              ACTIVITYID.push(item.activity[0].activity_id);
              var TRANSACTIONID = item.transaction_id;
              this.AcceptPickup(ACTIVITYID, PICKUPID, TRANSACTIONID);
              this.sendCallCenterData(
                item.pickup_id,
                item.activity[0].activity_id,
                item.customer_id,
              );
            }
            if (this.state.agentType == 'c' && item.activity_status == 30) {
              await this.callCeneterData(item.pickups_id);
              this.sendCallCenterData(
                item.pickups_id,
                item.activity[0].activity_id,
                item.customer_id,
              );
            }
          } else {
            if (this.state.agentType == 'c' && item.activity_status == 20) {
              Linking.openURL('tel:' + encodeURIComponent(number)); // call on system
              await this.callCeneterData(item.pickup_id);
              var PICKUPID = item.pickup_id;
              var ACTIVITYID = [];
              ACTIVITYID.push(item.activity[0].activity_id);
              var TRANSACTIONID = item.transaction_id;
              this.AcceptPickup(ACTIVITYID, PICKUPID, TRANSACTIONID);
              this.sendCallCenterData(
                item.pickup_id,
                item.activity[0].activity_id,
                item.customer_id,
              );
            }
            if (this.state.agentType == 'c' && item.activity_status == 30) {
              Linking.openURL('tel:' + encodeURIComponent(number)); // call on system
              await this.callCeneterData(item.pickups_id);
              this.sendCallCenterData(
                item.pickups_id,
                item.activity[0].activity_id,
                item.customer_id,
              );
            }
          }
        })
        .catch((error) => {
          console.warn(error);
        });
    } else {
      if (this.state.agentType == '' && item.activity_status == 30) {
        Linking.openURL('tel:' + encodeURIComponent(number)); // call on system
        // await this.callCeneterData(item.pickups_id);
        // this.sendCallCenterData(
        //   item.pickups_id,
        //   item.activity[0].activity_id,
        //   item.customer_id,
        // );
      }
    }
  };

  callcenterAccept = async (item) => {
    var ACTIVITYID = [];
    var PICKUPID = await item.pickup_id;
    var TRANSACTIONID = await item.transaction_id;
    var array = await item.activity;
    console.log(array);
    array.length == 0
      ? Snackbar.show({
          text: 'Therer is no activity',
          duration: Snackbar.LENGTH_LONG,
        })
      : await ACTIVITYID.push(item.activity[0].activity_id);
    this.AcceptPickup(ACTIVITYID, PICKUPID, TRANSACTIONID);
  };

  _renderItem({item}) {
    return (
      <View style={styles.box}>
        <Text style={styles.text}>{item.office_pincode}</Text>
      </View>
    );
  }

  render() {
    let {data3} = this.state;
    // console.warn(data3);
    var ActualArray = [];
    if (data3 != undefined && data3 != '') {
      data3.forEach((obj) => {
        if (!ActualArray.some((o) => o.transaction_id === obj.transaction_id)) {
          ActualArray.push({
            ...obj,
          });
        }
      });
    }
    // console.warn("main",ActualArray);

    if (this.state.loading) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}>
          <ActivityIndicator size="large" color="black" />
        </View>
      );
    }

    return (
      <ScrollView
        onMomentumScrollEnd={(e) => {
          var c = 1;
          const scrollPosition = e.nativeEvent.contentOffset.y;
          const scrollViewHeight = e.nativeEvent.layoutMeasurement.height;
          const contentHeight = e.nativeEvent.contentSize.height;
          const isScrolltoBottom = scrollViewHeight + scrollPosition;
          console.log('call for scrolldown' + this.state.totalPages);

          if (
            isScrolltoBottom >= contentHeight - 50 &&
            this.state.count < this.state.totalPages
          ) {
            this.setState({count: this.state.count + 1});
            this.nextData();
            // this.setState({count:this.state.count+1},()=>{
            //   this.nextData();
            // })
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            progressBackgroundColor={{color: 'red'}}
          />
        }
        onScroll={this.scroll}>
        <View style={styles.container}>
          <StatusBar hidden={false} backgroundColor="red" />
          {this.state.allCallcenterData.length > 0
            ? //  <CallCenterModal dataFromParent = {this.state.allCallcenterData}/>
              this.props.navigation.navigate('', {
                dataFromParent: this.state.allCallcenterData,
              })
            : null}
          {this.state.scroll == 1 ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{flex: 1, height: 30, marginBottom: 10, marginTop: -8}}>
                <TextInput
                  style={styles.serchBox}
                  onChangeText={(text) => this.setState({text})}
                  placeholder="Search Pickup here...."
                  value={this.state.text}
                />
              </View>
              {this.state.Cancel == 1 ? (
                <View style={{height: 30, width: '20%', marginTop: 5}}>
                  <TouchableHighlight
                    style={styles.searchButoon}
                    underlayColor="#1B547C"
                    onPress={this.search}>
                    <Text style={styles.searchText}>Search</Text>
                  </TouchableHighlight>
                </View>
              ) : (
                <View style={{height: 30, width: '20%', marginTop: 5}}>
                  <TouchableHighlight
                    style={styles.searchButoon}
                    underlayColor="#1B547C"
                    onPress={this.Cancel}>
                    <Text style={styles.searchText}>Cancel</Text>
                  </TouchableHighlight>
                </View>
              )}
            </View>
          ) : null}
          <FlatList
            data={ActualArray}
            keyExtractor={(item, index) => item.pickup_id}
            renderItem={({item, index}) => (
              <View
                style={[
                  styles.listView1,
                  {
                    backgroundColor:
                      item.activity_status == 30 ? 'pink' : '#FFFFFF',
                  },
                ]}>
                <View style={styles.listView2}>
                  <View style={styles.listView3}>
                    <View style={{width: '80%'}}>
                      <Text style={styles.productNmae}>
                        {item.product_name} -
                      </Text>
                    </View>
                    <View style={styles.listView4}>
                      <TouchableOpacity
                        onPress={
                          item.activity_status == 30 ||
                          this.state.agentType == 'c'
                            ? () =>
                                Alert.alert(
                                  'Call',
                                  `Do you want to call customer`, //${item.mobile}
                                  [
                                    {
                                      text: 'Cancel',
                                      onPress: () =>
                                        console.log('Cancel Pressed'),
                                      style: 'cancel',
                                    },
                                    {
                                      text: 'OK',
                                      onPress: () =>
                                        this.call(item.mobile, item),
                                    },
                                  ],
                                  {
                                    cancelable: false,
                                  },
                                )
                            : null
                        }>
                        <Icon
                          type="material-community"
                          name={'phone'}
                          size={normalize(20)}
                          color="slateblue"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={[styles.listView4, {justifyContent: 'flex-start'}]}>
                    <Text style={styles.pickupPerson}>
                      {item.pickup_person}
                    </Text>
                  </View>
                  {this.state.agentType !== 'c' ? (
                    <View>
                      <View style={[styles.listView4, {marginTop: 5}]}>
                        <Icon
                          type="material-community"
                          name={'home'}
                          size={normalize(15)}
                          color="green"
                          containerStyle={{}}
                        />
                        <Text style={styles.addressText}>
                          {item.home_address}
                        </Text>
                      </View>
                      <View style={[styles.listView4, {marginTop: 5}]}>
                        <Icon
                          type="material-community"
                          name={'wallet-travel'}
                          size={normalize(15)}
                          color="green"
                        />
                        <Text style={styles.addressText}>
                          {item.office_address}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                  <View>
                    <Divider style={styles.divider} />
                  </View>
                  <View style={[styles.listView3, {marginTop: 1}]}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.cityText}>{item.city} -</Text>
                      <Text style={styles.cityText}>{item.pincode}</Text>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                      {this.state.agentType == 'c' &&
                      item.activity_status == 30 ? (
                        <View style={{flexDirection: 'row', marginLeft: 3}}>
                          {item.activity_status == 30 ? (
                            <Text style={styles.cityText}>
                              Remaining {item.remaining_activity}/
                              {item.total_activity}{' '}
                            </Text>
                          ) : null}
                          <TouchableHighlight
                            style={{marginLeft: 8, marginRight: 3}}
                            onPress={() =>
                              item.activity_status !== 20
                                ? this.props.navigation.navigate('ChatScreen', {
                                    ITEM: item,
                                    ActivityId: item.activity[0].activity_id,
                                    Activity_name: item.activity[0].name,
                                    ActiveScreen: 1,
                                  })
                                : null
                            }
                            underlayColor="mediumseagreen">
                            <Icon
                              type="material-community"
                              name={'forum'}
                              size={normalize(15)}
                              color="mediumseagreen"
                            />
                          </TouchableHighlight>
                        </View>
                      ) : (
                        <View
                          style={{
                            flexDirection: 'row',
                            marginLeft: normalize(25),
                          }}>
                          <Icon
                            type="material-community"
                            name={'signal-cellular-3'}
                            size={normalize(15)}
                            color="slateblue"
                            containerStyle={{marginLeft: normalize(10)}}
                          />
                          <Text style={styles.addressText}>
                            Status-{item.pickup_status}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View>
                    <Divider style={styles.divider} />
                  </View>
                  <View style={styles.listView5}>
                    <View style={{flexDirection: 'row'}}>
                      <Icon
                        type="material-community"
                        name={'clipboard-text'}
                        size={normalize(15)}
                        color="slateblue"
                      />
                      <Text style={styles.pickup_date}>{item.pickup_date}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Icon
                        type="material-community"
                        name={'clock-outline'}
                        size={normalize(15)}
                        color="slateblue"
                      />
                      <Text style={styles.pickup_date}>
                        {item.preferred_start_time}-{item.preferred_end_time}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Divider style={styles.divider} />
                  </View>
                </View>
                {item.activity_status === 20 ? (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}>
                    {this.state.agentType == 'c' ? ( // this is for accept call center button
                      <TouchableOpacity
                        onPress={() => this.callcenterAccept(item)}
                        style={styles.acceptPickupButton}>
                        <Text style={styles.acceptPickupButtonText}>
                          Accept
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <SectionedMultiSelect
                        ref={(SectionedMultiSelect) =>
                          (this.SectionedMultiSelect = SectionedMultiSelect)
                        }
                        items={item.activity}
                        IconRenderer={Icon}
                        uniqueKey="activity_id"
                        selectText="                                       Accept"
                        showDropDowns={true}
                        readOnlyHeadings={false}
                        onSelectedItemsChange={this.onSelectedItemsChange}
                        selectedItems={this.state.selectedItems}
                        showCancelButton={true}
                        onConfirm={() =>
                          this.onSelectedItems(
                            item.pickup_id,
                            item.transaction_id,
                          )
                        }
                        onCancel={this.cancel}
                        hideSearch
                        showChips={false}
                        headerComponent={
                          <View>
                            <Text
                              style={{
                                fontSize: normalize(18),
                                fontWeight: 'bold',
                                alignSelf: 'center',
                                color: 'black',
                              }}>
                              Select Activities
                            </Text>
                          </View>
                        }
                        styles={{
                          container: {
                            maxWidth: normalize(300),
                            maxHeight: normalize(300),
                            padding: normalize(20),
                            fontSize: normalize(16),
                            marginLeft: normalize(30),
                            marginTop: normalize(25),
                            justifyContent: 'center',
                          },
                          selectToggleText: {
                            backgroundColor: '#1B547C',
                            fontSize: normalize(14),
                            fontWeight: 'bold',
                            color: 'white',
                            paddingTop: normalize(5),
                          },
                          button: {
                            borderRadius: 7,
                            height: normalize(35),
                            backgroundColor: '#1B547C',
                          },
                          cancelButton: {
                            borderRadius: 7,
                            marginRight: 10,
                            height: normalize(35),
                            backgroundColor: 'red',
                          },
                          subItem: {
                            fontSize: normalize(16),
                            fontWeight: 'bold',
                            marginLeft: normalize(20),
                          },
                          selectToggle: {
                            marginRight: 0,
                            backgroundColor: '#1B547C',
                            marginLeft: 0,
                            height: normalize(30),
                            width: '100%',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                          },
                          itemText: {
                            color: this.state.selectedItems.length
                              ? 'black'
                              : 'black',
                            fontSize: normalize(16),
                            marginTop: normalize(15),
                          },
                          selectedItemText: {
                            color: 'black',
                          },
                          subItemText: {
                            color: this.state.selectedItems.length
                              ? 'black'
                              : 'black',
                            fontSize: normalize(16),
                            fontWeight: '500',
                          },
                          selectedSubItemText: {
                            color: 'red',
                            fontSize: normalize(16),
                            fontWeight: '500',
                          },
                        }}
                      />
                    )}
                  </View>
                ) : item.activity_status == 30 ? (
                  <View
                    style={[
                      styles.listView3,
                      {
                        marginBottom: 5,
                      },
                    ]}>
                    <TouchableOpacity
                      style={styles.startPickupButton}
                      onPress={() => this.startPickup(item.pickups_id)}
                      underlayColor="#1B547C">
                      {this.state.agentType == 'c' ? (
                        <Text style={styles.assignPickupButtonText}>
                          Assign Pickup
                        </Text>
                      ) : (
                        <Text style={styles.acceptPickupButtonText}>
                          {'  '}Start Pickup
                        </Text>
                      )}
                    </TouchableOpacity>
                    <SectionedMultiSelect
                      ref={(SectionedMultiSelect) =>
                        (this.SectionedMultiSelect = SectionedMultiSelect)
                      }
                      items={item.activity}
                      IconRenderer={Icon}
                      uniqueKey="activity_id"
                      selectText="     Decline"
                      showDropDowns={true}
                      readOnlyHeadings={false}
                      onSelectedItemsChange={this.onSelectedItemsChange}
                      selectedItems={this.state.selectedItems}
                      showCancelButton={true}
                      onConfirm={() =>
                        this.onSelectedItems(
                          item.pickups_id,
                          item.transaction_id,
                          (decline = 'declinePickup'),
                        )
                      }
                      onCancel={this.cancel}
                      hideSearch
                      showChips={false}
                      headerComponent={
                        <View>
                          <Text
                            style={{
                              fontSize: normalize(18),
                              fontWeight: 'bold',
                              alignSelf: 'center',
                              color: 'black',
                            }}>
                            Select Activities
                          </Text>
                        </View>
                      }
                      styles={{
                        container: {
                          maxWidth: normalize(300),
                          maxHeight: normalize(300),
                          padding: normalize(20),
                          fontSize: normalize(16),
                          marginLeft: normalize(30),
                          marginTop: normalize(25),
                          justifyContent: 'center',
                        },
                        selectToggleText: {
                          backgroundColor: '#1B547C',
                          fontSize: normalize(14),
                          fontWeight: 'bold',
                          color: 'white',
                          paddingTop: normalize(5),
                        },
                        button: {
                          borderRadius: 7,
                          height: normalize(35),
                          backgroundColor: '#1B547C',
                        },
                        cancelButton: {
                          borderRadius: 7,
                          marginRight: 10,
                          height: normalize(35),
                          backgroundColor: 'red',
                        },
                        subItem: {
                          fontSize: normalize(16),
                          fontWeight: 'bold',
                          marginLeft: normalize(20),
                        },
                        selectToggle: {
                          marginRight: 0,
                          backgroundColor: '#1B547C',
                          marginLeft: 0,
                          height: normalize(30),
                          width: normalize(130),
                          justifyContent: 'center',
                          alignItems: 'center',
                        },
                        itemText: {
                          color: this.state.selectedItems.length
                            ? 'black'
                            : 'black',
                          fontSize: normalize(16),
                          marginTop: normalize(15),
                        },
                        selectedItemText: {
                          color: 'black',
                        },
                        subItemText: {
                          color: this.state.selectedItems.length
                            ? 'black'
                            : 'black',
                          fontSize: normalize(16),
                          fontWeight: '500',
                        },
                        selectedSubItemText: {
                          color: 'red',
                          fontSize: normalize(16),
                          fontWeight: '500',
                        },
                      }}
                    />
                  </View>
                ) : item.pickup_status === 'ResumePickup' ? (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'center',
                      marginTop: -10,
                    }}>
                    <TouchableOpacity
                      style={styles.resumeButton}
                      onPress={() => this.startPickup(item.pickups_id)}
                      underlayColor="#1B547C">
                      <Text style={styles.resumeText}>Resume-Pickup</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            )}
            keyExtractor={(item) => item.pickups_id} //  ItemSeparatorComponent={this.renderSeparator}
            rightIcon={{name: 'none'}}
          />
        </View>
      </ScrollView>
    );
  }
}

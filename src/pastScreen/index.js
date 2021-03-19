import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableHighlight,
  Linking,
  TouchableOpacity,
  Alert,
  RefreshControl,Dimensions,PixelRatio
} from 'react-native';
import {List, ListItem, Icon, Divider} from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-community/async-storage';
import {TextInput, ScrollView} from 'react-native-gesture-handler';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import NetInfo from '@react-native-community/netinfo';
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
import styles from './styles';
const pkg = require('../../package.json');
export default class PastScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      isModalVisible: true,
      Active_data: [], //Store Active data
      Accepted_data: [], //Store Accepted data
      PastData: [], //store completed data
      completePastData: [], //Sore past Data
      pictureData: [], // use for assign pickups pictures
      agentId: '', //Store Agent Id
      loading: '', //Loading
      scroll: '', //On Scroll
      Cancel: 1, //On Cancel the Button
      refreshing: false, //Refresh the page
      playStoreLink: '', //Store Sore Link
      data3: [], //store merge data
      agentType: '',
    };
    this.onSelectedItems = this.onSelectedItems.bind(this); //For select item from Model
   
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("focus", () => {
      this.InterNetConnection();
    });
  }
  InterNetConnection = async () => {
    NetInfo.fetch().then(async (state) => {
      if (state.isConnected == true) {
        await AsyncStorage.getItem('AGENT_ID', (err, result) => {
          if (result != '') {
            this.setState({agentId: result,loading:true});
            this.PastPickups(); //call for assign pickup
            this.versionUpdate(); //call for version update
          } else {
            console.log('Agent id in null');
          }
        });
        // var agentType = await AsyncStorage.getItem('AgentType');
        // if (agentType == 'c') {
        //   this.setState({
        //     agentType: agentType,
        //     loading: true,
        //   });
        // }
      } else {
        Snackbar.show({
          text: 'No internet',
          duration: Snackbar.LENGTH_LONG,
        });
      }
    });
  }


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
        console.log('version updated', res);
        this.setState({playStoreLink: res.url});
        // if (res.vno !== pkg.version) {
        //   Alert.alert(
        //     'Update',
        //     'Update New Version',
        //     [
        //       {
        //         text: 'Install',
        //         onPress: () => this.onButtonPress(),
        //       },
        //     ],
        //     {
        //       cancelable: false,
        //     },
        //   );
        // } else {
        //   console.log('version updated');
        // }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  onButtonPress = async () => {
    Linking.openURL(this.state.playStoreLink);
  };

  PastPickups = async () => {
    fetch('https://docboyz.in/docboyzmt/api/activity_past_pickup_list', {
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
        console.warn('Past responce', res);
        if (res.error == 0) {
          let Data = res.pickups;
          console.log('Past ', Data.data);
          await this.setState({PastData: Data.data});
          await this.completed_pickup();
        } else {
          this.completed_pickup();
        }
        // if (res.error == 0) {
        //   await this.setState({ PastData: res.pickups, })
        //   console.log(this.state.PastData)
        //   await this.completed_pickup();
        // } else {
        //   this.completed_pickup();
        // }
      });
  };

  completed_pickup = async () => {
    fetch('https://docboyz.in/docboyzmt/api/activity_complete_pickup_list', {
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
        if (res.error == 0) {
          let Data = res.pickups;
          console.log('compleated Past ', Data.data);
          await this.setState({completePastData: Data.data});
          await this.PastMergeData();
        } else {
          this.PastMergeData();
        }
      });
  };

  PastMergeData = () => {
    console.log('res', this.state.PastData);
    if (
      this.state.PastData.length > 0 &&
      this.state.completePastData.length > 0
    ) {
      var Data3 = [...this.state.PastData, ...this.state.completePastData];
      this.setState({data3: Data3, loading: false});
    } else if (this.state.completePastData.length > 0) {
      var Data3 = [...this.state.completePastData];
      this.setState({data3: Data3, loading: false});
    } else if (this.state.PastData.length > 0) {
      var Data3 = [...this.state.PastData];
      this.setState({data3: Data3, loading: false});
    } else {
      Snackbar.show({
        title: 'There i s no past pickups',
        duration: Snackbar.LENGTH_LONG,
      });
      this.setState({loading: false});
    }
  };

  nextData = async () => {
    // use for pagination
    let {agentId} = this.state;
    await fetch(
      `https://docboyz.in/docboyzmt/api/active_pickup_list?page=${this.state.count}`,
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
        console.log('Next Page data', res.pickups.data);
        this.setState({
          data3: [...this.state.data3, ...res.pickups.data],
        });
      })
      .catch((error) => {
        console.log('Active error', error);
        NetInfo.isConnected.fetch().then((isConnected) => {
          if (isConnected) {
            console.log('Internet is connected');
          } else {
            Snackbar.show({
              title: 'No internet. Connection',
              duration: Snackbar.LENGTH_LONG,
            });
          }
        });
        this.setState({error});
      });
  };

  cancel = () => {
    this.SectionedMultiSelect._removeAllItems();
  };

  onRefresh = () => {
    //  console.log("Add new name.");

    this.LoadData();
  };
  Reassign_Pickup = (id) => {
    console.log('Pickup id .... ', id);
    this.props.navigation.navigate('pickupDetails', {
      pickupId: id,
      status: 'past',
    });
  };

  onSelectedItemsChange = (selectedItems) => {
    //setState for selected Activity
    this.setState({selectedItems});
  };

  onSelectedItems = (alldata) => {
    //select activity in this function
    console.log('all data', alldata);
    this.SectionedMultiSelect._removeAllItems();
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
      this.props.navigation.navigate('PodSubmitScreen', {
        Array_data: this.state.selectedItems,
        data: alldata,
      });
    }
  };

  render() {
    let {data3} = this.state;

    console.log('Actual data', data3);
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
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            progressBackgroundColor={{color: 'red'}}
          />
        }
        onScroll={this.scroll}>
        <View style={styles.container}>
          {this.state.scroll == 1 ? (
            <View style={styles.listView1}>
              <View style={styles.mainView}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => this.setState({text})}
                  placeholder="Search Pickup here...."
                  value={this.state.text}
                />
              </View>
              {this.state.Cancel == 1 ? (
                <View style={{height: 30, width: '20%', marginTop: 5}}>
                  <TouchableHighlight
                    style={styles.searchBar}
                    underlayColor="#1B547C"
                    onPress={this.search}>
                    <Text style={styles.searchBarText}>Search</Text>
                  </TouchableHighlight>
                </View>
              ) : null}
              {this.state.Cancel == 0 ? (
                <View style={{height: 30, width: '20%', marginTop: 5}}>
                  <TouchableHighlight
                    style={styles.searchBar}
                    underlayColor="#1B547C"
                    onPress={this.Cancel}>
                    <Text style={styles.searchBarText}>Cancel</Text>
                  </TouchableHighlight>
                </View>
              ) : null}
            </View>
          ) : null}

          <FlatList
            data={data3}
            keyExtractor={(item, index) => index.pickup_id}
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
                    <View style={{justifyContent: 'center',width:'90%'}}>
                      <Text style={styles.productNmae}>
                        {item.product_name} -
                      </Text>
                    </View>
                    <View style={styles.listView4}>
                      <TouchableOpacity
                        onPress={
                          item.call_center_agent_status === 'Accepted'
                            ? () =>
                                Alert.alert(
                                  'Call',
                                  `Do you want to call ${item.mobile}`,
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
                          containerStyle={{marginTop: 5}}
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
                    <View style={[styles.listView4, {marginTop: 5}]}>
                      <Icon
                        type="material-community"
                        name={'home'}
                        size={normalize(15)}
                        color="green"
                      />
                      <Text style={styles.addressText}>
                        {item.home_address}
                      </Text>
                    </View>
                  ) : null}
                  {this.state.agentType !== 'c' ? (
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
                  ) : null}
                  <View>
                    <Divider style={styles.divider} />
                  </View>
                  <View style={[styles.listView3, {marginTop: 1}]}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.cityText}>{item.city} -</Text>
                      <Text style={styles.cityText}>{item.pincode}</Text>
                    </View>
                    <View style={{flexDirection: 'row',marginLeft:normalize(25)}}>
                      <Icon
                        type="material-community"
                        name={'signal-cellular-3'}
                        size={normalize(13)}
                        color="slateblue"
                        containerStyle={{}}
                      />
                      <Text style={styles.addressText}>
                        Status-{item.pickup_status}
                      </Text>
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
                        size={normalize(13)}
                        color="slateblue"
                        containerStyle={{paddingRight: 2}}
                      />
                      <Text style={styles.pickup_date}>{item.pickup_date}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Icon
                        type="material-community"
                        name={'clock-outline'}
                        size={15}
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

                {item.activity_status === 40 ? (
                  <View style={styles.buttonView}>
                    <SectionedMultiSelect
                      ref={(SectionedMultiSelect) =>
                        (this.SectionedMultiSelect = SectionedMultiSelect)
                      }
                      items={item.activity}
                      IconRenderer={Icon}
                      uniqueKey="activity_id"
                      selectText="                                      Pod Submit"
                      showDropDowns={true}
                      readOnlyHeadings={false}
                      onSelectedItemsChange={this.onSelectedItemsChange}
                      selectedItems={this.state.selectedItems}
                      showCancelButton={true}
                      onConfirm={() => this.onSelectedItems(item)}
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
                          paddingTop:normalize(5),
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
                          alignSelf:'center',
                          justifyContent:'center',
                          alignItems:'center'
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
                ) : item.activity_status === 50 ? (
                  <View>
                    <TouchableOpacity style={styles.acceptPickupButton}>
                      <Text style={styles.acceptPickupButtonText}>
                        Completed
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : item.activity_status === 30 ? (
                  <View>
                    <TouchableOpacity
                      onPress={() => this.Reassign_Pickup(item.pickup_id)}
                      style={styles.acceptPickupButton}>
                      <Text style={styles.acceptPickupButtonText}>
                        Reassign Pickup
                      </Text>
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

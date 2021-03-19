import React, {Component} from 'react';
import {
  TouchableOpacity,
  Modal,
  FlatList,
  Text,
  View,
  Alert,
  Linking,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Header, Icon, normalize} from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import ViewPager from '@react-native-community/viewpager';
import styles from './styles';

export default class Dashboard extends Component {

  static navigationOptions = {
    drawerLabel: 'Home',
    drawerIcon: ({tintColor}) => (
      <Icon
        type="material-community"
        name="home"
        size={30}
        iconStyle={{color: 'white', height: 30, width: 30}}
      />
    ),
  };
  
  constructor() {
    super();
    this.state = {
      store: {},
      pickup: {},
      agentId: 435,
      name: '',
      loading: true,
      token: '',
      playStoreLink: '',
      modalVisible: false,
      Video: [],
      NODATA: {id: 1, video_title: 'coming soon...', video_link: 'dsamdsamd'},
    };

    // NetInfo.isConnected.fetch().then((isConnected) => {
    //   if (isConnected) {
    //     console.log("Internet is connected");
    //   } else {
    //     Snackbar.show({
    //       title: "No internet.",
    //       duration: Snackbar.LENGTH_LONG,
    //     });
    //   }
    // });
  }

  componentDidMount = () => {
    this.localStorage();
  };

  _addDataToList(data) {
    this.props.navigation.replace('Notifications', {notifications: data});
    console.log('data', data);
  }

  localStorage = async () => {
    this.setState({loading: true});

    await AsyncStorage.getItem('AGENT_ID', (err, result) => {
      if (result != '') {
        this.setState({
          agentId: result,
        });
      }
    });
    await AsyncStorage.getItem('FCnAME', (err, result) => {
      this.setState({name: result});
    });
    await AsyncStorage.getItem('token', (err, result) => {
      this.setState({token: result});
    });

    this.Called = this.props.navigation.addListener('willFocus', () => {
      this.fetch();
    });

    this.fetch();
  };

  onButtonPress = async () => {
    Linking.openURL(this.state.playStoreLink);
  };

  fetch = async () => {
    console.log('token', this.state.token);

    fetch('https://docboyz.in/docboyzmt/api/dashboard', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId: this.state.agentId,
        fcmTokenId: this.state.token,
      }),
    })
      .then(
        (response) => response.json(), //ADDED >JSON() HERE
        (error) => console.log('An error occurred.', error),
      )
      .then((res) => {
        console.warn('res', res);
        if (res == 'undefined') {
          console.log(res.error);
        } else {
          this.setState({pickup: res.pickups, loading: false});
        }
        try {
          AsyncStorage.setItem('AgentType', res.pickups.agent_det.type);
        } catch (error) {
          console.log('Error for company not saved ' + error.message);
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({loading: false});
      });

    fetch('https://docboyz.in/docboyzmt/api/get_all_video_links', {
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
      .then(async (res) => {
        console.log('video link', res);
        let {error, video_links} = res; //where this.currentUser is the object above
        console.log('dadad', video_links);
        if ((video_links = [])) {
          console.log('in array empty', video_links);
          await this.setState({Video: [this.state.NODATA]});
          console.log('in ', this.state.Video);
        } else {
          this.setState({Video: res.video_links});
        }
      })
      .catch((error) => {
        console.log(error.message);
      });

    var pkg = await require('../../package.json');

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
        // console.warn('version update api', res);
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

  OpenLink = (link) => {
    if(link==''){
      Snackbar.show({
        text: 'Vodeo links are not available',
        duration: Snackbar.LENGTH_LONG,
      });
    }else{
      // Linking.openURL(link);
      Snackbar.show({
        text: 'Vodeo links are not available',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  FtuVideo = () => {
    this.setState({modalVisible: true});
  };

  activityFun = ({item, index}) => {
    console.warn('warn', item);
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ScrollView>
          <View style={styles.container2}>
            <TouchableHighlight
              onPress={() => this.OpenLink(item.video_link)}
              style={{alignSelf: 'center', margin: 10, marginTop: 0}}>
              <Text
                style={[
                  styles.underline,
                  {
                    fontSize: 17,
                    color: 'red',
                  },
                ]}>
                {item.video_title}
              </Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View>
    );
  };

  closeModel = () => {
    console.log('coloed');
    this.setState({
      modalVisible: false,
    });
  };
  enquirey() {
    Snackbar.show({
      text: 'Coming Soon...',
      duration: Snackbar.LENGTH_LONG,
    });
  }
  Rating() {
    Snackbar.show({
      text: 'Coming Soon...',
      duration: Snackbar.LENGTH_LONG,
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="#E41313"
          leftComponent={{
            icon: 'menu',
            color: '#fff',
            onPress: () => {
              this.props.navigation.openDrawer();
            },
          }}
          centerComponent={{
            text: 'DocBoyz',
            style: {
              color: 'white',
              fontSize: normalize(20),
              fontWeight:'bold',
              letterSpacing:1
            },
          }}
          outerContainerStyles={{
            backgroundColor: '#E41313',
            padding: normalize(5),
          }}
          innerContainerStyles={{justifyContent: 'space-between'}}
          rightComponent={{
            icon: 'help',
            color: '#fff',
            onPress: () => {
              this.FtuVideo();
            },
          }}
        />
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({modalVisible: false})}>
          <View style={styles.modelView}>
            <View style={styles.modelView1}>
              <View style={styles.modelView2}>
                <Text style={styles.modelText}>Help</Text>
                <TouchableOpacity
                  onPress={this.closeModel}
                  underlayColor="white"
                  style={{alignSelf: 'center'}}>
                  <Icon
                    type="material-community"
                    name={'close'}
                    size={30}
                    color="white"
                    containerStyle={{marginTop: 0}}
                  />
                </TouchableOpacity>
              </View>
              <FlatList
                data={this.state.Video}
                renderItem={({item, index}) => this.activityFun({item, index})}
                keyExtractor={(text) => {
                  text.id;
                }}
              />
            </View>
          </View>
        </Modal>
        <View style={styles.headingView}>
          <Text style={styles.hiiText}>
            {this.state.name.replace(/['"]+/g, '')}
          </Text>
        </View>
        <View style={styles.secondView}>
          <View style={styles.roundView}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Pickups')}
              style={styles.avtaar}
              underlayColor="#FF0000">
              <Icon
                type="material-community"
                name="file-document"
                size={normalize(25)}
                color="white"
                containerStyle={{marginTop: 0}}
              />
              <Text style={styles.text}>Pickup</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.enquirey()}
              style={styles.avtaar}
              underlayColor="#FF0000">
              <Icon
                type="material-community"
                name="book-information-variant"
                size={normalize(25)}
                color="white"
                containerStyle={{marginTop: 0}}
              />
              <Text style={[styles.text,{width:normalize(80),textAlign:'center'}]}>Enquiry Form</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.roundView}>
            <TouchableOpacity
              style={styles.avtaar}
              onPress={() => this.Rating()}
              underlayColor="#FF0000">
              <Icon
                type="material-community"
                name="star-circle"
                size={normalize(28)}
                color="white"
                containerStyle={{marginTop: 0}}
              />
              <Text style={styles.text}>Ratings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.avtaar}
              onPress={() => this.props.navigation.navigate('Redeem')}
              underlayColor="#FF0000">
              <Icon
                type="material-community"
                name="currency-inr"
                size={normalize(30)}
                color="white"
                containerStyle={{marginTop: 0}}
              />
              <Text style={styles.text}>Redeem</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ViewPager style={styles.lastView} initialPage={0}>
          <View style={{padding: normalize(10)}}>
            <View>
              <Text style={styles.pageViewerText}>This Month</Text>
            </View>
            <View style={styles.pageViewerView}>
              <View>
                <Text style={styles.pageViewerText}>Pickup </Text>
              </View>
              <View>
                <Text style={styles.pageViewerText}> You earned </Text>
              </View>
            </View>
            <View style={styles.pageViewerView}>
              <View>
                <Text style={styles.pageViewerText}>
                  {typeof this.state.pickup != 'undefined'
                    ? this.state.pickup.current_month_pickups
                    : 0}
                </Text>
              </View>
              <View style={styles.pageViewerView1}>
                <Icon
                  type="material-community"
                  name={'currency-inr'}
                  size={normalize(17)}
                  color="white"
                />

                <Text style={styles.pageViewerText}>
                  {typeof this.state.pickup != 'undefined'
                    ? this.state.pickup.current_month_earned
                    : null}
                </Text>
                <Icon
                  type="material-community"
                  name={'triangle'}
                  size={normalize(17)}
                  color="white"
                />
              </View>
            </View>
          </View>
          <View style={{padding: normalize(10)}}>
            <View>
              <Text style={styles.pageViewerText}> Last Month</Text>
            </View>
            <View style={styles.pageViewerView}>
              <View>
                <Text style={styles.pageViewerText}>Pickup </Text>
              </View>
              <View>
                <Text style={styles.pageViewerText}> You earned </Text>
              </View>
            </View>
            <View style={styles.pageViewerView}>
              <View>
                <Text style={styles.pageViewerText}>
                  {typeof this.state.pickup != 'undefined'
                    ? this.state.pickup.last_month_pickups
                    : null}
                </Text>
              </View>
              <View style={styles.pageViewerView1}>
                <Icon
                  type="material-community"
                  name={'currency-inr'}
                  size={normalize(17)}
                  color="white"
                />

                <Text style={styles.pageViewerText}>
                  {typeof this.state.pickup != 'undefined'
                    ? this.state.pickup.last_month_earned
                    : null}
                </Text>
                <Icon
                  type="material-community"
                  name={'triangle'}
                  size={normalize(17)}
                  color="white"
                />
              </View>
            </View>
          </View>
          <View style={{padding: normalize(10)}}>
            <View>
              <Text style={styles.pageViewerText}>This Year</Text>
            </View>
            <View style={styles.pageViewerView}>
              <View>
                <Text style={styles.pageViewerText}>Pickup </Text>
              </View>
              <View>
                <Text style={styles.pageViewerText}> You earned </Text>
              </View>
            </View>
            <View style={styles.pageViewerView}>
              <View>
                <Text style={styles.pageViewerText}>
                  {typeof this.state.pickup != 'undefined'
                    ? this.state.pickup.current_year_pickups
                    : null}
                </Text>
              </View>
              <View style={styles.pageViewerView1}>
                <Icon
                  type="material-community"
                  name={'currency-inr'}
                  size={normalize(17)}
                  color="white"
                />

                <Text style={styles.pageViewerText}>
                  {typeof this.state.pickup != 'undefined'
                    ? this.state.pickup.current_year_earned
                    : null}
                </Text>
                <Icon
                  type="material-community"
                  name={'triangle'}
                  size={normalize(17)}
                  color="white"
                />
              </View>
            </View>
          </View>
        </ViewPager>
      </View>
    );
  }
}

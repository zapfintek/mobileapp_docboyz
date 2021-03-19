import React, {useState, useEffect} from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import Dashboard from '../dashboard';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  PixelRatio,
  Linking,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {Divider, Icon} from 'react-native-elements';
import styles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
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

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
     drawerStyle={{ width: '75%' }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={Dashboard} />
    </Drawer.Navigator>
  );
};

const image = '';
function CustomDrawerContent(props) {
  const [agentId, setId] = useState();
  const [name, setName] = useState();
  const [address, setAdd] = useState();
  const [profilePic, setPic] = useState();

  useEffect(() => {
    internetConnection();
  }, []);

  internetConnection = async () => {
    NetInfo.fetch().then(async (state) => {
      if (state.isConnected == true) {
        await AsyncStorage.getItem('AGENT_ID', (err, result) => {
          if (result != '') {
            setId(result);
          }
        });
        fetchApi();
      }
    });
  };

  fetchApi = async () => {
    await fetch('https://docboyz.in/docboyzmt/api/viewProfileSigned', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId: agentId,
      }),
    })
      .then(
        (response) => response.json(), //ADDED >JSON() HERE
        (error) => console.log('An error occurred.', error),
      )
      .then((res) => {
        // console.warn('drawer', res.user);
        let {error, user: user} = res;
        setName(user.name);
        setAdd(user.address1);
        setPic(user.profile_pic);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  onButtonPress = async () => {
    await AsyncStorage.removeItem('AGENT_ID');
    await AsyncStorage.removeItem('FCnAME');
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('is_Existing');
    await AsyncStorage.removeItem('FTU');
    await AsyncStorage.removeItem('AgentType');

    await props.navigation.navigate('Login');
  };
  Logout = () => {
    Alert.alert('Logout', 'Are You Sure To Logout This Account', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed!'),
      },
      {
        text: 'OK',
        onPress: () => this.onButtonPress(),
      },
    ]);
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}>
      <View style={styles.container1}>
        {profilePic == '' ? (
          <View style={styles.profilePic}>
            {
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('myAcoount')}
                underlayColor="#FFFF">
                <Image
                  source={require('../assets/person.png')}
                  style={styles.avatar}
                />
              </TouchableOpacity>
            }
          </View>
        ) : (
          <View style={styles.profilePic}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Profile')}
              underlayColor="#FFFF">
              <Image
                source={{
                  uri: profilePic,
                }}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
        )}
         <View style={{width:'96%',alignSelf:'center'}}>
        <Text style={styles.name}>
          {name}-{agentId}
        </Text>
        <Text style={styles.address}>
          {address}
        </Text>
        </View>
       
      </View>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.secondView}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => props.navigation.navigate('Home')}>
            <Icon
              type="material-community"
              name="home"
              size={normalize(25)}
              color="white"
            />
            <Text style={styles.underline}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => props.navigation.navigate('Pickups')}>
            <Icon
              type="material-community"
              name="file-document"
              size={normalize(25)}
              color="white"
            />
            <Text style={styles.underline}>Pickups</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => props.navigation.navigate('ID')}>
            <Icon
              type="material-community"
              name="animation-outline"
              size={normalize(25)}
              color="white"
            />
            <Text style={styles.underline}>Id Card</Text>
          </TouchableOpacity>
          <Divider style={styles.diveder} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => props.navigation.navigate('Notification')}>
            <Icon
              type="material-community"
              name="bell"
              size={normalize(25)}
              color="white"
            />
            <Text style={styles.underline}>Notification</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => props.navigation.navigate('Profile')}>
            <Icon
              type="material-community"
              name="account"
              size={normalize(25)}
              color="white"
            />
            <Text style={styles.underline}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => props.navigation.navigate('Feedback')}>
            <Icon
              type="material-community"
              name="account-edit"
              size={normalize(25)}
              color="white"
            />
            <Text style={styles.underline}>Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => props.navigation.navigate('Help')}>
            <Icon
              type="material-community"
              name="comment-question"
              size={normalize(25)}
              color="white"
            />
            <Text style={styles.underline}>Help Support</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              Linking.openURL(
                'https://docboyz.in/admin_/public/uploads/DocBoyzTerms&Condition.pdf',
              )
            }>
            <Icon
              type="material-community"
              name="bookmark"
              size={normalize(25)}
              color="white"
            />
            <Text style={styles.underline}>Terms And Conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => props.navigation.navigate('Settings')}>
            <Icon
              type="material-community"
              name="cog-outline"
              size={normalize(25)}
              color="white"
            />
            <Text style={styles.underline}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => Logout(this)}>
            <Icon
              type="material-community"
              name="logout"
              size={normalize(25)}
              color="white"
            />
            <Text style={styles.underline}>Logout</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </DrawerContentScrollView>
  );
}

export default DrawerNavigator;

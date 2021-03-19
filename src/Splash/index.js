import React, {Component} from 'react';
import PushNotification from 'react-native-push-notification';
import {View, Text, Image, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import styles from './styles';
import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'Zapfin1.db'});
var Activity =
  'CREATE TABLE IF NOT EXISTS Activity(id INTEGER PRIMARY KEY AUTOINCREMENT,activity_id INT(20), name VARCHAR(50),pickups_id INT ,activity_status INT)';
var Location =
  'CREATE TABLE IF NOT EXISTS Location(id INTEGER PRIMARY KEY AUTOINCREMENT,activity_id INT(20),pickups_id INT ,activity_Location VARCHAR(50))';
var PickupDocument =
  'CREATE TABLE IF NOT EXISTS PickupDocument(id INTEGER PRIMARY KEY AUTOINCREMENT,que_id Int, question VARCHAR (100),is_image TEXT, sequence INT, comments TEXT,pickups_id INT, complete VARCHAR(30), uncomplete VARCHAR(30), activity_id INT(20), activity_name VARCHAR(20), image_type VARCHAR(30),is_video INT(20),video_questions VARCHAR(100),QuestionLinks VARCHAR(20),product_name VARCHAR(30))';
var Pickups =
  'CREATE TABLE IF NOT EXISTS Pickups(id INTEGER PRIMARY KEY AUTOINCREMENT,pickups_id INT(30), customer_id INT(20), product_name VARCHAR(200), pickup_status VARCHAR(30), pickup_person VARCHAR(25), home_address VARCHAR(300), city VARCHAR(50), pincode INT(30), office_address VARCHAR(300), pincode_OFC INT(30), preferred_start_time INT(100), preferred_end_time INT(100), mobile INT(20), pickup_date DATE, AWB INT(100),TokanId INT(100),activity_status VARCHAR(100),transaction_id INT(10),agent_id INT(10),total_activity INT(10),remaining_activity INT(10))';
var PickupDocumentPictures =
  'CREATE TABLE IF NOT EXISTS PickupDocumentPictures(id INTEGER PRIMARY KEY AUTOINCREMENT, pickups_document_id INT, filename VARCHAR(300), filepath VARCHAR(300), pickups_id INT, latitude INT, longitude INT, is_upload INT, created_at TIMESTAMP, updated_at TIMESTAMP, activity_id INT(20) )';
var Comments =
  'CREATE TABLE IF NOT EXISTS Comments(id INTEGER PRIMARY KEY AUTOINCREMENT,que_id Int, value VARCHAR(100),pickups_id INT,activity_id INT(20))';

export default class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Notification: '',
    };
    this.LocalDb();
  }

  LocalDb = () => {
  
    db.transaction(function (tx) {
      tx.executeSql(Activity, [], (tx, results) => {
        console.warn('Results Activity', results);
      });
    });
    db.transaction(function (tx) {
      tx.executeSql(Location, [], (tx, results) => {
        console.warn('Results Location', results);
      });
    });
    db.transaction(function (tx) {
      tx.executeSql(PickupDocument, [], (tx, results) => {
        console.warn('Results PickupDocument', results);
      });
    });
    db.transaction(function (tx) {
      tx.executeSql(Pickups, [], (tx, results) => {
        console.warn('Results Pickups', results);
      });
    });
    db.transaction(function (tx) {
      tx.executeSql(PickupDocumentPictures, [], (tx, results) => {
        console.warn('Results PickupDocumentPictures', results);
      });
    });
    db.transaction(function (tx) {
      tx.executeSql(Comments, [], (tx, results) => {
        console.warn('Results Comments', results);
      });
    });

 
    db.executeSql('pragma table_info (Activity);', [], function (res) {
      console.warn('PRAGMA Activity res: ' + JSON.stringify(res));
    });
    db.executeSql('pragma table_info (Location);', [], function (res) {
      console.warn('PRAGMA Location res: ' + JSON.stringify(res));
    });
    db.executeSql('pragma table_info (PickupDocument);', [], function (res) {
      console.warn('PRAGMA PickupDocument res: ' + JSON.stringify(res));
    });
    db.executeSql('pragma table_info (Pickups);', [], function (res) {
      console.warn('PRAGMA Pickups res: ' + JSON.stringify(res));
    });
    db.executeSql('pragma table_info (Pickups);', [], function (res) {
      console.warn('PRAGMA Pickups res: ' + JSON.stringify(res));
    });
    db.executeSql(
      'pragma table_info (PickupDocumentPictures);',
      [],
      function (res) {
        console.warn(
          'PRAGMA PickupDocumentPictures res: ' + JSON.stringify(res),
        );
      },
    );
    db.executeSql('pragma table_info (Comments);', [], function (res) {
      console.warn('PRAGMA Comments res: ' + JSON.stringify(res));
    });
  };

  componentDidMount = async () => {
    let self = this;
    PushNotification.configure({
      onRegister: async function (token) {
        // console.log("TOKEN:", token);
        var TOKEN = token.token;
        var finalToken = TOKEN.replace(/"/g, '');
        console.log(finalToken);
        if (TOKEN == null) {
          console.log('token is null');
        } else {
          await AsyncStorage.setItem('token', JSON.stringify(finalToken));
        }
      },

      onNotification: function (notification) {
        console.warn('NOTIFICATION:', notification);
        self._addDataToList(notification);
      },
      senderID: '419446438096',
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
    Exisng = await AsyncStorage.getItem('token'); // for new otp base login
    console.log('async tiken', Exisng); // for new otp base login
    Existing = await AsyncStorage.getItem('is_Existing'); // for new otp base login
    await setTimeout(() => {
      AsyncStorage.getItem('AGENT_ID', (error, currentUser) => {
        if (currentUser != null && Existing == 'true') {
          this.props.navigation.replace('MyDrawer');
        } else {
          this.props.navigation.replace('PersonalInfo');
        }
      });
    }, 500);
  };
  async _addDataToList(data) {
    await AsyncStorage.removeItem('Notification');

    if (data.foreground == true) {
      AsyncStorage.setItem('Notification', JSON.stringify(data), (err) => {
        if (err) {
          console.log('an error');
          throw err;
        }
        console.log('success');
        Alert.alert(
          'DocBoyz',
          'New Notification',
          [
            {
              text: 'OK',
              onPress: () => this.onButtonPress(),
            },
            {
              text: 'Cancel',
              onPress: () => console.log('cancel'),
            },
          ],
          {
            cancelable: false,
          },
        );
      }).catch((err) => {
        console.log('error is: ' + err);
      });
    } else if (data.foreground == false) {
      AsyncStorage.setItem('Notification', JSON.stringify(data), (err) => {
        if (err) {
          console.log('an error');
          throw err;
        }
        this.props.navigation.replace('Notifications');

        console.log('success');
      }).catch((err) => {
        console.log('error is: ' + err);
      });
    }
  }
  onButtonPress = () => {
    console.warn('called');
    // this.props.navigation.navigate('Notifications');
  };
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/DOCBOYZ.png')} style={styles.image} />
        <Text style={styles.text}>DocBoyz</Text>
      </View>
    );
  }
}

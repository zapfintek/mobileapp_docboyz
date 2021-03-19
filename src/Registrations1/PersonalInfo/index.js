import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Appbar, Card, TextInput, RadioButton} from 'react-native-paper';
import {Icon} from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import styles, {normalize} from './styles';
import ImagePicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'Zapfin1.db'});

const PersonalInfo = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('1234567890');
  const [dobText, setDob] = useState('');
  const [gender, setValue] = React.useState('Male');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    setLoading(true);
    console.warn('cllde');
    db.transaction( function (tx) {
      tx.executeSql (
        'SELECT * FROM Registration WHERE mobile = ? ',
        [mobile],
         function (tx, results) {
          var len = results.rows.length;
          console.warn('len', len);
          if (len > 0) {
            console.warn(results.rows.item(0).dob,results.rows.item(0).gender)
            setEmail(results.rows.item(0).email),
            setName(results.rows.item(0).name),
            setImage(results.rows.item(0).pro_pic)
            setMobile(results.rows.item(0).mobile),
            setDob(results.rows.item(0).dob),
            setValue(results.rows.item(0).gender)
            setLoading(false);       
          } else {
            console.warn('No user found');
            setLoading(false);
          }
        },
      );
    });
  }, []);

  let CallFun = async () => {
    const validate = await validation();
    if (validate) {
      db.transaction(async (tx) => {
        tx.executeSql(
          'DELETE  FROM Registration ',
          [],
          (tx, results) => {
            console.warn('Results', results.rowsAffected);
            if (results.rowsAffected) {
              navigation.navigate('AddressInfo');
              console.warn('DELETE successfully');
            } else {
              console.warn('DELETE Failed');
            }
          },
        );
      });
      db.transaction(async (tx) => {
        tx.executeSql(
          'INSERT INTO Registration (email, pro_pic, name, mobile, dob, gender) VALUES (?,?,?,?,?,?)',
          [email, image, name, mobile, dobText, gender],
          (tx, results) => {
            console.warn('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              navigation.navigate('AddressInfo');
              console.warn('Registration successfully');
            } else {
              console.warn('Registration Failed');
            }
          },
        );
      });
      // tx.executeSql( 'UPDATE Registration SET email = ? , pro_pic = ? , name = ? , mobile = ? , dob = ? , gender = ?  WHERE mobile = ?', ["Doctor", "Strange", 3 , 124 , 4124 , "malw",1234325 ],( (tx, results) => {
    }
  };

  let validation = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (image == '') {
      Snackbar.show({
        text: 'Please capture your profile picture',
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (reg.test(email) !== true) {
      Snackbar.show({
        text: 'Please Enter Valid Email',
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (email == '') {
      Snackbar.show({
        text: 'Enter the email id',
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    }
    if (name == '') {
      Snackbar.show({
        text: 'Enter your fullname',
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (mobile == '') {
      Snackbar.show({
        text: 'Enter the mobile number',
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (mobile.toString().length != 10) {
      Snackbar.show({
        text: 'Enter the 10 digit mobile number',
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (dobText == '') {
      Snackbar.show({
        text: 'Select date of birth',
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else {
      return true;
    }
  };

  //*****************************************State api call ********************************************/

  //********************************************State api call stop****************************************** */

  let captureImage = (cropping, mediaType = 'photo') => {
    ImagePicker.openCamera({
      cropping: cropping,
      width: 300,
      height: 300,
      includeExif: true,
      mediaType,
    })
      .then((image) => {
        console.warn('received image', image.path);
        setImage(image.path);
      })
      .catch((e) => alert(e));
  };

  return (
    <View style={styles.PersonalContainer}>
      <StatusBar hidden={false} backgroundColor="red" />
      {loading ? (
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <ActivityIndicator size="large" color="black" />
          </View>
        </View>
      ) : (
        <KeyboardAwareScrollView>
          <Appbar.Header style={{backgroundColor: '#E41313', height: 55}}>
            <Appbar.BackAction
              onPress={() => this.props.navigation.navigate('Login')}
            />
            <Appbar.Content
              style={{alignItems: 'center', marginRight: 50}}
              title="Registration"
            />
          </Appbar.Header>

          <View style={styles.loginSteps}>
            <Icon
              type="material-community"
              name="account-circle"
              size={30}
              iconStyle={styles.icon}
            />
            <Text style={styles.text}>..........</Text>
            <Icon
              type="material-community"
              name="home-circle"
              size={30}
              iconStyle={{color: 'grey'}}
            />
            <Text style={[styles.text, {color: 'grey'}]}>..........</Text>
            <Icon
              type="material-community"
              name="bank"
              size={25}
              iconStyle={{color: 'grey'}}
            />
            <Text style={[styles.text, {color: 'grey'}]}>..........</Text>
            <Icon
              type="material-community"
              name="folder-image"
              size={25}
              iconStyle={{color: 'grey'}}
            />
          </View>
          <Card style={styles.FirstCard}>
            <View style={styles.heading}>
              <Text style={styles.heading1}>User Information</Text>
            </View>
            <TouchableOpacity onPress={() => captureImage()}>
              {image != '' ? (
                <Image style={styles.image} source={{uri: image}} />
              ) : (
                <Image
                  style={styles.image}
                  source={require('../../assets/Edit.png')}
                />
              )}
            </TouchableOpacity>
            <TextInput
              label="Email"
              value={email}
              onChangeText={(email) => setEmail(email)}
              style={{backgroundColor: 'white', fontSize: 14, height: 55}}
            />
            <TextInput
              label="Full Name"
              value={name}
              onChangeText={(name) => setName(name)}
              style={{backgroundColor: 'white', fontSize: 14, height: 55}}
            />
            <TextInput
              label="Mobile Number"
              value={mobile.toString()}
              onChangeText={(mobile) => setMobile(mobile)}
              keyboardType="number-pad"
              style={{backgroundColor: 'white', fontSize: 14, height: 55}}
            />
            <TextInput
              label="Date of Birth"
              value={dobText}
              onChangeText={(dobText) => setDob(dobText)}
              keyboardType="number-pad"
              style={{backgroundColor: 'white', fontSize: 14, height: 55}}
            />
            <RadioButton.Group
              onValueChange={(gender) => setValue(gender)}
              style={{backgroundColor: 'white'}}
              value={gender}>
              <View style={styles.redio}>
                <RadioButton.Item
                  label="Male"
                  value="Male"
                  labelStyle={{
                    color: '#6f6c6c',
                    fontSize: normalize(15),
                    fontWeight: 'bold',
                  }}
                  style={{width: normalize(110)}}
                />
                <RadioButton.Item
                  label="Female"
                  value="Female"
                  labelStyle={{
                    color: '#6f6c6c',
                    fontSize: normalize(15),
                    fontWeight: 'bold',
                  }}
                  style={{width: normalize(125)}}
                />
              </View>
            </RadioButton.Group>
            <TouchableOpacity onPress={() => CallFun()} style={styles.button}>
              <Text style={styles.text1}>Next</Text>
            </TouchableOpacity>
          </Card>
        </KeyboardAwareScrollView>
      )}
    </View>
  );
};
export default PersonalInfo;

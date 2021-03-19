import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Card, TextInput, RadioButton} from 'react-native-paper';
import {Icon} from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import styles, {normalize} from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'Zapfin1.db'});

const AccountInfo = ({navigation}) => {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [account, setValue] = useState('Saving');
  const [panNumber, setPanNumber] = useState('');
  const [mobile, setMobile] = useState('1234567890');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    console.warn('cllde');
    db.transaction( function (tx) {
      tx.executeSql (
        'SELECT * FROM Registration WHERE mobile = ? ',
        [mobile],
         function (tx, results) {
          var len = results.rows.length;
          console.warn('len', results.rows.item(0).account);
          if (len > 0) {
            console.warn(results.rows.item(0))
            setBankName(results.rows.item(0).bank_name),
            setAccountNumber(results.rows.item(0).account_number),
            setIfsc(results.rows.item(0).ifsc_code)
            setValue(results.rows.item(0).account),
            setPanNumber(results.rows.item(0).pan_number),
            setMobile(results.rows.item(0).mobile)
            setLoading(false);       
          } else {
            console.warn('No user found');
            setLoading(false);
          }
        },
      );
    });
  }, []);

  const saveFistStep = () => {
    const validate = validation();
    if (validate) {
      setLoading(true);
      db.transaction(async (tx) => {
        tx.executeSql(
          'UPDATE Registration set bank_name=?, account_number=? , ifsc_code=? , pan_number=?, account =? where mobile=?',
          [bankName, accountNumber, ifsc, panNumber, account, mobile],
          (tx, results) => {
            console.warn('Results', results.rowsAffected);
            navigation.navigate('RequireDocuments');
            if (results.rowsAffected > 0) {
              console.warn('User updated successfully');
              navigation.navigate('RequireDocuments');
              setLoading(false);
            }
          },
        );
      });
    }

  };

  const saveFistStepBack = () => {
    navigation.replace('AddressInfo');
  };

  const validation = () => {
    // const regIFSC= /^[A-Za-z]{4}\d{7}$/;
    var regPAN = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

    if (bankName == '') {
      Snackbar.show({
        text: 'Please enter the bank name',
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (accountNumber == '') {
      Snackbar.show({
        text: 'Please enter the account number',
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (ifsc == '') {
      Snackbar.show({
        text: 'Please enter the ifsc code',
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (panNumber == '') {
      Snackbar.show({
        text: 'Please enter the pancard number',
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (regPAN.test(panNumber) != true) {
      Snackbar.show({
        text: 'Pancard number is incorrect',
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else {
      return true;
    }
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
          <View style={styles.loginSteps}>
            <Icon
              type="material-community"
              name="account-circle"
              size={30}
              iconStyle={styles.icon}
            />
            <Text style={styles.test}>..........</Text>
            <Icon
              type="material-community"
              name="home-circle"
              size={30}
              iconStyle={{color: '#d32f2f'}}
            />
            <Text style={styles.test}>..........</Text>
            <Icon
              type="material-community"
              name="bank"
              size={25}
              iconStyle={{color: '#d32f2f'}}
            />
            <Text style={[styles.test, {color: 'green'}]}>..........</Text>
            <Icon
              type="material-community"
              name="folder-image"
              size={25}
              iconStyle={{color: 'grey'}}
            />
          </View>

          <Card style={styles.FirstCard}>
            <View style={styles.mainView}>
              <Text style={styles.heading}>Bank Details</Text>
            </View>

            <TextInput
              label="Bank Name"
              value={bankName}
              onChangeText={(bankName) => setBankName(bankName)}
              style={{backgroundColor: 'white', fontSize: 14, height: 55}}
            />
            <TextInput
              label="Account Number"
              value={accountNumber}
              onChangeText={(accountNumber) => setAccountNumber(accountNumber)}
              style={{backgroundColor: 'white', fontSize: 14, height: 55}}
            />
            <TextInput
              label="IFSC Code"
              value={ifsc}
              onChangeText={(ifsc) => setIfsc(ifsc)}
              style={{backgroundColor: 'white', fontSize: 14, height: 55}}
            />
            <RadioButton.Group
              onValueChange={(account) => setValue(account)}
              style={{backgroundColor: 'white'}}
              value={account}>
              <View style={styles.redio}>
                <RadioButton.Item
                  label="Saving"
                  value="Saving"
                  labelStyle={{
                    color: '#6f6c6c',
                    fontSize: normalize(15),
                    fontWeight: 'bold',
                  }}
                  style={{width: normalize(110)}}
                />
                <RadioButton.Item
                  label="Current"
                  value="Current"
                  labelStyle={{
                    color: '#6f6c6c',
                    fontSize: normalize(15),
                    fontWeight: 'bold',
                  }}
                  style={{width: normalize(125)}}
                />
              </View>
            </RadioButton.Group>
            <TextInput
              label="Pancard number"
              value={panNumber}
              onChangeText={(panNumber) => setPanNumber(panNumber)}
              style={{backgroundColor: 'white', fontSize: 14, height: 55}}
            />
            <View style={styles.bottomView}>
              <TouchableOpacity
                onPress={() => saveFistStepBack()}
                style={[styles.button, {backgroundColor: '#1B547C'}]}>
                <Text style={styles.text1}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => saveFistStep()}
                style={styles.button}>
                <Text style={styles.text1}>Next</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </KeyboardAwareScrollView>
      )}
    </View>
  );
};
export default AccountInfo;

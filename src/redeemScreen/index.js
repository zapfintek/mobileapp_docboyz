import React from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
} from 'react-native';
import {Icon, Header} from 'react-native-elements';
import styles from './styles';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-community/async-storage';
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

const _ = require('lodash');
export default class Redeems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {},
      loading: false,
      data: [],
      error: null,
      agentId: '',
      amount: '',
      Amount: '',
      message: '',
    };
    this.Mount()
  }

 Mount = async () => {
    await AsyncStorage.getItem('AGENT_ID', (err, result) => {
      this.setState({
        agentId: result,
      });
    });
    await this.Save();
  };

  validation = () => {
    if (this.state.amount == '') {
      Snackbar.show({
        text: 'Please Enter the Amount',
        duration: Snackbar.LENGTH_LONG,
      });
    } else if (this.state.amount > 1000) {
      Snackbar.show({
        text: 'Amount greater then 1000 could not be redeemed',
        duration: Snackbar.LENGTH_LONG,
      });
    } else if (this.state.amount > this.state.Amount) {
      Snackbar.show({
        text: 'Amount greater then wallet could not be redeemed',
        duration: Snackbar.LENGTH_LONG,
      });
    } else {
      this.submit();
    }
  };

  Save = () => {
    this.setState({
      loading: true,
    });

    fetch('https://docboyz.in/docboyzmt/api/request_redeem', {
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
      .then((res) => {
        //  console.warn(res)
        this.setState({
          Message: res.message,
          Amount: res.wallet_amt,
          loading: false,
          amount: '',
        });
      })
      .catch((error) => {
        this.setState({error, loading: false, amount: ''});
      });
  };

  submit = () => {
    this.setState({loading: true});
    fetch('https://docboyz.in/docboyzmt/api/request_redeem', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId: this.state.agentId,
        amount: this.state.amount == '' ? null : this.state.amount,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error == 0) {
          this.setState({
            Message: res.message,
            Amount: res.wallet_amt,
          });
          Snackbar.show({
            text: 'Redeem Amount Save Succesfully',
            duration: Snackbar.LENGTH_LONG,
          });
          this.setState({loading: false, amount: ''});
        } else {
          Snackbar.show({
            text: 'Something Wrong...',
            duration: Snackbar.LENGTH_LONG,
          });
        }
      })
      .catch((error) => {
        this.setState({error, loading: false, amount: ''});
      });
  };

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
          <View style={styles.circleView}>
            <Icon
              type="material-community"
              name={'currency-inr'}
              size={normalize(40)}
              color="white"
            />
            <Text style={styles.circleText}>
              {this.state.Amount == '' ? 0 : this.state.Amount}
            </Text>
          </View>
          <View>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Amount"
              value={this.state.amount}
              onChangeText={(amount) => this.setState({amount})}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.buttonView}>
            <Text style={styles.text}>* Minimum Amount that can be Redeemed is 1000 *</Text>
          </View>
          <View>
          <TouchableOpacity
            style={styles.button}
            onPress={this.validation}
            underlayColor="deepskyblue">
            <Text style={styles.buttonText}>Redeem</Text>
          </TouchableOpacity>
          </View>
      </KeyboardAwareScrollView>
    );
  }
}

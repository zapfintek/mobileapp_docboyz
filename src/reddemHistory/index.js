import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Dimensions,
  PixelRatio,
} from 'react-native';
import {List, ListItem, Icon} from 'react-native-elements';
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
export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      error: null,
      agentId: 435,
      Data: [],
      data: [],
    };
    this.save();
  }
  AsyncData = async () => {
    await AsyncStorage.getItem('AGENT_ID', (err, result) => {
      this.setState({
        agentId: 435,
      });
    });

    await this.props.navigation.addListener('didFocus', () => {
      this.save();
    });
    this.setState({data: []});
  };

  save = () => {
    this.setState({loading: true});

    fetch('https://docboyz.in/docboyzmt/api/redeem_history', {
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
        console.warn('history', res);
        this.setState({data: []});
        var {error, user: Data} = res;
        this.setState({data: Data, loading: false});
      })
      .catch((error) => {
        this.setState({error, loading: false});
      });
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={style.loader}>
          <ActivityIndicator size="large" color="black" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        {this.state.data != '' ? (
          <FlatList
            data={this.state.data}
            renderItem={({item}) => (
              <View style={styles.listView}>
                <View style={styles.insideView}>
                  <View style={[styles.insideView1, {width: '90%'}]}>
                    <Icon
                      type="material-community"
                      name={'currency-inr'}
                      size={normalize(20)}
                      color="red"
                      containerStyle={{paddingRight: 10}}
                    />
                    <Text style={styles.amuntText}>
                      {item.amount != null ? item.amount : 0}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.insideView,
                    {
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#e8e8e8',
                      paddingBottom: normalize(3),
                    },
                  ]}>
                  <View style={styles.insideView1}>
                    <Icon
                      type="material-community"
                      name={'clipboard-text'}
                      size={normalize(20)}
                      color="#1B547C"
                      containerStyle={{paddingRight: 10}}
                    />
                    <Text style={styles.amuntText}>{item.created_at}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Text style={styles.amuntText}>Status</Text>
                    <Text
                      style={[
                        styles.amuntText,
                        {
                          color: 'red',
                        },
                      ]}>
                      - {item.status}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.status}
            rightIcon={{name: 'none'}}
          />
        ) : (
          <View style={[styles.container, {justifyContent: 'center'}]}>
            <Text style={styles.Nodata}>Oops!..There is no data found!</Text>
          </View>
        )}
      </View>
    );
  }
}

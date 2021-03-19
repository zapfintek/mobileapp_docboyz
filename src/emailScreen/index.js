import React, { Component } from 'react';
import {
  StyleSheet,
  View, Text, TouchableHighlight, TouchableOpacity, ScrollView
} from 'react-native';
import Styles from "./styles";
import CheckBox from 'react-native-checkbox-heaven';
import { Icon, Divider, Header } from "react-native-elements";
import Snackbar from 'react-native-snackbar';

export default class Email extends Component {

  state = {
    checked: false,
    Text: "",

  }

  Called = this.props.navigation.addListener('willFocus', () => {
    this.LoadData();
  });
  LoadData = async () => {

    let item = await this.props.navigation.state.params.ITEM;
    console.warn("called thios fun", item)
    this.setState({ Text: item, })
    console.warn(this.state.Text)
  }


  handleOnChange = () => {
    if (this.state.checked == false) {
      this.setState({ checked: true })
    } else {
      this.setState({ checked: false })
    }
  }

  handleOnChange2(val) {
    console.warn(val)
  }

  Save = () => {
    Snackbar.show({
      title: "Coming Soon",
      duration: Snackbar.LENGTH_LONG,
    });
    this.props.navigation.navigate('pickup');
  }

  render() {
    return (
      <View style={{ margin: 0 }}>
        <Header
          leftComponent={{
            icon: 'arrow-back', color: '#fff',
            onPress: () => { this.props.navigation.navigate('pickupDetails') }
          }}
          centerComponent={{ 
          text: `${this.state.Text}`, 
          style: { 
            color: 'white',
          fontSize: normalize(20),
          fontWeight:'bold',
        },
        }}
          outerContainerStyles={{ backgroundColor: "#E41313", height: 55 }}
          innerContainerStyles={{ justifyContent: "space-between" }}
        />
        <ScrollView>
          <View style={{ flex: 1, margin: 10 }}>
            <View style={[styles.container, { height: 50, marginTop: 0 }]}>
              <CheckBox
                labelStyle={styles.labelStyle}
                iconSize={24}
                iconName='matMix'
                checked={this.state.checked}
                checkedColor='#008080'
                uncheckedColor='#8b0000'
                onChange={(val) => console.warn("ok")}
                // onChange={this.handleOnChange.bind(this)}
                disabled={false}
                disabledColor='red'
              />
              <Text style={{
                fontWeight: "bold", fontSize: 18,
                paddingLeft: 5, color: "dodgerblue", fontFamily: "serif"
              }}>
                Select All
        </Text>
            </View>
            <Divider style={{ height: 5 }} />
            <View style={styles.container}>
              <CheckBox
                labelStyle={styles.labelStyle}
                iconSize={24}
                iconName='matMix'
                checked={this.state.checked}
                checkedColor='#008080'
                uncheckedColor='#8b0000'
                onChange={(val) => console.warn("ok")}
                //   onChange={this.handleOnChange.bind(this)}
                disabled={false}
                disabledColor='red'
              />
              <TouchableOpacity
                onPress={() => console.warn("ok")}>
                <Text style={styles.text}>
                  Loan Details form
               </Text>
              </TouchableOpacity>
            </View>
            <Divider style={{ height: 5 }} />
            <View style={[styles.container,]}>
              <CheckBox
                labelStyle={styles.labelStyle}
                iconSize={24}
                iconName='matMix'
                checked={this.state.checked}
                checkedColor='#008080'
                uncheckedColor='#8b0000'
                onChange={(val) => console.warn("ok")}
                //   onChange={this.handleOnChange.bind(this)}
                disabled={false}
                disabledColor='red'
              />
              <TouchableOpacity
                onPress={() => console.warn("ok")}>
                <Text style={styles.text}>
                  Bank Application Form page 1
        </Text>
              </TouchableOpacity>
            </View>
            <Divider style={{ height: 5 }} />
            <View style={styles.container}>
              <CheckBox
                labelStyle={styles.labelStyle}
                iconSize={24}
                iconName='matMix'
                checked={this.state.checked}
                checkedColor='#008080'
                uncheckedColor='#8b0000'
                onChange={(val) => console.warn("ok")}
                //   onChange={this.handleOnChange.bind(this)}
                disabled={false}
                disabledColor='red'
              />
              <TouchableOpacity
                onPress={() => console.warn("ok")}>
                <Text style={styles.text}>
                  LBank Application Form page 2
        </Text>
              </TouchableOpacity>
            </View>
            <Divider style={{ height: 5 }} />
            <View style={styles.container}>
              <CheckBox
                labelStyle={styles.labelStyle}
                iconSize={24}
                iconName='matMix'
                checked={this.state.checked}
                checkedColor='#008080'
                uncheckedColor='#8b0000'
                onChange={(val) => console.warn("ok")}
                //   onChange={this.handleOnChange.bind(this)}
                disabled={false}
                disabledColor='red'
              />
              <TouchableOpacity
                onPress={() => console.warn("ok")}>
                <Text style={styles.text}>
                  Bank Application Form page 4
        </Text>
              </TouchableOpacity>
            </View>
            <Divider style={{ height: 5 }} />
            <View style={styles.container}>
              <CheckBox
                labelStyle={styles.labelStyle}
                iconSize={24}
                iconName='matMix'
                checked={this.state.checked}
                checkedColor='#008080'
                uncheckedColor='#8b0000'
                onChange={(val) => console.warn("ok")}
                //   onChange={this.handleOnChange.bind(this)}
                disabled={false}
                disabledColor='red'
              />
              <TouchableOpacity
                onPress={() => console.warn("ok")}>
                <Text style={styles.text}>
                  Disbursal Kit
        </Text>
              </TouchableOpacity>
            </View>
            <Divider style={{ height: 5 }} />
            <View style={styles.container}>
              <CheckBox
                labelStyle={styles.labelStyle}
                iconSize={24}
                iconName='matMix'
                checked={this.state.checked}
                checkedColor='#008080'
                uncheckedColor='#8b0000'
                onChange={(val) => console.warn("ok")}
                //   onChange={this.handleOnChange.bind(this)}
                disabled={false}
                disabledColor='red'
              />
              <TouchableOpacity
                onPress={() => console.warn("ok")}>
                <Text style={styles.text}>
                  Demand Promissory Note
        </Text>
              </TouchableOpacity>
            </View>
            <Divider style={{ height: 5 }} />
            <View style={styles.container}>
              <CheckBox
                labelStyle={styles.labelStyle}
                iconSize={24}
                iconName='matMix'
                checked={this.state.checked}
                checkedColor='#008080'
                uncheckedColor='#8b0000'
                onChange={(val) => console.warn("ok")}
                //   onChange={this.handleOnChange.bind(this)}
                disabled={false}
                disabledColor='red'
              />
              <TouchableOpacity
                onPress={() => console.warn("ok")}>
                <Text style={styles.text}>
                  Cheque Submission Form
        </Text>
              </TouchableOpacity>
            </View>
            <Divider style={{ height: 5 }} />
            <View style={styles.container}>
              <CheckBox
                labelStyle={styles.labelStyle}
                iconSize={24}
                iconName='matMix'
                checked={this.state.checked}
                checkedColor='#008080'
                uncheckedColor='#8b0000'
                onChange={(val) => console.warn("ok")}
                //   onChange={this.handleOnChange.bind(this)}
                disabled={false}
                disabledColor='red'
              />
              <TouchableOpacity
                onPress={() => console.warn("ok")}>
                <Text style={styles.text}>
                  Disbursal Request Form
        </Text>
              </TouchableOpacity>
            </View>
            <Divider style={{ height: 5 }} />
            <View style={styles.container}>
              <CheckBox
                labelStyle={styles.labelStyle}
                iconSize={24}
                iconName='matMix'
                checked={this.state.checked}
                checkedColor='#008080'
                uncheckedColor='#8b0000'
                onChange={(val) => console.warn("ok")}
                //   onChange={this.handleOnChange.bind(this)}
                disabled={false}
                disabledColor='red'
              />
              <TouchableOpacity
                onPress={() => console.warn("ok")}>
                <Text style={styles.text}>
                  Form For Relative
        </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableHighlight
                style={[Styles.common.button, {
                  width: 150, height: 44, marginTop: 20,
                  backgroundColor: "#E41313", borderRadius: 7, alignSelf: "center"
                }]
                }
                onPress={this.Save}
                underlayColor="deepskyblue"
              >
                <Text style={[Styles.common.buttonText, { color: "white", fontWeight: "400" }]}>Send Email</Text>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    height: 35, paddingLeft: 5
  },
  labelStyle: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '100',
    color: '#2f4f4f'
  },
  text: {
    margin: 7,
    fontSize: 15,
    fontWeight: "100",
    color: "dodgerblue",
    fontFamily: "serif"

  }
});
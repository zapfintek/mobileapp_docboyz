import React from 'react';
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import MyPickupsTabs from './pickupsTabNavigator';
import MyRedeemTabs from './redeemTabNavigator';
import Login from '../Login';
import Splash from '../Splash';
import OTP from '../otpScreen';
import AccountInfo from '../Registrations/AccountInfo';
import AddressInfo from '../Registrations/AddressInfo';
import PersonalInfo from '../Registrations/PersonalInfo';
import RequireDocuments from '../Registrations/RequireDocuments';
import PickupDetailsScreen from '../pickupDetailsScreen';
import DocumentScreen from '../documentScreen';
import PodSubmitScreen from '../podSubmitScreen';
const Stack = createStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: '#9AC4F8',
  },
  headerTintColor: 'white',
  headerBackTitle: 'Back',
};

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="Redeem"
        component={MyRedeemTabs}
        options={({navigation, route}) => ({
          headerStyle: {
            backgroundColor: 'red',
          },
          headerTitleStyle: {
            fontSize: 20,
          },
          headerLeft: (props) => (
            <HeaderBackButton
              {...props}
              onPress={() => navigation.navigate('Home')}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const ContactStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="Pickups"
        component={MyPickupsTabs}
        options={({navigation, route}) => ({
          headerStyle: {
            backgroundColor: 'red',
          },
          headerTitleStyle: {
            fontSize: 25,
          },
          headerLeft: (props) => (
            <HeaderBackButton
              {...props}
              onPress={() => navigation.navigate('Home')}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};
const RootStackScreen = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen
        name="OTP"
        component={OTP}
        options={{
          title: 'Login/Signup',
          headerStyle: {
            backgroundColor: 'red',
          },
        }}
      />
      <Stack.Screen
        name="AccountInfo"
        component={AccountInfo}
        options={{
          title: 'Registration',
          headerStyle: {
            backgroundColor: 'red',
          },
        }}
      />
      <Stack.Screen
        name="AddressInfo"
        component={AddressInfo}
        options={{
          title: 'Registration',
          headerStyle: {
            backgroundColor: 'red',
          },
        }}
      />
      <Stack.Screen
        name="PersonalInfo"
        component={PersonalInfo}
        options={{
          title: 'Registration',
          headerStyle: {
            backgroundColor: 'red',
          },
        }}
      />
      <Stack.Screen
        name="RequireDocuments"
        component={RequireDocuments}
        options={{
          title: 'Registration',
          headerStyle: {
            backgroundColor: 'red',
          },
        }}
      />
      <Stack.Screen
        name="PickupDetailsScreen"
        component={PickupDetailsScreen}
      />
      <Stack.Screen name="DocumentScreen" component={DocumentScreen} />
      <Stack.Screen name="PodSubmitScreen" component={PodSubmitScreen} />
    </Stack.Navigator>
  );
};
export {MainStackNavigator, ContactStackNavigator, RootStackScreen};

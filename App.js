import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DrawerNavigator from './src/drawerScreen';
import Login from './src/Login';
import Splash from './src/Splash';
import OTP from './src/otpScreen';
import AccountInfo from './src/Registrations/AccountInfo';
import AddressInfo from './src/Registrations/AddressInfo';
import PersonalInfo from './src/Registrations/PersonalInfo';
import RequireDocuments from './src/Registrations/RequireDocuments';
import PickupDetailsScreen from './src/pickupDetailsScreen';
import DocumentScreen from './src/documentScreen';
import PodSubmitScreen from './src/podSubmitScreen';
import Settings from './src/settings';
import TermsAndCondition from './src/terms&conditions';
import Notification from './src/notification';
import Help from './src/help&support';
import Profile from './src/profile';
import Feedback from './src/feddback';
import ID from './src/idCard';
import {createStackNavigator} from '@react-navigation/stack';
import MyPickupsTabs from './src/navigations/pickupsTabNavigator';
import MyRedeemTabs from './src/navigations/redeemTabNavigator';
import Decline from './src/declineScreen';
import chatScreen from './src/chatScreen';

const Stack = createStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: '#9AC4F8',
  },
  headerTintColor: 'white',
  headerBackTitle: 'Back',
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MyDrawer"
          component={DrawerNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Pickups"
          component={MyPickupsTabs}
          options={{
            title: 'Pickups',
            headerStyle: {
              backgroundColor: 'red',
            },
          }}
        />
        <Stack.Screen
          name="Redeem"
          component={MyRedeemTabs}
          options={{
            title: 'Redeem',
            headerStyle: {
              backgroundColor: 'red',
            },
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="OTP"
          component={OTP}
          options={{
            headerShown: false,
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
            headerShown: false,
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
          options={{
            title: 'PickupDetails',
            headerStyle: {
              backgroundColor: 'red',
            },
          }}
        />
        <Stack.Screen
          name="DocumentScreen"
          component={DocumentScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PodSubmitScreen"
          component={PodSubmitScreen}
          options={{
            title: 'POD Submit',
            headerStyle: {
              backgroundColor: 'red',
            },
          }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TC"
          component={TermsAndCondition}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ID"
          component={ID}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Feedback"
          component={Feedback}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Decline"
          component={Decline}
          options={{
            title: 'Decline',
            headerStyle: {
              backgroundColor: 'red',
            },
          }}
        />
        <Stack.Screen
          name="Help"
          component={Help}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="chatScreen"
          component={chatScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

import React from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import RedeemScreen from '../redeemScreen';
import ReddemHistory from '../reddemHistory';
const Tab = createMaterialTopTabNavigator();

function MyPickupsTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Reddem" component={RedeemScreen} />
      <Tab.Screen name="History" component={ReddemHistory} />
    </Tab.Navigator>
  );
}
export default MyPickupsTabs;
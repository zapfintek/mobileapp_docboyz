import React from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AcitveScreen from '../acitveScreen';
import PastScreen from '../pastScreen';
const Tab = createMaterialTopTabNavigator();

function MyPickupsTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="ACTIVE" component={AcitveScreen} />
      <Tab.Screen name="PAST" component={PastScreen} />
    </Tab.Navigator>
  );
}
export default MyPickupsTabs;
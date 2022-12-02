import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SingleLineGraph from '../screens/Graphs/LineGraphs/SingleLineGraph';
import MultiLineGraph from '../screens/Graphs/LineGraphs/MultiLineGraph';
import BarGraph from '../screens/Graphs/BarGraphs';

const Graphs = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName={SingleLineGraph}>
      <Stack.Screen
        name="SingleLineGraph"
        options={{headerShown: false}}
        component={SingleLineGraph}
      />
      <Stack.Screen
        name="MultiLineGraph"
        options={{headerShown: false}}
        component={MultiLineGraph}
      />
      <Stack.Screen
        name="BarGraph"
        options={{headerShown: false}}
        component={BarGraph}
      />
    </Stack.Navigator>
  );
};

export default Graphs;

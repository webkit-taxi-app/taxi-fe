/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import Main_Map from './Main_Map';
import Main_List from './Main_List';
import Main_Setting from './Main_Setting';

function Main(): JSX.Element {
  console.log('--Main()');

  const BottomTab = createBottomTabNavigator();

  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        name="Main_Map"
        component={Main_Map}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="map" size={size} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Main_List"
        component={Main_List}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="phone" size={size} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Main_Setting"
        component={Main_Setting}
        options={{
          headerShown: true,
          title: '환경설정',
          tabBarIcon: ({color, size}) => (
            <Icon name="cog" size={size} color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

const styles = StyleSheet.create({
  textBlack: {
    fontSize: 18,
    color: 'black',
  },
  textBlue: {
    fontSize: 18,
    color: 'blue',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 200,
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Main;

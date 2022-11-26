/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {View} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {Sidebar} from 'uin';

const CustomSideBar = props => {
  return (
    <View style={{flex: 1, marginTop: -4}}>
      <DrawerContentScrollView {...props}>
        <Sidebar
          callback={() => {
            props.navigation.closeDrawer();
          }}
        />
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomSideBar;

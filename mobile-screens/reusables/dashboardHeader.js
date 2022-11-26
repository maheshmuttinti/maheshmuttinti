/* eslint-disable react-native/no-inline-styles */
import {View, Pressable} from 'react-native';
import React from 'react';
import {CartIcon, NavIcon, SearchIcon} from 'assets';
import Ripple from 'react-native-material-ripple';
import {useTheme} from 'theme';

export default function ({onNavIconClick = () => {}}) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Ripple
        hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}
        rippleColor={theme.colors.primaryBlue}
        onPress={() => {
          onNavIconClick();
        }}>
        <View style={{paddingRight: 4}}>
          <NavIcon />
        </View>
      </Ripple>

      <View style={{flexDirection: 'row'}}>
        <View>
          <SearchIcon />
        </View>
        <Pressable onPress={() => {}} style={{paddingLeft: 31}}>
          <CartIcon />
        </Pressable>
      </View>
    </View>
  );
}

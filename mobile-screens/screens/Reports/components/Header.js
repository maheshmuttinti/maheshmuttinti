/* eslint-disable react-native/no-inline-styles */
import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Heading} from 'uin';
import {BackArrow} from 'assets';
import {useTheme} from 'theme';

export default function ({navigation}) {
  const theme = useTheme();
  return (
    <View
      style={{
        paddingTop: 24,
        marginBottom: 30,
        paddingHorizontal: 19,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            flex: 0.5 / 3,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.jumpTo('Home');
            }}
            hitSlop={{top: 5, left: 5, right: 5, bottom: 10}}>
            <BackArrow fill={theme.colors.background} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignSelf: 'center',
            flex: 2 / 3,
          }}>
          <Heading
            style={{
              textAlign: 'center',
              fontWeight: theme.fontWeights.veryBold,
            }}>
            Reports
          </Heading>
        </View>
      </View>
    </View>
  );
}

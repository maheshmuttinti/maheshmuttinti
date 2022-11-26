/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Dimensions} from 'react-native';
import {Heading, BaseButton, SubText} from 'uin';
import {useTheme} from 'theme';
const {height} = Dimensions.get('window');

export default function ({
  heading = 'Heading',
  text = 'Text goes here.....',
  buttonText = 'Submit',
  handleClick = () => {},
}) {
  const theme = useTheme();
  return (
    <View
      style={{
        paddingBottom: 52,
        paddingHorizontal: 24,
        marginTop: height >= 640 ? 378 : 'auto',
      }}>
      <Heading
        style={{
          color: theme.colors.primaryOrange,
          fontWeight: theme.fontWeights.veryBold,
          textAlign: 'center',
          ...theme.fontSizes.heading4,
        }}>
        {heading}
      </Heading>

      <SubText
        style={{
          color: theme.colors.bodyGray,
          paddingTop: 24,
          paddingHorizontal: 28,
          ...theme.fontSizes.medium,
          textAlign: 'center',
        }}>
        {text}
      </SubText>

      <View style={{paddingTop: 72, width: '100%'}}>
        <BaseButton onPress={() => handleClick()}>{buttonText}</BaseButton>
      </View>
    </View>
  );
}

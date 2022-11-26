/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Platform, View} from 'react-native';
import {
  BaseHeading,
  GrayBodyText,
  SmallOutlinedButton,
  Card,
  BlueSubHeading,
  GroupText,
  BlackBodyText,
  FilledButton,
} from 'uin';
import {useTheme} from 'theme';
import Slider from '@react-native-community/slider';

export default function ({ref, ...props}) {
  const theme = useTheme();
  const [years, setYears] = useState(7);

  const handleChangeSlider = v => {
    setYears(parseInt(v, 10));
  };
  return (
    <View
      {...props}
      ref={ref}
      style={{
        position: 'relative',
      }}>
      <Card
        style={{
          paddingTop: 16,
          paddingHorizontal: 16,
          paddingBottom: 20,
        }}>
        <BlueSubHeading>CALCULATORS</BlueSubHeading>
        <BaseHeading
          style={{
            paddingTop: 16,
            color: theme.colors.text,
            fontSize: theme.fontSizes.heading6.fontSize,
            lineHeight: 26,
            fontWeight: theme.fontWeights.veryBold,
          }}>
          How much returns can investors expect from Equity Markets now?
        </BaseHeading>
        <View
          style={{
            paddingTop: 15,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Slider
            style={{
              flex: 3 / 4,
              marginRight: 16,
              height: 50,
              transform:
                Platform.OS === 'android' ? [{scaleX: 1.1}, {scaleY: 1.5}] : [],
            }}
            minimumValue={0}
            maximumValue={10}
            minimumTrackTintColor={theme.colors.primaryYellow}
            maximumTrackTintColor={theme.colors.greyscale50}
            onSlidingComplete={v => {
              handleChangeSlider(v);
            }}
            thumbTintColor={theme.colors.primaryBlue}
            value={years}
          />

          <View style={{flex: 1 / 4, width: '100%'}}>
            <FilledButton
              extraStyles={{paddingTop: 15, paddingBottom: 13}}
              fontSize={theme.fontSizes.largeMedium.fontSize}
              textStyles={{lineHeight: 32}}
              onPress={() => {}}
              bgColor={theme.colors.greyscale100}
              borderRadius={10}
              textColor={theme.colors.text}>
              {`${years} Yrs`}
            </FilledButton>
          </View>
        </View>
        <GroupText style={{...theme.fontSizes.large, paddingTop: 16}}>
          <BlackBodyText>The probable expected return for </BlackBodyText>
          <BlueSubHeading>{`${years} Yrs is 40%`}</BlueSubHeading>
        </GroupText>
        <GrayBodyText style={{paddingTop: 24}}>
          Would you like to see a high probality of returns?
        </GrayBodyText>

        <View style={{marginTop: 20, width: 232, alignSelf: 'center'}}>
          <SmallOutlinedButton
            outlineColor={theme.colors.primaryOrange}
            textColor={theme.colors.primaryOrange}
            onPress={async () => {}}
            extraStyles={{paddingVertical: 4}}>
            Explore More
          </SmallOutlinedButton>
        </View>
      </Card>
    </View>
  );
}

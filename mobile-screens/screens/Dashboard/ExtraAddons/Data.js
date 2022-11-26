/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView} from 'react-native';
import {GradientCard, BlackBodyText, FilledButton, GroupText} from 'uin';
import {ActionBanner1} from 'assets';
import {useTheme} from 'theme';

export default function ({ref, ...props}) {
  const theme = useTheme();
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View
        {...props}
        ref={ref}
        style={{
          flexDirection: 'row',
        }}>
        {'.'
          .repeat(4)
          .split('')
          .map((item, index) => (
            <GradientCard
              key={index}
              style={{
                paddingLeft: 16,
                paddingRight: 8,
                paddingTop: 0,
                width: 312,
                marginRight: 8,
              }}
              gradientColors={['#FFE580', '#FFB500'].reverse()}>
              <View style={{flexDirection: 'row', overflow: 'hidden'}}>
                <View
                  style={{flex: 1 / 2, alignSelf: 'center', marginRight: 5}}>
                  <GroupText>
                    <BlackBodyText
                      style={{
                        fontSize: theme.fontSizes.large.fontSize,
                        lineHeight: 19.5,
                        fontWeight: theme.fontWeights.lightBold,
                      }}>
                      Don’t miss out on earning{' '}
                    </BlackBodyText>
                    <BlackBodyText
                      style={{
                        fontSize: theme.fontSizes.large.fontSize,
                        lineHeight: 19.5,
                        fontWeight: theme.fontWeights.veryBold,
                      }}>
                      ₹5000{' '}
                    </BlackBodyText>
                    <BlackBodyText
                      style={{
                        fontSize: theme.fontSizes.large.fontSize,
                        lineHeight: 19.5,
                        fontWeight: theme.fontWeights.lightBold,
                      }}>
                      today.
                    </BlackBodyText>
                  </GroupText>
                  <View style={{paddingTop: 12}}>
                    <FilledButton
                      extraStyles={{paddingTop: 0, paddingBottom: 0}}
                      fontSize={theme.fontSizes.small.fontSize}
                      textStyles={{lineHeight: 32}}
                      onPress={() => {}}
                      bgColor={'#000000'}
                      borderRadius={24}
                      textColor={'#ffffff'}>
                      Learn More
                    </FilledButton>
                  </View>
                </View>
                <View style={{flex: 1 / 2, alignSelf: 'flex-end'}}>
                  <ActionBanner1 />
                </View>
              </View>
            </GradientCard>
          ))}
      </View>
    </ScrollView>
  );
}

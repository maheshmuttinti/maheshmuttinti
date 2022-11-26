/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView} from 'react-native';
import {BaseHeading, OutlinedButton, Card, SubText, TextButton} from 'uin';
import {useTheme} from 'theme';
import {MaskedHouseIcon, BlueArrowRightIcon} from 'assets';

export default function ({ref, ...props}) {
  const theme = useTheme();
  return (
    <View
      {...props}
      ref={ref}
      style={{
        position: 'relative',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
        }}>
        <BaseHeading
          style={{
            flex: 2 / 3,
            color: theme.colors.text,
            fontSize: theme.fontSizes.medium.fontSize,
            lineHeight: 15.4,
            fontWeight: theme.fontWeights.veryBold,
          }}>
          GOALS
        </BaseHeading>
        <View
          style={{
            marginLeft: 'auto',
          }}>
          <TextButton
            style={{
              color: theme.colors.primaryOrange,
              fontWeight: theme.fontWeights.moreBold,
              ...theme.fontSizes.small,
              textDecorationLine: 'underline',
            }}>
            View all
          </TextButton>
        </View>
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={{flexDirection: 'row'}}>
          {[
            {
              label: 'Buy a 2 crore house in next 5 years.',
              value: 'Buy a 2 crore house in next 5 years.',
            },
            {
              label: 'Buy a 2 crore house in next 5 years.',
              value: 'Buy a 2 crore house in next 5 years.',
            },
            {
              label: 'Buy a 2 crore house in next 5 years.',
              value: 'Buy a 2 crore house in next 5 years.',
            },
          ].map((item, index) => (
            <Card
              style={{
                marginRight: 8,
                borderRadius: 14,
                alignItems: 'center',
                paddingTop: 11,
                paddingBottom: 12,
                width: 152,
                paddingHorizontal: 15,
                backgroundColor: theme.colors.background,
              }}
              key={index}>
              <View
                style={{
                  borderRadius: 14,
                  paddingTop: 13,
                  paddingBottom: 5,
                  position: 'absolute',
                  right: 0,
                  top: 0,
                }}>
                <MaskedHouseIcon />
              </View>

              <SubText
                style={{
                  color: theme.colors.text,
                  fontSize: theme.fontSizes.large.fontSize,
                  lineHeight: 20.86,
                  paddingBottom: 16,
                  paddingTop: 4,
                  fontWeight: theme.fontWeights.veryBold,
                }}>
                {item?.label}
              </SubText>
              <View
                style={{
                  marginTop: 42,
                  width: '100%',
                }}>
                <OutlinedButton
                  onPress={() => {}}
                  extraStyles={{height: 24, justifyContent: 'center'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                      paddingLeft: 16,
                      paddingRight: 8,
                    }}>
                    <SubText
                      style={{
                        color: theme.colors.primaryBlue,
                        fontWeight: theme.fontWeights.veryBold,
                      }}>
                      Set Goal
                    </SubText>
                    <View>
                      <BlueArrowRightIcon />
                    </View>
                  </View>
                </OutlinedButton>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

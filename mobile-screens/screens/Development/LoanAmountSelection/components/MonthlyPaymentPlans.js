/* eslint-disable react-native/no-inline-styles */
import {
  InfoIconBlue,
  RadioCircleFill,
  RadioCircleOutline,
  TickCircle,
} from 'assets';
import * as React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useTheme} from 'theme';
import {Heading, SubText} from 'uin';

export const MonthlyPaymentPlans = ({
  style = {},
  labelStyle = {},
  optionLabelStyle = {},
  optionSubLabelStyle = {},
}) => {
  const theme = useTheme();
  const [value, setValue] = React.useState('1');
  return (
    <View style={{...style}}>
      <View style={{flexDirection: 'row'}}>
        <Heading
          style={{
            color: theme.colors.text,
            ...theme.fontSizes.medium,
            fontWeight: theme.fontWeights.veryBold,
            lineHeight: 24,
            paddingBottom: 16,
            paddingRight: 5,
            ...labelStyle,
          }}>
          PICK YOUR MONTHLY PLAN
        </Heading>
        <View>
          <InfoIconBlue />
        </View>
      </View>

      <View>
        <View style={{flexDirection: 'row'}}>
          <View>
            <View style={{}}>
              {value ? (
                <TouchableOpacity
                  onPress={() => {
                    // onCheck(!value);
                  }}
                  hitSlop={{top: 5, left: 5, right: 5, bottom: 5}}
                  // disabled={disable}
                >
                  <RadioCircleFill />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    // onCheck(!value);
                  }}
                  hitSlop={{top: 5, left: 5, right: 5, bottom: 5}}>
                  <RadioCircleOutline />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={{paddingLeft: 10}}>
            <View style={{flexDirection: 'row'}}>
              <Heading
                style={{
                  color: theme.colors.text,
                  ...theme.fontSizes.medium,
                  fontWeight: theme.fontWeights.veryBold,
                  lineHeight: 24,
                  ...optionLabelStyle,
                }}>
                Balloon - ₹2000 - ₹5000
              </Heading>
              <Heading
                style={{
                  marginLeft: 6,
                  color: theme.colors.background,
                  paddingHorizontal: 4,
                  borderRadius: 6,
                  ...theme.fontSizes.small,
                  fontWeight: theme.fontWeights.veryBold,
                  lineHeight: 24,
                  backgroundColor: theme.colors.success,

                  ...optionLabelStyle,
                }}>
                RECOMMENDED
              </Heading>
            </View>
            <SubText
              style={{
                color: theme.colors.text,
                ...theme.fontSizes.xsmall,
                lineHeight: 24,
                ...optionSubLabelStyle,
              }}>
              Last month's payment will also include the principal amount
            </SubText>
          </View>
        </View>
        <View style={{paddingTop: 8, flexDirection: 'row'}}>
          <View>
            <View style={{}}>
              {!value ? (
                <TouchableOpacity
                  onPress={() => {
                    // onCheck(!value);
                  }}
                  hitSlop={{top: 5, left: 5, right: 5, bottom: 5}}
                  // disabled={disable}
                >
                  <RadioCircleFill />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    // onCheck(!value);
                  }}
                  hitSlop={{top: 5, left: 5, right: 5, bottom: 5}}>
                  <RadioCircleOutline />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={{paddingLeft: 10}}>
            <Heading
              style={{
                color: theme.colors.text,
                ...theme.fontSizes.medium,
                fontWeight: theme.fontWeights.veryBold,
                lineHeight: 24,
                paddingBottom: 16,
                ...optionLabelStyle,
              }}>
              EMI - ₹10,000 - ₹12,000
            </Heading>
          </View>
        </View>
      </View>
    </View>
  );
};

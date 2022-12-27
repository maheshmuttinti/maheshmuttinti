/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useTheme} from 'theme';
import {Card, Heading, LabelValue} from 'uin';
import {View} from 'react-native';
import {NBFCIcon} from 'assets';

export const SchemeCard = ({scheme}) => {
  const theme = useTheme();
  return (
    <>
      <Card
        style={{
          borderRadius: 10,
          borderColor: theme.colors.greyscale200,
          paddingHorizontal: 22,
          marginBottom: 16,
          borderWidth: theme.borderWidth.thin,
        }}>
        <View
          style={{
            position: 'absolute',
            top: -10,
            paddingHorizontal: 16,
            zIndex: 2,
          }}>
          {scheme?.recommended === true ? (
            <Heading
              style={{
                marginLeft: 6,
                color: theme.colors.background,
                paddingHorizontal: 6,
                borderRadius: 6,
                ...theme.fontSizes.xsmall,
                fontWeight: theme.fontWeights.veryBold,
                lineHeight: 24,
                backgroundColor: theme.colors.success,
              }}>
              RECOMMENDED
            </Heading>
          ) : null}
        </View>

        <View
          style={{
            paddingVertical: 20,
            paddingHorizontal: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignSchemes: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flex: 0.5 / 3,
                backgroundColor: theme.colors.background,
                width: 46,
                height: 46,
                borderRadius: 46 / 2,
                alignSchemes: 'center',
                justifyContent: 'center',
              }}>
              <NBFCIcon />
            </View>
            <View style={{flex: 2.5 / 3}}>
              <Heading
                style={{
                  color: theme.colors.text,
                  fontWeight: theme.fontWeights.bold,
                  ...theme.fontSizes.medium,
                  paddingHorizontal: 16,
                }}>
                {scheme?.scheme_name}
              </Heading>
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                paddingTop: 8,
              }}>
              <LabelValue
                title="Current Value"
                value={`₹ ${parseInt(scheme?.market_value, 10)}`}
                style={{
                  flex: 1.5 / 3,
                }}
                titleStyle={{...theme.fontSizes.small}}
                valueStyles={{
                  fontSize: theme.fontSizes.xlarge.fontSize,
                  lineHeight: 24,
                  fontWeight: theme.fontWeights.Bold,
                }}
              />
              <LabelValue
                title="ROI"
                value={`${scheme?.roi}%`}
                style={{
                  flex: 1 / 3,
                }}
                titleStyle={{...theme.fontSizes.small}}
                valueStyles={{
                  fontSize: theme.fontSizes.xlarge.fontSize,
                  lineHeight: 24,
                  fontWeight: theme.fontWeights.Bold,
                }}
              />
              <LabelValue
                title="Pre Approved Amt"
                value={`₹ ${parseInt(scheme?.pre_approved_loan_amount, 10)}`}
                style={{
                  flex: 1.5 / 3,
                }}
                titleStyle={{...theme.fontSizes.small}}
                valueStyles={{
                  fontSize: theme.fontSizes.xlarge.fontSize,
                  lineHeight: 24,
                  fontWeight: theme.fontWeights.Bold,
                }}
              />
            </View>
          </View>
        </View>
      </Card>
    </>
  );
};

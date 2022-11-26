/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ScrollView, View} from 'react-native';
import {BaseHeading, Card, SubText} from 'uin';
import {useTheme} from 'theme';
import {TaxSaverFundsIcon} from 'assets';

export default function ({ref, ...props}) {
  const theme = useTheme();
  return (
    <View
      {...props}
      ref={ref}
      style={{
        position: 'relative',
      }}>
      <BaseHeading
        style={{
          color: theme.colors.text,
          fontSize: theme.fontSizes.medium.fontSize,
          lineHeight: 15.4,
          fontWeight: theme.fontWeights.veryBold,
          marginBottom: 16,
        }}>
        MORE FUND OPTIONS FOR YOU
      </BaseHeading>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={{flexDirection: 'row'}}>
          {[
            {label: 'Tax Saver Funds', value: 'Tax Saver Funds'},
            {label: 'Low Risk Funds', value: 'Low Risk Funds'},
            {label: 'Low Risk Funds 1', value: 'Low Risk Funds 1'},
          ].map((item, index) => (
            <Card
              style={{
                marginRight: 8,
                borderRadius: 14,
                alignItems: 'center',
              }}
              key={index}>
              <View
                style={{
                  width: 152,
                  backgroundColor: theme.colors.backgroundOrange,
                  borderRadius: 14,
                  paddingTop: 13,
                  paddingBottom: 5,
                }}>
                <View style={{alignSelf: 'center'}}>
                  <TaxSaverFundsIcon />
                </View>
              </View>
              <View
                style={{
                  paddingTop: 8,
                  backgroundColor: theme.colors.background,
                  width: '100%',
                  borderBottomLeftRadius: 14,
                  borderBottomRightRadius: 14,
                }}>
                <SubText
                  style={{
                    color: theme.colors.primaryBlue,
                    fontSize: theme.fontSizes.medium.fontSize,
                    lineHeight: 18.26,
                    paddingBottom: 16,
                    paddingTop: 4,
                    textAlign: 'center',
                    fontWeight: theme.fontWeights.moreBold,
                  }}>
                  {item?.label}
                </SubText>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={{flexDirection: 'row', marginTop: 16}}>
          {[
            {label: 'Tax Saver Funds', value: 'Tax Saver Funds'},
            {label: 'Low Risk Funds', value: 'Low Risk Funds'},
            {label: 'Low Risk Funds 1', value: 'Low Risk Funds 1'},
          ].map((item, index) => (
            <View
              style={{
                backgroundColor: theme.colors.background,
                marginRight: 8,
                borderRadius: 14,
                alignItems: 'center',
              }}
              key={index}>
              <View
                style={{
                  width: 152,
                  backgroundColor: theme.colors.backgroundOrange,
                  borderRadius: 14,
                  paddingTop: 13,
                  paddingBottom: 5,
                }}>
                <View style={{alignSelf: 'center'}}>
                  <TaxSaverFundsIcon />
                </View>
              </View>
              <View
                style={{
                  paddingTop: 8,
                  backgroundColor: theme.colors.background,
                  width: '100%',
                  borderBottomLeftRadius: 14,
                  borderBottomRightRadius: 14,
                }}>
                <SubText
                  style={{
                    color: theme.colors.primaryBlue,
                    fontSize: theme.fontSizes.medium.fontSize,
                    lineHeight: 18.26,
                    paddingBottom: 16,
                    paddingTop: 4,
                    textAlign: 'center',
                    fontWeight: theme.fontWeights.moreBold,
                  }}>
                  {item?.label}
                </SubText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

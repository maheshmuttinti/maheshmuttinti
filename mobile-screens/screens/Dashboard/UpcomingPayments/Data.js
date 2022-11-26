/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView} from 'react-native';
import {
  BaseHeading,
  OutlinedButton,
  Card,
  SubText,
  TextButton,
  BlueSubHeading,
  GrayBodyText,
  GroupText,
} from 'uin';
import {useTheme} from 'theme';
import {BlueArrowRightIcon, WalletIcon} from 'assets';

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
          YOUR UPCOMING PAYMENTS
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
              sipAmount: '₹30000',
              sipDueDate: '4th April 2022',
              paymentStatus: 'upcoming',
            },
            {
              sipAmount: '₹30000',
              sipDueDate: '4th April 2022',
              paymentStatus: 'paid',
            },
            {
              sipAmount: '₹30000',
              sipDueDate: '4th April 2022',
              paymentStatus: 'upcoming',
            },
          ].map((item, index) => (
            <Card
              style={{
                marginRight: 8,
                borderRadius: 14,
                paddingVertical: 16,
                width: 152,
                paddingLeft: 8,
                backgroundColor: theme.colors.background,
              }}
              key={index}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    flex: 1.5 / 3,
                  }}>
                  <View
                    style={{
                      backgroundColor: theme.colors.backgroundOrange,
                      height: 34,
                      width: 34,
                      borderRadius: 34 / 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <WalletIcon />
                  </View>
                </View>
                <View
                  style={{
                    flex: 1.5 / 3,
                    marginLeft: 'auto',
                    marginTop: 10,
                    paddingLeft: 12,
                    height: 16,
                    borderTopLeftRadius: 14,
                    borderBottomLeftRadius: 14,
                    backgroundColor:
                      (item?.paymentStatus === 'upcoming' &&
                        theme.colors.primaryYellow) ||
                      (item?.paymentStatus === 'paid' &&
                        theme.colors.success) ||
                      (item?.paymentStatus === 'unpaid' &&
                        theme.colors.error) ||
                      'transparent',
                  }}>
                  <SubText
                    style={{
                      color:
                        (item?.paymentStatus === 'paid' && '#ffffff') ||
                        theme.colors.text,
                      fontSize: theme.fontSizes.xsmall.fontSize,
                      fontWeight: theme.fontWeights.veryBold,
                    }}>
                    {item?.paymentStatus === 'upcoming' && 'Upcoming'}
                    {item?.paymentStatus === 'paid' && 'Paid'}
                    {item?.paymentStatus === 'unpaid' && 'UnPaid'}
                    {''}
                  </SubText>
                </View>
              </View>

              <View style={{marginTop: 12}}>
                <SubText
                  style={{
                    color: theme.colors.text,
                    fontSize: theme.fontSizes.small.fontSize,
                    lineHeight: 12.56,
                    fontWeight: theme.fontWeights.moreBold,
                  }}>
                  SIP Transfer
                </SubText>
                <BlueSubHeading
                  style={{
                    fontSize: theme.fontSizes.heading4.fontSize,
                    lineHeight: 34,
                    paddingTop: 4,
                  }}>
                  {item?.sipAmount}
                </BlueSubHeading>
                <View style={{paddingTop: 4}}>
                  <GroupText>
                    <GrayBodyText
                      style={{
                        fontSize: theme.fontSizes.small.fontSize,
                        color: theme.colors.greyscale500,
                      }}>
                      due on{' '}
                    </GrayBodyText>
                    <GrayBodyText
                      style={{
                        color: theme.colors.greyscale500,
                        fontSize: theme.fontSizes.small.fontSize,
                        fontWeight: theme.fontWeights.veryBold,
                      }}>
                      {item?.sipDueDate}
                    </GrayBodyText>
                  </GroupText>
                </View>
                <View
                  style={{
                    marginTop: 42,
                    width: '100%',
                    paddingRight: 21,
                  }}>
                  <OutlinedButton
                    onPress={() => {}}
                    extraStyles={{
                      height: 24,
                      justifyContent: 'center',
                    }}>
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
                        {(item?.paymentStatus === 'upcoming' && 'Pay Now') ||
                          (item?.paymentStatus === 'paid' && 'Pay More')}
                        {''}
                      </SubText>
                      <View>
                        <BlueArrowRightIcon />
                      </View>
                    </View>
                  </OutlinedButton>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

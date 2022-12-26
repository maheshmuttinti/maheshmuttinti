/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {Platform, Pressable, Text, View} from 'react-native';
import ScreenWrapper from '../../../../../hocs/screenWrapperWithoutBackButton';
import {useTheme} from 'theme';
import {Card, Heading, LabelValue, SmallOutlinedButton} from 'uin';
import {ApplicantAvatar, BackArrow, NBFCIcon} from 'assets';
import useLayoutBackButtonAction from '../../../../../reusables/useLayoutBackButtonAction';
import {nbfcs as nbfcsData} from '../../data/nbfcs';

export default function ({navigation, route}) {
  const nbfcs = route?.params?.nbfcs || nbfcsData;
  const theme = useTheme();
  const [nbfcTextMaxHeight, setNbfcTextMaxHeight] = useState(0);
  const textRef = useRef(null);

  const handleTextLayout = event => {
    if (event && event.nativeEvent) {
      const linesLastIndex = event?.nativeEvent?.lines?.length - 1;
      const {baseline} = event?.nativeEvent?.lines?.[linesLastIndex];
      setNbfcTextMaxHeight(Math.max(nbfcTextMaxHeight, baseline));
    }
  };

  useLayoutBackButtonAction(theme.colors.background);
  return (
    <ScreenWrapper backgroundColor={theme.colors.primaryBlue}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: theme.colors.primaryBlue,
          width: '100%',
          flex: 1,
          paddingTop: Platform.OS === 'ios' ? 42 : 24,
        }}>
        <Pressable
          hitSlop={{top: 30, left: 30, right: 30, bottom: 30}}
          onPress={() => {
            navigation.canGoBack() && navigation.pop();
          }}
          style={{width: 50, marginLeft: 16}}>
          <BackArrow fill={theme.colors.primary} />
        </Pressable>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Heading
            style={{
              fontWeight: 'bold',
              fontFamily: theme.fonts.regular,
              ...theme.fontSizes.large,
            }}>
            Compare NBFC
          </Heading>
        </View>
        <View style={{flex: 1 / 3, alignItems: 'center'}}>
          <View style={{height: 24, width: 24}}>
            <ApplicantAvatar />
          </View>
        </View>
      </View>
      <View style={{flexDirection: 'row', paddingTop: 24}}>
        {nbfcs?.map((_, index) => (
          <View
            key={index}
            style={{
              flex: 1 / nbfcs?.length,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: theme.colors.primary,
                width: 60,
                height: 60,
                borderRadius: 60 / 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <NBFCIcon />
            </View>

            {nbfcs?.length !== 3 && index === 0 && (
              <Heading
                style={{
                  left: '100%',
                  zIndex: 12,
                  ...theme.fontSizes.small,
                }}>
                VS
              </Heading>
            )}

            {nbfcs?.length === 3 && index !== 2 && (
              <Heading
                style={{
                  left: '50%',
                  zIndex: 12,
                  ...theme.fontSizes.small,
                }}>
                VS
              </Heading>
            )}
          </View>
        ))}
      </View>
      <Card
        style={{
          backgroundColor: theme.colors.primary,
          paddingTopLeftRadius: 12,
          paddingTopRightRadius: 12,
          paddingBottomLeftRadius: 0,
          paddingBottomLRightRadius: 0,
          width: '100%',
          marginTop: nbfcs?.length > 1 ? 24 : 44,
          paddingHorizontal: 16,
          flex: 1,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'baseline',
            marginTop: 24,
            marginBottom: 180,
          }}>
          {nbfcs?.map((item, index) => (
            <View
              key={index}
              style={{
                flex: 1 / nbfcs?.length,
                marginRight: index === nbfcs?.length - 1 ? 0 : 8,
              }}>
              <View>
                <View
                  style={{
                    overflow: 'scroll',
                    height: nbfcTextMaxHeight,
                    // backgroundColor: 'cyan',
                  }}>
                  <Text
                    ref={textRef}
                    onTextLayout={handleTextLayout}
                    style={{
                      color: theme.colors.text,
                      fontWeight: theme.fontWeights.lightBold,
                      ...theme.fontSizes.medium,
                      textAlign: 'center',
                      position: 'absolute',
                      width: '100%',
                      top: 0,
                      alignItems: 'flex-start',
                    }}>
                    {item?.fi_name}
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 16,
                  }}>
                  <LabelValue
                    style={{}}
                    titleStyle={{
                      fontSize: 12,
                      lineHeight: 26,
                      textAlign: 'center',
                    }}
                    valueStyle={{
                      fontSize: 14,
                      lineHeight: 24,
                      fontWeight: theme.fontWeights.Bold,
                      textAlign: 'center',
                    }}
                    title="Amount"
                    value={`₹${item?.fi_master_data?.max_amount}`}
                  />
                  <LabelValue
                    style={{paddingTop: 8}}
                    titleStyle={{
                      fontSize: 12,
                      lineHeight: 26,
                      textAlign: 'center',
                    }}
                    valueStyle={{
                      fontSize: 14,
                      lineHeight: 24,
                      fontWeight: theme.fontWeights.Bold,
                      textAlign: 'center',
                    }}
                    title="ROI"
                    value={`${item?.fi_master_data?.roi}%`}
                  />
                  <LabelValue
                    style={{paddingTop: 8}}
                    titleStyle={{
                      fontSize: 12,
                      lineHeight: 26,
                      textAlign: 'center',
                    }}
                    valueStyle={{
                      fontSize: 14,
                      lineHeight: 24,
                      fontWeight: theme.fontWeights.Bold,
                      textAlign: 'center',
                    }}
                    title="Tenure"
                    value={`${item?.fi_master_data?.max_tenure}`}
                  />
                  <LabelValue
                    style={{paddingTop: 8}}
                    titleStyle={{
                      fontSize: 12,
                      lineHeight: 26,
                      textAlign: 'center',
                    }}
                    valueStyle={{
                      fontSize: 14,
                      lineHeight: 24,
                      fontWeight: theme.fontWeights.Bold,
                      textAlign: 'center',
                    }}
                    title="EMI"
                    value="₹12,000"
                  />
                  <LabelValue
                    style={{paddingTop: 8}}
                    titleStyle={{
                      fontSize: 12,
                      lineHeight: 26,
                      textAlign: 'center',
                    }}
                    valueStyle={{
                      fontSize: 14,
                      lineHeight: 24,
                      fontWeight: theme.fontWeights.Bold,
                      textAlign: 'center',
                    }}
                    title="Processing Fee"
                    value={`₹ ${item?.fi_master_data?.processing_fee}`}
                  />
                  <View style={{width: '100%', marginTop: 63}}>
                    <SmallOutlinedButton
                      onPress={() => {
                        navigation.navigate('SelectSchemes', {
                          nbfc_code: item?.fi_code,
                          pan: 'ENBPM4556D',
                          total: item?.fi_master_data?.max_amount,
                        });
                      }}
                      extraStyles={{paddingVertical: 4}}
                      textStyles={{
                        ...theme.fontSizes.small,
                        fontWeight: theme.fontWeights.veryBold,
                      }}
                      outlineColor="#FF5500"
                      textColor="#FF5500">
                      Select NBFC
                    </SmallOutlinedButton>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </Card>
    </ScreenWrapper>
  );
}

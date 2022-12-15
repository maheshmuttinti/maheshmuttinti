/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View} from 'react-native';
import ScreenWrapper from '../../hocs/screenWrapper';
import {useTheme} from 'theme';
import {Card, Heading, LabelValue, SmallOutlinedButton} from 'uin';
import {NBFCIcon} from 'assets';
import {useSelector, useDispatch} from 'react-redux';
import {clearNbfc} from 'store';
import useLayoutBackButtonAction from '../../reusables/useLayoutBackButtonAction';

const Index = ({navigation}) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    return () => {
      dispatch(clearNbfc());
    };
  }, [navigation]);

  const compareNbfc = useSelector(state => {
    return state.compareNbfc.nbfcData;
  });

  useLayoutBackButtonAction(theme.colors.background);
  return (
    <ScreenWrapper backgroundColor={theme.colors.primaryBlue}>
      <View style={{flexDirection: 'row', paddingTop: 4}}>
        {compareNbfc?.map((item, index) => (
          <View
            key={index}
            style={{
              flex: 1 / compareNbfc?.length,
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

            {compareNbfc?.length !== 3 && index === 0 && (
              <Heading
                style={{
                  left: '100%',
                  zIndex: 12,
                  ...theme.fontSizes.small,
                }}>
                VS
              </Heading>
            )}

            {compareNbfc?.length === 3 && index !== 2 && (
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
          marginTop: compareNbfc?.length > 1 ? 24 : 44,
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
          {compareNbfc?.map((item, index) => (
            <View
              key={index}
              style={{
                flex: 1 / compareNbfc?.length,
                marginRight: index === compareNbfc?.length - 1 ? 0 : 8,
              }}>
              <View>
                <Heading
                  style={{
                    color: theme.colors.text,
                    fontWeight: theme.fontWeights.lightBold,
                    ...theme.fontSizes.medium,
                    textAlign: 'center',
                  }}>
                  {item?.nbfc?.nbfc_name}
                </Heading>
                <View
                  style={{
                    paddingTop: 16,
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
                    value={`₹${item.total_pre_approved_loan_amount}`}
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
                    value={`${item.nbfc.roi}%`}
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
                    value="36 months"
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
                    value="₹ 500"
                  />
                  <View style={{width: '100%', marginTop: 63}}>
                    <SmallOutlinedButton
                      onPress={() => {
                        navigation.navigate('SelectSchemes', {
                          nbfc_code: item?.nbfc?.nbfc_code,
                          pan: 'ZZZPK3751B',
                          total: item.total_pre_approved_loan_amount,
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
};

export default Index;

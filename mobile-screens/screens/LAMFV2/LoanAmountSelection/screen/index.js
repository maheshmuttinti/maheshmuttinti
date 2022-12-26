/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, ScrollView, Platform, Pressable} from 'react-native';
import ScreenWrapper from '../../../../hocs/screenWrapperWithoutBackButton';
import {useTheme} from 'theme';
import _ from 'lodash';
import {Heading, BaseTextInput, BaseButton} from 'uin';
import {BackArrow} from 'assets';
import {useEffect} from 'react';
import {debugLog, isNumber} from 'utils';
import useLayoutBackButtonAction from '../../../../reusables/useLayoutBackButtonAction';
import {SliderWithLabels} from '../components/SliderWithLabels';
import {SelectTenure} from '../components/SelectTenure';
import {MonthlyPaymentPlans} from '../components/MonthlyPaymentPlans';

export default function ({route, navigation}) {
  const theme = useTheme();

  const [loanAmount, setLoanAmount] = useState(null);
  const [minLoanAmount, setMinLoanAmount] = useState(0);
  const [maxLoanAmount, setMaxLoanAmount] = useState(10000);
  const [emiTenures, setEMITenures] = useState([]);
  const [allEMITenures, setAllEMITenures] = useState([
    {label: '24 Months', value: '24 Months'},
    {label: '21 Months', value: '21 Months'},
    {label: '18 Months', value: '18 Months'},
    {label: '15 Months', value: '15 Months'},
    {label: '12 Months', value: '12 Months'},
    {label: '9 Months', value: '9 Months'},
    {label: '6 Months', value: '6 Months'},
  ]);
  const [ballonAndEMIDecider, setBallonAndEMIDecider] = useState({
    type: 'balloonAndEMI',
    recommended: 'balloon',
    data: [
      {
        label: '₹2000 - ₹5000',
        value: '2000-5000',
      },
      {
        label: '₹10,000 - ₹12,000',
        value: '10,000 - 12,000',
      },
    ],
  });

  useLayoutBackButtonAction(theme.colors.background);

  useEffect(() => {
    setLoanAmount(10000);
  }, []);

  useEffect(() => {
    if (allEMITenures?.length > 6) {
      const _allEMITenures = [...allEMITenures];
      const _6EMITenures = _allEMITenures.slice(0, 6);
      setEMITenures(_6EMITenures);
    } else {
      setEMITenures(allEMITenures);
    }
  }, [allEMITenures]);

  const handleChangeLoanAmountOnTextInput = value => {
    const numericValue = value?.startsWith('₹') ? value.slice(1) : value;
    const finalLoanAmount = isNumber(numericValue)
      ? numericValue
      : numericValue;
    setLoanAmount(finalLoanAmount);
  };

  const handleSubmit = () => {
    debugLog('submit');
  };

  const handleOnToggleSeeMore = () => {
    const _allEMITenures = [...allEMITenures];

    if (_allEMITenures?.length > 6) {
      if (emiTenures?.length === allEMITenures?.length) {
        const _6EMITenures = _allEMITenures.slice(0, 6);
        setEMITenures(_6EMITenures);
      } else {
        setEMITenures(_allEMITenures);
      }
    }
  };

  const handleChangeSlider = value => {
    setLoanAmount(value);
  };

  return (
    <>
      <ScreenWrapper
        backgroundColor={theme.colors.primaryBlue}
        scrollView={false}
        footer={true}>
        <View
          style={{
            position: 'relative',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            backgroundColor: theme.colors.primaryBlue,
          }}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: theme.colors.primaryBlue,
              width: '100%',
              paddingBottom: 13,
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
            <Heading
              style={{
                fontWeight: 'bold',
                fontFamily: theme.fonts.regular,
                marginLeft: 16,
                ...theme.fontSizes.large,
              }}>
              Loans Against Mutual Funds
            </Heading>
          </View>

          <View
            style={{
              alignItems: 'center',
              paddingTop: 32,
              paddingBottom: 16,
            }}>
            <Heading
              style={{
                fontSize: theme.fontSizes.heading4.fontSize,
                lineHeight: 24,
                fontWeight: theme.fontWeights.veryBold,
              }}>
              Mahesh Muttinti
            </Heading>
            <View style={{}}>
              <Heading
                style={{
                  ...theme.fontSizes.medium,
                  fontWeight: theme.fontWeights.veryBold,
                }}>
                ENBPM4556D
              </Heading>
            </View>
          </View>

          <ScrollView
            nestedScrollEnabled={true}
            contentInsetAdjustmentBehavior="automatic"
            style={{
              backgroundColor: theme.colors.background,
              width: '100%',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}>
            <View
              style={{
                backgroundColor: theme.colors.background,
                flex: 1,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                paddingTop: 24,
                paddingHorizontal: 16,
              }}>
              <Heading
                style={{
                  fontSize: theme.fontSizes.heading4.fontSize,
                  lineHeight: 31,
                  fontWeight: theme.fontWeights.veryBold,
                  color: theme.colors.text,
                }}>
                How much loan are you looking for?
              </Heading>
              <View
                style={{
                  paddingTop: 24,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: '80%',
                    alignItems: 'center',
                  }}>
                  <BaseTextInput
                    keyboardType="numeric"
                    prefixValue={'₹'}
                    onChangeText={handleChangeLoanAmountOnTextInput}
                    value={`${loanAmount}`}
                    extraTextStyles={{
                      color: theme.colors.primaryBlue,
                      fontWeight: theme.fontWeights.Bold,
                      fontSize: 30,
                      paddingVertical: 9,
                      textAlign: 'center',
                    }}
                  />
                </View>
              </View>
              <SliderWithLabels
                loanAmount={+loanAmount}
                minLoanAmount={minLoanAmount}
                maxLoanAmount={maxLoanAmount}
                onSliderChange={handleChangeSlider}
              />

              {emiTenures?.length > 0 ? (
                <SelectTenure
                  onSelect={tenure => {
                    debugLog('tenure: ', tenure);
                  }}
                  emiTenures={emiTenures}
                  allEMITenures={allEMITenures}
                  defaultEMITenure={{label: '24 Months', value: '24 Months'}}
                  style={{paddingTop: 24}}
                  labelStyle={{}}
                  columnCount={3}
                  textStyles={{textAlign: 'left'}}
                  onToggleSeeMore={() => {
                    handleOnToggleSeeMore();
                  }}
                />
              ) : null}

              <MonthlyPaymentPlans
                style={{paddingTop: 16}}
                renderUI={ballonAndEMIDecider}
              />

              <View style={{paddingTop: 24, paddingBottom: 60}}>
                <BaseButton
                  onPress={() => {
                    handleSubmit();
                  }}
                  gradientColors={[
                    theme.colors.primaryOrange800,
                    theme.colors.primaryOrange,
                  ]}>
                  Proceed
                </BaseButton>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScreenWrapper>
    </>
  );
}

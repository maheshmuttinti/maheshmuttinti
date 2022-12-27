/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, Platform, Pressable} from 'react-native';
import ScreenWrapper from '../../../../hocs/screenWrapperWithoutBackButton';
import {useTheme} from 'theme';
import _ from 'lodash';
import {Heading, BaseTextInput, BaseButton} from 'uin';
import {ApplicantAvatar, BackArrow} from 'assets';
import {SliderWithLabels} from '../components/SliderWithLabels';
import {SelectTenure} from '../components/SelectTenure';
import {SelectInstallmentType} from '../components/SelectInstallmentType';
import {useLoanAmountSelectionHandler} from '../hooks/useLoanAmountSelectionHandler';

export default function ({navigation, route}) {
  const theme = useTheme();
  const {
    nbfcsFilterForm,
    minLoanAmount,
    maxLoanAmount,
    emiTenures,
    allMappedEMITenures,
    installmentTypeDecider,
    handleChangeLoanAmountOnTextInput,
    handleChangeSlider,
    handleSelectTenure,
    handleOnToggleSeeMore,
    handleOnSelectMonthlyPlan,
    handleSubmit,
  } = useLoanAmountSelectionHandler(navigation, route);

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
            <View style={{flex: 1, alignItems: 'center'}}>
              <Heading
                style={{
                  fontWeight: 'bold',
                  fontFamily: theme.fonts.regular,
                  ...theme.fontSizes.large,
                }}>
                Loans Against Mutual Funds
              </Heading>
            </View>
            <View style={{flex: 1 / 3, alignItems: 'center'}}>
              <View style={{height: 24, width: 24}}>
                <ApplicantAvatar />
              </View>
            </View>
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
              {nbfcsFilterForm?.value?.amount ? (
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
                      value={`${nbfcsFilterForm?.value?.amount}`}
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
              ) : null}
              {nbfcsFilterForm?.value?.amount &&
              minLoanAmount &&
              maxLoanAmount ? (
                <SliderWithLabels
                  loanAmount={+nbfcsFilterForm?.value?.amount}
                  minLoanAmount={+minLoanAmount}
                  maxLoanAmount={+maxLoanAmount}
                  onSliderChange={handleChangeSlider}
                />
              ) : null}

              {emiTenures?.length > 0 && allMappedEMITenures?.length > 0 ? (
                <SelectTenure
                  onSelect={handleSelectTenure}
                  emiTenures={emiTenures}
                  allEMITenures={allMappedEMITenures}
                  defaultEMITenure={nbfcsFilterForm?.value?.filters?.tenure}
                  style={{paddingTop: 24}}
                  labelStyle={{}}
                  columnCount={3}
                  textStyles={{textAlign: 'left'}}
                  onToggleSeeMore={() => handleOnToggleSeeMore(emiTenures)}
                />
              ) : null}

              {installmentTypeDecider ? (
                <SelectInstallmentType
                  style={{paddingTop: 16}}
                  renderUI={installmentTypeDecider}
                  onSelectedInstallmentType={handleOnSelectMonthlyPlan}
                />
              ) : null}

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

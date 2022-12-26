/* eslint-disable react-native/no-inline-styles */
import React, {useState, useMemo, useCallback} from 'react';
import {View, ScrollView, Platform, Pressable} from 'react-native';
import ScreenWrapper from '../../../../hocs/screenWrapperWithoutBackButton';
import {useTheme} from 'theme';
import _ from 'lodash';
import {Heading, BaseTextInput, BaseButton} from 'uin';
import {ApplicantAvatar, BackArrow} from 'assets';
import {useEffect} from 'react';
import {debugLog, isNumber, prettifyJSON} from 'utils';
import useLayoutBackButtonAction from '../../../../reusables/useLayoutBackButtonAction';
import {SliderWithLabels} from '../components/SliderWithLabels';
import {SelectTenure} from '../components/SelectTenure';
import {SelectInstallmentType} from '../components/SelectInstallmentType';
import useBetaForm from '@reusejs/react-form-hook';
import {getNBFCs} from 'services';

export default function ({route, navigation}) {
  const theme = useTheme();
  useLayoutBackButtonAction(theme.colors.background);

  const {
    loanAmount: loanAmountFromRouteParams,
    minLoanAmount: minLoanAmountFromRouteParams,
    maxLoanAmount: maxLoanAmountFromRouteParams,
    availableFilterOptions: {tenures, installment_types},
  } = route?.params;

  const memoizedAllMappedEMITenures = useMemo(
    () =>
      tenures?.map(tenure => ({
        label: tenure,
        value: tenure?.includes(' Months')
          ? tenure?.slice(0, tenure?.indexOf(' Months'))
          : tenure,
      })),
    [tenures],
  );
  const initialMemoizedEMITenures = useMemo(() => {
    const _memoizedAllMappedEMITenures = [...memoizedAllMappedEMITenures];
    console.log(
      'useMemo->_memoizedAllMappedEMITenures: ',
      _memoizedAllMappedEMITenures,
    );
    if (_memoizedAllMappedEMITenures?.length > 6) {
      const _6EMITenures = _memoizedAllMappedEMITenures.slice(0, 6);
      return _6EMITenures;
    } else {
      return _memoizedAllMappedEMITenures;
    }
  }, [memoizedAllMappedEMITenures]);

  const [allMappedEMITenures, setAllMappedEMITenures] = useState(
    memoizedAllMappedEMITenures,
  );

  const memoizedDefaultEMITenure = useMemo(
    () => memoizedAllMappedEMITenures?.[0],
    [memoizedAllMappedEMITenures],
  );
  const [defaultEMITenure, setDefaultEMITenure] = useState(
    memoizedDefaultEMITenure,
  );
  const defaultInstallmentType =
    useMemo(
      () => memoizedAllMappedEMITenures?.[0],
      [memoizedAllMappedEMITenures],
    ) || 'emi';

  const minLoanAmount = useMemo(
    () => minLoanAmountFromRouteParams,
    [minLoanAmountFromRouteParams],
  );
  const maxLoanAmount = useMemo(
    () => maxLoanAmountFromRouteParams,
    [maxLoanAmountFromRouteParams],
  );
  const [emiTenures, setEMITenures] = useState(initialMemoizedEMITenures);

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

  const nbfcsFilterForm = useBetaForm({
    amount: loanAmountFromRouteParams,
    filters: {
      tenure: defaultEMITenure,
      installment_type: defaultInstallmentType,
    },
  });

  const handleGetNBFCs = async payload => {
    try {
      const getNBFCsResponse = await getNBFCs(payload);
      debugLog('getNBFCsResponse: ', prettifyJSON(getNBFCsResponse));

      return getNBFCsResponse;
    } catch (error) {
      throw error;
    }
  };

  const handleSetFilters = useCallback(async payload => {
    try {
      const nbfcs = await handleGetNBFCs(payload);
      const availableFilterOptions = nbfcs?.available_filter_options;
      const allEMITenures = availableFilterOptions?.tenures;
      const mappedAllEMITenures = allEMITenures?.map(tenure => ({
        label: tenure,
        value: tenure?.includes(' Months')
          ? tenure?.slice(0, tenure?.indexOf(' Months'))
          : tenure,
      }));
      const defaultEMITenureOnChangeSlider = mappedAllEMITenures?.[0];
      console.log(
        'defaultEMITenureOnChangeSlider: ',
        defaultEMITenureOnChangeSlider,
      );
      setAllMappedEMITenures(mappedAllEMITenures);
      setDefaultEMITenure(defaultEMITenureOnChangeSlider);
    } catch (error) {
      throw error;
    }
  }, []);

  const handleChangeLoanAmountOnTextInput = useCallback(
    async value => {
      try {
        const numericValue = value?.startsWith('₹') ? value.slice(1) : value;
        let finalLoanAmount = isNumber(numericValue)
          ? numericValue
          : numericValue;
        if (finalLoanAmount < minLoanAmount) {
          finalLoanAmount = minLoanAmount;
          nbfcsFilterForm?.setField('amount', +finalLoanAmount);
        } else {
          finalLoanAmount = minLoanAmount;
          nbfcsFilterForm?.setField('amount', +finalLoanAmount);
        }
        const payload = {
          amount: +finalLoanAmount,
        };
        console.log(
          'handleChangeLoanAmountOnTextInput->payload for handleGetNBFCs: ',
          prettifyJSON(payload),
        );
        await handleSetFilters(payload);
      } catch (error) {
        throw error;
      }
    },
    [handleSetFilters, nbfcsFilterForm?.value],
  );

  const handleChangeSlider = useCallback(
    async value => {
      try {
        nbfcsFilterForm?.setField('amount', +value);
        const payload = {
          amount: +value,
        };
        console.log(
          'handleChangeSlider->payload for handleGetNBFCs: ',
          prettifyJSON(payload),
        );
        await handleSetFilters(payload);
      } catch (error) {
        throw error;
      }
    },
    [handleSetFilters, nbfcsFilterForm?.value],
  );

  const handleOnToggleSeeMore = useCallback(
    _emiTenures => {
      console.log('handleOnToggleSeeMore->_emiTenures: ', _emiTenures);
      const _allMappedEMITenures = [...allMappedEMITenures];
      console.log(
        'handleOnToggleSeeMore->_allMappedEMITenures: ',
        _allMappedEMITenures,
      );
      if (_allMappedEMITenures?.length > 6) {
        if (_emiTenures?.length === allMappedEMITenures?.length) {
          const _6EMITenures = _allMappedEMITenures.slice(0, 6);
          setEMITenures(_6EMITenures);
          nbfcsFilterForm?.setField('filters.tenure', _6EMITenures?.[0]);
        } else {
          setEMITenures(_allMappedEMITenures);
          nbfcsFilterForm?.setField(
            'filters.tenure',
            _allMappedEMITenures?.[0],
          );
        }
      }
    },
    [allMappedEMITenures, nbfcsFilterForm?.value],
  );

  const handleSelectTenure = useCallback(
    tenure => {
      debugLog('tenure: ', tenure);
      nbfcsFilterForm?.setField('filters.tenure', tenure);
    },
    [nbfcsFilterForm?.value],
  );

  const handleOnSelectMonthlyPlan = useCallback(
    installmentType => {
      debugLog('installmentType: ', installmentType);
      nbfcsFilterForm?.setField('filters.installment_type', installmentType);
    },
    [nbfcsFilterForm?.value],
  );

  const handleSubmit = async () => {
    try {
      const payload = {
        ...nbfcsFilterForm?.value,
        filters: {
          tenure: nbfcsFilterForm?.value?.filters?.tenure?.value,
          installment_type:
            nbfcsFilterForm?.value?.filters?.installment_type?.value,
        },
      };
      debugLog('payload on submit', prettifyJSON(payload));

      const handleGetNBFCsResponse = await handleGetNBFCs(payload);
      debugLog('handleGetNBFCsResponse: ', handleGetNBFCsResponse);
      let nbfcs = handleGetNBFCsResponse?.nbfcs;

      console.log('nbfcs after adding other--------: ', prettifyJSON(nbfcs));
      if (nbfcs?.length === 1) {
        navigation.navigate('LAMFV2', {screen: 'ChooseNBFCSingle'});
      } else if (nbfcs?.length === 2 || nbfcs?.length === 3) {
        navigation.navigate('LAMFV2', {
          screen: 'ChooseNBFCHorizontal',
          nbfcs: nbfcs,
        });
      } else if (nbfcs?.length > 3) {
        navigation.navigate('LAMFV2', {screen: 'ChooseNBFCVertical'});
      }
    } catch (error) {
      throw error;
    }
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

              <SelectInstallmentType
                style={{paddingTop: 16}}
                renderUI={ballonAndEMIDecider}
                onSelectedInstallmentType={handleOnSelectMonthlyPlan}
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

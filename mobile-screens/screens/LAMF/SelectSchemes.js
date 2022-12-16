/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useCallback} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Pressable,
} from 'react-native';
import ScreenWrapper from '../../hocs/screenWrapperWithoutBackButton';
import {useTheme} from 'theme';
import _ from 'lodash';
import {
  Card,
  Heading,
  LabelValue,
  BaseTextInput,
  GradientCard,
  CustomCheckBox,
  CustomizedSkeleton,
  Select,
  RoundedFilledButton,
} from 'uin';
import {
  DownArrow,
  DangerIcon,
  NBFCIcon,
  ArrowRight,
  TickCircleSmall,
  Arrow,
  BackArrow,
  InfoIcon,
} from 'assets';
import {useEffect} from 'react';
import {
  getEligiblePANs,
  getIndicativeEMIsForLoanTenures,
  getPreApprovedLoanforPan,
} from 'services';
import Toast from 'react-native-toast-message';
import {isNumber, prettifyJSON, showNativeAlert} from 'utils';
import useLayoutBackButtonAction from '../../reusables/useLayoutBackButtonAction';
import Slider from '@react-native-community/slider';
import Carousel from 'react-native-snap-carousel-v4';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import Config from 'react-native-config';

const Index = ({route, navigation}) => {
  const noLoanAmountLimits =
    Config.MOCK_ENVIRONMENT === 'STAGING' ? 'true' : '';
  const theme = useTheme();
  const [allNbfcs, setAllNbfcs] = useState([]);
  const {width} = Dimensions.get('window');
  const {nbfc_code, user} = route?.params;
  const [total, setTotal] = useState(
    route?.params?.total ? route?.params?.total : 0,
  );
  const [editableTotal, setEditableTotal] = useState(`${total}`);
  const [nbfc, setNbfc] = useState({});
  const [active, setActive] = useState(0);
  const [schemes, setSchemes] = useState([]);
  const [selectedSchemes, setSelectedSchemes] = useState([]);
  const [showSelectableList, setShowSelectableList] = useState(false);
  const [emiPlan, setEmiPlan] = useState(null);
  const [remainingTotal, setRemainingTotal] = useState(0);
  const [apiCallStatus, setApiCallStatus] = useState(null);
  const [allPANs, setAllPANs] = useState([]);
  const [selectedPan, setSelectedPan] = useState(user);
  const [headerType, setHeaderType] = useState('normal');
  const [email, setEmail] = useState('');
  const [emiPlans, setEmiPlans] = useState([]);
  const [refreshEMIPlansOptions, setRefreshEMIPlansOptions] = useState([]);
  const [selectComponentWrapperHeight, setSelectComponentWrapperHeight] =
    useState('auto');
  const [emiPlansLoading, setEMIPlansLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const [editAmountField, setEditAmountField] = useState(false);

  useLayoutBackButtonAction(theme.colors.background);

  const getUsersPANs = useCallback(async () => {
    const eligiblePANsResponse = await getEligiblePANs(noLoanAmountLimits);
    let structuredPANs = eligiblePANsResponse.map(item => {
      return {
        value: item.pan_number,
        label: item.name,
      };
    });
    setAllPANs(structuredPANs);
  }, [noLoanAmountLimits]);

  const getNbfcAndSchemeData = useCallback(
    async code => {
      try {
        setApiCallStatus('schemes_list_loading');
        setRefreshEMIPlansOptions(new Date().getTime());

        const data = await getPreApprovedLoanforPan(
          selectedPan.value,
          code,
          '',
          noLoanAmountLimits,
        );
        setEmail(data?.email);

        setNbfc(data?.nbfc);
        let _schemes = data?.schemes.map(scheme => ({
          ...scheme,
          value: scheme?.amc_name,
        }));
        setSchemes(_schemes);
        setApiCallStatus('schemes_list_loaded');
      } catch (error) {
        setApiCallStatus('schemes_list_failed');
        console.log('error while getting preApprovedLoans', error);
      }
    },
    [noLoanAmountLimits, selectedPan.value],
  );

  const getNbfcs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPreApprovedLoanforPan(
        selectedPan.value,
        '',
        '',
        noLoanAmountLimits,
      );
      setAllNbfcs(data);
      data.map(async (item, index) => {
        if (item.nbfc.nbfc_code === nbfc_code) {
          setActive(index);
          await getNbfcAndSchemeData(item.nbfc.nbfc_code);
          setTotal(item.total_pre_approved_loan_amount);
          setEditableTotal(`${item.total_pre_approved_loan_amount}`);
        }
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log('error while getting nbfcs', error);
      return error;
    }
  }, [nbfc_code, noLoanAmountLimits, selectedPan.value, getNbfcAndSchemeData]);

  const onChangeNbfc = async i => {
    setShowSelectableList(false);
    allNbfcs.map(async (item, index) => {
      if (i === index) {
        setActive(i);
        await getNbfcAndSchemeData(item.nbfc.nbfc_code);
        setTotal(item.total_pre_approved_loan_amount);
        setEditableTotal(`${item.total_pre_approved_loan_amount}`);
        setShowSelectableList(false);
      }
    });
  };

  const handleChangeText = (text, minimumLoanAmount) => {
    console.log('text: ', text, minimumLoanAmount);
    let _editableTotal = +text.slice(1);

    setShowSelectableList(true);
    if (!isNaN(_editableTotal)) {
      if (+_editableTotal < +total) {
        setEditableTotal(text);
      } else if (+_editableTotal > +total) {
        setEditableTotal(`${total}`);
        setShowSelectableList(false);
        showNativeAlert('Please enter lower amount');
      } else if (+_editableTotal === +total) {
        setEditableTotal(`${total}`);
        setShowSelectableList(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      console.log('clearing out variables');
      setRemainingTotal(0);
      setEmiPlan(null);
      console.log('cleared out variables');
    };
  }, []);

  useEffect(() => {
    (async () => {
      await getUsersPANs();
    })();
  }, [getUsersPANs]);

  useEffect(() => {
    (async () => {
      await getNbfcs();
    })();
  }, [getNbfcs]);

  const nbfcsIndicativeEMIs = useCallback(async () => {
    try {
      setEMIPlansLoading(true);
      setEmiPlan(null);
      setEmiPlans([]);

      if (Object.keys(nbfc)?.includes('emi_plans')) {
        const tenures = nbfc?.emi_plans?.map(plan => ({
          ...plan,
          value: +plan?.value?.split(' Months')[0],
        }));
        const nbfcROI = nbfc?.roi;
        const payload = {
          principal: editableTotal?.startsWith('₹')
            ? +editableTotal.split('₹')[1]
            : +editableTotal,
          interest: +nbfcROI,
          tenures: tenures,
        };

        const indicativeEMIsResponse = await getIndicativeEMIsForLoanTenures(
          payload,
        );

        setEmiPlans(indicativeEMIsResponse);
        setEMIPlansLoading(false);
      }
      setEMIPlansLoading(false);
    } catch (err) {
      setEMIPlansLoading(false);
      return err;
    }
  }, [nbfc, editableTotal]);

  useEffect(() => {
    const fetchIndicativeEMIsSubscribe = setTimeout(() => {
      (async () => await nbfcsIndicativeEMIs())();
    }, 500);
    return () => {
      clearTimeout(fetchIndicativeEMIsSubscribe);
    };
  }, [nbfcsIndicativeEMIs]);

  useEffect(() => {
    const remain = editableTotal?.startsWith('₹')
      ? +editableTotal.split('₹')[1]
      : +editableTotal;
    console.log('remain', remain);
    const currentSchemesTotal = selectedSchemes.map(
      item => item.pre_approved_loan_amount,
    );
    console.log('currentSchemesTotal: ', currentSchemesTotal);
    if (remain !== 0) {
      const calculatedRemain = remain - _.sum(currentSchemesTotal);
      if (calculatedRemain < 0) {
        return setRemainingTotal(0);
      }
      return setRemainingTotal(calculatedRemain);
    } else {
      setRemainingTotal(remain);
    }
  }, [selectedSchemes, editableTotal]);

  useEffect(() => {
    console.log('remainingTotal', remainingTotal);
  }, [remainingTotal]);

  const filterSchemes = (val, item) => {
    if (val) {
      console.log('unit_balance', item?.unit_balance);
      if (
        remainingTotal > 0 &&
        remainingTotal >= item.pre_approved_loan_amount
      ) {
        console.log('first if condition');
        setSelectedSchemes([...selectedSchemes, item]);
      } else if (
        remainingTotal > 0 &&
        remainingTotal < item.pre_approved_loan_amount
      ) {
        console.log('second else if condition');
        let nav =
          (parseFloat(item.market_value) / parseFloat(item.unit_balance)) *
          parseFloat(item.ltv);
        item.unit_balance = remainingTotal / nav; // Todo: how many decimal places? Rename this variable, we should not check what is unit_balance
        setSelectedSchemes([...selectedSchemes, item]);
        setRemainingTotal(0);
        Toast.show({
          type: 'schemeWarning',
          position: 'bottom',
          visibilityTime: 2000,
        });
      }
    } else {
      console.log('else condition');
      const data = selectedSchemes.filter(i => {
        return i.isin !== item.isin;
      });
      setSelectedSchemes(data);
    }
  };

  const handleSubmit = () => {
    const finalLoanAmount = showSelectableList
      ? editableTotal?.split('₹')[1]
        ? editableTotal?.split('₹')[1]
        : editableTotal
      : total;
    console.log(
      'handleSubmit->remainingTotal, total, finalLoanAmount',
      remainingTotal,
      total,
      finalLoanAmount,
    );
    if (!emiPlan) {
      Toast.show({
        type: 'emiPlanWarning',
        position: 'bottom',
        visibilityTime: 5000,
      });
      return;
    }
    if (remainingTotal !== 0 && remainingTotal !== total) {
      Toast.show({
        type: 'addMoreSchemesWarning',
        position: 'bottom',
        visibilityTime: 5000,
      });
      return;
    } else {
      console.log(
        'finalLoanAmount < nbfc?.min_loan_amount: ',
        finalLoanAmount,
        nbfc?.min_loan_amount,
        +finalLoanAmount < +nbfc?.min_loan_amount,
      );
      if (+finalLoanAmount < +nbfc?.min_loan_amount) {
        console.log('minimum amount');
        Toast.show({
          type: 'minLoanAmountWarning',
          position: 'bottom',
          visibilityTime: 5000,
        });
        return;
      } else {
        const availableUnits = schemes?.map(scheme => ({
          scheme_name: scheme?.scheme_name,
          unit_balance: scheme?.unit_balance,
          available_units: scheme?.available_units,
        }));
        console.log('availableUnits', prettifyJSON(availableUnits));
        const routeParams = {
          data: {
            nbfc: {
              ...nbfc,
              tenure: emiPlan?.tenure,
              tentative_emi_amount: emiPlan?.tentative_emi_amount,
            },
            email,
            schemes: showSelectableList ? selectedSchemes : schemes,
            pre_approved_loan_amount: finalLoanAmount,
            user: {
              pan_number: selectedPan.value,
              name: selectedPan.label,
            },
          },
        };
        navigation.navigate('LienMarking', routeParams);
      }
    }
  };

  const renderItem = ({item, index}) => (
    <React.Fragment key={index}>
      <Card
        key={index}
        style={{
          borderColor: theme.colors.greyscale200,
          borderWidth: theme.borderWidth.thin,
          backgroundColor:
            index === active
              ? theme.colors.backgroundBlue
              : theme.colors.primary,
          width: width * 0.8,
          padding: 16,
          zIndex: 10,
        }}>
        <View style={{paddingBottom: 8}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingHorizontal: 15,
            }}>
            <View style={{height: 35, paddingRight: 15}}>
              <NBFCIcon />
            </View>
            <Heading
              style={{
                color: theme.colors.text,
                fontWeight: theme.fontWeights.bold,
                ...theme.fontSizes.medium,
              }}>
              {item?.nbfc?.nbfc_name}
            </Heading>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Heading
              style={{
                color: theme.colors.text,
                fontWeight: theme.fontWeights.bold,
              }}>
              Loan Amount
            </Heading>

            <View style={{width: '45%'}}>
              {!editAmountField && (
                <Pressable
                  onPressIn={() => {
                    console.log('Pressed-1234');
                    setEditAmountField(true);
                  }}>
                  <View
                    style={{
                      backgroundColor: '#FAFAFA',
                      paddingHorizontal: 15,
                      paddingVertical: 11,
                      borderRadius: 10,
                    }}>
                    <Text
                      style={{
                        color: theme.colors.primaryBlue,
                        fontWeight: theme.fontWeights.Bold,
                      }}>{`₹${
                      editableTotal.split('₹')[1]
                        ? editableTotal.split('₹')[1]
                        : editableTotal
                    }`}</Text>
                  </View>
                </Pressable>
              )}

              {editAmountField && (
                <BaseTextInput
                  autoFocus={true}
                  keyboardType="numeric"
                  prefixValue={'₹'}
                  onChangeText={text => {
                    handleChangeText(text, item?.nbfc?.min_loan_amount);
                    setSelectedSchemes([]);
                  }}
                  onBlur={() => setEditAmountField(false)}
                  value={`${editableTotal}`}
                  extraTextStyles={{
                    color: theme.colors.primaryBlue,
                    fontWeight: theme.fontWeights.Bold,
                  }}
                />
              )}
            </View>
          </View>
          <Slider
            style={{
              marginTop: 30,
              transform:
                Platform.OS === 'android' ? [{scaleX: 1.1}, {scaleY: 2}] : [],
              height: 20,
            }}
            minimumValue={+item?.nbfc?.min_loan_amount}
            maximumValue={+total}
            minimumTrackTintColor={theme.colors.primaryYellow}
            maximumTrackTintColor={theme.colors.primary}
            onSlidingComplete={v => {
              handleChangeText(
                `${parseFloat(v).toFixed(2)}`,
                item?.nbfc?.min_loan_amount,
              );
              setSelectedSchemes([]);
              setRefreshEMIPlansOptions(new Date().getTime());
            }}
            thumbTintColor={theme.colors.primaryBlue}
            value={
              editableTotal.split('₹')[1]
                ? isNumber(parseInt(editableTotal.split('₹')[1], 10))
                  ? parseInt(editableTotal.split('₹')[1], 10)
                  : +item?.nbfc?.min_loan_amount
                : isNumber(parseInt(editableTotal, 10))
                ? parseInt(editableTotal, 10)
                : +item?.nbfc?.min_loan_amount
            }
          />

          <View style={{marginTop: 16}}>
            <Heading
              style={{
                marginBottom: 4,
                color: theme.colors.text,
                fontWeight: theme.fontWeights.veryBold,
              }}>
              EMI Plans
            </Heading>

            {emiPlansLoading ? (
              <SkeletonEMIPlansDropdown
                containerStyle={{
                  right: 34,
                  width: '120%',
                  height: 45,
                }}
              />
            ) : (
              Array.isArray(emiPlans) &&
              emiPlans?.length > 0 && (
                <View
                  style={{zIndex: 20, height: selectComponentWrapperHeight}}>
                  <Select
                    dataSource={async () => emiPlans}
                    onChange={v => {
                      setEmiPlan(v);
                    }}
                    onOpen={() => {
                      setSelectComponentWrapperHeight(250);
                    }}
                    refresh={refreshEMIPlansOptions}
                    onClose={() => {
                      setSelectComponentWrapperHeight('auto');
                    }}
                    placeholder="Select EMI Plan"
                    multiple={false}
                  />
                </View>
              )
            )}
          </View>
        </View>
      </Card>

      <View
        style={{
          paddingTop: 24,
          zIndex: 3,
          right: 14,
          width: '110%',
        }}>
        <Heading
          style={{
            color: theme.colors.text,
            fontWeight: theme.fontWeights.veryBold,
          }}>
          EXPLORE SCHEMES
        </Heading>
        <Heading
          style={{
            color: theme.colors.primaryOrange,
            fontWeight: theme.fontWeights.moreBold,
            ...theme.fontSizes.small,
            paddingTop: 8,
          }}>
          <Text
            style={{
              fontWeight: theme.fontWeights.semiBold,
              color: theme.colors.greyscale750,
            }}>
            Under
          </Text>{' '}
          {nbfc?.nbfc_name}
        </Heading>
      </View>

      {apiCallStatus === 'schemes_list_loading' ? (
        '.'
          .repeat(4)
          .split('')
          .map((__, schemesSkeletonListItemIndex) => (
            <SkeletonListCard
              containerStyle={
                schemesSkeletonListItemIndex === 0
                  ? {marginTop: 25, right: 34, width: '120%'}
                  : {right: 34, width: '120%'}
              }
              key={schemesSkeletonListItemIndex}
            />
          ))
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            paddingTop: showSelectableList ? 0 : 24,
            marginBottom: 180,
            right: 14,
            width: '110%',
          }}>
          {showSelectableList ? (
            <>
              {remainingTotal > 0 && (
                <Card
                  style={{
                    backgroundColor: theme.colors.backgroundYellow,
                    paddingLeft: 16,
                    marginTop: 24,
                    marginHorizontal: 1,
                    borderRadius: 8,
                    paddingVertical: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  <View>
                    <DangerIcon fill={theme.colors.error} />
                  </View>
                  <Text
                    style={{
                      ...theme.fontSizes.small,
                      fontWeight: theme.fontWeights.moreBold,
                      color: theme.colors.text,
                      fontFamily: theme.fonts.regular,
                      paddingLeft: 16,
                    }}>
                    Please select schemes for Lien Marking
                  </Text>
                </Card>
              )}
              <View
                style={{
                  paddingTop: showSelectableList ? 24 : 0,
                  width: '100%',
                }}>
                {schemes.map((scheme, schemeIndex) => (
                  <View key={schemeIndex} style={{width: '100%'}}>
                    <CustomCheckBox
                      disable={false}
                      onCheck={val => {
                        if (remainingTotal > 0) {
                          filterSchemes(val, scheme);
                        } else if (remainingTotal === 0 && !val) {
                          filterSchemes(val, scheme);
                        } else {
                          Toast.show({
                            type: 'schemeWarning',
                            position: 'bottom',
                            visibilityTime: 5000,
                          });
                        }
                      }}
                      value={selectedSchemes.includes(scheme) ? true : false}
                      data={scheme}
                      selectedStatus={
                        selectedSchemes.includes(scheme) ? true : false
                      }
                    />
                  </View>
                ))}
              </View>
            </>
          ) : (
            schemes?.map((scheme, schmeIndex) => (
              <View key={schmeIndex} style={{width: '100%'}}>
                <SchemeCard item={scheme} />
              </View>
            ))
          )}
        </View>
      )}
    </React.Fragment>
  );

  const toastConfig = {
    schemeWarning: () => (
      <Card
        style={{
          backgroundColor: theme.colors.backgroundYellow,
          paddingLeft: 17.25,
          marginHorizontal: 17,
          position: 'absolute',
          bottom: 100,
          borderRadius: 8,
          paddingVertical: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View>
          <InfoIcon fill={theme.colors.error} />
        </View>
        <Text
          style={{
            ...theme.fontSizes.small,
            fontWeight: theme.fontWeights.moreBold,
            color: theme.colors.text,
            fontFamily: theme.fonts.regular,
            paddingLeft: 17.25,
            marginRight: 52,
          }}>
          You have selected enough schemes to reach the desired loan amount
        </Text>
      </Card>
    ),
    addMoreSchemesWarning: () => (
      <Card
        style={{
          backgroundColor: theme.colors.backgroundYellow,
          paddingLeft: 17.25,
          marginHorizontal: 17,
          position: 'absolute',
          bottom: 100,
          borderRadius: 8,
          paddingVertical: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View>
          <InfoIcon fill={theme.colors.error} />
        </View>
        <Text
          style={{
            ...theme.fontSizes.small,
            fontWeight: theme.fontWeights.moreBold,
            color: theme.colors.text,
            fontFamily: theme.fonts.regular,
            paddingLeft: 17.25,
            marginRight: 52,
          }}>
          Please Add More Schemes to continue
        </Text>
      </Card>
    ),
    emiPlanWarning: () => (
      <Card
        style={{
          backgroundColor: theme.colors.backgroundYellow,
          paddingLeft: 17.25,
          marginHorizontal: 17,
          position: 'absolute',
          bottom: 100,
          borderRadius: 8,
          paddingVertical: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View>
          <InfoIcon fill={theme.colors.error} />
        </View>
        <Text
          style={{
            ...theme.fontSizes.small,
            fontWeight: theme.fontWeights.moreBold,
            color: theme.colors.text,
            fontFamily: theme.fonts.regular,
            paddingLeft: 17.25,
            marginRight: 52,
          }}>
          Please select EMI Plan
        </Text>
      </Card>
    ),
    minLoanAmountWarning: () => (
      <Card
        style={{
          backgroundColor: theme.colors.backgroundYellow,
          paddingLeft: 17.25,
          marginHorizontal: 17,
          position: 'absolute',
          bottom: 100,
          borderRadius: 8,
          paddingVertical: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View>
          <InfoIcon fill={theme.colors.error} />
        </View>
        <Text
          style={{
            ...theme.fontSizes.small,
            fontWeight: theme.fontWeights.moreBold,
            color: theme.colors.text,
            fontFamily: theme.fonts.regular,
            paddingLeft: 17.25,
            marginRight: 52,
          }}>
          Loan Amount should be greater than {`${nbfc?.min_loan_amount}`}
        </Text>
      </Card>
    ),
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
          }}>
          {headerType === 'normal' && (
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
          )}
          {headerType === 'loan' && (
            <View
              style={{
                marginTop: Platform.OS === 'ios' ? 0 : -13,
                width: '100%',
                paddingTop: 13,
              }}>
              <Card style={{borderRadius: 0}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                  }}>
                  <LabelValue
                    title="Loan Amount"
                    titleStyle={{
                      fontWeight: theme.fontWeights.lightBold,
                    }}
                    value={`₹ ${
                      showSelectableList
                        ? editableTotal?.split('₹')[1]
                          ? editableTotal?.split('₹')[1]
                          : editableTotal
                        : total
                    }`}
                    valueStyle={{
                      ...theme.fontSizes.largeMedium,
                      fontFamily: theme.fonts.bold,
                    }}
                  />
                  <LabelValue
                    title="EMI Plan"
                    titleStyle={{
                      fontWeight: theme.fontWeights.lightBold,
                      textAlign: 'right',
                    }}
                    value={emiPlan?.label}
                    valueStyle={{
                      ...theme.fontSizes.largeMedium,
                      fontFamily: theme.fonts.bold,
                    }}
                  />
                </View>
              </Card>
            </View>
          )}
          <ScrollView
            nestedScrollEnabled={true}
            contentInsetAdjustmentBehavior="automatic"
            onScroll={e => {
              if (e.nativeEvent.contentOffset.y > 235) {
                setHeaderType('loan');
              } else {
                setHeaderType('normal');
              }
            }}
            style={{backgroundColor: theme.colors.primaryBlue, width: '100%'}}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                paddingTop: 32,
                width: '100%',
                zIndex: 100,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  marginBottom: 125,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Heading
                    style={{
                      fontSize: theme.fontSizes.heading4.fontSize,
                      lineHeight: 24,
                      fontWeight: theme.fontWeights.veryBold,
                    }}>
                    {selectedPan.label}
                  </Heading>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingTop: 8,
                      paddingLeft: 0,
                      zIndex: 100,
                      justifyContent:
                        allNbfcs?.length > 1 ? 'flex-start' : 'center',
                      marginLeft: 20,
                    }}>
                    <Select
                      dataSource={async () => allPANs}
                      onChange={v => {
                        setSelectedPan(v);
                      }}
                      listWrapperStyles={{
                        minWidth: 152,
                        top: 30,
                        left: 35,
                      }}
                      label={
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Heading
                            style={{
                              ...theme.fontSizes.large,
                              fontWeight: theme.fontWeights.veryBold,
                            }}>
                            {selectedPan.value}
                          </Heading>
                          <View style={{paddingLeft: 2}}>
                            <DownArrow stroke={theme.colors.background} />
                          </View>
                        </View>
                      }
                      labelStyles={{
                        color: theme.colors.primaryBlue,
                        ...theme.fontSizes.large,
                      }}
                      multiple={false}
                      searchable={false}
                      showHeader={false}
                    />
                  </View>
                </View>
                {allNbfcs?.length > 1 && (
                  <View style={{flexDirection: 'row', paddingHorizontal: 5}}>
                    <RoundedFilledButton
                      onPress={() => {
                        if (active !== 0) {
                          ref.current.snapToPrev();
                          onChangeNbfc(ref.current._activeItem);
                        }
                      }}
                      bgColor={
                        active !== 0 ? '#FF5500' : theme.colors.greyscale300
                      }
                      textColor="#ffffff"
                      buttonStyles={{width: 40, height: 40, marginLeft: 10}}>
                      <BackArrow fill="#fff" />
                    </RoundedFilledButton>
                    <RoundedFilledButton
                      onPress={() => {
                        if (
                          allNbfcs.length > 0 &&
                          active !== allNbfcs.length - 1
                        ) {
                          ref.current.snapToNext();
                          onChangeNbfc(ref.current._activeItem);
                        }
                      }}
                      bgColor={
                        allNbfcs.length > 0 && active !== allNbfcs.length - 1
                          ? '#FF5500'
                          : theme.colors.greyscale300
                      }
                      textColor="#ffffff"
                      buttonStyles={{width: 40, height: 40, marginLeft: 10}}>
                      <Arrow stroke="#fff" />
                    </RoundedFilledButton>
                  </View>
                )}
              </View>
              <Card
                style={{
                  marginTop: 30,
                  width: '100%',
                  height: '100%',
                  zIndex: -1,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }}>
                <View
                  style={{
                    paddingVertical: 16,
                    marginTop: -140,
                  }}>
                  {allNbfcs.length > 0 ? (
                    <>
                      <Carousel
                        layout="default"
                        ref={ref}
                        data={allNbfcs}
                        sliderWidth={width}
                        itemWidth={width * 0.838}
                        renderItem={renderItem}
                        onSnapToItem={index => {
                          onChangeNbfc(index);
                        }}
                        slideStyle={{zIndex: 1}}
                        firstItem={active}
                        inactiveSlideScale={1}
                        inactiveSlideOpacity={1}
                        loop={true}
                        scrollEnabled={false}
                      />
                    </>
                  ) : !loading && allNbfcs.length === 0 ? (
                    <View
                      style={{
                        marginTop: 12,
                        alignItems: 'center',
                        flex: 1,
                        height: 500,
                        paddingHorizontal: 16,
                      }}>
                      <Heading
                        style={{
                          color: theme.colors.background,
                          fontWeight: theme.fontWeights.normal,
                          ...theme.fontSizes.large,
                          fontFamily: theme.fonts.regular,
                        }}>
                        None of your schemes eligible for getting the loan
                      </Heading>
                    </View>
                  ) : (
                    <View style={{flexDirection: 'row', marginLeft: 16}}>
                      {'.'
                        .repeat(4)
                        .split('')
                        .map((__, index) => (
                          <CustomizedSkeleton
                            key={index}
                            containerStyle={{
                              marginRight: 8,
                              width: width * 0.81,
                            }}
                            logo={true}
                            lines={8}
                            logoRadius={50}
                          />
                        ))}
                    </View>
                  )}
                </View>
              </Card>
            </View>
          </ScrollView>

          {(total > 0 || editableTotal) && allNbfcs.length > 0 && (
            <GradientCard
              gradientColors={[
                theme.colors.primaryOrange800,
                theme.colors.primaryOrange,
              ]}
              style={{
                position: 'absolute',
                bottom: 32,
                width: '85%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  justifyContent: 'space-between',
                }}>
                <View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TickCircleSmall fill={theme.colors.background} />
                    <Heading
                      style={{
                        fontFamily: theme.fonts.regular,
                        fontWeight: theme.fontWeights.moreBold,
                        ...theme.fontSizes.small,
                        paddingLeft: 8,
                      }}>
                      Loan Approved |{' '}
                      {showSelectableList
                        ? selectedSchemes.length
                          ? selectedSchemes.length <= 1
                            ? `${selectedSchemes.length} Scheme`
                            : `${selectedSchemes.length} Schemes`
                          : ''
                        : schemes.length
                        ? schemes.length <= 1
                          ? `${schemes.length} Scheme`
                          : `${schemes.length} Schemes`
                        : ''}
                    </Heading>
                  </View>

                  <View style={{paddingTop: 8}}>
                    <Heading
                      style={{
                        fontFamily: theme.fonts.regular,
                        fontWeight: theme.fontWeights.veryBold,
                        ...theme.fontSizes.xlarge,
                      }}>{`₹ ${
                      showSelectableList
                        ? editableTotal.split('₹')[1]
                          ? editableTotal.split('₹')[1]
                          : editableTotal
                        : total
                    }`}</Heading>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    handleSubmit();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Heading
                    style={{
                      ...theme.fontSizes.largeMedium,
                      fontWeight: theme.fontWeights.veryBold,
                    }}>
                    Next
                  </Heading>
                  <View style={{paddingRight: 2}}>
                    <ArrowRight />
                  </View>
                </TouchableOpacity>
              </View>
            </GradientCard>
          )}
        </View>
      </ScreenWrapper>

      <Toast config={toastConfig} />
    </>
  );
};

const SchemeCard = ({item}) => {
  const theme = useTheme();
  return (
    <Card
      style={{
        borderRadius: 10,
        borderColor: theme.colors.greyscale200,
        paddingHorizontal: 22,
        marginBottom: 10,
        borderWidth: theme.borderWidth.thin,
      }}>
      <View style={{paddingVertical: 20, paddingHorizontal: 10}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flex: 0.5 / 3,
              backgroundColor: theme.colors.background,
              width: 46,
              height: 46,
              borderRadius: 46 / 2,
              alignItems: 'center',
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
              {item?.scheme_name}
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
              value={`₹ ${parseInt(item?.market_value, 10)}`}
              style={{
                flex: 1.5 / 3,
              }}
              titleStyle={{...theme.fontSizes.small}}
              valueStyles={{
                fontSize: theme.fontSizes.xlarge.fontSize,
                lineHeight: 24,
                fontWeight: theme.fontWeights.veryBold,
              }}
            />
            <LabelValue
              title="ROI"
              value={`${item?.roi}%`}
              style={{
                flex: 1 / 3,
              }}
              titleStyle={{...theme.fontSizes.small}}
              valueStyles={{
                fontSize: theme.fontSizes.xlarge.fontSize,
                lineHeight: 24,
                fontWeight: theme.fontWeights.veryBold,
              }}
            />
            <LabelValue
              title="Pre Approved Amt"
              value={`₹ ${parseInt(item?.pre_approved_loan_amount, 10)}`}
              style={{
                flex: 1.5 / 3,
              }}
              titleStyle={{...theme.fontSizes.small}}
              valueStyles={{
                fontSize: theme.fontSizes.xlarge.fontSize,
                lineHeight: 24,
                fontWeight: theme.fontWeights.veryBold,
              }}
            />
          </View>
        </View>
      </View>
    </Card>
  );
};

export const SkeletonListCard = ({containerStyle = {}}) => {
  return (
    <SkeletonContent
      containerStyle={{
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 16,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 116,
        ...containerStyle,
      }}
      isLoading={true}
      animationType={'shiver'}
      boneColor={'#fdfdfd'}
      layout={[
        ...Object.values(
          card(
            1,
            {x: 24, y: 0, absolutePercentage: {x: 0, y: 19.5}},
            {x: 12, y: 28},
          ),
        ),
      ]}
    />
  );
};

const SkeletonEMIPlansDropdown = ({containerStyle = {}}) => {
  return (
    <SkeletonContent
      containerStyle={{
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 24,
        borderRadius: 12,
        ...containerStyle,
      }}
      isLoading={true}
      animationType={'shiver'}
      boneColor={'#fdfdfd'}
      layout={[
        ...Object.values(
          dropdownBox(
            1,
            {x: 26, y: 0, absolutePercentage: {x: 0, y: 1}},
            {height: 45},
          ),
        ),
      ]}
    />
  );
};
const dropdownBox = (
  key = 1,
  boxPosition = {x: 0, y: 0, absolutePercentage: {x: 0, y: 0}},
  boxStyles = {},
) => ({
  box: {
    key: `border_box_${key}`,
    width: '92%',
    borderColor: '#eeeeee',
    borderRadius: 12,
    position: 'absolute',
    backgroundColor: 'transparent',
    top: `${
      boxPosition?.absolutePercentage?.y
        ? boxPosition?.absolutePercentage?.y + '%'
        : '0'
    }`,
    marginLeft: boxPosition?.x,
    borderWidth: 1,
    ...boxStyles,
  },
});

const card = (
  key = 1,
  boxPosition = {x: 0, y: 0, absolutePercentage: {x: 0, y: 0}},
  childrenPosition = {x: 0, y: 0},
) => ({
  box: {
    key: `border_box_${key}`,
    height: 98,
    width: '92%',
    borderColor: '#eeeeee',
    borderRadius: 12,
    position: 'absolute',
    backgroundColor: 'transparent',
    top: `${
      boxPosition?.absolutePercentage?.y
        ? boxPosition?.absolutePercentage?.y + '%'
        : '0'
    }`,
    marginLeft: boxPosition?.x,
    borderWidth: 1,
  },
  small_circle: {
    key: `small_circle_${key}`,
    height: 21,
    width: 21,
    borderRadius: 21 / 2,
    position: 'absolute',
    top: `${
      boxPosition?.absolutePercentage?.y
        ? boxPosition?.absolutePercentage?.y + '%'
        : '2%'
    }`,
    marginTop: childrenPosition?.y,
    marginLeft: childrenPosition?.x + boxPosition?.x,
  },
  very_small_bar: {
    key: `very_small_bar_${key}`,
    height: 14,
    width: '10%',
    borderRadius: 12,
    position: 'absolute',
    top: `${
      boxPosition?.absolutePercentage?.y
        ? boxPosition?.absolutePercentage?.y + '%'
        : '2%'
    }`,
    marginTop: childrenPosition?.y,
    marginLeft: childrenPosition?.x + 52,
  },
  large_bar: {
    key: `large_bar_${key}`,
    height: 14,
    width: '70%',
    borderRadius: 12,
    position: 'absolute',
    top: `${
      boxPosition?.absolutePercentage?.y
        ? boxPosition?.absolutePercentage?.y + '%'
        : '2%'
    }`,
    marginTop: childrenPosition?.y + 24,
    marginLeft: childrenPosition?.x + 52,
  },
});

export default Index;

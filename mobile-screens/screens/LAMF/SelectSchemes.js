/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useMemo, useCallback} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Dimensions,
  Pressable,
} from 'react-native';
import ScreenWrapper from '../../hocs/screen_wrapper';
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
import {showToast} from 'utils';
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
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const [editAmountField, setEditAmountField] = useState(false);

  useLayoutBackButtonAction(theme.colors.background);

  const minLoanAmount =
    Config.MOCK_ENVIRONMENT === 'STAGING' ? 100 : +nbfc?.min_loan_amount;

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
      console.log('error while getting nbfcs', error);
      return error;
    }
  }, [nbfc_code, noLoanAmountLimits, selectedPan.value, getNbfcAndSchemeData]);

  const onChangeNbfc = async i => {
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

  const handleChangeText = text => {
    let _editableTotal = +text.slice(1);

    setShowSelectableList(true);
    if (!isNaN(_editableTotal)) {
      if (+_editableTotal < +total) {
        setEditableTotal(text);
      } else if (+_editableTotal > +total) {
        setEditableTotal(`${total}`);
        setShowSelectableList(false);
        showToast('Please enter lower amount');
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

  const getIndicativeEMIs = async payload => {
    try {
      if (payload?.interest && payload?.principal && payload?.tenure) {
        const indicativeEMIsResponse = await getIndicativeEMIsForLoanTenures(
          payload,
        );
        return indicativeEMIsResponse;
      }
    } catch (error) {
      console.log('error while getting emi amount', error);
    }
  };

  const getPrincipal = useCallback(() => {
    let principal = minLoanAmount;
    if (editableTotal.split('₹')[1]) {
      principal = +editableTotal.split('₹')[1].trim();
    } else if (total) {
      principal = total;
    }
    return principal;
  }, [editableTotal, total, minLoanAmount]);

  const nbfcsIndicativeEMIs = useCallback(async () => {
    try {
      const principal = getPrincipal();
      if (Object.keys(nbfc).includes('emi_plans')) {
        const nbfcEMIPlans = nbfc?.emi_plans?.filter(
          item => item?.label !== '24 Months',
        );
        const nbfcROI = nbfc?.roi;

        const mappedEMIPlans = await Promise.all(
          nbfcEMIPlans?.map(async emiPlanItem => {
            const _emiPlanValue = emiPlanItem?.value?.includes('Months')
              ? emiPlanItem?.value?.split(' Months')[0]
              : emiPlanItem?.value;

            const indicativeEMIsResponse = await getIndicativeEMIs({
              principal: principal,
              interest: +nbfcROI,
              tenure: +_emiPlanValue,
            });
            const installments = indicativeEMIsResponse?.data?.installments;
            const indicativeEMIAmount =
              installments?.length > 0 ? installments[0]?.installment : 0;

            return {
              label: `${emiPlanItem?.label} - ₹${indicativeEMIAmount}`,
              value: _emiPlanValue,
            };
          }),
        );
        setEmiPlans(mappedEMIPlans);
      }
    } catch (err) {
      console.log('errorrrr', err);
      return err;
    }
  }, [nbfc, getPrincipal]);

  useEffect(() => {
    (async () => {
      await nbfcsIndicativeEMIs();
    })();
  }, [nbfcsIndicativeEMIs]);

  useEffect(() => {
    const remain = editableTotal.split('₹')[1];
    console.log('remain', remain);
    const currentSchemesTotal = selectedSchemes.map(
      item => item.pre_approved_loan_amount,
    );
    if (remain !== 0) {
      return setRemainingTotal(remain - _.sum(currentSchemesTotal));
    }
  }, [selectedSchemes, editableTotal]);

  console.log('remainingTotal', remainingTotal);

  const filterSchemes = (val, item) => {
    if (val) {
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
          visibilityTime: 5000,
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
    console.log('emiPlan', emiPlan);
    if (!emiPlan) {
      showToast('Please select EMI Plan');
    } else if (remainingTotal > 0) {
      showToast('Please Add more Schemes');
    } else {
      navigation.navigate('LienMarking', {
        data: {
          nbfc: {
            ...nbfc,
            tenure: emiPlan?.label?.split('-')[0],
            tentative_emi_amount: emiPlan?.label?.split('-')[1],
          },
          email,
          schemes: showSelectableList ? selectedSchemes : schemes,
          pre_approved_loan_amount: showSelectableList
            ? editableTotal.split('₹')[1]
            : total,
          user: {
            pan_number: selectedPan.value,
            name: selectedPan.label,
          },
        },
      });
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
                    handleChangeText(text);
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
            minimumValue={minLoanAmount}
            maximumValue={total}
            minimumTrackTintColor={theme.colors.primaryYellow}
            maximumTrackTintColor={theme.colors.primary}
            onSlidingComplete={v => {
              handleChangeText(`₹ ${parseFloat(v).toFixed(2)}`);
              setSelectedSchemes([]);
              setRefreshEMIPlansOptions(new Date().getTime());
            }}
            thumbTintColor={theme.colors.primaryBlue}
            value={
              editableTotal.split('₹')[1]
                ? parseInt(editableTotal.split('₹')[1])
                : total
            }
            // value={total}
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

            <View style={{zIndex: 20, height: selectComponentWrapperHeight}}>
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
          // marginTop: 30,
          // marginBottom: 300,
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
                      showSelectableList ? editableTotal.split('₹')[1] : total
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
                          : total
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

const SkeletonListCard = ({containerStyle = {}}) => {
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

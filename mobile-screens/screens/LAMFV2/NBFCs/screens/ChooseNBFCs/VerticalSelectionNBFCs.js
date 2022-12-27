/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {View, Text, Platform, Pressable} from 'react-native';
import ScreenWrapper from '../../../../../hocs/screenWrapperWithoutBackButton';
import {useTheme} from 'theme';
import {
  Card,
  GradientCard,
  Heading,
  LabelValue,
  Select,
  SmallOutlinedButton,
} from 'uin';
import {
  ArrowRight,
  BackArrow,
  NBFCIcon,
  ReportOne,
  SortIcon,
  TickCircleSmall,
  TickSquare,
} from 'assets';
import {
  getIndicativeEMIsForLoanTenures,
  getPreApprovedLoanforPan,
} from 'services';
import {useSelector, useDispatch} from 'react-redux';
import {setCompareNBFC, clearNbfc, removeNbfc} from 'store';
import {ScrollView} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import useLayoutBackButtonAction from '../../../../../reusables/useLayoutBackButtonAction';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {placeholderDecider} from 'utils';
import {nbfcs as nbfcsData} from '../../data/nbfcs';

export default function ({navigation, route}) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const nbfcsFromRouteParams = route?.params?.nbfcs || nbfcsData;

  const [filter, setFilter] = useState('');
  const [nbfcs, setNbfcs] = useState(nbfcsFromRouteParams);
  const nbfcWisePreApprovedLoanFnRef = useRef(() => {});
  const [loading, setLoading] = useState(false);
  useLayoutBackButtonAction(theme.colors.background);

  const compareNbfc = useSelector(state => {
    return state.compareNbfc.nbfcData;
  });

  const filters = [
    {label: 'Loan Amount', value: 'total_pre_approved_loan_amount'},
    {label: 'Tenure', value: 'nbfc.tenure'},
    {label: 'EMI', value: 'emi'},
    {label: 'ROI', value: 'nbfc.roi'},
  ];

  // nbfcWisePreApprovedLoanFnRef.current = async () => {
  //   try {
  //     setLoading(true);
  //     const data = await getPreApprovedLoanforPan('ENBPM4556D', '', filter);

  //     const _nbfcs = await Promise.all(
  //       data?.map(async nbfc => {
  //         const payload = {
  //           interest: nbfc?.nbfc?.roi,
  //           principal: nbfc?.total_pre_approved_loan_amount,
  //           tenures: [
  //             {
  //               label: `${nbfc?.nbfc?.max_tenure}`,
  //               value: `${+nbfc?.nbfc?.max_tenure?.split(' ')[0]}`,
  //             },
  //           ],
  //         };
  //         if (payload?.interest && payload?.principal && payload?.tenures) {
  //           const indicativeEMIsResponse =
  //             await getIndicativeEMIsForLoanTenures(payload);
  //           const indicativeEMIAmount =
  //             indicativeEMIsResponse?.[0]?.tentative_emi_amount;
  //           return {
  //             ...nbfc,
  //             nbfc: {...nbfc.nbfc, indicative_emi: indicativeEMIAmount},
  //           };
  //         }
  //       }),
  //     );
  //     setNbfcs(_nbfcs);
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   nbfcWisePreApprovedLoanFnRef.current();
  // }, [filter]);

  return (
    <ScreenWrapper
      backgroundColor={theme.colors.primaryOrange}
      scrollView={false}
      footer={true}>
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

      <ScrollView
        nestedScrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: theme.colors.primaryBlue,
          width: '100%',
        }}>
        <View style={{flex: 1, alignItems: 'center', zIndex: 2}}>
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
        </View>
        <Card
          style={{
            marginTop: 16,
            paddingTop: 28,
            paddingBottom: 56,
            paddingHorizontal: 16,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            flex: 1,
          }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 10,
              }}>
              <Heading
                style={{
                  color: theme.colors.text,
                  fontWeight: theme.fontWeights.veryBold,
                }}>
                CHOOSE NBFC
              </Heading>
              <View style={{zIndex: 10, left: 17}}>
                <Select
                  dataSource={async () => filters}
                  onChange={v => {
                    setFilter(v.value);
                  }}
                  listWrapperStyles={{minWidth: 152, left: -75, top: 30}}
                  placeholder="Select Gender"
                  label={
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Heading
                        style={{
                          color: theme.colors.primaryBlue,
                          fontWeight: theme.fontWeights.moreBold,
                          fontSize: theme.fontSizes.small.fontSize,
                          lineHeight: 24,
                        }}>
                        Sort By
                      </Heading>
                      <View style={{paddingLeft: 4}}>
                        <SortIcon />
                      </View>
                    </View>
                  }
                  labelStyles={{
                    color: theme.colors.primaryBlue,
                    ...theme.fontSizes.large,
                  }}
                  multiple={false}
                  searchable={false}
                  value={filter}
                  showHeader={false}
                />
              </View>
            </View>
            <View
              style={{
                paddingTop: 20,
                marginBottom: 80,
                backgroundColor: theme.colors.background,
                zIndex: 0,
              }}>
              {loading ? (
                '.'
                  .repeat(4)
                  .split('')
                  .map((_, index) => (
                    <SkeletonListCard index={index} key={index} />
                  ))
              ) : !loading && nbfcs?.length > 0 ? (
                nbfcs?.map((item, index) => (
                  <TouchableOpacity
                    style={{
                      marginBottom: 5,
                      backgroundColor: '#fff',
                      zIndex: 0,
                    }}
                    onPress={() => {
                      navigation.navigate('SelectSchemes', {
                        nbfc_code: item?.nbfc?.nbfc_code,
                        total: item?.total_pre_approved_loan_amount,
                      });
                    }}
                    key={index}>
                    <Card
                      style={{
                        borderColor: theme.colors.greyscale200,
                        borderWidth: theme.borderWidth.thin,
                        padding: 16,
                        borderRadius: 14,
                        elevation: 0,
                      }}>
                      <View style={{}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                          }}>
                          <View
                            style={{
                              backgroundColor: theme.colors.background,
                              width: 46,
                              height: 46,
                              borderRadius: 46 / 2,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <NBFCIcon />
                          </View>
                          <Heading
                            style={{
                              color: theme.colors.text,
                              fontWeight: theme.fontWeights.lightBold,
                              ...theme.fontSizes.medium,
                              paddingLeft: 16,
                            }}>
                            {item?.nbfc_code}
                          </Heading>
                        </View>
                        <View style={{paddingTop: 16}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <LabelValue
                              title="Amount"
                              titleStyle={{
                                fontWeight: theme.fontWeights.lightBold,
                              }}
                              value={`₹ ${placeholderDecider(
                                item?.eligible_max_loan,
                              )}`}
                              style={{flex: 1 / 2}}
                            />
                            <LabelValue
                              title="EMI"
                              value={placeholderDecider(
                                item?.nbfc?.indicative_emi,
                              )}
                              style={{flex: 1 / 2}}
                            />
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <LabelValue
                              title="ROI"
                              titleStyle={{
                                fontWeight: theme.fontWeights.lightBold,
                              }}
                              value={`${item?.nbfc_roi}%`}
                              style={{flex: 1 / 2}}
                            />
                            <LabelValue
                              title="Tenure (months)"
                              value={placeholderDecider(
                                `${
                                  JSON.parse(item?.eligible_tenures)[
                                    JSON.parse(item?.eligible_tenures)?.length -
                                      1
                                  ]
                                }`,
                              )}
                              style={{flex: 1 / 2}}
                            />
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              flex: 1 / 2,
                              paddingTop: 16,
                            }}>
                            <View>
                              <ReportOne />
                            </View>
                            <Heading
                              style={{
                                color: theme.colors.greyscale600,
                                ...theme.fontSizes.xsmall,
                                fontFamily: theme.fonts.italic,
                                flexDirection: 'row',
                                paddingRight: 11,
                                paddingLeft: 4,
                              }}>
                              <Text
                                style={{
                                  color: theme.colors.success,
                                  fontWeight: theme.fontWeights.veryBold,
                                  ...theme.fontSizes.xsmall,
                                  fontFamily: theme.fonts.italic,
                                }}>
                                97%{' '}
                              </Text>
                              <Text
                                style={{
                                  color: theme.colors.greyscale600,
                                  fontWeight: theme.fontWeights.semiBold,
                                  ...theme.fontSizes.xsmall,
                                  fontFamily: theme.fonts.italic,
                                }}>
                                probabilty of getting approval
                              </Text>
                            </Heading>
                          </View>

                          {compareNbfc && compareNbfc?.length > 1 && (
                            <View
                              onStartShouldSetResponder={() => true}
                              onTouchEnd={e => {
                                e.stopPropagation();
                              }}
                              style={{paddingVertical: 4, flex: 1 / 2}}>
                              <TouchableOpacity
                                onPress={() => {
                                  if (compareNbfc.includes(item)) {
                                    dispatch(removeNbfc(item?.nbfc?.nbfc_code));
                                  } else {
                                    dispatch(
                                      setCompareNBFC([...compareNbfc, item]),
                                    );
                                  }
                                }}>
                                <SmallOutlinedButton
                                  onPress={e => {
                                    //e.preventDefault();
                                  }}
                                  extraStyles={{paddingVertical: 4}}
                                  outlineColor={theme.colors.primaryOrange}
                                  textColor={theme.colors.primaryOrange}
                                  textStyles={{...theme.fontSizes.small}}>
                                  {compareNbfc.includes(item) ? (
                                    <View style={{flexDirection: 'row'}}>
                                      <View style={{paddingRight: 4}}>
                                        <TickSquare />
                                      </View>
                                      <Text
                                        style={{
                                          ...theme.fontSizes.small,
                                          color: theme.colors.primaryOrange,
                                          fontWeight:
                                            theme.fontWeights.veryBold,
                                        }}>
                                        Added to compare
                                      </Text>
                                    </View>
                                  ) : (
                                    'Add to compare'
                                  )}
                                </SmallOutlinedButton>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </View>
                    </Card>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={{marginTop: 12, alignItems: 'center'}}>
                  <Heading
                    style={{
                      color: theme.colors.error,
                      fontWeight: theme.fontWeights.normal,
                      ...theme.fontSizes.large,
                      fontFamily: theme.fonts.regular,
                    }}>
                    None of your schemes eligible for getting the loan
                  </Heading>
                </View>
              )}
            </View>
          </View>
        </Card>
      </ScrollView>

      {compareNbfc && compareNbfc?.length > 1 && (
        <GradientCard
          gradientColors={[
            theme.colors.primaryOrange800,
            theme.colors.primaryOrange,
          ]}
          style={{
            position: 'absolute',
            flex: 1,
            bottom: 32,
            width: '85%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 10,
              paddingBottom: 9,
              paddingHorizontal: 16,
            }}>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TickCircleSmall fill={theme.colors.background} />
                <Heading
                  style={{
                    ...theme.fontSizes.small,
                    fontWeight: theme.fontWeights.moreBold,
                    paddingLeft: 8,
                  }}>
                  Added to Compare{` (${compareNbfc.length})`}
                </Heading>
              </View>
              <View style={{flexDirection: 'row', paddingTop: 5}}>
                {compareNbfc?.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      marginTop: 5,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        backgroundColor: theme.colors.primary,
                        width: 40,
                        height: 40,
                        borderRadius: 40 / 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <NBFCIcon />
                    </View>
                    {compareNbfc?.length !== 3 && index === 0 && (
                      <Heading
                        style={{
                          paddingHorizontal: 8,
                          ...theme.fontSizes.small,
                        }}>
                        VS
                      </Heading>
                    )}
                    {compareNbfc?.length === 3 && index !== 2 && (
                      <Heading
                        style={{
                          paddingHorizontal: 8,
                          ...theme.fontSizes.small,
                        }}>
                        VS
                      </Heading>
                    )}
                  </View>
                ))}
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CompareNBFC');
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
                Compare
              </Heading>
              <View>
                <ArrowRight />
              </View>
            </TouchableOpacity>
          </View>
        </GradientCard>
      )}
    </ScreenWrapper>
  );
}

const SkeletonListCard = ({index, containerStyle = {}}) => {
  return (
    <SkeletonContent
      containerStyle={{
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 16,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 216,
        ...containerStyle,
      }}
      isLoading={true}
      animationType={'shiver'}
      boneColor={'#fdfdfd'}
      layout={[
        ...Object.values(
          card(
            index,
            {x: 0, y: 0, absolutePercentage: {x: 0, y: '0'}},
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
    key: `border_box_11_${key}`,
    height: 200,
    width: '100%',
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
    key: `small_circle_11_${key}`,
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
    key: `very_small_bar_11_${key}`,
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
    key: `large_bar_11_${key}`,
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
  large_bar_1: {
    key: `large_bar_11_1_${key}`,
    height: 14,
    width: '70%',
    borderRadius: 12,
    position: 'absolute',
    top: `${
      boxPosition?.absolutePercentage?.y
        ? boxPosition?.absolutePercentage?.y + '%'
        : '2%'
    }`,
    marginTop: childrenPosition?.y + 54,
    marginLeft: childrenPosition?.x + 52,
  },
});

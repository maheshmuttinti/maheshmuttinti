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

export default function ({navigation, route}) {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [filter, setFilter] = useState('');
  const [nbfcs, setNbfcs] = useState([]);
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

  nbfcWisePreApprovedLoanFnRef.current = async () => {
    try {
      setLoading(true);
      const data = await getPreApprovedLoanforPan('ENBPM4556D', '', filter);

      const _nbfcs = await Promise.all(
        data?.map(async nbfc => {
          const payload = {
            interest: nbfc?.nbfc?.roi,
            principal: nbfc?.total_pre_approved_loan_amount,
            tenures: [
              {
                label: `${nbfc?.nbfc?.max_tenure}`,
                value: `${+nbfc?.nbfc?.max_tenure?.split(' ')[0]}`,
              },
            ],
          };
          if (payload?.interest && payload?.principal && payload?.tenures) {
            const indicativeEMIsResponse =
              await getIndicativeEMIsForLoanTenures(payload);
            const indicativeEMIAmount =
              indicativeEMIsResponse?.[0]?.tentative_emi_amount;
            return {
              ...nbfc,
              nbfc: {...nbfc.nbfc, indicative_emi: indicativeEMIAmount},
            };
          }
        }),
      );
      setNbfcs(_nbfcs);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    nbfcWisePreApprovedLoanFnRef.current();
  }, [filter]);

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
                EXPLORE SCHEMES
              </Heading>
            </View>
            <View
              style={{
                paddingTop: 20,
                marginBottom: 80,
                backgroundColor: theme.colors.background,
                zIndex: 0,
              }}>
              <View style={{marginTop: 12}}>
                <Heading
                  style={{
                    color: theme.colors.error,
                    fontWeight: theme.fontWeights.normal,
                    ...theme.fontSizes.large,
                    fontFamily: theme.fonts.regular,
                  }}>
                  This Screen is in under development. Schemes Will Come Here...
                </Heading>
              </View>
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

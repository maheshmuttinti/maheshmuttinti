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
import ScreenWrapper from '../../../../hocs/screenWrapperWithoutBackButton';
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
  BaseButton,
  SubText,
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
import {debugLog, isNumber, prettifyJSON, showNativeAlert} from 'utils';
import useLayoutBackButtonAction from '../../../../reusables/useLayoutBackButtonAction';
import Carousel from 'react-native-snap-carousel-v4';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import Config from 'react-native-config';
import {SliderWithLabels} from '../components/SliderWithLabels';
import {SelectTenure} from '../components/SelectTenure';
import {MonthlyPaymentPlans} from '../components/MonthlyPaymentPlans';

export default function ({route, navigation}) {
  const theme = useTheme();
  const {width} = Dimensions.get('window');

  const [nbfc, setNbfc] = useState({});
  const [active, setActive] = useState(0);
  const [schemes, setSchemes] = useState([]);
  const [selectedSchemes, setSelectedSchemes] = useState([]);
  const [showSelectableList, setShowSelectableList] = useState(false);
  const [emiPlan, setEmiPlan] = useState(null);
  const [apiCallStatus, setApiCallStatus] = useState(null);
  const [loanAmount, setLoanAmount] = useState(null);
  const [email, setEmail] = useState('');
  const [emiPlans, setEmiPlans] = useState([]);
  const [refreshEMIPlansOptions, setRefreshEMIPlansOptions] = useState([]);
  const [selectComponentWrapperHeight, setSelectComponentWrapperHeight] =
    useState('auto');
  const [emiPlansLoading, setEMIPlansLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [minLoanAmount, setMinLoanAmount] = useState(0);
  const [maxLoanAmount, setMaxLoanAmount] = useState(10000);

  useLayoutBackButtonAction(theme.colors.background);

  useEffect(() => {
    setLoanAmount(10000);
  }, []);

  const handleChangeText = text => {
    debugLog('text', text);
  };

  const handleSubmit = () => {
    console.log('cool');
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
                    onChangeText={text => {
                      handleChangeText(text);
                    }}
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
                loanAmount={loanAmount}
                minLoanAmount={minLoanAmount}
                maxLoanAmount={maxLoanAmount}
                onSliderChange={value => {
                  console.log('Slider value: ', value);
                }}
              />

              <SelectTenure
                onSelect={tenure => {
                  console.log('tenure: ', tenure);
                }}
                emiTenures={[
                  {label: '24 Months', value: '24 Months'},
                  {label: '21 Months', value: '21 Months'},
                  {label: '18 Months', value: '18 Months'},
                  {label: '15 Months', value: '15 Months'},
                  {label: '12 Months', value: '12 Months'},
                  {label: '9 Months', value: '9 Months'},
                  {label: '6 Months', value: '6 Months'},
                ]}
                defaultEMITenure={{label: '24 Months', value: '24 Months'}}
                style={{paddingTop: 24}}
                labelStyle={{}}
                columnCount={3}
                textStyles={{textAlign: 'left'}}
              />

              <MonthlyPaymentPlans style={{paddingTop: 16}} />

              <View style={{paddingTop: 24, paddingBottom: 60}}>
                <BaseButton
                  onPress={() => {
                    handleSubmit();
                  }}
                  disable={loading}
                  gradientColors={[
                    theme.colors.primaryOrange800,
                    theme.colors.primaryOrange,
                  ]}
                  textStyles={loading && {fontSize: 12}}>
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

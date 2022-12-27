/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Platform, Pressable} from 'react-native';
import ScreenWrapper from '../../../../../hocs/screenWrapperWithoutBackButton';
import {useTheme} from 'theme';
import {Card, Heading} from 'uin';
import {ApplicantAvatar, BackArrow} from 'assets';
import {ScrollView} from 'react-native';
import useLayoutBackButtonAction from '../../../../../reusables/useLayoutBackButtonAction';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {SchemesList} from '../../components/ChooseNBFCs/SingleNBFC/SchemesList';
import {NBFCHeading} from '../../components/ChooseNBFCs/SingleNBFC/NBFCHeading';
import {ProgressBar} from '../../components/ChooseNBFCs/SingleNBFC/ProgressBar';
import {SaveButton} from '../../components/ChooseNBFCs/SingleNBFC/SaveButton';
import {LoanAmountGradientCard} from '../../components/ChooseNBFCs/SingleNBFC/LoanAmountGradientCard';

// Todos: Get the Dynamic Data for Hardcoded data
export default function ({navigation, route}) {
  const nbfcName =
    route?.params?.nbfcName || 'Eclear Leasing & Finance Private Limited';
  const nbfcCode = route?.params?.nbfcCode || 'LAMF-ECLEAR';
  const minLoanAmount = route?.params?.minLoanAmount || 100;
  const maxLoanAmount = route?.params?.maxLoanAmount || 1000000;
  const approvedLoanAmount = route?.params?.approvedLoanAmount || 1000000;

  const [headerType, setHeaderType] = useState('normal');

  const theme = useTheme();

  useLayoutBackButtonAction(theme.colors.background);

  return (
    <>
      {headerType === 'normal' && (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: theme.colors.primaryBlue,
            width: '100%',
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
              Loans Against Mutual Funds{' '}
            </Heading>
          </View>
          <View style={{flex: 1 / 3, alignItems: 'center'}}>
            <View style={{height: 24, width: 24}}>
              <ApplicantAvatar />
            </View>
          </View>
        </View>
      )}
      {headerType === 'loan' && (
        <View
          style={{
            backgroundColor: theme.colors.background,
            paddingBottom: 24,
          }}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: theme.colors.background,
              width: '100%',
              paddingTop: Platform.OS === 'ios' ? 42 : 24,
            }}>
            <Pressable
              hitSlop={{top: 30, left: 30, right: 30, bottom: 30}}
              onPress={() => {
                navigation.canGoBack() && navigation.pop();
              }}
              style={{width: 50, marginLeft: 16}}>
              <BackArrow fill={theme.colors.text} />
            </Pressable>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Heading
                style={{
                  fontWeight: 'bold',
                  fontFamily: theme.fonts.regular,
                  ...theme.fontSizes.large,
                  color: theme.colors.text,
                }}>
                Loans Against Mutual Funds{' '}
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
              width: '100%',
              paddingTop: 32,
              paddingHorizontal: 16,
            }}>
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
            <View style={{paddingBottom: 19}}>
              <NBFCHeading nbfcName={nbfcName} />
            </View>
            <View>
              <ProgressBar percentageValue={90} />
            </View>
          </View>
        </View>
      )}
      <ScreenWrapper
        backgroundColor={
          headerType === 'loan'
            ? theme.colors.background
            : theme.colors.primaryOrange
        }
        scrollView={false}
        footer={true}>
        <ScrollView
          nestedScrollEnabled={true}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          onScroll={e => {
            if (e.nativeEvent.contentOffset.y > 235) {
              setHeaderType('loan');
            } else {
              setHeaderType('normal');
            }
          }}
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
              <View style={{paddingBottom: 19}}>
                <NBFCHeading nbfcName={nbfcName} />
              </View>
              <View>
                <ProgressBar
                  percentageValue={90}
                  minLoanAmount={minLoanAmount}
                  maxLoanAmount={maxLoanAmount}
                />
              </View>
              <View
                style={{
                  paddingTop: 24,
                  marginBottom: 80,
                  backgroundColor: theme.colors.background,
                  zIndex: 0,
                }}>
                <SchemesList />
              </View>
            </View>
          </Card>
        </ScrollView>
      </ScreenWrapper>
      {/* Todo: Show the SaveButton when user select schemes */}
      <SaveButton onSave={() => {}} />
      {/* Todo: Show the LoanAmountGradientCard when user doesn't select or ltv amount is equal to the max loan amount of nbfc? */}
      <LoanAmountGradientCard
        selectedSchemes={[1, 2]}
        approvedLoanAmount={approvedLoanAmount}
        onNext={() => {
          const routeParams = {
            // data: {
            //   nbfc: {
            //     ...nbfc,
            //     tenure: emiPlan?.tenure,
            //     tentative_emi_amount: emiPlan?.tentative_emi_amount,
            //   },
            //   email,
            //   schemes: showSelectableList ? selectedSchemes : schemes,
            //   pre_approved_loan_amount: finalLoanAmount,
            //   user: {
            //     pan_number: selectedPan.value,
            //     name: selectedPan.label,
            //   },
            // },
          };
          navigation.navigate('LAMFV2', {screen: 'LoanDetailsForLienMarking'});
        }}
      />
    </>
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

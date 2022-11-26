/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import {Heading, GradientCard, OutlinedButton, ProgressCircle} from 'uin';
import {useTheme} from 'theme';
import {CloseCircleWithCrossIcon, LoanBanner} from 'assets';

export default function ({
  ref,
  navigation,
  showModal,
  setShowBannerSpace,
  userStage,
  ...props
}) {
  const theme = useTheme();

  const renderBannerStageMessage = () => {
    if (
      userStage?.meta?.pre_approved_loan_amount?.total_pre_approved_loan_amount
    ) {
      return 'You have a Pre Approved loan of';
    }
    if (userStage?.stage_data?.stage === 'cas_processing') {
      return 'Your CAS is processing, your dashboard will be ready in a few minutes.';
    } else if (
      userStage?.stage_data?.stage === 'pre_approved_loan_not_available' ||
      userStage?.stage_data?.stage ===
        'loan_amount_not_eligible_for_available_nbfcs'
    ) {
      return "Sorry, but there are no schemes eligible for a loan at the moment. We will update you as soon as it's available.";
    }
    return "Don't miss out on Investment Insights!";
  };

  return (
    <View
      {...props}
      ref={ref}
      style={{
        position: 'relative',
      }}>
      <GradientCard
        style={{
          backgroundColor: theme.colors.primaryBlue,
          borderRadius: 12,
          zIndex: 5,
        }}
        gradientColors={['#003AC9', '#3F76FF']}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 24,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              flex: 3 / 4,
            }}>
            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  ...theme.fontSizes.xlarge,
                }}>
                <Text
                  style={{
                    fontFamily: theme.fonts.regular,
                    color: theme.colors.background,
                    fontSize:
                      renderBannerStageMessage().length > 60 ? 14 : null,
                    lineHeight:
                      renderBannerStageMessage().length > 60 ? 21 : null,
                  }}>
                  {renderBannerStageMessage()}
                </Text>
                {userStage?.meta?.pre_approved_loan_amount
                  ?.total_pre_approved_loan_amount && (
                  <Heading
                    style={{
                      ...theme.fontSizes.xlarge,
                      fontWeight: theme.fontWeights.veryBold,
                    }}>
                    {' '}
                    <Text style={{...theme.fontSizes.large}}>₹</Text>
                    {`${
                      userStage?.meta?.pre_approved_loan_amount
                        ?.total_pre_approved_loan_amount
                        ? userStage?.meta?.pre_approved_loan_amount
                            ?.total_pre_approved_loan_amount
                        : 'NA'
                    }*`}
                  </Heading>
                )}
              </Text>

              <View
                style={{
                  paddingHorizontal: 0,
                  paddingTop: 8,
                  width: 112,
                  paddingVertical: 2,
                }}>
                <OutlinedButton
                  extraStyles={{
                    paddingVertical: 4,
                    backgroundColor: theme.colors.primaryBlue800,
                    paddingHorizontal: 1,
                  }}
                  onPress={() => {
                    if (
                      !userStage?.meta?.pre_approved_loan_amount
                        ?.total_pre_approved_loan_amount
                    ) {
                      navigation.navigate('Protected', {
                        screen: 'UploadCAS',
                      });
                    } else {
                      showModal(true);
                    }
                  }}
                  style={{borderWidth: 2}}
                  outlineColor={theme.colors.primary}
                  textColor={theme.colors.primary}
                  textStyles={{
                    color: theme.colors.primary,
                    fontWeight: theme.fontWeights.veryBold,
                    ...theme.fontSizes.small,
                  }}>
                  {userStage?.meta?.pre_approved_loan_amount
                    ?.total_pre_approved_loan_amount
                    ? 'Apply Now'
                    : 'Upload Now'}
                </OutlinedButton>
              </View>
            </View>
          </View>
          {userStage?.meta?.pre_approved_loan_amount
            ?.total_pre_approved_loan_amount && (
            <View style={{position: 'absolute', bottom: 0, right: 5}}>
              <LoanBanner />
            </View>
          )}

          {!userStage?.meta?.pre_approved_loan_amount
            ?.total_pre_approved_loan_amount && (
            <View
              style={{
                flex: 1 / 4,
                alignSelf: 'center',
                justifyContent: 'flex-start',
                marginRight: 31.25,
              }}>
              <ProgressCircle
                percent={userStage?.stage_data?.percentage_completed?.slice(
                  0,
                  userStage?.stage_data?.percentage_completed?.indexOf('%'),
                )}
                radius={34}
                textFontSize={18}
                progressRingWidth={6}
                bgRingWidth={
                  userStage?.stage_data?.percentage_completed?.slice(
                    0,
                    userStage?.stage_data?.percentage_completed?.indexOf('%'),
                  ) >= 50
                    ? 3
                    : 6
                }
                ringColor={theme.colors.primaryYellow}
                textFontColor={'white'}
                ringBgColor={'white'}
                clockwise={false}
              />
            </View>
          )}
          <TouchableOpacity
            onPress={() => setShowBannerSpace(false)}
            hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}
            style={
              userStage?.meta?.pre_approved_loan_amount ||
              !props?.response?.data?.message
                ? {position: 'absolute', top: 11.25, right: 12.25}
                : {
                    flex: 0.1,
                    top: 11.25,
                    marginRight: 12.25,
                  }
            }>
            <CloseCircleWithCrossIcon />
          </TouchableOpacity>
        </View>
      </GradientCard>
      <View
        style={{
          zIndex: 2,
          position: 'absolute',
          bottom: -3,
          alignSelf: 'center',
          height: 82,
          width: '100%',
          backgroundColor: 'rgba(0, 58, 201, 0.38)',
          borderRadius: 12,
        }}
      />
      <View
        style={{
          zIndex: 1,
          position: 'absolute',
          bottom: -10,
          alignSelf: 'center',
          height: 82,
          width: 282,
          backgroundColor: theme.colors.primaryBlue100,
          borderRadius: 12,
        }}
      />
    </View>
  );
}

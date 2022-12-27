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
  userStageCardContent,
  onUploadNow = () => {},
  onApplyNow = () => {},
  ...props
}) {
  const theme = useTheme();

  const renderBannerStageMessage = () => {
    return "Sorry, but there are no schemes eligible for a loan at the moment. We will update you as soon as it's available.";
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
                      userStageCardContent?.message?.length > 60 ? 14 : null,
                    lineHeight:
                      userStageCardContent?.message?.length > 60 ? 21 : null,
                  }}>
                  {`${userStageCardContent?.message}`}
                </Text>
                {userStageCardContent?.action === 'show_apply_now_button' ? (
                  <Heading
                    style={{
                      ...theme.fontSizes.xlarge,
                      fontWeight: theme.fontWeights.veryBold,
                    }}>
                    {' '}
                    <Text style={{...theme.fontSizes.large}}>₹</Text>
                    {`${
                      userStageCardContent?.action === 'show_apply_now_button'
                        ? userStageCardContent?.preApprovedLoanAmount
                        : 'NA'
                    }*`}
                  </Heading>
                ) : null}
              </Text>

              {userStageCardContent?.action !== null ? (
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
                        userStageCardContent?.action ===
                        'show_upload_now_button'
                      ) {
                        onUploadNow();
                      } else if (
                        userStageCardContent?.action === 'show_apply_now_button'
                      ) {
                        onApplyNow();
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
                    {userStageCardContent?.action === 'show_upload_now_button'
                      ? 'Upload Now'
                      : userStageCardContent?.action === 'show_apply_now_button'
                      ? 'Apply Now'
                      : 'Upload Now'}
                  </OutlinedButton>
                </View>
              ) : null}
            </View>
          </View>
          {userStageCardContent?.meta?.pre_approved_loan_amount
            ?.total_pre_approved_loan_amount ? (
            <View style={{position: 'absolute', bottom: 0, right: 5}}>
              <LoanBanner />
            </View>
          ) : null}

          {userStageCardContent?.action !== 'show_apply_now_button' ? (
            <View
              style={{
                flex: 1 / 4,
                alignSelf: 'center',
                justifyContent: 'flex-start',
                marginRight: 31.25,
              }}>
              <ProgressCircle
                percent={`${userStageCardContent?.percentage}`}
                radius={34}
                textFontSize={18}
                progressRingWidth={6}
                bgRingWidth={userStageCardContent?.percentage >= 50 ? 3 : 6}
                ringColor={theme.colors.primaryYellow}
                textFontColor={'white'}
                ringBgColor={'white'}
                clockwise={false}
              />
            </View>
          ) : null}
          <TouchableOpacity
            onPress={() => setShowBannerSpace(false)}
            hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}
            style={
              userStageCardContent?.action === 'show_apply_now_button'
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

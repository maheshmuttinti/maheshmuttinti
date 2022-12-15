/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useState, useCallback} from 'react';
import ScreenWrapper from '../../../hocs/screenWrapperWithoutBackButton';
import {useTheme} from 'theme';
import {Heading, Card, BaseButton} from 'uin';
import {View, Text} from 'react-native';
import {InfoIcon, TickCircle, Timer} from 'assets';
import {getLoanApplicationById} from 'services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useLayoutBackButtonAction from '../../../reusables/useLayoutBackButtonAction';
import {useFocusEffect} from '@react-navigation/native';
import {prettifyJSON} from 'utils';

const NextSteps = ({navigation, route}) => {
  const theme = useTheme();

  const {applicationId, step} = route.params;

  const [navigationStep, setNavigationStep] = useState(step ? step : 1);

  const stepNumbers = {
    1: 'Basic Details',
    2: 'Identity and Address Proof',
    3: 'Video Verification',
    4: 'Bank Details',
    5: 'Loan Agreement',
    6: 'Digital Nach',
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await AsyncStorage.setItem('application_id', applicationId);
        await getLoanApplicationStatus();
      })();
    }, [applicationId]),
  );

  const getLoanApplicationStatus = async () => {
    try {
      const loanApplication = await getLoanApplicationById(applicationId);
      console.log('loanApplication', prettifyJSON(loanApplication));
      let steps = [
        'pending',
        'basic_details',
        'upload_proof',
        'video_verification',
        'bank_verification',
        'loan_agreement',
        // 'completed',
      ];
      steps?.map((item, index) => {
        let _step = index + 1;
        if (loanApplication.loan_application_step === item) {
          if (_step <= steps.length) {
            console.log('_step', _step);
            setNavigationStep(_step);
          }
        }
      });
    } catch (error) {
      return error;
    }
  };

  useLayoutBackButtonAction();

  return (
    <ScreenWrapper>
      <View style={{paddingVertical: 24}}>
        <View style={{paddingHorizontal: 24}}>
          <Heading
            style={{
              color: theme.colors.text,
              ...theme.fontSizes.heading5,
              fontWeight: theme.fontWeights.veryBold,
            }}>
            What are the next steps?
          </Heading>

          <View style={{paddingTop: 16}}>
            <Heading
              style={{
                color: theme.colors.text,
                ...theme.fontSizes.medium,
                fontWeight: theme.fontWeights.bold,
                fontFamily: theme.fonts.regular,
              }}>
              We are going to be needing some of your details in this step
            </Heading>
          </View>
          <View style={{flexDirection: 'row', paddingTop: 16}}>
            <Timer />
            <Heading
              style={{
                color: theme.colors.primaryOrange,
                ...theme.fontSizes.small,
                fontWeight: theme.fontWeights.lightBold,
                paddingLeft: 9.67,
              }}>
              AVERAGE TIME NEEDED:{' '}
            </Heading>
            <Heading
              style={{
                color: theme.colors.primaryOrange,
                ...theme.fontSizes.small,
                fontWeight: theme.fontWeights.veryBold,
              }}>
              15 MIN
            </Heading>
          </View>
        </View>
        <View style={{marginTop: 15}}>
          {Object.keys(stepNumbers).map((_, i) => (
            <View key={i} style={{paddingHorizontal: 22, paddingVertical: 5}}>
              {i + 1 > navigationStep &&
                i + 1 !== navigationStep /* Not selected */ && (
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 20,
                        height: 20,
                        backgroundColor: '#fff',
                        borderWidth: 2,
                        borderColor: '#D1D5DB',
                        borderRadius: 15,
                        marginBottom: 10,
                      }}
                    />
                    <Heading
                      style={{
                        color: theme.colors.text,
                        ...theme.fontSizes.medium,
                        fontWeight: theme.fontWeights.bold,
                        fontFamily: theme.fonts.regular,
                        marginLeft: 10,
                      }}>
                      {stepNumbers[i + 1]}
                    </Heading>
                  </View>
                )}
              {i + 1 < navigationStep /* Checked */ && (
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 20,
                      height: 20,
                      borderWidth: 3,
                      borderColor: theme.colors.success,
                      borderRadius: 25,
                      marginBottom: 10,
                    }}>
                    <TickCircle />
                  </View>
                  <Heading
                    style={{
                      color: theme.colors.text,
                      ...theme.fontSizes.medium,
                      fontWeight: theme.fontWeights.bold,
                      fontFamily: theme.fonts.regular,
                      marginLeft: 10,
                    }}>
                    {stepNumbers[i + 1]}
                  </Heading>
                </View>
              )}
              {i + 1 === navigationStep /* Selected */ && (
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 20,
                      height: 20,
                      backgroundColor: theme.colors.primary,
                      borderWidth: 2.5,
                      borderColor: theme.colors.primaryBlue,
                      borderRadius: 15,
                      marginBottom: 10,
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 5,
                        height: 5,
                        backgroundColor: theme.colors.primaryBlue,
                        borderWidth: 3,
                        borderColor: theme.colors.primaryBlue,
                        borderRadius: 15,
                      }}
                    />
                  </View>
                  <Heading
                    style={{
                      color: theme.colors.text,
                      ...theme.fontSizes.medium,
                      fontWeight: theme.fontWeights.bold,
                      fontFamily: theme.fonts.regular,
                      marginLeft: 10,
                    }}>
                    {stepNumbers[i + 1]}
                  </Heading>
                </View>
              )}
              <View style={{alignItems: 'center'}}>
                {i + 1 !== 6 && (
                  <View
                    style={{
                      height: 21,
                      backgroundColor:
                        i + 2 > navigationStep
                          ? '#D1D5DB'
                          : theme.colors.primaryBlue,
                      position: 'absolute',
                      top: -10,
                      zIndex: 10,
                      left: 9,
                      paddingHorizontal: 1,
                      width: 1,
                    }}
                  />
                )}
              </View>
            </View>
          ))}
        </View>

        <Card
          style={{
            backgroundColor: theme.colors.backgroundYellow,
            marginHorizontal: 17,
            marginTop: 30,
            borderRadius: 8,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View>
            <InfoIcon fill={theme.colors.error} />
          </View>
          <View
            style={{
              paddingLeft: 17.25,
              marginRight: 16,
            }}>
            <Text
              style={{
                ...theme.fontSizes.small,
                fontWeight: theme.fontWeights.moreBold,
                color: theme.colors.text,
                fontFamily: theme.fonts.regular,
              }}>
              Please note that we shall be using your details present in CKYC
              for authentication purpose in the further steps.
            </Text>
          </View>
        </Card>
        <View style={{paddingTop: 16, paddingHorizontal: 24}}>
          <BaseButton
            onPress={() => {
              navigation.navigate('LoanApplication', {
                step: navigationStep,
                applicationId,
              });
            }}>
            Continue
          </BaseButton>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default NextSteps;

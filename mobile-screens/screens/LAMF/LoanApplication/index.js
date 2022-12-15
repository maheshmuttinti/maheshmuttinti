/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {TickCircle} from 'assets';
import {useEffect, useState} from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from 'theme';
import {Card, Heading} from 'uin';
import ScreenWrapper from '../../../hocs/screenWrapperWithoutBackButton';
import useLayoutBackButtonAction from '../../../reusables/useLayoutBackButtonAction';
import BankDetails from './Steps/BankDetails';
import BasicDetails from './Steps/BasicDetails';
import DigitalNACH from './Steps/DigitalNACH';
import LoanAgreement from './Steps/LoanAgreement';
import UploadProof from './Steps/UploadProof';
import VideoVerification from './Steps/VideoVerification';

export default function ({route, navigation}) {
  const theme = useTheme();
  const [applicationId, setApplicationId] = useState('');
  const [step, setStep] = useState(
    route && route.params && route.params.step ? route.params.step : 1,
  );

  useLayoutBackButtonAction(theme.colors.black, step);

  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem('application_id');
      setApplicationId(id);
      console.log(id);
    })();
  }, []);

  const stepNumbers = [1, 2, 3, 4, 5, 6];

  const RenderStep = () => {
    switch (step) {
      case 1:
        return (
          <BasicDetails
            currentStep={step}
            setStep={setStep}
            applicationId={applicationId}
          />
        );
      case 2:
        return (
          <UploadProof
            currentStep={step}
            setStep={setStep}
            applicationId={applicationId}
            navigation={navigation}
          />
        );
      case 3:
        return (
          <VideoVerification
            currentStep={step}
            setStep={setStep}
            applicationId={applicationId}
            navigation={navigation}
          />
        );
      case 4:
        return (
          <BankDetails
            currentStep={step}
            setStep={setStep}
            applicationId={applicationId}
            navigation={navigation}
          />
        );
      case 5:
        return (
          <LoanAgreement
            currentStep={step}
            setStep={setStep}
            applicationId={applicationId}
            navigation={navigation}
          />
        );
      case 6:
        return (
          <DigitalNACH
            currentStep={step}
            setStep={setStep}
            applicationId={applicationId}
            navigation={navigation}
          />
        );
      default:
        return <BasicDetails currentStep={step} setStep={setStep} />;
    }
  };
  return (
    <ScreenWrapper backgroundColor={theme.colors.backgroundBlue}>
      <View style={{paddingTop: 20}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {stepNumbers.map((_, i) => (
            <View key={i} style={{paddingHorizontal: 22}}>
              {i + 1 > step && i + 1 !== step /* Not selected */ && (
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
              )}
              {i + 1 < step /* Checked */ && (
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
              )}
              {i + 1 === step /* Selected */ && (
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
              )}
              <View style={{alignItems: 'center'}}>
                {i + 1 !== 6 && (
                  <View
                    style={{
                      height: 2,
                      backgroundColor:
                        i + 2 > step ? '#D1D5DB' : theme.colors.primaryBlue,
                      position: 'absolute',
                      top: -21,
                      zIndex: 10,
                      left: 20,
                      paddingHorizontal: 22,
                    }}
                  />
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
      <Card
        style={{
          flex: 1,
          alignSelf: 'stretch',
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
        }}>
        <View style={{paddingTop: 24, paddingHorizontal: 24}}>
          <Heading
            style={{
              color: theme.colors.primaryOrange,
              fontWeight: theme.fontWeights.moreBold,
              ...theme.fontSizes.small,
            }}>
            {`STEP ${step} OF 6`}
          </Heading>
          <View style={{zIndex: 11}}>
            {applicationId.length > 0 && <RenderStep />}
          </View>
        </View>
      </Card>
    </ScreenWrapper>
  );
}

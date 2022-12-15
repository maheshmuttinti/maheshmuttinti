/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback} from 'react';
import ScreenWrapper from '../../hocs/screenWrapperWithoutBackButton';
import {useTheme} from 'theme';
import {Heading, BaseButton} from 'uin';
import {View} from 'react-native';
import {CamsSuccessIcon} from 'assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {
  getLoanApplicationById,
  lienMarkingStatus,
  updateApplication,
} from 'services';
import {prettifyJSON, showToast, sleep} from 'utils';
import useLayoutBackButtonAction from '../../reusables/useLayoutBackButtonAction';
import useHardwareButtonGoBack from '../../reusables/useHardwareButtonGoBack';

const CamsSuccess = ({navigation}) => {
  const theme = useTheme();
  const [id, setId] = useState('');
  const [lienMarkingStatusValue, setLienMarkingStatus] = useState('awaiting');
  useLayoutBackButtonAction(theme.colors.text, null, true);
  useHardwareButtonGoBack(true);

  useEffect(() => {
    (async () => {
      const applicationId = await AsyncStorage.getItem('applicationId');
      console.log(`applicationId: ${applicationId}`);
      if (applicationId && applicationId.length > 0) {
        setId(applicationId);
        updateLoanApplication(applicationId);
      }
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        console.log('lien marking screen is dead!');
        (async () => {
          /* we are doing this so that the value is deleted before we go out of this screen */
          await clearApplicationId();
        })();
      };
    }, []),
  );

  const clearApplicationId = async () => {
    try {
      await AsyncStorage.removeItem('applicationId');
      console.log('unset application id completed!');
    } catch (error) {
      throw error;
    }
  };

  const getLienMarkingStatus = async applicationId => {
    try {
      const loanApplicationData = await getLoanApplicationById(applicationId);

      const lienMarkingData =
        loanApplicationData?.loan_application_data?.lien_marking_data;
      const lienMarkStatusPayload = {
        lienstatus: {
          clientid: lienMarkingData?.clientid,
          clientname: lienMarkingData?.clientname,
          lienrefno: lienMarkingData?.lienrefno,
          pan: lienMarkingData?.pan,
          emailid: lienMarkingData?.emailid,
        },
      };
      console.log(
        'lien marking status payload',
        prettifyJSON(lienMarkStatusPayload),
      );
      const lienMarkStatusResponse = await lienMarkingStatus(
        lienMarkStatusPayload,
      );

      // console.log('lienMarkingResponse', prettifyJSON(lienMarkStatusResponse));
      // setLienMarkingStatusCheck('status_found');

      const isAllSchemesLienMarked =
        lienMarkStatusResponse?.lienstatus?.schemedetails?.every(scheme => {
          return scheme?.LIEN_STATUS.toUpperCase() === 'SUCCESS';
        });

      console.log('isAllSchemesLienMarked outside', isAllSchemesLienMarked);
      return {isAllSchemesLienMarked, loanApplicationData};
    } catch (error) {
      console.log('lien marking status error', error);
    }
  };

  const updateLoanApplication = async applicationId => {
    console.log('updateLoanApplication-called', applicationId);
    try {
      // setLienMarkingStatusCheck('status_checking');
      // const applicationId = await AsyncStorage.getItem('applicationId');

      if (!applicationId) {
        showToast('Application ID not found');
      } else {
        const {isAllSchemesLienMarked, loanApplicationData} =
          await getLienMarkingStatus(applicationId);
        console.log('isAllSchemesLienMarked outside', isAllSchemesLienMarked);

        if (isAllSchemesLienMarked) {
          setLienMarkingStatus('success');
          console.log(
            'isAllSchemesLienMarked inside if',
            isAllSchemesLienMarked,
          );

          const loan_application_payload = {
            ...loanApplicationData,
            lien_marking_status: 'success',
            loan_application_data: {
              ...loanApplicationData.loan_application_data,
              lien_marked_date: new Date().toISOString(),
            },
          };

          console.log(
            'loan_application_payload=====>',
            JSON.stringify(loan_application_payload),
          );

          console.log(
            'PAYLOAD========>>>',
            applicationId,
            loan_application_payload,
          );

          const lienMarkedDataWithLoanApplicationDataResponse =
            await updateApplication(applicationId, loan_application_payload);

          if (lienMarkedDataWithLoanApplicationDataResponse) {
            await sleep(1000);
            // navigation.navigate('Protected', {
            //   screen: 'CAMSSuccess',
            // });
          } else {
            showToast('Lien Marking Success Data Saving Failed.');
          }
        } else {
          setLienMarkingStatus('failed');
          console.log(
            'isAllSchemesLienMarked inside else',
            isAllSchemesLienMarked,
          );
          const loan_application_payload = {
            ...loanApplicationData,
            lien_marking_status: 'failed',
            loan_application_data: {
              ...loanApplicationData.loan_application_data,
              lien_marked_date: new Date().toISOString(),
            },
          };

          console.log(
            'loan_application_payload success lien payload',
            prettifyJSON(loan_application_payload),
          );

          const lienMarkedDataWithLoanApplicationDataResponse =
            await updateApplication(applicationId, loan_application_payload);

          console.log(
            'final loan Application response after lien marking success',
            prettifyJSON(lienMarkedDataWithLoanApplicationDataResponse),
          );

          showToast('Lien Marking Failed');
        }
      }
    } catch (error) {
      console.log(
        'error in redirecting to correct screen in lien marking step',
        error,
      );
      showToast(`${error.response.data}` || 'Something went wrong');
    }
  };

  return (
    <ScreenWrapper>
      <View
        style={{
          paddingTop: 99,
          paddingBottom: 32,
          paddingHorizontal: 24,
        }}>
        <View style={{paddingHorizontal: 8}}>
          <CamsSuccessIcon />
          <View style={{paddingTop: 40}}>
            <Heading
              style={{
                textAlign: 'center',
                color: theme.colors.text,
                ...theme.fontSizes.heading6,
                fontWeight: theme.fontWeights.moreBold,
                paddingBottom: 8,
              }}>
              You have successfully completed the CAMS process
            </Heading>
          </View>
        </View>
        <View style={{paddingTop: 83}}>
          {lienMarkingStatusValue === 'success' && (
            <BaseButton
              onPress={() => {
                navigation.navigate('NextSteps', {
                  applicationId: id,
                });
              }}>
              Continue To Next Step
            </BaseButton>
          )}
          {lienMarkingStatusValue === 'failed' && (
            <BaseButton
              onPress={() => {
                navigation.navigate('NextSteps', {
                  applicationId: id,
                });
              }}>
              Lien Marking Failed, Please contact the Support team.
            </BaseButton>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default CamsSuccess;

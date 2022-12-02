/* eslint-disable react-native/no-inline-styles */
import {NBFCIcon} from 'assets';
import * as React from 'react';
import {useEffect, useState, useCallback} from 'react';
import {View} from 'react-native';
import {
  callLMSAPIs,
  eMandateGeneration,
  getBankDetailsByIFSC,
  getLMSLoanById,
  getLoanApplicationById,
  mandateStatus,
  updateApplication,
} from 'services';
import {useTheme} from 'theme';
import {BaseButton, Card, Heading, LabelValue} from 'uin';
import Loader from '../../../reusables/loader';
import Config from 'react-native-config';
import {openBrowser, prettifyJSON, showToast} from 'utils';
import {useFocusEffect} from '@react-navigation/native';

export default function ({navigation, applicationId}) {
  const theme = useTheme();
  const [applicationData, setApplicationData] = useState({});
  const [EMIDueDate, setEMIDueDate] = useState('1st of every month');
  const [loading, setLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [EMI, setEMI] = useState(null);
  const [firstEMIDate, setFirstEMIDate] = useState(null);
  const [digitalNACHStatusChecking, setDigitalNACHStatusChecking] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await getLoanApplicationData();
      })();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setEMIDueDate(applicationData?.loan_application_data?.emi_scheme);
        if (
          applicationData &&
          applicationData?.loan_application_data &&
          applicationData?.loan_application_data?.digital_nach_id &&
          applicationData?.loan_application_data?.digital_nach_status
        ) {
          await getNachDetails();
        }

        const ifscCode =
          applicationData?.loan_application_data?.bank_verification_info
            ?.bankTransfer?.beneIFSC;
        const bankDetailsResponse = await getBankDetailsByIFSC(ifscCode);
        setBankDetails(bankDetailsResponse);
        const allCloudLMSLoan = await getLMSLoanById(applicationId);
        setEMI(allCloudLMSLoan?.EMI);
      })();
    }, [applicationData, applicationId]),
  );

  // useEffect(() => {
  //   (async () => {
  //     if (
  //       applicationData &&
  //       applicationData?.loan_application_data &&
  //       applicationData?.loan_application_data?.digital_nach_id &&
  //       applicationData?.loan_application_data?.digital_nach_status ===
  //         'pending'
  //     ) {
  //       await getNachDetails();
  //     }

  //     const ifscCode =
  //       applicationData?.loan_application_data?.bank_verification_info
  //         ?.bankTransfer?.beneIFSC;
  //     const bankDetailsResponse = await getBankDetailsByIFSC(ifscCode);
  //     setBankDetails(bankDetailsResponse);
  //     const allCloudLMSLoan = await getLMSLoanById(applicationId);
  //     setEMI(allCloudLMSLoan?.EMI);
  //   })();
  // }, [applicationData]);

  const getLoanApplicationData = async () => {
    try {
      const application = await getLoanApplicationById(applicationId);
      setApplicationData(application);
      setFirstEMIDate(application?.loan_application_data?.first_emi_date);
    } catch (error) {
      console.log('error while fetching the loan application', error);
      return error;
    }
  };

  const titleStyles = {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontWeight: theme.fontWeights.semiBold,
    ...theme.fontSizes.largeMedium,
    flex: 1 / 2,
  };
  const valueStyles = {
    color: theme.colors.text,
    fontWeight: theme.fontWeights.veryBold,
    ...theme.fontSizes.largeMedium,
    flex: 1 / 2,
    textAlign: 'right',
  };

  const generateMandate = async () => {
    try {
      setLoading(true);

      console.log('cut off date', EMIDueDate);

      if (Config.LOAN_APPLICATION_MOCK_TEST === true) {
        navigation.navigate('Protected', {screen: 'LoanSuccess'});
      } else {
        const payload = {
          identifier: applicationData?.loan_application_data?.mobile,
          bank_account_number:
            applicationData?.loan_application_data?.bank_details
              ?.bank_account_number,
          bank_account_type: 'Savings',
          name: applicationData?.loan_application_data?.name,
          first_collection_date:
            applicationData?.loan_application_data?.first_emi_date, // Todo: check the format of this date.
          amount: EMI,
        };
        console.log('payload for eMandateGeneration', prettifyJSON(payload));
        // return;
        const response = await eMandateGeneration(payload);
        console.log('response of emandate api', prettifyJSON(response));
        if (response?.id) {
          const loanData = {
            ...applicationData?.loan_application_data,
            digital_nach_id: response?.id,
            digital_nach_status: 'pending',
          };
          const loanPayload = {loan_application_data: loanData};
          await updateApplication(applicationId, loanPayload);
          setLoading(false);

          let url = '';
          if (
            Config.DIGIO_ENVIRONMENT &&
            Config.DIGIO_ENVIRONMENT.toLowerCase() === 'production'
          ) {
            // TODO: variables are hardcoded here.
            /* 
              url = `${Config.DIGIO_NACH_API_ENDPOINT}/${response?.id}/xyz/${applicationData?.loan_application_data?.mobile}?redirect_url=${Config.DIGIO_NACH_REDIRECTION_URL}`;
            */
            url = `https://app.digio.in/#/gateway/login/${response?.id}/xyz/${applicationData?.loan_application_data?.mobile}?redirect_url=https://api.production.finezzy.com/mf/lamf/signzy/video-redirection`;
          } else {
            url = `https://ext.digio.in/#/gateway/login/${response?.id}/xyz/${applicationData?.loan_application_data?.mobile}?redirect_url=https://api.staging.finezzy.com/mf/lamf/signzy/video-redirection`;
          }
          await openBrowser(url, successRedirectUrl);
          const successRedirectUrl = Config.DIGIO_VIDEO_REDIRECT_URL;

          // const successRedirectUrl = 'finezzy://signzy/video';
          // await openBrowser(
          //   `https://app.digio.in/#/gateway/login/${response?.id}/xyz/${applicationData?.loan_application_data?.mobile}?redirect_url=https://api.production.finezzy.com/mf/lamf/signzy/video-redirection`,
          //   successRedirectUrl,
          // );
          setLoading(false);
        } else {
          if (response?.message) {
            setLoading(false);

            showToast(response?.message);
          } else {
            setLoading(false);

            showToast('Something went wrong');
          }
        }
      }
    } catch (error) {
      console.log('error while generating the mandate', error);
      showToast('Something went wrong');
      setLoading(false);
    }
  };

  const handleCallAllCloudLMSAPIs = async () => {
    try {
      setDigitalNACHStatusChecking(true);
      const allCloudLMSAPIsResponse = await callLMSAPIs(
        applicationId,
        'after_digital_nach',
      );

      showToast('Data is saved to All Cloud successfully');
      console.log(
        'all cloud lms api calls after_loan_agreement response',
        prettifyJSON(allCloudLMSAPIsResponse),
      );

      return true;
    } catch (error) {
      console.log('all cloud api failed', error);
      showToast('Something went wrong, All Cloud APIs are failed');
      return false;
    }
  };

  const getNachDetails = async () => {
    try {
      const response = await mandateStatus(
        applicationData?.loan_application_data?.digital_nach_id,
      );
      if (response.state === 'auth_success') {
        const loanData = {
          ...applicationData?.loan_application_data,
          digital_nach_status: 'completed',
          digital_nach_data: response,
        };
        const loanPayload = {
          loan_application_data: loanData,
          loan_application_step: applicationData?.loan_application_step,
        };
        loanPayload.loan_application_step = 'completed';
        await updateApplication(applicationId, loanPayload);

        const result = await handleCallAllCloudLMSAPIs();
        if (result === true) {
          setDigitalNACHStatusChecking(false);

          navigation.navigate('Protected', {screen: 'LoanSuccess'});
        } else {
          setDigitalNACHStatusChecking(false);

          navigation.navigate('Protected', {screen: 'LoanSuccess'});
        }
      } else {
        showToast('NACH Failed please try again');
      }
    } catch (err) {
      showToast('Something went wrong');
      console.log('error', err);
      return err;
    }
  };
  return (
    <>
      <Loader
        loading={loading}
        text={'You are being redirected to NACH Mandate screen'}
      />
      <Loader
        loading={digitalNACHStatusChecking}
        text={
          'Saving the NACH details in All Cloud LMS and disbursing the Loan Amount..'
        }
      />

      <View style={{paddingTop: 8}}>
        <Heading
          style={{
            color: theme.colors.text,
            fontFamily: theme.fonts.regular,
            ...theme.fontSizes.heading5,
            fontWeight: theme.fontWeights.veryBold,
          }}>
          Digital NACH
        </Heading>
        <View style={{paddingTop: 8}}>
          <Heading
            style={{
              color: theme.colors.text,
              ...theme.fontSizes.medium,
              fontWeight: theme.fontWeights.semiBold,
            }}>
            You will be registering a mandate to auto deduct your EMIs. Please
            verify the details and proceed for registration
          </Heading>
        </View>
        <View style={{paddingTop: 32}}>
          <Card
            style={{
              backgroundColor: theme.colors.primaryBlue,
              borderRadius: 12,
              shadowOffset: {width: 4, height: 4},
              shadowColor: 'rgba(0, 0, 0, 0.15)',
              shadowOpacity: 1,
              shadowRadius: 12,
              elevation: 10,
            }}>
            <View
              style={{
                paddingTop: 11,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}>
              <Heading
                style={{
                  color: theme.colors.primaryYellow,
                  ...theme.fontSizes.small,
                  fontWeight: theme.fontWeights.semiBold,
                  paddingHorizontal: 16,
                }}>
                BANK ACCOUNT FOR EMI PAYMENT
              </Heading>

              <View
                style={{
                  paddingHorizontal: 16,
                  paddingTop: 8,
                  paddingBottom: 11,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: theme.colors.primary,
                    width: 60,
                    height: 60,
                    borderRadius: 60 / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <NBFCIcon />
                </View>
                <View style={{paddingHorizontal: 16}}>
                  <Heading
                    style={{
                      ...theme.fontSizes.large,
                      fontWeight: theme.fontWeights.semiBold,
                    }}>
                    {`${bankDetails?.BANK}`}
                  </Heading>
                  <Heading
                    style={{
                      ...theme.fontSizes.medium,
                      fontWeight: theme.fontWeights.semiBold,
                    }}>
                    {`${applicationData?.loan_application_data?.bank_details?.bank_account_number}`}
                  </Heading>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: theme.colors.backgroundYellow,
                  padding: 16,
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                }}>
                <LabelValue
                  style={{
                    paddingBottom: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                  titleStyle={{...titleStyles}}
                  valueStyle={{
                    ...valueStyles,
                  }}
                  title="EMI Amount"
                  value={`₹${EMI}`}
                />
                <LabelValue
                  style={{
                    paddingBottom: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                  titleStyle={{...titleStyles}}
                  valueStyle={{
                    flex: 1 / 2,
                  }}
                  title="EMI due date"
                  value={
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}>
                      <Heading
                        style={{
                          marginLeft: 4,
                          color: theme.colors.text,
                          fontWeight: theme.fontWeights.veryBold,
                          ...theme.fontSizes.largeMedium,
                        }}>
                        {EMIDueDate || '1st of every month'}
                      </Heading>
                    </View>
                  }
                />

                <LabelValue
                  style={{
                    paddingBottom: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                  titleStyle={{...titleStyles}}
                  valueStyle={{
                    ...valueStyles,
                  }}
                  title="1st EMI on"
                  value={firstEMIDate}
                />
              </View>
            </View>
          </Card>
        </View>
        <View style={{paddingTop: 24}}>
          <BaseButton
            onPress={() => {
              generateMandate();
            }}
            gradientColors={[
              theme.colors.primaryOrange800,
              theme.colors.primaryOrange,
            ]}>
            Create Mandate
          </BaseButton>
        </View>
      </View>
    </>
  );
}

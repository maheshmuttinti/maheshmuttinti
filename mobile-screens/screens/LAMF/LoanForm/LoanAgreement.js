/* eslint-disable react-native/no-inline-styles */
import {SignedSuccessIcon} from 'assets';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useTheme} from 'theme';
import {Heading, Body, BaseButton} from 'uin';
import {
  agreementStatus,
  digitalSign,
  getLoanApplicationById,
  updateApplication,
  getLMSLoanById,
  callLMSAPIs,
} from 'services';
import Loader from '../../../reusables/loader';
import Config from 'react-native-config';
import {
  amountInWords,
  formatDate,
  getAge,
  prettifyJSON,
  showToast,
} from 'utils';

const LoanAgreement = ({navigation, applicationId, currentStep, setStep}) => {
  const theme = useTheme();
  const [signSuccess, setSignSuccess] = useState(false);
  const [applicationData, setApplicationData] = useState({});
  const [loading, setLoading] = useState(false);
  const [EMI, setEMI] = useState('');

  useEffect(() => {
    (async () => {
      await getLoanApplicationData();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (
          applicationData?.loan_application_data?.loan_agreement_id &&
          applicationData?.loan_application_data.loan_agreement_status ===
            'pending'
        ) {
          setLoading(true);
          const result = await agreementStatus(
            applicationData?.loan_application_data?.loan_agreement_id,
          );
          if (result.agreement_status === 'completed') {
            const loanPayload = {
              loan_application_step: 'loan_agreement',
              loan_application_data: {
                ...applicationData.loan_application_data,
                loan_agreement_data: result,
                loan_agreement_status: 'signed',
              },
            };
            await updateApplication(applicationId, loanPayload);

            setSignSuccess(true);
            const allCloudLMSAPIsResponse = await callLMSAPIs(
              applicationId,
              'after_loan_agreement',
            );
            showToast('Signed Loan Agreement');
            console.log(
              'all cloud lms api calls before_loan_agreement response',
              prettifyJSON(allCloudLMSAPIsResponse),
            );
            setLoading(false);
          } else if (result.agreement_status === 'requested') {
            setSignSuccess(false);
            setLoading(false);
          } else if (
            applicationData?.loan_application_data?.loan_agreement_id &&
            applicationData?.loan_application_data.loan_agreement_status ===
              'signed'
          ) {
            setSignSuccess(true);
            const loanPayload = {
              loan_application_step: 'loan_agreement',
              loan_application_data: {
                ...applicationData.loan_application_data,
                loan_agreement_data: result,
                loan_agreement_status: 'signed',
              },
            };
            await updateApplication(applicationId, loanPayload);
            setSignSuccess(true);
            const allCloudLMSAPIsResponse = await callLMSAPIs(
              applicationId,
              'after_loan_agreement',
            );
            showToast('Signed Loan Agreement');
            console.log(
              'all cloud lms api calls before_loan_agreement response',
              prettifyJSON(allCloudLMSAPIsResponse),
            );
            setLoading(false);
          }
        }
      } catch (error) {
        console.log('intial load function loan agreement step', error);
        showToast('Something went wrong');
        // bypassing this step on failure case
        if (Config.LOAN_APPLICATION_MOCK_TEST === true) {
          setSignSuccess(true);
        }
        setLoading(false);
        return error;
      }
    })();
  }, [applicationData]);

  const getLoanApplicationData = async () => {
    const application = await getLoanApplicationById(applicationId);
    setApplicationData(application);
  };

  useEffect(() => {
    (async () => {
      try {
        if (!signSuccess) {
          const allCloudLMSLoan = await getLMSLoanById(applicationId);
          setEMI(allCloudLMSLoan?.EMI);
        }
      } catch (error) {
        console.log('error', error);
      }
    })();
  }, [applicationId, signSuccess]);

  const createLoanAgreement = async () => {
    try {
      setLoading(true);
      const loanApplicantName = applicationData?.loan_application_data?.name;
      const loanApplicantAddress = `${
        applicationData?.loan_application_data?.address +
        ', ' +
        applicationData?.loan_application_data?.city?.label +
        ', ' +
        applicationData?.loan_application_data?.state?.label
      }`;
      const nbfcName = applicationData?.nbfc_data?.nbfc_name;
      const agreementName = 'loan_agreement.pdf';
      const signType = 'aadhaar';
      const nbfcLocation = applicationData?.nbfc_data?.city || 'New Delhi';
      const agreementCityAndDate = `${nbfcLocation}, ${formatDate(
        new Date(),
        'dmy',
      )}`;
      const loanAmount = `${applicationData?.loan_application_data?.loan_details?.amount}`;

      const payload = {
        identifier: applicationData?.loan_application_data?.mobile,
        signee_name: `${loanApplicantName}`,
        sign_type: signType,
        file: agreementName,
        template_values: {
          loan_applicant_name: `${loanApplicantName}`,
          loan_account_number: `${applicationData?.loan_application_data?.bank_details?.bank_account_number}`,
          residence_address: `${loanApplicantAddress}`,
          loan_amount: loanAmount,
          rate_of_interest: `${applicationData?.nbfc_data?.roi}`,
          loan_tenure: '6 months',
          emi: `${EMI}`,
          agreement_city_and_date: agreementCityAndDate,
          agreement_sign_location: `${nbfcLocation}`,
          agreement_sign_date: `${formatDate(new Date(), 'dmy')}`,
          borrower_name: `${loanApplicantName}`,
          lender_name: `${nbfcName}`,
          loan_amount_in_words: amountInWords(loanAmount),
          demand_promissory_note_date: `${formatDate(new Date(), 'dmy')}`,
          loan_amount_figure_and_words: `${loanAmount} - ${amountInWords(
            loanAmount,
          )}`,
          delivery_cum_waiver_location:
            applicationData?.nbfc_data?.city || 'New Delhi',
          credit_facitity_date: `${formatDate(new Date(), 'dmy')}`,
          nbfc_name: `${nbfcName}`,
          continuity_security_date: `${formatDate(new Date(), 'dmy')}`,
          pledged_date: `${formatDate(new Date(), 'dmy')}`,
          lien_marked_date: `${formatDate(
            applicationData?.loan_application_data?.lien_marking_data
              ?.lien_marked_date || new Date(),
            'dmy',
          )}`,
          sanction_letter_date: `${formatDate(new Date(), 'dmy')}`, // need to change?
          loan_applicant_father_name: `${applicationData?.loan_application_data?.fathers_name}`,
          loan_applicant_age: `${getAge(
            applicationData?.loan_application_data?.dob
              ?.split('-')
              ?.reverse()
              .join('-'),
          )}`,
          agreement_date: `${formatDate(new Date(), 'dmy')}`,
          indemnity_location: applicationData?.nbfc_data?.city || 'New Delhi',
          indemnity_day_of_month: `${
            formatDate(new Date(), 'dmy').split('-')[0]
          }`,
          indemnity_month_in_words: `${
            formatDate(new Date(), 'dMy').split(' ')[1]
          }`,
          indeminity_year: `${formatDate(new Date(), 'dMy').split(' ')[2]}`,
          borrower_address: `${loanApplicantAddress}`,
          infavor_of_company: `${nbfcName}`,
          registered_office_address: nbfcLocation,
          processing_fee: applicationData?.nbfc_data?.processing_fee || '999',
          recieve_updates: 'true',
          name_of_facility: 'EMI Loan',
          limit_loan_amount: loanAmount,
          nbfc_registered_office_location: nbfcLocation,
          nbfc_address:
            applicationData?.nbfc_data?.address ||
            '211,NEW DELHI HOUSE 27,BARAKHAMBA ROAD NEW DELHI DL 110001 IN',
        },
      };
      console.log('loan agreement payload', prettifyJSON(payload));
      const response = await digitalSign(payload);
      console.log('loan agreement response---', response);
      const loanPayload = {
        loan_application_step: 'loan_agreement',
        loan_application_data: {
          ...applicationData?.loan_application_data,
          loan_agreement_id: response?.id,
          loan_agreement_status: 'pending',
        },
      };
      await updateApplication(applicationId, loanPayload);
      if (response?.id) {
        setLoading(false);

        navigation.navigate('DigioSDK', {
          digioDocumentId: response?.id,
          digioUserIdentifier: applicationData?.loan_application_data?.mobile,
        });
      } else {
        if (response?.message) {
          setLoading(false);
          showToast(response?.message);
        } else {
          setLoading(false);
          showToast('Something went wrong');
        }
      }
    } catch (error) {
      setLoading(false);
      console.log('error while digio sign api calling', error);
      showToast('Something went wrong');
      return error;
    }
  };

  return (
    <>
      <Loader
        loading={loading}
        text="You are being redirected to digital signature screen"
      />
      <View style={{marginTop: 8}}>
        {!signSuccess ? (
          <>
            <Heading
              style={{
                color: theme.colors.text,
                fontFamily: theme.fonts.regular,
                ...theme.fontSizes.heading5,
                fontWeight: theme.fontWeights.veryBold,
              }}>
              Loan Agreement
            </Heading>
            <View style={{paddingTop: 24}}>
              <Body style={{...theme.fontSizes.large}}>
                Thank you for your interest in the loan. As a next step, you
                will be taken to the Loan Agreement. Please go through the T&Cs.
                Should you like to proceed, you will be required to perform
                e-signature (Aadhar based) on the agreement. Do note that the
                mobile should be linked with Aadhar to do the e-signature.
              </Body>
            </View>
          </>
        ) : (
          <>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
              }}>
              <View style={{paddingTop: 63}}>
                <SignedSuccessIcon />
              </View>
              <View
                style={{
                  paddingTop: 46,
                  paddingHorizontal: 16,
                }}>
                <Heading
                  style={{
                    textAlign: 'center',
                    color: theme.colors.text,
                    fontSize: theme.fontSizes.heading6.fontSize,
                    lineHeight: 24.15,
                    fontWeight: theme.fontWeights.bold,
                  }}>
                  You have successfully signed the loan agreement
                </Heading>
              </View>
            </View>
          </>
        )}
        <View style={{paddingTop: !signSuccess ? 36 : 63, paddingBottom: 24}}>
          <BaseButton
            onPress={() => {
              if (!signSuccess) {
                createLoanAgreement();
              } else {
                setStep(currentStep + 1);
              }
            }}>
            Continue To Next Step
          </BaseButton>
        </View>
      </View>
    </>
  );
};

export default LoanAgreement;

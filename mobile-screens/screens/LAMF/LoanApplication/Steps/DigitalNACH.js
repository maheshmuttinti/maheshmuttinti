/* eslint-disable react-native/no-inline-styles */
import {NBFCIcon} from 'assets';
import * as React from 'react';
import {useState, useCallback} from 'react';
import {Platform, View} from 'react-native';
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
import Config from 'react-native-config';
import {formatDate, openBrowser, placeholderDecider, prettifyJSON} from 'utils';
import {useFocusEffect} from '@react-navigation/native';
import {WarningCard} from '../components/WarningCard';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

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
  const [errorMessage, setErrorMessage] = useState(null);
  const [initLoading, setInitLoading] = useState(true);

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
        setInitLoading(true);
        setEMIDueDate(
          applicationData?.loan_application_data?.emi_scheme
            ?.split('_')
            .join(' '),
        );
        if (
          applicationData?.loan_application_data?.digital_nach_id &&
          applicationData?.loan_application_data?.digital_nach_status
        ) {
          await getNachDetails();
        }

        const ifscCode =
          applicationData?.loan_application_data?.bank_verification_info
            ?.bankTransfer?.beneIFSC;
        if (!ifscCode) {
          setInitLoading(false);
          return;
        } else {
          const bankDetailsResponse = await getBankDetailsByIFSC(ifscCode);
          setBankDetails(bankDetailsResponse);
          const allCloudLMSLoan = await getLMSLoanById(applicationId);
          setEMI(allCloudLMSLoan?.EMI);
          setInitLoading(false);
        }
      })();
    }, [applicationData, applicationId]),
  );

  const getLoanApplicationData = async () => {
    try {
      const application = await getLoanApplicationById(applicationId);
      setApplicationData(application);
      setFirstEMIDate(application?.loan_application_data?.first_emi_date);
    } catch (error) {
      setErrorMessage('Something Went Wrong!');
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
      setErrorMessage(null);
      setLoading(true);
      if (Config.LOAN_APPLICATION_MOCK_TEST === true) {
        navigation.navigate('Protected', {screen: 'LoanSuccess'});
      } else {
        console.log(
          'applicationData: ',
          applicationData?.loan_application_data?.bank_details,
        );
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
          bank_account_name: bankDetails?.BANK, // Todo: Bank Account Name get from Razor Pay API
        };
        console.log('payload for eMandateGeneration', prettifyJSON(payload));
        const response = await eMandateGeneration(payload);
        console.log('response of e-mandate api', prettifyJSON(response));
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

          setLoading(false);
        } else {
          if (response?.message) {
            setLoading(false);
            setErrorMessage(response?.message);
          } else {
            setLoading(false);
            setErrorMessage('Something Went Wrong!');
          }
        }
      }
    } catch (error) {
      console.log('error while generating the mandate', error);
      setErrorMessage('Something went wrong');
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

      setErrorMessage('Data is saved to All Cloud successfully');
      console.log(
        'all cloud lms api calls after_loan_agreement response',
        prettifyJSON(allCloudLMSAPIsResponse),
      );

      return true;
    } catch (error) {
      console.log('all cloud api failed', error);
      setErrorMessage('Something went wrong, All Cloud APIs are failed');
      return false;
    }
  };

  const getNachDetails = async () => {
    try {
      setErrorMessage(null);
      if (applicationData?.loan_application_data?.digital_nach_id) {
        setDigitalNACHStatusChecking(false);
        return;
      }

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
        setErrorMessage('NACH Failed, Please try again!');
      }
    } catch (err) {
      setErrorMessage('Something Went Wrong');
      console.log('error', err);
      return err;
    }
  };
  return (
    <View style={{flex: 1}}>
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
        {digitalNACHStatusChecking === true && (
          <View style={{marginTop: 16}}>
            <WarningCard
              message={
                'Please Wait, Checking the NACH Mandate Registration Status...'
              }
            />
          </View>
        )}
        {errorMessage && (
          <View style={{marginTop: 16}}>
            <WarningCard message={errorMessage} />
          </View>
        )}
        <View style={{paddingTop: 32}}>
          {initLoading === true ? (
            new Array(1)
              ?.fill(0)
              ?.map((_, index) => (
                <SkeletonListCard
                  containerStyle={{right: 24, width: '115%'}}
                  key={`skeleton-nach-${index}`}
                />
              ))
          ) : (
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
                      {placeholderDecider(
                        bankDetails?.BANK ? `${bankDetails?.BANK}` : null,
                      )}
                    </Heading>
                    <Heading
                      style={{
                        ...theme.fontSizes.medium,
                        fontWeight: theme.fontWeights.semiBold,
                      }}>
                      {placeholderDecider(
                        applicationData?.loan_application_data?.bank_details
                          ?.bank_account_number
                          ? `${applicationData?.loan_application_data?.bank_details?.bank_account_number}`
                          : null,
                      )}
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
                    value={placeholderDecider(EMI ? `₹${EMI}` : null)}
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
                    title="EMI due date"
                    value={placeholderDecider(EMIDueDate)}
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
                    value={placeholderDecider(
                      firstEMIDate
                        ? formatDate(new Date(firstEMIDate), 'dMy', Platform.OS)
                        : null,
                    )}
                  />
                </View>
              </View>
            </Card>
          )}
        </View>
        <View style={{paddingTop: initLoading ? 112 : 24, paddingBottom: 60}}>
          <BaseButton
            onPress={async () => {
              await generateMandate();
            }}
            disable={initLoading || loading}
            gradientColors={[
              theme.colors.primaryOrange800,
              theme.colors.primaryOrange,
            ]}
            textStyles={loading && {fontSize: 12}}>
            {loading
              ? 'Please Wait, You are being redirecting to the NACH Mandate Process...'
              : 'Create Mandate'}
          </BaseButton>
        </View>
      </View>
    </View>
  );
}

const SkeletonListCard = ({containerStyle = {}}) => {
  return (
    <SkeletonContent
      containerStyle={{
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 16,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 116,
        ...containerStyle,
      }}
      isLoading={true}
      animationType={'shiver'}
      boneColor={'#fdfdfd'}
      layout={[
        ...Object.values(
          card(
            1,
            {x: 24, y: 0, absolutePercentage: {x: 0, y: 19.5}},
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
    key: `border_box_${key}`,
    height: 208,
    width: '92%',
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
    key: `small_circle_${key}`,
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
    key: `very_small_bar_${key}`,
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
    key: `large_bar_${key}`,
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
});

/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useState, useCallback} from 'react';
import ScreenWrapper from '../../hocs/screen_wrapper';
import {useTheme} from 'theme';
import {Heading, Card, LabelValue, BaseButton} from 'uin';
import {ScrollView, View, Text, Pressable} from 'react-native';
import {BackArrow, InfoIcon} from 'assets';
import {
  getBankDetailsByIFSC,
  getLoanApplicationById,
  revokeLienMarkingForLoanApplication,
} from 'services';
import {useFocusEffect} from '@react-navigation/native';
import {prettifyJSON} from 'utils';
import Config from 'react-native-config';

export default function ({route, navigation}) {
  const theme = useTheme();
  const {loanId} = route.params;
  const [loanData, setLoanData] = useState({});
  const [bankDetails, setBankDetails] = useState({});
  const [ifsc, setIfsc] = useState('');

  const headingStyles = {
    color: theme.colors.primaryBlue,
    fontWeight: theme.fontWeights.veryBold,
    ...theme.fontSizes.large,
    paddingBottom: 8,
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          hitSlop={{top: 30, left: 30, right: 30, bottom: 30}}
          onPress={() => {
            navigation.canGoBack() && navigation.pop();
          }}
          style={{width: 50, marginLeft: 16}}>
          <BackArrow />
        </Pressable>
      ),
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await getLoanDetails();
        if (loanData?.loan_application_data?.bank_verification_info) {
          const ifscCode =
            loanData?.loan_application_data?.bank_verification_info
              ?.bankTransfer?.beneIFSC;
          const data = await getBankDetailsByIFSC(ifscCode);
          setBankDetails(data);
        }
      })();
    }, [loanId, ifsc]),
  );

  const getLoanDetails = async () => {
    try {
      const data = await getLoanApplicationById(loanId);
      console.log('data of loan application', prettifyJSON(data));
      setLoanData(data);
      setIfsc(
        data?.loan_application_data?.bank_verification_info?.bankTransfer
          ?.beneIFSC,
      );
    } catch (error) {
      console.log('error while getting the loan application', error);
      return error;
    }
  };

  const handleRevocation = async loanUuid => {
    try {
      console.log('handleRevocation-11', loanUuid);
      const revocationResponse = await revokeLienMarkingForLoanApplication(
        loanUuid,
      );

      console.log('revocationResponse-112233', revocationResponse);
    } catch (error) {
      console.log('handleRevocation-error', error);
      throw error;
    }
  };

  const navigateStep = step => {
    switch (step) {
      case 'pending':
        return 1;
      case 'basic_details':
        return 2;
      case 'upload_proof':
        return 3;
      case 'video_verification':
        return 4;
      case 'bank_verification':
        return 5;
      case 'loan_agreement':
        return 6;
      case 'completed':
        return 6;
      default:
        return 1;
    }
  };

  const labelValueStyles = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  };
  const titleStyles = {
    ...theme.fontSizes.largeMedium,
    fontWeight: theme.fontWeights.lightBold,
    color: theme.colors.text,
    flex: 1 / 2,
  };
  const valueStyles = {
    ...theme.fontSizes.largeMedium,
    fontWeight: theme.fontWeights.moreBold,
    color: theme.colors.text,
    flex: 1 / 2,
    textAlign: 'right',
  };
  return (
    <ScreenWrapper scrollView={false} footer={true}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom:
            loanData?.loan_application_step === 'completed' ? 0 : 95,
        }}>
        <ScrollView
          style={{
            paddingTop: 32,
          }}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}>
          <Card
            style={{
              backgroundColor: theme.colors.backgroundYellow,
              paddingHorizontal: 17,
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 16,
            }}>
            <View>
              <InfoIcon fill={theme.colors.error} />
            </View>
            <Heading
              style={{
                ...theme.fontSizes.small,
                fontFamily: theme.fonts.regular,
                color: theme.colors.text,
                paddingLeft: 17.25,
                marginRight: 17,
              }}>
              Please complete your loan application in{' '}
              <Text style={{color: theme.colors.error}}>10 days</Text>.
              Processing fee is to be paid if you fail to do so.
            </Heading>
          </Card>
          <View style={{paddingHorizontal: 8}}>
            <View style={{paddingTop: 24}}>
              <Heading
                style={{
                  ...headingStyles,
                }}>
                LOAN DETAILS
              </Heading>

              {Config.MOCK_ENVIRONMENT === 'STAGING' && (
                <Pressable
                  style={{
                    marginVertical: 10,
                    padding: 4,
                    backgroundColor: 'red',
                  }}
                  onPress={() => handleRevocation(loanData.uuid)}>
                  <Text style={{color: 'white', fontSize: 16}}>
                    {loanData?.lien_marking_status === 'success'
                      ? 'Test: Click to Revoke Lien units'
                      : 'REVOKED'}
                  </Text>
                </Pressable>
              )}

              <LabelValue
                title="Status"
                value="Documents being verified"
                titleStyle={{...titleStyles}}
                valueStyle={{
                  ...theme.fontSizes.largeMedium,
                  color: theme.colors.primaryOrange,
                  fontFamily: theme.fonts.italic,
                  fontWeight: theme.fontWeights.semiBold,
                  flex: 1 / 2,
                  textAlign: 'right',
                }}
                style={{
                  ...labelValueStyles,
                }}
              />

              <LabelValue
                title="Pan Card"
                value={loanData?.pan}
                titleStyle={{...titleStyles}}
                valueStyle={{...valueStyles}}
                style={{
                  ...labelValueStyles,
                }}
              />
              <LabelValue
                title="Name"
                value={loanData?.loan_application_data?.name}
                titleStyle={{...titleStyles}}
                valueStyle={{...valueStyles}}
                style={{
                  ...labelValueStyles,
                }}
              />
              <LabelValue
                title="Amount"
                value={`Rs. ${parseInt(
                  loanData?.loan_application_data?.loan_details.amount,
                  10,
                )}`}
                titleStyle={{...titleStyles}}
                valueStyle={{...valueStyles}}
                style={{
                  ...labelValueStyles,
                }}
              />
              <LabelValue
                title="ROI"
                value={`${loanData.nbfc_data?.roi}%`}
                titleStyle={{...titleStyles}}
                valueStyle={{...valueStyles}}
                style={{
                  ...labelValueStyles,
                }}
              />
              <LabelValue
                title="Tenure"
                value="36 Months"
                titleStyle={{...titleStyles}}
                valueStyle={{...valueStyles}}
                style={{
                  ...labelValueStyles,
                }}
              />
              <LabelValue
                title="EMI"
                value="Rs. 10,000"
                titleStyle={{...titleStyles}}
                valueStyle={{...valueStyles}}
                style={{
                  ...labelValueStyles,
                }}
              />
              <LabelValue
                title="1st EMI"
                value="14/06/2022"
                titleStyle={{...titleStyles}}
                valueStyle={{...valueStyles}}
                style={{
                  ...labelValueStyles,
                }}
              />
            </View>
            <View style={{paddingTop: 24, paddingBottom: 24}}>
              <Heading
                style={{
                  ...headingStyles,
                }}>
                BASIC DETAILS
              </Heading>
              <LabelValue
                title="Name"
                value={loanData?.loan_application_data?.name}
                titleStyle={{...titleStyles}}
                valueStyle={{...valueStyles}}
                style={{
                  ...labelValueStyles,
                }}
              />
              <LabelValue
                title="Father’s Name"
                value={loanData?.loan_application_data?.fathers_name}
                titleStyle={{...titleStyles}}
                valueStyle={{...valueStyles}}
                style={{
                  ...labelValueStyles,
                }}
              />
              <LabelValue
                title="DOB"
                value={loanData?.loan_application_data?.dob}
                titleStyle={{...titleStyles}}
                valueStyle={{...valueStyles}}
                style={{
                  ...labelValueStyles,
                }}
              />
              <LabelValue
                title="Gender"
                value={loanData?.loan_application_data?.gender?.label}
                titleStyle={{...titleStyles}}
                valueStyle={{...valueStyles}}
                style={{
                  ...labelValueStyles,
                }}
              />
              <LabelValue
                title="Address 1"
                value={loanData?.loan_application_data?.address}
                titleStyle={{...titleStyles}}
                valueStyle={{...valueStyles}}
                style={{
                  ...labelValueStyles,
                }}
              />
              <LabelValue
                title="Address 2"
                value={loanData?.loan_application_data?.address_line1}
                titleStyle={{...titleStyles}}
                valueStyle={{...valueStyles}}
                style={{
                  ...labelValueStyles,
                }}
              />
              <LabelValue
                title="State"
                value={loanData?.loan_application_data?.state?.label}
                titleStyle={{...titleStyles}}
                valueStyle={{...valueStyles}}
                style={{
                  ...labelValueStyles,
                }}
              />
              <LabelValue
                title="City"
                value={loanData?.loan_application_data?.city?.label}
                titleStyle={{...titleStyles}}
                valueStyle={{...valueStyles}}
                style={{
                  ...labelValueStyles,
                }}
              />
              <LabelValue
                title="Pincode"
                value={loanData?.loan_application_data?.pin}
                titleStyle={{...titleStyles}}
                valueStyle={{...valueStyles}}
                style={{
                  ...labelValueStyles,
                }}
              />
            </View>
            {loanData?.loan_application_data?.bank_verification_info && (
              <View style={{paddingTop: 24, paddingBottom: 95}}>
                <Heading
                  style={{
                    ...headingStyles,
                  }}>
                  BANK DETAILS
                </Heading>
                <LabelValue
                  title="IFSC code"
                  value={
                    loanData?.loan_application_data?.bank_verification_info
                      ?.bankTransfer?.beneIFSC
                  }
                  titleStyle={{...titleStyles}}
                  valueStyle={{...valueStyles}}
                  style={{
                    ...labelValueStyles,
                  }}
                />
                <LabelValue
                  title="Bank Name"
                  value={bankDetails.BANK}
                  titleStyle={{...titleStyles}}
                  valueStyle={{...valueStyles}}
                  style={{
                    ...labelValueStyles,
                  }}
                />
                <LabelValue
                  title="Bank Branch"
                  value={bankDetails.BRANCH}
                  titleStyle={{...titleStyles}}
                  valueStyle={{...valueStyles}}
                  style={{
                    ...labelValueStyles,
                  }}
                />
                <LabelValue
                  title="Bank Account No"
                  value={
                    loanData.loan_application_data?.bank_details
                      ?.bank_account_number
                  }
                  titleStyle={{...titleStyles}}
                  valueStyle={{...valueStyles}}
                  style={{
                    ...labelValueStyles,
                  }}
                />
                <LabelValue
                  title="Name on Bank Account"
                  value={
                    loanData?.loan_application_data?.bank_verification_info
                      ?.bankTransfer?.beneName
                  }
                  titleStyle={{...titleStyles}}
                  valueStyle={{...valueStyles}}
                  style={{
                    ...labelValueStyles,
                  }}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {loanData?.loan_application_step !== 'completed' && (
        <View
          style={{
            width: '100%',
            position: 'absolute',
            bottom: 0,
            paddingTop: 26,
            paddingBottom: 24,
            paddingHorizontal: 24,
            backgroundColor: theme.colors.background,
          }}>
          <BaseButton
            onPress={() => {
              navigation.navigate('NextSteps', {
                applicationId: loanData?.uuid,
                step: navigateStep(loanData?.loan_application_step),
              });
            }}>
            Complete Application
          </BaseButton>
        </View>
      )}
    </ScreenWrapper>
  );
}

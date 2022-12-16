/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {useTheme} from 'theme';
import {BaseButton, BaseTextInput, Card, Heading} from 'uin';
import useBetaForm from '@reusejs/react-form-hook';
import {
  bankVerification,
  callLMSAPIs,
  getBankDetailsByIFSC,
  getLoanApplicationById,
  updateApplication,
} from 'services';
import {InfoIcon} from 'assets';
import isEmpty from 'lodash/isEmpty';
import TickCircle from 'assets/icons/tickCircle';
import {prettifyJSON} from 'utils';
import {WarningCard} from '../components/WarningCard';
import Toast from 'react-native-toast-message';

const BankDetails = ({applicationId, currentStep, setStep}) => {
  const theme = useTheme();
  const form = useBetaForm({
    ifsc: '',
    bank_account_number: '',
    confirm_account_number: '',
    name: '',
  });
  const [ifsc, setIfsc] = useState('');
  const [bankDetails, setBankDetails] = useState({});
  const [applicationData, setApplicationData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFetchingBranchName, setIsFetchingBranchName] = useState(false);
  const [bankValidationError, setBankValidationError] = useState(null);
  const [isFieldsEmpty, setFieldsEmpty] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);

  const prefillData = () => {
    if (applicationData?.loan_application_data?.bank_details) {
      const details = applicationData?.loan_application_data?.bank_details;
      form.setField('name', details.name);
      form.setField('ifsc', details.ifsc);
      setIfsc(details.ifsc);
      form.setField('bank_account_number', details.bank_account_number);
      form.setField('confirm_account_number', details.confirm_account_number);
    }
  };

  useEffect(() => {
    prefillData();
  }, [applicationData]);

  useEffect(() => {
    form.setValidationRules({
      ifsc: {
        presence: {
          allowEmpty: false,
          message: '^Please Enter your Bank IFSC Code',
        },
      },
      bank_account_number: {
        presence: {
          allowEmpty: false,
          message: '^Please Enter your Bank Account Number',
        },
      },
      confirm_account_number: {
        presence: {
          allowEmpty: false,
          message: '^Account numbers you entered are not matching',
        },
        equality: {
          attribute: 'bank_account_number',
          message: '^Account numbers you entered are not matching',
          comparator: function (v1, v2) {
            return v1 === v2;
          },
        },
      },
      name: {
        presence: {
          allowEmpty: false,
          message: '^Please Enter Name',
        },
      },
    });
  }, []);

  useEffect(() => {
    setBankValidationError(null);
    form.validate();
  }, [
    form.value.ifsc,
    form.value.bank_account_number,
    form.value.confirm_account_number,
    form.value.name,
  ]);

  useEffect(() => {
    if (
      !isEmpty(form.value.ifsc) &&
      !isEmpty(form.value.bank_account_number) &&
      !isEmpty(form.value.confirm_account_number) &&
      !isEmpty(form.value.name) &&
      form.value.bank_account_number === form.value.confirm_account_number
    ) {
      setFieldsEmpty(false);
    }
  }, [
    form.value.ifsc,
    form.value.bank_account_number,
    form.value.confirm_account_number,
    form.value.name,
  ]);

  useEffect(() => {
    (async () => {
      await getLoanApplicationData();
    })();
  }, []);

  const handleFetchBranchName = async _ifsc => {
    try {
      const data = await getBankDetailsByIFSC(_ifsc);
      if (data) {
        setBankDetails(data);
      } else {
        setBankDetails({});
      }
    } catch (error) {
      setIsFetchingBranchName(false);
      if (error === 'not matched') {
        setBankDetails({});
      }
    }
  };

  useEffect(() => {
    if (ifsc !== '') {
      const debounceTimer = setTimeout(() => {
        (async () => {
          setIsFetchingBranchName(true);
          await handleFetchBranchName(ifsc);
          setIsFetchingBranchName(false);
        })();
      }, 200);
      return () => clearTimeout(debounceTimer);
    }
  }, [ifsc]);

  const getLoanApplicationData = async () => {
    const application = await getLoanApplicationById(applicationId);
    console.log('application: ', JSON.stringify(application, null, 2));
    setApplicationData(application);
  };

  const makeIfscCapital = async () => {
    if (!isEmpty(form.value.ifsc)) {
      form.setField('ifsc', form.value.ifsc.toUpperCase());
    }
  };

  const handleCallLMSAPIs = async () => {
    try {
      const allCloudLMSAPIsResponse = await callLMSAPIs(
        applicationId,
        'before_loan_agreement',
      );

      console.log(
        'all cloud lms api calls before_loan_agreement response',
        prettifyJSON(allCloudLMSAPIsResponse),
      );
      return allCloudLMSAPIsResponse;
    } catch (error) {
      setBankValidationError('Something Wrong, Please try again.');
      console.log('error', error);
      return error;
    }
  };

  const handleSubmit = async () => {
    try {
      if (applicationData?.loan_application_step === 'bank_verification') {
        await handleCallLMSAPIs();
        setStep(currentStep + 1);
        return;
      }
      setBankValidationError(null);
      const payload = {
        task: 'bankTransfer',
        essentials: {
          beneficiaryAccount: form.value.bank_account_number,
          beneficiaryIFSC: form.value.ifsc,
          beneficiaryName: form.value.name,
          nameFuzzy: true,
        },
        ifsc: form.value.ifsc,
        bank_account_number: form.value.bank_account_number,
        confirm_account_number: form.value.confirm_account_number,
        name: form.value.name,
      };

      setLoading(true);
      const response = await bankVerification(payload);
      if (response?.result?.nameMatch === 'yes') {
        const loanData = {
          ...applicationData?.loan_application_data,
          bank_verified: 'success',
          bank_verification_info: response.result,
          bank_details: form.value,
        };
        const loanPayload = {
          loan_application_data: loanData,
          loan_application_step: applicationData?.loan_application_step,
        };
        loanPayload.loan_application_step = 'bank_verification';

        await updateApplication(applicationId, loanPayload);
        setSuccessMessage('Bank Details verified successfully.');
        Toast.show({
          type: 'bankDetailsSuccessToast',
          position: 'bottom',
          visibilityTime: 2000,
        });
        await handleCallLMSAPIs();

        setStep(currentStep + 1);
        setLoading(false);
      } else {
        setLoading(false);
        setBankValidationError("Name on bank doesn't match");
      }
    } catch (error) {
      setLoading(false);
      form.setErrors(error);
      return error;
    }
  };

  const toastConfig = {
    bankDetailsSuccessToast: () =>
      successMessage && (
        <Card
          style={{
            backgroundColor: 'rgba(0, 255, 0, 0.5)',
            paddingLeft: 17.25,
            marginHorizontal: 17,
            position: 'absolute',
            bottom: 100,
            borderRadius: 8,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View>
            <InfoIcon fill={theme.colors.success} />
          </View>
          <Text
            style={{
              ...theme.fontSizes.small,
              fontWeight: theme.fontWeights.moreBold,
              color: theme.colors.text,
              fontFamily: theme.fonts.regular,
              paddingLeft: 17.25,
              marginRight: 52,
            }}>
            {successMessage}
          </Text>
        </Card>
      ),
  };
  return (
    <>
      <View style={{paddingTop: 8, flex: 1}}>
        <Heading
          style={{
            color: theme.colors.text,
            fontFamily: theme.fonts.regular,
            ...theme.fontSizes.heading5,
            fontWeight: theme.fontWeights.veryBold,
          }}>
          Bank Details
        </Heading>
        {bankValidationError && (
          <View style={{paddingTop: 16}}>
            <WarningCard message={bankValidationError} />
          </View>
        )}
        <View style={{paddingTop: 24}}>
          <BaseTextInput
            placeholder="Enter IFSC CODE"
            label="IFSC CODE"
            onChangeText={async v => {
              form.setField('ifsc', v);
              setIfsc(v);
            }}
            labelStyles={{
              color: theme.colors.primaryBlue,
              ...theme.fontSizes.small,
            }}
            value={form.getField('ifsc')}
            error={form.errors.get('ifsc')}
            autoCapitalize={'characters'}
          />
        </View>
        {isFetchingBranchName ? (
          <>
            <Heading
              style={{
                color: theme.colors.text,
                fontFamily: theme.fonts.bold,
                paddingLeft: 4,
                paddingTop: 12,
                ...theme.fontSizes.medium,
              }}>
              Loading Branch Name...
            </Heading>
          </>
        ) : (
          bankDetails?.BANKCODE && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 12,
              }}>
              <TickCircle />
              <Heading
                style={{
                  color: theme.colors.text,
                  fontFamily: theme.fonts.bold,
                  paddingLeft: 4,
                  ...theme.fontSizes.medium,
                }}>{`${bankDetails?.BANK}, ${bankDetails?.BRANCH}`}</Heading>
            </View>
          )
        )}
        <View style={{paddingTop: 16}}>
          <Card
            style={{
              backgroundColor: theme.colors.primaryBlue100,
              paddingLeft: 10.25,
              paddingVertical: 12,
              paddingRight: 9,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <InfoIcon fill={theme.colors.primary} />
            <Heading
              style={{
                ...theme.fontSizes.small,
                fontWeight: theme.fontWeights.moreBold,
                color: theme.colors.primary,
                paddingLeft: 17.25,
                marginRight: 18,
              }}>
              Please check if the bank details are correct. Else re-enter the
              IFSC code
            </Heading>
          </Card>
        </View>
        <View style={{paddingTop: 16}}>
          <BaseTextInput
            keyboardType="numeric"
            placeholder="Enter your account number"
            label="BANK ACCOUNT NUMBER"
            onChangeText={v => {
              form.setField('bank_account_number', v.trim());
            }}
            labelStyles={{
              color: theme.colors.primaryBlue,
              ...theme.fontSizes.small,
            }}
            value={form.getField('bank_account_number')}
            error={form.errors.get('bank_account_number')}
          />
        </View>
        <View style={{paddingTop: 16}}>
          <BaseTextInput
            keyboardType="numeric"
            placeholder="Re-enter your account number"
            label="CONFIRM ACCOUNT NUMBER"
            onChangeText={v => {
              form.setField('confirm_account_number', v.trim());
            }}
            labelStyles={{
              color: theme.colors.primaryBlue,
              ...theme.fontSizes.small,
            }}
            value={form.getField('confirm_account_number')}
            error={form.errors.get('confirm_account_number')}
          />
        </View>
        <View style={{paddingTop: 16}}>
          <BaseTextInput
            placeholder="Enter Name"
            label="NAME ON BANK ACCOUNT"
            onChangeText={v => {
              form.setField('name', v);
            }}
            labelStyles={{
              color: theme.colors.primaryBlue,
              ...theme.fontSizes.small,
            }}
            value={form.getField('name')}
            error={form.errors.get('name')}
          />
        </View>

        <View style={{paddingTop: 32, paddingBottom: 24}}>
          <BaseButton
            onPress={async () => {
              await handleSubmit();
            }}
            disable={isFieldsEmpty || loading}>
            {loading
              ? 'Please Wait, Validating the data...'
              : 'Continue To Next Step'}
          </BaseButton>
        </View>
      </View>
      <Toast config={toastConfig} />
    </>
  );
};

export default BankDetails;

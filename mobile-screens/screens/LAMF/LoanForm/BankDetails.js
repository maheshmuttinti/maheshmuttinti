/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
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
import {prettifyJSON, showToast} from 'utils';
import Loader from '../../../reusables/loader';

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

  useEffect(() => {
    form.setValidationRules({
      ifsc: {
        presence: {message: '^Please enter your bank ifsc code!'},
        // format: {
        //   pattern: /^[A-Za-z]{4}[a-zA-Z0-9]{6}$/,
        //   message: '^Please enter a valid ifsc Code',
        // },
      },
      bank_account_number: {
        presence: {
          allowEmpty: false,
          message: '^Please enter your bank account number',
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
          allowEmpty: true,
          message: '^Please enter name',
        },
      },
    });
  }, []);

  useEffect(() => {
    prefillData();
  }, [applicationData]);

  const prefillData = () => {
    if (
      applicationData?.loan_application_data &&
      applicationData?.loan_application_data?.bank_details
    ) {
      const details = applicationData?.loan_application_data?.bank_details;
      form.setField('name', details.name);
      form.setField('ifsc', details.ifsc);
      setIfsc(details.ifsc);
      form.setField('bank_account_number', details.bank_account_number);
      form.setField('confirm_account_number', details.confirm_account_number);
    }
  };

  useEffect(() => {
    if (!isEmpty(form.value.confirm_account_number)) {
      form.validate();
    }
  }, [form.value.confirm_account_number, form.value.bank_account_number]);

  useEffect(() => {
    (async () => {
      await getLoanApplicationData();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (ifsc.length > 0) {
          const data = await getBankDetailsByIFSC(ifsc);
          if (data) {
            setBankDetails(data);
          } else {
            setBankDetails({});
          }
        }
      } catch (error) {
        if (error === 'not matched') {
          setBankDetails({});
        }
      }
    })();
  }, [ifsc]);

  const getLoanApplicationData = async () => {
    const application = await getLoanApplicationById(applicationId);
    setApplicationData(application);
  };

  const makeIfscCapital = async () => {
    if (!isEmpty(form.value.ifsc)) {
      form.setField('ifsc', form.value.ifsc.toUpperCase());
    }
  };

  const verifyBank = async () => {
    try {
      if (
        form.value.bank_account_number.length > 0 &&
        form.value.ifsc.length > 0 &&
        form.value.name.length > 0
      ) {
        const payload = {
          task: 'bankTransfer',
          essentials: {
            beneficiaryAccount: form.value.bank_account_number,
            beneficiaryIFSC: form.value.ifsc,
            beneficiaryName: form.value.name,
            nameFuzzy: true,
          },
        };

        setLoading('verifying_bank');
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
          showToast('Bank account verified');
          setLoading('saving_data_to_all_cloud');
          const allCloudLMSAPIsResponse = await callLMSAPIs(
            applicationId,
            'before_loan_agreement',
          );
          setLoading(false);
          showToast('Data is saved to All Cloud successfully');
          console.log(
            'all cloud lms api calls before_loan_agreement response',
            prettifyJSON(allCloudLMSAPIsResponse),
          );
          setStep(currentStep + 1);
        } else {
          setLoading(false);
          showToast("Name on bank doesn't match");
        }
      } else {
        setLoading(false);

        showToast('Please Enter details');
      }
    } catch (error) {
      setLoading(false);

      console.log(
        'error in bank details submit - which include all cloud lms api',
        error,
        prettifyJSON(error?.response?.data),
        prettifyJSON(error?.response?.data?.message),
      );
      showToast(error?.response?.data?.message);
      return error;
    }
  };
  return (
    <View style={{paddingTop: 8}}>
      <Loader
        loading={
          loading === 'verifying_bank' || loading === 'saving_data_to_all_cloud'
        }
        text={
          loading === 'saving_data_to_all_cloud'
            ? 'Processing your Data..'
            : loading === 'verifying_bank'
            ? 'Bank Account is Verifying..'
            : ''
        }
      />
      <Heading
        style={{
          color: theme.colors.text,
          fontFamily: theme.fonts.regular,
          ...theme.fontSizes.heading5,
          fontWeight: theme.fontWeights.veryBold,
        }}>
        Bank Details
      </Heading>
      <View style={{paddingTop: 24}}>
        <BaseTextInput
          placeholder="Enter ifsc code"
          label="IFSC CODE"
          onChangeText={v => {
            form.setField('ifsc', v.trim().toUpperCase());
            setIfsc(v);
            form.validateSingleField(form.value.ifsc, 'ifsc');
          }}
          labelStyles={{
            color: theme.colors.primaryBlue,
            ...theme.fontSizes.small,
          }}
          value={form.getField('ifsc')}
          error={form.errors.get('ifsc')}
          onFieldBlur={() => makeIfscCapital()}
        />
      </View>
      {bankDetails.BANKCODE && (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TickCircle />
          <Heading
            style={{
              color: theme.colors.text,
              fontFamily: theme.fonts.bold,
              ...theme.fontSizes.medium,
            }}>{` ${bankDetails.BANK}, ${bankDetails.BRANCH}`}</Heading>
        </View>
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
            Please check if the bank details are correct. Else re-enter the IFSC
            code
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
          onPress={() => {
            verifyBank();
          }}>
          Continue To Next Step
        </BaseButton>
      </View>
    </View>
  );
};

export default BankDetails;

/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Platform, Text, View} from 'react-native';
import {useTheme} from 'theme';
import {Heading, BaseTextInput, BaseButton, Select, RadioInput} from 'uin';
import useBetaForm from '@reusejs/react-form-hook';
import {
  getCitiesOfState,
  getLoanApplicationById,
  getStateByCountryCode,
  updateApplication,
} from 'services';
import useFetchUser from '../../../../reusables/useFetchUser';

export default function ({
  currentStep,
  setStep,
  applicationId,
  submittedBasicDetails,
  setSubmittedBasicDetails,
}) {
  const theme = useTheme();
  const {user: userResponse} = useFetchUser();

  const [data, setData] = useState({});
  const [stateCode, setStateCode] = useState('');
  const [pushToBottom, setPushToBottom] = useState(false);

  const form = useBetaForm({
    name: '',
    fathers_name: '',
    dob: '',
    gender: '',
    mobile: '',
    address: '',
    address_line2: '',
    state: '',
    city: '',
    pin: '',
    aadhar_number: '',
  });

  useEffect(() => {
    form.setField(
      'mobile',
      userResponse?.attributes
        ?.find(item => item.type === 'mobile_number')
        ?.value.slice(3, 13),
    );
  }, [userResponse]);

  useEffect(() => {
    (async () => {
      await getLoanApplicationStatus();
    })();
  }, []);

  useEffect(() => {
    prefillData();
  }, [data]);

  const prefillData = () => {
    if (
      data?.loan_application_data &&
      data?.loan_application_step !== 'pending'
    ) {
      const details = data?.loan_application_data;

      form.setField('name', details.name);
      form.setField('fathers_name', details.fathers_name);
      form.setField('dob', details.dob);
      form.setField('gender', details.gender);
      form.setField('mobile', details.mobile);
      form.setField('address', details.address);
      form.setField('address_line2', details.address_line2);
      form.setField('state', details.state);
      form.setField('city', details.city);
      form.setField('pin', details.pin);
      form.setField('aadhar_number', details.aadhar_number);
    }
  };

  const getLoanApplicationStatus = async () => {
    const application = await getLoanApplicationById(applicationId);
    setData(application);
  };

  const submitBasicDetails = async () => {
    try {
      const appicationData = {...data?.loan_application_data, ...form.value};
      const payload = {
        loan_application_data: appicationData,
        loan_application_step: data?.loan_application_step,
      };
      payload.loan_application_step = 'basic_details';
      await updateApplication(applicationId, payload);
      setStep(currentStep + 1);
    } catch (errors) {
      console.log(errors, 'errrr');
      form.setErrors(errors);
      form.finishProcessing();
    }
  };

  useEffect(() => {
    if (submittedBasicDetails) {
      submitBasicDetails();
      setSubmittedBasicDetails(!submittedBasicDetails);
    }
  }, [submittedBasicDetails]);

  return (
    <View style={{paddingTop: 8}}>
      <Heading
        style={{
          color: theme.colors.text,
          fontFamily: theme.fonts.regular,
          ...theme.fontSizes.heading5,
          fontWeight: theme.fontWeights.veryBold,
        }}>
        Basic Details
      </Heading>

      <View style={{paddingTop: 24}}>
        <BaseTextInput
          placeholder="Enter Full Name"
          label="NAME"
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

      <View style={{paddingTop: 16}}>
        <BaseTextInput
          placeholder="Enter Father's Name"
          label="FATHER'S NAME"
          onChangeText={v => {
            form.setField('fathers_name', v);
          }}
          labelStyles={{
            color: theme.colors.primaryBlue,
            ...theme.fontSizes.small,
          }}
          value={form.getField('fathers_name')}
          error={form.errors.get('fathers_name')}
        />
      </View>
      <View style={{paddingTop: 16}}>
        <BaseTextInput
          keyboardType="numeric"
          placeholder="Enter Aadhar Number"
          label="AADHAR NUMBER"
          onChangeText={v => {
            form.setField('aadhar_number', v);
          }}
          labelStyles={{
            color: theme.colors.primaryBlue,
            ...theme.fontSizes.small,
          }}
          value={form.getField('aadhar_number')}
          error={form.errors.get('aadhar_number')}
        />
      </View>
      <View style={{paddingTop: 16}}>
        <BaseTextInput
          placeholder="Enter DOB"
          label="DATE OF BIRTH"
          onChangeText={v => {
            form.setField('dob', v);
          }}
          labelStyles={{
            color: theme.colors.primaryBlue,
            ...theme.fontSizes.small,
          }}
          value={form.getField('dob')}
          error={form.errors.get('dob')}
          calendar={true}
        />
      </View>
      <View style={{paddingTop: 16, zIndex: 10}}>
        <Text
          style={{
            marginTop: 6,
            fontFamily: theme.fonts.regular,
            color: theme.colors.primaryBlue,
            marginBottom: 3,
            ...theme.fontSizes.small,
          }}>
          GENDER
        </Text>
        <RadioInput
          dataSource={() => {
            return [
              {label: 'Male', value: 'Male'},
              {label: 'Female', value: 'Female'},
              {label: 'Others', value: 'Others'},
            ];
          }}
          defaultSelected={form.value.gender ? [form.value.gender] : []}
          onChange={v => {
            form.setField('gender', v);
          }}
          multiple={false}
        />
      </View>

      <View style={{paddingTop: 5}}>
        <BaseTextInput
          editable={false}
          keyboardType="numeric"
          placeholder="Enter Phone Number"
          label="PHONE NUMBER"
          onChangeText={v => {
            form.setField('mobile', v);
          }}
          labelStyles={{
            color: theme.colors.primaryBlue,
            ...theme.fontSizes.small,
          }}
          value={form.getField('mobile')}
          error={form.errors.get('mobile')}
        />
      </View>
      <View style={{paddingTop: 16}}>
        <BaseTextInput
          placeholder="Street/ Locality/ Flat no"
          label="ADDRESS LINE 1"
          onChangeText={v => {
            form.setField('address', v);
          }}
          labelStyles={{
            color: theme.colors.primaryBlue,
            ...theme.fontSizes.small,
          }}
          value={form.getField('address')}
          error={form.errors.get('address')}
        />
      </View>
      <View style={{paddingTop: 16}}>
        <BaseTextInput
          placeholder="Landmark (Optional)"
          label="ADDRESS LINE 2"
          onChangeText={v => {
            form.setField('address_line2', v);
          }}
          labelStyles={{
            color: theme.colors.primaryBlue,
            ...theme.fontSizes.small,
          }}
          value={form.getField('address_line2')}
        />
      </View>

      <View
        style={
          Platform.OS === 'ios'
            ? {paddingTop: 16, zIndex: 11}
            : {paddingTop: 16}
        }>
        <Select
          dataSource={async q => await getStateByCountryCode('IN', q)}
          defaultSelected={form.value.state ? [form.value.state] : []}
          onChange={v => {
            form.setField('state', v);
            setStateCode(v.value);
            form.value.city = '';
          }}
          placeholder="Select State"
          label="STATE"
          labelStyles={{
            color: theme.colors.primaryBlue,
            ...theme.fontSizes.small,
          }}
          multiple={false}
          error={form.errors.get('state')}
        />
      </View>

      <View
        style={
          Platform.OS === 'ios'
            ? {paddingTop: 16, zIndex: 10}
            : {paddingTop: 16}
        }>
        <Select
          dataSource={async q => await getCitiesOfState('IN', stateCode, q)}
          defaultSelected={form.value.city ? [form.value.city] : []}
          onChange={v => {
            form.setField('city', v);
          }}
          onOpen={() => {
            setPushToBottom(true);
          }}
          onClose={() => {
            setPushToBottom(false);
          }}
          placeholder="Select City"
          label="CITY"
          labelStyles={{
            color: theme.colors.primaryBlue,
            ...theme.fontSizes.small,
          }}
          multiple={false}
          error={form.errors.get('city')}
        />
      </View>

      <View style={{marginTop: 16}}>
        <BaseTextInput
          keyboardType="numeric"
          placeholder="Enter Pincode"
          label="PIN CODE"
          onChangeText={v => {
            form.setField('pin', v);
          }}
          labelStyles={{
            color: theme.colors.primaryBlue,
            ...theme.fontSizes.small,
          }}
          value={form.getField('pin')}
          error={form.errors.get('pin')}
        />
      </View>
      <View
        style={{
          paddingTop: pushToBottom ? 150 : 41,
          paddingBottom: 22,
        }}>
        <BaseButton
          onPress={() => {
            submitBasicDetails();
          }}>
          Continue
        </BaseButton>
      </View>
    </View>
  );
}

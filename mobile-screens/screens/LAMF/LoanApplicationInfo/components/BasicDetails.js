/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Heading, LabelValue} from 'uin';
import {View} from 'react-native';
import {placeholderDecider} from 'utils';

export const BasicDetails = ({
  loanData,
  labelValueStyles,
  titleStyles,
  valueStyles,
  headingStyles,
}) => {
  return (
    <View style={{paddingTop: 24, paddingBottom: 24}}>
      <Heading
        style={{
          ...headingStyles,
        }}>
        BASIC DETAILS
      </Heading>
      <LabelValue
        title="Name"
        value={placeholderDecider(loanData?.loan_application_data?.name)}
        titleStyle={{...titleStyles}}
        valueStyle={{...valueStyles}}
        style={{
          ...labelValueStyles,
        }}
      />
      <LabelValue
        title="Father’s Name"
        value={placeholderDecider(
          loanData?.loan_application_data?.fathers_name,
        )}
        titleStyle={{...titleStyles}}
        valueStyle={{...valueStyles}}
        style={{
          ...labelValueStyles,
        }}
      />
      <LabelValue
        title="DOB"
        value={placeholderDecider(loanData?.loan_application_data?.dob)}
        titleStyle={{...titleStyles}}
        valueStyle={{...valueStyles}}
        style={{
          ...labelValueStyles,
        }}
      />
      <LabelValue
        title="Gender"
        value={placeholderDecider(
          loanData?.loan_application_data?.gender?.label,
        )}
        titleStyle={{...titleStyles}}
        valueStyle={{...valueStyles}}
        style={{
          ...labelValueStyles,
        }}
      />
      <LabelValue
        title="Address 1"
        value={placeholderDecider(loanData?.loan_application_data?.address)}
        titleStyle={{...titleStyles}}
        valueStyle={{...valueStyles}}
        style={{
          ...labelValueStyles,
        }}
      />
      <LabelValue
        title="Address 2"
        value={placeholderDecider(
          loanData?.loan_application_data?.address_line1,
        )}
        titleStyle={{...titleStyles}}
        valueStyle={{...valueStyles}}
        style={{
          ...labelValueStyles,
        }}
      />
      <LabelValue
        title="State"
        value={placeholderDecider(
          loanData?.loan_application_data?.state?.label,
        )}
        titleStyle={{...titleStyles}}
        valueStyle={{...valueStyles}}
        style={{
          ...labelValueStyles,
        }}
      />
      <LabelValue
        title="City"
        value={placeholderDecider(loanData?.loan_application_data?.city?.label)}
        titleStyle={{...titleStyles}}
        valueStyle={{...valueStyles}}
        style={{
          ...labelValueStyles,
        }}
      />
      <LabelValue
        title="Pincode"
        value={placeholderDecider(loanData?.loan_application_data?.pin)}
        titleStyle={{...titleStyles}}
        valueStyle={{...valueStyles}}
        style={{
          ...labelValueStyles,
        }}
      />
    </View>
  );
};

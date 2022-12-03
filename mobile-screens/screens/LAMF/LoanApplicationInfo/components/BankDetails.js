/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Heading, LabelValue} from 'uin';
import {View} from 'react-native';
import {placeholderDecider} from 'utils';

export const BankDetails = ({
  loanData,
  bankDetails,
  labelValueStyles,
  titleStyles,
  valueStyles,
  headingStyles,
}) => {
  return (
    <View style={{paddingTop: 24, paddingBottom: 95}}>
      <Heading
        style={{
          ...headingStyles,
        }}>
        BANK DETAILS
      </Heading>
      <LabelValue
        title="IFSC code"
        value={placeholderDecider(
          loanData?.loan_application_data?.bank_verification_info?.bankTransfer
            ?.beneIFSC,
        )}
        titleStyle={{...titleStyles}}
        valueStyle={{...valueStyles}}
        style={{
          ...labelValueStyles,
        }}
      />
      <LabelValue
        title="Bank Name"
        value={placeholderDecider(bankDetails?.BANK)}
        titleStyle={{...titleStyles}}
        valueStyle={{...valueStyles}}
        style={{
          ...labelValueStyles,
        }}
      />
      <LabelValue
        title="Bank Branch"
        value={placeholderDecider(bankDetails?.BRANCH)}
        titleStyle={{...titleStyles}}
        valueStyle={{...valueStyles}}
        style={{
          ...labelValueStyles,
        }}
      />
      <LabelValue
        title="Bank Account No"
        value={placeholderDecider(
          loanData.loan_application_data?.bank_details?.bank_account_number,
        )}
        titleStyle={{...titleStyles}}
        valueStyle={{...valueStyles}}
        style={{
          ...labelValueStyles,
        }}
      />
      <LabelValue
        title="Name on Bank Account"
        value={placeholderDecider(
          loanData?.loan_application_data?.bank_verification_info?.bankTransfer
            ?.beneName,
        )}
        titleStyle={{...titleStyles}}
        valueStyle={{...valueStyles}}
        style={{
          ...labelValueStyles,
        }}
      />
    </View>
  );
};

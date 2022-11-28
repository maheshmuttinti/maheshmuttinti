/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Heading, LabelValue} from 'uin';
import {useTheme} from 'theme';
import {Platform, View} from 'react-native';
import {useGetLoanApplicationEMI} from '../hooks/useGetLoanApplicationEMI';
import {formatDate, placeholderDecider} from 'utils';

export const LoanDetails = ({
  loanData,
  loanId,
  labelValueStyles,
  titleStyles,
  valueStyles,
  headingStyles,
}) => {
  const theme = useTheme();

  const EMI = useGetLoanApplicationEMI(loanId, loanData);

  const bankDetails = useGetSanitizedLoanDetails(loanData, EMI);

  return (
    <View style={{paddingTop: 24}}>
      <Heading
        style={{
          ...headingStyles,
        }}>
        LOAN DETAILS
      </Heading>

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

      {Object?.entries(bankDetails)?.map(([title, value], key) => (
        <LabelValue
          key={`bank-details-key-${key}`}
          title={title}
          value={value}
          titleStyle={{...titleStyles}}
          valueStyle={{...valueStyles}}
          style={{
            ...labelValueStyles,
          }}
        />
      ))}
    </View>
  );
};

const useGetSanitizedLoanDetails = (loanData, EMI) => {
  const bankDetails = {
    'Pan Card': placeholderDecider(loanData?.pan),
    Name: placeholderDecider(loanData?.loan_application_data?.name),
    Amount: placeholderDecider(
      loanData?.loan_application_data?.loan_details.amount
        ? `Rs. ${parseInt(
            loanData?.loan_application_data?.loan_details.amount,
            10,
          )}`
        : null,
    ),
    ROI: placeholderDecider(
      loanData?.nbfc_data?.roi ? `${loanData?.nbfc_data?.roi}%` : null,
    ),
    Tenure: placeholderDecider(
      loanData?.loan_application_data?.loan_tenure
        ? `${loanData?.loan_application_data?.loan_tenure} Months`
        : null,
    ),
    EMI: placeholderDecider(EMI ? `₹${EMI}` : null),
    '1st EMI': placeholderDecider(
      loanData?.loan_application_data?.first_emi_date
        ? formatDate(
            new Date(loanData?.loan_application_data?.first_emi_date),
            'dMy',
            Platform.OS,
          )
        : null,
    ),
  };
  return bankDetails;
};

/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {LoanApplicationCard} from './LoanApplicationCard';

export const LoanApplicationsList = ({navigation, applications}) => {
  return (
    <>
      {applications?.length > 0 &&
        applications?.map((application, key) => (
          <LoanApplicationCard
            key={`loan-application-${key}`}
            application={application}
            navigation={navigation}
          />
        ))}
    </>
  );
};

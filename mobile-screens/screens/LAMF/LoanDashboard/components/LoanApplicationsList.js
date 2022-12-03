/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {SkeletonListCard} from '../../SelectSchemes';
import {LoanApplicationCard} from './LoanApplicationCard';

export const LoanApplicationsList = ({navigation, applications, isLoading}) => {
  return (
    <>
      {isLoading
        ? new Array(4)
            ?.fill(0)
            ?.map((_, index) => (
              <SkeletonListCard
                key={`skeleton-la-${index}`}
                containerStyle={
                  index === 0
                    ? {marginTop: 25, right: 34, width: '120%'}
                    : {right: 34, width: '120%'}
                }
              />
            ))
        : applications?.length > 0 &&
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

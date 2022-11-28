/* eslint-disable react-native/no-inline-styles */
import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Config from 'react-native-config';
import {revokeLienMarkingForLoanApplication} from 'services';

export const Revocation = ({loanData}) => {
  const handleRevocation = async loanUuid => {
    try {
      await revokeLienMarkingForLoanApplication(loanUuid);
    } catch (error) {
      return error;
    }
  };
  return (
    <>
      {Config.MOCK_ENVIRONMENT === 'STAGING' && (
        <TouchableOpacity
          style={{
            marginVertical: 12,
            padding: 12,
            backgroundColor: 'red',
            borderRadius: 10,
          }}
          onPress={() => handleRevocation(loanData.uuid)}>
          <Text style={{color: 'white', fontSize: 16, textAlign: 'center'}}>
            {loanData?.lien_marking_status === 'success'
              ? 'TEST: Click to Revoke Lien Units'
              : 'REVOKED'}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

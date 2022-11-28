/* eslint-disable react-native/no-inline-styles */
import {Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Config from 'react-native-config';
import {revokeLienMarkingForLoanApplication} from 'services';

export const Revocation = ({loanData}) => {
  const [revoking, setRevoking] = useState(false);
  const handleRevocation = async loanUuid => {
    try {
      setRevoking(true);
      await revokeLienMarkingForLoanApplication(loanUuid);
      setRevoking(false);
    } catch (error) {
      setRevoking(false);

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
            {revoking
              ? 'Please wait, Revoking tge lien marked units'
              : loanData?.lien_marking_status === 'success'
              ? 'TEST: Click to Revoke Lien Units'
              : 'REVOKED'}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

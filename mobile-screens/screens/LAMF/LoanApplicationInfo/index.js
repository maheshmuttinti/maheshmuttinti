/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useState, useCallback, useMemo} from 'react';
import ScreenWrapper from '../../../hocs/screenWrapper';
import {ScrollView, View} from 'react-native';
import {getBankDetailsByIFSC, getLoanApplicationById} from 'services';
import {useFocusEffect} from '@react-navigation/native';
import {LoanDetails} from './components/LoanDetails';
import {BasicDetails} from './components/BasicDetails';
import {BankDetails} from './components/BankDetails';
import {SubmitButton} from './components/SubmitButton';
import {WarningCard} from './components/WarningCard';
import {Revocation} from '../StagingTestComponents/Revocation';
import {useGetLoanApplicationDetailsStyles} from './hooks/useGetLoanApplicationDetailsStyles';
import useLayoutBackButtonAction from '../../../reusables/useLayoutBackButtonAction';
import {useNavigateStep} from './hooks/useNavigateStep';

export default function ({route, navigation}) {
  const {loanId} = route?.params;
  const [loanData, setLoanData] = useState({});
  const [bankDetails, setBankDetails] = useState({});

  const {labelValueStyles, titleStyles, valueStyles, headingStyles} =
    useGetLoanApplicationDetailsStyles();

  useLayoutBackButtonAction();

  const getLoanDetails = useCallback(async () => {
    try {
      const data = await getLoanApplicationById(loanId);
      setLoanData(data);
    } catch (error) {
      return error;
    }
  }, [loanId]);

  const ifscCode = useMemo(() => {
    return loanData?.loan_application_data?.bank_verification_info?.bankTransfer
      ?.beneIFSC;
  }, [loanData]);

  const getBankDetails = useCallback(async () => {
    if (ifscCode) {
      const data = await getBankDetailsByIFSC(ifscCode);
      setBankDetails(data);
    }
  }, [ifscCode]);

  useFocusEffect(
    useCallback(() => {
      getLoanDetails();
      getBankDetails();
    }, [getLoanDetails, getBankDetails]),
  );

  const navigateStep = useNavigateStep();

  return (
    <ScreenWrapper scrollView={false} footer={true}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom:
            loanData?.loan_application_step === 'completed' ? 0 : 95,
        }}>
        <ScrollView
          style={{
            paddingTop: 32,
          }}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}>
          <WarningCard />

          <Revocation loanData={loanData} />

          <View style={{paddingHorizontal: 8}}>
            <LoanDetails
              loanData={loanData}
              loanId={loanId}
              labelValueStyles={labelValueStyles}
              titleStyles={titleStyles}
              valueStyles={valueStyles}
              headingStyles={headingStyles}
            />
            <BasicDetails
              loanData={loanData}
              labelValueStyles={labelValueStyles}
              titleStyles={titleStyles}
              valueStyles={valueStyles}
              headingStyles={headingStyles}
            />
            <BankDetails
              loanData={loanData}
              bankDetails={bankDetails}
              labelValueStyles={labelValueStyles}
              titleStyles={titleStyles}
              valueStyles={valueStyles}
              headingStyles={headingStyles}
            />
          </View>
        </ScrollView>
      </View>

      {loanData?.loan_application_step !== 'completed' && (
        <SubmitButton
          navigation={navigation}
          loanData={loanData}
          navigateStep={navigateStep}
        />
      )}
    </ScreenWrapper>
  );
}

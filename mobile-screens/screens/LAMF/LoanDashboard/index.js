/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useState, useCallback} from 'react';
import ScreenWrapper from '../../../hocs/screen_wrapper';
import {useTheme} from 'theme';
import {Heading, Card, OutlinedButton, TextButton} from 'uin';
import {View, Text} from 'react-native';
import {InfoIcon} from 'assets';
import {getUsersLoanApplication} from 'services';
import {useFocusEffect} from '@react-navigation/native';
import useLayoutBackButtonAction from '../../../reusables/useLayoutBackButtonAction';
import {LoanApplicationsList} from './components/LoanApplicationsList';

export default function ({navigation}) {
  const theme = useTheme();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useLayoutBackButtonAction();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setIsLoading(true);
        await loanApplications();
        setIsLoading(false);
      })();
    }, []),
  );

  const loanApplications = async () => {
    try {
      const loanApplicationsResponse = await getUsersLoanApplication();
      let lienMarkingSuccessLoanApplications = loanApplicationsResponse?.filter(
        item => item?.lien_marking_status === 'success',
      );

      setApplications(lienMarkingSuccessLoanApplications);
    } catch (error) {
      setIsLoading(false);

      return error;
    }
  };

  return (
    <ScreenWrapper>
      <View
        style={{
          paddingHorizontal: 17,
        }}>
        <View style={{paddingTop: 40}}>
          <Heading
            style={{
              color: theme.colors.text,
              ...theme.fontSizes.heading5,
              fontWeight: theme.fontWeights.veryBold,
            }}>
            Your Loans
          </Heading>
        </View>

        <LoanApplicationsList
          applications={applications}
          navigation={navigation}
          isLoading={isLoading}
        />
        <View style={{paddingTop: 16}}>
          <Card
            style={{
              backgroundColor: theme.colors.backgroundYellow,
              paddingHorizontal: 17,
              paddingVertical: 16,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View>
              <InfoIcon fill={theme.colors.error} />
            </View>

            <Heading
              style={{
                ...theme.fontSizes.small,
                fontFamily: theme.fonts.regular,
                color: theme.colors.text,
                paddingLeft: 17.25,
                marginRight: 17,
              }}>
              Please complete your loan application in{' '}
              <Text style={{color: theme.colors.error}}>10 days</Text>.
              Processing fee is to be paid if you fail to do so.
            </Heading>
          </Card>
        </View>
        <View style={{paddingTop: 45}}>
          <OutlinedButton
            onPress={() => {
              navigation.replace('Protected');
            }}
            outlineColor="#003AC9"
            textStyles={{color: '#003AC9'}}>
            Apply for another Loan
          </OutlinedButton>
        </View>
        <View
          style={{
            paddingTop: 16,
            paddingBottom: 32,
            alignItems: 'center',
          }}>
          <TextButton onPress={() => navigation.replace('Protected')}>
            Go to Dashboard
          </TextButton>
        </View>
      </View>
    </ScreenWrapper>
  );
}

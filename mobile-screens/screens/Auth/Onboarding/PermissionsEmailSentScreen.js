/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View} from 'react-native';
import {
  AuthHeading,
  BaseButton,
  TextButton,
  BlackBodyText,
  GrayBodyText,
  BaseBodyText,
  GroupText,
} from 'uin';
import {useTheme} from 'theme';
import AuthWrapper from '../../../hocs/AuthWrapper';
import {ForwardEmail} from 'assets';
import {showToast, prettifyJSON} from 'utils';
import Config from 'react-native-config';
import useExitApp from '../../../reusables/useExitApp';
import useUser from '../../../reusables/useUser';
import useOnboardingHandleRedirection from '../../../reusables/useOnboardingHandleRedirection';

export default function ({navigation}) {
  const theme = useTheme();
  const [disableButton, setDisableButton] = useState(null);

  useExitApp();
  const user = useUser();

  const {handleUpdateOnboardingStep} = useOnboardingHandleRedirection();

  const handleSkip = async () => {
    if (!disableButton) {
      await handleUpdateOnboardingStep(user, {
        investment_behavior: {status: 'skipped'},
      });

      navigation.replace('Protected');
    }
  };

  return (
    <AuthWrapper>
      <AuthHeading>Email will be sent</AuthHeading>

      <View style={{paddingTop: 24, alignItems: 'center'}}>
        <ForwardEmail />
      </View>

      <GroupText style={{paddingTop: 24}}>
        <GrayBodyText
          style={{
            fontFamily: theme.fonts.regular,
          }}>
          You will receive the MF statements on your E-Mail from{' '}
        </GrayBodyText>

        <BlackBodyText style={{fontWeight: theme.fontWeights.veryBold}}>
          donotreply@camsonline.com.{' '}
        </BlackBodyText>

        <GrayBodyText
          style={{
            fontFamily: theme.fonts.regular,
          }}>
          Please forward the statements to{' '}
        </GrayBodyText>

        <BlackBodyText style={{fontWeight: theme.fontWeights.veryBold}}>
          {Config.RADICAL_SUPPORT_URL}.{' '}
        </BlackBodyText>

        <GrayBodyText
          style={{
            fontFamily: theme.fonts.regular,
          }}>
          And your personalized dashboard will be ready in a few minutes{' '}
        </GrayBodyText>
      </GroupText>

      <View style={{paddingTop: 24, paddingRight: 12}}>
        <BaseBodyText
          style={{
            fontFamily: theme.fonts.bold,
            color: theme.colors.primaryOrange,
          }}>
          Meanwhile, we have an exciting exercise for you...
        </BaseBodyText>
      </View>

      <KnowYourInvestmentActionButton
        navigation={navigation}
        onActionIsCalling={check => setDisableButton(check)}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 16,
        }}>
        <TextButton onPress={async () => await handleSkip()}>
          I don't want to know
        </TextButton>
      </View>
    </AuthWrapper>
  );
}
export const KnowYourInvestmentActionButton = ({
  onActionIsCalling = () => false,
  navigation,
}) => {
  const user = useUser();

  const [apiCallStatus, setApiCallStatus] = useState(null);

  const {handleUpdateOnboardingStep} = useOnboardingHandleRedirection();

  const handleGoForward = async () => {
    try {
      setApiCallStatus('loading');
      onActionIsCalling(true);

      const updateProfileResponse = await handleUpdateOnboardingStep(user, {
        investment_behavior: {status: 'completed'},
      });

      console.log(
        'updateProfileResponse in email sent screen ======',
        prettifyJSON(updateProfileResponse),
      );
      navigation.replace('Auth', {
        screen: 'EnterDobScreen',
      });

      setApiCallStatus('success');
      onActionIsCalling(false);
    } catch (err) {
      setApiCallStatus('failure');
      showToast('Something went wrong');
      onActionIsCalling(false);
      return err;
    }
  };

  return (
    <View style={{paddingTop: 32}}>
      <BaseButton
        loading={apiCallStatus === 'loading'}
        onPress={() => handleGoForward()}>
        Know your investment behavior
      </BaseButton>
    </View>
  );
};

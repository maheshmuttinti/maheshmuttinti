/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useRef, useEffect, memo, useCallback} from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import ScreenWrapper from '../../hocs/screenWrapperWithoutBackButton';
import {useTheme} from 'theme';
import {
  BaseTextInput,
  BaseButton,
  TextButton,
  SmallOutlinedButton,
  Heading,
  GrayBodyText,
  AuthHeading,
  FilledButton,
} from 'uin';
import {useState} from 'react';
import {
  MessageQuestion,
  BackArrow,
  WarningIcon1,
  TickCircle,
  RefreshCircle,
} from 'assets';
import {addCASEmail, requestCAS, getCASEmails} from 'services';
import MFPortfolioSteps from '../../reusables/mfPortfolioSteps';
import {prettifyJSON, EMAIL_REGEX, showNativeAlert, formatDate} from 'utils';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import {setRequestTrackingId} from 'store';
import {openInbox} from 'react-native-email-link';
import useFetchUser from '../../reusables/useFetchUser';
import useOnboardingHandleRedirection from '../../reusables/useOnboardingHandleRedirection';
import {useFocusEffect} from '@react-navigation/native';

const casPDFParsingAboutToStarted = ['pending'];

const casPDFParsingStates = [
  'reading_in_progress',
  'reading_successful',
  'processing_in_progress',
  'processing_successful',
  'portfolio_generating',
  'portfolio_generation_successful',
];

const casPDFFailingStates = [
  'reading_failed',
  'processing_failed',
  'portfolio_generation_failed',
];

export default function ({navigation}) {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [casEmails, setCasEmails] = useState(null);
  const [apiCallStatus, setApiCallStatus] = useState(null);
  const [isNewEmailAdded, setIsNewEmailAdded] = useState(false);
  const [showGreenCircleIcon, setShowGreenCircleIcon] = useState(false);
  const [refreshCASEmailsOnRequestFailed, setRefreshCASEmailsOnRequestFailed] =
    useState(false);
  const {user} = useFetchUser();
  const {handleUpdateOnboardingStep} = useOnboardingHandleRedirection();
  const dispatch = useDispatch();

  const {isUserLoggedInWithMPIN} = useSelector(
    ({auth}) => ({
      isUserLoggedInWithMPIN: auth.isUserLoggedInWithMPIN,
    }),
    shallowEqual,
  );

  const showGreenTickCircleIcon = useRef(() => {});

  showGreenTickCircleIcon.current = () =>
    EMAIL_REGEX.test(email)
      ? setShowGreenCircleIcon(true)
      : setShowGreenCircleIcon(false);

  useEffect(() => {
    showGreenTickCircleIcon.current();
  }, [email]);

  const getEmailsList = async () => {
    try {
      console.log('inside getEmailsList');
      setApiCallStatus('get_emails_loading');
      const emails = await getCASEmails();
      console.log('emails list', prettifyJSON(emails));
      setCasEmails(emails);
      setApiCallStatus('get_emails_success');
    } catch (err) {
      setApiCallStatus('get_emails_failed');
      return err;
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log('useFocusEffect cas emails call');
      (async () => await getEmailsList())();
    }, [isNewEmailAdded, refreshCASEmailsOnRequestFailed]),
  );

  const handleChangeText = text => {
    setError(null);
    setEmail(text);
  };

  const textInputWrapperStyle = {
    marginTop: 24,
  };

  const actionsWrapperStyle = {
    paddingTop: 32,
    width: '100%',
  };

  const orangeButtonWrapperStyle = {height: 48};

  const requestCASCallback = async casEmail => {
    try {
      const requestCASPayload = {
        email: casEmail,
      };

      const requestCASResponse = await requestCAS(requestCASPayload);
      console.log('requestCASResponse', prettifyJSON(requestCASResponse));

      if (requestCASResponse) {
        if (requestCASResponse.status === 'success') {
          if (
            !user?.profile?.meta?.onboarding_steps
              ?.consolidate_mutual_funds_linked_to_email
          ) {
            const updateProfileResponse = await handleUpdateOnboardingStep(
              user,
              {
                consolidate_mutual_funds_linked_to_email: {
                  status: 'completed',
                  data: {
                    email: requestCASResponse?.data?.email,
                    email_type: requestCASResponse?.data?.email_type,
                  },
                },
              },
            );
            console.log(
              'import portfolio user meta updated',
              prettifyJSON(updateProfileResponse),
            );
          }

          dispatch(setRequestTrackingId(requestCASResponse.data?.uuid));
          if (requestCASResponse.message) {
            showNativeAlert(requestCASResponse?.message);
            return requestCASResponse.message;
          }
          return requestCASResponse.status;
        }
        return requestCASResponse;
      }
    } catch (err) {
      showNativeAlert('Something went wrong');
      setRefreshCASEmailsOnRequestFailed(prevState => !prevState);
    }
  };

  const handleAddEmail = async () => {
    try {
      if (email?.length === 0) {
        setError('Please enter the email ID');
      } else if (EMAIL_REGEX.test(email)) {
        const addCASEmailPayload = {
          email: email,
          email_type: 'non_gmail',
        };

        console.log('addCASEmailPayload', addCASEmailPayload);

        setApiCallStatus('add_cas_email_loading');
        const addCasEmailResponse = await addCASEmail(addCASEmailPayload);

        setApiCallStatus('add_cas_email_success');
        if (addCasEmailResponse?.data?.verification_status === 'pending') {
          console.log('go to EmailVerificationStatus');

          setEmail('');
          setIsNewEmailAdded(prevState => !prevState);
          setApiCallStatus('add_cas_email_success');

          navigation.navigate('General', {
            screen: 'EmailVerificationStatus',
            params: {
              email: addCasEmailResponse?.data?.email,
            },
          });
        } else if (
          addCasEmailResponse?.data?.verification_status === 'success'
        ) {
          setEmail('');
          setIsNewEmailAdded(prevState => !prevState);
          setApiCallStatus('add_cas_email_success');
        }
      } else {
        setError('Please enter the valid email ID');
      }
    } catch (err) {
      console.log('error', err);
      setApiCallStatus('add_cas_email_failed');
      showNativeAlert('Something went wrong');
    }
  };

  const handleGotoEmail = () => {
    openInbox();
  };

  return (
    <ScreenWrapper backgroundColor={theme.colors.background}>
      <View style={{padding: 24}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: 16,
          }}>
          <TouchableOpacity
            hitSlop={{top: 30, left: 30, right: 30, bottom: 30}}
            onPress={() => {
              if (isUserLoggedInWithMPIN === true && !navigation.canGoBack()) {
                navigation.replace('Protected');
              } else if (navigation.canGoBack()) {
                navigation.pop();
              } else {
                navigation.replace('Protected');
              }
            }}
            style={{flex: 0.3 / 4}}>
            <BackArrow />
          </TouchableOpacity>
          <View
            style={{
              flex: 3.6 / 4,
            }}>
            <Text
              style={{
                textAlign: 'center',
                ...theme.fontSizes.medium,
                fontFamily: theme.fonts.bold,
                color: theme.colors.text,
              }}>
              Portfolio
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Protected', {screen: 'FAQ'});
            }}
            style={{flex: 0.4 / 4}}>
            <MessageQuestion />
          </TouchableOpacity>
        </View>

        <View style={{paddingTop: 40}}>
          <AuthHeading
            style={{
              color: theme.colors.text,
            }}>
            Import Portfolio
          </AuthHeading>

          <GrayBodyText style={{paddingTop: 16}}>
            Kindly provide the E-Mail IDs to receive your Consolidated Account
            Statement
          </GrayBodyText>

          <View style={{paddingTop: 16}}>
            <CASEmailsList
              emails={casEmails}
              navigation={navigation}
              refreshCasRequestCallback={async email => {
                await requestCASCallback(email);
                await getEmailsList();
              }}
            />
          </View>
          <BaseTextInput
            wrapperStyles={{...textInputWrapperStyle}}
            placeholder="Email ID"
            onChangeText={text => handleChangeText(text)}
            value={email}
            error={error}
            overlappingIcon={() =>
              (error && (
                <View style={{position: 'absolute', right: 13.24}}>
                  <WarningIcon1 />
                </View>
              )) ||
              (showGreenCircleIcon && (
                <View style={{position: 'absolute', right: 13.24}}>
                  <TickCircle />
                </View>
              ))
            }
          />
          <View style={{marginTop: 16, width: 232, alignSelf: 'center'}}>
            <SmallOutlinedButton
              outlineColor={theme.colors.primaryOrange}
              textColor={theme.colors.primaryOrange}
              onPress={async () => await handleAddEmail()}
              extraStyles={{paddingVertical: 4}}
              disable={
                apiCallStatus === 'add_cas_email_loading' ||
                apiCallStatus === 'requesting_cas'
              }>
              <Text
                style={{
                  color:
                    apiCallStatus === 'add_cas_email_loading' ||
                    apiCallStatus === 'requesting_cas'
                      ? theme.colors.greyscale500
                      : theme.colors.primaryOrange,
                }}>
                {apiCallStatus === 'add_cas_email_loading'
                  ? 'Adding Email ID...'
                  : 'Add Email ID'}
              </Text>
            </SmallOutlinedButton>
          </View>

          <MFPortfolioSteps
            wrapperStyles={{marginRight: 0, marginTop: 0, paddingTop: 24}}
          />
          <View style={{...actionsWrapperStyle}}>
            <BaseButton
              gradientColors={[
                theme.colors.primaryOrange,
                theme.colors.primaryOrange700,
              ]}
              wrapperStyles={{...orangeButtonWrapperStyle}}
              textStyles={{}}
              onPress={() => handleGotoEmail()}
              gradientReverse={true}
              bgColor={theme.colors.primaryOrange}
              textColor={theme.colors.primary}>
              Go to Email
            </BaseButton>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const EmailListItem = ({email, index, navigation, refreshCasRequestCb}) => {
  const theme = useTheme();

  const [refreshingCasRequest, setRefreshingCasRequest] = useState(false);

  const refreshCasRequest = async email => {
    try {
      setRefreshingCasRequest(true);
      await refreshCasRequestCb(email);
      setRefreshingCasRequest(false);
    } catch (error) {
      setRefreshingCasRequest(false);
      console.log('error-1234', error);
    }
  };

  const handleRequestAddCASEmail = async casEmail => {
    try {
      const addCASEmailPayload = {
        email: casEmail,
        email_type: 'non_gmail',
      };

      console.log('addCASEmailPayload again', addCASEmailPayload);

      const addCasEmailResponse = await addCASEmail(addCASEmailPayload);

      if (addCasEmailResponse?.data?.verification_status === 'pending') {
        console.log('go to EmailVerificationStatus');

        navigation.navigate('General', {
          screen: 'EmailVerificationStatus',
          params: {
            email: addCasEmailResponse?.data?.email,
          },
        });
      }
    } catch (err) {
      console.log('error', err);
      showNativeAlert('Something went wrong');
    }
  };

  return (
    <View
      style={{
        paddingTop: index !== 0 ? 24 : 0,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.greyscale500,
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {email && email['cas_emails*email'] && (
          <View>
            <Heading
              style={{
                ...theme.fontSizes.large,
                color: theme.colors.primaryBlue,
                fontWeight: theme.fontWeights.veryBold,
              }}>
              {email['cas_emails*email']}
            </Heading>

            {!email?.latest_cas_request && (
              <View style={{paddingTop: 8}}>
                <GrayBodyText
                  style={{
                    color:
                      email['cas_emails*verification_status'] === 'success'
                        ? theme.colors.success
                        : email['cas_emails*verification_status'] === 'pending'
                        ? theme.colors.primaryOrange
                        : email['cas_emails*verification_status'] ===
                          'link_expired'
                        ? theme.colors.error
                        : email['cas_emails*verification_status'] === 'failed'
                        ? theme.colors.error
                        : theme.colors.text,
                  }}>
                  {email['cas_emails*verification_status'] === 'pending' &&
                    'Verification link sent to email, Please verify the email'}
                  {email['cas_emails*verification_status'] === 'success' &&
                    'Email verified successfully. Click the below button to request CAS statement'}
                  {email['cas_emails*verification_status'] === 'link_expired' &&
                    'Email verification link expired. Please request the verification link again'}
                  {email['cas_emails*verification_status'] === 'failed' &&
                    'Email verification failed, Please try again'}
                  {''}
                </GrayBodyText>
                {(email['cas_emails*verification_status'] === 'link_expired' ||
                  email['cas_emails*verification_status'] === 'failed') && (
                  <View style={{width: 200, marginTop: 8}}>
                    <FilledButton
                      extraStyles={{
                        paddingTop: 0,
                        paddingBottom: 0,
                      }}
                      loading={refreshingCasRequest}
                      fontSize={theme.fontSizes.small.fontSize}
                      textStyles={{lineHeight: 32}}
                      onPress={() =>
                        handleRequestAddCASEmail(email['cas_emails*email'])
                      }
                      bgColor={theme.colors.primaryOrange}
                      borderRadius={24}
                      textColor={'#ffffff'}>
                      Request email verification link
                    </FilledButton>
                  </View>
                )}
              </View>
            )}

            {(email['cas_emails*verification_status'] === 'success' ||
              email?.latest_cas_request) && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 8,
                }}>
                {email['cas_emails*verification_status'] === 'success' &&
                !email?.latest_cas_request ? (
                  <FilledButton
                    extraStyles={{
                      paddingTop: 0,
                      paddingBottom: 0,
                      paddingHorizontal: 12,
                    }}
                    fontSize={theme.fontSizes.small.fontSize}
                    textStyles={{lineHeight: 32}}
                    onPress={() => refreshCasRequest(email['cas_emails*email'])}
                    bgColor={theme.colors.primaryOrange}
                    borderRadius={24}
                    loading={refreshingCasRequest}
                    textColor={'#ffffff'}>
                    Request for CAS Statement
                  </FilledButton>
                ) : (
                  <GrayBodyText>
                    {casPDFFailingStates.includes(email?.statement_status)
                      ? 'CAS Processing failed. Request the CAS again'
                      : casPDFParsingAboutToStarted.includes(
                          email?.statement_status,
                        )
                      ? 'CAS is about to start processing...'
                      : casPDFParsingStates.includes(email?.statement_status)
                      ? 'CAS is processing...'
                      : email?.last_processed_at
                      ? `Last Imported:  ${formatDate(
                          new Date(email?.last_processed_at),
                        )}`
                      : 'Request the CAS Statement'}
                  </GrayBodyText>
                )}
                {casPDFParsingStates.includes(email?.statement_status) ||
                  ((email['cas_emails*email_type'] === 'gmail' ||
                    (email['cas_emails*email_type'] === 'non_gmail' &&
                      email['cas_emails*verification_status'] === 'success')) &&
                    email?.latest_cas_request && (
                      <View style={{marginLeft: 10}}>
                        {refreshingCasRequest ? (
                          <RefreshActivityLoader />
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              refreshCasRequest(email['cas_emails*email']);
                            }}>
                            <RefreshCircle />
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
              </View>
            )}
          </View>
        )}
      </View>
      {email &&
        email.latest_cas_request &&
        (email.statement_status === null ||
          email.statement_status === 'pending') && (
          <View style={{paddingTop: 8}}>
            <TextButton
              onPress={() => {
                navigation.navigate('Protected', {
                  screen: 'UploadPortfolio',
                  params: {
                    emailId: email['cas_emails*email'],
                    requestId: email?.latest_cas_request
                      ? email?.latest_cas_request['cas_requests*uuid']
                      : null,
                  },
                });
              }}
              style={{
                color: theme.colors.primaryOrange,
                ...theme.fontSizes.small,
                fontWeight: theme.fontWeights.moreBold,
              }}>
              Upload Portfolio
            </TextButton>
          </View>
        )}
    </View>
  );
};

const CASEmailsList = memo(
  ({emails, navigation, refreshCasRequestCallback}) => {
    return emails
      ? emails?.map((email, index) => (
          <EmailListItem
            key={`email-${index}`}
            index={index}
            email={email}
            navigation={navigation}
            refreshCasRequestCb={email => refreshCasRequestCallback(email)}
          />
        ))
      : null;
  },
);

const RefreshActivityLoader = () => {
  return <ActivityIndicator size="small" color="#0000ff" />;
};

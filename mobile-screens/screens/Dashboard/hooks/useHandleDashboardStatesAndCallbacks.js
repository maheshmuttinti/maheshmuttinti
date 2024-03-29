import * as React from 'react';
import {useState, useCallback} from 'react';
import {
  generateUserPortfolio,
  getInvestorUserStage,
  getLatestCASStatusOfNBFC,
  getLinkedPAN,
  getNBFCs,
  getUserPreApprovedLoanAmount,
} from 'services';
import {useFocusEffect} from '@react-navigation/native';
import Config from 'react-native-config';
import {debugLog, prettifyJSON} from 'utils';

export const useHandleDashboardStatesAndCallbacks = (
  showLoanApplicationModal,
  navigation,
) => {
  const [visible, setVisible] = useState(showLoanApplicationModal);
  const [showBannerSpace, setShowBannerSpace] = useState(true);
  // Todo: set pre approved loan amount from user-stage API
  const [dashboardLoanAmount, setDashboardLoanAmount] = useState(null);
  const [userStageCardContent, setUserStageCardContent] = useState(null);
  const [refreshOnScreenFocus, setRefreshOnScreenFocus] = useState(null);
  const [pollsChecking, setPollsChecking] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const getUserStage = async () => {
        try {
          setRefreshOnScreenFocus(true);
          if (showBannerSpace === true) {
            const userStageResponse = await getInvestorUserStage();

            if (
              userStageResponse?.user_state === null &&
              userStageResponse?.loan_details === null
            ) {
              debugLog('First If condition----');

              setUserStageCardContent({
                message: "Don't miss out on Investment Insights!",
                action: 'show_upload_now_button',
                percentage: 0,
              });
            } else if (
              (userStageResponse?.user_state?.cas_fetching_in_progress ===
                false &&
                userStageResponse?.user_state
                  ?.pre_approved_loan_computation_in_progress === true) ||
              (userStageResponse?.user_state?.cas_fetching_in_progress ===
                true &&
                userStageResponse?.user_state
                  ?.pre_approved_loan_computation_in_progress === false)
            ) {
              debugLog('Second If Condition');
              setUserStageCardContent({
                message:
                  'Your CAS is processing, your dashboard will be ready in a few minutes.',
                action: null,
                percentage: 50,
              });
              setPollsChecking(true);

              if (
                userStageResponse?.user_state?.cas_fetching_in_progress ===
                  true &&
                userStageResponse?.user_state
                  ?.pre_approved_loan_computation_in_progress === false &&
                userStageResponse?.loan_details?.status === 'INVALID' &&
                userStageResponse?.loan_details?.messageCode ===
                  'OUTDATED_CAS_DATA'
              ) {
                setUserStageCardContent({
                  message: "Don't miss out on Investment Insights!",
                  action: 'show_upload_now_button',
                  percentage: 0,
                });
                setPollsChecking(false);
              } else {
                // Todo: status: NOT_GENERATED case will be handled here
                debugLog('Generate Portfolio is calling.....');
                await handleGeneratePortfolio();
                debugLog('Generate Portfolio is done.....');
                setPollsChecking(false);
              }
            } else if (
              userStageResponse?.user_state?.cas_fetching_in_progress ===
                false &&
              userStageResponse?.user_state
                ?.pre_approved_loan_computation_in_progress === false &&
              userStageResponse?.loan_details?.status === 'COMPUTED' &&
              userStageResponse?.loan_details?.messageCode ===
                'PRE_APPROVED_LOAN_AMOUNT_COMPUTED'
            ) {
              debugLog('Third If condition----');

              setUserStageCardContent({
                message: 'You have a Pre Approved loan of',
                preApprovedLoanAmount: 'NA',
                action: 'show_apply_now_button',
              });
              setPollsChecking(false);
            }
          } else {
            debugLog('Fourth else condition----');

            setUserStageCardContent({
              message: "Don't miss out on Investment Insights!",
              action: 'show_upload_now_button',
              percentage: 0,
            });
            setPollsChecking(false);
          }
        } catch (error) {
          debugLog('user Stages API error: ', error);
          if (error?.message?.errorCode === 'INVESTOR_NOT_FOUND') {
            setUserStageCardContent({
              message: "Don't miss out on Investment Insights!",
              action: 'show_upload_now_button',
              percentage: 0,
            });
            setPollsChecking(false);
            return;
          }
          setPollsChecking(false);
          throw error;
        }
      };
      getUserStage();
      return () => {
        setRefreshOnScreenFocus(false);
        setPollsChecking(false);
      };
    }, [showBannerSpace, pollsChecking]),
  );

  React.useEffect(() => {
    (async () => {
      try {
        if (pollsChecking === true) {
          const polledUserStageResponse = await pollTheUserStagesOnProcessing();
          debugLog('polledUserStageResponse------: ', polledUserStageResponse);
        }
      } catch (error) {
        throw error;
      }
    })();
  }, [pollsChecking]);

  const handleGeneratePortfolio = async () => {
    try {
      await generateUserPortfolio();
      return true;
    } catch (error) {
      throw error;
    }
  };

  const handleGetUserPreApprovedLoanAmount = async () => {
    try {
      const getUserPreApprovedLoanAmountResponse =
        await getUserPreApprovedLoanAmount();
      debugLog(
        'getUserPreApprovedLoanAmountResponse: ',
        prettifyJSON(getUserPreApprovedLoanAmountResponse),
      );

      return getUserPreApprovedLoanAmountResponse;
    } catch (error) {
      throw error;
    }
  };
  const handleGetNBFCs = async () => {
    try {
      const getNBFCsResponse = await getNBFCs();
      debugLog('getNBFCsResponse: ', prettifyJSON(getNBFCsResponse));

      return getNBFCsResponse;
    } catch (error) {
      throw error;
    }
  };

  const checkForPANLinkStatus = async () => {
    try {
      const panResponse = await getLinkedPAN();
      const isPANLinked = panResponse?.pan && panResponse?.name;
      debugLog('checkForPANLinkStatus->isPANLinked: ', isPANLinked);

      if (isPANLinked) {
        return true;
      } else {
        navigation.navigate('PANSetup', {
          screen: 'CollectPAN',
          params: {
            waitForResponse: true,
          },
        });
      }
    } catch (error) {
      debugLog('checkForPANLinkStatus->error: ', error);
      if (error?.error === 'PAN not linked') {
        navigation.navigate('PANSetup', {
          screen: 'CollectPAN',
          params: {
            waitForResponse: true,
          },
        });
        throw error;
      } else {
        navigation.navigate('PANSetup', {
          screen: 'CollectPAN',
          params: {
            waitForResponse: true,
          },
        });
        throw error;
      }
    }
  };

  const handleUploadNow = async () => {
    try {
      const isUserLinkedPAN = await checkForPANLinkStatus();
      debugLog('handleUploadNow->isUserLinkedPAN: ', isUserLinkedPAN);
      if (isUserLinkedPAN === true) {
        const nbfcCode = Config.DEFAULT_NBFC_CODE;
        const casRefreshResponse = await getLatestCASStatusOfNBFC(nbfcCode);

        const refreshableCASDataProvidersForNBFC = Object.entries(
          casRefreshResponse?.cas_requests,
        )
          ?.filter(([key, value]) => value?.needs_refresh === true)
          ?.map(item => item[0]);

        if (refreshableCASDataProvidersForNBFC?.length > 0) {
          navigation.navigate('FetchCAS', {
            screen: 'FetchCASFromRTAs',
            params: {
              refreshableCASDataProvidersForNBFC,
              waitForResponse: true,
            },
          });
        }
      }
    } catch (error) {
      if (error?.response?.data?.errorCode === 'INVESTOR_NOT_FOUND') {
        navigation.navigate('PANSetup', {
          screen: 'CollectPAN',
          params: {
            waitForResponse: true,
          },
        });
        throw error;
      } else {
        navigation.navigate('PANSetup', {
          screen: 'CollectPAN',
          params: {
            waitForResponse: true,
          },
        });
        throw error;
      }
    }
  };

  const handleApplyNow = async () => {
    try {
      const isUserLinkedPAN = await checkForPANLinkStatus();
      debugLog('handleUploadNow->isUserLinkedPAN: ', isUserLinkedPAN);
      if (isUserLinkedPAN === true) {
        const nbfcCode = Config.DEFAULT_NBFC_CODE;
        const casRefreshResponse = await getLatestCASStatusOfNBFC(nbfcCode);

        const refreshableCASDataProvidersForNBFC = Object.entries(
          casRefreshResponse?.cas_requests,
        )
          ?.filter(([key, value]) => value?.needs_refresh === true)
          ?.map(item => item[0]);

        if (refreshableCASDataProvidersForNBFC?.length > 0) {
          navigation.navigate('LAMFV2', {
            screen: 'UpdatePortfolio',
            params: {
              providers: refreshableCASDataProvidersForNBFC,
              waitForResponse: true,
            },
          });
        } else {
          await handleGeneratePortfolio();
          const minMaxPreApprovedLoanAmount =
            await handleGetUserPreApprovedLoanAmount();
          const nbfcs = await handleGetNBFCs();
          navigation.navigate('LAMFV2', {
            screen: 'LoanAmountSelection',
            params: {
              loanAmount: minMaxPreApprovedLoanAmount?.max_eligible_loan,
              minLoanAmount: minMaxPreApprovedLoanAmount?.min_eligible_loan,
              maxLoanAmount: minMaxPreApprovedLoanAmount?.max_eligible_loan,
              availableFilterOptions: nbfcs?.available_filter_options,
            },
          });
        }
      }
    } catch (error) {
      debugLog('error in handleUploadNow=-----: ', error?.response?.data);
      if (error?.response?.data?.errorCode === 'INVESTOR_NOT_FOUND') {
        navigation.navigate('PANSetup', {
          screen: 'CollectPAN',
          params: {
            waitForResponse: true,
          },
        });
        throw error;
      } else {
        navigation.navigate('PANSetup', {
          screen: 'CollectPAN',
          params: {
            waitForResponse: true,
          },
        });
        throw error;
      }
    }
  };
  return {
    visible,
    setVisible,
    dashboardLoanAmount,
    refreshOnScreenFocus,
    showBannerSpace,
    userStageCardContent,
    setShowBannerSpace,
    handleUploadNow,
    handleApplyNow,
  };
};

const pollTheUserStagesOnProcessing = async () => {
  debugLog('pollTheUserStagesOnProcessing is called');
  try {
    const maxPolls = 3;
    let pollCount = 0;
    const poll = setInterval(async () => {
      try {
        const userStageResponse = await getInvestorUserStage();
        debugLog('userStageResponse: ', prettifyJSON(userStageResponse));
        if (userStageResponse) {
          debugLog(
            'userStageResponse in first if: ',
            prettifyJSON(userStageResponse),
          );
          clearInterval(poll);
          return userStageResponse;
        }
        if (pollCount > maxPolls) {
          debugLog(
            'userStageResponse in second if maxPolls: ',
            prettifyJSON(userStageResponse),
          );
          clearInterval(poll);
          return userStageResponse;
        }
        pollCount += 1;
      } catch (error) {
        debugLog('error inner pole catch: ', error);
        throw error;
      }
    }, 10000);
  } catch (error) {
    debugLog('error main pole catch: ', error);
    throw error;
  }
};

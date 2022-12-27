import {useHandleCASFetching} from '../../../../../reusables/CASFetching/useHandleCASFetching';
import {useEffect} from 'react';
import {useState} from 'react';
import useBetaForm from '@reusejs/react-form-hook';
import Config from 'react-native-config';
import {debugLog, prettifyJSON} from 'utils';
import {useStepper} from 'uin';
import {RTA_LOADING_MESSAGES} from '../constants';
import {
  generateUserPortfolio,
  getNBFCs,
  getUserPreApprovedLoanAmount,
} from 'services';

const showStepCount = (provider = 'cams') => {
  switch (provider) {
    case 'cams':
      return 0;
    case 'karvy':
      return 1;
    default:
      return 0;
  }
};

export const useAutoFlowRTACASFetchingRedirections = (
  refreshableCASDataProvidersForNBFC,
  navigation,
  flowFromOnboarding,
) => {
  const {CAMS_REQUEST_TEXT, KARVY_REQUEST_TEXT} = RTA_LOADING_MESSAGES;

  debugLog(
    'refreshableCASDataProvidersForNBFC in FetchCAS Screen: ',
    refreshableCASDataProvidersForNBFC,
  );
  const defaultSelectedDataProvider =
    refreshableCASDataProvidersForNBFC?.length > 0
      ? refreshableCASDataProvidersForNBFC[0]
      : 'cams';
  debugLog('defaultSelectedDataProvider: ', defaultSelectedDataProvider);

  const [initialStep] = useState(showStepCount(defaultSelectedDataProvider));
  const {incrementCurrentStep, currentStep, setActiveStep, steps} = useStepper(
    0,
    [
      {id: 'first', name: 'CAMS'},
      {id: 'second', name: 'KARVY'},
    ],
    [],
  );
  const [completedSteps, setCompletedSteps] = useState([]);
  const [skippedSteps, setSkippedSteps] = useState([]);
  const [failedSteps, setFailedSteps] = useState([]);
  const [action, setAction] = useState(null);
  const [loadingText, setLoadingText] = useState(null);

  const initiateCAMSCASForm = useBetaForm({
    credentials: 'user',
    data_fetching_provider: 'cams',
    fi_code: `${Config.DEFAULT_NBFC_CODE}`,
  });
  const initiateKarvyCASForm = useBetaForm({
    credentials: 'user',
    data_fetching_provider: 'karvy',
    fi_code: `${Config.DEFAULT_NBFC_CODE}`,
  });

  const {handleInitiateCASRequest} = useHandleCASFetching();

  useEffect(() => {
    setActiveStep(initialStep);
    if (initialStep === 1) {
      setSkippedSteps(prevStep => [...prevStep, 0]);
    }
  }, [initialStep]);

  debugLog('currentStep-----------', currentStep);

  useEffect(() => {
    (async () => {
      try {
        if (
          refreshableCASDataProvidersForNBFC?.includes('cams') &&
          currentStep === 0
        ) {
          setLoadingText(CAMS_REQUEST_TEXT);
          const handleInitiateCASRequestResponse =
            await handleInitiateCASRequest(initiateCAMSCASForm?.value);
          setLoadingText(null);
          setAction(handleInitiateCASRequestResponse);
        }
      } catch (error) {
        initiateCAMSCASForm.setErrors({
          error: [`${error?.message?.errors?.error}`],
        });
        setLoadingText(null);
        setAction('request_using_custom');
        throw error;
      }
    })();
  }, [initiateCAMSCASForm?.value, currentStep]);

  useEffect(() => {
    (async () => {
      try {
        if (
          refreshableCASDataProvidersForNBFC?.includes('karvy') &&
          currentStep === 1
        ) {
          setLoadingText(KARVY_REQUEST_TEXT);
          const handleInitiateCASRequestResponse =
            await handleInitiateCASRequest(initiateKarvyCASForm?.value);
          setLoadingText(null);
          setAction(handleInitiateCASRequestResponse);
        }
      } catch (error) {
        initiateKarvyCASForm.setErrors({
          error: [`${error?.message?.errors?.error}`],
        });
        setAction('request_using_custom');
        setLoadingText(null);
        throw error;
      }
    })();
  }, [initiateKarvyCASForm?.value, currentStep]);

  const handleGeneratePortfolio = async () => {
    try {
      const generateUserPortfolioResponse = await generateUserPortfolio();
      debugLog(
        'generateUserPortfolioResponse: ',
        prettifyJSON(generateUserPortfolioResponse),
      );

      return true;
    } catch (error) {
      navigation.replace('Protected');
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
      navigation.replace('Protected');
      throw error;
    }
  };
  const handleGetNBFCs = async () => {
    try {
      const getNBFCsResponse = await getNBFCs();
      debugLog('getNBFCsResponse: ', prettifyJSON(getNBFCsResponse));

      return getNBFCsResponse;
    } catch (error) {
      navigation.replace('Protected');
      throw error;
    }
  };
  const handleNextAfterCompleteCASFetch = async () => {
    try {
      if (flowFromOnboarding === true) {
        navigation.replace('Protected');
      } else {
        setLoadingText('Please wait, Redirecting to the next screen...');
        await handleGeneratePortfolio();
        const minMaxPreApprovedLoanAmount =
          await handleGetUserPreApprovedLoanAmount();
        const nbfcs = await handleGetNBFCs();
        debugLog('handleGetNBFCs->nbfcs: ', nbfcs);
        debugLog(
          'minMaxPreApprovedLoanAmount----------: ',
          minMaxPreApprovedLoanAmount,
        );
        navigation.replace('LAMFV2', {
          screen: 'LoanAmountSelection',
          params: {
            loanAmount: minMaxPreApprovedLoanAmount?.max_eligible_loan,
            minLoanAmount: minMaxPreApprovedLoanAmount?.min_eligible_loan,
            maxLoanAmount: minMaxPreApprovedLoanAmount?.max_eligible_loan,
            availableFilterOptions: nbfcs?.available_filter_options,
          },
        });
        setLoadingText(null);
      }
    } catch (error) {
      setLoadingText(null);
      console.log('handleNextAfterCompleteCASFetch->error: ', error);
      if (error?.response?.data?.errorCode === 'INVESTOR_NOT_FOUND') {
        navigation.navigate('PANSetup', {
          screen: 'CollectPAN',
        });
        throw error;
      }
      throw error;
    }
  };

  return {
    incrementCurrentStep,
    completedSteps,
    setCompletedSteps,
    steps,
    skippedSteps,
    action,
    loadingText,
    currentStep,
    setActiveStep,
    setLoadingText,
    setAction,
    setSkippedSteps,
    initiateCAMSCASForm,
    initiateKarvyCASForm,
    failedSteps,
    setFailedSteps,
    handleNextAfterCompleteCASFetch,
  };
};

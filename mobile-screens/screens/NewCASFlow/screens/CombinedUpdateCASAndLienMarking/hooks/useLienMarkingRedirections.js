// import {useHandleCASFetching} from '../../../../../reusables/CASFetching/useHandleCASFetching';
import {useEffect} from 'react';
import {useState} from 'react';
import useBetaForm from '@reusejs/react-form-hook';
import Config from 'react-native-config';
import {debugLog} from 'utils';
import {useStepper} from 'uin';

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

export const useLienMarkingRedirections =
  refreshableCASDataProvidersForNBFC => {
    debugLog(
      'refreshableCASDataProvidersForNBFC in useLienMarkingRedirections Screen: ',
      refreshableCASDataProvidersForNBFC,
    );
    const defaultSelectedDataProvider =
      refreshableCASDataProvidersForNBFC?.length > 0
        ? refreshableCASDataProvidersForNBFC[0]
        : 'cams';
    debugLog('defaultSelectedDataProvider: ', defaultSelectedDataProvider);

    const [initialStep] = useState(showStepCount(defaultSelectedDataProvider));
    const {incrementCurrentStep, currentStep, setActiveStep, steps} =
      useStepper(
        0,
        [
          {id: 'first', name: 'Holdings- Cams'},
          {id: 'second', name: 'Holdings- Karvy'},
          {id: 'third', name: 'LIEN MARK- CAMS'},
          {id: 'four', name: 'LIEN MARK- Karvy'},
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

    // const {handleInitiateCASRequest} = useHandleCASFetching();

    useEffect(() => {
      setActiveStep(initialStep);
      if (initialStep === 1) {
        setSkippedSteps(prevStep => [...prevStep, 0]);
      }
    }, [initialStep]);

    debugLog('currentStep-----------', currentStep);

    // useEffect(() => {
    //   (async () => {
    //     try {
    //       if (
    //         refreshableCASDataProvidersForNBFC?.includes('cams') &&
    //         currentStep === 0
    //       ) {
    //         const handleInitiateCASRequestResponse =
    //           await handleInitiateCASRequest(initiateCAMSCASForm?.value);
    //         setLoadingText(null);
    //         setAction(handleInitiateCASRequestResponse);
    //       }
    //     } catch (error) {
    //       initiateCAMSCASForm.setErrors({
    //         error: [`${error?.message?.errors?.error}`],
    //       });
    //       setLoadingText(null);
    //       setAction('request_using_custom');
    //       throw error;
    //     }
    //   })();
    // }, [initiateCAMSCASForm?.value, currentStep]);

    // useEffect(() => {
    //   (async () => {
    //     try {
    //       if (
    //         refreshableCASDataProvidersForNBFC?.includes('karvy') &&
    //         currentStep === 1
    //       ) {
    //         const handleInitiateCASRequestResponse =
    //           await handleInitiateCASRequest(initiateKarvyCASForm?.value);
    //         setLoadingText(null);
    //         setAction(handleInitiateCASRequestResponse);
    //       }
    //     } catch (error) {
    //       initiateKarvyCASForm.setErrors({
    //         error: [`${error?.message?.errors?.error}`],
    //       });
    //       setAction('request_using_custom');
    //       setLoadingText(null);
    //       throw error;
    //     }
    //   })();
    // }, [initiateKarvyCASForm?.value, currentStep]);

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
    };
  };

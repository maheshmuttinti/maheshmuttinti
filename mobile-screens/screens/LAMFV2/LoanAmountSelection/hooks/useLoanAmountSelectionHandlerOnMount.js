import {useState, useMemo, useCallback, useEffect} from 'react';
import {useTheme} from 'theme';
import {debugLog, isNumber, prettifyJSON} from 'utils';
import useLayoutBackButtonAction from '../../../../reusables/useLayoutBackButtonAction';
import useBetaForm from '@reusejs/react-form-hook';
import {getNBFCs} from 'services';

export const useLoanAmountSelectionHandler = (navigation, route) => {
  const theme = useTheme();
  const [emiTenures, setEMITenures] = useState(null);
  const [allMappedEMITenures, setAllMappedEMITenures] = useState(null);
  const [defaultEMITenure, setDefaultEMITenure] = useState(null);
  const [defaultInstallmentType, setDefaultInstallmentType] = useState(null);
  // const [initialMemoizedInstallmentTypes, setInitialMemoizedInstallmentTypes] =
  //   useState(null);
  const [availableFilterOptions, setAvailableFilterOptions] = useState(null);
  const [installmentTypeDecider, setInstallmentTypeDecider] = useState();

  const handleGetNBFCs = async payload => {
    try {
      const getNBFCsResponse = await getNBFCs(payload);
      debugLog('getNBFCsResponse: ', prettifyJSON(getNBFCsResponse));

      return getNBFCsResponse;
    } catch (error) {
      throw error;
    }
  };

  const {
    loanAmount: loanAmountFromRouteParams,
    minLoanAmount: minLoanAmountFromRouteParams,
    maxLoanAmount: maxLoanAmountFromRouteParams,
    // availableFilterOptions: {tenures, installment_types},
  } = route?.params;
  useLayoutBackButtonAction(theme.colors.background);

  useEffect(() => {
    (async () => {
      try {
        const payload = {amount: null};
        console.log('handleGetNBFCs->payload on UseEffect: ', payload);
        const responseOfNBFCs = await handleGetNBFCs(payload);
        console.log('responseOfNBFCs: ', prettifyJSON(responseOfNBFCs));
        const nbfcFilterOptions = responseOfNBFCs?.available_filter_options;
        console.log('nbfcFilterOptions: ', prettifyJSON(nbfcFilterOptions));
        setAvailableFilterOptions(nbfcFilterOptions);

        const mappedTenures = nbfcFilterOptions?.tenures?.map(tenure => ({
          label: `${tenure} Months`,
          value: `${tenure}`,
        }));
        const _mappedTenures = [...mappedTenures];
        setDefaultEMITenure(_mappedTenures?.[0]);
        setAllMappedEMITenures(_mappedTenures);
        if (_mappedTenures?.length > 6) {
          const _6EMITenures = _mappedTenures.slice(0, 6);
          setEMITenures(_6EMITenures);
        } else {
          setEMITenures(_mappedTenures);
        }

        const installmentTypes = availableFilterOptions?.installment_types;
        console.log('installmentTypes: ', installmentTypes);
        setDefaultInstallmentType(installmentTypes?.[0] || 'balloon');
        // setInitialMemoizedInstallmentTypes(installmentTypes);
        setInstallmentTypeDecider({
          type:
            installmentTypes?.includes('balloon') &&
            installmentTypes?.includes('emi')
              ? 'balloonAndEMI'
              : installmentTypes?.includes('emi')
              ? 'onlyEMI'
              : installmentTypes?.includes('balloon')
              ? 'onlyBalloon'
              : null,
          recommended:
            installmentTypes?.includes('balloon') &&
            installmentTypes?.includes('emi')
              ? 'balloon'
              : installmentTypes?.includes('emi')
              ? 'emi'
              : installmentTypes?.includes('balloon')
              ? 'balloon'
              : null,
          data: [
            {
              label: '₹2000 - ₹5000',
              value: '2000-5000',
            },
            {
              label: '₹10,000 - ₹12,000',
              value: '10,000 - 12,000',
            },
          ],
        });
      } catch (error) {
        console.log('useEffect->handleGetNBFCs->error: ', error);
        throw error;
      }
    })();
  }, []);

  // const {tenures, installment_types} = useMemo(() => {
  //   console.log('availableFilterOptions in useMemo: ', availableFilterOptions);
  //   if (
  //     availableFilterOptions?.tenures?.length > 0 &&
  //     availableFilterOptions?.installment_types?.length > 0
  //   ) {
  //     return availableFilterOptions;
  //   }
  // }, [availableFilterOptions]);

  // console.log('installment_types on Mount API call: ', installment_types);
  // console.log('tenures on Mount API call: ', tenures);
  // const memoizedAllMappedEMITenures = useMemo(() => {
  //   console.log('availableFilterOptions->useMemo: ', availableFilterOptions);
  //   return availableFilterOptions?.tenures?.map(tenure => ({
  //     label: `${tenure} Months`,
  //     value: `${tenure}`,
  //   }));
  // }, [availableFilterOptions]);

  // const initialMemoizedEMITenures = useMemo(() => {
  //   const _memoizedAllMappedEMITenures = [...memoizedAllMappedEMITenures];
  //   console.log(
  //     'useMemo->_memoizedAllMappedEMITenures: ',
  //     _memoizedAllMappedEMITenures,
  //   );
  //   if (_memoizedAllMappedEMITenures?.length > 6) {
  //     const _6EMITenures = _memoizedAllMappedEMITenures.slice(0, 6);
  //     return _6EMITenures;
  //   } else {
  //     return _memoizedAllMappedEMITenures;
  //   }
  // }, [memoizedAllMappedEMITenures]);

  // const [allMappedEMITenures, setAllMappedEMITenures] = useState(
  //   memoizedAllMappedEMITenures,
  // );

  // const memoizedDefaultEMITenure = useMemo(
  //   () => memoizedAllMappedEMITenures?.[0],
  //   [memoizedAllMappedEMITenures],
  // );
  // const [defaultEMITenure, setDefaultEMITenure] = useState(
  //   memoizedDefaultEMITenure,
  // );
  // console.log('installment_types: ', installment_types);

  // const initialMemoizedInstallmentTypes = useMemo(() => {
  //   console.log('availableFilterOptions->useMemo: ', availableFilterOptions);
  //   return availableFilterOptions?.installment_types;
  // }, [availableFilterOptions]);

  // console.log(
  //   'initialMemoizedInstallmentTypes: ',
  //   initialMemoizedInstallmentTypes,
  // );
  // const defaultInstallmentType =
  //   useMemo(
  //     () => initialMemoizedInstallmentTypes?.[0],
  //     [initialMemoizedInstallmentTypes],
  //   ) || 'emi';
  // console.log('defaultInstallmentType: ', defaultInstallmentType);

  const minLoanAmount = useMemo(
    () => minLoanAmountFromRouteParams,
    [minLoanAmountFromRouteParams],
  );
  const maxLoanAmount = useMemo(
    () => maxLoanAmountFromRouteParams,
    [maxLoanAmountFromRouteParams],
  );
  // const [emiTenures, setEMITenures] = useState(initialMemoizedEMITenures);

  debugLog('installmentTypeDecider', installmentTypeDecider);

  const nbfcsFilterForm = useBetaForm({
    amount: loanAmountFromRouteParams,
    filters: {
      tenure: defaultEMITenure,
      installment_type: defaultInstallmentType,
    },
  });

  const handleSetFilters = useCallback(async payload => {
    try {
      const nbfcs = await handleGetNBFCs(payload);
      const _availableFilterOptions = nbfcs?.available_filter_options;
      const allEMITenures = _availableFilterOptions?.tenures;
      const mappedAllEMITenures = allEMITenures?.map(tenure => ({
        label: `${tenure} Months`,
        value: tenure,
      }));
      const defaultEMITenureOnChangeSlider = mappedAllEMITenures?.[0];
      console.log(
        'defaultEMITenureOnChangeSlider: ',
        defaultEMITenureOnChangeSlider,
      );
      setAllMappedEMITenures(mappedAllEMITenures);
      setDefaultEMITenure(defaultEMITenureOnChangeSlider);
    } catch (error) {
      throw error;
    }
  }, []);

  const handleChangeLoanAmountOnTextInput = useCallback(
    async value => {
      try {
        const numericValue = value?.startsWith('₹') ? value.slice(1) : value;
        let finalLoanAmount = isNumber(numericValue)
          ? numericValue
          : numericValue;
        if (finalLoanAmount < minLoanAmount) {
          finalLoanAmount = minLoanAmount;
          nbfcsFilterForm?.setField('amount', +finalLoanAmount);
        } else {
          nbfcsFilterForm?.setField('amount', +finalLoanAmount);
        }
        const payload = {
          amount: +finalLoanAmount,
        };
        console.log(
          'handleChangeLoanAmountOnTextInput->payload for handleGetNBFCs: ',
          prettifyJSON(payload),
        );
        await handleSetFilters(payload);
      } catch (error) {
        throw error;
      }
    },
    [handleSetFilters, nbfcsFilterForm?.value],
  );

  const handleChangeSlider = useCallback(
    async value => {
      try {
        nbfcsFilterForm?.setField('amount', +value);
        const payload = {
          amount: +value,
        };
        console.log(
          'handleChangeSlider->payload for handleGetNBFCs: ',
          prettifyJSON(payload),
        );
        await handleSetFilters(payload);
      } catch (error) {
        throw error;
      }
    },
    [handleSetFilters, nbfcsFilterForm?.value],
  );

  const handleOnToggleSeeMore = useCallback(
    _emiTenures => {
      console.log('handleOnToggleSeeMore->_emiTenures: ', _emiTenures);
      const _allMappedEMITenures = [...allMappedEMITenures];
      console.log(
        'handleOnToggleSeeMore->_allMappedEMITenures: ',
        _allMappedEMITenures,
      );
      if (_allMappedEMITenures?.length > 6) {
        if (_emiTenures?.length === allMappedEMITenures?.length) {
          const _6EMITenures = _allMappedEMITenures?.slice(0, 6);
          setEMITenures(_6EMITenures);
          nbfcsFilterForm?.setField('filters.tenure', _6EMITenures?.[0]);
        } else {
          setEMITenures(_allMappedEMITenures);
          nbfcsFilterForm?.setField(
            'filters.tenure',
            _allMappedEMITenures?.[0],
          );
        }
      }
    },
    [allMappedEMITenures, nbfcsFilterForm?.value],
  );

  const handleSelectTenure = useCallback(
    tenure => {
      debugLog('tenure: ', tenure);
      nbfcsFilterForm?.setField('filters.tenure', tenure);
    },
    [nbfcsFilterForm?.value],
  );

  const handleOnSelectMonthlyPlan = useCallback(
    installmentType => {
      debugLog('installmentType: ', installmentType);
      nbfcsFilterForm?.setField('filters.installment_type', installmentType);
    },
    [nbfcsFilterForm?.value],
  );

  const handleSubmit = async () => {
    try {
      const payload = {
        ...nbfcsFilterForm?.value,
        filters: {
          tenure: nbfcsFilterForm?.value?.filters?.tenure?.value,
          installment_type:
            nbfcsFilterForm?.value?.filters?.installment_type?.value,
        },
      };
      debugLog('payload on submit', prettifyJSON(payload));

      const handleGetNBFCsResponse = await handleGetNBFCs(payload);
      debugLog('handleGetNBFCsResponse: ', handleGetNBFCsResponse);
      let nbfcs = handleGetNBFCsResponse?.nbfcs;

      console.log('nbfcs after adding other--------: ', prettifyJSON(nbfcs));
      if (nbfcs?.length === 1) {
        navigation.navigate('LAMFV2', {screen: 'ChooseNBFCSingle'});
      } else if (nbfcs?.length === 2 || nbfcs?.length === 3) {
        navigation.navigate('LAMFV2', {
          screen: 'ChooseNBFCHorizontal',
          params: {nbfcs: nbfcs},
        });
      } else if (nbfcs?.length > 3) {
        navigation.navigate('LAMFV2', {
          screen: 'ChooseNBFCVertical',
          params: {nbfcs: nbfcs},
        });
      }
    } catch (error) {
      throw error;
    }
  };
  return {
    nbfcsFilterForm,
    minLoanAmount,
    maxLoanAmount,
    emiTenures,
    allMappedEMITenures,
    installmentTypeDecider,
    handleChangeLoanAmountOnTextInput,
    handleChangeSlider,
    handleSelectTenure,
    handleOnToggleSeeMore,
    handleOnSelectMonthlyPlan,
    handleSubmit,
  };
};

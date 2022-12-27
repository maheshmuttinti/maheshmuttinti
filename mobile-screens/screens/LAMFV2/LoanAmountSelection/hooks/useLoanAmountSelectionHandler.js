import {useState, useMemo, useCallback, useEffect} from 'react';
import {useTheme} from 'theme';
import {debugLog, isNumber, prettifyJSON} from 'utils';
import useLayoutBackButtonAction from '../../../../reusables/useLayoutBackButtonAction';
import useBetaForm from '@reusejs/react-form-hook';
import {getNBFCs, getIndicativeEMIsForLoanTenures} from 'services';
import useHardwareButtonGoBack from '../../../../reusables/useHardwareButtonGoBack';

export const useLoanAmountSelectionHandler = (navigation, route) => {
  const theme = useTheme();

  // const handleGoBack = () => {
  //   navigation.replace('Protected');
  // };

  useHardwareButtonGoBack(true);

  useLayoutBackButtonAction(theme.colors.background);
  const [minROI, setMinROI] = useState('10');
  const [maxROI, setMaxROI] = useState('13.5');

  const {
    loanAmount: loanAmountFromRouteParams,
    minLoanAmount: minLoanAmountFromRouteParams,
    maxLoanAmount: maxLoanAmountFromRouteParams,
    availableFilterOptions: {tenures, installment_types},
  } = route?.params;

  const memoizedAllMappedEMITenures = useMemo(
    () =>
      tenures?.map(tenure => ({
        label: `${tenure} Months`,
        value: `${tenure}`,
      })),
    [tenures],
  );
  const initialMemoizedEMITenures = useMemo(() => {
    const _memoizedAllMappedEMITenures = [...memoizedAllMappedEMITenures];
    console.log(
      'useMemo->_memoizedAllMappedEMITenures: ',
      _memoizedAllMappedEMITenures,
    );
    if (_memoizedAllMappedEMITenures?.length > 6) {
      const _6EMITenures = _memoizedAllMappedEMITenures.slice(0, 6);
      return _6EMITenures;
    } else {
      return _memoizedAllMappedEMITenures;
    }
  }, [memoizedAllMappedEMITenures]);

  const [allMappedEMITenures, setAllMappedEMITenures] = useState(
    memoizedAllMappedEMITenures,
  );

  const memoizedDefaultEMITenure = useMemo(
    () => memoizedAllMappedEMITenures?.[0],
    [memoizedAllMappedEMITenures],
  );
  const [defaultEMITenure, setDefaultEMITenure] = useState(
    memoizedDefaultEMITenure,
  );
  console.log('installment_types: ', installment_types);

  const initialMemoizedInstallmentTypes = useMemo(() => {
    return installment_types;
  }, [installment_types]);

  console.log(
    'initialMemoizedInstallmentTypes: ',
    initialMemoizedInstallmentTypes,
  );
  const defaultInstallmentType =
    useMemo(
      () => initialMemoizedInstallmentTypes?.[0],
      [initialMemoizedInstallmentTypes],
    ) || 'emi';
  console.log('defaultInstallmentType: ', defaultInstallmentType);

  const minLoanAmount = useMemo(
    () => minLoanAmountFromRouteParams,
    [minLoanAmountFromRouteParams],
  );
  const maxLoanAmount = useMemo(
    () => maxLoanAmountFromRouteParams,
    [maxLoanAmountFromRouteParams],
  );
  const [emiTenures, setEMITenures] = useState(initialMemoizedEMITenures);

  const [installmentTypeDecider, setInstallmentTypeDecider] = useState(null);

  debugLog('installmentTypeDecider', installmentTypeDecider);

  const nbfcsFilterForm = useBetaForm({
    amount: loanAmountFromRouteParams,
    filters: {
      tenure: defaultEMITenure,
      installment_type: defaultInstallmentType,
    },
  });

  const handleGetNBFCs = async payload => {
    try {
      const getNBFCsResponse = await getNBFCs(payload);
      debugLog('getNBFCsResponse: ', prettifyJSON(getNBFCsResponse));

      return getNBFCsResponse;
    } catch (error) {
      throw error;
    }
  };

  const handleSetFilters = useCallback(async payload => {
    try {
      const nbfcs = await handleGetNBFCs(payload);
      const availableFilterOptions = nbfcs?.available_filter_options;
      const allEMITenures = availableFilterOptions?.tenures;
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

  useEffect(() => {
    const getIndicativeEMIs = async () => {
      try {
        let indicativeEMIPlanValues = '';
        console.log(
          'minROI,maxROI,nbfcsFilterForm?.value?.amount,nbfcsFilterForm?.value?.filters?.tenure,emiTenures,',
          prettifyJSON({
            minROI,
            maxROI,
            principal: nbfcsFilterForm?.value?.amount,
            tenure: nbfcsFilterForm?.value?.filters?.tenure,
          }),
        );
        const minROIPayload = {
          interest: minROI,
          principal: nbfcsFilterForm?.value?.amount,
          tenures: [nbfcsFilterForm?.value?.filters?.tenure],
        };
        const maxROIPayload = {
          interest: maxROI,
          principal: nbfcsFilterForm?.value?.amount,
          tenures: [nbfcsFilterForm?.value?.filters?.tenure],
        };
        console.log('minROIPayload of indicative EMI: ', minROIPayload);
        if (
          minROIPayload?.interest &&
          minROIPayload?.principal &&
          minROIPayload?.tenures
        ) {
          const indicativeEMIsResponse = await getIndicativeEMIsForLoanTenures(
            minROIPayload,
          );
          const indicativeEMIAmount =
            indicativeEMIsResponse?.[0]?.tentative_emi_amount;
          console.log(
            'getIndicativeEMIs->indicativeEMIAmount Finall-------: ',
            indicativeEMIAmount,
          );
          indicativeEMIPlanValues += `₹${indicativeEMIAmount}`;
        }
        if (
          maxROIPayload?.interest &&
          maxROIPayload?.principal &&
          maxROIPayload?.tenures
        ) {
          const indicativeEMIsResponse = await getIndicativeEMIsForLoanTenures(
            maxROIPayload,
          );
          const indicativeEMIAmount =
            indicativeEMIsResponse?.[0]?.tentative_emi_amount;
          console.log(
            'getIndicativeEMIs->indicativeEMIAmount Finall-------: ',
            indicativeEMIAmount,
          );
          indicativeEMIPlanValues += ` - ₹${indicativeEMIAmount}`;
        }
        console.log('Final indicativeEMIPlanValues: ', indicativeEMIPlanValues);
        setInstallmentTypeDecider({
          type:
            initialMemoizedInstallmentTypes?.includes('balloon') &&
            initialMemoizedInstallmentTypes?.includes('emi')
              ? 'balloonAndEMI'
              : initialMemoizedInstallmentTypes?.includes('emi')
              ? 'onlyEMI'
              : initialMemoizedInstallmentTypes?.includes('balloon')
              ? 'onlyBalloon'
              : null,
          recommended:
            initialMemoizedInstallmentTypes?.includes('balloon') &&
            initialMemoizedInstallmentTypes?.includes('emi')
              ? 'balloon'
              : initialMemoizedInstallmentTypes?.includes('emi')
              ? 'emi'
              : initialMemoizedInstallmentTypes?.includes('balloon')
              ? 'balloon'
              : null,
          data: [
            // For Balloon
            {
              label: '₹10,000 - ₹12,000',
              value: '10,000 - 12,000',
            },
            // For EMI
            {
              label: `${indicativeEMIPlanValues}`,
              value: `${indicativeEMIPlanValues}`,
            },
          ],
        });
      } catch (error) {
        throw error;
      }
    };
    getIndicativeEMIs();
  }, [
    minROI,
    maxROI,
    nbfcsFilterForm?.value?.amount,
    nbfcsFilterForm?.value?.filters?.tenure,
    initialMemoizedInstallmentTypes,
  ]);

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

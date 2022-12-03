import {useEffect, useState, useCallback} from 'react';
import {getLMSLoanById} from 'services';

export const useGetLoanApplicationEMI = (loanId, loanData) => {
  const [EMI, setEMI] = useState(null);
  const getEMI = useCallback(async () => {
    try {
      if (!loanData?.lms || !loanData?.lms?.financeId) {
        return;
      }
      const allCloudLMSLoan = await getLMSLoanById(loanId);
      const emi = allCloudLMSLoan?.EMI;
      setEMI(emi);
    } catch (error) {
      return error;
    }
  }, [loanId, loanData]);

  useEffect(() => {
    getEMI();
  }, [getEMI]);

  return EMI;
};

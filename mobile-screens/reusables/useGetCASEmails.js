import {useEffect, useState} from 'react';
import {getCASEmails} from 'services';

const useGetCASEmails = () => {
  const [CASEmails, setCASEmails] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let CASEmailsResponse = await getCASEmails();
        if (CASEmailsResponse) {
          setCASEmails(CASEmailsResponse);
        }
      } catch (error) {
        console.log('useGetCASEmails hook api call error');
        return error;
      }
    })();
  }, []);

  return CASEmails;
};

export default useGetCASEmails;

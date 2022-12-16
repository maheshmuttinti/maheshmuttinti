import {useMemo} from 'react';
import useUser from './useUser';

export const useAuthentication = () => {
  const user = useUser();
  console.log('useAuthentication->user---------: ', user);

  const isPhoneNumberVerified = useMemo(
    () => user?.attributes?.map(item => item.type)?.includes('mobile_number'),
    [user],
  );
  const isEmailVerified = useMemo(
    () => user?.attributes?.map(item => item.type)?.includes('email'),
    [user],
  );
  return {user, isPhoneNumberVerified, isEmailVerified};
};

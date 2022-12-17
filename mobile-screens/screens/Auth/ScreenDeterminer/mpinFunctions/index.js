export const getEnterMPINStatusByUserAuthenticatedWithMPIN =
  isUserLoggedInWithMPIN => {
    if (isUserLoggedInWithMPIN !== null) {
      if (isUserLoggedInWithMPIN === true) {
        return 'redirect_to_dashboard';
      } else {
        return 'set_pin_success';
      }
    } else {
      return 'set_pin_success';
    }
  };

export const getSetMPINStatusByUserAuthenticatedWithMPIN =
  isUserLoggedInWithMPIN => {
    if (isUserLoggedInWithMPIN !== null) {
      if (isUserLoggedInWithMPIN === true) {
        return 'redirect_to_dashboard';
      } else {
        return 'set_pin_pending';
      }
    } else {
      return 'set_pin_pending';
    }
  };

export const getMPINStatus = (user, isUserLoggedInWithMPIN) => {
  const mpinStatus = user?.profile?.meta?.mpin_set;

  switch (mpinStatus) {
    case 'skip':
      return 'skipped';
    case true:
      return getEnterMPINStatusByUserAuthenticatedWithMPIN(
        isUserLoggedInWithMPIN,
      );
    default:
      return getSetMPINStatusByUserAuthenticatedWithMPIN(
        isUserLoggedInWithMPIN,
      );
  }
};

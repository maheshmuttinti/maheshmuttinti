const deepLinkConfig = {
  screens: {
    Protected: {
      screens: {
        LoanApplication: 'signzy/video',
        CAMSSuccess: 'cams/lien-marking',
      },
    },
    General: {
      screens: {
        CasEmailVerificationStatus: 'cas-email-verification-status',
        ScreenDeterminer: 'social-login-status',
      },
    },
  },
};

const linking = {
  prefixes: ['finezzy://'],
  config: deepLinkConfig,
};

export {deepLinkConfig, linking};

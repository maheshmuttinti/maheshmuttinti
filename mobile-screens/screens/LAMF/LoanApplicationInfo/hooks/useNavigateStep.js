export const useNavigateStep = () => {
  const navigateStep = step => {
    switch (step) {
      case 'pending':
        return 1;
      case 'basic_details':
        return 2;
      case 'upload_proof':
        return 3;
      case 'video_verification':
        return 4;
      case 'bank_verification':
        return 5;
      case 'loan_agreement':
        return 6;
      case 'completed':
        return 6;
      default:
        return 1;
    }
  };
  return navigateStep;
};

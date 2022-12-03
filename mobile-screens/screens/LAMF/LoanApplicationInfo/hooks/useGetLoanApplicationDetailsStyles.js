import {useTheme} from 'theme';

export const useGetLoanApplicationDetailsStyles = () => {
  const theme = useTheme();
  const headingStyles = {
    color: theme.colors.primaryBlue,
    fontWeight: theme.fontWeights.veryBold,
    ...theme.fontSizes.large,
    paddingBottom: 8,
  };

  const labelValueStyles = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  };
  const titleStyles = {
    ...theme.fontSizes.largeMedium,
    fontWeight: theme.fontWeights.lightBold,
    color: theme.colors.text,
    flex: 1 / 2,
  };
  const valueStyles = {
    ...theme.fontSizes.largeMedium,
    fontWeight: theme.fontWeights.moreBold,
    color: theme.colors.text,
    flex: 1 / 2,
    textAlign: 'right',
  };
  return {labelValueStyles, titleStyles, valueStyles, headingStyles};
};

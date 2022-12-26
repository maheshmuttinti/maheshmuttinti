/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useState, useEffect, useRef, useCallback} from 'react';
import {View} from 'react-native';
import ScreenWrapper from '../../hocs/screenWrapperWithoutBackButton';
import HomeTabs from '../../TabNavigator';
import {useTheme} from 'theme';
import {
  generateUserPortfolio,
  getDashboardPreApprovedLoanAmount,
  getLatestCASStatusOfNBFC,
  getNBFCs,
  getUserPreApprovedLoanAmount,
  getUserStage,
} from 'services';
import DashboardHeader from '../../reusables/dashboardHeader';
import LoanApplicationModal from './LoanApplicationModal';
import UserProgressGradientCard from './UserProgressGradientCard';
import Calculators from './Calculators';
import InvestingSection from './InvestingSection';
import ProfileCard from './ProfileCard';
import MoreFunds from './MoreFunds';
import Goals from './Goals';
import NewsAndArticles from './NewsAndArticles';
import WelcomeHeader from './WelcomeHeader';
import ExtraAddOns from './ExtraAddons';
import ExploreMoreReportsBanner from './ExploreMoreReportsBanner';
import UpcomingPayments from './UpcomingPayments';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector, shallowEqual} from 'react-redux';
import Config from 'react-native-config';
import {debugLog, prettifyJSON} from 'utils';

const Dashboard = ({navigation, route}) => {
  const theme = useTheme();
  const showLoanApplicationModal = route?.params?.showLoanApplicationModal;
  const [visible, setVisible] = useState(showLoanApplicationModal);
  const [showBannerSpace, setShowBannerSpace] = useState(true);
  const [dashboardLoanAmount, setDashboardLoanAmount] = useState(null);
  const getDashboardPreApprovedLoanAmountFnRef = useRef(() => {});
  const [userStage, setUserStage] = useState(null);
  const [refreshOnScreenFocus, setRefreshOnScreenFocus] = useState(null);

  const noLoanAmountLimits =
    Config.MOCK_ENVIRONMENT === 'STAGING' ? 'true' : '';

  const {select_pan} = useSelector(
    ({lamf}) => ({
      select_pan: lamf.select_pan,
    }),
    shallowEqual,
  );

  getDashboardPreApprovedLoanAmountFnRef.current = async () => {
    try {
      const dashboardLoanAmountResponse =
        await getDashboardPreApprovedLoanAmount(noLoanAmountLimits);

      if (dashboardLoanAmountResponse?.message) {
        setDashboardLoanAmount(dashboardLoanAmountResponse);
      } else {
        setDashboardLoanAmount(
          dashboardLoanAmountResponse?.total_pre_approved_loan_amount,
        );
      }
    } catch (error) {
      return error;
    }
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          setRefreshOnScreenFocus(true);
          if (showBannerSpace) {
            const userStageResponse = await getUserStage(noLoanAmountLimits);
            setUserStage(userStageResponse);
          }
        } catch (error) {
          return error;
        }
      })();
      return () => {
        setRefreshOnScreenFocus(false);
      };
    }, [showBannerSpace]),
  );

  useFocusEffect(
    useCallback(() => {
      if (select_pan) {
        setVisible(true);
      }
      return () => {
        setVisible(false);
      };
    }, [select_pan]),
  );

  useEffect(() => {
    getDashboardPreApprovedLoanAmountFnRef.current();
  }, []);

  const handleApplyNow = async () => {
    try {
      const nbfcCode = Config.DEFAULT_NBFC_CODE;
      const casRefreshResponse = await getLatestCASStatusOfNBFC(nbfcCode);

      debugLog('casRefreshResponse: ', casRefreshResponse);

      const refreshableCASDataProvidersForNBFC = Object.entries(
        casRefreshResponse?.cas_requests,
      )
        ?.filter(([key, value]) => value?.needs_refresh === true)
        ?.map(item => item[0]);

      if (refreshableCASDataProvidersForNBFC?.length > 0) {
        debugLog(
          'refreshableCASDataProvidersForNBFC: ',
          refreshableCASDataProvidersForNBFC,
        );
        navigation.navigate('Protected', {
          screen: 'UpdatePortfolio',
          params: {
            providers: refreshableCASDataProvidersForNBFC,
          },
        });
      } else {
        debugLog('Nothing need to be refreshed....');
        navigation.navigate('LAMFV2', {
          screen: 'LoanAmountSelection',
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const handleGeneratePortfolio = async () => {
    try {
      const generateUserPortfolioResponse = await generateUserPortfolio();
      debugLog(
        'generateUserPortfolioResponse: ',
        prettifyJSON(generateUserPortfolioResponse),
      );

      return true;
    } catch (error) {
      throw error;
    }
  };

  const handleGetUserPreApprovedLoanAmount = async () => {
    try {
      const getUserPreApprovedLoanAmountResponse =
        await getUserPreApprovedLoanAmount();
      debugLog(
        'getUserPreApprovedLoanAmountResponse: ',
        prettifyJSON(getUserPreApprovedLoanAmountResponse),
      );

      return getUserPreApprovedLoanAmountResponse;
    } catch (error) {
      throw error;
    }
  };
  const handleGetNBFCs = async () => {
    try {
      const getNBFCsResponse = await getNBFCs();
      debugLog('getNBFCsResponse: ', prettifyJSON(getNBFCsResponse));

      return getNBFCsResponse;
    } catch (error) {
      throw error;
    }
  };

  const handleUploadNow = async () => {
    try {
      const nbfcCode = Config.DEFAULT_NBFC_CODE;
      const casRefreshResponse = await getLatestCASStatusOfNBFC(nbfcCode);
      debugLog('casRefreshResponse: ', casRefreshResponse);

      const refreshableCASDataProvidersForNBFC = Object.entries(
        casRefreshResponse?.cas_requests,
      )
        ?.filter(([key, value]) => value?.needs_refresh === true)
        ?.map(item => item[0]);

      if (refreshableCASDataProvidersForNBFC?.length > 0) {
        debugLog(
          'refreshableCASDataProvidersForNBFC: ',
          refreshableCASDataProvidersForNBFC,
        );
        navigation.navigate('Protected', {
          screen: 'UpdatePortfolio',
          params: {
            providers: refreshableCASDataProvidersForNBFC,
          },
        });
      } else {
        await handleGeneratePortfolio();
        const minMaxPreApprovedLoanAmount =
          await handleGetUserPreApprovedLoanAmount();
        const nbfcs = await handleGetNBFCs();
        console.log('handleGetNBFCs->nbfcs: ', nbfcs);
        console.log(
          'minMaxPreApprovedLoanAmount----------: ',
          minMaxPreApprovedLoanAmount,
        );
        navigation.navigate('LAMFV2', {
          screen: 'LoanAmountSelection',
          params: {
            loanAmount: minMaxPreApprovedLoanAmount?.max_eligible_loan,
            minLoanAmount: minMaxPreApprovedLoanAmount?.min_eligible_loan,
            maxLoanAmount: minMaxPreApprovedLoanAmount?.max_eligible_loan,
            availableFilterOptions: nbfcs?.available_filter_options,
          },
        });
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <ScreenWrapper backgroundColor={theme.colors.backgroundBlue}>
      <LoanApplicationModal
        visible={visible}
        setVisible={setVisible}
        dashboardLoanAmount={dashboardLoanAmount}
        navigation={navigation}
      />
      <View style={{paddingHorizontal: 17, paddingTop: 24}}>
        <DashboardHeader onNavIconClick={() => navigation.openDrawer()} />

        <WelcomeHeader
          refreshOnScreenFocus={refreshOnScreenFocus}
          wrapperStyles={{paddingTop: 36.5}}
        />

        {showBannerSpace && (
          <UserProgressGradientCard
            setShowBannerSpace={setShowBannerSpace}
            showBannerSpace={showBannerSpace}
            showModal={setVisible}
            navigation={navigation}
            wrapperStyles={{paddingTop: 16}}
            userStage={userStage}
            onUploadNow={handleUploadNow}
          />
        )}
        <ProfileCard
          refreshOnScreenFocus={refreshOnScreenFocus}
          wrapperStyles={{paddingTop: 34}}
        />
        <Calculators wrapperStyles={{paddingTop: 24}} />
      </View>
      <InvestingSection wrapperStyles={{paddingTop: 32}} />
      <View style={{paddingHorizontal: 17, paddingTop: 24}}>
        <MoreFunds />
        <Goals wrapperStyles={{paddingTop: 24}} />
        <UpcomingPayments wrapperStyles={{paddingTop: 24}} />
        <ExtraAddOns wrapperStyles={{paddingTop: 24}} />
        <NewsAndArticles wrapperStyles={{paddingTop: 24}} />
      </View>

      <ExploreMoreReportsBanner wrapperStyles={{paddingTop: 40}} />

      <View style={{paddingHorizontal: 17, marginBottom: 120}} />
    </ScreenWrapper>
  );
};

export default function () {
  return <HomeTabs HomeScreen={Dashboard} />;
}

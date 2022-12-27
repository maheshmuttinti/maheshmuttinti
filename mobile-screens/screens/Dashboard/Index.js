/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {View} from 'react-native';
import ScreenWrapper from '../../hocs/screenWrapperWithoutBackButton';
import HomeTabs from '../../TabNavigator';
import {useTheme} from 'theme';
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
import {useHandleDashboardStatesAndCallbacks} from './hooks/useHandleDashboardStatesAndCallbacks';

const Dashboard = ({navigation, route}) => {
  const theme = useTheme();
  const showLoanApplicationModal = route?.params?.showLoanApplicationModal;

  const {
    visible,
    setVisible,
    dashboardLoanAmount,
    refreshOnScreenFocus,
    showBannerSpace,
    userStageCardContent,
    setShowBannerSpace,
    handleUploadNow,
    handleApplyNow,
  } = useHandleDashboardStatesAndCallbacks(
    showLoanApplicationModal,
    navigation,
  );

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

        {showBannerSpace && userStageCardContent ? (
          <UserProgressGradientCard
            setShowBannerSpace={setShowBannerSpace}
            showBannerSpace={showBannerSpace}
            showModal={setVisible}
            navigation={navigation}
            wrapperStyles={{paddingTop: 16}}
            userStageCardContent={userStageCardContent}
            onUploadNow={handleUploadNow}
            onApplyNow={handleApplyNow}
          />
        ) : null}
        <ProfileCard
          refreshOnScreenFocus={refreshOnScreenFocus}
          wrapperStyles={{paddingTop: 34}}
        />
        {/* <Calculators wrapperStyles={{paddingTop: 24}} /> */}
      </View>
      {/* <InvestingSection wrapperStyles={{paddingTop: 32}} /> */}
      {/* <View style={{paddingHorizontal: 17, paddingTop: 24}}>
        <MoreFunds />
        <Goals wrapperStyles={{paddingTop: 24}} />
        <UpcomingPayments wrapperStyles={{paddingTop: 24}} />
        <ExtraAddOns wrapperStyles={{paddingTop: 24}} />
        <NewsAndArticles wrapperStyles={{paddingTop: 24}} />
      </View> */}

      {/* <ExploreMoreReportsBanner wrapperStyles={{paddingTop: 40}} /> */}

      <View style={{paddingHorizontal: 17, marginBottom: 120}} />
    </ScreenWrapper>
  );
};

export default function () {
  return <HomeTabs HomeScreen={Dashboard} />;
}

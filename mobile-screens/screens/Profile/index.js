/* eslint-disable react-native/no-inline-styles */
import {View, TouchableOpacity, BackHandler, Text} from 'react-native';
import * as React from 'react';
import {useCallback, useRef, useState} from 'react';
import ScreenWrapper from '../../hocs/screenWrapperWithoutBackButton';
import {deleteAccount, logout} from 'services';
import {useDispatch} from 'react-redux';
import {clearAuth, setShowIntro, setIsUserLoggedInWithMPIN} from 'store';
import {
  Heading,
  TextButton,
  GradientCard,
  GroupText,
  BlackBodyText,
  GradientButton,
  SideBarOptions,
  Card,
  PrivacyPolicyFooterSection,
} from 'uin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CartIcon,
  BackArrow,
  ActionBanner2,
  ChevronArrowRight,
  NotificationsIcon,
  RiskProfileIcon,
  InvestingIcon,
  WatchListIcon,
  LoansIcon,
  MyGoalsIcon,
  TrackExpensesIcon,
  FamilyAccountsIcon,
  SettingsIcon,
  HelpAndSupportIcon,
  WarningIcon1,
} from 'assets';
import {useTheme} from 'theme';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Ripple from 'react-native-material-ripple';
import ProfileCard from './ProfileCard';
import Toast from 'react-native-toast-message';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import {useClearAsyncStorageKeys} from '../../reusables/useClearAsyncStorageKeys';

export default function () {
  const theme = useTheme();
  const navigation = useNavigation();
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [disableButton, setDisableButton] = useState(false);
  const [openConfirmDeletePopup, setOpenConfirmDeletePopup] = useState(false);

  const {clearStoreForLogout, clearStoreForDeleteAccount} =
    useClearAsyncStorageKeys();

  const handleLogout = async () => {
    try {
      setDisableButton(true);
      const logoutResponse = await logout();
      console.log('logoutResponse', logoutResponse);
      clearStoreForLogout();
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const deleteAccountResponse = await deleteAccount();
      console.log('deleteAccountResponse', deleteAccountResponse);
      clearStoreForDeleteAccount();
    } catch (error) {
      console.log('error', error);
    }
  };

  const toastConfig = {
    comingSoonPopMessage: () => (
      <Card
        style={{
          backgroundColor: theme.colors.backgroundYellow,
          paddingLeft: 17.25,
          marginHorizontal: 17,
          position: 'relative',
          screenTop: 0,
          borderRadius: 8,
          paddingVertical: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View>
          <WarningIcon1 />
        </View>
        <Text
          style={{
            ...theme.fontSizes.small,
            fontWeight: theme.fontWeights.moreBold,
            color: theme.colors.text,
            fontFamily: theme.fonts.regular,
            paddingLeft: 17.25,
            marginRight: 52,
          }}>
          Coming Soon!
        </Text>
      </Card>
    ),
  };

  const goBack = useRef(() => {});
  goBack.current = () => {
    navigation.jumpTo('Home');
  };

  const navOptions = [
    {
      leftIcon: (
        <CartIcon
          fill={
            selectedOptionIndex === 0 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      name: 'My Orders',
      rightIcon: (
        <ChevronArrowRight
          fill={
            selectedOptionIndex === 0 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      onClickCallback: () => {
        showComingSoonPopMessage();
        // callback();
        // navigation.navigate("Protected", { screen: "Dashboard" });
      },
    },

    {
      leftIcon: (
        <RiskProfileIcon
          fill={
            selectedOptionIndex === 1 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      name: 'Risk Profile',
      rightIcon: (
        <ChevronArrowRight
          fill={
            selectedOptionIndex === 1 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      onClickCallback: () => {
        showComingSoonPopMessage();
        // callback();
        // navigation.navigate("Protected", { screen: "Dashboard" });
      },
    },
    {
      leftIcon: (
        <InvestingIcon
          fill={
            selectedOptionIndex === 2 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      name: 'Start Investing',
      rightIcon: (
        <ChevronArrowRight
          fill={
            selectedOptionIndex === 2 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      onClickCallback: () => {
        showComingSoonPopMessage();
        // callback();
        // navigation.navigate("Protected", { screen: "Dashboard" });
      },
    },
    {
      leftIcon: (
        <WatchListIcon
          fill={
            selectedOptionIndex === 3 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      name: 'My Watchlist',
      rightIcon: (
        <ChevronArrowRight
          fill={
            selectedOptionIndex === 3 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      onClickCallback: () => {
        showComingSoonPopMessage();
        // callback();
        // navigation.navigate("Protected", { screen: "Dashboard" });
      },
    },
    {
      leftIcon: (
        <LoansIcon
          fill={
            selectedOptionIndex === 4 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      name: 'Loans',
      rightIcon: (
        <ChevronArrowRight
          fill={
            selectedOptionIndex === 4 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      onClickCallback: () => {
        // callback();
        navigation.navigate('Protected', {
          screen: 'LoanDashboard',
          params: {showLoanApplicationModal: true},
        });
      },
    },
    {
      leftIcon: (
        <MyGoalsIcon
          fill={
            selectedOptionIndex === 5 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      name: 'My Goals',
      rightIcon: (
        <ChevronArrowRight
          fill={
            selectedOptionIndex === 5 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      onClickCallback: () => {
        showComingSoonPopMessage();
        // callback();
        // navigation.navigate("Protected", { screen: "Dashboard" });
      },
    },
    {
      leftIcon: (
        <TrackExpensesIcon
          fill={
            selectedOptionIndex === 6 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      name: 'Track Expenses',
      rightIcon: (
        <ChevronArrowRight
          fill={
            selectedOptionIndex === 6 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      onClickCallback: () => {
        showComingSoonPopMessage();
        // callback();
        // navigation.navigate("Protected", { screen: "Dashboard" });
      },
    },
    {
      leftIcon: (
        <FamilyAccountsIcon
          fill={
            selectedOptionIndex === 7 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      name: 'Add Family Accounts',
      rightIcon: (
        <ChevronArrowRight
          fill={
            selectedOptionIndex === 7 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      onClickCallback: () => {
        showComingSoonPopMessage();
        // callback();
        // navigation.navigate("Protected", { screen: "Dashboard" });
      },
    },
    {
      leftIcon: (
        <NotificationsIcon
          fill={
            selectedOptionIndex === 8 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      name: 'Notifications',
      rightIcon: (
        <ChevronArrowRight
          fill={
            selectedOptionIndex === 8 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      onClickCallback: () => {
        showComingSoonPopMessage();
        // callback();
        // navigation.navigate("Protected", { screen: "Dashboard" });
      },
    },
    {
      leftIcon: (
        <SettingsIcon
          fill={
            selectedOptionIndex === 9 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      name: 'Settings',
      rightIcon: (
        <ChevronArrowRight
          fill={
            selectedOptionIndex === 9 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      onClickCallback: () => {
        showComingSoonPopMessage();
        // callback();
        // navigation.navigate("Protected", { screen: "Dashboard" });
      },
    },

    {
      leftIcon: (
        <HelpAndSupportIcon
          fill={
            selectedOptionIndex === 10 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      name: 'Help and Support',
      rightIcon: (
        <ChevronArrowRight
          fill={
            selectedOptionIndex === 10 ? theme.colors.primaryBlue : '#0A0521'
          }
        />
      ),
      onClickCallback: () => {
        showComingSoonPopMessage();
        // callback();
        // navigation.navigate("Protected", { screen: "Dashboard" });
      },
    },
  ];

  const handleOnSelectListItem = index => {
    return navOptions.forEach((_, idx) => {
      if (index === idx) {
        setSelectedOptionIndex(index);
      }
    });
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', goBack.current);
      setSelectedOptionIndex(null);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', goBack.current);
      };
    }, []),
  );

  const showComingSoonPopMessage = () => {
    Toast.show({
      type: 'comingSoonPopMessage',
      position: 'top',
      visibilityTime: 2000,
    });
  };

  return (
    <ScreenWrapper backgroundColor={theme.colors.primaryBlue}>
      <View
        style={{
          paddingTop: 24,
          marginBottom: 30,
          paddingHorizontal: 19,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              flex: 0.5 / 3,
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.jumpTo('Home');
              }}
              hitSlop={{top: 5, left: 5, right: 5, bottom: 10}}>
              <BackArrow fill={theme.colors.background} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignSelf: 'center',
              flex: 2 / 3,
            }}>
            <Heading
              style={{
                textAlign: 'center',
                fontWeight: theme.fontWeights.veryBold,
              }}>
              Profile
            </Heading>
          </View>
          <View
            style={{
              alignItems: 'flex-end',
              flex: 0.5 / 3,
            }}>
            <TouchableOpacity onPress={() => {}}>
              <CartIcon fill={theme.colors.background} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{alignItems: 'center'}}>
        <ProfileCard />
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          padding: 24,
        }}>
        <GradientCard
          style={{
            paddingLeft: 16,
            paddingRight: 8,
            paddingTop: 0,
          }}
          gradientColors={[
            theme.colors.backgroundBlue,
            theme.colors.backgroundBlue,
          ]}>
          <View style={{flexDirection: 'row', overflow: 'hidden'}}>
            <View style={{flex: 1 / 2, alignSelf: 'center', marginRight: 5}}>
              <GroupText>
                <BlackBodyText
                  style={{
                    fontSize: theme.fontSizes.large.fontSize,
                    lineHeight: 18,
                    fontWeight: theme.fontWeights.lightBold,
                  }}>
                  Don’t miss out on earning{' '}
                </BlackBodyText>
                <BlackBodyText
                  style={{
                    fontSize: theme.fontSizes.large.fontSize,
                    lineHeight: 18,
                    fontWeight: theme.fontWeights.veryBold,
                  }}>
                  ₹5000{' '}
                </BlackBodyText>
                <BlackBodyText
                  style={{
                    fontSize: theme.fontSizes.large.fontSize,
                    lineHeight: 18,
                    fontWeight: theme.fontWeights.lightBold,
                  }}>
                  today.
                </BlackBodyText>
              </GroupText>
              <View style={{paddingTop: 12}}>
                <GradientButton
                  gradientColors={['#3F76FF', '#003AC9'].reverse()}
                  extraStyles={{paddingTop: 0, paddingBottom: 0}}
                  fontSize={theme.fontSizes.small.fontSize}
                  textStyles={{lineHeight: 32}}
                  onPress={() => {}}
                  borderRadius={24}
                  textColor={'#ffffff'}>
                  Learn More
                </GradientButton>
              </View>
            </View>
            <View style={{flex: 1 / 2, alignSelf: 'flex-end'}}>
              <ActionBanner2 />
            </View>
          </View>
        </GradientCard>

        <View style={{paddingTop: 32}}>
          <SideBarOptions
            options={navOptions}
            handleOnSelectListItem={handleOnSelectListItem}
            selectedIndex={selectedOptionIndex}
            dividerOffsets={[7, 10]}
            lastDividerStyle={{marginBottom: 12}}
          />
        </View>

        <Ripple
          rippleColor={theme.colors.primaryBlue100}
          onPress={async () => {
            disableButton === true ? null : await handleLogout();
          }}>
          <TextButton
            style={{
              color: theme.colors.primaryBlue,
              fontWeight: theme.fontWeights.veryBold,
              paddingTop: 12,
              paddingBottom: 12,
            }}>
            Logout
          </TextButton>
        </Ripple>

        <Ripple
          rippleColor={theme.colors.primaryOrange100}
          onPress={async () => setOpenConfirmDeletePopup(true)}>
          <TextButton
            style={{
              color: theme.colors.text,
              paddingTop: 12,
              paddingBottom: 12,
            }}>
            Delete Account
          </TextButton>
        </Ripple>

        <View style={{paddingTop: 8}}>
          <PrivacyPolicyFooterSection
            topSectionStyle={{justifyContent: 'center'}}
            bottomTextStyle={{textAlign: 'center'}}
          />
        </View>
        <View style={{marginBottom: 64}} />
      </View>
      <Toast config={toastConfig} />
      <ConfirmDeleteModal
        isVisible={openConfirmDeletePopup}
        heading={'All data would be lost, are you sure?'}
        onCancel={() => setOpenConfirmDeletePopup(false)}
        onDelete={async () => await handleDeleteAccount()}
      />
    </ScreenWrapper>
  );
}

import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Dashboard from '../DrawerNavigator';
import {useTheme} from 'theme';
import ChooseNBFC from '../screens/LAMF/ChooseNBFC';
import CompareNBFC from '../screens/LAMF/CompareNBFCs';
import SelectSchemes from '../screens/LAMF/SelectSchemes';
import LienMarking from '../screens/LAMF/LienMarking';
import UpdatePortfolio from '../screens/NewCASFlow/screens/UpdatePortfolio';
import CamsSuccess from '../screens/LAMF/CAMSSuccess';
import LoanApplication from '../screens/LAMF/LoanApplication';
import NextSteps from '../screens/LAMF/NextSteps';
import LoanSuccess from '../screens/LAMF/LoanApplication/Steps/Success';
import LoanDashboard from '../screens/LAMF/LoanDashboard';
import LoanApplicationInfo from '../screens/LAMF/LoanApplicationInfo';
import UploadCAS from '../screens/UploadCAS';
import ImportPortfolio from '../screens/UploadCAS/ImportPortfolio';
import UploadPortfolio from '../screens/UploadCAS/UploadPortfolio';
import FAQ from '../screens/UploadCAS/FAQ';
import DigioSDK from '../reusables/digioSDK';
import WebBrowser from '../reusables/WebBrowser';
import CombinedUpdateCASAndLienMarking from '../screens/NewCASFlow/screens/CombinedUpdateCASAndLienMarking';

const Protected = () => {
  const Stack = createStackNavigator();
  const theme = useTheme();

  useEffect(() => {
    console.log('*******Protected Stack Mounted****');
    return () => {
      console.log('*******Protected Stack UnMounted****');
    };
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.backgroundBlue,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: 'blue',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      initialRouteName={'Drawer'}>
      <Stack.Screen
        name="Drawer"
        options={{headerShown: false}}
        component={Dashboard}
      />
      <Stack.Screen
        name="ChooseNBFC"
        options={{headerShown: false}}
        component={ChooseNBFC}
      />
      <Stack.Screen
        name="CompareNBFC"
        options={{
          title: 'Compare NBFCs',
          headerStyle: {
            backgroundColor: theme.colors.primaryBlue,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: theme.fonts.regular,
            ...theme.fontSizes.large,
          },
        }}
        component={CompareNBFC}
      />
      <Stack.Screen
        name="SelectSchemes"
        options={{headerShown: false}}
        component={SelectSchemes}
      />
      <Stack.Screen
        name="CombinedUpdateCASAndLienMarking"
        options={{headerShown: false}}
        component={CombinedUpdateCASAndLienMarking}
      />
      <Stack.Screen
        name="LienMarking"
        options={{
          title: 'Loans Against Mutual Funds',
          headerStyle: {
            backgroundColor: theme.colors.primary,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: theme.fonts.regular,
            ...theme.fontSizes.large,
          },
        }}
        component={LienMarking}
      />
      <Stack.Screen
        name="UpdatePortfolio"
        options={{
          title: 'Loans Against Mutual Funds',
          headerStyle: {
            backgroundColor: theme.colors.primary,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: theme.fonts.regular,
            ...theme.fontSizes.large,
          },
        }}
        component={UpdatePortfolio}
      />
      <Stack.Screen
        name="CAMSSuccess"
        options={{
          title: 'Loans Against Mutual Funds',
          headerStyle: {
            backgroundColor: theme.colors.primary,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: theme.fonts.regular,
            ...theme.fontSizes.large,
          },
        }}
        component={CamsSuccess}
      />
      <Stack.Screen
        name="NextSteps"
        options={{
          title: 'Loans Against Mutual Funds',
          headerStyle: {
            backgroundColor: theme.colors.primary,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: theme.fonts.regular,
            ...theme.fontSizes.large,
          },
        }}
        component={NextSteps}
      />
      <Stack.Screen
        name="LoanApplication"
        options={{
          title: 'Loans Against Mutual Funds',
          headerStyle: {
            backgroundColor: theme.colors.backgroundBlue,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: theme.fonts.regular,
            ...theme.fontSizes.large,
          },
        }}
        component={LoanApplication}
      />
      <Stack.Screen
        name="LoanSuccess"
        options={{
          title: 'Loans Against Mutual Funds',
          headerStyle: {
            backgroundColor: theme.colors.primary,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: theme.fonts.regular,
            ...theme.fontSizes.large,
          },
        }}
        component={LoanSuccess}
      />
      <Stack.Screen
        name="LoanDashboard"
        options={{
          title: 'Loans Against Mutual Funds',
          headerStyle: {
            backgroundColor: theme.colors.primary,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: theme.fonts.regular,
            ...theme.fontSizes.large,
          },
        }}
        component={LoanDashboard}
      />
      <Stack.Screen
        name="LoanApplicationInfo"
        options={{
          title: 'Loans Against Mutual Funds',
          headerStyle: {
            backgroundColor: theme.colors.primary,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: theme.fonts.regular,
            ...theme.fontSizes.large,
          },
        }}
        component={LoanApplicationInfo}
      />
      <Stack.Screen
        name="UploadCAS"
        options={{
          headerShown: false,
        }}
        component={UploadCAS}
      />
      <Stack.Screen
        name="ImportPortfolio"
        options={{
          headerShown: false,
        }}
        component={ImportPortfolio}
      />
      <Stack.Screen
        name="UploadPortfolio"
        options={{
          headerShown: false,
        }}
        component={UploadPortfolio}
      />
      <Stack.Screen
        name="FAQ"
        options={{
          headerShown: false,
        }}
        component={FAQ}
      />
      <Stack.Screen
        name="WebBrowser"
        options={{headerShown: false}}
        component={WebBrowser}
      />
      <Stack.Screen
        name="DigioSDK"
        options={{headerShown: false}}
        component={DigioSDK}
      />
    </Stack.Navigator>
  );
};

export default Protected;

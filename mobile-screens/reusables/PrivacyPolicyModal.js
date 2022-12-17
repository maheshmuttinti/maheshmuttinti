/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import Config from 'react-native-config';
import Modal from 'react-native-modal';
import {WebViewComponent} from './WebView_new';
import {Card} from 'uin';
import {View, ActivityIndicator} from 'react-native';
import Ripple from 'react-native-material-ripple';
import {CloseCircleWithCrossIcon} from 'assets';
import {useTheme} from 'theme';

export const PrivacyPolicyModal = ({
  open,
  setOpen,
  onClose = () => {},
  navigation,
}) => {
  const theme = useTheme();
  const TC_URL = `${Config.FINEZZY_PRIVACY_POLICY_URL}`;
  return (
    <>
      <Modal
        isVisible={open}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        animationType="fade"
        onBackdropPress={() => {
          setOpen(false);
          onClose();
        }}
        style={{
          justifyContent: 'flex-end',
          margin: 24,
          borderRadius: 12,
        }}>
        <Card style={{width: '100%', height: '90%', borderRadius: 12}}>
          <View style={{width: '100%'}}>
            <View style={{alignSelf: 'flex-end', right: 12, top: 12}}>
              <Ripple
                rippleColor={theme.colors.background}
                onPress={() => {
                  onClose();
                }}
                rippleContainerBorderRadius={24 / 2}>
                <View style={{padding: 2}}>
                  <CloseCircleWithCrossIcon fill={theme.colors.text} />
                </View>
              </Ripple>
            </View>
          </View>
          <WebViewComponent
            url={TC_URL}
            navigation={navigation}
            containerStyle={{height: '100%', marginTop: 24}}
            loaderComponent={() => <Loader />}
          />
        </Card>
      </Modal>
    </>
  );
};

const Loader = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ActivityIndicator
        color={'#555CFA'}
        style={{
          marginRight: 20,
        }}
      />
    </View>
  );
};

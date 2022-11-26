/* eslint-disable react-native/no-inline-styles */
import {Platform, TouchableOpacity, View} from 'react-native';
import * as React from 'react';
import {useState, useEffect, useCallback, useRef} from 'react';
import {BaseTextInput, Heading, GradientButton} from 'uin';
import {useTheme} from 'theme';
import {EditPencilProfile} from 'assets';
import {getShortName} from 'utils';
import {getUser, updateUserProfile} from 'services';
import {useFocusEffect} from '@react-navigation/native';

export default function ProfileCard({}) {
  const [name, setName] = useState(null);
  const [autoFocusInput, setAutoFocusInput] = useState(false);
  const [user, setUser] = useState(null);
  const theme = useTheme();

  const handleGetUserName = async () => {
    try {
      const userResponse = await getUser();

      setUser(userResponse);
      let existingUserName = userResponse?.profile?.meta?.username;
      if (existingUserName) {
        setName(existingUserName);
      }
    } catch (error) {
      return error;
    }
  };

  const handleUpdateUserName = useRef(() => {});

  handleUpdateUserName.current = async () => {
    try {
      let meta = {
        meta: {...user?.profile?.meta, username: name.trim()},
      };
      const updateProfilePayload = {
        ...meta,
      };
      const updateProfileResponse = await updateUserProfile(
        updateProfilePayload,
      );
      if (updateProfileResponse) {
        setName(updateProfileResponse?.profile?.meta?.username);
      }
    } catch (error) {
      return error;
    }
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (!autoFocusInput) {
          await handleGetUserName();
        }
      })();
    }, [autoFocusInput]),
  );

  useEffect(() => {
    (async () => {
      handleUpdateUserName.current();
    })();
  }, [autoFocusInput]);

  return (
    <View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 73,
            width: 73,
            borderRadius: 73 / 2,
            backgroundColor: theme.colors.backgroundBlue,
            marginBottom: 10,
          }}>
          <Heading
            style={{
              color: theme.colors.primaryBlue,
              ...theme.fontSizes.heading5,
              fontWeight: '800',
            }}>
            {getShortName(name)}
          </Heading>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            alignItems: 'center',
          }}>
          <View>
            {autoFocusInput ? (
              <BaseTextInput
                onChangeText={text => setName(text)}
                extraTextStyles={{
                  backgroundColor: theme.colors.primaryBlue,
                  width: 206,
                  color: '#fff',
                  fontSize: 24,
                  lineHeight: 24,
                  fontWeight: theme.fontWeights.veryBold,
                  textAlign: 'center',
                }}
                textInputViewStyle={{borderRadius: 12}}
                autoFocus={autoFocusInput}
                onFieldBlur={() => setAutoFocusInput(false)}
                // caretHidden={true}
                selectionColor={'#fff'}
                value={name}
                error={''}
              />
            ) : (
              <Heading
                style={{
                  color: '#fff',
                  fontSize: 24,
                  lineHeight: 24,
                  width: 206,
                  fontWeight: theme.fontWeights.veryBold,
                  paddingVertical: Platform.OS === 'ios' ? 8 : 11.5,
                  textAlign: 'center',
                }}>
                {name}
              </Heading>
            )}
          </View>
          <TouchableOpacity
            onPress={() => setAutoFocusInput(true)}
            style={{
              marginLeft: autoFocusInput ? 0 : name?.length > 24 ? 16 : 0,
            }}>
            <EditPencilProfile fill={'#fff'} />
          </TouchableOpacity>
        </View>
        <View style={{paddingTop: 4, paddingBottom: 16}}>
          <GradientButton
            gradientColors={['#FFE580', '#FFB500'].reverse()}
            extraStyles={{paddingVertical: 0, height: 24, width: 160}}
            fontSize={theme.fontSizes.small.fontSize}>
            Complete Profile
          </GradientButton>
        </View>
      </View>
    </View>
  );
}

/* eslint-disable react-native/no-inline-styles */
import {View, Text} from 'react-native';
import React from 'react';
import {useTheme} from 'theme';
import {TickCircle} from 'assets';

export default function Test() {
  const theme = useTheme();
  return (
    <View
      style={{
        marginTop: 32,
        flex: 1 / 2,
        paddingHorizontal: 10,
        position: 'relative',
      }}>
      <View
        style={{
          position: 'relative',
        }}>
        <View
          style={{
            height: 20, // icon height - configurable
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'yellow',
          }}>
          <View
            style={{
              height: 1,
              width: '100%',
              backgroundColor: 'blue',
            }}
          />
        </View>

        <View
          style={{
            zIndex: 2,
            position: 'absolute',
            top: 0,
            height: 100,
            // backgroundColor: 'red',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              alignItems: 'center',
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 20, // icon height - configurable
                height: 20, // icon height - configurable
                borderWidth: 3,
                borderColor: theme.colors.success,
                borderRadius: 25,
                backgroundColor: theme.colors.backgroundBlue,
              }}>
              <TickCircle />
            </View>
            <View style={{width: 70, marginTop: 5}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 12,
                }}>
                HOLDINGS-
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 12,
                }}>
                KARVY
              </Text>
            </View>
          </View>

          <View
            style={{
              alignItems: 'center',
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 20, // icon height - configurable
                height: 20, // icon height - configurable
                backgroundColor: theme.colors.primaryBlue,
                borderWidth: 3,
                borderColor: theme.colors.primaryBlue,
                borderRadius: 15,
              }}
            />
            <Text
              style={{
                textAlign: 'center',
                width: 70,
                fontSize: 12,
              }}>
              HOLDINGS-
            </Text>
            <Text
              style={{
                textAlign: 'center',
                width: 70,
                fontSize: 12,
              }}>
              CAMS
            </Text>
          </View>

          {/* <View
            style={{
              alignItems: 'center',
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 20, // icon height - configurable
                height: 20, // icon height - configurable
                backgroundColor: '#fff',
                borderWidth: 2,
                borderColor: '#D1D5DB',
                borderRadius: 15,
              }}
            />
            <Text
              style={{
                textAlign: 'center',
                width: 70,
                fontSize: 12,
              }}>
              LIEN MARK-
            </Text>
            <Text
              style={{
                textAlign: 'center',
                width: 70,
                fontSize: 12,
              }}>
              KARVY
            </Text>
          </View> */}

          {/* <View
            style={{
              alignItems: 'center',
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 20, // icon height - configurable
                height: 20, // icon height - configurable
                backgroundColor: '#fff',
                borderWidth: 2,
                borderColor: '#D1D5DB',
                borderRadius: 15,
              }}
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 12,
              }}>
              LIEN MARK-
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 12,
              }}>
              CAMS
            </Text>
          </View> */}
        </View>
      </View>
    </View>
  );
}

import React, {useState, useContext, useCallback} from 'react';
import {View, Platform, ActivityIndicator, Alert} from 'react-native';

import DocumentPicker from 'react-native-document-picker';
import {
  UploadyContext,
  useItemFinishListener,
  useBatchStartListener,
  useBatchProgressListener,
  useBatchFinishListener,
} from '@rpldy/native-uploady';
import {TouchableOpacity} from 'react-native';
import * as RNFS from 'react-native-fs';
import {PermissionsAndroid} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {showToast} from 'utils';

export default function ({onDone, multiple, mode, type, child, disable}) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const uploadyContext = useContext(UploadyContext);

  useItemFinishListener(item => {
    const response = item.uploadResponse.data;
    if (typeof response === 'string') {
      files.push(JSON.parse(response));
    } else {
      files.push(response);
    }
    setFiles([...files]);
  });

  useBatchProgressListener(batch => {});

  useBatchStartListener(batch => {
    setUploading(false);
    //setFiles([]);
  });

  useBatchFinishListener(batch => {
    onDone(files);
    setUploading(false);
  });

  const pickFromCamera = useCallback(async () => {
    let options = {
      mediaType: 'photo',
      // saveToPhotos: true,
    };
    try {
      let cameraPermissionInAndroid = null;

      if (Platform.OS === 'android') {
        cameraPermissionInAndroid = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'App Camera Permission',
            message: 'App needs access to your camera ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
      }
      if (
        cameraPermissionInAndroid === PermissionsAndroid.RESULTS.GRANTED ||
        Platform.OS === 'ios'
      ) {
        await launchCamera(options, async response => {
          if (
            response.errorCode === 'others' ||
            response.errorCode === 'permission'
          ) {
            showToast('No permission to open camera');
          } else {
            let _files = await Promise.all(
              response?.assets?.map(async asset => {
                let imagePath = `${
                  RNFS.DocumentDirectoryPath
                }/${new Date().toISOString()}`.replace(/:/g, '-');

                try {
                  if (Platform.OS === 'ios') {
                    asset.name = asset?.fileName;
                  } else if (Platform.OS === 'android') {
                    await RNFS.copyFile(asset?.uri, imagePath);
                    asset.name = asset?.fileName;
                    asset.uri = 'file://' + imagePath;
                  }

                  return asset;
                } catch (error) {
                  console.log('Launch Camera Failed', error);
                  showToast(JSON.stringify(error));
                  console.log('Failed copying....', error);
                }
              }),
            );
            uploadyContext.upload(_files);
          }
        });
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      Alert.alert(JSON.stringify(err));
      throw err;
    }
  }, [uploadyContext]);

  const pickFromGallery = useCallback(async () => {
    try {
      if (multiple) {
        const res = await DocumentPicker.pickMultiple({
          type:
            mode === 'images'
              ? [DocumentPicker.types.images]
              : [DocumentPicker.types.allFiles],
        });
        uploadyContext.upload(res);
      } else {
        if (Platform.OS === 'ios') {
          let options = {
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
          };
          await launchImageLibrary(options, async response => {
            if (response.errorCode === 'others') {
              Alert.alert('No permission to open camera');
            } else {
              let _files = await Promise.all(
                response?.assets?.map(async asset => {
                  let imagePath = `${
                    RNFS.DocumentDirectoryPath
                  }/${new Date().toISOString()}`.replace(/:/g, '-');

                  try {
                    if (Platform.OS === 'ios') {
                      asset.name = asset?.fileName;
                    } else if (Platform.OS === 'android') {
                      await RNFS.copyFile(asset?.uri, imagePath);
                      asset.name = asset?.fileName;
                      asset.uri = 'file://' + imagePath;
                    }

                    return asset;
                  } catch (error) {
                    console.log('Launch Camera Failed', error);
                    Alert.alert(JSON.stringify(error));
                    console.log('Failed copying....', error);
                  }
                }),
              );
              uploadyContext.upload(_files);
            }
          });
        } else {
          const res = await DocumentPicker.pick({
            type:
              mode === 'images'
                ? [DocumentPicker.types.images]
                : [DocumentPicker.types.allFiles],
          });
          console.log(res, 'aamna');
          uploadyContext.upload(res);
          setFiles(res);
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled pickFromGallery ');
      } else {
        throw err;
      }
    }
  }, [uploadyContext, multiple]);

  return (
    <View>
      {uploading ? (
        <View>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      ) : (
        <View>
          <TouchableOpacity
            disabled={disable}
            onPress={() => {
              type === 'local' ? pickFromGallery() : pickFromCamera();
            }}>
            {child}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {ActivityIndicator, Platform, Text} from 'react-native';
import FileUpload from './Upload';
import Config from 'react-native-config';
import {useTheme} from 'theme';
import {mobileStore} from 'store';

export default function ({
  fileUuid = null,
  onDelete = () => {},
  type,
  disable = false,
  ...props
}) {
  const [enableFileUpload, setEnableFileUpload] = useState(false);
  const theme = useTheme();
  const [file, setFile] = useState([]);

  let destinationConfig = {
    url: `${Config.FILES_API_URL}/upload`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${mobileStore.getState().auth.accessToken}`,
    },
  };

  return (
    <>
      <FileUpload
        disable={disable}
        mode="images"
        enableFileUpload={enableFileUpload}
        onClose={() => {
          setEnableFileUpload(false);
        }}
        type={type}
        destinationConfig={destinationConfig}
        onFileUploadDone={files => {
          props.onFileUploadDone(files);
          setFile(files);
          setEnableFileUpload(false);
        }}>
        <>
          {props.children}
          {fileUuid === null ? (
            <ActivityIndicator
              style={{marginTop: 12}}
              size="small"
              color="#00ff00"
            />
          ) : (
            <Text
              style={{
                position: 'absolute',
                top: 80,
                color: theme.colors.primaryBlue,
                ...theme.fontSizes.small,
                left: 10,
                width: 140,
                textAlign: 'center',
              }}>
              {type === 'local' && file.length > 0
                ? Platform.OS === 'ios'
                  ? `${file[0]?.file_name?.slice(0, 10)}.jpg`
                  : `${file[1]?.file_name?.slice(0, 10)}.jpg`
                : ''}
              {type !== 'local' && file.length > 0
                ? `${file[0]?.file_name?.slice(0, 10)}.jpg`
                : ''}
            </Text>
          )}
        </>
      </FileUpload>
    </>
  );
}

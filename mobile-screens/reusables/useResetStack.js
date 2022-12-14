import {useNavigation} from '@react-navigation/native';

export const useResetStack = stackName => {
  const navigation = useNavigation();
  const reset = () => {
    console.log(`reset the ${stackName} stack start`);
    navigation.reset({
      index: 0,
      routes: [{name: stackName}],
    });
    console.log(`reset the ${stackName} stack done`);
  };
  return reset;
};

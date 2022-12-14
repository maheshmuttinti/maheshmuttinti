import {useResetStack} from './useResetStack';

export const useResetAuthStack = () => {
  const resetAuthStack = useResetStack('Auth');
  return {resetAuthStack};
};

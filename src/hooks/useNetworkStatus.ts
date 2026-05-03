import { setNetworkStatus } from '@/src/redux/slices/network.slice';
import NetInfo from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hook';

// Subscribe to network changes and keep Redux in sync.
// Mount this once in the root layout.
export const useNetworkStatus = (): void => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      dispatch(
        setNetworkStatus({
          isConnected: state.isConnected ?? false,
          isInternetReachable: state.isInternetReachable,
        }),
      );
    });

    return () => unsubscribe();
  }, [dispatch]);
};
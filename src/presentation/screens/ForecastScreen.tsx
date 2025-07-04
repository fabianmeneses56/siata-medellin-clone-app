/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {Text, IconButton} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import ForecastView from '../components/ForecastView';
import {getForecastByLocation} from '../../actions/api/getForecast';
import {appColor, arrayLocations} from '../../config/utils/constanst';
import LoadingScreen from './loading/LoadingScreen';
import {storage} from '../../config/storage/mmkvStorage';
import {FocusAwareStatusBar} from '../components/FocusAwareStatusBar';

export const ForecastScreen = () => {
  const {top} = useSafeAreaInsets();

  const onBoardingViewed = storage.getString('location');

  const [currentLocation, setCurrentLocation] = useState(0);
  const {isLoading, data} = useQuery({
    queryKey: ['forecast', arrayLocations[currentLocation].path],
    queryFn: () => getForecastByLocation(arrayLocations[currentLocation].path),
    placeholderData: previousData => previousData,
  });
  const lastUpdate = data?.date.split(' ').reverse().join(' ');

  useEffect(() => {
    const indexFavoriteLocation = arrayLocations.findIndex(
      value => value.name === onBoardingViewed,
    );
    setCurrentLocation(indexFavoriteLocation ?? 0);
  }, [onBoardingViewed]);

  return (
    <View style={[styles.container, {paddingTop: top + 20}]}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <IconButton
          style={{borderColor: appColor}}
          iconColor={appColor}
          mode="outlined"
          onPress={() =>
            setCurrentLocation(prev => {
              if (prev > 0) {
                return prev - 1;
              }
              return arrayLocations.length - 1;
            })
          }
          icon="chevron-left-circle"
        />
        <View
          style={{
            alignSelf: 'center',
            flex: 1,
            padding: 5,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '600',
            }}
            variant="headlineSmall">
            {arrayLocations[currentLocation].name}
          </Text>
          <Text
            style={{
              textAlign: 'center',
            }}
            variant="labelLarge">
            {lastUpdate}
          </Text>
        </View>
        <IconButton
          style={{borderColor: appColor}}
          icon={'chevron-right-circle'}
          mode="outlined"
          iconColor={appColor}
          onPress={() =>
            setCurrentLocation(prev => {
              if (prev !== arrayLocations.length - 1) {
                return prev + 1;
              }

              return 0;
            })
          }
        />
      </View>

      {isLoading && <LoadingScreen />}
      {data && <ForecastView data={data} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
  },
});

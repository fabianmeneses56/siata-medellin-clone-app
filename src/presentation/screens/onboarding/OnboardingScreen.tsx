/* eslint-disable react-native/no-inline-styles */
import {Image, StyleSheet, View} from 'react-native';
import React, {useState, useRef} from 'react';
import {Button, Text} from 'react-native-paper';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';

import {appColor} from '../../../config/utils/constanst';
import {storage} from '../../../config/storage/mmkvStorage';
import {RootStackParams} from '../../../infrastructure/interfaces/navigation';
import CustomBottomSheet from '../../components/CustomBottomSheet';

const OnboardingScreen = () => {
  const [value, setValue] = useState<null | string>(null);

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const {top, bottom} = useSafeAreaInsets();
  return (
    <View style={[styles.container, {paddingTop: top, paddingBottom: bottom}]}>
      <View>
        <Text
          variant="headlineLarge"
          style={{color: 'white', textAlign: 'center'}}>
          Bienvenido a Lluvias MDE
        </Text>

        <Image
          source={require('../../../assets/icons/lluviasMdeLogo.png')}
          style={{
            width: 300,
            height: 270,
            alignSelf: 'center',
          }}
          resizeMode="contain"
        />

        <Button
          mode="contained"
          onPress={() => bottomSheetRef.current?.collapse()}
          icon={'menu-down'}
          contentStyle={{flexDirection: 'row-reverse'}}
          labelStyle={{fontWeight: '600'}}
          buttonColor="#FFFFFF"
          textColor="#228997">
          {value ?? 'Selecciona una opción'}
        </Button>
      </View>
      {value && (
        <Button
          style={{
            width: '100%',
            marginTop: 15,
          }}
          mode="contained"
          onPress={() => {
            storage.setString('location', value);
            navigation.reset({
              routes: [{name: 'bottomTabNavigation'}],
            });
          }}
          labelStyle={{fontWeight: '600'}}
          buttonColor="#FFFFFF"
          textColor="#228997">
          Guardar y continuar
        </Button>
      )}

      <CustomBottomSheet
        bottomSheetRef={bottomSheetRef}
        onPressButton={location => {
          setValue(location);
        }}
      />
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColor,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 10,
  },
  option: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontWeight: '800',
  },
  contentContainer: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
});

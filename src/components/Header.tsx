import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';


import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Header() {
  const [userName, setUserName] = useState<string>();
  const [image, setImage] = useState<string>();
  const navigation = useNavigation();

  useEffect(() => {
    async function getUserInfos() {
      const storageUsername = await AsyncStorage.getItem('@plantmanager:user')
      setUserName(storageUsername || '');

      const data = await AsyncStorage.getItem('@plantmanager:userAvatar');
      const storageUserAvatar = data ? JSON.parse(data) : ''
      setImage(storageUserAvatar.image);
    }

    getUserInfos();
  }, [])

  function handleImagePress() {
    Alert.alert('Alterar foto?', `Deseja alterar a sua foto ${userName} ou apagar seus dados do app e sair?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar meus dados', onPress: async () => {
          await AsyncStorage.multiRemove(["@plantmanager:user", "@plantmanager:userAvatar", "@plantmanager:plants"]);
          await Notifications.cancelAllScheduledNotificationsAsync();
          navigation.navigate("Welcome")
        }
      },
      {
        text: 'Alterar Foto', onPress: async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
          });


          if (!result.cancelled) {
            console.log(result.uri)
            setImage(result.uri);
          }
        }
      },
    ])
  }


  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.username}>{userName}</Text>
      </View>
      <TouchableOpacity onPress={handleImagePress}>
        <Image source={{ uri: image }} style={styles.image} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: getStatusBarHeight(),
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35
  },
  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text
  },
  username: {
    fontSize: 32,
    fontFamily: fonts.heading,
    color: colors.heading,
    lineHeight: 40
  },
});
import React, { useEffect, useState } from 'react';
import { Text, View, Alert, Image, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../components/Button';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function UserAvatar() {
  const [image, setImage] = useState<string>();
  const navigation = useNavigation();

  useEffect(() => {
    async function getUserAvatar() {
      const data = await AsyncStorage.getItem('@plantmanager:userAvatar');
      const userAvatar = data ? JSON.parse(data) : ''

      setImage(userAvatar.image);
    }

    getUserAvatar();
  }, [])

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Desculpe, precisamos da sua permissão para continuar!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
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

  async function handleSubmit() {
    try {
      await AsyncStorage.setItem('@plantmanager:userAvatar', JSON.stringify({ image }));

      const params = {
        title: 'Prontinho',
        subtitle: 'Agora vamos começar a cuidar das suas plantinhas com muito cuidado.',
        buttonTitle: 'Começar',
        icon: 'smile',
        nextScreen: 'PlantSelect',
      }

      navigation.navigate('Confirmation', params);
    } catch (error) {
      return Alert.alert('Ops, não foi possível salvar sua foto. 😓')
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>
            😍
          </Text>
          <Text style={styles.title}>
            Faça o upload de {'\n'}
            uma foto sua
          </Text>
        </View>

        {image && (
          <Image source={{ uri: image }} style={styles.image} />
        )}

        {!image && (
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Feather
              name="camera"
              size={24}
              color='#CFCFCF'
            />
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          {image && (
            <TouchableOpacity style={styles.editButton} onPress={pickImage}>
              <Feather
                name='edit'
                size={16}
                color='#CFCFCF'
              />
              <Text style={styles.editButtonText}>Editar foto</Text>
            </TouchableOpacity>
          )}

          <Button title='Confirmar' onPress={handleSubmit} disabled={!image} />
        </View>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  button: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.shape,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    textAlign: 'center',
    marginTop: 24,
  },
  footer: {
    width: '100%',
    marginTop: 40,
  },
  editButton: {
    backgroundColor: colors.shape,
    borderRadius: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 16,
    marginBottom: 20
  },
  editButtonText: {
    marginLeft: 16,
    fontFamily: fonts.text,
    color: colors.gray,
    fontSize: 13,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20
  },
  emoji: {
    fontSize: 44,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    color: colors.heading,
    fontFamily: fonts.heading,
    marginTop: 24
  },
})
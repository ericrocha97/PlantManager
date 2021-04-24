import { useNavigation, useRoute } from "@react-navigation/core";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { getBottomSpace, getStatusBarHeight } from "react-native-iphone-x-helper";
import { SvgFromUri } from "react-native-svg";
import DateTimePicker, { Event } from "@react-native-community/datetimepicker";

import waterdrop from "../assets/waterdrop.png";
import { Button } from "../components/Button";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { format, isBefore } from "date-fns";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PlantProps, savePlant } from "../libs/storage";
import { Feather } from "@expo/vector-icons";

interface Params {
  plant: PlantProps;
}

export function PlantSave() {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === "ios");

  const route = useRoute();
  const { plant } = route.params as Params;

  const navigation = useNavigation();

  function handleChangeTime(event: Event, dateTime: Date | undefined) {
    if (Platform.OS === "android") {
      setShowDatePicker((oldState) => !oldState);
    }

    if (dateTime && isBefore(dateTime, new Date())) {
      setSelectedDateTime(new Date());
      return Alert.alert("Escolha uma hora no futuro! ⏰");
    }

    if (dateTime) setSelectedDateTime(dateTime);
  }

  function handleOpenDatetimePickerForAndroid() {
    setShowDatePicker((oldState) => !oldState);
  }

  function handleGoBack() {
    navigation.goBack()
  }

  async function handleSave() {
    try {
      await savePlant({
        ...plant,
        dateTimeNotification: selectedDateTime,
      });

      navigation.navigate("Confirmation", {
        title: "Tudo certo",
        subtitle: `Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha com muito cuidado.`,
        buttonTitle: "Muito obrigado",
        icon: "hug",
        nextScreen: "MyPlants",
      });
    } catch {
      Alert.alert("", "Não foi possível salvar. 😢");
    }
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.headerButton}>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={handleGoBack}
          >
            <Feather name="chevron-left" style={styles.goBackButtonIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.plantInfo}>




          <SvgFromUri uri={plant.photo} height={150} width={150} />

          <Text style={styles.plantName}>{plant.name}</Text>
          <Text style={styles.plantAbout}>{plant.about}</Text>
        </View>

        <View style={styles.controller}>
          <View style={styles.tipContainer}>
            <Image source={waterdrop} style={styles.tipImage} />
            <Text style={styles.tipText}>{plant.water_tips}</Text>
          </View>

          <Text style={styles.alertLabel}>
            Escolha o melhor horário para ser lembrado:
          </Text>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDateTime}
              mode="time"
              onChange={handleChangeTime}
            />
          )}

          {Platform.OS === "android" && (
            <TouchableOpacity
              style={styles.dateTimePickerButton}
              onPress={handleOpenDatetimePickerForAndroid}
            >
              <Text style={styles.dateTimePickerText}>
                {`Mudar ${format(selectedDateTime, "HH:mm")}`}
              </Text>
            </TouchableOpacity>
          )}

          <Button title="Cadastrar planta" onPress={handleSave} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  plantInfo: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 50,
    paddingBottom: 77,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.shape,
  },
  controller: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: getBottomSpace() || 20,
  },
  plantName: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.heading,
    marginTop: 15,
  },
  plantAbout: {
    textAlign: "center",
    fontFamily: fonts.text,
    color: colors.heading,
    fontSize: 17,
    marginTop: 10,
  },
  tipContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.blue_light,
    padding: 20,
    borderRadius: 20,
    position: "relative",
    bottom: 60,
  },
  tipImage: {
    width: 56,
    height: 56,
  },
  tipText: {
    flex: 1,
    marginLeft: 20,
    fontFamily: fonts.text,
    color: colors.blue,
    fontSize: 17,
    textAlign: "justify",
  },
  alertLabel: {
    textAlign: "center",
    fontFamily: fonts.complement,
    color: colors.heading,
    fontSize: 12,
    marginBottom: 5,
  },
  dateTimePickerButton: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 40,
  },
  dateTimePickerText: {
    color: colors.heading,
    fontSize: 24,
    fontFamily: fonts.text,
  },
  goBackButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBackButtonIcon: {
    fontSize: 24,
    color: colors.heading
  },
  headerButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.shape,
    paddingTop: getStatusBarHeight(),
    //marginTop: getStatusBarHeight(),
  }
});
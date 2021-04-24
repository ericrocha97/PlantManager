import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text, FlatList, Alert, Modal, TouchableOpacity } from "react-native";
import { Header } from "../components/Header";
import colors from "../styles/colors";


import waterdrop from "../assets/waterdrop.png";
import { loadPlant, PlantProps, removePlant } from "../libs/storage";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import fonts from "../styles/fonts";
import { PlantCardSecondary } from "../components/PlantCardSecondary";
import { Load } from "../components/Load";
import { SvgFromUri } from "react-native-svg";

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [plantDelete, setPlantDelete] = useState<PlantProps>();
  const [removed, setRemoved] = useState<string>('');

  function handleOpenModal(plant: PlantProps) {
    setPlantDelete(plant);
    setModalVisible(true)
  }

  async function handleRemove(plant: PlantProps) {
    try {
      await removePlant(plant.id);

      setMyPlants((oldData) =>
        oldData.filter((item) => item.id !== plant.id)
      );
      setRemoved(String(plant.id))
    } catch (error) {
      Alert.alert("Não foi possível remover! 😥");
    }



  }

  function getNextTime(date: Date) {
    const nextTime = formatDistance(
      new Date(date).getTime(),
      new Date().getTime(),
      {
        locale: ptBR,
      }
    );
    return nextTime;
  }

  useEffect(() => {
    async function loadStorageData() {
      const plantsStoraged = await loadPlant();
      if (plantsStoraged.length !== 0) {
        setNextWatered(`Regue sua ${plantsStoraged[0].name} daqui a ${getNextTime(plantsStoraged[0].dateTimeNotification)}`);
        setMyPlants(plantsStoraged);
      }
      setLoading(false);
    }

    loadStorageData();
  }, [removed]);

  if (loading)
    return <Load />

  return (
    <View style={styles.container}>
      <Header />

      {myPlants.length !== 0 && (
        <View style={styles.spotlight}>
          <Image source={waterdrop} style={styles.spotlightImage} />
          <Text style={styles.spotlightText}>{nextWatered}</Text>
        </View>
      )}


      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>
          Próximas regadas
        </Text>
        {plantDelete && (
          <Modal
            animationType="fade"
            transparent={true}
            style={styles.modalShadow}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalView}>
              <View style={styles.modalImageView}>
                <SvgFromUri uri={plantDelete.photo} width={120} height={120} />
              </View>
              <Text style={styles.modalText}>Deseja mesmo deletar sua</Text>
              <Text style={styles.modalPlantName}>{plantDelete.name}?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButtonsCancel}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.modalButtonsTextCancel}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonsDelete}
                  onPress={() => {
                    handleRemove(plantDelete)
                    setModalVisible(!modalVisible)
                  }}
                >
                  <Text style={styles.modalButtonsTextDelete}>Deletar</Text>
                </TouchableOpacity>
              </View>
            </View>

          </Modal>

        )
        }
        {myPlants.length !== 0 ? (
          <FlatList
            data={myPlants}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <PlantCardSecondary
                data={item}
                handleRemove={() => {
                  handleOpenModal(item);
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
          // contentContainerStyle={{ flex: 1 }}
          />
        ) : (
          <View style={styles.notFoundContainer}>
            <Text style={styles.notFoundText}>
              Você ainda não possui plantinhas cadastradas 😯
              </Text>
          </View>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    backgroundColor: colors.background
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  spotlightImage: {
    width: 60,
    height: 60,
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
  },
  plants: {
    flex: 1,
    width: '100%'
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20
  },
  modalShadow: {
    backgroundColor: "#000000",
    opacity: 0.9,
    flex: 1,
    height: "100%"
  },
  modalView: {
    height: 350,
    width: 270,
    marginTop: 245,
    marginHorizontal: 80,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

  },
  modalImageView: {
    backgroundColor: colors.shape,
    borderRadius: 20,
    height: 150,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    flex: 1,
    maxWidth: '100%',
    paddingVertical: 20,
    //paddingHorizontal: 20,
    margin: 10
  },
  modalText: {
    fontFamily: fonts.text,
    fontSize: 17,
    color: colors.heading,
    lineHeight: 25,
    marginTop: 16,
  },
  modalPlantName: {
    fontFamily: fonts.heading,
    fontSize: 17,
    color: colors.heading,
    lineHeight: 25,
  },
  modalButtons: {
    alignItems: 'center',
    justifyContent: "space-between",
    flexDirection: 'row',
  },
  modalButtonsCancel: {
    width: 96,
    height: 48,
    alignItems: 'center',
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 10,
    backgroundColor: colors.shape,
    marginHorizontal: 10,
    borderRadius: 12,
  },
  modalButtonsDelete: {
    width: 96,
    height: 48,
    alignItems: 'center',
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 10,
    backgroundColor: colors.shape,
    marginHorizontal: 10,
    borderRadius: 12,
  },
  modalButtonsTextCancel: {
    color: colors.heading,
    fontFamily: fonts.complement,
    fontSize: 15,
    lineHeight: 23,
  },
  modalButtonsTextDelete: {
    color: colors.red,
    fontFamily: fonts.complement,
    fontSize: 15,
    lineHeight: 23,
  },
  notFoundContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notFoundText: {
    fontSize: 18,
    fontFamily: fonts.text,
    textAlign: 'center',
    color: colors.heading
  }
});
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Welcome } from '../pages/Welcome';
import { UserIdentification } from '../pages/UserIdentification';
import { Confirmation } from '../pages/Confirmation';
import { PlantSave } from '../pages/PlantSave';
import { MyPlants } from '../pages/MyPlants';
import { PlantSelect } from '../pages/PlantSelect';
import AuthRoutes from './tabs.routes';

import colors from '../styles/colors';
import { UserAvatar } from '../pages/UserAvatar';
import { AsyncStorage } from 'react-native';
const stackRoutes = createStackNavigator();



const AppRoutes: React.FC = () => {
  const [name, setName] = useState<string>();
  useEffect(() => {
    async function getUsername() {
      const data = await AsyncStorage.getItem('@plantmanager:user');
      const username = data ? data : ''


      setName(username);
    }

    getUsername();

  }, [])
  return (
    <stackRoutes.Navigator
      headerMode="none"
      screenOptions={{
        cardStyle: {
          backgroundColor: colors.white
        }
      }}
    >
      { name ? (
        <stackRoutes.Screen
          name="Index"
          component={AuthRoutes}
        />
      ) : (
        <stackRoutes.Screen
          name="Index"
          component={Welcome}
        />
      )}


      <stackRoutes.Screen
        name="UserIdentification"
        component={UserIdentification}
      />

      <stackRoutes.Screen
        name="UserAvatar"
        component={UserAvatar}
      />

      <stackRoutes.Screen
        name="Confirmation"
        component={Confirmation}
      />

      <stackRoutes.Screen
        name="Welcome"
        component={Welcome}
      />

      <stackRoutes.Screen
        name="PlantSelect"
        component={AuthRoutes}
      />


      <stackRoutes.Screen
        name="PlantSave"
        component={PlantSave}
      />

      <stackRoutes.Screen
        name="MyPlants"
        component={AuthRoutes}
      />
    </stackRoutes.Navigator>
  )
}

export default AppRoutes;
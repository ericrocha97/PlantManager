import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Welcome } from "../pages/Welcome";
import { UserIdentification } from "../pages/UserIdentification";
import { Confirmation } from "../pages/Confirmation";

import colors from "../styles/colors";
import { useColorScheme } from "react-native-appearance";

const stackRoutes = createStackNavigator();

const AppRoutes: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'light' ? colors.background : colors.background_dark;
  return (
    <stackRoutes.Navigator
      headerMode="none"
      screenOptions={{
        cardStyle: {
          backgroundColor: theme,
        }
      }}
    >
      <stackRoutes.Screen name="Welcome" component={Welcome} />

      <stackRoutes.Screen name="UserIdentification" component={UserIdentification} />

      <stackRoutes.Screen name="Confirmation" component={Confirmation} />

    </stackRoutes.Navigator>
  )
};

export default AppRoutes;
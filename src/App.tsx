import { createDrawerNavigator } from '@react-navigation/drawer';
import "@/global.css";

import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { createStaticNavigation } from '@react-navigation/native';
import { HomeScreen } from './navigation/screens/Home';
import AltaScreen from './navigation/screens/Alta';
import ListadoScreen from './navigation/screens/Listado';

const MyDrawer = createDrawerNavigator({
  screens: {
    Home: HomeScreen,
    Listado: ListadoScreen,
    Alta: AltaScreen,
    // Listado: ListadoEpisodiosScreen
  },
});

const Navigation = createStaticNavigation(MyDrawer);

export function App() {
  return (
    <GluestackUIProvider config={config} colorMode="light">
      <Navigation />
    </GluestackUIProvider>
  );
}

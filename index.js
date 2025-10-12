/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { Home } from "./ui/home";
import { DetailsPage } from "./ui/Details";
import { name as appName } from './app.json';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';


const Stack = createNativeStackNavigator();
const RootStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Details" component={DetailsPage} />
        </Stack.Navigator>
    )
};
const App = () => (
    <NavigationContainer>
        <RootStack />
    </NavigationContainer>
);
 

AppRegistry.registerComponent(appName, () => App);

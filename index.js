/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import Home from "./ui/home";
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => Home);

import { AppRegistry } from 'react-native';
import { HomePage } from './ui/page/Home';
import { name as appName } from './app.json';

const App = () => <HomePage />;

AppRegistry.registerComponent(appName, () => App);

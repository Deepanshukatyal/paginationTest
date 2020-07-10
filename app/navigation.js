import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation';
import HomeScreen from '../features/HomeScreen';
import DetailScreen from '../features/DetailScreen';


const AppStack = createStackNavigator({
    Home: HomeScreen,
    Detail: DetailScreen
}, {
    headerMode:null

    })
const AppContainer = createAppContainer(AppStack)
export default AppContainer
import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from './scr/components/Auth/AuthScreen';
import ProfileScreen from './scr/components/Profile/ProfileScreen'; // Импортируем экран профиля
import CryptoConverter from './scr/components/CurrencyConverter/CurrencyConverterScreen';
import MainScreen from './scr/components/MainScreen/MainScreen';
import NewsScreen from './scr/components/News/NewsScreen';
import CryptoDetailScreen from './scr/components/CryptoDetailScreen/CryptoDetailScreen';
import Icon from 'react-native-vector-icons/Ionicons'; // Импортируем иконки

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainApp = ({ user, onLogout }) => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#1E1E1E', // Темный цвет фона
                    height: 75, // Уменьшенная высота
                },
                tabBarActiveTintColor: '#00FF7F', // Цвет активной иконки
                tabBarInactiveTintColor: '#B0B0B0', // Цвет неактивной иконки
            }}
        >
            <Tab.Screen
                name="Главная страница"
                component={MainStack}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Icon name="home-outline" color={color} size={24} />
                }}
            />
            <Tab.Screen
                name="Конвертер"
                component={CryptoConverter}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Icon name="cash-outline" color={color} size={24} />
                }}
            />
            <Tab.Screen
                name="Новости"
                component={NewsScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Icon name="newspaper-outline" color={color} size={24} />
                }}
            />
            <Tab.Screen
                name="Профиль"
                options={{
                    tabBarIcon: ({ color }) => <Icon name="person-outline" color={color} size={24} />,
                    headerShown: false,
                }}
            >
                {(props) => <ProfileScreen {...props} user={user} onLogout={onLogout} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

const MainStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CryptoDetail" component={CryptoDetailScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const handleLogin = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <NavigationContainer>
            <View style={{ flex: 1 }}>
                {isAuthenticated ? (
                    <MainApp user={user} onLogout={handleLogout} />
                ) : (
                    <AuthScreen onLogin={handleLogin} />
                )}
            </View>
        </NavigationContainer>
    );
};

export default App;
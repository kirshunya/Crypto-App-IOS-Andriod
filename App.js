import React, { useState, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from './scr/components/Auth/AuthScreen';
import ProfileScreen from './scr/components/Profile/ProfileScreen';
import CryptoConverter from './scr/components/CurrencyConverter/CurrencyConverterScreen';
import MainScreen from './scr/components/MainScreen/MainScreen';
import NewsScreen from './scr/components/News/NewsScreen';
import CryptoDetailScreen from './scr/components/CryptoDetailScreen/CryptoDetailScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import ArbitrageScreen from "./scr/components/Arbitrage/ArbitrageScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainApp = ({ user, onLogout }) => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#1E1E1E',
                    height: 75,
                },
                tabBarActiveTintColor: '#00FF7F',
                tabBarInactiveTintColor: '#B0B0B0',
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
                name="Арбитраж" // Добавляем новую вкладку
                component={ArbitrageScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Icon name="stats-chart-outline" color={color} size={24} />
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
    const [isAuthenticated, setIsAuthenticated] = useState(true);
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
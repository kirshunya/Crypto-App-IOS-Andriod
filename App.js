import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CryptoConverter from './scr/components/CurrencyConverter/CurrencyConverterScreen'; // ваш компонент конвертера
import MainScreen from './scr/components/MainScreen/MainScreen';
import ProfileScreen from "./scr/components/Profile/ProfileScreen"; // другой экран
import NewsScreen from "./scr/components/News/NewsScreen";

const Tab = createBottomTabNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === 'Главная страница') {
                            iconName = require('./assets/favicon.png'); // замените на вашу иконку
                        } else if (route.name === 'Конвертер') {
                            iconName = require('./assets/favicon.png'); // замените на вашу иконку
                        } else if (route.name === 'Новости') {
                            iconName = require('./assets/favicon.png');
                        } else if (route.name === 'Личный кабинет') {
                            iconName = require('./assets/favicon.png');
                        }

                        return <Image source={iconName} style={{ width: size, height: size, tintColor: color }} />;
                    },
                    tabBarActiveTintColor: '#007BFF',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: {
                        backgroundColor: '#1E1E1E',
                    },
                })}
            >
                <Tab.Screen name="Главная страница" component={MainScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Конвертер" component={CryptoConverter} options={{ headerShown: false }} />
                <Tab.Screen name="Новости" component={NewsScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Личный кабинет" component={ProfileScreen} options={{ headerShown: false }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

// Примените отступ сверху в каждом из ваших экранов
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20, // Отступ сверху
    },
});

export default App;
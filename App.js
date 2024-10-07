import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AuthScreen from './scr/components/Auth/AuthScreen'; // Импортируйте экран авторизации
import ProfileScreen from './scr/components/Profile/ProfileScreen'; // Экран профиля
import CryptoConverter from './scr/components/CurrencyConverter/CurrencyConverterScreen'; // компонент конвертера
import MainScreen from './scr/components/MainScreen/MainScreen';
import NewsScreen from './scr/components/News/NewsScreen'; // экран новостей

const Tab = createBottomTabNavigator();

const MainApp = ({ user }) => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Главная страница" component={MainScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Конвертер" component={CryptoConverter} options={{ headerShown: false }} />
            <Tab.Screen name="Новости" component={NewsScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); // Состояние для хранения информации о пользователе

    const handleLogin = (userData) => {
        setUser(userData); // Устанавливаем данные пользователя
        setIsAuthenticated(true); // Успешный вход
    };

    return (
        <NavigationContainer>
            <View style={{ flex: 1 }}>
                {isAuthenticated ? <MainApp user={user} /> : <AuthScreen onLogin={handleLogin} />}
            </View>
        </NavigationContainer>
    );
};

export default App;
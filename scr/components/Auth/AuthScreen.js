import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthScreen = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const loadUsers = async () => {
            const storedUsers = await AsyncStorage.getItem('users');
            if (storedUsers) {
                setUsers(JSON.parse(storedUsers));
            }
        };
        loadUsers();
    }, []);

    const handleLogin = async () => {
        const user = users.find((u) => u.username === username && u.password === password);
        if (user) {
            onLogin(user); // Передаем пользователя в onLogin, если нужно
        } else {
            Alert.alert('Ошибка', 'Неверные данные');
        }
    };

    const handleRegister = async () => {
        const existingUser = users.find((u) => u.username === username);
        if (existingUser) {
            Alert.alert('Ошибка', 'Пользователь с таким именем уже существует');
            return;
        }
        const newUser = { username, password };
        const updatedUsers = [...users, newUser];

        // Сохраняем пользователей в AsyncStorage
        await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        Alert.alert('Успех', 'Регистрация прошла успешно!');

        // Вызов функции onLogin для переключения на главный экран
        onLogin(newUser); // Передаем нового пользователя в onLogin

        // Сброс полей
        setUsername('');
        setPassword('');
    };

    return (
        <View style={styles.background}>
            <Text style={styles.title}>{isRegistering ? 'Регистрация' : 'Добро пожаловать'}</Text>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Имя пользователя"
                    placeholderTextColor="#B0B0B0"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Пароль"
                    placeholderTextColor="#B0B0B0"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.button} onPress={isRegistering ? handleRegister : handleLogin}>
                    <Text style={styles.buttonText}>{isRegistering ? 'Зарегистрироваться' : 'Войти'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
                    <Text style={styles.switchText}>
                        {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
        color: '#FFFFFF',
    },
    container: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: '#2C2C2C',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        height: 50,
        borderColor: '#007BFF',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#FFFFFF',
        backgroundColor: '#3A3A3A',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    switchText: {
        color: '#B0B0B0',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default AuthScreen;
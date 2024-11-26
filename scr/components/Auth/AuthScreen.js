import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next'; // Импортируем useTranslation

const AuthScreen = ({ onLogin }) => {
    const { t, i18n } = useTranslation(); // Инициализируем i18next
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
            onLogin(user); // Передаем пользователя в onLogin
        } else {
            Alert.alert(t('error'), t('invalidCredentials')); // Используем локализованный текст
        }
    };

    const handleRegister = async () => {
        const existingUser = users.find((u) => u.username === username);
        if (existingUser) {
            Alert.alert(t('error'), t('userExists')); // Используем локализованный текст
            return;
        }
        const newUser = { username, password };
        const updatedUsers = [...users, newUser];

        await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        Alert.alert(t('success'), t('registrationSuccess')); // Используем локализованный текст

        onLogin(newUser); // Передаем нового пользователя в onLogin
        setUsername('');
        setPassword('');
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng); // Смена языка
    };

    return (
        <View style={styles.background}>
            <Text style={styles.title}>{isRegistering ? t('register') : t('welcome')}</Text>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder={t('usernamePlaceholder')}
                    placeholderTextColor="#B0B0B0"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder={t('passwordPlaceholder')}
                    placeholderTextColor="#B0B0B0"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.button} onPress={isRegistering ? handleRegister : handleLogin}>
                    <Text style={styles.buttonText}>{isRegistering ? t('register') : t('login')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
                    <Text style={styles.switchText}>
                        {isRegistering ? t('haveAccount') : t('noAccount')}
                    </Text>
                </TouchableOpacity>
                <View style={styles.languageButtons}>
                    <TouchableOpacity onPress={() => changeLanguage('en')}>
                        <Text style={styles.languageButton}>English</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => changeLanguage('ru')}>
                        <Text style={styles.languageButton}>Русский</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => changeLanguage('es')}>
                        <Text style={styles.languageButton}>Español</Text>
                    </TouchableOpacity>
                </View>
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
    languageButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    languageButton: {
        color: '#00FF7F',
        fontSize: 16,
        marginHorizontal: 10,
    },
});

export default AuthScreen;
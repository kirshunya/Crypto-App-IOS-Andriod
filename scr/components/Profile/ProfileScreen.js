import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacisty, Alert, Image, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = ({ user, onLogout }) => {
    const [avatarSource, setAvatarSource] = useState(null);

    const handleUploadAvatar = async () => {
        // Запрашиваем разрешение на доступ к медиатеке
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        // Открываем медиатеку
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        // Логируем весь ответ
        console.log('ImagePicker result:', result);

        if (result.cancelled) {
            console.log('User cancelled image picker');
        } else if (result.assets && result.assets.length > 0) {
            console.log('Selected image URI:', result.assets[0].uri); // Проверяем структуру
            setAvatarSource(result.assets[0].uri);
        } else {
            console.log('No image selected or unexpected result structure');
        }
    };

    const handleLogout = () => {
        onLogout();
        Alert.alert('Вы вышли из системы');
    };

    const openBinance = () => {
        Linking.openURL('https://www.binance.com');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleUploadAvatar}>
                <Image
                    source={avatarSource ? { uri: avatarSource } : require('../../../assets/img.png')} // Убедитесь, что путь к изображению правильный
                    style={styles.avatar}
                />
            </TouchableOpacity>
            <Text style={styles.title}>Личный кабинет</Text>
            <Text style={styles.userInfo}>Имя пользователя: {user.username}</Text>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Биржа</Text>
                <TouchableOpacity style={styles.exchangeInfo} onPress={openBinance}>
                    <Image
                        style={styles.icon}
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6001/6001399.png' }} // Замените на ваш URL иконки
                    />
                    <Text style={styles.exchangeText}>Binance</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.currencySection, styles.flexColumn]}>
                <Text style={styles.currencyTitle}>Валюта:</Text>
                <View style={[styles.flexRow, styles.currencyValue]}>
                    <Image
                        style={styles.icon}
                        source={{ uri: 'https://cdn.icon-icons.com/icons2/3006/PNG/512/usdt_cryptocurrencies_icon_188337.png' }} // Замените на ваш URL иконки
                    />
                    <Text style={styles.exchangeText}>Доллар (USDT)</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Выйти</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        padding: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#00FF7F',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
        color: '#FFFFFF',
    },
    userInfo: {
        fontSize: 18,
        color: '#B0B0B0',
        marginBottom: 10,
    },
    section: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#2C2C2C',
        borderRadius: 10,
        width: '100%',
        alignItems: 'flex-start',
    },
    sectionTitle: {
        fontSize: 20,
        color: '#00FF7F',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    exchangeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    exchangeText: {
        fontSize: 18,
        color: '#FFFFFF',
        marginLeft: 5,
    },
    currencySection: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#2C2C2C',
        borderRadius: 10,
        width: '100%',
        alignItems: 'flex-start',
    },
    currencyTitle: {
        fontSize: 20,
        color: '#00FF7F',
        fontWeight: 'bold',
    },
    currencyValue: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
        width: '100%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    flexColumn: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 30,
        height: 30,
    },
});

export default ProfileScreen;
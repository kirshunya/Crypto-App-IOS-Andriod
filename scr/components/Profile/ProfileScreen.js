import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileScreen = ({ user, onLogout }) => {
    const [avatarSource, setAvatarSource] = useState(null);

    const handleUploadAvatar = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setAvatarSource(response.assets[0].uri);
            }
        });
    };

    const handleLogout = () => {
        onLogout();
        Alert.alert('Вы вышли из системы');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleUploadAvatar}>
                <Image
                    source={avatarSource ? { uri: avatarSource } : require('../../../assets/img.png')} // Укажите путь к изображению по умолчанию
                    style={styles.avatar}
                />
            </TouchableOpacity>
            <Text style={styles.title}>Личный кабинет</Text>
            <Text style={styles.userInfo}>Имя пользователя: {user.username}</Text>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Биржа</Text>
                <View style={styles.exchangeInfo}>
                    <Icon name="logo-binance" size={30} color="#F3BA2F" />
                    <Text style={styles.exchangeText}> Binance</Text>
                </View>
            </View>
            <View style={styles.currencySection}>
                <Text style={styles.currencyTitle}>Валюта:</Text>
                <Text style={styles.currencyValue}>Доллар (USD)</Text>
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
        marginLeft: 10,
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
});

export default ProfileScreen;
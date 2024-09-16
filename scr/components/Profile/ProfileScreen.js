import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const ProfileScreen = () => {
    const user = {
        avatar: 'https://img.goodfon.ru/wallpaper/big/7/a6/mining-maining-bitkoin-bitcoin-vektor-vector-minimalism.jpg', // Замените на реальный URL изображения
        nickname: 'Имя пользователя',
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <Text style={styles.nickname}>{user.nickname}</Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Настройки</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        padding: 20,
        backgroundColor: '#1E1E1E',
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    nickname: {
        fontSize: 24,
        color: '#FFFFFF',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
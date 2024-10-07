import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ProfileScreen = ({ user }) => {
    return (
        <View style={styles.container}>
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
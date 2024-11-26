import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Image, Linking, TouchableOpacity, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next'; // Импортируем useTranslation

const ProfileScreen = ({ user, onLogout }) => {
    const { t, i18n } = useTranslation(); // Инициализируем i18next
    const [avatarSource, setAvatarSource] = useState(null);
    const [isTablet, setIsTablet] = useState(false);
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

    useEffect(() => {
        const updateLayout = () => {
            const { width } = Dimensions.get('window');
            setScreenWidth(width);
            setIsTablet(width >= 768); // Определяем, является ли устройство планшетом
        };

        const subscription = Dimensions.addEventListener('change', updateLayout);
        return () => {
            subscription?.remove(); // Отписываемся при размонтировании компонента
        };
    }, []);

    const handleUploadAvatar = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert(t('permissionsDenied')); // Используйте локализованный текст
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (result.cancelled) {
            console.log('User cancelled image picker');
        } else if (result.assets && result.assets.length > 0) {
            setAvatarSource(result.assets[0].uri);
        }
    };

    const handleLogout = () => {
        onLogout();
        Alert.alert(t('loggedOut')); // Используйте локализованный текст
    };

    const openBinance = () => {
        Linking.openURL('https://www.binance.com');
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <View style={styles.container(isTablet)}>
            <TouchableOpacity onPress={handleUploadAvatar}>
                <Image
                    source={avatarSource ? { uri: avatarSource } : require('../../../assets/img.png')}
                    style={styles.avatar(isTablet)}
                />
            </TouchableOpacity>
            <Text style={styles.title(isTablet)}>{t('profileTitle')}</Text>
            <Text style={styles.userInfo(isTablet)}>{t('username')}: {user.username}</Text>
            <View style={styles.section(isTablet)}>
                <Text style={styles.sectionTitle(isTablet)}>{t('exchange')}</Text>
                <TouchableOpacity style={styles.exchangeInfo} onPress={openBinance}>
                    <Image
                        style={styles.icon(isTablet)}
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6001/6001399.png' }}
                    />
                    <Text style={styles.exchangeText(isTablet)}>Binance</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.currencySection(isTablet), styles.flexColumn]}>
                <Text style={styles.currencyTitle(isTablet)}>{t('currencyTitle')}:</Text>
                <View style={[styles.flexRow, styles.currencyValue]}>
                    <Image
                        style={styles.icon(isTablet)}
                        source={{ uri: 'https://cdn.icon-icons.com/icons2/3006/PNG/512/usdt_cryptocurrencies_icon_188337.png' }}
                    />
                    <Text style={styles.exchangeText(isTablet)}>Доллар (USDT)</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.button(isTablet)} onPress={handleLogout}>
                <Text style={styles.buttonText(isTablet)}>{t('logout')}</Text>
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
    );
};

const styles = StyleSheet.create({
    container: (isTablet) => ({
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        padding: isTablet ? 40 : 20,
    }),
    avatar: (isTablet) => ({
        width: isTablet ? 150 : 100,
        height: isTablet ? 150 : 100,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: '#00FF7F',
        marginBottom: 20,
    }),
    title: (isTablet) => ({
        fontSize: isTablet ? 28 : 24,
        fontWeight: '600',
        marginBottom: 20,
        color: '#FFFFFF',
    }),
    userInfo: (isTablet) => ({
        fontSize: isTablet ? 20 : 18,
        color: '#B0B0B0',
        marginBottom: 10,
    }),
    section: (isTablet) => ({
        marginTop: 20,
        padding: 15,
        backgroundColor: '#2C2C2C',
        borderRadius: 10,
        width: '100%',
        alignItems: 'flex-start',
    }),
    sectionTitle: (isTablet) => ({
        fontSize: isTablet ? 24 : 20,
        color: '#00FF7F',
        fontWeight: 'bold',
        marginBottom: 10,
    }),
    exchangeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    exchangeText: (isTablet) => ({
        fontSize: isTablet ? 20 : 18,
        color: '#FFFFFF',
        marginLeft: 5,
    }),
    currencySection: (isTablet) => ({
        marginTop: 20,
        padding: 15,
        backgroundColor: '#2C2C2C',
        borderRadius: 10,
        width: '100%',
        alignItems: 'flex-start',
    }),
    currencyTitle: (isTablet) => ({
        fontSize: isTablet ? 24 : 20,
        color: '#00FF7F',
        fontWeight: 'bold',
    }),
    currencyValue: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    button: (isTablet) => ({
        backgroundColor: '#007BFF',
        padding: isTablet ? 20 : 15,
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
        width: '100%',
    }),
    buttonText: (isTablet) => ({
        color: '#FFFFFF',
        fontSize: isTablet ? 20 : 18,
        fontWeight: 'bold',
    }),
    flexColumn: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: (isTablet) => ({
        width: isTablet ? 40 : 30,
        height: isTablet ? 40 : 30,
    }),
    languageButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        width: '100%',
    },
    languageButton: {
        color: '#00FF7F',
        fontSize: 18,
        marginHorizontal: 10,
    },
});

export default ProfileScreen;
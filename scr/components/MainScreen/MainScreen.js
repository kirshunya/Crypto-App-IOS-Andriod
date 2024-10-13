import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-svg-charts';
import { useNavigation } from '@react-navigation/native';
import { Defs, LinearGradient, Stop } from 'react-native-svg';

const MainScreen = () => {
    const [cryptocurrencies, setCryptocurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 10; // Количество элементов на странице
    const navigation = useNavigation();

    // Функция для получения данных с задержкой
    const fetchCryptos = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка в 1 секунду
            const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
                params: {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: 100, // Получаем больше данных для поиска
                    page: 1,
                    sparkline: true,
                },
            });
            setCryptocurrencies(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchDataWithRetries = async (retries = 3) => {
            for (let i = 0; i < retries; i++) {
                try {
                    await fetchCryptos();
                    setLoading(false);
                    break; // Успешно выполнено, выходим из цикла
                } catch (error) {
                    if (error.response?.status === 429 && i < retries - 1) {
                        const waitTime = Math.pow(2, i) * 1000; // Экспоненциальная задержка
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                    } else {
                        console.error(error);
                        setLoading(false);
                        break;
                    }
                }
            }
        };

        fetchDataWithRetries();
    }, []);

    const filteredCryptos = cryptocurrencies.filter(crypto =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedCryptos = searchQuery ? filteredCryptos : cryptocurrencies.slice(0, itemsPerPage);

    const renderItem = ({ item }) => {
        const sparklineData = item.sparkline_in_7d?.price || [];
        if (sparklineData.length === 0) return null;

        return (
            <TouchableOpacity onPress={() => navigation.navigate('CryptoDetail', { coinId: item.id })}>
                <View style={styles.item}>
                    <View style={styles.row}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <Text style={styles.itemText}>{item.name} ({item.symbol.toUpperCase()})</Text>
                    </View>
                    <View style={styles.chartContainer}>
                        <LineChart
                            style={styles.chart}
                            data={sparklineData}
                            svg={{ stroke: 'url(#gradient)', strokeWidth: 2 }}
                            contentInset={{ top: 20, bottom: 20 }}
                        >
                            <Defs>
                                <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <Stop offset="0%" stopColor="#00FF7F" stopOpacity="1" />
                                    <Stop offset="100%" stopColor="#FF4500" stopOpacity="1" />
                                </LinearGradient>
                            </Defs>
                        </LineChart>
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>${item.current_price.toFixed(2)}</Text>
                        <Text style={[styles.changeText, item.price_change_percentage_24h < 0 ? styles.changeNegative : styles.changePositive]}>
                            {item.price_change_percentage_24h.toFixed(2)}%
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Good morning</Text>
                <Text style={styles.guest}>Guest</Text>
            </View>
            <TextInput
                style={styles.searchInput}
                placeholder="SEARCH NECESSARY COIN"
                placeholderTextColor="#B0B0B0"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList
                data={paginatedCryptos}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#121212',
        paddingHorizontal: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    greeting: {
        fontSize: 28,
        color: '#FFD700',
        fontWeight: 'bold',
    },
    guest: {
        fontSize: 20,
        color: '#B0B0B0',
    },
    searchInput: {
        height: 50,
        backgroundColor: '#2C2C2C',
        borderRadius: 10,
        paddingHorizontal: 15,
        color: '#FFFFFF',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 2,
    },
    list: {
        width: '100%',
        paddingVertical: 10,
    },
    item: {
        backgroundColor: '#2C2C2C',
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
        flexDirection: 'column',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    image: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    chartContainer: {
        height: 80,
        width: '100%',
        marginBottom: 8,
        overflow: 'hidden',
        borderRadius: 10,
    },
    chart: {
        flex: 1,
    },
    itemText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    priceText: {
        color: '#00FF7F',
        fontSize: 18,
        fontWeight: 'bold',
    },
    changeText: {
        fontSize: 16,
        fontWeight: '500',
    },
    changePositive: {
        color: '#00FF7F',
    },
    changeNegative: {
        color: '#FF4500',
    },
});

export default MainScreen;
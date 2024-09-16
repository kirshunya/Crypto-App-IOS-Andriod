import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';

const MainScreen = () => {
    const [cryptocurrencies, setCryptocurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCryptos = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
                    params: {
                        vs_currency: 'usd',
                        order: 'market_cap_desc',
                        per_page: 10,
                        page: 1,
                        sparkline: true,
                    },
                });
                setCryptocurrencies(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCryptos();
    }, []);

    const filteredCryptos = cryptocurrencies.filter(crypto =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderItem = ({ item }) => {
        const sparklineData = item.sparkline_in_7d?.price || [];
        if (sparklineData.length === 0) return null;

        return (
            <View style={styles.item}>
                <View style={styles.row}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <Text style={styles.itemText}>{item.name} ({item.symbol.toUpperCase()})</Text>
                </View>
                <LineChart
                    data={{
                        labels: sparklineData.map((_, index) => index.toString()),
                        datasets: [
                            {
                                data: sparklineData,
                            },
                        ],
                    }}
                    width={300}
                    height={100}
                    yAxisLabel="$"
                    yAxisInterval={1}
                    chartConfig={{
                        backgroundColor: '#1E1E1E',
                        backgroundGradientFrom: '#1E1E1E',
                        backgroundGradientTo: '#1E1E1E',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`, // Цвет линии
                        style: {
                            borderRadius: 16,
                        },
                        fillShadowGradient: '#ff7e7e', // Цвет заливки под графиком
                        fillShadowGradientOpacity: 0.5, // Прозрачность заливки
                        propsForDots: {
                            r: "0.5",
                            strokeWidth: "2",
                            stroke: "#ff6347", // Цвет обводки точек
                        },
                        propsForLabels: {
                            fontSize: 10,
                            color: '#ffffff', // Цвет меток
                        },
                    }}
                    bezier
                    style={styles.graph}
                />
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>${item.current_price.toFixed(2)}</Text>
                    <Text style={styles.changeText}>{item.price_change_percentage_24h.toFixed(2)}%</Text>
                </View>
            </View>
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
                data={filteredCryptos}
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
        backgroundColor: '#1E1E1E',
        padding: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    greeting: {
        fontSize: 24,
        color: '#FFFFFF',
    },
    guest: {
        fontSize: 18,
        color: '#B0B0B0',
    },
    searchInput: {
        height: 50,
        backgroundColor: '#2C2C2C',
        borderRadius: 10,
        paddingHorizontal: 15,
        color: '#FFFFFF',
        marginBottom: 20,
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
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    image: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    graph: {
        marginBottom: 10,
        borderRadius: 16,
    },
    itemText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    priceText: {
        color: '#00FF7F',
        fontSize: 18,
    },
    changeText: {
        color: '#00FF7F',
        fontSize: 16,
    },
});

export default MainScreen;
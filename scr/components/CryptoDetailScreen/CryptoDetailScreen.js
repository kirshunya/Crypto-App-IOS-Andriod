import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import axios from 'axios';

const CryptoDetailScreen = ({ route }) => {
    const { coinId } = route.params;
    const [coinData, setCoinData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`);
            setCoinData(response.data);
            //console.log("Fetched coin data:", response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    if (!coinData) {
        return <Text style={styles.errorText}>Нет данных</Text>;
    }

    const currentPrice = coinData.market_data?.current_price?.usd || 0;
    const priceChange24h = coinData.market_data?.price_change_percentage_24h || 0;
    const priceChangeValue = coinData.market_data?.price_change_24h || 0;
    const totalVolume = coinData.market_data?.total_volume?.usd || 0;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: coinData.image.large }} style={styles.image} />
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{coinData.name} ({coinData.symbol.toUpperCase()})</Text>
                    <Text style={styles.price}>${currentPrice.toFixed(2)}</Text>
                </View>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>Объем:</Text>
                <Text style={styles.infoValue}>${totalVolume.toLocaleString()}</Text>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>Изменение 24h:</Text>
                <Text style={[styles.infoValue, { color: priceChange24h >= 0 ? '#32CD32' : '#FF4500' }]}>
                    {priceChangeValue.toFixed(2)} USD ({priceChange24h.toFixed(2)}%)
                </Text>
            </View>

            <View style={styles.additionalInfoContainer}>
                <Text style={styles.additionalInfoTitle}>Дополнительная информация:</Text>
                <Text style={styles.additionalInfoText}>{coinData.description?.en || "Нет описания"}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#1E1E1E',
    },
    container: {
        flex: 1,
        paddingTop: 70,
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
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 60,
        height: 60,
        marginRight: 15,
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    price: {
        color: '#00FF7F',
        fontSize: 32,
        fontWeight: 'bold',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    infoTitle: {
        color: '#B0B0B0',
        fontSize: 18,
    },
    infoValue: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    additionalInfoContainer: {
        marginTop: 20,
    },
    additionalInfoTitle: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    additionalInfoText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    errorText: {
        color: '#FF0000',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default CryptoDetailScreen;
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import axios from 'axios';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import * as scale from 'd3-scale';
import { PanGestureHandler } from 'react-native-gesture-handler';

const CryptoDetailScreen = ({ route }) => {
    const { coinId } = route.params;
    const [coinData, setCoinData] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [dates, setDates] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const coinResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`);
            const chartResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`);

            setCoinData(coinResponse.data);

            // Обработка данных для графика
            const prices = chartResponse.data.prices;
            const priceValues = prices.map(price => price[1]);
            const dateValues = prices.map(price => {
                const date = new Date(price[0]);
                return `${date.getDate()}. ${date.toLocaleString('default', { month: 'short' })}`;
            });

            setChartData(priceValues);
            setDates(dateValues);
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
                <ActivityIndicator size="large" color="#00A8FF" />
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
                    <Text style={styles.title}>{coinData.name}</Text>
                    <Text style={styles.symbol}>({coinData.symbol.toUpperCase()})</Text>
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

            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>График цен за последние 7 дней</Text>
                <PanGestureHandler>
                    <View style={{ flexDirection: 'row', height: 220 }}>
                        <YAxis
                            data={chartData}
                            contentInset={{ top: 20, bottom: 20 }}
                            svg={{
                                fill: '#B0B0B0',
                                fontSize: 12,
                            }}
                            numberOfTicks={5}
                            scale={scale.scaleLinear}
                        />
                        <View style={{ flex: 1 }}>
                            <LineChart
                                style={{ flex: 1 }}
                                data={chartData}
                                svg={{ stroke: 'url(#gradient)', strokeWidth: 3 }}
                                contentInset={{ top: 20, bottom: 20 }}
                            >
                                <Defs>
                                    <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                                        <Stop offset="0" stopColor="#00A8FF" stopOpacity={1} />
                                        <Stop offset="1" stopColor="#00FF7F" stopOpacity={1} />
                                    </LinearGradient>
                                </Defs>
                                <Grid />
                            </LineChart>
                            <XAxis
                                style={{ marginTop: 10 }}
                                data={dates}
                                scale={scale.scaleBand}
                                formatLabel={(value, index) => dates[index]}
                                contentInset={{ left: 30, right: 30 }}
                                svg={{
                                    fill: '#B0B0B0',
                                    fontSize: 12,
                                }}
                                spacingInner={0.3} // Добавлено для расстановки значений
                            />
                        </View>
                    </View>
                </PanGestureHandler>
            </View>

            <View style={styles.additionalInfoContainer}>
                <Text style={styles.additionalInfoTitle}>Дополнительная информация:</Text>
                <Text style={styles.additionalInfoText}>{coinData.description?.en || "Нет описания"}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 70,
        backgroundColor: '#1C1C1E',
        padding: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingBottom: 10,
    },
    image: {
        width: 60,
        height: 60,
        marginRight: 15,
        borderRadius: 30,
        borderColor: '#00A8FF',
        borderWidth: 2,
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
    symbol: {
        color: '#A9A9A9',
        fontSize: 16,
    },
    price: {
        color: '#00FF7F',
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 5,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#2C2C2E',
    },
    infoTitle: {
        color: '#B0B0B0',
        fontSize: 18,
    },
    infoValue: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    chartContainer: {
        marginVertical: 20,
        borderRadius: 8,
        backgroundColor: '#2C2C2E',
        padding: 10,
    },
    chartTitle: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    additionalInfoContainer: {
        marginTop: 20,
        backgroundColor: '#2C2C2E',
        borderRadius: 8,
        padding: 10,
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
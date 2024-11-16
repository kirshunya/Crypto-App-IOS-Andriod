import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ScreenOrientation from 'expo-screen-orientation';

const getOrientation = () => {
    const dim = Dimensions.get('screen');
    return dim.width >= dim.height ? 'landscape' : 'portrait';
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    table: {
        backgroundColor: '#1E1E1E',
    },
    headerRow: {
        flexDirection: 'row',
    },
    headerColumn: {
        width: 100,
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        height: 50,
        padding: 5,
        borderWidth: 1,
        borderColor: '#333333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellPortrait: {
        width: 80,
    },
    cellLandscape: {
        width: 120,
    },
    cellText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 12,
    },
    cellTextLandscape: {
        fontSize: 14,
    },
    headerCell: {
        backgroundColor: '#2A2A2A',
    },
    headerCellText: {
        color: '#00FF7F',
        fontWeight: 'bold',
    },
    profitBest: {
        color: '#00FF7F',
        fontWeight: 'bold',
    },
    profitWorst: {
        color: '#FF4444',
        fontWeight: 'bold',
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#2A2A2A',
    },
    sortButtonText: {
        color: '#FFFFFF',
        marginRight: 5,
    },
    emptyCell: {
        backgroundColor: '#1E1E1E',
    }
});

const EXCHANGES = [
    'Binance', 'Coinbase', 'Kraken', 'KuCoin', 'Huobi',
    'Bitfinex', 'Bybit', 'Gate.io', 'OKX', 'Gemini'
];

export default function ArbitrageTable({ route }) {
    const { coin } = route.params;
    const [prices, setPrices] = useState({});
    const [loading, setLoading] = useState(true);
    const [profitMatrix, setProfitMatrix] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [bestProfit, setBestProfit] = useState(null);
    const [worstProfit, setWorstProfit] = useState(null);
    const [orientation, setOrientation] = useState(getOrientation());

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', () => {
            setOrientation(getOrientation());
        });

        return () => {
            subscription?.remove();
        };
    }, []);

    useEffect(() => {
        fetchPrices();
        const interval = setInterval(fetchPrices, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (Object.keys(prices).length > 0) {
            calculateProfitMatrix();
        }
    }, [prices]);

    const fetchPrices = async () => {
        const mockPrices = {};
        EXCHANGES.forEach(exchange => {
            mockPrices[exchange] =
                parseFloat((Math.random() * 0.1 + 1) * getBasePrice(coin)).toFixed(2);
        });
        setPrices(mockPrices);
        setLoading(false);
    };

    const getBasePrice = (coin) => {
        const basePrices = {
            'BTC': 35000,
            'ETH': 2000,
            'BNB': 300,
            'XRP': 0.5,
            'ADA': 1.2,
            'DOGE': 0.1,
            'MATIC': 0.8,
            'SOL': 100,
            'DOT': 15,
            'SHIB': 0.00001,
            'AVAX': 50,
            'TRX': 0.08,
            'LINK': 20
        };
        return basePrices[coin] || 100;
    };

    const calculateProfit = (buyPrice, sellPrice) => {
        return ((sellPrice - buyPrice) / buyPrice * 100).toFixed(2);
    };

    const calculateProfitMatrix = () => {
        let matrix = [];
        let maxProfit = -Infinity;
        let minProfit = Infinity;

        EXCHANGES.forEach(sellExchange => {
            const row = [];
            EXCHANGES.forEach(buyExchange => {
                if (buyExchange === sellExchange) {
                    row.push(null);
                } else {
                    const profit = parseFloat(calculateProfit(
                        parseFloat(prices[buyExchange]),
                        parseFloat(prices[sellExchange])
                    ));
                    row.push(profit);

                    if (profit > maxProfit) maxProfit = profit;
                    if (profit < minProfit) minProfit = profit;
                }
            });
            matrix.push(row);
        });

        setProfitMatrix(matrix);
        setBestProfit(maxProfit);
        setWorstProfit(minProfit);
    };

    const cellStyle = [
        styles.cell,
        orientation === 'portrait' ? styles.cellPortrait : styles.cellLandscape
    ];

    const textStyle = [
        styles.cellText,
        orientation === 'landscape' && styles.cellTextLandscape
    ];

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00FF7F" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView horizontal>
                <View>
                    <View style={styles.headerRow}>
                        <View style={[...cellStyle, styles.headerCell, styles.emptyCell]}>
                            <Text style={[...textStyle, styles.headerCellText]}>Buy → Sell ↓</Text>
                        </View>
                        {EXCHANGES.map(exchange => (
                            <View key={exchange} style={[...cellStyle, styles.headerCell]}>
                                <Text style={[...textStyle, styles.headerCellText]}>
                                    {exchange}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {EXCHANGES.map((sellExchange, rowIndex) => (
                        <View key={sellExchange} style={styles.row}>
                            <View style={[...cellStyle, styles.headerCell]}>
                                <Text style={[...textStyle, styles.headerCellText]}>
                                    {sellExchange}
                                </Text>
                            </View>
                            {EXCHANGES.map((buyExchange, colIndex) => (
                                <View key={`${sellExchange}-${buyExchange}`} style={cellStyle}>
                                    {profitMatrix[rowIndex]?.[colIndex] === null ? (
                                        <Text style={textStyle}>-</Text>
                                    ) : (
                                        <Text style={[
                                            textStyle,
                                            profitMatrix[rowIndex]?.[colIndex] === bestProfit && styles.profitBest,
                                            profitMatrix[rowIndex]?.[colIndex] === worstProfit && styles.profitWorst,
                                        ]}>
                                            {profitMatrix[rowIndex]?.[colIndex]}%
                                        </Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
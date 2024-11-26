import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';

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
    cellText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 12,
    },
    headerCell: {
        backgroundColor: '#2A2A2A',
    },
    headerCellText: {
        color: '#00FF7F',
        fontWeight: 'bold',
    },
});

const EXCHANGES = [
    { name: 'Binance', url: 'https://api.binance.com/api/v3/ticker/price?symbol=' },
    { name: 'Coinbase', url: 'https://api.coinbase.com/v2/prices/' },
    { name: 'Kraken', url: 'https://api.kraken.com/0/public/Ticker?pair=' },
    { name: 'KuCoin', url: 'https://api.kucoin.com/api/v1/prices?' },
    { name: 'Huobi', url: 'https://api.huobi.pro/market/detail/merged?symbol=' },
    { name: 'Bitfinex', url: 'https://api-pub.bitfinex.com/v2/tickers?symbols=' },
    { name: 'Bybit', url: 'https://api.bybit.com/v2/public/tickers?symbol=' },
    { name: 'Gate.io', url: 'https://api.gate.io/api2/1/tickers' },
    { name: 'OKX', url: 'https://www.okx.com/api/v5/market/tickers?instType=SPOT' },
    { name: 'Gemini', url: 'https://api.gemini.com/v1/pubticker/' },
];

export default function ArbitrageTable({ route }) {
    const { coin } = route.params;
    const [prices, setPrices] = useState({});
    const [loading, setLoading] = useState(true);
    const [profitMatrix, setProfitMatrix] = useState([]);

    useEffect(() => {
        fetchPrices();
        const interval = setInterval(fetchPrices, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchPrices = async () => {
        setLoading(true);
        const fetchedPrices = {};

        const pricePromises = EXCHANGES.map(async (exchange) => {
            try {
                let response;
                const symbol = coin === 'BTC' ? 'BTCUSDT' : coin + 'USDT'; // Adjust symbol based on exchange API requirements

                if (exchange.name === 'Coinbase') {
                    response = await fetch(`${exchange.url}${coin}-USD/spot`);
                    const data = await response.json();
                    fetchedPrices[exchange.name] = data.data.amount;
                } else if (exchange.name === 'Kraken') {
                    response = await fetch(`${exchange.url}${symbol}`);
                    const data = await response.json();
                    fetchedPrices[exchange.name] = data.result[symbol].c[0];
                } else if (exchange.name === 'Huobi') {
                    response = await fetch(`${exchange.url}${coin.toLowerCase()}usdt`);
                    const data = await response.json();
                    fetchedPrices[exchange.name] = data.tick.close;
                } else if (exchange.name === 'Bitfinex') {
                    response = await fetch(`${exchange.url}t${symbol}`);
                    const data = await response.json();
                    fetchedPrices[exchange.name] = data[0][1];
                } else if (exchange.name === 'Bybit') {
                    response = await fetch(`${exchange.url}${symbol}`);
                    const data = await response.json();
                    fetchedPrices[exchange.name] = data.result[0].last_price;
                } else if (exchange.name === 'Gate.io') {
                    response = await fetch(exchange.url);
                    const data = await response.json();
                    fetchedPrices[exchange.name] = data[`${coin.toLowerCase()}_usdt`].last;
                } else if (exchange.name === 'OKX') {
                    response = await fetch(exchange.url);
                    const data = await response.json();
                    const ticker = data.data.find(item => item.instId.includes(coin));
                    fetchedPrices[exchange.name] = ticker.last;
                } else if (exchange.name === 'Gemini') {
                    response = await fetch(`${exchange.url}${coin}USD`);
                    const data = await response.json();
                    fetchedPrices[exchange.name] = data.last;
                } else {
                    response = await fetch(`${exchange.url}${symbol}`);
                    const data = await response.json();
                    fetchedPrices[exchange.name] = data.price;
                }
            } catch (error) {
                console.error(`Error fetching price from ${exchange.name}:`, error);
            }
        });

        await Promise.all(pricePromises);
        setPrices(fetchedPrices);
        setLoading(false);
        calculateProfitMatrix(fetchedPrices);
    };

    const calculateProfitMatrix = (prices) => {
        let matrix = [];
        EXCHANGES.forEach(sellExchange => {
            const row = [];
            EXCHANGES.forEach(buyExchange => {
                if (buyExchange === sellExchange) {
                    row.push(null);
                } else {
                    const profit = calculateProfit(prices[buyExchange], prices[sellExchange]);
                    row.push(profit);
                }
            });
            matrix.push(row);
        });
        setProfitMatrix(matrix);
    };

    const calculateProfit = (buyPrice, sellPrice) => {
        return ((sellPrice - buyPrice) / buyPrice * 100).toFixed(2);
    };

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
                        <View style={[styles.cell, styles.headerCell]}>
                            <Text style={styles.headerCellText}>Buy → Sell ↓</Text>
                        </View>
                        {EXCHANGES.map(exchange => (
                            <View key={exchange.name} style={[styles.cell, styles.headerCell]}>
                                <Text style={styles.headerCellText}>{exchange.name}</Text>
                            </View>
                        ))}
                    </View>

                    {EXCHANGES.map((sellExchange, rowIndex) => (
                        <View key={sellExchange.name} style={styles.row}>
                            <View style={[styles.cell, styles.headerCell]}>
                                <Text style={styles.headerCellText}>{sellExchange.name}</Text>
                            </View>
                            {EXCHANGES.map((buyExchange, colIndex) => (
                                <View key={`${sellExchange.name}-${buyExchange.name}`} style={styles.cell}>
                                    {profitMatrix[rowIndex]?.[colIndex] === null ? (
                                        <Text style={styles.cellText}>-</Text>
                                    ) : (
                                        <Text style={styles.cellText}>
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
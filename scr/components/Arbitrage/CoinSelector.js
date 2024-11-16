import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 10,
    },
    coinItem: {
        flex: 1,
        margin: 5,
        padding: 15,
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    coinIcon: {
        marginBottom: 8,
    },
    coinText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    coinPrice: {
        fontSize: 12,
        color: '#888888',
        marginTop: 4,
    }
});

const SUPPORTED_COINS = [
    { symbol: 'BTC', name: 'Bitcoin', icon: 'bitcoin' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'ethereum' },
    { symbol: 'BNB', name: 'Binance Coin', icon: 'currency-bnb' },
    { symbol: 'XRP', name: 'Ripple', icon: 'currency-xrp' },
    { symbol: 'ADA', name: 'Cardano', icon: 'alpha-a-circle' },
    { symbol: 'DOGE', name: 'Dogecoin', icon: 'dog' },
    { symbol: 'MATIC', name: 'Polygon', icon: 'hexagon-multiple' },
    { symbol: 'SOL', name: 'Solana', icon: 'sun-wireless' },
    { symbol: 'DOT', name: 'Polkadot', icon: 'dots-horizontal-circle' },
    { symbol: 'SHIB', name: 'Shiba Inu', icon: 'dog-side' },
    { symbol: 'AVAX', name: 'Avalanche', icon: 'arrow-down-bold' },
    { symbol: 'TRX', name: 'Tron', icon: 'triangle' },
    { symbol: 'LINK', name: 'Chainlink', icon: 'link' }
];

export default function CoinSelector({ navigation }) {
    const renderCoin = ({ item }) => (
        <TouchableOpacity
            style={styles.coinItem}
            onPress={() => navigation.navigate('ArbitrageTable', { coin: item.symbol })}
        >
            <Icon
                name={item.icon}
                size={32}
                color="#00FF7F"
                style={styles.coinIcon}
            />
            <Text style={styles.coinText}>{item.symbol}</Text>
            <Text style={styles.coinPrice}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={SUPPORTED_COINS}
                renderItem={renderCoin}
                keyExtractor={item => item.symbol}
                numColumns={3}
            />
        </View>
    );
}
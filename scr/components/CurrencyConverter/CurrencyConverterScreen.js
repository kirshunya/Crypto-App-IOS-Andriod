import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Modal,
    FlatList,
} from 'react-native';

const currencies = [
    { label: 'Bitcoin (BTC)', value: 'BTC', image: { uri: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' } },
    { label: 'Ethereum (ETH)', value: 'ETH', image: { uri: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' } },
    { label: 'Litecoin (LTC)', value: 'LTC', image: { uri: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png' } },
    { label: 'Ripple (XRP)', value: 'XRP', image: { uri: 'https://cryptologos.cc/logos/ripple-xrp-logo.png' } },
];

const CryptoConverter = () => {
    const [amount, setAmount] = useState('1');
    const [fromCurrency, setFromCurrency] = useState('BTC');
    const [toCurrency, setToCurrency] = useState('ETH');
    const [convertedAmount, setConvertedAmount] = useState('0');
    const [modalVisible, setModalVisible] = useState(false);
    const [isFromCurrency, setIsFromCurrency] = useState(true);

    const exchangeRates = {
        BTC: { ETH: 15, LTC: 200, XRP: 3000 },
        ETH: { BTC: 0.067, LTC: 13.33, XRP: 200 },
        LTC: { BTC: 0.005, ETH: 0.075, XRP: 15 },
        XRP: { BTC: 0.00033, ETH: 0.005, LTC: 0.067 },
    };

    const convertCurrency = () => {
        const rate = exchangeRates[fromCurrency][toCurrency] || 1;
        const result = (amount * rate).toFixed(4);
        setConvertedAmount(result);
    };

    const selectCurrency = (value) => {
        if (isFromCurrency) {
            setFromCurrency(value);
        } else {
            setToCurrency(value);
        }
        setModalVisible(false);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Криптовалютный конвертер</Text>

            {/* Ввод валюты */}
            <View style={styles.converterRow}>
                <TextInput
                    style={styles.input}
                    value={amount}
                    keyboardType="numeric"
                    onChangeText={setAmount}
                />
                <TouchableOpacity onPress={() => { setIsFromCurrency(true); setModalVisible(true); }} style={styles.currencyButton}>
                    <Image source={currencies.find(c => c.value === fromCurrency).image} style={styles.icon} />
                    <Text style={styles.currencyText}>{fromCurrency}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.convertButton} onPress={convertCurrency}>
                <Text style={styles.convertButtonText}>Конвертировать</Text>
            </TouchableOpacity>

            {/* Вывод валюты */}
            <View style={styles.outputContainer}>
                <TouchableOpacity onPress={() => { setIsFromCurrency(false); setModalVisible(true); }} style={styles.currencyButton}>
                    <Image source={currencies.find(c => c.value === toCurrency).image} style={styles.icon} />
                    <Text style={styles.currencyText}>{toCurrency}</Text>
                </TouchableOpacity>
                <Text style={styles.resultText}>
                    {convertedAmount} {toCurrency}
                </Text>
            </View>

            {/* Модальное окно для выбора валюты */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <FlatList
                        data={currencies}
                        keyExtractor={item => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.modalItem} onPress={() => selectCurrency(item.value)}>
                                <Image source={item.image} style={styles.modalImage} />
                                <Text style={styles.modalText}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#1E1E1E',
    },
    title: {
        fontSize: 24,
        color: '#FFFFFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    converterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        padding: 10,
    },
    input: {
        flex: 1,
        height: 50,
        borderColor: '#007BFF',
        borderWidth: 1,
        borderRadius: 10,
        marginRight: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#FFFFFF',
        backgroundColor: '#3A3A3A',
    },
    currencyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 5,
    },
    currencyText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    convertButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        alignItems: 'center',
        borderRadius: 10,
        marginVertical: 20,
    },
    convertButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    outputContainer: {
        alignItems: 'center',
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        padding: 10,
    },
    resultText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        padding: 20,
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomColor: '#444',
        borderBottomWidth: 1,
    },
    modalImage: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    modalText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    closeButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default CryptoConverter;
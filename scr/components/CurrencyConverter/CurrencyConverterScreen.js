import React, { useEffect, useState } from 'react';
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
import axios from 'axios';

const CryptoConverter = () => {
    const [amounts, setAmounts] = useState(['1']);
    const [currencies, setCurrencies] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [conversionRates, setConversionRates] = useState({});

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
                    params: {
                        vs_currency: 'usd',
                        order: 'market_cap_desc',
                        per_page: 10,
                        page: 1,
                        sparkline: false,
                    }
                });
                const formattedCurrencies = response.data.map(coin => ({
                    label: `${coin.name} (${coin.symbol.toUpperCase()})`,
                    value: coin.symbol.toUpperCase(),
                    image: { uri: coin.image },
                    current_price: coin.current_price,
                }));
                setCurrencies(formattedCurrencies);
                setConversionRates(Object.fromEntries(formattedCurrencies.map(coin => [coin.value, coin.current_price])));
            } catch (error) {
                console.error('Error fetching currencies:', error);
            }
        };
        fetchCurrencies();
    }, []);

    const handleAmountChange = (text, index) => {
        const newAmounts = [...amounts];
        newAmounts[index] = text;

        // Обновляем состояния
        setAmounts(newAmounts);
        convertCurrencies(newAmounts);
    };

    const convertCurrencies = (amounts) => {
        const dollarValues = amounts.map((amount, index) => {
            const value = parseFloat(amount);
            // Если значение не числовое или пустое, возвращаем 0
            if (isNaN(value) || value < 0) {
                return 0;
            }
            return value * (conversionRates[currencies[index].value] || 1);
        });

        const results = dollarValues.map((dollarValue) => {
            return currencies.map((coin) => {
                return (dollarValue / (conversionRates[coin.value] || 1)).toFixed(4);
            });
        });

        // Обновляем состояния с результатами конвертации
        setAmounts(results[0] || []);
    };

    const selectCurrency = (value) => {
        const newCurrencies = [...currencies];
        if (newCurrencies[selectedIndex]) {
            newCurrencies[selectedIndex].value = value;
        }
        setModalVisible(false);
        convertCurrencies(amounts);
    };

    const addCurrencyInput = () => {
        if (currencies.length > amounts.length) {
            setAmounts([...amounts, '']);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Криптовалютный конвертер</Text>

            {currencies.map((currency, index) => (
                <View key={index} style={styles.converterRow}>
                    <TextInput
                        style={styles.input}
                        value={amounts[index]}
                        keyboardType="numeric"
                        onChangeText={(text) => handleAmountChange(text, index)}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedIndex(index);
                            setModalVisible(true);
                        }}
                        style={styles.currencyButton}
                    >
                        <Image source={currency.image} style={styles.icon} />
                        <Text style={styles.currencyText}>{currency.value}</Text>
                    </TouchableOpacity>
                </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={addCurrencyInput}>
                <Text style={styles.addButtonText}>Добавить валюту</Text>
            </TouchableOpacity>

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
        paddingTop: 70,
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
    addButton: {
        backgroundColor: '#28A745',
        padding: 15,
        alignItems: 'center',
        borderRadius: 10,
        marginVertical: 20,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
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
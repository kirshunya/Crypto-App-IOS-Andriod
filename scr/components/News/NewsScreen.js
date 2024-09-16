import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';

const NewsScreen = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(`https://newsapi.org/v2/everything?q=cryptocurrency&apiKey=3d5e09a26efa4e0c89ea949298e43271`);
                setNews(response.data.articles);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.newsItem}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
                <Text style={styles.link}>Читать далее</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
            ) : (
                <FlatList
                    data={news}
                    keyExtractor={(item) => item.url}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        padding: 20,
        backgroundColor: '#1E1E1E',
    },
    newsItem: {
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    description: {
        color: '#CCCCCC',
        marginVertical: 5,
    },
    link: {
        color: '#007BFF',
        marginTop: 5,
    },
});

export default NewsScreen;
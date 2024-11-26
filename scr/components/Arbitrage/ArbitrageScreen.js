import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CoinSelector from './CoinSelector';
import ArbitrageTable from './ArbitrageTable';
import { useTranslation } from 'react-i18next'; // Импортируем useTranslation

const ArbitrageStack = createStackNavigator();

export default function ArbitrageScreen() {
    const { t } = useTranslation(); // Инициализируем i18next

    return (
        <ArbitrageStack.Navigator>
            <ArbitrageStack.Screen
                name="CoinSelector"
                component={CoinSelector}
                options={{
                    title: t('coinSelector'), // Локализованный текст
                    headerStyle: {
                        backgroundColor: '#1E1E1E',
                    },
                    headerTintColor: '#00FF7F',
                }}
            />
            <ArbitrageStack.Screen
                name="ArbitrageTable"
                component={ArbitrageTable}
                options={{
                    title: t('arbitrage'), // Локализованный текст
                    headerStyle: {
                        backgroundColor: '#1E1E1E',
                    },
                    headerTintColor: '#00FF7F',
                }}
            />
        </ArbitrageStack.Navigator>
    );
}
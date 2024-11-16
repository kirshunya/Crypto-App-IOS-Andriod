import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CoinSelector from './CoinSelector';
import ArbitrageTable from './ArbitrageTable';

const ArbitrageStack = createStackNavigator();

export default function ArbitrageScreen() {
    return (
        <ArbitrageStack.Navigator>
            <ArbitrageStack.Screen
                name="CoinSelector"
                component={CoinSelector}
                options={{
                    title: 'Выбор монеты',
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
                    title: 'Арбитраж',
                    headerStyle: {
                        backgroundColor: '#1E1E1E',
                    },
                    headerTintColor: '#00FF7F',
                }}
            />
        </ArbitrageStack.Navigator>
    );
}
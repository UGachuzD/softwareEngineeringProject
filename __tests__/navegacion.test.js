import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../src/screens/Home'; 

// Mock de las pantallas
jest.mock('../src/screens/DashboardScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>Dashboard Screen</Text>;
});
jest.mock('../src/screens/EntriesScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>Entries Screen</Text>;
});
jest.mock('../src/screens/ProfileScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>Profile Screen</Text>;
});
jest.mock('../src/screens/ModelScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>Model Screen</Text>;
});

describe('Home Component', () => {
  const renderWithNavigation = () =>
    render(
      <NavigationContainer>
        <Home />
      </NavigationContainer>
    );

  it('debería renderizar todas las pestañas correctamente', () => {
    const { getByText } = renderWithNavigation();

    // Verificar que la pantalla inicial sea Dashboard
    expect(getByText('Dashboard Screen')).toBeTruthy();
  });

  it('debería navegar a la pantalla Entries al presionar la pestaña Entries', async () => {
    const { getByText } = renderWithNavigation();

    // Navegar a Entries
    fireEvent.press(getByText('Entries'));

    // Verificar que estamos en la pantalla Entries
    expect(getByText('Entries Screen')).toBeTruthy();
  });

  it('debería navegar a la pantalla Model al presionar la pestaña Model', async () => {
    const { getByText } = renderWithNavigation();

    // Navegar a Model
    fireEvent.press(getByText('Model'));

    // Verificar que estamos en la pantalla Model
    expect(getByText('Model Screen')).toBeTruthy();
  });

  it('debería navegar a la pantalla Profile al presionar la pestaña Profile', async () => {
    const { getByText } = renderWithNavigation();

    // Navegar a Profile
    fireEvent.press(getByText('Profile'));

    // Verificar que estamos en la pantalla Profile
    expect(getByText('Profile Screen')).toBeTruthy();
  });
});

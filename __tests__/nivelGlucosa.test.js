import React from 'react';
import { Alert } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import DashboardScreen from '../src/screens/DashboardScreen';
import axios from 'axios';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: { uid: 'mockUserId' },
  })),
}));

jest.mock('@env', () => ({
  IPHOSTLOCAL: 'http://mock-ip',
}));

jest.mock('axios');

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    blob: () => Promise.resolve(new Blob()),
  })
);

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

afterEach(() => {
  jest.clearAllMocks();
  jest.runOnlyPendingTimers();
});

describe('DashboardScreen - Alertas por valores de glucosa', () => {
  beforeEach(() => {
    axios.get.mockResolvedValueOnce({
      data: { content: '2023-11-01,60\n2023-11-02,200' },
    });
  });

  test('Muestra alertas para hipoglucemia e hiperglucemia', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <DashboardScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Hipoglucemia detectada',
        'Fecha: 2023-11-01, Glucosa: 60 mg/dL'
      );
      expect(Alert.alert).toHaveBeenCalledWith(
        'Hiperglucemia detectada',
        'Fecha: 2023-11-02, Glucosa: 200 mg/dL'
      );
    });
  });
});

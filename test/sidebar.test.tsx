import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { ReactElement } from 'react';
import { beforeEach, describe, expect, Mock, test, vi } from 'vitest';
import Sidebar from '../src/components/Sidebar';
import { OwnerStatus, PaymentMethod } from '../src/mocks/types';

const mockIncentivesData = {
  incentives: [
    {
      id: 'CA-1',
      program: 'ca_CaliforniaEnergySmartHomes',
      payment_methods: [PaymentMethod.REBATE],
      items: [
        'other_heat_pump',
        'heat_pump_water_heater',
        'electric_stove',
        'heat_pump_clothes_dryer',
        'non_heat_pump_clothes_dryer',
      ],
      amount: {
        type: 'dollar_amount',
        number: 4250,
      },
      owner_status: [OwnerStatus.HOMEOWNER],
      short_description: {
        en: '$4,250 rebate for installing heat pump space heating, heat pump water heating, induction cooking, and an electric dryer (must install all).',
        es: 'Reembolso de $4,250 por instalar calefacción con bomba de calor, calentador de agua con bomba de calor, cocina de inducción y secadora eléctrica (debe instalar todo).',
      },
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      eligible_geo_group: 'ca-energy-smart-homes-territories',
    },
  ],
};

vi.mock('../src/lib/api', () => ({
  $api: {
    useQuery: vi.fn(),
  },
}));

import { $api } from '../src/lib/api';

// Helper function to wrap component with QueryClientProvider
const renderWithClient = (ui: ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Set stale time to infinity to prevent refetching during tests
        staleTime: Infinity,
      },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

describe('Sidebar Component', () => {
  const mockStateData = {
    type: 'Feature',
    properties: {
      geo_point_2d: {
        lon: -119.61060994717245,
        lat: 37.246338610069266,
      },
      year: '2023',
      ste_code: ['06'],
      ste_name: ['California'],
      ste_area_code: 'USA',
      ste_type: 'state',
      ste_name_long: null,
      ste_fp_code: null,
      ste_gnis_code: '01779778',
    },
    geometry: null,
    _geometry: null,
    id: 0,
    _vectorTileFeature: null,
    toJSON: () => ({}),
  } as unknown as maplibregl.MapGeoJSONFeature;

  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    ($api.useQuery as Mock).mockReturnValue({
      data: mockIncentivesData,
      isLoading: false,
      isError: false,
    });
  });

  test('renders nothing when stateData is not provided', () => {
    renderWithClient(<Sidebar />);
    expect(
      screen.queryByText(/select a state on the map to view details/i),
    ).not.toBeInTheDocument();
  });

  test('renders the sidebar when stateData is provided', () => {
    renderWithClient(<Sidebar selectedFeature={mockStateData} />);
    expect(screen.getByText('California')).toBeInTheDocument();
    expect(screen.getByText('Details about California')).toBeInTheDocument();
  });

  test('calls onClose when the close button is clicked', () => {
    renderWithClient(
      <Sidebar selectedFeature={mockStateData} onClose={mockOnClose} />,
    );
    const closeButton = screen.getByRole('button', { name: /close sidebar/i });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('renders incentives when feature is provided', () => {
    renderWithClient(<Sidebar selectedFeature={mockStateData} />);

    expect($api.useQuery).toHaveBeenCalledWith(
      'get',
      '/api/v1/incentives',
      expect.objectContaining({
        params: {
          query: {
            state: 'CA',
          },
        },
      }),
    );

    const programElements = screen.getAllByText(
      'ca_CaliforniaEnergySmartHomes',
    );
    expect(programElements.length).toBeGreaterThan(0);
  });

  test('displays a placeholder message when no stateData is provided', () => {
    ($api.useQuery as Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });

    renderWithClient(<Sidebar />);
    expect(
      screen.queryByText(/select a state on the map to view details/i),
    ).not.toBeInTheDocument();
  });
});

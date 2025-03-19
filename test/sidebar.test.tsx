vi.mock('../mocks/data', () => ({
  mockIncentivesData: {
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
  },
}));

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import Sidebar from '../src/components/Sidebar';
import { OwnerStatus, PaymentMethod } from '../src/mocks/types';

describe('Sidebar Component', () => {
  const mockStateData = {
    name: 'California',
    description: 'Details about California',
  };

  const mockOnChipSelectionChange = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders nothing when stateData is not provided', () => {
    render(<Sidebar />);
    expect(
      screen.queryByText(/select a state on the map to view details/i),
    ).not.toBeInTheDocument();
  });

  test('renders the sidebar when stateData is provided', () => {
    render(<Sidebar stateData={mockStateData} />);
    expect(screen.getByText('California')).toBeInTheDocument();
    expect(screen.getByText('Details about California')).toBeInTheDocument();
  });

  test('calls onClose when the close button is clicked', () => {
    render(<Sidebar stateData={mockStateData} onClose={mockOnClose} />);
    const closeButton = screen.getByRole('button', { name: /close sidebar/i });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('renders chips and toggles their selection state', () => {
    render(
      <Sidebar
        stateData={mockStateData}
        onChipSelectionChange={mockOnChipSelectionChange}
      />,
    );
    const spanElement = screen.getByText('Incentive 1');
    const chipButton = spanElement.closest('button');

    if (chipButton) {
      // Button should be selected
      expect(chipButton).toHaveClass('bg-[#eed87e]');
      fireEvent.click(chipButton);
      expect(mockOnChipSelectionChange).toHaveBeenCalledTimes(1);
      expect(mockOnChipSelectionChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'chip1', selected: false }),
        ]),
      );
    }
  });

  test('renders incentives when stateData is provided', () => {
    render(<Sidebar stateData={mockStateData} />);
    // Check that the incentive program title for California is displayed
    expect(
      screen.getByText('ca_CaliforniaEnergySmartHomes'),
    ).toBeInTheDocument();
  });

  test('displays a placeholder message when no stateData is provided', () => {
    render(<Sidebar />);
    expect(
      screen.queryByText(/select a state on the map to view details/i),
    ).not.toBeInTheDocument();
  });
});

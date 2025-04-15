import { IncentivesResponse, OwnerStatus, PaymentMethod } from './types';

export const mockIncentivesData: IncentivesResponse = {
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
    {
      id: 'CA-2',
      eligible_geo_group: 'ca-energy-smart-homes-territories',
      payment_methods: [PaymentMethod.REBATE],
      items: [
        'electric_stove',
        'other_heat_pump',
        'non_heat_pump_clothes_dryer',
        'heat_pump_clothes_dryer',
      ],
      program: 'ca_CaliforniaEnergySmartHomes',
      amount: {
        type: 'dollar_amount',
        number: 3750,
      },
      owner_status: [OwnerStatus.HOMEOWNER],
      short_description: {
        en: '$3,750 rebate for installing heat pump space heating, heat pump water heating, induction cooking, and an electric dryer (must install all).',
      },
      start_date: '2025-01-01',
      end_date: '2025-12-31',
    },
    {
      id: 'CA-3',
      eligible_geo_group: 'ca-energy-smart-homes-territories',
      payment_methods: [PaymentMethod.REBATE],
      items: ['heat_pump_clothes_dryer'],
      program: 'ca_CaliforniaEnergySmartHomes',
      amount: {
        type: 'dollar_amount',
        number: 250,
      },
      owner_status: [OwnerStatus.HOMEOWNER],
      short_description: {
        en: '$250 bonus rebate for installing a heat pump dryer when making a whole building electrification upgrade.',
      },
      start_date: '2024-01-01',
      end_date: '2025-12-31',
    },
    {
      id: 'CA-4',
      eligible_geo_group: 'ca-energy-smart-homes-territories',
      payment_methods: [PaymentMethod.REBATE],
      items: ['other'],
      program: 'ca_CaliforniaEnergySmartHomes',
      amount: {
        type: 'dollar_amount',
        number: 1000,
        minimum: 1000,
      },
      owner_status: [OwnerStatus.HOMEOWNER],
      short_description: {
        en: 'Bonus rebate of up to $1,000 for electric infrastructure upgrades (per unit served) when making a whole home electrification alteration.',
      },
      start_date: '2024-01-01',
      end_date: '2025-12-31',
    },
    {
      id: 'NY-33',
      program: 'ny-appliance-upgrade-program',
      payment_methods: [PaymentMethod.REBATE],
      items: ['electric_wiring'],
      amount: {
        type: 'percent',
        number: 1,
        maximum: 2500,
      },
      owner_status: [OwnerStatus.HOMEOWNER],
      short_description: {
        en: '100% of cost of electrical wiring, up to $2,500 for income-eligible residents. Must use a participating contractor.',
      },
      start_date: '2024-11-26',
      low_income: 'ny-appliance-low',
    },
    {
      id: 'OR-91',
      program: 'or_salemElectric_solarIncentives',
      payment_methods: [PaymentMethod.REBATE],
      items: ['rooftop_solar_installation'],
      amount: {
        type: 'dollars_per_unit',
        number: 300,
        unit: 'kilowatt',
        maximum: 1500,
      },
      owner_status: [OwnerStatus.HOMEOWNER],
      short_description: {
        en: 'Up to $300/kW rebate for installed home solar systems, not to exceed 50% of project cost.',
      },
    },
    {
      id: 'NJ-1',
      program: 'nj_atlanticCityElectric_aCEResidentialEfficiency',
      payment_methods: [PaymentMethod.ASSISTANCE_PROGRAM],
      items: ['energy_audit'],
      amount: {
        type: 'percent',
        number: 1,
      },
      owner_status: [OwnerStatus.HOMEOWNER, OwnerStatus.RENTER],
      short_description: {
        en: 'Free whole home energy assessment.',
      },
      start_date: '2025-01-01',
      end_date: '2027-06-30',
    },
    {
      id: 'ME-7',
      program: 'me_efficiencyMaine_efficiencyMaineElectricVehicleRebates',
      payment_methods: [PaymentMethod.REBATE],
      items: ['new_electric_vehicle'],
      amount: {
        type: 'dollar_amount',
        number: 7500,
      },
      owner_status: [OwnerStatus.HOMEOWNER, OwnerStatus.RENTER],
      short_description: {
        en: '$7,500 rebate for new battery electric vehicle. Available for low income residents.',
      },
      low_income: 'me-low-income',
    },
  ],
  metadata: {
    last_updated: '2024-03-15T12:00:00Z',
    total_incentives: 5,
    total_states: 5,
  },
};

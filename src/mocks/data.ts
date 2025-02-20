import { components } from "../types/api.gen";

// GET /api/v1/calculator (APICalculatorResponse)
export const calculatorResponse: components["schemas"]["APICalculatorResponse"] =
  {
    is_under_80_ami: true,
    is_under_150_ami: true,
    is_over_150_ami: false,
    authorities: {
      federal: {
        name: "Federal Energy Agency",
        logo: {
          src: "https://example.com/logo-federal.png",
          width: 100,
          height: 50,
        },
      },
      state: {
        name: "California Energy Commission",
        logo: {
          src: "https://example.com/logo-ca.png",
          width: 120,
          height: 60,
        },
      },
    },
    coverage: {
      state: "CA",
      utility: "utility123",
    },
    location: {
      state: "CA",
      city: "Los Angeles",
      county: "Los Angeles County",
    },
    incentives: [
      {
        payment_methods: ["pos_rebate"],
        authority_type: "federal",
        authority: "Federal Energy Agency",
        program: "Clean Energy Pos Rebate",
        program_url: "https://example.com/clean-energy-pos",
        items: ["electric_vehicle_charger", "battery_storage_installation"],
        amount: {
          type: "dollar_amount",
          number: 1000,
          maximum: 1500,
          representative: 1200,
        },
        owner_status: ["homeowner"],
        start_date: "2025",
        end_date: "2027",
        short_description: "A rebate for clean energy installations.",
      },
      {
        payment_methods: ["tax_credit"],
        authority_type: "state",
        authority: "California Energy Commission",
        program: "State Tax Credit for Solar",
        program_url: "https://example.com/solar-tax-credit",
        items: ["rooftop_solar_installation"],
        amount: {
          type: "percent",
          number: 0.3,
        },
        owner_status: ["homeowner", "renter"],
        start_date: "2024-01-01",
        end_date: "2028-12-31",
        short_description:
          "A tax credit to reduce installation costs for rooftop solar.",
      },
    ],
  };

// GET /api/v1/utilities
export const utilitiesResponse = {
  location: {
    state: "CA",
    city: "San Francisco",
    county: "San Francisco County",
  },
  utilities: {
    util123: {
      name: "Pacific Electric",
    },
    util456: {
      name: "Golden Gate Power",
    },
  },
};

// GET /api/v1/incentives/programs
export const programsResponse = {
  authorities: {
    state: {
      name: "California Energy Commission",
      logo: {
        src: "https://example.com/logo-ca.png",
        width: 120,
        height: 60,
      },
    },
    federal: {
      name: "Federal Energy Agency",
      logo: {
        src: "https://example.com/logo-federal.png",
        width: 100,
        height: 50,
      },
    },
  },
  coverage: {
    state: "CA",
    utility: "util123",
  },
  location: {
    state: "CA",
    city: "Los Angeles",
    county_fips: "06037",
  },
  programs: {
    prog1: {
      name: "Solar Incentive Program",
      url: "https://example.com/solar-program",
      authority_type: "state",
      authority: "California Energy Commission",
      items: ["rooftop_solar_installation", "battery_storage_installation"],
    },
    prog2: {
      name: "Electric Vehicle Charger Rebate",
      url: "https://example.com/ev-charger-rebate",
      authority_type: "federal",
      authority: "Federal Energy Agency",
      items: ["electric_vehicle_charger"],
    },
  },
};

// GET /api/v1/rem/address (Savings)
export const remAddressResponse = {
  fuel_results: {
    electricity: {
      baseline: {
        energy: {
          mean: { value: 500, units: "kWh" },
          median: { value: 480, units: "kWh" },
          percentile_20: { value: 400, units: "kWh" },
          percentile_80: { value: 550, units: "kWh" },
        },
        emissions: {
          mean: { value: 300, units: "kg CO2" },
          median: { value: 290, units: "kg CO2" },
          percentile_20: { value: 250, units: "kg CO2" },
          percentile_80: { value: 320, units: "kg CO2" },
        },
        cost: {
          mean: { value: 100, units: "USD" },
          median: { value: 95, units: "USD" },
          percentile_20: { value: 80, units: "USD" },
          percentile_80: { value: 110, units: "USD" },
        },
      },
      upgrade: {
        energy: {
          mean: { value: 400, units: "kWh" },
          median: { value: 380, units: "kWh" },
          percentile_20: { value: 350, units: "kWh" },
          percentile_80: { value: 420, units: "kWh" },
        },
        emissions: {
          mean: { value: 250, units: "kg CO2" },
          median: { value: 240, units: "kg CO2" },
          percentile_20: { value: 220, units: "kg CO2" },
          percentile_80: { value: 260, units: "kg CO2" },
        },
        cost: {
          mean: { value: 80, units: "USD" },
          median: { value: 75, units: "USD" },
          percentile_20: { value: 70, units: "USD" },
          percentile_80: { value: 85, units: "USD" },
        },
      },
      delta: {
        energy: {
          mean: { value: 100, units: "kWh" },
          median: { value: 100, units: "kWh" },
          percentile_20: { value: 50, units: "kWh" },
          percentile_80: { value: 100, units: "kWh" },
        },
        emissions: {
          mean: { value: 50, units: "kg CO2" },
          median: { value: 50, units: "kg CO2" },
          percentile_20: { value: 30, units: "kg CO2" },
          percentile_80: { value: 60, units: "kg CO2" },
        },
        cost: {
          mean: { value: 20, units: "USD" },
          median: { value: 20, units: "USD" },
          percentile_20: { value: 15, units: "USD" },
          percentile_80: { value: 25, units: "USD" },
        },
      },
    },
  },
  rates: {
    electricity: [
      {
        value: 0.12,
        units: "USD/kWh",
        rate_type: "volumetric",
      },
    ],
  },
  emissions_factors: {
    electricity: {
      value: 0.5,
      units: "kg CO2/kWh",
    },
  },
};

// GET /api/v1/health-impacts (HealthImpactsResponse)
export const healthImpactsResponse = {
  data: [
    {
      county: "Los Angeles County",
      "pm25-pri_kg_delta": 25.0,
      nox_kg_delta: 15.0,
      voc_kg_delta: 10.0,
      premature_mortality_incidence_delta: 0.05,
    },
    {
      county: "San Francisco County",
      "pm25-pri_kg_delta": 20.0,
      nox_kg_delta: 12.0,
      voc_kg_delta: 8.0,
      premature_mortality_incidence_delta: 0.04,
    },
  ],
  warnings: [
    "Data is based on estimates and may not reflect current conditions.",
  ],
};

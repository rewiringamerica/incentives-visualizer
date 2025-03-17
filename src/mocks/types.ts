export enum PaymentMethod {
  REBATE = 'rebate',
  TAX_CREDIT = 'tax_credit',
  POS_REBATE = 'pos_rebate',
  ASSISTANCE_PROGRAM = 'assistance_program',
}

export enum OwnerStatus {
  HOMEOWNER = 'homeowner',
  RENTER = 'renter',
}

export type AmountType = 'dollar_amount' | 'percent' | 'dollars_per_unit';
export type Unit = 'kilowatt' | 'ton' | 'square_foot' | 'per_kwh';

export interface Amount {
  type: AmountType;
  number: number;
  minimum?: number;
  maximum?: number;
  unit?: Unit;
}

export interface LocalizableString {
  en: string;
  es?: string;
}

export interface Incentive {
  id: string;
  program: string;
  payment_methods: PaymentMethod[];
  items: string[];
  amount: Amount;
  owner_status: OwnerStatus[];
  short_description: LocalizableString;
  start_date?: string;
  end_date?: string;
  eligible_geo_group?: string;
  bonus_available?: boolean;
  low_income?: string;
  more_info_url?: LocalizableString;
  paused?: boolean;
}

export interface IncentivesMetadata {
  last_updated: string; // ISO date string
  total_incentives: number;
  total_states: number;
}

export interface IncentivesResponse {
  incentives: Incentive[];
  metadata: IncentivesMetadata;
}

// Example usage:
// const response: IncentivesResponse = {
//   incentives: [...],
//   metadata: {
//     last_updated: "2024-03-15T12:00:00Z",
//     total_incentives: 157,
//     total_states: 50
//   }
// };

import { SHIPPING_RATES } from './shipping';

export const WILAYAS = SHIPPING_RATES.map(w => w.name);

export type Wilaya = typeof WILAYAS[number];

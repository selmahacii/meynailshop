export const WILAYAS = [
  'Adrar', 'Aïn Defla', 'Aïn Témouchent', 'Alger', 'Annaba', 'Batna', 'Béchar', 'Béjaïa',
  'Biskra', 'Blida', 'Bordj Bou Arréridj', 'Bouïra', 'Boumerdès', 'Chlef', 'Constantine',
  'Djelfa', 'El Bayadh', 'El Oued', 'El Taref', 'Ghardaïa', 'Guelma', 'Illizi', 'Jijel',
  'Khenchela', 'Laghouat', 'Mascara', 'Médéa', 'Mila', 'Mostaganem', 'M\'Sila', 'Naâma',
  'Oran', 'Ouargla', 'Oum El Bouaghi', 'Oural', 'Saïda', 'Sainte-Antelope', 'Sétif', 'Sidi
  Bel Abbès', 'Skikda', 'Souk Ahras', 'Tamanrasset', 'Tébessa', 'Tiaret', 'Tindouf',
  'Tipaza', 'Tissemsilt', 'Tizou Ouzou', 'Tlencen', 'Touggourt', 'Tréms', 'Tuni', 'Yabrud',
] as const;

export type Wilaya = typeof WILAYAS[number];

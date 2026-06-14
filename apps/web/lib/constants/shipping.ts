export interface WilayaShipping {
    id: string;
    name: string;
    delay: string;
    homeRate: number;
    deskRate: number | null;
    returnRate: number;
}

export const SHIPPING_RATES: WilayaShipping[] = [
  {
    "id": "01",
    "name": "Adrar",
    "delay": "2-5",
    "homeRate": 1500,
    "deskRate": 800,
    "returnRate": 300
  },
  {
    "id": "02",
    "name": "Chlef",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 450,
    "returnRate": 200
  },
  {
    "id": "03",
    "name": "Laghouat",
    "delay": "1-3",
    "homeRate": 950,
    "deskRate": 550,
    "returnRate": 200
  },
  {
    "id": "04",
    "name": "Oum El Bouaghi",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 450,
    "returnRate": 200
  },
  {
    "id": "05",
    "name": "Batna",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 450,
    "returnRate": 200
  },
  {
    "id": "06",
    "name": "Bejaia",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 450,
    "returnRate": 200
  },
  {
    "id": "07",
    "name": "Biskra",
    "delay": "1-3",
    "homeRate": 900,
    "deskRate": 550,
    "returnRate": 200
  },
  {
    "id": "08",
    "name": "Bechar",
    "delay": "2-5",
    "homeRate": 1200,
    "deskRate": 700,
    "returnRate": 300
  },
  {
    "id": "09",
    "name": "Blida",
    "delay": "1",
    "homeRate": 700,
    "deskRate": 400,
    "returnRate": 200
  },
  {
    "id": "10",
    "name": "Bouira",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 450,
    "returnRate": 200
  },
  {
    "id": "11",
    "name": "Tamanrasset",
    "delay": "5-8",
    "homeRate": 1800,
    "deskRate": 950,
    "returnRate": 350
  },
  {
    "id": "12",
    "name": "Tebessa",
    "delay": "1-3",
    "homeRate": 900,
    "deskRate": 500,
    "returnRate": 200
  },
  {
    "id": "13",
    "name": "Tlemcen",
    "delay": "1-3",
    "homeRate": 900,
    "deskRate": 450,
    "returnRate": 200
  },
  {
    "id": "14",
    "name": "Tiaret",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 450,
    "returnRate": 200
  },
  {
    "id": "15",
    "name": "Tizi Ouzou",
    "delay": "1-3",
    "homeRate": 800,
    "deskRate": 400,
    "returnRate": 200
  },
  {
    "id": "16",
    "name": "Alger",
    "delay": "0-1",
    "homeRate": 500,
    "deskRate": 300,
    "returnRate": 200
  },
  {
    "id": "17",
    "name": "Djelfa",
    "delay": "1-3",
    "homeRate": 950,
    "deskRate": 500,
    "returnRate": 200
  },
  {
    "id": "18",
    "name": "Jijel",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 450,
    "returnRate": 200
  },
  {
    "id": "19",
    "name": "Setif",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 450,
    "returnRate": 200
  },
  {
    "id": "20",
    "name": "Saïda",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 500,
    "returnRate": 200
  },
  {
    "id": "21",
    "name": "Skikda",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 450,
    "returnRate": 200
  },
  {
    "id": "22",
    "name": "Sidi Bel Abbes",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 500,
    "returnRate": 200
  },
  {
    "id": "23",
    "name": "Annaba",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 450,
    "returnRate": 200
  },
  {
    "id": "24",
    "name": "Guelma",
    "delay": "1-3",
    "homeRate": 900,
    "deskRate": 500,
    "returnRate": 200
  },
  {
    "id": "25",
    "name": "Constantine",
    "delay": "1-3",
    "homeRate": 800,
    "deskRate": 450,
    "returnRate": 200
  },
  {
    "id": "26",
    "name": "Médéa",
    "delay": "1-3",
    "homeRate": 800,
    "deskRate": 450,
    "returnRate": 200
  },
  {
    "id": "27",
    "name": "Mostaganem",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 450,
    "returnRate": 200
  },
  {
    "id": "28",
    "name": "M’Sila",
    "delay": "1-3",
    "homeRate": 900,
    "deskRate": 500,
    "returnRate": 200
  },
  {
    "id": "29",
    "name": "Mascara",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 500,
    "returnRate": 200
  },
  {
    "id": "30",
    "name": "Ouargla",
    "delay": "2-5",
    "homeRate": 1000,
    "deskRate": 650,
    "returnRate": 200
  },
  {
    "id": "31",
    "name": "Oran",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 450,
    "returnRate": 200
  },
  {
    "id": "32",
    "name": "El Bayadh",
    "delay": "1-3",
    "homeRate": 1050,
    "deskRate": 700,
    "returnRate": 200
  },
  {
    "id": "33",
    "name": "Ilizi",
    "delay": "5-8",
    "homeRate": 2100,
    "deskRate": 1200,
    "returnRate": 300
  },
  {
    "id": "34",
    "name": "Bordj Bou Arreridj",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 500,
    "returnRate": 200
  },
  {
    "id": "35",
    "name": "Boumerdès",
    "delay": "1",
    "homeRate": 700,
    "deskRate": 400,
    "returnRate": 200
  },
  {
    "id": "36",
    "name": "El-Tarf",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 500,
    "returnRate": 200
  },
  {
    "id": "37",
    "name": "Tindouf",
    "delay": "5-8",
    "homeRate": 1700,
    "deskRate": 800,
    "returnRate": 300
  },
  {
    "id": "38",
    "name": "Tissemsilt",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 500,
    "returnRate": 200
  },
  {
    "id": "39",
    "name": "El oued",
    "delay": "1-3",
    "homeRate": 1050,
    "deskRate": 700,
    "returnRate": 200
  },
  {
    "id": "40",
    "name": "Khenchela",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 500,
    "returnRate": 200
  },
  {
    "id": "41",
    "name": "Souk Ahras",
    "delay": "1-3",
    "homeRate": 900,
    "deskRate": 500,
    "returnRate": 200
  },
  {
    "id": "42",
    "name": "Tipaza",
    "delay": "1",
    "homeRate": 700,
    "deskRate": null,
    "returnRate": 200
  },
  {
    "id": "43",
    "name": "Mila",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 500,
    "returnRate": 200
  },
  {
    "id": "44",
    "name": "Ain Defla",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 500,
    "returnRate": 200
  },
  {
    "id": "45",
    "name": "Naâma",
    "delay": "2-6",
    "homeRate": 1200,
    "deskRate": 700,
    "returnRate": 300
  },
  {
    "id": "46",
    "name": "Ain Temouchent",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 500,
    "returnRate": 200
  },
  {
    "id": "47",
    "name": "Ghardaia",
    "delay": "2-5",
    "homeRate": 950,
    "deskRate": 550,
    "returnRate": 300
  },
  {
    "id": "48",
    "name": "Rélizane",
    "delay": "1-3",
    "homeRate": 850,
    "deskRate": 500,
    "returnRate": 200
  },
  {
    "id": "49",
    "name": "Timimoun",
    "delay": "2-6",
    "homeRate": 1600,
    "deskRate": 850,
    "returnRate": 300
  },
  {
    "id": "50",
    "name": "Bordj Badji Mokhtar",
    "delay": "5-8",
    "homeRate": 1800,
    "deskRate": null,
    "returnRate": 300
  },
  {
    "id": "51",
    "name": "Ouled Djellal",
    "delay": "1-3",
    "homeRate": 950,
    "deskRate": 550,
    "returnRate": 300
  },
  {
    "id": "52",
    "name": "Beni Abbes",
    "delay": "2-6",
    "homeRate": 1300,
    "deskRate": null,
    "returnRate": 300
  },
  {
    "id": "53",
    "name": "In salah",
    "delay": "5-8",
    "homeRate": 1900,
    "deskRate": 1400,
    "returnRate": 300
  },
  {
    "id": "54",
    "name": "In Guezzam",
    "delay": "5-8",
    "homeRate": 1900,
    "deskRate": null,
    "returnRate": 300
  },
  {
    "id": "55",
    "name": "Touggourt",
    "delay": "2-5",
    "homeRate": 1000,
    "deskRate": null,
    "returnRate": 300
  },
  {
    "id": "56",
    "name": "Djanet",
    "delay": "5-8",
    "homeRate": 1900,
    "deskRate": null,
    "returnRate": 300
  },
  {
    "id": "57",
    "name": "El M'Ghair",
    "delay": "2-5",
    "homeRate": 1200,
    "deskRate": null,
    "returnRate": 300
  },
  {
    "id": "58",
    "name": "El Menia",
    "delay": "2-5",
    "homeRate": 1100,
    "deskRate": 700,
    "returnRate": 300
  }
];

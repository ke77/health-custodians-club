/*
  Ghana's 16 regions with each regional capital's coordinates (approximate), used to pin the region on the map.
  `present` marks a region where the club is active. interim source until regional data lives in the database
  (regional_reps, docs/05-data-model.md); the dashboard will toggle it later.
*/
export type Region = {
  name: string
  capital: string
  lat: number
  lon: number
  present: boolean
}

export const regions: Region[] = [
  { name: 'Ahafo', capital: 'Goaso', lat: 6.8, lon: -2.52, present: true },
  { name: 'Ashanti', capital: 'Kumasi', lat: 6.69, lon: -1.62, present: true },
  { name: 'Bono', capital: 'Sunyani', lat: 7.34, lon: -2.33, present: true },
  { name: 'Bono East', capital: 'Techiman', lat: 7.59, lon: -1.94, present: true },
  { name: 'Central', capital: 'Cape Coast', lat: 5.11, lon: -1.25, present: true },
  { name: 'Eastern', capital: 'Koforidua', lat: 6.09, lon: -0.26, present: true },
  { name: 'Greater Accra', capital: 'Accra', lat: 5.6, lon: -0.19, present: true },
  { name: 'North East', capital: 'Nalerigu', lat: 10.53, lon: -0.37, present: true },
  { name: 'Northern', capital: 'Tamale', lat: 9.4, lon: -0.84, present: true },
  { name: 'Oti', capital: 'Dambai', lat: 8.07, lon: 0.18, present: true },
  { name: 'Savannah', capital: 'Damongo', lat: 9.08, lon: -1.82, present: true },
  { name: 'Upper East', capital: 'Bolgatanga', lat: 10.79, lon: -0.85, present: true },
  { name: 'Upper West', capital: 'Wa', lat: 10.06, lon: -2.5, present: true },
  { name: 'Volta', capital: 'Ho', lat: 6.6, lon: 0.47, present: true },
  { name: 'Western', capital: 'Sekondi-Takoradi', lat: 4.93, lon: -1.76, present: true },
  { name: 'Western North', capital: 'Sefwi Wiawso', lat: 6.21, lon: -2.49, present: true },
]

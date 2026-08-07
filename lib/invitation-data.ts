export const invitation = {
  groom: 'Khalid',
  bride: 'Ayesha',
  occasion: 'Walima Ceremony',
  hosts: 'The Family of Mr. & Mrs. Abdul Rahman',
  date: {
    weekday: 'Friday',
    day: '27',
    month: 'November',
    year: '2026',
    full: 'Friday, 27 November 2026',
  },
  time: {
    label: '7:00 PM',
    note: 'After Maghrib · Dinner Onwards',
  },
  /* used by the live countdown — IST offset */
  startsAt: '2026-11-27T19:00:00+05:30',
  venue: {
    name: 'Kurukshetra Wedding Palace',
    address: 'Pehowa Road, Kurukshetra, Haryana 136118',
    lat: 29.9695,
    lon: 76.8783,
  },
  contact: {
    display: '+91 97162 48666',
    tel: '+919716248666',
    whatsapp: '919716248666',
  },
} as const

export const mapEmbedUrl = (() => {
  const { lat, lon } = invitation.venue
  const d = 0.02
  const bbox = [lon - d, lat - d / 2, lon + d, lat + d / 2].join('%2C')
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`
})()

export const mapDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${invitation.venue.name}, ${invitation.venue.address}`,
)}`

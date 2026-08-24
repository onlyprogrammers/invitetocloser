'use client'

import { createContext, useContext } from 'react'
import { invitation as defaultInvitation, mapDirectionsUrl as defaultDirections, mapEmbedUrl as defaultEmbed } from './invitation-data'

export type DynamicInvitation = any

const InvitationContext = createContext<DynamicInvitation>(defaultInvitation)

export function InvitationProvider({ value, children }: { value: DynamicInvitation; children: React.ReactNode }) {
  return <InvitationContext.Provider value={value}>{children}</InvitationContext.Provider>
}

export function useInvitation() {
  return useContext(InvitationContext)
}

export function invitationMapUrls(value: DynamicInvitation) {
  const { lat, lon } = value.venue
  const d = 0.02
  const bbox = [lon - d, lat - d / 2, lon + d, lat + d / 2].join('%2C')
  return {
    embed: `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`,
    directions: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${value.venue.name}, ${value.venue.address}`)}`,
  }
}

export { defaultDirections, defaultEmbed }

'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import L from 'leaflet'

// Import marker images so bundlers (Next/Vite/webpack) resolve them correctly
// If your TypeScript setup requires it, ensure global.d.ts (provided above) allows PNG imports
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

type Props = {
  onPolygonCreated?: (geometry: any) => void
}

export default function Map({ onPolygonCreated }: Props) {
  useEffect(() => {
    // Ensure Leaflet default icon paths are correct for production builds
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x as unknown as string,
      iconUrl: markerIcon as unknown as string,
      shadowUrl: markerShadow as unknown as string,
    })
  }, [])

  return (
    <MapContainer
      center={[-19.0154, 29.1549]} // Zimbabwe center
      zoom={6}
      className="h-full w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FeatureGroup>
        <EditControl
          position="topright"
          draw={{ rectangle: false, circle: false, marker: false }}
          onCreated={(e: any) => {
            try {
              const layer = e.layer
              const geo = layer.toGeoJSON()
              onPolygonCreated?.(geo.geometry)
            } catch (err) {
              // ignore
            }
          }}
        />
      </FeatureGroup>
    </MapContainer>
  )
}
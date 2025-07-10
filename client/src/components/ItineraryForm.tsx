// src/components/ItineraryForm.tsx
import React, { useState, useRef } from 'react';
import { Autocomplete, GoogleMap, Marker } from '@react-google-maps/api';

export type FormData = {
    destination: string;
    days: number;
    preferences: string[];
};

interface Props {
    onSubmit: (data: FormData) => void;
}

// Map container dimensions and default center
const mapContainerStyle = { width: '100%', height: '300px' };
const defaultCenter: google.maps.LatLngLiteral = { lat: 39.5, lng: -98.35 };

// Map options for clickable POIs
const mapOptions: google.maps.MapOptions = { clickableIcons: true };

// Broad autocomplete options
const autoOptions: google.maps.places.AutocompleteOptions = {
    fields: ['formatted_address', 'geometry', 'name'],
};

const ItineraryForm: React.FC<Props> = ({ onSubmit }) => {
    const [destination, setDestination] = useState('');
    const [days, setDays] = useState(3);
    const [prefs, setPrefs] = useState('');

    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const geocoder = useRef(new google.maps.Geocoder());
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [marker, setMarker] = useState<google.maps.LatLngLiteral | null>(null);

    // Map load handler
    const handleMapLoad = (m: google.maps.Map) => {
        setMap(m);
    };

    // Autocomplete selection handler
    const handlePlaceChanged = () => {
        const place = autocompleteRef.current?.getPlace();
        const label = place?.name || place?.formatted_address || '';
        setDestination(label);
        if (place?.geometry?.location) {
            const pos = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };
            setMarker(pos);
            map?.panTo(pos);
            map?.setZoom(12);
        }
    };

    // Map click handler
    const handleMapClick = (e: any) => {
        if (!e.latLng) return;
        // POI click
        if (e.placeId) {
            e.stop();
            new google.maps.places.PlacesService(map!).getDetails(
                { placeId: e.placeId, fields: ['name', 'formatted_address', 'geometry'] },
                (place, status) => {
                    if (status === 'OK' && place?.geometry?.location) {
                        const pos = {
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                        };
                        setMarker(pos);
                        setDestination(place.name || place.formatted_address || '');
                        map?.panTo(pos);
                        map?.setZoom(12);
                    }
                }
            );
            return;
        }
        // Generic click
        const loc = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setMarker(loc);
        geocoder.current.geocode({ location: loc }, (results, status) => {
            if (status === 'OK' && results && results.length > 0) {
                setDestination(results[0].formatted_address);
                map?.panTo(loc);
                map?.setZoom(results[0].types.includes('locality') ? 12 : 8);
            } else {
                setDestination(`${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`);
                map?.panTo(loc);
                map?.setZoom(4);
            }
        });
    };

    // Form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            destination,
            days,
            preferences: prefs.split(',').map(s => s.trim()).filter(s => s),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-6 max-w-md mx-auto">
            <div className="text-sm text-gray-600 mb-2">
                📍 <strong>Type</strong> to search any country, state, city, park, or landmark.<br />
                🗺️ <strong>Click</strong> on a pin or address on the map to select it.
            </div>

            <label className="flex flex-col">
                <span className="font-medium">Destination</span>
                <Autocomplete
                    onLoad={ref => (autocompleteRef.current = ref)}
                    onPlaceChanged={handlePlaceChanged}
                    options={autoOptions}
                >
                    <input
                        type="text"
                        value={destination}
                        onChange={e => setDestination(e.target.value)}
                        placeholder="Type or click on map"
                        required
                        className="border rounded p-2"
                    />
                </Autocomplete>
            </label>

            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={marker || defaultCenter}
                zoom={marker ? 12 : 4}
                onLoad={handleMapLoad}
                onClick={handleMapClick}
                options={mapOptions}
            >
                {marker && <Marker position={marker} />}
            </GoogleMap>

            <label className="flex flex-col">
                <span className="font-medium">Days</span>
                <input
                    type="number"
                    min={1}
                    value={days}
                    onChange={e => setDays(Number(e.target.value))}
                    className="border rounded p-2"
                />
            </label>

            <label className="flex flex-col">
                <span className="font-medium">Preferences</span>
                <input
                    type="text"
                    value={prefs}
                    onChange={e => setPrefs(e.target.value)}
                    placeholder="e.g. museums, hiking"
                    className="border rounded p-2"
                />
            </label>

            <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
                Generate Itinerary
            </button>
        </form>
    );
};

export default ItineraryForm;

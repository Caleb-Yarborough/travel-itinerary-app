// ItineraryForm.tsx
// -----------------------------------------------------------------------------
// This component renders the input form for the AI Travel Itinerary Planner.
// It lets users:
// - Search for a destination using Google Maps Autocomplete or by clicking the map
// - Specify the number of days for the trip
// - Enter activity preferences (e.g., hiking, museums)
// The form manages input via React state and passes it to the parent (App.tsx)
// via the `onSubmit` prop when the form is submitted.
// -----------------------------------------------------------------------------

import React, { useState, useRef } from 'react';
import { Autocomplete, GoogleMap, Marker } from '@react-google-maps/api'; // Google Maps API for UI components
import './Forms.css'; // Custom styling for form layout and inputs

// Type for the form data to be passed upward on submit
export type FormData = {
    destination: string;
    days: number;
    preferences: string[];
};

// Props definition — parent passes an `onSubmit` callback
interface Props {
    onSubmit: (data: FormData) => void;
}

// Google Map configuration
const mapContainerStyle = { width: '100%', height: '300px' }; // Size of embedded map
const defaultCenter: google.maps.LatLngLiteral = { lat: 39.5, lng: -98.35 }; // Default map center (US center)
const mapOptions: google.maps.MapOptions = { clickableIcons: true }; // Enable clickable map icons

// Autocomplete settings — limits which fields to retrieve from Google Places
const autoOptions: google.maps.places.AutocompleteOptions = {
    fields: ['formatted_address', 'geometry', 'name'],
};

// Main React component
const ItineraryForm: React.FC<Props> = ({ onSubmit }) => {
    // State for destination input (controlled input)
    const [destination, setDestination] = useState('');
    // State for trip length in days
    const [days, setDays] = useState(3);
    // State for comma-separated user preferences
    const [prefs, setPrefs] = useState('');

    // Ref to hold Google Maps Autocomplete instance
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    // Ref to Google Maps Geocoder instance (for reverse geocoding map clicks)
    const geocoder = useRef(new google.maps.Geocoder());

    // State to hold the map instance
    const [map, setMap] = useState<google.maps.Map | null>(null);
    // State to hold the current selected marker location
    const [marker, setMarker] = useState<google.maps.LatLngLiteral | null>(null);

    // Stores the Google Map instance once loaded
    const handleMapLoad = (m: google.maps.Map) => {
        setMap(m);
    };

    // Called when user selects a place from the Autocomplete input
    const handlePlaceChanged = () => {
        const place = autocompleteRef.current?.getPlace();
        const label = place?.name || place?.formatted_address || '';
        setDestination(label); // Set destination label in input field

        // If the place has a geometry location, move the map and marker to it
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

    // Called when user clicks on the map
    const handleMapClick = (e: any) => {
        if (!e.latLng) return;

        // If the user clicked a known place (like a pin), fetch its details
        if (e.placeId) {
            e.stop(); // Stop default behavior
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

        // If the user clicked a generic location on the map (not a place), reverse geocode it
        const loc = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setMarker(loc);
        geocoder.current.geocode({ location: loc }, (results, status) => {
            if (status === 'OK' && results && results.length > 0) {
                setDestination(results[0].formatted_address);
                map?.panTo(loc);
                map?.setZoom(results[0].types.includes('locality') ? 12 : 8);
            } else {
                // Fallback if no readable address is found — just use lat/lng
                setDestination(`${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`);
                map?.panTo(loc);
                map?.setZoom(4);
            }
        });
    };

    // Handles form submission — converts preference string into array and calls parent callback
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default page reload
        onSubmit({
            destination,
            days,
            preferences: prefs.split(',').map(s => s.trim()).filter(s => s),
        });
    };

    // JSX for the form UI
    return (
        <div>
            <form onSubmit={handleSubmit} className="itinerary-form">
                <div className="itinerary-label">
                    📍 <strong>Type</strong> to search any country, state, city, park, or landmark.<br />
                    🗺️ <strong>Click</strong> on a pin or address on the map to select it.
                </div>

                {/* Destination input with Google Autocomplete */}
                <label htmlFor="destination" className="itinerary-label">
                    <span className="label-title">Destination</span>
                    <Autocomplete
                        onLoad={ref => (autocompleteRef.current = ref)} // Store autocomplete instance
                        onPlaceChanged={handlePlaceChanged} // Triggered on place select
                        options={autoOptions}
                    >
                        <input
                            id="destination"
                            name="destination"
                            type="text"
                            value={destination}
                            onChange={e => setDestination(e.target.value)} // Manual override
                            placeholder="Type or click on map"
                            required
                            className="itinerary-input"
                        />
                    </Autocomplete>
                </label>

                {/* Interactive Google Map with click-to-select */}
                <div className="itinerary-label">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={marker || defaultCenter}
                        zoom={marker ? 12 : 4}
                        onLoad={handleMapLoad}
                        onClick={handleMapClick}
                        options={mapOptions}
                    >
                        {marker && <Marker position={marker} />} {/* Show marker if one is set */}
                    </GoogleMap>
                </div>

                {/* Number of days input */}
                <label htmlFor="days" className="itinerary-label">
                    <span className="label-title">Days</span>
                    <input
                        id="days"
                        name="days"
                        type="number"
                        min={1}
                        value={days}
                        onChange={e => setDays(Number(e.target.value))} // Parse input as number
                        className="itinerary-input"
                    />
                </label>

                {/* Preferences input as comma-separated string */}
                <label htmlFor="preferences" className="itinerary-label">
                    <span className="label-title">Preferences</span>
                    <input
                        id="preferences"
                        name="preferences"
                        type="text"
                        value={prefs}
                        onChange={e => setPrefs(e.target.value)} // Update preferences string
                        placeholder="e.g. museums, hiking"
                        className="itinerary-input"
                    />
                </label>

                {/* Submit button */}
                <button type="submit" className="itinerary-button">
                    Generate Itinerary
                </button>
            </form>
        </div>
    );
};

export default ItineraryForm;

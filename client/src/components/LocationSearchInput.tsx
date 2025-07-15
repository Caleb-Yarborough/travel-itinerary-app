// LocationSearchInput.tsx
// -----------------------------------------------------------------------------
// This component renders a single text input with Google Places Autocomplete.
// It allows users to search for and select a US-based location, and passes
// the selected formatted address to a parent component via the `onSelect` prop.
//
// Technologies used:
// - React hooks: `useRef` for accessing the input DOM node, `useEffect` for setup
// - Google Maps JavaScript API: specifically the `places.Autocomplete` service
// - Controlled via a callback prop, not internal state
//
// This is a minimal and reusable alternative to <Autocomplete> from @react-google-maps/api.
// -----------------------------------------------------------------------------

import React, { useRef, useEffect } from 'react';

// Props passed in from the parent component
type Props = {
    onSelect: (address: string) => void; // Callback when a valid address is selected
};

// React Functional Component
const LocationSearchInput: React.FC<Props> = ({ onSelect }) => {
    // Ref to directly access the <input> DOM element
    const inputRef = useRef<HTMLInputElement>(null);

    // Hook that runs once after component mounts (or if onSelect changes)
    useEffect(() => {
        // Exit early if Google Maps script hasn't loaded or ref is missing
        if (!(window as any).google || !inputRef.current) return;

        // Initialize Autocomplete instance on the input element
        const autocomplete = new (window as any).google.maps.places.Autocomplete(
            inputRef.current,
            {
                types: ['geocode'], // Use 'geocode' for all address-level locations
                componentRestrictions: { country: 'us' }, // Restrict to US addresses (optional)
            }
        );

        // Limit returned fields for performance — only fetch formatted address
        autocomplete.setFields(['formatted_address']);

        // Event listener that triggers when user selects a place
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace(); // Get selected place details
            if (place.formatted_address) {
                onSelect(place.formatted_address); // Pass address back to parent
            }
        });
    }, [onSelect]); // Dependency: re-run if `onSelect` function changes

    // JSX input element styled with Tailwind-style utility classes
    return (
        <input
            ref={inputRef} // Connects this input to the autocomplete ref
            type="text"
            placeholder="Enter destination"
            className="border p-2 rounded w-full"
        />
    );
};

export default LocationSearchInput;

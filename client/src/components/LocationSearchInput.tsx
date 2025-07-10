// client/src/components/LocationSearchInput.tsx
import React, { useRef, useEffect } from 'react';

type Props = {
    onSelect: (address: string) => void;
};

const LocationSearchInput: React.FC<Props> = ({ onSelect }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!(window as any).google || !inputRef.current) return;

        const autocomplete = new (window as any).google.maps.places.Autocomplete(
            inputRef.current,
            {
                types: ['geocode'],             // or ['(cities)'] if you only want cities
                componentRestrictions: { country: 'us' },  // optional
            }
        );

        // Only pull the formatted address back
        autocomplete.setFields(['formatted_address']);

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.formatted_address) {
                onSelect(place.formatted_address);
            }
        });
    }, [onSelect]);

    return (
        <input
            ref={inputRef}
            type="text"
            placeholder="Enter destination"
            className="border p-2 rounded w-full"
        />
    );
};

export default LocationSearchInput;

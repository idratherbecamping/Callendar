'use client';

import { useEffect, useRef, useState } from 'react';
import { googleMapsLoader } from '@/utils/googleMapsLoader';

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  required?: boolean;
  countryRestrictions?: string[];
}

export default function GooglePlacesAutocomplete({
  value,
  onChange,
  placeholder = 'Enter address',
  className = '',
  id = 'address',
  required = false,
  countryRestrictions,
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load Google Maps script once
  useEffect(() => {
    console.log('[GooglePlacesAutocomplete] Init component, checking if maps loaded');
    
    // Don't do anything if the script is already loaded
    if (googleMapsLoader.isLoaded()) {
      console.log('[GooglePlacesAutocomplete] Maps already loaded, setting state');
      setIsLoaded(true);
      return;
    }

    console.log('[GooglePlacesAutocomplete] Maps not loaded, initiating load');
    // Load the script
    googleMapsLoader.load()
      .then(() => {
        console.log('[GooglePlacesAutocomplete] Maps loaded successfully, setting state');
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error('[GooglePlacesAutocomplete] Error loading Maps:', error);
        setLoadError('Failed to load address autocomplete');
      });
  }, []);

  // Initialize Autocomplete once script is loaded
  useEffect(() => {
    console.log('[GooglePlacesAutocomplete] isLoaded changed:', isLoaded);
    console.log('[GooglePlacesAutocomplete] inputRef.current:', !!inputRef.current);
    
    if (!isLoaded || !inputRef.current) {
      console.log('[GooglePlacesAutocomplete] Not ready to initialize autocomplete yet');
      return;
    }
    
    try {
      console.log('[GooglePlacesAutocomplete] Starting autocomplete initialization');
      console.log('[GooglePlacesAutocomplete] Google object:', !!window.google);
      console.log('[GooglePlacesAutocomplete] Maps object:', !!window.google?.maps);
      console.log('[GooglePlacesAutocomplete] Places object:', !!window.google?.maps?.places);
      
      // Create a session token for better billing practices
      console.log('[GooglePlacesAutocomplete] Creating session token');
      sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
      
      // Initialize Google Maps Autocomplete with enhanced options
      const autocompleteOptions: google.maps.places.AutocompleteOptions = { 
        types: ['address'],
        fields: ['formatted_address', 'geometry', 'name', 'place_id'],
      };
      
      // Add country restrictions if provided
      if (countryRestrictions && countryRestrictions.length > 0) {
        console.log('[GooglePlacesAutocomplete] Adding country restrictions:', countryRestrictions);
        autocompleteOptions.componentRestrictions = {
          country: countryRestrictions
        };
      }
      
      console.log('[GooglePlacesAutocomplete] Creating Autocomplete with options:', autocompleteOptions);
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        autocompleteOptions
      );
      console.log('[GooglePlacesAutocomplete] Autocomplete created:', !!autocompleteRef.current);

      // Add place_changed event listener
      const handlePlaceChanged = () => {
        console.log('[GooglePlacesAutocomplete] Place changed event fired');
        if (autocompleteRef.current) {
          console.log('[GooglePlacesAutocomplete] Getting selected place');
          const place = autocompleteRef.current.getPlace();
          console.log('[GooglePlacesAutocomplete] Selected place:', place);
          
          if (place) {
            // Extract more detailed information if available
            const placeDetails = {
              formatted_address: place.formatted_address || '',
              place_id: place.place_id || '',
              location: place.geometry?.location ? {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              } : null,
              name: place.name || ''
            };
            
            console.log('[GooglePlacesAutocomplete] Extracted place details:', placeDetails);
            
            // Just pass the formatted address for now, but we could pass more detailed info
            onChange(placeDetails.formatted_address);
            
            // Generate a new session token after selection for the next search
            console.log('[GooglePlacesAutocomplete] Creating new session token');
            sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
          }
        }
      };

      console.log('[GooglePlacesAutocomplete] Adding place_changed listener');
      // We know autocompleteRef.current is not null here
      // @ts-ignore - TypeScript doesn't recognize that we've already checked for null
      autocompleteRef.current.addListener('place_changed', handlePlaceChanged);
      console.log('[GooglePlacesAutocomplete] Autocomplete initialization complete');
    } catch (error) {
      console.error('[GooglePlacesAutocomplete] Error initializing Maps Autocomplete:', error);
      setLoadError('Error initializing address autocomplete');
    }
    
    return () => {
      // Clean up listeners if needed
      console.log('[GooglePlacesAutocomplete] Cleanup function called');
      if (autocompleteRef.current) {
        console.log('[GooglePlacesAutocomplete] Clearing instance listeners');
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onChange, countryRestrictions]);

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        required={required}
        autoComplete="off"
      />
      {loadError && (
        <p className="mt-1 text-sm text-red-600">{loadError}</p>
      )}
    </>
  );
} 
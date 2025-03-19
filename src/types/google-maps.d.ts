declare namespace google {
  namespace maps {
    namespace places {
      class Autocomplete {
        constructor(inputField: HTMLInputElement, options?: AutocompleteOptions);
        addListener(eventName: string, handler: (...args: any[]) => void): void;
        getPlace(): PlaceResult;
      }
      
      class AutocompleteSessionToken {}
      
      interface AutocompleteOptions {
        types?: string[];
        componentRestrictions?: { country: string | string[] };
        fields?: string[];
        bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
        strictBounds?: boolean;
      }
      
      interface PlaceResult {
        address_components?: AddressComponent[];
        formatted_address?: string;
        geometry?: { 
          location: google.maps.LatLng;
          viewport?: google.maps.LatLngBounds;
        };
        place_id?: string;
        name?: string;
        photos?: PlacePhoto[];
        types?: string[];
        url?: string;
        website?: string;
        html_attributions?: string[];
        utc_offset_minutes?: number;
        vicinity?: string;
        rating?: number;
        international_phone_number?: string;
        formatted_phone_number?: string;
      }
      
      interface PlacePhoto {
        getUrl(options: PhotoOptions): string;
        height: number;
        width: number;
        html_attributions: string[];
      }
      
      interface PhotoOptions {
        maxWidth?: number;
        maxHeight?: number;
      }
      
      interface AddressComponent {
        long_name: string;
        short_name: string;
        types: string[];
      }
    }
    
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }
    
    interface LatLngBounds {
      contains(latLng: LatLng): boolean;
      extend(latLng: LatLng): void;
      getCenter(): LatLng;
      getNorthEast(): LatLng;
      getSouthWest(): LatLng;
      isEmpty(): boolean;
      toJSON(): object;
      toString(): string;
      toUrlValue(precision?: number): string;
      union(other: LatLngBounds): LatLngBounds;
    }
    
    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }
    
    namespace event {
      function clearInstanceListeners(instance: object): void;
      function addListener(instance: object, eventName: string, handler: (...args: any[]) => void): MapsEventListener;
      function addDomListener(instance: object, eventName: string, handler: (...args: any[]) => void, capture?: boolean): MapsEventListener;
      function removeListener(listener: MapsEventListener): void;
    }
    
    interface MapsEventListener {
      remove(): void;
    }
  }
} 
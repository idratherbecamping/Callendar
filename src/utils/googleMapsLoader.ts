/**
 * Utility to load the Google Maps script once and provide a way for components to know when it's ready
 */

type ScriptLoadingState = 'not_loaded' | 'loading' | 'loaded' | 'error';

class GoogleMapsLoader {
  private loadingState: ScriptLoadingState = 'not_loaded';
  private callbacks: Array<() => void> = [];
  private errorCallbacks: Array<(error: Error) => void> = [];
  private scriptElement: HTMLScriptElement | null = null;
  
  /**
   * Load the Google Maps script if not already loaded
   */
  public load(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('[GoogleMapsLoader] Starting load process, current state:', this.loadingState);
      
      // If already loaded, resolve immediately
      if (window.google?.maps?.places) {
        console.log('[GoogleMapsLoader] Script already loaded, resolving immediately');
        this.loadingState = 'loaded';
        resolve();
        return;
      }
      
      // Check if there's an existing script tag (added by Next.js Script component)
      const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
      if (existingScript) {
        console.log('[GoogleMapsLoader] Found existing Google Maps script in the DOM');
        
        // If the script is still loading, wait for it to load
        if (!window.google?.maps?.places) {
          console.log('[GoogleMapsLoader] Existing script still loading, adding event listener');
          existingScript.addEventListener('load', () => {
            console.log('[GoogleMapsLoader] Existing script loaded, resolving');
            this.loadingState = 'loaded';
            resolve();
          });
          existingScript.addEventListener('error', (event) => {
            console.error('[GoogleMapsLoader] Existing script failed to load:', event);
            reject(new Error('Existing Google Maps script failed to load'));
          });
        } else {
          console.log('[GoogleMapsLoader] Existing script already loaded, resolving');
          this.loadingState = 'loaded';
          resolve();
        }
        return;
      }
      
      // If already loading, add to callbacks
      if (this.loadingState === 'loading') {
        console.log('[GoogleMapsLoader] Script already loading, adding to callbacks');
        this.callbacks.push(resolve);
        this.errorCallbacks.push(reject);
        return;
      }
      
      // Otherwise start loading
      console.log('[GoogleMapsLoader] Starting script loading process');
      this.loadingState = 'loading';
      this.callbacks.push(resolve);
      this.errorCallbacks.push(reject);
      
      const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      console.log('[GoogleMapsLoader] API Key:', googleMapsApiKey);
      
      if (!googleMapsApiKey) {
        console.error('[GoogleMapsLoader] API key is missing');
        const error = new Error('Google Maps API key is missing');
        this.handleError(error);
        return;
      }
      
      try {
        this.scriptElement = document.createElement('script');
        const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
        console.log('[GoogleMapsLoader] Creating script with URL:', scriptUrl);
        this.scriptElement.src = scriptUrl;        
        this.scriptElement.async = true;
        this.scriptElement.defer = true;
        
        this.scriptElement.onload = () => {
          console.log('[GoogleMapsLoader] Script loaded successfully');
          console.log('[GoogleMapsLoader] Google object:', !!window.google);
          console.log('[GoogleMapsLoader] Maps object:', !!window.google?.maps);
          console.log('[GoogleMapsLoader] Places object:', !!window.google?.maps?.places);
          this.loadingState = 'loaded';
          this.callbacks.forEach(callback => callback());
          this.callbacks = [];
          this.errorCallbacks = [];
        };
        
        this.scriptElement.onerror = (event) => {
          console.error('[GoogleMapsLoader] Error loading script:', event);
          const error = new Error('Failed to load Google Maps script');
          this.handleError(error);
        };
        
        console.log('[GoogleMapsLoader] Appending script to document head');
        document.head.appendChild(this.scriptElement);
      } catch (error) {
        console.error('[GoogleMapsLoader] Exception during script loading:', error);
        this.handleError(error instanceof Error ? error : new Error('Unknown error loading Google Maps script'));
      }
    });
  }
  
  private handleError(error: Error): void {
    console.error('[GoogleMapsLoader] Handling error:', error);
    this.loadingState = 'error';
    this.errorCallbacks.forEach(callback => callback(error));
    this.callbacks = [];
    this.errorCallbacks = [];
    
    if (this.scriptElement && this.scriptElement.parentNode) {
      console.log('[GoogleMapsLoader] Removing script element from DOM');
      this.scriptElement.parentNode.removeChild(this.scriptElement);
    }
  }
  
  /**
   * Check if the Google Maps script is loaded
   */
  public isLoaded(): boolean {
    // Check for existing script
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    const scriptExists = !!existingScript;
    
    const loaded = this.loadingState === 'loaded' || !!window.google?.maps?.places;
    console.log('[GoogleMapsLoader] isLoaded check:', loaded, 'Script exists:', scriptExists);
    return loaded;
  }
}

// Export a singleton instance
export const googleMapsLoader = new GoogleMapsLoader(); 
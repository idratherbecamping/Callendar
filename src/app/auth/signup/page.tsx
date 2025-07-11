'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import AddressValidator from '@/components/AddressValidator'

type Step = 'account' | 'service_type' | 'business' | 'location' | 'hours' | 'calendar' | 'payment'

type FormData = {
  email: string;
  password: string;
  businessName: string;
  phoneNumber: string;
  phone_carrier: string;
  businessAddress: string;
  maxServiceDistance: number;
  typicalServiceTime: number;
  localTimeZone: string;
  businessHoursLocal: {
    open: string;
    close: string;
  };
  calendarConnected: boolean;
  googleAuthToken: GoogleAuthToken | null;
  acuityAuthToken: AcuityAuthToken | null;
  squareAuthToken: SquareAuthToken | null;
  service_type: string;
  paymentComplete: boolean;
  customerId: string;
  subscriptionId: string;
  with_work_description: boolean;
  acuityConnected: boolean;
  squareConnected: boolean;
  textMessageConsent: boolean;
};

type GoogleAuthToken = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  id_token: string;
};

type AcuityAuthToken = {
  access_token: string;
  token_type: string;
  expires_in?: number;
  created_at: string;
};

type SquareAuthToken = {
  access_token: string;
  token_type: string;
  expires_at: string;
  merchant_id: string;
  created_at: string;
};

// Validation functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
  // Minimum 6 characters, at least one lowercase, one uppercase, and one digit
  const minLength = password.length >= 6;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  
  return minLength && hasLowercase && hasUppercase && hasDigit;
};

function SignUpContent() {
  const [step, setStep] = useState<Step>('account')
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    businessName: '',
    phoneNumber: '',
    phone_carrier: 'Other',
    businessAddress: '',
    maxServiceDistance: 25,
    typicalServiceTime: 90,
    localTimeZone: 'US/Pacific', // Default to Pacific time
    businessHoursLocal: {
      open: '09:00',
      close: '17:00',
    },
    calendarConnected: false,
    googleAuthToken: null,
    acuityAuthToken: null,
    squareAuthToken: null,
    service_type: 'House Call',
    paymentComplete: false,
    customerId: '',
    subscriptionId: '',
    with_work_description: false,
    acuityConnected: false,
    squareConnected: false,
    textMessageConsent: false,
  })
  const [addressIsValid, setAddressIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check for saved form data and restore it (for when returning from OAuth flow)
  useEffect(() => {
    console.log("Checking for stored form data and URL step parameter");
    
    const storedData = localStorage.getItem('signupFormData')
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        console.log("Restored form data from localStorage:", parsedData);
        setFormData(parsedData)
        
        // If returning from calendar connection, set address as valid
        if (parsedData.businessAddress || parsedData.service_type === 'Scheduler') {
          setAddressIsValid(true)
        }
      } catch (e) {
        console.error('Failed to parse stored form data:', e)
      }
    } else {
      console.log("No stored form data found");
    }

    // Check if URL has step parameter
    if (searchParams) {
      const stepParam = searchParams.get('step')
      console.log("Step parameter from URL:", stepParam);
      
      if (stepParam && ['account', 'service_type', 'business', 'location', 'hours', 'calendar', 'payment'].includes(stepParam as Step)) {
        console.log("Setting step from URL parameter:", stepParam);
        setStep(stepParam as Step)
      }
    } else if (window.location.hash === '#payment') {
      // Also check for hash-based navigation
      console.log("Setting payment step from URL hash");
      setStep('payment');
    }
  }, [searchParams])
  
  // Clean up localStorage when component unmounts
  useEffect(() => {
    return () => {
      // Only clear if on the last step or navigating away
      if (step === 'calendar') {
        localStorage.removeItem('signupFormData')
      }
    }
  }, [step])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleAddressChange = (address: string, isValid: boolean, formattedAddress?: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      businessAddress: formattedAddress || address 
    }));
    setAddressIsValid(isValid);
  }

  const handleHoursChange = (type: 'open' | 'close', value: string) => {
    setFormData((prev) => ({
      ...prev,
      businessHoursLocal: {
        ...prev.businessHoursLocal,
        [type]: value,
      },
    }))
  }

  const handleNext = () => {
    // Validate email and password for account step
    if (step === 'account') {
      if (!isValidEmail(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
      
      if (!isValidPassword(formData.password)) {
        setError('Password must be at least 6 characters and include lowercase, uppercase, and numbers');
        return;
      }
    }
    
    // Validate service type selection
    if (step === 'service_type') {
      if (!formData.service_type) {
        setError('Please select a service type');
        return;
      }
    }
    
    // For the business step, validate required fields
    if (step === 'business') {
      if (!formData.businessName.trim()) {
        setError('Business name is required');
        return;
      }
      
      if (!formData.phoneNumber.trim()) {
        setError('Phone number is required');
        return;
      }
      
      if (!formData.phone_carrier) {
        setError('Please select your phone carrier');
        return;
      }
      
      // Business address is required for both service types
      if (!addressIsValid) {
        setError('Please enter a valid business address');
        return;
      }
    }
    
    switch (step) {
      case 'account':
        setStep('service_type')
        break
      case 'service_type':
        setStep('business')
        break
      case 'business':
        // Skip location step for Scheduler service type
        if (formData.service_type === 'Scheduler') {
          setStep('hours')
        } else {
          setStep('location')
        }
        break
      case 'location':
        setStep('hours')
        break
      case 'hours':
        setStep('calendar')
        break
      case 'calendar':
        setStep('payment')
        break
      default:
        break
    }
    
    // Clear any previous errors when moving to next step
    setError(null);
  }

  const handleBack = () => {
    switch (step) {
      case 'service_type':
        setStep('account')
        break
      case 'business':
        setStep('service_type')
        break
      case 'location':
        setStep('business')
        break
      case 'hours':
        // Go back to location or business based on service type
        if (formData.service_type === 'Scheduler') {
          setStep('business')
        } else {
          setStep('location')
        }
        break
      case 'calendar':
        setStep('hours')
        break
      case 'payment':
        setStep('calendar')
        break
      default:
        break
    }
    
    // Clear any previous errors when moving back
    setError(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log('formData', formData)
      // If service type is Scheduler, make sure the address validation passes
      if (formData.service_type === 'Scheduler') {
        setAddressIsValid(true);
      }
      
      // Verify payment is complete
      if (!formData.paymentComplete) {
        setError('Payment is required to create your account');
        setLoading(false);
        return;
      }
      
      // Temporarily store email and password for session recovery
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('userEmail', formData.email);
        window.localStorage.setItem('tempUserPassword', formData.password);
      }
      
      // Use the server API endpoint to create the user and profile
      const response = await fetch('/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authData: {
            email: formData.email,
            password: formData.password,
          },
          userData: formData,
          paymentData: {
            customerId: formData.customerId,
            subscriptionId: formData.subscriptionId
          }
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      console.log('Account created successfully, signing in user', data);
      
      // Sign in the user using the server API endpoint
      const signInResponse = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const signInData = await signInResponse.json();
      
      if (!signInResponse.ok) {
        console.error('Failed to sign in after account creation', signInData);
        // Continue anyway, we might still be able to proceed
      } else {
        console.log('User signed in successfully after account creation');
      }
      
      // Force Supabase to refresh the local session information
      try {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error('Error refreshing session after sign in:', refreshError);
        } else {
          console.log('Session refreshed after sign in:', refreshData.session ? 'success' : 'no session');
        }
      } catch (refreshErr) {
        console.error('Error during session refresh:', refreshErr);
      }
      
      // Store auth token in localStorage with the correct key
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (supabaseUrl && signInData.tokenData) {
          const cookieKeyName = `sb-${supabaseUrl.replace(/^https?:\/\//, '')}-auth-token`;
          
          // Store token in exact format Supabase expects
          localStorage.setItem(cookieKeyName, JSON.stringify(signInData.tokenData));
          console.log('Manually set auth token in localStorage with key:', cookieKeyName);
          
          // Also store session data
          if (signInData.session) {
            localStorage.setItem(`sb-${supabaseUrl.replace(/^https?:\/\//, '')}-session`, 
              JSON.stringify(signInData.session));
          }
        }
      } catch (storageErr) {
        console.error('Error setting localStorage token:', storageErr);
      }
      
      // Send SMS notification
      const smsResponse = await fetch(`/api/proxy?endpoint=/account-create/send-sms-twilio-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to_number: formData.phoneNumber,
          phone_carrier: formData.phone_carrier
        }),
      });

      if (!smsResponse.ok) {
        console.error('Failed to send SMS notification');
        // Don't throw here - we still want to proceed with account creation
      } else {
        console.log("SMS sent successfully");
      }
      
      // Clean up localStorage
      localStorage.removeItem('signupFormData');
      
      // Remove credentials after a delay to give time for session to be established
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('userEmail');
          window.localStorage.removeItem('tempUserPassword');
        }
      }, 30000); // Keep for 30 seconds to help with recovery if needed
      
      // Use a hard redirect instead of router.push to ensure full page reload with cookies
      window.location.href = '/dashboard';
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Function to handle Google Calendar authorization
  const handleConnectCalendar = () => {
    // Store the form data in localStorage before redirecting
    localStorage.setItem('signupFormData', JSON.stringify(formData));
    
    // Get the client ID from environment variables
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 
      `${window.location.origin}/auth/callback`;
    
    if (!clientId) {
      setError('Google OAuth client ID is not configured. Please contact support.');
      return;
    }
    
    console.log('Initiating OAuth flow with:', {
      clientId: clientId.substring(0, 5) + '...',
      redirectUri
    });
    
    // Generate a random state parameter for security
    const state = Math.random().toString(36).substring(2, 15);
    
    // Store state in localStorage for verification
    localStorage.setItem('google_oauth_state', state);
    console.log('Stored Google OAuth state:', state);
    
    // Redirect to Google OAuth URL
    const googleAuthUrl = 
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      'scope=https://www.googleapis.com/auth/calendar&' +
      'access_type=offline&' +
      'prompt=consent&' +
      'include_granted_scopes=true&' +
      'response_type=code&' +
      `state=${state}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `client_id=${clientId}`;
    
    window.location.href = googleAuthUrl;
  };

  const handleConnectAcuity = () => {
    // Store the form data in localStorage before redirecting
    localStorage.setItem('signupFormData', JSON.stringify(formData));
    
    // Get the client ID from environment variables
    const clientId = process.env.NEXT_PUBLIC_ACUITY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_ACUITY_REDIRECT_URI;
    
    if (!clientId || !redirectUri) {
      setError('Acuity OAuth configuration is missing. Please contact support.');
      return;
    }
    
    console.log('Initiating Acuity OAuth flow with:', {
      clientId: clientId.substring(0, 5) + '...',
      redirectUri
    });
    
    // Generate a random state parameter for security
    const state = Math.random().toString(36).substring(2, 15);
    
    // Store state in localStorage for verification
    localStorage.setItem('acuity_oauth_state', state);
    console.log('Stored Acuity OAuth state:', state);
    
    // Construct the authorization URL according to Acuity documentation
    const authUrl = new URL('https://acuityscheduling.com/oauth2/authorize');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', 'api-v1');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('state', state);
    
    // Redirect to Acuity's authorization page
    window.location.href = authUrl.toString();
  };

  const handleConnectSquare = () => {
    // Store the form data in localStorage before redirecting
    localStorage.setItem('signupFormData', JSON.stringify(formData));
    
    // Get the client ID from environment variables
    const clientId = process.env.NEXT_PUBLIC_SQUARE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SQUARE_REDIRECT_URI;
    
    // Add debug logging
    console.log('Square OAuth Configuration:', {
      clientId: clientId ? `${clientId.substring(0, 5)}...` : 'missing',
      redirectUri: redirectUri || 'missing',
      envKeys: Object.keys(process.env).filter(key => key.includes('SQUARE'))
    });
    
    if (!clientId || !redirectUri) {
      setError('Square OAuth configuration is missing. Please contact support.');
      return;
    }
    
    console.log('Initiating Square OAuth flow with:', {
      clientId: clientId.substring(0, 5) + '...',
      redirectUri
    });
    
    // Generate a random state parameter for security
    const state = Math.random().toString(36).substring(2, 15);
    
    // Store state in localStorage for verification
    localStorage.setItem('square_oauth_state', state);
    console.log('Stored Square OAuth state:', state);
    
    // Construct the authorization URL according to Square documentation
    const authUrl = new URL('https://connect.squareup.com/oauth2/authorize');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('scope', 'MERCHANT_PROFILE_READ APPOINTMENTS_ALL_WRITE APPOINTMENTS_WRITE APPOINTMENTS_READ APPOINTMENTS_ALL_READ APPOINTMENTS_BUSINESS_SETTINGS_READ CUSTOMERS_READ ITEMS_READ CUSTOMERS_WRITE');
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', redirectUri);
    
    // Redirect to Square's authorization page
    window.location.href = authUrl.toString();
  };

  // Add calendar connected state setter
  const setCalendarConnected = (connected: boolean) => {
    setFormData(prev => ({
      ...prev,
      calendarConnected: connected
    }));
  };

  // Add Acuity connected state setter
  const setAcuityConnected = (connected: boolean) => {
    setFormData(prev => ({
      ...prev,
      acuityConnected: connected
    }));
  };

  // Add Square connected state setter
  const setSquareConnected = (connected: boolean) => {
    setFormData(prev => ({
      ...prev,
      squareConnected: connected
    }));
  };

  // Handle Stripe checkout session
  const handleStripeCheckout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Store the form data in localStorage before redirecting to Stripe
      localStorage.setItem('signupFormData', JSON.stringify(formData));
      
      // Using hash-based redirect to avoid URL parameter issues
      const returnUrl = `${window.location.origin}/auth/signup#payment`;
      
      console.log("Creating checkout session with returnUrl:", returnUrl);
      
      // Create a checkout session on the server
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          businessName: formData.businessName,
          service_type: formData.service_type,
          returnUrl: returnUrl
        }),
      });
      
      const data = await response.json();
      console.log("Checkout session created:", data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }
      
      // Redirect to Stripe Checkout
      console.log("Redirecting to Stripe checkout URL:", data.checkoutUrl);
      window.location.href = data.checkoutUrl;
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred with payment';
      console.error("Stripe checkout error:", errorMessage);
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Listen for hash changes to handle payment step
  useEffect(() => {
    const handleHashChange = () => {
      console.log("Hash changed:", window.location.hash);
      
      // Handle hash with query parameters like #payment?session_id=cs_xyz
      if (window.location.hash.startsWith('#payment')) {
        console.log("Setting step to payment from hash");
        setStep('payment');
        
        let sessionId = null;
        
        // Check if the hash contains query parameters
        if (window.location.hash.includes('?')) {
          // Extract query parameters from the hash
          const hashParams = new URLSearchParams(
            window.location.hash.substring(window.location.hash.indexOf('?') + 1)
          );
          sessionId = hashParams.get('session_id');
          console.log("Session ID from hash params:", sessionId);
          
          if (sessionId) {
            // Proceed with payment verification using the session ID
            verifyPaymentAndCreateAccount(sessionId);
            
            // Update URL to cleaner format
            window.history.replaceState(
              null, 
              '', 
              `${window.location.pathname}?step=payment`
            );
          }
        }
      }
    };
    
    // Define verification function here to have access to state
    const verifyPaymentAndCreateAccount = async (sessionId: string) => {
      console.log("Verifying payment with session ID:", sessionId);
      setLoading(true);
      
      try {
        const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
        const data = await response.json();
        console.log("Verification response:", data);
        
        if (response.ok && data.success) {
          console.log("Payment verified successfully");
          
          // Get the stored form data from localStorage
          const storedDataJson = localStorage.getItem('signupFormData');
          if (!storedDataJson) {
            console.error("No stored form data found for account creation");
            setError("Could not find your signup information. Please try again.");
            setLoading(false);
            return;
          }
          
          // Parse the stored form data
          try {
            const storedFormData = JSON.parse(storedDataJson);
            console.log("Using stored form data for account creation:", storedFormData);
            
            // Update form data with Stripe information
            const updatedFormData = {
              ...storedFormData,
              subscriptionId: data.subscriptionId || '',
              customerId: data.customerId || '',
              paymentComplete: true
            };
            
            console.log("Updated form data for account creation:", updatedFormData);
            setFormData(updatedFormData);
            
            // Automatically create the account once payment is verified
            try {
              console.log("Attempting to create user account");
              setError(null);
              
              // Use the server API endpoint to create the user and profile
              const createResponse = await fetch('/api/user/create', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  authData: {
                    email: updatedFormData.email,
                    password: updatedFormData.password,
                  },
                  userData: updatedFormData,
                  paymentData: {
                    customerId: updatedFormData.customerId,
                    subscriptionId: updatedFormData.subscriptionId
                  }
                }),
              });
              
              const createData = await createResponse.json();
              console.log("User creation response:", createData);
              
              if (!createResponse.ok) {
                console.error("Account creation failed:", createData);
                throw new Error(createData.error || 'Failed to create account');
              }
              
              console.log("User created successfully, signing in...");
              
              // Sign in the user using the server-side API to ensure cookie is set
              const signInResponse = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: updatedFormData.email,
                  password: updatedFormData.password,
                }),
              });
              
              const signInData = await signInResponse.json();
              
              if (!signInResponse.ok) {
                console.error("Sign in failed:", signInData);
                throw new Error(signInData.error || 'Failed to sign in');
              }
              
              console.log("User signed in successfully, sending SMS...");
              
              // Force Supabase to refresh the local session information
              try {
                const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
                if (refreshError) {
                  console.error('Error refreshing session after sign in:', refreshError);
                } else {
                  console.log('Session refreshed after sign in:', refreshData.session ? 'success' : 'no session');
                }
              } catch (refreshErr) {
                console.error('Error during session refresh:', refreshErr);
              }
              
              // Store auth token in localStorage with the correct key
              try {
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                if (supabaseUrl && signInData.tokenData) {
                  const cookieKeyName = `sb-${supabaseUrl.replace(/^https?:\/\//, '')}-auth-token`;
                  
                  // Store token in exact format Supabase expects
                  localStorage.setItem(cookieKeyName, JSON.stringify(signInData.tokenData));
                  console.log('Manually set auth token in localStorage with key:', cookieKeyName);
                  
                  // Also store session data
                  if (signInData.session) {
                    localStorage.setItem(`sb-${supabaseUrl.replace(/^https?:\/\//, '')}-session`, 
                      JSON.stringify(signInData.session));
                  }
                }
              } catch (storageErr) {
                console.error('Error setting localStorage token:', storageErr);
              }
              
              // Send SMS notification
              try {
                const smsResponse = await fetch(`/api/proxy?endpoint=/account-create/send-sms-twilio-link`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    to_number: updatedFormData.phoneNumber,
                    phone_carrier: updatedFormData.phone_carrier
                  }),
                });
                
                if (!smsResponse.ok) {
                  console.error('Failed to send SMS notification');
                  // Don't throw here - we still want to proceed with account creation
                } else {
                  console.log("SMS sent successfully");
                }
              } catch (smsError) {
                console.error('SMS error:', smsError);
                // Don't throw here - SMS is not critical
              }

              // Clean up localStorage
              localStorage.removeItem('signupFormData');
              console.log("Redirecting to dashboard");

              // Use a hard redirect instead of router.push to ensure full page reload with cookies
              window.location.href = '/dashboard';
            } catch (createError: unknown) {
              const errorMessage = createError instanceof Error ? createError.message : 'An unknown error occurred';
              console.error("Account creation error:", errorMessage);
              setError(`Payment verified but account creation failed: ${errorMessage}`);
              setLoading(false);
            }
          } catch (parseError) {
            console.error("Failed to parse stored form data:", parseError);
            setError("Could not process your signup information. Please try again.");
            setLoading(false);
          }
        } else {
          console.error("Payment verification failed:", data);
          setError('Payment verification failed. Please try again.');
          setLoading(false);
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setError('Failed to verify payment status');
        setLoading(false);
      }
    };
    
    // Handle initial hash
    handleHashChange();
    
    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Clean up
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [formData, router]);

  // Create a new component for the payment step
  const PaymentStep = () => {
    return (
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900">Payment Information</h3>
          <p className="mt-2 text-sm text-gray-500">
            Subscribe to our service to continue with account creation.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
                <p className="mt-1 text-xs text-red-700">Please try again or contact support.</p>
              </div>
            </div>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-sm text-red-700 font-medium hover:text-red-900"
              >
                Refresh page
              </button>
            </div>
          </div>
        )}
        
        {formData.paymentComplete ? (
          <div>
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">Payment successfully processed!</p>
                  <p className="mt-1 text-xs text-green-700">Your account is being created, please wait...</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-center">
              <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 className="text-lg font-medium text-gray-700">Subscription Details</h4>
              <p className="text-sm text-gray-500 mt-2">
                <span className="bg-beeslyYellow/20 text-gray-800 px-2 py-1 rounded text-xs font-bold">7 Day FREE TRIAL</span>{' '}
                then $40.00/month
              </p>
              <ul className="mt-4 text-sm text-gray-600 space-y-2">
                <li className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-beeslyYellow mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited appointments
                </li>
                <li className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-beeslyYellow mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Google Calendar integration
                </li>
                <li className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-beeslyYellow mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  SMS notifications
                </li>
                <li className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-beeslyYellow mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Customer management
                </li>
              </ul>
              <p className="mt-4 text-xs text-gray-500">Cancel anytime during your trial or after - no commitment.</p>
              <div className="mt-4 text-center text-sm bg-beeslyYellow/20 p-2 rounded-md text-beeslyYellow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Your account will be created automatically after payment is confirmed
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleStripeCheckout}
              disabled={loading}
              className="w-full mt-4 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-black bg-beeslyYellow hover:bg-beeslyYellow/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beeslyYellow"
            >
              {loading ? 'Processing...' : 'Start Free Trial'}
            </button>
            <p className="text-center text-xs text-gray-500 mt-2">
              Secure payment processing by Stripe
            </p>
            <div className="mt-4 flex justify-center">
              <img src="/stripe-badges.png" alt="Secure payment methods" className="h-8" />
            </div>
          </div>
        )}
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="py-3 px-6 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beeslyYellow"
          >
            Back
          </button>
        </div>
      </div>
    );
  };

  // Update renderStep to include the payment step
  const renderStep = () => {
    switch (step) {
      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="Enter your email address"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-beeslyYellow focus:ring-beeslyYellow text-lg p-3"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                placeholder="Enter your password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-beeslyYellow focus:ring-beeslyYellow text-lg p-3"
                value={formData.password}
                onChange={handleInputChange}
              />
              <p className="mt-2 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Password must be at least 6 characters and include lowercase, uppercase, and numbers.
              </p>
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-black bg-beeslyYellow hover:bg-beeslyYellow/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beeslyYellow"
            >
              Next
            </button>
          </div>
        )

      case 'service_type':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select Your Service Type</h3>
              <div className="grid grid-cols-1 gap-4">
                <div 
                  className={`border rounded-lg p-4 cursor-pointer hover:border-beeslyYellow transition-colors ${formData.service_type === 'House Call' ? 'border-beeslyYellow bg-beeslyYellow/10' : 'border-gray-300'}`}
                  onClick={() => setFormData(prev => ({ ...prev, service_type: 'House Call' }))}
                >
                  <div className="flex items-start">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        type="radio"
                        name="service_type"
                        id="houseCall"
                        checked={formData.service_type === 'House Call'}
                        onChange={() => setFormData(prev => ({ ...prev, service_type: 'House Call' }))}
                        className="focus:ring-beeslyYellow h-4 w-4 text-beeslyYellow border-gray-300"
                      />
                    </div>
                    <div className="ml-3 w-full">
                      <div className="flex flex-wrap justify-between items-center">
                        <label htmlFor="houseCall" className="text-lg font-medium text-gray-900">House Call</label>
                        <span className="bg-beeslyYellow/20 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                          Travel to customer locations
                        </span>
                      </div>
                      <p className="text-gray-500 mt-1 text-sm">
                        For services provided at your customers' locations (pool cleaners, plumbers, etc.)
                      </p>
                      
                      <details className="mt-2 text-sm">
                        <summary className="text-gray-700 cursor-pointer font-medium">Read more</summary>
                        <div className="mt-2 pl-2 border-l-2 border-gray-200 text-gray-600">
                          Ideal for pool cleaners, electricians, plumbers, home services, etc. Customers will provide their
                          address, and you'll be able to manage travel time and distance for optimal scheduling.
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer hover:border-beeslyYellow transition-colors ${formData.service_type === 'Scheduler' ? 'border-beeslyYellow bg-beeslyYellow/10' : 'border-gray-300'}`}
                  onClick={() => setFormData(prev => ({ ...prev, service_type: 'Scheduler' }))}
                >
                  <div className="flex items-start">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        type="radio"
                        name="service_type"
                        id="scheduler"
                        checked={formData.service_type === 'Scheduler'}
                        onChange={() => setFormData(prev => ({ ...prev, service_type: 'Scheduler' }))}
                        className="focus:ring-beeslyYellow h-4 w-4 text-beeslyYellow border-gray-300"
                      />
                    </div>
                    <div className="ml-3 w-full">
                      <div className="flex flex-wrap justify-between items-center">
                        <label htmlFor="scheduler" className="text-lg font-medium text-gray-900">Scheduler</label>
                        <span className="bg-beeslyYellow/20 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                          Customers visit you or virtual
                        </span>
                      </div>
                      <p className="text-gray-500 mt-1 text-sm">
                        For services where customers come to you or meet virtually
                      </p>
                      
                      <details className="mt-2 text-sm">
                        <summary className="text-gray-700 cursor-pointer font-medium">Read more</summary>
                        <div className="mt-2 pl-2 border-l-2 border-gray-200 text-gray-600">
                          Ideal for barbers, salons, accountants, consultants, or any business where clients visit your office
                          or connect with you virtually. Focuses on calendar booking without travel calculations.
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="py-3 px-6 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beeslyYellow"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-black bg-beeslyYellow hover:bg-beeslyYellow/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beeslyYellow"
              >
                Next
              </button>
            </div>
          </div>
        )

      case 'business':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="businessName" className="block text-lg font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                name="businessName"
                id="businessName"
                required
                placeholder="Enter your business name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-beeslyYellow focus:ring-beeslyYellow text-lg p-3"
                value={formData.businessName}
                onChange={handleInputChange}
              />
              <p className="mt-2 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Enter your customer-facing business name (without LLC, Inc., or trademark symbols).
              </p>
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-lg font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                required
                placeholder="Enter your phone number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-beeslyYellow focus:ring-beeslyYellow text-lg p-3"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
              <p className="mt-2 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                This number needs to be the primary number for your business and also able to receive text messages.
              </p>
            </div>
            <div>
              <label htmlFor="phone_carrier" className="block text-lg font-medium text-gray-700 mb-2">
                Phone Carrier
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className={`border rounded-lg p-3 cursor-pointer hover:border-beeslyYellow transition-colors ${formData.phone_carrier === 'Verizon' ? 'border-beeslyYellow bg-beeslyYellow/10' : 'border-gray-300'}`}
                  onClick={() => setFormData(prev => ({ ...prev, phone_carrier: 'Verizon' }))}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="phone_carrier"
                      id="verizon"
                      checked={formData.phone_carrier === 'Verizon'}
                      onChange={() => setFormData(prev => ({ ...prev, phone_carrier: 'Verizon' }))}
                      className="focus:ring-beeslyYellow h-4 w-4 text-beeslyYellow border-gray-300"
                    />
                    <label htmlFor="verizon" className="ml-2 block text-sm font-medium text-gray-700">
                      Verizon
                    </label>
                  </div>
                </div>
                <div 
                  className={`border rounded-lg p-3 cursor-pointer hover:border-beeslyYellow transition-colors ${formData.phone_carrier === 'ATT' ? 'border-beeslyYellow bg-beeslyYellow/10' : 'border-gray-300'}`}
                  onClick={() => setFormData(prev => ({ ...prev, phone_carrier: 'ATT' }))}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="phone_carrier"
                      id="att"
                      checked={formData.phone_carrier === 'ATT'}
                      onChange={() => setFormData(prev => ({ ...prev, phone_carrier: 'ATT' }))}
                      className="focus:ring-beeslyYellow h-4 w-4 text-beeslyYellow border-gray-300"
                    />
                    <label htmlFor="att" className="ml-2 block text-sm font-medium text-gray-700">
                      AT&T
                    </label>
                  </div>
                </div>
                <div 
                  className={`border rounded-lg p-3 cursor-pointer hover:border-beeslyYellow transition-colors ${formData.phone_carrier === 'TMobile' ? 'border-beeslyYellow bg-beeslyYellow/10' : 'border-gray-300'}`}
                  onClick={() => setFormData(prev => ({ ...prev, phone_carrier: 'TMobile' }))}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="phone_carrier"
                      id="tmobile"
                      checked={formData.phone_carrier === 'TMobile'}
                      onChange={() => setFormData(prev => ({ ...prev, phone_carrier: 'TMobile' }))}
                      className="focus:ring-beeslyYellow h-4 w-4 text-beeslyYellow border-gray-300"
                    />
                    <label htmlFor="tmobile" className="ml-2 block text-sm font-medium text-gray-700">
                      T-Mobile
                    </label>
                  </div>
                </div>
                <div 
                  className={`border rounded-lg p-3 cursor-pointer hover:border-beeslyYellow transition-colors ${formData.phone_carrier === 'Other' ? 'border-beeslyYellow bg-beeslyYellow/10' : 'border-gray-300'}`}
                  onClick={() => setFormData(prev => ({ ...prev, phone_carrier: 'Other' }))}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="phone_carrier"
                      id="other"
                      checked={formData.phone_carrier === 'Other'}
                      onChange={() => setFormData(prev => ({ ...prev, phone_carrier: 'Other' }))}
                      className="focus:ring-beeslyYellow h-4 w-4 text-beeslyYellow border-gray-300"
                    />
                    <label htmlFor="other" className="ml-2 block text-sm font-medium text-gray-700">
                      Other
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="businessAddress" className="block text-lg font-medium text-gray-700 mb-2">
                Business Address
              </label>
              <AddressValidator 
                id="businessAddress"
                value={formData.businessAddress}
                onChange={handleAddressChange}
                placeholder="Enter your business address"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-beeslyYellow focus:ring-beeslyYellow text-lg p-3"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formData.service_type === 'House Call' 
                  ? "This is your business location - used for estimating travel distance and time to your customers."
                  : "This is your business location - where customers will visit you or your headquarters for virtual services."
                }
              </p>
            </div>
            
            {/* Add Work Description option for Scheduler service type */}
            {formData.service_type === 'Scheduler' && (
              <div className="mt-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="with_work_description"
                      name="with_work_description"
                      type="checkbox"
                      className="focus:ring-beeslyYellow h-4 w-4 text-beeslyYellow border-gray-300 rounded"
                      checked={formData.with_work_description === true}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          with_work_description: e.target.checked
                        }));
                      }}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="with_work_description" className="font-medium text-gray-700">
                      Ask customers for a work description
                    </label>
                    <p className="text-gray-500">
                      When enabled, customers will be prompted to provide a description of their needs when booking appointments.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="py-3 px-6 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beeslyYellow"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-black bg-beeslyYellow hover:bg-beeslyYellow/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beeslyYellow"
              >
                Next
              </button>
            </div>
          </div>
        )

      case 'location':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="maxServiceDistance" className="block text-lg font-medium text-gray-700 mb-2">
                Maximum Service Distance (miles)
              </label>
              <input
                type="number"
                name="maxServiceDistance"
                id="maxServiceDistance"
                required
                placeholder="Enter maximum service distance"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-beeslyYellow focus:ring-beeslyYellow text-lg p-3"
                value={formData.maxServiceDistance}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="typicalServiceTime" className="block text-lg font-medium text-gray-700 mb-2">
                Typical Service Time (minutes) - Including Travel Time
              </label>
              <input
                type="number"
                name="typicalServiceTime"
                id="typicalServiceTime"
                required
                placeholder="Enter typical service time"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-beeslyYellow focus:ring-beeslyYellow text-lg p-3"
                value={formData.typicalServiceTime}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="py-3 px-6 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beeslyYellow"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-black bg-beeslyYellow hover:bg-beeslyYellow/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beeslyYellow"
              >
                Next
              </button>
            </div>
          </div>
        )

      case 'hours':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="localTimeZone" className="block text-lg font-medium text-gray-700 mb-2">
                Time Zone
              </label>
              <select
                name="localTimeZone"
                id="localTimeZone"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-beeslyYellow focus:ring-beeslyYellow text-lg p-3"
                value={formData.localTimeZone}
                onChange={handleInputChange}
              >
                <option value="US/Pacific">Pacific Time</option>
                <option value="US/Mountain">Mountain Time</option>
                <option value="US/Central">Central Time</option>
                <option value="US/Eastern">Eastern Time</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Business Hours
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="openTime" className="block text-base font-medium text-gray-700 mb-1">
                    Opening Time
                  </label>
                  <input
                    type="time"
                    id="openTime"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-beeslyYellow focus:ring-beeslyYellow text-lg p-3"
                    value={formData.businessHoursLocal.open}
                    onChange={(e) => handleHoursChange('open', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="closeTime" className="block text-base font-medium text-gray-700 mb-1">
                    Closing Time
                  </label>
                  <input
                    type="time"
                    id="closeTime"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-beeslyYellow focus:ring-beeslyYellow text-lg p-3"
                    value={formData.businessHoursLocal.close}
                    onChange={(e) => handleHoursChange('close', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="py-3 px-6 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beeslyYellow"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-black bg-beeslyYellow hover:bg-beeslyYellow/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beeslyYellow"
              >
                Next
              </button>
            </div>
          </div>
        )

      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">Connect Your Calendar</h3>
              <p className="mt-2 text-sm text-gray-500">
                Choose one calendar service to manage your appointments. You can only connect one calendar service.
              </p>
              {(formData.calendarConnected || formData.acuityConnected || formData.squareConnected) && (
                <div className="mt-2 text-sm text-indigo-600 font-medium">
                  {formData.calendarConnected ? "Google Calendar selected" : 
                   formData.acuityConnected ? "Acuity Scheduling selected" :
                   "Square selected"}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Google Calendar Option */}
              <div 
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  formData.calendarConnected 
                    ? 'border-green-500 bg-green-50' 
                    : (formData.acuityConnected || formData.squareConnected)
                      ? 'border-gray-300 opacity-50 cursor-not-allowed' 
                      : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 2c5.535 0 10 4.465 10 10s-4.465 10-10 10S2 17.535 2 12 6.465 2 12 2zm0 4c-3.313 0-6 2.687-6 6s2.687 6 6 6 6-2.687 6-6-2.687-6-6-6zm0 2c2.206 0 4 1.794 4 4s-1.794 4-4 4-4-1.794-4-4 1.794-4 4-4z"/>
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="text-lg font-medium text-gray-900">Google Calendar</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Connect your Google Calendar to manage appointments. We'll need access to view and edit your calendar events.
                    </p>
                    {formData.calendarConnected ? (
                      <div className="mt-2 flex items-center text-green-600">
                        <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium">Connected</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleConnectCalendar}
                        disabled={formData.acuityConnected || formData.squareConnected}
                        className={`mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white ${
                          (formData.acuityConnected || formData.squareConnected)
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                      >
                        {formData.acuityConnected || formData.squareConnected ? 'Select Google Calendar' : 'Connect Google Calendar'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Acuity Option */}
              <div 
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  formData.acuityConnected 
                    ? 'border-green-500 bg-green-50' 
                    : (formData.calendarConnected || formData.squareConnected)
                      ? 'border-gray-300 opacity-50 cursor-not-allowed' 
                      : 'border-gray-300 hover:border-indigo-500'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="text-lg font-medium text-gray-900">Acuity Scheduling</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Connect your Acuity Scheduling account to manage appointments and availability.
                    </p>
                    {formData.acuityConnected ? (
                      <div className="mt-2 flex items-center text-green-600">
                        <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium">Connected</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleConnectAcuity}
                        disabled={formData.calendarConnected || formData.squareConnected}
                        className={`mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white ${
                          (formData.calendarConnected || formData.squareConnected)
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }`}
                      >
                        {formData.calendarConnected || formData.squareConnected ? 'Select Acuity' : 'Connect Acuity'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Square Option */}
              <div 
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  formData.squareConnected 
                    ? 'border-green-500 bg-green-50' 
                    : (formData.calendarConnected || formData.acuityConnected)
                      ? 'border-gray-300 opacity-50 cursor-not-allowed' 
                      : 'border-gray-300 hover:border-green-500'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="text-lg font-medium text-gray-900">Square</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Connect your Square account to manage appointments and payments.
                    </p>
                    {formData.squareConnected ? (
                      <div className="mt-2 flex items-center text-green-600">
                        <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium">Connected</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleConnectSquare}
                        disabled={formData.calendarConnected || formData.acuityConnected}
                        className={`mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white ${
                          (formData.calendarConnected || formData.acuityConnected)
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                        }`}
                      >
                        {formData.calendarConnected || formData.acuityConnected ? 'Select Square' : 'Connect Square'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="textMessageConsent"
                  name="textMessageConsent"
                  type="checkbox"
                  required
                  className="focus:ring-beeslyYellow h-4 w-4 text-beeslyYellow border-gray-300 rounded"
                  checked={formData.textMessageConsent}
                  onChange={handleInputChange}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="textMessageConsent" className="font-medium text-gray-700">
                  I consent to receive text messages
                </label>
                <p className="text-gray-500">
                  You agree to receive text messages about your account. Message and data rates may apply.
                </p>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="py-3 px-6 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beeslyYellow"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-black bg-beeslyYellow hover:bg-beeslyYellow/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beeslyYellow"
              >
                Next
              </button>
            </div>
          </div>
        )

      case 'payment':
        return <PaymentStep />;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-beeslyDark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/callendar_ai_logo_no_bg.png"
            alt="Callendar.ai Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 'account' && "Let's get started with your Callendar.ai account"}
            {step === 'service_type' && "What type of service do you provide?"}
            {step === 'business' && "Tell us about your business"}
            {step === 'location' && "Configure your service location settings"}
            {step === 'hours' && "Set your business hours"}
            {step === 'calendar' && "Connect your preferred calendar"}
            {step === 'payment' && "Start your free trial"}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          {renderStep()}
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// Loading component
function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-beeslyDark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <img
          className="mx-auto h-12 w-auto"
          src="/callendar_ai_logo_no_bg.png"
          alt="Callendar.ai Logo"
        />
        <h2 className="mt-6 text-center text-xl font-medium text-gray-900">
          Loading...
        </h2>
      </div>
    </div>
  )
}

export default function SignUp() {
  return (
    <Suspense fallback={<Loading />}>
      <SignUpContent />
    </Suspense>
  )
} 
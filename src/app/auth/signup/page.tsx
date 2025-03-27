'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import AddressValidator from '@/components/AddressValidator'

type Step = 'account' | 'service_type' | 'business' | 'location' | 'hours' | 'calendar' | 'payment'

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
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
    phoneNumber: '',
    businessAddress: '',
    maxServiceDistance: '25',
    typicalServiceTime: '90',
    localTimeZone: 'US/Pacific', // Default to Pacific time
    businessHoursLocal: {
      open: '09:00:00',
      close: '18:00:00'
    },
    calendarConnected: false,
    googleAuthToken: null,
    textMessageConsent: false, // Add new field for text message consent
    service_type: '', // Add new field for service type
    subscriptionId: '', // Add field for Stripe subscription ID
    customerId: '', // Add field for Stripe customer ID
    paymentComplete: false // Track payment completion
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
    const stepParam = searchParams.get('step')
    console.log("Step parameter from URL:", stepParam);
    
    if (stepParam && ['account', 'service_type', 'business', 'location', 'hours', 'calendar', 'payment'].includes(stepParam as Step)) {
      console.log("Setting step from URL parameter:", stepParam);
      setStep(stepParam as Step)
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

      // Send SMS notification
      const smsResponse = await fetch(`/api/proxy?endpoint=/account-create/send-sms-twilio-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to_number: formData.phoneNumber
        }),
      });

      if (!smsResponse.ok) {
        console.error('Failed to send SMS notification');
        // Don't throw here - we still want to proceed with account creation
      }

      // Clean up localStorage
      localStorage.removeItem('signupFormData')

      router.push('/dashboard')
      router.refresh()
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
    
    // Redirect to Google OAuth URL
    const googleAuthUrl = 
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      'scope=https://www.googleapis.com/auth/calendar&' +
      'access_type=offline&' +
      'prompt=consent&' +
      'include_granted_scopes=true&' +
      'response_type=code&' +
      'state=signup&' +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `client_id=${clientId}`;
    
    window.location.href = googleAuthUrl;
  };

  // Add calendar connected state setter
  const setCalendarConnected = (connected: boolean) => {
    setFormData(prev => ({
      ...prev,
      calendarConnected: connected
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
          // Update form data with Stripe information
          const updatedFormData = {
            ...formData,
            subscriptionId: data.subscriptionId || '',
            customerId: data.customerId || '',
            paymentComplete: true
          };
          
          console.log("Updated form data:", updatedFormData);
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
            
            console.log("User created successfully, sending SMS");
            // Send SMS notification
            try {
              const smsResponse = await fetch(`/api/proxy?endpoint=/account-create/send-sms-twilio-link`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  to_number: updatedFormData.phoneNumber
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

            // Redirect to dashboard
            router.push('/dashboard');
            router.refresh();
          } catch (createError: unknown) {
            const errorMessage = createError instanceof Error ? createError.message : 'An unknown error occurred';
            console.error("Account creation error:", errorMessage);
            setError(`Payment verified but account creation failed: ${errorMessage}`);
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
      <div className="space-y-6">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900">Payment Information</h3>
          <p className="mt-2 text-sm text-gray-500">
            Subscribe to our service to continue with account creation.
          </p>
        </div>
        
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
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">1-MONTH FREE TRIAL</span>{' '}
                then $30.00/month
              </p>
              <ul className="mt-4 text-sm text-gray-600 space-y-2">
                <li className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited appointments
                </li>
                <li className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Google Calendar integration
                </li>
                <li className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  SMS notifications
                </li>
                <li className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Customer management
                </li>
              </ul>
              <p className="mt-4 text-xs text-gray-500">Cancel anytime during your trial or after - no commitment.</p>
              <div className="mt-4 text-center text-sm bg-blue-50 p-2 rounded-md text-blue-700">
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
              className="w-full mt-4 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
            className="py-3 px-6 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
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
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                  className={`border rounded-lg p-4 cursor-pointer hover:border-indigo-500 transition-colors ${formData.service_type === 'House Call' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
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
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                    </div>
                    <div className="ml-3 w-full">
                      <div className="flex flex-wrap justify-between items-center">
                        <label htmlFor="houseCall" className="text-lg font-medium text-gray-900">House Call</label>
                        <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                          Travel to customer locations
                        </span>
                      </div>
                      <p className="text-gray-500 mt-1 text-sm">
                        For services provided at your customers' locations (pool cleaners, plumbers, etc.)
                      </p>
                      
                      <details className="mt-2 text-sm">
                        <summary className="text-indigo-600 cursor-pointer font-medium">Read more</summary>
                        <div className="mt-2 pl-2 border-l-2 border-gray-200 text-gray-600">
                          Ideal for pool cleaners, electricians, plumbers, home services, etc. Customers will provide their
                          address, and you'll be able to manage travel time and distance for optimal scheduling.
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer hover:border-indigo-500 transition-colors ${formData.service_type === 'Scheduler' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
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
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                    </div>
                    <div className="ml-3 w-full">
                      <div className="flex flex-wrap justify-between items-center">
                        <label htmlFor="scheduler" className="text-lg font-medium text-gray-900">Scheduler</label>
                        <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                          Customers visit you or virtual
                        </span>
                      </div>
                      <p className="text-gray-500 mt-1 text-sm">
                        For services where customers come to you or meet virtually
                      </p>
                      
                      <details className="mt-2 text-sm">
                        <summary className="text-indigo-600 cursor-pointer font-medium">Read more</summary>
                        <div className="mt-2 pl-2 border-l-2 border-gray-200 text-gray-600">
                          Ideal for accountants, consultants, salons, or any business where clients visit your office
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
                className="py-3 px-6 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
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
              <label htmlFor="businessAddress" className="block text-lg font-medium text-gray-700 mb-2">
                Business Address
              </label>
              <AddressValidator 
                id="businessAddress"
                value={formData.businessAddress}
                onChange={handleAddressChange}
                placeholder="Enter your business address"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
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
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="py-3 px-6 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                value={formData.typicalServiceTime}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="py-3 px-6 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
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
                className="py-3 px-6 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
              <h3 className="mt-4 text-xl font-medium text-gray-900">Connect Google Calendar</h3>
              <p className="mt-2 text-sm text-gray-500">
                Connect your Google Calendar to manage your appointments. We'll need access to:
              </p>
              <ul className="mt-4 text-left text-sm text-gray-700 space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  View your Calendar settings
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  View and edit events on all your calendars
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  View your availability in your calendars
                </li>
              </ul>
              <p className="mt-4 text-sm text-gray-500">
                By connecting your calendar, you agree to our{' '}
                <Link href="/privacy-policy" className="text-indigo-600 hover:text-indigo-500">
                  Privacy Policy
                </Link>
              </p>
            </div>
            
            {formData.calendarConnected ? (
              <div className="bg-green-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">Google Calendar successfully connected</p>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConnectCalendar}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Connect Google Calendar
              </button>
            )}

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="textMessageConsent"
                  name="textMessageConsent"
                  type="checkbox"
                  required
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
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
                className="py-3 px-6 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-lg text-gray-600">
            {formData.service_type === 'Scheduler' ? (
              // For Scheduler: 5 steps (account, service_type, business, hours, calendar)
              `Step ${['account', 'service_type', 'business', 'hours', 'calendar'].indexOf(step) + 1} of 5`
            ) : (
              // For House Call or initial state: 6 steps (account, service_type, business, location, hours, calendar)
              `Step ${['account', 'service_type', 'business', 'location', 'hours', 'calendar'].indexOf(step) + 1} of 6`
            )}
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
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
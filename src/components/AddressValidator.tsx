'use client';

import { useState } from 'react';

interface AddressValidatorProps {
  value: string;
  onChange: (value: string, isValid: boolean, formattedAddress?: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  id?: string;
}

export default function AddressValidator({
  value,
  onChange,
  className = '',
  placeholder = 'Enter address',
  required = false,
  id = 'address'
}: AddressValidatorProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{valid: boolean, message: string} | null>(null);
  
  const validateAddress = async (address: string) => {
    if (!address.trim()) {
      onChange(address, false);
      return;
    }
    
    setIsValidating(true);
    setValidationResult(null);
    
    try {
      const response = await fetch('https://addressvalidation.googleapis.com/v1:validateAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        },
        body: JSON.stringify({
          address: {
            addressLines: [address]
          },
          enableUspsCass: true
        })
      });
      
      const data = await response.json();
      console.log('Address validation response:', data);
      
      // Check if validation was successful
      if (data.result && data.result.verdict) {
        const isValid = data.result.verdict.addressComplete || false;
        const uspsVerified = data.result.verdict.hasReliableUspsData || false;
        const formattedAddress = data.result.address?.formattedAddress || address;
        
        let message = isValid ? 'Address is valid' : 'Address may be incomplete';
        if (uspsVerified) {
          message += ' (USPS verified)';
        }
        
        setValidationResult({
          valid: isValid,
          message: message
        });
        
        onChange(address, isValid, formattedAddress);
      } else if (data.error) {
        setValidationResult({
          valid: false,
          message: data.error.message || 'Address validation failed'
        });
        onChange(address, false);
      } else {
        setValidationResult({
          valid: false,
          message: 'Could not validate address'
        });
        onChange(address, false);
      }
    } catch (error) {
      console.error('Error validating address:', error);
      setValidationResult({
        valid: false,
        message: 'Error validating address'
      });
      onChange(address, false);
    } finally {
      setIsValidating(false);
    }
  };
  
  return (
    <div className="relative">
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          onChange(newValue, validationResult?.valid || false);
          if (validationResult) setValidationResult(null);
        }}
        onBlur={() => validateAddress(value)}
        placeholder={placeholder}
        className={className}
        required={required}
      />
      
      {isValidating && (
        <div className="text-gray-500 text-sm mt-1">
          Validating address...
        </div>
      )}
      
      {!isValidating && validationResult && (
        <div className={`text-sm mt-1 ${validationResult.valid ? 'text-green-600' : 'text-red-600'}`}>
          {validationResult.message}
        </div>
      )}
    </div>
  );
} 
"use client";

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneFormatter, ValidationResult } from '@/utils/validation';
import { Country, ICountry } from 'country-state-city';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onCountryChange?: (countryCode: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
  error?: string;
}

export function PhoneInput({
  value,
  onChange,
  onCountryChange,
  placeholder = "Enter phone number",
  className,
  label,
  required = false,
  error,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true });

  // Get all countries for dropdown
  const countries = Country.getAllCountries();

  // Initialize with India as default
  useEffect(() => {
    const defaultCountry = countries.find(c => c.isoCode === 'IN');
    if (defaultCountry && !selectedCountry) {
      setSelectedCountry(defaultCountry);
      onCountryChange?.(defaultCountry.isoCode);
    }
  }, [countries, selectedCountry, onCountryChange]);

  // Handle country selection
  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.isoCode === countryCode);
    if (country) {
      setSelectedCountry(country);
      onCountryChange?.(countryCode);
      
      // Validate phone number with new country
      if (phoneNumber) {
        const validation = PhoneFormatter.validatePhoneNumber(phoneNumber, countryCode);
        setValidation(validation);
      }
    }
  };

  // Handle phone number input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const digits = PhoneFormatter.extractDigits(input);
    
    // Limit to reasonable length
    const limitedDigits = digits.slice(0, 15);
    setPhoneNumber(limitedDigits);
    
    // Validate
    if (selectedCountry) {
      const validation = PhoneFormatter.validatePhoneNumber(limitedDigits, selectedCountry.isoCode);
      setValidation(validation);
    }
    
    // Update parent component
    onChange(limitedDigits);
  };

  // Format display value
  const displayValue = selectedCountry && phoneNumber 
    ? PhoneFormatter.formatPhoneNumber(phoneNumber, selectedCountry.isoCode)
    : phoneNumber;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="flex gap-2">
        {/* Country Code Selector */}
        <Select
          value={selectedCountry?.isoCode || ''}
          onValueChange={handleCountryChange}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Country">
              {selectedCountry && (
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selectedCountry.flag}</span>
                  <span className="text-sm">+{selectedCountry.phonecode}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {countries.map((country) => (
              <SelectItem key={country.isoCode} value={country.isoCode}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-sm">{country.name}</span>
                  <span className="text-xs text-muted-foreground">+{country.phonecode}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Phone Number Input */}
        <div className="flex-1">
          <Input
            type="tel"
            value={displayValue}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            className={cn(
              "h-11",
              !validation.isValid && "border-red-500 focus-visible:ring-red-500/20",
              validation.isValid && phoneNumber && "border-green-500 focus-visible:ring-green-500/20"
            )}
          />
        </div>
      </div>

      {/* Validation Message */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {!error && !validation.isValid && (
        <p className="text-sm text-red-500">{validation.message}</p>
      )}
      {validation.isValid && phoneNumber && (
        <p className="text-sm text-green-600">✓ Valid phone number</p>
      )}
    </div>
  );
}

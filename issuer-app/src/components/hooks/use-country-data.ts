"use client";

import { useState, useEffect, useMemo } from 'react';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';

export interface CountryData {
  isoCode: string;
  name: string;
  phonecode: string;
  flag: string;
  currency: string;
}

export interface StateData {
  name: string;
  isoCode: string;
  countryCode: string;
}

export interface CityData {
  name: string;
  countryCode: string;
  stateCode: string;
  latitude: string;
  longitude: string;
}

export function useCountryData() {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);

  // Get all countries with required data
  const countries = useMemo(() => {
    return Country.getAllCountries().map((country: ICountry) => ({
      isoCode: country.isoCode,
      name: country.name,
      phonecode: country.phonecode,
      flag: country.flag,
      currency: country.currency,
    }));
  }, []);

  // Get states for selected country
  const states = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry.isoCode).map((state: IState) => ({
      name: state.name,
      isoCode: state.isoCode,
      countryCode: state.countryCode,
    }));
  }, [selectedCountry]);

  // Get cities for selected state
  const cities = useMemo(() => {
    if (!selectedCountry || !selectedState) return [];
    return City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode).map((city: ICity) => ({
      name: city.name,
      countryCode: city.countryCode,
      stateCode: city.stateCode,
      latitude: city.latitude,
      longitude: city.longitude,
    }));
  }, [selectedCountry, selectedState]);

  // Handle country selection
  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.isoCode === countryCode);
    setSelectedCountry(country || null);
    setSelectedState(null);
    setSelectedCity(null);
  };

  // Handle state selection
  const handleStateChange = (stateCode: string) => {
    const state = states.find(s => s.isoCode === stateCode);
    setSelectedState(state || null);
    setSelectedCity(null);
  };

  // Handle city selection
  const handleCityChange = (cityName: string) => {
    const city = cities.find(c => c.name === cityName);
    setSelectedCity(city || null);
  };

  // Reset all selections
  const resetSelections = () => {
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
  };

  return {
    countries,
    states,
    cities,
    selectedCountry,
    selectedState,
    selectedCity,
    handleCountryChange,
    handleStateChange,
    handleCityChange,
    resetSelections,
  };
}

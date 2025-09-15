"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Calendar, User, MapPin, FileText, Shield, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterableSelect } from "@/components/ui/filterable-select";
import { Checkbox } from "@/components/ui/checkbox";
// stepper moved to sticky navbar; remove local stepper
import { PhoneInput } from "@/components/ui/phone-input";
import { useCountryData } from "@/components/hooks/use-country-data";
import { FormValidator, ValidationResult } from "@/utils/validation";
import { cn } from "@/lib/utils";

// Date Picker Component
interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

const DatePicker = ({ 
  date, 
  onDateChange, 
  placeholder = "Pick a date",
  className 
}: DatePickerProps) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : undefined;
    onDateChange?.(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="relative">
      <Input
        type="date"
        value={date ? formatDate(date) : ''}
        onChange={handleDateChange}
        placeholder={placeholder}
        className={cn("w-full", className)}
      />
    </div>
  );
};

// File Upload Component
interface FileUploadProps {
  onChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
}

const FileUpload = ({ onChange, accept, multiple = false }: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles(newFiles);
    onChange?.(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        className="p-8 border-2 border-dashed border-muted-foreground/25 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 bg-muted/30"
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept={accept}
          multiple={multiple}
        />
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-4 rounded-full bg-primary/10">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-1">Supports PDF, JPG, PNG files</p>
          </div>
          {files.length > 0 && (
            <div className="mt-4 w-full space-y-2">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-background rounded-lg border">
                  <p className="text-sm text-foreground truncate">{file.name}</p>
                  <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Form Data Interface
interface RegistrationFormData {
  // Step 1: Personal Details
  fullName: string;
  dateOfBirth?: Date;
  gender: string;
  nationality: string;
  email: string;
  mobileNumber: string;
  countryCode: string;

  // Step 2: Address & Travel Details
  currentAddress: string;
  currentCountry: string;
  currentState: string;
  currentCity: string;
  currentPostalCode: string;
  permanentAddress: string;
  permanentCountry: string;
  permanentState: string;
  permanentCity: string;
  permanentPostalCode: string;
  passportNumber: string;
  countryOfIssue: string;
  visaType: string;
  visaExpiryDate?: Date;
  travelInsurance?: File[];

  // Step 3: KYC Documents
  primaryId?: File[];
  secondaryProof?: File[];
  photoSelfie?: File[];
  idExpiryDate?: Date;

  // Step 4: Safety & Emergency Info
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyCountryCode: string;
  relationshipToUser: string;
  bloodGroup: string;
  allergies: string;

  // Step 5: Internal Issuer Section
  issuerOfficerId: string;
  registrationDateTime: Date;
  verificationNotes: string;
}

const steps = [
  { id: 1, title: "Personal Details", icon: User },
  { id: 2, title: "Address & Travel", icon: MapPin },
  { id: 3, title: "KYC Documents", icon: FileText },
  { id: 4, title: "Safety & Emergency", icon: Shield },
  { id: 5, title: "Internal Issuer", icon: Phone },
];

export function RegistrationForm({
  currentStep: externalStep,
  onNext,
  onBack,
  onStepChange,
  totalSteps,
}: {
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  onStepChange?: (step: number) => void;
  totalSteps: number;
}) {
  const [currentStep, setCurrentStep] = useState(externalStep);

  React.useEffect(() => {
    setCurrentStep(externalStep);
  }, [externalStep]);
  const [sameAsCurrentAddress, setSameAsCurrentAddress] = useState(true);
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: "",
    gender: "",
    nationality: "",
    email: "",
    mobileNumber: "",
    countryCode: "IN",
    currentAddress: "",
    currentCountry: "",
    currentState: "",
    currentCity: "",
    currentPostalCode: "",
    permanentAddress: "",
    permanentCountry: "",
    permanentState: "",
    permanentCity: "",
    permanentPostalCode: "",
    passportNumber: "",
    countryOfIssue: "",
    visaType: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    emergencyCountryCode: "IN",
    relationshipToUser: "",
    bloodGroup: "",
    allergies: "",
    issuerOfficerId: "OFF001", // Auto-filled
    registrationDateTime: new Date(), // Auto-captured
    verificationNotes: "",
  });

  // Country data hooks
  const currentAddressData = useCountryData();
  const permanentAddressData = useCountryData();

  const updateFormData = (field: keyof RegistrationFormData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-fill country fields when nationality is selected
      if (field === 'nationality' && value) {
        const selectedCountry = currentAddressData.countries.find(c => c.name === value);
        if (selectedCountry) {
          // Auto-fill current address country
          newData.currentCountry = value;
          currentAddressData.handleCountryChange(selectedCountry.isoCode);
          
          // Auto-fill permanent address country
          newData.permanentCountry = value;
          permanentAddressData.handleCountryChange(selectedCountry.isoCode);
          
          // Auto-fill phone country codes
          newData.countryCode = selectedCountry.isoCode;
          newData.emergencyCountryCode = selectedCountry.isoCode;
        }
      }
      
      return newData;
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      onNext();
      onStepChange?.(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      onBack();
      onStepChange?.(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    alert("Registration form submitted successfully!");
  };

  const handleReset = () => {
    setCurrentStep(0);
    setFormData({
      fullName: "",
      gender: "",
      nationality: "",
      email: "",
      mobileNumber: "",
      countryCode: "IN",
      currentAddress: "",
      currentCountry: "",
      currentState: "",
      currentCity: "",
      currentPostalCode: "",
      permanentAddress: "",
      permanentCountry: "",
      permanentState: "",
      permanentCity: "",
      permanentPostalCode: "",
      passportNumber: "",
      countryOfIssue: "",
      visaType: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      emergencyCountryCode: "IN",
      relationshipToUser: "",
      bloodGroup: "",
      allergies: "",
      issuerOfficerId: "OFF001",
      registrationDateTime: new Date(),
      verificationNotes: "",
    });
    
    // Reset country data hooks
    currentAddressData.resetSelections();
    permanentAddressData.resetSelections();
  };

  const isStepValid = () => {
    const validation = FormValidator.validateStep(formData, currentStep);
    return validation.isValid;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => updateFormData("fullName", e.target.value)}
                  placeholder="Enter your full name (e.g., John Doe)"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Nationality *</Label>
                <FilterableSelect
                  value={formData.nationality}
                  onValueChange={(value) => updateFormData("nationality", value)}
                  placeholder="Select your nationality"
                  triggerClassName="h-11"
                  options={currentAddressData.countries.map((c) => ({
                    value: c.name,
                    label: c.name,
                    iconLeft: <span className="text-lg">{c.flag}</span>,
                    keywords: [c.isoCode, c.phonecode]
                  }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Date of Birth *</Label>
              <DatePicker
                date={formData.dateOfBirth}
                onDateChange={(date) => updateFormData("dateOfBirth", date)}
                placeholder="Select your date of birth"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => updateFormData("gender", value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="Enter your email address"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <PhoneInput
                  value={formData.mobileNumber}
                  onChange={(value) => updateFormData("mobileNumber", value)}
                  onCountryChange={(countryCode) => updateFormData("countryCode", countryCode)}
                  placeholder="Enter your mobile number"
                  label="Mobile Number"
                  required={true}
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            {/* Current Address Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">Current Residential Address *</h3>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Country *</Label>
                <FilterableSelect
                  value={formData.currentCountry}
                  onValueChange={(value) => {
                    updateFormData("currentCountry", value);
                    currentAddressData.handleCountryChange(value);
                  }}
                  placeholder="Select your country"
                  triggerClassName="h-11"
                  options={currentAddressData.countries.map((c) => ({
                    value: c.name,
                    label: c.name,
                    iconLeft: <span className="text-lg">{c.flag}</span>,
                    keywords: [c.isoCode, c.phonecode]
                  }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">State/Province *</Label>
                  <FilterableSelect
                    value={formData.currentState}
                    onValueChange={(value) => {
                      updateFormData("currentState", value);
                      currentAddressData.handleStateChange(value);
                    }}
                    placeholder="Select state/province"
                    triggerClassName="h-11"
                    disabled={!formData.currentCountry}
                    options={currentAddressData.states.map((s) => ({
                      value: s.name,
                      label: s.name,
                      keywords: [s.isoCode]
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">City *</Label>
                  <FilterableSelect
                    value={formData.currentCity}
                    onValueChange={(value) => {
                      updateFormData("currentCity", value);
                      currentAddressData.handleCityChange(value);
                    }}
                    placeholder="Select city"
                    triggerClassName="h-11"
                    disabled={!formData.currentState}
                    options={currentAddressData.cities.map((c) => ({
                      value: c.name,
                      label: c.name,
                      keywords: [c.stateCode]
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPostalCode" className="text-sm font-medium">Postal Code *</Label>
                  <Input
                    id="currentPostalCode"
                    value={formData.currentPostalCode}
                    onChange={(e) => updateFormData("currentPostalCode", e.target.value)}
                    placeholder="Enter postal code"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentAddress" className="text-sm font-medium">Street Address *</Label>
                  <Textarea
                    id="currentAddress"
                    value={formData.currentAddress}
                    onChange={(e) => updateFormData("currentAddress", e.target.value)}
                    placeholder="Enter street address, building, apartment details"
                    className="min-h-20"
                  />
                </div>
              </div>
            </div>

            {/* Permanent Address Section */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-lg font-semibold text-foreground">Permanent Address</h3>
                <label htmlFor="sameAsCurrentAddress" className="flex items-center gap-2 text-sm font-medium">
                  <Checkbox
                    id="sameAsCurrentAddress"
                    checked={sameAsCurrentAddress}
                    onCheckedChange={(checked) => {
                      setSameAsCurrentAddress(checked === true);
                      if (checked === true) {
                        // Copy current address data to permanent address
                        updateFormData("permanentCountry", formData.currentCountry);
                        updateFormData("permanentState", formData.currentState);
                        updateFormData("permanentCity", formData.currentCity);
                        updateFormData("permanentPostalCode", formData.currentPostalCode);
                        updateFormData("permanentAddress", formData.currentAddress);
                        
                        // Sync permanent address data with current address data
                        if (formData.currentCountry) {
                          const selectedCountry = permanentAddressData.countries.find(c => c.name === formData.currentCountry);
                          if (selectedCountry) {
                            permanentAddressData.handleCountryChange(selectedCountry.isoCode);
                          }
                        }
                      }
                    }}
                  />
                  Same as current address
                </label>
              </div>

              {!sameAsCurrentAddress && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Country</Label>
                    <FilterableSelect
                      value={formData.permanentCountry}
                      onValueChange={(value) => {
                        updateFormData("permanentCountry", value);
                        permanentAddressData.handleCountryChange(value);
                      }}
                      placeholder="Select your country"
                      triggerClassName="h-11"
                      options={permanentAddressData.countries.map((c) => ({
                        value: c.name,
                        label: c.name,
                        iconLeft: <span className="text-lg">{c.flag}</span>,
                        keywords: [c.isoCode, c.phonecode]
                      }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">State/Province</Label>
                      <FilterableSelect
                        value={formData.permanentState}
                        onValueChange={(value) => {
                          updateFormData("permanentState", value);
                          permanentAddressData.handleStateChange(value);
                        }}
                        placeholder="Select state/province"
                        triggerClassName="h-11"
                        disabled={!formData.permanentCountry}
                        options={permanentAddressData.states.map((s) => ({
                          value: s.name,
                          label: s.name,
                          keywords: [s.isoCode]
                        }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">City</Label>
                      <FilterableSelect
                        value={formData.permanentCity}
                        onValueChange={(value) => {
                          updateFormData("permanentCity", value);
                          permanentAddressData.handleCityChange(value);
                        }}
                        placeholder="Select city"
                        triggerClassName="h-11"
                        disabled={!formData.permanentState}
                        options={permanentAddressData.cities.map((c) => ({
                          value: c.name,
                          label: c.name,
                          keywords: [c.stateCode]
                        }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="permanentPostalCode" className="text-sm font-medium">Postal Code</Label>
                      <Input
                        id="permanentPostalCode"
                        value={formData.permanentPostalCode}
                        onChange={(e) => updateFormData("permanentPostalCode", e.target.value)}
                        placeholder="Enter postal code"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="permanentAddress" className="text-sm font-medium">Street Address</Label>
                      <Textarea
                        id="permanentAddress"
                        value={formData.permanentAddress}
                        onChange={(e) => updateFormData("permanentAddress", e.target.value)}
                        placeholder="Enter street address, building, apartment details"
                        className="min-h-20"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-4">For Tourists:</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="passportNumber">Passport Number</Label>
                  <Input
                    id="passportNumber"
                    value={formData.passportNumber}
                    onChange={(e) => updateFormData("passportNumber", e.target.value)}
                    placeholder="Enter passport number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="countryOfIssue">Country of Issue</Label>
                  <Input
                    id="countryOfIssue"
                    value={formData.countryOfIssue}
                    onChange={(e) => updateFormData("countryOfIssue", e.target.value)}
                    placeholder="Enter country of issue"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visaType">Visa Type</Label>
                  <Input
                    id="visaType"
                    value={formData.visaType}
                    onChange={(e) => updateFormData("visaType", e.target.value)}
                    placeholder="Enter visa type"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Visa Expiry Date</Label>
                  <DatePicker
                    date={formData.visaExpiryDate}
                    onDateChange={(date) => updateFormData("visaExpiryDate", date)}
                    placeholder="Select visa expiry date"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Travel Insurance (upload proof)</Label>
                  <FileUpload
                    onChange={(files) => updateFormData("travelInsurance", files)}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Primary ID Upload (Passport, Aadhaar, Driver's License, etc.)</Label>
              <FileUpload
                onChange={(files) => updateFormData("primaryId", files)}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>

            <div className="space-y-2">
              <Label>Secondary Proof Upload (optional: utility bill, etc.)</Label>
              <FileUpload
                onChange={(files) => updateFormData("secondaryProof", files)}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>

            <div className="space-y-2">
              <Label>Photo / Selfie Capture (for identity match)</Label>
              <FileUpload
                onChange={(files) => updateFormData("photoSelfie", files)}
                accept=".jpg,.jpeg,.png"
              />
            </div>

            <div className="space-y-2">
              <Label>ID/Passport/Visa Expiry Date</Label>
              <DatePicker
                date={formData.idExpiryDate}
                onDateChange={(date) => updateFormData("idExpiryDate", date)}
                placeholder="Select expiry date"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName" className="text-sm font-medium">Emergency Contact Name *</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) => updateFormData("emergencyContactName", e.target.value)}
                  placeholder="Enter emergency contact full name"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <PhoneInput
                  value={formData.emergencyContactNumber}
                  onChange={(value) => updateFormData("emergencyContactNumber", value)}
                  onCountryChange={(countryCode) => updateFormData("emergencyCountryCode", countryCode)}
                  placeholder="Enter emergency contact number"
                  label="Emergency Contact Number"
                  required={true}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationshipToUser">Relationship to User</Label>
              <Select
                value={formData.relationshipToUser}
                onValueChange={(value) => updateFormData("relationshipToUser", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-4">Medical Info (Optional):</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(value) => updateFormData("bloodGroup", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => updateFormData("allergies", e.target.value)}
                    placeholder="List any allergies"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="issuerOfficerId">Issuer Officer ID (auto-filled)</Label>
              <Input
                id="issuerOfficerId"
                value={formData.issuerOfficerId}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label>Registration Date & Time (auto-captured)</Label>
              <Input
                value={formData.registrationDateTime.toLocaleString()}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="verificationNotes">Verification Notes / Comments</Label>
              <Textarea
                id="verificationNotes"
                value={formData.verificationNotes}
                onChange={(e) => updateFormData("verificationNotes", e.target.value)}
                placeholder="Enter verification notes or comments"
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Form Content */}
      <Card className="shadow-lg">
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b rounded-t-xl">
          <CardHeader className="bg-transparent border-b-0">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              {React.createElement(steps[currentStep].icon, { className: "w-6 h-6 text-primary" })}
            </div>
            <div>
              <div className="text-2xl font-bold">{steps[currentStep].title}</div>
              <div className="text-sm text-muted-foreground font-normal">
                Step {currentStep + 1} of {totalSteps}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        </div>
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
          Back
        </Button>
        <Button onClick={nextStep}>
          {currentStep === totalSteps - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}

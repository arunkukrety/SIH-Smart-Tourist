// Validation utilities and phone formatter

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Phone number validation and formatting
export class PhoneFormatter {
  static formatPhoneNumber(phone: string, countryCode: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Format based on country code
    switch (countryCode) {
      case 'IN': // India
        if (digits.length === 10) {
          return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
        }
        break;
      case 'US': // United States
        if (digits.length === 10) {
          return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        }
        break;
      case 'GB': // United Kingdom
        if (digits.length === 10) {
          return `+44 ${digits.slice(0, 4)} ${digits.slice(4)}`;
        }
        break;
      default:
        // Generic formatting
        if (digits.length >= 7 && digits.length <= 15) {
          return `+${countryCode} ${digits}`;
        }
    }
    
    return phone;
  }

  static validatePhoneNumber(phone: string, countryCode: string): ValidationResult {
    const digits = phone.replace(/\D/g, '');
    
    // Common validation rules
    if (!digits) {
      return { isValid: false, message: 'Phone number is required' };
    }

    if (digits.length < 7) {
      return { isValid: false, message: 'Phone number is too short' };
    }

    if (digits.length > 15) {
      return { isValid: false, message: 'Phone number is too long' };
    }

    // Country-specific validation
    switch (countryCode) {
      case 'IN': // India
        if (digits.length !== 10) {
          return { isValid: false, message: 'Indian phone number must be 10 digits' };
        }
        if (!digits.startsWith('6') && !digits.startsWith('7') && !digits.startsWith('8') && !digits.startsWith('9')) {
          return { isValid: false, message: 'Indian mobile number must start with 6, 7, 8, or 9' };
        }
        break;
      case 'US': // United States
        if (digits.length !== 10) {
          return { isValid: false, message: 'US phone number must be 10 digits' };
        }
        break;
      case 'GB': // United Kingdom
        if (digits.length !== 10 && digits.length !== 11) {
          return { isValid: false, message: 'UK phone number must be 10 or 11 digits' };
        }
        break;
    }

    return { isValid: true };
  }

  static extractDigits(phone: string): string {
    return phone.replace(/\D/g, '');
  }
}

// Email validation
export class EmailValidator {
  static validate(email: string): ValidationResult {
    if (!email) {
      return { isValid: false, message: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }

    // Additional checks
    if (email.length > 254) {
      return { isValid: false, message: 'Email address is too long' };
    }

    const localPart = email.split('@')[0];
    if (localPart.length > 64) {
      return { isValid: false, message: 'Email local part is too long' };
    }

    return { isValid: true };
  }
}

// Name validation
export class NameValidator {
  static validate(name: string): ValidationResult {
    if (!name) {
      return { isValid: false, message: 'Name is required' };
    }

    if (name.length < 2) {
      return { isValid: false, message: 'Name must be at least 2 characters' };
    }

    if (name.length > 100) {
      return { isValid: false, message: 'Name is too long' };
    }

    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(name)) {
      return { isValid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
    }

    return { isValid: true };
  }
}

// Postal code validation
export class PostalCodeValidator {
  static validate(postalCode: string, countryCode: string): ValidationResult {
    if (!postalCode) {
      return { isValid: false, message: 'Postal code is required' };
    }

    const cleanCode = postalCode.replace(/\s/g, '').toUpperCase();

    switch (countryCode) {
      case 'IN': // India - 6 digits
        if (!/^\d{6}$/.test(cleanCode)) {
          return { isValid: false, message: 'Indian postal code must be 6 digits' };
        }
        break;
      case 'US': // United States - 5 digits or 5+4 format
        if (!/^\d{5}(-\d{4})?$/.test(cleanCode)) {
          return { isValid: false, message: 'US postal code must be 5 digits or 5+4 format' };
        }
        break;
      case 'GB': // United Kingdom - Various formats
        if (!/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(cleanCode)) {
          return { isValid: false, message: 'UK postal code format is invalid' };
        }
        break;
      case 'CA': // Canada - A1A 1A1 format
        if (!/^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(cleanCode)) {
          return { isValid: false, message: 'Canadian postal code format is invalid' };
        }
        break;
      default:
        // Generic validation - alphanumeric, 3-10 characters
        if (!/^[A-Z0-9]{3,10}$/i.test(cleanCode)) {
          return { isValid: false, message: 'Postal code format is invalid' };
        }
    }

    return { isValid: true };
  }
}

// Date validation
export class DateValidator {
  static validate(date: Date | undefined): ValidationResult {
    if (!date) {
      return { isValid: false, message: 'Date is required' };
    }

    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      return { isValid: false, message: 'Date cannot be in the future' };
    }

    if (age < 0) {
      return { isValid: false, message: 'Date cannot be in the future' };
    }

    if (age > 150) {
      return { isValid: false, message: 'Please enter a valid date' };
    }

    return { isValid: true };
  }

  static validateAge(date: Date | undefined, minAge: number = 18): ValidationResult {
    const dateValidation = this.validate(date);
    if (!dateValidation.isValid) {
      return dateValidation;
    }

    if (!date) return { isValid: false, message: 'Date is required' };

    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();

    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate()) 
      ? age - 1 
      : age;

    if (actualAge < minAge) {
      return { isValid: false, message: `You must be at least ${minAge} years old` };
    }

    return { isValid: true };
  }
}

// Form validation helper
export class FormValidator {
  static validateField(fieldName: string, value: any, countryCode?: string): ValidationResult {
    switch (fieldName) {
      case 'fullName':
        return NameValidator.validate(value);
      case 'email':
        return EmailValidator.validate(value);
      case 'mobileNumber':
        return PhoneFormatter.validatePhoneNumber(value, countryCode || 'IN');
      case 'postalCode':
        return PostalCodeValidator.validate(value, countryCode || 'IN');
      case 'dateOfBirth':
        return DateValidator.validateAge(value, 18);
      default:
        return { isValid: true };
    }
  }

  static validateStep(stepData: any, stepNumber: number): ValidationResult {
    switch (stepNumber) {
      case 0: // Personal Details
        const nameValidation = NameValidator.validate(stepData.fullName);
        if (!nameValidation.isValid) return nameValidation;

        const emailValidation = EmailValidator.validate(stepData.email);
        if (!emailValidation.isValid) return emailValidation;

        const phoneValidation = PhoneFormatter.validatePhoneNumber(stepData.mobileNumber, stepData.countryCode || 'IN');
        if (!phoneValidation.isValid) return phoneValidation;

        if (!stepData.gender) {
          return { isValid: false, message: 'Gender is required' };
        }

        return { isValid: true };

      case 1: // Address & Travel
        if (!stepData.currentAddress) {
          return { isValid: false, message: 'Current address is required' };
        }
        return { isValid: true };

      case 2: // KYC Documents
        return { isValid: true }; // Optional documents

      case 3: // Safety & Emergency
        if (!stepData.emergencyContactName) {
          return { isValid: false, message: 'Emergency contact name is required' };
        }
        if (!stepData.emergencyContactNumber) {
          return { isValid: false, message: 'Emergency contact number is required' };
        }
        return { isValid: true };

      case 4: // Internal Issuer
        return { isValid: true }; // Internal section

      default:
        return { isValid: true };
    }
  }
}

// components/forms/signup/types.ts
export interface SignupFormData {
// Step 1
fullName: string;
email: string;
password: string;
confirmPassword: string;
phone?: string;


// Step 2
businessName: string;
businessType: string;
country: string;
currency: string;
timezone: string;
website?: string;
businessSize?: string;


// Step 3
plan?: 'free' | 'growth' | 'studio';
}
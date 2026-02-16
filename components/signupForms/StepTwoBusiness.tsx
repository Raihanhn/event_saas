// components/forms/signup/StepTwoBusiness.tsx
import { useState, useEffect } from 'react';
import { SignupFormData } from './types';
import countries from "@/lib/country.json";

interface Props {
  form: SignupFormData;
  update: (key: keyof SignupFormData, value: any) => void;
  validateRef: React.MutableRefObject<() => boolean>;
}

export default function StepTwoBusiness({ form, update, validateRef }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

    const selectedCountry = countries.find((c) => c.name === form.country);

  const currencyOptions = selectedCountry
    ? [selectedCountry.currency]
    : Array.from(new Set(countries.map((c) => c.currency)));

  const timezoneOptions = selectedCountry
    ? selectedCountry.timezones.map((t) => t.name)
    : [];


  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.businessName?.trim()) newErrors.businessName = 'Business name required';
    if (!form.businessType) newErrors.businessType = 'Select business type';
    if (!form.country) newErrors.country = 'Country required';
    if (!form.currency) newErrors.currency = 'Currency required';
    if (!form.timezone) newErrors.timezone = 'Timezone required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  validateRef.current = validate;

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Business / Agency Name"
        value={form.businessName}
        onChange={e => update('businessName', e.target.value)}
        className="w-full p-3 border border-[#E5E7EB] rounded-lg"
      />
      {errors.businessName && <p className="text-[#EF4444] text-sm">{errors.businessName}</p>}

      <select
        value={form.businessType}
        onChange={e => update('businessType', e.target.value)}
        className="w-full p-3 border border-[#E5E7EB] rounded-lg"
      >
        <option value="">Select Business Type</option>
        <option value="Wedding Planner">Wedding Planner</option>
        <option value="Corporate Event Planner">Corporate Event Planner</option>
        <option value="Private Events Planner">Private Events Planner</option>
        <option value="Birthday Event Planner">Birthday Event Planner</option>
        <option value="Product Launches Event Planner">Product Launches Event Planner</option>
        <option value="Conferences & Meetings Planner">Conferences & Meetings Planner</option>
        <option value="Other">Other</option>
      </select>
      {errors.businessType && <p className="text-[#EF4444] text-sm">{errors.businessType}</p>}

      <select
       
        value={form.country}
        onChange={e => update('country', e.target.value)}
        className="w-full p-3 border border-[#E5E7EB] rounded-lg"
      >
         <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.code} value={c.name}>
              {c.name}
            </option>
          ))}
      </select>
      {errors.country && <p className="text-[#EF4444] text-sm">{errors.country}</p>}

      <select
        value={form.currency}
        onChange={e => update('currency', e.target.value)}
        className="w-full p-3 border border-[#E5E7EB] rounded-lg"
      >
           <option value="">Select Currency</option>
          {currencyOptions.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
      </select>
      {errors.currency && <p className="text-[#EF4444] text-sm">{errors.currency}</p>}

      <select
        value={form.timezone}
        onChange={e => update('timezone', e.target.value)}
        className="w-full p-3 border border-[#E5E7EB] rounded-lg"
      >
        <option value="">Select Timezone</option>
          {timezoneOptions.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
      </select>
      {errors.timezone && <p className="text-[#EF4444] text-sm">{errors.timezone}</p>}

      <input
        type="text"
        placeholder="Company Website (Optional)"
        value={form.website || ''}
        onChange={e => update('website', e.target.value)}
        className="w-full p-3 border border-[#E5E7EB] rounded-lg"
      />

      <select
        value={form.businessSize || ''}
        onChange={e => update('businessSize', e.target.value)}
        className="w-full p-3 border border-[#E5E7EB] rounded-lg"
      >
        <option value="">Select Business Size (Optional)</option>
        <option value="Solo">Solo</option>
        <option value="2-5">2-5</option>
        <option value="6-15">6-15</option>
        <option value="15+">15+</option>
      </select>
    </div>
  );
}

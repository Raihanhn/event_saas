// components/forms/signup/StepOneAccount.tsx
import { useState } from 'react';
import { SignupFormData } from './types';
import { Eye, EyeOff } from "lucide-react";

interface Props {
  form: SignupFormData;
  update: (key: keyof SignupFormData, value: any) => void;
  validateRef: React.MutableRefObject<() => boolean>;
}

export default function StepOneAccount({ form, update, validateRef }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';

    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be 6+ chars';

    if (!form.confirmPassword) newErrors.confirmPassword = 'Confirm your password';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  validateRef.current = validate;

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Full Name"
        value={form.fullName}
        onChange={e => update('fullName', e.target.value)}
        className="w-full p-3 border border-[#E5E7EB] rounded-lg outline-none"
      />
      {errors.fullName && <p className="text-[#EF4444] text-sm">{errors.fullName}</p>}

      <input
        type="email"
        placeholder="Email Address"
        value={form.email}
        onChange={e => update('email', e.target.value)}
        className="w-full p-3 border border-[#E5E7EB] rounded-lg outline-none"
      />
      {errors.email && <p className="text-[#EF4444] text-sm">{errors.email}</p>}

      {/* Password Field with Eye Toggle */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          className="w-full p-3 pr-12 border border-[#E5E7EB] rounded-lg outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer "
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {errors.password && <p className="text-[#EF4444] text-sm">{errors.password}</p>}

       {/* Confirm Password Field with Eye Toggle */}
      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={(e) => update("confirmPassword", e.target.value)}
          className="w-full p-3 pr-12 border border-[#E5E7EB] rounded-lg outline-none"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer "
        >
          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {errors.confirmPassword && <p className="text-[#EF4444] text-sm">{errors.confirmPassword}</p>}

      <input
        type="text"
        placeholder="Phone Number (Optional)"
        value={form.phone || ''}
        onChange={e => update('phone', e.target.value)}
        className="w-full p-3 border border-[#E5E7EB] rounded-lg outline-none"
      />
    </div>
  );
}



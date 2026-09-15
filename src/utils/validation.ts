/** Validation helpers shared by all forms. */

export type FieldError = string | null;

export const validators = {
  name(value: string): FieldError {
    const v = value.trim();
    if (!v) return 'Enter full name';
    if (v.length < 3) return 'Name is too short';
    if (!/^[A-Za-z][A-Za-z\s.']*$/.test(v)) return 'Use letters only';
    return null;
  },

  age(value: string): FieldError {
    if (!value) return 'Enter age';
    const n = Number(value);
    if (!Number.isInteger(n) || n < 1 || n > 110) return 'Age 1–110';
    return null;
  },

  phone(value: string): FieldError {
    const v = value.replace(/\D/g, '');
    if (v.length !== 10) return 'Enter a 10-digit mobile number';
    if (!/^[6-9]/.test(v)) return 'Mobile numbers start with 6–9';
    return null;
  },

  email(value: string): FieldError {
    const v = value.trim();
    if (!v) return 'Enter email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Enter a valid email';
    return null;
  },

  otp(value: string): FieldError {
    if (!/^\d{6}$/.test(value)) return 'Enter the 6-digit code';
    return null;
  },

  cardNumber(value: string): FieldError {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 16) return 'Enter the 16-digit card number';
    return null;
  },

  cardExpiry(value: string): FieldError {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) return 'MM/YY';
    const [mm, yy] = value.split('/').map(Number);
    const now = new Date();
    const exp = new Date(2000 + yy, mm, 1);
    if (exp <= now) return 'Card expired';
    return null;
  },

  cardCvv(value: string): FieldError {
    if (!/^\d{3}$/.test(value)) return '3 digits';
    return null;
  },

  upiId(value: string): FieldError {
    const v = value.trim();
    if (!v) return 'Enter UPI ID';
    if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(v)) return 'Format: name@bank';
    return null;
  },
};

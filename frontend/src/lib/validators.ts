import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Geçerli bir e-posta adresi giriniz." }),
  password: z.string().min(6, { message: "Şifre en az 6 karakter olmalıdır." }),
});

export const otpLoginSchema = z.object({
  phone: z.string().min(10, { message: "Geçerli bir telefon numarası giriniz." }),
  otp: z.string().length(6, { message: "OTP 6 haneli olmalıdır." }),
});

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Ad en az 2 karakter olmalıdır." }),
  email: z.string().email({ message: "Geçerli bir e-posta adresi giriniz." }),
  password: z.string().min(6, { message: "Şifre en az 6 karakter olmalıdır." }),
  role: z.enum(["user", "admin"], { required_error: "Lütfen bir rol seçin." }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type OtpLoginFormValues = z.infer<typeof otpLoginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Phone, User, KeyRound, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { useAuthStore } from '@/store/auth.store';
import {
  loginSchema,
  otpLoginSchema,
  registerSchema,
  LoginFormValues,
  OtpLoginFormValues,
  RegisterFormValues,
} from '@/lib/validators';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isMockMode } = useAuthStore();
  const [activeTab, setActiveTab] = useState('login');
  const [loginMethod, setLoginMethod] = useState('email');
  const [isLoading, setIsLoading] = useState(false);

  // Email Login Form
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // OTP Login Form
  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<OtpLoginFormValues>({
    resolver: zodResolver(otpLoginSchema),
  });

  // Register Form
  const {
    register: registerUser,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onLoginSuccess = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (isMockMode) {
        login('mock-jwt-token-12345');
        navigate('/dashboard');
      }
      setIsLoading(false);
    }, 1000);
  };

  const onRegisterSuccess = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // After successful registration, switch to login tab
      setActiveTab('login');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          TelcoGuard Yönetim Paneli
        </h2>
        <p className="mt-2 text-center text-sm aratext-slate-600">
          Lütfen hesabınıza giriş yapın veya yeni kayıt oluşturun.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Giriş Yap</TabsTrigger>
              <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Tabs value={loginMethod} onValueChange={setLoginMethod}>
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100">
                  <TabsTrigger value="email">E-posta</TabsTrigger>
                  <TabsTrigger value="gsm">GSM + OTP</TabsTrigger>
                </TabsList>

                <TabsContent value="email">
                  <form className="space-y-4" onSubmit={handleEmailSubmit(onLoginSuccess)}>
                    <div className="space-y-1">
                      <Label htmlFor="email">E-posta Adresi</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ornek@turkcell.com.tr"
                        icon={<Mail className="w-4 h-4" />}
                        {...registerEmail('email')}
                      />
                      {emailErrors.email && (
                        <p className="text-sm text-red-500">{emailErrors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="password">Şifre</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        icon={<Lock className="w-4 h-4" />}
                        {...registerEmail('password')}
                      />
                      {emailErrors.password && (
                        <p className="text-sm text-red-500">{emailErrors.password.message}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                      {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="gsm">
                  <form className="space-y-4" onSubmit={handleOtpSubmit(onLoginSuccess)}>
                    <div className="space-y-1">
                      <Label htmlFor="phone">Telefon Numarası</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="5XX XXX XX XX"
                        icon={<Phone className="w-4 h-4" />}
                        {...registerOtp('phone')}
                      />
                      {otpErrors.phone && (
                        <p className="text-sm text-red-500">{otpErrors.phone.message}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="otp">Tek Kullanımlık Şifre (OTP)</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="123456"
                        icon={<KeyRound className="w-4 h-4" />}
                        {...registerOtp('otp')}
                      />
                      {otpErrors.otp && (
                        <p className="text-sm text-red-500">{otpErrors.otp.message}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Doğrulanıyor...' : 'Doğrula ve Giriş Yap'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="register">
              <form className="space-y-4" onSubmit={handleRegisterSubmit(onRegisterSuccess)}>
                <div className="space-y-1">
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ad Soyad"
                    icon={<User className="w-4 h-4" />}
                    {...registerUser('name')}
                  />
                  {registerErrors.name && (
                    <p className="text-sm text-red-500">{registerErrors.name.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="reg-email">E-posta Adresi</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="ornek@turkcell.com.tr"
                    icon={<Mail className="w-4 h-4" />}
                    {...registerUser('email')}
                  />
                  {registerErrors.email && (
                    <p className="text-sm text-red-500">{registerErrors.email.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="reg-password">Şifre</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4" />}
                    {...registerUser('password')}
                  />
                  {registerErrors.password && (
                    <p className="text-sm text-red-500">{registerErrors.password.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="role">Kullanıcı Rolü</Label>
                  <select
                    id="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...registerUser('role')}
                  >
                    <option value="user">Standart Kullanıcı</option>
                    <option value="admin">Sistem Yöneticisi</option>
                  </select>
                  {registerErrors.role && (
                    <p className="text-sm text-red-500">{registerErrors.role.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" variant="secondary" disabled={isLoading}>
                  {isLoading ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {isMockMode && (
            <div className="mt-6 border-t border-slate-200 pt-4">
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Mock Modu Aktif</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>Backend hazır olana kadar giriş/kayıt işlemleri simüle edilmektedir. Formu geçerli verilerle doldurup "Giriş Yap" butonuna basarak dashboard'a ilerleyebilirsiniz.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


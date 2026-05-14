import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Phone, User, KeyRound, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { useAuthStore, AuthUser, mapBackendRole } from '@/store/auth.store';
import { authApi } from '@/api/auth.api';
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
  const { login } = useAuthStore();
  const [activeTab, setActiveTab] = useState('login');
  const [loginMethod, setLoginMethod] = useState('email');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [otpStep, setOtpStep] = useState<'phone' | 'code'>('phone');
  const [otpPhone, setOtpPhone] = useState('');
  const [otpHint, setOtpHint] = useState<string | null>(null);

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

  const MOCK_USERS: Record<string, AuthUser> = {
    admin: { id: 'mock-admin', name: 'Ahmet Yılmaz', email: 'admin@turkcell.com.tr', role: 'admin', roleLabel: 'Sistem Yöneticisi' },
    manager: { id: 'mock-manager', name: 'Fatma Kaya', email: 'manager@turkcell.com.tr', role: 'manager', roleLabel: 'Şebeke Yöneticisi' },
    operator: { id: 'mock-operator', name: 'Mehmet Çelik', email: 'operator@turkcell.com.tr', role: 'operator', roleLabel: 'NOC Operatörü' },
    field_engineer: { id: 'mock-field', name: 'Ali Demir', email: 'saha@turkcell.com.tr', role: 'field_engineer', roleLabel: 'Saha Mühendisi' },
  };

  const onEmailLogin = async (values: LoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const res = await authApi.login(values.email, values.password);
      const { role, roleLabel } = mapBackendRole(res.user.role);
      const authUser: AuthUser = {
        id: res.user.id,
        name: res.user.email.split('@')[0],
        email: res.user.email,
        role,
        roleLabel,
      };
      login(res.token, authUser);
      navigate(role === 'field_engineer' ? '/my-tasks' : '/dashboard');
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Giriş başarısız');
    } finally {
      setIsLoading(false);
    }
  };

  const onRequestOtp = async (values: OtpLoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const res = await authApi.requestOtp(values.phone);
      setOtpPhone(values.phone);
      setOtpStep('code');
      if (res.otp) setOtpHint(res.otp);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'OTP gönderilemedi');
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async (values: OtpLoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const res = await authApi.verifyOtp(otpPhone, values.otp);
      const { role, roleLabel } = mapBackendRole(res.user.role);
      const authUser: AuthUser = { id: res.user.id, name: res.user.email.split('@')[0], email: res.user.email, role, roleLabel };
      login(res.token, authUser);
      navigate(role === 'field_engineer' ? '/my-tasks' : '/dashboard');
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Doğrulama başarısız');
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpLogin = otpStep === 'phone' ? onRequestOtp : onVerifyOtp;

  const quickLogin = (roleKey: keyof typeof MOCK_USERS) => {
    const user = MOCK_USERS[roleKey];
    login(`mock-jwt-${roleKey}`, user);
    navigate(user.role === 'field_engineer' ? '/my-tasks' : '/dashboard');
  };

  const onRegisterSuccess = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const backendRole = values.role === 'admin' ? 'ADMIN' : 'NOC';
      await authApi.register(values.email, values.password, backendRole);
      setActiveTab('login');
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setIsLoading(false);
    }
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
                  <form className="space-y-4" onSubmit={handleEmailSubmit(onEmailLogin)}>
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
                    {loginError && (
                      <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{loginError}</p>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                      {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="gsm">
                  <form className="space-y-4" onSubmit={handleOtpSubmit(onOtpLogin)}>
                    <div className="space-y-1">
                      <Label htmlFor="phone">Telefon Numarası</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="5XX XXX XX XX"
                        icon={<Phone className="w-4 h-4" />}
                        disabled={otpStep === 'code'}
                        {...registerOtp('phone')}
                      />
                      {otpErrors.phone && (
                        <p className="text-sm text-red-500">{otpErrors.phone.message}</p>
                      )}
                    </div>

                    {otpStep === 'code' && (
                      <>
                        {otpHint && (
                          <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-md px-3 py-2">
                            Demo OTP kodu: <span className="font-mono font-bold">{otpHint}</span>
                          </p>
                        )}
                        <div className="space-y-1">
                          <Label htmlFor="otp">Tek Kullanımlık Şifre (OTP)</Label>
                          <Input
                            id="otp"
                            type="text"
                            placeholder="6 haneli kod"
                            icon={<KeyRound className="w-4 h-4" />}
                            {...registerOtp('otp')}
                          />
                          {otpErrors.otp && (
                            <p className="text-sm text-red-500">{otpErrors.otp.message}</p>
                          )}
                        </div>
                      </>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading
                        ? (otpStep === 'phone' ? 'Gönderiliyor...' : 'Doğrulanıyor...')
                        : (otpStep === 'phone' ? 'OTP Gönder' : 'Doğrula ve Giriş Yap')}
                    </Button>

                    {otpStep === 'code' && (
                      <button
                        type="button"
                        onClick={() => { setOtpStep('phone'); setOtpHint(null); setLoginError(null); }}
                        className="w-full text-xs text-slate-500 hover:text-slate-700 underline"
                      >
                        Farklı numara kullan
                      </button>
                    )}
                  </form>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="register">
              <form className="space-y-4" onSubmit={handleRegisterSubmit(onRegisterSuccess)}>
                {loginError && activeTab === 'register' && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{loginError}</p>
                )}
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

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowDemo((v) => !v)}
              className="text-xs text-slate-400 hover:text-slate-600 underline transition-colors"
            >
              {showDemo ? 'Demo panelini gizle' : 'Demo hesaplarıyla hızlı giriş'}
            </button>
          </div>

          {showDemo && (
            <div className="mt-3 border-t border-slate-200 pt-4 space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Demo — Mock Hızlı Giriş</p>
              <button
                type="button"
                onClick={() => quickLogin('admin')}
                className="w-full flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left hover:bg-red-100 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-red-800">Sistem Yöneticisi</p>
                  <p className="text-xs text-red-600 mt-0.5">Tüm sayfalar + Simülatör + Kullanıcı Yönetimi</p>
                </div>
                <ArrowRight className="h-4 w-4 text-red-500 shrink-0" />
              </button>
              <button
                type="button"
                onClick={() => quickLogin('manager')}
                className="w-full flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-left hover:bg-blue-100 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-blue-800">Şebeke Yöneticisi</p>
                  <p className="text-xs text-blue-600 mt-0.5">Dashboard, Alarmlar, İstasyonlar, Bölge Özeti</p>
                </div>
                <ArrowRight className="h-4 w-4 text-blue-500 shrink-0" />
              </button>
              <button
                type="button"
                onClick={() => quickLogin('operator')}
                className="w-full flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-left hover:bg-emerald-100 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-emerald-800">NOC Operatörü</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Dashboard, Alarmlar, İstasyonlar</p>
                </div>
                <ArrowRight className="h-4 w-4 text-emerald-500 shrink-0" />
              </button>
              <button
                type="button"
                onClick={() => quickLogin('field_engineer')}
                className="w-full flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-left hover:bg-orange-100 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-orange-800">Saha Mühendisi</p>
                  <p className="text-xs text-orange-600 mt-0.5">Görevlerim, Alarmlar, İstasyon Detayı</p>
                </div>
                <ArrowRight className="h-4 w-4 text-orange-500 shrink-0" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


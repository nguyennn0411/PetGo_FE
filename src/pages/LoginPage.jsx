import {
  ArrowRight,
  Eye,
  EyeOff,
  Facebook,
  Github,
  Lock,
  Mail,
  PawPrint,
  ShieldCheck,
} from 'lucide-react';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginRequest } from '../api/auth';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginRequest({ userName: email, password });
      login(response);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans selection:bg-orange-100 selection:text-orange-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100/50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-white/20">
        <div className="hidden lg:flex flex-col justify-between p-12 bg-orange-500 relative overflow-hidden text-white">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="bg-white p-2 rounded-xl shadow-lg">
                <PawPrint className="w-8 h-8 text-orange-600" />
              </div>
              <span className="text-3xl font-black tracking-tight">PetGo</span>
            </div>

            <h1 className="text-5xl font-black leading-[1.1] mb-6">
              Welcome back to <br />
              <span className="text-orange-100">PetCare Paradise.</span>
            </h1>
            <p className="text-orange-50 text-xl font-medium max-w-md opacity-90 leading-relaxed">
              Managing your pet&apos;s happiness is just a few clicks away. Log in to access your dashboard and bookings.
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold">Secure Authentication</p>
              <p className="text-xs font-medium opacity-70 italic whitespace-nowrap">Your data is protected with 128-bit encryption</p>
            </div>
          </div>

          <div className="absolute bottom-[-10%] right-[-5%] opacity-10">
            <PawPrint className="w-64 h-64 rotate-12" />
          </div>
        </div>

        <div className="flex flex-col p-8 sm:p-12 lg:p-16">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="bg-orange-500 p-1.5 rounded-lg">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900">PetGo</span>
          </div>

          <div className="mb-10">
            <h2 onClick={() => navigate('/')} className="text-4xl font-black text-gray-900 mb-2 tracking-tight cursor-pointer hover:text-orange-600 transition-colors">
              Sign In
            </h2>
            <p className="text-gray-500 font-medium">Please enter your details to login.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-900 ml-1 uppercase tracking-widest">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-orange-500/30 focus:bg-white focus:ring-4 focus:ring-orange-500/5 transition-all font-medium text-gray-900"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end mr-1">
                <label className="text-sm font-black text-gray-900 ml-1 uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-orange-500/30 focus:bg-white focus:ring-4 focus:ring-orange-500/5 transition-all font-medium text-gray-900"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-black tracking-wide hover:bg-orange-500 transition-all disabled:opacity-60"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Sign In'}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-300">Or</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="py-3.5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 font-bold text-gray-700">
              <Facebook className="w-5 h-5" /> Facebook
            </button>
            <button className="py-3.5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 font-bold text-gray-700">
              <Github className="w-5 h-5" /> Github
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 font-medium mt-8">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-black text-orange-600 hover:text-orange-700 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

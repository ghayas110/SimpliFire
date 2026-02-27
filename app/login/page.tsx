"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Check Role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profile?.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/');
    }
  };

  const handleSignup = async (role: 'customer' | 'admin' = 'customer') => {
    setLoading(true);
    setError(null);
    
    // In demo, we just auto signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined
      }
    });
    
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Create user profile
      await supabase.from('profiles').upsert({
        id: data.user.id,
        role: role,
        full_name: email.split('@')[0],
      });
      // Just auto sign in
      await supabase.auth.signInWithPassword({ email, password });
      if (role === 'admin') router.push('/admin/dashboard');
      else router.push('/');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-neutral-50 font-sans">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-12 lg:p-24 justify-center relative bg-white">
        
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-medium">
          <ArrowLeft size={16} />
          Go to Home
        </Link>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-light tracking-tight text-neutral-900 mb-3">Welcome Back</h1>
            <p className="text-neutral-500 text-sm">Please enter your details to sign in to your account.</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
              <AlertCircle size={18} className="text-red-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Email address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-neutral-400 focus:bg-white transition-colors text-neutral-900 placeholder:text-neutral-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-4 pr-12 py-3 outline-none focus:border-neutral-400 focus:bg-white transition-colors text-neutral-900 placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-neutral-900 text-white font-medium rounded-xl hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-neutral-100 text-center text-sm text-neutral-500 space-y-4">
            <p>Don't have an account?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => handleSignup('customer')} 
                type="button" 
                className="px-6 py-2 border border-neutral-200 rounded-full hover:bg-neutral-50 text-neutral-700 font-medium transition-colors"
              >
                Sign Up as Customer
              </button>
              <button 
                onClick={() => handleSignup('admin')} 
                type="button" 
                className="px-6 py-2 border border-neutral-200 rounded-full hover:bg-neutral-50 text-neutral-700 font-medium transition-colors"
              >
                Sign Up as Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-neutral-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900/10 to-transparent z-10" />
        <img 
          src="/assets/images/Allusion Platinum.jpg" 
          alt="SimpliFire Electric Fireplace" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-12 left-12 right-12 z-20 text-white">
          <div className="backdrop-blur-md bg-black/20 p-8 rounded-2xl border border-white/10">
            <h2 className="text-3xl font-light mb-2">SimpliFire</h2>
            <p className="text-white/80 font-light">Experience the future of comfort and design. Log in to manage your spaces.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Heart, Users, Activity, MapPin, Phone, Mail, Facebook, Twitter, Instagram, ArrowRight, Zap, Shield, Star } from 'lucide-react';

export default function LandingPage() {
  const stats = [
    { value: '50,000+', label: 'Active Donors', emoji: '🩸' },
    { value: '12,000+', label: 'Lives Saved', emoji: '❤️' },
    { value: '500+', label: 'Partner Hospitals', emoji: '🏥' },
    { value: '24/7', label: 'Support Available', emoji: '⚡' },
  ];

  const steps = [
    {
      icon: '🩸',
      title: 'Register as Donor',
      description: 'Sign up in seconds with your basic information and blood group',
      color: 'from-rose-500 to-pink-600',
      bg: 'rose',
    },
    {
      icon: '🔔',
      title: 'Get Matched',
      description: 'Receive notifications when your blood type is needed nearby',
      color: 'from-violet-500 to-purple-600',
      bg: 'violet',
    },
    {
      icon: '✨',
      title: 'Save Lives',
      description: "Donate blood and make a real difference in someone's life",
      color: 'from-orange-500 to-amber-600',
      bg: 'orange',
    },
  ];

  const features = [
    { icon: Zap, title: 'Instant Matching', desc: 'AI-powered donor matching in real-time', color: 'text-yellow-500 bg-yellow-50' },
    { icon: Shield, title: 'Verified Network', desc: 'All hospitals and donors are verified', color: 'text-blue-500 bg-blue-50' },
    { icon: Star, title: 'Reward System', desc: 'Earn badges and recognition for donations', color: 'text-purple-500 bg-purple-50' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center" style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #f8f7ff 50%, #fff0fb 100%)' }}>
        {/* Background blobs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-rose-200 rounded-full blur-3xl opacity-30 float-anim" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-violet-200 rounded-full blur-3xl opacity-30 float-anim" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-20" />

        <div className="max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-semibold shadow-lg border border-rose-100">
                <span className="w-2 h-2 bg-rose-500 rounded-full pulse-red" />
                <span className="text-rose-600">Every 2 seconds, someone needs blood</span>
              </div>

              <div>
                <h1 className="text-6xl lg:text-7xl font-extrabold text-gray-900 leading-none mb-4">
                  Donate Blood,
                  <br />
                  <span style={{ background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Save Lives.
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Join thousands of heroes making a difference. Connect donors with those in urgent need through our trusted platform.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="group flex items-center gap-2 px-8 py-4 text-white rounded-2xl font-bold text-lg transition-all shadow-xl hover:scale-105 hover:shadow-2xl"
                  style={{ background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)', boxShadow: '0 10px 30px rgba(255, 59, 92, 0.4)' }}
                >
                  Become a Donor
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register?type=requester"
                  className="flex items-center gap-2 px-8 py-4 bg-white text-gray-800 border-2 border-gray-200 rounded-2xl font-bold text-lg hover:border-rose-400 hover:text-rose-600 transition-all hover:shadow-lg hover:scale-105"
                >
                  Request Blood
                </Link>
              </div>

              {/* Features row */}
              <div className="flex flex-wrap gap-4">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${f.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{f.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative z-10">
                <div className="rounded-3xl overflow-hidden shadow-2xl card-lift">
                  <img
                    src="https://images.unsplash.com/photo-1697192156499-d85cfe1452c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9vZCUyMGRvbmF0aW9uJTIwbWVkaWNhbHxlbnwxfHx8fDE3NjkxNjU0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Blood Donation"
                    className="w-full h-[520px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Floating cards */}
                <div className="absolute -bottom-6 -left-8 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #ff3b5c20, #ff6b3510)' }}>🩸</div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">12,000+</p>
                    <p className="text-xs text-gray-500">Lives Saved This Year</p>
                  </div>
                </div>

                <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">✅</div>
                  <div>
                    <p className="font-bold text-green-600">Active Now</p>
                    <p className="text-xs text-gray-500">500+ Donors Online</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ff3b5c 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl card-lift bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-sm">
                <div className="text-4xl mb-3">{stat.emoji}</div>
                <div className="text-4xl font-extrabold mb-1" style={{ background: 'linear-gradient(135deg, #ff3b5c, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24" style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #fff5f5 100%)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-rose-100 text-rose-600 rounded-full text-sm font-bold mb-4">Simple Process</span>
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to start saving lives</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative card-lift">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 text-3xl shadow-lg`}>
                    {step.icon}
                  </div>
                  <div className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-400">
                    {index + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 z-10 text-gray-300 text-3xl">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 animated-bg opacity-90" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="text-7xl mb-6 float-anim">❤️</div>
          <h2 className="text-5xl font-extrabold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Your single donation can save up to three lives. Join our community today and become a hero.
          </p>
          <Link
            to="/register"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-white rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl"
            style={{ color: '#ff3b5c' }}
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}

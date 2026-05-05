import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Heart, ShieldCheck, Users, ArrowRight, Stethoscope, Building2 } from 'lucide-react';

export default function AboutPage() {
  const values = [
    { icon: Heart, title: 'Save Lives Faster', text: 'Connect donors, hospitals, and requesters in one streamlined system.' },
    { icon: ShieldCheck, title: 'Trusted Access', text: 'Role-based authentication keeps every workflow secure and focused.' },
    { icon: Users, title: 'Community Network', text: 'Make blood donation easier to organize across cities and hospitals.' },
  ];

  const pillars = [
    { icon: Stethoscope, title: 'Donor Support' },
    { icon: Building2, title: 'Hospital Operations' },
    { icon: Droplet, title: 'Emergency Response' },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #f8f7ff 45%, #fff0fb 100%)' }}>
      <div className="max-w-6xl mx-auto space-y-12">
        <section className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 lg:p-12 overflow-hidden relative">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-rose-100 blur-3xl opacity-50" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-sm font-bold mb-5">
                <Droplet className="w-4 h-4" /> About LifeFlow
              </span>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
                Building a faster way to <span style={{ color: '#ff3b5c' }}>save lives</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                LifeFlow is a blood donation management platform designed to connect people who need blood with the people and institutions that can help. It brings donors, hospitals, requesters, and administrators into one coordinated workflow.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white shadow-xl hover:scale-105 transition-transform" style={{ background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)' }}>
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div key={pillar.title} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)' }}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">{pillar.title}</h2>
                      <p className="text-sm text-gray-500">Designed for real-world donation and request coordination.</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          {values.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4" style={{ background: 'linear-gradient(135deg, #ff3b5c, #ff6b35)' }}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
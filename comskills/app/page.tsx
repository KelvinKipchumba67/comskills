"use client";

import Link from 'next/link';
import React from 'react';
import AboutSections from '@/components/AboutSections';
import { Mic, MessageSquare, Play, BarChart2, CheckCircle2, Activity, Globe } from 'lucide-react';

export default function ComskillLandingPage() {
  return (
      <>
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#FAF8F5] font-sans -mt-[15vh]">
        <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700;800;900&display=swap');
        .font-sora { font-family: 'Sora', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        
        .wave-bar {
          animation: wave 1.5s ease-in-out infinite alternate;
        }
        @keyframes wave {
          0% { height: 8px; }
          100% { height: 24px; }
        }
      `}} />

          <div className="absolute top-[20%] md:top-[25%] left-0 w-full flex justify-center items-center pointer-events-none select-none z-0 px-4">
            <h1
                className="font-sora font-black text-[#14213D] text-[18vw] leading-none tracking-tighter w-full text-center"
                style={{
                  letterSpacing: '-0.05em',
                  transform: 'scaleY(1.05)',
                }}
            >
              COMSKILL
            </h1>
          </div>

          <div className="flex-grow flex flex-col lg:flex-row items-end justify-between px-6 pb-12 md:px-12 md:pb-16 lg:px-16 lg:pb-24 z-10 relative">

            <div className="w-full lg:w-1/2 max-w-[420px] mb-12 lg:mb-0">
              <h2 className="font-sora text-3xl md:text-[40px] font-bold text-[#14213D] leading-[1.1] mb-5">
                Comskill is your personal AI speech coach.
              </h2>
              <p className="font-inter text-[#4A5568] text-[15px] leading-relaxed mb-10">
                We acquire proven speaking techniques and transform them into one integrated, AI-operated feedback network built for fluency.
              </p>

              <div className="flex items-center space-x-6">
                <Link
                    href="/about"
                    className="font-sora text-[11px] font-bold tracking-[0.15em] bg-[#14213D] hover:bg-[#1d2f57] text-white px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  ABOUT COMSKILLS
                </Link>
                <button className="font-sora text-[11px] font-bold tracking-[0.15em] text-[#14213D] hover:text-[#1F7A8C] transition-colors flex items-center group">
                  SEE HOW IT WORKS
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end items-end relative h-[300px] md:h-[400px]">

              {/* Base platform */}
              <div className="absolute bottom-4 right-4 md:right-12 w-[280px] h-[140px] bg-[#EFEAE2] rounded-3xl transform skew-x-[-20deg] rotate-[-5deg] shadow-xl border border-white opacity-80 z-0"></div>

              {/* Main floating card */}
              <div className="absolute bottom-16 right-8 md:right-36 w-[320px] bg-white rounded-3xl shadow-2xl p-6 border border-[#14213D]/5 transform transition-transform duration-700 hover:-translate-y-4 z-20">

                <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-[#14213D] flex items-center justify-center shadow-lg">
                    <Mic className="text-white h-6 w-6" />
                  </div>
                  <div className="bg-[#2FA66A]/10 px-3 py-1.5 rounded-full flex items-center">
                    <Activity className="w-3.5 h-3.5 text-[#2FA66A] mr-1.5" />
                    <span className="text-[#2FA66A] font-inter font-bold text-[10px] uppercase tracking-wider">
                    Analyzing
                  </span>
                  </div>
                </div>

                <h3 className="font-sora text-lg font-bold text-[#14213D] mb-1">
                  Pitch & Cadence
                </h3>
                <p className="font-inter text-[#4A5568] text-xs mb-6">
                  Real-time delivery optimization
                </p>

                {/* Animated Waveform */}
                <div className="flex items-end space-x-1 h-8 mb-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
                      <div
                          key={i}
                          className="w-1.5 bg-[#1F7A8C] rounded-full wave-bar"
                          style={{
                            animationDelay: `${i * 0.1}s`,
                            height: `${Math.max(8, Math.random() * 24)}px`,
                            opacity: 0.6 + (Math.random() * 0.4)
                          }}
                      ></div>
                  ))}
                </div>

                {/* Confidence Score Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-sora text-[10px] font-bold text-[#14213D] uppercase tracking-wider">Confidence</span>
                    <span className="font-inter font-bold text-[#2FA66A] text-sm">94%</span>
                  </div>
                  <div className="w-full h-2 bg-[#EFEAE2] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2FA66A] rounded-full w-[94%] shadow-[0_0_10px_rgba(47,166,106,0.5)]"></div>
                  </div>
                </div>
              </div>

              {/* Secondary overlapping card (Accent) */}
              <div className="absolute bottom-[220px] right-0 z-30 hidden md:block w-[160px] bg-[#14213D] rounded-2xl shadow-xl p-4 border border-white/10 transform rotate-[8deg] transition-transform duration-700 hover:rotate-[0deg] hover:-translate-y-2">
                <div className="flex items-center space-x-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2FA66A]" />
                  <span className="font-sora text-xs font-bold text-white">Pacing Ideal</span>
                </div>
                <div className="text-[10px] text-[#8A94A6] font-inter">
                  Words per minute balanced.
                </div>
              </div>

            </div>

          </div>
        </div>
        <AboutSections />
      </>
  );
}
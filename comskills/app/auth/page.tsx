"use client";

import React, { useState } from 'react';
import {
    Eye,
    EyeOff,
    Mic,
    MessageSquare,
    Play,
    BarChart2
} from 'lucide-react';

export default function AuthPage() {
    const [isSignIn, setIsSignIn] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex flex-col lg:flex-row w-full font-sans">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700&display=swap');
        .font-sora { font-family: 'Sora', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>

            <div className="w-full lg:w-[45%] flex flex-col relative px-8 pt-6 pb-12 lg:px-16 xl:px-24 bg-[#FAF8F5]">

                {/* Form Container */}
                <div className="max-w-[400px] w-full mx-auto flex flex-col justify-start">

                    <h1 className="text-4xl lg:text-[44px] font-sora font-bold text-[#14213D] mb-3">
                        {isSignIn ? 'Sign in' : 'Sign up'}
                    </h1>

                    <p className="text-[#4A5568] font-inter text-[15px] mb-8">
                        {isSignIn ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsSignIn(!isSignIn)}
                            className="text-[#1F7A8C] font-semibold underline underline-offset-4 decoration-2 hover:opacity-80 transition-opacity"
                        >
                            {isSignIn ? 'Create now' : 'Sign in'}
                        </button>
                    </p>

                    <form className="space-y-5 font-inter" onSubmit={(e) => e.preventDefault()}>
                        {!isSignIn && (
                            <div className="space-y-2">
                                <label className="block text-[13px] font-medium text-[#14213D]">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Kelvin Kipchumba"
                                    className="w-full px-4 py-3 rounded-lg border border-[#8A94A6]/40 bg-white text-[#14213D] placeholder-[#8A94A6] focus:outline-none focus:ring-2 focus:ring-[#1F7A8C]/30 focus:border-[#1F7A8C] transition-all"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-[13px] font-medium text-[#14213D]">E-mail</label>
                            <input
                                type="email"
                                placeholder="kelvin@gmail.com"
                                className="w-full px-4 py-3 rounded-lg border border-[#8A94A6]/40 bg-white text-[#14213D] placeholder-[#8A94A6] focus:outline-none focus:ring-2 focus:ring-[#1F7A8C]/30 focus:border-[#1F7A8C] transition-all"
                            />
                        </div>

                        <div className="space-y-2 relative">
                            <label className="block text-[13px] font-medium text-[#14213D]">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-lg border border-[#8A94A6]/40 bg-white text-[#14213D] placeholder-[#8A94A6] focus:outline-none focus:ring-2 focus:ring-[#1F7A8C]/30 focus:border-[#1F7A8C] transition-all tracking-widest"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A94A6] hover:text-[#1F7A8C] transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {isSignIn && (
                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-[#8A94A6] text-[#1F7A8C] focus:ring-[#1F7A8C] transition-colors cursor-pointer"
                                    />
                                    <span className="text-sm text-[#4A5568] group-hover:text-[#14213D] transition-colors">Remember me</span>
                                </label>
                                <a href="#" className="text-sm font-semibold text-[#1F7A8C] hover:underline underline-offset-2">
                                    Forgot Password?
                                </a>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3.5 mt-4 bg-[#FF7A59] hover:bg-[#e66a4a] text-white font-bold rounded-lg shadow-sm transition-all active:scale-[0.98] font-inter text-[15px]"
                        >
                            {isSignIn ? 'Sign in' : 'Create account'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-8">
                        <div className="flex-grow h-[1px] bg-[#8A94A6]/30"></div>
                        <span className="px-4 text-[11px] font-bold text-[#8A94A6] uppercase tracking-widest">OR</span>
                        <div className="flex-grow h-[1px] bg-[#8A94A6]/30"></div>
                    </div>

                    <div className="space-y-3 font-inter">
                        <button className="w-full flex items-center justify-center space-x-3 py-3 border border-[#8A94A6]/40 rounded-lg text-[#14213D] font-medium hover:bg-black/5 transition-colors bg-white">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span className="text-[15px]">Continue with Google</span>
                        </button>
                        <button className="w-full flex items-center justify-center space-x-3 py-3 border border-[#8A94A6]/40 rounded-lg text-[#14213D] font-medium hover:bg-black/5 transition-colors bg-white">
                            <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            <span className="text-[15px]">Continue with Facebook</span>
                        </button>
                    </div>

                </div>
            </div>

            <div className="w-full lg:w-[55%] bg-[#14213D] relative overflow-hidden flex flex-col justify-center items-center py-16 px-6 lg:px-12 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#1d2f57]/50 to-[#14213D]">

                {/* Main Card */}
                <div className="relative z-10 w-full max-w-[480px] mt-4 lg:mt-0">
                    <div className="bg-[#EFEAE2] rounded-[32px] p-8 lg:p-10 shadow-2xl">

                        {/* Inside Card Top */}
                        <div className="flex justify-between items-start mb-8">
                            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                <Mic className="text-[#FF7A59] h-6 w-6" />
                            </div>
                            <div className="bg-[#2FA66A]/10 px-3 py-1.5 rounded-full flex items-center mt-1">
                                <BarChart2 className="w-3.5 h-3.5 text-[#2FA66A] mr-1.5" />
                                <span className="text-[#2FA66A] font-inter font-semibold text-[11px] uppercase tracking-wide">
                  Live Feedback
                </span>
                            </div>
                        </div>

                        {/* Inside Card Text */}
                        <h3 className="font-sora text-[28px] font-bold text-[#14213D] leading-[1.2] mb-4">
                            Master your pitches &<br/>presentations
                        </h3>
                        <p className="font-inter text-[#4A5568] text-[15px] leading-relaxed mb-8">
                            Practice makes perfect. Record your speeches, get real-time feedback, and improve your delivery with AI-driven insights.
                        </p>

                        {/* Dashboard Element */}
                        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-black/5 font-inter">
                            <div className="flex justify-between items-end mb-3">
                                <span className="text-[11px] font-bold text-[#14213D] uppercase tracking-widest">Confidence Score</span>
                                <span className="text-[#2FA66A] font-bold text-xl leading-none">94%</span>
                            </div>

                            <div className="w-full h-3 bg-[#EFEAE2] rounded-full overflow-hidden mb-5">
                                <div
                                    className="h-full bg-[#2FA66A] rounded-full"
                                    style={{ width: '94%' }}
                                ></div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center text-[13px] text-[#4A5568] font-medium">
                                    <Play className="w-4 h-4 mr-2 text-[#1F7A8C] fill-current" />
                                    Latest Recording
                                </div>
                                <span className="text-[13px] font-semibold text-[#1F7A8C] cursor-pointer hover:underline">
                  Review
                </span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="mt-16 text-center max-w-[480px] relative z-10 px-4">
                    <h2 className="font-sora text-white text-3xl font-bold mb-4">
                        Elevate your communication
                    </h2>
                    <p className="font-inter text-[#8A94A6] text-[15px] leading-relaxed">
                        Analyzing speech patterns ensures that professionals always deliver the right message. As the scale of communication magnifies, your skills should too.
                    </p>
                </div>

                {/* Carousel Indicators */}
                <div className="flex items-center justify-center gap-2 mt-10 relative z-10">
                    <div className="w-2 h-2 rounded-full bg-[#8A94A6]"></div>
                    <div className="w-6 h-2 rounded-full bg-[#FF7A59]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#8A94A6]"></div>
                </div>

            </div>
        </div>
    );
}
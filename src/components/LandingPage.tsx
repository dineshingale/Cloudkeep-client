import React from 'react';
import { MessageSquare, CheckCircle, Shield, Zap, ArrowRight } from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {

    return (
        <div className="min-h-screen bg-white flex flex-col">

            {/* --- Navbar (Simple Version) --- */}
            <header className="w-full py-6 px-6 md:px-12 flex justify-between items-center">
                <div className="flex items-center gap-2 text-blue-600">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                        <polyline points="2 17 12 22 22 17" />
                        <polyline points="2 12 12 17 22 12" />
                    </svg>
                    <span className="text-xl font-bold tracking-tight text-slate-900">Cloudkeep</span>
                </div>
                <button className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                    About
                </button>
            </header>

            {/* --- Hero Section --- */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 md:px-6 pb-20">

                <div className="animate-in slide-in-from-bottom-4 duration-700 fade-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100">
                        <Zap className="h-3 w-3" /> v2.0 is live
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 max-w-3xl">
                        Capture your thoughts, <br className="hidden md:block" />
                        <span className="text-blue-600">unclutter your mind.</span>
                    </h1>

                    <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed">
                        The minimalist workspace for developers and thinkers.
                        Store notes, images, and ideas in a distraction-free timeline.
                    </p>

                    {/* --- Google Login Button --- */}
                    <button
                        onClick={onLogin}
                        className="group relative inline-flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:-translate-y-1"
                    >
                        {/* Google Icon SVG */}
                        <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span>Continue with Google</span>
                        <ArrowRight className="h-4 w-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    </button>

                    <p className="mt-4 text-xs text-slate-400">
                        Secure access • Free for individuals
                    </p>
                </div>

                {/* --- Features Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl w-full text-left">
                    {[
                        { icon: MessageSquare, title: "Threaded Thoughts", desc: "Organize ideas in a seamless timeline." },
                        { icon: CheckCircle, title: "Zero Clutter", desc: "Focus purely on your content." },
                        { icon: Shield, title: "Private & Secure", desc: "Your data belongs only to you." },
                    ].map((item, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 mb-4 shadow-sm">
                                <item.icon className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
}

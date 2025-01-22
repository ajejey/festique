'use client'
import { useState } from 'react';

export default function Landing() {
    const [email, setEmail] = useState('');
    const [painPoint, setPainPoint] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br pt-20 from-gray-900 to-indigo-900">
            <div className="max-w-6xl mx-auto px-4 py-16">
                {/* Hero Section */}
                <div
                    className="text-center mb-16"
                >
                    {/* Animated background elements */}
                    <div className="absolute inset-0">
                        <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-900/30 rounded-full blur-3xl"></div>
                        <div className="absolute top-40 -right-40 w-96 h-96 bg-indigo-700/20 rounded-full blur-3xl"></div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 relative z-10">
                        <span className="bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
                            $372/Year Wasted
                        </span>
                        <br className="hidden md:block" />
                        <span className="text-white mt-2 inline-block">On Blogging Basics?</span>
                    </h1>

                    <div className="relative z-10">
                        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                            <span className="inline-flex flex-col items-center space-y-2">
                                <span className="text-2xl text-indigo-200 font-medium mb-3">
                                    Why pay for:
                                </span>
                                <span className="flex flex-wrap justify-center gap-x-6 gap-y-3">
                                    {[
                                        { text: 'Hosting ($143/yr)', id: 1 },
                                        { text: 'Expensive Themes ($89)', id: 2 },
                                        { text: 'SEO Tools ($240)', id: 3 },
                                        { text: 'Security Plugins ($65)', id: 4 },
                                        { text: 'AI Writers ($235)', id: 5 },
                                        { text: 'Setup Time (10hrs)', id: 6 },
                                    ].map((item) => (
                                        <span
                                            key={item.id}
                                            className=" text-gray-400/90 px-3 py-1 rounded-lg bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10"
                                        >
                                            ❌ {item.text}
                                        </span>
                                    ))}
                                </span>
                                {/* <span className="pt-8 text-2xl text-indigo-300 font-semibold">
                                    When <span className="text-indigo-400">92% of bloggers</span> just want to write?
                                </span> */}
                            </span>
                        </p>
                    </div>

                    <span className="pt-8 text-2xl text-indigo-300 font-semibold">
                        When <span className="text-indigo-400">92% of bloggers</span> just want to write?
                    </span>

                    {/* New Solution Statement */}
                    <div className="my-8 space-y-4">
                        <p className="text-xl text-white font-medium">
                            We built the <span className="bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent">all-in-one platform</span> that gives you:
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-gray-300">
                            <span className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Hosting - free forever</span>
                            <span className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Premium themes under $20 - one-time fee - for multiple blogs</span>
                            <span className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>AI tools that help you write better - Free API</span>
                        </div>
                    </div>

                    {/* Updated Email CTA Header */}
                    <h3 className="text-2xl text-white mb-6 mt-10">
                        Be the first to claim your free blog<br />
                        <span className="text-indigo-300 text-lg">(Limited early access spots remaining)</span>
                    </h3>

                    {/* Social Proof */}
                    {/* <div className="flex justify-center items-center gap-2 mb-12">
                        <div className="flex -space-x-2">
                            {[...Array(5)].map((_, i) => (
                                <img
                                    key={i}
                                    src={`https://i.pravatar.cc/40?img=${i}`}
                                    className="w-10 h-10 rounded-full border-2 border-white"
                                    alt="User"
                                />
                            ))}
                        </div>
                        <p className="text-gray-300">
                            Trusted by 1,200+ creators worldwide
                        </p>
                    </div> */}

                    {/* Email Capture Form */}
                    {!submitted ? (
                        <form
                            onSubmit={handleSubmit}
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <input
                                    type="email"
                                    required
                                    placeholder="Your best email for early access"
                                    className="flex-1 px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition-colors duration-200"
                                >
                                    Claim Free Access
                                </button>
                            </div>

                            {/* Pain Points Survey */}
                            <div className="bg-white bg-opacity-10 p-6 rounded-xl">
                                <p className="text-gray-300 mb-3">
                                    What`&apos;s your biggest blogging struggle? (optional)
                                </p>
                                <select
                                    value={painPoint}
                                    onChange={(e) => setPainPoint(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border border-gray-300 text-white"
                                >
                                    <option value="">Select your challenge...</option>
                                    <option value="cost">Hosting costs</option>
                                    <option value="technical">Technical setup</option>
                                    <option value="seo">SEO optimization</option>
                                    <option value="content">Creating content</option>
                                    <option value="design">Professional look</option>
                                </select>
                            </div>

                            <p className="text-gray-400 text-sm mt-4">
                                Zero spam. Unsubscribe anytime. We protect your data.
                            </p>
                        </form>
                    ) : (
                        /* Thank You Message */
                        <div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white bg-opacity-10 p-8 rounded-xl text-center"
                        >
                            <h2 className="text-2xl font-bold text-white mb-4">
                                🎉 Welcome Aboard!
                            </h2>
                            <p className="text-gray-300 mb-4">
                                You`&apos;ll be first to access our free blogging platform.<br />
                                Want to secure your custom subdomain early?
                            </p>
                            <button
                                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg"
                                onClick={() => window.open('https://twitter.com/intent/tweet?text=Claiming%20my%20free%20blog%20with%20AI%20writing%20and%20forever-free%20hosting!')}
                            >
                                Reserve My Subdomain
                            </button>
                        </div>
                    )}
                </div>

                {/* Value Proposition Section */}
                <div className="grid md:grid-cols-3 gap-8 mt-20">
                    {[
                        ['🌐', 'Free Forever Hosting', 'No hidden fees, no trial periods - professional hosting included'],
                        ['🔍', 'Auto-SEO Optimized', 'Built-in SEO tools and analytics to rank higher'],
                        ['✍️', 'AI Content Assistant', 'Beat writer\'s block with smart suggestions'],
                        ['🎁', 'Free Custom Subdomain', 'yourname.blogfree.com - claim yours today'],
                        ['📈', 'Built-in Analytics', 'Track visitors and growth without extra tools'],
                        ['💸', '100% Free to Start', 'Premium features unlocked for early adopters']
                    ].map(([emoji, title, text], index) => (
                        <div
                            key={title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white bg-opacity-5 p-6 rounded-xl hover:bg-opacity-10 transition-all"
                        >
                            <div className="text-4xl mb-4">{emoji}</div>
                            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                            <p className="text-gray-400">{text}</p>
                        </div>
                    ))}
                </div>

                {/* SEO Emphasis Section */}
                <div className="mt-20 text-center bg-white bg-opacity-5 rounded-2xl p-8">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Rank Higher Without the Hassle
                    </h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            ['Automatic Sitemaps', '🔄'],
                            ['SEO-Friendly URLs', '🔗'],
                            ['Meta Tag Optimization', '🏷️'],
                            ['Mobile Optimization', '📱'],
                        ].map(([text, icon]) => (
                            <div key={text} className="p-4">
                                <div className="text-3xl mb-2">{icon}</div>
                                <p className="text-gray-300">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
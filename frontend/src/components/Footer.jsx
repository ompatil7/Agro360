import React from 'react'

const Footer = () => {
    return (
        <div>
            <footer className="bg-gradient-to-b from-emerald-800 to-emerald-900 text-white">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-white/10 pb-12">
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Agro360</h4>
                            <p className="text-emerald-200 text-sm leading-relaxed">
                                Empowering farmers through blockchain technology and AI-driven
                                agricultural solutions.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Solutions</h4>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="text-emerald-200 hover:text-white">
                                        Crop Insurance
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-emerald-200 hover:text-white">
                                        Market Predictions
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-emerald-200 hover:text-white">
                                        Farm Analytics
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Resources</h4>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="text-emerald-200 hover:text-white">
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-emerald-200 hover:text-white">
                                        Case Studies
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-emerald-200 hover:text-white">
                                        API Status
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Connect</h4>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="text-emerald-200 hover:text-white">
                                        Twitter
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-emerald-200 hover:text-white">
                                        LinkedIn
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-emerald-200 hover:text-white">
                                        Support Portal
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 text-center text-emerald-300 text-sm">
                        © 2024 Agro360. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer

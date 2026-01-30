import React from 'react';

const AboutModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-4">
                    About DecentraVote
                </h2>

                <p className="text-gray-300 mb-6 leading-relaxed">
                    DecentraVote is a secure, transparent, and immutable voting platform powered by the Ethereum blockchain.
                    Our goal is to demonstrate how decentralized technologies can foster trust in democratic processes.
                </p>

                <div className="border-t border-gray-700 pt-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Developer</h3>
                    <p className="text-white font-medium">Akshat Upadhyay</p>
                    <a href="mailto:uakshat43@gmail.com" className="text-blue-400 hover:text-blue-300 text-sm mt-1 block">
                        uakshat43@gmail.com
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AboutModal;

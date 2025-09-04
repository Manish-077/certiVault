import React from 'react';
import { FaRocket, FaShieldAlt, FaCogs, FaHeart } from 'react-icons/fa';

function About() {
  return (
    <div className="container py-8 fade-in-up">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-display font-bold mb-4">About CertifyMe</h1>
        <p className="text-xl text-gray-500">Your digital trophy case for professional achievements.</p>
      </div>

      <div className="card p-8 mb-12 shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <h2 className="text-3xl font-bold mb-4 text-center">What is CertifyMe?</h2>
        <p className="text-lg text-center max-w-3xl mx-auto">
          CertifyMe is a modern, streamlined portfolio builder for your professional certificates. 
          Simply upload your certificate files, and we provide a clean, professional, and shareable online portfolio. 
          It's the perfect way to showcase your skills and qualifications to potential employers and colleagues.
        </p>
      </div>

      <div className="about-page">
        <div className="feature-grid mb-12">
          <div className="card p-6 text-center fade-in-up animation-delay-200">
            <FaShieldAlt className="text-4xl text-indigo-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-3">🔐 Secure Authentication</h3>
            <p className="text-gray-600">Your portfolio is protected with secure email and password login, powered by JSON Web Tokens (JWT).</p>
          </div>
          <div className="card p-6 text-center fade-in-up animation-delay-400">
            <FaRocket className="text-4xl text-indigo-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-3">🚀 Fast & Reliable Uploads</h3>
            <p className="text-gray-600">Quickly upload your images and PDFs. Your files are hosted securely and reliably.</p>
          </div>
          <div className="card p-6 text-center fade-in-up animation-delay-600">
            <FaCogs className="text-4xl text-indigo-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-3">⚙️ Effortless Management</h3>
            <p className="text-gray-600">Easily add, filter, and delete certificates from your personal dashboard at any time.</p>
          </div>
        </div>
      </div>

      <div className="card p-8 mb-12 bg-gray-800 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-center">Technology Stack</h2>
        <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto">
          CertifyMe is built with the powerful MERN stack, ensuring a robust and scalable application.
        </p>
        <div className="flex justify-center gap-8 mt-6 text-2xl">
          <span>MongoDB</span>
          <span>Express</span>
          <span>React</span>
          <span>Node.js</span>
        </div>
      </div>

      <div className="text-center mt-12 text-gray-500">
        <p className="flex items-center justify-center gap-2">Developed with <FaHeart className="text-red-500" /> by Manish Charak</p>
      </div>
    </div>
  );
}

export default About;
"use client";
import { Footer, Navbar } from "@/components";
import { useState } from "react";
import { FaPaperPlane, FaUser, FaEnvelope, FaPhone, FaCommentDots } from "react-icons/fa";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: ""
      });
    }, 3000);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-32 pb-20">
        {/* Animated Background */}
        <div className="fixed inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-300 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-down">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have a question or want to work together? We'd love to hear from you.
            </p>
          </div>

          {/* Contact Form */}
          <div className="relative animate-slide-up">
            {/* Gradient Border Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl blur opacity-20"></div>

            <form
              onSubmit={handleSubmit}
              className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-6"
            >
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400 group-focus-within:text-purple-600 transition" />
                    </div>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                      placeholder="John"
                    />
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400 group-focus-within:text-purple-600 transition" />
                    </div>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400 group-focus-within:text-purple-600 transition" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                    placeholder="john.doe@example.com"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="group">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400 group-focus-within:text-purple-600 transition" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Message Field */}
              <div className="group">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-4 pointer-events-none">
                    <FaCommentDots className="text-gray-400 group-focus-within:text-purple-600 transition" />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || submitted}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${submitted
                    ? "bg-green-500"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg"
                  } ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : submitted ? (
                  <>
                    ✓ Message Sent!
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-slide-up delay-200">
            {[
              { icon: FaEnvelope, title: "Email", value: "hello@designershaven.com" },
              { icon: FaPhone, title: "Phone", value: "+1 (555) 123-4567" },
              { icon: FaCommentDots, title: "Live Chat", value: "Available 24/7" }
            ].map((item, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <div className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <item.icon className="text-white text-xl" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

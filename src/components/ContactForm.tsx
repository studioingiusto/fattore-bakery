'use client';

import { useState } from 'react';
import { submitContactForm, ContactFormData } from '@/lib/wordpress';

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const result = await submitContactForm(formData);
      
      if (result.success) {
        setSubmitStatus({ type: 'success', message: result.message });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: result.message });
      }
    } catch {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Errore di connessione. Riprova più tardi.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-[#4e4e4e] mb-2"
                style={{ fontFamily: "Bogart, sans-serif" }}
              >
                Nome *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-none focus:ring-2 focus:ring-[#b71918] focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-[#4e4e4e] mb-2"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-none focus:ring-2 focus:ring-[#b71918] focus:border-transparent transition-colors"
                style={{ fontFamily: "Bogart, sans-serif" }}
              />
            </div>
          </div>

          <div>
            <label 
              htmlFor="phone" 
              className="block text-sm font-medium text-[#4e4e4e] mb-2"
              style={{ fontFamily: "Bogart, sans-serif" }}
            >
              Telefono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-none focus:ring-2 focus:ring-[#b71918] focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label 
              htmlFor="message" 
              className="block text-sm font-medium text-[#4e4e4e] mb-2"
            >
              Messaggio *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-none focus:ring-2 focus:ring-[#b71918] focus:border-transparent transition-colors resize-vertical"
              style={{ fontFamily: "Bogart, sans-serif" }}
              placeholder="Descrivi la tua richiesta o domanda..."
            ></textarea>
          </div>

          {submitStatus.type && (
            <div 
              className={`p-4 rounded ${
                submitStatus.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <p style={{ fontFamily: "Bogart, sans-serif" }}>
                {submitStatus.message}
              </p>
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#b71918] text-[#ffffff] px-8 py-4 font-bold uppercase leading-tight transition-all duration-200 text-lg sm:text-xl md:text-2xl ${
                isSubmitting 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-opacity-90 hover:shadow-lg'
              }`}
              style={{
                color: "#ffffff",
                fontFamily: '"Druk Text Cyr", sans-serif',
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "1.4",
              }}
            >
              {isSubmitting ? 'INVIO IN CORSO...' : 'INVIA MESSAGGIO'}
            </button>
          </div>

          <div className="text-center">
            <p 
              className="text-sm text-[#6b7280]"
              style={{ fontFamily: "Bogart, sans-serif" }}
            >
              * Campi obbligatori
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 
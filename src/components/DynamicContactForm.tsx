'use client';

import { useState, useEffect } from 'react';

export interface ContactFormField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'textarea';
  label: string;
  required: boolean;
  placeholder?: string;
}

export interface ContactFormConfig {
  id: number;
  title: string;
  fields: ContactFormField[];
}

export default function DynamicContactForm({ formId = 14 }: { formId?: number }) {
  const [formConfig, setFormConfig] = useState<ContactFormConfig | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    async function loadFormConfig() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/contact-form?id=${formId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const config = await response.json();
        
        if (config.error) {
          throw new Error(config.error);
        }
        
        setFormConfig(config);
        
        // Initialize form data with empty values
        const initialData: Record<string, string> = {};
        config.fields.forEach((field: ContactFormField) => {
          initialData[field.name] = '';
        });
        setFormData(initialData);
      } catch (error) {
        console.error('Error loading form config:', error);
        setFormConfig(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadFormConfig();
  }, [formId]);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formConfig) return;
    
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          formId: formConfig.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message
        });
        // Reset form
        const resetData: Record<string, string> = {};
        formConfig.fields.forEach(field => {
          resetData[field.name] = '';
        });
        setFormData(resetData);
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Errore di connessione. Riprova più tardi.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: ContactFormField) => {
    const baseClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b71918] focus:border-transparent text-lg";
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            key={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className={baseClasses}
          />
        );
      default:
        return (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={baseClasses}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-[#b71918] rounded-full" role="status" aria-label="loading">
              <span className="sr-only">Caricamento form...</span>
            </div>
            <p className="mt-4 text-[#4e4e4e]" style={{ fontFamily: 'Bogart, sans-serif' }}>
              Caricamento configurazione form da WordPress...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!formConfig) {
    return (
      <div className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-red-600 text-lg">Errore nel caricamento del form. Riprova più tardi.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* <h2 className="text-center uppercase text-transparent text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-8 md:mb-12 lg:mb-16" 
            style={{
              fontFamily: '"Druk Wide", sans-serif',
              fontWeight: 700,
              letterSpacing: '0.07em',
              lineHeight: '1.16em',
              WebkitTextStroke: '2px #b71918'
            }}>
          {formConfig.title || 'RICEVI MAGGIORI INFORMAZIONI'}
        </h2> */}

        {/* {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-3 bg-blue-100 text-blue-800 rounded-lg text-sm">
            <strong>Debug (solo sviluppo):</strong> Form dinamico attivo - ID: {formConfig.id}, Campi: {formConfig.fields.length}
          </div>
        )} */}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formConfig.fields.map((field) => (
              <div key={field.name} className={
                // Solo i campi textarea occupano tutta la larghezza
                field.type === 'textarea' ? 'md:col-span-2' : ''
              }>
                <label htmlFor={field.name} className="block text-lg font-medium text-[#4e4e4e] mb-2" style={{ fontFamily: 'Bogart, sans-serif' }}>
                  {field.label}
                  {field.required && <span className="text-[#b71918] ml-1">*</span>}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>

          {submitStatus.message && (
            <div className={`p-4 rounded-lg ${
              submitStatus.type === 'success' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {submitStatus.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#b71918] text-white px-8 py-4 font-bold uppercase leading-tight hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xl md:text-2xl"
            style={{
              fontFamily: '"Druk Text Cyr", sans-serif',
              fontWeight: 500,
              lineHeight: '1.4'
            }}
          >
            {isSubmitting ? 'INVIO IN CORSO...' : 'INVIA RICHIESTA'}
          </button>
        </form>
      </div>
    </div>
  );
} 
import React from 'react';

export function PricingTier({ 
  name, 
  price, 
  billingPeriod = '/month', 
  description, 
  features = [], 
  isHighlighted = false, 
  buttonText ="Choose Plan",
  onAction,
  className = '' 
}) {
  return (
    <div 
      className={`relative flex flex-col p-8 rounded-3xl transition-transform duration-300 hover:scale-[1.02] ${
        isHighlighted 
          ? 'bg-slate-900 border border-slate-800 shadow-xl shadow-primary-500/10' 
          : 'glass-card'
      } ${className}`}
      data-slot="pricing-tier"
    >
      {isHighlighted && (
        <div className="absolute -top-4 inset-x-0 flex justify-center">
          <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className={`text-xl font-display font-bold ${isHighlighted ? 'text-white' : 'text-slate-900'}`}>
          {name}
        </h3>
        <p className={`mt-2 text-sm ${isHighlighted ? 'text-slate-400' : 'text-slate-500'}`}>
          {description}
        </p>
      </div>

      <div className="mb-8">
        <span className={`text-4xl font-bold  ${isHighlighted ? 'text-white' : 'text-slate-900'}`}>
          {price}
        </span>
        <span className={`text-sm font-medium ${isHighlighted ? 'text-slate-400' : 'text-slate-500'}`}>
          {billingPeriod}
        </span>
      </div>

      <ul className="flex-1 space-y-4 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start">
            <svg 
              aria-hidden="true"
              className={`w-5 h-5 shrink-0 mr-3 ${isHighlighted ? 'text-primary-400' : 'text-primary-500'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            <span className={`text-sm leading-tight ${isHighlighted ? 'text-slate-300' : 'text-slate-700'}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button 
        onClick={onAction}
        className={`w-full min-h-[48px] rounded-xl font-bold transition-all ${
          isHighlighted 
            ? 'glass-button-primary' 
            : 'bg-primary-50 text-primary-600 hover:bg-primary-100 focus:ring-2 focus:ring-primary-500 focus:outline-none'
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
}

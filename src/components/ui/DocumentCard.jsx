import React from 'react';

export function DocumentCard({ 
  fileName, 
  fileSize, 
  date, 
  icon: Icon, 
  onDownload, 
  onDelete, 
  onClick,
  className = '' 
}) {
  return (
    <div 
      className={`glass-card p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
      data-slot="document-card"
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-center space-x-4 overflow-hidden">
        <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-500 flex items-center justify-center shrink-0">
          {Icon ? <Icon className="w-6 h-6" /> : (
            <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          )}
        </div>
        <div className="truncate">
          <h4 className="font-bold text-sm text-slate-900 truncate" title={fileName}>
            {fileName}
          </h4>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
            <span>{fileSize}</span>
            <span aria-hidden="true">&bull;</span>
            <span>{date}</span>
          </p>
        </div>
      </div>

      {/* Action Buttons (Visible on hover) */}
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100 shrink-0 ml-4">
        {onDownload && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-slate-400 hover:text-primary-500 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label={`Download ${fileName}`}
            title="Download"
          >
            <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        )}
        {onDelete && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
            aria-label={`Delete ${fileName}`}
            title="Delete"
          >
            <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

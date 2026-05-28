import React, { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';

interface ResumeUploaderProps {
  onFileSelected: (file: File) => void;
  isUploading: boolean;
}

export function ResumeUploader({ onFileSelected, isUploading }: ResumeUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelected(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`uploader-box ${isDragging ? 'drag-active' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      {isUploading ? (
        <div className="loader">
          <div className="spinner"></div>
          <p>Analyzing your career trajectory...</p>
        </div>
      ) : (
        <>
          <UploadCloud className="uploader-icon" />
          <h2>Drop your resume here</h2>
          <p className="text-muted">Supports PDF, DOCX, and TXT files</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileInput} 
            style={{ display: 'none' }}
            accept=".pdf,.docx,.txt"
          />
          <button className="btn" style={{ marginTop: '1.5rem' }} onClick={(e) => {
            // Prevent event bubbling if clicking the button directly
            e.stopPropagation();
            fileInputRef.current?.click();
          }}>
            Browse Files
          </button>
        </>
      )}
    </div>
  );
}

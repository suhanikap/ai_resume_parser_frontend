import { useState, useRef } from 'react';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { supabase } from './lib/supabase';
import { ResumeResults } from './components/ResumeResults';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const validateFile = (f: File): boolean => {
    if (f.type !== 'application/pdf') {
      setErrorMessage('Please upload a PDF file');
      return false;
    }
    if (f.size > 10 * 1024 * 1024) {
      setErrorMessage('File size must be less than 10MB');
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const droppedFile = files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        setErrorMessage('');
        setStatus('idle');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        setErrorMessage('');
        setStatus('idle');
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setErrorMessage('Please select a file');
      return;
    }

    setStatus('uploading');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        'https://hook.eu1.make.com/vojybq22qrbxpx0ybcdint5wplh53cdw',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      // Save resume to Supabase immediately
      const { error: insertError } = await supabase
        .from('resumes')
        .insert([
          {
            file_name: file.name,
            name: null,
            email: null,
            phone: null,
            skills: [],
            experience: null,
            education: null,
            raw_data: null,
          },
        ]);

      if (insertError) {
        console.error('Failed to save resume to database:', insertError);
      }

      setStatus('success');
      setFile(null);
      setRefreshTrigger(prev => prev + 1);
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to upload file'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Upload Section */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
                  <Upload className="w-7 h-7 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  AI Resume Parser
                </h1>
                <p className="text-slate-600">
                  Upload your resume as a PDF to get started
                </p>
              </div>

              {/* Upload Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="space-y-2">
                  <Upload
                    className={`w-8 h-8 mx-auto transition-colors ${
                      isDragActive ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  />
                  <div>
                    <p className="font-semibold text-slate-900">
                      {isDragActive
                        ? 'Drop your PDF here'
                        : 'Drag and drop your PDF here'}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      or click to browse
                    </p>
                  </div>
                </div>
              </div>

              {/* File Display */}
              {file && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-200">
                      <Upload className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setStatus('idle');
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              )}

              {/* Success Message */}
              {status === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900">Success!</p>
                    <p className="text-sm text-green-700 mt-1">
                      Your resume has been uploaded and is being processed.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!file || status === 'uploading'}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                  !file || status === 'uploading'
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                }`}
              >
                {status === 'uploading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  'Submit'
                )}
              </button>

              {/* Info Text */}
              <p className="text-xs text-slate-500 text-center">
                Supports PDF files up to 10MB
              </p>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-h-[calc(100vh-2rem)] overflow-y-auto sticky top-4">
              <ResumeResults refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

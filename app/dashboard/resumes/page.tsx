"use client";

import { useState } from 'react';
import api from '@/lib/api';
import { UploadCloud } from 'lucide-react';
import { Resume } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

export default function ResumesPage() {
  const { user } = useAuth(); // Need this for user_id
  const [file, setFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState(''); // New required field
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadedResume, setUploadedResume] = useState<Resume | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setUploading(true);
    setMessage('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Append query params per new API spec
      const queryParams = new URLSearchParams({
        user_id: user.id.toString(),
        name: resumeName
      });

      const { data } = await api.post<Resume>(`/resumes/upload?${queryParams.toString()}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setUploadedResume(data);
      setMessage('Resume uploaded successfully!');
      setFile(null);
      setResumeName('');
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      const errorMessage = typeof detail === 'string' 
        ? detail 
        : Array.isArray(detail) ? detail[0].msg : 'Upload failed.';
      setMessage(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Resume</h1>
      
      <form onSubmit={handleUpload} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Resume Label / Name</label>
          <input type="text" required value={resumeName} onChange={(e) => setResumeName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. John Doe - Senior Engineer" />
        </div>

        <div className="text-center border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
          <UploadCloud className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <input 
            type="file" 
            required
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
        </div>

        <button disabled={!file || !resumeName || uploading} type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50">
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
        {message && <p className={`mt-4 text-sm font-medium text-center ${message.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
      </form>

      {uploadedResume && (
        <div className="mt-8 bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800">Latest Upload:</h3>
          <p className="text-sm text-green-700">ID: {uploadedResume.id} | File: {uploadedResume.original_filename}</p>
        </div>
      )}
    </div>
  );
}
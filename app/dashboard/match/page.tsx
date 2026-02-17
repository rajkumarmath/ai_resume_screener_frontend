"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Job, MatchResult } from '@/lib/types';
import { Search } from 'lucide-react';

export default function MatchPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get<Job[]>('/jobs/').then(res => setJobs(res.data));
  }, []);

  const handleMatch = async () => {
    if (!selectedJob) return;
    setLoading(true);
    try {
      const { data } = await api.get<MatchResult[]>(`/jobs/${selectedJob}/match-with-explanation`);
      const sorted = data.sort((a, b) => b.score - a.score);
      setMatches(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeConfig = (score: number) => {
    const percentage = score * 100;
    if (percentage >= 80) return { label: 'Top Match', classes: 'bg-green-100 text-green-800', barClasses: 'bg-green-500' };
    if (percentage >= 50) return { label: 'Medium', classes: 'bg-yellow-100 text-yellow-800', barClasses: 'bg-yellow-500' };
    return { label: 'Low', classes: 'bg-red-100 text-red-800', barClasses: 'bg-red-500' };
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Resume Matching</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 flex gap-4">
        <select 
          value={selectedJob} 
          onChange={(e) => setSelectedJob(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 outline-none"
        >
          <option value="">Select a job to find matches...</option>
          {jobs.map(job => (
            <option key={job.id} value={job.id}>{job.title} (ID: {job.id})</option>
          ))}
        </select>
        <button 
          onClick={handleMatch} 
          disabled={!selectedJob || loading}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Search className="w-5 h-5" /> {loading ? 'Analyzing...' : 'Run Match'}
        </button>
      </div>

      {matches.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Match Results</h2>
          {matches.map((match) => {
            const percentage = (match.score * 100).toFixed(0);
            const badge = getBadgeConfig(match.score);

            return (
              <div key={match.resume_id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">Resume ID: #{match.resume_id}</h3>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${badge.classes}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-gray-800">{percentage}%</span>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ease-out ${badge.barClasses}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                {match.explanation && (
                  <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 border border-gray-100">
                    <strong className="block text-gray-900 mb-1">AI Reasoning:</strong>
                    {match.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
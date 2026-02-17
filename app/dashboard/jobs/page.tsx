"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Job, JobRequest } from '@/lib/types';
import { Briefcase } from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState(''); // comma separated
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get<Job[]>('/jobs/');
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
    const payload: JobRequest = { title, description, skills: skillsArray };

    try {
      await api.post('/jobs/', payload);
      setTitle(''); setDescription(''); setSkills('');
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Creation Form */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-8">
          <h2 className="text-xl font-bold mb-6">Create New Job</h2>
          <form onSubmit={handleCreateJob} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2.5 border rounded-lg" placeholder="Software Engineer" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2.5 border rounded-lg h-24" placeholder="Job details..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
              <input required value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full p-2.5 border rounded-lg" placeholder="python, react, fastapi" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700">Create Job</button>
          </form>
        </div>
      </div>

      {/* Listing */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold mb-6">Active Jobs</h2>
        {loading ? <p>Loading jobs...</p> : (
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gray-400" /> {job.title}
                  </h3>
                  <span className="text-xs text-gray-400">ID: {job.id}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.skills.map(skill => (
                    <span key={skill} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
            {jobs.length === 0 && <p className="text-gray-500">No jobs found. Create one to get started.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
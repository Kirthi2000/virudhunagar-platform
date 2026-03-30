import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const DOMAINS = ['AI', 'IoT', 'Agriculture', 'Healthcare', 'Education', 'Environment', 'Other'];

export default function UploadProject() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canUpload = ['student', 'faculty'].includes(user?.role);

  const [form, setForm] = useState({
    title: '',
    description: '',
    domain: 'AI',
    technologies: '',
    githubLink: '',
    hasDataset: false,
    institution: user?.institution || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key, value) => setForm((c) => ({ ...c, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canUpload) return;
    setError('');
    setLoading(true);
    try {
      const { data } = await projectAPI.create(form);
      navigate(`/projects/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload project');
    } finally {
      setLoading(false);
    }
  };

  if (!canUpload) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
          <p className="text-4xl mb-4">🔒</p>
          <h2 className="text-xl font-extrabold text-amber-900 mb-2">Upload not available</h2>
          <p className="text-sm text-amber-700 mb-6">
            Project upload is limited to students and faculty. Your role can still browse projects, bookmark work, and explore datasets.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/projects" className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors">
              Browse Projects
            </Link>
            <Link to="/dashboard" className="px-5 py-2.5 rounded-xl border border-amber-300 text-amber-900 text-sm font-semibold hover:bg-amber-100 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">Share Your Work</p>
          <h1 className="text-3xl font-extrabold text-slate-900">Upload Project</h1>
          <p className="text-sm text-slate-400 mt-1">Share your innovation with Virudhunagar</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Title *</label>
              <input
                type="text"
                placeholder="e.g. AI-based Crop Disease Detection"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
              <textarea
                placeholder="Describe your project, what problem it solves, how it works..."
                required
                rows={4}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Domain *</label>
                <select
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={form.domain}
                  onChange={(e) => set('domain', e.target.value)}
                >
                  {DOMAINS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Institution</label>
                <input
                  type="text"
                  placeholder="Your institution"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  value={form.institution}
                  onChange={(e) => set('institution', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Technologies Used</label>
              <input
                type="text"
                placeholder="e.g. Python, TensorFlow, React (comma separated)"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
                value={form.technologies}
                onChange={(e) => set('technologies', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">GitHub Link</label>
              <input
                type="url"
                placeholder="https://github.com/username/project"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
                value={form.githubLink}
                onChange={(e) => set('githubLink', e.target.value)}
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={form.hasDataset}
                onChange={(e) => set('hasDataset', e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <div>
                <p className="text-sm font-semibold text-slate-700">This project includes a dataset</p>
                <p className="text-xs text-slate-400">Check this if your project has associated data files</p>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-md hover:scale-[1.01] transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </span>
              ) : '🚀 Upload Project'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

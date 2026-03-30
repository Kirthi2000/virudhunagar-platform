import { useEffect, useState } from 'react';
import { datasetAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Agriculture', 'Water', 'Population', 'Industry', 'Education', 'Health', 'Other'];

const catConfig = {
  Agriculture: { color: 'bg-green-100 text-green-700 border-green-200', icon: '🌾', accent: 'from-green-500 to-emerald-600' },
  Water: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '💧', accent: 'from-blue-500 to-cyan-600' },
  Population: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '👥', accent: 'from-purple-500 to-violet-600' },
  Industry: { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: '🏭', accent: 'from-orange-500 to-amber-600' },
  Education: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '📚', accent: 'from-yellow-500 to-amber-500' },
  Health: { color: 'bg-red-100 text-red-700 border-red-200', icon: '🏥', accent: 'from-red-500 to-rose-600' },
  Other: { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: '📁', accent: 'from-slate-500 to-gray-600' },
};

export default function Datasets() {
  const { user } = useAuth();
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ category: '', search: '' });
  const [form, setForm] = useState({ title: '', description: '', category: 'Agriculture', format: '', size: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [downloadError, setDownloadError] = useState('');

  useEffect(() => {
    setLoading(true);
    setFetchError('');
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.search) params.search = filters.search;
    datasetAPI.getAll(params)
      .then(({ data }) => setDatasets(data))
      .catch((err) => setFetchError(err.response?.data?.message || 'Failed to load datasets'))
      .finally(() => setLoading(false));
  }, [filters]);

  const set = (key, value) => setForm((c) => ({ ...c, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await datasetAPI.create(form);
      setDatasets((c) => [data, ...c]);
      setShowForm(false);
      setForm({ title: '', description: '', category: 'Agriculture', format: '', size: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload dataset');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async (id) => {
    setDownloadError('');
    try {
      const { data } = await datasetAPI.download(id);
      if (data.url) window.open(data.url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setDownloadError(err.response?.data?.message || 'Failed to download dataset');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-8">
        <div className="mx-auto max-w-6xl flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">Open Data</p>
            <h1 className="text-3xl font-extrabold text-slate-900">Dataset Repository</h1>
            <p className="text-sm text-slate-400 mt-1">Open datasets for Virudhunagar district</p>
          </div>
          {user && (
            <button
              type="button"
              onClick={() => setShowForm((c) => !c)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all ${
                showForm ? 'bg-slate-200 text-slate-700' : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:scale-105'
              }`}
            >
              {showForm ? '✕ Cancel' : '+ Upload Dataset'}
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {!user && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-700">
            <span className="text-lg">ℹ️</span>
            Sign in if you want to contribute district datasets. Browsing and searching are open to everyone.
          </div>
        )}

        {/* Upload Form */}
        {showForm && (
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 mb-5">Upload New Dataset</h3>
            {error && <p className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text" placeholder="Dataset Title *" required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={form.title} onChange={(e) => set('title', e.target.value)}
              />
              <textarea
                placeholder="Description *" required rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={form.description} onChange={(e) => set('description', e.target.value)}
              />
              <div className="grid grid-cols-3 gap-3">
                <select
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={form.category} onChange={(e) => set('category', e.target.value)}
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c}>{c}</option>)}
                </select>
                <input
                  type="text" placeholder="Format (CSV, JSON...)"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={form.format} onChange={(e) => set('format', e.target.value)}
                />
                <input
                  type="text" placeholder="Size (e.g. 2MB)"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={form.size} onChange={(e) => set('size', e.target.value)}
                />
              </div>
              <button
                type="submit" disabled={submitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold disabled:opacity-60 hover:scale-105 transition-transform"
              >
                {submitting ? 'Uploading...' : 'Upload Dataset'}
              </button>
            </form>
          </div>
        )}

        {(fetchError || downloadError) && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {fetchError || downloadError}
          </div>
        )}

        {/* Search + Category Filter */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-8">
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text" placeholder="Search datasets..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={filters.search}
              onChange={(e) => setFilters((c) => ({ ...c, search: e.target.value }))}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const cfg = catConfig[cat] || catConfig.Other;
              const active = filters.category === (cat === 'All' ? '' : cat);
              return (
                <button
                  key={cat} type="button"
                  onClick={() => setFilters((c) => ({ ...c, category: cat === 'All' ? '' : cat }))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  {cat !== 'All' && <span>{cfg.icon}</span>}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-100 p-5 animate-pulse space-y-3">
                <div className="h-4 bg-slate-100 rounded w-1/4" />
                <div className="h-5 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : datasets.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-4xl mb-4">📊</p>
            <p className="text-lg font-bold text-slate-700">No datasets found</p>
            <p className="text-sm text-slate-400 mt-1">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {datasets.map((dataset) => {
              const cfg = catConfig[dataset.category] || catConfig.Other;
              return (
                <div key={dataset._id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                  <div className={`h-1 w-full bg-gradient-to-r ${cfg.accent}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${cfg.color}`}>
                        {cfg.icon} {dataset.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                        ⬇️ {dataset.downloads}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{dataset.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">{dataset.description}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {dataset.format && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-xs text-slate-500 font-medium">{dataset.format}</span>
                      )}
                      {dataset.size && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-xs text-slate-500">{dataset.size}</span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mb-4">
                      By {dataset.uploadedBy?.name}{dataset.uploadedBy?.institution ? ` · ${dataset.uploadedBy.institution}` : ''}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleDownload(dataset._id)}
                      className="w-full py-2.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                      ⬇️ Download Dataset
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../api';

const DOMAINS = ['All', 'AI', 'IoT', 'Agriculture', 'Healthcare', 'Education', 'Environment', 'Other'];

const domainColors = {
  AI: 'bg-purple-100 text-purple-700 border-purple-200',
  IoT: 'bg-blue-100 text-blue-700 border-blue-200',
  Agriculture: 'bg-green-100 text-green-700 border-green-200',
  Healthcare: 'bg-red-100 text-red-700 border-red-200',
  Education: 'bg-amber-100 text-amber-700 border-amber-200',
  Environment: 'bg-teal-100 text-teal-700 border-teal-200',
  Other: 'bg-slate-100 text-slate-700 border-slate-200',
};

const domainGradients = {
  AI: 'from-purple-500 to-violet-600',
  IoT: 'from-blue-500 to-indigo-600',
  Agriculture: 'from-green-500 to-emerald-600',
  Healthcare: 'from-red-500 to-rose-600',
  Education: 'from-amber-500 to-orange-600',
  Environment: 'from-teal-500 to-cyan-600',
  Other: 'from-slate-500 to-gray-600',
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ domain: '', search: '', sort: 'createdAt', hasDataset: '' });

  useEffect(() => {
    setLoading(true);
    setError('');
    const params = {};
    if (filters.domain) params.domain = filters.domain;
    if (filters.search) params.search = filters.search;
    if (filters.sort) params.sort = filters.sort;
    if (filters.hasDataset) params.hasDataset = filters.hasDataset;

    projectAPI.getAll(params)
      .then(({ data }) => setProjects(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load projects'))
      .finally(() => setLoading(false));
  }, [filters]);

  const set = (key, value) => setFilters((c) => ({ ...c, [key]: value }));
  const clearFilters = () => setFilters({ domain: '', search: '', sort: 'createdAt', hasDataset: '' });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">Innovation Showcase</p>
              <h1 className="text-3xl font-extrabold text-slate-900">Projects</h1>
              <p className="text-sm text-slate-400 mt-1">{projects.length} projects from Virudhunagar</p>
            </div>
            <Link to="/upload" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold shadow-md hover:scale-105 transition-transform">
              + Upload Project
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-8">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 bg-slate-50"
                value={filters.search}
                onChange={(e) => set('search', e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={filters.domain}
              onChange={(e) => set('domain', e.target.value === 'All' ? '' : e.target.value)}
            >
              {DOMAINS.map((d) => <option key={d} value={d === 'All' ? '' : d}>{d}</option>)}
            </select>
            <select
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={filters.sort}
              onChange={(e) => set('sort', e.target.value)}
            >
              <option value="createdAt">Latest</option>
              <option value="rating">Top Rated</option>
              <option value="views">Most Viewed</option>
            </select>
            <select
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={filters.hasDataset}
              onChange={(e) => set('hasDataset', e.target.value)}
            >
              <option value="">All Projects</option>
              <option value="true">With Dataset</option>
            </select>
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Domain pills */}
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
            {DOMAINS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => set('domain', d === 'All' ? '' : d)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  filters.domain === (d === 'All' ? '' : d)
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'border-slate-200 text-slate-600 hover:border-slate-400'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-100 overflow-hidden animate-pulse">
                <div className="h-1.5 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-5 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-lg font-bold text-slate-700 mb-2">No projects matched your filters</p>
            <p className="text-sm text-slate-400 mb-6">Try a different search or clear the filters.</p>
            <button type="button" onClick={clearFilters} className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {projects.map((project) => {
              const grad = domainGradients[project.domain] || 'from-slate-500 to-gray-600';
              const badge = domainColors[project.domain] || 'bg-slate-100 text-slate-700 border-slate-200';
              return (
                <Link
                  to={`/projects/${project._id}`}
                  key={project._id}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                >
                  <div className={`h-1.5 w-full bg-gradient-to-r ${grad}`} />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badge}`}>{project.domain}</span>
                      {project.hasDataset && (
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          📊 Dataset
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-amber-600 transition-colors mb-1">{project.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">{project.description}</p>

                    {project.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.technologies.slice(0, 3).map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 text-xs text-slate-500">{t}</span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
                      <span className="flex items-center gap-1">⭐ {project.avgRating?.toFixed(1) || '0.0'}</span>
                      <span className="flex items-center gap-1">👁 {project.views}</span>
                      <span className="flex items-center gap-1">💬 {project.comments?.length || 0}</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400 truncate">{project.author?.name} · {project.author?.institution}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

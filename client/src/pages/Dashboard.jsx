import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectAPI } from '../api';

const roleConfig = {
  student:     { icon: '🎓', gradient: 'from-blue-500 to-indigo-600' },
  faculty:     { icon: '👨‍🏫', gradient: 'from-green-500 to-teal-600' },
  institution: { icon: '🏛️', gradient: 'from-purple-500 to-violet-600' },
  company:     { icon: '🏢', gradient: 'from-orange-500 to-amber-600' },
  owner:       { icon: '⚙️', gradient: 'from-slate-600 to-slate-800' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUserId = user?._id || user?.id;

  // ✅ Only re-run when the user ID actually changes — no refreshUser in deps
  useEffect(() => {
    if (!currentUserId) return;

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await projectAPI.getAll({});
        if (!cancelled) {
          setMyProjects(
            data.filter(
              (p) => p.author?._id === currentUserId || p.author?.id === currentUserId
            )
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Failed to load your dashboard');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, [currentUserId]); // ← only currentUserId, not refreshUser

  if (!user) return null;

  const role = roleConfig[user.role] || roleConfig.owner;
  const canUpload = ['student', 'faculty'].includes(user.role);

  const quickActions = [
    canUpload && { to: '/upload',      label: 'Upload Project',  icon: '🚀', accent: 'bg-slate-900 text-white hover:bg-slate-700' },
    { to: '/projects',   label: 'Browse Projects', icon: '🔍', accent: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' },
    { to: '/datasets',   label: 'Open Datasets',   icon: '📊', accent: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' },
    { to: '/leaderboard',label: 'Leaderboard',     icon: '🏆', accent: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto max-w-6xl px-4 py-8">

        {location.state?.denied && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
            <span>⚠️</span>
            Your account can access the dashboard, but only students and faculty can upload projects.
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        {/* ── Profile Hero ── */}
        <div className="mb-8 rounded-3xl overflow-hidden shadow-xl">
          <div className={`bg-gradient-to-br ${role.gradient} p-8 md:p-10 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-black/10 blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-center gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-3xl font-black text-white shadow-lg shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white truncate">{user.name}</h2>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/20 capitalize">
                    {role.icon} {user.role}
                  </span>
                </div>
                <p className="text-white/70 text-sm">{user.email}</p>
                {user.institution && <p className="text-white/70 text-sm">{user.institution}</p>}
                {user.department  && <p className="text-white/70 text-sm">{user.department}</p>}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 shrink-0">
                <div className="rounded-2xl bg-white/15 border border-white/20 p-4 text-center">
                  <p className="text-3xl font-extrabold text-white">{myProjects.length}</p>
                  <p className="text-xs text-white/60 uppercase tracking-wider mt-1">Projects</p>
                </div>
                <div className="rounded-2xl bg-white/15 border border-white/20 p-4 text-center">
                  <p className="text-3xl font-extrabold text-white">{user.score || 0}</p>
                  <p className="text-xs text-white/60 uppercase tracking-wider mt-1">Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className={`flex flex-col items-center gap-2 p-5 rounded-2xl text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md ${action.accent}`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-center text-xs">{action.label}</span>
            </Link>
          ))}
        </div>

        {!canUpload && (
          <div className="mb-8 rounded-2xl border border-sky-100 bg-sky-50 p-5">
            <p className="font-semibold text-sky-900 mb-1">Suggested next steps</p>
            <p className="text-sm text-sky-700">
              Browse student projects, track district datasets, and use events to connect with institutions and talent.
            </p>
          </div>
        )}

        {/* ── My Projects ── */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-2xl font-extrabold text-slate-900">My Projects</h3>
          {canUpload && (
            <Link to="/upload" className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors">
              + Add New
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-100 p-5 space-y-3">
                <div className="h-4 bg-slate-100 rounded w-1/4 animate-pulse" />
                <div className="h-5 bg-slate-100 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-slate-100 rounded w-full animate-pulse" />
                <div className="h-3 bg-slate-100 rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>
        ) : myProjects.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
            <p className="text-4xl mb-4">📂</p>
            <p className="font-bold text-slate-700 mb-2">No projects yet</p>
            <p className="text-sm text-slate-400 mb-6">Start building your profile by sharing your first project.</p>
            {canUpload && (
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-700 transition-colors"
              >
                🚀 Upload Your First Project
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {myProjects.map((project) => (
              <Link
                to={`/projects/${project._id}`}
                key={project._id}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-500" />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                      {project.domain}
                    </span>
                    {project.hasDataset && (
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        📊 Dataset
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-3 border-t border-slate-100">
                    <span>⭐ {project.avgRating?.toFixed(1) || '0.0'}</span>
                    <span>👁 {project.views}</span>
                    <span>💬 {project.comments?.length || 0}</span>
                    <span>🔖 {project.bookmarks?.length || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

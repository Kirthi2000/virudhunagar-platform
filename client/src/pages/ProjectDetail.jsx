import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projectAPI } from '../api';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const currentUserId = user?._id || user?.id;

  const [project, setProject] = useState(null);
  const [comment, setComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadProject = async () => {
      try {
        setLoading(true);
        const { data } = await projectAPI.getOne(id);
        if (cancelled) return;

        setProject(data);
        setError('');

        if (!currentUserId) {
          setUserRating(0);
          setBookmarked(false);
          return;
        }

        const myRating = (data.ratings || []).find((r) => {
          const uid = typeof r.user === 'object' ? r.user?._id || r.user?.id : r.user;
          return uid === currentUserId;
        });

        const bookmarkIds = (data.bookmarks || []).map((b) =>
          typeof b === 'object' ? b?._id || b?.id : b
        );

        setUserRating(myRating?.stars || 0);
        setBookmarked(bookmarkIds.includes(currentUserId));
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load project details');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProject();
    return () => { cancelled = true; };
  }, [id, currentUserId]);

  const handleRate = async (stars) => {
    if (!user) return;
    try {
      setError('');
      setUserRating(stars);
      const { data } = await projectAPI.rate(id, stars);
      setProject((cur) => {
        if (!cur) return cur;
        const hasExisting = (cur.ratings || []).some((r) => {
          const uid = typeof r.user === 'object' ? r.user?._id || r.user?.id : r.user;
          return uid === currentUserId;
        });
        const ratings = hasExisting
          ? (cur.ratings || []).map((r) => {
              const uid = typeof r.user === 'object' ? r.user?._id || r.user?.id : r.user;
              return uid === currentUserId ? { ...r, stars } : r;
            })
          : [...(cur.ratings || []), { user: currentUserId, stars }];
        return { ...cur, ratings, avgRating: data.avgRating, totalRatings: data.totalRatings };
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to rate project');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      setError('');
      const { data } = await projectAPI.comment(id, comment);
      setProject((cur) => ({ ...cur, comments: data }));
      setComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleBookmark = async () => {
    if (!user) return;
    try {
      setError('');
      const { data } = await projectAPI.bookmark(id);
      setBookmarked(data.bookmarked);
      setProject((cur) => {
        if (!cur) return cur;
        const ids = new Set(
          (cur.bookmarks || []).map((b) => (typeof b === 'object' ? b?._id || b?.id : b))
        );
        data.bookmarked ? ids.add(currentUserId) : ids.delete(currentUserId);
        return { ...cur, bookmarks: Array.from(ids) };
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update bookmark');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg font-bold text-slate-700">Project not found</p>
          <Link to="/projects" className="mt-4 inline-block text-sm text-amber-600 hover:underline">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const domainColors = {
    AI: 'bg-purple-100 text-purple-700',
    IoT: 'bg-blue-100 text-blue-700',
    Agriculture: 'bg-green-100 text-green-700',
    Healthcare: 'bg-red-100 text-red-700',
    Education: 'bg-amber-100 text-amber-700',
    Environment: 'bg-teal-100 text-teal-700',
    Other: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto max-w-5xl px-4 py-8">

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Hero Card */}
        <div className="mb-6 rounded-3xl overflow-hidden shadow-xl">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-7 md:p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${domainColors[project.domain] || 'bg-slate-100 text-slate-700'}`}>
                    {project.domain}
                  </span>
                  {project.hasDataset && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-900/50 text-emerald-300 border border-emerald-700/50">
                      📊 Includes Dataset
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{project.title}</h1>
                <p className="mt-3 text-sm text-slate-300">
                  By <span className="font-semibold text-white">{project.author?.name}</span>
                  {project.author?.institution && <span> · {project.author.institution}</span>}
                </p>
              </div>

              <button
                type="button"
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  bookmarked
                    ? 'bg-amber-500 text-slate-900 hover:bg-amber-400'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                {bookmarked ? '🔖 Saved' : '🔖 Save Project'}
              </button>
            </div>

            {/* Stats row */}
            <div className="relative mt-8 grid grid-cols-3 gap-4">
              {[
                { label: 'Views', value: project.views },
                { label: 'Comments', value: project.comments?.length || 0 },
                { label: 'Saves', value: project.bookmarks?.length || 0 },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/10 border border-white/10 p-4 text-center">
                  <p className="text-2xl font-extrabold text-white">{s.value}</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="bg-white p-7 md:p-10">
            <p className="text-sm leading-8 text-slate-600">{project.description}</p>

            {project.technologies?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
                >
                  🔗 View on GitHub
                </a>
              )}
              <span className="flex items-center gap-1 text-sm text-slate-400">
                ⭐ {project.avgRating?.toFixed(1) || '0.0'} / 5 ({project.totalRatings} ratings)
              </span>
            </div>

            {/* Star Rating */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-700 mb-3">Rate this project</p>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRate(star)}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      className={`text-2xl transition-transform hover:scale-110 ${
                        star <= (hovered || userRating) ? 'text-amber-400' : 'text-slate-200'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {userRating > 0 && (
                  <span className="text-xs text-slate-400">You rated {userRating}/5</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7 md:p-10">
          <h3 className="text-xl font-extrabold text-slate-900 mb-6">
            Comments ({project.comments?.length || 0})
          </h3>

          {user ? (
            <form onSubmit={handleComment} className="flex gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <input
                type="text"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
              >
                Post
              </button>
            </form>
          ) : (
            <div className="mb-6 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm text-slate-500">
              <Link to="/login" className="font-semibold text-amber-600 hover:underline">Login</Link>
              {' '}to leave a comment.
            </div>
          )}

          <div className="space-y-3">
            {(!project.comments || project.comments.length === 0) && (
              <div className="py-10 text-center">
                <p className="text-3xl mb-2">💬</p>
                <p className="text-sm text-slate-400">No comments yet. Be the first!</p>
              </div>
            )}
            {project.comments?.map((entry, i) => (
              <div key={i} className="flex gap-3 rounded-2xl bg-slate-50 px-5 py-4">
                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                  {entry.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-1">{entry.user?.name || 'User'}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{entry.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

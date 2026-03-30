import { useEffect, useState } from 'react';
import { eventAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const TYPES = ['All', 'Hackathon', 'Workshop', 'Seminar', 'Competition', 'Other'];

const typeConfig = {
  Hackathon: { color: 'bg-red-100 text-red-700 border-red-200', accent: 'bg-red-500', icon: '⚡' },
  Workshop: { color: 'bg-blue-100 text-blue-700 border-blue-200', accent: 'bg-blue-500', icon: '🛠️' },
  Seminar: { color: 'bg-green-100 text-green-700 border-green-200', accent: 'bg-green-500', icon: '🎤' },
  Competition: { color: 'bg-purple-100 text-purple-700 border-purple-200', accent: 'bg-purple-500', icon: '🏆' },
  Other: { color: 'bg-slate-100 text-slate-700 border-slate-200', accent: 'bg-slate-500', icon: '📌' },
};

export default function Events() {
  const { user } = useAuth();
  const currentUserId = user?._id || user?.id;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', type: 'Hackathon', date: '', venue: '', link: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');

  const canPost = user && ['institution', 'company', 'faculty', 'owner'].includes(user.role);

  useEffect(() => {
    setLoading(true);
    setFetchError('');
    eventAPI.getAll(filter ? { type: filter } : {})
      .then(({ data }) => setEvents(data))
      .catch((err) => setFetchError(err.response?.data?.message || 'Failed to load events'))
      .finally(() => setLoading(false));
  }, [filter]);

  const set = (key, value) => setForm((c) => ({ ...c, [key]: value }));

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await eventAPI.delete(id);
      setEvents((c) => c.filter((e) => e._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await eventAPI.create(form);
      setEvents((c) => [data, ...c]);
      setShowForm(false);
      setForm({ title: '', description: '', type: 'Hackathon', date: '', venue: '', link: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-8">
        <div className="mx-auto max-w-6xl flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-1">Campus & Industry</p>
            <h1 className="text-3xl font-extrabold text-slate-900">Events</h1>
            <p className="text-sm text-slate-400 mt-1">Hackathons, workshops, seminars and more</p>
          </div>
          {canPost && (
            <button
              type="button"
              onClick={() => setShowForm((c) => !c)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all ${
                showForm
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:scale-105'
              }`}
            >
              {showForm ? '✕ Cancel' : '+ Post Event'}
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {!canPost && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-700">
            <span className="text-lg">ℹ️</span>
            Events can be posted by institutions, companies, faculty, and owners. You can still browse everything here.
          </div>
        )}

        {/* Post Form */}
        {showForm && (
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 mb-5">Post New Event</h3>
            {error && <p className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text" placeholder="Event Title *" required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300"
                value={form.title} onChange={(e) => set('title', e.target.value)}
              />
              <textarea
                placeholder="Description *" required rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-300"
                value={form.description} onChange={(e) => set('description', e.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-300"
                  value={form.type} onChange={(e) => set('type', e.target.value)}
                >
                  {TYPES.filter((t) => t !== 'All').map((t) => <option key={t}>{t}</option>)}
                </select>
                <input
                  type="date" required
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-300"
                  value={form.date} onChange={(e) => set('date', e.target.value)}
                />
              </div>
              <input
                type="text" placeholder="Venue (optional)"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-300"
                value={form.venue} onChange={(e) => set('venue', e.target.value)}
              />
              <input
                type="url" placeholder="Registration / Info Link (optional)"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-300"
                value={form.link} onChange={(e) => set('link', e.target.value)}
              />
              <button
                type="submit" disabled={submitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-bold disabled:opacity-60 hover:scale-105 transition-transform"
              >
                {submitting ? 'Posting...' : 'Post Event'}
              </button>
            </form>
          </div>
        )}

        {fetchError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{fetchError}</div>
        )}

        {/* Type Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TYPES.map((type) => {
            const cfg = typeConfig[type] || typeConfig.Other;
            const active = filter === (type === 'All' ? '' : type);
            return (
              <button
                key={type} type="button"
                onClick={() => setFilter(type === 'All' ? '' : type)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                }`}
              >
                {type !== 'All' && <span>{cfg.icon}</span>}
                {type}
              </button>
            );
          })}
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
        ) : events.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-4xl mb-4">📅</p>
            <p className="text-lg font-bold text-slate-700">No events found</p>
            <p className="text-sm text-slate-400 mt-1">Check back soon for upcoming events.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {events.map((event) => {
              const cfg = typeConfig[event.type] || typeConfig.Other;
              const canDelete = user?.role === 'owner' || event.postedBy?._id === currentUserId || event.postedBy?.id === currentUserId;
              const dateObj = new Date(event.date);
              return (
                <div key={event._id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                  <div className={`h-1 w-full ${cfg.accent}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${cfg.color}`}>
                        {cfg.icon} {event.type}
                      </span>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">{dateObj.getDate()}</p>
                        <p className="text-xs text-slate-400">{dateObj.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">{event.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">{event.description}</p>

                    <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                      {event.venue && <span className="flex items-center gap-1">📍 {event.venue}</span>}
                      <span className="flex items-center gap-1">👤 {event.postedBy?.name}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      {event.link && (
                        <a
                          href={event.link} target="_blank" rel="noreferrer"
                          className="flex-1 text-center py-2 rounded-xl bg-teal-50 text-teal-700 text-xs font-semibold hover:bg-teal-100 transition-colors"
                        >
                          Register / Learn More →
                        </a>
                      )}
                      {canDelete && (
                        <button
                          type="button" onClick={() => handleDelete(event._id)}
                          className="px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
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

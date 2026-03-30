import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { value: 'student',     label: '🎓 Student',          desc: 'Upload projects, earn points' },
  { value: 'faculty',     label: '👨🏫 Faculty',          desc: 'Upload & mentor projects' },
  { value: 'institution', label: '🏛️ Institution',       desc: 'Post events, showcase campus' },
  { value: 'company',     label: '🏢 Company / Startup', desc: 'Discover talent & projects' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    institution: '',
    department: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key, value) => setForm((c) => ({ ...c, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === 'company' ? '/projects' : '/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showInstitution = ['student', 'faculty', 'institution'].includes(form.role);
  const showDepartment  = ['student', 'faculty'].includes(form.role);
  const institutionLabel = form.role === 'company' ? 'Company Name' : form.role === 'institution' ? 'Institution Name' : 'Institution Name';

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-12">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-200/30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-sm shadow-lg">
              VA
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-900">Virudhunagar AI</p>
              <p className="text-xs text-slate-400 uppercase tracking-widest">Innovation Platform</p>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
          <div className="mb-7 text-center">
            <h2 className="text-2xl font-extrabold text-slate-900">Create account</h2>
            <p className="mt-1 text-sm text-slate-400">Join the Virudhunagar AI Platform</p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
              />
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => set('role', r.value)}
                    className={`text-left p-3 rounded-xl border text-xs transition-all ${
                      form.role === r.value
                        ? 'border-amber-400 bg-amber-50 text-amber-800'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <p className="font-semibold">{r.label}</p>
                    <p className="text-slate-400 mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {(showInstitution || form.role === 'company') && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{institutionLabel}</label>
                <input
                  type="text"
                  placeholder={form.role === 'company' ? 'Company / Startup name' : 'e.g. Ramco Institute of Technology'}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300"
                  value={form.institution}
                  onChange={(e) => set('institution', e.target.value)}
                />
              </div>
            )}

            {showDepartment && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Artificial Intelligence and Data Science"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300"
                  value={form.department}
                  onChange={(e) => set('department', e.target.value)}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-md hover:scale-[1.01] transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-amber-600 hover:text-amber-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

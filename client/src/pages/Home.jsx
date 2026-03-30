import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const stats = [
  { value: '500+', label: 'Projects', color: 'from-amber-400 to-orange-500' },
  { value: '30+', label: 'Institutions', color: 'from-blue-400 to-indigo-500' },
  { value: '50+', label: 'Companies', color: 'from-teal-400 to-emerald-500' },
  { value: '100+', label: 'Datasets', color: 'from-purple-400 to-violet-500' },
];

const features = [
  {
    icon: '🚀',
    title: 'AI Innovation Showcase',
    desc: 'Publish student projects, prototypes, and GitHub-backed work so companies and institutions can discover real local talent.',
    to: '/projects',
    accent: 'from-amber-50 to-orange-50',
    border: 'border-amber-100',
    tag: 'Projects',
    tagColor: 'bg-amber-100 text-amber-700',
  },
  {
    icon: '📊',
    title: 'District Dataset Library',
    desc: 'Explore open datasets for agriculture, water, education, health, population, and industry in Virudhunagar.',
    to: '/datasets',
    accent: 'from-blue-50 to-indigo-50',
    border: 'border-blue-100',
    tag: 'Datasets',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    icon: '🎯',
    title: 'Campus & Industry Events',
    desc: 'Bring hackathons, workshops, seminars, and regional programs into one visible event stream.',
    to: '/events',
    accent: 'from-teal-50 to-emerald-50',
    border: 'border-teal-100',
    tag: 'Events',
    tagColor: 'bg-teal-100 text-teal-700',
  },
  {
    icon: '🏆',
    title: 'Student & Institution Rankings',
    desc: 'Use the leaderboard to highlight active contributors and the campuses driving district innovation forward.',
    to: '/leaderboard',
    accent: 'from-purple-50 to-violet-50',
    border: 'border-purple-100',
    tag: 'Leaderboard',
    tagColor: 'bg-purple-100 text-purple-700',
  },
  {
    icon: '🔍',
    title: 'Industry Discovery Layer',
    desc: 'Help companies shortlist promising student work, bookmark projects, and return to the best local ideas quickly.',
    to: '/projects',
    accent: 'from-rose-50 to-pink-50',
    border: 'border-rose-100',
    tag: 'Discovery',
    tagColor: 'bg-rose-100 text-rose-700',
  },
  {
    icon: '🌐',
    title: 'Regional Identity Platform',
    desc: 'Show Virudhunagar as a connected innovation ecosystem instead of separate colleges and scattered data.',
    to: '/dashboard',
    accent: 'from-slate-50 to-gray-50',
    border: 'border-slate-100',
    tag: 'Ecosystem',
    tagColor: 'bg-slate-100 text-slate-700',
  },
];

const audience = [
  {
    emoji: '🎓',
    title: 'For Students',
    desc: 'Turn academic projects into a portfolio that looks credible, searchable, and visible beyond your campus.',
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
    border: 'border-amber-200',
  },
  {
    emoji: '🏛️',
    title: 'For Colleges',
    desc: 'Present campus achievements, events, and student innovation in one polished district-wide public space.',
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    border: 'border-blue-200',
  },
  {
    emoji: '🏢',
    title: 'For Companies',
    desc: 'Discover practical talent, browse projects by domain, and connect with institutions building strong work.',
    gradient: 'from-teal-500 to-emerald-600',
    bg: 'bg-gradient-to-br from-teal-50 to-emerald-50',
    border: 'border-teal-200',
  },
];

const sectors = [
  { name: 'Agriculture', icon: '🌾' },
  { name: 'Manufacturing', icon: '🏭' },
  { name: 'Education', icon: '📚' },
  { name: 'Water', icon: '💧' },
  { name: 'Health', icon: '🏥' },
  { name: 'AI Projects', icon: '🤖' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-4 pt-8 pb-16 md:pt-12 md:pb-24">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="absolute -top-20 right-0 w-80 h-80 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-100/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-amber-200 shadow-sm text-xs font-semibold text-amber-700 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Virudhunagar District Innovation Platform
            </span>
          </div>

          {/* Headline */}
          <div className="text-center max-w-5xl mx-auto mb-10">
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight">
              Where Virudhunagar's
              <span className="block shimmer-text mt-1">Talent Meets Opportunity</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
              A digital platform for student projects, industry collaboration, institutional visibility, open datasets, and regional innovation across Virudhunagar.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-14">
            <Link
              to="/projects"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-base shadow-xl hover:shadow-amber-200 hover:scale-105 transition-all duration-200"
            >
              Browse Projects
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              to={user ? '/dashboard' : '/register'}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-800 font-semibold text-base shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
            >
              {user ? 'Open Dashboard' : 'Join the Platform'}
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="relative group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 text-center overflow-hidden">
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.color}`} />
                <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUDIENCE ── */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">Built for everyone</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">One platform. Three clear reasons to join.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {audience.map((item) => (
              <div key={item.title} className={`relative rounded-3xl border ${item.border} ${item.bg} p-7 overflow-hidden group hover:-translate-y-1 transition-transform duration-200`}>
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} text-2xl shadow-lg mb-5`}>
                  {item.emoji}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES BENTO GRID ── */}
      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Platform Features</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Everything you need to connect, collaborate & grow.</h2>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {features.map((card) => (
              <Link
                key={card.title}
                to={card.to}
                className={`group relative rounded-3xl border ${card.border} bg-gradient-to-br ${card.accent} p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 overflow-hidden`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{card.icon}</span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${card.tagColor}`}>{card.tag}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-amber-700 transition-colors">{card.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-amber-600 transition-colors">
                  Explore <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTORS ── */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-12 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">Regional Focus</p>
                <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
                  Built around local sectors & local opportunity.
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  The platform is designed around the kinds of work, data, and collaboration that matter in Virudhunagar — not a generic solution.
                </p>
                <div className="flex flex-wrap gap-3">
                  {sectors.map((s) => (
                    <span key={s.name} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-medium text-white hover:bg-white/20 transition-colors cursor-default">
                      {s.icon} {s.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { num: '01', title: 'Celebrate local innovation', desc: 'A digital stage for local intelligence, entrepreneurship, and student work.' },
                  { num: '02', title: 'Connect education with industry', desc: 'Closes the gap between student output and company discovery.' },
                  { num: '03', title: 'One identity for the district', desc: 'Virudhunagar as a connected ecosystem of institutions and companies.' },
                ].map((item) => (
                  <div key={item.num} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <span className="text-xs font-bold text-amber-400 mt-0.5 shrink-0">{item.num}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{item.title}</p>
                      <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {!user && (
        <section className="px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-10 md:p-14 shadow-2xl">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-3">Join the movement</p>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                  Bring your project into Virudhunagar's growing digital ecosystem.
                </h2>
                <p className="text-white/80 text-base max-w-2xl mx-auto mb-8 leading-relaxed">
                  Create an account to publish projects, explore datasets, join events, and become part of a regional platform built for long-term visibility.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/register" className="px-8 py-4 rounded-2xl bg-white text-orange-600 font-bold text-base hover:scale-105 transition-transform shadow-lg">
                    Get Started Free
                  </Link>
                  <Link to="/events" className="px-8 py-4 rounded-2xl bg-white/20 border border-white/30 text-white font-semibold text-base hover:bg-white/30 transition-colors">
                    Explore Events
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 py-10 px-4">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-black">VA</div>
            <div>
              <p className="text-sm font-bold text-white">Virudhunagar AI Innovation Platform</p>
              <p className="text-xs text-slate-400">Empowering Virudhunagar through innovation and AI</p>
            </div>
          </div>
          <div className="flex gap-6 text-xs text-slate-400">
            <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
            <Link to="/datasets" className="hover:text-white transition-colors">Datasets</Link>
            <Link to="/events" className="hover:text-white transition-colors">Events</Link>
            <Link to="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
          </div>
          <p className="text-xs text-slate-500">© 2025 All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}

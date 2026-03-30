import { useEffect, useState } from 'react';
import { leaderboardAPI } from '../api';

const podiumColors = [
  { bg: 'from-amber-400 to-yellow-500', ring: 'ring-amber-400', label: '🥇', size: 'w-20 h-20 text-2xl' },
  { bg: 'from-slate-300 to-slate-400', ring: 'ring-slate-300', label: '🥈', size: 'w-16 h-16 text-xl' },
  { bg: 'from-orange-400 to-amber-600', ring: 'ring-orange-400', label: '🥉', size: 'w-16 h-16 text-xl' },
];

export default function Leaderboard() {
  const [tab, setTab] = useState('students');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    leaderboardAPI.get(tab)
      .then(({ data }) => setData(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load leaderboard'))
      .finally(() => setLoading(false));
  }, [tab]);

  const getName = (item) => tab === 'students' ? item.name : item._id;
  const getScore = (item) => tab === 'students' ? item.score : item.totalScore;
  const getSub = (item) => tab === 'students'
    ? `${item.institution || 'No institution'} · ${item.projectCount} project${item.projectCount !== 1 ? 's' : ''}`
    : `${item.members} member${item.members !== 1 ? 's' : ''}`;

  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-1">Rankings</p>
          <h1 className="text-3xl font-extrabold text-slate-900">Leaderboard</h1>
          <p className="text-sm text-slate-400 mt-1">Top performers on the Virudhunagar AI Platform</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Tab Toggle */}
        <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit">
          {[
            { key: 'students', label: '🎓 Students' },
            { key: 'institutions', label: '🏛️ Institutions' },
          ].map((entry) => (
            <button
              key={entry.key} type="button"
              onClick={() => setTab(entry.key)}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === entry.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {entry.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-100 p-4 animate-pulse flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-4xl mb-4">🏆</p>
            <p className="text-lg font-bold text-slate-700">No data yet</p>
            <p className="text-sm text-slate-400 mt-1">Be the first to contribute!</p>
          </div>
        ) : (
          <>
            {/* Podium — top 3 */}
            {top3.length > 0 && (
              <div className="mb-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl" />
                <p className="text-center text-xs font-bold uppercase tracking-widest text-amber-400 mb-8">Top Performers</p>

                <div className="flex items-end justify-center gap-4 md:gap-8">
                  {/* 2nd place */}
                  {top3[1] && (
                    <div className="flex flex-col items-center gap-2 mb-0">
                      <div className={`${podiumColors[1].size} rounded-full bg-gradient-to-br ${podiumColors[1].bg} ring-4 ${podiumColors[1].ring} flex items-center justify-center font-bold text-white shadow-lg`}>
                        {getName(top3[1]).charAt(0).toUpperCase()}
                      </div>
                      <p className="text-white font-semibold text-sm text-center max-w-[80px] truncate">{getName(top3[1])}</p>
                      <p className="text-slate-400 text-xs">{getScore(top3[1])} pts</p>
                      <div className="w-20 h-16 rounded-t-xl bg-slate-600 flex items-center justify-center text-2xl">🥈</div>
                    </div>
                  )}
                  {/* 1st place */}
                  {top3[0] && (
                    <div className="flex flex-col items-center gap-2 -mb-4">
                      <div className="animate-float">
                        <div className={`${podiumColors[0].size} rounded-full bg-gradient-to-br ${podiumColors[0].bg} ring-4 ${podiumColors[0].ring} flex items-center justify-center font-bold text-white shadow-xl text-2xl`}>
                          {getName(top3[0]).charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <p className="text-white font-bold text-sm text-center max-w-[100px] truncate">{getName(top3[0])}</p>
                      <p className="text-amber-400 text-sm font-bold">{getScore(top3[0])} pts</p>
                      <div className="w-24 h-24 rounded-t-xl bg-amber-500/30 border border-amber-500/50 flex items-center justify-center text-3xl">🥇</div>
                    </div>
                  )}
                  {/* 3rd place */}
                  {top3[2] && (
                    <div className="flex flex-col items-center gap-2 mb-0">
                      <div className={`${podiumColors[2].size} rounded-full bg-gradient-to-br ${podiumColors[2].bg} ring-4 ${podiumColors[2].ring} flex items-center justify-center font-bold text-white shadow-lg`}>
                        {getName(top3[2]).charAt(0).toUpperCase()}
                      </div>
                      <p className="text-white font-semibold text-sm text-center max-w-[80px] truncate">{getName(top3[2])}</p>
                      <p className="text-slate-400 text-xs">{getScore(top3[2])} pts</p>
                      <div className="w-20 h-10 rounded-t-xl bg-orange-700/50 flex items-center justify-center text-2xl">🥉</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rest of the list */}
            {rest.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                {rest.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <span className="w-8 text-center text-sm font-bold text-slate-400">#{i + 4}</span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                      {getName(item).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{getName(item)}</p>
                      <p className="text-xs text-slate-400 truncate">{getSub(item)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-purple-600">{getScore(item)}</p>
                      <p className="text-xs text-slate-400">points</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Score info */}
        <div className="mt-6 rounded-2xl bg-purple-50 border border-purple-100 p-5">
          <p className="text-sm font-bold text-purple-900 mb-2">How scores are calculated</p>
          <div className="flex flex-wrap gap-3">
            {[
              { action: 'Upload project', pts: '+5' },
              { action: 'Receive rating', pts: '+2' },
              { action: 'Receive comment', pts: '+1' },
            ].map((s) => (
              <span key={s.action} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-purple-100 text-xs text-purple-700">
                <span className="font-bold text-purple-500">{s.pts}</span> {s.action}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

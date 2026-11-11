import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth-context';

const stats = [
  { value: '3 yrs', label: 'TypeScript · NestJS · React' },
  { value: '2,000+/min', label: 'transactions in production' },
  { value: '5,000+/min', label: 'real-time updates served' },
  { value: '99.99%', label: 'uptime on live systems' },
];

const highlights = [
  {
    title: 'I know this product space',
    detail:
      'Worked on Eduvation, an e-learning platform with live sessions, online courses and content recommendations — the same problems Easygenerator solves for its customers.',
    icon: '🎓',
  },
  {
    title: 'Owned the meetings feature end-to-end',
    detail:
      'My core role on Eduvation: WebRTC live video classrooms powered by LiveKit, integrated from the NestJS back end through to the student and instructor dashboards.',
    icon: '🎥',
  },
  {
    title: 'Real-time systems under real load',
    detail:
      'At DYNO Teck I built a location-tracking server handling 5,000+ updates per minute (NestJS, Socket.IO, MongoDB, Firebase) — shipped live on Google Play as Voltrack Rider.',
    icon: '⚡',
  },
  {
    title: 'Payments, my specialty',
    detail:
      'Led Paymob and Stripe gateway integrations (+60% transaction volume) and built a ZATCA e-invoicing flow at 100% tax-authority compliance — payment flows are familiar ground.',
    icon: '💳',
  },
  {
    title: 'Front to back, DB schema to deployed UI',
    detail:
      'React/Next.js + Tailwind on the front, NestJS + Mongoose on the back, Docker and CI/CD pipelines in between — exactly the spread this full-stack task covers.',
    icon: '🧩',
  },
  {
    title: 'Battle-tested reliability',
    detail:
      'An accounting microservice at 2,000+ tpm and 99.99% uptime, PM2 performance profiling, CI/CD that cut deployment errors 90% — production discipline, not just features.',
    icon: '🛡️',
  },
];

export function AppPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <img src="/logo.svg" alt="Easygenerator" className="h-7" />
        <button
          onClick={() => {
            logout();
            navigate('/signin');
          }}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Logout
        </button>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-16 pt-10">
        {/* Required welcome message, branded */}
        <section className="relative overflow-hidden rounded-2xl bg-[#FC794B] px-8 py-10 text-white shadow-lg shadow-orange-200">
          <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" aria-hidden="true" />
          <h1 className="text-3xl font-bold sm:text-4xl">Welcome to the application.</h1>
          {user && (
            <p className="mt-2 text-white/90">
              Signed in as <span className="font-semibold">{user.name}</span> ({user.email})
            </p>
          )}
          <p className="mt-4 max-w-xl text-sm text-white/80">
            Who's behind this task — and why this role fits.
          </p>
        </section>

        {/* Stat strip */}
        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-center shadow-sm">
              <div className="text-lg font-bold text-[#FC794B] sm:text-xl">{s.value}</div>
              <div className="mt-1 text-[11px] leading-tight text-slate-500">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Experience brief */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">Why I'm a fit for this role</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
            I'm a full-stack engineer who's spent 3 years building production systems on{' '}
            <strong className="text-slate-900">NestJS + MongoDB + React</strong>. I've worked on{' '}
            <strong className="text-slate-900">Eduvation</strong>, a courses platform delivering live sessions, online
            courses and personalized content recommendations, where my main responsibility was the{' '}
            <strong className="text-slate-900">meetings feature — WebRTC live video classrooms powered by LiveKit</strong>,
            owned end-to-end from back end to dashboard. Before that I shipped high-throughput real-time and payments
            infrastructure in production. Courses platform experience plus the exact stack of this task: that's the
            combination I bring to Easygenerator from day one.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {highlights.map((h) => (
              <div
                key={h.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#FC794B]/40 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl" aria-hidden="true">{h.icon}</span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{h.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{h.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-10 text-center text-xs text-slate-400">
          Full-stack task · NestJS + MongoDB + React + TypeScript · dockerized with seeded demo accounts
        </footer>
      </main>
    </div>
  );
}

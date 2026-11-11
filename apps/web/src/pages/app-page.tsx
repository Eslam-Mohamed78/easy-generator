import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth-context';

const capabilities = [
  {
    title: 'Live Sessions & Meetings',
    detail: 'WebRTC video classrooms powered by LiveKit — real-time teaching at scale, which is exactly the meeting feature space Easygenerator builds in.',
    icon: '🎥',
    tag: 'Core focus',
  },
  {
    title: 'Real-Time Chat',
    detail: 'In-class messaging between students and instructors during live sessions, built on the same NestJS gateway patterns as this auth API.',
    icon: '💬',
    tag: 'Real-time',
  },
  {
    title: 'Payments & Monetization',
    detail: 'Secure Stripe checkout for course purchases — handling real money flows in an education product.',
    icon: '💳',
    tag: 'Stripe',
  },
  {
    title: 'Course Recommendations',
    detail: 'A personalized recommendation engine that suggests courses from student progress and interests.',
    icon: '🎯',
    tag: 'Personalization',
  },
  {
    title: 'Role-Based Dashboards',
    detail: 'Separate student and instructor dashboards with granular, role-aware access control.',
    icon: '🧑‍🏫',
    tag: 'RBAC',
  },
  {
    title: 'Progress Tracking',
    detail: 'Durable student progress tracking across courses and lessons.',
    icon: '📈',
    tag: 'Analytics',
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

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-10">
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
            Built as a full-stack authentication module — and here's where I've shipped education tech before.
          </p>
        </section>

        {/* Eduvation showcase */}
        <section className="mt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              My graduation project: <span className="text-[#FC794B]">Eduvation Learning Platform</span>
            </h2>
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Relevant experience</span>
          </div>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            A full-stack e-learning platform built with <strong>NestJS</strong> (the same framework as this API): live
            sessions, online courses, and intelligent content recommendations. It demonstrates I've already worked on
            the exact problem space Easygenerator operates in — and I built its <strong>meeting feature</strong>
            end-to-end.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c) => (
              <div
                key={c.title}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#FC794B]/40 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl" aria-hidden="true">{c.icon}</span>
                  <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#FC794B]">
                    {c.tag}
                  </span>
                </div>
                <h3 className="mt-3 font-semibold text-slate-900">{c.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{c.detail}</p>
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

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CheckCircle2, KeyRound, Lock } from 'lucide-react';
import { Button } from '../../components/ui';

const API_ROUTE = '/api/partners';
const BRAND_LOGO_URL = '/harbor-global-logo-clean.png';

function getInitialResetParam(name) {
  if (typeof window === 'undefined') {
    return '';
  }

  return new URLSearchParams(window.location.search).get(name) || '';
}

async function confirmPasswordReset({ email, token, password }) {
  const response = await fetch(API_ROUTE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'password-reset-confirm',
      email,
      token,
      password,
    }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Passwort konnte nicht gespeichert werden.');
  }

  return data;
}

export default function PasswordResetPage() {
  const [email, setEmail] = useState(() => getInitialResetParam('email'));
  const [token] = useState(() => getInitialResetParam('token'));
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!email || !token) {
      setError('Reset-Link ist unvollständig oder abgelaufen.');
      return;
    }

    if (password.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen haben.');
      return;
    }

    if (password !== passwordRepeat) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }

    setLoading(true);

    try {
      const data = await confirmPasswordReset({ email, token, password });
      setMessage(data.message || 'Passwort wurde gespeichert. Du kannst dich jetzt einloggen.');
      setCompleted(true);
      setPassword('');
      setPasswordRepeat('');
    } catch (resetError) {
      setError(resetError.message || 'Passwort konnte nicht gespeichert werden.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#080808] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(47,94,137,0.22),transparent_30%)]" />
      <section className="relative flex min-h-screen items-center justify-center p-5">
        <div className="w-full max-w-xl rounded-[2rem] border border-yellow-300/20 bg-white/[0.07] p-6 shadow-2xl shadow-yellow-500/10 backdrop-blur-xl md:p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BRAND_LOGO_URL} alt="Harbor Global Partner Academy" className="mb-8 h-20 w-auto object-contain" />
          <div className="mb-6 flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/15 text-yellow-100 ring-1 ring-yellow-200/35">
              <KeyRound size={22} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-200">Harbor Global Partner Academy</p>
              <h1 className="mt-2 text-3xl font-black">Passwort zurücksetzen</h1>
              <p className="mt-2 text-sm leading-relaxed text-white/60">Gib dein neues Passwort ein. Der Reset-Link ist zeitlich begrenzt gültig.</p>
            </div>
          </div>

          {completed ? (
            <div className="rounded-3xl border border-green-300/25 bg-green-400/10 p-5">
              <CheckCircle2 className="mb-3 text-green-200" size={34} />
              <p className="font-bold text-green-100">{message}</p>
              <Link href="/?login=1" className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-yellow-400 px-5 py-3 font-black text-black transition hover:bg-yellow-300">
                Weiter zum Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs text-white/50">E-Mail-Adresse</span>
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-300/70" autoComplete="email" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-white/50">Neues Passwort</span>
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-300/70" autoComplete="new-password" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-white/50">Passwort wiederholen</span>
                <input value={passwordRepeat} onChange={(event) => setPasswordRepeat(event.target.value)} type="password" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-300/70" autoComplete="new-password" />
              </label>
              {error && <div className="rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>}
              {message && <div className="rounded-2xl border border-green-300/20 bg-green-400/10 px-4 py-3 text-sm text-green-100">{message}</div>}
              <Button disabled={loading} className="h-12 w-full rounded-2xl bg-yellow-400 font-bold text-black hover:bg-yellow-300 disabled:opacity-60">
                <Lock size={17} />
                {loading ? 'Wird gespeichert...' : 'Passwort speichern'}
              </Button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell, BookOpen, CalendarDays, CheckCircle2, ChevronRight, Crown, Download,
  FileQuestion, Flame, Globe2, ImagePlus, Lock, Mail, MessageCircle, Music2,
  PlayCircle, Search, Settings, ShieldCheck, Star, Trophy, Upload, Users, Video,
  Volume2, X
} from 'lucide-react';
import { Card, CardContent, Button } from '../components/ui';

const languages = ['Deutsch', 'English', 'Русский', 'Română', 'Türkçe', 'Ελληνικά', 'Čeština'];

const modules = [
  { id: 1, title: 'Willkommen & Academy benutzen', progress: 100, lessons: 3, icon: Crown, lang: ['DE', 'RU', 'RO', 'EN'] },
  { id: 2, title: 'Mindset & Start als Partner', progress: 85, lessons: 5, icon: Flame, lang: ['DE', 'RU', 'RO'] },
  { id: 3, title: 'Produktwissen & Wasser erklären', progress: 65, lessons: 8, icon: BookOpen, lang: ['DE', 'RU', 'RO', 'EN', 'TR'] },
  { id: 4, title: 'Social Media & Content System', progress: 42, lessons: 10, icon: Video, lang: ['DE', 'RU', 'RO', 'EN'] },
  { id: 5, title: 'Kundengespräche & Abschluss', progress: 25, lessons: 7, icon: MessageCircle, lang: ['DE', 'RU', 'RO'] },
  { id: 6, title: 'Partner gewinnen & Teamaufbau', progress: 0, lessons: 6, icon: Users, lang: ['DE', 'RU', 'RO', 'EN'] },
];

const partners = [
  { name: 'Leonid Curos', status: 'Mentor', companyLevel: 'Top Leader', points: 12840, rank: 1, progress: 96, active: 'Heute', avatar: 'LC' },
  { name: 'Carina C.', status: 'Leader', companyLevel: 'Gold', points: 8240, rank: 2, progress: 84, active: 'Heute', avatar: 'CC' },
  { name: 'Marius K.', status: 'Aktiv', companyLevel: 'Silver', points: 4210, rank: 3, progress: 62, active: 'Gestern', avatar: 'MK' },
  { name: 'Irina P.', status: 'Fortgeschritten', companyLevel: 'Bronze', points: 3870, rank: 4, progress: 71, active: 'Heute', avatar: 'IP' },
];

const bookings = [
  { date: '15. Sep', time: '18:00', type: 'Zoom-Call', name: 'Marius K.' },
  { date: '10. Okt', time: '19:30', type: '1:1 Führung', name: 'Irina P.' },
  { date: '22. Okt', time: '17:00', type: 'Telefonat', name: 'Alex B.' },
];

const qas = [
  { q: 'Wie arbeite ich mit einem PDF?', tag: 'PDF · Ressourcen', video: true, module: 'Modul 1' },
  { q: 'Wie erkläre ich den PPM-Test einfach?', tag: 'Produktwissen', video: true, module: 'Modul 3' },
  { q: 'Was schreibe ich nach Interesse per WhatsApp?', tag: 'Verkauf', video: false, module: 'Modul 5' },
];

const resources = ['WhatsApp Skripte', 'Instagram Captions', 'Reels Hooks', 'Produkt PDFs', 'Einwandbehandlung', 'Canva Vorlagen'];

export default function HarborGlobalPartnerAcademy() {
  const [view, setView] = useState('login');
  const [soundOn, setSoundOn] = useState(true);
  const [selectedModule, setSelectedModule] = useState(modules[0]);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Deutsch');
  const [registrationSent, setRegistrationSent] = useState(false);

  const overallProgress = useMemo(() => Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length), []);

  if (view === 'login') {
    return (
      <Shell>
        <div className="min-h-screen grid lg:grid-cols-2 relative">
          <div className="flex items-center justify-center p-5 md:p-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl">
              <Brand />
              <h1 className="text-4xl md:text-6xl font-black mt-10 leading-tight">Private Partner Academy</h1>
              <p className="text-white/60 mt-5 text-lg">Geschlossene Plattform für aktive Partner. Registrierung nur mit persönlichem Rabattcode und Admin-Bestätigung.</p>
              <div className="grid md:grid-cols-3 gap-3 mt-8">
                <MiniFeature icon={Lock} title="Geschützt" text="Nur echte Partner" />
                <MiniFeature icon={Globe2} title="Mehrsprachig" text="Europa-ready" />
                <MiniFeature icon={ShieldCheck} title="Admin-Freigabe" text="Kontrollierter Zugang" />
              </div>
            </motion.div>
          </div>
          <div className="flex items-center justify-center p-5 md:p-10">
            <Card className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.07] backdrop-blur-xl text-white shadow-2xl">
              <CardContent className="p-6 md:p-8">
                {!registrationSent ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div><h2 className="text-2xl font-bold">Partner registrieren</h2><p className="text-white/50 text-sm">Zugang wird nach Prüfung freigeschaltet.</p></div>
                      <div className="h-12 w-12 rounded-2xl bg-yellow-400 text-black flex items-center justify-center font-black">HG</div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input label="Vorname" /><Input label="Nachname" /><Input label="E-Mail" /><Input label="WhatsApp / Telefon" />
                      <Input label="Persönlicher Rabattcode" /><Input label="Land / Stadt" />
                      <Select label="Sprache" options={languages} value={selectedLanguage} onChange={setSelectedLanguage} />
                      <UploadBox label="Profilfoto hochladen" />
                      <Input label="Passwort" password /><Input label="Passwort wiederholen" password />
                    </div>
                    <Button onClick={() => setRegistrationSent(true)} className="w-full mt-6 rounded-2xl bg-yellow-400 text-black hover:bg-yellow-300 font-bold h-12">Registrierung senden</Button>
                    <div className="mt-4 rounded-2xl bg-black/30 border border-yellow-400/20 p-4 text-sm text-white/60">Nach der Registrierung ist der Zugang gesperrt, bis der Admin den Partner freischaltet. Das Dashboard ist vorher nicht sichtbar.</div>
                  </>
                ) : (
                  <div className="text-center py-10">
                    <CheckCircle2 className="mx-auto text-yellow-300 mb-5" size={64} />
                    <h2 className="text-3xl font-black">Danke für deine Registrierung!</h2>
                    <p className="text-white/60 mt-4">Deine Anmeldung wurde erfolgreich gesendet. Bitte warte auf die Bestätigung vom Admin. Nach Freigabe bekommst du automatisch eine Nachricht per E-Mail oder WhatsApp.</p>
                    <div className="mt-6 rounded-3xl bg-black/30 border border-white/10 p-4 text-left">
                      <p className="font-bold flex items-center gap-2"><Bell size={18} className="text-yellow-300"/> Automatische Nachricht</p>
                      <p className="text-sm text-white/55 mt-2">„Danke für deine Registrierung in der Harbor Global Partner Academy. Deine Daten werden geprüft. Du erhältst eine Nachricht, sobald dein Zugang freigeschaltet wurde.“</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="relative flex min-h-screen">
        <aside className="hidden lg:flex w-72 flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl p-6">
          <Brand />
          <nav className="space-y-2 text-sm mt-10">
            {[["Dashboard", Crown], ["Module", BookOpen], ["Community Chat", MessageCircle], ["Termin buchen", CalendarDays], ["Q&A Center", FileQuestion], ["Uploads", Upload], ["Partner Status", Trophy], ["Ressourcen", Download], ["Admin", Settings]].map(([label, Icon]) => <button key={label} className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-white/75 hover:text-white hover:bg-white/10 transition"><Icon size={18} /> {label}</button>)}
          </nav>
          <div className="mt-auto rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-4"><div className="flex items-center gap-2 text-yellow-200 font-semibold mb-2"><Lock size={16}/> Admin bestätigt Zugang</div><p className="text-xs text-white/55">Registrierung nur mit persönlichem Rabattcode.</p></div>
        </aside>
        <main className="flex-1 p-4 md:p-8 space-y-6">
          <Header soundOn={soundOn} setSoundOn={setSoundOn} selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
          <section className="grid grid-cols-1 xl:grid-cols-4 gap-5">
            <Card className="xl:col-span-2 rounded-[2rem] border border-white/10 bg-white/[0.06] backdrop-blur-xl text-white overflow-hidden"><CardContent className="p-6 md:p-8"><div className="flex items-center justify-between mb-6"><div><h3 className="text-2xl font-bold">Dein Academy-Fortschritt</h3><p className="text-white/50 text-sm mt-1">Status, Module und Tagesaufgabe auf einen Blick.</p></div><div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-yellow-300 to-yellow-700 text-black flex items-center justify-center font-black text-xl">{overallProgress}%</div></div><div className="h-4 rounded-full bg-white/10 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${overallProgress}%` }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-yellow-500 to-yellow-200" /></div><div className="grid grid-cols-3 gap-3 mt-6"><Stat icon={Star} label="Status" value="Mentor" /><Stat icon={Trophy} label="GoGlobal Level" value="Top Leader" /><Stat icon={Flame} label="Serie" value="12 Tage" /></div></CardContent></Card>
            <ActionCard icon={PlayCircle} title="Start-Video" text="So benutzt du die Academy Schritt für Schritt." button="Intro ansehen" />
            <ActionCard icon={CalendarDays} title="Nächster Termin" text="15. Sep · 18:00 · Zoom-Call" button="Termin buchen" />
          </section>
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <Card className="xl:col-span-2 rounded-[2rem] border border-white/10 bg-white/[0.06] backdrop-blur-xl text-white"><CardContent className="p-6 md:p-8"><div className="flex items-center justify-between mb-6"><div><h3 className="text-2xl font-bold">Schulungsmodule</h3><p className="text-white/50 text-sm">Mehrsprachige Videos, Aufgaben und Downloads.</p></div><Button className="rounded-2xl bg-yellow-400 text-black hover:bg-yellow-300 font-bold px-4 py-2"><Upload size={16}/> Neues Modul</Button></div><div className="grid md:grid-cols-2 gap-4">{modules.map((m) => { const Icon = m.icon; return <button key={m.id} onClick={() => setSelectedModule(m)} className={`text-left rounded-3xl border p-5 transition ${selectedModule.id === m.id ? 'border-yellow-300 bg-yellow-400/10' : 'border-white/10 bg-black/20 hover:bg-white/10'}`}><div className="flex items-center gap-3 mb-4"><div className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center"><Icon size={20}/></div><div><p className="font-bold">Modul {m.id}</p><p className="text-sm text-white/55">{m.lessons} Lektionen · {m.lang.join('/')}</p></div></div><h4 className="font-semibold mb-3">{m.title}</h4><div className="h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-yellow-300" style={{ width: `${m.progress}%` }}/></div><p className="text-xs text-white/50 mt-2">{m.progress}% abgeschlossen</p></button>; })}</div></CardContent></Card>
            <Card className="rounded-[2rem] border border-white/10 bg-white/[0.06] backdrop-blur-xl text-white"><CardContent className="p-6"><h3 className="text-2xl font-bold mb-2">Aktuelles Modul</h3><p className="text-yellow-300 font-semibold">Modul {selectedModule.id}</p><h4 className="text-xl font-bold mt-1">{selectedModule.title}</h4><div className="flex gap-2 mt-4 flex-wrap">{selectedModule.lang.map((l) => <span key={l} className="px-3 py-1 rounded-full bg-white/10 text-xs">{l}</span>)}</div><div className="relative mt-5 aspect-video rounded-3xl bg-black/60 border border-white/10 flex items-center justify-center overflow-hidden">{!showVideo ? <button onClick={() => setShowVideo(true)} className="flex flex-col items-center gap-2 text-white/80 hover:text-white"><PlayCircle size={54} className="text-yellow-300"/> Video starten · Musik stoppt automatisch</button> : <div className="text-center p-5"><button onClick={() => setShowVideo(false)} className="absolute top-3 right-3"><X size={18}/></button><Video className="mx-auto text-yellow-300 mb-3" size={42}/><p className="font-bold">Schulungsvideo läuft</p><p className="text-xs text-white/50 mt-1">Hintergrundmusik ist pausiert.</p></div>}</div><Button className="w-full mt-5 rounded-2xl bg-yellow-400 text-black hover:bg-yellow-300 font-bold py-3">Als erledigt markieren</Button></CardContent></Card>
          </section>
          <section className="grid grid-cols-1 xl:grid-cols-4 gap-5">
            <Panel title="Partner Community" icon={Users}><div className="flex items-center justify-between rounded-3xl bg-black/25 border border-white/10 p-4 mb-4"><div><p className="font-bold">Live Community</p><p className="text-xs text-white/50">Partner kommunizieren und lernen zusammen.</p></div><div className="flex -space-x-2">{['LC', 'CC', 'MK', 'IP'].map((a) => <div key={a} className="h-10 w-10 rounded-full border-2 border-black bg-gradient-to-br from-yellow-300 to-yellow-700 text-black flex items-center justify-center text-xs font-black">{a}</div>)}</div></div>{['Deutschland Team', 'Social Media Room', 'Leader Gruppe'].map((room, i)=><div key={room} className="rounded-3xl bg-black/25 border border-white/10 p-4 mb-3"><div className="flex items-center justify-between mb-2"><p className="font-bold">{room}</p><span className="text-xs text-green-400">{[12,8,5][i]} online</span></div><p className="text-xs text-white/50">Fragen, Hilfe, Zooms und Teamarbeit.</p></div>)}<Button className="w-full mt-2 rounded-2xl bg-yellow-400 text-black hover:bg-yellow-300 font-bold py-3">Community öffnen</Button></Panel>
            <Panel title="Q&A Wissenscenter" icon={FileQuestion}><div className="rounded-2xl bg-black/25 border border-white/10 px-4 py-3 flex items-center gap-2 text-white/50 mb-4"><Search size={17}/> Frage oder Keyword suchen...</div><div className="space-y-3">{qas.map((item) => <div key={item.q} className="rounded-3xl bg-black/25 border border-white/10 p-4"><p className="font-bold">{item.q}</p><p className="text-xs text-white/50 mt-1">{item.tag} · {item.module} {item.video ? '· Videoantwort' : ''}</p></div>)}</div><Button className="w-full mt-5 rounded-2xl bg-white/10 hover:bg-white/15 py-3">Neue Frage stellen</Button></Panel>
            <Panel title="Partner Uploads" icon={ImagePlus}><UploadRow title="Backoffice Screenshot" text="Level, Punkte und Ranking aktualisieren" /><UploadRow title="Erfolgsnachweis" text="Für Status und Team-Motivation" /><UploadRow title="Frage mit Bild" text="Für schnelle Video-Antwort" /><Button className="w-full mt-5 rounded-2xl bg-yellow-400 text-black hover:bg-yellow-300 font-bold py-3">Datei hochladen</Button></Panel>
            <Panel title="Partner Ranking" icon={Trophy}><div className="space-y-3">{partners.map((p) => <div key={p.name} className="flex items-center gap-3 rounded-3xl bg-black/25 border border-white/10 p-3"><div className="text-yellow-300 font-bold w-5">#{p.rank}</div><div className="h-11 w-11 rounded-full bg-gradient-to-br from-white/25 to-white/5 border border-white/15 flex items-center justify-center text-sm font-bold">{p.avatar}</div><div className="flex-1 min-w-0"><p className="font-semibold truncate">{p.name}</p><p className="text-xs text-white/50">{p.status} · {p.companyLevel} · {p.points} P</p></div></div>)}</div></Panel>
          </section>
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <Panel title="Terminbuchungen" icon={CalendarDays}>{bookings.map((b) => <div key={`${b.date}-${b.name}`} className="rounded-3xl bg-black/25 border border-white/10 p-4 mb-3"><p className="font-bold">{b.date} · {b.time}</p><p className="text-sm text-white/60">{b.type} mit {b.name}</p></div>)}<Button className="w-full mt-2 rounded-2xl bg-white/10 hover:bg-white/15 py-3">Kalender öffnen</Button></Panel>
            <Panel title="Ressourcen" icon={Download}><div className="grid grid-cols-2 gap-3">{resources.map((r) => <button key={r} className="rounded-3xl bg-black/25 border border-white/10 p-4 text-sm text-left hover:bg-white/10 transition">{r}</button>)}</div><Button className="w-full mt-5 rounded-2xl bg-yellow-400 text-black hover:bg-yellow-300 font-bold py-3">Download Center</Button></Panel>
            <Panel title="Benachrichtigungen" icon={Bell}><p className="text-white/60">Bei neuen Videos, Modulen, Antworten oder Terminen gehen automatische Nachrichten per E-Mail oder WhatsApp raus.</p><div className="mt-4 space-y-2"><Badge icon={Mail} text="E-Mail aktiv"/><Badge icon={MessageCircle} text="WhatsApp aktiv"/></div></Panel>
          </section>
        </main>
      </div>
    </Shell>
  );
}

function Shell({ children }) { return <div className="min-h-screen bg-[#080808] text-white overflow-hidden"><div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(47,94,137,0.22),transparent_30%)]" /> <div className="relative">{children}</div></div>; }
function Brand() { return <div className="flex items-center gap-3"><div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-700 flex items-center justify-center font-black text-black shadow-lg shadow-yellow-500/20">HG</div><div><h1 className="font-bold leading-tight">Harbor Global</h1><p className="text-xs text-white/55">Partner Academy</p></div></div>; }
function Header({ soundOn, setSoundOn, selectedLanguage, setSelectedLanguage }) { return <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-4"><div><motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-yellow-300 text-sm font-semibold tracking-[0.25em] uppercase">Premium Partner System</motion.p><motion.h2 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-3xl md:text-5xl font-black mt-2">Willkommen, Leonid</motion.h2><p className="text-white/55 mt-2">Ein Link. Ein System. Jeder Partner wird professionell eingearbeitet.</p></div><div className="flex flex-wrap items-center gap-3"><Select label="" options={languages} value={selectedLanguage} onChange={setSelectedLanguage} small /><Button onClick={() => setSoundOn(!soundOn)} className="rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-3">{soundOn ? <Volume2 size={18}/> : <Music2 size={18}/>} {soundOn ? 'Sound an' : 'Sound aus'}</Button></div></header>; }
function Input({ label, password }) { return <label className="block"><span className="text-xs text-white/50 mb-1 block">{label}</span><input type={password ? 'password' : 'text'} className="w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:border-yellow-300/70" /></label>; }
function Select({ label, options, value, onChange, small }) { return <label className={small ? '' : 'block'}>{label && <span className="text-xs text-white/50 mb-1 block">{label}</span>}<select value={value} onChange={(e)=>onChange(e.target.value)} className="rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-yellow-300/70"><option>{value}</option>{options.filter(o=>o!==value).map(o=><option key={o}>{o}</option>)}</select></label>; }
function UploadBox({ label }) { return <div className="rounded-2xl bg-black/30 border border-dashed border-white/15 px-4 py-3 flex items-center gap-2 text-white/60"><ImagePlus size={18}/>{label}</div>; }
function MiniFeature({ icon: Icon, title, text }) { return <div className="rounded-3xl bg-white/10 border border-white/10 p-4"><Icon className="text-yellow-300 mb-3" size={22}/><p className="font-bold">{title}</p><p className="text-xs text-white/50 mt-1">{text}</p></div>; }
function Stat({ icon: Icon, label, value }) { return <div className="rounded-3xl bg-black/25 border border-white/10 p-4"><Icon size={20} className="text-yellow-300 mb-3"/><p className="text-xs text-white/50">{label}</p><p className="font-bold mt-1">{value}</p></div>; }
function ActionCard({ icon: Icon, title, text, button }) { return <Card className="rounded-[2rem] border border-white/10 bg-white/[0.06] backdrop-blur-xl text-white"><CardContent className="p-6"><div className="flex items-center gap-3 mb-4"><Icon className="text-yellow-300"/> <h3 className="font-bold text-xl">{title}</h3></div><p className="text-white/65">{text}</p><Button className="w-full mt-5 rounded-2xl bg-yellow-400 text-black hover:bg-yellow-300 font-bold py-3">{button}</Button></CardContent></Card>; }
function Panel({ title, icon: Icon, children }) { return <Card className="rounded-[2rem] border border-white/10 bg-white/[0.06] backdrop-blur-xl text-white"><CardContent className="p-6"><h3 className="text-2xl font-bold mb-5 flex items-center gap-2"><Icon className="text-yellow-300"/> {title}</h3>{children}</CardContent></Card>; }
function UploadRow({ title, text }) { return <div className="rounded-3xl bg-black/25 border border-white/10 p-4 mb-3 flex items-center justify-between gap-3"><div><p className="font-bold">{title}</p><p className="text-xs text-white/50">{text}</p></div><ChevronRight className="text-white/30" size={18}/></div>; }
function Badge({ icon: Icon, text }) { return <div className="flex items-center gap-2 rounded-2xl bg-black/25 border border-white/10 px-4 py-3 text-sm"><Icon size={16} className="text-yellow-300"/> {text}</div>; }

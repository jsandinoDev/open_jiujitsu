import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Instagram, Phone, MessageCircle, MapPin,
  Clock, CalendarDays, PlusCircle, Calendar,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { REGIONS, DAY_NAMES, DAY_SHORT, type Academy, type OpenMat } from '@/lib/academiesdata'
import { AddAcademyDialog } from '@/components/AddAcademyDialog'

function Navbar() {
  return (
    <nav className="bg-surface border-b border-zinc-950/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-display font-semibold text-xl tracking-tighter uppercase text-ink hover:text-brand transition-colors">
          Arte Suave CR
        </a>
        <div className="flex items-center gap-6 text-sm font-medium">
          <a href="#academias" className="text-ink hover:text-brand transition-colors hidden sm:inline-flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Academias
          </a>
          <a href="#open-mats" className="text-ink hover:text-brand transition-colors hidden sm:inline-flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Open Mats
          </a>
          <AddAcademyDialog>
            <button className="inline-flex items-center gap-1.5 bg-brand text-white px-3 py-1.5 rounded-sm text-sm font-medium hover:-translate-y-0.5 transition-transform">
              <PlusCircle className="w-3.5 h-3.5" />
              Agregar Academia
            </button>
          </AddAcademyDialog>
        </div>
      </div>
    </nav>
  )
}

function AcademySkeleton() {
  return (
    <div className="bg-surface ring-1 ring-zinc-950/5 overflow-hidden animate-pulse">
      <div className="w-full aspect-[4/3] bg-zinc-200" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-zinc-200 rounded w-3/4" />
        <div className="h-4 bg-zinc-200 rounded w-1/2" />
        <div className="h-16 bg-zinc-200 rounded" />
      </div>
    </div>
  )
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeRegion, setActiveRegion] = useState('Todas')
  const [activeOpenMatRegion, setActiveOpenMatRegion] = useState('Todas')

  const { data: academies = [], isLoading } = useQuery<Academy[]>({
    queryKey: ['academies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academies')
        .select('*')
        .eq('is_approved', true)
        .order('name')
      if (error) throw error
      return data ?? []
    },
  })

  const { data: openMats = [] } = useQuery<OpenMat[]>({
    queryKey: ['open_mats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('open_mats')
        .select('*')
        .order('day_of_week')
      if (error) throw error
      return data ?? []
    },
  })

  const filteredAcademies = useMemo(() =>
    academies.filter((a) => {
      const matchSearch =
        searchQuery === '' ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.city.toLowerCase().includes(searchQuery.toLowerCase())
      const matchRegion = activeRegion === 'Todas' || a.region === activeRegion
      return matchSearch && matchRegion
    }),
    [academies, searchQuery, activeRegion]
  )

  const openMatsByDay = useMemo(() => {
    const byDay: Record<number, OpenMat[]> = {}
    for (let i = 0; i < 7; i++) byDay[i] = []
    openMats.forEach((om) => {
      const academy = academies.find((a) => a.id === om.academy_id)
      const region = academy?.region ?? ''
      if (activeOpenMatRegion === 'Todas' || region === activeOpenMatRegion) {
        byDay[om.day_of_week].push(om)
      }
    })
    return byDay
  }, [openMats, academies, activeOpenMatRegion])

  const filteredOpenMats = useMemo(() =>
    openMats.filter((om) => {
      const academy = academies.find((a) => a.id === om.academy_id)
      const region = academy?.region ?? ''
      return activeOpenMatRegion === 'Todas' || region === activeOpenMatRegion
    }),
    [openMats, academies, activeOpenMatRegion]
  )

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans antialiased">
      <Navbar />

      {/* Hero */}
      <section className="bg-zinc-900 text-zinc-50 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <h1 className="font-display font-semibold text-6xl md:text-8xl leading-none tracking-tighter text-balance uppercase mb-8">
              La Red Principal de{' '}
              <span className="text-brand italic">Jiu-Jitsu</span>{' '}
              en Costa Rica
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-[56ch] text-pretty mb-12">
              Encontrá el tatami que forjará tu disciplina. Directorio completo de academias,
              horarios de open mats y la cultura del agarre en el trópico.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#academias"
                className="inline-flex items-center bg-brand text-white py-3 pr-5 pl-4 rounded-sm ring-1 ring-brand font-medium text-sm transition-transform hover:-translate-y-0.5"
              >
                <span className="mr-2">●</span>
                Explorar Academias
              </a>
              <AddAcademyDialog>
                <button className="inline-flex items-center gap-2 bg-transparent text-zinc-300 border border-zinc-700 py-3 pr-5 pl-4 rounded-sm font-medium text-sm transition-all hover:border-brand hover:text-brand hover:-translate-y-0.5">
                  <PlusCircle className="w-4 h-4" />
                  Agregar mi Academia
                </button>
              </AddAcademyDialog>
            </div>
          </div>
        </div>
      </section>

      {/* Academies */}
      <section id="academias" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h2 className="font-display font-semibold text-4xl leading-tight tracking-tighter uppercase">
                Directorio de Academias
              </h2>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((region) => (
                  <button
                    key={region}
                    onClick={() => setActiveRegion(region)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeRegion === region
                        ? 'bg-ink text-zinc-50'
                        : 'bg-zinc-200 text-ink hover:bg-zinc-300'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre o ciudad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 bg-surface border border-zinc-950/10 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-brand/50"
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => <AcademySkeleton key={i} />)}
            </div>
          ) : filteredAcademies.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-zinc-500 text-lg">No se encontraron academias con esos filtros.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveRegion('Todas') }}
                className="mt-4 text-brand font-medium hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAcademies.map((academy) => (
                <div
                  key={academy.id}
                  className="group bg-surface ring-1 ring-zinc-950/5 overflow-hidden flex flex-col hover:ring-brand/20 transition-all duration-300"
                >
                  <div className="w-full aspect-[4/3] bg-zinc-200 overflow-hidden">
                    <img
                      src={academy.image_url}
                      alt={academy.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/800x600/e4e4e7/a1a1aa?text=Academia'
                      }}
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-display font-semibold text-xl tracking-tight uppercase">
                        {academy.name}
                      </h3>
                      {academy.tags.includes('Elite') && (
                        <span className="text-[10px] bg-brand/10 text-brand px-2 py-0.5 font-bold uppercase tracking-wider shrink-0">
                          Elite
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-zinc-500 mb-4">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{academy.city}, {academy.region}</span>
                    </div>
                    <p className="text-sm text-zinc-600 mb-6 flex-1">{academy.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {academy.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 border-t border-zinc-950/5 pt-4">
                      {academy.instagram && (
                        <a href={academy.instagram} target="_blank" rel="noopener noreferrer"
                          className="text-xs font-medium uppercase tracking-tighter opacity-60 hover:opacity-100 hover:text-brand transition-all inline-flex items-center gap-1">
                          <Instagram className="w-3.5 h-3.5" /> IG
                        </a>
                      )}
                      {academy.whatsapp && (
                        <a href={academy.whatsapp} target="_blank" rel="noopener noreferrer"
                          className="text-xs font-medium uppercase tracking-tighter opacity-60 hover:opacity-100 hover:text-brand transition-all inline-flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5" /> WA
                        </a>
                      )}
                      {academy.phone && (
                        <a href={`tel:${academy.phone}`}
                          className="text-xs font-medium uppercase tracking-tighter opacity-60 hover:opacity-100 hover:text-brand transition-all inline-flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" /> {academy.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Open Mats */}
      <section id="open-mats" className="py-24 bg-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-xl mb-16">
            <h2 className="font-display font-semibold text-5xl leading-none tracking-tighter uppercase mb-6">
              Calendario de Open Mats
            </h2>
            <p className="text-zinc-600 max-w-[48ch] mb-8">
              Sesiones abiertas para practicantes de cualquier afiliación. Respeto, técnica y comunidad sin barreras.
            </p>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((region) => (
                <button
                  key={`om-${region}`}
                  onClick={() => setActiveOpenMatRegion(region)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeOpenMatRegion === region
                      ? 'bg-ink text-zinc-50'
                      : 'bg-zinc-200 text-ink hover:bg-zinc-300'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Weekly grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-px bg-zinc-300 ring-1 ring-zinc-300 overflow-hidden rounded-sm">
            {Array.from({ length: 7 }).map((_, dayIndex) => (
              <div key={dayIndex} className="bg-surface p-4 min-h-[180px]">
                <span className={`text-[10px] font-bold uppercase tracking-widest block mb-4 ${dayIndex === 6 ? 'text-brand' : 'text-zinc-400'}`}>
                  {DAY_NAMES[dayIndex]}
                </span>
                <div className="space-y-3">
                  {openMatsByDay[dayIndex].map((om) => (
                    <div key={om.id} className={`p-3 rounded-sm ${om.gi ? 'bg-zinc-100' : 'bg-brand/5 border-l-2 border-brand'}`}>
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <p className={`text-xs font-bold leading-none ${om.gi ? '' : 'text-brand'}`}>
                          {om.time_start} — {om.time_end}
                        </p>
                      </div>
                      <p className="text-sm font-display font-medium uppercase leading-tight">{om.academy_name}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{om.location}</p>
                      {om.notes && <p className="text-[10px] text-zinc-400 mt-1 italic">{om.notes}</p>}
                    </div>
                  ))}
                  {openMatsByDay[dayIndex].length === 0 && (
                    <p className="text-[10px] text-zinc-300 italic">Sin sesiones</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* List view */}
          <div className="mt-16">
            <h3 className="font-display font-semibold text-2xl tracking-tighter uppercase mb-6">
              Próximos Open Mats
            </h3>
            {filteredOpenMats.length === 0 && (
              <p className="text-sm text-zinc-400 italic py-4">No hay open mats para esta región.</p>
            )}
            {filteredOpenMats.map((om) => (
              <div key={om.id} className="group border-b border-zinc-200 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-200/50 px-4 -mx-4 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="text-2xl font-black italic text-zinc-300 group-hover:text-ink font-display w-14 shrink-0">
                    {DAY_SHORT[om.day_of_week]}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold uppercase tracking-tight font-display">{om.academy_name}</h4>
                    <p className="text-sm text-zinc-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{om.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 pl-20 md:pl-0">
                  <div className="text-sm font-medium flex items-center gap-1">
                    <CalendarDays className="w-4 h-4 text-zinc-400" />
                    {om.time_start} — {om.time_end}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${om.gi ? 'bg-zinc-200 text-zinc-700' : 'bg-brand/10 text-brand'}`}>
                    {om.gi ? 'Gi' : 'No-Gi'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-zinc-950 text-zinc-500 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="font-display font-semibold text-lg tracking-tighter uppercase text-zinc-300">
            Arte Suave CR
          </span>
          <p className="text-xs uppercase tracking-widest">
            Desarrollado para el tatami nacional • 2025
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs hover:text-zinc-300 transition-colors">Instagram</a>
            <a href="#" className="text-xs hover:text-zinc-300 transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

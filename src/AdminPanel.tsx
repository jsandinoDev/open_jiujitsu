import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@supabase/supabase-js'
import { Pencil, Trash2, Plus, X, LogOut, Upload, Image } from 'lucide-react'
import { REGIONS, DAY_NAMES } from '@/lib/academiesdata'
import type { Academy, OpenMat } from '@/lib/academiesdata'

// Admin client uses service role key to bypass RLS
const adminSupabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  (import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY) as string
)

const ADMIN_USER = import.meta.env.VITE_ADMIN_USER as string
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS as string

// ─── Shared UI ───────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">{children}</label>
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-zinc-800 border border-zinc-700 text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:border-brand placeholder:text-zinc-600 ${props.className ?? ''}`}
    />
  )
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:border-brand placeholder:text-zinc-600 resize-none"
    />
  )
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:border-brand"
    />
  )
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-zinc-900 border border-zinc-700 w-full max-w-2xl my-8 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700">
          <h3 className="font-display font-semibold text-lg tracking-tight uppercase text-zinc-100">{title}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-100 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function ConfirmDelete({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative z-10 bg-zinc-900 border border-zinc-700 p-6 max-w-sm w-full shadow-2xl">
        <p className="text-zinc-100 mb-1 font-medium">¿Eliminar este registro?</p>
        <p className="text-zinc-400 text-sm mb-6 truncate">{name}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 bg-red-700 text-white py-2 text-sm font-medium hover:bg-red-600 transition-colors">Eliminar</button>
          <button onClick={onCancel} className="flex-1 border border-zinc-600 text-zinc-300 py-2 text-sm font-medium hover:bg-zinc-800 transition-colors">Cancelar</button>
        </div>
      </div>
    </div>
  )
}

// ─── Open Mats ───────────────────────────────────────────────────────────────

const EMPTY_OPEN_MAT = {
  academy_id: '',
  academy_name: '',
  day_of_week: 1,
  time_start: '10:00',
  time_end: '12:00',
  location: '',
  gi: true,
  notes: '',
  date: '',
}

function OpenMatForm({
  initial,
  academies,
  onSave,
  onCancel,
  saving,
}: {
  initial: typeof EMPTY_OPEN_MAT
  academies: Academy[]
  onSave: (data: typeof EMPTY_OPEN_MAT) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState(initial)
  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }))

  function handleAcademyChange(id: string) {
    const ac = academies.find((a) => a.id === id)
    setForm((p) => ({ ...p, academy_id: id, academy_name: ac?.name ?? '', location: ac ? `${ac.city}, ${ac.region}` : p.location }))
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Academia *</Label>
        <Select value={form.academy_id} onChange={(e) => handleAcademyChange(e.target.value)} required>
          <option value="">Seleccionar academia...</option>
          {academies.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Día de la semana *</Label>
          <Select value={form.day_of_week} onChange={(e) => set('day_of_week', Number(e.target.value))}>
            {DAY_NAMES.map((d, i) => <option key={i} value={i}>{d}</option>)}
          </Select>
        </div>
        <div>
          <Label>Fecha específica (opcional)</Label>
          <Input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Hora inicio *</Label>
          <Input type="time" value={form.time_start} onChange={(e) => set('time_start', e.target.value)} required />
        </div>
        <div>
          <Label>Hora fin *</Label>
          <Input type="time" value={form.time_end} onChange={(e) => set('time_end', e.target.value)} required />
        </div>
      </div>

      <div>
        <Label>Lugar *</Label>
        <Input value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Ej. Escazú, Centro Comercial San Rafael" required />
      </div>

      <div className="flex items-center gap-3">
        <Label>Modalidad</Label>
        <button
          type="button"
          onClick={() => set('gi', !form.gi)}
          className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wider transition-colors ${form.gi ? 'bg-brand text-white' : 'bg-zinc-700 text-zinc-300'}`}
        >
          {form.gi ? 'Gi' : 'No-Gi'}
        </button>
      </div>

      <div>
        <Label>Notas (opcional)</Label>
        <Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={2} placeholder="Ej. Trae tu propio agua. Todos los cinturones bienvenidos." />
      </div>

      <div className="flex gap-3 pt-2 border-t border-zinc-700">
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.academy_id || !form.location}
          className="flex-1 bg-brand text-white py-2.5 text-sm font-medium hover:bg-brand/90 transition-colors disabled:opacity-40"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
        <button onClick={onCancel} className="px-6 border border-zinc-600 text-zinc-300 py-2.5 text-sm hover:bg-zinc-800 transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  )
}

function OpenMatsTab({ academies }: { academies: Academy[] }) {
  const qc = useQueryClient()
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; data: typeof EMPTY_OPEN_MAT & { id?: string } } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)

  const { data: openMats = [], isLoading } = useQuery<OpenMat[]>({
    queryKey: ['admin_open_mats'],
    queryFn: async () => {
      const { data, error } = await adminSupabase.from('open_mats').select('*').order('day_of_week')
      if (error) throw error
      return data ?? []
    },
  })

  const save = useMutation({
    mutationFn: async (form: typeof EMPTY_OPEN_MAT & { id?: string }) => {
      const { id, ...payload } = form
      const clean = { ...payload, date: payload.date || null, notes: payload.notes || null }
      if (id) {
        const { error } = await adminSupabase.from('open_mats').update(clean).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await adminSupabase.from('open_mats').insert(clean)
        if (error) throw error
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin_open_mats'] }); qc.invalidateQueries({ queryKey: ['open_mats'] }); setModal(null) },
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await adminSupabase.from('open_mats').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin_open_mats'] }); qc.invalidateQueries({ queryKey: ['open_mats'] }); setDeleteTarget(null) },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-zinc-400 text-sm">{openMats.length} open mat(s) registrados</p>
        <button
          onClick={() => setModal({ mode: 'add', data: { ...EMPTY_OPEN_MAT } })}
          className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2 text-sm font-medium hover:bg-brand/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Nuevo Open Mat
        </button>
      </div>

      {isLoading ? (
        <p className="text-zinc-500 text-sm">Cargando...</p>
      ) : openMats.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-700">
          <p className="text-zinc-500">No hay open mats todavía.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-700 text-left">
                {['Academia', 'Día', 'Hora', 'Lugar', 'Tipo', 'Fecha', ''].map((h) => (
                  <th key={h} className="pb-3 pr-4 text-xs font-bold uppercase tracking-wider text-zinc-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {openMats.map((om) => (
                <tr key={om.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                  <td className="py-3 pr-4 font-medium text-zinc-100">{om.academy_name}</td>
                  <td className="py-3 pr-4 text-zinc-300">{DAY_NAMES[om.day_of_week]}</td>
                  <td className="py-3 pr-4 text-zinc-300">{om.time_start} – {om.time_end}</td>
                  <td className="py-3 pr-4 text-zinc-400 max-w-[180px] truncate">{om.location}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${om.gi ? 'bg-zinc-700 text-zinc-300' : 'bg-brand/20 text-brand'}`}>
                      {om.gi ? 'Gi' : 'No-Gi'}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-zinc-500 text-xs">{om.date ?? '—'}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setModal({ mode: 'edit', data: { ...EMPTY_OPEN_MAT, ...om, date: om.date ?? '', notes: om.notes ?? '', id: om.id } })}
                        className="text-zinc-500 hover:text-brand transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: om.id, name: `${om.academy_name} — ${DAY_NAMES[om.day_of_week]}` })}
                        className="text-zinc-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal.mode === 'add' ? 'Nuevo Open Mat' : 'Editar Open Mat'} onClose={() => setModal(null)}>
          <OpenMatForm
            initial={modal.data}
            academies={academies}
            onSave={(form) => save.mutate({ ...form, id: (modal.data as any).id })}
            onCancel={() => setModal(null)}
            saving={save.isPending}
          />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDelete
          name={deleteTarget.name}
          onConfirm={() => remove.mutate(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

// ─── Academies ────────────────────────────────────────────────────────────────

const EMPTY_ACADEMY: Omit<Academy, 'id' | 'created_at'> & { is_approved: boolean } = {
  name: '',
  region: 'San José',
  city: '',
  address: '',
  description: '',
  instagram: '',
  whatsapp: '',
  phone: '',
  image_url: '/images/placeholder.jpg',
  tags: [],
  is_approved: true,
}

function AcademyForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: typeof EMPTY_ACADEMY & { id?: string }
  onSave: (data: typeof EMPTY_ACADEMY & { id?: string }) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState({ ...initial, tagsStr: initial.tags.join(', ') })
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }))

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}.${ext}`
      const { error: upErr } = await adminSupabase.storage
        .from('academy-images')
        .upload(filename, file, { cacheControl: '3600', upsert: true })
      if (upErr) throw upErr
      const { data: { publicUrl } } = adminSupabase.storage.from('academy-images').getPublicUrl(filename)
      set('image_url', publicUrl)
    } catch (err: any) {
      setUploadError(err.message ?? 'Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }

  function handleSave() {
    const tags = form.tagsStr.split(',').map((t) => t.trim()).filter(Boolean)
    onSave({ ...form, tags })
  }

  const regions = REGIONS.filter((r) => r !== 'Todas')

  return (
    <div className="space-y-4">
      {/* Image */}
      <div>
        <Label>Imagen</Label>
        <div className="flex gap-3 items-start">
          <div className="w-20 h-20 bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0">
            {form.image_url ? (
              <img src={form.image_url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg' }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Image className="w-6 h-6 text-zinc-600" /></div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Input value={form.image_url} onChange={(e) => set('image_url', e.target.value)} placeholder="URL de imagen o subir archivo..." />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-brand transition-colors disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              {uploading ? 'Subiendo...' : 'Subir imagen'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
          </div>
        </div>
      </div>

      <div>
        <Label>Nombre *</Label>
        <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ej. Alliance Costa Rica" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Provincia *</Label>
          <Select value={form.region} onChange={(e) => set('region', e.target.value)}>
            {regions.map((r) => <option key={r} value={r}>{r}</option>)}
          </Select>
        </div>
        <div>
          <Label>Ciudad *</Label>
          <Input value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Ej. Escazú" required />
        </div>
      </div>

      <div>
        <Label>Dirección *</Label>
        <Input value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Ej. AV7, Barrio Escalante" required />
      </div>

      <div>
        <Label>Descripción *</Label>
        <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="Descripción breve de la academia..." required />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Instagram</Label>
          <Input value={form.instagram ?? ''} onChange={(e) => set('instagram', e.target.value)} placeholder="handle (sin @)" />
        </div>
        <div>
          <Label>WhatsApp</Label>
          <Input value={form.whatsapp ?? ''} onChange={(e) => set('whatsapp', e.target.value)} placeholder="+50688880000" />
        </div>
        <div>
          <Label>Teléfono</Label>
          <Input value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} placeholder="+506 8888-0000" />
        </div>
      </div>

      <div>
        <Label>Tags (separados por coma)</Label>
        <Input value={form.tagsStr} onChange={(e) => set('tagsStr', e.target.value)} placeholder="BJJ, Gi, No-Gi, Kids, Competición" />
      </div>

      <div className="flex items-center gap-3">
        <Label>Aprobada</Label>
        <button
          type="button"
          onClick={() => set('is_approved', !form.is_approved)}
          className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wider transition-colors ${form.is_approved ? 'bg-green-700 text-white' : 'bg-zinc-700 text-zinc-400'}`}
        >
          {form.is_approved ? 'Sí' : 'No'}
        </button>
      </div>

      <div className="flex gap-3 pt-2 border-t border-zinc-700">
        <button
          onClick={handleSave}
          disabled={saving || !form.name || !form.city || !form.address || !form.description}
          className="flex-1 bg-brand text-white py-2.5 text-sm font-medium hover:bg-brand/90 transition-colors disabled:opacity-40"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
        <button onClick={onCancel} className="px-6 border border-zinc-600 text-zinc-300 py-2.5 text-sm hover:bg-zinc-800 transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  )
}

function AcademiesTab() {
  const qc = useQueryClient()
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; data: typeof EMPTY_ACADEMY & { id?: string } } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [search, setSearch] = useState('')

  const { data: academies = [], isLoading } = useQuery<Academy[]>({
    queryKey: ['admin_academies'],
    queryFn: async () => {
      const { data, error } = await adminSupabase.from('academies').select('*').order('name')
      if (error) throw error
      return data ?? []
    },
  })

  const save = useMutation({
    mutationFn: async (form: typeof EMPTY_ACADEMY & { id?: string }) => {
      const { id, ...payload } = form
      const clean = {
        ...payload,
        instagram: payload.instagram || null,
        whatsapp: payload.whatsapp || null,
        phone: payload.phone || null,
      }
      if (id) {
        const { error } = await adminSupabase.from('academies').update(clean).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await adminSupabase.from('academies').insert(clean)
        if (error) throw error
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin_academies'] }); qc.invalidateQueries({ queryKey: ['academies'] }); setModal(null) },
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await adminSupabase.from('academies').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin_academies'] }); qc.invalidateQueries({ queryKey: ['academies'] }); setDeleteTarget(null) },
  })

  const filtered = academies.filter((a) =>
    search === '' || a.name.toLowerCase().includes(search.toLowerCase()) || a.region.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar academia..."
          className="bg-zinc-800 border border-zinc-700 text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:border-brand placeholder:text-zinc-600 w-64"
        />
        <button
          onClick={() => setModal({ mode: 'add', data: { ...EMPTY_ACADEMY } })}
          className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2 text-sm font-medium hover:bg-brand/90 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" /> Nueva Academia
        </button>
      </div>

      {isLoading ? (
        <p className="text-zinc-500 text-sm">Cargando...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-700">
          <p className="text-zinc-500">No se encontraron academias.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((ac) => (
            <div key={ac.id} className="flex items-center gap-4 bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700 p-3 transition-colors">
              <img
                src={ac.image_url}
                alt={ac.name}
                className="w-12 h-12 object-cover bg-zinc-700 shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg' }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-zinc-100 truncate">{ac.name}</p>
                  {!ac.is_approved && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-yellow-900/50 text-yellow-400 shrink-0">Pendiente</span>
                  )}
                </div>
                <p className="text-xs text-zinc-500">{ac.city}, {ac.region}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setModal({ mode: 'edit', data: { ...EMPTY_ACADEMY, ...ac } })}
                  className="text-zinc-500 hover:text-brand transition-colors p-1"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget({ id: ac.id, name: ac.name })}
                  className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal.mode === 'add' ? 'Nueva Academia' : 'Editar Academia'} onClose={() => setModal(null)}>
          <AcademyForm
            initial={modal.data}
            onSave={(form) => save.mutate(form)}
            onCancel={() => setModal(null)}
            saving={save.isPending}
          />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDelete
          name={deleteTarget.name}
          onConfirm={() => remove.mutate(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

// ─── Login ────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      onLogin()
    } else {
      setError('Credenciales incorrectas.')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-6xl font-serif font-black text-white opacity-10 leading-none select-none">柔</div>
          <p className="font-display font-semibold text-xl tracking-tighter uppercase text-zinc-100 mt-2">Openmat CR</p>
          <p className="text-xs text-zinc-500 tracking-widest uppercase mt-1">Panel de Administración</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Usuario</Label>
            <Input value={user} onChange={(e) => setUser(e.target.value)} placeholder="admin" autoComplete="username" />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" className="w-full bg-brand text-white py-2.5 text-sm font-medium hover:bg-brand/90 transition-colors">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_auth') === '1')
  const [tab, setTab] = useState<'openmats' | 'academies'>('openmats')

  const { data: academies = [] } = useQuery<Academy[]>({
    queryKey: ['admin_academies'],
    queryFn: async () => {
      const { data, error } = await adminSupabase.from('academies').select('*').order('name')
      if (error) throw error
      return data ?? []
    },
    enabled: authed,
  })

  if (!authed) {
    return (
      <LoginScreen
        onLogin={() => { sessionStorage.setItem('admin_auth', '1'); setAuthed(true) }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="bg-zinc-900 border-b-2 border-brand px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-brand" />
          <span className="font-display font-semibold text-lg tracking-tighter uppercase">Openmat CR — Admin</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest">Ver sitio</a>
          <button
            onClick={() => { sessionStorage.removeItem('admin_auth'); setAuthed(false) }}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition-colors uppercase tracking-widest"
          >
            <LogOut className="w-3.5 h-3.5" /> Salir
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-zinc-800 px-6">
        <div className="flex gap-0 max-w-6xl mx-auto">
          {([['openmats', 'Open Mats'], ['academies', 'Academias']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-6 py-4 text-sm font-medium uppercase tracking-wider border-b-2 transition-colors ${
                tab === key ? 'border-brand text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {tab === 'openmats' ? (
          <OpenMatsTab academies={academies} />
        ) : (
          <AcademiesTab />
        )}
      </main>
    </div>
  )
}

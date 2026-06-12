import { useState, type ReactNode } from "react";
import { PlusCircle } from "lucide-react";
import { REGIONS } from "@/lib/academiesdata";

const SUBMISSION_EMAIL = "submissions@artesauavecr.com";

interface FormData {
  name: string;
  region: string;
  city: string;
  address: string;
  description: string;
  instagram: string;
  whatsapp: string;
  phone: string;
}

const EMPTY_FORM: FormData = {
  name: "",
  region: "",
  city: "",
  address: "",
  description: "",
  instagram: "",
  whatsapp: "",
  phone: "",
};

interface AddAcademyDialogProps {
  children?: ReactNode;
}

export function AddAcademyDialog({ children }: AddAcademyDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const body = [
      `Academia/Dojo: ${form.name}`,
      `Provincia: ${form.region}`,
      `Ciudad: ${form.city}`,
      `Dirección: ${form.address}`,
      `Descripción: ${form.description}`,
      form.instagram ? `Instagram: ${form.instagram}` : null,
      form.whatsapp ? `WhatsApp: ${form.whatsapp}` : null,
      form.phone ? `Teléfono: ${form.phone}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const subject = encodeURIComponent(`Nueva Academia: ${form.name}`);
    const bodyEncoded = encodeURIComponent(body);

    window.location.href = `mailto:${SUBMISSION_EMAIL}?subject=${subject}&body=${bodyEncoded}`;

    setOpen(false);
    setForm(EMPTY_FORM);
  }

  const regions = REGIONS.filter((r) => r !== "Todas");

  return (
    <>
      <span onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
        {children ?? (
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-brand text-white py-2 px-4 rounded-sm text-sm font-medium hover:-translate-y-0.5 transition-transform"
          >
            <PlusCircle className="w-4 h-4" />
            Agregar Academia
          </button>
        )}
      </span>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-academy-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="relative z-10 bg-surface w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-sm ring-1 ring-zinc-950/10 shadow-2xl">
            <div className="p-6 border-b border-zinc-950/5">
              <h2 id="add-academy-title" className="font-display font-semibold text-xl tracking-tight uppercase">
                Agregar mi Academia / Dojo
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Completá el formulario y abrirá tu cliente de correo con toda la información lista para enviar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1" htmlFor="name">
                  Nombre de la academia *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej. Zenith Costa Rica"
                  className="w-full border border-zinc-200 bg-white px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-brand/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1" htmlFor="region">
                    Provincia *
                  </label>
                  <select
                    id="region"
                    name="region"
                    required
                    value={form.region}
                    onChange={handleChange}
                    className="w-full border border-zinc-200 bg-white px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-brand/50"
                  >
                    <option value="">Seleccionar...</option>
                    {regions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1" htmlFor="city">
                    Ciudad *
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Ej. Escazú"
                    className="w-full border border-zinc-200 bg-white px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-brand/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1" htmlFor="address">
                  Dirección *
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Ej. Calle Vieja, Escazú Centro"
                  className="w-full border border-zinc-200 bg-white px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-brand/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1" htmlFor="description">
                  Descripción breve *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Contanos un poco sobre la academia, programas, enfoque..."
                  className="w-full border border-zinc-200 bg-white px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-brand/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 pt-2 border-t border-zinc-100">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Contacto (opcional)</p>

                <div>
                  <label className="block text-xs text-zinc-500 mb-1" htmlFor="instagram">
                    Instagram
                  </label>
                  <input
                    id="instagram"
                    name="instagram"
                    type="text"
                    value={form.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/tuacademia"
                    className="w-full border border-zinc-200 bg-white px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-brand/50"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 mb-1" htmlFor="whatsapp">
                    WhatsApp
                  </label>
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="text"
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="https://wa.me/50688880000"
                    className="w-full border border-zinc-200 bg-white px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-brand/50"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-500 mb-1" htmlFor="phone">
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+506 8888-0000"
                    className="w-full border border-zinc-200 bg-white px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-brand/50"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-brand text-white py-2.5 rounded-sm text-sm font-medium hover:bg-brand/90 transition-colors"
                >
                  Enviar solicitud
                </button>
                <button
                  type="button"
                  onClick={() => { setOpen(false); setForm(EMPTY_FORM); }}
                  className="px-4 border border-zinc-200 text-zinc-600 py-2.5 rounded-sm text-sm font-medium hover:bg-zinc-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

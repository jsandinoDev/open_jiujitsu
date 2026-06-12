-- Run this in the Supabase SQL Editor at https://supabase.com/dashboard

-- Academies table
create table if not exists academies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text not null,
  city text not null,
  address text not null,
  description text not null,
  instagram text,
  whatsapp text,
  phone text,
  image_url text not null default '/images/placeholder.jpg',
  tags text[] not null default '{}',
  is_approved boolean not null default true,
  created_at timestamptz not null default now()
);

-- Open mats table
create table if not exists open_mats (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid references academies(id) on delete cascade,
  academy_name text not null,
  day_of_week int not null check (day_of_week between 0 and 6),
  time_start text not null,
  time_end text not null,
  location text not null,
  notes text,
  gi boolean not null default true,
  date date,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (read-only public access)
alter table academies enable row level security;
alter table open_mats enable row level security;

create policy "Public read academies" on academies
  for select using (is_approved = true);

create policy "Public read open_mats" on open_mats
  for select using (true);

-- Seed data: 6 sample academies
insert into academies (name, region, city, address, description, instagram, whatsapp, phone, image_url, tags) values
  ('Zenith Costa Rica', 'San José', 'Escazú', 'Calle Vieja, Escazú Centro',
   'Liderado por instructores certificados con enfoque en competencia y defensa personal. Programas para niños, adultos y competidores.',
   'https://instagram.com/zenithcr', 'https://wa.me/50688880001', '+506 8888-0001',
   '/images/academy-1.jpg', ARRAY['Gi', 'No-Gi', 'Competición']),

  ('Pura Vida BJJ', 'Guanacaste', 'Nosara', 'Playa Guiones, Nosara',
   'Entrená en el paraíso. Clases diarias de Gi y No-Gi para todos los niveles. Ambiente relajado y comunitario.',
   'https://instagram.com/puravidabjj', 'https://wa.me/50688880002', '+506 8888-0002',
   '/images/academy-2.jpg', ARRAY['Gi', 'No-Gi', 'Surf & Roll']),

  ('Alianza CR', 'Alajuela', 'Alajuela Centro', 'Avenida 3, Alajuela',
   'Una de las academias con más tradición en el país. Programas para niños y adultos. Enfoque en técnica y valores.',
   'https://instagram.com/alianzacr', 'https://wa.me/50688880003', '+506 8888-0003',
   '/images/academy-3.jpg', ARRAY['Gi', 'Kids', 'Defensa Personal']),

  ('Tatami Central', 'San José', 'San Pedro', 'Los Yoses, Montes de Oca',
   'Academia universitaria con fuerte comunidad de estudiantes. Clases matutinas y nocturnas. Excelente para principiantes.',
   'https://instagram.com/tatamicentral', 'https://wa.me/50688880004', '+506 8888-0004',
   '/images/academy-4.jpg', ARRAY['Gi', 'No-Gi', 'Principiantes']),

  ('Montaña BJJ', 'Cartago', 'Cartago Centro', 'Barrio El Molino, Cartago',
   'La mejor opción en el Valle del Guarco. Instructores con experiencia internacional. Ambiente familiar y de crecimiento.',
   'https://instagram.com/montanabjj', 'https://wa.me/50688880005', '+506 8888-0005',
   '/images/academy-5.jpg', ARRAY['Gi', 'No-Gi', 'Familia']),

  ('Costa Rica BJJ', 'Heredia', 'San Joaquín', 'Centro Comercial La Llama, San Joaquín',
   'Equipo de competición con raíces profundas en el Jiu-Jitsu brasileño. Entrenamiento de alto rendimiento.',
   'https://instagram.com/costaricabjj', 'https://wa.me/50688880006', '+506 8888-0006',
   '/images/academy-6.jpg', ARRAY['Gi', 'No-Gi', 'Competición', 'Elite']);

-- Seed data: open mats (uses academy names, academy_id will be linked by name lookup)
-- After inserting academies, you can link them by running the inserts below.
-- Or use the Supabase Table Editor to add open mats manually.

insert into open_mats (academy_name, academy_id, day_of_week, time_start, time_end, location, notes, gi)
select 'Zenith Costa Rica', id, 1, '18:00', '20:00', 'Escazú, Calle Vieja', 'Gi obligatorio. Todos los cinturones bienvenidos.', true
from academies where name = 'Zenith Costa Rica';

insert into open_mats (academy_name, academy_id, day_of_week, time_start, time_end, location, notes, gi)
select 'Pura Vida BJJ', id, 2, '07:00', '09:00', 'Nosara, Playa Guiones', 'Sunrise roll. No-Gi preferido.', false
from academies where name = 'Pura Vida BJJ';

insert into open_mats (academy_name, academy_id, day_of_week, time_start, time_end, location, notes, gi)
select 'Tatami Central', id, 4, '18:30', '20:30', 'San Pedro, Los Yoses', 'Open mat de jueves. Trae tu propio agua.', true
from academies where name = 'Tatami Central';

insert into open_mats (academy_name, academy_id, day_of_week, time_start, time_end, location, notes, gi)
select 'Montaña BJJ', id, 6, '10:00', '12:00', 'Cartago, Barrio El Molino', 'Sábado de rolls. Ambiente familiar.', true
from academies where name = 'Montaña BJJ';

insert into open_mats (academy_name, academy_id, day_of_week, time_start, time_end, location, notes, gi)
select 'Costa Rica BJJ', id, 0, '09:00', '11:00', 'Heredia, San Joaquín', 'Domingo de sparring libre.', false
from academies where name = 'Costa Rica BJJ';

insert into open_mats (academy_name, academy_id, day_of_week, time_start, time_end, location, notes, gi)
select 'Alianza CR', id, 5, '17:00', '19:00', 'Alajuela, Avenida 3', 'Viernes técnica + rolls abiertos.', true
from academies where name = 'Alianza CR';

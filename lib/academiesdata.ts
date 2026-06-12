export interface Academy {
  id: string;
  name: string;
  region: string;
  city: string;
  address: string;
  description: string;
  instagram?: string;
  whatsapp?: string;
  phone?: string;
  image_url: string;
  tags: string[];
}

export interface OpenMat {
  id: string;
  academy_name: string;
  academy_id: string;
  day_of_week: number; // 0 = Domingo, 1 = Lunes, ...
  time_start: string;
  time_end: string;
  date?: string;
  location: string;
  notes?: string;
  gi: boolean;
}

export const REGIONS = [
  "Todas",
  "San José",
  "Alajuela",
  "Cartago",
  "Heredia",
  "Guanacaste",
  "Puntarenas",
  "Limón",
] as const;

export const academies: Academy[] = [
  {
    id: "1",
    name: "Zenith Costa Rica",
    region: "San José",
    city: "Escazú",
    address: "Calle Vieja, Escazú Centro",
    description: "Liderado por instructores certificados con enfoque en competencia y defensa personal. Programas para niños, adultos y competidores.",
    instagram: "https://instagram.com/zenithcr",
    whatsapp: "https://wa.me/50688880001",
    phone: "+506 8888-0001",
    image_url: "/images/academy-1.jpg",
    tags: ["Gi", "No-Gi", "Competición"],
  },
  {
    id: "2",
    name: "Pura Vida BJJ",
    region: "Guanacaste",
    city: "Nosara",
    address: "Playa Guiones, Nosara",
    description: "Entrena en el paraíso. Clases diarias de Gi y No-Gi para todos los niveles. Ambiente relajado y comunitario.",
    instagram: "https://instagram.com/puravidabjj",
    whatsapp: "https://wa.me/50688880002",
    phone: "+506 8888-0002",
    image_url: "/images/academy-2.jpg",
    tags: ["Gi", "No-Gi", "Surf & Roll"],
  },
  {
    id: "3",
    name: "Alianza CR",
    region: "Alajuela",
    city: "Alajuela Centro",
    address: "Avenida 3, Alajuela",
    description: "Una de las academias con más tradición en el país. Programas para niños y adultos. Enfoque en técnica y valores.",
    instagram: "https://instagram.com/alianzacr",
    whatsapp: "https://wa.me/50688880003",
    phone: "+506 8888-0003",
    image_url: "/images/academy-3.jpg",
    tags: ["Gi", "Kids", "Defensa Personal"],
  },
  {
    id: "4",
    name: "Tatami Central",
    region: "San José",
    city: "San Pedro",
    address: "Los Yoses, Montes de Oca",
    description: "Academia universitaria con fuerte comunidad de estudiantes. Clases matutinas y nocturnas. Excelente para principiantes.",
    instagram: "https://instagram.com/tatamicentral",
    whatsapp: "https://wa.me/50688880004",
    phone: "+506 8888-0004",
    image_url: "/images/academy-4.jpg",
    tags: ["Gi", "No-Gi", "Principiantes"],
  },
  {
    id: "5",
    name: "Montaña BJJ",
    region: "Cartago",
    city: "Cartago Centro",
    address: "Barrio El Molino, Cartago",
    description: "La mejor opción en el Valle del Guarco. Instructores con experiencia internacional. Ambiente familiar y de crecimiento.",
    instagram: "https://instagram.com/montanabjj",
    whatsapp: "https://wa.me/50688880005",
    phone: "+506 8888-0005",
    image_url: "/images/academy-5.jpg",
    tags: ["Gi", "No-Gi", "Familia"],
  },
  {
    id: "6",
    name: "Costa Rica BJJ",
    region: "Heredia",
    city: "San Joaquín",
    address: "Centro Comercial La Llama, San Joaquín",
    description: "Equipo de competición con raíces profundas en el Jiu-Jitsu brasileño. Entrenamiento de alto rendimiento.",
    instagram: "https://instagram.com/costaricabjj",
    whatsapp: "https://wa.me/50688880006",
    phone: "+506 8888-0006",
    image_url: "/images/academy-6.jpg",
    tags: ["Gi", "No-Gi", "Competición", "Elite"],
  },
];

export const openMats: OpenMat[] = [
  {
    id: "om1",
    academy_name: "Zenith Costa Rica",
    academy_id: "1",
    day_of_week: 1,
    time_start: "18:00",
    time_end: "20:00",
    location: "Escazú, Calle Vieja",
    notes: "Gi obligatorio. Todos los cinturones bienvenidos.",
    gi: true,
  },
  {
    id: "om2",
    academy_name: "Pura Vida BJJ",
    academy_id: "2",
    day_of_week: 2,
    time_start: "07:00",
    time_end: "09:00",
    location: "Nosara, Playa Guiones",
    notes: "Sunrise roll. No-Gi preferido.",
    gi: false,
  },
  {
    id: "om3",
    academy_name: "Tatami Central",
    academy_id: "4",
    day_of_week: 4,
    time_start: "18:30",
    time_end: "20:30",
    location: "San Pedro, Los Yoses",
    notes: "Open mat de jueves. Trae tu propio agua.",
    gi: true,
  },
  {
    id: "om4",
    academy_name: "Montaña BJJ",
    academy_id: "5",
    day_of_week: 6,
    time_start: "10:00",
    time_end: "12:00",
    location: "Cartago, Barrio El Molino",
    notes: "Sábado de rolls. Ambiente familiar.",
    gi: true,
  },
  {
    id: "om5",
    academy_name: "Costa Rica BJJ",
    academy_id: "6",
    day_of_week: 0,
    time_start: "09:00",
    time_end: "11:00",
    location: "Heredia, San Joaquín",
    notes: "Domingo de sparring libre.",
    gi: false,
  },
  {
    id: "om6",
    academy_name: "Alianza CR",
    academy_id: "3",
    day_of_week: 5,
    time_start: "17:00",
    time_end: "19:00",
    location: "Alajuela, Avenida 3",
    notes: "Viernes técnica + rolls abiertos.",
    gi: true,
  },
];

export const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
export const DAY_SHORT = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];


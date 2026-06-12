-- ─────────────────────────────────────────────
-- Alajuela, Cartago, Guanacaste, Puntarenas, Limón — 12 academias
-- Run AFTER seed-academies.sql (San José + Heredia already in DB)
-- ─────────────────────────────────────────────

-- ALAJUELA (2)
INSERT INTO academies (name, region, city, address, description, instagram, phone, whatsapp, tags) VALUES
('AJR Jiu Jitsu', 'Alajuela', 'Alajuela', 'Tropicana, Alajuela, Costa Rica', 'Academia afiliada a la Caio Terra Association, fundada por el cinturón negro 2do grado Arimateia Junior. Más de 18 años formando atletas integrales de todas las edades y niveles.', 'ajr_jiujitsu', '+50683084919', '+50683084919', ARRAY['BJJ','Gi','No-Gi','Kids','Competición']),
('Mauro Sergio BJJ San Ramón', 'Alajuela', 'San Ramón', 'San Ramón, Alajuela, Costa Rica', 'Sede en San Ramón de la academia fundada por Mauro Sergio de Oliveira, cinturón negro 5to Dan. Referente del BJJ en Costa Rica con más de 30 años de experiencia.', 'maurosergiobjjsanramon', '+50688624242', '+50688624242', ARRAY['BJJ','Gi','No-Gi','Kids','Competición']);

-- CARTAGO (3)
INSERT INTO academies (name, region, city, address, description, instagram, phone, whatsapp, tags) VALUES
('Academia SKD Jiu Jitsu', 'Cartago', 'Cartago', 'De la Basílica de los Ángeles 300m al este, carretera San Rafael, Edificio Oficentro Murano 2da planta, Cartago', 'Academia Cartaginesa de Jiu Jitsu con un sistema completo de defensa personal y disciplina. Clases para niños y adultos en el centro de Cartago.', 'sankyoshido_jiu_jitsu', NULL, NULL, ARRAY['BJJ','Gi','Kids']),
('Academia Gaman Suru', 'Cartago', 'Cartago', 'Cartago, Costa Rica', 'Academia de Jiu Jitsu en Cartago dirigida por el Sensei Fredy Arauz. Entrenamiento en un ambiente disciplinado y enfocado en el desarrollo técnico e integral del practicante.', NULL, NULL, NULL, ARRAY['BJJ','Gi','Kids']),
('Avenida 04 Jiu Jitsu', 'Cartago', 'Cartago', 'Cartago, Costa Rica', 'Academia de BJJ en Cartago con clases para todos los niveles. Contacto directo por teléfono o correo para información de horarios e inscripción.', NULL, '+50685825252', '+50685825252', ARRAY['BJJ','Gi','No-Gi']);

-- GUANACASTE (4)
INSERT INTO academies (name, region, city, address, description, instagram, phone, whatsapp, tags) VALUES
('Hero Academy BJJ', 'Guanacaste', 'Tamarindo', 'Calle Palma, 300 metros este del Banco Nacional, diagonal a Plaza Palmas, Tamarindo', 'Academia sin fines de lucro en el corazón de Tamarindo. Más de 1,500 niños becados desde 2014. Recibe atletas locales y visitantes de todo el mundo con clases de BJJ, MMA y Boxeo.', 'herobjjretreats', NULL, '+50687105304', ARRAY['BJJ','Gi','No-Gi','MMA','Kids','Competición']),
('Nosara Jiu Jitsu', 'Guanacaste', 'Nosara', 'Playa Guiones, Nosara, Guanacaste, Costa Rica', 'Academia fundada en 2016 por el Profesor Daniel Rodríguez en el corazón de Nosara. Clases de BJJ en un entorno paradisíaco a pasos de la playa.', 'nosara_jiu_jitsu', '+50684349456', '+50684349456', ARRAY['BJJ','Gi','No-Gi','Kids']),
('Playa BJJ', 'Guanacaste', 'Playas del Coco', 'Plaza Costa Mar, Calle La Chorrera, 2do Piso, Playas del Coco, Guanacaste', 'Academia de BJJ premier en Playas del Coco, a 50 metros de la playa. Abierta a practicantes de todos los equipos y afiliaciones desde 2018.', 'playabjj', '+50686581521', '+50686581521', ARRAY['BJJ','Gi','No-Gi']),
('Ascent Jiu Jitsu Club', 'Guanacaste', 'Playa Avellanas', 'Playa Avellanas, Guanacaste, Costa Rica', 'Academia de BJJ en Playa Avellanas que combina entrenamiento de alto nivel con surf y yoga. También con sede en Escazú para visitantes de San José.', 'ascentbjj', NULL, NULL, ARRAY['BJJ','Gi','No-Gi']);

-- PUNTARENAS (2)
INSERT INTO academies (name, region, city, address, description, instagram, phone, whatsapp, tags) VALUES
('Puerto BJJ', 'Puntarenas', 'Puntarenas', 'Gimnasio In Line, Puntarenas, Costa Rica', 'Academia de Brazilian Jiu Jitsu, Boxeo y MMA en la ciudad de Puntarenas. Clases de lunes a viernes y sábados para todos los niveles.', NULL, '+50672026863', '+50672026863', ARRAY['BJJ','Gi','No-Gi','MMA']),
('Santa Teresa Jiu Jitsu', 'Puntarenas', 'Santa Teresa', 'Cóbano, Santa Teresa, Puntarenas, Costa Rica', 'Academia de BJJ afiliada a Ares BJJ en Santa Teresa, dirigida por el cinturón negro César Céspedes. Clases en uno de los destinos de surf más famosos de Costa Rica.', 'santateresajiujitsu', NULL, NULL, ARRAY['BJJ','Gi','No-Gi','Competición']);

-- LIMÓN (1)
INSERT INTO academies (name, region, city, address, description, instagram, phone, whatsapp, tags) VALUES
('Limón Jiu Jitsu', 'Limón', 'Limón', 'Gimnasio Eddy Bermudez, diagonal al Hospital Tony Facio, Limón Centro', 'Academia de BJJ en el corazón de Limón, dirigida por el Sensei Alexander Jiménez. Clases para principiantes, avanzados y niños de lunes a sábado.', 'limon_jiu_jitsu', '+50688230789', '+50688230789', ARRAY['BJJ','Gi','Kids']);

-- ─────────────────────────────────────────────
-- Image URLs (10 of 12 have photos)
-- ─────────────────────────────────────────────
UPDATE academies SET image_url = '/images/academies/ajr-jiujitsu.jpg' WHERE name = 'AJR Jiu Jitsu';
UPDATE academies SET image_url = '/images/academies/mauro-sergio-bjj-san-ramon.jpg' WHERE name = 'Mauro Sergio BJJ San Ramón';
UPDATE academies SET image_url = '/images/academies/gaman-suru-cartago.jpg' WHERE name = 'Academia Gaman Suru';
UPDATE academies SET image_url = '/images/academies/avenida04-jiujitsu.jpg' WHERE name = 'Avenida 04 Jiu Jitsu';
UPDATE academies SET image_url = '/images/academies/hero-academy-tamarindo.jpg' WHERE name = 'Hero Academy BJJ';
UPDATE academies SET image_url = '/images/academies/nosara-jiujitsu.jpg' WHERE name = 'Nosara Jiu Jitsu';
UPDATE academies SET image_url = '/images/academies/playa-bjj-coco.jpg' WHERE name = 'Playa BJJ';
UPDATE academies SET image_url = '/images/academies/puerto-bjj-puntarenas.jpg' WHERE name = 'Puerto BJJ';
UPDATE academies SET image_url = '/images/academies/santa-teresa-jiujitsu.jpg' WHERE name = 'Santa Teresa Jiu Jitsu';
UPDATE academies SET image_url = '/images/academies/limon-jiujitsu.jpg' WHERE name = 'Limón Jiu Jitsu';

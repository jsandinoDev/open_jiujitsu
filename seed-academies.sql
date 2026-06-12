-- ─────────────────────────────────────────────
-- Step 1: Clear placeholder data
-- ─────────────────────────────────────────────
DELETE FROM open_mats;
DELETE FROM academies;

-- ─────────────────────────────────────────────
-- Step 2: Insert real academies
-- ─────────────────────────────────────────────

-- SAN JOSÉ (10 academies)
INSERT INTO academies (name, region, city, address, description, instagram, phone, whatsapp, tags) VALUES
('Alliance Costa Rica', 'San José', 'San José', 'AV7, Barrio Escalante, San José', 'Academia afiliada a Alliance Jiu Jitsu con más de 15 años transformando vidas. Clases para niños, adolescentes y adultos de todos los niveles.', 'alliancecostarica', '+50672008950', '+50672008950', ARRAY['BJJ','Gi','No-Gi','Kids','Competición']),
('Academia Galera BJJ', 'San José', 'Curridabat', 'Curridabat, San José', 'Academia con más de 15 años de experiencia bajo la dirección del Profesor Álvaro Garro. Clases de BJJ en Gi y No-Gi para adultos y niños. Primera clase gratis.', 'galera_bjj', NULL, '+50683484986', ARRAY['BJJ','Gi','No-Gi','Kids']),
('Athletic Advance', 'San José', 'San Pedro', 'Carretera principal de San Pedro, Edificio Ferreterías del Mar 2do y 3er pisos, Montes de Oca', 'Centro especializado en BJJ, MMA, Boxeo y Muay Thai desde 2009. Instructores especializados en artes marciales y acondicionamiento físico.', 'athletic_advance', NULL, NULL, ARRAY['BJJ','Gi','No-Gi','MMA','Kids']),
('Renzo Gracie Costa Rica', 'San José', 'Curridabat', 'O2 Wellness Center, Curridabat, San José', 'Academia afiliada a la red mundial de Renzo Gracie, dirigida por el Profesor Mike Jaramillo. Entrenamiento de BJJ de alto nivel.', NULL, '+50671399719', '+50671399719', ARRAY['BJJ','Gi','No-Gi','Competición']),
('Arte Suave BJJ CR', 'San José', 'San Francisco de Dos Ríos', 'San Francisco de Dos Ríos, San José', 'Escuela de Brazilian Jiu Jitsu y artes marciales en San Francisco de Dos Ríos. Clases para niños y adultos en un ambiente familiar y competitivo.', 'artesuavecr506', NULL, NULL, ARRAY['BJJ','Gi','No-Gi','Kids']),
('Gallery Jiu Jitsu Academy (Checkmat)', 'San José', 'San José', 'San José, Costa Rica', 'Academia afiliada a Checkmat. Clases para todos los niveles, mujeres, niños y adultos en un ambiente profesional y competitivo.', 'galleryjiujitsu', '+50683088609', '+50683088609', ARRAY['BJJ','Gi','No-Gi','Kids','Competición']),
('Atos Jiu Jitsu Costa Rica', 'San José', 'Escazú', 'Centro Comercial San Rafael, Local 25, Escazú', 'Afiliado de Atos Jiu-Jitsu, una de las academias más reconocidas del mundo. Entrenamiento de alta calidad bajo el Profesor Adrian Coto.', NULL, '+50687186218', '+50687186218', ARRAY['BJJ','Gi','No-Gi','Competición']),
('Nova União Costa Rica', 'San José', 'Escazú', 'Av. 28, 105, Centro, Escazú, San José', 'Afiliada de Nova União, equipo de campeones mundiales dirigido por el Profesor Fabio Marques y el Maestro André Bastos.', 'novauniaocostarica', NULL, NULL, ARRAY['BJJ','Gi','No-Gi','Kids','Competición']),
('DOJO Escuela Marcial', 'San José', 'Rohrmoser', 'Frente al Colegio Bilingüe La Sabana, Rohrmoser, San José', 'Escuela marcial en Rohrmoser con clases de BJJ y artes marciales para niños y adultos en un ambiente seguro y profesional.', NULL, '+50689228968', '+50689228968', ARRAY['BJJ','Gi','Kids']),
('Mauro Sergio BJJ', 'San José', 'Moravia', 'Moravia, San José, Costa Rica', 'Academia fundada por Mauro Sergio de Oliveira, cinturón negro 5to Dan con más de 30 años de experiencia. Referente histórico del BJJ en Costa Rica.', 'maurosergiobjj', '+50685804930', '+50685804930', ARRAY['BJJ','Gi','No-Gi','Kids','Competición']);

-- HEREDIA (6 academies)
INSERT INTO academies (name, region, city, address, description, instagram, phone, whatsapp, tags) VALUES
('JiuJitsu Lab (Sports Lab CR)', 'Heredia', 'San Rafael', 'Barrio San Josecito, San Rafael de Heredia', 'Academia dirigida por Eduardo Chaves, cinturón negro 1er grado. Centro de referencia para el BJJ en Heredia con enfoque en competición y desarrollo técnico.', 'jiujitsu_lab_', '+50688370171', '+50688370171', ARRAY['BJJ','Gi','No-Gi','Competición']),
('NorteSur Academy', 'Heredia', 'San Rafael', 'Plaza Vistana, San Josecito, San Rafael de Heredia', 'Academia de BJJ y Muay Thai con programas para niños y adultos, incluyendo clases de defensa personal para mujeres.', NULL, '+50670056214', '+50670056214', ARRAY['BJJ','Gi','No-Gi','Kids','Mujeres']),
('OSS Martial Arts', 'Heredia', 'San Francisco', '600m oeste del Walmart Heredia, carretera a Alajuela, Centro Comercial Villa Vieja', 'Academia en San Francisco de Heredia con BJJ Brasileño, Kickboxing, Eskrima y Grappling para todas las edades.', 'oss_martial_arts', NULL, NULL, ARRAY['BJJ','Gi','No-Gi','Grappling']),
('Garaje Jiu Jitsu 506', 'Heredia', 'San Francisco', 'San Francisco de Heredia', 'Academia de BJJ para todos los niveles, desde principiantes hasta competición. Clases para adultos y niños en un ambiente de alta calidad técnica.', 'garajejiujitsu506', NULL, NULL, ARRAY['BJJ','Gi','No-Gi','Kids','Competición']),
('ALEJO BJJ', 'Heredia', 'San Isidro', 'Detrás de Tico Wok, San Isidro de Heredia', 'Academia con instructores cinturón negro Alejandro Sánchez y Allan Cuernavaca. Programa infantil a cargo de la Profesora María José Chavarría.', NULL, '+50660427292', '+50660427292', ARRAY['BJJ','Gi','No-Gi','Kids','Competición']),
('Heredia Jiu Jitsu', 'Heredia', 'San Rafael', 'Colegio Nueva Generación, San Rafael de Heredia', 'Academia afiliada a Alliance Costa Rica que ofrece entrenamiento de BJJ para niños y adultos en el corazón de San Rafael.', 'heredia_jiujitsu', NULL, NULL, ARRAY['BJJ','Gi','No-Gi','Kids']);

-- ─────────────────────────────────────────────
-- Step 3: Set image URLs (11 academies with photos)
-- ─────────────────────────────────────────────
UPDATE academies SET image_url = '/images/academies/alliance-cr.jpg' WHERE name = 'Alliance Costa Rica';
UPDATE academies SET image_url = '/images/academies/galera-bjj.jpg' WHERE name = 'Academia Galera BJJ';
UPDATE academies SET image_url = '/images/academies/athletic-advance.jpg' WHERE name = 'Athletic Advance';
UPDATE academies SET image_url = '/images/academies/arte-suave-bjj-cr.jpg' WHERE name = 'Arte Suave BJJ CR';
UPDATE academies SET image_url = '/images/academies/gallery-jiujitsu.jpg' WHERE name = 'Gallery Jiu Jitsu Academy (Checkmat)';
UPDATE academies SET image_url = '/images/academies/nova-uniao-cr.jpg' WHERE name = 'Nova União Costa Rica';
UPDATE academies SET image_url = '/images/academies/dojo-rohrmoser.jpg' WHERE name = 'DOJO Escuela Marcial';
UPDATE academies SET image_url = '/images/academies/mauro-sergio-bjj.jpg' WHERE name = 'Mauro Sergio BJJ';
UPDATE academies SET image_url = '/images/academies/nortesur-academy.jpg' WHERE name = 'NorteSur Academy';
UPDATE academies SET image_url = '/images/academies/oss-martial-arts.jpg' WHERE name = 'OSS Martial Arts';
UPDATE academies SET image_url = '/images/academies/heredia-jiujitsu.jpg' WHERE name = 'Heredia Jiu Jitsu';

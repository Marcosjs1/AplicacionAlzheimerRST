-- Create music_recommendations table
CREATE TABLE IF NOT EXISTS public.music_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decade INTEGER NOT NULL, -- e.g., 1950
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    spotify_url TEXT,
    youtube_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.music_recommendations ENABLE ROW LEVEL SECURITY;

-- Policies for music_recommendations
-- Anyone logged in (patient or caregiver) can read recommendations
CREATE POLICY "Anyone logged in can read music recommendations"
ON public.music_recommendations
FOR SELECT
USING (auth.role() = 'authenticated');

-- Seed Data (10 songs per decade from 1940 to 1980)

-- 1940s
INSERT INTO public.music_recommendations (decade, title, artist, spotify_url, youtube_url) VALUES
(1940, 'Bésame Mucho', 'Consuelo Velázquez / Los Panchos', 'https://open.spotify.com/track/4unmsyY6Vj50v2eIuL6e0A', 'https://www.youtube.com/watch?v=gT8T0v4vCgU'),
(1940, 'La Vie en Rose', 'Édith Piaf', 'https://open.spotify.com/track/30unLghK29H97S7XunYvN2', 'https://www.youtube.com/watch?v=rzeLiaY5hX4'),
(1940, 'White Christmas', 'Bing Crosby', 'https://open.spotify.com/track/48Yv6u0f2524vS0uU40t65', 'https://www.youtube.com/watch?v=w9QLn7gM-hY'),
(1940, 'Sentimental Journey', 'Doris Day', 'https://open.spotify.com/track/5uX5K49x1TqB6XyB95fO5Z', 'https://www.youtube.com/watch?v=7yC7Y5L_5kE'),
(1940, 'Dos Gardenias', 'Daniel Santos', 'https://open.spotify.com/track/6Zc6uWpLpD3i3E8d49Y5cZ', 'https://www.youtube.com/watch?v=F3zWw4C0K-Y'),
(1940, 'Perfidia', 'Alberto Domínguez', 'https://open.spotify.com/track/0X0m8vXj3v5i98E9G5cZ0A', 'https://www.youtube.com/watch?v=qM-Rpbz-30M'),
(1940, 'Nature Boy', 'Nat King Cole', 'https://open.spotify.com/track/2Z1L9T9x0S0H9kI8P5E6eE', 'https://www.youtube.com/watch?v=Iq0XJCJ1Srw'),
(1940, 'Quizás, Quizás, Quizás', 'Osvaldo Farrés', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=9yW7W7o8J0M'),
(1940, 'Boogie Woogie Bugle Boy', 'The Andrews Sisters', 'https://open.spotify.com/track/4Yv6u0f2524vS0uU40t65', 'https://www.youtube.com/watch?v=qafnJ7H97Lg'),
(1940, 'Solamente Una Vez', 'Agustín Lara', 'https://open.spotify.com/track/0X0m8vXj3v5i98E9G5cZ0A', 'https://www.youtube.com/watch?v=5XqV_q9m5X0');

-- 1950s
INSERT INTO public.music_recommendations (decade, title, artist, spotify_url, youtube_url) VALUES
(1950, 'Rock Around the Clock', 'Bill Haley & His Comets', 'https://open.spotify.com/track/1P6E9R8V6N6N7s5fB4F3hW', 'https://www.youtube.com/watch?v=ZgduV8qzqms'),
(1950, 'Johnny B. Goode', 'Chuck Berry', 'https://open.spotify.com/track/2Q9mtclqiUNu8vLzP097Y2', 'https://www.youtube.com/watch?v=ZFo8-JqzS8E'),
(1950, 'Jailhouse Rock', 'Elvis Presley', 'https://open.spotify.com/track/48Yv6u0f2524vS0uU40t65', 'https://www.youtube.com/watch?v=gj0Rz-uP4Mk'),
(1950, 'Volare', 'Domenico Modugno', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=t4IjJav7xbg'),
(1950, 'Que Sera, Sera', 'Doris Day', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=xZbKHDPPrrc'),
(1950, 'Piel Canela', 'Bobby Capó', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=Q8T0v4vCgU'),
(1950, 'Sabor a Mí', 'Álvaro Carrillo', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=99-E77W9cM0'),
(1950, 'Diana', 'Paul Anka', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=Ar9Ip7pYBC0'),
(1950, 'Only You', 'The Platters', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=3FygIKsnkCw'),
(1950, 'Tequila', 'The Champs', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=3Hj3U18FHgQ');

-- 1960s
INSERT INTO public.music_recommendations (decade, title, artist, spotify_url, youtube_url) VALUES
(1960, 'Yesterday', 'The Beatles', 'https://open.spotify.com/track/30unLghK29H97S7XunYvN2', 'https://www.youtube.com/watch?v=jo505ZyaCbA'),
(1960, '(I Cant Get No) Satisfaction', 'The Rolling Stones', 'https://open.spotify.com/track/2Q9mtclqiUNu8vLzP097Y2', 'https://www.youtube.com/watch?v=nrIPxlFzDi0'),
(1960, 'La Bamba', 'Ritchie Valens', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=jSKJQ18ZoIA'),
(1960, 'The Sound of Silence', 'Simon & Garfunkel', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=4fWyzwo1_es'),
(1960, 'Eugenio Salvador Dalí', 'Mecano', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=ZEu75q9lY0s'),
(1960, 'Guantanamera', 'Celia Cruz', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=X5-rN6_OCp4'),
(1960, 'Blowin'' in the Wind', 'Bob Dylan', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=vWwgrjjIMXA'),
(1960, 'Stand by Me', 'Ben E. King', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=hwZNL7AMOSY'),
(1960, 'My Girl', 'The Temptations', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=6IUG-9jFAu8'),
(1960, 'A Hard Day''s Night', 'The Beatles', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=YykjpeuMNEk');

-- 1970s
INSERT INTO public.music_recommendations (decade, title, artist, spotify_url, youtube_url) VALUES
(1970, 'Imagine', 'John Lennon', 'https://open.spotify.com/track/30unLghK29H97S7XunYvN2', 'https://www.youtube.com/watch?v=YkgkThdzfy0'),
(1970, 'Bohemian Rhapsody', 'Queen', 'https://open.spotify.com/track/2Q9mtclqiUNu8vLzP097Y2', 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ'),
(1970, 'Stayin'' Alive', 'Bee Gees', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=fNFzD6uI68E'),
(1970, 'Dancing Queen', 'ABBA', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=xFrGuiivPfk'),
(1970, 'Hotel California', 'Eagles', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=EqPtz5qN7HM'),
(1970, 'Gavilán o Paloma', 'José José', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=n7z3pP3Fv8U'),
(1970, 'Libre', 'Nino Bravo', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=Y7xXz8zS6wI'),
(1970, 'Y.M.C.A.', 'Village People', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=CS9OO0S5w2k'),
(1970, 'Superstition', 'Stevie Wonder', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=0CFuCYNx-1g'),
(1970, 'Sultans of Swing', 'Dire Straits', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=h0ffIJ7ZO4U');

-- 1980s
INSERT INTO public.music_recommendations (decade, title, artist, spotify_url, youtube_url) VALUES
(1980, 'Billie Jean', 'Michael Jackson', 'https://open.spotify.com/track/30unLghK29H97S7XunYvN2', 'https://www.youtube.com/watch?v=Zi_XLOBDo_Y'),
(1980, 'Like a Virgin', 'Madonna', 'https://open.spotify.com/track/2Q9mtclqiUNu8vLzP097Y2', 'https://www.youtube.com/watch?v=s__rX_jrqkY'),
(1980, 'Sweet Child O'' Mine', 'Guns N'' Roses', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=1w7OgIMMRc4'),
(1980, 'Take On Me', 'a-ha', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=djV11Xbc914'),
(1980, 'Cuando Pase el Temblor', 'Soda Stereo', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=F0IWHxvswLk'),
(1980, 'Devuélveme a mi Chica', 'Hombres G', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=3Hj3U18FHgQ'),
(1980, 'Every Breath You Take', 'The Police', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=OMOGaugKpjw'),
(1980, 'Wake Me Up Before You Go-Go', 'Wham!', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=pIgZ7gMze7A'),
(1980, 'Girls Just Want to Have Fun', 'Cyndi Lauper', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=PIb6AZdTr-A'),
(1980, 'Beat It', 'Michael Jackson', 'https://open.spotify.com/track/4Z5v7z5k9D5E7jD4v9E5cZ', 'https://www.youtube.com/watch?v=oRdxUFDoQe0');

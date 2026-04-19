import React, { useState } from 'react';
import './App.css';

const MOODS = [
  'весёлое', 'грустное', 'энергичное', 'спокойное', 
  'меланхоличное', 'танцевальное', 'агрессивное', 'романтичное', 'фоновое'
];

const GENRES = [
  'Pop', 'Rock', 'Hip-Hop', 'Rap', 'Electronic', 'Indie', 
  'Metal', 'Jazz', 'Classical', 'Dance', 'Chill'
];

const YEARS = [
  { label: 'Любое время', value: '' },
  { label: 'Новинки (с 2020)', value: '2020-2026' },
  { label: '2010 – 2020', value: '2010-2020' },
  { label: '2000 – 2010', value: '2000-2010' },
  { label: '90-е годы', value: '1990-1999' },
  { label: '80-е годы', value: '1980-1989' },
  { label: '70-е годы', value: '1970-1979' },
  { label: 'До 70-х', value: '1900-1969' }
];

function App() {
  const [mood, setMood] = useState(MOODS[0]);
  const [genre, setGenre] = useState(GENRES[0]);
  const [year, setYear] = useState(YEARS[0].value);
  const [count, setCount] = useState(10);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5158/api/Music/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: mood,
          genre: genre,
          yearRange: year,
          count: Number(count),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setTracks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <main className="main-content">
        <header className="header">
          <h1>SongFinder</h1>
          <p>Найдите идеальную музыку под ваше настроение</p>
        </header>

        <section className="search-section glass-panel">
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-group">
              <label htmlFor="mood">Настроение</label>
              <select 
                id="mood" 
                value={mood} 
                onChange={(e) => setMood(e.target.value)}
              >
                {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="genre">Жанр</label>
              <select 
                id="genre" 
                value={genre} 
                onChange={(e) => setGenre(e.target.value)}
              >
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="year">Год</label>
              <select 
                id="year" 
                value={year} 
                onChange={(e) => setYear(e.target.value)}
              >
                {YEARS.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="count">Количество (до 100)</label>
              <input 
                type="number" 
                id="count" 
                min="1" 
                max="100" 
                value={count} 
                onChange={(e) => setCount(e.target.value)}
              />
            </div>

            <div className="button-container">
              <button type="submit" className="search-button" disabled={loading}>
                {loading ? 'Ищем магию...' : 'Найти музыку'}
              </button>
            </div>
          </form>
          {error && <div className="error-message">{error}</div>}
        </section>

        <section className="results-section">
          {tracks.length > 0 && (
            <h2 className="results-title">Мы подобрали для вас {tracks.length} треков:</h2>
          )}
          
          <div className="tracks-grid">
            {tracks.map((track, i) => (
              <div key={i} className="track-card glass-panel fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="track-image-wrapper">
                  {track.imageUrl ? (
                    <img src={track.imageUrl} alt={track.trackName} className="track-image" />
                  ) : (
                    <div className="track-image-placeholder">🎵</div>
                  )}
                </div>
                <div className="track-info">
                  <h3 className="track-name" title={track.trackName}>{track.trackName}</h3>
                  <p className="track-artist" title={track.artist}>{track.artist}</p>
                </div>
                <a 
                  href={track.spotifyUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="spotify-link"
                >
                  Слушать в Spotify
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

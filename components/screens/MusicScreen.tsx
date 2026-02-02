import React from 'react';
import { BackHeader, BottomNav } from '../Layout';
import { useMusicRecommendations, MusicRegion } from '../../hooks/useMusicRecommendations';

export const MusicScreen: React.FC = () => {
    const [region, setRegion] = React.useState<MusicRegion>('international');
    const { recommendations, loading, error } = useMusicRecommendations(region);

    const openLink = (url: string) => {
        if (url) {
            window.open(url, "_blank");
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 min-h-screen pb-24 md:pb-6 md:pl-64">
            <BackHeader title="Música de Ayer" />
            
            <main className="flex-1 px-4 sm:px-6 pt-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Tu Juventud en Música</h2>
                    <p className="text-slate-500 dark:text-slate-400">Canciones seleccionadas para revivir tus mejores recuerdos.</p>
                </div>

                {/* Region Selector */}
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6 w-full max-w-sm">
                    <button 
                        onClick={() => setRegion('international')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
                            region === 'international' 
                                ? 'bg-white dark:bg-surface-dark text-slate-900 dark:text-white shadow-sm' 
                                : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'
                        }`}
                    >
                        🌍 Internacional
                    </button>
                    <button 
                        onClick={() => setRegion('argentina')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
                            region === 'argentina' 
                                ? 'bg-white dark:bg-surface-dark text-slate-900 dark:text-white shadow-sm' 
                                : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'
                        }`}
                    >
                        🇦🇷 Argentina
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-medium font-bold">Buscando tus canciones...</p>
                    </div>
                ) : error ? (
                    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-6 rounded-2xl text-center">
                        <span className="material-symbols-outlined text-4xl text-rose-500 mb-2">error</span>
                        <p className="text-rose-700 dark:text-rose-300 font-medium">No pudimos cargar las recomendaciones.</p>
                        <p className="text-rose-500 dark:text-rose-400 text-sm mt-1">{error}</p>
                    </div>
                ) : recommendations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-4xl text-slate-400">music_off</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Sin recomendaciones</h3>
                        <p className="text-slate-500">No encontramos canciones para tu década de nacimiento todavía.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 pb-8">
                        {recommendations.map((song) => (
                            <div key={song.id} className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-3xl text-primary">music_note</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{song.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm truncate">{song.artist}</p>
                                        <p className="text-xs font-bold text-primary mt-1 uppercase tracking-wider">{song.decade}s</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    {song.spotify_url && song.spotify_url.trim() !== '' && (
                                        <button 
                                            onClick={() => openLink(song.spotify_url!)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-white py-2.5 rounded-xl text-sm font-bold transition-colors"
                                        >
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" alt="Spotify" className="w-5 h-5" />
                                            <span>Spotify</span>
                                        </button>
                                    )}
                                    {song.youtube_url && song.youtube_url.trim() !== '' && (
                                        <button 
                                            onClick={() => openLink(song.youtube_url!)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-[#FF0000] hover:bg-[#ff1a1a] text-white py-2.5 rounded-xl text-sm font-bold transition-colors"
                                        >
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" alt="YouTube" className="w-5 h-5" />
                                            <span>YouTube</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
};

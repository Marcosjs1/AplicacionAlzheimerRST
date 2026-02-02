import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoryAlbums } from '../../hooks/useStoryAlbums';
import { BackHeader, BottomNav } from '../Layout';

export const StoriesScreen: React.FC = () => {
    const navigate = useNavigate();
    const { albums, loading, error, createAlbum, canEdit } = useStoryAlbums();
    
    // Create Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        try {
            await createAlbum(title, description);
            setIsCreateModalOpen(false);
            setTitle('');
            setDescription('');
        } catch (err: any) {
            setSubmitError(err.message);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-gray-100 min-h-screen pb-24 transition-colors duration-200 md:pb-6 md:pl-64">
             <BackHeader title="Mi Historia" />
            
            <section className="flex flex-col px-6 pt-4 pb-2">
                <p className="text-[#618968] dark:text-[#aecfb4] text-lg font-medium">Fotos y momentos importantes.</p>
            </section>

            <section className="flex flex-col px-4 pb-4">
                 <div className="flex items-center justify-between py-4">
                     <h2 className="tracking-tight text-2xl font-bold leading-tight">Álbumes</h2>
                     {canEdit && (
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-primary/10 text-primary p-2 rounded-full hover:bg-primary/20 transition-colors"
                        >
                            <span className="material-symbols-outlined">add</span>
                        </button>
                     )}
                </div>

                {loading && <div className="p-6 text-center text-gray-500">Cargando álbumes...</div>}
                {error && <div className="p-6 text-center text-red-500">Error: {error}</div>}

                {!loading && !error && albums.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 gap-4 mt-4 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 mx-2 animate-in fade-in zoom-in-95 duration-300">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined text-4xl text-gray-400">photo_library</span>
                        </div>
                        <h3 className="text-xl font-bold text-center text-[#111812] dark:text-white">Sin álbumes</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs">
                            Crea un álbum para organizar tus recuerdos.
                        </p>
                        {canEdit && (
                            <button 
                                onClick={() => setIsCreateModalOpen(true)}
                                className="mt-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">add_photo_alternate</span>
                                Crear Álbum
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {albums.map((album) => (
                            <div 
                                key={album.id} 
                                onClick={() => navigate(`/stories/${album.id}`)}
                                className="group relative bg-white dark:bg-[#1a2e1d] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 cursor-pointer hover:shadow-md transition-all active:scale-95 aspect-[4/5]"
                            >
                                {/* Placeholder Cover */}
                                <div className="h-2/3 bg-gray-200 dark:bg-gray-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                     <span className="material-symbols-outlined text-5xl text-gray-400">folder_open</span>
                                </div>
                                <div className="h-1/3 p-3 flex flex-col justify-center bg-white dark:bg-surface-dark z-10 relative">
                                    <h3 className="font-bold text-lg leading-tight truncate">{album.title}</h3>
                                    {album.description && (
                                        <p className="text-xs text-gray-500 truncate">{album.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                         {/* Create Card */}
                         {canEdit && (
                            <button 
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5 transition-all group aspect-[4/5]"
                            >
                                <div className="w-14 h-14 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-3xl">add</span>
                                </div>
                                <p className="font-bold text-gray-500 group-hover:text-primary transition-colors">Nuevo Álbum</p>
                            </button>
                         )}
                    </div>
                )}
            </section>

             {/* Create Album Modal */}
             {isCreateModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1c1d27] rounded-2xl w-full max-w-sm p-6 shadow-xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Nuevo Álbum</h3>
                        {submitError && <p className="text-red-500 text-sm mb-3">{submitError}</p>}
                        
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary py-3"
                                    placeholder="Ej. Vacaciones 2023"
                                    autoFocus
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción (Opcional)</label>
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary py-3 resize-none h-24"
                                    placeholder="Detalles sobre este álbum..."
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 py-3 font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 py-3 font-bold text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                                >
                                    Crear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
};

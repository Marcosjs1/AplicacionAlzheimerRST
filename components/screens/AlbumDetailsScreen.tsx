import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStoryPhotos } from '../../hooks/useStoryPhotos';
import { BackHeader } from '../Layout';

export const AlbumDetailsScreen: React.FC = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const { photos, loading, uploading, error, uploadPhoto, deletePhoto } = useStoryPhotos(albumId);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadError(null);
      setIsUploadModalOpen(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploadError(null);

    try {
      await uploadPhoto(selectedFile, caption);
      closeUploadModal();
    } catch (err: any) {
      setUploadError(err.message);
    }
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setSelectedFile(null);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);

    setCaption('');
    setUploadError(null);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    return () => {
      // cleanup cuando se desmonta
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleDelete = async (id: string, path: string) => {
    if (window.confirm('¿Eliminar esta foto?')) {
      try {
        await deletePhoto(id, path);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-gray-100 min-h-screen pb-24 transition-colors duration-200 md:pb-6 md:pl-64">
      <BackHeader title="Álbum" />

      <div className="px-6 pt-4 pb-2 flex justify-between items-center">
        <p className="text-[#618968] dark:text-[#aecfb4] text-lg font-medium">Recuerdos</p>

        <div className="relative">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary text-white p-2 px-4 rounded-full font-bold shadow-lg hover:bg-primary-dark transition-colors flex items-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined">add_a_photo</span>
            <span className="hidden sm:inline">Subir Foto</span>
          </button>
        </div>
      </div>

      <section className="px-4 pb-4">
        {loading && <div className="p-6 text-center text-gray-500">Cargando fotos...</div>}
        {error && <div className="p-6 text-center text-red-500">Error: {error}</div>}

        {!loading && !error && photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 gap-4 mt-8 bg-white dark:bg-surface-dark rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <span className="material-symbols-outlined text-4xl text-gray-300">image_not_supported</span>
            <p className="text-gray-500 font-medium">Este álbum está vacío</p>
            <button onClick={() => fileInputRef.current?.click()} className="text-primary font-bold hover:underline">
              Subir la primera foto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative group bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden aspect-square border-2 border-white dark:border-white/10 shadow-sm"
              >
                {photo.signedUrl ? (
                  <img
                    src={photo.signedUrl}
                    alt={photo.caption || 'Foto del álbum'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="material-symbols-outlined text-4xl">image</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  {photo.caption && (
                    <p className="text-white text-xs font-medium line-clamp-2 mb-2">{photo.caption}</p>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(photo.id, photo.image_path);
                    }}
                    className="self-end bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-full"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1c1d27] rounded-2xl w-full max-w-sm p-4 shadow-xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <h3 className="text-lg font-bold mb-4 text-center text-slate-900 dark:text-white">
              Subir Foto
            </h3>

            {previewUrl && (
              <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 border border-gray-200 dark:border-gray-700">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
              </div>
            )}

            {uploadError && <p className="text-red-500 text-xs mb-3 text-center">{uploadError}</p>}

            <div className="space-y-4 mb-4">
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 focus:ring-primary focus:border-primary py-2 text-sm"
                placeholder="Escribe un pie de foto..."
              />
            </div>

            <div className="flex gap-3 mt-auto">
              <button
                onClick={closeUploadModal}
                disabled={uploading}
                className="flex-1 py-3 font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 py-3 font-bold text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Subiendo...
                  </>
                ) : (
                  'Subir'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
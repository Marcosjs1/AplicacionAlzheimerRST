import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useCaregiverLink } from './useCaregiverLink';

export interface StoryPhoto {
  id: string;
  album_id: string;
  patient_id: string;
  created_by: string;
  image_path: string;
  caption?: string;
  created_at: string;

  // En bucket privado usamos signed url (expira)
  signedUrl?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const useStoryPhotos = (albumId?: string) => {
  const { profile } = useAuth();
  const { patientId, isLinked } = useCaregiverLink();

  const role = profile?.role?.toLowerCase();

  const targetUserId =
    role === 'caregiver'
      ? isLinked && patientId
        ? patientId
        : null
      : profile?.id;

  const [photos, setPhotos] = useState<StoryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    if (!albumId || !targetUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('story_photos')
        .select('*')
        .eq('album_id', albumId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // ✅ Generamos Signed URLs para bucket privado
      const photosWithSigned = await Promise.all(
        (data || []).map(async (photo) => {
          const { data: signedData, error: signedErr } = await supabase.storage
            .from('story_photos')
            .createSignedUrl(photo.image_path, 60 * 60); // 1 hora

          if (signedErr) {
            console.warn('Signed URL error:', signedErr.message);
            return { ...photo, signedUrl: undefined };
          }

          return { ...photo, signedUrl: signedData?.signedUrl };
        })
      );

      setPhotos(photosWithSigned);
    } catch (err: any) {
      console.error('Error fetching photos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [albumId, targetUserId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const uploadPhoto = async (file: File, caption?: string) => {
    if (!albumId || !targetUserId) throw new Error('Álbum no identificado.');
    if (photos.length >= 50) throw new Error('Máximo 50 fotos por álbum.');

    if (file.size > MAX_FILE_SIZE) throw new Error('La imagen no debe superar los 5MB.');
    if (!ALLOWED_TYPES.includes(file.type)) throw new Error('Solo jpg, png o webp.');

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${targetUserId}/${albumId}/${fileName}`;

      // 1) Upload a Storage
      const { error: uploadError } = await supabase.storage
        .from('story_photos')
        .upload(filePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      // 2) Insert DB row
      const { error: dbError } = await supabase.from('story_photos').insert({
        album_id: albumId,
        patient_id: targetUserId,
        created_by: profile?.id,
        image_path: filePath,
        caption,
      });

      if (dbError) throw dbError;

      await fetchPhotos();
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || 'Error al subir foto.');
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (id: string, imagePath: string) => {
    try {
      // 1) Delete from storage
      const { error: storageError } = await supabase.storage
        .from('story_photos')
        .remove([imagePath]);

      if (storageError) throw storageError;

      // 2) Delete DB row
      const { error: dbError } = await supabase.from('story_photos').delete().eq('id', id);

      if (dbError) throw dbError;

      await fetchPhotos();
    } catch (err: any) {
      throw new Error('Error al eliminar foto: ' + err.message);
    }
  };

  return {
    photos,
    loading,
    uploading,
    error,
    uploadPhoto,
    deletePhoto,
    refresh: fetchPhotos,
  };
};
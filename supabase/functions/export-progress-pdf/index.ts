import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log("--- EXPORT PDF FUNCTION START ---")
  console.log("Method:", req.method)
  const authHeader = req.headers.get('Authorization')
  console.log("Auth header present:", !!authHeader)
  if (authHeader) console.log("Auth header prefix:", authHeader.substring(0, 15))
  
  // Manejar CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Validar usuario
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('No autorizado')

    // Validar rol de cuidador
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'caregiver') {
      throw new Error('Solo los cuidadores pueden exportar reportes')
    }

    // Obtener datos del body
    const { patientId, patientName, category, charts } = await req.json()

    // Validar vinculación
    const serviceRoleClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: link } = await serviceRoleClient
      .from('caregiver_links')
      .select('id')
      .eq('caregiver_id', user.id)
      .eq('patient_id', patientId)
      .maybeSingle()

    if (!link) {
      console.error(`Link not found for caregiver ${user.id} and patient ${patientId}`)
      throw new Error('No tienes permiso para ver este paciente')
    }

    // Crear PDF
    const pdfDoc = await PDFDocument.create()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    
    let page = pdfDoc.addPage([600, 800])
    const { width, height } = page.getSize()

    // Header
    page.drawText('Reporte de Evolución Cognitiva', {
      x: 50,
      y: height - 50,
      size: 24,
      font: fontBold,
      color: rgb(0.26, 0.22, 0.79), // Primary Indigo
    })

    page.drawText(`Paciente: ${patientName}`, { x: 50, y: height - 85, size: 14, font: fontBold })
    page.drawText(`Fecha: ${new Date().toLocaleDateString()}`, { x: 50, y: height - 105, size: 12, font })
    page.drawText(`Categoría: ${category === 'all' ? 'Resumen General' : category.toUpperCase()}`, { x: 50, y: height - 125, size: 12, font })

    let currentY = height - 160

    // Sección: Resumen
    page.drawText('1. Resumen de Actividad', { x: 50, y: currentY, size: 16, font: fontBold })
    currentY -= 30
    
    // Aquí podrías agregar más métricas si las envías desde el front
    page.drawText('Actividad detectada en el periodo seleccionado.', { x: 50, y: currentY, size: 11, font })
    currentY -= 40

    // Función para insertar imagen de gráfico
    const embedChart = async (imageBase64: string | null, title: string) => {
      if (!imageBase64) {
        page.drawText(`${title}: [Gráfico no disponible]`, { x: 50, y: currentY, size: 12, font, color: rgb(0.5, 0.5, 0.5) })
        currentY -= 30
        return
      }

      try {
        const imageBytes = Uint8Array.from(atob(imageBase64.split(',')[1]), c => c.charCodeAt(0))
        const image = await pdfDoc.embedPng(imageBytes)
        
        const dims = image.scale(0.5)
        
        // Si no hay espacio, nueva página
        if (currentY - dims.height - 40 < 50) {
          page = pdfDoc.addPage([600, 800])
          currentY = height - 50
        }

        page.drawText(title, { x: 50, y: currentY, size: 14, font: fontBold })
        currentY -= dims.height + 10
        
        page.drawImage(image, {
          x: 50,
          y: currentY,
          width: 500, // Ajustar a ancho de página
          height: (dims.height / dims.width) * 500
        })
        
        currentY -= 40
      } catch (err) {
        console.error(`Error embedding image: ${err}`)
        page.drawText(`${title}: [Error al procesar imagen]`, { x: 50, y: currentY, size: 12, font, color: rgb(0.8, 0, 0) })
        currentY -= 30
      }
    }

    // Insertar Gráficos
    await embedChart(charts.accuracy, 'Análisis de Precisión (Aciertos vs Errores)')
    await embedChart(charts.completion, 'Progreso de Niveles Completados')
    await embedChart(charts.weeklyTrend, 'Tendencia Semanal de Desempeño')

    // Footer
    const pdfBytes = await pdfDoc.save()

    return new Response(pdfBytes, {
      headers: { ...corsHeaders, 'Content-Type': 'application/pdf' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

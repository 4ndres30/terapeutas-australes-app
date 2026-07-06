import { GoogleGenAI } from "npm:@google/genai@^2.10.0";
import { createClient } from "jsr:@supabase/supabase-js@2";

const UMBRAL_HUECO_MINUTOS = 30;
const UMBRAL_SOBRECARGA_EVENTOS_SEGUIDOS = 5;
const HORA_INICIO_LABORAL = 8;
const HORA_FIN_LABORAL = 20;

// agenda_eventos no tiene columna de terapeuta/profesional asignado (verificado en el schema).
// created_by (quien registro el evento) es el unico id interno disponible y se usa como proxy;
// no equivale a "responsable clinico del evento" y deberia reemplazarse si se agrega esa columna.
interface EventoAgenda {
  fecha_inicio: string;
  fecha_fin: string | null;
  modalidad: string | null;
  tipo_evento: string;
  created_by: string | null;
}

interface HuecoDetectado {
  dia: string;
  profesional_id: string;
  inicio: string;
  fin: string;
  duracion_minutos: number;
}

interface BloqueSobrecarga {
  dia: string;
  profesional_id: string;
  cantidad_eventos_seguidos: number;
  inicio: string;
  fin: string;
}

interface DatosAgregados {
  semana_inicio: string;
  semana_fin: string;
  total_eventos: number;
  eventos_por_tipo: Record<string, number>;
  eventos_por_modalidad: Record<string, number>;
  huecos: HuecoDetectado[];
  sobrecargas: BloqueSobrecarga[];
}

function contarPorClave(
  eventos: EventoAgenda[],
  obtenerClave: (evento: EventoAgenda) => string,
): Record<string, number> {
  const conteo: Record<string, number> = {};
  for (const evento of eventos) {
    const clave = obtenerClave(evento);
    conteo[clave] = (conteo[clave] ?? 0) + 1;
  }
  return conteo;
}

function inicioSemanaSiguiente(hoy: Date): Date {
  const diaSemana = hoy.getUTCDay();
  const diasHastaLunes = diaSemana === 0 ? 1 : 8 - diaSemana;
  const inicio = new Date(
    Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate()),
  );
  inicio.setUTCDate(inicio.getUTCDate() + diasHastaLunes);
  return inicio;
}

function aFechaISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

function minutosDelDia(fecha: Date): number {
  return fecha.getUTCHours() * 60 + fecha.getUTCMinutes();
}

function mismoDiaUTC(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

function estaDentroHorarioLaboral(fechaInicio: Date, fechaFin: Date): boolean {
  const inicioMinutos = HORA_INICIO_LABORAL * 60;
  const finMinutos = HORA_FIN_LABORAL * 60;
  return (
    minutosDelDia(fechaInicio) >= inicioMinutos &&
    minutosDelDia(fechaFin) <= finMinutos
  );
}

function calcularHuecosYSobrecargas(
  eventos: EventoAgenda[],
): { huecos: HuecoDetectado[]; sobrecargas: BloqueSobrecarga[] } {
  const eventosPorProfesional = new Map<string, EventoAgenda[]>();

  for (const evento of eventos) {
    if (!evento.fecha_fin) continue;
    const profesionalId = evento.created_by ?? "sin_asignar";
    const lista = eventosPorProfesional.get(profesionalId) ?? [];
    lista.push(evento);
    eventosPorProfesional.set(profesionalId, lista);
  }

  const huecos: HuecoDetectado[] = [];
  const sobrecargas: BloqueSobrecarga[] = [];

  for (const [profesionalId, lista] of eventosPorProfesional) {
    const ordenados = [...lista].sort(
      (a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime(),
    );

    let rachaInicio: EventoAgenda | null = null;
    let rachaCantidad = 0;

    const finalizarRacha = (ultimoDeLaRacha: EventoAgenda) => {
      if (rachaInicio && rachaCantidad >= UMBRAL_SOBRECARGA_EVENTOS_SEGUIDOS) {
        sobrecargas.push({
          dia: aFechaISO(new Date(rachaInicio.fecha_inicio)),
          profesional_id: profesionalId,
          cantidad_eventos_seguidos: rachaCantidad,
          inicio: rachaInicio.fecha_inicio,
          fin: ultimoDeLaRacha.fecha_fin ?? ultimoDeLaRacha.fecha_inicio,
        });
      }
      rachaInicio = null;
      rachaCantidad = 0;
    };

    for (let i = 0; i < ordenados.length; i++) {
      const actual = ordenados[i];
      if (rachaInicio === null) {
        rachaInicio = actual;
        rachaCantidad = 1;
      }

      const siguiente = ordenados[i + 1];
      if (!siguiente) continue;

      const finActual = new Date(actual.fecha_fin!);
      const inicioSiguiente = new Date(siguiente.fecha_inicio);
      const mismoDia = mismoDiaUTC(finActual, inicioSiguiente);
      const diffMinutos = Math.round(
        (inicioSiguiente.getTime() - finActual.getTime()) / 60000,
      );
      const rompeRacha = !mismoDia || diffMinutos >= UMBRAL_HUECO_MINUTOS;

      if (mismoDia && diffMinutos >= UMBRAL_HUECO_MINUTOS && estaDentroHorarioLaboral(finActual, inicioSiguiente)) {
        huecos.push({
          dia: aFechaISO(finActual),
          profesional_id: profesionalId,
          inicio: finActual.toISOString(),
          fin: inicioSiguiente.toISOString(),
          duracion_minutos: diffMinutos,
        });
      }

      if (rompeRacha) {
        finalizarRacha(actual);
      } else {
        rachaCantidad += 1;
      }
    }

    if (ordenados.length > 0) {
      finalizarRacha(ordenados[ordenados.length - 1]);
    }
  }

  return { huecos, sobrecargas };
}

async function generarResumenEjecutivo(datos: DatosAgregados): Promise<string> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY no esta configurada.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = [
    "Eres un asistente administrativo de una clinica de terapeutas.",
    "Con los siguientes datos agregados de agenda (JSON), redacta un resumen ejecutivo breve en espanol,",
    "orientado a coordinacion de horarios. No inventes datos que no esten en el JSON.",
    "Identifica a los profesionales solo por su id interno, nunca inventes nombres.",
    "",
    JSON.stringify(datos),
  ].join("\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const texto = response.text?.trim();
  if (!texto) {
    throw new Error("Gemini no devolvio texto en la respuesta.");
  }
  return texto;
}

Deno.serve(async (req: Request) => {
  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const hoy = new Date();

    const semanaInicio: Date = body.desde ? new Date(body.desde) : inicioSemanaSiguiente(hoy);
    const semanaFin: Date = body.hasta
      ? new Date(body.hasta)
      : new Date(semanaInicio.getTime() + 6 * 24 * 60 * 60 * 1000);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: eventos, error } = await supabase
      .from("agenda_eventos")
      .select("fecha_inicio, fecha_fin, modalidad, tipo_evento, created_by")
      .gte("fecha_inicio", semanaInicio.toISOString())
      .lt("fecha_inicio", semanaFin.toISOString())
      .order("fecha_inicio", { ascending: true });

    if (error) {
      throw new Error(`Error consultando agenda_eventos: ${error.message}`);
    }

    const { huecos, sobrecargas } = calcularHuecosYSobrecargas(eventos ?? []);

    const datosAgregados: DatosAgregados = {
      semana_inicio: aFechaISO(semanaInicio),
      semana_fin: aFechaISO(semanaFin),
      total_eventos: eventos?.length ?? 0,
      eventos_por_tipo: contarPorClave(eventos ?? [], (e) => e.tipo_evento),
      eventos_por_modalidad: contarPorClave(eventos ?? [], (e) => e.modalidad ?? "sin_definir"),
      huecos,
      sobrecargas,
    };

    const contenidoResumen = await generarResumenEjecutivo(datosAgregados);

    const { error: errorInsert } = await supabase
      .from("resumenes_agenda_semanal")
      .insert({
        semana_inicio: datosAgregados.semana_inicio,
        semana_fin: datosAgregados.semana_fin,
        contenido_resumen: contenidoResumen,
        datos_agregados: datosAgregados,
      });

    if (errorInsert) {
      throw new Error(`Error guardando resumen: ${errorInsert.message}`);
    }

    return new Response(
      JSON.stringify({ resumen: contenidoResumen, datos_agregados: datosAgregados }),
      { headers: { "Content-Type": "application/json" }, status: 200 },
    );
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : "Error desconocido";
    return new Response(JSON.stringify({ error: mensaje }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});

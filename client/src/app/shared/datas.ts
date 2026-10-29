const MILISSEGUNDOS_POR_DIA = 86_400_000;

export function formatarData(valor: string, somenteData = false): string {
  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) return valor;

  return new Intl.DateTimeFormat(
    'pt-BR',
    somenteData ? { dateStyle: 'short' } : { dateStyle: 'short', timeStyle: 'short' },
  ).format(data);
}

export function formatarTempoRelativo(valor: string): string {
  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) return valor;

  const diferencaMs = data.getTime() - Date.now();

  if (Math.abs(diferencaMs) > 7 * MILISSEGUNDOS_POR_DIA) {
    return formatarData(valor, true);
  }

  const formatador = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });
  const segundos = Math.round(diferencaMs / 1000);
  const minutos = Math.round(diferencaMs / 60_000);
  const horas = Math.round(diferencaMs / 3_600_000);
  const dias = Math.round(diferencaMs / MILISSEGUNDOS_POR_DIA);

  if (Math.abs(segundos) < 60) return formatador.format(segundos, 'second');
  if (Math.abs(minutos) < 60) return formatador.format(minutos, 'minute');
  if (Math.abs(horas) < 24) return formatador.format(horas, 'hour');

  return formatador.format(dias, 'day');
}

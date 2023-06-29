export type NovaChatMessage = {
  event: string,
  data: string;
  source: 'server' | 'client'
}
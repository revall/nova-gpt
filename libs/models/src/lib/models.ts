export type NovaChatMessage = {
  event: string,
  data: string;
  source: 'server' | 'client'
}

export const novaMessage = (source: 'server' | 'client', event: string, data: string,): NovaChatMessage => (
  {
    event,
    data,
    source
  }
)
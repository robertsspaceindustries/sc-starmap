import fetch from 'node-fetch';

const BASE = 'https://robertsspaceindustries.com/api/starmap';

export default async function request(method: string, url: string, body?: object): Promise<Record<string, unknown>> {
  const response = await fetch(`${BASE}${url}`, {
    method,
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!response.ok) throw new Error(`HTTP Error: ${response.statusText} (${response.status})\nURL: ${url}`);

  const data = (await response.json()) as Record<string, unknown>;
  if (!data.success) throw new Error(`Starmap Error: ${data.msg}\nURL: ${url}`);

  return data.data as Record<string, unknown>;
}

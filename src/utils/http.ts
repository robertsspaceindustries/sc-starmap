import fetch from 'node-fetch';

import wait from './wait';

const base = 'https://robertsspaceindustries.com/api/starmap';

export default function request(method: string, url: string, body?: object): Promise<Record<string, unknown>> {
  return new Promise((r) =>
    (async function attempt() {
      const response = await fetch(`${base}${url}`, {
        method,
        ...(body && { body: JSON.stringify(body) }),
      });

      if ([502, 504].includes(response.status)) {
        await wait(5_000);
        console.warn('Re-attempting request', `URL: ${url}`);
        return attempt();
      }

      if (!response.ok) throw new Error(`HTTP Error: ${response.statusText} (${response.status})\nURL: ${url}`);

      const data = (await response.json()) as Record<string, unknown>;
      if (!data.success) throw new Error(`Starmap Error: ${data.msg}\nURL: ${url}`);

      r(data.data as Record<string, unknown>);
    })(),
  );
}

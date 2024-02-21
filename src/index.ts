import fs from 'node:fs';
import path from 'node:path';

import createObject from './object';
import request from './utils/http';
import sortByCode from './utils/sort';
import wait from './utils/wait';

import type { IObject, IStarmapObject, ITunnel } from './object';
import type { IStarmapSystem, ISystem } from './system';

const interval = 1_250;

const bootup = await request('POST', '/bootup');
console.log('Fetched bootup');

const systems: ISystem[] = [];
const objects: IObject[] = [];

const bootupSystems = (bootup.systems as Record<string, unknown>).resultset as Array<Record<string, unknown>>;

for (const { code } of bootupSystems) {
  const { resultset: systemResultset } = await request('POST', `/star-systems/${code}`);
  const [system] = systemResultset as IStarmapSystem[];
  console.log(
    'Fetched',
    code,
    `(${bootupSystems.findIndex((comparing) => comparing.code === code) + 1}/${bootupSystems.length})`,
  );

  systems.push({
    id: system.id,
    code: system.code,
    description: system.description,
    info_url: system.info_url,
    name: system.name,
    status: system.status,
    type: system.type,
    affiliation: system.affiliation,
    aggregated_size: Number(system.aggregated_size),
    aggregated_population: system.aggregated_population,
    aggregated_economy: system.aggregated_economy,
    aggregated_danger: system.aggregated_economy,
  });

  for (const starmapObject of system.celestial_objects) {
    const parent = system.celestial_objects.find((comparing) => comparing.id === starmapObject.parent_id);
    const tunnel = ((bootup.tunnels as Record<string, unknown>).resultset as ITunnel[]).find((comparing) =>
      [comparing.entry_id, comparing.exit_id].includes(starmapObject.id),
    );

    const object = createObject(starmapObject, system, parent, tunnel);

    if (object.subtype?.name === 'Planetary Moon') {
      object.subtype.type = 'MOON';
      object.subtype.id = null;
    }

    objects.push(object);

    if (object.type === 'PLANET') {
      const { resultset: objectResultset } = await request('POST', `/celestial-objects/${object.code}`);
      const [fullObject] = objectResultset as IStarmapObject[];
      console.log('Fetched', object.code);

      if (!fullObject.children) continue;

      for (const child of fullObject.children) {
        if (system.celestial_objects.find((comparing) => comparing.id === child.id)) continue;

        objects.push(createObject(child, system, starmapObject));
      }

      await wait(interval);
    }
  }

  await wait(interval);
}

const outDir = path.resolve('./out');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, 'starmap.json'),
  JSON.stringify(
    {
      systems: systems.sort((a, b) => sortByCode(a.code, b.code)),
      objects: objects.sort((a, b) => sortByCode(a.code, b.code)),
    },
    undefined,
    4,
  ),
);
console.log('Wrote to out/starmap.json');

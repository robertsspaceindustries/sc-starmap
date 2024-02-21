import type { IAffiliation } from './affiliation';
import type { IStarmapSystem } from './system';

interface ITunnelPortal {
  id: number;
  code: string;
  designation: string;
  name: string;
  star_system_id: number;
  status: string;
}

export interface ITunnel {
  id: number;
  direction: string;
  entry_id: number;
  exit_id: number;
  name: string;
  size: string;
  entry: ITunnelPortal;
  exit: ITunnelPortal;
}

interface ISubtype {
  id: number | null;
  name: string;
  type: string;
}

export interface IStarmapObject {
  id: number;
  age: number;
  appearance: string;
  axial_tilt: number | null;
  fairchanceact: boolean | null;
  code: string;
  description: string;
  designation: string | null;
  distance: number;
  habitable: boolean | null;
  info_url: string | null;
  latitude: number;
  longitude: number;
  name: string;
  orbit_period: number | null;
  parent_id: number | null;
  sensor_danger: string;
  sensor_economy: string;
  sensor_population: string;
  shader_data: Record<string, unknown> | null;
  show_label: boolean;
  show_orbitlines: boolean;
  size: number | null;
  subtype_id: number | null;
  time_modified: string;
  type: string;
  subtype: ISubtype | null;
  affiliation: IAffiliation[];
  population: [];
  children?: IStarmapObject[];
  media: unknown[];
}

export interface IObject {
  id: number;
  age: number;
  axial_tilt: number | null;
  fairchanceact: boolean | null;
  code: string;
  description: string;
  designation: string | null;
  habitable: boolean | null;
  info_url: string | null;
  name: string;
  orbit_period: number | null;
  sensor_danger: number;
  sensor_economy: number;
  sensor_population: number;
  size: number | null;
  type: string;
  subtype: ISubtype | null;
  affiliation: IAffiliation[];
  star_system_id: number;
  star_system: {
    id: number;
    code: string;
    name: string;
    type: string;
    status: string;
  };
  parent_id: number | null;
  parent: {
    id: number;
    code: string;
    designation: string | null;
    name: string;
    type: string;
  } | null;
  tunnel: ITunnel | null;
}

export default function createObject(
  object: IStarmapObject,
  system: IStarmapSystem,
  parent?: IStarmapObject,
  tunnel?: ITunnel,
): IObject {
  return {
    id: object.id,
    age: object.age,
    axial_tilt: object.axial_tilt,
    fairchanceact: object.fairchanceact,
    code: object.code,
    description: object.description,
    designation: object.designation,
    habitable: object.habitable,
    info_url: object.info_url,
    name: object.name,
    orbit_period: object.orbit_period,
    sensor_danger: Number(object.sensor_danger),
    sensor_economy: Number(object.sensor_economy),
    sensor_population: Number(object.sensor_population),
    size: object.size,
    type: object.type,
    subtype: object.subtype,
    affiliation: object.affiliation,
    star_system_id: system.id,
    star_system: {
      id: system.id,
      code: system.code,
      name: system.name,
      type: system.type,
      status: system.status,
    },
    parent_id: object.parent_id,
    parent: parent
      ? {
          id: parent.id,
          code: parent.code,
          designation: parent.designation,
          name: parent.name,
          type: parent.type,
        }
      : null,
    tunnel: tunnel ?? null,
  };
}

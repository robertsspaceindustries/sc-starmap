import type { IAffiliation } from './affiliation';
import type { IStarmapObject } from './object';

export interface IStarmapSystem {
  id: number;
  code: string;
  description: string;
  frost_line: number;
  habitable_zone_inner: number;
  habitable_zone_outer: number;
  info_url: string | null;
  name: string;
  position_x: number;
  position_y: number;
  position_z: number;
  shader_data: Record<string, unknown>;
  status: string;
  time_modified: string;
  type: string;
  affiliation: IAffiliation[];
  celestial_objects: IStarmapObject[];
  aggregated_size: string;
  aggregated_population: number;
  aggregated_economy: number;
  aggregated_danger: number;
  thumbnail: Record<string, unknown>;
}

export interface ISystem {
  id: number;
  code: string;
  description: string;
  info_url: string | null;
  name: string;
  status: string;
  type: string;
  affiliation: IAffiliation[];
  aggregated_size: number;
  aggregated_population: number;
  aggregated_economy: number;
  aggregated_danger: number;
}

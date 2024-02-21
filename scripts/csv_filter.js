import systems from "../out/systems.json" assert {type: "json"}
import fs from "node:fs";

const filtered = systems.map(system => ({
  name: system.name,
  affiliation: system.affiliation[0].name,
  size: parseFloat(system.aggregated_size),
  star: system.type,
  star_type: system.celestial_objects.find(o => o.type == "STAR")?.subtype?.name,
  planets_count: system.celestial_objects.filter(o => o.type == "PLANET").length,
  moons_count: system.celestial_objects.filter(o => o.code.includes("MOON")).length,
  belts_count: system.celestial_objects.filter(o => o.type == "ASTEROID_BELT").length,
  population: system.aggregated_population,
  economy: system.aggregated_economy,
  danger: system.aggregated_danger,
}));

fs.writeFileSync("./out/csv_prepared.json", JSON.stringify(filtered, null, 2));
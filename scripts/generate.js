import fs from "node:fs";
import path from "node:path";
import fetch from "node-fetch";

const wait = (t) => new Promise((r) => setTimeout(r, t));

const baseUrl = "https://robertsspaceindustries.com/api/starmap";

async function starmapRequest(method, url, body) {
	const options = {
		method,
		headers: {},
	};

	switch (typeof body) {
		case "object":
			options.headers["content-type"] = "application/json";
			options.body = JSON.stringify(body);
			break;
	}

	const response = await fetch(url, options);

	if (!response.ok) return;

	const responseBody = await response.json();

	if (!responseBody.success) return;

	return responseBody.data;
}

const bootup = await starmapRequest("POST", baseUrl + "/bootup");
if (!bootup) throw new Error("Failed to fetch bootup data");
console.log("Fetched bootup");

const systems = [];
const objects = [];

for (const { code } of bootup.systems.resultset) {
	const system = (await starmapRequest("POST", baseUrl + "/star-systems/" + code))?.resultset?.[0];
	if (!system) throw new Error("Failed to fetch data for system " + code);

	systems.push({
		id: system.id,
		code: system.code,
		description: system.description,
		info_url: system.info_url,
		name: system.name,
		status: system.status,
		type: system.type,
		affiliation: system.affiliation,
		aggregated_size: system.aggregated_size,
		aggregated_population: system.aggregated_population,
		aggregated_economy: system.aggregated_economy,
		aggregated_danger: system.aggregated_danger,
	});

	for (const object of system.celestial_objects) {
		const parent = object.parent_id ? system.celestial_objects.find((parent) => parent.id === object.parent_id) : null;
		const tunnel =
			object.type === "JUMPPOINT"
				? bootup.tunnels.resultset.find((tunnel) => tunnel.entry_id === object.id || tunnel.exit_id === object.id)
				: null;

		objects.push({
			id: object.id,
			age: object.age,
			code: object.code,
			description: object.description,
			designation: object.designation,
			habitable: object.habitable,
			info_url: object.info_url,
			name: object.name,
			sensor_danger: object.sensor_danger,
			sensor_economy: object.sensor_economy,
			sensor_population: object.sensor_population,
			size: object.size,
			type: object.type,
			subtype: object.subtype,
			affiliation: object.affiliation,
			star_system_id: system.id,
			star_system: {
				id: system.id,
				code: system.code,
				name: system.name,
				status: system.status,
				type: system.type,
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
			tunnel:
				{
					id: tunnel.id,
					direction: tunnel.direction,
					entry_id: tunnel.entry_id,
					exit_id: tunnel.exit_id,
					name: tunnel.name,
					size: tunnel.size,
					entry: {
						id: tunnel.entry.id,
						code: tunnel.entry.code,
						designation: tunnel.entry.designation,
						name: tunnel.entry.name,
						star_system_id: tunnel.entry.star_system_id,
						status: tunnel.entry.status,
					},
					exit: {
						id: tunnel.exit.id,
						code: tunnel.exit.code,
						designation: tunnel.exit.designation,
						name: tunnel.exit.name,
						star_system_id: tunnel.exit.star_system_id,
						status: tunnel.exit.status,
					},
				} || null,
		});
	}

	console.log("Fetched system " + code);
	await wait(1_000);
}

fs.writeFile(
	path.resolve("out/starmap.json"),
	JSON.stringify(
		{
			systems: systems,
			objects: objects.filter((item, index, self) => index === self.findIndex((t) => t["id"] === item["id"])),
		},
		undefined,
		4, // Beautify
	),
	function (error) {
		if (error) throw error;
	},
);

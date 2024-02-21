import fs from "node:fs";
import fetch from "node-fetch";

async function starmapRequest(method, url) {
    url = "https://robertsspaceindustries.com/api/starmap" + url;
    
    //Removed error catching (you'll wanna rerun anyways if something wrong happens here)
    const response = await fetch(url, { method });
    const responseBody = await response.json();
    return responseBody.data;
}

async function fetchAndWriteAllSystemData() {

    // Still boot
    const bootup = await starmapRequest("POST", "/bootup");
    if (!bootup) throw new Error("Failed to fetch bootup data");

    // Gather all promises
    const sys_promises = bootup.systems.resultset.map(({ code }) => starmapRequest("POST", "/star-systems/" + code));
    
    // Run all promises
    const sys_res = await Promise.all(sys_promises);

    // Everything gets written to the file (even sub-system bodies)
    // If you want to strip some data, you'd probably rather have everything as JSON
    // Then query from there rather than having to fetch the RSI API everytime
    // I mean by that, write other functions to write other files with some specific data
    // filtered out of the mega one.
    const systems = sys_res.map(data => {
        const resDat = data?.resultset[0]
        console.log("Fetched system : " + resDat?.name);
        return resDat;
    });

    // Write sync so you dont have to write an ugly inline callback
    fs.writeFileSync("./out/systems.json", JSON.stringify(systems, null, 2));
}



fetchAndWriteAllSystemData();
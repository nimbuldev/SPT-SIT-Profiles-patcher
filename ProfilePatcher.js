const { join } = require('path');
const fs = require('fs');
const crypto = require('crypto');
const process = require('process');
const readline = require('readline');

const profilesPath = "./user/profiles";

function confirm(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => rl.question(question, ans => {
        rl.close();
        resolve(ans);
    }))
}

async function start() {

    if (!fs.existsSync(profilesPath)) {
        console.log("Profiles not found, did you run this in the server folder?");
        await confirm("Press enter to exit...");
        process.exit(1);
    }

    for await (const file of fs.readdirSync(profilesPath)) {

        const profile = JSON.parse(fs.readFileSync(join(profilesPath, file)));
        if (!profile.hasOwnProperty("characters")) continue;
        if (!profile.characters.hasOwnProperty("pmc")) continue;
        if (!profile.characters.pmc.hasOwnProperty("Inventory")) continue;
        if (!profile.characters.pmc.Inventory.hasOwnProperty("equipment")) continue;

        const id = profile.characters.pmc.Inventory.equipment;
        const newHash = crypto.randomBytes(12).toString('hex');
        const data = fs.readFileSync(join(profilesPath, file), 'utf8');
        const result = data.replace(new RegExp(id, 'g'), newHash);
        fs.writeFileSync(join(profilesPath, file), result, 'utf8');
        console.log("Replaced " + id + " with " + newHash + " in " + file);
    }
    await confirm("Press enter to exit...");
    process.exit(0);
}
start();

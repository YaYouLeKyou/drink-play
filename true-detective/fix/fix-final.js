const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..');
const EM = String.fromCharCode(0x2014);
const NL = String.fromCharCode(92) + "n";   /* sequence \n litterale dans les fichiers cibles */

/* ============ 1. phases.js : zero tiret cadratin ============ */
{
    const p = path.join(base, 'phases.js');
    let c = fs.readFileSync(p, 'utf8');

    /* Dialogue au bar : le tiret de dialogue devient des guillemets */
    c = c.replace(
        NL + NL + EM + " Monsieur Pembrooke. On vous a vu avec la victime la veille de sa mort. Comment l'expliquez-vous ?" + NL + NL + "Pembrooke fait",
        NL + NL + "\u00ab Monsieur Pembrooke. On vous a vu avec la victime la veille de sa mort. Comment l'expliquez-vous ? \u00bb" + NL + NL + "Pembrooke fait"
    );
    c = c.replace(
        NL + NL + EM + " Mr. Pembrooke. You were seen with the victim the day before his death. How do you explain that ?" + NL + NL + "Pembrooke spins",
        NL + NL + '"Mr. Pembrooke. You were seen with the victim the day before his death. How do you explain that ?"' + NL + NL + "Pembrooke spins"
    );

    /* Listes du choix final : tiret de puce supprime */
    c = c.split(NL + EM + " ").join(NL);

    /* Regles generales pour le reste */
    c = c.split(" " + EM + " ").join(", ");
    c = c.split(EM + " ").join("");
    c = c.split(" " + EM).join(",");
    c = c.split(EM).join(",");

    fs.writeFileSync(p, c, 'utf8');
    console.log('phases.js em restants:', (c.match(new RegExp(EM, 'g')) || []).length);
}

/* ============ 2. app.js : le tiret du commentaire ============ */
{
    const p = path.join(base, 'app.js');
    let c = fs.readFileSync(p, 'utf8');
    c = c.split(" " + EM + " ").join(", ");
    fs.writeFileSync(p, c, 'utf8');
    console.log('app.js em restants:', (c.match(new RegExp(EM, 'g')) || []).length);
}
console.log('Part 1 done');

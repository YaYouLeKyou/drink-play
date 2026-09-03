#!/usr/bin/env node
/* CLI — `node tools/validate-scenario.js` : vérifie la cohérence
   entre scenario-complet.md (source de vérité) et phases.js (l'app). */
'use strict';
const bridge = require('./scenario-bridge');

try {
    const r = bridge.validate();
    console.log('=== VALIDATION SCÉNARIO (doc <-> app) ===');
    console.log('Stats :', JSON.stringify(r.stats));
    if (r.issues.length) {
        console.log('\n❌ DÉRIVES (' + r.issues.length + ') :');
        r.issues.forEach(function (i) { console.log('  - ' + i); });
    } else {
        console.log('\n✅ Aucune dérive : le doc et l\'app sont alignés.');
    }
    if (r.warnings.length) {
        console.log('\n⚠ Avertissements (' + r.warnings.length + ') :');
        r.warnings.forEach(function (w) { console.log('  - ' + w); });
    }
    process.exit(r.ok ? 0 : 1);
} catch (e) {
    console.error('Erreur de validation :', e.message);
    process.exit(2);
}

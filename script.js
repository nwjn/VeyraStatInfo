// ==UserScript==
// @name         Veyra Stat Ratios
// @namespace    http://tampermonkey.net/
// @version      2026-02-21
// @description  Extra information of stat ratios
// @author       nwjn
// @match        https://demonicscans.org/stats.php
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const statCard = document.querySelectorAll('.grid .card')?.[1];
    if (!statCard) return;

    const atkDef = parseInt(document.getElementById('v-attack')?.innerText?.replace(/,|\./g, '')) + parseInt(document.getElementById('v-defense')?.innerText?.replace(/,|\./g, ''));
    const total = atkDef + parseInt(document.getElementById('v-stamina')?.innerText?.replace(/,|\./g, ''));
    const maxStat = (parseInt(document.querySelector("body > div.game-topbar > div.gtb-inner > div.gtb-right > div:nth-child(1)")?.innerText?.replace("LV ", '')) - 1) * 5;

    const sections = [
        ["PvP Build Ratio", atkDef / maxStat],
        ["Levels until 0.6 PvP:", Math.ceil((maxStat * 0.6 - atkDef) / 2)],
        ["Stat Ratio", atkDef / total],
        ["Levels until 0.6 Stat:", Math.ceil((total * 0.6 - atkDef) / 2)]
    ];

    sections.forEach(([title, res]) => {
        const row = document.createElement('div');
        row.title = title;
        row.classList.add('row');
        row.style.color = 'red';

        const name = document.createElement('span');
        name.innerText = title;

        const val = document.createElement('span');
        val.innerText = Number.isInteger(res) ? res : res.toFixed(3);

        row.append(name);
        row.append(val);
        statCard.append(row);
    });
})();

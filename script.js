// ==UserScript==
// @name         Veyra Stat Ratios
// @namespace    http://tampermonkey.net/
// @version      2026-02-22
// @description  Stats Page Overhaul + Stat Ratio Analyzer
// @author       nwjn
// @match        https://demonicscans.org/stats.php
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const grid = document.querySelector('.grid');
    if (!grid) return;

    grid.querySelectorAll('.card').forEach(card => card.style.display = 'none');

    grid.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 25px;
        max-width: 1400px;
        margin: 0 auto;
        width: 100%;
        padding: 0 10px;
    `;

    const container = document.querySelector('.container');
    if (container) {
        container.style.maxWidth = '1600px';
        container.style.margin = '0 auto';
        container.style.padding = '20px';
    }

    const attack = parseInt(document.getElementById('v-attack')?.innerText?.replace(/,|\./g, '')) || 0;
    const defense = parseInt(document.getElementById('v-defense')?.innerText?.replace(/,|\./g, '')) || 0;
    const stamina = parseInt(document.getElementById('v-stamina')?.innerText?.replace(/,|\./g, '')) || 0;
    const unspentPts = parseInt(document.getElementById('v-points')?.innerText?.replace(/,|\./g, '')) || 0;

    const atkDef = attack + defense;
    const total = atkDef + stamina;

    const level = parseInt(document.querySelector(".gtb-level")?.innerText?.replace("LV ", '') || '1')
    const statsFromLevel = (level - 1) * 5;

    const mainDisplay = document.createElement('div');
    mainDisplay.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 25px;
    `;

    const twoColumnGrid = document.createElement('div');
    twoColumnGrid.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 25px;
    `;

    const statsCard = document.createElement('div');
    statsCard.style.cssText = `
        background: linear-gradient(135deg, rgba(20, 25, 45, 0.95) 0%, rgba(15, 18, 35, 0.98) 100%);
        border-radius: 20px;
        border: 1px solid rgba(255, 215, 120, 0.3);
        backdrop-filter: blur(4px);
        padding: 10px;
    `;

    const statsHeader = document.createElement('h3');
    statsHeader.style.cssText = `
        font-size: 1.4rem;
        font-weight: 600;
        margin-bottom: 1.2rem;
        display: flex;
        align-items: baseline;
        gap: 15px;
        flex-wrap: wrap;
        border-left: 4px solid #ffd778;
        padding-left: 15px;
        color: #ffecb3;
    `;
    statsHeader.innerHTML = `
        <span>📈 Current Stats: </span>
        <span style="font-size: 1.2rem; color: #ffd778; font-weight: normal;">
            ${total.toLocaleString()} pts (${statsFromLevel.toLocaleString()} from lvls)
        </span>
    `;
    statsCard.appendChild(statsHeader);

    const statItems = [
        { name: '⚔️ ATTACK', value: attack, color: '#fca5a5', id: 'v-attack' },
        { name: '🛡️ DEFENSE', value: defense, color: '#86efac', id: 'v-defense' },
        { name: '💪 STAMINA', value: stamina, color: '#60a5fa', id: 'v-stamina' }
    ];

    statItems.forEach(stat => {
        const statRow = document.createElement('div');
        statRow.style.cssText = 'margin-bottom: 20px;';

        const headerRow = document.createElement('div');
        headerRow.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 8px;';
        const percentOfTotal = total > 0 ? (stat.value / total) * 100 : 0;

        const valueSpan = document.createElement('span');
        valueSpan.id = stat.id;
        valueSpan.style.cssText = `color: ${stat.color}; font-weight: 700; font-family: monospace; font-size: 1.2rem;`;
        valueSpan.innerText = stat.value.toLocaleString();

        const percentSpan = document.createElement('span');
        percentSpan.style.cssText = `color: ${stat.color}; font-weight: 700; font-family: monospace; font-size: 1.2rem;`;
        percentSpan.innerText = ` (${percentOfTotal.toFixed(1)}%)`;

        const rightContainer = document.createElement('div');
        rightContainer.appendChild(valueSpan);
        rightContainer.appendChild(percentSpan);

        headerRow.innerHTML = `
            <span style="color: #b9c3e6; font-weight: 500;">${stat.name}</span>
        `;
        headerRow.appendChild(rightContainer);

        const progressBg = document.createElement('div');
        progressBg.style.cssText = 'background: rgba(0,0,0,0.4); border-radius: 10px; height: 8px; overflow: hidden;';
        const progressFill = document.createElement('div');
        progressFill.style.cssText = `background: ${stat.color}; width: ${percentOfTotal}%; height: 100%; border-radius: 10px;`;
        progressBg.appendChild(progressFill);

        statRow.appendChild(headerRow);
        statRow.appendChild(progressBg);
        statsCard.appendChild(statRow);
    });

    twoColumnGrid.appendChild(statsCard);

    const allocCard = document.createElement('div');
    allocCard.style.cssText = `
        background: linear-gradient(135deg, rgba(20, 25, 45, 0.95) 0%, rgba(15, 18, 35, 0.98) 100%);
        border-radius: 20px;
        border: 1px solid rgba(255, 215, 120, 0.3);
        backdrop-filter: blur(4px);
        padding: 10px;
    `;

    const allocHeader = document.createElement('h3');
    allocHeader.style.cssText = `
        font-size: 1.4rem;
        font-weight: 600;
        margin-bottom: 1.2rem;
        display: flex;
        align-items: baseline;
        gap: 15px;
        flex-wrap: wrap;
        border-left: 4px solid #ffd778;
        padding-left: 15px;
        color: #ffecb3;
    `;

    const unspentSpan = document.createElement('span');
    unspentSpan.id = 'v-points';
    unspentSpan.style.cssText = 'font-size: 1.2rem; color: #ffd778; font-weight: normal;';
    unspentSpan.innerText = unspentPts;

    allocHeader.innerHTML = `<span>🧮 Allocate Stat Points</span>`;
    const unspentContainer = document.createElement('span');
    unspentContainer.style.cssText = 'font-size: 1.2rem; color: #ffd778; font-weight: normal;';
    unspentContainer.innerHTML = '✨ Available: ';
    unspentContainer.appendChild(unspentSpan);
    allocHeader.appendChild(unspentContainer);
    allocCard.appendChild(allocHeader);

    const allocStats = ['attack', 'defense', 'stamina'];
    const statNames = { attack: '⚔️ ATTACK', defense: '🛡️ DEFENSE', stamina: '💪 STAMINA' };

    allocStats.forEach(stat => {
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 8px 0;';

        const labelSpan = document.createElement('span');
        labelSpan.style.cssText = 'color: #b9c3e6; font-weight: 500; min-width: 80px; font-size: 1.2rem;';
        labelSpan.innerText = statNames[stat];

        const btnGroup = document.createElement('div');
        btnGroup.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;';

        const amounts = [1, 5, 50, 100];
        amounts.forEach(amount => {
            const btn = document.createElement('button');
            btn.innerText = `+${amount}`;
            btn.style.cssText = `
                background: #1e233b;
                border: 1px solid #5f6a8a;
                color: #ffdfa5;
                font-weight: bold;
                padding: 4px 12px;
                border-radius: 40px;
                font-size: 1.2rem;
                cursor: pointer;
                transition: all 0.1s;
                font-family: monospace;
            `;
            btn.addEventListener('mouseenter', () => {
                btn.style.background = '#d9b452';
                btn.style.color = '#0e0f1c';
                btn.style.borderColor = '#ffdfa5';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = '#1e233b';
                btn.style.color = '#ffdfa5';
                btn.style.borderColor = '#5f6a8a';
            });
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.alloc(stat, amount);
                window.location.reload()
            });
            btnGroup.appendChild(btn);
        });

        row.appendChild(labelSpan);
        row.appendChild(btnGroup);
        allocCard.appendChild(row);
    });

    twoColumnGrid.appendChild(allocCard);
    mainDisplay.appendChild(twoColumnGrid);

    const ratioCard = document.createElement('div');
    ratioCard.style.cssText = `
        background: linear-gradient(135deg, rgba(20, 25, 45, 0.95) 0%, rgba(15, 18, 35, 0.98) 100%);
        border-radius: 20px;
        border: 1px solid rgba(255, 215, 120, 0.3);
        backdrop-filter: blur(4px);
        padding: 7px;
    `;

    const ratioHeader = document.createElement('h3');
    ratioHeader.style.cssText = `
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        border-left: 5px solid #ffd778;
        padding-left: 18px;
        padding-right: 18px;
        color: #ffecb3;
    `;

    const buildRatioVal = statsFromLevel > 0 ? (atkDef / statsFromLevel) * 100 : 0;
    const statRatioVal = total > 0 ? (atkDef / total) * 100 : 0;

    let buildBuff = 'No Buff';
    if (buildRatioVal >= 80) buildBuff = '+15% XP & PEN';
    else if (buildRatioVal >= 60) buildBuff = '+10% XP & PEN';

    let statBuff = '30% Ape/Beatle Dmg';
    if (statRatioVal >= 60) statBuff = '100% Ape/Beatle Dmg';
    else if (statRatioVal >= 40) statBuff = '60% Ape/Beatle Dmg';

    ratioHeader.innerHTML = `
        <span>📊 Stat Ratio Analysis</span>
        <div style="display: flex; gap: 25px; font-size: 1rem;">
            <span style="color: #ffd778;">Current Buffs: </span>
            <span style="color: #ffd778;">⚔️ ${buildBuff}</span>
            <span style="color: #ffd778;">📐 ${statBuff}</span>
        </div>
    `;
    ratioCard.appendChild(ratioHeader);

    function createRatioRow(title, value, isNumber = false, targetValue = null, header = false) {
        const row = document.createElement('div');
        row.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            cursor: help;
        `;
        row.title = title;

        const nameSpan = document.createElement('span');
        nameSpan.style.cssText = header ? `
            font-size: 1.1rem;
            font-weight: 600;
            color: #ffd778;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid rgba(255, 215, 120, 0.3);
        ` : `color: #b9c3e6; font-weight: 500; font-size: 1rem;`;
        nameSpan.innerText = title;

        const valSpan = document.createElement('span');
        valSpan.style.cssText = header ? `
            font-family: monospace;
            font-weight: 700;
            background: rgba(0, 0, 0, 0.4);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 1.2rem;
            min-width: 120px;
            text-align: center;
        ` : `
            font-family: monospace;
            font-weight: 700;
            background: rgba(0, 0, 0, 0.4);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 1rem;
            min-width: 120px;
            text-align: center;
        `;

        let displayValue;
        let color = '#ffecb3';

        if (isNumber) {
            displayValue = value;
            if (targetValue !== null) {
                if (value <= 0) {
                    color = '#86efac';
                    displayValue = `✓ ${Math.abs(value)} Levels Over`;
                } else {
                    color = '#fca5a5';
                    displayValue = `${value} Levels Needed`;
                }
            }
        } else {
            displayValue = value.toFixed(1) + '%';
            if (title.includes('Build')) {
                if (value >= 80) color = '#86efac';
                else if (value >= 60) color = '#ffd778';
                else color = '#fca5a5';
            } else if (title.includes('Stat')) {
                if (value >= 60) color = '#86efac';
                else if (value >= 40) color = '#ffd778';
                else color = '#fca5a5';
            }
        }

        valSpan.style.color = color;
        valSpan.innerText = displayValue;
        row.appendChild(nameSpan);
        row.appendChild(valSpan);
        return row;
    }

    function createProgressBar(currentPercent, milestones, labels) {
        const container = document.createElement('div');
        container.style.cssText = 'margin: 10px 10px 20px 10px;';

        const cappedPercent = Math.min(100, Math.max(0, currentPercent));

        const barContainer = document.createElement('div');
        barContainer.style.cssText = 'position: relative; margin-bottom: 5px;';

        const barBg = document.createElement('div');
        barBg.style.cssText = 'background: rgba(0,0,0,0.5); border-radius: 12px; height: 10px; overflow: visible; position: relative;';

        const barFill = document.createElement('div');
        barFill.style.cssText = `background: linear-gradient(90deg, #ffd778, #ffb347); width: ${cappedPercent}%; height: 100%; border-radius: 12px; transition: width 0.3s;`;
        barBg.appendChild(barFill);

        const markerContainer = document.createElement('div');
        markerContainer.style.cssText = 'position: relative; height: 16px; margin-top: -13px;';

        milestones.forEach(milestone => {
            const marker = document.createElement('div');
            const markerPos = milestone.percent;
            marker.style.cssText = `
                position: absolute;
                left: ${markerPos}%;
                width: 4px;
                height: 16px;
                background: ${milestone.color};
                transform: translateX(-50%);
            `;
            marker.title = milestone.label;
            markerContainer.appendChild(marker);
        });

        barContainer.appendChild(barBg);
        barContainer.appendChild(markerContainer);

        const labelDiv = document.createElement('div');
        labelDiv.style.cssText = 'position: relative; margin-top: 6px; height: 20px;';

        labels.forEach(label => {
            const labelSpan = document.createElement('span');
            labelSpan.style.cssText = `
                position: absolute;
                left: ${label.percent}%;
                transform: translateX(-50%);
                font-size: 10px;
                color: #8e95b5;
                white-space: nowrap;
            `;
            labelSpan.innerText = label.text;
            labelDiv.appendChild(labelSpan);
        });

        container.appendChild(barContainer);
        container.appendChild(labelDiv);
        return container;
    }

    const ratioInner = document.createElement('div');
    ratioInner.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 25px;
        padding: 0 10px;
    `;

    const buildCol = document.createElement('div');

    const levelsTo60Build = statsFromLevel > 0 ? Math.ceil((statsFromLevel * 0.6 - atkDef) / 2) : 0;
    const levelsTo80Build = statsFromLevel > 0 ? Math.ceil((statsFromLevel * 0.8 - atkDef) / 2) : 0;

    buildCol.appendChild(createRatioRow('⚔️ BUILD RATIO (Attack + Defense / Stats from Levels)', buildRatioVal, false, null, true));
    buildCol.appendChild(createProgressBar(buildRatioVal,
        [
            { percent: 0, color: '#fca5a5', label: '0% Target (No Buff)' },
            { percent: 60, color: '#ffd778', label: '60% Target (+10% XP & PEN)' },
            { percent: 80, color: '#86efac', label: '80% Target (+15% XP & PEN)' }
        ],
        [
            { percent: 0, text: '0%' },
            { percent: 60, text: '🎯 60% (+10% XP & PEN)' },
            { percent: 80, text: '🏆 80% (+15% XP & PEN)' }
        ]));
    buildCol.appendChild(createRatioRow('Levels until 60% Build Ratio', levelsTo60Build, true, 0.6));
    buildCol.appendChild(createRatioRow('Levels until 80% Build Ratio', levelsTo80Build, true, 0.8));

    const statCol = document.createElement('div');

    const levelsTo40Stat = total > 0 ? Math.ceil((total * 0.4 - atkDef) / 2) : 0;
    const levelsTo60Stat = total > 0 ? Math.ceil((total * 0.6 - atkDef) / 2) : 0;

    statCol.appendChild(createRatioRow('📐 STAT RATIO (Attack + Defense / Total Stats)', statRatioVal, false, null, true));
    statCol.appendChild(createProgressBar(statRatioVal,
        [
            { percent: 0, color: '#fca5a5', label: '0% Target (30% Ape/Beatle DMG)' },
            { percent: 40, color: '#ffd778', label: '40% Target (60% Ape/Beatle DMG)' },
            { percent: 60, color: '#86efac', label: '60% Target (100% Ape/Beatle DMG)' }
        ],
        [
            { percent: 0, text: '🐣 0% (30% Dmg)' },
            { percent: 40, text: '🦍 40% (60% Dmg)' },
            { percent: 60, text: '💯 60% (100% Dmg)' }
        ]));
    statCol.appendChild(createRatioRow('Levels until 40% Stat Ratio', levelsTo40Stat, true, 0.4));
    statCol.appendChild(createRatioRow('Levels until 60% Stat Ratio', levelsTo60Stat, true, 0.6));

    ratioInner.appendChild(buildCol);
    ratioInner.appendChild(statCol);
    ratioCard.appendChild(ratioInner);
    mainDisplay.appendChild(ratioCard);

    grid.innerHTML = '';
    grid.appendChild(mainDisplay);

    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 900px) {
            .grid > div > div:first-child {
                grid-template-columns: 1fr !important;
            }
        }
    `;
    document.head.appendChild(style);
})();

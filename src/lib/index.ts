
import weapons from './weaponList.json';

export let weaponList: any[] = [];

export function init() {
    weaponList = weapons;


    let playerMaxHealth = 10;
    let playerCurrentHealth = 10;
    let enemyMaxHealth = 10;
    let enemyCurrentHealth = 10;
    let playerWeapon = weaponList[Math.floor(Math.random() * weaponList.length)];
    let enemyWeapon = null;
    let hasInit = true;
    let hasRound = true;
    let hasFought = false;
    let playerWon = false;
    let playerLost = false;

    weaponList = weapons;

    return {
        playerMaxHealth,
        playerCurrentHealth,
        enemyMaxHealth,
        enemyCurrentHealth,
        playerWeapon,
        enemyWeapon,
        hasInit,
        hasRound,
        hasFought,
        playerWon,
        playerLost
    }
}

export function newRound(hasInit: boolean) {
    if(hasInit) {
        weaponList = weapons;

        return {
            playerWeapon: weaponList[Math.floor(Math.random() * weaponList.length)],
            enemyWeapon: null,
            hasRound: true,
            hasFought: false
        }
    } else {
        throw new Error('Game not initialized');
    }
}

function calculateDamage(weapon: any): number {
    if (weapon.hitRange) {
        return weapon.baseDamage * Math.floor(Math.random() * weapon.hitRange);
    }
    return weapon.baseDamage;
}

interface FightResult {
    playerHealth: number;
    enemyHealth: number;
    enemyWeapon: any;
    hasFought: boolean;
    playerWon: boolean;
    playerLost: boolean;
}

function resolveCombat(
    playerHealth: number,
    enemyHealth: number,
    playerDamages: number,
    enemyDamages: number,
    enemyWeapon: any
): FightResult {
    if (playerDamages === enemyDamages) {
        return {
            playerHealth,
            enemyHealth,
            enemyWeapon,
            hasFought: true,
            playerWon: false,
            playerLost: false
        };
    }

    if (playerDamages > enemyDamages) {
        enemyHealth -= playerDamages - enemyDamages;
    } else {
        playerHealth -= enemyDamages - playerDamages;
    }

    if (playerHealth <= 0) playerHealth = 0;
    if (enemyHealth <= 0) enemyHealth = 0;

    if (enemyHealth === 0) {
        return { playerHealth, enemyHealth, enemyWeapon, hasFought: true, playerWon: true, playerLost: false };
    }
    if (playerHealth === 0) {
        return { playerHealth, enemyHealth, enemyWeapon, hasFought: true, playerWon: false, playerLost: true };
    }

    return { playerHealth, enemyHealth, enemyWeapon, hasFought: true, playerWon: false, playerLost: false };
}

export function fight(playerHealth: number, enemyHealth: number, playerWeapon: any, hasInit: boolean, hasRound: boolean, hasFought: boolean): FightResult {
    if (!hasInit) throw new Error('Game not initialized');
    if (!hasRound) throw new Error('Round not initialized');
    if (hasFought) throw new Error('Round already played');

    const playerDamages = calculateDamage(playerWeapon);

    weaponList = weapons;
    const enemyWeapon = weaponList[Math.floor(Math.random() * weaponList.length)];
    const enemyDamages = calculateDamage(enemyWeapon);

    return resolveCombat(playerHealth, enemyHealth, playerDamages, enemyDamages, enemyWeapon);
}

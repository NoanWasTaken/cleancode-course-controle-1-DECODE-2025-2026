import weaponData from './weaponList.json';

export interface Weapon {
	name: string;
	description: string;
	rarity: string;
	baseDamage: number;
	hitRange?: number;
}

export interface GameState {
	playerMaxHealth: number;
	playerCurrentHealth: number;
	enemyMaxHealth: number;
	enemyCurrentHealth: number;
	playerWeapon: Weapon | null;
	enemyWeapon: Weapon | null;
	hasInit: boolean;
	hasRound: boolean;
	hasFought: boolean;
	playerWon: boolean;
	playerLost: boolean;
}

export interface RoundState {
	playerWeapon: Weapon;
	enemyWeapon: null;
	hasRound: boolean;
	hasFought: boolean;
}

export interface FightResult {
	playerHealth: number;
	enemyHealth: number;
	enemyWeapon: Weapon | null;
	hasFought: boolean;
	playerWon: boolean;
	playerLost: boolean;
}

export const INITIAL_HEALTH = 10;

const weapons = weaponData as Weapon[];

export let weaponList: Weapon[] = [];

export function init(): GameState {
	weaponList = weapons;

	const playerMaxHealth = INITIAL_HEALTH;
	const playerCurrentHealth = INITIAL_HEALTH;
	const enemyMaxHealth = INITIAL_HEALTH;
	const enemyCurrentHealth = INITIAL_HEALTH;
	let playerWeapon = weaponList[Math.floor(Math.random() * weaponList.length)];
	let enemyWeapon: Weapon | null = null;
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
	};
}

export function newRound(hasInit: boolean): RoundState {
	if (hasInit) {
		weaponList = weapons;

		return {
			playerWeapon: weaponList[Math.floor(Math.random() * weaponList.length)],
			enemyWeapon: null,
			hasRound: true,
			hasFought: false
		};
	} else {
		throw new Error('Game not initialized');
	}
}

function calculateDamage(weapon: Weapon): number {
	if (weapon.hitRange) {
		return weapon.baseDamage * Math.floor(Math.random() * weapon.hitRange);
	}
	return weapon.baseDamage;
}

function resolveCombat(
	playerHealth: number,
	enemyHealth: number,
	playerDamages: number,
	enemyDamages: number,
	enemyWeapon: Weapon | null
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
		return {
			playerHealth,
			enemyHealth,
			enemyWeapon,
			hasFought: true,
			playerWon: true,
			playerLost: false
		};
	}
	if (playerHealth === 0) {
		return {
			playerHealth,
			enemyHealth,
			enemyWeapon,
			hasFought: true,
			playerWon: false,
			playerLost: true
		};
	}

	return {
		playerHealth,
		enemyHealth,
		enemyWeapon,
		hasFought: true,
		playerWon: false,
		playerLost: false
	};
}

export function fight(
	playerHealth: number,
	enemyHealth: number,
	playerWeapon: Weapon,
	hasInit: boolean,
	hasRound: boolean,
	hasFought: boolean
): FightResult {
	if (!hasInit) throw new Error('Game not initialized');
	if (!hasRound) throw new Error('Round not initialized');
	if (hasFought) throw new Error('Round already played');

	const playerDamages = calculateDamage(playerWeapon);

	weaponList = weapons;
	const enemyWeapon = weaponList[Math.floor(Math.random() * weaponList.length)];
	const enemyDamages = calculateDamage(enemyWeapon);

	return resolveCombat(playerHealth, enemyHealth, playerDamages, enemyDamages, enemyWeapon);
}

import weaponData from './weaponList.json';

export interface Weapon {
	name: string;
	description: string;
	rarity: string;
	baseDamage: number;
	hitRange?: number;
}

export type GameStatus = 'not_started' | 'round_active' | 'round_complete' | 'won' | 'lost';

export interface GameState {
	playerMaxHealth: number;
	playerCurrentHealth: number;
	enemyMaxHealth: number;
	enemyCurrentHealth: number;
	playerWeapon: Weapon | null;
	enemyWeapon: Weapon | null;
	status: GameStatus;
}

export interface RoundState {
	playerWeapon: Weapon;
	enemyWeapon: null;
	status: 'round_active';
}

export interface FightResult {
	playerHealth: number;
	enemyHealth: number;
	enemyWeapon: Weapon | null;
	status: 'round_complete' | 'won' | 'lost';
}

export const INITIAL_HEALTH = 10;

const weapons = weaponData as Weapon[];

export let weaponList: Weapon[] = [];

export function init(): GameState {
	weaponList = weapons;

	const playerWeapon = weaponList[Math.floor(Math.random() * weaponList.length)];

	weaponList = weapons;

	return {
		playerMaxHealth: INITIAL_HEALTH,
		playerCurrentHealth: INITIAL_HEALTH,
		enemyMaxHealth: INITIAL_HEALTH,
		enemyCurrentHealth: INITIAL_HEALTH,
		playerWeapon,
		enemyWeapon: null,
		status: 'round_active'
	};
}

export function newRound(status: GameStatus): RoundState {
	if (status === 'not_started') {
		throw new Error('Game not initialized');
	}

	weaponList = weapons;

	return {
		playerWeapon: weaponList[Math.floor(Math.random() * weaponList.length)],
		enemyWeapon: null,
		status: 'round_active'
	};
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
		return { playerHealth, enemyHealth, enemyWeapon, status: 'round_complete' };
	}

	if (playerDamages > enemyDamages) {
		enemyHealth -= playerDamages - enemyDamages;
	} else {
		playerHealth -= enemyDamages - playerDamages;
	}

	if (playerHealth <= 0) playerHealth = 0;
	if (enemyHealth <= 0) enemyHealth = 0;

	if (enemyHealth === 0) {
		return { playerHealth, enemyHealth, enemyWeapon, status: 'won' };
	}
	if (playerHealth === 0) {
		return { playerHealth, enemyHealth, enemyWeapon, status: 'lost' };
	}

	return { playerHealth, enemyHealth, enemyWeapon, status: 'round_complete' };
}

export function fight(
	playerHealth: number,
	enemyHealth: number,
	playerWeapon: Weapon,
	status: GameStatus
): FightResult {
	if (status !== 'round_active') throw new Error('Round not ready');

	const playerDamages = calculateDamage(playerWeapon);

	weaponList = weapons;
	const enemyWeapon = weaponList[Math.floor(Math.random() * weaponList.length)];
	const enemyDamages = calculateDamage(enemyWeapon);

	return resolveCombat(playerHealth, enemyHealth, playerDamages, enemyDamages, enemyWeapon);
}

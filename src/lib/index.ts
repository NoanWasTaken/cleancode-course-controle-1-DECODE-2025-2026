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
	rerollsRemaining: number;
	usedWeapons: Weapon[];
}

export interface RoundState {
	playerWeapon: Weapon;
	enemyWeapon: null;
	status: 'round_active';
	rerollsRemaining: number;
	usedWeapons: Weapon[];
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

	const playerWeapon = getRandomWeapon(weapons, []);

	weaponList = weapons;

	return {
		playerMaxHealth: INITIAL_HEALTH,
		playerCurrentHealth: INITIAL_HEALTH,
		enemyMaxHealth: INITIAL_HEALTH,
		enemyCurrentHealth: INITIAL_HEALTH,
		playerWeapon,
		enemyWeapon: null,
		status: 'round_active',
		rerollsRemaining: 2,
		usedWeapons: [playerWeapon]
	};
}

function getRandomWeapon(pool: Weapon[], exclude: Weapon[]): Weapon {
	const available = pool.filter((w) => !exclude.some((e) => e.name === w.name));
	if (available.length === 0) throw new Error('No weapons available');
	return available[Math.floor(Math.random() * available.length)];
}

export function newRound(status: GameStatus): RoundState {
	if (status === 'not_started') {
		throw new Error('Game not initialized');
	}

	weaponList = weapons;

	const playerWeapon = getRandomWeapon(weaponList, []);

	return {
		playerWeapon,
		enemyWeapon: null,
		status: 'round_active',
		rerollsRemaining: 2,
		usedWeapons: [playerWeapon]
	};
}

function calculateDamage(weapon: Weapon): number {
	if (weapon.hitRange) {
		return weapon.baseDamage * Math.floor(Math.random() * weapon.hitRange);
	}
	return weapon.baseDamage;
}

function victoryAssigner(
	playerHealth: number,
	enemyHealth: number
): 'won' | 'lost' | 'round_complete' {
	if (playerHealth <= 0) return 'lost';
	if (enemyHealth <= 0) return 'won';
	return 'round_complete';
}

function whoTakesDamage(playerDamages: number, enemyDamages: number): 'player' | 'enemy' | 'none' {
	if (playerDamages > enemyDamages) return 'enemy';
	if (enemyDamages > playerDamages) return 'player';
	return 'none';
}

function applyDamage(
	playerHealth: number,
	enemyHealth: number,
	playerDamages: number,
	enemyDamages: number
): { playerHealth: number; enemyHealth: number } {
	if (playerDamages === enemyDamages) {
		return { playerHealth, enemyHealth };
	}

	const damageReceiver = whoTakesDamage(playerDamages, enemyDamages);
	if (damageReceiver === 'player') {
		playerHealth -= enemyDamages - playerDamages;
	} else if (damageReceiver === 'enemy') {
		enemyHealth -= playerDamages - enemyDamages;
	}

	if (playerHealth <= 0) playerHealth = 0;
	if (enemyHealth <= 0) enemyHealth = 0;

	return { playerHealth, enemyHealth };
}

function resolveCombat(
	playerHealth: number,
	enemyHealth: number,
	playerDamages: number,
	enemyDamages: number,
	enemyWeapon: Weapon | null
): FightResult {
	const updatedHealths = applyDamage(playerHealth, enemyHealth, playerDamages, enemyDamages);
	playerHealth = updatedHealths.playerHealth;
	enemyHealth = updatedHealths.enemyHealth;

	const victory = victoryAssigner(playerHealth, enemyHealth);
	return { playerHealth, enemyHealth, enemyWeapon, status: victory };
}

export function rerollWeapon(state: RoundState): RoundState {
	if (state.rerollsRemaining <= 0) throw new Error('No rerolls remaining');

	const newWeapon = getRandomWeapon(weapons, state.usedWeapons);

	return { ...state, playerWeapon: newWeapon, rerollsRemaining: state.rerollsRemaining - 1 };
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
	const enemyWeapon = getRandomWeapon(weaponList, [playerWeapon]);
	const enemyDamages = calculateDamage(enemyWeapon);

	return resolveCombat(playerHealth, enemyHealth, playerDamages, enemyDamages, enemyWeapon);
}

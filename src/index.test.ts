import { describe, it, expect, vi } from 'vitest';
import { rerollWeapon, init, newRound, fight, INITIAL_HEALTH, type Weapon, type RoundState } from '$lib';

const mockWeapon: Weapon = {
	name: 'hatchet',
	description: 'Deals 1 damage to the enemy.',
	rarity: 'common',
	baseDamage: 1
};

function makeRoundState(overrides?: Partial<RoundState>): RoundState {
	return {
		playerWeapon: mockWeapon,
		enemyWeapon: null,
		status: 'round_active',
		rerollsRemaining: 2,
		usedWeapons: [mockWeapon],
		...overrides
	};
}

describe('init', () => {
	it('returns a GameState with round_active status and full health', () => {
		const state = init();
		expect(state.status).toBe('round_active');
		expect(state.playerCurrentHealth).toBe(INITIAL_HEALTH);
		expect(state.enemyCurrentHealth).toBe(INITIAL_HEALTH);
		expect(state.rerollsRemaining).toBe(2);
		expect(state.usedWeapons).toHaveLength(1);
	});
});

describe('newRound', () => {
	it('throws if game not started', () => {
		expect(() => newRound('not_started')).toThrow('Game not initialized');
	});

	it('returns a RoundState with 2 rerolls', () => {
		const result = newRound('round_complete');
		expect(result.status).toBe('round_active');
		expect(result.rerollsRemaining).toBe(2);
		expect(result.usedWeapons).toHaveLength(1);
	});
});

describe('rerollWeapon', () => {
	it('decrements rerollsRemaining', () => {
		const state = makeRoundState();
		const result = rerollWeapon(state);
		expect(result.rerollsRemaining).toBe(1);
	});

	it('throws when no rerolls remaining', () => {
		const state = makeRoundState({ rerollsRemaining: 0 });
		expect(() => rerollWeapon(state)).toThrow('No rerolls remaining');
	});

	it('returns a different weapon from the current one', () => {
		const state = makeRoundState({ usedWeapons: [mockWeapon] });
		const result = rerollWeapon(state);
		expect(result.playerWeapon.name).not.toBe(mockWeapon.name);
	});
});

describe('fight', () => {
	it('throws if status is not round_active', () => {
		expect(() => fight(10, 10, mockWeapon, 'not_started')).toThrow('Round not ready');
	});

	it('returns a FightResult with a status', () => {
		vi.spyOn(Math, 'random').mockReturnValue(0);
		const result = fight(10, 10, mockWeapon, 'round_active');
		expect(result.status).toBe('round_complete');
		vi.restoreAllMocks();
	});
});

<script lang="ts">

    import { fight, init, newRound, rerollWeapon, INITIAL_HEALTH, type GameState, type FightResult, type RoundState } from "$lib";

    let state: GameState = {
        playerMaxHealth: INITIAL_HEALTH,
        playerCurrentHealth: INITIAL_HEALTH,
        enemyMaxHealth: INITIAL_HEALTH,
        enemyCurrentHealth: INITIAL_HEALTH,
        playerWeapon: null,
        enemyWeapon: null,
        status: 'not_started',
        rerollsRemaining: 2,
        usedWeapons: []
    };

    function triggerInit() {
        state = init();
    }

    function triggerNewRound() {
        let response: RoundState | null = null;
        try {        
            response = newRound(state.status);
        } catch (error) {
            console.error(error);
        }

        if(response !== null) {
            state.playerWeapon = response.playerWeapon;
            state.enemyWeapon = response.enemyWeapon;
            state.status = response.status;
            state.rerollsRemaining = response.rerollsRemaining;
            state.usedWeapons = response.usedWeapons;
        }

    }

    function triggerReroll() {
        const roundState: RoundState = {
            playerWeapon: state.playerWeapon!,
            enemyWeapon: null,
            status: 'round_active',
            rerollsRemaining: state.rerollsRemaining,
            usedWeapons: state.usedWeapons
        };

        try {
            const result = rerollWeapon(roundState);
            state.playerWeapon = result.playerWeapon;
            state.rerollsRemaining = result.rerollsRemaining;
        } catch (error) {
            console.error(error);
        }
    }

    function triggerFight() {
        let response: FightResult | null = null;

        try {        
            response = fight(state.playerCurrentHealth, state.enemyCurrentHealth, state.playerWeapon!, state.status);
        } catch (error) {
            console.error(error);
        }

        if(response !== null) {
            state.playerCurrentHealth = response.playerHealth;
            state.enemyCurrentHealth = response.enemyHealth;
            state.enemyWeapon = response.enemyWeapon;
            state.status = response.status;
        }
    }

</script>


<section id="player" class="w-1/3">
    {#if state.status !== 'not_started'}
        <div class="flex flex-row items-center justify-between flex-wrap w-full">
            <div class="flex flex-col items-center justify-center w-full">
                <h1 class="text-2xl font-bold">Player</h1>
                <p class="text-lg">Health: {state.playerCurrentHealth} / {state.playerMaxHealth}</p>
                {#if state.playerWeapon !== null}
                    <p class="text-lg">Weapon name: {state.playerWeapon.name}</p>
                    <p class="text-lg">Weapon description: {state.playerWeapon.description}</p>
                {/if}
            </div>
        </div>
    {/if}
</section>

<section id="action">
    {#if state.status === 'not_started'}
        <button class="btn btn-xl variant-filled-primary" on:click={triggerInit}>Start</button>
    {:else if state.status === 'round_complete'}
        <button class="btn btn-xl variant-filled-warning" on:click={triggerNewRound}>Next Round</button>
    {:else if state.status === 'round_active'}
        <button class="btn btn-xl variant-filled-error" on:click={triggerFight}>Fight</button>
        <button class="btn btn-xl variant-filled" on:click={triggerReroll} disabled={state.rerollsRemaining <= 0}>
            Reroll ({state.rerollsRemaining})
        </button>
    {:else if state.status === 'won'}
        <p class="p">You won !</p>
        <button class="btn btn-xl variant-filled-primary" on:click={triggerInit}>Play again</button>
    {:else if state.status === 'lost'}
        <p class="p">You lost ...</p>
        <button class="btn btn-xl variant-filled-primary" on:click={triggerInit}>Play again</button>
    {/if}
</section>

<section id="enemy" class="w-1/3">
    {#if state.status !== 'not_started'}
        <div class="flex flex-row items-center justify-between flex-wrap w-full">
            <div class="flex flex-col items-center justify-center w-full">
                <h1 class="text-2xl font-bold">Enemy</h1>
                <p class="text-lg">Health: {state.enemyCurrentHealth} / {state.enemyMaxHealth}</p>
                {#if state.enemyWeapon !== null}
                    <p class="text-lg">Weapon name: {state.enemyWeapon.name}</p>
                    <p class="text-lg">Weapon description: {state.enemyWeapon.description}</p>
                {/if}
            </div>
        </div>
    {/if}
</section>

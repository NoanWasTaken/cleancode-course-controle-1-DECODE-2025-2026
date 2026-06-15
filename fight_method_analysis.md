# Analyse méhtode fight

## Problèmes identifiés (7)

### 1. God Function

La méthode fait tout : validation d'état, calcul des dégâts joueur, calcul des dégâts ennemi, détermination du vainqueur, mise a jour des HP, vérification de fin de partie. Il faudrait faire des fonctions qui ont une responsabilité chacune

### 2. Anti-pattern Arrow

3 niveaux de 'if/else'. Remplacer par des guard clauses :

'''ts
if (!hasInit) throw new Error('Game not initialized');
if (!hasRound) throw new Error('Round not initialized');
if (hasFought) throw new Error('Round already played');
'''

### 3. Duplication dont repeat yourself

Le 'switch' de 24 lignes calculant les dégâts est copié collé pour le joueur et l'ennemi. Il faudrait faire une fonction calculateDamage(weapon).

### 4. Type de retour unsafe

'Array<number|boolean>' force l'appelant à utiliser 'response[0]', 'response[1]' etc. Il faudrait retourner un objet typé 'FightResult'.

### 5. Absence de types / 'any'

'playerWeapon: any', aucune interface 'Weapon'. Pourquoi faire du ts si on type pas :) (Du coup il faudrait typer)

### 6. Nombres magiques

'1', '3', '5', 'Math.random() \* 5' disséminés sans constantes nommées. Remplacer par 'INITIAL_HEALTH = 10' et des valeurs dans 'weaponList.json'.

### 7. Commentaires

'// health cannot be negative', '// reset weapon list so the enemy could play' expliquent la fonction, parce qu'elles sont mal nommées. il faut remplacer par des noms plus explicites (des fonctions)

---

## Bonus

### 8. Switch en clean code (+4 points)

Il faut remplacer le switch par une approche plus propre : soit une table de correspondance (lookup map), soit des données dans le JSON. L'objectif est de supprimer la duplication et la logique conditionnelle rigide.

### 9. Booléens → état du jeu (+4 points)

Dans '/src/routes/+page.svelte', les 5 booléens ('hasInit, 'hasRound', 'hasFought', 'playerWon', 'playerLost') doivent être remplacés par un seul état type énumération (ex: ''not_started'', ''round_active'', ''player_won'', ''player_lost'').

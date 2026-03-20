export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	blindteampreview: {
		effectType: 'Rule',
		name: 'Blind Team Preview',
		desc: "Players can see their own team, but the opponent's team is hidden as mystery Poké Balls.",
		onTeamPreview() {
			this.add('clearpoke');
			
			for (const side of this.sides) {
				let firstPokemon = true;
				
				for (const pokemon of side.pokemon) {
					// Scrub the shiny data to prevent leaks
					const details = pokemon.details.replace(/(, |-)shiny/, '');
					
					// Trigger the split protocol for this specific Pokémon slot
					this.add(`|split|${side.id}`);
					
					// 1. What the owner sees (Their real Pokémon)
					this.add('poke', side.id, details, pokemon.item ? 'item' : '');
					
					// 2. What the opponent and spectators see
					if (firstPokemon) {
						// Render exactly ONE mystery block
						this.add('poke', side.id, 'MissingNo., L100', '');
						firstPokemon = false;
					} else {
						// For the other 5 slots, send a harmless debug string. 
						// The protocol requires a line here, but the client will ignore it and draw nothing!
						this.add('debug', 'Hidden slot'); 
					}
				}
			}
			this.makeRequest('teampreview');
		},
	},
};
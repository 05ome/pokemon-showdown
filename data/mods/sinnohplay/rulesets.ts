export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	blindteampreview: {
		effectType: 'Rule',
		name: 'Blind Team Preview',
		desc: "Players can see their own team, but the opponent's team is hidden as mystery Poké Balls.",
		onTeamPreview() {
			this.add('clearpoke');
			
			for (const side of this.sides) {
				for (let i = 0; i < side.pokemon.length; i++) {
					const pokemon = side.pokemon[i];
					const details = pokemon.details.replace(/(, |-)shiny/, '');
					
					// Trigger the split protocol
					this.add(`|split|${side.id}`);
					
					// 1. What the owner sees (Their real Pokémon)
					this.add('poke', side.id, details, pokemon.item ? 'item' : '');
					
					// 2. What the opponent sees
					if (i === 0) {
						// The first slot renders a single Poké Ball
						this.add('poke', side.id, 'unknown', '');
					} else {
						// The other 5 slots are sent a hidden debug message.
						// This satisfies the split protocol without drawing anything on screen.
						this.add('debug', 'hidden pokemon slot'); 
					}
				}
			}
			this.makeRequest('teampreview');
		},
	},
};
export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	blindteampreview: {
		effectType: 'Rule',
		name: 'Blind Team Preview',
		desc: "Players can see their own team, but the opponent's team is hidden as mystery Poké Balls.",
		onBegin() {
			this.add('clearpoke');
			for (const pokemon of this.getAllPokemon()) {
				// Strip out shiny data so it doesn't break the client parser
				const details = pokemon.details.replace(/(, |-)shiny/, '');
				
				// The split protocol: Next line goes to the owner, the line after goes to everyone else
				this.add(`|split|${pokemon.side.id}`);
				
				// 1. What the owner sees (Full Details)
				this.add('poke', pokemon.side.id, details, pokemon.item ? 'item' : '');
				
				// 2. What the opponent and spectators see (Hidden Info)
				// Sending '???' tells the client to render a generic Poké Ball
				this.add('poke', pokemon.side.id, '???', '');
			}
		},
		onTeamPreview() {
			this.makeRequest('teampreview');
		},
	},
};
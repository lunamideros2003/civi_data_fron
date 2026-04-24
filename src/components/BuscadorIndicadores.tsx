import React, { useState } from 'react';
import { LucideSearch } from 'lucide-react';

export default function BuscadorIndicadores() {
	const [query, setQuery] = useState('');

	return (
		<div className="relative group">
			<div className="absolute inset-0 bg-brand-primary/20 blur-xl group-hover:bg-brand-primary/30 transition-colors rounded-2xl"></div>
			<div className="relative glass flex items-center p-2 rounded-2xl border border-white/10 focus-within:border-brand-primary/50 transition-all">
				<LucideSearch className="ml-4 text-slate-400" size={24} />
				<input 
					type="text" 
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Buscar indicadores, entidades o procesos..." 
					className="bg-transparent border-none focus:ring-0 text-white w-full px-4 py-3 text-lg"
				/>
				<button className="bg-brand-primary hover:bg-brand-primary/80 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-brand-primary/20">
					Buscar
				</button>
			</div>
			
			{query.length > 2 && (
				<div className="absolute top-full left-0 right-0 mt-4 glass rounded-2xl border border-white/10 p-4 z-50 shadow-2xl">
					<p className="text-xs font-bold text-slate-500 uppercase mb-3 px-2">Resultados para "{query}"</p>
					<div className="space-y-2">
						<a href="/contratos/por-modalidad" className="block p-3 rounded-xl hover:bg-white/5 transition-colors">
							<p className="text-sm font-bold">Distribución por Modalidad</p>
							<p className="text-xs text-slate-500">Categoría: Contratos</p>
						</a>
						<a href="/entidades/top-contratantes" className="block p-3 rounded-xl hover:bg-white/5 transition-colors">
							<p className="text-sm font-bold">Top Entidades</p>
							<p className="text-xs text-slate-500">Categoría: Entidades</p>
						</a>
					</div>
				</div>
			)}
		</div>
	);
}

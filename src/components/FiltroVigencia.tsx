import React, { useState } from 'react';

export default function FiltroVigencia() {
	const [vigencia, setVigencia] = useState('2024');
	const vigencias = ['2022', '2023', '2024', '2025'];

	return (
		<div className="flex items-center gap-2 p-1 rounded-xl glass border border-white/10">
			{vigencias.map((v) => (
				<button
					key={v}
					onClick={() => setVigencia(v)}
					className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
						vigencia === v 
							? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
							: 'text-slate-400 hover:text-white hover:bg-white/5'
					}`}
				>
					{v}
				</button>
			))}
		</div>
	);
}

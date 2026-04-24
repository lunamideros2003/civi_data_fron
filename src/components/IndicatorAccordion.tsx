import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideChevronDown } from 'lucide-react';

interface AccordionItemProps {
	title: string;
	description: string;
	href: string;
}

const AccordionItem = ({ title, description, href }: AccordionItemProps) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="glass rounded-xl mb-4 overflow-hidden border border-white/5 hover:border-white/10 transition-colors">
			<button 
				onClick={() => setIsOpen(!isOpen)}
				className="w-full p-6 flex items-center justify-between text-left"
			>
				<h3 className="text-lg font-heading font-bold">{title}</h3>
				<motion.div
					animate={{ rotate: isOpen ? 180 : 0 }}
					className="text-slate-400"
				>
					<LucideChevronDown size={20} />
				</motion.div>
			</button>
			
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
					>
						<div className="px-6 pb-6 pt-2 border-t border-white/5">
							<p className="text-slate-400 mb-6 leading-relaxed">{description}</p>
							<a 
								href={href}
								className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-brand-primary/20 text-brand-primary font-bold hover:bg-brand-primary/30 transition-colors"
							>
								Ver visualización →
							</a>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default function IndicatorAccordion({ items }: { items: AccordionItemProps[] }) {
	return (
		<div>
			{items.map((item, index) => (
				<AccordionItem key={index} {...item} />
			))}
		</div>
	);
}

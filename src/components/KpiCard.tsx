import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
	title: string;
	value: number;
	icon: LucideIcon;
	suffix?: string;
	prefix?: string;
	trend?: {
		value: number;
		isPositive: boolean;
	};
}

export default function KpiCard({ title, value, icon: Icon, suffix = "", prefix = "", trend }: KpiCardProps) {
	const spring = useSpring(0, { stiffness: 45, damping: 15 });
	const displayValue = useTransform(spring, (latest) => {
		if (latest >= 1000000) {
			return `${prefix}${(latest / 1000000).toFixed(1)}M${suffix}`;
		}
		return `${prefix}${Math.floor(latest).toLocaleString()}${suffix}`;
	});

	useEffect(() => {
		spring.set(value);
	}, [value, spring]);

	return (
		<motion.div 
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-brand-primary/50 transition-colors"
		>
			<div className="absolute -right-4 -top-4 text-white/5 group-hover:text-brand-primary/10 transition-colors">
				<Icon size={120} />
			</div>
			
			<div className="relative z-10">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary">
						<Icon size={20} />
					</div>
					<h3 className="text-slate-400 font-medium">{title}</h3>
				</div>
				
				<motion.div className="text-3xl font-heading font-bold mb-2">
					{displayValue}
				</motion.div>
				
				{trend && (
					<div className={`text-sm flex items-center gap-1 ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
						<span>{trend.isPositive ? '↑' : '↓'}</span>
						<span>{trend.value}% vs mes anterior</span>
					</div>
				)}
			</div>
		</motion.div>
	);
}

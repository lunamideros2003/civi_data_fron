import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
	id: string;
	role: 'user' | 'assistant';
	text: string;
	sources?: string[];
};

export default function RagAssistant() {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			role: 'assistant',
			text: '¡Hola! Soy el asistente inteligente de CiviData. Puedes preguntarme sobre los datos de contratación pública. ¿En qué te puedo ayudar hoy?'
		}
	]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isLoading]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || isLoading) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			role: 'user',
			text: input.trim()
		};

		setMessages(prev => [...prev, userMessage]);
		setInput('');
		setIsLoading(true);

		try {
			// Usamos la variable de entorno o localhost por defecto
			const apiUrl = import.meta.env.PUBLIC_RAG_API_URL || 'http://localhost:8000/api/rag';
			
			const response = await fetch(`${apiUrl}/query`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					question: userMessage.text,
					category: 'contratacion'
				})
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			
			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				text: data.answer || 'Lo siento, no pude obtener una respuesta en este momento.',
				sources: data.sources
			};

			setMessages(prev => [...prev, assistantMessage]);
		} catch (error) {
			console.error('Error fetching RAG API:', error);
			const errorMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				text: 'Hubo un error al conectar con el servidor de análisis. Asegúrate de que el backend RAG esté encendido.'
			};
			setMessages(prev => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 20, scale: 0.95 }}
						transition={{ duration: 0.2 }}
						className="bg-brand-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] flex flex-col mb-4 shadow-2xl overflow-hidden"
					>
						{/* Header */}
						<div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
							<div className="flex items-center gap-2">
								<div className="p-1.5 bg-brand-primary/20 rounded-lg text-brand-primary">
									<Bot size={20} />
								</div>
								<div>
									<h3 className="font-bold text-sm">Asistente CiviData</h3>
									<div className="flex items-center gap-1.5">
										<div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
										<span className="text-xs text-slate-400">IA Activa</span>
									</div>
								</div>
							</div>
							<button 
								onClick={() => setIsOpen(false)}
								className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
							>
								<X size={20} />
							</button>
						</div>

						{/* Messages */}
						<div className="flex-1 overflow-y-auto p-4 space-y-4">
							{messages.map((msg) => (
								<div 
									key={msg.id} 
									className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
								>
									<div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
										msg.role === 'user' ? 'bg-brand-primary text-white' : 'bg-slate-800 text-brand-primary border border-white/10'
									}`}>
										{msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
									</div>
									<div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[75%]`}>
										<div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
											msg.role === 'user' 
												? 'bg-brand-primary text-white rounded-tr-sm' 
												: 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm'
										}`}>
											{msg.text}
										</div>
										{msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
											<div className="mt-2 text-[10px] text-slate-500 flex flex-col gap-1">
												<span className="font-semibold text-slate-400">Fuentes:</span>
												<ul className="list-disc pl-3">
													{msg.sources.map((source, idx) => (
														<li key={idx}>{source}</li>
													))}
												</ul>
											</div>
										)}
									</div>
								</div>
							))}
							
							{isLoading && (
								<div className="flex gap-3 flex-row">
									<div className="w-8 h-8 rounded-full bg-slate-800 text-brand-primary border border-white/10 flex items-center justify-center shrink-0">
										<Bot size={16} />
									</div>
									<div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm flex items-center gap-2">
										<span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce"></span>
										<span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '0.2s' }}></span>
										<span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '0.4s' }}></span>
									</div>
								</div>
							)}
							<div ref={messagesEndRef} />
						</div>

						{/* Input */}
						<form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-black/20">
							<div className="relative flex items-center">
								<input
									type="text"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									placeholder="Haz una pregunta sobre los datos..."
									className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary/50 transition-colors"
									disabled={isLoading}
								/>
								<button
									type="submit"
									disabled={!input.trim() || isLoading}
									className="absolute right-2 p-1.5 bg-brand-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-primary/80 transition-colors"
								>
									{isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
								</button>
							</div>
						</form>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Toggle Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 ${
					isOpen 
						? 'bg-slate-800 text-white border border-white/10 hover:bg-slate-700' 
						: 'bg-brand-primary text-white hover:shadow-brand-primary/25'
				}`}
			>
				{isOpen ? <X size={24} /> : <MessageCircle size={24} />}
			</button>
		</div>
	);
}

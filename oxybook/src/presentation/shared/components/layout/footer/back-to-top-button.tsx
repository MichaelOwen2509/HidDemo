"use client";

export function BackToTopButton() {
	return (
		<button
			type="button"
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			className="mt-2 md:mt-0 bg-white rounded-lg text-[#4E0000] w-47 h-9 flex justify-center items-center text-xs gap-1 cursor-pointer hover:bg-white/90 transition-colors"
		>
			Voltar ao topo ↑
		</button>
	);
}

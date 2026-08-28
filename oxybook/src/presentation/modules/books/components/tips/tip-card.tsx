import { Heart } from "lucide-react";

interface TipCardProps {
	tip: {
		title: string;
		description: string;
	};
}

export function TipCard({ tip }: TipCardProps) {
	return (
		<article className="flex items-start gap-4 rounded-xl border-1 border-[#6746354D] bg-white p-5 shadow-sm ">
			<div
				aria-hidden="true"
				className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#4E0000]"
			>
				<Heart size={20} className="text-[#F8F6F3]" />
			</div>

			<div>
				<h3 className="text-sm font-semibold text-[#4E0000CC]">{tip.title}</h3>
				<p className="mt-1 text-xs leading-relaxed text-[#4E0000CC]">
					{tip.description}
				</p>
			</div>
		</article>
	);
}

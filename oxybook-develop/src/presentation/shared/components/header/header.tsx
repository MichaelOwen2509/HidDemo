"use client";

import Image from "next/image";
import { ShoppingCart, Heart, User } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full bg-[#F8F6F3]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/svg/logo-ceuma.svg"
            alt="Ceuma Universidade"
            width={160}
            height={50}
            priority
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 bg-white border border-[#6746354D] rounded-lg hover:bg-gray-200">
            <ShoppingCart size={20} className="text-[#4E0000]"/>
          </button>

          <button className="p-2 bg-white border border-[#6746354D] rounded-lg hover:bg-gray-200">
            <Heart size={20} className="text-[#4E0000]"/>
          </button>

          <button className="p-2 bg-white border border-[#6746354D] rounded-lg hover:bg-gray-200">
            <User size={20} className="text-[#4E0000]"/>
          </button>
        </div>
      </div>
    </header>
  );
}

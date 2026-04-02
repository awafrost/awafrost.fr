// src/components/RobloxChat.tsx
'use client';
import { FaPaperPlane, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

export function RobloxChat() {
  return (
    <div className="flex flex-col h-full bg-[#232527] rounded-t-lg border border-white/10 shadow-2xl overflow-hidden">
      <div className="p-3 bg-[#393B3D] flex justify-between items-center border-b border-black/20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></span>
          <span className="text-xs font-bold uppercase tracking-wide">Chat</span>
        </div>
        <div className="flex gap-3 opacity-50">
          <FaExternalLinkAlt className="text-[10px] cursor-pointer" />
          <FaTimes className="text-xs cursor-pointer" />
        </div>
      </div>
      
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto bg-[#191B1D]">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-bold text-gray-400">Builderman</p>
          <div className="bg-[#232527] p-2 rounded-lg rounded-tl-none border border-white/5 text-xs max-w-[80%]">
            Salut Frost ! Bienvenue sur ton dashboard.
          </div>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <p className="text-[10px] font-bold text-blue-400 text-right">Moi</p>
          <div className="bg-[#00A2FF] p-2 rounded-lg rounded-tr-none text-xs max-w-[80%]">
            Ça commence à ressembler au vrai site !
          </div>
        </div>
      </div>

      <div className="p-3 bg-[#232527] border-t border-white/5 flex items-center gap-2">
        <input 
          type="text" 
          placeholder="Envoyer un message..."
          className="flex-1 bg-[#111214] text-[11px] py-2 px-3 rounded border border-white/10 focus:outline-none focus:border-white/20"
        />
        <FaPaperPlane className="text-gray-500 cursor-pointer hover:text-white" />
      </div>
    </div>
  );
}
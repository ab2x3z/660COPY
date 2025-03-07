import { create } from "zustand";
import { Movie } from "../types";

export type ModalType = "movieModal";

interface ModalStore {
  type: ModalType | null;
  data: Movie | null;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: Movie) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: null,
  isOpen: false,
  onOpen: (type, data) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false, data: null }),
}));

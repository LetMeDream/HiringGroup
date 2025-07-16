import { create } from 'zustand'
import {devtools} from 'zustand/middleware'

type Store = {
  /* Empresa */
  empresa: string
  setEmpresa: (val: string) => void
}

export const useStore = create<Store>()((set) => ({
  empresa: '',
  setEmpresa: (empresa) => set(() => ({ empresa })),
}))


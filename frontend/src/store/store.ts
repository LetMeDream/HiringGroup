import { create } from 'zustand'
import {devtools} from 'zustand/middleware'

type UsuarioEmpresa = {
  id: number | null,
  email: string,
  nombre: string,
  apellido: string,
  role: string,
  telefono: string,
}

type Store = {
  /* Empresa */
  empresa: string
  setEmpresa: (val: string) => void
  /* Usuario Empresa */
  usuarioEmpresa: UsuarioEmpresa
  setUsuarioEmpresa: (usuarioEmpresa: UsuarioEmpresa) => void
}

export const useStore = create<Store>()((set) => ({
  /* Empresa */
  empresa: '',
  setEmpresa: (empresa) => set(() => ({ empresa })),
  /* Usuario Empresa */
  usuarioEmpresa: {
    id: null,
    email: '',
    nombre: '',
    apellido: '',
    role: '',
    telefono: ''
  },
  setUsuarioEmpresa: (usuarioEmpresa: UsuarioEmpresa) => set(() => ({ usuarioEmpresa })),
}))


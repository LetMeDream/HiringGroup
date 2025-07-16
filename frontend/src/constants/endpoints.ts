export const endpoints = {
  base: 'http://127.0.0.1:8000/',
  registerUser: 'api/usuarios/',
  login: 'api/login/',
  completarEmpresa: (id) => `api/empresas/${id}/actualizar/`,
}
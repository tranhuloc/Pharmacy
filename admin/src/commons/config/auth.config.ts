import LoginView from '@auth/views/auth/LoginNewView.vue'
export const FUNC_NAME = 'auth'

// ========================== ROUTER =============================
export const ROUTER_AUTH = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      layout: "Client"
    }
  },
]

// ========================== PATH API =============================
export const API = {
  SIGN_IN: `${FUNC_NAME}/signin`,
  GET_INFO: `${FUNC_NAME}/infoLogin`,
  REFRESH_TOKEN: `${FUNC_NAME}/refresh-token`,
  CHANGE_PASSWORD: `${FUNC_NAME}/change-password`,
}

// ========================== CONFIG TABLE ==========================
export const tableConfig = {

};

export const colConfig = [

];

export default { tableConfig, colConfig };

export const FUNC_NAME = ''

// ========================== ROUTER =============================
export const ROUTER_ACCOUNT = [
  {
    path: '/change-password',
    name: 'ChangePassWord',
    component: () => import('@auth/views/account/ChangePassword.vue'),
    meta: {
      layout: "Admin"
    }
  },
  {
    path: '/account-profile',
    name: 'AccountProfile',
    component: () => import('@auth/views/account/AccountProfile.vue'),
    meta: {
      layout: "Admin"
    }
  }
]

// ========================== PATH API =============================
export const API = {

}

// ========================== CONFIG TABLE ==========================
export const tableConfig = {

};

export const colConfig = [
  
];

export default { tableConfig, colConfig };

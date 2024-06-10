export const FUNC_NAME = 'users'

// ========================== ROUTER =============================
export const ROUTER_USER = [
  {
    path: '/user',
    name: 'UserList',
    component: () => import('@master/views/user/ListView.vue'),
  },
]

// ========================== PATH API =============================
export const API = {
  LIST: `/${FUNC_NAME}`,
  LIST_ROLE: `/roles`,
  CREATE: `/${FUNC_NAME}`,
  DETAIL: (id: string) => `${FUNC_NAME}/${id}`,
  UPDATE: (id: string) => `${FUNC_NAME}/${id}`,
  DELETE: (id: string | string[]) => `${FUNC_NAME}/${id}`,
  RESET_PASSWORD: (id: string) => `${FUNC_NAME}/${id}/reset_password`,
}

// ========================== CONFIG TABLE ==========================
export const tableConfig = {
  checkbox: false,
  action: true,
  showPaging: true,
  dbClick: false,
  index: true,
};

export const colConfig = [
  {
    key: "username",
    title: 'Tên đăng nhập',
  },
  {
    key: "fullname",
    title: 'Họ và tên',
  },
  {
    key: "email",
    title: 'Email',
  },
  {
    key: "phone",
    title: 'Số điện thoại',
  },
  {
    key: "role_name",
    title: 'Quyền',
  },
];

export default { tableConfig, colConfig };

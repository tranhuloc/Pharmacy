
export default [
  {
    title: 'Tài khoản',
    icon: 'UserFilled',
    permission: ['2', '3'],
    items: [
      {
        name: 'Thông tin tài khoản',
        pathName: 'AccountProfile', permission: ['2', '3'],
      },
      {
        name: 'Đổi mật khẩu',
        pathName: 'ChangePassWord', permission: ['2', '3'],
      },
    ],
  },
]

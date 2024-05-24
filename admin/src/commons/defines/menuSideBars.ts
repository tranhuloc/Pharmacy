
export default [
  {
    title: 'Account',
    icon: 'UserFilled',
    permission: ['2', '3'],
    items: [
      {
        name: 'AccountInfo',
        pathName: 'AccountProfile', permission: ['2', '3'],
      },
      {
        name: 'ChangePassword',
        pathName: 'ChangePassWord', permission: ['2', '3'],
      },
    ],
  },
]

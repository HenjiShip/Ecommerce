export default {
  name: 'carts',
  _type: 'carts',
  title: 'Carts',
  type: 'document',
  fields: [
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'totalPrice',
      title: 'Total Price',
      type: 'number',
    },
    {
      name: 'totalQuantities',
      title: 'Total Quantities',
      type: 'number',
    },
    {
      name: 'userId',
      title: 'User Id',
      type: 'string',
      hidden: true,
    },
  ],
  auth: {
    read: ({userId, document}) => document.userId === userId,
    update: ({userId, document}) => document.userId === userId,
  },
}

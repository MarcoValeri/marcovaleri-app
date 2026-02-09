import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'blogImages',
  access: (allow) => ({
    'public/*': [
        allow.guest.to(['read']),
        allow.authenticated.to(['read', 'write', 'delete'])
    ],
    'images/*': [
        allow.guest.to(['read']),
        allow.authenticated.to(['read', 'write', 'delete'])
    ]
  })
});
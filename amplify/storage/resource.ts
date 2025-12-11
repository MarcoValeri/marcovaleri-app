import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'blogImages',
  access: (allow) => ({
    'posts/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.groups(['ADMINS']).to(['read', 'write', 'delete'])
    ]
  })
});
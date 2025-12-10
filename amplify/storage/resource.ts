import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'blogImages',
  access: (allow) => ({
    'posts/*': [
      allow.guest.to(['read']), // Public sees images
      allow.authenticated.to(['read', 'write', 'delete']) // You manage them
    ]
  })
});
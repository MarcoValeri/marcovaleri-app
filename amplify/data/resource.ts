import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/* * This is your Database Schema.
 * We define an "Article" model that only ADMINS can write to.
 */
const schema = a.schema({
  Article: a.model({
    title: a.string(),
    description: a.string(),
    content: a.json(),
    coverImage: a.string(),
    publishedAt: a.datetime(),
    category: a.string(),
    tag: a.string().array(),
  })
  .authorization(allow => [
    // 1. Guests (public) can READ articles
    allow.publicApiKey().to(['read']),
    
    // 2. Admins can do EVERYTHING (create, update, delete)
    allow.group('ADMINS').to(['create', 'read', 'update', 'delete']),
  ]),
});

// This helps your frontend know the types (TypeScript)
export type Schema = ClientSchema<typeof schema>;

// This tells Amplify to deploy the database
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    // We explicitly enable API Key for public access
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
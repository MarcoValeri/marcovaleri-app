import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Article: a.model({
    title: a.string(),
    description: a.string(),
    url: a.string().required(),
    content: a.string(),
    updated: a.datetime(),
    published: a.boolean().default(false),
    categoryId: a.id(),
    category: a.belongsTo('Category', 'categoryId'),
    articleTags: a.hasMany('ArticleTag', 'articleId'),
    featuredImageId: a.id(),
    featuredImage: a.belongsTo('Image', 'featuredImageId'),
  })
    .secondaryIndexes((index) => [index('url')])
    .authorization(allow => [
      allow.guest().to(['read']),
      allow.group('ADMINS').to(['create', 'read', 'update', 'delete']),
    ]),

  Category: a
    .model({
      category: a.string().required(),
      url: a.string().required(),
      description: a.string(),
      articles: a.hasMany('Article', 'categoryId'),
    })
    .secondaryIndexes((index) => [index('url')])
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.group('ADMINS').to(['create', 'read', 'update', 'delete']),
    ]),

  Tag: a
    .model({
      tag: a.string().required(),
      url: a.string().required(),
      description: a.string(),
      articleTags: a.hasMany('ArticleTag', 'tagId'),
    })
    .secondaryIndexes((index) => [index('url')])
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.group('ADMINS').to(['create', 'read', 'update', 'delete']),
    ]),

  ArticleTag: a
    .model({
      articleId: a.id().required(),
      tagId: a.id().required(),
      article: a.belongsTo('Article', 'articleId'),
      tag: a.belongsTo('Tag', 'tagId'),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.group('ADMINS').to(['create', 'read', 'update', 'delete']),
    ]),

  Image: a
    .model({
      name: a.string().required(),
      url: a.string().required(),
      caption: a.string(),
      description: a.string(),
      articles: a.hasMany('Article', 'featuredImageId'),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.group('ADMINS').to(['create', 'read', 'update', 'delete']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
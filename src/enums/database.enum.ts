export enum TableName {
  USERS = 'users',
  GAMES = 'games',
  PUBLISHERS = 'publishers',
  PLATFORMS = 'platforms',
  GENRES = 'genres',
  PUBLISHER_GAMES = 'publisher_games',
  GENRE_GAMES = 'genre_games',
  PLATFORM_GAMES = 'platform_games',
  LIKES = 'likes',
  BOOKMARKS = 'bookmarks',
  COMMENTS = 'comments',
  ARTICLES = 'articles',
  FILES = 'files',
}

export enum Repository {
  USERS = 'USERS_REPOSITORY',
  GAMES = 'GAMES_REPOSITORY',
  PUBLISHERS = 'PUBLISHERS_REPOSITORY',
  PLATFORMS = 'PLATFORMS_REPOSITORY',
  GENRES = 'GENRES_REPOSITORY',
  PUBLISHER_GAMES = 'PUBLISHER_GAMES_REPOSITORY',
  GENRE_GAMES = 'GENRE_GAMES_REPOSITORY',
  PLATFORM_GAMES = 'PLATFORM_GAMES_REPOSITORY',
  LIKES = 'LIKES_REPOSITORY',
  BOOKMARKS = 'BOOKMARKS_REPOSITORY',
  COMMENTS = 'COMMENTS_REPOSITORY',
  ARTICLES = 'ARTICLES_REPOSITORY',
  FILES = 'FILES_REPOSITORY',
}

export enum Role {
  SUPER = 'super',
  ADMIN = 'admin',
  USER = 'user',
}

export enum BookmarkAbleEntity {
  GAME = 'game',
  ARTICLE = 'article',
}

export enum CommentAbleEntity {
  GAME = 'game',
  ARTICLE = 'article',
}

export enum LikeAbleEntity {
  GAME = 'game',
  ARTICLE = 'article',
  COMMENT = 'comment',
}

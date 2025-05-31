class ArticleCategory < ApplicationRecord
  belongs_to :article, foreign_key: 'article_id', primary_key: 'article_id'
  belongs_to :category, foreign_key: 'category_id', primary_key: 'category_id'
end
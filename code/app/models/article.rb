class Article < ApplicationRecord
  self.primary_key = 'article_id'
  
  belongs_to :author, foreign_key: 'author_id', primary_key: 'author_id'
  belongs_to :media, class_name: 'Medium', foreign_key: 'media_id', primary_key: 'media_id', optional: true
  has_many :article_categories, foreign_key: 'article_id', primary_key: 'article_id'
  has_many :categories, through: :article_categories, foreign_key: 'article_id', primary_key: 'article_id'
  has_and_belongs_to_many :tags, foreign_key: 'article_id', primary_key: 'article_id'
  has_many :comments, foreign_key: 'article_id', primary_key: 'article_id', dependent: :destroy

  validates :title, presence: true, length: { maximum: 255 }
  validates :content, presence: true
  validates :published_date, presence: true
end
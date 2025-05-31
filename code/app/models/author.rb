# psy_mag/app/models/author.rb
class Author < ApplicationRecord
  self.primary_key = 'author_id'
  
  has_many :articles, foreign_key: 'author_id', primary_key: 'author_id'

  validates :username, presence: true, length: { maximum: 255 }
  validates :profile_picture, length: { maximum: 255 }, allow_nil: true
end
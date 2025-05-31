class Tag < ApplicationRecord
  self.primary_key = 'tag_id'
  
  has_and_belongs_to_many :articles, foreign_key: 'tag_id', primary_key: 'tag_id'

  validates :slug, presence: true, uniqueness: true
  validates :name, presence: true
end
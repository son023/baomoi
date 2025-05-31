class Category < ApplicationRecord
  self.primary_key = 'category_id'
  
  has_many :article_categories, foreign_key: 'category_id', primary_key: 'category_id'
  has_many :articles, through: :article_categories, foreign_key: 'category_id', primary_key: 'category_id'
  belongs_to :parent_category, class_name: 'Category', foreign_key: 'parent_category_id', primary_key: 'category_id', optional: true
  has_many :child_categories, class_name: 'Category', foreign_key: 'parent_category_id', primary_key: 'category_id'

  validates :name, presence: true, length: { maximum: 255 }
end
# psy_mag/app/models/medium.rb
class Medium < ApplicationRecord
  self.primary_key = 'media_id'
  
  has_many :articles, foreign_key: 'media_id', primary_key: 'media_id'

  validates :file_name, presence: true, length: { maximum: 255 }
  validates :file_path, presence: true, length: { maximum: 255 }
  validates :file_type, presence: true, length: { maximum: 50 }
  validates :uploaded_date, presence: true
end
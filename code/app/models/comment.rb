# psy_mag/app/models/comment.rb
class Comment < ApplicationRecord
  self.primary_key = 'comment_id'
  
  belongs_to :article, foreign_key: 'article_id', primary_key: 'article_id'
  belongs_to :user, foreign_key: 'user_id', primary_key: 'user_id', optional: true
  belongs_to :parent_comment, class_name: 'Comment', foreign_key: 'parent_comment_id', primary_key: 'comment_id', optional: true
  has_many :child_comments, class_name: 'Comment', foreign_key: 'parent_comment_id', primary_key: 'comment_id', dependent: :destroy

  validates :content, presence: true, length: { minimum: 1, maximum: 1000 }
  validates :article_id, presence: true
  
  before_save :set_publish_date
  
  # Status constants
  STATUS_PENDING = 0
  STATUS_APPROVED = 1
  STATUS_REJECTED = 2
  
  scope :approved, -> { where(status: STATUS_APPROVED) }
  scope :pending, -> { where(status: STATUS_PENDING) }
  scope :top_level, -> { where(parent_comment_id: nil) }
  scope :recent, -> { order(publish_date: :desc) }
  
  def author_name
    user&.full_display_name || 'Anonymous'
  end
  
  def can_be_edited_by?(current_user)
    return false unless current_user
    current_user.admin? || current_user.user_id == user_id
  end
  
  def reply_count
    child_comments.approved.count
  end
  
  def approved?
    status == STATUS_APPROVED
  end
  
  def pending?
    status == STATUS_PENDING
  end
  
  private
  
  def set_publish_date
    self.publish_date ||= Time.current
  end
end
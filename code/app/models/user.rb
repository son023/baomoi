class User < ApplicationRecord
  self.primary_key = 'user_id'
  
  has_secure_password
  
  has_many :comments, foreign_key: 'user_id', primary_key: 'user_id', dependent: :destroy
  
  # Enums for roles
  enum :role, { user: 0, admin: 1 }
  
  # Validations
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :username, presence: true, uniqueness: true, length: { minimum: 3, maximum: 50 }
  validates :full_name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :password, length: { minimum: 6 }, if: :password_required?
  
  # Callbacks
  before_save :downcase_email
  
  # Scopes
  scope :active, -> { where(active: true) }
  scope :admins, -> { where(role: :admin) }
  scope :users, -> { where(role: :user) }
  
  # Instance methods
  def admin?
    role == 'admin'
  end
  
  def active?
    active
  end
  
  def full_display_name
    full_name.present? ? full_name : username
  end
  
  private
  
  def downcase_email
    self.email = email.downcase if email.present?
  end
  
  def password_required?
    new_record? || password.present?
  end
end
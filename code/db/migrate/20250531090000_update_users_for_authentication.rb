class UpdateUsersForAuthentication < ActiveRecord::Migration[8.0]
  def change
    # Thêm các cột mới
    add_column :users, :full_name, :string, limit: 100
    add_column :users, :password_digest, :string
    add_column :users, :active, :boolean, default: true, null: false
    add_column :users, :last_login_at, :datetime
    add_column :users, :login_count, :integer, default: 0
    
    # Thay đổi cột role thành integer để sử dụng enum
    change_column :users, :role, :integer, default: 0, null: false
    
    # Xóa cột password_hash cũ
    remove_column :users, :password_hash, :string
    
    # Thêm index
    add_index :users, :username, unique: true
    add_index :users, :active
    add_index :users, :role
  end
end 
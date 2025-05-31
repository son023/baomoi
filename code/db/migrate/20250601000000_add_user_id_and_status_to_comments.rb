class AddUserIdAndStatusToComments < ActiveRecord::Migration[8.0]
  def change
    add_column :comments, :user_id, :integer, null: true
    add_column :comments, :status, :integer, default: 1, null: false
    
    add_index :comments, :user_id
    add_index :comments, :status
    
    add_foreign_key :comments, :users, column: :user_id, primary_key: :user_id
  end
end 
class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users, id: false do |t|
      t.integer :user_id, primary_key: true
      t.string :username, limit: 255, null: false
      t.string :email, limit: 255, null: false
      t.string :password_hash, limit: 255, null: false
      t.string :role, limit: 50, null: false
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false
    end
    add_index :users, :email, unique: true
  end
end
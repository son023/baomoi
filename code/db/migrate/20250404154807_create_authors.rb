class CreateAuthors < ActiveRecord::Migration[7.0]
  def change
    create_table :authors, id: false do |t|
      t.integer :author_id, primary_key: true
      t.string :username, limit: 255, null: false
      t.text :bio
      t.string :profile_picture, limit: 255
      t.text :social_link
    end
  end
end
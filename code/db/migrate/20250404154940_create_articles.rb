class CreateArticles < ActiveRecord::Migration[7.0]
  def up
    create_table :articles, id: false do |t|
      t.integer :article_id, primary_key: true
      t.integer :author_id
      t.string :title, limit: 255, null: false
      t.string :slug, limit: 255, null: false
      t.text :content, null: false
      t.integer :media_id
      t.datetime :published_date, null: false
      t.string :status, limit: 50, null: false
      t.text :meta_data
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false
      t.foreign_key :authors, column: :author_id, primary_key: :author_id
      t.foreign_key :media, column: :media_id, primary_key: :media_id
    end
    add_index :articles, :slug, unique: true, if_not_exists: true
    add_index :articles, :author_id, if_not_exists: true
    add_index :articles, :media_id, if_not_exists: true
  end

  def down
    remove_index :articles, :slug, unique: true, if_exists: true
    remove_index :articles, :author_id, if_exists: true
    remove_index :articles, :media_id, if_exists: true
    drop_table :articles
  end
end
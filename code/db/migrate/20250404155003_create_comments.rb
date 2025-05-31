class CreateComments < ActiveRecord::Migration[7.0]
  def up
    create_table :comments, id: false do |t|
      t.integer :comment_id, primary_key: true
      t.integer :article_id
      t.integer :parent_comment_id
      t.text :content, null: false
      t.datetime :publish_date, null: false
      t.foreign_key :articles, column: :article_id, primary_key: :article_id
      t.foreign_key :comments, column: :parent_comment_id, primary_key: :comment_id
    end
    add_index :comments, :article_id, if_not_exists: true
    add_index :comments, :parent_comment_id, if_not_exists: true
  end

  def down
    remove_index :comments, :article_id, if_exists: true
    remove_index :comments, :parent_comment_id, if_exists: true
    drop_table :comments
  end
end
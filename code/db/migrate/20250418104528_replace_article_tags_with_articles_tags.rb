class ReplaceArticleTagsWithArticlesTags < ActiveRecord::Migration[7.0]
  def change
    # Xóa bảng article_tags nếu tồn tại
    drop_table :article_tags, if_exists: true

    # Tạo bảng articles_tags mới
    create_table :articles_tags, id: false do |t|
      t.integer :article_id, null: false
      t.integer :tag_id, null: false
    end

    add_index :articles_tags, [:article_id, :tag_id], unique: true
    add_index :articles_tags, :article_id
    add_index :articles_tags, :tag_id

    add_foreign_key :articles_tags, :articles, column: :article_id, primary_key: :article_id
    add_foreign_key :articles_tags, :tags, column: :tag_id, primary_key: :tag_id
  end
end
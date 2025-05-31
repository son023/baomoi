class CreateArticleCategories < ActiveRecord::Migration[8.0]
  def change
    create_table :article_categories do |t|
      t.references :article, foreign_key: { primary_key: :article_id }
      t.references :category, foreign_key: { primary_key: :category_id }
      t.timestamps
    end
  end
end
class CreateCategories < ActiveRecord::Migration[8.0]
  def change
    create_table :categories, primary_key: :category_id do |t|
      t.string :name, limit: 255, null: false
      t.text :description
      t.integer :parent_category_id
    end
  end
end
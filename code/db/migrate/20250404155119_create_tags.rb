class CreateTags < ActiveRecord::Migration[7.0]
  def change
    create_table :tags, id: false do |t|
      t.integer :tag_id, primary_key: true
      t.string :name, limit: 255, null: false
      t.string :slug, limit: 255, null: false
    end
    add_index :tags, :slug, unique: true
  end
end
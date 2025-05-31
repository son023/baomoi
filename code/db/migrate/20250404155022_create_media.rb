class CreateMedia < ActiveRecord::Migration[7.0]
  def change
    create_table :media, id: false do |t|
      t.integer :media_id, primary_key: true
      t.string :file_name, limit: 255, null: false
      t.string :file_path, limit: 255, null: false
      t.string :file_type, limit: 50, null: false
      t.datetime :uploaded_date, null: false
    end
  end
end
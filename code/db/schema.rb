# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_06_01_000000) do
  create_table "article_categories", force: :cascade do |t|
    t.integer "article_id"
    t.integer "category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["article_id"], name: "index_article_categories_on_article_id"
    t.index ["category_id"], name: "index_article_categories_on_category_id"
  end

  create_table "articles", primary_key: "article_id", force: :cascade do |t|
    t.integer "author_id"
    t.string "title", limit: 255, null: false
    t.string "slug", limit: 255, null: false
    t.text "content", null: false
    t.integer "media_id"
    t.datetime "published_date", null: false
    t.string "status", limit: 50, null: false
    t.text "meta_data"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_id"], name: "index_articles_on_author_id"
    t.index ["media_id"], name: "index_articles_on_media_id"
    t.index ["slug"], name: "index_articles_on_slug", unique: true
  end

  create_table "articles_tags", id: false, force: :cascade do |t|
    t.integer "article_id", null: false
    t.integer "tag_id", null: false
    t.index ["article_id", "tag_id"], name: "index_articles_tags_on_article_id_and_tag_id", unique: true
    t.index ["article_id"], name: "index_articles_tags_on_article_id"
    t.index ["tag_id"], name: "index_articles_tags_on_tag_id"
  end

  create_table "authors", primary_key: "author_id", force: :cascade do |t|
    t.string "username", limit: 255, null: false
    t.text "bio"
    t.string "profile_picture", limit: 255
    t.text "social_link"
  end

  create_table "categories", primary_key: "category_id", force: :cascade do |t|
    t.string "name", limit: 255, null: false
    t.text "description"
    t.integer "parent_category_id"
    t.index ["parent_category_id"], name: "index_categories_on_parent_category_id"
  end

  create_table "comments", primary_key: "comment_id", force: :cascade do |t|
    t.integer "article_id"
    t.integer "parent_comment_id"
    t.text "content", null: false
    t.datetime "publish_date", null: false
    t.integer "user_id", null: false
    t.integer "status", default: 1, null: false
    t.index ["article_id"], name: "index_comments_on_article_id"
    t.index ["parent_comment_id"], name: "index_comments_on_parent_comment_id"
    t.index ["status"], name: "index_comments_on_status"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "media", primary_key: "media_id", force: :cascade do |t|
    t.string "file_name", limit: 255, null: false
    t.string "file_path", limit: 255, null: false
    t.string "file_type", limit: 50, null: false
    t.datetime "uploaded_date", null: false
  end

  create_table "tags", primary_key: "tag_id", force: :cascade do |t|
    t.string "name", limit: 255, null: false
    t.string "slug", limit: 255, null: false
    t.index ["slug"], name: "index_tags_on_slug", unique: true
  end

  create_table "users", primary_key: "user_id", force: :cascade do |t|
    t.string "username", limit: 255, null: false
    t.string "email", limit: 255, null: false
    t.integer "role", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "full_name", limit: 100
    t.string "password_digest"
    t.boolean "active", default: true, null: false
    t.datetime "last_login_at"
    t.integer "login_count", default: 0
    t.index ["active"], name: "index_users_on_active"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["role"], name: "index_users_on_role"
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "article_categories", "articles", primary_key: "article_id"
  add_foreign_key "article_categories", "categories", primary_key: "category_id"
  add_foreign_key "articles", "authors", primary_key: "author_id"
  add_foreign_key "articles", "media", column: "media_id", primary_key: "media_id"
  add_foreign_key "articles_tags", "articles", primary_key: "article_id"
  add_foreign_key "articles_tags", "tags", primary_key: "tag_id"
  add_foreign_key "categories", "categories", column: "parent_category_id", primary_key: "category_id"
  add_foreign_key "comments", "articles", primary_key: "article_id"
  add_foreign_key "comments", "comments", column: "parent_comment_id", primary_key: "comment_id"
  add_foreign_key "comments", "users", primary_key: "user_id"
end

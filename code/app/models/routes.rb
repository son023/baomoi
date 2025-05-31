Rails.application.routes.draw do
  resources :users
  resources :articles
  resources :authors
  resources :comments
  resources :categories
  resources :tags
  resources :media
end
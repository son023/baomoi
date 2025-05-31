Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by uptime monitors and load balancers.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  # API routes
  resources :articles do
    resources :comments, only: [:index]
  end
  resources :categories
  resources :tags
  resources :comments, except: [:index]

  # Auth routes
  namespace :auth do
    post 'login'
    post 'register'
    get 'me'
  end

  # Admin routes
  get 'admin/dashboard', to: 'admin#dashboard'
  get 'admin/articles', to: 'admin#articles'
  post 'admin/articles', to: 'admin#create_article'
  put 'admin/articles/:id', to: 'admin#update_article'
  delete 'admin/articles/:id', to: 'admin#delete_article'
  get 'admin/users', to: 'admin#users'

  # Homepage optimized endpoint
  get 'homepage', to: 'articles#homepage'
  
  # Test endpoint
  get 'test', to: 'articles#test'
end
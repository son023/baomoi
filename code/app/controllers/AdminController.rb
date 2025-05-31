class AdminController < ApplicationController
  before_action :authenticate_admin
  
  def dashboard
    render json: {
      stats: {
        total_articles: Article.count,
        total_users: User.count,
        total_comments: Comment.count,
        total_categories: Category.count,
        total_tags: Tag.count
      }
    }
  end
  
  def articles
    articles = Article.includes(:categories, :tags, :author, :media)
                     .order(published_date: :desc)
                     .limit(params[:per_page] || 20)
    
    render json: {
      articles: articles.map { |a| format_article(a) }
    }
  end
  
  def create_article
    begin
      ActiveRecord::Base.transaction do
        # Create media if URL provided
        media = nil
        if params[:media_url].present?
          media = Medium.create!(
            file_path: params[:media_url],
            file_name: "article_image_#{Time.current.to_i}.jpg",
            file_type: 'image',
            uploaded_date: Time.current
          )
        end
        
        # Find author (use current user or first author)
        author = Author.first
        
        # Create article
        article = Article.new(
          title: params[:title],
          content: params[:content],
          slug: params[:title].downcase.gsub(/[^a-z0-9\s]/, '').gsub(/\s+/, '-'),
          author_id: author&.author_id,
          media_id: media&.media_id,
          published_date: Time.current,
          status: 'published'
        )
        
        if article.save
          # Add category
          if params[:category_id].present?
            ArticleCategory.create!(
              article_id: article.article_id,
              category_id: params[:category_id]
            )
          end
          
          # Add tags
          if params[:tag_ids].present?
            params[:tag_ids].each do |tag_id|
              article.tags << Tag.find(tag_id)
            end
          end
          
          render json: { 
            message: 'Article created successfully',
            article: format_article(article.reload)
          }, status: :created
        else
          render json: { errors: article.errors.full_messages }, status: :unprocessable_entity
        end
      end
    rescue => e
      Rails.logger.error("Error creating article: #{e.message}")
      render json: { error: e.message }, status: :internal_server_error
    end
  end
  
  def update_article
    article = Article.find_by(article_id: params[:id])
    return render json: { error: 'Article not found' }, status: :not_found unless article
    
    if article.update(article_params)
      render json: { article: format_article(article) }
    else
      render json: { errors: article.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  def delete_article
    begin
      article = Article.find_by(article_id: params[:id])
      return render json: { error: 'Article not found' }, status: :not_found unless article
      
      ActiveRecord::Base.transaction do
        # Remove article-category associations
        ArticleCategory.where(article_id: article.article_id).delete_all
        
        # Remove article-tag associations
        article.tags.clear
        
        # Delete the article
        article.destroy!
        
        render json: { message: 'Article deleted successfully' }
      end
    rescue => e
      Rails.logger.error("Error deleting article: #{e.message}")
      render json: { error: e.message }, status: :internal_server_error
    end
  end
  
  def users
    users = User.limit(params[:per_page] || 20)
    
    render json: {
      users: users.map { |u| format_user(u) }
    }
  end
  
  private
  
  def authenticate_admin
    token = request.headers['Authorization']&.split(' ')&.last
    return render json: { error: 'Token missing' }, status: :unauthorized unless token
    
    begin
      decoded = JwtService.decode(token)
      @current_user = User.find(decoded[:user_id])
      return render json: { error: 'Admin access required' }, status: :forbidden unless @current_user&.admin?
    rescue => e
      render json: { error: 'Invalid token' }, status: :unauthorized
    end
  end
  
  def article_params
    params.permit(:title, :content, :media_id, :status)
  end
  
  def format_article(article)
    {
      article_id: article.article_id,
      title: article.title,
      content: article.content,
      published_date: article.published_date,
      status: article.status,
      author: article.author ? {
        author_id: article.author.author_id,
        username: article.author.username
      } : nil,
      categories: article.categories.map { |c| { category_id: c.category_id, name: c.name } },
      tags: article.tags.map { |t| { tag_id: t.tag_id, name: t.name } },
      media: article.media ? {
        media_id: article.media.media_id,
        file_path: article.media.file_path
      } : nil
    }
  end
  
  def format_user(user)
    {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      active: user.active,
      created_at: user.created_at,
      last_login_at: user.last_login_at
    }
  end
end 
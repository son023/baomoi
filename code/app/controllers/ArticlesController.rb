class ArticlesController < ApplicationController
  before_action :set_article, only: [:show, :update, :destroy]

  def index
    begin
      request.format = :json
      
      if params[:category_id].present?
        @articles = Article.joins(:categories)
                          .where(categories: { category_id: params[:category_id] })
                          .includes(:categories, :tags, :media, :author)
                          .order(published_date: :desc)
                          .limit(20)
      elsif params[:tag].present?
        @articles = Article.joins(:tags)
                          .where(tags: { name: params[:tag] })
                          .includes(:categories, :tags, :media, :author)
                          .order(published_date: :desc)
                          .limit(20)
      elsif params[:search].present?
        search_term = "%#{params[:search]}%"
        @articles = Article.where("title LIKE ? COLLATE NOCASE OR content LIKE ? COLLATE NOCASE", search_term, search_term)
                          .includes(:categories, :tags, :media, :author)
                          .order(published_date: :desc)
                          .limit(20)
      else
        @articles = Article.includes(:categories, :tags, :media, :author)
                          .order(published_date: :desc)
                          .limit(20)
      end
      
      formatted_articles = @articles.map do |article|
        {
          article_id: article.article_id,
          title: article.title,
          content: article.content&.truncate(500),
          slug: article.slug,
          published_date: article.published_date,
          status: article.status,
          author: article.author ? {
            author_id: article.author.author_id,
            username: article.author.username
          } : nil,
          media: article.media ? {
            media_id: article.media.media_id,
            file_path: article.media.file_path
          } : nil,
          categories: article.categories.map do |category|
            {
              category_id: category.category_id,
              name: category.name
            }
          end,
          tags: article.tags.map do |tag|
            {
              tag_id: tag.tag_id,
              name: tag.name
            }
          end
        }
      end
      
      render json: formatted_articles
    rescue => e
      Rails.logger.error("Error fetching articles: #{e.message}")
      json_response({ error: e.message }, :internal_server_error)
    end
  end

  def show
    begin
      article_json = {
        article_id: @article.article_id,
        title: @article.title,
        content: @article.content,
        slug: @article.slug,
        published_date: @article.published_date,
        status: @article.status,
        author: @article.author ? {
          author_id: @article.author.author_id,
          username: @article.author.username,
          bio: @article.author.bio
        } : nil,
        media: @article.media ? {
          media_id: @article.media.media_id,
          file_path: @article.media.file_path,
          file_name: @article.media.file_name,
          file_type: @article.media.file_type
        } : nil,
        categories: @article.categories.map do |category|
          {
            category_id: category.category_id,
            name: category.name,
            description: category.description
          }
        end,
        tags: @article.tags.map do |tag|
          {
            tag_id: tag.tag_id,
            name: tag.name,
            slug: tag.slug
          }
        end
      }
      
      render json: article_json
    rescue ActiveRecord::RecordNotFound
      json_response({ error: "Article not found" }, :not_found)
    rescue => e
      Rails.logger.error("Error fetching article: #{e.message}")
      json_response({ error: e.message }, :internal_server_error)
    end
  end

  def create
    @article = Article.new(article_params)
    @article.published_date = Time.current
    if @article.save
      render json: @article, status: :created
    else
      render json: @article.errors, status: :unprocessable_entity
    end
  end

  def update
    if @article.update(article_params)
      render json: @article
    else
      render json: @article.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @article.destroy!
    head :no_content
  rescue ActiveRecord::RecordNotDestroyed => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def homepage
    begin
      articles = Article.includes(:categories, :tags, :media, :author)
                       .where(status: 'published')
                       .order(published_date: :desc)
                       .limit(16)

      articles_data = articles.map do |article|
        {
          article_id: article.article_id,
          title: article.title,
          content: article.content&.truncate(200),
          published_date: article.published_date,
          media: article.media ? {
            file_path: article.media.file_path
          } : {
            file_path: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800'
          },
          author: article.author ? {
            username: article.author.username
          } : {
            username: 'Admin'
          },
          categories: article.categories.map { |c| c.name },
          tags: article.tags.map { |t| t.name }
        }
      end

      tag_articles = {}
      tag_mapping = {
        'trầm cảm' => 'trầm cảm',
        'stress' => 'stress', 
        'lo âu' => 'lo âu',
        'điều trị' => 'rối loạn'
      }
      
      tag_mapping.each do |tag_name, display_name|
        tag_articles_data = Article.joins(:tags)
                                  .where(tags: { name: tag_name })
                                  .includes(:categories, :tags, :media, :author)
                                  .where(status: 'published')
                                  .order(published_date: :desc)
                                  .limit(4)
                                  .map do |article|
          {
            article_id: article.article_id,
            title: article.title,
            content: article.content&.truncate(150),
            published_date: article.published_date,
            media: article.media ? {
              file_path: article.media.file_path
            } : {
              file_path: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800'
            },
            author: article.author ? {
              username: article.author.username
            } : {
              username: 'Admin'
            }
          }
        end
        tag_articles[display_name] = tag_articles_data
      end

      render json: {
        featured_article: articles_data.first,
        sidebar_articles: articles_data[1..4] || [],
        tag_articles: tag_articles
      }
    rescue => e
      Rails.logger.error("Error fetching homepage data: #{e.message}")
      render json: { error: e.message }, status: :internal_server_error
    end
  end

  def test
    begin
      article = Article.includes(:media, :author, :categories, :tags).first
      render json: {
        debug: true,
        article_id: article.article_id,
        title: article.title,
        media_exists: !article.media.nil?,
        media_data: article.media,
        media_file_path: article.media&.file_path,
        raw_article: article.as_json(include: [:media, :author, :categories, :tags])
      }
    rescue => e
      render json: { error: e.message }
    end
  end

  private

  def set_article
    @article = Article.includes(:categories, :tags, :media, :author)
                     .find_by(article_id: params[:id])
    
    unless @article
      render json: { error: 'Article not found' }, status: :not_found
    end
  end

  def article_params
    params.require(:article).permit(:title, :content, :author_id, :media_id, :published_date, category_ids: [], tag_ids: [])
  end
end
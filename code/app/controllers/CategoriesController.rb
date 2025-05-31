class CategoriesController < ApplicationController
  before_action :set_category, only: [:show, :update, :destroy]

  def index
    @categories = Category.all.order(:name)
    
    categories_data = @categories.map do |category|
      {
        category_id: category.category_id,
        name: category.name,
        description: category.description
      }
    end
    
    json_response(categories_data)
  end

  def show
    category_data = {
      category_id: @category.category_id,
      name: @category.name,
      description: @category.description,
      articles_count: @category.articles.count
    }
    
    json_response(category_data)
  end

  def create
    @category = Category.new(category_params)
    
    if @category.save
      json_response({
        category_id: @category.category_id,
        name: @category.name,
        description: @category.description
      }, :created)
    else
      json_response({
        error: 'Failed to create category',
        errors: @category.errors.full_messages
      }, :unprocessable_entity)
    end
  end

  def update
    if @category.update(category_params)
      json_response({
        category_id: @category.category_id,
        name: @category.name,
        description: @category.description
      })
    else
      json_response({
        error: 'Failed to update category',
        errors: @category.errors.full_messages
      }, :unprocessable_entity)
    end
  end

  def destroy
    @category.destroy
    json_response({ message: 'Category deleted successfully' })
  end

  private

  def set_category
    @category = Category.find_by(category_id: params[:id])
    unless @category
      json_response({ error: 'Category not found' }, :not_found)
    end
  end

  def category_params
    params.require(:category).permit(:name, :description)
  end
end
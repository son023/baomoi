class TagsController < ApplicationController
  before_action :set_tag, only: [:show, :update, :destroy]

  def index
    @tags = Tag.all.order(:name)
    tags_data = @tags.map do |tag|
      {
        tag_id: tag.tag_id,
        name: tag.name,
        slug: tag.slug
      }
    end
    json_response(tags_data)
  end

  def show
    tag_data = {
      tag_id: @tag.tag_id,
      name: @tag.name,
      slug: @tag.slug
    }
    json_response(tag_data)
  end

  def create
    @tag = Tag.new(tag_params)
    if @tag.save
      json_response({
        tag_id: @tag.tag_id,
        name: @tag.name,
        slug: @tag.slug
      }, :created)
    else
      json_response({
        error: 'Failed to create tag',
        errors: @tag.errors.full_messages
      }, :unprocessable_entity)
    end
  end

  def update
    if @tag.update(tag_params)
      json_response({
        tag_id: @tag.tag_id,
        name: @tag.name,
        slug: @tag.slug
      })
    else
      json_response({
        error: 'Failed to update tag',
        errors: @tag.errors.full_messages
      }, :unprocessable_entity)
    end
  end

  def destroy
    @tag.destroy
    json_response({ message: 'Tag deleted successfully' })
  end

  private

  def set_tag
    @tag = Tag.find_by(tag_id: params[:id])
    unless @tag
      json_response({ error: 'Tag not found' }, :not_found)
    end
  end

  def tag_params
    params.require(:tag).permit(:name, :slug)
  end
end
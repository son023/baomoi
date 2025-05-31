class CommentsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :set_comment, only: [:show, :update, :destroy]
  before_action :authorize_comment_owner!, only: [:update, :destroy]

  def index
    @comments = Comment.includes(:user, :child_comments)
                      .where(article_id: params[:article_id])
                      .top_level
                      .approved
                      .recent
    
    json_response(@comments.map { |comment| comment_json(comment) })
  end

  def show
    json_response(comment_json(@comment))
  end

  def create
    @comment = current_user.comments.build(comment_params)
    
    if @comment.save
      json_response(comment_json(@comment), :created)
    else
      json_response({ 
        error: 'Failed to create comment',
        errors: @comment.errors.full_messages 
      }, :unprocessable_entity)
    end
  end

  def update
    if @comment.update(update_comment_params)
      json_response(comment_json(@comment))
    else
      json_response({ 
        error: 'Failed to update comment',
        errors: @comment.errors.full_messages 
      }, :unprocessable_entity)
    end
  end

  def destroy
    @comment.destroy
    json_response({ message: 'Comment deleted successfully' })
  end

  private

  def set_comment
    @comment = Comment.find_by(comment_id: params[:id])
    unless @comment
      json_response({ error: "Comment not found" }, :not_found)
    end
  end

  def authorize_comment_owner!
    unless @comment.can_be_edited_by?(current_user)
      json_response({ error: 'Not authorized to perform this action' }, :forbidden)
    end
  end

  def comment_params
    params.require(:comment).permit(:article_id, :parent_comment_id, :content)
  end
  
  def update_comment_params
    params.require(:comment).permit(:content)
  end

  def comment_json(comment)
    {
      id: comment.comment_id,
      content: comment.content,
      publish_date: comment.publish_date,
      author_name: comment.author_name,
      user_id: comment.user_id,
      article_id: comment.article_id,
      parent_comment_id: comment.parent_comment_id,
      reply_count: comment.reply_count,
      can_edit: comment.can_be_edited_by?(current_user),
      replies: comment.child_comments.approved.recent.map { |reply| comment_json(reply) }
    }
  end
end
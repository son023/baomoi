class ApplicationController < ActionController::API
  protected
  
  def json_response(object, status = :ok)
    render json: object, status: status
  end
  
  def current_user
    @current_user ||= User.find_by(user_id: decoded_auth_token[:user_id]) if decoded_auth_token
  end
  
  def authenticate_user!
    render json: { error: 'Not authenticated' }, status: :unauthorized unless current_user
  end
  
  private
  
  def authorize_request
    @current_user = (User.find_by(user_id: decoded_auth_token[:user_id]) if decoded_auth_token)
  end
  
  def decoded_auth_token
    @decoded_auth_token ||= JwtService.decode(http_auth_header)
  end
  
  def http_auth_header
    if request.headers['Authorization'].present?
      return request.headers['Authorization'].split(' ').last
    end
    nil
  end
end
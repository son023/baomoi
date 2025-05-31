class AuthController < ApplicationController
  def login
    user = User.find_by(email: params[:email])
    
    if user&.authenticate(params[:password])
      user.update(last_login_at: Time.current, login_count: user.login_count + 1) if user.respond_to?(:last_login_at)
      token = JwtService.encode(user_id: user.user_id)
      
      json_response({
        token: token,
        user: {
          id: user.user_id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        }
      })
    else
      json_response({ error: 'Invalid email or password' }, :unauthorized)
    end
  end
  
  def register
    user = User.new(user_params)
    
    if user.save
      token = JwtService.encode(user_id: user.user_id)
      
      json_response({
        token: token,
        user: {
          id: user.user_id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        }
      }, :created)
    else
      json_response({
        error: 'Registration failed',
        errors: user.errors.full_messages
      }, :unprocessable_entity)
    end
  end
  
  def me
    if current_user
      json_response({
        user: {
          id: current_user.user_id,
          username: current_user.username,
          email: current_user.email,
          full_name: current_user.full_name,
          role: current_user.role
        }
      })
    else
      json_response({ error: 'Not authenticated' }, :unauthorized)
    end
  end
  
  private
  
  def user_params
    params.permit(:username, :email, :password, :full_name)
  end
end 
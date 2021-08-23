class GameController < ApplicationController
  include ApplicationHelper,GameHelper

  def show
    #redirect if not logged in
    if !logged_in?
      flash[:warning] = "You must login to access this page."
      redirect_to '/login'
    elsif current_user.room_id.nil?
      redirect_to '/game/new'
    else
      @room ||= Room.find(refresh_userinfo_from_db.room_id)
    end
  end

  #accept user input for new room
  #invite players and decide how many CPU players
  def new
    if !logged_in?
      flash[:warning] = "You must login to access this page."
      redirect_to '/login'
    elsif !refresh_userinfo_from_db.room_id.nil?
      redirect_to '/game'
    else
      add_player_list
    end
  end

  def create
    if setup_room()
      new_update("#{current_user.username} created a new room!")
      flash[:success] = "Room created successfully!"
      redirect_to '/game'
    else
      flash[:danger] = "Something went wrong! Try a different Room Name, or check for duplicate users."
      redirect_to '/game/new'
    end

  end

  def destroy
    if !current_user.room_id.nil?
      destroy_room
    end
    redirect_to '/game'
  end

end

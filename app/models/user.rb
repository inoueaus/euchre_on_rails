# class Userdata < ActiveRecord::Base
class User < ApplicationRecord
  self.table_name = "user"
  #attr_accessor :password_confirmation
  before_save { self.username = username.downcase }

  validates :username, presence: true, uniqueness: true
  validates :password, presence: true

  has_many :gameupdates

  has_secure_password
end

# == Schema Information
#
# Table name: professional_learning_courses
#
#  id   :integer          not null, primary key
#  name :string(255)
#

class ProfessionalLearningCourse < ActiveRecord::Base
  has_many :user_professional_learning_course_enrollment, dependent: :destroy
  has_many :plc_evaluation_question, dependent: :destroy
end

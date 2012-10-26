class CreateBackgroundImages < ActiveRecord::Migration
  def change
    create_table :background_images do |t|
      t.string :name
      t.string :content_type

      t.timestamps
    end
  end
end
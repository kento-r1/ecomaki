class CreateBackgroundMusics < ActiveRecord::Migration
  def change
    create_table :background_musics do |t|

      t.string :name
      t.string :author
      t.string :description

      t.string :content_type

      t.timestamps
    end
  end
end

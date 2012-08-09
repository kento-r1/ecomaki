$(function(){
	var Entry = Backbone.Model.extend({
		initialize: function() {
		    this.novel_id = arguments[1].novel_id;
		    this.chapter_id = arguments[1].chapter_id;
		    this.id = arguments[1].id;
		    this.url = "/novel/" + this.novel_id + "/chapters/" + this.chapter_id + "/entries/" + this.id + ".json";
		},
	    });


	var EntryList = Backbone.Collection.extend({
		model: Entry,
		initialize: function() {
		    this.novel_id = arguments[1].novel_id;
		    this.chapter_id = arguments[1].chapter_id;
		    this.url = "/novel/" + this.novel_id + "/chapters/" + this.chapter_id + "/entries.json";
		    this.fetch();
		}
	    });


	var Chapter = Backbone.Model.extend({
		entrylist: EntryList,
		initialize: function() {
		    var novel_id = arguments[0].novel_id;
		    var id = arguments[0].id;
		    this.id = id;
		    this.novel_id = novel_id;
		    this.entries = new this.entrylist(null, 
	{novel_id: novel_id,
	 chapter_id: id
	});
		},
	    });


	var ChapterList = Backbone.Collection.extend({
		model: Chapter,
		initialize: function() {
		    this.novel_id = arguments[1].novel_id;
		    this.url = "/novel/" + this.novel_id + "/chapters.json"
		    // ChapterList is initialized by Novel model.
		    //this.fetch();
		},
	    });


	Novel = Backbone.Model.extend({
		chapterlist: ChapterList,
		initialize: function() {
		    this.url = "/novel/" + this.id + ".json";
		    this.chapters = new this.chapterlist(null, {novel_id: this.id});
		    this.fetch();
		},
		set: function(key, value, options) {
		    var attr, attrs, options;
		    if (_.isObject(key) || key == null) {
			attrs = key;
			options = value;
		    } else {
			Backbone.Model.prototype.set.call(this, key, value, options);
			return this;
		    }
		    for (attr in attrs) {
			var val = attrs[attr];

			if (attr == 'chapter') {
			    for (v in val) {
				v['novel_id'] = this.id;
			    }
			    console.log("chapter is added");
			    this.chapters.add(val);
			    console.log(this.chapters.length);
			} else {
			    Backbone.Model.prototype.set.call(this, attr, val, options);
			}
		    }
		}
	    });


	var NovelView = Backbone.View.extend({
		initialize: function() {
		    this.model.bind('change', this.render, this);
		    this.model.bind('destroy', this.render, this);
		},
		render: function() {

		}
	    });
    });

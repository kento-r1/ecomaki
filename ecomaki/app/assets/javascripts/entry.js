//= require jquery.jStageAligner

entry_width = 800;
entry_height = 255;
entry_num = 0;
entry_pos = 0;
defImage = "";

function loadEntry(){
    loadXml('0.xml',parsEntryXml);
}


function loadXml(url,func){
    //alert("load");
    $.ajax({
        url:url,
        type:'get',
        dataType:'xml',
        timeout:1000,
        success:func
    });
}

function parsEntryXml(xml,status){
    if(status!='success')return;
    $(xml).find('entry').each(entryInflate);
}

function entryInflate(){
    if($(this).hasClass('textEntry')){
        str = $(this).find('text').html();
        textEntry = new TextEntry(str);
        textEntry.add();
    }else{
        entry = new Entry();
        entry.add();
        $(this).find('entry-baloon').each( function(){
            var str = $(this).find('content').text();
            var pos ={
               height: $(this).find('height').text(),
               width: $(this).find('width').text(),
               top: $(this).find('y').text().text(),
               lft: $(this).find('x')
            }
            entry.addBaloon(new Baloon(str,pos));               
        });
       $(this).find('entry-character').each( function(){
            var id = $(this).find('id').text();
            var pos ={
               height: $(this).find('height').text(),
               width: $(this).find('width').text(),
               top: $(this).find('y').text().text(),
               lft: $(this).find('x')
            }
            entry.addImage(new Image("/images/characters/"+id+".jpg",pos));
        });

    }
}


var EntryHandle = function (atype,text){
  this.type = atype
  if(this.type == 'normal'){
      this.entry = new Entry();
  }else{
      this.entry = new TextEntry(text);
  }
};

EntryHandle.prototype = {
  body: '<div class="entry-handle"></div>',
  deleteBody: '<button class="btn danger">delete</button><br>',
  addBaloonBody: '<button class="btn info">Serif</button><br>',
  addImageBody: '<button class="btn success">Image</button><br>',
  list: '#entrylist',
  margin: 70,
  //baloon: new Baloon("",{}),
  //image: new Image("",{}),
  appendTo: function(target){
    this.newEntryHandle = $(this.body);
    this.newEntryHandle
        .appendTo(target)
        .css({position: "relative"});
    
    this.entry.appendTo(this.newEntryHandle);

    this.deleteHandle = $(this.deleteBody);
    this.deleteHandle.appendTo(this.newEntryHandle);
    
    if(this.type  == 'normal'){
        this.addBaloonHandle = $(this.addBaloonBody);
        this.addBaloonHandle.appendTo(this.newEntryHandle);
 
        this.addImageHandle = $(this.addImageBody);
        this.addImageHandle.appendTo(this.newEntryHandle);
    }
    this.init();
   
    return this.newEntryHandle;
  },
  add: function(){
    this.appendTo(this.list);
  },
  addWith: function(str,strPos,src,srcPos){
    this.appendTo(this.list);
    this.entry.addBaloon(new Baloon(str,strPos));
    this.entry.addImage(new Image(src,srcPos));
  },
  init: function(){
    this.deleteHandle.click(this.deleteEntry); 
    if(this.type == 'normal'){
       this.addBaloonHandle.click(this.addBaloon);
       this.addImageHandle.click(this.addImage);
    }
    this.newEntryHandle
        //.find('button').hide()
        .mouseover(function(){
            $(this).find('button').show();
        })
        .mouseout(function(){
            $(this).find('button').hide();
        })
        .width(this.entry.newEntry.width() + this.margin)
        .height(this.entry.newEntry.height());
  },  
  deleteEntry: function(ev){
    $(event.target).parent().remove();
  },
  addBaloon: function(ev){ 
    //this.entry.addBaloon(new Baloon("",{}));
    //class like method is better but icant now 
    var entry = $(event.target).parent().find('.entry');
    var baloon = new Baloon("",{});
    baloon.appendTo(entry);
  },
  addImage: function(ev){
    //this.entry.addImage(new Image("",{}));
    var entry = $(event.target).parent().find('.entry');
    var image = new Image("",{});
    image.appendTo(entry);
  }
}  

//class like entry
var Entry = function(){};

Entry.prototype = {
  body: '<div class="entry"></div>',
  list: '#entrylist',
  width: 800,
  height: 300,
  appendTo: function(target){
    this.newEntry = $(this.body);
    this.newEntry
        .appendTo(target)
        .css({position: "absolute" , float: 'left'})
        .width(this.width)
        .height(this.height);
    return this.newEntry;
  },
  add: function(){
    this.appendTo(this.list);
  },
  addBaloon: function(baloon){ 
    baloon.appendTo(this.newEntry);
  },
  addImage: function(image){
    image.appendTo(this.newEntry);
  },
  add: function(str,strPos,src,srcPos){
    this.appendTo(this.list);
    this.addImage(new Image(src,srcPos) );
    this.addBaloon(new Baloon(str,strPos));
    //this.addImage(new Image(src,srcPos) );
  }
}

//position obj is there some nomal one?
var Pos = function(atop,aleft,awidth,aheight){
  this.top = atop;
  this.left = aleft;
  this.width = awhidth;
  this.height = aheight;
}

//the character speack baloon
var Baloon = function(astr,apos){
  //TODO remove tag or function
  this.str = astr;
  this.pos = apos;
}

Baloon.prototype = {
  body: function(){
    return '<div class="baloon-draggable"><div class="sticky baloon-resizable"><div class="text">' + this.str + '</div></div></li>';
  },
  appendTo: function(target){
    this.newBaloon = $(this.body());
    this.newBaloon.appendTo(target);
    this.init();
  },
  init: function(){
    this.newBaloon.draggable({
        containment: "parent"
    })
    .css({position: "absolute",top: 0,left: 100 ,zIndex: 1})
    .css(this.pos)
    .width(this.pos.width)
    .height(this.pos.height);

    this.newBaloon.find(".text").css({'margin': '10px'});
    this.newBaloon.find(".baloon-resizable").resizable({
      resize: this.onResize
    })
    .width(this.pos.width)
    .height(this.pos.height);

    this.newBaloon.find(".baloon-resizable").dblclick(editTextArea);
  },
  onResize: function(event,ui){
    //alert();
    var st = $(event.target).parent();
    var ent = st.parent().parent();
      if(st.hasClass('baloon-resizable')){
        if(st.offset().left + st.width() > ent.offset().left + ent.width() )
        {  st.width(ent.offset().left + ent.width() - st.offset().left);}
        if(st.offset().top + st.height() > ent.offset().top + ent.height() )
        {  st.height(ent.offset().top + ent.height() - st.offset().top);}
        st.parent().width(st.width());
        st.parent().height(st.height());
      }
  }
}

var Image = function(asrc,apos){
  //TODO remove tag or function  i
  this.src = asrc;
  this.pos = apos;
}

Image.prototype = {
  body: function(){
    return '<img class="Image" ></img>';
  },
  appendTo:function(target){
    this.newImage = $(this.body());
    this.newImage.appendTo(target);
    this.init();

  },
  init: function(){
    this.newImage
      .attr({src: this.src})
      .css({position: "absolute",top: 0,left: 0,height: this.newImage.parent().parent().height(), zIndex: 1 })
      .css(this.pos)
      .width(this.pos.width)
      .height(this.pos.height);
    this.newImage.resizable(
            {containment: "parent parent"}
         )
        .parent().draggable({
        containment: "parent"
    }).dblclick(this.selectImage);
  },
  selectImage: function(ev){
     pickImage(ev);
  }
}

//most basic entry add func
entry_list = "#entrylist";
function addEntry(){
    var newEntry = $('<div class="entry"></div>');
    newEntry
        .appendTo(entry_list)
        .css({position: "relative"})
        width(entry_width)
        height(entry_height);
    return newEntry;
}

var TextEntry = function(astr){
  this.str = astr;
}

TextEntry.prototype = {
  body: function(){ 
    return '<div class="entry text-entry"><div><p class="text"> ' + this.str + ' </p></div></div>'
  },
  width: 800,
  height:10,
  list: '#entrylist',
  appendTo: function(target){
    this.newEntry = $(this.body());
    this.newEntry.appendTo(target);
    this.init();
  },
  add: function(){
    this.appendTo(this.list);
  },
  init: function(){
    this.newEntry
       .css( {position: 'absolute'})
       .width( this.width );
    this.newEntry.find('.text')
       .css( {'margin': '12px'} )
       .width( this.newEntry.width() );
   //    .height( this.newEntry.height() );
    this.newEntry.find('.text').parent()
       .width(this.newEntry.width())
   //    .height(this.newEntry.height())
       .dblclick(editTextArea);
  }
}

function editTextArea(){
        text = $(".text",this).html().split("<br>").join('\n');
        text = text.replace(/&amp;/g,"&");
        text = text.replace(/&quot;/g,"/");
        text = text.replace(/&#039;/g,"'");
        text = text.replace(/&lt;/g,"<");
        text = text.replace(/&gt;/g,">");
        hidedText = $(this).hide();

        focusedText = $('<textarea></textarea>');
        focusedText.appendTo($(this).parent())
                .focus()
                .select()
                .val(text)
                .blur(function() {
                        text = $(this).val().split('\n').join("<br>");
                        var st = $(this).parent();
                        hidedText.show();
                        $(".text",st)
                            .html(text);
                        //hidedText
                        //    .height($(this).height())
                        //    .width($(this).width());
                        $(this).remove();
                })
                .height(
                        $(this).height()
                )
                .width(
                        $(this).width()
                );
}



$(function() {

        //entry = new Entry();
        //entry.add();
        //baloon = new Baloon("test",{});
        //entry.addBaloon(baloon);
        //image = new Image("/images/characters/1.jpg",{});
        //entry.addImage(image);
        //textentry = new TextEntry("test");
        //textentry.add();
	
//	$('#entrylist').sortable( ) .mousedown(function(){
//                focusedText.blur();

  //      });//list > List?

    	
    });


entry_n = 0;

$(function() {
        tool = new SketchTool();
        tool.appendTo('#novel_container');
        tool.setDefaultParet();
        tool.hide();

//	$( "#chapterList" ).sortable();

        novel = new Novel({ id:1});

     	novelView = new NovelView({model: novel});
        $('#content').append(novelView.el);	
    
	isChapterHided = true;
	
	//init 	
	$("#sideMenu .nav-header").parent().find('li').hide();
        //$( "#sideMenu .nav-header").show();
	//$('#content').css({left:-200});

	$( "#sideMenu .nav-header").click(
	        function(ev) {
                   if(isChapterHided){
			$(this).parent().find('li').show();
			$('#content').css({left:0});
 			isChapterHided = false;
		   }else{ 
                   	$(this).parent().find('li').hide();
			$('#content').css({left:-200});
                   	$(this).show();
 			isChapterHided = true;
  		   }
             });		

        $("#picker").hide();
        
        /*
	$("#comment")
        	.jStageAligner("RIGHT_MIDDLE", {time: 150})
        	.click(function(){
        		$(this).fadeTo("fast",1.0);
        		})
        	.blur(function() {
        		$(this).fadeTo("fast",0.5);
        	})
        	.keypress(function (e) {
      			if(e.which == 13){
      				text = $("#comment").val();	
      				t = $("#comment").position().top;
      				l = $("#comment").position().left;
      				
       				commented = $('<textarea readonly>'+text+'</textarea>');
       				commented
        				.appendTo($('#commentList'))
        				.css({position: "absolute",top: t, left: l})
        				.width($("#comment").width()).hide().css({'z-index':1})
        				.show("slow");
    
      			resizeTextarea(commented[0]);
      			commented.animate(commented.height(),"slow");
      			
      			$("#comment").val("").css({'z-index':2}); 
      		}  
  		});
    	*/
    });

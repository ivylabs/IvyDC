var videoPlayerComponent = BaseComponent.extend({
	update : function () {
		var myself=this;
	
		if(!this.width){
			this.width = $('#'+this.htmlObject).width();
		}
		
		if(!this.height){
			this.height = $('#'+this.htmlObject).height();
		}
		
		if(this.controls){
			this.controls = "controls";
		}
		
		if(this.autoPlay){
			this.autoPlay = "autoplay";
		}
		
		var videoType = this.videoURL.split(".").pop();
		
		if(this.popup){
			this.autoPlay = "";
		}

		var videoHTML = "";

		videoHTML += '<video id="example_video_1" class="video-js vjs-default-skin" '+this.controls+' '+this.autoPlay+' preload="auto" width="'+this.width+'" height="'+this.height+'" data-setup="{\'controls\':true, \'autoplay\':true}">';
		
		videoHTML += '<source src="'+this.videoURL+'" type="video/'+videoType+'" />';
		videoHTML += '</video>';
	
		if(this.popup){
			
			var popupHTML = "";
			popupHTML += "<div id='videoPlayer' style='height:"+this.height+"px;display:none;'>";
			popupHTML += "<div id='popupForm' style='width:"+this.width+"px'>";
			popupHTML += videoHTML;
			popupHTML += "</div></div>";
			
			$('.container').append(popupHTML);
			
			$('#example_video_1').attr('width',$('#popupForm').width());
			

			$("#"+this.htmlObject).html("<a href='#popupForm' id='openVideo'>Open Video</a>");

				
			$('#openVideo').fancybox({
				'width': this.width,
				'height': this.height
			});

		} else {
			$("#"+this.htmlObject).html(videoHTML);
		}
	}
});
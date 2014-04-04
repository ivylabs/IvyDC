var videoPlayerComponent = BaseComponent.extend({
	update : function () {
		var myself = this;
		var idObj = this.htmlObject;

		this.videoLoop = this.videoLoop?true:false;
		this.videoPosterImg = this.videoPosterImg?this.videoPosterImg:'';
		this.CssClasses = this.CssClasses?this.CssClasses:"";
	
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
		
		if(this.popup){
			this.autoPlay = "";
		}

		var videoHTML = '<video id="'+this.htmlObject+'_video" class="video-js vjs-default-skin " ' + this.controls + ' ' + this.autoPlay + ' ' + this.CssClasses + 
			' preload="auto" poster="' + this.videoPosterImg + '" ' + (this.videoLoop?"loop":"") + ' data-setup="{\'controls\':true, \'autoplay\':true }">';

		for(var i = 0; i<this.videos.length; i++){
			videoHTML += '<source src="' + this.videos[i][0] + '" type="' + this.videos[i][1] + '" />';
		}
		for(var i = 0; i<this.tracks.length; i++){
			videoHTML += '<track kind="captions" src="' + this.tracks[i][0] + '" srclang="' + this.tracks[i][1] + '" label="'+videoLanguange[this.tracks[i][1]]+'" />';
		}

		videoHTML += '</video>';
	
		if(this.popup){
			
			var popupHTML = "";
			popupHTML += "<div id='videoPlayer' style='height:" + this.height + "px;display:none;'>";
			popupHTML += "<div id='popupForm' style='width:" + this.width + "px'>";
			popupHTML += videoHTML;
			popupHTML += "</div></div>";

			$('.container').append(popupHTML);
			
			$('#'+this.htmlObject+'_video').attr('width',$('#popupForm').width());
		
			$("#"+this.htmlObject).html("<a href='#popupForm' id='openVideo'>Open Video</a>");

			$('#openVideo').fancybox({
				'width': this.width,
				'height': this.height
			});

			idObj = "popupForm";
		} else {
			$("#"+this.htmlObject).html(videoHTML);
		}

		videojs(this.htmlObject+'_video', {"height":"auto", "width":"auto"}).ready(function(){
			var myPlayer = this;    // Store the video object
			var aspectRatio = 5/12; // Make up an aspect ratio

			function resizeVideoJS(){
			  // Get the parent element's actual width
			  var width = document.getElementById(myPlayer.id()).parentElement.offsetWidth;
			  // Set width to fill parent element, Set height
			  myPlayer.width(width-30).height( width * aspectRatio );
			}

			resizeVideoJS(); // Initialize the function
			window.onresize = resizeVideoJS; // Call the function on resize
		});

		if(myself.buttonsControlsColor!==undefined&&myself.buttonsControlsColor!==""){
			$("#"+idObj).find(".vjs-default-skin").css("color", myself.buttonsControlsColor);
		}

		if(myself.controlsLevelColor!==undefined&&myself.controlsLevelColor!==""){
			$("#"+idObj).find(".vjs-default-skin .vjs-play-progress, .vjs-default-skin .vjs-volume-level").css("background-color", myself.controlsLevelColor);
		}

		if(myself.controlBarSize!==undefined&&myself.controlBarSize!==""){
			$("#"+idObj).find(".vjs-default-skin .vjs-control-bar, .vjs-default-skin vjs-big-play-button").css("font-size", myself.controlBarSize+"%");
		}

	}
});

var videoLanguange = {
	"ab": "Abkhazian",
    "aa": "Afar",
    "af": "Afrikaans",
    "sq": "Albanian",
    "am": "Amharic",
    "ar": "Arabic",
    "an": "Aragonese",
    "hy": "Armenian",
    "as": "Assamese",
    "ay": "Aymara",
    "az": "Azerbaijani",
    "ba": "Bashkir",
    "eu": "Basque",
    "bn": "Bengali (Bangla)",
    "dz": "Bhutani",
    "bh": "Bihari",
    "bi": "Bislama",
    "br": "Breton",
    "bg": "Bulgarian",
    "my": "Burmese",
    "be": "Byelorussian (Belarusian)",
    "km": "Cambodian",
    "ca": "Catalan",
    "zh": "Chinese (Simplified)",
    "zh": "Chinese (Traditional)",
    "co": "Corsican",
    "hr": "Croatian",
    "cs": "Czech",
    "da": "Danish",
    "nl": "Dutch",
    "en": "English",
    "eo": "Esperanto",
    "et": "Estonian",
    "fo": "Faeroese",
    "fa": "Farsi",
    "fj": "Fiji",
    "fi": "Finnish",
    "fr": "French",
    "fy": "Frisian",
    "gl": "Galician",
    "gd": "Gaelic (Scottish)",
    "gv": "Gaelic (Manx)",
    "ka": "Georgian",
    "de": "German",
    "el": "Greek",
    "kl": "Greenlandic",
    "gn": "Guarani",
    "gu": "Gujarati",
    "ht": "Haitian Creole",
    "ha": "Hausa",
    "he": "Hebrew",
    "hi": "Hindi",
    "hu": "Hungarian",
    "is": "Icelandic",
    "io": "Ido",
    "id": "Indonesian",
    "ia": "Interlingua",
    "ie": "Interlingue",
    "iu": "Inuktitut",
    "ik": "Inupiak",
    "ga": "Irish",
    "it": "Italian",
    "ja": "Japanese",
    "jv": "Javanese",
    "kn": "Kannada",
    "ks": "Kashmiri",
    "kk": "Kazakh",
    "rw": "Kinyarwanda (Ruanda)",
    "ky": "Kirghiz",
    "rn": "Kirundi (Rundi)",
    "ko": "Korean",
    "ku": "Kurdish",
    "lo": "Laothian",
    "la": "Latin",
    "lv": "Latvian (Lettish)",
    "li": "Limburgish ( Limburger)",
    "ln": "Lingala",
    "lt": "Lithuanian",
    "mk": "Macedonian",
    "mg": "Malagasy",
    "ms": "Malay",
    "ml": "Malayalam",
    "mt": "Maltese",
    "mi": "Maori",
    "mr": "Marathi",
    "mo": "Moldavian",
    "mn": "Mongolian",
    "na": "Nauru",
    "ne": "Nepali",
    "no": "Norwegian",
    "oc": "Occitan",
    "or": "Oriya",
    "om": "Oromo (Afan, Galla)",
    "ps": "Pashto (Pushto)",
    "pl": "Polish",
    "pt": "Portuguese",
    "pa": "Punjabi",
    "qu": "Quechua",
    "rm": "Rhaeto-Romance",
    "ro": "Romanian",
    "ru": "Russian",
    "sm": "Samoan",
    "sg": "Sangro",
    "sa": "Sanskrit",
    "sr": "Serbian",
    "sh": "Serbo-Croatian",
    "st": "Sesotho",
    "tn": "Setswana",
    "sn": "Shona",
    "ii": "Sichuan Yi",
    "sd": "Sindhi",
    "si": "Sinhalese",
    "ss": "Siswati",
    "sk": "Slovak",
    "sl": "Slovenian",
    "so": "Somali",
    "es": "Spanish",
    "su": "Sundanese",
    "sw": "Swahili (Kiswahili)",
    "sv": "Swedish",
    "tl": "Tagalog",
    "tg": "Tajik",
    "ta": "Tamil",
    "tt": "Tatar",
    "te": "Telugu",
    "th": "Thai",
    "bo": "Tibetan",
    "ti": "Tigrinya",
    "to": "Tonga",
    "ts": "Tsonga",
    "tr": "Turkish",
    "tk": "Turkmen",
    "tw": "Twi",
    "ug": "Uighur",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "uz": "Uzbek",
    "vi": "Vietnamese",
    "vo": "Volapük",
    "wa": "Wallon",
    "cy": "Welsh",
    "wo": "Wolof",
    "xh": "Xhosa",
    "yi": "Yiddish",
    "yo": "Yoruba",
    "zu": "Zulu"
};
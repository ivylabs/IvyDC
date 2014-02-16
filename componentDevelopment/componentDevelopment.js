var componentDevelopment = BaseComponent.extend({
	
	
	update : function() {
		var myself=this;
		
		var buttonHTML = "<button>"+this.label+"</button>"
		
		$("#"+this.htmlObject).html(buttonHTML);
		
		$("#"+this.htmlObject+" > button").click(function(){
			$.post('http://'+location.host+'/pentaho/plugin/repositorySynchronizer/api/syncRepositories',{
				paramdelete:'N',
				paramselectedAction:'I',
				paramoriginRepoLocation:'File+System',
				paramdestinationRepoLocation:'JCR'
			}).done(function() {
				
				$.get('http://'+location.host+'/pentaho/plugin/pentaho-cdf-dd/api/renderer/refresh').done(function() {
					alert( "Success");	
				});

			});
		});
	}
});

 
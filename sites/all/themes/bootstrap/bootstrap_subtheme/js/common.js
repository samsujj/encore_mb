var base = '/encore_mb';
(function($) {
	
	Drupal.behaviors.myBehavior = {
       attach: function (context, settings) {
		   
		   $('#broad-checkbox').change(function() {
			   var bval=0
			   if($(this).prop('checked')){
				   bval = 1; 
			   }else{
				   bval = 2;
			   }
			   $.post(base+'/custommodule/updatestatus1',{val:bval},function(res){
			   });
			   
			});

			
			/*For Facebook[start]*/
			var appId = '413908115333386';
			var appSecret = '0447bcb3eaf727372e7445724a1931e6';
			
			var e = document.createElement('script'); e.async = true;
                e.src = document.location.protocol
                + '//connect.facebook.net/en_US/all.js';
                document.getElementById('fb-root').appendChild(e);
				
				if($('#fb-auth').length > 0){
			
               window.fbAsyncInit = function() {
				   FB.init({ appId: appId,
                    status: true,
                    cookie: true,
                    xfbml: true,
                    oauth: true});

                function updateButton(response) {
					button       =   document.getElementById('fb-auth');
                    

                    if (response.authResponse) {
                        //user is already logged in and connected
                       /* FB.api('/me', function(info) {
                            login(response, info);
                        });*/
						
						button.onclick = function() {
							FB.api('/me', function(info) {
								beforeLogin(response, info);
							});
						}

                        
                    } else {
                        //user is not connected to your app or logged out
                        button.onclick = function() {
							FB.login(function(response) {
                                if (response.authResponse) {
                                    FB.api('/me', function(info) {
                                        beforeLogin(response, info);
                                    });
                                } else {
                                    //user cancelled login or did not grant authorization
                                }
                            }, {scope:'email,user_videos,user_birthday,status_update,publish_stream,user_about_me,user_status,friends_about_me,read_mailbox,manage_friendlists,user_videos,read_requests,sms,friends_status,xmpp_login,read_stream,user_photos,user_groups,manage_pages,user_likes,friends_likes,user_subscriptions,friends_subscriptions'});
                        }
                    }
                }

                // run once with current status and whenever the status changes
                FB.getLoginStatus(updateButton);
         
	   }
	   
	   $('#loading').show();
	   
	   $.post(base+'/custommodule/get_social_post',{},function(res){
		   if(res != ''){
			   
			   var htmlres=jsonParse(res);
			   
			   if(typeof(htmlres['profile']) !='undefined'){
			   
				   $('#cur-fb-profile').html(htmlres['profile']);
				   $('#cur-fb-profile').css('border','solid 1px #ddd');
				   $('#cur-fb-profile').css('padding','10px 0');
				   
				   $('#fb-auth').text('Update FB Profile');
				   $('#fb-auth').attr('st',1);
			   }else{
				   $('#fb-page-manage').hide();
				   $('#fb-group-manage').hide();
			   }
			   
			   if(typeof(htmlres['page']) !='undefined'){
			   
				   $('#page-list').css('border','solid 1px #ddd');
				   $('#page-list').css('padding-bottom','2%');
				   
				   for(n in htmlres['page']){
					   $('#page-list').append(htmlres['page'][n]);
				   }
			   }
			   
			   if(typeof(htmlres['group']) !='undefined'){
			   
				   $('#group-list').css('border','solid 1px #ddd');
				   $('#group-list').css('padding-bottom','2%');
				   
				   for(n in htmlres['group']){
					   $('#group-list').append(htmlres['group'][n]);
				   }
			   }
			   
			   $('#loading').hide();
			   
			   
			   $('.page-del-btn,.group-del-btn').click(function(){
				   var curdiv = $(this).parent();
				  $.post(base+'/custommodule/custom_node_delete',{nid:$(this).attr('media-id')},function(res){
					  curdiv.remove();
				  });
			   });
			   
			   
			   
			   
		   }
	   });
	   
	   
	   }
	   
	   function beforeLogin(response, info){
		   
		   var st = $('#fb-auth').attr('st');
		   
		   if(st == 0){
			   login(response, info);
		   }else{
		   				bootbox.confirm("Your current Facebook profiles , Groups and Fan pages settings will be lost as you have changed your profile into new one ! Ok ?", function(result) {
							if(result){
								login(response, info);
							}
						})
		   }

	   }
            function login(response, info){
				
				
						if (response.authResponse) {
							accessToken                                 =   response.authResponse.accessToken;

							$.get('https://graph.facebook.com/oauth/access_token?client_id='+appId+'&client_secret='+appSecret+'&grant_type=fb_exchange_token&fb_exchange_token='+accessToken,{},
								function(result)
								{
									var res = {};
									var a = result.split('&');
									for (var i in a)
									{
										var b = a[i].split('=');
										res[decodeURIComponent(b[0])] = decodeURIComponent(b[1]);
									}
									
									$.post(base+'/custommodule/create_social_post',{'social_media_id':info.id,'social_media_name':info.name,'token':res['access_token'], 'expires':res['expires']},function(res){
										$('#cur-fb-profile').html('<h2>Facebook Profile:</h2>\
											<h2><img src="https://graph.facebook.com/'+info.id+'/picture" />\
											<span>'+info.name+'</span></h2>');
										$('#cur-fb-profile').css('border','solid 1px #ddd');
										$('#cur-fb-profile').css('padding','10px 0');
										
										$('#fb-auth').text('Update FB Profile');
										$('#fb-auth').attr('st',1);
										
										$('#page-list').css('border','none');
										$('#page-list').css('padding-bottom','0');
										$('#page-list').empty();
										
										$('#group-list').css('border','none');
										$('#group-list').css('padding-bottom','0');
										$('#group-list').empty();
										
									});
									
									
								}
							);
						}
					
				
            }
			

			
			/*For Facebook[End]*/
			
			
			$('#quicktabs-home_tab').find('ul > li').css('cursor','pointer');
			$('#quicktabs-home_tab').find('ul > li').click(function(){
				$(this).children('a').click();
			});
			
			
			$('#fb-page-manage').click(function(){
				$.post(base+'/custommodule/get_all_fb_like',{},function(res){
					
					var likes=jsonParse(res);
					
					var html = '<div id="fb-like">';
					
					for(c in likes['data'])
                    {
                            var appname = likes['data'][c]['name'];
                            var appid = likes['data'][c]['id'];
                            
                            html += '<div><a href="https://www.facebook.com/pages/'+appname+'/'+appid+'" target="_blank"><img src="http://graph.facebook.com/'+likes['data'][c]['id']+'/picture" alt="" style="padding:3px; width:50px; border:1px solid #9f9e8c;" /></a><a href="https://www.facebook.com/pages/'+appname+'/'+appid+'" target="_blank"> '+likes['data'][c]['name']+' </a><input type="button" value="Add" class="page-add-button" appname="'+appname+'" appid="'+appid+'" /> </div>';
							
							
                    }

					html+='</div>';					
					
					bootbox.dialog({
								message: html,
								title: "Facebook Page",
							});
					
					
					if(typeof(likes['paging']['next']) != 'undefined'){
						$('.modal-body').find('#fb-like').append('<div"><input type="button" value="next" link-attr="'+likes['paging']['next']+'" id="next-link" /></div>');
						$('#next-link').click(function(){
							var nextLink = $(this).attr('link-attr');
							$.post(base+'/custommodule/get_fb_pagination',{nextLink:nextLink},function(res){
								var likes=jsonParse(res);
								
								for(c in likes['data'])
								{
										var appname = likes['data'][c]['name'];
										var appid = likes['data'][c]['id'];
										
										html= '<div><a href="https://www.facebook.com/pages/'+appname+'/'+appid+'" target="_blank"><img src="http://graph.facebook.com/'+likes['data'][c]['id']+'/picture" alt="" style="padding:3px; width:50px; border:1px solid #9f9e8c;" /></a><a href="https://www.facebook.com/pages/'+appname+'/'+appid+'" target="_blank"> '+likes['data'][c]['name']+' </a><input type="button" value="Add" class="page-add-button" appname="'+appname+'" appid="'+appid+'" /></div>';
										
										$('.modal-body').find('#fb-like').find('#next-link').parent().before(html);
								}	

					$('.page-add-button').click(function(){
						var pageid = $(this).attr('appid');
						var pagename = $(this).attr('appname');
						$.post(base+'/custommodule/add_fb_page',{'social_media_id':pageid,'social_media_name':pagename,'type':'page'},function(res){
							alert(res)
						});
					});


								
								if(typeof(likes['paging']['next']) != 'undefined'){
									$('.modal-body').find('#fb-like').find('#next-link').attr('link-attr',likes['paging']['next']);
								}else{
									$('.modal-body').find('#fb-like').find('#next-link').parent().remove();
								}
								
							});
						});
					}
					
					$('.page-add-button').click(function(){
						var pageid = $(this).attr('appid');
						var pagename = $(this).attr('appname');
						$.post(base+'/custommodule/add_fb_page',{'social_media_id':pageid,'social_media_name':pagename,'type':'page'},function(res){
							$('#page-list').append('<div><a target="_blank" href="https://www.facebook.com/pages/'+pagename+'/'+pageid+'">\
									<img style="padding:3px; width:50px; border:1px solid #9f9e8c;" alt="" src="http://graph.facebook.com/'+pageid+'/picture"></a>\
									<a target="_blank" href="https://www.facebook.com/pages/'+pagename+'/'+pageid+'">'+pagename+'</a>\
									<input type="button" value="delete" class="page-del-btn" media-id="'+res+'" /></div>');
						});
					});
					
				});
			});
			$('#fb-group-manage').click(function(){
				$.post(base+'/custommodule/get_all_fb_group',{},function(res){
					
					var likes=jsonParse(res);
					
					var html = '<div id="fb-group">';
					
					for(c in likes['data'])
                    {
                            var appname = likes['data'][c]['name'];
                            var appid = likes['data'][c]['id'];
                            
                            html += '<div><a href="https://www.facebook.com/groups/'+appid+'" target="_blank"><img src="http://graph.facebook.com/'+likes['data'][c]['id']+'/picture" alt="" style="padding:3px; width:50px; border:1px solid #9f9e8c;" /></a><a href="https://www.facebook.com/groups/'+appid+'" target="_blank"> '+likes['data'][c]['name']+' </a><input type="button" value="Add" class="group-add-button" appname="'+appname+'" appid="'+appid+'" /> </div>';
							
							
                    }

					html+='</div>';					
					
					bootbox.dialog({
								message: html,
								title: "Facebook Group",
							});
					
					
					$('.group-add-button').click(function(){
						var groupid = $(this).attr('appid');
						var groupname = $(this).attr('appname');
						$.post(base+'/custommodule/add_fb_page',{'social_media_id':groupid,'social_media_name':groupname,'type':'group'},function(res){
							$('#group-list').append('<div><a target="_blank" href="https://www.facebook.com/groups/'+groupid+'">\
									<img style="padding:3px; width:50px; border:1px solid #9f9e8c;" alt="" src="http://graph.facebook.com/'+groupid+'/picture"></a>\
									<a target="_blank" href="https://www.facebook.com/groups/'+groupid+'">'+groupname+'</a>\
									<input type="button" value="delete" class="group-del-btn" media-id="'+res+'" /></div>');
						});
					});
					
					
					
				});
			});
	
		}
	};
	
	
	
	
})(jQuery);



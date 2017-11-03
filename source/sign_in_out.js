$vm.google_signin_setup=function(client_id,button_id,callback){
	$.getScript('https://apis.google.com/js/platform.js',function(){
		gapi.load('auth2', function(){
			auth2 = gapi.auth2.init({
				client_id: client_id,
				cookiepolicy: 'single_host_origin',
				//scope: 'additional_scope'
			});
			var element=document.getElementById(button_id);
			auth2.attachClickHandler(element, {}, function(googleUser) {
					$vm.user_google_token=googleUser.getAuthResponse().id_token;
					$VmAPI.request({data:{cmd:'signin_google',token:$vm.user_google_token},callback:function(res){
						$VmAPI.set_token(res.token,res.api_url,res.username,res.user_id,res.nickname);
						if(res.user!==undefined){
							$vm.user=res.user;
							$vm.user_id=res.user_id;
							$vm.user_ip=res.user_ip;
							$vm.user_puid=res.user_puid;
							callback(res);
						}
						else{
							alert('Signin error');
						}
					}})
				},
				function(error){}
			);
		});
	});
	//---------------------------------------------
}
$vm.facebook_signin_setup=function(appId,button_id,callback){
	window.fbAsyncInit = function() {
		FB.init({
		  appId      : appId,
		  cookie     : true,
		  xfbml      : true,
		  version    : 'v2.8'
		});
		FB.AppEvents.logPageView();
	};
	(function(d, s, id){
		 var js, fjs = d.getElementsByTagName(s)[0];
		 if (d.getElementById(id)) {return;}
		 js = d.createElement(s); js.id = id;
		 js.src = "https://connect.facebook.net/en_US/sdk.js";
		 fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	$('#'+button_id).on('click',function(){
		FB.login(function(response){
			if(response.status==='connected'){
				$vm.user_facebook_token=response.authResponse.accessToken;
				$VmAPI.request({data:{cmd:'signin_facebook',token:$vm.user_facebook_token},callback:function(res){
					$VmAPI.set_token(res.token,res.api_url,res.username,res.user_id,res.nickname);
					if(res.user!==undefined){
						$vm.user=res.user;
						$vm.user_id=res.user_id;
						$vm.user_ip=res.user_ip;
						$vm.user_puid=res.user_puid;
						callback(res);
					}
					else{
						alert('Signin error');
					}
				}})
			}
			else{
			}
		}, {scope: 'email'});
	})
	//---------------------------------------------
}

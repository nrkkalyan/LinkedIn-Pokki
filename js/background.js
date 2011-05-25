window.addEventListener('load', function(){
	var _request_token_params = {
		callback : function(response){
			console.log('request_token callback->')
			var _auth_url = LinkedIn.request('get_auth_request_url', null);
			console.log(_auth_url);		
		}
	};
	var _access_token = LinkedIn.request('get_oauth_access_token', null);
	
	if(_access_token){ // access token exists start bg processes		
		LinkedInBackground.message('poll_network_updates');
		var _get_user_params = {};
		LinkedIn.request('get_user_profile', _get_user_params);
	} else { // no access token; request one	
		LinkedIn.request('request_token', _request_token_params);
	}
});





































		/*
		var _networkUpdatePolling = function(){						
			var _local_updates = LinkedIn.request('get_local_network_updates');
				if(_local_updates) // if local storgae is not empty
					_local_updates = _local_updates.values;
			
			var _params = {
				callback : function(response){					
					var _fetched_updates = response;
						_fetched_updates = _fetched_updates.values;
					var diffs = _fetched_updates.length; // empty local storage
					
					console.log('FETCHED DIFFS: ' + diffs);
					console.log('LOCAL UPDATES...');
					console.log(_local_updates);
					
					diffs = LinkedInBackground.message('diff_network_updates', {updates_1 : _local_updates, updates_2 : _fetched_updates});
					
					console.log('DIFFS: ' + diffs);	
					console.log('LOCAL NOTIFICATIONS: ' + LinkedInBackground.message('get_notification_count'));

					if(diffs){						
						var _current_not_count = LinkedInBackground.message('get_notification_count');
							_current_not_count = (typeof _current_not_count == 'undefined') ? 0 : _current_not_count;
						var _updated_not_count = parseInt(_current_not_count, 10) + parseInt(diffs, 10);						
												
						LinkedInBackground.message('set_notification_count', {count : _updated_not_count});
						console.log('UPDATED LOCAL NOTIFICATIONS: ' + LinkedInBackground.message('get_notification_count'));
						
						pokki.rpc('LinkedInPopup.message(\'publish_network_updates\')');	
						
						pokki.setIconBadge(_updated_not_count);
					}
					
														
					console.log('UPDATES')	
					console.log(response);				
				}
			};			
			
			LinkedIn.request('get_network_updates', _params);			
		}
		
		_networkUpdatePolling();
		setInterval(_networkUpdatePolling, 600000);	
		*/	
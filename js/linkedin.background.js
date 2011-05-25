var LinkedInBackground = function(){
	var _util = {
		network : {		
			diffUpdates : function(params){
				var limit = 10;
				var diffs = 0;
				var match = false;
				
				loop1:
				for(i=0; i<limit; i++){
					loop2:
					for(j=0; j<limit; j++){
						if(params.updates_1[i].timestamp == params.updates_2[j].timestamp){
							match = true;
							break loop2;					
						}
					}
					
					if(!match)
						diffs++;
					
					match = false;								
				}			
				
				return diffs;
			},
			poll : function(){				
				var _networkUpdatePolling = function(){						
					var _local_updates = LinkedIn.request('get_local_network_updates');
						if(_local_updates) // if local storage is not empty
							_local_updates = _local_updates.values;
					
					var _params = {
						callback : function(response){					
							var _fetched_updates = response;
								_fetched_updates = _fetched_updates.values;
							var diffs = _fetched_updates.length; // empty local storage
							
							console.log('FETCHED DIFFS: ' + diffs);
							console.log('LOCAL UPDATES...');
							console.log(_local_updates);
							
							if(_local_updates)
								diffs = LinkedInBackground.message('diff_network_updates', {updates_1 : _local_updates, updates_2 : _fetched_updates});
							
							console.log('DIFFS: ' + diffs);	
							console.log('LOCAL NOTIFICATIONS: ' + LinkedInBackground.message('get_notification_count'));
		
							if(diffs){						
								var _current_notify_count = LinkedInBackground.message('get_notification_count');
									_current_notify_count = (typeof _current_notify_count == 'undefined' || !_current_notify_count) ? 0 : _current_notify_count;
								var _updated_notify_count = parseInt(_current_notify_count, 10) + parseInt(diffs, 10);						
								
								console.log('CURRENT NOTIFY COUNT: ' + parseInt(_current_notify_count, 10));
								console.log('DIFFS COUNT: ' + parseInt(diffs, 10));
								console.log('NOTIFY COUNT: ' + _updated_notify_count);
																						
								LinkedInBackground.message('set_notification_count', {count : _updated_notify_count});
								console.log('UPDATED LOCAL NOTIFICATIONS: ' + LinkedInBackground.message('get_notification_count'));
								
								pokki.rpc('LinkedInPopup.message(\'publish_network_updates\')');	
								
								if(!pokki.isPopupShown()) // #TODO remove once notification clearing pattern is determined
									pokki.setIconBadge(_updated_notify_count);
							}
																							
							console.log('UPDATES')	
							console.log(response);				
						}
					};			
					
					LinkedIn.request('get_network_updates', _params);			
				}
				
				_networkUpdatePolling();
				setInterval(_networkUpdatePolling, 360000);	// every 6 minutes			
			}			 
		},
		notify : {
			local : {
				name : 'notification_count',
				set : function(count){
					console.log('SET COUNT: ' + count);
					window.localStorage.setItem(_util.notify.local.name, count);							
				},
				get : function(){
					return window.localStorage.getItem(_util.notify.local.name);				
				}				
			}
		}			
	};
	
	return {
		message : function(property, params){
			switch(property){
				case 'diff_network_updates':
					return _util.network.diffUpdates(params);
				case 'poll_network_updates':
					_util.network.poll();
					break;					
				case 'get_notification_count':
					return _util.notify.local.get();
				case 'set_notification_count':
					_util.notify.local.set(params.count);
					break;
				default:	
					console.log('LINKEDIN BACKGROUND MESSAGE "' + property +  '" NOT DEFINED');
					return false;											
			}
		}
	}
}();
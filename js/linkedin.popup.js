var LinkedInPopup = function(){
	var _util = {
		parseOauthAuthResponse : function(params){
			var _oauth_authorization_response = null;
		
			//http://www.pokki.com/?oauth_token=5c2431c3-bbe6-48b7-a2d8-e10ee4b1f6a3&oauth_verifier=57827
			if(params.url.indexOf('http://www.pokki.com/?oauth_token') >= 0){
				var _start = params.url.indexOf('?') + 1;
				
				if(_start){
					var _query_string = params.url.substr(_start)
 					var _query_obj = UTIL.translate.queryStringToObj(_query_string);
					
					console.log(_query_obj);
					if(_query_obj.oauth_token && _query_obj.oauth_verifier)
						_oauth_authorization_response = _query_obj;
						
				}
			}
			
			return _oauth_authorization_response;
		} 				
	};
	
	var _dom = {
		publishNetworkUpdates : function(){
			console.log('publishNetworkUpdates()->');
			var _network_updates = LinkedIn.request('get_local_network_updates', null);
			console.log(_network_updates.values);
			
			var _setPicture = function(a){
				var _person_img = a.item.updateContent.person.pictureUrl;
				console.log(a);
				console.log(a.item.updateContent.person.pictureUrl);
				
				var _image = (_person_img) ? _person_img : 'http://static01.linkedin.com/scds/common/u/img/icon/icon_no_photo_no_border_60x60.png';				

				return _image;
			};	
			
			var _setStatusMsg = function(a){
				var _type = a.item.updateType;
				var _person = a.item.updateContent.person;
				var _message = null;
								
				var _setConnectionMsg = function(){
					var _conn_message = ' is now connected to ' + 
						_person.connections.values[0].firstName + ' ' +
						_person.connections.values[0].lastName + '.';
					
					return _conn_message;
				};
				
				switch(_type){
					case 'STAT':
						_message = _person.currentStatus;
						break;
					case 'CONN':
						_message = _setConnectionMsg();
						break;
					
				}
											
				return _message;
			};	
			
			var _setTimeShare = function(a){
				var _time_elapsed = null;
				var _suffix = null;
				
				var _now = new Date();
					_now = _now.getTime();
				var _timestamp = a.item.timestamp;
								
				_time_elapsed = Math.ceil((_now - _timestamp) / 60000);
				_suffix = ' minute' + ((_time_elapsed > 1) ? 's' : '') + ' ago';
				
				if(_time_elapsed > 60){
					_time_elapsed = Math.ceil((_now - _timestamp) / 6000000);
					_suffix = ' hour' + ((_time_elapsed > 1) ? 's' : '') + ' ago';
				} 
				
				if(_time_elapsed > 24){
					var _day = 1000*60*60*24;
					_time_elapsed = Math.ceil((_now - _timestamp) / _day);
					_suffix = ' day' + ((_time_elapsed > 1) ? 's' : '') + ' ago';					
					
				}

				return _time_elapsed + _suffix;
			};
			
			var _directive = {
				'div.nu-item':{
					'update<-values':{
			  			'span.nu-person' : '#{update.updateContent.person.firstName} #{update.updateContent.person.lastName}',
			  			'img.nu-img@src' : function(arg){return _setPicture(arg);},
			  			'span.nu-status' : function(arg){return _setStatusMsg(arg);},
			  			'span.nu-time-share' : function(arg){return _setTimeShare(arg);},
			    	}
				}
			};				
			
			var _template = jQuery('#network-update').html();		
			jQuery('#nu-items').html(_template);
			jQuery('#nu-items').render(_network_updates, _directive);
		}
		
	};
	
	var _websheets = {
		oAuth : function(){
			var _auth_url = LinkedIn.request('get_auth_request_url', null);

	    	pokki.showWebSheet(_auth_url, 600, 425, function(_url){    		
	    		var _params = { url : _url};
	    		var _auth_response =  LinkedInPopup.message('parse_oauth_auth_response', _params); 
	    		
	    		console.log('web sheet called, ' + _auth_url);   		    		
	    		
	    		if(_auth_response){
	    			console.log('AUTH RESPONSE SUCCESS');    			
	    			console.log(_auth_response);
	    			
	    			if(LinkedIn.request('set_oauth_token_verifier', {token_verifier : _auth_response}))
	    				console.log('SET TOKEN VERIFIER');
	    			else
	    				console.log('FAILURE SETTING TOKEN VERIFIER');
	    			console.log(LinkedIn.request('get_oauth_token_verifier'));
	    			
	    			var _token_verifier = LinkedIn.request('get_oauth_token_verifier');
	    			
	    			if(_token_verifier){    				
	    				console.log('FOUND TOKEN VERIFIER');
	    				
	    				var _access_token_request_params = {
	    					callback : function(){
	    						// #TODO display indicator
	    						var _get_network_params = { 
	    							callback : function() {
	    								// #TODO hide indicator
	    								LinkedInPopup.message('publish_network_updates'); // #TODO make primary load call
	    								pokki.rpc('LinkedInBackground.message(\'poll_network_updates\')'); 
	    							}  
	    						};
	
	    						//LinkedIn.request('get_network_updates', _get_network_params); 
	    						pokki.rpc('LinkedInBackground.message(\'poll_network_updates\')'); 	// #TODO error line 13 link bg js    						  						
	    					}    					
	    				};    				
	    				
	    				LinkedIn.request('request_access_token', _access_token_request_params);
				    				   				
	    				pokki.hideWebSheet();
	    			}  			    		
	    			
	    			LinkedIn.request('request_access_token');
	    		}
	    		
	    		return true;
	    	});   			

		}		
	};
	
	return {
		message : function(property, params){
			switch(property){
				case 'parse_oauth_auth_response':
					return _util.parseOauthAuthResponse(params);
				case 'publish_network_updates':
					_dom.publishNetworkUpdates(params);
					break;	
				case 'load_oauth_websheet':
					_websheets.oAuth();	
					break;						
				default:
					console.log('LINKEDIN POPUP MESSAGE "' + property +  '" NOT DEFINED');
					break;		
			}
		}
	}
}();
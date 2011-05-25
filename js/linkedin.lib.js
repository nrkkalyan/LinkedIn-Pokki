/*
 * #TODO error handling: what do the linkedin JSON error message look like?
 * #TODO AJAX error handling
 * 
 */
var LinkedIn = function(){	
	var _getAPIKey = function(){
		return '';		
	};
	
	var _getSecretKey = function(){
		return ''; // #TODO (d)encrypt		
	};	

	var _oAuth = {			
		config : {
			request_token_api : 'https://api.linkedin.com/uas/oauth/requestToken',
			access_token_api : 'https://api.linkedin.com/uas/oauth/accessToken'
		},			
		requestToken : function(params){
			var _api_key = _getAPIKey();
			var _secret_key = _getSecretKey();
			
			var _accessor = {   
				token: null,   
				tokenSecret: null,   
				consumerKey : _api_key,   
				consumerSecret: _secret_key 
			};  
			
			var _message = {   
				action: this.config.request_token_api,   
				method: 'POST',   
				parameters: null 
			};  
			
			OAuth.completeRequest(_message, _accessor);         
			OAuth.SignatureMethod.sign(_message, _accessor);
			
			var _signature = OAuth.formEncode(_message.parameters);
						
			var _params = { // #TODO add error handling; at the public level???
				url : this.config.request_token_api,
				type : 'POST',
				data : _signature,
				success : function(response){
					console.log(unescape(response));
					
					var _token_response_values = UTIL.translate.queryStringToObj(response);					
					UTIL.local.json.set('oauth_request_token_response', _token_response_values);
					console.log(_token_response_values);
															
					if(params && params.callback && typeof params.callback === 'function')
						params.callback(response);									
				}								
			};
						
			UTIL.request(_params);					
		},
		requestAccessToken : function(params){
			console.log('requestAccessToken()->')
			
			var _api_key = _getAPIKey();
			var _secret_key = _getSecretKey();			
			var _request_token_response = UTIL.local.json.get('oauth_request_token_response');
			//console.log(_request_token_response);
			
			var _token_verfier = UTIL.local.json.get('oauth_token_verifier');
			//console.log(_token_verfier);			
			
			var _accessor = {   
				token: _request_token_response.oauth_token,   
				tokenSecret: _request_token_response.oauth_token_secret,   
				consumerKey : _api_key,   
				consumerSecret: _secret_key					
			};  
						
			var _message = {   
				action: this.config.access_token_api,   
				method: 'POST',   
				parameters: {
					oauth_token : _token_verfier.oauth_token,
					oauth_verifier : _token_verfier.oauth_verifier
				} 
			};
							
			OAuth.completeRequest(_message, _accessor);         
			OAuth.SignatureMethod.sign(_message, _accessor);
			
			var _signature = OAuth.formEncode(_message.parameters);
			
			//console.log(unescape(_signature));
										
			var _params = { // #TODO add error handling; at the public level???
				url : this.config.access_token_api,
				type : 'POST',
				data : _signature,
				success : function(response){
					console.log('success');
					console.log(unescape(response));
					
					var _token_response_values = UTIL.translate.queryStringToObj(response);					
										
					UTIL.local.json.set('oauth_access_token', _token_response_values);				
							
					if(params && params.callback && typeof params.callback === 'function')
						params.callback(response);									
				},
				error : function(XMLHttpRequest, textStatus, errorThrown){
					console.log(textStatus);
					console.log(XMLHttpRequest);
					console.log(errorThrown);					
				}
			};
								
			UTIL.request(_params);	
			
			console.log('END requestAccessToken()');
		},
		getAuthRequestURL : function(){
			var _request_token_response = UTIL.local.json.get('oauth_request_token_response');
			console.log(_request_token_response);
			
			if(_request_token_response.xoauth_request_auth_url && _request_token_response.oauth_token)
				return _request_token_response.xoauth_request_auth_url + '?oauth_token=' + _request_token_response.oauth_token;								
			else
				return false;			
		},
		setTokenVerifier : function(params){
			console.log('setOauthTokenVerfier()->');
			
			if(params.token_verifier){
				console.log('SETTING ACCESS TOKEN...');
				UTIL.local.json.set('oauth_token_verifier', params.token_verifier);
				return true;
			} else {
				return false;
			}			
		},
		getTokenVerifier : function(){
			return UTIL.local.json.get('oauth_token_verifier');
		},
		getAccessToken : function(){
			return UTIL.local.json.get('oauth_access_token');
		}		
	};	
	
	var _api = {
		config : {
			network : {
				updates : {
					url : 'http://api.linkedin.com/v1/people/~/network/updates',
					name : 'network_updates'
					
				}
			}
		
		},
		construct : function(url){			
			var _url = url;
			//format=json&
			return _url;
		},
		request : function(api_url, api_type, callback){
			console.log('request()->');
			var _access_token = UTIL.local.json.get('oauth_access_token');
			var _api_key = _getAPIKey();
			var _secret_key = _getSecretKey();				
			var _accessor = {   
				token: _access_token.oauth_token,   
				tokenSecret: _access_token.oauth_token_secret,   
				consumerKey : _api_key,   
				consumerSecret: _secret_key					
			};  
						
			var _message = {   
				action: api_url,   
				method: 'GET',   
				parameters: {
					format : 'json'
				} 
			};	
			
			OAuth.completeRequest(_message, _accessor);         
			OAuth.SignatureMethod.sign(_message, _accessor);
			
			var _signature = OAuth.formEncode(_message.parameters);	
			var _url = api_url + '?' + _signature;
			
			console.log('API CALL: ' + _url)

			var _params = {
					url : _url,
					cache : true,
					success : function(response){
						UTIL.local.json.set(api_type, response);
					
						if(callback && typeof callback === 'function')
							callback(response);									
					},
					error : function(XMLHttpRequest, textStatus, errorThrown){
						/*
						 * #TODO add error handling
						 * {
						 *	  "message": "[unauthorized]. The token used in the OAuth request is not valid. 83422330-7151-4008-867f-53045ffe32b5",
						 *	  "timestamp": 1305916219643,
						 *	  "status": 401,
						 *	  "errorCode": 0
						 *	}
						 */
						console.log(textStatus);
						console.log(XMLHttpRequest);
						console.log(errorThrown);					
					}								
				};
				
			UTIL.request(_params);			
		},
		network : {
			getUpdates : function(params){
				console.log('getUpdates()->');
				var _url = _api.config.network.updates.url;
				var _name = _api.config.network.updates.name;
				var _call = _api.construct(_url);
				
				console.log(_call);
				var _callback = (params && params.callback) ? params.callback : null;
				_api.request(_url, _name, _callback);	
				console.log('END getUpdates()');
			},
			getLocalUpdates : function() {
				return UTIL.local.json.get(_api.config.network.updates.name);
			}	
		}						
	};
	
	return {
		request : function(type, params){
			switch(type){
				case 'request_token': 
					_oAuth.requestToken(params);
					break;
				case 'request_access_token': 
					_oAuth.requestAccessToken(params);
					break;					
				case 'get_auth_request_url': 
					return _oAuth.getAuthRequestURL();
				case 'set_oauth_token_verifier':
					return _oAuth.setTokenVerifier(params);
				case 'get_oauth_token_verifier':
					return _oAuth.getTokenVerifier(params);
				case 'get_oauth_access_token':
					return _oAuth.getAccessToken();
				case 'get_network_updates': 
					_api.network.getUpdates(params);
					break;	
				case 'get_local_network_updates': 
					return _api.network.getLocalUpdates();												
				default:
					console.log('LINKEDIN REQUEST "' + type +  '" NOT DEFINED');
					break;	
			}				
		}		
	};		
}();
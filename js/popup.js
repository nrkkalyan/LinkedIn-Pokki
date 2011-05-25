// Add listener for when the page is unloaded
window.addEventListener('unload', onUnload, false);

function onUnload() {
    console.log('Pop-up page is being unloaded.');

	
	// Time to save any state
}

// Add listener for when the page is loaded
window.addEventListener('load', onLoad, false);

function onLoad() {
    if(!LinkedIn.request('get_oauth_access_token', null)){      	
    	LinkedInPopup.message('load_oauth_websheet'); 
    } else { // restore state
    	if(LinkedIn.request('get_local_network_updates'))
    		LinkedInPopup.message('publish_network_updates'); 
    }
}

pokki.addEventListener('popup_shown', function(){ // #TODO move to linkedin.popup.js with all state management
	pokki.rpc('LinkedInBackground.message(\'set_notification_count\', {count : 0});')
	pokki.removeIconBadge(); 		
});



























































   	/*
    	pokki.showWebSheet(_auth_url, 600, 425, function(_url){    		
    		var _params = { url : _url};
    		var _auth_response =  LinkedInPopup.message('parse_oauth_auth_response', _params);    		    		
    		
    		if(_auth_response){
    			console.log('AUTH RESPONSE SUCCESS');    			
    			console.log(_auth_response);
    			
    			if(LinkedIn.request('set_oauth_token_verifier', {token_verifier : _auth_response}))
    				console.log('SET TOKEN VERIFIER');
    			else
    				console.log('FAILURE SETTING TOKEN VERIFIER');
    			//console.log( 'ACCESS TOKEN: ' + LinkenInPopup.get('oauth_access_token', _params));
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
    								LinkedInPopup.message('publish_network_updates');
    							}  
    						};

    						LinkedIn.request('get_network_updates', _get_network_params);    						
    					}    					
    				};    				
    				
    				LinkedIn.request('request_access_token', _access_token_request_params);
    				
   					/*
    				var _params = {
    					callback : function(){    						
    						console.log(JSON.parse(window.localStorage.getItem('oauth_access_token')));
    						console.log('FOO')
    						var _get_network_params = {
    							callback : function(){
    								console.log('BAR');
    								LinkedInPopup.message('publish_network_updates');  
    							}
    						};
    						LinkedIn.request('get_network_updates', _get_network_params);
    					}    						
    				};
    				LinkedIn.request('get_oauth_access_token', _params);
    				*/
    				    				    				
    				//return true;
    			//}
    			    			    		
    			
    			//LinkedIn.request('request_access_token');
    			/*
    			if(LinkedIn.request('get_access_token')){
    				console.log('NETWORK SHARE');
    				LinkedIn.request('get_share_network');
    			}
    			
    			*/    			
    			
    			//return true;
    		//}
    		
    		//return false;
    	//});    	
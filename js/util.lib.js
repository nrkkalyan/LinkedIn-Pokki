var UTIL = UTIL || {};

UTIL.request = function(params){
	/*
	 * jQuery.ajax
	 * http://api.jquery.com/jQuery.ajax/
	 */
	jQuery.ajax({
		type: params.type || 'GET',
		url: params.url,
		async: params.async || true,
		data: params.data || null,
		cache: params.cache || false,
		contentType : params.content_type || 'application/x-www-form-urlencoded',
		context : params.context || null,
		dataType : params.data_type || null,
		global : params.global || true,
		ifModified : params.if_mod || false,
		jsonp : params.jsonp || null,
		jsonpCallback : params.jsonp_callback || null,
		password : params.password || null,
		processData : params.process_data || true,
		scriptCharset : params.charset || null,
		timeout : params.timeout || 15000,
		traditional : params.traditional || false,
		username : params.username || null,						
		/*
		WARNING: causes conflitcs with other parameters
		xhr : function(){
		if(params.xhr)
			params.xhr();
		},
		*/
		success: function(data, textStatus, XMLHttpRequest){			
			if(params.success)
				params.success(data);
		},			
		error: function(XMLHttpRequest, textStatus, errorThrown){			
			if(params.error)
				params.error(XMLHttpRequest, textStatus, errorThrown);
		},
		complete: function(XMLHttpRequest, textStatus){
			if(params.complete)
				params.complete(XMLHttpRequest, textStatus);	 			 
		},
		beforeSend: function(XMLHttpRequest){
			if(params.before)
				params.before(data);	 			 
		}
		/*, 	
		WARNING: causes conflicts with other parameters
		dataFilter: function(data, type){
			if(params.data_filter)
				params.data_filter(data);	 			 
		}	
		*/		
	}); // END jQuery.ajax	
};

UTIL.translate = {
	queryStringToObj : function(query){
		var _obj = {};
		var _query = unescape(query);
		console.log(query);
		var _query_name_values = _query.split('&');
		var _length = _query_name_values.length;		
		
		
		for(i=0; i<_length; i++){
			var _name_value = _query_name_values[i].split('=');
			_obj[_name_value[0]] = _name_value[1];
		}				
	
		console.log(_obj);
		
		return _obj;
	}	
}

UTIL.local = {
	json : {
		set : function(name, json){
			window.localStorage.setItem(name, JSON.stringify(json));	
		},
		get : function(name){
			return JSON.parse(window.localStorage.getItem(name));				
		}
	}	
}

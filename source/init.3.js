//------------------------------------------------------------------
$vm.init_v3=function(options){
	var callback=options.callback;
	$vm.vm={};
	$vm.edge=0;
	if(navigator.appVersion.indexOf('Edge')!=-1) $vm.edge=1;
	$vm.user="guest";
	$VmAPI.request({data:{cmd:'user_name',ip:$vm.ip},callback:function(res){
		if(res.user!==undefined){
			$vm.user=res.user;
			$vm.user_id=res.user_id;
			$vm.user_ip=res.user_ip;
		}
		if(callback!==undefined) callback(res);

		//------------------------------------------------------------------
		$vm.ip='';
		try{
			window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
			var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};
			pc.createDataChannel("");
			pc.createOffer(pc.setLocalDescription.bind(pc), noop);
			pc.onicecandidate = function(ice){
			   if(!ice || !ice.candidate || !ice.candidate.candidate)  return;
			   $vm.ip=/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
			   pc.onicecandidate = noop;
			   $VmAPI.request({data:{cmd:'user_ip',ip:$vm.ip,name:$vm.user},callback:function(res){}})
			   //-----------------------------------------------------
			};
		}catch(e){
			$VmAPI.request({data:{cmd:'user_ip',ip:'0.0.0.0',name:$vm.user},callback:function(res){}})
		}
		//------------------------------------------------------------------

	}})
	//-----------------------------------------------------
};
//------------------------------------------------------------------

//------------------------------------------------------------------
$vm.init2=function(options){
	if($vm.repository==undefined) $vm.repository="";
	$vm.set_category();
	var callback=options.callback;
	$vm.vm={};
	$vm.edge=0;
	if(navigator.appVersion.indexOf('Edge')!=-1) $vm.edge=1;
  	$("html").bind("ajaxStart", function(){
     		$(this).addClass('busy');
   	}).bind("ajaxStop", function(){
     		$(this).removeClass('busy');
   	});
	//-----------------------------------------------------
	$vm.user="guest";
	if(callback!==undefined) callback();
	//-----------------------------------------------------
};
//------------------------------------------------------------------

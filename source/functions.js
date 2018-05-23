$vm.set_dropdown_list_from_text=function($List,text){
    var txt=$("<div></div>").html(text).text();
    txt=txt.replace(/\r/g,'\n');
    txt=txt.replace(/\n\n/g,'\n');
    txt=txt.replace(/\n/g,',');
    txt=txt.replace(/,,/g,',');
    var lines=txt.split(',');
    $List.html('');
    for(var i=0;i<lines.length;i++){
        var line=lines[i];
        var items=line.split(';');
        var sel='';
        if(items[0].length>0 && items[0]=='*'){
            items[0]=items[0].replace('*','');
            sel='selected';
        }
        if(items.length==2)	$List.append(  $('<option '+sel+'></option>').val(items[1]).html(items[0])  );
        else			    $List.append(  $('<option '+sel+'></option>').val(items[0]).html(items[0])  );
    }
}
//---------------------------------------------
$vm.vm_password=function(length, special) {
    var iteration = 0;
    var password = "";
    var randomNumber;
    if(special == undefined){
        var special = false;
    }
    while(iteration < length){
        randomNumber = (Math.floor((Math.random() * 100)) % 94) + 33;
        if(!special){
            if ((randomNumber >=33) && (randomNumber <=47)) { continue; }
            if ((randomNumber >=58) && (randomNumber <=64)) { continue; }
            if ((randomNumber >=91) && (randomNumber <=96)) { continue; }
            if ((randomNumber >=123) && (randomNumber <=126)) { continue; }
        }
        iteration++;
        password += String.fromCharCode(randomNumber);
    }
    return password;
}
//---------------------------------------------
String.prototype.splitCSV = function(sep) {
  for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
    if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
      if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
        foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
      } else if (x) {
        foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
      } else foo = foo.shift().split(sep).concat(foo);
    } else foo[x].replace(/""/g, '"');
  } return foo;
}
//---------------------------------------------
$vm.check_and_clear_localstorage=function(){
    var data='';
    for(var key in window.localStorage){
        if(window.localStorage.hasOwnProperty(key)){
            data+=window.localStorage[key];
        }
    }
    if(data.length>3000000){
        localStorage.clear();
    }
}
//---------------------------------------------
$vm.today_ddmmyyyy=function(){
    today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    }
    if(mm<10){
        mm='0'+mm
    }
    today = dd+'/'+mm+'/'+yyyy;
    return today;
}
//---------------------------------------------
$.fn.mobile_menumaker = function(options) {
    var nav__ID = $(this), settings = $.extend({format: "dropdown",sticky: false}, options);
    return this.each(function() {
	$(this).find(".button").on('click', function(){
	    $(this).toggleClass('menu-opened');
	    var mainmenu = $(this).next('ul');
	    if (mainmenu.hasClass('open')) {
		mainmenu.slideToggle().removeClass('open');
	    }
	    else {
		mainmenu.slideToggle().addClass('open');
		if (settings.format === "dropdown") {
		    mainmenu.find('ul').show();
		}
	    }
	});
	nav__ID.find('li ul').parent().addClass('has-sub');
	multiTg = function() {
	    nav__ID.find(".has-sub").prepend('<span class="submenu-button"></span>');
	    nav__ID.find('.submenu-button').on('click', function() {
		$(this).toggleClass('submenu-opened');
		if ($(this).siblings('ul').hasClass('open')) {
		    $(this).siblings('ul').removeClass('open').slideToggle();
		}
		else {
		    $(this).siblings('ul').addClass('open').slideToggle();
		}
	    });
	};
	if (settings.format === 'multitoggle') multiTg();
	else nav__ID.addClass('dropdown');
	if (settings.sticky === true) nav__ID.css('position', 'fixed');
	var resizeFix = function() {
	    var mediasize = 900;
	    if ($( window ).width() > mediasize) {
		nav__ID.find('ul').show();
	    }
	    if ($(window).width() <= mediasize) {
		nav__ID.find('ul').hide().removeClass('open');
	    }
	};
	resizeFix();
	return $(window).on('resize', resizeFix);
    });
};
//--------------------------------------------------------
$vm.find_object=function(theObject, key, val){
	var result = null;
	if(theObject instanceof Array) {
		for(var i = 0; i < theObject.length; i++) {
			result = $vm.find_object(theObject[i], key, val);
			if (result) {
				break;
			}
		}
	}
	else
	{
		for(var prop in theObject) {
			if(prop == key) {
				if(theObject[prop] == val) {
					return theObject;
				}
			}
			if(theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
				result = $vm.find_object(theObject[prop], key, val);
				if (result) {
					break;
				}
			}
		}
	}
	return result;
}
//--------------------------------------------------------
$vm.text=function(txt){
	return $('<div></div>').html(txt).text();
}
//--------------------------------------------------------
$vm.status_of_data=function(data){
    var N1=0,N2=0;
    for(key in data){
        N2++;
        if(data[key]=='') N1++;
    }
    var status="#FFCC00";
    if(N1==N2) 		    status='#FF0000';
    else if(N1==0)  	status='#00FF00';
    return status;
}
//--------------------------------------------------------

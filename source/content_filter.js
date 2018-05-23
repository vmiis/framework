//--------------------------------------------------------
$vm.is_valid_url=function(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)   return false;
    else              return true;
}
//--------------------------------------------------------
$vm.css_process=function(css_txt1,allowed_css){
    var css_txt=css_txt1.replace(/\r/g,'').replace(/\n/g,'');
    var txt="";
    var a=css_txt.split('}');
    for(var i=0; i<a.length; i++){
        var b=a[i].split('{');
        if(b.length==2){
            txt+=b[0].trim()+'{\r\n';
            var c=b[1].split(';');
            for(var j=0;j<c.length;j++){
                    var d=c[j].split(':');
                    if(d.length==2){
                        if(allowed_css.includes(d[0].trim())==true){
                            txt+="    "+d[0].trim()+":"+d[1].trim()+";\r\n";
                        }
                    }
            }
            txt+='}\r\n';
        }
    }
    return txt;
}
//--------------------------------------------------------
$vm.content_filter=function(content,allowed_tags,allowed_attrs,allowed_css){
    //--------------------------------------------------------
    var $dom=$("<div></div>").html(content);
    var style_txt="";
    var tags=$dom.find("*");
    tags.each(function(){
        var tag=$(this).prop('tagName').toLowerCase();
        if(allowed_tags.includes(tag)==false){
            if(tag=='style'){
                style_txt+=$(this).text().toLowerCase()+"\r\n";
            }
            $dom.find( this ).remove();
        }
        else{
            var element=$(this);
            $.each(this.attributes, function(i, attrib){
                if(attrib!=undefined){
                    var name = attrib.name.toLowerCase();
                    if(allowed_attrs.includes(name)==false){
                        element.removeAttr(name);
                    }
                    else{
                        var value=attrib.value;
                        if(name=='src' || name=='href'){
                            if($vm.is_valid_url(value)==false) element.removeAttr(name);
                        }
                        else if(name=='style'){
                            var av=('@@@{'+attrib.value+'}');
                            attrib.value=$vm.css_process(av,allowed_css).replace('@@@{','').replace('}','').replace(/\r/g,'').replace(/\n/g,'');
                        }
                    }
                }
            });
        }
    })
    style_txt=$vm.css_process(style_txt,allowed_css);
    return $dom.html()+"\r\n<sty"+"le>"+style_txt+"</sty"+"le>";
}
//--------------------------------------------------------

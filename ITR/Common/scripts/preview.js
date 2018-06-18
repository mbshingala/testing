function pageSetup(){
	showHideAll('.content','block');
	showHideAll('.tabs','none');
	
        showHideAll('#leftMenu','none');
	
        showHideAll('#rightMenu','none');
	
        showHideAll('.addbtn','none');
        
        showHideAll('.homeIndex','none');
        
}

function showHideAll(className,toggle){
    try{
    var type=className.charAt(0);
    className=className.substring(1);
    var content;
    if(type=='.'){
    //content = document.getElementsByClassName(className); 
    //Fix for IE9 preview issue
    content=document.querySelectorAll((' ' + className).replace(/ +/g, '.'));
    for(i=0;i<content.length;i++) {
            content[i].style.display=toggle;
        }
    }else if(type=='#'){
        content = document.getElementById(className); 
        content.style.display=toggle;
    }
    }catch(e){}
}



pageSetup();
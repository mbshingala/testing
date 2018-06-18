var fileModifid = false;
function onlyNumbersChars(e) {
	
	fileModified();
	
	var keynum;

	if (e.keyCode == 13 ||e.which == 13 ) {
		return true;
	}

	if (e.keyCode == 9 ||e.which == 9 ) {
		return true;
	}
	if (e.which == 0 ) {
		return true;
	}

	if (e.keyCode == 8 ||e.which == 8 ) {
		return true;
	}

	if (e.keyCode == 32 ||e.which == 32) {
		return false;
	}

	if (window.event) // IE
	{
		keynum = e.keyCode;
	} else if (e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which;
	}

	if (checkNumber(keynum) || checkAlphabet(keynum)) {
		return true; 
	}

	return false;
}

function onlyChars(e) {
	
	fileModified();

	var keynum;

	if (e.keyCode == 13 ||e.which == 13 ) {
		return true;
	}

	if (e.which == 0 ) {
		return true;
	}

	if (e.keyCode == 9 ||e.which == 9 ) {
		return true;
	}

	if (e.keyCode == 8 ||e.which == 8 ) {
		return true;
	}

	if (e.keyCode == 32 ||e.which == 32) {
		return false;
	}

	if (window.event) // IE
	{
		keynum = e.keyCode;
	} else if (e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which;
	}

	if (!checkAlphabet(keynum)) {
		return false; 
	}
	return true;

}

function onlyPercent(e) {
	
	fileModified();
	
	var keynum;

if (e.keyCode == 13 ||e.which == 13 ) {
	return true;
}

if (e.keyCode == 46 ||e.which == 46 ) {
	return true;
}

if (e.which == 0 ) {
	return true;
}

if (e.keyCode == 9 ||e.which == 9 ) {
	return true;
}

if (e.keyCode == 8 ||e.which == 8 ) {
	return true;
}

if (e.keyCode == 32 ||e.which == 32) {
	return false;
}

if (window.event) // IE
{
	keynum = e.keyCode;
} else if (e.which) // Netscape/Firefox/Opera
{
	keynum = e.which;
}

if (!checkNumber(keynum)) {
	return false; 
}
return true;

}

function onlyAsstYear(e) {
	
	fileModified();
	
	var keynum;

if (e.keyCode == 13 ||e.which == 13 ) {
	return true;
}

if (e.keyCode == 45 ||e.which == 45 ) {
	return true;
}

if (e.which == 0 ) {
	return true;
}

if (e.keyCode == 9 ||e.which == 9 ) {
	return true;
}

if (e.keyCode == 8 ||e.which == 8 ) {
	return true;
}

if (e.keyCode == 32 ||e.which == 32) {
	return false;
}

if (window.event) // IE
{
	keynum = e.keyCode;
} else if (e.which) // Netscape/Firefox/Opera
{
	keynum = e.which;
}

if (!checkNumber(keynum)) {
	return false; 
}
return true;

}


function onlyNumbers(e) {
	
	fileModified();
	
		var keynum;

	if (e.keyCode == 13 ||e.which == 13 ) {
		return true;
	}

	if (e.which == 0 ) {
		return true;
	}

	if (e.keyCode == 9 ||e.which == 9 ) {
		return true;
	}

	if (e.keyCode == 8 ||e.which == 8 ) {
		return true;
	}

	if (e.keyCode == 32 ||e.which == 32) {
		return false;
	}

	if (window.event) // IE
	{
		keynum = e.keyCode;
	} else if (e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which;
	}

	if (!checkNumber(keynum)) {
		return false; 
	}
	return true;

}

function onlyNegativeNumbers(e) {
	
	fileModified();

		if(e.target.value!='' && e.target.value.length > 1 && e.target.value.charAt(0)!='-' && e.target.originalLength){
			e.target.maxLength = e.target.originalLength;
		}	
	
		var keynum;
		
	if(e.target.value.charAt(0) !='-'){
		e.target.maxLength = parseInt(14, 10);
	
	}else{
		e.target.maxLength = parseInt(15, 10);
		
	}	
		
	if (e.keyCode == 13 ||e.which == 13 ) {
		return true;
	}
	
	if (e.which == 0 ) {
		return true;
	}

	if (e.keyCode == 9 ||e.which == 9 ) {
		return true;
	}

	if (e.keyCode == 8 ||e.which == 8 ) {
		return true;
	}

	if (e.keyCode == 32 ||e.which == 32) {
		return false;
	}

	if (e.keyCode == 45 ||e.which == 45) {
		if(e.target.originalLength){
			e.target.maxLength = parseInt(e.target.originalLength, 10) + parseInt(1, 10);
		}else{
			e.target.originalLength = e.target.maxLength;
			e.target.maxLength = parseInt(e.target.originalLength, 10) + parseInt(1, 10);		
		}
		return true;
	}


	if (window.event) // IE
	{
		keynum = e.keyCode;
	} else if (e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which;
	}

	if (!checkNumber(keynum)) {
		return false; 
	}
	return true;

}

function onlyDate(e) {
	
	fileModified();
	
	var keynum;

	if (e.keyCode == 13 ||e.which == 13 ) {
		return true;
	}


	if (e.keyCode == 9 ||e.which == 9 ) {
		return true;
	}

	if (e.keyCode == 8 ||e.which == 8 ) {
		return true;
	}

	if (e.keyCode == 32 ||e.which == 32) {
		return false;
	}

	
	if (e.keyCode == 47 ||e.which == 47) {
		return true;
	}

	if (window.event) // IE
	{
		keynum = e.keyCode;
	} else if (e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which;
	}

	if (!checkNumber(keynum)) {
		return false; 
	}
	return true;
}

// '.&  Only Allowed

/*
. -- 46
' -- 39 
& -- 38 
, -- 44
# -- 35 
- -- 45
/ -- 47
*/


function disableBackSpace(e)
{
if (e.keyCode == 8||e.which == 8) {
		return false;
	}
	else{
	return true;
}

}




function onlyName(e){

onlyMidName(e);

/*	var keynum;
	
	if (e.keyCode == 13 ||e.which == 13 ) {
		return true;
	}
	
	if (e.which == 0 ) {
		return true;
	}


	if (e.keyCode == 46 ||e.which == 46 ) {
		return true;
	}

	if (e.keyCode == 9 ||e.which == 9 ) {
		return true;
	}

	if (e.keyCode == 38 ||e.which == 38 ) {
		return true;
	}


	if (e.keyCode == 183 ||e.which == 183 ) {
		return true;
	}

	if (e.keyCode == 39 ||e.which == 39 ) {
		return true;
	}


	if (e.keyCode == 8 ||e.which == 8 ) {
		return true;
	}

	if (e.keyCode == 32 ||e.which == 32) {
		return true;
	}

	if (window.event) // IE
	{
		keynum = e.keyCode;
	} else if (e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which;
	}

	if (checkNumber(keynum) || checkAlphabet(keynum)) {
		return true; 
	}

	return false; */
	
}

// Only Allowed Special Chars ' , . & # - / 
/*
	. -- 46
	' -- 39 
	& -- 38 
	, -- 44
	# -- 35 
	- -- 45
	/ -- 47
	( -- 40
	) -- 41
*/

function onlyAddress(e){
	
	fileModified();
	
		var keynum;
	
	if (e.keyCode == 13 ||e.which == 13 ) {
		return true;
	}
	
	if (e.which == 0 ) {
		return true;
	}

	if (e.keyCode == 9 ||e.which == 9 ) {
		return true;
	}
	
	if (e.keyCode == 183 ||e.which == 183 ) {
		return true;
	}

	if (e.keyCode == 39 ||e.which == 39 ) {
		return true;
	}

	if (e.keyCode == 44 ||e.which == 44 ) {
		return true;
	}

	if (e.keyCode == 46 ||e.which == 46 ) {
		return true;
	}

	if (e.keyCode == 38 ||e.which == 38 ) {
		return true;
	}

	if (e.keyCode == 35 ||e.which == 35 ) {
		return true;
	}

	if (e.keyCode == 45 ||e.which == 45 ) {
		return true;
	}

	if (e.keyCode == 47 ||e.which == 47 ) {
		return true;
	}


	if (e.keyCode == 8 ||e.which == 8 ) {
		return true;
	}

	if (e.keyCode == 32 ||e.which == 32) {
		return true;
	}

	if (e.keyCode == 40 ||e.which == 40 ) {
		return true;
	}

	if (e.keyCode == 41 ||e.which == 41) {
		return true;
	}
	
	if (window.event) // IE
	{
		keynum = e.keyCode;
	} else if (e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which;
	}

	if (checkNumber(keynum) || checkAlphabet(keynum)) {
		return true; 
	}

	return false;

}


function checkNumber (keynum) {

	fileModified();
	
	if (!(keynum >= 48 && keynum <= 57 )) {
		return false;
	}
	else {
		return true;
	}

}


function checkAlphabet (keynum) {
	
	fileModified();

	if (!(keynum >= 65 && keynum <= 90 ) && !(keynum >= 97 && keynum <= 122 )) {
		return false;
	}
	else {
		return true;
	}

}

function onlyEmailId (e) {
	
	fileModified();

	var keynum;

	if (e.keyCode == 13 ||e.which == 13 ) {
		return true;
	}
	
	if (e.which == 0 ) {
		return true;
	}

	if (e.keyCode == 8 ||e.which == 8 ) {
		return true;
	}
	if (e.keyCode == 46 ||e.which == 46 ) {
		return true;
	}
	
	if (e.keyCode == 9 ||e.which == 9 ) {
		return true;
	}
	if (e.keyCode == 11||e.which == 11) {
		return true;
	}


	if (e.keyCode == 95 ||e.which == 95 ) {
		return true;
	}

	if (e.keyCode == 64 ||e.which == 64 ) {
		return true;
	}

	if (window.event) // IE
	{
		keynum = e.keyCode;
	} else if (e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which;
	}

	if (checkNumber(keynum) || checkAlphabet(keynum)) {
		return true; 
	}

	return false;
}

function onlyMidName(e){

	fileModified();
		
	var keynum;

	if (e.keyCode == 13 ||e.which == 13 ) {
		return true;
	}
	
	if (e.which == 0 ) {
		return true;
	}


	if (e.keyCode == 46 ||e.which == 46 ) {
		return true;
	}

	if (e.keyCode == 9 ||e.which == 9 ) {
		return true;
	}

	if (e.keyCode == 38 ||e.which == 38 ) {
		return true;
	}


	if (e.keyCode == 183 ||e.which == 183 ) {
		return true;
	}

	if (e.keyCode == 39 ||e.which == 39 ) {
		return true;
	}


	if (e.keyCode == 8 ||e.which == 8 ) {
		return true;
	}

	if (e.keyCode == 32 ||e.which == 32) {
		return true;
	}

	if (window.event) // IE
	{
		keynum = e.keyCode;
	} else if (e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which;
	}

	if (checkNumber(keynum) || checkAlphabet(keynum)) {
		return true; 
	}

	return false;
	
}

function onlyVerificationFullName(name){
	
	fileModified();

	var test_result=false;

	if(name.value !==null) {
		test_result = /^\w(?:\w+|([.\x20])(?!\1))+\s*$/.test(name.value);
	}
	
	if(name.value !==null && test_result == true) {
		var check = /^[0-9\040]*$/.test(name.value);
		if(check == true){
			test_result = false;
		}
	}
	
	if(test_result == false){
		alert('Please enter Name in correct format');

	}
}

function onlyTanName(e){
	
	fileModified();

	var keynum;

	if (e.keyCode == 13 ||e.which == 13 ) {
		return true;
	}
	
	if (e.which == 0 ) {
		return true;
	}

	if (e.keyCode == 46 ||e.which == 46 ) {
		return true;
	}

	if (e.keyCode == 9 ||e.which == 9 ) {
		return true;
	}

	if (e.keyCode == 38 ||e.which == 38 ) {
		return true;
	}


	if (e.keyCode == 183 ||e.which == 183 ) {
		return true;
	}

	if (e.keyCode == 39 ||e.which == 39 ) {
		return true;
	}


	if (e.keyCode == 8 ||e.which == 8 ) {
		return true;
	}

	if (e.keyCode == 32 ||e.which == 32) {
		return true;
	}
	
	if (e.keyCode == 45 ||e.which == 45) {
		return true;
	}

	if (window.event) // IE
	{
		keynum = e.keyCode;
	} else if (e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which;
	}

	if (checkNumber(keynum) || checkAlphabet(keynum)) {
		return true; 
	}

	return false;
	
}

function onlyOrgName(e){
	
	fileModified();
	
	var keynum;

	if (e.keyCode == 13 ||e.which == 13 ) {
		return true;
	}
	
	if (e.which == 0 ) {
		return true;
	}


	if (e.keyCode == 46 ||e.which == 46 ) {
		return true;
	}

	if (e.keyCode == 9 ||e.which == 9 ) {
		return true;
	}

	if (e.keyCode == 38 ||e.which == 38 ) {
		return true;
	}


	if (e.keyCode == 183 ||e.which == 183 ) {
		return true;
	}

	if (e.keyCode == 39 ||e.which == 39 ) {
		return true;
	}


	if (e.keyCode == 8 ||e.which == 8 ) {
		return true;
	}

	if (e.keyCode == 32 ||e.which == 32) {
		return true;
	}
	
	if (e.keyCode == 45 ||e.which == 45) {
		return true;
	}
	

	if (e.keyCode == 35 ||e.which == 35) {
		return true;
	}
	if (e.keyCode == 95 ||e.which == 95) {
		return true;
	}
	if (e.keyCode == 40 ||e.which == 40) {
		return true;
	}
	if (e.keyCode == 41 ||e.which == 41) {
		return true;
	}	
	if (e.keyCode == 123 ||e.which == 123) {
		return true;
	}
	if (e.keyCode == 125 ||e.which == 125) {
		return true;
	}
	if (e.keyCode == 91 ||e.which == 91) {
		return true;
	}
	if (e.keyCode == 93 ||e.which == 93) {
		return true;
	}
	if (e.keyCode == 43 ||e.which == 43) {
		return true;
	}
	if (e.keyCode == 64 ||e.which == 64) {
		return true;
	}
	if (e.keyCode == 44 ||e.which == 44) {
		return true;
	}
	if (e.keyCode == 47 ||e.which == 47) {
		return true;
	}
	if (window.event) // IE
	{
		keynum = e.keyCode;
	} else if (e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which;
	}

	if (checkNumber(keynum) || checkAlphabet(keynum)) {
		return true; 
	}

	return false;
	
}

function onlyDesignation(e){

	fileModified();
	var keynum;
	
	if (e.keyCode == 13 ||e.which == 13 ) {
		return true;
	}

	if (e.which == 0 ) {
		return true;
	}

	if (e.keyCode == 46 ||e.which == 46 ) {
		return true;
	}

	if (e.keyCode == 9 ||e.which == 9 ) {
		return true;
	}

	if (e.keyCode == 38 ||e.which == 38 ) {
		return true;
	}


	if (e.keyCode == 183 ||e.which == 183 ) {
		return true;
	}

	if (e.keyCode == 8 ||e.which == 8 ) {
		return true;
	}

	if (e.keyCode == 32 ||e.which == 32) {
		return true;
	}
	
	if (e.keyCode == 45 ||e.which == 45) {
		return true;
	}
	if (e.keyCode == 40 ||e.which == 40) {
		return true;
	}
	if (e.keyCode == 41 ||e.which == 41) {
		return true;
	}
	if (e.keyCode == 44 ||e.which == 44) {
		return true;
	}
	if (e.keyCode == 47 ||e.which == 47) {
		return true;
	}
	if (window.event) // IE
	{
		keynum = e.keyCode;
	} else if (e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which;
	}

	if (checkNumber(keynum) || checkAlphabet(keynum)) {
		return true; 
	}

	return false;
	
}

function restrictMaxLength(e)
{
	fileModified();
	
	var field = document.getElementById("issue").value;  
	var keynum;
	

	if (window.event) // IE
	{
		keynum = e.keyCode;
	} else if (e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which;
		
	}
			
      if(field.length >= 250) {
    	  
    	  if (e.keyCode == 9 ||e.which == 9 ) {
    			return true;
    		}
    	  else if (e.which == 0 ) {
    			return true;
    		}

    	  else if (e.keyCode == 8 ||e.which == 8 ) {
    			return true;
    		}
    	  else {
    		  return false;
    	  }    		   		

      }
}

function disableEnter(e){

	var keynum;
	
	if (e.keyCode == 13 ||e.which == 13 ) {
		return true;
	}

	return false;
}

function restrictMaxLengthTextField(e,field,len)
{
	fileModified();
	
	if(textFieldRequiredKeys(e)){
		
		return true;
		}
      if(field.value.length >= len){

		return false;
		
      }else{
		return true;
	  }
	 
}

function textFieldRequiredKeys(e){

	fileModified();

	var keynum;

	if (window.event) // IE
	{
		keynum = e.keyCode;
	} else if (e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which;
		
	}

		 if (e.keyCode == 9 ||e.which == 9 ) {
    			return true;
    		}

		 if (e.keyCode == 8 ||e.which == 8 ) {
    			return true;
    		}
			  if (e.keyCode == 46 ||e.which == 46 ) {
    			return true;
    		}
			
			

			  if (e.keyCode == 40 ||e.which == 40 ) {
    			return true;
    		}

			  if (e.keyCode == 38 ||e.which == 38 ) {
    			return true;
    		}
			  if (e.keyCode == 39 ||e.which == 39 ) {
    			return true;
    		}
			  if (e.keyCode == 37 ||e.which == 37 ) {
    			return true;
    		}
			 if (e.keyCode == 13 ||e.which == 13 ) {
    			return true;
    		}
			return false;

}

function onlyBankAccNo(e){
	fileModified();
var keynum;
if (e.keyCode == 13 ||e.which == 13 ) {
return true;
}
if (e.which == 0 ) {
return true;
}
if (e.keyCode == 9 ||e.which == 9 ) {
return true;
}
if (e.keyCode == 47 ||e.which == 47 ) {
return true;
}
if (e.keyCode == 45 ||e.which == 45 ) {
return true;
}
if (e.keyCode == 8 ||e.which == 8 ) {
return true;
}
/*if (e.keyCode == 32 ||e.which == 32) {
return true;
}*/
if (window.event) // IE
{
keynum = e.keyCode;
} else if (e.which) // Netscape/Firefox/Opera
{
keynum = e.which;
}
if (checkNumber(keynum) || checkAlphabet(keynum)) {
return true;
}
return false;
} 

function onlyLLPIN(e) {
	
	fileModified();
	
	var keynum;

	if (e.keyCode == 13 ||e.which == 13 ) {
		return true;
	}

	if (e.keyCode == 9 ||e.which == 9 ) {
		return true;
	}
	if (e.which == 0 ) {
		return true;
	}

	if (e.keyCode == 8 ||e.which == 8 ) {
		return true;
	}

	if (e.keyCode == 32 ||e.which == 32) {
		return false;
	}
	if (e.keyCode == 45 ||e.which == 45 ) {
		return true;
		}
	if (window.event) // IE
	{
		keynum = e.keyCode;
	} else if (e.which) // Netscape/Firefox/Opera
	{
		keynum = e.which;
	}

	if (checkNumber(keynum) || checkAlphabet(keynum)) {
		return true; 
	}

	return false;
}

function fileModified() {
	fileModifid = true;
}

function setFileModifiedFalse() {
	fileModifid = false;
}
 


function onlyAlphaNumericWithoutSpace(e)
{
	fileModified();
	
	var keynum;
	
	if (e.keyCode == 32 ||e.which == 32) {
		return false;
	}
	onlyMidName(e);

}

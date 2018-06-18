	$(".date_dummy_black").datepicker({

			changeMonth : true,
			changeYear : true,
			yearRange: "-100:+5",
			dateFormat : "dd/mm/yy",
			buttonText : "Choose",
			showOtherMonths : true,
			selectOtherMonths : true
		});
		
function validateField_userName(field) {
	
	var errors = false;
	var continueValidation = true;
	var row = (field.type != null) ? field : field[0];
	if (continueValidation
			&& (row.value != null)
			&& ((row.value == '') || (row.value.replace(/^\s+|\s+$/g, '').length == 0))) {
		var error = "Please enter the User ID.";
		addError(row, error);
		errors = true;
		continueValidation = false;
	}
	if (continueValidation && field.value != null) {
		var value = field.value;
		if ((7 > -1 && value.length < 7) || (10 > -1 && value.length > 10)) {
			var error = "Invalid User ID. Please retry.";
			addError(field, error);
			errors = true;
			continueValidation = false;
		}
	}
	var row = (field.type != null) ? field : field[0];
	if (continueValidation
			&& row.value != null
			&& !row.value
					.match("^[A-Za-z]{3}[JjLlBbTtAaCcFfHhPpGg]{1}[A-Za-z]{1}[0-9]{4}[A-Za-z]{1}$|^[Ee][Rr][Ii][UuAaTt][0-9]{6}$|^[Ii][Tt][Dd][Uu][0-9]{6}$|^[Hh][Dd][Ss][Kk][0-9]{6}$|^[Aa][Rr][Cc][Aa][0-9]{6}$|^[Nn][Ss][Dd][Ll][0-9]{6}$|^[Ee][Xx][Tt][Aa][0-9]{6}$|^[A-Za-z]{4}[0-9]{5}[A-Za-z]{1}$|^[Tt][Ff][Cc][Aa][0-9]{6}$|^[Tt][Ff][Cc][uU][0-9]{6}$")) {
		var error = "Invalid User ID. Please retry.";
		addError(row, error);
		errors = true;
		continueValidation = false;
	}
	return !errors;
}

function validateField_password(field) {
	
	var errors = false;
	var continueValidation = true;
	var row = (field.type != null) ? field : field[0];
	if (continueValidation
			&& (row.value != null)
			&& ((row.value == '') || (row.value.replace(/^\s+|\s+$/g, '').length == 0))) {
		var error = "Please enter a Password.";
		addError(row, error);
		errors = true;
		continueValidation = false;
	}
	if (continueValidation && field.value != null) {
		var value = field.value;
		if ((8 > -1 && value.length < 8) || (14 > -1 && value.length > 14)) {
			var error = "Invalid Password. Please retry.";
			addError(field, error);
			errors = true;
			continueValidation = false;
		}
	}
	return !errors;
}
function validateField_dob(field) {
	var errors = false;
	var continueValidation = true;
	if (continueValidation && (field.value != null) && !checkDate(field.value)) {
		var error = "Incorrect Date of Birth/Incorporation. Please retry.";
		addError(field, error);
		errors = true;
		continueValidation = false;
	}
	return !errors;
}		
function enableFields(val){
	if(!val){
	document.getElementById('step2Id').style.display="none";
	
			document.getElementsByName('validate')[0].value="Validate XML";
			
	}else{
			document.getElementById('step2Id').style.display="block";
			if(document.getElementsByName('itrName')[0].value!='ITR-1' && document.getElementsByName('itrName')[0].value!='ITR-2'){
				$('.sec44AB').show();
			}else{
				$('.sec44AB').hide();
			}
			document.getElementsByName('validate')[0].value="Submit ITR";
			
	}
	
}		
enableFields(false);

function validateField_dscFlag(field){
	var errors = false;
	if(!field[0].checked && !field[1].checked){
		var error = "Please select 'Do you want to digitally sign?'";
		addError(document.getElementsByName('dscFlag')[0], error);
		errors = true;
	}
	return !errors;
}



function validateField_dscTypeFlag(field){
	var errors = false;
	if(document.getElementsByName('dscFlag')[0].checked)
	if(!field[0].checked && !field[1].checked){
		var error = "Please select the type of Digital Signature Certificate.";
		addError(document.getElementsByName('typeOfDsc')[0], error);
		errors = true;
	}
	return !errors;
}

function validateField_keyStoreFile(field){
	var errors = false;
	
	if(document.getElementsByName('typeOfDsc')[0].checked){
		var len=document.getElementById('pfxVal').innerHTML.length;
		if(len==0){
			var error="Please select your certificate keystore file(.PFX/.P12).";
			addError(document.getElementsByName('keystoreFile')[0], error);
			errors = true;
		}
	}
	return !errors;
}
function validateField_keyStoreFilePass(field){
	var errors = false;
	
	if(document.getElementsByName('typeOfDsc')[0].checked){
		var len=document.getElementsByName('keystoreKey')[0].value.length;
		if(len==0){
			var error="Please enter the password for your private key.";
			addError(document.getElementsByName('keystoreKey')[0], error);
			errors = true;
		}
	}
	return !errors;
}




function validateOnSubmit(){
	var errors = true;
	try{
	var form=document.forms[0];
	errors = validateField_keyStoreFilePass(form.elements['keystoreKey']) && errors;
	errors = validateField_keyStoreFile(form.elements['keystoreFile']) && errors;
	errors = validateField_dscTypeFlag(form.elements['typeOfDsc']) && errors;
	errors = validateField_dscFlag(form.elements['dscFlag']) && errors;
	errors = validateField_dob(form.elements['dob']) && errors;
	errors = validateField_password(form.elements['password']) && errors;
	errors = validateField_userName(form.elements['userId']) && errors;	
	
	}catch(e){
		alert(e);
		errors=false;
	}
	return errors;
}

function validateXml(field){
if(field.value=='Validate XML'){
	webUtil.validateXml();
	}else if(field.value=='Submit ITR'){
		
		if(validateOnSubmit()){
			createXml();
		}
	}

}

function setITRFile(file){
document.getElementById('fileVal').innerHTML=file;
}
function setValuesWS(vals){
	var values=vals.split(',');
	document.getElementsByName('asstYear')[0].value=values[0];
	document.getElementsByName('itrName')[0].value=values[1];
	document.getElementsByName('verPan')[0].value=values[2];
	document.getElementsByName('dob')[0].value=values[3];
	document.getElementsByName('userPan')[0].value=values[4];
}

function setEmpty(){
	document.getElementById('fileVal').innerHTML='';
	document.getElementsByName('asstYear')[0].value='';
	document.getElementsByName('itrName')[0].value='';
	document.getElementsByName('verPan')[0].value='';
	document.getElementsByName('dob')[0].value='';
	document.getElementsByName('userPan')[0].value='';
	
	$('#schemaError').hide();
	enableFields(false);
}
function setSchemaErrors(){
	var errors=webUtil.getSchemaErrors();
	document.getElementById('schemaError').innerHTML=errors;
}


function enableDscSign(){
	var dsc=document.getElementsByName('dscFlag');
	if(dsc[0].checked){
		$('.typeDsc').show();
	}else{
		$('.typeDsc').hide();
		$('.typeDsc2').hide();
		uncheck('typeOfDsc');
	}
}
function enableDscType(){
	var dscType=document.getElementsByName('dscFlag');
	if(dscType[0].checked){
		$('.typeDsc2').show();
	}else{
		$('.typeDsc2').hide();
	}
}
$('.typeDsc').hide();
$('.typeDsc2').hide();
$('.typeDsc0').hide();
function createXml(){
		
	webUtil.setUserId(document.getElementsByName('userId')[0].value);
	webUtil.setPassword(document.getElementsByName('password')[0].value);
	webUtil.setDob(document.getElementsByName('dob')[0].value);
	
	if(document.getElementsByName('dscFlag')[0].checked){
		webUtil.setDscFlag(document.getElementsByName('dscFlag')[0].value);
	}else{
		webUtil.setDscFlag(document.getElementsByName('dscFlag')[1].value);
	}
	
	webUtil.setItr(document.getElementsByName('itrName')[0].value);
	webUtil.setAsstYear(document.getElementsByName('asstYear')[0].value);
	webUtil.setPan(document.getElementsByName('userPan')[0].value);
	webUtil.setVerifPan(document.getElementsByName('verPan')[0].value);
	if(document.getElementsByName('section44AB')[0].checked){
		webUtil.setSection44AB('Y');
	}else{
		webUtil.setSection44AB('N');	
	}
	
	webUtil.submitITR();
}
function showResults(ackNo,transactionId,emailId){
	document.getElementsByName('ackNo')[0].value=ackNo;
	document.getElementById('resultsDiv').style.display="block";
	document.getElementById('resultsDiv').focus();
	document.getElementById('submitItr').style.display="none";
	document.getElementById('schemaError').innerHTML='';
	if(document.getElementsByName('dscFlag')[0].checked){
		document.getElementById('withDsc').style.display="block";
		document.getElementById('withoutDsc').style.display="none";
		document.getElementById('res_dsc_emailId_span').innerHTML=emailId;
		document.getElementById('res_dsc_transactionId_span').innerHTML=transactionId;
	}else{
		document.getElementById('withDsc').style.display="none";
		document.getElementById('withoutDsc').style.display="block";
		document.getElementById('res_emailId_span').innerHTML=emailId;
		document.getElementById('res_transactionId_span').innerHTML=transactionId;
	}
}
function toUpper(field){
	field.value=field.value.toUpperCase();
}
function uncheck(field){
	document.getElementsByName(field)[0].checked=false;
	document.getElementsByName(field)[1].checked=false;
}
function backToSubmitItr(){
	document.getElementById('resultsDiv').style.display="none";
	document.getElementById('submitItr').style.display="block";
}
function downloadItrV(){
	
	webUtil.setITRVUserId(document.getElementsByName('userId')[0].value);
	
	webUtil.setITRVPassword(document.getElementsByName('password')[0].value);
	
	webUtil.setITRVDob(document.getElementsByName('dob')[0].value);
	
	
	webUtil.setITRVItr(document.getElementsByName('itrName')[0].value);
	
	webUtil.setITRVAsstYear(document.getElementsByName('asstYear')[0].value);
	
	webUtil.setITRVPan(document.getElementsByName('userPan')[0].value);
	
	webUtil.setITRVAckNo(document.getElementsByName('ackNo')[0].value);
	document.getElementById('schemaError').innerHTML='';
	webUtil.downloadITRV();
}

function itrvSuccess(path){

}


function openPage(pageNo){
	
}
function loadITRHomePage(val){

	var arr=val.split('::');
	var totRow=arr[0];
	var tableITR=document.getElementById('homeITR');
	for(var i=1;i<=totRow;i++){
		var arrVal= arr[i].split(',');
		if(arrVal.length==0){
			continue;
		}
		var asstYear=arrVal[0];
		
		var row=tableITR.insertRow(i);
		var cellLength=tableITR.rows[0].cells.length;
		for(var j=0;j<cellLength;j++){
			row.insertCell(j).innerHTML="NA";
			
		}
		for(var k=1;k<arrVal.length-1;k++){
			var itrVer=arrVal[k].split(':');
			for(var j=0;j<cellLength;j++){
				var cell=row.cells[j];
				if(j==0){
					cell.innerHTML=asstYear;
				}else if(tableITR.rows[0].cells[j].innerHTML==itrVer[0]){
					cell.innerHTML='';
					var aTag=document.createElement('a');
					var onclick="j.openNewITR('"+asstYear+"','"+itrVer[0]+"','"+itrVer[1]+"',null);";
					aTag.setAttribute('onclick',onclick);
					aTag.setAttribute('href',"#");
					aTag.innerHTML='Open';
					cell.appendChild(aTag);
				}
			}
		}
				
	}
}

function insertCell(){
	
}



function setClose(itrName,asstYear){
var len=document.getElementsByName(itrName+asstYear).length;
for(var i=0;i<len;i++){
	document.getElementsByName(itrName+asstYear)[i].innerHTML='Close';
	document.getElementsByName(itrName+asstYear)[i].setAttribute('onclick','j.closeITR();');
}
}
function setOpen(itrName,asstYear){
var len=document.getElementsByName(itrName+asstYear).length;
for(var i=0;i<len;i++){
	document.getElementsByName(itrName+asstYear)[i].innerHTML='Open';
	document.getElementsByName(itrName+asstYear)[i].setAttribute("onclick","j.openNewITR('"+asstYear+"','"+itrName+"',null);");
}
}

function addToDraft(asstYear,itrName,savedDate,fileName,pan){
  alert(asstYear+' itr: '+itrName+'date: '+savedDate+' file: '+fileName+' pan: '+pan);
document.getElementById('savedDraft').style.display="block";
document.getElementById('noXml').style.display="none";
	var row=document.getElementById('savedDraft').insertRow(1);
	var cell1=row.insertCell(0);
	var cell5=row.insertCell(1);
	var cell2=row.insertCell(2);
	var cell3=row.insertCell(3);
	var cell4=row.insertCell(4);
	
	cell1.innerHTML=asstYear;
	cell5.innerHTML=pan;
	cell2.innerHTML=itrName;
	cell3.innerHTML=savedDate;
	var aTag=document.createElement('a');
	var onclick="j.openDraft('"+fileName+"');";
	aTag.setAttribute('onclick',onclick);
	aTag.setAttribute('href',"#");
	aTag.innerHTML=fileName;
	cell4.appendChild(aTag);
	cell4.setAttribute('style',"text-align:left;")
	
	
}
if(document.getElementById('savedDraft').rows.length==1){
document.getElementById('savedDraft').style.display="none";
}

function openSubmitITR(){
	$('a')[2].parentElement.className='ui-state-default ui-corner-top ui-tabs-selected ui-state-active';
	$('a')[0].parentElement.className='ui-state-default ui-corner-top';
	$('a')[1].parentElement.className='ui-state-default ui-corner-top';
	document.getElementById('instruction').setAttribute('class','ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide');
	document.getElementById('savedXml').setAttribute('class','ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide');
	document.getElementById('submitITRTab').setAttribute('class','ui-tabs-panel ui-widget-content ui-corner-bottom');
}
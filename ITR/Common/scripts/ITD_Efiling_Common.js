
function dummyAlert () {
	alert ('Functionality Not Implemented');
}

function onChangeVacate() {
 document.getElementById('inputID').value='';
}

function setSearchLength(){
	if (document.getElementById('searchAccOptionId').value === '1') {
		document.getElementById('inputID').setAttribute("maxlength", "100");
	} else if (document.getElementById('searchAccOptionId').value === '2') {
		document.getElementById('inputID').setAttribute("maxlength", "10");
	}
}

function prepareSearch(opt){
	document.getElementById('searchAccOptionId').value=opt;
	setSearchLength();
}

function onlySearch(e,dropDownvalue){
	if(dropDownvalue=='1'){
		return true;
	}
	else if(dropDownvalue==='2'){
		
	return onlyNumbers(e);
	}
}




function checkBrowser(){
		
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var fullVersion  = ''+parseFloat(navigator.appVersion); 
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameOffset,verOffset,ix;

	// In Opera, the true version is after "Opera" or after "Version"
	/* if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
	 browserName = "Opera";
	 fullVersion = nAgt.substring(verOffset+6);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
	   fullVersion = nAgt.substring(verOffset+8);
	} */
	// In MSIE, the true version is after "MSIE" in userAgent
	if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
	 browserName = "Microsoft Internet Explorer";
	 fullVersion = nAgt.substring(verOffset+5);
	}
	// In Chrome, the true version is after "Chrome" 
	/* else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
	 browserName = "Chrome";
	 fullVersion = nAgt.substring(verOffset+7);
	} */
	// In Safari, the true version is after "Safari" or after "Version" 
	/* else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
	 browserName = "Safari";
	 fullVersion = nAgt.substring(verOffset+7);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
	   fullVersion = nAgt.substring(verOffset+8);
	} */
	// In Firefox, the true version is after "Firefox" 
	else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
	 browserName = "Firefox";
	 fullVersion = nAgt.substring(verOffset+8);
	}
	// In most other browsers, "name/version" is at the end of userAgent 
	else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
			  (verOffset=nAgt.lastIndexOf('/')) ){
	 browserName = nAgt.substring(nameOffset,verOffset);
	 fullVersion = nAgt.substring(verOffset+1);
	 if (browserName.toLowerCase()==browserName.toUpperCase()) {
	  browserName = navigator.appName;
	 }
	}
	// trim the fullVersion string at semicolon/space if present
	if ((ix=fullVersion.indexOf(";"))!=-1)
	   fullVersion=fullVersion.substring(0,ix);
	if ((ix=fullVersion.indexOf(" "))!=-1)
	   fullVersion=fullVersion.substring(0,ix);

	majorVersion = parseInt(''+fullVersion,10);
	if (isNaN(majorVersion)) {
	 fullVersion  = ''+parseFloat(navigator.appVersion); 
	 majorVersion = parseInt(navigator.appVersion,10);
	}

	
	if((browserName.toUpperCase().indexOf("FIREFOX", 0)!=-1 && majorVersion < 7) ||
		(browserName.toUpperCase().indexOf("MICROSOFT", 0)!=-1 && majorVersion < 7)){
		alert('Your browser was detected to be outdated and incompatible with the website.'+ 
				'\nPlease use latest browsers viz. \n IE7 or later , Chrome , firefox v7 or later');
		backToHomePage();
	}
}

function backToHomePage() {

var varRandNum="";
if( document.forms[0].elements['requestId']==undefined){

varRandNum = document.forms[0].elements['ID'].value;

}else{

varRandNum = document.forms[0].elements['requestId'].value;

}
	document.forms[0].action= "/e-Filing/MyAccount/MyAccountHome.html?ID="+varRandNum;
	document.forms[0].onsubmit ="";
	document.forms[0].submit();
	
}

function backToTempUserHomePage() {

	var varRandNum = document.forms[0].elements['requestId'].value;

	document.forms[0].action= "/e-Filing/MyAccount/backToTempUserHomePage.html?ID="+varRandNum;

	document.forms[0].onsubmit ="";

	document.forms[0].submit();

	
}




function backToEriExtendUserValidity() {
	var varRandNum = document.forms[0].elements['requestId'].value;
	document.forms[0].action= "/e-Filing/UserManagement/ExtendUserValidity.html?ID="+varRandNum;
	document.forms[0].onsubmit ="";
	document.forms[0].submit();
	
}

function backToHomePageGuest() {
	document.forms[0].action= "/e-Filing/";
	document.forms[0].onsubmit ="";
	document.forms[0].submit();
	
}

function redirectCaToUploadOfflineForm() {
	var varRandNum = document.forms[0].elements['requestId'].value;
	document.forms[0].action= "/e-Filing/MyAccount/UploadFormsHome.html?ID="+varRandNum;
	document.forms[0].onsubmit ="";
	document.forms[0].submit();
	
}

function redirectCaToUploadOnlineForm() {
	var varRandNum = document.forms[0].elements['requestId'].value;
	document.forms[0].action= "/e-Filing/OnlineForms/OnlineFormsLink.html?ID="+varRandNum;
	document.forms[0].onsubmit ="";
	document.forms[0].submit();
	
}
function backToRectificationStatus() {
	var varRandNum = document.forms[0].elements['requestId'].value;
	document.forms[0].action= "/e-Filing/MyAccount/RectificationStatusLink.html?ID="+varRandNum;
	document.forms[0].onsubmit ="";
	document.forms[0].submit();
	
}

function getNewSubmitForm(){

	var submitForm = document.createElement("FORM");
	document.body.appendChild(submitForm);
	submitForm.method = "POST";

	return submitForm;
 
}

/*
function downloadThisForm(formName,formType){
	
	var submitForm = getNewSubmitForm();
	var asstYear = "2012";
	if (document.getElementById('asstYear') != null) {
		asstYear =  document.getElementById('asstYear').value;
	}

	var assessmentYearInput = document.createElement("input");
	
	assessmentYearInput.setAttribute("type", "hidden");
	assessmentYearInput.setAttribute("name", "assessmentYear");
	assessmentYearInput.setAttribute("value", asstYear);
	var formNameInput = document.createElement("input");
	
	formNameInput.setAttribute("type", "hidden");
	formNameInput.setAttribute("name", "formName");
	formNameInput.setAttribute("value", formName);
	var formTypeInput = document.createElement("input");
	
	formTypeInput.setAttribute("type", "hidden");
	formTypeInput.setAttribute("name", "fileType");
	formTypeInput.setAttribute("value", formType);
	
	submitForm.appendChild(assessmentYearInput);
	submitForm.appendChild(formNameInput);
	submitForm.appendChild(formTypeInput);
	
	submitForm.action= "/e-Filing/Services/DownloadAction.html";
	submitForm.submit();	

} */
function disableAssessmentYear(){

   document.getElementById("asstYear").disabled = true;
   document.getElementById("asstYear").value="2012";
   document.getElementById('itr7').style.display="";
	
}
function enableAssessmentYear(){

   document.getElementById("asstYear").disabled = false;
	
}



function createNewFormElement(inputForm, elementName, elementValue){

	var input = document.createElement("input");

	input.setAttribute("type", "hidden");
	input.setAttribute("name", elementName);
	input.setAttribute("value", elementValue);
	inputForm.appendChild(input);
}
function tokenNumber(firstLink,randId,tokenNum)
{
	
	var submitForm = getNewSubmitForm();
	createFormElementToken(submitForm,tokenNum);
	
	submitForm.action= firstLink.concat(randId.toString());
	submitForm.submit(); 

}

function createFormElementToken(inputForm,tokenNum)
{

	var input =document.createElement("input");	
	input.setAttribute("type", "hidden");
	input.setAttribute("name", "tokenNumber");	
	input.setAttribute("value", tokenNum);	
	inputForm.appendChild(input);
	
}

function displayEmailDetails() {


	if (document.getElementById("chkEmailId1").checked) {
		document.getElementById("chkAltEmailDetails").style.display = "none";
		document.forms[0].action="/e-Filing/Services/MailPasswordToRegEmailId.html";

	} else if (document.getElementById("chkEmailId2").checked) {
		document.getElementById("chkAltEmailDetails").style.display = "";
		document.forms[0].action="/e-Filing/Services/MailPasswordToNewEmailId.html";
	}

}



function validateUserId () {
	document.forms[0].action="/e-Filing/Registration/RegistrationValidationInd.html";
	document.forms[0].submit();	
}

function enableAllIndFields () {

	var form = document.forms[0];


		var checkList = form.elements['userIdentityCheckDetails.securityOption'];
					
			for (var i = 0; i < checkList.length; i++) {

				checkList[i].disabled=false;

			}
		
		var dscRadio = form.elements['userDscFileDetails.typeOfDsc'];

			for (var i = 0; i < dscRadio.length; i++) {

				dscRadio[i].disabled=false;

			}

		

			var divElement = document.getElementById("optionToSendToItd");

				if (divElement != null) {
					divElement.parentNode.removeChild(divElement);
				}

		form.elements['accountNumber'].readOnly=false;
		form.elements['userNameDetails.surName'].readOnly=false;
		form.elements['userNameDetails.middleName'].readOnly=false;
		form.elements['userNameDetails.firstName'].readOnly=false;


		form.elements['dateOfBirth'].readOnly=false;
		form.elements['userContactDetails.emailId'].readOnly=false;
		form.elements['userContactDetails.mobileNumber'].readOnly=false;

		checkList.disabled=false;
		dscRadio.disabled=false;

		form.elements['userIdentityCheckDetails.dedtrTan'].readOnly=false;
		form.elements['userIdentityCheckDetails.financialYear'].disabled=false;
		form.elements['userIdentityCheckDetails.bankBsrCode'].readOnly=false;
		form.elements['userIdentityCheckDetails.amountPaid'].readOnly=false;
		form.elements['userIdentityCheckDetails.asstYear'].disabled=false;

			form.elements['continue'].disabled=false;
		displayIndOption();

		form.elements['dateOfBirth'].id="dateField";


		$(function() {
	$( "#dateField" ).datepicker({
		showOn: "button",
		buttonImage: "/itax/images/calendar.png",
		buttonImageOnly: true,
		changeMonth: true,
		changeYear: true,
		yearRange: "-100:",
		dateFormat: "dd/mm/yy",
		buttonText: "Choose",
		showOtherMonths: true,
		selectOtherMonths: true
	});
});
}

function printPdfFormUnsuccessfulReg () {

	if (document.getElementById("optionToSend1").checked) {

		enableAllIndFields();

		var form = document.forms[0];

		document.forms[0].action="/e-Filing/Registration/IndividualUnsucessfullRegistration.html";
		document.forms[0].submit();	

		hideOption();

		form.elements['accountNumber'].value="";

		form.action="/e-Filing/Registration/RegistrationInvidualValidation.html";


	}
}

function disableAllIndFields () {

		var form = document.forms[0];
		form.elements['accountNumber'].readOnly="readonly";
		form.elements['userNameDetails.surName'].readOnly="readonly";
		form.elements['userNameDetails.middleName'].readOnly="readonly";
		form.elements['userNameDetails.firstName'].readOnly="readonly";


		form.elements['dateOfBirth'].readOnly="readonly";
		form.elements['dateOfBirth'].id="";
		form.elements['userContactDetails.emailId'].readOnly="readonly";
		form.elements['userContactDetails.mobileNumber'].readOnly="readonly";

		var checkList = form.elements['userIdentityCheckDetails.securityOption'];
		
								
			for (var i = 0; i < checkList.length; i++) {

				checkList[i].disabled=true;

			}


		var dscRadio = form.elements['userDscFileDetails.typeOfDsc'];

			for (var i = 0; i < dscRadio.length; i++) {

				dscRadio[i].disabled=true;

			}

		form.elements['userIdentityCheckDetails.dedtrTan'].readOnly="readonly";
		form.elements['userIdentityCheckDetails.financialYear'].disabled=true;
		form.elements['userIdentityCheckDetails.asstYear'].disabled=true;
		form.elements['userIdentityCheckDetails.bankBsrCode'].readOnly="readonly";
		form.elements['userIdentityCheckDetails.amountPaid'].readOnly="readonly";
		form.elements['continue'].disabled=true;
	
}

function hideOption () {
	
		enableAllIndFields();
		var form = document.forms[0];

		var checkList = form.elements['userIdentityCheckDetails.securityOption'];

						
			for (var i = 0; i < checkList.length; i++) {

				checkList[i].checked=false;

			}
		
		var dscRadio = form.elements['userDscFileDetails.typeOfDsc'];

			for (var i = 0; i < dscRadio.length; i++) {

				dscRadio[i].checked=false;


			}

        clearErrorMessages(form);
        clearErrorLabels(form);



		displayIndOption();

			var divElement = document.getElementById("optionToSendToItd");

				if (divElement != null) {
					divElement.parentNode.removeChild(divElement);
				}


		form.elements['userNameDetails.surName'].value="";
		form.elements['userNameDetails.middleName'].value="";
		form.elements['userNameDetails.firstName'].value="";


		form.elements['dateOfBirth'].value="";
		form.elements['userContactDetails.emailId'].value="";
		form.elements['userContactDetails.mobileNumber'].value="";

		form.elements['userIdentityCheckDetails.dedtrTan'].value="";
		form.elements['userIdentityCheckDetails.financialYear'].value=-1;
		form.elements['userIdentityCheckDetails.bankBsrCode'].value="";
		form.elements['userIdentityCheckDetails.amountPaid'].value="";
		form.elements['userIdentityCheckDetails.asstYear'].value=-1;

}
	
function hideSubmitOption () {
	
		enableAllIndFields();
		var form = document.forms[0];

        clearErrorMessages(form);
        clearErrorLabels(form);



		displayIndOption();

			var divElement = document.getElementById("optionToSendToItd");

				if (divElement != null) {
					divElement.parentNode.removeChild(divElement);
				}

}	
	
function proceedWithTempRegistration () {

	enableAllIndFields();
	if (document.getElementById("optionToProceed1").checked) {
		document.forms[0].action="/e-Filing/Registration/ProceedWithTempRegistration.html";
		document.forms[0].submit();	
	}
}

function tempRegistration () {

	
	if (document.getElementById("optionToProceed1").checked) {
		document.forms[0].action="/e-Filing/Registration/tempRegistrationLink.html";
		document.forms[0].submit();	
	}
}

function proceedTempRegLogin () {

	
	if (document.getElementById("optionToProceed1").checked) {
		document.forms[0].action="/e-Filing/MyAccount/proceedTempRegLogin.html";
		document.forms[0].submit();	
	}
}

function hideOptionToProceed () {
	
	if (document.getElementById("optionToProceed2").checked) {
	
			var divElement = document.getElementById("optionToProceed");

				if (divElement != null) {
					divElement.parentNode.removeChild(divElement);
				}


	}
	enableAllIndFields();

}

function hideOptionUnsuccessReg() {

	
	if (document.getElementById("optionToProceed2").checked) {
	
			var divElement = document.getElementById("optionToProceed");

				if (divElement != null) {
					divElement.parentNode.removeChild(divElement);
				}


	}
	
enableUnsuccessFields();
}


function displayUpdateAdress(){

	var one = document.getElementsByName("addressSelect")[0].checked;
	var two = document.getElementsByName("addressSelect")[1].checked;
	var form = document.forms[0];
	
	if(one){
		
		document.getElementById("UpdateAdrs").style.display="";
				
	}else if(two)
		{
		
		document.getElementById("UpdateAdrs").style.display="none";
		
		document.getElementById("oldstate").value="-1";
		document.getElementById("oldpinCode").value="";
		document.getElementById("doorNumber").value="";
		document.getElementById("streetName").value="";
		document.getElementById("locality").value="";
		document.getElementById("per_city").value="";
		document.getElementById("newState").value="-1";
		document.getElementById("newPinCode").value="";
		
		clearFieldErrorLabels(form.elements['oldstate']);
		clearFieldErrorMessages(form.elements['oldstate']);
		
		clearFieldErrorLabels(form.elements['oldpinCode']);
		clearFieldErrorMessages(form.elements['oldpinCode']);
		
		clearFieldErrorLabels(form.elements['contactNew.address.doorNumber']);
		clearFieldErrorMessages(form.elements['contactNew.address.doorNumber']);
		
		clearFieldErrorLabels(form.elements['contactNew.address.streetName']);
		clearFieldErrorMessages(form.elements['contactNew.address.streetName']);
		
		clearFieldErrorLabels(form.elements['contactNew.address.locality']);
		clearFieldErrorMessages(form.elements['contactNew.address.locality']);
		
		clearFieldErrorLabels(form.elements['contactNew.address.city']);
		clearFieldErrorMessages(form.elements['contactNew.address.city']);
		
		clearFieldErrorLabels(form.elements['contactNew.address.state']);
		clearFieldErrorMessages(form.elements['contactNew.address.state']);
		
		clearFieldErrorLabels(form.elements['contactNew.address.pinCode']);
		clearFieldErrorMessages(form.elements['contactNew.address.pinCode']);
		
	
		}	
	
}

function displayUpdateEmail(){

	var one = document.getElementsByName("emailIdSelect")[0].checked;
	var two = document.getElementsByName("emailIdSelect")[1].checked;
	var form = document.forms[0];
	
	if(one){
		
		document.getElementById("Updatemail").style.display="";
				
	}else if(two)
		{
		document.getElementById("Updatemail").style.display="none";
		
		document.getElementById("oldEmailId").value="";
		document.getElementById("newEmailId").value="";
		
		clearFieldErrorLabels(form.elements['contactOld.mobnMail.emailId']);
		clearFieldErrorMessages(form.elements['contactOld.mobnMail.emailId']);
		
		clearFieldErrorLabels(form.elements['contactNew.mobnMail.emailId']);
		clearFieldErrorMessages(form.elements['contactNew.mobnMail.emailId']);
			
		}	
	
}
function displayUpdateMob(){

	var one = document.getElementsByName("contactSelect")[0].checked;
	var two = document.getElementsByName("contactSelect")[1].checked;
	var form = document.forms[0];
	
	if(one){
		
		document.getElementById("UpdateMob").style.display="";
		
	}else if(two)
		{
		
		document.getElementById("UpdateMob").style.display="none";
		
		document.getElementById("oldMobileNumber").value="";
		document.getElementById("newMobileNumber").value="";
		
		clearFieldErrorLabels(form.elements['oldMobileNumber']);
		clearFieldErrorMessages(form.elements['oldMobileNumber']);

		clearFieldErrorLabels(form.elements['contactOld.mobnMail.mobileNumber']);
		clearFieldErrorMessages(form.elements['contactNew.mobnMail.mobileNumber']);
		}	
	
}


function optionChangeItrVStatus()
{

	if (!document.getElementById("ITR_V_Status_chooseOptionpanAy").checked && !document.getElementById("ITR_V_Status_chooseOptionackNum").checked ) {
		document.getElementById("ITR_V_Status_chooseOptionpanAy").checked = true;
	}

	if (document.getElementById("ITR_V_Status_chooseOptionpanAy").checked) {
		
		
		document.getElementById("panAndYear").style.display="";
		document.getElementById("ackNoEnable").style.display="none";
		document.getElementById("ITR_V_Status_itrvStatusDetails_acknowledgementNumber").value="";

		}
	else if (document.getElementById("ITR_V_Status_chooseOptionackNum").checked) {
		
		document.getElementById("panAndYear").style.display="none";
		document.getElementById("ackNoEnable").style.display="";
		document.getElementById("ITR_V_Status_itrvStatusDetails_pan").value="";
	}
		
}









	function displayIndOption() {

				document.getElementById("registerDscPfx").style.display = "none";
				document.getElementById("registerDscUsb").style.display = "none";
	
		if (document.getElementById("radioDsc1").checked) {
			
			document.getElementById("registerDsc").style.display="";
			document.getElementById("registerDscPfx").style.display = "none";
			document.getElementById("registerDscUsb").style.display = "none";


			if (document.getElementById("optionTypeOfDsc1").checked) {
				document.getElementById("registerDscPfx").style.display = "";
			}
			else if (document.getElementById("optionTypeOfDsc2").checked) {
				document.getElementById("registerDscUsb").style.display = "";
			}

			document.getElementById("secOptionC").style.display="none";
			document.getElementById("secOptionD").style.display="none";


		}
		else if (document.getElementById("radioDsc2").checked) {
			

			document.getElementById("secOptionC").style.display="none";
			document.getElementById("secOptionD").style.display="none";
			document.getElementById("registerDsc").style.display="none";
			document.getElementById("registerDscPfx").style.display = "none";
			document.getElementById("registerDscUsb").style.display = "none";


		}

		else if (document.getElementById("radioDsc3").checked) {
			

			document.getElementById("secOptionC").style.display="";
			document.getElementById("secOptionD").style.display="none";
			document.getElementById("registerDsc").style.display="none";
			document.getElementById("registerDscPfx").style.display = "none";
			document.getElementById("registerDscUsb").style.display = "none";


		}

		else if (document.getElementById("radioDsc4").checked) {
			

			document.getElementById("secOptionC").style.display="none";
			document.getElementById("secOptionD").style.display="";
			document.getElementById("registerDsc").style.display="none";
			document.getElementById("registerDscPfx").style.display = "none";
			document.getElementById("registerDscUsb").style.display = "none";


		}
		else {
			document.getElementById("secOptionC").style.display="none";
			document.getElementById("secOptionD").style.display="none";
			document.getElementById("registerDsc").style.display="none";
			document.getElementById("registerDscPfx").style.display = "none";
			document.getElementById("registerDscUsb").style.display = "none";

		}


	}
	function displayIndFinal() {

	
		if (document.getElementById("radioDsc1").checked) {
			
			document.getElementById("registerDsc").style.display="";

			if (document.getElementById("optionTypeOfDsc1").checked) {
				document.getElementById("registerDscPfx").style.display = "";
			}
			else if (document.getElementById("optionTypeOfDsc2").checked) {
				document.getElementById("registerDscUsb").style.display = "";
			}

		}
		else if (document.getElementById("radioDsc2").checked) {
			
			document.getElementById("securityChoice").style.display="";

			if (document.getElementById("optionSecCheck1").checked)	{
				document.getElementById("secOptionC").style.display = "";
			}
			else if (document.getElementById("optionSecCheck2").checked){
				document.getElementById("secOptionD").style.display = "";

			}
		}


	}
	
function displayCorpFinal() {


	if(document.getElementById("optionDscChoice1").checked){
				
					document.getElementById("infoDsc").style.display = "";
				
					if(document.getElementById("optionTypeOfDsc1").checked){

					
					document.getElementById("registerDscPfx").style.display = "";
					
					}else if(document.getElementById("optionTypeOfDsc1").checked){
					
					document.getElementById("registerDscUsb").style.display = "";
					}
	}

}

function displayExtFinal() {


	if(document.getElementById("optionDscChoice1").checked){
				
					document.getElementById("infoDsc").style.display = "";
				
					if(document.getElementById("optionTypeOfDsc1").checked){

					
					document.getElementById("registerDscPfx").style.display = "";
					
					}else if(document.getElementById("optionTypeOfDsc1").checked){
					
					document.getElementById("registerDscUsb").style.display = "";
					}
	}

}


function displayExternalFinal() {

	var chosen = document.getElementById("ext_UserType").value;
	
	
	if (chosen == 'N') {
		
		document.getElementById("optionDscChoice1").checked = true;
		document.getElementById("optionDscChoice2").disabled = true;
	
	}

	if(document.getElementById("optionDscChoice1").checked){
				
					document.getElementById("infoDsc").style.display = "";
				
					if(document.getElementById("optionTypeOfDsc1").checked){

					
					document.getElementById("registerDscPfx").style.display = "";
					
					}else if(document.getElementById("optionTypeOfDsc2").checked){
					
					document.getElementById("registerDscUsb").style.display = "";
					}
	}

}
	
function displayAuthFinal() {
	
	
	
					if(document.getElementById("optionTypeOfDsc1").checked){
					
					document.getElementById("registerDscPfx").style.display ="";
					
					}else if(document.getElementById("optionTypeOfDsc2").checked){
					
					document.getElementById("registerDscUsb").style.display ="";
					}
	
}


function displayDsc(paramValue) {

		if (paramValue == 1) {

			document.getElementById("registerDsc").style.display="";
			document.getElementById("securityChoice").style.display="none";
			document.getElementById("secOptionC").style.display = "none";
			document.getElementById("secOptionD").style.display = "none";

			document.getElementById("optionSecCheck1").checked=false;
			document.getElementById("optionSecCheck2").checked=false;

			document.getElementById("dateOfPayment").value="";
			document.getElementById("amountPaid").value="";
			document.getElementById("tanNumber").value="";
			document.getElementById("finYear").value="";


		} else {
			document.getElementById("securityChoice").style.display="";			
			document.getElementById("registerDsc").style.display="none";
			document.getElementById("registerDscPfx").style.display="none";
			document.getElementById("registerDscUsb").style.display="none";
			document.getElementById("filePfx").value="";
			document.getElementById("fileUsb").value="";

			document.getElementById("optionTypeOfDsc1").checked=false;
			document.getElementById("optionTypeOfDsc2").checked=false;

		}

	}

function displayDscUpload(paramValue) {

		document.getElementById("registerDscUsb").style.display = "none";
		document.getElementById("registerDscPfx").style.display = "none";
		if (paramValue == 1) {
			document.getElementById("registerDscPfx").style.display = "";
			document.getElementById("fileUsb").value="";

		} else if (paramValue == 2){
			document.getElementById("registerDscUsb").style.display = "";
			document.getElementById("filePfx").value="";


		}

	}
	

	
function dispDscChoice(paramValue)	{
		if (paramValue == 1) {
			document.getElementById("dscChoice").style.display = "";
			document.getElementById("infoSeekDsc").style.display = "none";
			document.getElementById("infoSubDsc").style.display = "none";
			document.getElementById("registerDscPfx").style.display = "none";
			document.getElementById("registerDscUsb").style.display = "none";			

			} else {
			document.getElementById("dscChoice").style.display = "none";
			document.getElementById("infoSeekDsc").style.display = "none";		
			document.getElementById("infoSubDsc").style.display = "";
			document.getElementById("registerDscPfx").style.display = "none";
			document.getElementById("registerDscUsb").style.display = "none";
					
		}	
	}	

	
function dispExtDSC(paramValue)	{
					document.getElementById("registerDscPfx").style.display = "none";
					document.getElementById("registerDscUsb").style.display = "none";
			if (paramValue == 1) {
			document.getElementById("infoDsc").style.display = "";
			if(document.getElementById("optionTypeOfDsc1").checked){
			
					document.getElementById("registerDscPfx").style.display = "";
					document.getElementById("registerDscUsb").style.display = "none";
					document.getElementById("fileUsb").value="";
			}
			else if(document.getElementById("optionTypeOfDsc2").checked){
						
					document.getElementById("registerDscPfx").style.display = "none";
					document.getElementById("registerDscUsb").style.display = "";
					document.getElementById("filePfx").value="";
			}
			
			} else {
			
			document.getElementById("infoDsc").style.display = "none";		
							
		}	
	}
	
function displayDscType(paramValue)	{
		if(paramValue ==1)
		{			
			document.getElementById("registerDscPfx").style.display = "";
			document.getElementById("registerDscUsb").style.display = "none";			
		}else{			
			document.getElementById("registerDscPfx").style.display = "none";
			document.getElementById("registerDscUsb").style.display = "";	
		}
	}
		
function displaySecurityChoice (paramValue) {
		
		if (paramValue == 1) {
			document.getElementById("secOptionC").style.display = "";
			document.getElementById("secOptionD").style.display = "none";
			document.getElementById("dateOfPayment").value="";
			document.getElementById("amountPaid").value="";


		} else {
			document.getElementById("secOptionC").style.display = "none";
			document.getElementById("secOptionD").style.display = "";

			document.getElementById("tanNumber").value="";
			document.getElementById("finYear").value="";


		}
	}


function populate_external_dsc_mandatory() {

	var chosen = document.getElementById("ext_UserType").value;
	
	var form = document.forms[0];
	var organisationPanField = form.elements['externalUserDetails.organisationPan'];
	var organisationTanField = form.elements['externalUserDetails.organisationTan'];


	if (chosen == 'N') {

		displayMandatory(organisationPanField);
		displayMandatory(organisationTanField);
		
		document.getElementById("optionDscChoice1").checked = true;
		document.getElementById("optionDscChoice2").disabled = true;
		
		if(document.getElementById("optionDscChoice1").checked){
			
			document.getElementById("infoDsc").style.display = "";
			
			if(document.getElementById("optionTypeOfDsc1").checked){

			
			document.getElementById("registerDscPfx").style.display = "";
			
			}else if(document.getElementById("optionTypeOfDsc2").checked){
			
			document.getElementById("registerDscUsb").style.display = "";
			}
			
		}
	
	}
	
	else{
		
		displayOptional(organisationPanField);
		displayOptional(organisationTanField);



		document.getElementById("optionDscChoice1").checked = false;
		document.getElementById("optionDscChoice2").checked = false;
		
		document.getElementById("optionDscChoice2").disabled = false;
		
		document.getElementById("infoDsc").style.display = "none";
	    document.getElementById("registerDscPfx").style.display = "none";
	    document.getElementById("registerDscUsb").style.display = "none";
	}
}

function changeLabelForUserType() {

	var tagnames = document.getElementsByTagName("label");

	var val1 = document.getElementById("userType1").value;

	if (val1 == 'Individual' || val1 == 'Corporate') {
		tagnames[1].firstChild.nodeValue = "Enter Your PAN";
	}
	if (val1 == 'ERI') {
		tagnames[1].firstChild.nodeValue = "Enter Your ERI Number";
	} else if (val1 == 'External') {
		tagnames[1].firstChild.nodeValue = "Enter Your TAN/PAN";
	} else if (val1 == 'ITD Official') {
		tagnames[1].firstChild.nodeValue = "Enter Your Employee Id";
	} else if (val1 == 'Helpdesk') {
		tagnames[1].firstChild.nodeValue = "Enter Your Emp Id";
	}
}

function enableSecondarySecretAnswer(){
	
	if(document.getElementById("secretQuestionSec").value == '-1'){
		
		document.getElementById("secretAnswerSec").value= "";
		document.getElementById("secretAnswerSec").readOnly = true;
		
	}
	else{
	document.getElementById("secretAnswerSec").readOnly = false;
	}
}

function populate_Secondary_Secret_Question() {

	var chosen = document.getElementById("primaryQuestionSec").value;


	var secQuestionSecSelect = document.getElementById("secretQuestionSec");

	secQuestionSecSelect.options.length = 0;
		
	

	if (chosen == "-1") {
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'Select', '-1');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your pet name?', '1');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your mothers maiden name?',
				'2');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your first school name?',
				'3');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your favorite time pass?',
				'4');
	}

	if (chosen == "1") {
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'Select', '-1');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your mothers maiden name?',
				'2');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your first school name?',
				'3');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your favorite time pass?',
				'4');
	}

	if (chosen == "2") {
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'Select', '-1');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your pet name?', '1');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your first school name?',
				'3');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your favorite time pass?',
				'4');
	}

	if (chosen == "3") {
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'Select', '-1');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your pet name?', '1');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your mothers maiden name?',
				'2');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your favorite time pass?',
				'4');
	}

	if (chosen == "4") {
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'Select', '-1');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your pet name?', '1');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your mothers maiden name?',
				'2');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your first school name?',
				'3');
	}

}

function populate_Secondary_Secret_Question_Old() {

	var chosen = document.getElementById("primaryQuestionSec").value;
	var secQuestionSecSelect = document.getElementById("secretQuestionSec");

	secQuestionSecSelect.options.length = 0;

	if (chosen == "-1") {
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'Select', '-1');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your pet name?', '1');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your mothers maiden name?',
				'2');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your first school name?',
				'3');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your favorite time pass?',
				'4');
	}

	if (chosen == "What is your pet name?") {
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'Select', '-1');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your mothers maiden name?',
				'What is your mothers maiden name?');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your first school name?',
				'What is your first school name?');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your favorite time pass?',
				'What is your favorite time pass?');
	}

	if (chosen == "What is your mothers maiden name?") {
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'Select', '-1');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your pet name?', 'What is your pet name?');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your first school name?',
				'What is your first school name?');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your favorite time pass?',
				'What is your favorite time pass?');
	}

	if (chosen == "What is your first school name?") {
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'Select', '-1');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your pet name?', 'What is your pet name?');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your mothers maiden name?',
				'What is your mothers maiden name?');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your favorite time pass?',
				'What is your favorite time pass?');
	}

	if (chosen == "What is your favorite time pass?") {
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'Select', '-1');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your pet name?', 'What is your pet name?');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your mothers maiden name?',
				'What is your mothers maiden name?');
		secQuestionSecSelect.options[secQuestionSecSelect.options.length] = new Option(
				'What is your first school name?',
				'What is your first school name?');
	}

}

function displayPasswordSuggestions(id, toggle) {
	if (toggle == "on") {
		document.getElementById(id).style.display = "";
	} else {
		document.getElementById(id).style.display = "none";
	}
}

function populate_curr() {

	var door_no = document.getElementById("cur_door_no").value;
	var street_name = document.getElementById("cur_street_name").value;
	var locality = document.getElementById("cur_locality").value;
	var city = document.getElementById("cur_city").value;
	var state = document.getElementById("cur_state").value;
	var pincode = document.getElementById("cur_pincode").value;
	var country = document.getElementById("cur_country").value;
	
	var add_check = document.getElementById("add_check").checked;

	if (add_check) {

		document.getElementById("per_door_no").value = door_no;
		document.getElementById("per_street_name").value = street_name;
		document.getElementById("per_locality").value = locality;
		document.getElementById("per_city").value = city;
		document.getElementById("per_state").value = state;
		document.getElementById("per_state_val").value = state;
		document.getElementById("per_pincode").value = pincode;
		document.getElementById("per_country").value = country;
		document.getElementById("per_country_val").value = country;
		
		
		document.getElementById("per_door_no").readOnly = "readonly";
		document.getElementById("per_street_name").readOnly = "readonly";
		document.getElementById("per_locality").readOnly = "readonly";
		document.getElementById("per_city").readOnly = "readonly";
		document.getElementById("per_pincode").readOnly = "readonly";
		document.getElementById("per_state").disabled = true;
		document.getElementById("per_state_val").disabled = false;
		document.getElementById("per_country").disabled = true;
		document.getElementById("per_country_val").disabled = false;

	} else {

		document.getElementById("per_door_no").value = "";
		document.getElementById("per_street_name").value = "";
		document.getElementById("per_locality").value = "";
		document.getElementById("per_city").value = "";
		document.getElementById("per_state").value = -1;
		document.getElementById("per_pincode").value = "";
		document.getElementById("per_country").value = -1;
		document.getElementById("per_country_val").value = -1;
		
		document.getElementById("per_door_no").readOnly=false;
		document.getElementById("per_street_name").readOnly=false;
		document.getElementById("per_locality").readOnly=false;
		document.getElementById("per_city").readOnly=false;
		document.getElementById("per_pincode").readOnly=false;
		document.getElementById("per_state").disabled = false;
		document.getElementById("per_state_val").disabled = true;
		document.getElementById("per_country").disabled = false;
		document.getElementById("per_country_val").disabled = true;	

	}

}



function validatePassword(){

	var password=document.getElementById("password").value;

	if (password.match(" "))	{
		document.getElementById("progressBar1").style.background="silver";
		document.getElementById("progressBar2").style.background="silver";
		document.getElementById("progressBar3").style.background="silver";
		document.getElementById("progressBar4").style.background="silver";
		document.getElementById("pwdStrength").innerHTML="Invalid Password";
		document.getElementById("password").focus();
		return;
	}
	

	if(password.length==0) {

		document.getElementById("progressBar1").style.background="silver";
		document.getElementById("progressBar2").style.background="silver";
		document.getElementById("progressBar3").style.background="silver";
		document.getElementById("progressBar4").style.background="silver";
		document.getElementById("pwdStrength").innerHTML="Zero Length";
		return;
	}


		var special=(password.match("[!@#$%^&*]")!=null);
		var alpSmall=(password.match("[a-z]")!=null);
		var alpBig=(password.match("[A-Z]")!=null);
		var numb=(password.match("[0-9]")!=null);
		
		var checkInt = 4;

		if (!special) {
			checkInt = eval (checkInt - 2);
		}
		if (!alpSmall) {
			checkInt = eval (checkInt - 1);
		}
		if (!alpBig) {
			checkInt = eval (checkInt - 1);
		}
		if (!numb) {
			checkInt = eval (checkInt - 2);
		}

		
	
		if(checkInt == 3 && password.length>7) {

			document.getElementById("pwdStrength").innerHTML="Strong";
			document.getElementById("progressBar1").style.background="green";
			document.getElementById("progressBar2").style.background="green";
			document.getElementById("progressBar3").style.background="green";
			document.getElementById("progressBar4").style.background="silver";
			}
		else if(checkInt == 4 && password.length>7)
			{
			
			passwordStrong=true;
			document.getElementById("pwdStrength").innerHTML="Very Strong";
			document.getElementById("progressBar1").style.background="green";
			document.getElementById("progressBar2").style.background="green";
			document.getElementById("progressBar3").style.background="green";
			document.getElementById("progressBar4").style.background="green";
			}
		else{

			document.getElementById("pwdStrength").innerHTML="Weak";
			document.getElementById("progressBar1").style.background="#ffbf00";
			document.getElementById("progressBar2").style.background="#ffbf00";
			document.getElementById("progressBar3").style.background="silver";
			document.getElementById("progressBar4").style.background="silver";
		}
	
}

function displayIdentityCheck () {

}

function changeImg() {

	
		 var imgElement =  document.getElementById("captchaImg") ; 
		 imgElement.src = "/e-Filing/CreateCaptcha.do?"+Math.random();
		 document.getElementById("captchaImg").focus;

}

function checkPasswordForConfirmation() {
	
       var password = document.getElementById('password').value;
       var confPwd  = document.getElementById('passwordConf').value;



	   var error = "Password mismatch";
		
		if (password == confPwd) {
    	   error = "Confirmed";
       }

	   document.getElementById('confirmPassword').innerHTML = error;



       // addMessage(field, error);
}



function displayBulkPanStatusFinal(){	
	document.getElementById("userId_id").style.display = "none";
	document.getElementById("token_id").style.display = "none";
	if(document.getElementById("searchOptiontokenNo").checked){
		document.getElementById("token_id").style.display = "";	
	}
	else if(document.getElementById("searchOptionuserId").checked){	
		document.getElementById("userId_id").style.display = "";	
	}
}
		
	
	


function dispBulkPanStatusText(param){	
	
	
	if (param == "tokenNo")
	{	
		document.getElementsByName('tokenNumber')[0].value = '';
		document.getElementsByName('userId')[0].value = '';
		
		document.getElementById("token_id").style.display = "";	
		document.getElementById("userId_id").style.display = "none";	
	}
	else if(param == "userId")
	{		
		document.getElementsByName('tokenNumber')[0].value = '';
		document.getElementsByName('userId')[0].value = '';
		
		document.getElementById("token_id").style.display = "none";	
		document.getElementById("userId_id").style.display = "";			
	}
	
}

function displayOnlineRefund(){
	
	var form = document.forms[0];
	var one = document.getElementsByName("refundOption")[0].checked;
	var two = document.getElementsByName("refundOption")[1].checked;
	document.getElementById("RefundECS").style.display="none";
	document.getElementById("RefundCheq").style.display="none";
	if(one){
		
		document.getElementById("RefundCheq").style.display="";
		
		document.getElementById("bankNameECS").value="";
		document.getElementById("bankAcctEcs").value="";
		document.getElementById("acntTypeECS").value="-1";
		document.getElementById("accountMicrCodeECS").value="";	

		clearFieldErrorLabels(form.elements['bankNameECS']);
		clearFieldErrorMessages(form.elements['bankNameECS']);
		
		clearFieldErrorLabels(form.elements['bankAcctEcs']);
		clearFieldErrorMessages(form.elements['bankAcctEcs']);

		clearFieldErrorLabels(form.elements['acntTypeECS']);
		clearFieldErrorMessages(form.elements['acntTypeECS']);

		clearFieldErrorLabels(form.elements['accountMicrCodeECS']);
		clearFieldErrorMessages(form.elements['accountMicrCodeECS']);
	}else if(two)
		{
		
		document.getElementById("RefundECS").style.display="";

		document.getElementById("bankNameCheque").value="";
		document.getElementById("bankAcctCheque").value="";
		document.getElementById("accountTypeCheque").value="-1";
		document.getElementById("accountMicrCodeCheque").value="";
			
			clearFieldErrorLabels(form.elements['bankAcctCheque']);
			clearFieldErrorMessages(form.elements['bankAcctCheque']);
			
			clearFieldErrorLabels(form.elements['bankNameCheque']);
			clearFieldErrorMessages(form.elements['bankNameCheque']);

			clearFieldErrorLabels(form.elements['accountTypeCheque']);
			clearFieldErrorMessages(form.elements['accountTypeCheque']);

			clearFieldErrorLabels(form.elements['accountMicrCodeCheque']);
			clearFieldErrorMessages(form.elements['accountMicrCodeCheque']);
		}	
}


function displayOnlineRefundOption() {

	var one = document.getElementsByName("refundSelect")[0].checked;
	var two = document.getElementsByName("refundSelect")[1].checked;
	
	var form = document.forms[0];
	document.getElementById("RefundECS").style.display="none";
	document.getElementById("RefundCheq").style.display="none";
	if (one) {
		
		document.getElementById("RefundCheq").style.display = "";
		document.getElementById("RefundECS").style.display = "none";
		
		document.getElementById("bankAcctNoEcsOld").value="";
		document.getElementById("accountTypeOld").value="-1";
		document.getElementById("accountMicrCodeOld").value="";		
		
		clearFieldErrorLabels(form.elements['refundRequestModel.bankAccNo']);
		clearFieldErrorMessages(form.elements['refundRequestModel.bankAccNo']);
		
		clearFieldErrorLabels(form.elements['refundRequestModel.accountType']);
		clearFieldErrorMessages(form.elements['refundRequestModel.accountType']);
		
		clearFieldErrorLabels(form.elements['refundRequestModel.micrCode']);
		clearFieldErrorMessages(form.elements['refundRequestModel.micrCode']);
		

	} else if (two) {
		
		document.getElementById("RefundECS").style.display = "";
		document.getElementById("RefundCheq").style.display = "none";
		
		document.getElementById("bankAcctNoChequeOld").value="";
		
		clearFieldErrorLabels(form.elements['bankAcctNoChequeOld']);
		clearFieldErrorMessages(form.elements['bankAcctNoChequeOld']);

	}

}


function selectOption(){

if(document.getElementById("searchOptionname").checked)
{
document.getElementById("name").style.display="";
document.getElementById("tan").style.display="none";
document.getElementById("KnowYourTan_tanNo").value="";
clearErrorLabelsXHTML (form);
clearErrorMessages (form);
}
if(document.getElementById("searchOptiontan").checked)

{
document.getElementById("name").style.display="none";
document.getElementById("tan").style.display="";
document.getElementById("KnowYourTan_tanName").value="";
clearErrorLabelsXHTML (form);
clearErrorMessages (form);

}
}

function dispPasswordRetrieval(){

document.getElementById("selectDsc").style.display="none";
document.getElementById("selctAckNo").style.display="none";

document.getElementById("selctSecQuest").style.display="none";
document.getElementById("registerDscUsb").style.display="none";
document.getElementById("registerDscPfx").style.display="none";

if(document.getElementById("paswdOptionsecQuest").checked)
{
document.getElementById("selctSecQuest").style.display="";
}
if(document.getElementById("paswdOptionackNo")!=null && document.getElementById("paswdOptionackNo").checked)
{
document.getElementById("selctAckNo").style.display="";
}

if(document.getElementById("paswdOptiondscUpload").checked)
{
document.getElementById("selectDsc").style.display="";

if(document.getElementById("optionInfoDsc1").checked){
document.getElementById("registerDscPfx").style.display="";
}

if(document.getElementById("optionInfoDsc2").checked){
document.getElementById("registerDscUsb").style.display="";
}

}
}


function getMembershipName(){
var form = document.forms[0];
var field = form.elements['membershipNumber'];
var error = "The membership number is not registered with eFiling application";
var errorlength="Please enter a 6 digit CA membership number";
var errorBlank="Please enter CA Membership number";
var elementValue=field.value;
if(elementValue.length==0){
clearErrorLabelsXHTML (form);
clearErrorMessages (form);
document.getElementById("caName").value = "";
addError(field, errorBlank);
}
if(elementValue.length!=6){
clearErrorLabelsXHTML (form);
clearErrorMessages (form);
document.getElementById("caName").value = "";
addError(field, errorlength);
}
 if(elementValue.length==6){
var sessionId=document.getElementById("sessionId").value;
var xmlhttp;
var url = "/e-Filing/MyAccount/getCADetail.html?ID="+sessionId+"&membershipNumber="+elementValue;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.open("GET",url,"true");
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
				  var xml=xmlhttp.responseXML.getElementsByTagName("caName"); 
				  
			     var mmeCaName =xml[0].childNodes[0].nodeValue;
			     
			    
			    clearErrorLabelsXHTML (form);
			    clearErrorMessages (form);
			    
			    
			    if (mmeCaName !=  "null") {
			    	
			    	
			    
			     	document.getElementById("caName").value = mmeCaName;
			     	
			     }
			    else {  
			    
			    	document.getElementById("caName").value = "";
			    			     	addError(field, error);
		   		 
		   	    }
		   	    
		   	    
    }
    };
  }
xmlhttp.send(null);
}
function clearErrorMessagesSaras(form) {
	
	var allTrTags = form.getElementsByTagName("tr");
	for (var i = 0; i < allTrTags.length; i++) {
        var tableRow = allTrTags[i];
		if (tableRow.getAttribute("className") == "errorFor" || tableRow.getAttribute("class") == "errorFor") {
			var paapu  = tableRow.parentNode;
			paapu.deleteRow(tableRow.rowIndex);
		}
    }
}
function checkFormLinked(){
if(document.getElementById("idFormLink1").checked){
	document.forms[0].action="/e-Filing/MyAccount/addFormLinkCA.html";
	document.forms[0].submit();
}
if(document.getElementById("idFormLink2").checked){
enableAddCADetails();
	document.forms[0].action="/e-Filing/MyAccount/resetLinkCA.html";
	document.forms[0].submit();
}
}

function populateProblemCategory(elem){

	var selectedIndex = elem.value;
	var opts = document.getElementById("problemTypeStore").options;
	var problemList = document.getElementById("problemType");
		
	problemList.options.length=0;
	problemList.options[0] =new Option('Select Problem/Issue','-1');
	var cat = "";
	var index = 1;
	var i = 0;
	var len = opts.length;
	for(i=0;i<len;i++){
		cat = opts[i].value.substring(0,2);
		if(cat==elem.value){
			problemList.options[index] = new Option(opts[i].text, opts[i].value.substring(opts[i].value.lastIndexOf('/')+1));
			index = index + 1;
		}
	}

}
function submitGrievanceFinal(){	
	
	
	var problemListValue=document.getElementById("problemType").value;
	var problemList = document.getElementById("problemType");
	
	

	validateGrievanceAttachment();
}


function getEfilingHistory(){

	if (document.getElementById('EfilingHistory').innerHTML.length == "" || document.getElementById('EfilingHistory').innerHTML.length == 0)
	{

	var xmlhttp;

	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari

	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5

	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.onreadystatechange=function()
	  {

	  if (xmlhttp.readyState==4 && xmlhttp.status==200)
	    {

		document.getElementById('EfilingHistory').innerHTML = xmlhttp.responseText;
		document.getElementById('EfilingHistory').focus();

		}
	  };

	
	//xmlhttp.open("GET","/e-Filing/MyAccount/ViewEfilingHistoryAtHome.html",true);
	xmlhttp.open("GET","/e-Filing/MyAccount/ViewEfilingHistoryAtHome.html?"+Math.random(),true);

	xmlhttp.send(null);
	}
}

function validateGrievanceAttachment(){
	
	var selected = document.getElementById("problemType").value;

	var form = document.forms[0];
	

	if(selected == 7 || selected == 8 || selected == 20){
		
		document.getElementById("attachment").style.display = "none";
		
		//Clears errors for attachment field
		
		clearFieldErrorLabels(form.elements['attachment']);
		clearFieldErrorMessages(form.elements['attachment']);
		
	} else {
		
		document.getElementById("attachment").style.display = "";		
	
	}
	
	if(( (selected >= 1)&& (selected <= 10) ) || (selected == 15) || (selected ==16) 
			|| (selected == 23) || (selected == 24) || (selected == 25) || selected == '-1'){
		
		document.getElementById("assessmentYear").style.display = "";		
		
	} else {
		
		document.getElementById("assessmentYear").style.display = "none";
	}
}



function displayDscSignUpload() {
		document.getElementById("signWithDscUsb").style.display = "none";
		document.getElementById("signWithDscPfx").style.display = "none";
		if (document.getElementById("optionTypeOfDsc1").checked) {
			document.getElementById("signWithDscPfx").style.display = "";
		} 
		if (document.getElementById("optionTypeOfDsc2").checked) {
			document.getElementById("signWithDscUsb").style.display = "";
		}
}

function populateRejectionComments(){
	
	
	if (document.getElementById("approvalChoiceR").checked) {
		
		document.getElementById("rejectionComments").style.display = "";
	}
	else{
		document.getElementById("rejectionComments").style.display = "none";
	}
	
	if(document.getElementById('noRegDscFlag').value == 'N'){
		document.getElementById("registerDscPfx").style.display = "none";
		document.getElementById("registerDscUsb").style.display = "none";
		if (document.getElementById("optionInfoDsc1").checked) {
				document.getElementById("registerDscPfx").style.display = "";
			} else if (document.getElementById("optionInfoDsc2").checked) {
				document.getElementById("registerDscUsb").style.display = "";
			}
			
		}
	
}

function displayDscSignBulkUpload() {
                document.getElementById("signWithDscUsb").style.display = "none";
                document.getElementById("signWithDscPfx").style.display = "none";
                if (document.getElementById("optionTypeOfDsc1").checked) {
                        document.getElementById("signWithDscPfx").style.display = "";
                } else if (document.getElementById("optionTypeOfDsc2").checked) {
                        document.getElementById("signWithDscUsb").style.display = "";
                }
}

function proceedItdRegistration () {
	var contValue = "N";
	if (document.getElementById('option1').checked) {
		contValue = "Y";
	}
	
	var input = document.createElement("input");

	input.setAttribute("type", "hidden");
	input.setAttribute("name", "option");
	input.setAttribute("value", contValue);
	var formSaras = document.forms[0];
	formSaras.elements['option'].value = contValue;
	formSaras.submit();
	}
	



function retryToRegistration() {

	if (document.getElementById("option2").checked) {
			var contValue = "N";	
			var divElement = document.getElementById("optionContinue");
			
				if (divElement != null) {
					divElement.parentNode.removeChild(divElement);
				}
				
				
				contValue = "R";
				
				var input = document.createElement("input");

				input.setAttribute("type", "hidden");
				input.setAttribute("name", "option");
				input.setAttribute("value", contValue);
				var formSaras = document.forms[0];
				formSaras.elements['option'].value = contValue;
				formSaras.submit();
		}
}
function populateSubCategory(){
	var category = document.getElementById("category").value;
	var subCategoryList = document.getElementById("subCategory");
	subCategoryList.options.length=0;
	subCategoryList.options[0] =new Option('Select sub-category','-1');
	if(category=='C103'){
		subCategoryList.options[1] =new Option('Resend print to ITR address','C10301');
		subCategoryList.options[2] =new Option('Resend print to PAN address','C10302');
		subCategoryList.options[3] =new Option('Resend Print to new address','C10303');
		subCategoryList.options[4] =new Option('Resend by e-mail','C10304');
		
	}
	else if(category=='C101'){
		subCategoryList.options[1] =new Option('By print to ITR address','C10101');
		subCategoryList.options[2] =new Option('By print to PAN address','C10102');
		subCategoryList.options[3] =new Option('By Print to new address','C10103');
		subCategoryList.options[4] =new Option('Resend by e-mail','C10104');
		subCategoryList.options[5] =new Option('Latest by print to ITR address','C10105');
		subCategoryList.options[6] =new Option('Latest by print to PAN address','C10106');
		subCategoryList.options[7] =new Option('Latest by print to New address','C10107');
		subCategoryList.options[8] =new Option('Latest by e-mail','C10108');
	}
	subCategoryList.selectedIndex = 0;
	displayIntimationAddress();
}
function displayIntimationAddress(){
	
	var subCategory = document.getElementById("subCategory").value;
	var addressDiv = document.getElementById('address');
	var cpcRefDiv = document.getElementById('cpcRefDiv');
	if(subCategory=='C10303' || subCategory=='C10103' || subCategory=='C10107'){
		addressDiv.style.display="";
	}
	else{
		addressDiv.style.display="none";
	}
	
	if(subCategory=='C10101' || subCategory=='C10102' || subCategory=='C10103' || subCategory=='C10104'){
		cpcRefDiv.style.display = '';
	}
	else{
		cpcRefDiv.style.display = 'none';
	}
}

function validateFeedback() {
var fields = ['content','navigation','design','speed'];
var msgs = ['Please provide feedback on Content & Information',
			'Please provide feedback on Ease of Navigation/ User Friendliness',
			'Please provide feedback on Layout & Design',
			'Please provide feedback on Page Download Speed'];
var form = document.forms[0];
var checked = false;
	for(var i = 0; i< fields.length; i++){
		var elements = form.elements[fields[i]];
		checked = false;
		for (var j = 0; j < elements.length; j++) {
			if (elements[j].checked) {
				checked = true;
				break;
			} 
		}
		if(!checked){
			alert(msgs[i]);
			return false;
		}
	}
	return svalidateForm_SubmitFeedback(document.forms[0]);
}

function changeTicketForm(){
	var form = document.getElementById('ticketDetailsForm');
	var choices = form.elements['opt'];
	if(choices==null){
		return;
		}
	var val = 'R';
	for(var i=0; i < choices.length; i++){
		if(choices[i].checked){
			val=choices[i].value;
		}
	}
	var resolveDiv = document.getElementById('resolve');
	var reassignDiv = document.getElementById('reassign');
	var resolveButton = document.getElementById('resolveBt');
	var reassignButton = document.getElementById('reassignBt');
	if(val=='R'){
		resolveDiv.style.display = '';
		resolveButton.style.display = '';
		reassignDiv.style.display = 'none';
		reassignButton.style.display = 'none';
	}else{
		resolveDiv.style.display = 'none';
		resolveButton.style.display = 'none';
		reassignDiv.style.display = '';
		reassignButton.style.display = '';
	}
	
}
function showDob(field,clearError) {
	if(clearError){
    clearFieldErrorMessages(field);
    clearFieldErrorLabels(field);
	}
	var userId = field.value;
	var dobField = document.getElementById('dateField');
	var tr = dobField.parentNode.parentNode.parentNode;
	tr.style.display="none";
    var errors = false;
    var continueValidation = true;
    if (continueValidation &&
        userId != null &&
        (userId == "" ||
        userId.replace(/^\s+|\s+$/g, "").length == 0)) {
        errors = true;
        continueValidation = false;
    }
    if (continueValidation && userId != null) {
        if (7 > -1 && userId.length < 7 || 10 > -1 && userId.length > 10) {
            errors = true;
            continueValidation = false;
        }
    }
	if(!errors){
		if(userId.match('^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]$|^[Aa][Rr][Cc][Aa][0-9]{6}$')){
			tr.style.display = '';
		}
	}
}
function showDobHome(field){
	var userId = field.value;
	var dobField = document.getElementById('dobTable');
	dobField.style.display = 'none';
			if(userId.match('^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]$|^[Aa][Rr][Cc][Aa][0-9]{6}$')){
			dobField.style.display = '';
		}
}


function  copyFields (sourceId,destinationId) {

	if (document.getElementById("add_check").checked) {
		document.getElementById(destinationId).value = document.getElementById(sourceId).value ;
	}
	
}


function  copyState (sourceId,destinationId) {

	if (document.getElementById("add_check").checked) {
		document.getElementById(destinationId).value = document.getElementById(sourceId).value;
		document.getElementById("per_state_val").value = document.getElementById(sourceId).value;
	}
	
}

function copyCountry(sourceId,destinationId) {

	if (document.getElementById("add_check").checked) {
		document.getElementById(destinationId).value = document.getElementById(sourceId).value;
		document.getElementById("per_country_val").value = document.getElementById(sourceId).value;
	}
	
}

function backToGrievancePage(){

var sessionId=document.getElementById("sessionId").value;
alert(sessionId);

document.forms[0].action="/e-Filing/MyServices/viewGrievanceStatusLink.html?ID="+sessionId;
		document.forms[0].submit();

}
function dispAddClientOptions(){


		document.getElementById("secOptionD").style.display="none";
		document.getElementById("secOptionC").style.display="none";

		if (document.getElementById("radioDsc3").checked) {
			

			document.getElementById("secOptionC").style.display="";
			

		}

		else if (document.getElementById("radioDsc4").checked) {
			

			document.getElementById("secOptionD").style.display="";

		}
		else if (document.getElementById("radioDsc2").checked) {
			

		}



}

function syncSubject(elem,form){
	var subs = new Array(7);

	subs[0] = document.getElementById('onlineForm_'+form+'_declaration_point1_iWe');
	subs[1] = document.getElementById('onlineForm_'+form+'_declaration_point2_iWe');
	subs[2] = document.getElementById('onlineForm_'+form+'_declaration_point3_iWe1');
	subs[3] = document.getElementById('onlineForm_'+form+'_declaration_point3_iWe2');
	subs[4] = document.getElementById('onlineForm_'+form+'_declaration_point4_myOur1');
	subs[5] = document.getElementById('onlineForm_'+form+'_declaration_point4_myOur2');
	subs[6] = document.getElementById('onlineForm_'+form+'_declaration_point4_meUs');
	
	var index = elem.selectedIndex;
	for(var i=0;i<7;i++){
		subs[i].selectedIndex=index;
	}
}


function showPoint2(elem,form){
	var pt2 = document.getElementById('onlineForm_'+form+'_annexure_specifications_point2');
	pt2.disabled = true;
	if(elem.value=='N'){
		pt2.disabled = false;
	}
	showPoint3(form);
}

function showPoint3(form){
	var pt3 = new Array(4);
	var pt2 = document.getElementById('onlineForm_'+form+'_annexure_specifications_point2');
	var pt1 = document.getElementById('onlineForm_'+form+'_annexure_specifications_point1');
	pt3[0]=document.getElementById('onlineForm_'+form+'_annexure_specifications_point3_previousYear');
	pt3[1]=document.getElementById('onlineForm_'+form+'_annexure_specifications_point3_amount');
	pt3[2]=document.getElementById('onlineForm_'+form+'_annexure_specifications_point3_authorityName');
	pt3[3]=document.getElementById('onlineForm_'+form+'_annexure_specifications_point3_lastDate');
	for(var i=0;i<4;i++){
		pt3[i].disabled=true;
		if(pt2.value=='Y' && pt1.value=='N'){
			pt3[i].disabled=false;
		}
	}
	
}

function showAssessmentYear(elem){
	var assYear = document.getElementById('onlineForm_onlineForm_annexure_deductionClaimed_assessmentYear');
	var dedType = document.getElementById('onlineForm_onlineForm_annexure_deductionClaimed_deductionType');
	var deductionClaimed = elem.value;
	if(deductionClaimed=='Y'){
		assYear.disabled = false;
		dedType.disabled = false;
	}else{
		assYear.disabled = true;
		dedType.disabled = true;
	}
}

function syncAddress(elem,form){
	document.getElementById('onlineForm_'+form+'_declaration_point2_address').value = elem.value;
	document.getElementById('onlineForm_'+form+'_annexure_address').value = elem.value;
}

function prepareForm(form,subSectorVal){
	var pt1 = document.getElementById('onlineForm_'+form+'_annexure_specifications_point1');
	showPoint2(pt1,form);
	populateSubSector(document.getElementById('onlineForm_onlineForm_annexure_sectorName'),form);
	document.getElementById('onlineForm_'+form+'_annexure_businessNature').value=subSectorVal;
	var f56h_amt = document.getElementById('onlineForm_'+form+'_annexure_deductionClaimed_isTrue');
	if(f56h_amt!=null){
		showAssessmentYear(f56h_amt);
	}
}

function resetActiveClass(){

	document.getElementById('indHuf').setAttribute("class","");
	document.getElementById('firms').setAttribute("class","");
	document.getElementById('Companies').setAttribute("class","");
	document.getElementById('AOP_BOI_LA').setAttribute("class","");
	document.getElementById('Tax_Professionals').setAttribute("class","");
	document.getElementById('ERIs').setAttribute("class","");
	document.getElementById('Artificial_Judicial_Person').setAttribute("class","");
	document.getElementById('Cooperative_Society').setAttribute("class","");
	document.getElementById('ITD').setAttribute("class","");
	document.getElementById('Others').setAttribute("class","");
	document.getElementById('News_Updates').setAttribute("class","");
	document.getElementById('List_of_ERIs').setAttribute("class","");
	document.getElementById('Download_IT_Returns').setAttribute("class","");
	document.getElementById('PDF_Form_View_utility').setAttribute("class","");
	document.getElementById('Brochures_Demos').setAttribute("class","");
	document.getElementById('Tax_Calculator').setAttribute("class","");
	document.getElementById('Apply_online_PAN_TAN').setAttribute("class","");
	
	
}

function getStaticPageOnHighlightNavigation(staticContentsUrl,activeId){
	resetActiveClass();
	activeId.parentNode.setAttribute("class","active");
	getStaticPage(staticContentsUrl);
}

function getStaticPageOnHighlightTab(staticContentsUrl,activeId){
	resetActiveClass();
	document.getElementById(activeId).setAttribute("class","active");
	getStaticPage(staticContentsUrl);
}


function enableUnsuccessFields () {

	var form = document.forms[0];
	form.elements['userContactDetails.emailId'].readOnly=false;
	form.elements['userContactDetails.mobileNumber'].readOnly=false;


	var checkList = form.elements['userIdentityCheckDetails.securityOption'];
					
			for (var i = 0; i < checkList.length; i++) {

				checkList[i].disabled=false;

			}
		
		var dscRadio = form.elements['userDscFileDetails.typeOfDsc'];

			for (var i = 0; i < dscRadio.length; i++) {

				dscRadio[i].disabled=false;

			}

		

			var divElement = document.getElementById("optionToSendToItd");

				if (divElement != null) {
					divElement.parentNode.removeChild(divElement);
				}

		


		form.elements['userContactDetails.emailId'].readOnly=false;
		form.elements['userContactDetails.mobileNumber'].readOnly=false;

		checkList.disabled=false;
		dscRadio.disabled=false;

		form.elements['userIdentityCheckDetails.dedtrTan'].readOnly=false;
		form.elements['userIdentityCheckDetails.financialYear'].disabled=false;
		form.elements['userIdentityCheckDetails.bankBsrCode'].readOnly=false;
		form.elements['userIdentityCheckDetails.amountPaid'].readOnly=false;
		form.elements['userIdentityCheckDetails.asstYear'].disabled=false;

			form.elements['continue'].disabled=false;
		displayIndOption();

}

function backToPANFirst(){
	var varRandNum = document.forms[0].elements['KnowYourPanDtls_requestId'].value;
	document.forms[0].action= "/e-Filing/Services/BackToFirst.html?ID="+varRandNum;
	document.forms[0].onsubmit ="";
	document.forms[0].submit();
}

function disableAddCADetails() {


		var form = document.forms[0];
		form.elements['membershipNumber'].readOnly="readonly";
		form.elements['caName'].readOnly="readonly";
		form.elements['formName'].disabled=true;
		form.elements['assessmentYear'].disabled=true;
		form.elements['captchaCode'].readOnly="readonly";
	
		form.elements['buttonType'].disabled=true;
        form.elements['cancel'].disabled=true;
}
function enableAddCADetails() {

		var form = document.forms[0];


		form.elements['membershipNumber'].readOnly=false;
		form.elements['caName'].readOnly=false;
		form.elements['formName'].disabled=false;
		form.elements['assessmentYear'].disabled=false;


		form.elements['captchaCode'].readOnly=false;
		form.elements['buttonType'].disabled=false;
        form.elements['cancel'].disabled=false;
	
}


		

function clearErrorMessageForDateField(dateFieldName) {

	var fieldName = document.getElementById(dateFieldName);
	var fieldValue = document.getElementById(dateFieldName).value;

	if (fieldValue.replace(/^\\s+|\\s+$/g,'').length != 0  && checkDate(fieldValue)  ) {

		clearFieldErrorMessages(fieldName);
		clearFieldErrorLabels(fieldName);

	}


}


function svalidateField_pan(field, toclear) {
	if (toclear) {
		clearFieldErrorMessages(field);
		clearFieldErrorLabels(field);
	}
	var errors = false;
	var continueValidation = true;
	if (continueValidation
			&& (field.value != null)
			&& ((field.value == '') || (field.value.replace(/^\s+|\s+$/g, '').length == 0))) {
		var error = "Please enter the PAN";
		addError(field, error);
		errors = true;
		continueValidation = false;
	}
	if (continueValidation && field.value != null) {
		var value = field.value;
		if ((10 > -1 && value.length < 10) || (10 > -1 && value.length > 10)) {
			var error = "Incorrect PAN. Please retry";
			addError(field, error);
			errors = true;
			continueValidation = false;
		}
	}
	return !errors;
}
function svalidateField_content(field, toclear) {
	if (toclear) {
		clearFieldErrorMessages(field);
		clearFieldErrorLabels(field);
	}
	var errors = false;
	var continueValidation = true;
	if (continueValidation
			&& (field.value != null)
			&& ((field.value == '') || (field.value.replace(/^\s+|\s+$/g, '').length == 0))) {
		var error = "Please provide your feedback on Content & Information";
		addError(field, error);
		errors = true;
		continueValidation = false;
	}
	return !errors;
}
function svalidateField_navigation(field, toclear) {
	if (toclear) {
		clearFieldErrorMessages(field);
		clearFieldErrorLabels(field);
	}
	var errors = false;
	var continueValidation = true;
	if (continueValidation
			&& (field.value != null)
			&& ((field.value == '') || (field.value.replace(/^\s+|\s+$/g, '').length == 0))) {
		var error = "Please provide feedback on Ease of Navigation/User Friendliness";
		addError(field, error);
		errors = true;
		continueValidation = false;
	}
	return !errors;
}
function svalidateField_design(field, toclear) {
	if (toclear) {
		clearFieldErrorMessages(field);
		clearFieldErrorLabels(field);
	}
	var errors = false;
	var continueValidation = true;
	if (continueValidation
			&& (field.value != null)
			&& ((field.value == '') || (field.value.replace(/^\s+|\s+$/g, '').length == 0))) {
		var error = "Please provide feedback on Layout & Design";
		addError(field, error);
		errors = true;
		continueValidation = false;
	}
	return !errors;
}
function svalidateField_speed(field, toclear) {
	if (toclear) {
		clearFieldErrorMessages(field);
		clearFieldErrorLabels(field);
	}
	var errors = false;
	var continueValidation = true;
	if (continueValidation
			&& (field.value != null)
			&& ((field.value == '') || (field.value.replace(/^\s+|\s+$/g, '').length == 0))) {
		var error = "Please provide feedback on Page Download Speed";
		addError(field, error);
		errors = true;
		continueValidation = false;
	}
	return !errors;
}
function svalidateField_captchaCode(field, toclear) {
	if (toclear) {
		clearFieldErrorMessages(field);
		clearFieldErrorLabels(field);
	}
	var errors = false;
	var continueValidation = true;
	if (continueValidation
			&& (field.value != null)
			&& ((field.value == '') || (field.value.replace(/^\s+|\s+$/g, '').length == 0))) {
		var error = "Please enter the Code as appearing in the Image";
		addError(field, error);
		errors = true;
		continueValidation = false;
	}
	if (continueValidation && field.value != null) {
		var value = field.value;
		if ((6 > -1 && value.length < 6) || (6 > -1 && value.length > 6)) {
			var error = "Invalid Code. Please retry";
			addError(field, error);
			errors = true;
			continueValidation = false;
		}
	}
	return !errors;
}
function svalidateForm_SubmitFeedback(form) {
	clearErrorMessages(form);
	clearErrorLabels(form);
	var errors = true;
	errors = svalidateField_pan(form.elements['pan'], false) && errors;
	errors = svalidateField_content(form.elements['content'], false) && errors;
	errors = svalidateField_navigation(form.elements['navigation'], false)
			&& errors;
	errors = svalidateField_design(form.elements['design'], false) && errors;
	errors = svalidateField_speed(form.elements['speed'], false) && errors;
	errors = svalidateField_captchaCode(form.elements['captchaCode'], false)
			&& errors;
	return errors;
}

function setCountryForState(elem,countryId){
	if(elem.value=='99' || elem.value=='-1'){
		document.getElementById(countryId).disabled = false;
		document.getElementById(countryId+'_val').disabled = true;
		document.getElementById(countryId).value = "-1";
		document.getElementById(countryId+'_val').value = "-1";
	} else {
		document.getElementById(countryId).value = "91";
		document.getElementById(countryId).disabled = true;
		document.getElementById(countryId+'_val').value = "91";
		document.getElementById(countryId+'_val').disabled = false;
	}
}



function setStateForCountry(elem,stateId){
	if(elem.value=='91'){
		elem.disabled = true;
		document.getElementById(elem.id+'_val').disabled = false;
		document.getElementById(stateId).value = "-1";
		document.getElementById(stateId+'_val').value = "-1";
	} else if(elem.value!=-1){
		document.getElementById(stateId).value = "99";
		document.getElementById(stateId+'_val').value = "99";
	}
}

function getWorklist(i){
	var varRandNum = document.forms[0].elements['ID'].value;
	document.forms[0].action= "/e-Filing/MyAccount/ViewMyWorkListLink.html?ID="+varRandNum+'&page='+i;
	document.forms[0].onsubmit ="";
	document.forms[0].submit();

}

function getSearchWorklist(i,parameter){
	var varRandNum = document.forms[0].elements['ID'].value;
	document.forms[0].action= "/e-Filing/MyAccount/SearchWorklist.html?ID="+varRandNum+'&page='+i+'&parameter='+parameter;
	document.forms[0].onsubmit ="";
	document.forms[0].submit();

}

function getTickets(i){
	var varRandNum = document.forms[0].elements['requestId'].value;
	document.forms[0].action= "/e-Filing/MyAccount/ViewMyTicketsLink.html?ID="+varRandNum+'&page='+i;
	document.forms[0].onsubmit ="";
	document.forms[0].submit();
}

function downloadThisSchemas(formName,formType,asstYear){
	
	var submitForm = getNewSubmitForm();
	
	var assessmentYearInput = document.createElement("input");
	
	assessmentYearInput.setAttribute("type", "hidden");
	assessmentYearInput.setAttribute("name", "assessmentYear");
	assessmentYearInput.setAttribute("value", asstYear);
	var formNameInput = document.createElement("input");
	
	formNameInput.setAttribute("type", "hidden");
	formNameInput.setAttribute("name", "formName");
	formNameInput.setAttribute("value", formName);
	var formTypeInput = document.createElement("input");
	
	formTypeInput.setAttribute("type", "hidden");
	formTypeInput.setAttribute("name", "fileType");
	formTypeInput.setAttribute("value", formType);
	
	submitForm.appendChild(assessmentYearInput);
	submitForm.appendChild(formNameInput);
	submitForm.appendChild(formTypeInput);
	
	var varRandNum = document.forms[0].elements['requestId'].value;
	submitForm.action= "/e-Filing/MyAccount/DownloadSchemasAction.html?ID="+varRandNum;
	submitForm.submit();	
}


function clearSampleData(){
	
	document.getElementById("sampleData").style.display = "none";
}

function downloadSampleData(scenario){
	
	var formName=document.getElementById('itrType').value;
	
	var submitForm = getNewSubmitForm();
	
	var asstYear = "2012";
	if (document.getElementById('asstYear') != null) {
		asstYear =  document.getElementById('asstYear').value;
	}

	var assessmentYearInput = document.createElement("input");
	
	assessmentYearInput.setAttribute("type", "hidden");
	assessmentYearInput.setAttribute("name", "assessmentYear");
	assessmentYearInput.setAttribute("value", asstYear);
	
	var formNameInput = document.createElement("input");
	
	formNameInput.setAttribute("type", "hidden");
	formNameInput.setAttribute("name", "formName");
	formNameInput.setAttribute("value", formName);
	
	var scenarioInput = document.createElement("input");
	
	scenarioInput.setAttribute("type", "hidden");
	scenarioInput.setAttribute("name", "scenario");
	scenarioInput.setAttribute("value", scenario);
	
	submitForm.appendChild(assessmentYearInput);
	submitForm.appendChild(formNameInput);
	submitForm.appendChild(scenarioInput);
	
	var varRandNum = document.forms[0].elements['requestId'].value;

	submitForm.action= "/e-Filing/MyAccount/DownloadSampleData.html?ID="+varRandNum;
	submitForm.submit();	

}
function resetFields(){
	var elements = document.forms[0].elements;
	var type = '';
	for(e in elements){
		type = elements[e].type;
		if( type == 'text' ||  type == 'textarea'){
			if(elements[e].readOnly==false){
				elements[e].value = '';
			}
 		}else if(type == 'select-one'){
			elements[e].value = '-1';
		}
	}
	return false;
}


function showResponseSheet(pdfKey){
	var newDispForm = getNewSubmitForm();
	newDispForm.action= "/e-Filing/Services/DownloadPdf.html?ID="+document.getElementsByName('requestId')[0].value+"&pdfGenKey="+pdfKey;
	newDispForm.submit();		
}


function showPdf(pdfKey){
	var newDispForm = getNewSubmitForm();
	newDispForm.action= "/e-Filing/Services/DownloadPdf.html?ID="+document.getElementsByName('requestId')[0].value+"&pdfGenKey="+pdfKey;
	newDispForm.submit();		
}

function gotoPage(url){
	window.location = url;
}
function setBaseUrl(url){
		baseUrl = url;
	}
	
function viewDemandDetails(din,asstYear,section,demandAdjustAmt,pan)
{
	var submitForm = getNewSubmitForm();
	createNewFormElement(submitForm,"requestId", document.getElementById('sessionId').value);
	createNewFormElement(submitForm,"din", din);
	createNewFormElement(submitForm,"asstYear", asstYear);
	createNewFormElement(submitForm,"section", section);
	createNewFormElement(submitForm,"demandAjusted", demandAdjustAmt);
	createNewFormElement(submitForm,"pan", pan);
	submitForm.action= "/e-Filing/MyAccount/arrDemandDetails.html";
	submitForm.submit();
}
function getNotificationDetails(){


	if (document.getElementById('NotifyDetails').innerHTML.length == "" || document.getElementById('NotifyDetails').innerHTML.length == 0)
	{

	var xmlhttp;

	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari

	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5

	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.onreadystatechange=function()
	  {

	  if (xmlhttp.readyState==4 && xmlhttp.status==200)
	    {

		document.getElementById('NotifyDetails').innerHTML = xmlhttp.responseText;
		document.getElementById('NotifyDetails').focus();

		}
	  };

	

	xmlhttp.open("GET","/e-Filing/MyAccount/ViewNotifyDetails.html?"+Math.random(),true);

	xmlhttp.send(null);
	}
}

function keyPress(e,elem){
  var x = e || window.event;
  var key = (x.keyCode || x.which);
    if(key == 13 || key == 3){
     
     var inputTag=document.getElementsByTagName('input');
	 
	 for(var i in inputTag){
	 
	 if(inputTag[i].type=='submit'){
	 
	 inputTag[i].click();
	 }
    }
 }
 }
 
 	function displayForm(resetField) {
		var bankDtl = document.getElementById('bankDetails');
		var addrdtl = document.getElementById('newAddress');
		var radios = document.forms[0].elements['refundSelect'];
		
		bankDtl.style.display = 'none';
		addrdtl.style.display = 'none';

			if(document.getElementById('category').value=='C10203'){
				addrdtl.style.display = '';
			}			
	
			if(document.forms[0].elements['changeAcc'][0].checked){
				bankDtl.style.display = '';
			}	
	}
function backToRequestList() {
var varRandNum = document.forms[0].elements['requestId'].value;
document.forms[0].action= "/e-Filing/MyServices/viewGrievanceStatusLink.html?ID="+varRandNum;
document.forms[0].onsubmit ="";
document.forms[0].submit();
}


function displayMandatory(field) {

	var tableCellElement = field.parentNode.parentNode;

	var nodeList = tableCellElement.childNodes;
	
	for (var i = 0; i < nodeList.length; i++) {
		var node = nodeList[i];

			if (node.nodeName == 'DIV') {
		 i = nodeList.length;
	

				var divNodeList = node.childNodes;

					for (var i = 0; i < divNodeList.length; i++) {

						var spanElement = divNodeList[i];

						if (spanElement.nodeName == 'SPAN') { 

								spanElement.innerHTML = "*";
								
								return;

						}

					}
					
		var span = document.createElement("span");
		var error = document.createTextNode("*");
		span.setAttribute("class", "mandatory");
		span.setAttribute("className", "mandatory");
        span.appendChild(error);
        node.appendChild(span);
			}


	}
}

function displayOptional(field) {

	var tableCellElement = field.parentNode.parentNode;

	var nodeList = tableCellElement.childNodes;
	
		for (var i = 0; i < nodeList.length; i++) {
			var node = nodeList[i];

				if (node.nodeName == 'DIV') {

				i = nodeList.length;

				var divNodeList = node.childNodes;

					for (var i = 0; i < divNodeList.length; i++) {

						var spanElement = divNodeList[i];

						if (spanElement.nodeName == 'SPAN') { 

								spanElement.innerHTML = "";
								
								return;

						}

					}
				
				}

		}
}

function backToSecuredPage() {
	var varRandNum = document.forms[0].elements['requestId'].value;
	document.forms[0].action= "/e-Filing/UserLogin/SecuredLoginHomeLink.html";
	document.forms[0].onsubmit ="";
	document.forms[0].submit();
	
}
function searchWorklist() {
	
	var userSelectedValue=document.getElementById("userSelection").value;
	
	if(userSelectedValue == "worklistId"){
	
		document.getElementById("worklistId").parentElement.parentNode.style.display="";
		document.getElementById("submittedBy").parentElement.parentNode.style.display="none";
		document.getElementById("submittedBy").value="";
		
	}else if(userSelectedValue == "submittedBy"){
		
		document.getElementById("submittedBy").parentElement.parentNode.style.display="";
		document.getElementById("worklistId").parentElement.parentNode.style.display="none";
		document.getElementById("worklistId").value="";
	}else{
	
	document.getElementById("worklistId").parentElement.parentNode.style.display="none";
	document.getElementById("submittedBy").parentElement.parentNode.style.display="none";
	document.getElementById("submittedBy").value="";
	document.getElementById("worklistId").value="";
	
	}
	
}

function openForm(nForm, width, height){
		var d = new Date();
		windowname = d.getTime();
		window.open('', windowname, 'top=100,left=100,height='+height+',width=' + width+ ',location=no,resizable=no,scrollbars=yes,status=yes,toolbar=no,directories=no,menubar=yes,dependent=yes');
		nForm.target=windowname;
		nForm.submit();
	}
function getCaDtls(i){
		var varRandNum = document.forms[0].elements['ID'].value;
		document.forms[0].action= "/e-Filing/MyAccount/caDetails.html?ID="+varRandNum+'&page='+i;
		document.forms[0].onsubmit ="";
		document.forms[0].submit();

}

function getCaDtlsToDisengage(s)	{

		var array = document.getElementsByTagName("input");
		var flag=false;

		for(var i = 0; i < array.length; i++)
		{
		   if(array[i].type == "checkbox" &&  array[i].checked)
		   {
				flag = true;
				break;

		   }
		}
		
	if(flag){
	 var continueTo= confirm("Selected check boxes will be deselected on page navigation. Press 'OK' to continue or press 'CANCEL' to stay back");
	 if (continueTo == true)
	 {
	  	var varRandNum = document.forms[0].elements['ID'].value;
		document.forms[0].action= "/e-Filing/MyAccount/DisengageCaDtls.html?ID="+varRandNum+'&page='+s;
		document.forms[0].onsubmit ="";
		document.forms[0].submit();
	 }
	 }else{
	 
	 	var varRandNum = document.forms[0].elements['ID'].value;
		document.forms[0].action= "/e-Filing/MyAccount/DisengageCaDtls.html?ID="+varRandNum+'&page='+s;
		document.forms[0].onsubmit ="";
		document.forms[0].submit();
	 
	 }
	}	
	
function bulkPanStatusSearchBy() {
	
	var userSelectedValue=document.getElementById("searchBy").value;
	
	if(userSelectedValue == "tokenNumber"){
	
		document.getElementById("tokenNumber").parentElement.parentNode.style.display="";
		document.getElementById("dateField1").parentElement.parentNode.style.display="none";
		document.getElementById("dateField").parentElement.parentNode.style.display="none";
		document.getElementById("dateField1").value="";
		document.getElementById("dateField").value="";
		
	}else if(userSelectedValue == "date"){
		
		document.getElementById("dateField1").parentElement.parentNode.style.display="";
		document.getElementById("dateField").parentElement.parentNode.style.display="";
		document.getElementById("tokenNumber").parentElement.parentNode.style.display="none";
		document.getElementById("tokenNumber").value="";
	}else{
	
	document.getElementById("tokenNumber").parentElement.parentNode.style.display="none";
	document.getElementById("dateField1").parentElement.parentNode.style.display="none";
	document.getElementById("dateField").parentElement.parentNode.style.display="none";
	document.getElementById("tokenNumber").value="";
	document.getElementById("dateField").value="";
	document.getElementById("dateField1").value="";
	
	}
	
}

function getBulkPanStatus(i){
		var varRandNum = document.forms[0].elements['ID'].value;
		document.forms[0].action= "/e-Filing/MyAccount/bulkPanStatusSearch.html?ID="+varRandNum+'&page='+i;
		document.forms[0].onsubmit ="";
		document.forms[0].submit();

}

function getTokenList(i){
		var varRandNum = document.forms[0].elements['ID'].value;
		document.forms[0].action= "/e-Filing/MyAccount/tokenListPaging.html?ID="+varRandNum+'&page='+i;
		document.forms[0].onsubmit ="";
		document.forms[0].submit();

}

function backToTokenList(){
		var varRandNum = document.forms[0].elements['ID'].value;
		document.forms[0].action= "/e-Filing/MyAccount/tokenDetailsLink.html?ID="+varRandNum;
		document.forms[0].onsubmit ="";
		document.forms[0].submit();

}

function backToArrearDemand(){
		var varRandNum = document.forms[0].elements['requestId'].value;
		document.forms[0].action= "/e-Filing/MyAccount/arrDemandConf.html?ID="+varRandNum;
		document.forms[0].onsubmit ="";
		document.forms[0].submit();

}


function loadUserProfileData()
{
var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {

  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
		
		document.getElementById('userProfileData').parentNode.innerHTML=xmlhttp.responseText;
	}
	

    };


xmlhttp.open("POST","/e-Filing/MyAccount/getProfileData.html?ID="+document.getElementById('sessionId').value,true);
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlhttp.send("userId="+ document.getElementById('userId').value);
}

	function backToTaxMismatchHome(){
		var varRandNum = document.forms[0].elements['ID'].value;
		document.forms[0].action= "/e-Filing/MyAccount/TaxMismatchLink.html?ID="+varRandNum;
		document.forms[0].onsubmit ="";
		document.forms[0].submit();

}



function getAsFormDtls(i){
		var varRandNum = document.forms[0].elements['ID'].value;
		document.forms[0].action='/e-Filing/MyAccount/CaPendingFormList.html?ID='+varRandNum+'&page='+i;
	document.forms[0].onsubmit ="";
	if(navigator.userAgent.indexOf('MSIE 8.0')==-1){
	document.forms[0].submit();
	}

}	

function backToReqList(){
	var varRandNum = document.forms[0].elements['ID'].value;
	document.forms[0].action= "/e-Filing/MyAccount/ViewMyRequestListLink.html?ID="+varRandNum;
	document.forms[0].onsubmit ="";
	document.forms[0].submit();

}


function backToRejectedFormList(){

var submitForm = getNewSubmitForm();
submitForm.setAttribute("name","formList");

var varRandNum = document.forms[0].elements['ID'].value;

submitForm.action='/e-Filing/MyAccount/ViewAuthRepWorkListLink.html?ID='+varRandNum;
submitForm.onsubmit ="";
submitForm.submit();
return false;


}

function openFormDownload( width, height){
	var d = new Date();


	var nForm=document.createElement("form");
	
	nForm.setAttribute('action',"/e-Filing/MyAccount/FormAttachments.html");
	
	var i = document.createElement("input"); //input element, text
	i.setAttribute('type',"hidden");
	i.setAttribute('name',"ID");
	i.setAttribute('value',document.getElementsByName('requestId')[0].value);
	nForm.appendChild(i);
	windowname = d.getTime();
	window.open('', windowname, 'top=100,left=100,height='+height+',width=' + width+ ',location=no,resizable=no,scrollbars=yes,status=yes,toolbar=no,directories=no,menubar=yes,dependent=yes');
	nForm.target=windowname;
	document.body.appendChild(nForm);
	nForm.submit();

	} 


function backToApprovalList(){
	var nForm=document.forms[0];
	nForm.target='';
	nForm.setAttribute('action',"/e-Filing/MyAccount/ApprovalOfFormsLink.html");
	nForm.setAttribute('method','GET')
	var i = document.createElement("input"); //input element, text
	i.setAttribute('type',"hidden");
	i.setAttribute('name',"ID");
	i.setAttribute('value',document.getElementsByName('requestId')[0].value);
	nForm.appendChild(i);
	
	nForm.submit();
	
}

function  nrfdDtls(){
	
	var val =document.getElementById("nrfdFlag").checked;
	
	if(val){
		
		document.getElementById("nrfdFlagValue").value='Y';
		document.getElementById("contactPAN").value="";
		document.getElementById("contactPAN").parentNode.parentNode.style.display="none";

	}else{
		
		document.getElementById("nrfdFlagValue").value='N';
		
		document.getElementById("contactPAN").parentNode.parentNode.style.display="";
		
	}
}

function backToMyReturnHome(){

var submitForm = getNewSubmitForm();
submitForm.setAttribute("name","myReturn");

var varRandNum =  document.getElementById('sessionId').value;

submitForm.action='/e-Filing/MyAccount/ViewReturnFormLink.html?ID='+varRandNum;
submitForm.onsubmit ="";
submitForm.submit();

}

function backToRefundHome(){

var submitForm = getNewSubmitForm();
submitForm.setAttribute("name","refund");

var varRandNum = document.getElementById('sessionId').value;

submitForm.action='/e-Filing/MyAccount/RefundStatusLink.html?ID='+varRandNum;
submitForm.onsubmit ="";
submitForm.submit();


}


function backToClientHistoryHome(){

var submitForm = getNewSubmitForm();
submitForm.setAttribute("name","clientHistory");

var varRandNum = document.getElementById('sessionId').value;

submitForm.action='/e-Filing/MyAccount/viewClientHistoryLink.html?ID='+varRandNum;
submitForm.onsubmit ="";
submitForm.submit();


}

function backToClientHome(){

var submitForm = getNewSubmitForm();
submitForm.setAttribute("name","clientHome");

var varRandNum = document.getElementById('sessionId').value;

submitForm.action='/e-Filing/MyAccount/clientDetailsLink.html?ID='+varRandNum;
submitForm.onsubmit ="";
submitForm.submit();


}

function getFormcDetails(pageNo){
document.getElementsByName('page')[0].value=pageNo;
var nForm=document.forms[0];
	nForm.target='';
	nForm.setAttribute('action',"/e-Filing/MyAccount/getRgessDetailsList.html");
nForm.setAttribute('method','POST');
nForm.submit();

}

function getCAClients(i){
	try{

		var varRandNum = document.forms[0].elements['ID'].value;
		document.forms[0].action= "/e-Filing/MyAccount/viewCaClientDetLink.html?ID="+varRandNum+'&page='+i;
		document.forms[0].onsubmit ="";
		document.forms[0].submit();
	}catch(e){
	
	}
}

function searchCaClients(i){
	try{

		var varRandNum = document.forms[0].elements['ID'].value;
		document.forms[0].action= "/e-Filing/MyAccount/searchClient.html?ID="+varRandNum+'&page='+i;
		document.forms[0].onsubmit ="";
		document.forms[0].submit();
	}catch(e){
	
	}
}

function checkDscToBeReg(){
	var checkReq = confirm('Your Digital Signature Certificate is not registered.Click \'OK\' to register the DSC OR \'CANCEL\' to continue ');

	if (checkReq) {
		var randomId=document.getElementById("requestId").value;
	
		var submitForm = document.createElement("FORM");
		document.body.appendChild(submitForm);
		submitForm.method = "POST";
		submitForm.action= "/e-Filing/MyAccount/UpdateDscDetailsLink.html?ID="+randomId;
		submitForm.submit();

	} else
		return false;
	
}

function forgotPasswordByEmail() {

		var one = document.getElementsByName("userSelection")[0].checked;
		var two = document.getElementsByName("userSelection")[1].checked;
		document.getElementById("altEmailId").parentNode.parentNode.style.display="none"
		if (one) {

		document.getElementById("altEmailId").parentNode.parentNode.style.display=""

		} else if (two) {
			
			document.getElementById("altEmailId").parentNode.parentNode.style.display="none"
			document.getElementById("altEmailId").value="";
			
		}
}


/*
 * $Id: validation.js 692578 2008-09-05 23:30:16Z davenewton $
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function clearErrorMessages(form) {
	clearErrorMessagesXHTML(form);
}

function clearErrorMessagesXHTML(form) {

}
function clearFieldErrorLabels(form) {
}
function clearFieldErrorMessages(form) {
}

function clearErrorLabels(form) {
	clearErrorLabelsXHTML(form);
}

function clearErrorLabelsXHTML(form) {

}
function addErrorHome(fieldname,error){
try{
addError(document.getElementsByName(fieldname)[0],error);
}catch(e){
alert(e);
}
}
function addError(e, errorText,notRemovable) {
	addErrorXHTML(e, errorText,notRemovable);
}

var lastErrorField = '';

function addErrorXHTML(e, errorText,notRemovable) {
	if(e!=null && e!=undefined && e!=''){
		focusTab(e);			
		window.scroll(0,findPos(e));			
		calculatePos(e);
	}
	lastErrorField=e;	
	$('#validationErrorMsg')[0].notRemovable = notRemovable;	
	$('#validationErrorMsg').stop(0,function(){});
	$('#validationErrorMsg').show(0,function(){
		$('#validationErrorMsg').html(errorText);
		$('#validationErrorMsg').fadeOut(12000);
	});
	if(e==null||e==undefined||e==''){
		$('#validationErrorMsg')[0].style.top = '10px';
		$('#validationErrorMsg')[0].style.width = '50%';
		$('#validationErrorMsg')[0].style.left = '';
		$('#validationErrorMsg')[0].className="";
	}
	else{
		calculatePos(e);
		window.onscroll=function() { calculatePos(e, true) };
	}
}

function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    return [curtop -100];
    }
}

function calculatePos(e, scroll){

	if($('#validationErrorMsg')[0].className=='' && scroll==true){
		return;
	}
	var docWidth=$(document).width();
	var pos = $('[name="'+e.name+'"]').offset();
	var top = (pos.top - $('#validationErrorMsg')[0].offsetHeight - 15);
	var left=(pos.left + $('#validationErrorMsg')[0].offsetWidth);
	$('#validationErrorMsg')[0].className="triangleBottom-isosceles";
	var flagTop=false;
	if(top < 0){
		top = pos.top + e.offsetHeight + 15;
		$('#validationErrorMsg')[0].className="triangleTop-isosceles";
		flagTop=true;
	}
	
	if(left>docWidth){
		var offWidth=$('#validationErrorMsg')[0].offsetWidth;
		left=pos.left-offWidth+e.offsetWidth;
		pos.left=left;
		if(flagTop){
			$('#validationErrorMsg')[0].className="triangleBottomLeft-isosceles";
		}else{
			$('#validationErrorMsg')[0].className="triangleLeft-isosceles";
		}
	}
	pos.top = top;
	$('#validationErrorMsg').offset(pos);
	$('#validationErrorMsg')[0].style.width = '300px';
}

function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft ;
        _y += el.offsetTop ;
        el = el.offsetParent;
    }
    return { top: _y -  $(document).scrollTop(), left: _x - $(document).scrollLeft()};
}


/* function addErrorXHTML(e, errorText) {
	alert(errorText);
} */

function isInteger(input) {

	for ( var i = 0; i < input.length; i++) {
		if (!(input.charAt(i) >= '0' && input.charAt(i) <= '9')) {
			return false;
		}
	}
	return true;
}

function checkDate(inputDate) {

	if (inputDate.replace(/^\\s+|\\s+$/g, '').length == 0) {
		return true;
	}

	var dateArray = inputDate.split("/");

	var isDateValid = true;

	if (dateArray.length == 3) {

		var dayOfDate = dateArray[0];
		var monthOfDate = dateArray[1];
		var yearOfDate = dateArray[2];

		if (isInteger(dayOfDate) && isInteger(monthOfDate)
				&& isInteger(yearOfDate) && dayOfDate.length == 2
				&& monthOfDate.length == 2 && yearOfDate.length == 4) {

			var tempDate = new Date(monthOfDate + "/" + dayOfDate + "/"
					+ yearOfDate);

			if (tempDate.getMonth() != monthOfDate - 1) {

				isDateValid = false;
			}
		} else {
			isDateValid = false;
		}
	} else {
		isDateValid = false;
	}

	return isDateValid;
}

function isFirstDateBefore(firstDate,secondDate){
	if((firstDate != null && firstDate != '') && (secondDate != null && secondDate != '')){		
		if(eval(firstDate.substring(6,10)) < eval(secondDate.substring(6,10))){
			return true;
		} else if(eval(firstDate.substring(6,10)) == eval(secondDate.substring(6,10))){
			if(eval(firstDate.substring(3,5)) < eval(secondDate.substring(3,5))){
				return true;
			} else if(eval(firstDate.substring(3,5)) == eval(secondDate.substring(3,5))){
				if(eval(firstDate.substring(0,2)) < eval(secondDate.substring(0,2))){
					return true;
				} else if(eval(firstDate.substring(0,2)) == eval(secondDate.substring(0,2))){
					return true;
				} else {
					return false;
				}
			} else{
				return false;
			}
		} else {
			return false;
		}
	}else{
		return false;
	}
}

function countRowInTable(field,inField) {
	var count = 0;
	while (true) {
		var temp='.'+inField;
		if(inField==''){
			temp='';
		}
		if (document.getElementsByName(field+'['+ count + ']'+temp).length != 0)
			count++;
		else
			break;

	}
	return count;
}
function modifyRow(table){
return true;
	
}

function findNoOfRows(table){
	var allInputTags=table.getElementsByTagName('input');
	var allSelectTags=table.getElementsByTagName('select');
	var allTextareaTags=table.getElementsByTagName('textarea');
	var name1,name2;
	var count=0;
	
	for(var i=0;i<allSelectTags.length;i++){
		
			name1=allSelectTags[i].name;
			name2=name1.substring(name1.lastIndexOf(']')+2,name1.length);
			name1=name1.substring(0,name1.lastIndexOf('['));
			
			count=countRowInTable(name1,name2);
			return count;
	}
	
	for(var i=0;i<allInputTags.length;i++){
		if(allInputTags[i].type!="checkbox" && allInputTags[i].name.indexOf('chosenCheckBox')==-1){
			name1=allInputTags[i].name;
			name2=name1.substring(name1.lastIndexOf(']')+2,name1.length);
			name1=name1.substring(0,name1.lastIndexOf('['));
			
			count=countRowInTable(name1,name2);
			return count;
		}
	}
	
	for(var i=0;i<allTextareaTags.length;i++){
		
			name1=allTextareaTags[i].name;
			name2=name1.substring(name1.lastIndexOf(']')+2,name1.length);
			name1=name1.substring(0,name1.lastIndexOf('['));
			
			count=countRowInTable(name1,name2);
			return count;
		
	}
}
function validateForm(){
	//var elements=document.forms[0].elements
	//for(var i=0;i<elements.length;i++){
		//j.validateAll(elements[i],elements[i].name,elements[i].value);
	//}
	j.validateAll(document.forms[0].elements);
}

function hideError(){
if($('#validationErrorMsg')[0].notRemovable != true){
	$('#validationErrorMsg').hide();
}
}

function prefill(){
}

function getAllTabs(){
	var objArr=new Array();
	var temp=$('.tabs:nth-child(2) li a');
	for(var i=0;i<temp.length;i++){
		objArr[i]=temp[i];
	}
	return objArr;
}

function setOnFocusDoc(){
	var page='page'+document.getElementById('currentPage').value;
	var inputs=document.getElementById(page).getElementsByTagName('input');
	var flag=false;
	flag=checkHidden(inputs);
	if(!flag){
		inputs=document.getElementById(page).getElementsByTagName('select');
		flag=checkHidden(inputs);
	}
	if(!flag){
		inputs=document.getElementById(page).getElementsByTagName('textarea');
		flag=checkHidden(inputs);
	}
}
function checkHidden(inputs){
	for(var i=0;i<inputs.length;i++){
		if(!inputs[i].hidden){
			inputs[i].focus();
			return true;
		}
	}
	return false;
}

function showImportTable(tableName){
	cp.importTable(tableName);
}

function deleteRowsPrefill(itr,asmtYear){
if(itr=='ITR-1'){
	if(asmtYear=='2016-17'){
		$('#taxDedSourceSal input').attr("checked" , true);
		deleteRowTaxDedTDSPage('taxDedSourceSal',1,2);
		$('#taxDedSourceSal input').attr("checked" , false);
		$('#taxDedSourceSrc input').attr("checked" , true);
		deleteRowTaxDedTDSPage('taxDedSourceSrc',1,2);
		$('#taxDedSourceSrc input').attr("checked" , false);
		$('#taxDedSelf input').attr("checked" , true);
		deleteRowTaxDedTDSPage('taxDedSelf',1,2);
		$('#taxDedSelf input').attr("checked" , false);
	} else{
	$('#taxDedSourceSal input').attr("checked" , true);
	deleteRowTaxDedTDSPage('taxDedSourceSal',1,1);
	$('#taxDedSourceSal input').attr("checked" , false);
	$('#taxDedSourceSrc input').attr("checked" , true);
	deleteRowTaxDedTDSPage('taxDedSourceSrc',1,1);
	$('#taxDedSourceSrc input').attr("checked" , false);
	$('#taxDedSelf input').attr("checked" , true);
	deleteRowTaxDedTDSPage('taxDedSelf',1,1);
	$('#taxDedSelf input').attr("checked" , false);
}
	
}else if(itr=='ITR-4S'){
	if(asmtYear=='2016-17'){
		$('#taxDedSourceSal input').attr("checked" , true);
		deleteRowPage6('taxDedSourceSal',1,2);
		$('#taxDedSourceSal input').attr("checked" , false);
		$('#taxDedSourceSrc input').attr("checked" , true);
		deleteRowPage6('taxDedSourceSrc',1,2);
		$('#taxDedSourceSrc input').attr("checked" , false);
		$('#tcsTableId input').attr("checked" , true);
		deleteRowPage6('tcsTableId',1,2);
		$('#tcsTableId input').attr("checked" , false);
		$('#taxDedSelf input').attr("checked" , true);
		deleteRowPage6('taxDedSelf',1,2);
		$('#taxDedSelf input').attr("checked" , false);
	} else {
	$('#taxDedSourceSal input').attr("checked" , true);
	deleteRowPage6('taxDedSourceSal',1,1);
	$('#taxDedSourceSal input').attr("checked" , false);
	$('#taxDedSourceSrc input').attr("checked" , true);
	deleteRowPage6('taxDedSourceSrc',1,1);
	$('#taxDedSourceSrc input').attr("checked" , false);
	$('#tcsTableId input').attr("checked" , true);
	deleteRowPage6('tcsTableId',1,1);
	$('#tcsTableId input').attr("checked" , false);
	$('#taxDedSelf input').attr("checked" , true);
	deleteRowPage6('taxDedSelf',1,1);
	$('#taxDedSelf input').attr("checked" , false);
	}
}else if(itr=='ITR-7'){
	if(asmtYear=='2016-17'){
		$('#scheduleTDS input').attr("checked" , true);
		deleteRowTable('scheduleTDS',3,2);
		$('#scheduleTDS input').attr("checked" , false);
		$('#scheduleTDS3 input').attr("checked" , true);
		deleteRowTable('scheduleTDS3',3,2);
		$('#scheduleTDS3 input').attr("checked" , false);
		$('#scheduleIT input').attr("checked" , true);
		deleteRowTable('scheduleIT',2,2);
		$('#scheduleIT input').attr("checked" , false);		
	} else if(asmtYear=='2015-16'){
		$('#scheduleTDS input').attr("checked" , true);
		deleteRowTable('scheduleTDS',3,1);
		$('#scheduleTDS input').attr("checked" , false);
		$('#scheduleTDS3 input').attr("checked" , true);
		deleteRowTable('scheduleTDS3',3,1);
		$('#scheduleTDS3 input').attr("checked" , false);
		$('#scheduleIt input').attr("checked" , true);
		deleteRowTable('scheduleIt',2,1);
		$('#scheduleIt input').attr("checked" , false);
		$('#scheduleTCS input').attr("checked" , true);
		deleteRowTable('scheduleTCS',3,1);
		$('#scheduleTCS input').attr("checked" , false);		
		} else{
			$('#scheduleTDS input').attr("checked" , true);
			deleteRowTable('scheduleTDS',2,1);
			$('#scheduleTDS input').attr("checked" , false);
			$('#scheduleTCS input').attr("checked" , true);
			deleteRowTable('scheduleTCS',2,1);
			$('#scheduleTCS input').attr("checked" , false);
			$('#scheduleIT input').attr("checked" , true);
			deleteRowTable('scheduleIT',2,1);
			$('#scheduleIT input').attr("checked" , false);
	}
}else if(itr=='ITR-3'){
	if(asmtYear=='2016-17'){
		$('#scheduleTDS1 input').attr("checked" , true);
		deleteRowTable('scheduleTDS1',1,2);
		$('#scheduleTDS1 input').attr("checked" , false);
		$('#scheduleTDS2 input').attr("checked" , true);
		deleteRowTable('scheduleTDS2',3,2);
		$('#scheduleTDS2 input').attr("checked" , false);
		$('#scheduleTDS3 input').attr("checked" , true);
		deleteRowTable('scheduleTDS3',3,2);
		$('#scheduleTDS3 input').attr("checked" , false);
		$('#scheduleIt input').attr("checked" , true);
		deleteRowTable('scheduleIt',1,2);
		$('#scheduleIt input').attr("checked" , false);		
	}
	else if(asmtYear=='2015-16'){
		$('#scheduleTDS1 input').attr("checked" , true);
		deleteRowTable('scheduleTDS1',1,1);
		$('#scheduleTDS1 input').attr("checked" , false);
		$('#scheduleTDS2 input').attr("checked" , true);
		deleteRowTable('scheduleTDS2',3,1);
		$('#scheduleTDS2 input').attr("checked" , false);
		$('#scheduleIt input').attr("checked" , true);
		deleteRowTable('scheduleIt',1,1);
		$('#scheduleIt input').attr("checked" , false);
		$('#scheduleTDS3 input').attr("checked" , true);
		deleteRowTable('scheduleTDS3',3,1);
		$('#scheduleTDS3 input').attr("checked" , false);
		$('#scheduleTCS input').attr("checked" , true);
		deleteRowTable('scheduleTCS',1,1);
		$('#scheduleTCS input').attr("checked" , false);
	}else{
		$('#scheduleTDS1 input').attr("checked" , true);
		deleteRowTable('scheduleTDS1',1,1);
		$('#scheduleTDS1 input').attr("checked" , false);
		$('#scheduleTDS2 input').attr("checked" , true);
		deleteRowTable('scheduleTDS2',1,1);
		$('#scheduleTDS2 input').attr("checked" , false);
		$('#scheduleIt input').attr("checked" , true);
		deleteRowTable('scheduleIt',1,1);
		$('#scheduleIt input').attr("checked" , false);
	}
	
}else if(itr=='ITR-2'){
	if(asmtYear=='2016-17'){
		$('#scheduleTDS1 input').attr("checked" , true);
		deleteRowTable('scheduleTDS1',1,2);
		$('#scheduleTDS1 input').attr("checked" , false);
		$('#scheduleTDS2 input').attr("checked" , true);
		deleteRowTable('scheduleTDS2',3,2);
		$('#scheduleTDS2 input').attr("checked" , false);
		$('#scheduleTDS3 input').attr("checked" , true);
		deleteRowTable('scheduleTDS3',3,2);
		$('#scheduleTDS3 input').attr("checked" , false);
		$('#scheduleIt input').attr("checked" , true);
		deleteRowTable('scheduleIt',1,2);
		$('#scheduleIt input').attr("checked" , false);		
	}
	else if(asmtYear=='2015-16'){
		$('#scheduleTDS1 input').attr("checked" , true);
		deleteRowTable('scheduleTDS1',1,1);
		$('#scheduleTDS1 input').attr("checked" , false);
		$('#scheduleTDS2 input').attr("checked" , true);
		deleteRowTable('scheduleTDS2',3,1);
		$('#scheduleTDS2 input').attr("checked" , false);
		$('#scheduleTDS3 input').attr("checked" , true);
		deleteRowTable('scheduleTDS3',3,1);
		$('#scheduleTDS3 input').attr("checked" , false);
		$('#scheduleIt input').attr("checked" , true);
		deleteRowTable('scheduleIt',1,1);
		$('#scheduleIt input').attr("checked" , false);		
	}else{
		$('#scheduleTDS1 input').attr("checked" , true);
		deleteRowTable('scheduleTDS1',1,1);
		$('#scheduleTDS1 input').attr("checked" , false);
		$('#scheduleTDS2 input').attr("checked" , true);
		deleteRowTable('scheduleTDS2',1,1);
		$('#scheduleTDS2 input').attr("checked" , false);
		$('#scheduleIt input').attr("checked" , true);
		deleteRowTable('scheduleIt',1,1);
		$('#scheduleIt input').attr("checked" , false);
	}
	
}else if(itr=='ITR-4'){

	if(asmtYear=='2016-17'){

		$('#scheduleTDS1 input').attr("checked" , true);
		deleteRowTable('scheduleTDS1',1,2);
		$('#scheduleTDS1 input').attr("checked" , false);
		$('#scheduleTDS2 input').attr("checked" , true);
		deleteRowTable('scheduleTDS2',3,2);
		$('#scheduleTDS2 input').attr("checked" , false);
		$('#scheduleIt input').attr("checked" , true);
		deleteRowTable('scheduleIt',1,2);
		$('#scheduleIt input').attr("checked" , false);
		$('#scheduleTCS input').attr("checked" , true);
		deleteRowTable('scheduleTCS',3,2);
		$('#scheduleTCS input').attr("checked" , false);
	} else if(asmtYear=='2015-16'){
		$('#scheduleTDS1 input').attr("checked" , true);
		deleteRowTable('scheduleTDS1',1,1);
		$('#scheduleTDS1 input').attr("checked" , false);
		$('#scheduleTDS2 input').attr("checked" , true);
		deleteRowTable('scheduleTDS2',3,1);
		$('#scheduleTDS2 input').attr("checked" , false);
		$('#scheduleIt input').attr("checked" , true);
		deleteRowTable('scheduleIt',1,1);
		$('#scheduleIt input').attr("checked" , false);
		$('#scheduleTDS3 input').attr("checked" , true);
		deleteRowTable('scheduleTDS3',3,1);
		$('#scheduleTDS3 input').attr("checked" , false);
		$('#scheduleTCS input').attr("checked" , true);
		deleteRowTable('scheduleTCS',3,1);
		$('#scheduleTCS input').attr("checked" , false);
	}else{
		$('#scheduleTDS1 input').attr("checked" , true);
		deleteRowTable('scheduleTDS1',1,1);
		$('#scheduleTDS1 input').attr("checked" , false);
		$('#scheduleTDS2 input').attr("checked" , true);
		deleteRowTable('scheduleTDS2',1,1);
		$('#scheduleTDS2 input').attr("checked" , false);
		$('#scheduleIt input').attr("checked" , true);
		deleteRowTable('scheduleIt',1,1);
		$('#scheduleIt input').attr("checked" , false);		
	}
} else if(itr=='ITR-5'){
	if(asmtYear=='2016-17'){
		$('#scheduleTDS1 input').attr("checked" , true);
		deleteRowTable('scheduleTDS1',3,2);
		$('#scheduleTDS1 input').attr("checked" , false);
		$('#scheduleTDS2 input').attr("checked" , true);
		deleteRowTable('scheduleTDS2',3,2);
		$('#scheduleTDS2 input').attr("checked" , false);
		$('#scheduleIt input').attr("checked" , true);
		deleteRowTable('scheduleIt',1,2);
		$('#scheduleIt input').attr("checked" , false);
		$('#scheduleTCS input').attr("checked" , true);
		deleteRowTable('scheduleTCS',3,2);
		$('#scheduleTCS input').attr("checked" , false);
	} else if(asmtYear=='2015-16'){
		$('#scheduleTDS1 input').attr("checked" , true);
		deleteRowTable('scheduleTDS1',3,1);
		$('#scheduleTDS1 input').attr("checked" , false);
		$('#scheduleTDS2 input').attr("checked" , true);
		deleteRowTable('scheduleTDS2',3,1);
		$('#scheduleTDS2 input').attr("checked" , false);
		$('#scheduleIt input').attr("checked" , true);
		deleteRowTable('scheduleIt',1,1);
		$('#scheduleIt input').attr("checked" , false);		
		$('#scheduleTCS input').attr("checked" , true);
		deleteRowTable('scheduleTCS',3,1);
		$('#scheduleTCS input').attr("checked" , false);
	}
} else if(itr=='ITR-6'){
	if(asmtYear=='2016-17'){
		$('#scheduleTDS1 input').attr("checked" , true);
		deleteRowTable('scheduleTDS1',3,2);
		$('#scheduleTDS1 input').attr("checked" , false);
		$('#scheduleTDS2 input').attr("checked" , true);
		deleteRowTable('scheduleTDS2',3,2);
		$('#scheduleTDS2 input').attr("checked" , false);
		$('#scheduleIt input').attr("checked" , true);
		deleteRowTable('scheduleIt',1,2);
		$('#scheduleIt input').attr("checked" , false);
		$('#scheduleTCS input').attr("checked" , true);
		deleteRowTable('scheduleTCS',3,2);
		$('#scheduleTCS input').attr("checked" , false);
	} else if(asmtYear=='2015-16'){
		$('#scheduleTDS1 input').attr("checked" , true);
		deleteRowTable('scheduleTDS1',3,1);
		$('#scheduleTDS1 input').attr("checked" , false);
		$('#scheduleTDS2 input').attr("checked" , true);
		deleteRowTable('scheduleTDS2',3,1);
		$('#scheduleTDS2 input').attr("checked" , false);
		$('#scheduleIt input').attr("checked" , true);
		deleteRowTable('scheduleIt',1,1);
		$('#scheduleIt input').attr("checked" , false);		
		$('#scheduleTCS input').attr("checked" , true);
		deleteRowTable('scheduleTCS',3,1);
		$('#scheduleTCS input').attr("checked" , false);
	}
}
}

function deleteRowsPrefillFrom2017(itr,asmtYear){
if(itr=='ITR-1'){
		$('#taxDedSourceSal input').attr("checked" , true);
		deleteRowTaxDedTDSPage('taxDedSourceSal',1,2);
		$('#taxDedSourceSal input').attr("checked" , false);
		$('#taxDedSourceSrc input').attr("checked" , true);
		deleteRowTaxDedTDSPage('taxDedSourceSrc',1,2);
		$('#taxDedSourceSrc input').attr("checked" , false);
		$('#taxDedSelf input').attr("checked" , true);
		deleteRowTaxDedTDSPage('taxDedSelf',1,2);
		$('#taxDedSelf input').attr("checked" , false);
}else if(itr=='ITR-4'){
		$('#taxDedSourceSal input').attr("checked" , true);
		deleteRowPage6('taxDedSourceSal',1,2);
		$('#taxDedSourceSal input').attr("checked" , false);
		$('#taxDedSourceSrc input').attr("checked" , true);
		deleteRowPage6('taxDedSourceSrc',1,2);
		$('#taxDedSourceSrc input').attr("checked" , false);
		$('#tcsTableId input').attr("checked" , true);
		deleteRowPage6('tcsTableId',1,2);
		$('#tcsTableId input').attr("checked" , false);
		$('#taxDedSelf input').attr("checked" , true);
		deleteRowPage6('taxDedSelf',1,2);
		$('#taxDedSelf input').attr("checked" , false);
}else if(itr=='ITR-7'){
		$('#scheduleTDS input').attr("checked" , true);
		deleteRowTable('scheduleTDS',3,2);
		$('#scheduleTDS input').attr("checked" , false);
		$('#scheduleTDS3 input').attr("checked" , true);
		deleteRowTable('scheduleTDS3',3,2);
		$('#scheduleTDS3 input').attr("checked" , false);
		$('#scheduleIT input').attr("checked" , true);
		deleteRowTable('scheduleIT',2,2);
		$('#scheduleIT input').attr("checked" , false);	
}else if(itr=='ITR-2'){
		$('#scheduleTDS1 input').attr("checked" , true);
		deleteRowTable('scheduleTDS1',1,2);
		$('#scheduleTDS1 input').attr("checked" , false);
		$('#scheduleTDS2 input').attr("checked" , true);
		deleteRowTable('scheduleTDS2',3,2);
		$('#scheduleTDS2 input').attr("checked" , false);
		$('#scheduleTDS3 input').attr("checked" , true);
		deleteRowTable('scheduleTDS3',3,2);
		$('#scheduleTDS3 input').attr("checked" , false);
		$('#scheduleIt input').attr("checked" , true);
		deleteRowTable('scheduleIt',1,2);
		$('#scheduleIt input').attr("checked" , false);	
}else if(itr=='ITR-3'){
		$('#scheduleTDS1 input').attr("checked" , true);
		deleteRowTable('scheduleTDS1',1,2);
		$('#scheduleTDS1 input').attr("checked" , false);
		$('#scheduleTDS2 input').attr("checked" , true);
		deleteRowTable('scheduleTDS2',3,2);
		$('#scheduleTDS2 input').attr("checked" , false);
		$('#scheduleIt input').attr("checked" , true);
		deleteRowTable('scheduleIt',1,2);
		$('#scheduleIt input').attr("checked" , false);
		$('#scheduleTCS input').attr("checked" , true);
		deleteRowTable('scheduleTCS',3,2);
		$('#scheduleTCS input').attr("checked" , false);
} else if(itr=='ITR-5'){
		$('#scheduleTDS1 input').attr("checked" , true);
		deleteRowTable('scheduleTDS1',3,2);
		$('#scheduleTDS1 input').attr("checked" , false);
		$('#scheduleTDS2 input').attr("checked" , true);
		deleteRowTable('scheduleTDS2',3,2);
		$('#scheduleTDS2 input').attr("checked" , false);
		$('#scheduleIt input').attr("checked" , true);
		deleteRowTable('scheduleIt',1,2);
		$('#scheduleIt input').attr("checked" , false);
		$('#scheduleTCS input').attr("checked" , true);
		deleteRowTable('scheduleTCS',3,2);
		$('#scheduleTCS input').attr("checked" , false);	
} else if(itr=='ITR-6'){
		$('#scheduleTDS1 input').attr("checked" , true);
		deleteRowTable('scheduleTDS1',3,2);
		$('#scheduleTDS1 input').attr("checked" , false);
		$('#scheduleTDS2 input').attr("checked" , true);
		deleteRowTable('scheduleTDS2',3,2);
		$('#scheduleTDS2 input').attr("checked" , false);
		$('#scheduleIt input').attr("checked" , true);
		deleteRowTable('scheduleIt',1,2);
		$('#scheduleIt input').attr("checked" , false);
		$('#scheduleTCS input').attr("checked" , true);
		deleteRowTable('scheduleTCS',3,2);
		$('#scheduleTCS input').attr("checked" , false);	
}
}

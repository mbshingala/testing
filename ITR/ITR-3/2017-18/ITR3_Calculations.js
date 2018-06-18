/*
 * ITR4_Calculations.js
 *
 * Created on 11/10/2013
 *
 * Copyright(c) 2014  TCS Company, Inc.  All Rights Reserved.
 * This software is the proprietary information of TCS Company.
 *
 */
var globTempStcg1 = 0;
var globTempStcg2 = 0;
var globTempltcg1 = 0;
var globTempltcg2 = 0;
var dpmCeasesMesg ='';
var doaCeasesMesg ='';


var FY_start_date = '01/04/2016';
var FY_end_date = '31/03/2017';
var AY_start_date = '01/04/2017';
var Filing_dueDate = '05/08/2017'; // Modified due to the due date extended for filing the return
var Int_start_date_234A = '06/08/2017'; // Modified due to the due date extended for filing the return

var slab0_end_date = '15/06/2016';
var slab1_start_date = '16/06/2016';
var slab1_end_date = '15/09/2016';
var slab2_start_date = '16/09/2016';
var slab2_end_date = '15/12/2016';
var slab3_start_date = '16/12/2016';
var slab3_end_date = '15/03/2017';
var slab4_start_date = '16/03/2017';

var Cg_ded_start_date = '31/03/2014';
var Cg_ded_end_date = '01/04/2020';

// ITR4 Starts from here
function calcITR4(){
	setTimeout(calcITR4Impl, 100);
}

// Main Calculations starts from here
function calcITR4Impl(){
	try{         
		   var cgosIncome = {};
		   initCgOsInc(cgosIncome);
		   enableNRItables();
		   oi_33AB_ABA(); // bifurcation OI
		   bp_sections(); // bifurcation BP
		   bp_35AD1_AD1A(); // bifurcation BP 46
		   enableTable('scheduleCGPost45.LongTermCapGainPost45.unutilizedCapgainFlag','Y','scheduleLtcgunUtilizedCapGain54');
		   enableTable('scheduleCGPost45.shortTermCapGainPost45.unutilizedCapgainFlag','Y','scheduleStcgunUtilizedCapGain54');
		   enableTableWithOutCB('scheduleCGPost45.LongTermCapGainPost45.unutilizedCapgainFlag','Y','scheduleLtcgunUtilizedCapGain54B');
		   enableTableWithOutCB('scheduleCGPost45.shortTermCapGainPost45.unutilizedCapgainFlag','Y','scheduleStcgunUtilizedCapGain54B');
		   calSchS('scheduleSalaryMain'); 
	       calcScheduleFSI();
		   calcBalSheet();
		   calculatePL();
		   calcPartAOI();
		   scheduleHPCalcFor4();
		   calculateSchDPM();
		   calculateSchDOA();
		   calcSchDEPFor6();
		   calcSchDCGFor6();
		   calcSchESRFor4();
		   calc10A();
		   calc10AA();
	       calcSchBPBalFor4();
		   calcSchCG(cgosIncome);
	       var simap = calculateOS(cgosIncome);
		   calculateCYLA(cgosIncome);
	       var amt5BBC = simap['5BBC'];
	       var amt5Ea = simap['5Ea'];
	       populateSI(cgosIncome,simap);
	       OSSubCal();
		   calcUD();
	       calcTotal80IA();
		   calcTotal80IB();
		   calcTotal80IC();			 
	       calculatePartBTI_first();
		   caclDedSchVIA();
		   calcTotal80GDeductions('ded100PerWithoutQual',3,2,amt5BBC,amt5Ea);
		   calcTotal80GDeductions('ded50WithoutQual',3,2,amt5BBC,amt5Ea);
		   calcTotal80GDeductions('ded100Qual',3,2,amt5BBC,amt5Ea);
		   calcTotal80GDeductions('ded50WithQual',3,2,amt5BBC,amt5Ea);
		   panValidation80G('ded100PerWithoutQual');
		   panValidation80G('ded50WithoutQual');
		   panValidation80G('ded100Qual');
		   panValidation80G('ded50WithQual');
		   caclDedSchVIA();
		   calcScheduleSI();
		   calcTotSchIF();
		   calculateNetAgricultureIncomeforEI();
		   calTotalEI();
		   totAmtOfSched5A();
	       checkSchedule5A();
		   calculatePartBTI_second();
	       populateAMT();
	       calculateTiTti(cgosIncome);
	       populateAMTC();
		   calcTotScheduleAMTC();
	       calculatePartBTTI_second(cgosIncome);
	       calculateTotalTaxIT('scheduleIt'); 
	       calcTotalICDS();
	       surchargeEditable();
	       removeIncomeDtls();
	       enable115HFlag();
	       enableFieldsFor115HFlg();
	       checkSchEIxmlblock();
	       section80DChk();
	       genWarningMsgForNRI();
	       
	       /*adjustFormAL();
	       adjustFormAL2();*/
	}catch(e){
		alert('error in calcITR4 ='+ e.stack);
	}
}

// Initialise Schedule CG and OS Incomes
function initCgOsInc(cgosIncome){
	cgosIncome.cgInc = {};
	cgosIncome.osInc = {};
	cgosIncome.cgInc.stcg={};
	cgosIncome.cgInc.ltcg={};
	cgosIncome.cgInc.ltcg.prctg10={};
	cgosIncome.cgInc.ltcg.prctg20 = {};
	cgosIncome.cgInc.stcg.prctg30 = 0;
	cgosIncome.cgInc.stcg.prctgAr = 0;
	cgosIncome.cgInc.stcg.prctg15 = {};
	cgosIncome.cgInc.stcg.prctg15.sec111a = 0;
	cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii = 0;
	cgosIncome.cgInc.ltcg.prctg20.sec112 = 0;
	cgosIncome.cgInc.ltcg.prctg20.sec11EA = 0;
	cgosIncome.cgInc.ltcg.prctg10.secProviso = 0;
	cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2 = 0;
	cgosIncome.cgInc.ltcg.prctg10.sec115AC_1 = 0;
	cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1 = 0;
	cgosIncome.cgInc.ltcg.prctg10.sec115AD_3 = 0;
	cgosIncome.cgInc.ltcg.prctg10.sec115E_b = 0;
	cgosIncome.osInc.sec115A_1_a_i = 0;
	cgosIncome.osInc.sec115A_1_a_ii = 0;
	cgosIncome.osInc.sec115A_1_a_iia = 0;
	cgosIncome.osInc.sec115A_1_a_iiaa = 0;
	cgosIncome.osInc.sec115A_1_a_iiab = 0;
	cgosIncome.osInc.sec115A_1_a_iii = 0;
	cgosIncome.osInc.sec115A_1_b_A = 0;
	cgosIncome.osInc.sec115A_1_b_B = 0;
	cgosIncome.osInc.sec115AC_1_a_b = 0;
	cgosIncome.osInc.sec115ACA_1_a = 0;
	cgosIncome.osInc.sec115AD_1_i = 0;
	cgosIncome.osInc.sec115BBA = 0;
	cgosIncome.osInc.sec115BBC = 0;
	cgosIncome.osInc.sec115BBDA = 0;
	cgosIncome.osInc.sec115BBE = 0;
	cgosIncome.osInc.sec115BBF = 0;
    cgosIncome.osInc.sec115BB = 0;
	cgosIncome.osInc.sec115E_a = 0;
	cgosIncome.osInc.sec111 = 0;
	cgosIncome.bpNetInc = 0;
}

// Initialise Map for Schedule SI
function initMapForSI(cgosIncome){
	var simap = {
			"5Eacg":cgosIncome.cgInc.ltcg.prctg20.sec11EA,
			"5AC1c":cgosIncome.cgInc.ltcg.prctg10.sec115AC_1,
			"5ACA1b":cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1,
			"5ADiii":cgosIncome.cgInc.ltcg.prctg10.sec115AD_3,
			"5Eb":cgosIncome.cgInc.ltcg.prctg10.sec115E_b,
			"5AD1biip":cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii,
			"1A":cgosIncome.cgInc.stcg.prctg15.sec111a
	}; 
	return simap;
}

// Update Map for Schedule SI
function updateMapForSI(cgosIncome, simap){
	simap["5Eacg"]=cgosIncome.cgInc.ltcg.prctg20.sec11EA;
	simap["5AC1c"]=cgosIncome.cgInc.ltcg.prctg10.sec115AC_1;
	simap["5ACA1b"]=cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1;
    simap["5ADiii"]=cgosIncome.cgInc.ltcg.prctg10.sec115AD_3;
    simap["5Eb"]=cgosIncome.cgInc.ltcg.prctg10.sec115E_b;
    simap["5AD1biip"]=cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii;
    simap["1A"]=cgosIncome.cgInc.stcg.prctg15.sec111a;
}

// Calculate Income for Schedule FSI
function calcScheduleFSI(){
	try{
		var table=document.getElementById('scheduleFSI');
	        var noOfRows=table.rows.length;
	        var indexValue=eval(((parseInt(noOfRows,10)-4)/6));
	      
	        for(var i=0;i<indexValue;i++){
	            
	            document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].totalCountryWise.incFrmOutsideInd")[0].value=
	                eval(parseInt(coalesce(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromSal.incFrmOutsideInd")[0].value),10))+
	                 eval(parseInt(coalesce(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromHP.incFrmOutsideInd")[0].value),10))+
	                     eval(parseInt(coalesce(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromBusiness.incFrmOutsideInd")[0].value),10))+
	                         eval(parseInt(coalesce(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incCapGain.incFrmOutsideInd")[0].value),10))+
	                         eval(parseInt(coalesce(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incOthSrc.incFrmOutsideInd")[0].value),10));
	                    
	                    
	                    
	                    
	              document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].totalCountryWise.taxPaidOutsideInd")[0].value=
	                 eval(parseInt(coalesce(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromSal.taxPaidOutsideInd")[0].value),10))+
	                 eval(parseInt(coalesce(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromHP.taxPaidOutsideInd")[0].value),10))+
	                     eval(parseInt(coalesce(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromBusiness.taxPaidOutsideInd")[0].value),10))+
	                         eval(parseInt(coalesce(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incCapGain.taxPaidOutsideInd")[0].value),10))+
	                         eval(parseInt(coalesce(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incOthSrc.taxPaidOutsideInd")[0].value),10));
	                    
	                    
	                    
	                    
	                   document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].totalCountryWise.taxPayableinInd")[0].value=
	                 eval(parseInt(coalesce(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromSal.taxPayableinInd")[0].value),10))+
	                 eval(parseInt(coalesce(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromHP.taxPayableinInd")[0].value),10))+
	                     eval(parseInt(coalesce(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromBusiness.taxPayableinInd")[0].value),10))+
	                         eval(parseInt(coalesce(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incCapGain.taxPayableinInd")[0].value),10))+
	                        eval(parseInt(coalesce(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incOthSrc.taxPayableinInd")[0].value),10));
	                    
	                
	                if(eval(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromSal.taxPaidOutsideInd")[0].value)<
	                    eval(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromSal.taxPayableinInd")[0].value)){
	                 document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromSal.taxReliefinInd")[0].value=
	                     document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromSal.taxPaidOutsideInd")[0].value;
	                    }else{
	                         document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromSal.taxReliefinInd")[0].value=
	                             document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromSal.taxPayableinInd")[0].value;
	                    }
	                    
	                         if(eval(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromHP.taxPaidOutsideInd")[0].value)<
	                    eval(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromHP.taxPayableinInd")[0].value)){
	                 document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromHP.taxReliefinInd")[0].value=
	                     document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromHP.taxPaidOutsideInd")[0].value;
	                    }else{
	                         document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromHP.taxReliefinInd")[0].value=
	                             document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromHP.taxPayableinInd")[0].value;
	                    }
	                    
	                    
	                         if(eval(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromBusiness.taxPaidOutsideInd")[0].value)<
	                    eval(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromBusiness.taxPayableinInd")[0].value)){
	                 document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromBusiness.taxReliefinInd")[0].value=
	                     document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromBusiness.taxPaidOutsideInd")[0].value;
	                    }else{
	                         document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromBusiness.taxReliefinInd")[0].value=
	                             document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromBusiness.taxPayableinInd")[0].value;
	                    }
	                    
	                    
	                         if(eval(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incCapGain.taxPaidOutsideInd")[0].value)<
	                    eval(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incCapGain.taxPayableinInd")[0].value)){
	                 document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incCapGain.taxReliefinInd")[0].value=
	                     document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incCapGain.taxPaidOutsideInd")[0].value;
	                    }else{
	                         document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incCapGain.taxReliefinInd")[0].value=
	                             document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incCapGain.taxPayableinInd")[0].value;
	                    }
	                    
	                       if(eval(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incOthSrc.taxPaidOutsideInd")[0].value)<
	                    eval(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incOthSrc.taxPayableinInd")[0].value)){
	                 document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incOthSrc.taxReliefinInd")[0].value=
	                     document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incOthSrc.taxPaidOutsideInd")[0].value;
	                    }else{
	                         document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incOthSrc.taxReliefinInd")[0].value=
	                             document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incOthSrc.taxPayableinInd")[0].value;
	                    }
	                    
	                    
	                    document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].totalCountryWise.taxReliefinInd")[0].value=
	                 eval(parseInt(coalesce(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromSal.taxReliefinInd")[0].value),10))+
	                 eval(parseInt(coalesce(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromHP.taxReliefinInd")[0].value),10))+
	                     eval(parseInt(coalesce(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incFromBusiness.taxReliefinInd")[0].value),10))+
	                         eval(parseInt(coalesce(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incCapGain.taxReliefinInd")[0].value),10))+
	                         eval(parseInt(coalesce(document.getElementsByName("itrScheduleFSI.scheduleFSI["+i+"].incOthSrc.taxReliefinInd")[0].value),10));
	        }
	        populateTR();
		}catch(e){
			alert('error in calcScheduleFSI = '  +e.stack);
		}
}

// Function to Remove Sections for Schedule OS.
//To remove section
function removeSection(sectionArray, rowCount) {
  try{
	for (var i=1; i<rowCount;  i++) {
	var selectsLength = document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+i+'].sourceDescription')[0].options.length;
		for (var k=selectsLength; k>0;  k--) {
      		   if(document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+i+'].sourceDescription')[0].options[k] != null && 
      		   sectionArray.indexOf(document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+i+'].sourceDescription')[0].options[k].value) != -1) {
			   document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+i+'].sourceDescription')[0].remove(k);
			   
		   }
      		
		}
	}
  } catch(e) {
    alert('Exception in removeSection method:'+e.stack);
  }
}

function removeSectionOnChange(sectionArray, rowCount) {
	try {
		for (var i = 1; i < rowCount; i++) {
			var selectsLength = document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ i + '].sourceDescription')[0].options.length;
			for (var k = selectsLength; k > 0; k--) {
				if (document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ i + '].sourceDescription')[0].options[k] != null
						&& sectionArray.indexOf(document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ i + '].sourceDescription')[0].options[k].value) != -1) {
					
					var NRI_value= document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ i + '].sourceDescription')[0].value ;
					
					if (NRI_value=='5BBF' || NRI_value=='5BBDA' || NRI_value=='5ACA1a')
						{
						document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ i + '].sourceAmount')[0].value=0;
						}
					document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ i + '].sourceDescription')[0].remove(k);
					
				}
			}
		}
		calcITR4();
		
	} catch (e) {
		alert('exception in removeSection' + e.stack);
	}
}


// Function to add All Options for Schedule OS
function addAllOptions(allSectionArray, rowCount) {
	for (var i=1; i<rowCount;  i++) {
		var srcDesc = document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+i+'].sourceDescription')[0];
		var selectedValue = srcDesc.value;
		removeAll(srcDesc);
		for(var k=0; k<allSectionArray.length; k++) {
			var optn = document.createElement("option");
			optn.text = getSectionTextMap(allSectionArray[k]);
			optn.value = allSectionArray[k];
			srcDesc.options.add(optn);
		}
		srcDesc.value = selectedValue;
	}
}

//To set other gross
function setOtherGrossSource() {
	var status = document
			.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0].value;
	
	var ben115HFlg = document
	.getElementsByName('partAGEN1.filingStatus.benefitUs115HFlg')[0].value;

	var tab = document.getElementById('schduleOsf');
	var rowCount = tab.rows.length - 3;

	var allSectionArray = [ '5A1ai', '5A1aii', '5A1aiia', '5A1aiiaa','5A1aiiab', '5A1aiiac', '5A1aiii', '5A1bA', '5A1bB', '5AC1ab','5ACA1a', '5AD1i', '5AD1iP', '5BBA', '5BBC','5BBF','5BBDA', '5Ea', '1','Others' ];

	
	
	if ((status == 'RES' || status == 'NOR') && ben115HFlg != 'Y') {
		addAllOptions(allSectionArray, rowCount);
		var sectionArray = [ '5A1ai', '5A1aii', '5A1aiia', '5A1aiiaa','5A1aiiab', '5A1aiiac', '5A1aiii', '5A1bA', '5A1bB', '5AC1ab','5BBA'];
		removeSection(sectionArray, rowCount);
	} else if (status == 'NRI') {
		addAllOptions(allSectionArray, rowCount);
		var sectionArray = [ '5ACA1a','5BBDA','5BBF' ];
		removeSection(sectionArray, rowCount);
	}
	if(ben115HFlg == 'Y')
	{
	addAllOptions(allSectionArray, rowCount);
	}
	
}

function setOtherGrossSourceOnChange() {
	var status = document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0].value;
	var ben115HFlg = document
	.getElementsByName('partAGEN1.filingStatus.benefitUs115HFlg')[0].value;
	
	var tab = document.getElementById('schduleOsf');
	var rowCount= tab.rows.length - 3;
	
	var allSectionArray = ['5A1ai','5A1aii','5A1aiia','5A1aiiaa','5A1aiiab','5A1aiiac','5A1aiii','5A1bA','5A1bB','5AC1ab','5ACA1a','5AD1i','5AD1iP','5BBA','5BBC','5BBDA','5BBF','5Ea','1','Others'];
	
	if ((status == 'RES' || status == 'NOR') && ben115HFlg != 'Y') {
		addAllOptions(allSectionArray,rowCount);
		var sectionArray = ['5A1ai','5A1aii','5A1aiia','5A1aiiaa','5A1aiiab','5A1aiiac','5A1aiii','5A1bA','5A1bB','5AC1ab','5BBA'];
		removeSectionOnChange(sectionArray, rowCount);
	} else if (status == 'NRI') {
		addAllOptions(allSectionArray,rowCount);
		var sectionArray = ['5ACA1a','5BBDA','5BBF'];
		removeSectionOnChange(sectionArray, rowCount);
	}
	
	if(ben115HFlg == 'Y')
	{
	addAllOptions(allSectionArray, rowCount);
	}
}

// Function to add Row for Schedule FSI
function addRowSchedFSIFor2(nocheck){
	
	var mainTable=document.getElementById('scheduleFSI').rows;
	var noOfRows=mainTable.length;
	
	var tobeInsertBefore=document.getElementById('scheduleFSIAddRow');
	var flag=true;
	var checkFirst=true;
	var totRow=document.getElementById('scheduleFSIFirst').cells[0].textContent;
	
	var iterate=eval(parseInt(totRow,10));
	
	var indexValue=eval(((parseInt(noOfRows,10)-4)/6)+1);
	
	var isRowBlank = true;
	for(var i=0;i<6;i++){
		if(!checkRowBlank('scheduleFSI', (3+i), 0)){
			isRowBlank = false;
			break;
		}
	}
	
	if(!isRowBlank || nocheck){
	
	for(var i=2;i<mainTable.length;i++){
	var cloneNode=mainTable[i].cloneNode(true);
        if(flag){
	
		if(checkFirst){
		iterate=eval(indexValue-1);
		
		cloneNode.cells[0].innerHTML=indexValue;
		checkFirst=false;
		}
		
                //Numbering
		var inputTags=cloneNode.getElementsByTagName('input');
		for(var a=0;a<inputTags.length;a++){
			inputTags[a].name=inputTags[a].name.replace('[0]','['+iterate+']');
			
                        inputTags[a].id=inputTags[a].name.replace(/([\.\[\]])/g,'_').replace(/(__)/g,'_');
                        inputTags[a].value='';
                        var blurAttr=inputTags[a].getAttribute('onblur');
            			if(blurAttr!=null){
            				blurAttr=blurAttr+";";
            			}else{
            				blurAttr="";
            			}
            			inputTags[a].setAttribute('onblur',blurAttr+'j.blur(this,this.name,this.value);');
		}
		
		var selectTags=cloneNode.getElementsByTagName('select');
		for(var a=0;a<selectTags.length;a++){
			selectTags[a].name=selectTags[a].name.replace('[0]','['+iterate+']');
			selectTags[a].value='';
			
                        selectTags[a].id=selectTags[a].name.replace(/([\.\[\]])/g,'_').replace(/(__)/g,'_');
                        
                        var blurAttr=selectTags[a].getAttribute('onblur');
            			if(blurAttr!=null){
            				blurAttr=blurAttr+";";
            			}else{
            				blurAttr="";
            			}
            			selectTags[a].setAttribute('onblur',blurAttr+'j.blur(this,this.name,this.value);');
		}
		
	
		
		document.getElementById('scheduleFSI').getElementsByTagName('tr')[0].parentNode.insertBefore(cloneNode,tobeInsertBefore);
            }
            if(mainTable[i].id =='scheduleFSIEnd'){
		flag=false;
		break;
		}
        }
	if($('#scheduleFSIAddRow')[0].parentNode.children.length==10){
		$('#delFSIButtonId').prop('disabled', true);
	}else if($('#scheduleFSIAddRow')[0].parentNode.children.length>10){
		$('#delFSIButtonId').prop('disabled', false);
	}
	
	}else{
		addErrorXHTML('', 'Please fill in all the mandatory fields in the last row before adding another row.');
	}
       
}

// Function to return 0 if greater than 0, else return value.
function zeroOrLess(val){
	if(parseInt(val, 10) > 0 ){
		return 0;
	}
	return parseInt(val, 10);
}

// Function for Calculation of Income for Schedule DPM.
function calculateSchDPM() {
		dpmCeasesMesg='';
		var rate15Adjustment = coalesceSetRet("scheduleDPM.plantMachinery.rate15.depreciationDetail.wdvFirstDay") + coalesceSetRet("scheduleDPM.plantMachinery.rate15.depreciationDetail.additionsGrThan180Days") - coalesceSetRet("scheduleDPM.plantMachinery.rate15.depreciationDetail.realizationTotalPeriod");
		var rate30Adjustment = coalesceSetRet("scheduleDPM.plantMachinery.rate30.depreciationDetail.wdvFirstDay") + coalesceSetRet("scheduleDPM.plantMachinery.rate30.depreciationDetail.additionsGrThan180Days") - coalesceSetRet("scheduleDPM.plantMachinery.rate30.depreciationDetail.realizationTotalPeriod");
		var rate40Adjustment = coalesceSetRet("scheduleDPM.plantMachinery.rate40.depreciationDetail.wdvFirstDay") + coalesceSetRet("scheduleDPM.plantMachinery.rate40.depreciationDetail.additionsGrThan180Days") - coalesceSetRet("scheduleDPM.plantMachinery.rate40.depreciationDetail.realizationTotalPeriod");
		var rate50Adjustment = coalesceSetRet("scheduleDPM.plantMachinery.rate50.depreciationDetail.wdvFirstDay") + coalesceSetRet("scheduleDPM.plantMachinery.rate50.depreciationDetail.additionsGrThan180Days") - coalesceSetRet("scheduleDPM.plantMachinery.rate50.depreciationDetail.realizationTotalPeriod");
		var rate60Adjustment = coalesceSetRet("scheduleDPM.plantMachinery.rate60.depreciationDetail.wdvFirstDay") + coalesceSetRet("scheduleDPM.plantMachinery.rate60.depreciationDetail.additionsGrThan180Days") - coalesceSetRet("scheduleDPM.plantMachinery.rate60.depreciationDetail.realizationTotalPeriod");
		var rate80Adjustment = coalesceSetRet("scheduleDPM.plantMachinery.rate80.depreciationDetail.wdvFirstDay") + coalesceSetRet("scheduleDPM.plantMachinery.rate80.depreciationDetail.additionsGrThan180Days") - coalesceSetRet("scheduleDPM.plantMachinery.rate80.depreciationDetail.realizationTotalPeriod");
		var rate100Adjustment = coalesceSetRet("scheduleDPM.plantMachinery.rate100.depreciationDetail.wdvFirstDay") + coalesceSetRet("scheduleDPM.plantMachinery.rate100.depreciationDetail.additionsGrThan180Days") - coalesceSetRet("scheduleDPM.plantMachinery.rate100.depreciationDetail.realizationTotalPeriod");

	    // For Field 6
		
		document.getElementsByName("scheduleDPM.plantMachinery.rate15.depreciationDetail.fullRateDeprAmt")[0].value = zeroOrMore(rate15Adjustment);
		document.getElementsByName("scheduleDPM.plantMachinery.rate30.depreciationDetail.fullRateDeprAmt")[0].value = zeroOrMore(rate30Adjustment);
		document.getElementsByName("scheduleDPM.plantMachinery.rate40.depreciationDetail.fullRateDeprAmt")[0].value = zeroOrMore(rate40Adjustment);
		document.getElementsByName("scheduleDPM.plantMachinery.rate50.depreciationDetail.fullRateDeprAmt")[0].value = zeroOrMore(rate50Adjustment);
		document.getElementsByName("scheduleDPM.plantMachinery.rate60.depreciationDetail.fullRateDeprAmt")[0].value = zeroOrMore(rate60Adjustment);
		document.getElementsByName("scheduleDPM.plantMachinery.rate80.depreciationDetail.fullRateDeprAmt")[0].value = zeroOrMore(rate80Adjustment);
		document.getElementsByName("scheduleDPM.plantMachinery.rate100.depreciationDetail.fullRateDeprAmt")[0].value = zeroOrMore(rate100Adjustment);

		rate15Adjustment = zeroOrLess(rate15Adjustment );
		rate30Adjustment = zeroOrLess(rate30Adjustment );
		rate40Adjustment = zeroOrLess(rate40Adjustment );
		rate50Adjustment = zeroOrLess(rate50Adjustment );
		rate60Adjustment = zeroOrLess(rate60Adjustment );
		rate80Adjustment = zeroOrLess(rate80Adjustment );
		rate100Adjustment =zeroOrLess(rate100Adjustment);
		
	    // For Field 9

		rate15Adjustment  =	coalesceSetRet("scheduleDPM.plantMachinery.rate15.depreciationDetail.additionsLessThan180Days") - coalesceSetRet("scheduleDPM.plantMachinery.rate15.depreciationDetail.realizationPeriodDuringYear") + parseInt(rate15Adjustment, 10);
		rate30Adjustment  = coalesceSetRet("scheduleDPM.plantMachinery.rate30.depreciationDetail.additionsLessThan180Days") - coalesceSetRet("scheduleDPM.plantMachinery.rate30.depreciationDetail.realizationPeriodDuringYear") + parseInt(rate30Adjustment, 10);
		rate40Adjustment  = coalesceSetRet("scheduleDPM.plantMachinery.rate40.depreciationDetail.additionsLessThan180Days") - coalesceSetRet("scheduleDPM.plantMachinery.rate40.depreciationDetail.realizationPeriodDuringYear") + parseInt(rate40Adjustment, 10);
		rate50Adjustment  = coalesceSetRet("scheduleDPM.plantMachinery.rate50.depreciationDetail.additionsLessThan180Days") - coalesceSetRet("scheduleDPM.plantMachinery.rate50.depreciationDetail.realizationPeriodDuringYear") + parseInt(rate50Adjustment, 10);
		rate60Adjustment  = coalesceSetRet("scheduleDPM.plantMachinery.rate60.depreciationDetail.additionsLessThan180Days") - coalesceSetRet("scheduleDPM.plantMachinery.rate60.depreciationDetail.realizationPeriodDuringYear") + parseInt(rate60Adjustment, 10);
		rate80Adjustment  = coalesceSetRet("scheduleDPM.plantMachinery.rate80.depreciationDetail.additionsLessThan180Days") - coalesceSetRet("scheduleDPM.plantMachinery.rate80.depreciationDetail.realizationPeriodDuringYear") + parseInt(rate80Adjustment, 10);
		rate100Adjustment =	coalesceSetRet("scheduleDPM.plantMachinery.rate100.depreciationDetail.additionsLessThan180Days") - coalesceSetRet("scheduleDPM.plantMachinery.rate100.depreciationDetail.realizationPeriodDuringYear") + parseInt(rate100Adjustment, 10);
		
		
		document.getElementsByName("scheduleDPM.plantMachinery.rate15.depreciationDetail.halfRateDeprAmt")[0].value = zeroOrMore( rate15Adjustment );
		document.getElementsByName("scheduleDPM.plantMachinery.rate30.depreciationDetail.halfRateDeprAmt")[0].value = zeroOrMore( rate30Adjustment );
		document.getElementsByName("scheduleDPM.plantMachinery.rate40.depreciationDetail.halfRateDeprAmt")[0].value = zeroOrMore( rate40Adjustment );
		document.getElementsByName("scheduleDPM.plantMachinery.rate50.depreciationDetail.halfRateDeprAmt")[0].value = zeroOrMore( rate50Adjustment );
		document.getElementsByName("scheduleDPM.plantMachinery.rate60.depreciationDetail.halfRateDeprAmt")[0].value = zeroOrMore( rate60Adjustment );
		document.getElementsByName("scheduleDPM.plantMachinery.rate80.depreciationDetail.halfRateDeprAmt")[0].value = zeroOrMore( rate80Adjustment );
		document.getElementsByName("scheduleDPM.plantMachinery.rate100.depreciationDetail.halfRateDeprAmt")[0].value = zeroOrMore(rate100Adjustment);

		rate15Adjustment = zeroOrLess(rate15Adjustment );
		rate30Adjustment = zeroOrLess(rate30Adjustment );
		rate40Adjustment = zeroOrLess(rate40Adjustment );
		rate50Adjustment = zeroOrLess(rate50Adjustment );
		rate60Adjustment = zeroOrLess(rate60Adjustment );
		rate80Adjustment = zeroOrLess(rate80Adjustment );
		rate100Adjustment =zeroOrLess(rate100Adjustment);

	    // For Field 10
		document.getElementsByName("scheduleDPM.plantMachinery.rate15.depreciationDetail.depreciationAtFullRate")[0].value = Math.round(coalesceSetRet("scheduleDPM.plantMachinery.rate15.depreciationDetail.fullRateDeprAmt") * 0.15);
		document.getElementsByName("scheduleDPM.plantMachinery.rate30.depreciationDetail.depreciationAtFullRate")[0].value = Math.round(coalesceSetRet("scheduleDPM.plantMachinery.rate30.depreciationDetail.fullRateDeprAmt") * 0.30);
		document.getElementsByName("scheduleDPM.plantMachinery.rate40.depreciationDetail.depreciationAtFullRate")[0].value = Math.round(coalesceSetRet("scheduleDPM.plantMachinery.rate40.depreciationDetail.fullRateDeprAmt") * 0.40);
		document.getElementsByName("scheduleDPM.plantMachinery.rate50.depreciationDetail.depreciationAtFullRate")[0].value = Math.round(coalesceSetRet("scheduleDPM.plantMachinery.rate50.depreciationDetail.fullRateDeprAmt") * 0.50);
		document.getElementsByName("scheduleDPM.plantMachinery.rate60.depreciationDetail.depreciationAtFullRate")[0].value = Math.round(coalesceSetRet("scheduleDPM.plantMachinery.rate60.depreciationDetail.fullRateDeprAmt") * 0.60);
		document.getElementsByName("scheduleDPM.plantMachinery.rate80.depreciationDetail.depreciationAtFullRate")[0].value = Math.round(coalesceSetRet("scheduleDPM.plantMachinery.rate80.depreciationDetail.fullRateDeprAmt") * 0.80);
		document.getElementsByName("scheduleDPM.plantMachinery.rate100.depreciationDetail.depreciationAtFullRate")[0].value = Math.round(coalesceSetRet("scheduleDPM.plantMachinery.rate100.depreciationDetail.fullRateDeprAmt"));

	     // For Field 11
		document.getElementsByName("scheduleDPM.plantMachinery.rate15.depreciationDetail.depreciationAtHalfRate")[0].value = Math.round(coalesceSetRet("scheduleDPM.plantMachinery.rate15.depreciationDetail.halfRateDeprAmt") * 0.075);
		document.getElementsByName("scheduleDPM.plantMachinery.rate30.depreciationDetail.depreciationAtHalfRate")[0].value = Math.round(coalesceSetRet("scheduleDPM.plantMachinery.rate30.depreciationDetail.halfRateDeprAmt") * 0.15);
		document.getElementsByName("scheduleDPM.plantMachinery.rate40.depreciationDetail.depreciationAtHalfRate")[0].value = Math.round(coalesceSetRet("scheduleDPM.plantMachinery.rate40.depreciationDetail.halfRateDeprAmt") * 0.20);
		document.getElementsByName("scheduleDPM.plantMachinery.rate50.depreciationDetail.depreciationAtHalfRate")[0].value = Math.round(coalesceSetRet("scheduleDPM.plantMachinery.rate50.depreciationDetail.halfRateDeprAmt") * 0.25);
		document.getElementsByName("scheduleDPM.plantMachinery.rate60.depreciationDetail.depreciationAtHalfRate")[0].value = Math.round(coalesceSetRet("scheduleDPM.plantMachinery.rate60.depreciationDetail.halfRateDeprAmt") * 0.30);
		document.getElementsByName("scheduleDPM.plantMachinery.rate80.depreciationDetail.depreciationAtHalfRate")[0].value = Math.round(coalesceSetRet("scheduleDPM.plantMachinery.rate80.depreciationDetail.halfRateDeprAmt") * 0.40);
		document.getElementsByName("scheduleDPM.plantMachinery.rate100.depreciationDetail.depreciationAtHalfRate")[0].value = Math.round(coalesceSetRet("scheduleDPM.plantMachinery.rate100.depreciationDetail.halfRateDeprAmt") * 0.50);

	     // For Field 15
		document.getElementsByName("scheduleDPM.plantMachinery.rate15.depreciationDetail.totalDepreciation")[0].value = zeroOrMore(coalesceSetRet("scheduleDPM.plantMachinery.rate15.depreciationDetail.depreciationAtFullRate") + coalesceSetRet("scheduleDPM.plantMachinery.rate15.depreciationDetail.depreciationAtHalfRate")+ coalesceSetRet("scheduleDPM.plantMachinery.rate15.depreciationDetail.addlnDeprOnGT180DayAdditions") + coalesceSetRet("scheduleDPM.plantMachinery.rate15.depreciationDetail.addlnDeprDuringYearAdditions")+coalesceSetRet("scheduleDPM.plantMachinery.rate15.depreciationDetail.addlnDeprOnAssetLessThan180Days"));
		document.getElementsByName("scheduleDPM.plantMachinery.rate30.depreciationDetail.totalDepreciation")[0].value = zeroOrMore(coalesceSetRet("scheduleDPM.plantMachinery.rate30.depreciationDetail.depreciationAtFullRate") + coalesceSetRet("scheduleDPM.plantMachinery.rate30.depreciationDetail.depreciationAtHalfRate")+ coalesceSetRet("scheduleDPM.plantMachinery.rate30.depreciationDetail.addlnDeprOnGT180DayAdditions") + coalesceSetRet("scheduleDPM.plantMachinery.rate30.depreciationDetail.addlnDeprDuringYearAdditions")+coalesceSetRet("scheduleDPM.plantMachinery.rate30.depreciationDetail.addlnDeprOnAssetLessThan180Days"));
		document.getElementsByName("scheduleDPM.plantMachinery.rate40.depreciationDetail.totalDepreciation")[0].value = zeroOrMore(coalesceSetRet("scheduleDPM.plantMachinery.rate40.depreciationDetail.depreciationAtFullRate") + coalesceSetRet("scheduleDPM.plantMachinery.rate40.depreciationDetail.depreciationAtHalfRate")+ coalesceSetRet("scheduleDPM.plantMachinery.rate40.depreciationDetail.addlnDeprOnGT180DayAdditions") + coalesceSetRet("scheduleDPM.plantMachinery.rate40.depreciationDetail.addlnDeprDuringYearAdditions")+ coalesceSetRet("scheduleDPM.plantMachinery.rate40.depreciationDetail.addlnDeprOnAssetLessThan180Days"));
		document.getElementsByName("scheduleDPM.plantMachinery.rate50.depreciationDetail.totalDepreciation")[0].value = zeroOrMore(coalesceSetRet("scheduleDPM.plantMachinery.rate50.depreciationDetail.depreciationAtFullRate") + coalesceSetRet("scheduleDPM.plantMachinery.rate50.depreciationDetail.depreciationAtHalfRate")+ coalesceSetRet("scheduleDPM.plantMachinery.rate50.depreciationDetail.addlnDeprOnGT180DayAdditions") + coalesceSetRet("scheduleDPM.plantMachinery.rate50.depreciationDetail.addlnDeprDuringYearAdditions") + coalesceSetRet("scheduleDPM.plantMachinery.rate50.depreciationDetail.addlnDeprOnAssetLessThan180Days"));
		document.getElementsByName("scheduleDPM.plantMachinery.rate60.depreciationDetail.totalDepreciation")[0].value = zeroOrMore(coalesceSetRet("scheduleDPM.plantMachinery.rate60.depreciationDetail.depreciationAtFullRate") + coalesceSetRet("scheduleDPM.plantMachinery.rate60.depreciationDetail.depreciationAtHalfRate")+ coalesceSetRet("scheduleDPM.plantMachinery.rate60.depreciationDetail.addlnDeprOnGT180DayAdditions") + coalesceSetRet("scheduleDPM.plantMachinery.rate60.depreciationDetail.addlnDeprDuringYearAdditions")+ coalesceSetRet("scheduleDPM.plantMachinery.rate60.depreciationDetail.addlnDeprOnAssetLessThan180Days"));
		document.getElementsByName("scheduleDPM.plantMachinery.rate80.depreciationDetail.totalDepreciation")[0].value = zeroOrMore(coalesceSetRet("scheduleDPM.plantMachinery.rate80.depreciationDetail.depreciationAtFullRate") + coalesceSetRet("scheduleDPM.plantMachinery.rate80.depreciationDetail.depreciationAtHalfRate")+ coalesceSetRet("scheduleDPM.plantMachinery.rate80.depreciationDetail.addlnDeprOnGT180DayAdditions") + coalesceSetRet("scheduleDPM.plantMachinery.rate80.depreciationDetail.addlnDeprDuringYearAdditions")+ coalesceSetRet("scheduleDPM.plantMachinery.rate80.depreciationDetail.addlnDeprOnAssetLessThan180Days"));
		document.getElementsByName("scheduleDPM.plantMachinery.rate100.depreciationDetail.totalDepreciation")[0].value = zeroOrMore(coalesceSetRet("scheduleDPM.plantMachinery.rate100.depreciationDetail.depreciationAtFullRate") + coalesceSetRet("scheduleDPM.plantMachinery.rate100.depreciationDetail.depreciationAtHalfRate")+ coalesceSetRet("scheduleDPM.plantMachinery.rate100.depreciationDetail.addlnDeprOnGT180DayAdditions") + coalesceSetRet("scheduleDPM.plantMachinery.rate100.depreciationDetail.addlnDeprDuringYearAdditions")+ coalesceSetRet("scheduleDPM.plantMachinery.rate100.depreciationDetail.addlnDeprOnAssetLessThan180Days"));

	     // For Field 17
		document.getElementsByName("scheduleDPM.plantMachinery.rate15.depreciationDetail.wdvLastDay")[0].value = zeroOrMore(coalesceSetRet("scheduleDPM.plantMachinery.rate15.depreciationDetail.fullRateDeprAmt") + coalesceSetRet("scheduleDPM.plantMachinery.rate15.depreciationDetail.halfRateDeprAmt") - coalesceSetRet("scheduleDPM.plantMachinery.rate15.depreciationDetail.totalDepreciation") +  	parseInt(rate15Adjustment , 10));
		document.getElementsByName("scheduleDPM.plantMachinery.rate30.depreciationDetail.wdvLastDay")[0].value = zeroOrMore(coalesceSetRet("scheduleDPM.plantMachinery.rate30.depreciationDetail.fullRateDeprAmt") + coalesceSetRet("scheduleDPM.plantMachinery.rate30.depreciationDetail.halfRateDeprAmt") - coalesceSetRet("scheduleDPM.plantMachinery.rate30.depreciationDetail.totalDepreciation") +  	parseInt(rate30Adjustment , 10));
		document.getElementsByName("scheduleDPM.plantMachinery.rate40.depreciationDetail.wdvLastDay")[0].value = zeroOrMore(coalesceSetRet("scheduleDPM.plantMachinery.rate40.depreciationDetail.fullRateDeprAmt") + coalesceSetRet("scheduleDPM.plantMachinery.rate40.depreciationDetail.halfRateDeprAmt") - coalesceSetRet("scheduleDPM.plantMachinery.rate40.depreciationDetail.totalDepreciation") +  	parseInt(rate40Adjustment , 10));
		document.getElementsByName("scheduleDPM.plantMachinery.rate50.depreciationDetail.wdvLastDay")[0].value = zeroOrMore(coalesceSetRet("scheduleDPM.plantMachinery.rate50.depreciationDetail.fullRateDeprAmt") + coalesceSetRet("scheduleDPM.plantMachinery.rate50.depreciationDetail.halfRateDeprAmt") - coalesceSetRet("scheduleDPM.plantMachinery.rate50.depreciationDetail.totalDepreciation") +  	parseInt(rate50Adjustment , 10));
		document.getElementsByName("scheduleDPM.plantMachinery.rate60.depreciationDetail.wdvLastDay")[0].value = zeroOrMore(coalesceSetRet("scheduleDPM.plantMachinery.rate60.depreciationDetail.fullRateDeprAmt") + coalesceSetRet("scheduleDPM.plantMachinery.rate60.depreciationDetail.halfRateDeprAmt") - coalesceSetRet("scheduleDPM.plantMachinery.rate60.depreciationDetail.totalDepreciation") +  	parseInt(rate60Adjustment , 10));
		document.getElementsByName("scheduleDPM.plantMachinery.rate80.depreciationDetail.wdvLastDay")[0].value = zeroOrMore(coalesceSetRet("scheduleDPM.plantMachinery.rate80.depreciationDetail.fullRateDeprAmt") + coalesceSetRet("scheduleDPM.plantMachinery.rate80.depreciationDetail.halfRateDeprAmt") - coalesceSetRet("scheduleDPM.plantMachinery.rate80.depreciationDetail.totalDepreciation") +  	parseInt(rate80Adjustment , 10));
		document.getElementsByName("scheduleDPM.plantMachinery.rate100.depreciationDetail.wdvLastDay")[0].value = zeroOrMore(coalesceSetRet("scheduleDPM.plantMachinery.rate100.depreciationDetail.fullRateDeprAmt") + coalesceSetRet("scheduleDPM.plantMachinery.rate100.depreciationDetail.halfRateDeprAmt") - coalesceSetRet("scheduleDPM.plantMachinery.rate100.depreciationDetail.totalDepreciation")+parseInt(rate100Adjustment, 10));

	     calculatePointNo16DPM('rate15');
	     calculatePointNo16DPM('rate30');
	     calculatePointNo16DPM('rate40');
	     calculatePointNo16DPM('rate50');
	     calculatePointNo16DPM('rate60');
	     calculatePointNo16DPM('rate80');
	     calculatePointNo16DPM('rate100');
		
}

// Function to Calculate Income for Schedule DOA.
function calculateSchDOA() {
	doaCeasesMesg='';
	var buildingRate5FullRateDeprAmt = coalesceSetRet("scheduleDOA.building.rate5.depreciationDetail.wdvFirstDay") + coalesceSetRet("scheduleDOA.building.rate5.depreciationDetail.additionsGrThan180Days") - coalesceSetRet("scheduleDOA.building.rate5.depreciationDetail.realizationTotalPeriod");
	var buildingRate10FullRateDeprAmt = coalesceSetRet("scheduleDOA.building.rate10.depreciationDetail.wdvFirstDay") + coalesceSetRet("scheduleDOA.building.rate10.depreciationDetail.additionsGrThan180Days") - coalesceSetRet("scheduleDOA.building.rate10.depreciationDetail.realizationTotalPeriod");
	var buildingRate100FullRateDeprAmt = coalesceSetRet("scheduleDOA.building.rate100.depreciationDetail.wdvFirstDay") + coalesceSetRet("scheduleDOA.building.rate100.depreciationDetail.additionsGrThan180Days") - coalesceSetRet("scheduleDOA.building.rate100.depreciationDetail.realizationTotalPeriod");
	var furnitureFittingsRate10FullRateDeprAmt = coalesceSetRet("scheduleDOA.furnitureFittings.rate10.depreciationDetail.wdvFirstDay") + coalesceSetRet("scheduleDOA.furnitureFittings.rate10.depreciationDetail.additionsGrThan180Days") - coalesceSetRet("scheduleDOA.furnitureFittings.rate10.depreciationDetail.realizationTotalPeriod");
	var intangibleAssetsRate25FullRateDeprAmt = coalesceSetRet("scheduleDOA.intangibleAssets.rate25.depreciationDetail.wdvFirstDay") + coalesceSetRet("scheduleDOA.intangibleAssets.rate25.depreciationDetail.additionsGrThan180Days") - coalesceSetRet("scheduleDOA.intangibleAssets.rate25.depreciationDetail.realizationTotalPeriod");
	var shipsRate20FullRateDeprAmt = coalesceSetRet("scheduleDOA.ships.rate20.depreciationDetail.wdvFirstDay") + coalesceSetRet("scheduleDOA.ships.rate20.depreciationDetail.additionsGrThan180Days") - coalesceSetRet("scheduleDOA.ships.rate20.depreciationDetail.realizationTotalPeriod");


    // For Field 6
	document.getElementsByName("scheduleDOA.building.rate5.depreciationDetail.fullRateDeprAmt")[0].value = zeroOrMore(buildingRate5FullRateDeprAmt);
	document.getElementsByName("scheduleDOA.building.rate10.depreciationDetail.fullRateDeprAmt")[0].value = zeroOrMore(buildingRate10FullRateDeprAmt);
	document.getElementsByName("scheduleDOA.building.rate100.depreciationDetail.fullRateDeprAmt")[0].value = zeroOrMore(buildingRate100FullRateDeprAmt);
	document.getElementsByName("scheduleDOA.furnitureFittings.rate10.depreciationDetail.fullRateDeprAmt")[0].value = zeroOrMore(furnitureFittingsRate10FullRateDeprAmt);
	document.getElementsByName("scheduleDOA.intangibleAssets.rate25.depreciationDetail.fullRateDeprAmt")[0].value = zeroOrMore(intangibleAssetsRate25FullRateDeprAmt);
	document.getElementsByName("scheduleDOA.ships.rate20.depreciationDetail.fullRateDeprAmt")[0].value = zeroOrMore(shipsRate20FullRateDeprAmt);

	buildingRate5FullRateDeprAmt = zeroOrLess(buildingRate5FullRateDeprAmt);
	buildingRate10FullRateDeprAmt = zeroOrLess(buildingRate10FullRateDeprAmt);
	buildingRate100FullRateDeprAmt = zeroOrLess(buildingRate100FullRateDeprAmt);
	furnitureFittingsRate10FullRateDeprAmt = zeroOrLess(furnitureFittingsRate10FullRateDeprAmt);
	intangibleAssetsRate25FullRateDeprAmt = zeroOrLess(intangibleAssetsRate25FullRateDeprAmt);
	shipsRate20FullRateDeprAmt = zeroOrLess(shipsRate20FullRateDeprAmt);
	
	
	buildingRate5FullRateDeprAmt = 				(coalesceSetRet("scheduleDOA.building.rate5.depreciationDetail.additionsLessThan180Days") - coalesceSetRet("scheduleDOA.building.rate5.depreciationDetail.realizationPeriodDuringYear") + buildingRate5FullRateDeprAmt);
	buildingRate10FullRateDeprAmt =             (coalesceSetRet("scheduleDOA.building.rate10.depreciationDetail.additionsLessThan180Days") - coalesceSetRet("scheduleDOA.building.rate10.depreciationDetail.realizationPeriodDuringYear") + buildingRate10FullRateDeprAmt);
	buildingRate100FullRateDeprAmt =            (coalesceSetRet("scheduleDOA.building.rate100.depreciationDetail.additionsLessThan180Days") - coalesceSetRet("scheduleDOA.building.rate100.depreciationDetail.realizationPeriodDuringYear") + buildingRate100FullRateDeprAmt);
	furnitureFittingsRate10FullRateDeprAmt =    (coalesceSetRet("scheduleDOA.furnitureFittings.rate10.depreciationDetail.additionsLessThan180Days") - coalesceSetRet("scheduleDOA.furnitureFittings.rate10.depreciationDetail.realizationPeriodDuringYear") + furnitureFittingsRate10FullRateDeprAmt);
	intangibleAssetsRate25FullRateDeprAmt =     (coalesceSetRet("scheduleDOA.intangibleAssets.rate25.depreciationDetail.additionsLessThan180Days") - coalesceSetRet("scheduleDOA.intangibleAssets.rate25.depreciationDetail.realizationPeriodDuringYear") + intangibleAssetsRate25FullRateDeprAmt);
	shipsRate20FullRateDeprAmt =                (coalesceSetRet("scheduleDOA.ships.rate20.depreciationDetail.additionsLessThan180Days") - coalesceSetRet("scheduleDOA.ships.rate20.depreciationDetail.realizationPeriodDuringYear") + shipsRate20FullRateDeprAmt);
	

    // For Field 9

	document.getElementsByName("scheduleDOA.building.rate5.depreciationDetail.halfRateDeprAmt")[0].value = zeroOrMore(buildingRate5FullRateDeprAmt);
	document.getElementsByName("scheduleDOA.building.rate10.depreciationDetail.halfRateDeprAmt")[0].value = zeroOrMore(buildingRate10FullRateDeprAmt);
	document.getElementsByName("scheduleDOA.building.rate100.depreciationDetail.halfRateDeprAmt")[0].value = zeroOrMore(buildingRate100FullRateDeprAmt);
	document.getElementsByName("scheduleDOA.furnitureFittings.rate10.depreciationDetail.halfRateDeprAmt")[0].value = zeroOrMore(furnitureFittingsRate10FullRateDeprAmt);
	document.getElementsByName("scheduleDOA.intangibleAssets.rate25.depreciationDetail.halfRateDeprAmt")[0].value = zeroOrMore(intangibleAssetsRate25FullRateDeprAmt);
	document.getElementsByName("scheduleDOA.ships.rate20.depreciationDetail.halfRateDeprAmt")[0].value = zeroOrMore(shipsRate20FullRateDeprAmt);

	buildingRate5FullRateDeprAmt = zeroOrLess(buildingRate5FullRateDeprAmt);
	buildingRate10FullRateDeprAmt = zeroOrLess(buildingRate10FullRateDeprAmt);
	buildingRate100FullRateDeprAmt = zeroOrLess(buildingRate100FullRateDeprAmt);
	furnitureFittingsRate10FullRateDeprAmt = zeroOrLess(furnitureFittingsRate10FullRateDeprAmt);
	intangibleAssetsRate25FullRateDeprAmt = zeroOrLess(intangibleAssetsRate25FullRateDeprAmt);
	shipsRate20FullRateDeprAmt = zeroOrLess(shipsRate20FullRateDeprAmt);	

    // For Field 10
	document.getElementsByName("scheduleDOA.building.rate5.depreciationDetail.depreciationAtFullRate")[0].value = Math.round(coalesceSetRet("scheduleDOA.building.rate5.depreciationDetail.fullRateDeprAmt") * 0.05);
	document.getElementsByName("scheduleDOA.building.rate10.depreciationDetail.depreciationAtFullRate")[0].value = Math.round(coalesceSetRet("scheduleDOA.building.rate10.depreciationDetail.fullRateDeprAmt") * 0.10);
	document.getElementsByName("scheduleDOA.building.rate100.depreciationDetail.depreciationAtFullRate")[0].value = Math.round(coalesceSetRet("scheduleDOA.building.rate100.depreciationDetail.fullRateDeprAmt"));
	document.getElementsByName("scheduleDOA.furnitureFittings.rate10.depreciationDetail.depreciationAtFullRate")[0].value = Math.round(coalesceSetRet("scheduleDOA.furnitureFittings.rate10.depreciationDetail.fullRateDeprAmt") * 0.10);
	document.getElementsByName("scheduleDOA.intangibleAssets.rate25.depreciationDetail.depreciationAtFullRate")[0].value = Math.round(coalesceSetRet("scheduleDOA.intangibleAssets.rate25.depreciationDetail.fullRateDeprAmt") * 0.25);
	document.getElementsByName("scheduleDOA.ships.rate20.depreciationDetail.depreciationAtFullRate")[0].value = Math.round(coalesceSetRet("scheduleDOA.ships.rate20.depreciationDetail.fullRateDeprAmt") * 0.20);

     // For Field 11
	document.getElementsByName("scheduleDOA.building.rate5.depreciationDetail.depreciationAtHalfRate")[0].value = Math.round(coalesceSetRet("scheduleDOA.building.rate5.depreciationDetail.halfRateDeprAmt") * 0.025);
	document.getElementsByName("scheduleDOA.building.rate10.depreciationDetail.depreciationAtHalfRate")[0].value = Math.round(coalesceSetRet("scheduleDOA.building.rate10.depreciationDetail.halfRateDeprAmt") * 0.05);
	document.getElementsByName("scheduleDOA.building.rate100.depreciationDetail.depreciationAtHalfRate")[0].value = Math.round(coalesceSetRet("scheduleDOA.building.rate100.depreciationDetail.halfRateDeprAmt") * 0.50);
	document.getElementsByName("scheduleDOA.furnitureFittings.rate10.depreciationDetail.depreciationAtHalfRate")[0].value = Math.round(coalesceSetRet("scheduleDOA.furnitureFittings.rate10.depreciationDetail.halfRateDeprAmt") * 0.05);
	document.getElementsByName("scheduleDOA.intangibleAssets.rate25.depreciationDetail.depreciationAtHalfRate")[0].value = Math.round(coalesceSetRet("scheduleDOA.intangibleAssets.rate25.depreciationDetail.halfRateDeprAmt") * 0.125);
	document.getElementsByName("scheduleDOA.ships.rate20.depreciationDetail.depreciationAtHalfRate")[0].value = Math.round(coalesceSetRet("scheduleDOA.ships.rate20.depreciationDetail.halfRateDeprAmt") * 0.10);

     // For Field 14
	document.getElementsByName("scheduleDOA.building.rate5.depreciationDetail.totalDepreciation")[0].value = zeroOrMore(coalesceSetRet("scheduleDOA.building.rate5.depreciationDetail.depreciationAtFullRate") + coalesceSetRet("scheduleDOA.building.rate5.depreciationDetail.depreciationAtHalfRate"));
	document.getElementsByName("scheduleDOA.building.rate10.depreciationDetail.totalDepreciation")[0].value = zeroOrMore(coalesceSetRet("scheduleDOA.building.rate10.depreciationDetail.depreciationAtFullRate") + coalesceSetRet("scheduleDOA.building.rate10.depreciationDetail.depreciationAtHalfRate"));
	document.getElementsByName("scheduleDOA.building.rate100.depreciationDetail.totalDepreciation")[0].value = zeroOrMore(coalesceSetRet("scheduleDOA.building.rate100.depreciationDetail.depreciationAtFullRate") + coalesceSetRet("scheduleDOA.building.rate100.depreciationDetail.depreciationAtHalfRate"));
	document.getElementsByName("scheduleDOA.furnitureFittings.rate10.depreciationDetail.totalDepreciation")[0].value = zeroOrMore(coalesceSetRet("scheduleDOA.furnitureFittings.rate10.depreciationDetail.depreciationAtFullRate") + coalesceSetRet("scheduleDOA.furnitureFittings.rate10.depreciationDetail.depreciationAtHalfRate"));
	document.getElementsByName("scheduleDOA.intangibleAssets.rate25.depreciationDetail.totalDepreciation")[0].value = zeroOrMore(coalesceSetRet("scheduleDOA.intangibleAssets.rate25.depreciationDetail.depreciationAtFullRate") + coalesceSetRet("scheduleDOA.intangibleAssets.rate25.depreciationDetail.depreciationAtHalfRate"));
	document.getElementsByName("scheduleDOA.ships.rate20.depreciationDetail.totalDepreciation")[0].value = zeroOrMore(coalesceSetRet("scheduleDOA.ships.rate20.depreciationDetail.depreciationAtFullRate") + coalesceSetRet("scheduleDOA.ships.rate20.depreciationDetail.depreciationAtHalfRate"));

	
     // For Field 17
	document.getElementsByName("scheduleDOA.building.rate5.depreciationDetail.wdvLastDay")[0].value = zeroOrMore(coalesceSetRet("scheduleDOA.building.rate5.depreciationDetail.fullRateDeprAmt") + coalesceSetRet("scheduleDOA.building.rate5.depreciationDetail.halfRateDeprAmt") - coalesceSetRet("scheduleDOA.building.rate5.depreciationDetail.totalDepreciation")	+ parseInt(buildingRate5FullRateDeprAmt,10));
	document.getElementsByName("scheduleDOA.building.rate10.depreciationDetail.wdvLastDay")[0].value = zeroOrMore(coalesceSetRet("scheduleDOA.building.rate10.depreciationDetail.fullRateDeprAmt") + coalesceSetRet("scheduleDOA.building.rate10.depreciationDetail.halfRateDeprAmt") - coalesceSetRet("scheduleDOA.building.rate10.depreciationDetail.totalDepreciation")	+ parseInt(buildingRate10FullRateDeprAmt,10));
	document.getElementsByName("scheduleDOA.building.rate100.depreciationDetail.wdvLastDay")[0].value = zeroOrMore(coalesceSetRet("scheduleDOA.building.rate100.depreciationDetail.fullRateDeprAmt") + coalesceSetRet("scheduleDOA.building.rate100.depreciationDetail.halfRateDeprAmt") - coalesceSetRet("scheduleDOA.building.rate100.depreciationDetail.totalDepreciation") + parseInt(buildingRate100FullRateDeprAmt,10));
	document.getElementsByName("scheduleDOA.furnitureFittings.rate10.depreciationDetail.wdvLastDay")[0].value = zeroOrMore(coalesceSetRet("scheduleDOA.furnitureFittings.rate10.depreciationDetail.fullRateDeprAmt") + coalesceSetRet("scheduleDOA.furnitureFittings.rate10.depreciationDetail.halfRateDeprAmt") - coalesceSetRet("scheduleDOA.furnitureFittings.rate10.depreciationDetail.totalDepreciation")	+ parseInt(furnitureFittingsRate10FullRateDeprAmt ,10));
	document.getElementsByName("scheduleDOA.intangibleAssets.rate25.depreciationDetail.wdvLastDay")[0].value = zeroOrMore(coalesceSetRet("scheduleDOA.intangibleAssets.rate25.depreciationDetail.fullRateDeprAmt") + coalesceSetRet("scheduleDOA.intangibleAssets.rate25.depreciationDetail.halfRateDeprAmt") - coalesceSetRet("scheduleDOA.intangibleAssets.rate25.depreciationDetail.totalDepreciation") + parseInt(intangibleAssetsRate25FullRateDeprAmt  ,10));
	document.getElementsByName("scheduleDOA.ships.rate20.depreciationDetail.wdvLastDay")[0].value = zeroOrMore(coalesceSetRet("scheduleDOA.ships.rate20.depreciationDetail.fullRateDeprAmt") + coalesceSetRet("scheduleDOA.ships.rate20.depreciationDetail.halfRateDeprAmt") - coalesceSetRet("scheduleDOA.ships.rate20.depreciationDetail.totalDepreciation") + parseInt(shipsRate20FullRateDeprAmt ,10));

     calculatePointNo16DOA('building','rate5');
     calculatePointNo16DOA('building','rate10');
     calculatePointNo16DOA('building','rate100');
     calculatePointNo16DOA('furnitureFittings','rate10');
     calculatePointNo16DOA('intangibleAssets','rate25');
     calculatePointNo16DOA('ships','rate20');

}

// Validate Sec 50G for Schedule CG.
function validateSec50C_CG(capGainType) {
	var fullConsideration = document.getElementsByName('scheduleCGPost45.'+capGainType+'.saleofLandBuild.fullConsideration')[0];
	var propertyValuation = document.getElementsByName('scheduleCGPost45.'+capGainType+'.saleofLandBuild.propertyValuation')[0];
	var fullConsideration50C = document.getElementsByName('scheduleCGPost45.'+capGainType+'.saleofLandBuild.fullConsideration50C')[0];
	
	if(fullConsideration50C.value!=fullConsideration.value && fullConsideration50C.value!=propertyValuation.value){
		j.setFieldError('scheduleCGPost45.'+capGainType+'.saleofLandBuild.fullConsideration50C','Please enter value from ai or aii only');
		addErrorXHTML(fullConsideration50C ,'Please enter value from ai or aii only',true);
	}
}

// Calculate Income for Schedule DEP.
function calcSchDEPFor6(){

	var deprBlockTot15Percent = document.getElementsByName('scheduleDEP.summaryFromDeprSch.plantMachinerySummary.deprBlockTot15Percent')[0]; deprBlockTot15Percent.value = coalesce(deprBlockTot15Percent.value);
	var deprBlockTot30Percent = document.getElementsByName('scheduleDEP.summaryFromDeprSch.plantMachinerySummary.deprBlockTot30Percent')[0]; deprBlockTot30Percent.value = coalesce(deprBlockTot30Percent.value);
	var deprBlockTot40Percent = document.getElementsByName('scheduleDEP.summaryFromDeprSch.plantMachinerySummary.deprBlockTot40Percent')[0]; deprBlockTot40Percent.value = coalesce(deprBlockTot40Percent.value);
	var deprBlockTot50Percent = document.getElementsByName('scheduleDEP.summaryFromDeprSch.plantMachinerySummary.deprBlockTot50Percent')[0]; deprBlockTot50Percent.value = coalesce(deprBlockTot50Percent.value);
	var deprBlockTot60Percent = document.getElementsByName('scheduleDEP.summaryFromDeprSch.plantMachinerySummary.deprBlockTot60Percent')[0]; deprBlockTot60Percent.value = coalesce(deprBlockTot60Percent.value);
	var deprBlockTot80Percent = document.getElementsByName('scheduleDEP.summaryFromDeprSch.plantMachinerySummary.deprBlockTot80Percent')[0]; deprBlockTot80Percent.value = coalesce(deprBlockTot80Percent.value);
	var deprBlockTot100Percent = document.getElementsByName('scheduleDEP.summaryFromDeprSch.plantMachinerySummary.deprBlockTot100Percent')[0]; deprBlockTot100Percent.value = coalesce(deprBlockTot100Percent.value);
	var totPlntMach = document.getElementsByName('scheduleDEP.summaryFromDeprSch.plantMachinerySummary.totPlntMach')[0]; totPlntMach.value = coalesce(totPlntMach.value);
	var deprBlockTot5Percent = document.getElementsByName('scheduleDEP.summaryFromDeprSch.buildingSummary.deprBlockTot5Percent')[0]; deprBlockTot5Percent.value = coalesce(deprBlockTot5Percent.value);
	var deprBlockTot10Percent = document.getElementsByName('scheduleDEP.summaryFromDeprSch.buildingSummary.deprBlockTot10Percent')[0]; deprBlockTot10Percent.value = coalesce(deprBlockTot10Percent.value);
	var buildingDeprBlockTot100Percent = document.getElementsByName('scheduleDEP.summaryFromDeprSch.buildingSummary.deprBlockTot100Percent')[0]; buildingDeprBlockTot100Percent.value = coalesce(buildingDeprBlockTot100Percent.value);
	var totBuildng = document.getElementsByName('scheduleDEP.summaryFromDeprSch.buildingSummary.totBuildng')[0]; totBuildng.value = coalesce(totBuildng.value);
	var furnitureSummary = document.getElementsByName('scheduleDEP.summaryFromDeprSch.furnitureSummary')[0]; furnitureSummary.value = coalesce(furnitureSummary.value);
	var intangibleAssetSummary = document.getElementsByName('scheduleDEP.summaryFromDeprSch.intangibleAssetSummary')[0]; intangibleAssetSummary.value = coalesce(intangibleAssetSummary.value);
	var shipsSummary = document.getElementsByName('scheduleDEP.summaryFromDeprSch.shipsSummary')[0]; shipsSummary.value = coalesce(shipsSummary.value);
	var profBfrTaxPL = document.getElementsByName('scheduleDEP.summaryFromDeprSch.totalDepreciation')[0]; profBfrTaxPL.value = coalesce(profBfrTaxPL.value);


	deprBlockTot15Percent.value = coalesce(document.getElementsByName('scheduleDPM.plantMachinery.rate15.depreciationDetail.totalDepreciation')[0].value) ;
	deprBlockTot30Percent.value = coalesce(document.getElementsByName('scheduleDPM.plantMachinery.rate30.depreciationDetail.totalDepreciation')[0].value) ;
	deprBlockTot40Percent.value = coalesce(document.getElementsByName('scheduleDPM.plantMachinery.rate40.depreciationDetail.totalDepreciation')[0].value) ;
	deprBlockTot50Percent.value = coalesce(document.getElementsByName('scheduleDPM.plantMachinery.rate50.depreciationDetail.totalDepreciation')[0].value) ;
	deprBlockTot60Percent.value = coalesce(document.getElementsByName('scheduleDPM.plantMachinery.rate60.depreciationDetail.totalDepreciation')[0].value) ;
	deprBlockTot80Percent.value = coalesce(document.getElementsByName('scheduleDPM.plantMachinery.rate80.depreciationDetail.totalDepreciation')[0].value) ;
	deprBlockTot100Percent.value = coalesce(document.getElementsByName('scheduleDPM.plantMachinery.rate100.depreciationDetail.totalDepreciation')[0].value) ;
	totPlntMach.value = eval(parseInt(deprBlockTot15Percent.value,10)) + eval(parseInt(deprBlockTot30Percent.value,10)) + eval(parseInt(deprBlockTot40Percent.value,10)) + eval(parseInt(deprBlockTot50Percent.value,10)) + eval(parseInt(deprBlockTot60Percent.value,10)) + eval(parseInt(deprBlockTot80Percent.value,10)) + eval(parseInt(deprBlockTot100Percent.value,10));


	deprBlockTot5Percent.value = coalesce(document.getElementsByName('scheduleDOA.building.rate5.depreciationDetail.totalDepreciation')[0].value) ;
	deprBlockTot10Percent.value = coalesce(document.getElementsByName('scheduleDOA.building.rate10.depreciationDetail.totalDepreciation')[0].value) ;
	buildingDeprBlockTot100Percent.value = coalesce(document.getElementsByName('scheduleDOA.building.rate100.depreciationDetail.totalDepreciation')[0].value) ;
	totBuildng.value = eval(parseInt(deprBlockTot5Percent.value,10)) + eval(parseInt(deprBlockTot10Percent.value,10)) + eval(parseInt(buildingDeprBlockTot100Percent.value,10));

	furnitureSummary.value = coalesce(document.getElementsByName('scheduleDOA.furnitureFittings.rate10.depreciationDetail.totalDepreciation')[0].value) ;
	intangibleAssetSummary.value = coalesce(document.getElementsByName('scheduleDOA.intangibleAssets.rate25.depreciationDetail.totalDepreciation')[0].value) ;
	shipsSummary.value = coalesce(document.getElementsByName('scheduleDOA.ships.rate20.depreciationDetail.totalDepreciation')[0].value);

	profBfrTaxPL.value = eval(parseInt(totPlntMach.value,10)) + eval(parseInt(totBuildng.value,10)) + eval(parseInt(furnitureSummary.value,10)) + eval(parseInt(intangibleAssetSummary.value,10)) + eval(parseInt(shipsSummary.value,10));

}

// Calculate Income for Schedule DCG.
function calcSchDCGFor6(){

	var deprBlockTot15Percent = document.getElementsByName('scheduleDCG.summaryFromDeprSchCG.plantMachinerySummaryCG.deprBlockTot15Percent')[0]; deprBlockTot15Percent.value = coalesce(deprBlockTot15Percent.value);
	var deprBlockTot30Percent = document.getElementsByName('scheduleDCG.summaryFromDeprSchCG.plantMachinerySummaryCG.deprBlockTot30Percent')[0]; deprBlockTot30Percent.value = coalesce(deprBlockTot30Percent.value);
	var deprBlockTot40Percent = document.getElementsByName('scheduleDCG.summaryFromDeprSchCG.plantMachinerySummaryCG.deprBlockTot40Percent')[0]; deprBlockTot40Percent.value = coalesce(deprBlockTot40Percent.value);
	var deprBlockTot50Percent = document.getElementsByName('scheduleDCG.summaryFromDeprSchCG.plantMachinerySummaryCG.deprBlockTot50Percent')[0]; deprBlockTot50Percent.value = coalesce(deprBlockTot50Percent.value);
	var deprBlockTot60Percent = document.getElementsByName('scheduleDCG.summaryFromDeprSchCG.plantMachinerySummaryCG.deprBlockTot60Percent')[0]; deprBlockTot60Percent.value = coalesce(deprBlockTot60Percent.value);
	var deprBlockTot80Percent = document.getElementsByName('scheduleDCG.summaryFromDeprSchCG.plantMachinerySummaryCG.deprBlockTot80Percent')[0]; deprBlockTot80Percent.value = coalesce(deprBlockTot80Percent.value);
	var deprBlockTot100Percent = document.getElementsByName('scheduleDCG.summaryFromDeprSchCG.plantMachinerySummaryCG.deprBlockTot100Percent')[0]; deprBlockTot100Percent.value = coalesce(deprBlockTot100Percent.value);
	var totPlntMach = document.getElementsByName('scheduleDCG.summaryFromDeprSchCG.plantMachinerySummaryCG.totPlntMach')[0]; totPlntMach.value = coalesce(totPlntMach.value);
	var deprBlockTot5Percent = document.getElementsByName('scheduleDCG.summaryFromDeprSchCG.buildingSummaryCG.deprBlockTot5Percent')[0]; deprBlockTot5Percent.value = coalesce(deprBlockTot5Percent.value);
	var deprBlockTot10Percent = document.getElementsByName('scheduleDCG.summaryFromDeprSchCG.buildingSummaryCG.deprBlockTot10Percent')[0]; deprBlockTot10Percent.value = coalesce(deprBlockTot10Percent.value);
	var buildingDeprBlockTot100Percent = document.getElementsByName('scheduleDCG.summaryFromDeprSchCG.buildingSummaryCG.deprBlockTot100Percent')[0]; buildingDeprBlockTot100Percent.value = coalesce(buildingDeprBlockTot100Percent.value);
	var totBuildng = document.getElementsByName('scheduleDCG.summaryFromDeprSchCG.buildingSummaryCG.totBuildng')[0]; totBuildng.value = coalesce(totBuildng.value);
	var furnitureSummary = document.getElementsByName('scheduleDCG.summaryFromDeprSchCG.furnitureSummary')[0]; furnitureSummary.value = coalesce(furnitureSummary.value);
	var intangibleAssetSummary = document.getElementsByName('scheduleDCG.summaryFromDeprSchCG.intangibleAssetSummary')[0]; intangibleAssetSummary.value = coalesce(intangibleAssetSummary.value);
	var shipsSummary = document.getElementsByName('scheduleDCG.summaryFromDeprSchCG.shipsSummary')[0]; shipsSummary.value = coalesce(shipsSummary.value);
	var profBfrTaxPL = document.getElementsByName('scheduleDCG.summaryFromDeprSchCG.totalDepreciation')[0]; profBfrTaxPL.value = coalesce(profBfrTaxPL.value);


	deprBlockTot15Percent.value = coalesce(document.getElementsByName('scheduleDPM.plantMachinery.rate15.depreciationDetail.capGainUs50')[0].value) ;
	deprBlockTot30Percent.value = coalesce(document.getElementsByName('scheduleDPM.plantMachinery.rate30.depreciationDetail.capGainUs50')[0].value) ;
	deprBlockTot40Percent.value = coalesce(document.getElementsByName('scheduleDPM.plantMachinery.rate40.depreciationDetail.capGainUs50')[0].value) ;
	deprBlockTot50Percent.value = coalesce(document.getElementsByName('scheduleDPM.plantMachinery.rate50.depreciationDetail.capGainUs50')[0].value) ;
	deprBlockTot60Percent.value = coalesce(document.getElementsByName('scheduleDPM.plantMachinery.rate60.depreciationDetail.capGainUs50')[0].value) ;
	deprBlockTot80Percent.value = coalesce(document.getElementsByName('scheduleDPM.plantMachinery.rate80.depreciationDetail.capGainUs50')[0].value) ;
	deprBlockTot100Percent.value = coalesce(document.getElementsByName('scheduleDPM.plantMachinery.rate100.depreciationDetail.capGainUs50')[0].value) ;
	totPlntMach.value = eval(parseInt(deprBlockTot15Percent.value,10)) + eval(parseInt(deprBlockTot30Percent.value,10)) + eval(parseInt(deprBlockTot40Percent.value,10)) + eval(parseInt(deprBlockTot50Percent.value,10)) + eval(parseInt(deprBlockTot60Percent.value,10)) + eval(parseInt(deprBlockTot80Percent.value,10)) + eval(parseInt(deprBlockTot100Percent.value,10));


	deprBlockTot5Percent.value = coalesce(document.getElementsByName('scheduleDOA.building.rate5.depreciationDetail.capGainUs50')[0].value) ;
	deprBlockTot10Percent.value = coalesce(document.getElementsByName('scheduleDOA.building.rate10.depreciationDetail.capGainUs50')[0].value) ;
	buildingDeprBlockTot100Percent.value = coalesce(document.getElementsByName('scheduleDOA.building.rate100.depreciationDetail.capGainUs50')[0].value) ;
	totBuildng.value = eval(parseInt(deprBlockTot5Percent.value,10)) + eval(parseInt(deprBlockTot10Percent.value,10)) + eval(parseInt(buildingDeprBlockTot100Percent.value,10));

	furnitureSummary.value = coalesce(document.getElementsByName('scheduleDOA.furnitureFittings.rate10.depreciationDetail.capGainUs50')[0].value) ;
	intangibleAssetSummary.value = coalesce(document.getElementsByName('scheduleDOA.intangibleAssets.rate25.depreciationDetail.capGainUs50')[0].value) ;
	shipsSummary.value = coalesce(document.getElementsByName('scheduleDOA.ships.rate20.depreciationDetail.capGainUs50')[0].value);

	profBfrTaxPL.value = eval(parseInt(totPlntMach.value,10)) + eval(parseInt(totBuildng.value,10)) + eval(parseInt(furnitureSummary.value,10)) + eval(parseInt(intangibleAssetSummary.value,10)) + eval(parseInt(shipsSummary.value,10));
	document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.amtDeemedCGDepAssets')[0].value=profBfrTaxPL.value;

}
	
// Calculate Income for Point 16 of Schedule DPM.
function calculatePointNo16DPM(percentRate) {
	 if( $('[name="scheduleDPM.plantMachinery.'+percentRate+'.depreciationDetail.capGainUs50"]')[0].value!=0 &&  $('[name="scheduleDPM.plantMachinery.'+percentRate+'.depreciationDetail.capGainUs50"]')[0].value!="") {

    	 var CapGainUs50 = calcPoint16DPMvalue(percentRate);


		 if(CapGainUs50>0 && $('[name="scheduleDPM.plantMachinery.'+percentRate+'.depreciationDetail.capGainUs50"]')[0].value>0 && $('[name="scheduleDPM.plantMachinery.'+percentRate+'.depreciationDetail.capGainUs50"]')[0].value<CapGainUs50) {
			if(document.getElementsByName('scheduleDPM.plantMachinery.'+percentRate+'.depreciationDetail.capGainUs50')[0].changed==true){
			 
			 document.getElementsByName('scheduleDPM.plantMachinery.'+percentRate+'.depreciationDetail.capGainUs50')[0].changed=false;
			 }
			 main.generateMsgDialogWithOk('The calculated value of Capital Gain/Loss u/s 50 in S.No 16 is '+CapGainUs50+' and is different from what has been entered by you (value entered by user). Please enter correct value of sale consideration in S.No 5 or 8 of this schedule. Else the entered value will be replaced with the calculated value.', "");
			
			overrideDpmCapGainUs50(percentRate,CapGainUs50);
			calcSchDCGFor6();

		 }

		 if(CapGainUs50<0 && $('[name="scheduleDPM.plantMachinery.'+percentRate+'.depreciationDetail.capGainUs50"]')[0].value<0 && $('[name="scheduleDPM.plantMachinery.'+percentRate+'.depreciationDetail.capGainUs50"]')[0].value>CapGainUs50) {
			 if(document.getElementsByName('scheduleDPM.plantMachinery.'+percentRate+'.depreciationDetail.capGainUs50')[0].changed==true){
			 
			 document.getElementsByName('scheduleDPM.plantMachinery.'+percentRate+'.depreciationDetail.capGainUs50')[0].changed=false;
			 }
			// main.generateMsgDialog('The calculated value of Capital Gain/Loss u/s 50 in S.No 16 is '+CapGainUs50+' and is different from what has been entered by you. Please enter correct value of sale consideration in S.No 5 or 8 of this schedule. Else the entered value will be replaced with the calculated value.',"overrideDpmCapGainUs50('"+percentRate+"','"+CapGainUs50+"');calcSchDCGFor6();");
			 
			 main.generateMsgDialogWithOk('The calculated value of Capital Gain/Loss u/s 50 in S.No 16 is '+CapGainUs50+' and is different from what has been entered by you. Please enter correct value of sale consideration in S.No 5 or 8 of this schedule. Else the entered value will be replaced with the calculated value.', "");
			 overrideDpmCapGainUs50(percentRate,CapGainUs50);
			 calcSchDCGFor6();
			 

		 }

		 if(CapGainUs50<0 && $('[name="scheduleDPM.plantMachinery.'+percentRate+'.depreciationDetail.capGainUs50"]')[0].value<0) {
			dpmCeasesMesg=dpmCeasesMesg+'Block Depreciation - Plant and Machinery @ '+percentRate.substring(4)+'% ceases to exist.<br/>';
			 
		 }

		 $('[name="scheduleDPM.plantMachinery.'+percentRate+'.depreciationDetail.depreciationAtFullRate"]')[0].value=0;
    	 $('[name="scheduleDPM.plantMachinery.'+percentRate+'.depreciationDetail.depreciationAtHalfRate"]')[0].value=0;
    	 $('[name="scheduleDPM.plantMachinery.'+percentRate+'.depreciationDetail.addlnDeprOnGT180DayAdditions"]')[0].value=0;
    	 $('[name="scheduleDPM.plantMachinery.'+percentRate+'.depreciationDetail.addlnDeprDuringYearAdditions"]')[0].value=0;
    	 $('[name="scheduleDPM.plantMachinery.'+percentRate+'.depreciationDetail.totalDepreciation"]')[0].value=0;
    	 $('[name="scheduleDPM.plantMachinery.'+percentRate+'.depreciationDetail.wdvLastDay"]')[0].value=0;
    	 $('[name="scheduleDPM.plantMachinery.'+percentRate+'.depreciationDetail.addlnDeprOnAssetLessThan180Days"]')[0].value=0;

     }

}

//Calculate Income for Point 16 of Schedule DPM.
function calcPoint16DPMvalue(percentRate) {
	return coalesceSetRet("scheduleDPM.plantMachinery."+percentRate+".depreciationDetail.realizationTotalPeriod") + coalesceSetRet("scheduleDPM.plantMachinery."+percentRate+".depreciationDetail.realizationPeriodDuringYear") - coalesceSetRet("scheduleDPM.plantMachinery."+percentRate+".depreciationDetail.wdvFirstDay") - coalesceSetRet("scheduleDPM.plantMachinery."+percentRate+".depreciationDetail.additionsGrThan180Days") - coalesceSetRet("scheduleDPM.plantMachinery."+percentRate+".depreciationDetail.additionsLessThan180Days") - coalesceSetRet("scheduleDPM.plantMachinery."+percentRate+".depreciationDetail.expdrOnTrforSaleAsset");
}

// Override Schedule DPM Capital Gains.
function overrideDpmCapGainUs50(percentRate,CapGainUs50) {
 $('[name="scheduleDPM.plantMachinery.'+percentRate+'.depreciationDetail.capGainUs50"]')[0].value = parseInt(CapGainUs50,10);

}

// Calculate Point 16 of Schedule DOA.
function calculatePointNo16DOA(assetName,percentRate) {
	 if( $('[name="scheduleDOA.'+assetName+'.'+percentRate+'.depreciationDetail.capGainUs50"]')[0].value!=0 &&  $('[name="scheduleDOA.'+assetName+'.'+percentRate+'.depreciationDetail.capGainUs50"]')[0].value!="") {

   	 var CapGainUs50 = calcPoint16DOAvalue(assetName,percentRate);
		 if(CapGainUs50>0 && $('[name="scheduleDOA.'+assetName+'.'+percentRate+'.depreciationDetail.capGainUs50"]')[0].value>0 && $('[name="scheduleDOA.'+assetName+'.'+percentRate+'.depreciationDetail.capGainUs50"]')[0].value<CapGainUs50) {
			 if(document.getElementsByName('scheduleDOA.'+ assetName +'.'+percentRate+'.depreciationDetail.capGainUs50')[0].changed==true){
			 
			 document.getElementsByName('scheduleDOA.'+assetName+'.'+percentRate+'.depreciationDetail.capGainUs50')[0].changed=false;
			 }
			
			  main.generateMsgDialogWithOk('The calculated value of Capital Gain/Loss u/s 50 in S.No 16 is '+CapGainUs50+' and is different from what has been entered by you (value entered by user). Please enter correct value of sale consideration in S.No 5 or 8 of this schedule. Else the entered value will be replaced with the calculated value.',"");
			 
			 overrideDoaCapGainUs50(percentRate,CapGainUs50,assetName);
			  calcSchDCGFor6();

		 }

		 if(CapGainUs50<0 && $('[name="scheduleDOA.'+assetName+'.'+percentRate+'.depreciationDetail.capGainUs50"]')[0].value<0 && $('[name="scheduleDOA.'+assetName+'.'+percentRate+'.depreciationDetail.capGainUs50"]')[0].value>CapGainUs50) {
			 if(document.getElementsByName('scheduleDOA.'+assetName+'.'+percentRate+'.depreciationDetail.capGainUs50')[0].changed==true){
			 
			 document.getElementsByName('scheduleDOA.'+assetName+'.'+percentRate+'.depreciationDetail.capGainUs50')[0].changed=false;
			 }
			
			 main.generateMsgDialogWithOk('The calculated value of Capital Gain/Loss u/s 50 in S.No 16 is '+CapGainUs50+' and is different from what has been entered by you. Please enter correct value of sale consideration in S.No 5 or 8 of this schedule. Else the entered value will be replaced with the calculated value.',"");
			 
			 overrideDoaCapGainUs50(percentRate,CapGainUs50,assetName);
			 calcSchDCGFor6();
		 }

		 if(CapGainUs50<0 && $('[name="scheduleDOA.'+assetName+'.'+percentRate+'.depreciationDetail.capGainUs50"]')[0].value<0) {
			doaCeasesMesg=doaCeasesMesg+'Block Depreciation - '+assetName+' @ '+percentRate.substring(4)+'% ceases to exist.<br/>';
			
		 }

		 $('[name="scheduleDOA.'+assetName+'.'+percentRate+'.depreciationDetail.depreciationAtFullRate"]')[0].value=0;
   	 $('[name="scheduleDOA.'+assetName+'.'+percentRate+'.depreciationDetail.depreciationAtHalfRate"]')[0].value=0;
  // 	 $('[name="scheduleDOA.'+assetName+'.'+percentRate+'.depreciationDetail.addlnDeprOnGT180DayAdditions"]')[0].value=0;
   	// $('[name="scheduleDOA.'+assetName+'.'+percentRate+'.depreciationDetail.addlnDeprDuringYearAdditions"]')[0].value=0;
   	 $('[name="scheduleDOA.'+assetName+'.'+percentRate+'.depreciationDetail.totalDepreciation"]')[0].value=0;
   	 $('[name="scheduleDOA.'+assetName+'.'+percentRate+'.depreciationDetail.wdvLastDay"]')[0].value=0;

    }

}

//Calculate Point 16 of Schedule DOA.
function calcPoint16DOAvalue(assetName,percentRate) {
	return coalesceSetRet("scheduleDOA."+assetName+"."+percentRate+".depreciationDetail.realizationTotalPeriod") + coalesceSetRet("scheduleDOA."+assetName+"."+percentRate+".depreciationDetail.realizationPeriodDuringYear") - coalesceSetRet("scheduleDOA."+assetName+"."+percentRate+".depreciationDetail.wdvFirstDay") - coalesceSetRet("scheduleDOA."+assetName+"."+percentRate+".depreciationDetail.additionsGrThan180Days") - coalesceSetRet("scheduleDOA."+assetName+"."+percentRate+".depreciationDetail.additionsLessThan180Days") - coalesceSetRet("scheduleDOA."+assetName+"."+percentRate+".depreciationDetail.expdrOnTrforSaleAsset");
}

// Calculate Capital Gains for Schedule DOA.
function overrideDoaCapGainUs50(percentRate,CapGainUs50,assetName) {
 $('[name="scheduleDOA.'+assetName+'.'+percentRate+'.depreciationDetail.capGainUs50"]')[0].value = parseInt(CapGainUs50,10);
 }
 
// Function for Add Row to Schedule CG.
 function addRowToCG(tableId){
	var tab = document.getElementById(tableId);
	var body = tab.tBodies[0];
	var clone = body.cloneNode(true);
	var index = parseInt(tab.tBodies.length,10) + 1;
	clone.rows[0].cells[0].innerHTML = index;
	var inputs = clone.getElementsByTagName('INPUT');
	for(var i=0;i<inputs.length;i++){
		inputs[i].name = inputs[i].name.replace(/\[[\d]+\]/, '[' + (index-1) + ']');
		inputs[i].value = '';
		var blurAttr=inputs[i].getAttribute('onblur');
		if(blurAttr!=null){
			blurAttr=blurAttr+";";
		}else{
			blurAttr="";
		}		
		inputs[i].setAttribute('onblur',blurAttr+'j.blur(this,this.name,this.value);');
	}
	var selects = clone.getElementsByTagName('SELECT');
	for(var i=0;i<selects.length;i++){
		selects[i].name = selects[i].name.replace(/\[[\d]+\]/, '[' + (index-1) + ']');
		selects[i].selectedIndex = 0;
		var blurAttr=selects[i].getAttribute('onblur');
		if(blurAttr!=null){
			blurAttr=blurAttr+";";
		}else{
			blurAttr="";
		}		
		selects[i].setAttribute('onblur',blurAttr+'j.blur(this,this.name,this.value);');
	}	
	
	if(clone.getElementsByTagName('table').length>0){
		clone.getElementsByTagName('table')[0].setAttribute('id',tableId+'_ded'+index);
		clone.getElementsByTagName('img')[0].setAttribute('onclick','addRowToTable('+'\''+tableId+'_ded'+index+'\',3,2,this);');
		clone.getElementsByTagName('img')[1].setAttribute('onclick','deleteRowTable('+'\''+tableId+'_ded'+index+'\',1,2)');
	}
	tab.appendChild(clone);
	modifyRow(tab);
	
	if(clone.getElementsByTagName('table').length>0){
		$('#'+tableId+'_ded'+index+' input').attr("checked" , true);
	    deleteRowTable(tableId+'_ded'+index,1,2);
		$('#'+tableId+'_ded'+index+' input').attr("checked" , false);
	}
}

// Function to Delete Row for Schedule CG.
function deleteRowToCG(tableId){
	var tab = document.getElementById(tableId);
	var len = tab.tBodies.length;
	if(len>1){
		tab.removeChild(tab.tBodies[len-1]);
	}
	modifyRow(tab);
}

// Function to calculate Income for Schedule CG.
function calcSchCG(cgosIncome){
	try{

		calculateSTCG(cgosIncome);
		calculateLTCG(cgosIncome);
		
		var totScheduleCGPost45 = document.getElementsByName('scheduleCGPost45.totScheduleCGPost45')[0];
		totScheduleCGPost45.value = eval(coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.totalSTCG') +
										 parseInt(zeroOrMore(coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.totalLTCG'))));
		
		calculateCGDeductions();
		
		doCGSetOff(cgosIncome);

		
	}catch(e){
		alert('error in calcSchCG=' + e.stack);
	}
}

// Function for calculating LTCG and STCG.
	function calcSchCGLtcgStcg(){

		try{
			
		var stcg15Per = coalesceSetRet("scheduleBFLA.stcg.stcg15Per.incBFLA.incOfCurYrAfterSetOffBFLosses");
		var shortTermUnder15Per = 		coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.shortTermUnder15Per.upto15Of6") +  
		coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.shortTermUnder15Per.upto15Of9") +  
									coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.shortTermUnder15Per.up16Of9To15Of12") + 
									coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.shortTermUnder15Per.up16Of12To15Of3") + 
									coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.shortTermUnder15Per.up16Of3To31Of3");
		
		var stcgAppRate = coalesceSetRet("scheduleBFLA.stcg.stcgAppRate.incBFLA.incOfCurYrAfterSetOffBFLosses");
		var shortTermUnderAppRate = coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.shortTermUnderAppRate.upto15Of6") + 
			coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.shortTermUnderAppRate.upto15Of9") + 
									coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.shortTermUnderAppRate.up16Of9To15Of12") + 
									coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.shortTermUnderAppRate.up16Of12To15Of3") + 
									coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.shortTermUnderAppRate.up16Of3To31Of3");

		var stcg30Per = coalesceSetRet("scheduleBFLA.stcg.stcg30Per.incBFLA.incOfCurYrAfterSetOffBFLosses");
		var shortTermUnder30Per = 	coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.shortTermUnder30Per.upto15Of6") + 
			coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.shortTermUnder30Per.upto15Of9") + 
									coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.shortTermUnder30Per.up16Of9To15Of12") + 
									coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.shortTermUnder30Per.up16Of12To15Of3") + 
									coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.shortTermUnder30Per.up16Of3To31Of3") ;
		
		var ltcg10Per = coalesceSetRet("scheduleBFLA.ltcg.ltcg10Per.incBFLA.incOfCurYrAfterSetOffBFLosses");
		var longTermUnder10Per = coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.longTermUnder10Per.upto15Of6") + 
			coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.longTermUnder10Per.upto15Of9") + 
									coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.longTermUnder10Per.up16Of9To15Of12") + 
									coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.longTermUnder10Per.up16Of12To15Of3") + 
									coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.longTermUnder10Per.up16Of3To31Of3") ;

		var ltcg20Per = coalesceSetRet("scheduleBFLA.ltcg.ltcg20Per.incBFLA.incOfCurYrAfterSetOffBFLosses");
		var longTermUnder20Per = coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.longTermUnder20Per.upto15Of6") + 
			coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.longTermUnder20Per.upto15Of9") + 
									coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.longTermUnder20Per.up16Of9To15Of12") + 
									coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.longTermUnder20Per.up16Of12To15Of3") + 
									coalesceSetRet("scheduleCGPost45.accruOrRecOfCG.longTermUnder20Per.up16Of3To31Of3") ;	
		
		// check for STCG
		if(stcg15Per > shortTermUnder15Per) {
			j.setFieldError('scheduleCGPost45.accruOrRecOfCG.shortTermUnder15Per.upto15Of6','Total of Quarterly breakup in STCG 15% is less by ' + (stcg15Per-shortTermUnder15Per));
			addErrorXHTML('',"Total of Quarterly breakup in STCG 111A is less by " + (stcg15Per-shortTermUnder15Per));
			}
		if(stcg15Per < shortTermUnder15Per) {
			j.setFieldError('scheduleCGPost45.accruOrRecOfCG.shortTermUnder15Per.upto15Of6','Total of Quarterly breakup in STCG 15% is more by ' + Math.abs(stcg15Per-shortTermUnder15Per));
			addErrorXHTML('',"Total of Quarterly breakup in STCG 111A is more by " + Math.abs(stcg15Per-shortTermUnder15Per));
			}
		
		if(stcgAppRate > shortTermUnderAppRate) {
			j.setFieldError('scheduleCGPost45.accruOrRecOfCG.shortTermUnderAppRate.upto15Of6','Total of Quarterly breakup in STCG Applicable Rates is less by ' + (stcgAppRate-shortTermUnderAppRate));
			addErrorXHTML('',"Total of Quarterly breakup in STCG Others is less by " + (stcgAppRate-shortTermUnderAppRate));
		}
		if(stcgAppRate < shortTermUnderAppRate) {
			j.setFieldError('scheduleCGPost45.accruOrRecOfCG.shortTermUnderAppRate.upto15Of6','Total of Quarterly breakup in STCG Applicable Rates is more by ' + Math.abs(stcgAppRate-shortTermUnderAppRate));
			addErrorXHTML('',"Total of Quarterly breakup in STCG Others is more by " + Math.abs(stcgAppRate-shortTermUnderAppRate));
		}
		if(stcg30Per > shortTermUnder30Per) {
			j.setFieldError('scheduleCGPost45.accruOrRecOfCG.shortTermUnder30Per.upto15Of6', 'Total of Quarterly breakup in STCG 30% is less by ' + (stcg30Per-shortTermUnder30Per));
			addErrorXHTML('',"Total of Quarterly breakup in LTCG Proviso is less by " + (stcg30Per-shortTermUnder30Per));
		}
		if(stcg30Per < shortTermUnder30Per) {
			j.setFieldError('scheduleCGPost45.accruOrRecOfCG.shortTermUnder30Per.upto15Of6', 'Total of Quarterly breakup in STCG 30% is more by ' + (stcg30Per-shortTermUnder30Per));
			addErrorXHTML('',"Total of Quarterly breakup in LTCG Proviso is more by " + Math.abs(stcg30Per-shortTermUnder30Per));
		}
		
		// check for LTCG

		if(ltcg10Per > longTermUnder10Per)	{
			j.setFieldError('scheduleCGPost45.accruOrRecOfCG.longTermUnder10Per.upto15Of6','Total of Quarterly breakup in LTCG 10% is less by ' + (ltcg10Per-longTermUnder10Per));
			addErrorXHTML('',"Total of Quarterly breakup in LTCG Non Proviso is less by " + (ltcg10Per-longTermUnder10Per));
		}
		
		if(ltcg10Per < longTermUnder10Per)	{
			j.setFieldError('scheduleCGPost45.accruOrRecOfCG.longTermUnder10Per.upto15Of6','Total of Quarterly breakup in LTCG 10% is more by ' + Math.abs(ltcg10Per-longTermUnder10Per));
			addErrorXHTML('',"Total of Quarterly breakup in LTCG Non Proviso is more by " + Math.abs(ltcg10Per-longTermUnder10Per));
		}
		
		if(ltcg20Per > longTermUnder20Per)	{
			j.setFieldError('scheduleCGPost45.accruOrRecOfCG.longTermUnder20Per.upto15Of6','Total of Quarterly breakup in LTCG 20% is less by ' + (ltcg20Per-longTermUnder20Per));
			addErrorXHTML('',"Total of Quarterly breakup in LTCG Non Proviso is less by " + (ltcg20Per-longTermUnder20Per));
		}
		
		if(ltcg20Per < longTermUnder20Per)	{
			j.setFieldError('scheduleCGPost45.accruOrRecOfCG.longTermUnder20Per.upto15Of6','Total of Quarterly breakup in LTCG 20% is more by ' + Math.abs(ltcg20Per-longTermUnder20Per));
			addErrorXHTML('',"Total of Quarterly breakup in LTCG Non Proviso is more by " + Math.abs(ltcg20Per-longTermUnder20Per));
		}
		
		var fullConsideration = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.saleofLandBuild.fullConsideration')[0];
		var propertyValuation = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.saleofLandBuild.propertyValuation')[0];
		var fullConsideration50C = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.saleofLandBuild.fullConsideration50C')[0];
		
		if(fullConsideration50C.value!=fullConsideration.value && fullConsideration50C.value!=propertyValuation.value){
			j.setFieldError('scheduleCGPost45.shortTermCapGainPost45.saleofLandBuild.fullConsideration50C',"Please enter value from 'ai' or 'aii' only");
			addErrorXHTML(fullConsideration50C ,"Please enter value from 'ai' or 'aii' only");
		}
		
		fullConsideration = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofLandBuild.fullConsideration')[0];
		propertyValuation = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofLandBuild.propertyValuation')[0];
		fullConsideration50C = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofLandBuild.fullConsideration50C')[0];
		
		if(fullConsideration50C.value!=fullConsideration.value && fullConsideration50C.value!=propertyValuation.value){
			j.setFieldError('scheduleCGPost45.longTermCapGainPost45.saleofLandBuild.fullConsideration50C',"Please enter value from 'ai' or 'aii' only");
			addErrorXHTML(fullConsideration50C ,"Please enter value from 'ai' or 'aii' only");
		}	

		
		var tab = document.getElementById('stcg10pctTab');
		var selects = tab.getElementsByTagName("SELECT");
		var count = {"21ciii": 0,"5AC1c": 0,"5ADiii": 0,"5ACA1b": 0};
		for(var i=0;i<selects.length;i++){
			count[selects[i].value] = count[selects[i].value]+1;
			if(count[selects[i].value] > 1){
				j.setFieldError(selects[i].name,' A particular drop down cannot be selected twice');
				addErrorXHTML(selects[i] ," A particular drop down cannot be selected twice");
				break;
			}
		}
		}catch(e){
			alert('error in calcSchCGLtcgStcg=' + e.stack);
		}
	}
	
// Function to delete row for Schedule PL.
function deleteRowTablebadDebtPL(tx,ty,tz){
	deleteRowTable(tx,ty,tz);
	calculatePL();
}
 
function deleteRowTableOprtRev(tx,ty,tz){
	deleteRowTable(tx,ty,tz);
	calculatePL();
}

function deleteRowTableOthExp(tx,ty,tz){
	deleteRowTable(tx,ty,tz);
	calculatePL();
}

function deleteRowTableOthInc(tx,ty,tz){
	deleteRowTable(tx,ty,tz);
	calculatePL();
}

// Validate on Submit.
function validateOnSubmit() {
		checkDropdownSelectedin1d();
	   	calcSchCGLtcgStcg();
	   	validateCGSecwiseDed();
	   	validateCGDedDate();
	   	validateScheduleHP();
	  	mandateA6();
		mandateB8();
	   	checkSchFAMandatory();
	   	checkQDRawMatMandatory('scheduleQDRaw','scheduleQDFin');
	   	validateUD();
	   	validateSection89();	 
		balSheetWarnig();
		checkAMTC();
		profLossWarning();
		validateHPRent();
		calculateTCS();
		calculateTDS();
		priBankMandtry();
		panStatusCheckValdt();
		checkUniqueTableCol('scheduleFSI', 'countryCode$','Same Country cannot be selected more than once.');
		CheckHPShareProperty();
		checkUniqueOSSec();
		CheckBFLAUDMismatch();
		checkSchedule5A();
		validateAMTC();
		validateFSI();
		checkEmptyAmtSpouse();
		calSchS('scheduleSalaryMain');
		CheckPLExpenses();
		scheduleHPCalcFor4();
		checkEmptySchUDAmt();
		isDSCMandatory();
		setValuesCG54B(); 
	    validateSTCGSectionWiseDTAA();
	    validateLTCGSectionWiseDTAA();
		checkSIAmount();
		calculateTotalTaxIT('scheduleIt');
		checkUnUtilizedCG();
		checkUnUtilizedLTCG();
		//validatePassport();
		//checkNoOfRowsFilled();
		panValidation80G('ded100PerWithoutQual');
		panValidation80G('ded50WithoutQual');
		panValidation80G('ded100Qual');
		panValidation80G('ded50WithQual');
		check54GBPan();
		checkSchEIxmlblock();
		section80DChk();
	    //Always keep alertItr4User() at the last
		alertItr4User();
		populateZero();
		mandtryAL();

}

function check54GBPan() {
	
	var table = document.getElementById('schduleCGDed');
	var rowCount = table.rows.length - 3;
	
	var deductPAN = document.getElementsByName('scheduleCGPost45.deducClaimInfo.deductPAN')[0].value;
	
	for(var i=0; i<rowCount; i++){
			var section = document.getElementsByName('scheduleCGPost45.deducClaimInfo.deducClaimDtls['+i+'].deductedSecCode')[0].value;
			if(section == '54GB' && (deductPAN == null || deductPAN == '')) {
				j.setFieldError('scheduleCGPost45.deducClaimInfo.deductPAN','Please furnish PAN of the company');
				break;
			}
	}
}

//To check whether UnUtilized CG schedule is filled
function checkUnUtilizedCG() {

	var UnUtilizedFlag = document
			.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unutilizedCapgainFlag')[0].value;

	if (UnUtilizedFlag == 'Y') {
		var tab1 = document.getElementById('scheduleStcgunUtilizedCapGain54');
		var isRowBlank = checkRowBlank('scheduleStcgunUtilizedCapGain54', 3, 2);
		var yearConst54B = document
				.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54B.yearConst')[0].value;
		var amtUtilizd54B = document
				.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54B.amountUtilized')[0].value;
		var amtNotUtilzd54B = document
				.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54B.amountUnUtilized')[0].value;
		var isSecondRowBlank = false;

		if (yearConst54B == '' && amtUtilizd54B == '' && amtNotUtilzd54B == '') {
			isSecondRowBlank = true;
		}

		if (isRowBlank && isSecondRowBlank) {
			j
					.setFieldError(
							'scheduleCGPost45.shortTermCapGainPost45.unutilizedCapgainFlag',
							'Please enter values either in 7a1 or 7a2 in Schedule CG');
		}
	}
}

// To check whether UnUtilized LTCG schedule is filled
function checkUnUtilizedLTCG() {

	var UnUtilizedFlag = document
			.getElementsByName('scheduleCGPost45.LongTermCapGainPost45.unutilizedCapgainFlag')[0].value;

	if (UnUtilizedFlag == 'Y') {
		var tab1 = document.getElementById('scheduleLtcgunUtilizedCapGain54');
		var isRowBlank = checkRowBlank('scheduleLtcgunUtilizedCapGain54', 3, 2);
		var yearConst54B = document
				.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54B.yearConst')[0].value;
		var amtUtilizd54B = document
				.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54B.amountUtilized')[0].value;
		var amtNotUtilzd54B = document
				.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54B.amountUnUtilized')[0].value;
		var isSecondRowBlank = false;

		if (yearConst54B == '' && amtUtilizd54B == '' && amtNotUtilzd54B == '') {
			isSecondRowBlank = true;
		}

		if (isRowBlank && isSecondRowBlank) {
			j
					.setFieldError(
							'scheduleCGPost45.LongTermCapGainPost45.unutilizedCapgainFlag',
							'Please enter values either in 9a1 or 9a2 in Schedule CG');
		}
	}
}

// Calculate Income for Schedule OS.
function calculateOS(cgosIncome){
	
	var simap = initMapForSI(cgosIncome);
	
	coalesceSetRet('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls[0].sourceAmount');
	
	var othersGross = document.getElementsByName('scheduleOS.othersGross')[0];
	othersGross.value = calculateOSGross(simap);
	validateSchOSDTAA1a1b();
	
	var totalOSGross = document.getElementsByName('scheduleOS.totalOSGross')[0];
	totalOSGross.value = eval(
			parseInt(coalesceSetRet('scheduleOS.incOthThanOwnRaceHorse.dividendGross'),10)
			+ parseInt(coalesceSetRet('scheduleOS.incOthThanOwnRaceHorse.interestGross'),10)
			+ parseInt(coalesceSetRet('scheduleOS.incOthThanOwnRaceHorse.rentFromMachPlantBldgs'),10)
			+ parseInt(coalesceSetRet('scheduleOS.othersGross'),10)
		);
	
	var totAmtUnderDtaa = document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa.totAmtUnderDtaa')[0];
	totAmtUnderDtaa.value = addCGDeductions('scheduleOsNriIncTaxDtaa');
	
	var totalOSGrossChargblSplRate = document.getElementsByName('scheduleOS.incChargblSplRateOS.totalOSGrossChargblSplRate')[0];
	totalOSGrossChargblSplRate.value = eval(
			parseInt(coalesceSetRet('scheduleOS.incChargblSplRateOS.winningFrmLotteries'),10)
			+ parseInt(coalesceSetRet('scheduleOS.incChargblSplRateOS.secXIIOth'),10)
			+ parseInt(coalesceSetRet('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa.totAmtUnderDtaa'),10)
			+ parseInt(coalesceSetRet('scheduleOS.incChargblSplRateOS.115BBDA'),10)
			+ parseInt(coalesceSetRet('scheduleOS.incChargblSplRateOS.115BBE'),10)
			+ parseInt(coalesceSetRet('scheduleOS.incChargblSplRateOS.115BBF'),10)
		);
	
	var grossAmtChargblNormalRate = document.getElementsByName('scheduleOS.grossAmtChargblNormalRate')[0];
	grossAmtChargblNormalRate.value = eval(
			parseInt(totalOSGross.value,10)
			- parseInt(totalOSGrossChargblSplRate.value,10)
		);
	
	var totDeductions = document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.deductions.totDeductions')[0];
	totDeductions.value = eval(
			parseInt(coalesceSetRet('scheduleOS.incOthThanOwnRaceHorse.deductions.expenses'),10)
			+ parseInt(coalesceSetRet('scheduleOS.incOthThanOwnRaceHorse.deductions.depreciation'),10)
		);	
	
	var balanceNoRaceHorse = document.getElementsByName('scheduleOS.balanceNoRaceHorse')[0];
    
	balanceNoRaceHorse.value = eval(
			parseInt(grossAmtChargblNormalRate.value,10)
			- parseInt(totDeductions.value,10)
		);
                    
	var totOthSrcNoRaceHorse = document.getElementsByName('scheduleOS.totOthSrcNoRaceHorse')[0];
	var IncmOthrSrc = document.getElementsByName('scheduleOS.balanceNoRaceHorse')[0];
     
	totOthSrcNoRaceHorse.value = eval(
			parseInt(totalOSGrossChargblSplRate.value,10)
			+ parseInt(zeroOrMore(parseInt(IncmOthrSrc.value,10)))
		);
	
	var balanceOwnRaceHorse = document.getElementsByName('scheduleOS.incFromOwnHorse.balanceOwnRaceHorse')[0];
	balanceOwnRaceHorse.value = eval(
			parseInt(coalesceSetRet('scheduleOS.incFromOwnHorse.receipts'),10)
			- parseInt(coalesceSetRet('scheduleOS.incFromOwnHorse.deductSec57'),10)
		);
	
	var incChargeable = document.getElementsByName('scheduleOS.incChargeable')[0];
	incChargeable.value = eval(
			parseInt(totOthSrcNoRaceHorse.value,10)
			+ parseInt(zeroOrMore(parseInt(balanceOwnRaceHorse.value ,10)))
		);
	return simap;
}

function validateSchOSDTAA1a1b() {
	var dividendGross = parseInt(coalesce(document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.dividendGross')[0].value),10);
	var interestGross = parseInt(coalesce(document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.interestGross')[0].value),10);
	
	var table = document.getElementById('scheduleOsNriIncTaxDtaa');
	var rowCount = table.rows.length - 2;
	
	var dividendGrossTot = parseInt('0',10);
	var interestGrossTot = parseInt('0',10);
	
	for(var k=0; k<rowCount; k++) {
		if(document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+k+'].itemIncluded')[0].value == '56i') {
			dividendGrossTot = eval(dividendGrossTot + parseInt(coalesce(document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+k+'].amount')[0].value),10));
			if(eval(dividendGrossTot > dividendGross)) {
				if (document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+ k + '].amount')[0].value != '') {
					document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+ k + '].amount')[0].value = 0;
					addErrorXHTML(document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+ k + '].amount')[0],'For Dividend - The sum of amount should not exceed amount entered in 1a.',true);
					j.setFieldError('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+ k + '].amount','For Dividend - The sum of amount should not exceed amount entered in 1a.');
				}
			}
		} else if (document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+k+'].itemIncluded')[0].value == '56') {
			interestGrossTot = eval(interestGrossTot + parseInt(coalesce(document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+k+'].amount')[0].value),10));
			if(eval(interestGrossTot > interestGross)) {
				if (document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+ k + '].amount')[0].value != '') {
					document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+ k + '].amount')[0].value = 0;
					addErrorXHTML(document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+ k + '].amount')[0],'For Interest - The sum of amount should not exceed amount entered in 1b.',true);
					j.setFieldError('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+ k + '].amount','For Interest - The sum of amount should not exceed amount entered in 1b.');
				}
			}
		}		
	}
	
}

// Function to calculate OS Gross Income.
function calculateOSGross(simap){
	
	var total = parseInt('0' ,10);
	
	try{	
	var tabl = document.getElementById('schduleOsf');
	var allInputTags = tabl.getElementsByTagName('input');
	
	
	var temp=eval(parseInt(coalesce(document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls[7].sourceAmount')[0].value),10));
	
	for(var i = 0; i < allInputTags.length; i++) {
			if (allInputTags[i].name.match("sourceAmount$")) {
			
					total = eval(parseInt(total ,10) + parseInt(isNVL(allInputTags[i].value) ,10));
					
			}		
			
			
		}
	total=eval(parseInt(total ,10)- parseInt(temp ,10));
	var allSelects = tabl.getElementsByTagName('SELECT'); 
	
	var table = document.getElementById('scheduleOsNriIncTaxDtaa');
	var rowCount = table.rows.length - 2;
	var arr = {'5A1ai':0,'5A1aii':0,'5A1aiia':0,'5A1aiiaa':0,'5A1aiiab':0,'5A1aiiac':0,'5A1aiii':0,'5A1bA':0,'5A1bB':0,'5AC1ab':0,'5BBA':0,'5Ea':0};
	var sum = 0;
	
	for(var i = 0; i < allSelects.length; i++) {	
			var name = allSelects[i].name;
			var index = name.substring(name.indexOf('[')+1, name.indexOf(']'));
			if(allSelects[i].value=='Others'){
				document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ index +'].otherDesc')[0].style.display='';
			}
			else{
				simap[allSelects[i].value] = coalesce(document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ i +'].sourceAmount')[0].value);			
				document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ index +'].otherDesc')[0].style.display='none';
				document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ index +'].otherDesc')[0].value='';
				
				
				if(allSelects[i].value=='5BB'){
					
					var winningFrmLotteries = document.getElementsByName('scheduleOS.incChargblSplRateOS.winningFrmLotteries')[0];
					winningFrmLotteries.value = document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ index +'].sourceAmount')[0].value;
					
				}
				if(allSelects[i].value=='5BBE'){
					
					var v115BBEsec = document.getElementsByName('scheduleOS.incChargblSplRateOS.115BBE')[0];
					v115BBEsec.value = document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ index +'].sourceAmount')[0].value;
					
				}
								
				if(allSelects[i].value=='5BBF'){
					
					var v115BBFsec = document.getElementsByName('scheduleOS.incChargblSplRateOS.115BBF')[0];
					v115BBFsec.value = document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ index +'].sourceAmount')[0].value;
					
				}
				
				if(allSelects[i].value =='5BBDA'){
					
					var v115BBDAsec = document.getElementsByName('scheduleOS.incChargblSplRateOS.115BBDA')[0];
					v115BBDAsec.value = document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ index +'].sourceAmount')[0].value;
					
				}					
				 if(allSelects[i].value != 'DTAA'){
					
					var temp=eval(parseInt(coalesce(document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls[7].sourceAmount')[0].value),10));
					sum = parseInt(sum) + parseInt(coalesce(document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ index +'].sourceAmount')[0].value));
					
					/*if(allSelects[i].value ='5BBDA'){
						
					
						document.getElementsByName('scheduleOS.incChargblSplRateOS.115BBDA')[0].value=0;
						
					}*/
					
					
					for(var k=0; k<rowCount; k++) {
						if(document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+k+'].itemIncluded')[0].value == allSelects[i].value) {
							arr[allSelects[i].value] = eval(parseInt(coalesce(arr[allSelects[i].value])) + parseInt(coalesce(document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+k+'].amount')[0].value)));
							if(arr[allSelects[i].value] > parseInt(coalesce(document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ index +'].sourceAmount')[0].value))) {
								
								if(document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+k+'].amount')[0].value != '') {
									document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+k+'].amount')[0].value = 0;
									addErrorXHTML(document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+k+'].amount')[0]  ,'The sum of amount should not exceed amount entered in 1d.',true);
									j.setFieldError('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+k+'].amount','The sum of amount should not exceed amount entered in 1d.');
								}
							} else {
								sum -=  document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+k+'].amount')[0].value;
							}
					} 
				}
					simap[allSelects[i].value] -= parseInt(coalesce(arr[allSelects[i].value]),10);
			}
		}
	}
	
	var temp115BB = document.getElementsByName('scheduleOS.incChargblSplRateOS.winningFrmLotteries')[0].value;
	
	var temp115BBDA = document.getElementsByName('scheduleOS.incChargblSplRateOS.115BBDA')[0].value;

	var temp115BBF = document.getElementsByName('scheduleOS.incChargblSplRateOS.115BBF')[0].value;

	var temp115BBE = document.getElementsByName('scheduleOS.incChargblSplRateOS.115BBE')[0].value;

	
	var secXIIOth = document.getElementsByName('scheduleOS.incChargblSplRateOS.secXIIOth')[0];
	secXIIOth.value = eval(sum - temp - temp115BBDA - temp115BBF - temp115BBE - temp115BB);
	} catch(e) {
		alert('Exception in calculateOSGross : '+e);
	}
	return total;
}

// Calculate Total Income for Schedule IF
function calcTotSchIF(){
	var amtTotal = parseInt('0' ,10);
	var capTotal = parseInt('0' ,10);
	var tabl = document.getElementById('scheduleIF');
	var allInputTags = tabl.getElementsByTagName('input');

	for(var i = 0; i < allInputTags.length; i++) {
		if (allInputTags[i].name.match("amount$")) {
			amtTotal = eval(parseInt(amtTotal ,10) + parseInt(isNVL(allInputTags[i].value) ,10));
		}else if(allInputTags[i].name.match("capitalBalance$")){
			capTotal = eval(parseInt(capTotal ,10) + parseInt(isNVL(allInputTags[i].value) ,10));
		}
	}
	
	document.getElementsByName('scheduleIF.totalProfitShareAmt')[0].value = amtTotal;
	document.getElementsByName('scheduleIF.totalFirmCapBalOn31Mar')[0].value = capTotal;
}

// Calculate Total Income for Schedule EI.
function calTotalEI(){
		document.getElementsByName('scheduleEI.totalExemptInc')[0].value=
		coalesceSetRet('scheduleEI.interestInc')+
		coalesceSetRet('scheduleEI.dividendInc')+
		coalesceSetRet('scheduleEI.ltcgWhereSTTPaid')+
		coalesceSetRet('scheduleEI.netAgriIncOrOthrIncRule7')+	
		coalesceSetRet('scheduleEI.others');
}

// Calculate Total Amount for Schedule TR.
function totAmtOfSchedTRFor6(tableId){
	
    var table=document.getElementById('scheduleTR');
    var noOfRows=table.rows.length;
    var totTaxPaidOutsideInd = parseInt('0' ,10);
	var totReliefAvailable = parseInt('0' ,10);
	var totReliefAvailable9090A = parseInt('0' ,10);
	var totReliefAvailable91 = parseInt('0' ,10);
      
    for(var i=0;i<eval(parseInt(noOfRows,10)-4);i++){
        if(document.getElementsByName('scheduleTR1.scheduleTR['+i+'].relavantArticleDTAA')[0].value=='91'){
        	totReliefAvailable91=eval(totReliefAvailable91+ parseInt(coalesce(document.getElementsByName('scheduleTR1.scheduleTR['+i+'].taxReliefOutsideIndia')[0].value),10));
        
        } else if(document.getElementsByName('scheduleTR1.scheduleTR['+i+'].relavantArticleDTAA')[0].value=='90' ||
	        document.getElementsByName('scheduleTR1.scheduleTR['+i+'].relavantArticleDTAA')[0].value=='90A'){
        	totReliefAvailable9090A=eval(totReliefAvailable9090A+parseInt(coalesce(document.getElementsByName('scheduleTR1.scheduleTR['+i+'].taxReliefOutsideIndia')[0].value),10));
        }
        
        totTaxPaidOutsideInd = eval(parseInt(totTaxPaidOutsideInd,10) + parseInt(coalesce(document.getElementsByName('scheduleTR1.scheduleTR['+i+'].taxPaidOutsideIndia')[0].value,10)));
        totReliefAvailable = eval(parseInt(totReliefAvailable,10) + parseInt(coalesce(document.getElementsByName('scheduleTR1.scheduleTR['+i+'].taxReliefOutsideIndia')[0].value,10)));
    
    }
    
    document.getElementsByName('scheduleTR1.totalIncomeOutIndia')[0].value = totReliefAvailable9090A;
    document.getElementsByName('scheduleTR1.totalIncomeOutIndiaDTAA')[0].value = totReliefAvailable91;
    document.getElementsByName('scheduleTR1.totTaxPaidDeclaredInFSI')[0].value = totTaxPaidOutsideInd;
    document.getElementsByName('scheduleTR1.totReliefClaimUs9090A')[0].value = totReliefAvailable;

}
		
// validate Schedule TR.
function validateScheduleTR(tableId) {
	var tab = document.getElementById(tableId);
	var allInputTags = tab.getElementsByTagName('input');
	
	for(var i = 0; i < allInputTags.length; i++) {
		if (allInputTags[i].name.match("totTaxIncScheduleFSI$")) {
			if(parseInt( coalesce(allInputTags[i].value) ,10) < eval ( parseInt( coalesce(allInputTags[i+1].value)  ,10) + parseInt( coalesce(allInputTags[i+2].value) ,10) )) {
				j.setFieldError(allInputTags[i].name,'Relief claimed u/s 90/91 (B1 +B2) cannot exceed the total taxes paid');
			}
		}
	}
}

// Calculate Income for Balance Sheet.
function calcBalSheet(){
	//1
	var totResrNSurp = document.getElementsByName('partabs.fundSrc.propFund.resrNSurp.totResrNSurp')[0];
	totResrNSurp.value = coalesceSetRet('partabs.fundSrc.propFund.resrNSurp.revResr') + 
						 coalesceSetRet('partabs.fundSrc.propFund.resrNSurp.capResr') + 
						 coalesceSetRet('partabs.fundSrc.propFund.resrNSurp.statResr') + 
						 coalesceSetRet('partabs.fundSrc.propFund.resrNSurp.othResr');
    var totPropFund = document.getElementsByName('partabs.fundSrc.propFund.totPropFund')[0];		
	totPropFund.value = parseInt(totResrNSurp.value, 10) +
						coalesceSetRet('partabs.fundSrc.propFund.propCap');
	//2
	var totRupeeLoan = document.getElementsByName('partabs.fundSrc.loanFunds.secrLoan.rupeeLoan.totRupeeLoan')[0];							
	totRupeeLoan.value =  coalesceSetRet('partabs.fundSrc.loanFunds.secrLoan.rupeeLoan.frmOthrs') + 
						 coalesceSetRet('partabs.fundSrc.loanFunds.secrLoan.rupeeLoan.frmBank');		
	var totSecrLoan = document.getElementsByName('partabs.fundSrc.loanFunds.secrLoan.totSecrLoan')[0];							
	totSecrLoan.value =  parseInt(totRupeeLoan.value, 10) + 
						 coalesceSetRet('partabs.fundSrc.loanFunds.secrLoan.foreignCurrLoan');
	var totUnSecrLoan = document.getElementsByName('partabs.fundSrc.loanFunds.unsecrLoan.totUnSecrLoan')[0];							
	totUnSecrLoan.value =  coalesceSetRet('partabs.fundSrc.loanFunds.unsecrLoan.frmBank') + 
						 coalesceSetRet('partabs.fundSrc.loanFunds.unsecrLoan.frmOthrs');						 
	var totLoanFund = document.getElementsByName('partabs.fundSrc.loanFunds.totLoanFund')[0];							
	totLoanFund.value =  parseInt(totSecrLoan.value, 10) + 
						 parseInt(totUnSecrLoan.value, 10);		
	//4
	var totFundSrc = document.getElementsByName('partabs.fundSrc.totFundSrc')[0];
	totFundSrc.value = parseInt(totPropFund.value, 10) + 
						 parseInt(totLoanFund.value, 10) +  
						 coalesceSetRet('partabs.fundSrc.deferredTax');	

	//1
	var netBlock = document.getElementsByName('partabs.fundApply.fixedAsset.netBlock')[0];							
	netBlock.value =  zeroOrMore(coalesceSetRet('partabs.fundApply.fixedAsset.grossBlock') -
						 coalesceSetRet('partabs.fundApply.fixedAsset.depreciation'));

	var totFixedAsset = document.getElementsByName('partabs.fundApply.fixedAsset.totFixedAsset')[0];							
	totFixedAsset.value =  parseInt(netBlock.value, 10) + 
						 coalesceSetRet('partabs.fundApply.fixedAsset.capWrkProg');	
						 
	//2	
	var totLongTermInv = document.getElementsByName('partabs.fundApply.investments.longTermInv.totLongTermInv')[0];							
	totLongTermInv.value =  coalesceSetRet('partabs.fundApply.investments.longTermInv.govtOthSecQuoted') + 
						 coalesceSetRet('partabs.fundApply.investments.longTermInv.govOthSecUnQoted');	
	var totTradeInv = document.getElementsByName('partabs.fundApply.investments.tradeInv.totTradeInv')[0];							
	totTradeInv.value =  coalesceSetRet('partabs.fundApply.investments.tradeInv.equityShares') + 						
						 coalesceSetRet('partabs.fundApply.investments.tradeInv.preferShares') + 
						 coalesceSetRet('partabs.fundApply.investments.tradeInv.debenture');	
	var totInvestments = document.getElementsByName('partabs.fundApply.investments.totInvestments')[0];							
	totInvestments.value =  parseInt(totLongTermInv.value, 10) + 
						 parseInt(totTradeInv.value, 10);
	//3
	var totInventries = document.getElementsByName('partabs.fundApply.currAssetLoanAdv.currAsset.inventories.totInventries')[0];							
	totInventries.value =  coalesceSetRet('partabs.fundApply.currAssetLoanAdv.currAsset.inventories.storesConsumables') + 
						 coalesceSetRet('partabs.fundApply.currAssetLoanAdv.currAsset.inventories.rawMatl') + 
						 coalesceSetRet('partabs.fundApply.currAssetLoanAdv.currAsset.inventories.stkInProcess') + 
						 coalesceSetRet('partabs.fundApply.currAssetLoanAdv.currAsset.inventories.finOrTradGood');	
	var totCashOrBankBal = document.getElementsByName('partabs.fundApply.currAssetLoanAdv.currAsset.cashOrBankBal.totCashOrBankBal')[0];							
	totCashOrBankBal.value =  coalesceSetRet('partabs.fundApply.currAssetLoanAdv.currAsset.cashOrBankBal.cashinHand') + 	
						 coalesceSetRet('partabs.fundApply.currAssetLoanAdv.currAsset.cashOrBankBal.bankBal');	
	var totCurrAsset = document.getElementsByName('partabs.fundApply.currAssetLoanAdv.currAsset.totCurrAsset')[0];							
	totCurrAsset.value =  parseInt(totInventries.value, 10) + 
						 coalesceSetRet('partabs.fundApply.currAssetLoanAdv.currAsset.sndryDebtors') + 
						 parseInt(totCashOrBankBal.value, 10) +
						 coalesceSetRet('partabs.fundApply.currAssetLoanAdv.currAsset.othCurrAsset');		
	var totLoanAdv = document.getElementsByName('partabs.fundApply.currAssetLoanAdv.loanAdv.totLoanAdv')[0];							
	totLoanAdv.value =  coalesceSetRet('partabs.fundApply.currAssetLoanAdv.loanAdv.advRecoverable') + 
						 coalesceSetRet('partabs.fundApply.currAssetLoanAdv.loanAdv.deposits') + 
						 coalesceSetRet('partabs.fundApply.currAssetLoanAdv.loanAdv.balWithRevAuth') ;	
	var totCurrAssetLoanAdv = document.getElementsByName('partabs.fundApply.currAssetLoanAdv.totCurrAssetLoanAdv')[0];							
	totCurrAssetLoanAdv.value =  parseInt(totCurrAsset.value, 10) +
								parseInt(totLoanAdv.value, 10) ;
	var totCurrLiabilities = document.getElementsByName('partabs.fundApply.currAssetLoanAdv.currLiabilitiesProv.currLiabilities.totCurrLiabilities')[0];							
	totCurrLiabilities.value =  coalesceSetRet('partabs.fundApply.currAssetLoanAdv.currLiabilitiesProv.currLiabilities.sundryCred') + 
						 coalesceSetRet('partabs.fundApply.currAssetLoanAdv.currLiabilitiesProv.currLiabilities.liabForLeasedAsset') + 
						 coalesceSetRet('partabs.fundApply.currAssetLoanAdv.currLiabilitiesProv.currLiabilities.accrIntonLeasedAsset') + 
						 coalesceSetRet('partabs.fundApply.currAssetLoanAdv.currLiabilitiesProv.currLiabilities.accrIntNotDue');		
	var totProvisions = document.getElementsByName('partabs.fundApply.currAssetLoanAdv.currLiabilitiesProv.provisions.totProvisions')[0];							
	totProvisions.value =  coalesceSetRet('partabs.fundApply.currAssetLoanAdv.currLiabilitiesProv.provisions.itProvision') + 
						 coalesceSetRet('partabs.fundApply.currAssetLoanAdv.currLiabilitiesProv.provisions.elSuperAnnGratProvision') + 
						 coalesceSetRet('partabs.fundApply.currAssetLoanAdv.currLiabilitiesProv.provisions.othProvision');			
	var totCurrLiabilitiesProvision = document.getElementsByName('partabs.fundApply.currAssetLoanAdv.currLiabilitiesProv.totCurrLiabilitiesProvision')[0];							
	totCurrLiabilitiesProvision.value =  parseInt(totCurrLiabilities.value, 10) +
								parseInt(totProvisions.value, 10) ;		
	var netCurrAsset = document.getElementsByName('partabs.fundApply.currAssetLoanAdv.netCurrAsset')[0];							
	netCurrAsset.value =  parseInt(totCurrAssetLoanAdv.value, 10) -
								parseInt(totCurrLiabilitiesProvision.value, 10) ;
	//4								
	var totMiscAdjust = document.getElementsByName('partabs.fundApply.miscAdjust.totMiscAdjust')[0];							
	totMiscAdjust.value =  coalesceSetRet('partabs.fundApply.miscAdjust.miscExpndr') + 
						 coalesceSetRet('partabs.fundApply.miscAdjust.defTaxAsset') + 
						 coalesceSetRet('partabs.fundApply.miscAdjust.accumaltedLosses') ;
	//5					 
	var totFundApply = document.getElementsByName('partabs.fundApply.totFundApply')[0];							
	totFundApply.value =  	parseInt(totFixedAsset.value, 10)  + 
							parseInt(totInvestments.value, 10)  + 
							parseInt(netCurrAsset.value, 10) +
							parseInt(totMiscAdjust.value, 10);						 
}

// Populate Assesse Verification Name.
function populateVerName(){
	
	var fName=document.getElementsByName('partAGEN1.personalInfo.assesseeName.firstName')[0].value;
	var mName=document.getElementsByName('partAGEN1.personalInfo.assesseeName.middleName')[0].value;
	var lName=document.getElementsByName('partAGEN1.personalInfo.assesseeName.surNameOrOrgName')[0].value;
	
	var verName;
	
	if(fName !='' && mName!='' ){
	verName=fName+ ' '+ mName +' '+lName ;
	}
	
	else if(fName =='' && mName!='' ){
		verName= mName +' '+lName ;
		}
	
	else if(fName !='' && mName =='' ){
		verName=fName+ ' '+lName ;
		}
	else{
		verName=lName;
	}
	document.getElementsByName('verification.declaration.assesseeVerName')[0].value=verName;
	
}

// Populate Pin-Code.
function populatePincode(state,pin){
	var stateId = document.getElementsByName(state)[0];
	var pinCode = document.getElementsByName(pin)[0];

	if(stateId.value != '99' && stateId.value != '-1'){
		pinCode.value='';
	}else if(stateId.value == '99'){
		pinCode.value='999999';
	}
}

// Check for  Schedule HP if Property is Co-Owned.
function isCoOwned(){
	
	var totHp=eval(parseInt(document.getElementById('scheduleHPLast').cells[0].textContent)-1);
	
	for(var i=0;i<totHp;i++){
		var tempName='scheduleHP.propertyDetails['+i+'].propCoOwnedFlg';
		var val=document.getElementsByName(tempName)[0].value;
		var assessePercentShareProp = document.getElementsByName('scheduleHP.propertyDetails['+i+'].asseseeShareProperty')[0];
		if(val=='YES'){
			$('#scheduleHP'+eval(parseInt(i)+1)).find(':input').prop('disabled', false);
			document.getElementsByName('scheduleHP.propertyDetails['+i+'].coOwners[0].coOwnersSNo')[0].value = 1;
			document.getElementsByName('scheduleHP.propertyDetails['+i+'].asseseeShareProperty')[0].disabled=false;
			if(assessePercentShareProp.value==100 || assessePercentShareProp.value==0.0){
				assessePercentShareProp.value = '0';
			}
		}else{
			$('#scheduleHP'+eval(parseInt(i)+1)).find('[type=\"checkbox\"]').attr('checked','checked');
			deleteRowTable('scheduleHP'+eval(parseInt(i)+1),1,1);
			$('#scheduleHP'+eval(parseInt(i)+1)).find(':input').prop('disabled', true);
			assessePercentShareProp.disabled=true;
			if(val=='NO'){
				assessePercentShareProp.value='100';
			}else{
				assessePercentShareProp.value='0.0';
			}
		}
	}
}

//Check for  Schedule HP if Property is Let-Out.
function isLetOut(){
	
	var totHp=eval(parseInt(document.getElementById('scheduleHPLast').cells[0].textContent)-1);
	
	for(var i=0;i<totHp;i++){	
		var tempName='scheduleHP.propertyDetails['+i+'].ifLetOut';
		var val=document.getElementsByName(tempName)[0].value;
		
		if(val=='Y'){
			
			$('#scheduleHPTenant'+eval(parseInt(i)+1)).find(':input').prop('disabled', false);
			document.getElementsByName('scheduleHP.propertyDetails['+i+'].coTenants[0].coTenantsSNo')[0].value = 1;
			document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.annualLetableValue')[0].disabled=false;
			document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.rentNotRealized')[0].disabled=false;
			document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.localTaxes')[0].disabled=false;
			document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.incomeChargbleOwnHands')[0].disabled=true;
		
		}else if(val=='D'){
			$('#scheduleHPTenant'+eval(parseInt(i)+1)).find('[type=\"checkbox\"]').attr('checked','checked');
			deleteRowTable('scheduleHPTenant'+eval(parseInt(i)+1),1,1);
			$('#scheduleHPTenant'+eval(parseInt(i)+1)).find(':input').prop('disabled', true);
			document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.annualLetableValue')[0].disabled=false;
			document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.rentNotRealized')[0].disabled=false;
            document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.localTaxes')[0].disabled=false;
            document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.incomeChargbleOwnHands')[0].disabled=true;
		
		}else{
			
			$('#scheduleHPTenant'+eval(parseInt(i)+1)).find('[type=\"checkbox\"]').attr('checked','checked');
			deleteRowTable('scheduleHPTenant'+eval(parseInt(i)+1),1,1);
			$('#scheduleHPTenant'+eval(parseInt(i)+1)).find(':input').prop('disabled', true);
			
            document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.annualLetableValue')[0].disabled=true;
            document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.annualLetableValue')[0].value='';
			document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.rentNotRealized')[0].disabled=true;
            document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.rentNotRealized')[0].value='';
            document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.localTaxes')[0].disabled=true;
            document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.localTaxes')[0].value='';
            document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.incomeChargbleOwnHands')[0].disabled=true;
            document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.incomeChargbleOwnHands')[0].value='';
		}
	}
}

// Add Schedule HP.
function addScheduleHP(){
	
	var mainTable = document.getElementById('scheduleHPMain').rows;
	var tobeInsertBefore = document.getElementById('scheduleHPAddRow');
	var flag = false;
	var totRow = document.getElementById('scheduleHPLast').cells[0].textContent;

	var iterate = eval(parseInt(totRow) - 1);
	for ( var i = 0; i < mainTable.length; i++) {
		var cloneNode = mainTable[i].cloneNode(true);
		if (mainTable[i].id == 'scheduleHP1st') {
			flag = true;
			cloneNode.cells[0].innerHTML = totRow;
		}
		if (mainTable[i].id == 'coOwnerTr') {
			cloneNode.getElementsByTagName('table')[0].setAttribute('id','scheduleHP' + totRow);
			cloneNode.getElementsByTagName('img')[0].setAttribute('onclick','addRowToTableSchHp(' + '\'scheduleHP' + totRow + '\',2,1,this);');
			cloneNode.getElementsByTagName('img')[1].setAttribute('onclick','deleteRowTable(' + '\'scheduleHP' + totRow + '\',1,1)');

		}

		if (mainTable[i].id == 'coTenantTr') {
			cloneNode.getElementsByTagName('table')[0].setAttribute('id','scheduleHPTenant' + totRow);
			cloneNode.getElementsByTagName('img')[0].setAttribute('onclick','addRowToTableSchHpTenants(' + '\'scheduleHPTenant' + totRow + '\',2,1,this);');
			cloneNode.getElementsByTagName('img')[1].setAttribute('onclick', 'deleteRowTable(' + '\'scheduleHPTenant' + totRow + '\',1,1)');
		}

		if (flag) {

			var cellsTot = cloneNode.cells;
			for ( var j = 0; j < cellsTot.length; j++) {
				cloneNode.cells[j].innerHTML = cloneNode.cells[j].innerHTML
						.replace('1a', totRow + 'a')
						.replace('1b', totRow + 'b')
						.replace('1c', totRow + 'c')
						.replace('1d', totRow + 'd')
						.replace('1e', totRow + 'e')
						.replace('1f', totRow + 'f')
						.replace('1g', totRow + 'g')
						.replace('1h', totRow + 'h')
						.replace('1i', totRow + 'i')
						.replace('1j', totRow + 'j').replace('property 1',
								'property ' + totRow).replace('property 1',
								'property ' + totRow);
			}

			var inputTags = cloneNode.getElementsByTagName('input');
			for ( var a = 0; a < inputTags.length; a++) {
				inputTags[a].name = inputTags[a].name.replace('[0]', '['+ iterate + ']');
				if (inputTags[a].name.indexOf('coOwnersSNo') == '-1') {
					inputTags[a].value = '';
				}

				if (inputTags[a].name.indexOf('coTenantsSNo') == '-1') {
					inputTags[a].value = '';
				}
				inputTags[a].id = inputTags[a].name.replace(/([\.\[\]])/g, '_').replace(/(__)/g, '_');

				var blurAttr = inputTags[a].getAttribute('onblur');
				if (blurAttr != null) {
					blurAttr = blurAttr + ";";
				} else {
					blurAttr = "";
				}
				inputTags[a].setAttribute('onblur', blurAttr + 'j.blur(this,this.name,this.value);');
			}

			var selectTags = cloneNode.getElementsByTagName('select');
			for ( var a = 0; a < selectTags.length; a++) {
				selectTags[a].name = selectTags[a].name.replace('[0]', '['
						+ iterate + ']');
				selectTags[a].value = '';
				var name = "scheduleHP.propertyDetails["+iterate+"].addressDetail.stateCode";
				var Countryname = "scheduleHP.propertyDetails["+iterate+"].addressDetail.country";
				if(selectTags[a].name== name){
						if (selectTags[a].name.indexOf('stateCode') != '') {
							selectTags[a].onchange = function() {
								setCounrtyForStateNew('scheduleHP.propertyDetails[' + iterate + '].addressDetail.stateCode','scheduleHP.propertyDetails[' + iterate + '].addressDetail.country','scheduleHP.propertyDetails[' + iterate + '].addressDetail.pinCode','scheduleHP.propertyDetails[' + iterate + '].addressDetail.zipCode');
							};
						}
				}else if(selectTags[a].name== Countryname){
				
					if (selectTags[a].name.indexOf('country') != '') {
						selectTags[a].onchange = function() {
							setStateForCountryNew('scheduleHP.propertyDetails[' + iterate + '].addressDetail.stateCode','scheduleHP.propertyDetails[' + iterate + '].addressDetail.country','scheduleHP.propertyDetails[' + iterate + '].addressDetail.pinCode','scheduleHP.propertyDetails[' + iterate + '].addressDetail.zipCode');
						};
					}
				}
				selectTags[a].id = selectTags[a].name.replace(/([\.\[\]])/g,
						'_').replace(/(__)/g, '_');

				var blurAttr = selectTags[a].getAttribute('onblur');
				if (blurAttr != null) {
					blurAttr = blurAttr + ";";
				} else {
					blurAttr = "";
				}
				selectTags[a].setAttribute('onblur', blurAttr + 'j.blur(this,this.name,this.value);');
			}

			var textareaTags = cloneNode.getElementsByTagName('textarea');
			for ( var a = 0; a < textareaTags.length; a++) {
				textareaTags[a].name = textareaTags[a].name.replace('[0]', '['+ iterate + ']');
				textareaTags[a].value = '';
				textareaTags[a].id = textareaTags[a].name.replace(/([\.\[\]])/g, '_').replace(/(__)/g, '_');

				var blurAttr = textareaTags[a].getAttribute('onblur');
				if (blurAttr != null) {
					blurAttr = blurAttr + ";";
				} else {
					blurAttr = "";
				}
				textareaTags[a].setAttribute('onblur', blurAttr + 'j.blur(this,this.name,this.value);');
			}

			document.getElementById('scheduleHPMain')
					.getElementsByTagName('tr')[0].parentNode.insertBefore(
					cloneNode, tobeInsertBefore);
		}
		if (mainTable[i].id == 'scheduleHPEnd') {
			flag = false;
			break;
		}
	}
	var newVal = eval(parseInt(totRow) + 1);
	var newText = 'Total (';
	for ( var k = 1; k < newVal; k++) {
		newText = newText + k + 'j +';
	}
	newText=newText+newVal+'a )';
	document.getElementById('scheduleHPLast').cells[0].innerHTML=newVal;
	document.getElementById('scheduleHPLast').nextElementSibling.cells[3].innerHTML=newVal+'a';
	document.getElementById('scheduleHPLast').nextElementSibling.nextElementSibling.cells[2].innerHTML=newVal+'b';
	document.getElementById('scheduleHPLast').nextElementSibling.nextElementSibling.cells[1].innerHTML=newText;
	
	if ($('#scheduleHPAddRow')[0].parentNode.children.length == 47) {
		$('#delHPButtonId').prop('disabled', true);
	} else if ($('#scheduleHPAddRow')[0].parentNode.children.length > 47) {
		$('#delHPButtonId').prop('disabled', false);
	}

	$('#scheduleHPTenant' + eval(parseInt(totRow))).find('[type=\"checkbox\"]') .attr('checked', 'checked');
	deleteRowTable('scheduleHPTenant' + eval(parseInt(totRow)), 1, 1);

	document.getElementsByName('scheduleHP.propertyDetails['
			+ (parseInt(totRow) - 1) + '].hpSno')[0].value = totRow;
	var table = document.getElementById('scheduleHPMain');
	modifyRow(table);
	var onchange1 = document.getElementsByName('scheduleHP.propertyDetails['+ (parseInt(totRow) - 1) + '].propCoOwnedFlg')[0].getAttribute('onchange');
	var onchange2 = document.getElementsByName('scheduleHP.propertyDetails['+ (parseInt(totRow) - 1) + '].ifLetOut')[0].getAttribute('onchange');
	onchange1 = onchange1.substring(0, onchange1.indexOf('('));
	onchange2 = onchange2.substring(0, onchange2.indexOf('('));
	window[onchange1]();
	window[onchange2]();
	checkMaxLengthLimit();

}
		
// Calculate Income for Schedule HP.
function scheduleHPCalcFor4(){
	
	var totHp=eval(parseInt(document.getElementById('scheduleHPLast').cells[0].textContent)-1);
	var total=0;
    var thirtyPercentOfBalanceTemp = 0;

	for(var i=0;i<totHp;i++){

		document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.totalUnrealizedAndTax')[0].value=
		eval(parseInt(document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.rentNotRealized')[0].value==""?0:
		coalesceSetRet('scheduleHP.propertyDetails['+i+'].rentdetails.rentNotRealized')
		) 
		+ parseInt(document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.localTaxes')[0].value==""?0:
		coalesceSetRet('scheduleHP.propertyDetails['+i+'].rentdetails.localTaxes')
		));

		document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.balanceALV')[0].value=
		eval(parseInt(document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.annualLetableValue')[0].value==""?0:
		coalesceSetRet('scheduleHP.propertyDetails['+i+'].rentdetails.annualLetableValue')
		) - 
		parseInt(document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.totalUnrealizedAndTax')[0].value==""?0:
		coalesceSetRet('scheduleHP.propertyDetails['+i+'].rentdetails.totalUnrealizedAndTax')
		));

		var incomeChargbleOwnHands = document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.incomeChargbleOwnHands')[0];
		setEditableFieldValue(incomeChargbleOwnHands, Math.round(eval(parseInt(document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.balanceALV')[0].value) * (parseFloat(document.getElementsByName('scheduleHP.propertyDetails['+i+'].asseseeShareProperty')[0].value)) /100 )));
		
                  thirtyPercentOfBalanceTemp = Math.round(eval(parseInt(document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.incomeChargbleOwnHands')[0].value==""?0:document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.incomeChargbleOwnHands')[0].value) * 0.3 ));
			if( parseInt(thirtyPercentOfBalanceTemp ,10) >0 ){
				document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.thirtyPercentOfBalance')[0].value = thirtyPercentOfBalanceTemp;
			}else{
				document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.thirtyPercentOfBalance')[0].value = parseInt(0,10);
			}

		document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.totalDeduct')[0].value=
		eval(parseInt(document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.thirtyPercentOfBalance')[0].value==""?0:
		coalesceSetRet('scheduleHP.propertyDetails['+i+'].rentdetails.thirtyPercentOfBalance')
		) 
		+ parseInt(document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.intOnBorwCap')[0].value==""?0:
		coalesceSetRet('scheduleHP.propertyDetails['+i+'].rentdetails.intOnBorwCap')
		));

		document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.incomeOfHP')[0].value=
		eval(parseInt(document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.balanceALV')[0].value==""?0:coalesce(document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.incomeChargbleOwnHands')[0].value)) - parseInt(document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.totalDeduct')[0].value==""?0:document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.totalDeduct')[0].value));

		total=eval(parseInt(total) + parseInt(document.getElementsByName('scheduleHP.propertyDetails['+i+'].rentdetails.incomeOfHP')[0].value));
	}
	document.getElementsByName('scheduleHP.totalIncomeChargeableUnHP')[0].value = eval(parseInt(document.getElementsByName('scheduleHP.rentOfEarlierYrSec25AandAA')[0].value==""?0:document.getElementsByName('scheduleHP.rentOfEarlierYrSec25AandAA')[0].value) + parseInt(total));
}
	
// Calculate Income for PartB-TTI.
function calculatePartBTI_first(){
try{
	
	//1
	var salaries = document.getElementsByName('partBTI.salaries')[0];							
	salaries.value =  	coalesceSetRet('scheduleS.incomeChargeable') ;
	//2
	var incomeFromHP = document.getElementsByName('partBTI.incomeFromHP')[0];							
	incomeFromHP.value =  zeroOrMore( coalesceSetRet('scheduleHP.totalIncomeChargeableUnHP') );	
	//3
		var bp37 = parseInt(
					coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.netPLBusOthThanSpec7A7B7C'), 10);
			
		var incOfCurYrAfterSetOff = parseInt(coalesceSetRet('itr4ScheduleBP.busSetoffCurYr.speculativeInc.incOfCurYrAfterSetOff'), 10);
		
		var afterSetOffSpecifiedInc = parseInt(coalesceSetRet('itr4ScheduleBP.busSetoffCurYr.specifiedInc.incOfCurYrAfterSetOff'), 10);
		
		if (bp37 > 0) {
			document.getElementsByName('partBTI.profBusGain.profGainNoSpecBus')[0].value = bp37;
		} else {
			document.getElementsByName('partBTI.profBusGain.profGainNoSpecBus')[0].value = parseInt(0, 10);
		}	
		
		document.getElementsByName('partBTI.profBusGain.profGainSpecBus')[0].value = eval(incOfCurYrAfterSetOff);
		
		document.getElementsByName('partBTI.profBusGain.profGainSpecifiedBus')[0].value = eval(afterSetOffSpecifiedInc);

	document.getElementsByName('partBTI.profBusGain.totProfBusGain')[0].value = eval(
		parseInt(coalesceSetRet('partBTI.profBusGain.profGainNoSpecBus'),10)
		+ parseInt(coalesceSetRet('partBTI.profBusGain.profGainSpecBus'),10)
		+ parseInt(coalesceSetRet('partBTI.profBusGain.profGainSpecifiedBus'),10)
		+parseInt(coalesceSetRet('partBTI.profBusGain.profIncome115BBF'),10)
		);
		
	//4ai
var shortTerm15Per = document.getElementsByName('partBTI.capGain.shortTerm.shortTerm15Per')[0];
shortTerm15Per.value = coalesceSetRet('scheduleCGPost45.currYrLosses.inStcg15Per.CurrYrLosSetOff');

var shortTerm30Per = document.getElementsByName('partBTI.capGain.shortTerm.shortTerm30Per')[0];
shortTerm30Per.value = coalesceSetRet('scheduleCGPost45.currYrLosses.inStcg30Per.currYrLosSetOff');

var shortTermAppRate = document.getElementsByName('partBTI.capGain.shortTerm.shortTermAppRate')[0];
shortTermAppRate.value = coalesceSetRet('scheduleCGPost45.currYrLosses.inStcgAppRate.currYrLosSetOff');

var longTerm10Per = document.getElementsByName('partBTI.capGain.longTerm.longTerm10Per')[0];
longTerm10Per.value = coalesceSetRet('scheduleCGPost45.currYrLosses.inLtcg10Per.currYrLosSetOff');

var longTerm20Per = document.getElementsByName('partBTI.capGain.longTerm.longTerm20Per')[0];
longTerm20Per.value = coalesceSetRet('scheduleCGPost45.currYrLosses.inLtcg20Per.CurrYrLosSetOff');



	
//4a	scheduleCGFor23.shortTermCapGainFor23.nriAssetSec48Dtl.nri111AApplicable
	var totalShortTerm = document.getElementsByName('partBTI.capGain.shortTerm.totalShortTerm')[0];
	totalShortTerm.value = eval(parseInt(shortTerm15Per.value, 10)
			 + parseInt(shortTerm30Per.value, 10)
			 + parseInt(shortTermAppRate.value, 10)
			 );
//43b

	var totalLongTerm = document.getElementsByName('partBTI.capGain.longTerm.totalLongTerm')[0];
	totalLongTerm.value = eval(parseInt(longTerm10Per.value, 10)
			 + parseInt(longTerm20Per.value, 10));

//4 Total
document.getElementsByName('partBTI.capGain.totalCapGains')[0].value = eval(
	parseInt(coalesceSetRet('partBTI.capGain.shortTerm.totalShortTerm'),10)
	+ parseInt(coalesceSetRet('partBTI.capGain.longTerm.totalLongTerm'),10)
	);	
if (eval(document.getElementsByName('partBTI.capGain.totalCapGains')[0].value) < 0) {
	document.getElementsByName('partBTI.capGain.totalCapGains')[0].value = parseInt(0,10);
}

	//5
	var otherSrcThanOwnRaceHorse = document.getElementsByName('partBTI.incFromOS.otherSrcThanOwnRaceHorse')[0];
otherSrcThanOwnRaceHorse.value = zeroOrMore(coalesceSetRet('scheduleOS.balanceNoRaceHorse'));

var incChargeSplRate = document.getElementsByName('partBTI.incFromOS.incChargeSplRate')[0];
incChargeSplRate.value = zeroOrMore(coalesceSetRet('scheduleOS.incChargblSplRateOS.totalOSGrossChargblSplRate'));

var fromOwnRaceHorse = document.getElementsByName('partBTI.incFromOS.fromOwnRaceHorse')[0];
fromOwnRaceHorse.value = zeroOrMore(coalesceSetRet('scheduleOS.incFromOwnHorse.balanceOwnRaceHorse'));

var totIncFromOS = document.getElementsByName('partBTI.incFromOS.totIncFromOS')[0];
totIncFromOS.value = eval(parseInt(otherSrcThanOwnRaceHorse.value, 10)
						 + parseInt(incChargeSplRate.value, 10)
						 + parseInt(fromOwnRaceHorse.value, 10)
						 );


	//6
	document.getElementsByName('partBTI.totalTI')[0].value = eval(
	parseInt(salaries.value, 10)
	+ parseInt(incomeFromHP.value ,10)
        + parseInt(coalesceSetRet('partBTI.profBusGain.totProfBusGain'),10)
	+ parseInt(coalesceSetRet('partBTI.capGain.totalCapGains'),10)
	+ parseInt(coalesceSetRet('partBTI.incFromOS.totIncFromOS'),10)
	);	

	//7
	document.getElementsByName('partBTI.currentYearLoss')[0].value = eval(
	parseInt(coalesceSetRet('scheduleCYLA.totalLossSetOff.totHPlossCurYrSetoff'),10)
	+ parseInt(coalesceSetRet('scheduleCYLA.totalLossSetOff.totBusLossSetoff'),10)
            + parseInt(coalesceSetRet('scheduleCYLA.totalLossSetOff.totOthSrcLossNoRaceHorseSetoff'),10)
	);

	//8
	document.getElementsByName('partBTI.balanceAfterSetoffLosses')[0].value = zeroOrMore(eval(
	parseInt(coalesceSetRet('partBTI.totalTI'),10)
	- parseInt(coalesceSetRet('partBTI.currentYearLoss'),10))
	);

	//9
	document.getElementsByName('partBTI.broughtFwdLossesSetoff')[0].value = zeroOrMore(eval(
		parseInt(coalesceSetRet('scheduleBFLA.totalBFLossSetOff.totBFLossSetoff'),10)
		+ parseInt(coalesceSetRet('scheduleBFLA.totalBFLossSetOff.totUnabsorbedDeprSetoff'),10)
		+ parseInt(coalesceSetRet('scheduleBFLA.totalBFLossSetOff.totAllUs35Cl4Setoff'),10)
		));

	//10
	document.getElementsByName('partBTI.grossTotalIncome')[0].value = zeroOrMore(eval(
		parseInt(coalesceSetRet('partBTI.balanceAfterSetoffLosses'),10)
		- parseInt(coalesceSetRet('partBTI.broughtFwdLossesSetoff'),10)
		));

	//11
        document.getElementsByName('partBTI.incChargeTaxSplRate111A112')[0].value = eval(
	parseInt(coalesceSetRet('scheduleSI.totSplRateInc'),10)
	);	
        
	//12
		
		var ded10A10AAAlwd = parseInt(coalesceSetRet('scheduleBFLA.busProfInclSpecProf.incBFLA.incOfCurYrAfterSetOffBFLosses')) ;
		
        document.getElementsByName('partBTI.deductionsUnder10Aor10AA')[0].value=Math.min(zeroOrMore(eval(
		parseInt(coalesceSetRet('schedule10A.deductSEZ.dedUs10Detail.totalDedUs10Sub'),10)+
                    parseInt(coalesceSetRet('schedule10AA.deductSEZ.dedUs10Detail.totalDedUs10Sub'),10)
		)),ded10A10AAAlwd);
        
	}catch(e){
		alert(e);
	}
}

// Calculate Income for PartB-TI
function calculatePartBTI_second(){
	try{
		surcharge201718();  
        //13
         var dedPartBLimit=zeroOrMore(eval(
		parseInt(coalesceSetRet('partBTI.grossTotalIncome'),10)-
                    parseInt(coalesceSetRet('partBTI.incChargeTaxSplRate111A112'),10)-
                    parseInt(coalesceSetRet('partBTI.deductionsUnder10Aor10AA'),10)
		));
         var dedPartCLimit=zeroOrMore(eval(
		parseInt(coalesceSetRet('partBTI.grossTotalIncome'),10)-
                    parseInt(coalesceSetRet('partBTI.incChargeTaxSplRate111A112'),10)-
                    parseInt(coalesceSetRet('partBTI.profBusGain.profGainSpecifiedBus'),10)-
                    parseInt(coalesceSetRet('partBTI.deductionsUnder10Aor10AA'),10)
		));
         
         
            var dedPartB=zeroOrMore(eval(
		parseInt(coalesceSetRet('scheduleVIA.deductUndChapVIA.totalDeductionPartb'),10)+
                    parseInt(coalesceSetRet('scheduleVIA.deductUndChapVIA.totalDeductionPartca'),10)
		));
                   //13a 
                    if(dedPartB<dedPartBLimit){
                        document.getElementsByName('partBTI.deductionsUnderScheduleVIAPartB')[0].value=dedPartB;
                        
                    }else{
                      document.getElementsByName('partBTI.deductionsUnderScheduleVIAPartB')[0].value=dedPartBLimit;
                    }
                    //13b
                var dedPartCa=zeroOrMore(eval(
		parseInt(coalesceSetRet('scheduleVIA.deductUndChapVIA.totalDeductionPartc'),10)
		));
                if(dedPartCa<dedPartCLimit){
                        document.getElementsByName('partBTI.deductionsUnderScheduleVIAPartC')[0].value=dedPartCa;
                    }else{
                      document.getElementsByName('partBTI.deductionsUnderScheduleVIAPartC')[0].value=dedPartCLimit;
                    }
       
       //13c
       var totalDedChapVIA=zeroOrMore(eval(
		parseInt(coalesceSetRet('partBTI.deductionsUnderScheduleVIAPartB'),10)+
                    parseInt(coalesceSetRet('partBTI.deductionsUnderScheduleVIAPartC'),10)
		));
      
      if(dedPartBLimit<totalDedChapVIA){
          document.getElementsByName('partBTI.totalDeductionsUnderScheduleVIA')[0].value=dedPartBLimit;
      }else{
          
          document.getElementsByName('partBTI.totalDeductionsUnderScheduleVIA')[0].value=totalDedChapVIA;
      }
      

	//14
	document.getElementsByName('partBTI.totalIncome')[0].value = rndOffNrsTen(zeroOrMore(eval(
		parseInt(coalesceSetRet('partBTI.grossTotalIncome'),10)-
                    parseInt(coalesceSetRet('partBTI.deductionsUnder10Aor10AA'),10)
		- parseInt(coalesceSetRet('partBTI.totalDeductionsUnderScheduleVIA'),10)
		)).toString());
		
	// calling SI before 14
	calcScheduleSI();

//14
document.getElementsByName('partBTI.incomeChargeableTotTax')[0].value = eval(
	parseInt(coalesceSetRet('scheduleSI.totSplRateTaxableInc'),10)
	);
	
	//15
var netAgricultureIncomeOrOtherIncomeForRate = document.getElementsByName('partBTI.netAgricultureIncomeOrOtherIncomeForRate')[0];
var newVal15 = eval(
	parseInt(coalesceSetRet('scheduleEI.netAgriIncOrOthrIncRule7'),10)
	);

if(parseInt(newVal15)<=5000){
	newVal15 = 0;
}

if(netAgricultureIncomeOrOtherIncomeForRate.old != newVal15){
netAgricultureIncomeOrOtherIncomeForRate.old = newVal15;
netAgricultureIncomeOrOtherIncomeForRate.value = newVal15;
}		
	
//15
var tempInc = zeroOrMore(eval(
	parseInt(coalesceSetRet('partBTI.totalIncome'),10)
	- parseInt(coalesceSetRet('partBTI.incomeChargeableTotTax'),10)));

if(parseInt(tempInc, 10) > getExemption()){	
document.getElementsByName('partBTI.aggregateIncome')[0].value = zeroOrMore(eval(
	parseInt(tempInc, 10)
	+ parseInt(coalesceSetRet('partBTI.netAgricultureIncomeOrOtherIncomeForRate'),10)
	));
}else{
	document.getElementsByName('partBTI.aggregateIncome')[0].value = 0;
}	

	//17
	document.getElementsByName('partBTI.lossesOfCurrentYearCarriedFwd')[0].value = eval(
		parseInt(coalesceSetRet('scheduleCFL.currentAYloss.lossSummaryDetail.hpLossCF'),10)
		+ parseInt(coalesceSetRet('scheduleCFL.currentAYloss.lossSummaryDetail.busLossOthThanSpecLossCF'),10)
		+ parseInt(coalesceSetRet('scheduleCFL.currentAYloss.lossSummaryDetail.lossFrmSpecBusCF'),10)
		+ parseInt(coalesceSetRet('scheduleCFL.currentAYloss.lossSummaryDetail.lossFrmSpecifiedBusCF'),10)
		+ parseInt(coalesceSetRet('scheduleCFL.currentAYloss.lossSummaryDetail.stcgLossCF'),10)
		+ parseInt(coalesceSetRet('scheduleCFL.currentAYloss.lossSummaryDetail.ltcgLossCF'),10)
		+ parseInt(coalesceSetRet('scheduleCFL.currentAYloss.lossSummaryDetail.othSrcLossRaceHorseCF'),10)
		);



	}catch(e){
		alert('Error in partb ti second'+e.stack);
	}
}


function calculateTiTti(cgosIncome) {
		var varDate = document.getElementsByName('verification.date')[0];
		if(varDate.value=='' || varDate.value==undefined || varDate.value== null){
			var dt = new Date();
			varDate.value= ("00" + dt.getDate()).slice(-2) + '/' + ("00" + (dt.getMonth()+1)).slice(-2)+ '/' + dt.getFullYear() ;
		}
		
		calculatePartBTTI_first(cgosIncome);

	}

// Calculate Age 
function calcAge(){
		var dob = document.getElementsByName('partAGEN1.personalInfo.dob')[0];
		var retVal = calcAgeCommon(dob);
		return retVal;
	}

// Calculate Exemption.
function getExemption(){
	var age	= calcAgeCommon(document.getElementsByName('partAGEN1.personalInfo.dob')[0]);
	var resStatus = document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0]; //RES , NRI
	var taxPayer = document.getElementsByName('partAGEN1.personalInfo.status')[0];  
			if(taxPayer.value=='I' && age > 59 && age < 80 && (resStatus.value=='RES' || resStatus.value=='NOR')){
				return 300000;
			}else if(taxPayer.value=='I' && age >= 80 && (resStatus.value=='RES' || resStatus.value=='NOR')){
				return 500000;
			}else if( (taxPayer.value=='I') || taxPayer.value=='H' ){
				return 250000;
			}else{
				return 0;
			}
	}

// Calculate Tax payable on Total Income.
function calculateTaxPayableOnTotalInc(srcElementName, destElementName, forRebate){
            
	var totalIncome = zeroOrMore( parseInt(coalesceSetRet(srcElementName),10));
	var taxPayer = document.getElementsByName('partAGEN1.personalInfo.status')[0];
	//IN-I,HUF-H
	var resStatus 			= document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0]; //RES , NRI 
	
	var age	= calcAge();
	
	var netTxblIncome 		= totalIncome;
	if(forRebate==true){
		netTxblIncome = parseInt(totalIncome, 10) + parseInt(getExemption(), 10);
	}
	
	var tax = 0;
	
	var incTax 				= document.getElementsByName(destElementName)[0];	
	var pan = document.getElementsByName('partAGEN1.personalInfo.pan')[0].value; 
	if((pan.substring(3,4)=='P' || pan.substring(3,4)=='p') && taxPayer.value=='I' && age > 59 && age < 80 && (resStatus.value=='RES' || resStatus.value=='NOR')){

		if(parseInt(netTxblIncome,10) >= parseInt('0',10) && parseInt(netTxblIncome,10) <= parseInt('300000',10)){
			tax = parseInt('0',10);
		}else if(parseInt(netTxblIncome,10) >= parseInt('300001',10) && parseInt(netTxblIncome,10) <= parseInt('500000',10)){
			tax = Math.round(eval( eval(parseInt(netTxblIncome,10) - parseInt('300000',10) )  * parseFloat('0.1'))) ;
		}else if(parseInt(netTxblIncome,10) >= parseInt('500001',10) && parseInt(netTxblIncome,10) <= parseInt('1000000',10)){
			tax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('500000',10) )* parseFloat('0.2')) + parseInt('20000',10)));
		}else if(parseInt(netTxblIncome,10) >= parseInt('1000001',10)){
			tax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('1000000',10) )* parseFloat('0.3')) + parseInt('120000',10)));
		}
	
	}else if((pan.substring(3,4)=='P' || pan.substring(3,4)=='p') && taxPayer.value=='I' && age >= 80 && (resStatus.value=='RES' || resStatus.value=='NOR')){
			   
		if(parseInt(netTxblIncome,10) >= parseInt('0',10) && parseInt(netTxblIncome,10) <= parseInt('500000',10)){
			tax = parseInt('0',10);
		}else if(parseInt(netTxblIncome,10) >= parseInt('500001',10) && parseInt(netTxblIncome,10) <= parseInt('1000000',10)){
			tax = Math.round(eval( eval(parseInt(netTxblIncome,10) - parseInt('500000',10) )  * parseFloat('0.2'))) ;
					
		}else if(parseInt(netTxblIncome,10) >= parseInt('1000001',10)){
			tax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('1000000',10) )* parseFloat('0.3')) + parseInt('100000',10)));             
		}
			   
		
	}else if( (taxPayer.value=='I') || taxPayer.value=='H' ){
		
		if(parseInt(netTxblIncome,10) >= parseInt('0',10) && parseInt(netTxblIncome,10) <= parseInt('250000',10)){
			tax = parseInt('0',10);
		}else if(parseInt(netTxblIncome,10) >= parseInt('250001',10) && parseInt(netTxblIncome,10) <= parseInt('500000',10)){
			tax = Math.round(eval( eval(parseInt(netTxblIncome,10) - parseInt('250000',10) )  * parseFloat('0.1'))) ;
		}else if(parseInt(netTxblIncome,10) >= parseInt('500001',10) && parseInt(netTxblIncome,10) <= parseInt('1000000',10)){
			tax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('500000',10) )* parseFloat('0.2')) + parseInt('25000',10)));
		}else if(parseInt(netTxblIncome,10) >= parseInt('1000001',10)){
			tax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('1000000',10) )* parseFloat('0.3')) + parseInt('125000',10)));
		}
		
	}
	
	if(forRebate){
		setEditableFieldValue(incTax,tax);
	}else{
		incTax.value = tax;
	}
		
}

// Calculate Surcharge Above 1 Crore.
function calsurchargeOnAmtcAboveCrore(){
	var taxPayable = document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnDeemedTI.taxDeemedTISec115JC')[0];
	var surchargeOnAboveCrore = document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnDeemedTI.surchargeA')[0];
	var totInc = document.getElementsByName('itrScheduleAMT.adjustedUnderSec115JC')[0];	totInc.value = coalesce(totInc.value);

	// for surcharge
				var taxOnTotInc =  parseInt(taxPayable.value,10);
				var taxOnCutOffInc = (10000000 * .185);

				if( rndOffNrsTen(totInc.value) > 10000000 ){
					var tempSurcharge = taxOnTotInc  * 0.15 ; // old calcn 2016-17
					
					
					//check if eligible for marginal relief
					var extraInc = rndOffNrsTen(totInc.value) - 10000000;
					if( (taxOnTotInc + tempSurcharge ) > (taxOnCutOffInc + extraInc)){
						var marginalRelief = taxOnTotInc + tempSurcharge - (taxOnCutOffInc + extraInc );
						surchargeOnAboveCrore.value = tempSurcharge - marginalRelief;
						surchargeOnAboveCrore.value  = Math.round(surchargeOnAboveCrore.value);
						
					}else {
						surchargeOnAboveCrore.value = tempSurcharge;
						surchargeOnAboveCrore.value  = Math.round(surchargeOnAboveCrore.value);
						}
				} else {
					 surchargeOnAboveCrore.value = parseInt('0' ,10);
				}
	}

// Calculate Income for PartB-TTI.
function calculatePartBTTI_first(cgosIncome){
	try{

	//1
	document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnDeemedTI.taxDeemedTISec115JC')[0].value = eval(
		parseInt(coalesceSetRet('itrScheduleAMT.taxPayableUnderSec115JC'),10)
		);
	calsurchargeOnAmtcAboveCrore();
	document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnDeemedTI.educationCess')[0].value = Math.round((
					parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnDeemedTI.taxDeemedTISec115JC'),10) + 
					parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnDeemedTI.surchargeA'),10))
					* 0.03	);
	document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnDeemedTI.totalTax')[0].value = eval(
		parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnDeemedTI.taxDeemedTISec115JC'),10)
		+ parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnDeemedTI.surchargeA'),10)
		+ parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnDeemedTI.educationCess'),10)
		);
	
	calculateTaxPayableOnTotalIncFor2a('partBTI.aggregateIncome','partBTTI.computationOfTaxLiability.taxPayableOnTI.taxAtNormalRatesOnAggrInc');
      
	var falg115H = document.getElementsByName('partAGEN1.filingStatus.benefitUs115HFlg')[0].value;

            /*if(coalesceSetRet('scheduleSI.totSplRateIncTax') > 0)
            	{*/
            	if(falg115H=="Y"){
            		var taxAtSpecialRates =document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxAtSpecialRates')[0];
            		var totSplRateIncTax =  eval(parseInt(coalesceSetRet('scheduleSI.totSplRateIncTax'),10));
            		
            		setEditableFieldValue(taxAtSpecialRates,eval(parseInt(coalesceSetRet('scheduleSI.totSplRateIncTax'),10)));
            	
            	}else{
            		document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxAtSpecialRates')[0].value = eval(
                			parseInt(coalesceSetRet('scheduleSI.totSplRateIncTax'),10)
                			);
            	}
            	
            /*}else{
            		setEditableFieldValue(document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxAtSpecialRates')[0], 0);
            }*/
		
		if(coalesceSetRet('partBTI.aggregateIncome') > 0){
			
				calculateTaxPayableOnTotalIncRebate('partBTI.netAgricultureIncomeOrOtherIncomeForRate','partBTTI.computationOfTaxLiability.taxPayableOnTI.rebateOnAgriInc', true);
			
			}else{
			setEditableFieldValue(document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.rebateOnAgriInc')[0], 0);
		}
		var taxPayableOnTotInc = document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxPayableOnTotInc')[0];
		taxPayableOnTotInc.value = eval(
			parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxAtNormalRatesOnAggrInc'),10)
			+ parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxAtSpecialRates'),10)
			- parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnTI.rebateOnAgriInc'),10)
			);
		if(taxPayableOnTotInc.value < 0){
		taxPayableOnTotInc.value = parseInt('0' ,10);
		}
		var rebate87A = document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.rebate87A')[0];
		var taxPayable = coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxPayableOnTotInc');
		var resStatus = document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0].value;
		var totalIncome = coalesceSetRet('partBTI.totalIncome');
		var dtaaInc = document.getElementsByName('scheduleSI.splCodeRateTax[1].splRateInc')[0].value;
		totalIncome = parseInt(totalIncome) + parseInt(coalesce(dtaaInc)); 
		var status = document.getElementsByName('partAGEN1.personalInfo.status')[0].value;
		if(status=='I' && (resStatus=='RES' || resStatus=='NOR') && totalIncome<=500000){
			rebate87A.value = Math.min(parseInt(taxPayable,10),5000);
		} else {
		    rebate87A.value = parseInt('0' ,10);
		}

//3
		var taxPayableOnRebate = document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxPayable')[0];
		taxPayableOnRebate.value = eval(parseInt(taxPayableOnTotInc.value, 10) -
										parseInt(rebate87A.value, 10));
		//4

		calsurchargeOnAboveCrore(cgosIncome);
		surcharge201718();
		
		var f_115BBE=  eval(
				parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxPayable'),10)-
				(parseInt(coalesceSetRet('scheduleOS.incChargblSplRateOS.115BBE'),10) * 0.60));
		var tempSurcharge= eval((0.15 * parseInt(f_115BBE,10)) + (parseInt(coalesceSetRet('scheduleOS.incChargblSplRateOS.115BBE'),10) * 0.60* 0.25));
		
		
		
		
	//5
	/*	var educationCess = document.getElementsByName('partBTTI.computationOfTaxLiability.educationCess')[0];
		educationCess.value = Math.round(eval(parseInt(taxPayableOnRebate.value) + 
							coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnTI.surcharge')
								) * 0.03 ); */
		//Nagesh change for DTAA 2016-17
		var eduCessTax = Math.round(eval(
				(parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxPayable'),10)
				+ parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnTI.surcharge'),10)) * 0.03
				));
		
			var educationCess = document.getElementsByName('partBTTI.computationOfTaxLiability.educationCess')[0];
			if(educationCess.old!=eduCessTax){
				educationCess.old = eduCessTax;
				educationCess.value = eduCessTax;
			}
			
			
		//6
		var grossTaxLiability = document.getElementsByName('partBTTI.computationOfTaxLiability.grossTaxLiability')[0];
		grossTaxLiability.value = eval(parseInt(taxPayableOnRebate.value) +
						coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnTI.surcharge') +
						parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.educationCess')));
		
                //3
            document.getElementsByName('partBTTI.computationOfTaxLiability.grossTaxPayable')[0].value = Math.max(
		parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.grossTaxLiability'),10),
		parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnDeemedTI.totalTax'),10)
		);
                
	}catch(e){
		alert(e.stack);
	}		
}		
	
// Calculate Surcharge on above 1 Crore.
function calsurchargeOnAboveCrore(cgosIncome){
	var taxPayable = document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxPayable')[0];
	var surchargeOnAboveCrore = document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.surcharge')[0];
	var exceeds1crSurcharge = document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.exceeds1crSurcharge')[0]
	var totInc = document.getElementsByName('partBTI.totalIncome')[0].value;	totInc = coalesce(totInc);

	var surcharge = 0;
	var totalIncome = document.getElementsByName('partBTI.totalIncome')[0].value;
	var incChargeTaxSplRate111A112 = document.getElementsByName('partBTI.incChargeTaxSplRate111A112')[0].value;
	var taxAtSpecialRates = document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxAtSpecialRates')[0].value;
	
	var dtaaInc = document.getElementsByName('scheduleSI.splCodeRateTax[1].splRateInc')[0].value;
	var dtaaTax = document.getElementsByName('scheduleSI.splCodeRateTax[1].splRateIncTax')[0].value;
	
	// for surcharge
	
				var taxOnTotInc = parseInt(calculateTaxPayable(totalIncome - incChargeTaxSplRate111A112)) + parseInt(taxAtSpecialRates);  
				
				var normalInc = getSlabbedIncome(parseInt(totalIncome - incChargeTaxSplRate111A112));
				
				var toBeTaxed = 10000000 - coalesce(dtaaInc);
				
				var rowCount1=countRowInTable('scheduleSI.splCodeRateTax','splRateInc');
				
				var percent5SIInc= 0;
				
				var percent10SIInc= 0;
				
				var percent15SIInc= 0;
				
				var percent20SIInc= 0;
				
				var percent25SIInc= 0;
				
				var percent30SIInc= 0;
				
				var percent50SIInc= 0;
				
				var percent60SIInc= 0;
				
				for(var i = 0; i < rowCount1; i++) {

					var splRatePercent = document.getElementsByName('scheduleSI.splCodeRateTax['+i+'].splRatePercent')[0].value;
										
					if(splRatePercent==5){
						
						percent5SIInc=eval(parseInt(percent5SIInc,10) +parseInt(document.getElementsByName('scheduleSI.splCodeRateTax['+i+'].taxableInc')[0].value,10));
						
					} else if(splRatePercent==10){
						
						percent10SIInc=eval(parseInt(percent10SIInc,10)+parseInt(document.getElementsByName('scheduleSI.splCodeRateTax['+i+'].taxableInc')[0].value,10));
						
					} else
					if(splRatePercent==15){
						
						percent15SIInc=eval(parseInt(percent15SIInc,10)+parseInt(document.getElementsByName('scheduleSI.splCodeRateTax['+i+'].taxableInc')[0].value,10));
						
					}else if(splRatePercent==20){
						
						percent20SIInc=eval(parseInt(percent20SIInc,10)+parseInt(document.getElementsByName('scheduleSI.splCodeRateTax['+i+'].taxableInc')[0].value,10));
						
					}else if(splRatePercent==25){
						
						percent25SIInc=eval(parseInt(percent15SIInc,10)+parseInt(document.getElementsByName('scheduleSI.splCodeRateTax['+i+'].taxableInc')[0].value,10));
						
					} else if(splRatePercent==30){
						
						percent30SIInc=eval(parseInt(percent30SIInc,10)+parseInt(document.getElementsByName('scheduleSI.splCodeRateTax['+i+'].taxableInc')[0].value,10));
						
					} else if(splRatePercent==50){
						
						percent50SIInc=eval(parseInt(percent50SIInc,10)+parseInt(document.getElementsByName('scheduleSI.splCodeRateTax['+i+'].taxableInc')[0].value,10));
						
					}
					else if(splRatePercent==60){
						
						percent60SIInc=eval(parseInt(percent60SIInc,10)+parseInt(document.getElementsByName('scheduleSI.splCodeRateTax['+i+'].taxableInc')[0].value,10));
					}
					
					
				}
								
				var cgTax = 0;
				
				var cgTaxed = 0;

				var exmptn10 = coalesceSetRet('scheduleSI.splCodeRateTax[4].splRateInc') -
				coalesceSetRet('scheduleSI.splCodeRateTax[4].taxableInc');
				
				var exmptn15 = coalesceSetRet('scheduleSI.splCodeRateTax[2].splRateInc') -
				coalesceSetRet('scheduleSI.splCodeRateTax[2].taxableInc');
				
				var exmptn20 = coalesceSetRet('scheduleSI.splCodeRateTax[3].splRateInc') -
				coalesceSetRet('scheduleSI.splCodeRateTax[3].taxableInc');
								
				var exemptionUsed=0;
				
				if (parseInt(totalIncome - incChargeTaxSplRate111A112)>0) {
					if (parseInt(totalIncome - incChargeTaxSplRate111A112)>= getExemption()){
						exemptionUsed=getExemption();
					}else{
					exemptionUsed=parseInt(totalIncome - incChargeTaxSplRate111A112);
					}

				}

				toBeTaxed = zeroOrMore(parseInt(toBeTaxed - exemptionUsed - exmptn10 - exmptn15 - exmptn20));
				if(parseInt(percent5SIInc, 10) < parseInt(toBeTaxed, 0)){
					cgTax = (percent5SIInc) * 0.05;
					cgTaxed = percent5SIInc;
					toBeTaxed -= parseInt(percent5SIInc, 0);
				}else{
					cgTax = (toBeTaxed ) * 0.05;
					cgTaxed = toBeTaxed;
					toBeTaxed = 0;
				}
		
				percent10SIInc= parseInt(percent10SIInc,10)+parseInt(normalInc["10"], 10);
				
				if(parseInt(percent10SIInc, 10) < parseInt(toBeTaxed, 0)){
					cgTax  =  parseInt(cgTax, 10) + (percent10SIInc) * 0.1;
					cgTaxed = parseInt(cgTaxed)+ percent10SIInc;
					toBeTaxed -= parseInt(percent10SIInc, 0);
			    }else{
					cgTax = parseInt(cgTax, 10)+(toBeTaxed ) * 0.1;
					cgTaxed =parseInt(cgTaxed)+ toBeTaxed;
					toBeTaxed = 0;
			    }
				
				if(parseInt(percent15SIInc, 10) < parseInt(toBeTaxed, 0)){
					cgTax =  parseInt(cgTax, 10)+(percent15SIInc) * parseFloat(0.15);
					cgTaxed = parseInt(cgTaxed)+percent15SIInc;
					toBeTaxed -= parseInt(percent15SIInc, 0);
				}else{
					cgTax = parseInt(cgTax, 10)+(toBeTaxed ) * parseFloat(0.15);
					cgTaxed = parseInt(cgTaxed)+ toBeTaxed;
					toBeTaxed = 0;
				}
				
				percent20SIInc= parseInt(percent20SIInc,10) + parseInt(normalInc["20"], 10);

				if(parseInt(percent20SIInc, 10) < parseInt(toBeTaxed, 0)){
					cgTax =  parseInt(cgTax, 10)+(percent20SIInc) * 0.2;
					cgTaxed = parseInt(cgTaxed)+ percent20SIInc;
					toBeTaxed -= parseInt(percent20SIInc, 0);
				}else{
					cgTax = parseInt(cgTax, 10)+(toBeTaxed ) * 0.2;
					cgTaxed = parseInt(cgTaxed)+ toBeTaxed;
					toBeTaxed = 0;
				}
				
				
				if(parseInt(percent25SIInc, 10) < parseInt(toBeTaxed, 0)){
					cgTax =  parseInt(cgTax, 10)+(percent25SIInc) * 0.25;
					cgTaxed = parseInt(cgTaxed)+ percent25SIInc;
					toBeTaxed -= parseInt(percent25SIInc, 0);
				}else{
					cgTax = parseInt(cgTax, 10)+(toBeTaxed ) * 0.25;
					cgTaxed = parseInt(cgTaxed)+toBeTaxed;
					toBeTaxed = 0;
				}
				
				percent30SIInc= parseInt(percent30SIInc,10)+ parseInt(normalInc["30"], 10);
				
				if(parseInt(percent30SIInc, 10) < parseInt(toBeTaxed, 0)){
					cgTax =  parseInt(cgTax, 10)+(percent30SIInc) * 0.3;
					cgTaxed = parseInt(cgTaxed)+ percent30SIInc;
					toBeTaxed -= parseInt(percent30SIInc, 0);
				}else{
					cgTax = parseInt(cgTax, 10)+ (toBeTaxed ) * 0.3;
					cgTaxed = parseInt(cgTaxed)+toBeTaxed;
					toBeTaxed = 0;
				}
				
							
				if(parseInt(percent50SIInc, 10) < parseInt(toBeTaxed, 0)){
					cgTax =  parseInt(cgTax, 10)+(percent50SIInc) * 0.5;
					cgTaxed =parseInt(cgTaxed)+ percent50SIInc;
					toBeTaxed -= parseInt(percent50SIInc, 0);
				}else{
					cgTax = parseInt(cgTax, 10)+(toBeTaxed ) * 0.5;
					cgTaxed = parseInt(cgTaxed)+toBeTaxed;
					toBeTaxed = 0;
				}
				
			
				percent60SIInc= parseInt(percent60SIInc,10);
				
				
				if(parseInt(percent60SIInc, 10) < parseInt(toBeTaxed, 0)){
					cgTax =  parseInt(cgTax, 10)+(percent60SIInc) * 0.6;
					cgTaxed = parseInt(cgTaxed)+ percent60SIInc;
					toBeTaxed -= parseInt(percent60SIInc, 0);
				}else{
					cgTax = parseInt(cgTax, 10)+ (toBeTaxed ) * 0.6 * 1.25;
					cgTaxed = parseInt(cgTaxed)+toBeTaxed;
					toBeTaxed = 0;
				}
				
				var taxOnCutOffInc = parseInt(cgTax) + parseInt(coalesce(dtaaTax));

				
				if( rndOffNrsTen(totInc) > 10000000 ){
					
					var f_115BBE = eval(parseInt(
							coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxPayable'),
							10)
							- (parseInt(
									coalesceSetRet('scheduleOS.incChargblSplRateOS.115BBE'),
									10) * 0.60));
					var tempSurcharge = eval((0.15 * parseInt(f_115BBE, 10))
							+ (parseInt(
									coalesceSetRet('scheduleOS.incChargblSplRateOS.115BBE'),
									10) * 0.60 * 0.25));

					//check if eligible for marginal relief
					var extraInc = rndOffNrsTen(totInc) - 10000000;
					
					if( (taxOnTotInc + tempSurcharge ) > (taxOnCutOffInc + extraInc)){
						var marginalRelief = zeroOrMore(taxOnTotInc + tempSurcharge - (taxOnCutOffInc + extraInc ));
						
						surcharge = zeroOrMore(tempSurcharge - marginalRelief);
						surcharge  = Math.round(surcharge);
						
					}else {
						surcharge = tempSurcharge;
						surcharge  = Math.round(surcharge);
						}
				} else {
					surcharge = parseInt('0' ,10);
				}
				
				setEditableFieldValue(surchargeOnAboveCrore, surcharge);
				var surchargeIT= zeroOrMore(eval(surcharge- (parseInt(coalesceSetRet('scheduleOS.incChargblSplRateOS.115BBE'),10) * 0.60* 0.25)));
				
				setEditableFieldValue(exceeds1crSurcharge, surchargeIT);
				//document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.exceeds1crSurcharge')[0].value = zeroOrMore(eval(surcharge-
					//	(parseInt(coalesceSetRet('scheduleOS.incChargblSplRateOS.115BBE'),10) * 0.60* 0.25)));
				
	}

// Calculate Due-Date.
function getDueDate(){
	var duedate = '01/08/2015';
	
	// partAGEN2.auditInfo.repSec92EFlag  --->30 nov		
	// partAGEN2.auditInfo.liableSec44ABflg --->30 sep
	
	
	var auditFlag = document.getElementsByName('partAGEN2.auditInfo.liableSec44ABflg')[0].value;
	if(auditFlag=='Y'){
		duedate = "01/10/2015";
	}
	


    var tabIf = document.getElementById('scheduleIF');
var allInputTags = tabIf.getElementsByTagName('select');

for(var i = 0; i < allInputTags.length; i++) {
	
	if (allInputTags[i].name.match("isLiableToAudit$")) {
		if(allInputTags[i].value=='Y'){
		duedate = '01/10/2015';
		break;
			} 		
		}
	}

var tab92E=document.getElementById('othSecDateTabId');
var allInputTags = tab92E.getElementsByTagName('select');

for(var i = 0; i < allInputTags.length; i++) {
	
	if (allInputTags[i].name.match("auditedSection$")) {
		if(allInputTags[i].value=='92E'){   
		duedate = '01/12/2015';
		break;
			} else if(allInputTags[i].value!=''){
			duedate = '01/10/2015';
			} 		
		}
	}

return duedate;
}

// Return Due Date for 234A.
function getDueDate234A(){
	var duedate234A = Filing_dueDate;
	var auditFlag = document.getElementsByName('partAGEN2.auditInfo.liableSec44ABflg')[0].value;
	var auditFlag92E = document.getElementsByName('partAGEN2.liableSec92Eflg')[0].value;
	
	if(auditFlag92E == 'Y'){
		duedate234A = '30/11/2017';
	}else if(auditFlag=='Y'){
		duedate234A = "07/11/2017";
	}else {
		var tabIf = document.getElementById('scheduleIF');
		var allInputTags = tabIf.getElementsByTagName('select');

		for(var i = 0; i < allInputTags.length; i++) {
			
			if (allInputTags[i].name.match("isLiableToAudit$")) {
				if(allInputTags[i].value=='Y'){
					duedate234A = '07/11/2017';
				break;
					} 		
				}
			}
		
		var othetThan92E=document.getElementById('othSecDateTabId');
		var allInputNewTags = othetThan92E.getElementsByTagName('select');
		for(var i = 0; i < allInputNewTags.length; i++) {
			if (allInputNewTags[i].name.match("auditedSection$")) {
				 if(allInputNewTags[i].value!=''){
						duedate234A = '07/11/2017';
						break;
					} 		
				}
			}
		
		
	}
return duedate234A;
}

// Calculate Self-Assessment Tax.
function calculateSelfAsstTax(dueDate234A){
	var selfAssessmentTax234A = parseInt('0' ,10) ;
	var tab3 = document.getElementById('scheduleIt');
	var allInputTags = tab3.getElementsByTagName('input');
	for(var i = 0; i < allInputTags.length; i++) {
		if(allInputTags[i].name.match("dateDep$")){
			if(checkFirstDateBefore(AY_start_date , allInputTags[i].value) && checkFirstDateBefore(allInputTags[i].value , dueDate234A)){
				selfAssessmentTax234A = eval( parseInt(isNVL(selfAssessmentTax234A) ,10) + parseInt(isNVL(allInputTags[i+2].value) ,10));
				}
		}
	}
	return selfAssessmentTax234A;
}
	
// Calculate Interest Payable.
function calcInterestPayable(cgosIncome){

	try{

			var advanceTax = document.getElementsByName('partBTTI.taxPaid.taxesPaid.advanceTax')[0].value;
			var TDSToDisplay = document.getElementsByName('partBTTI.taxPaid.taxesPaid.tds')[0];
			TDSToDisplay.value = coalesce(TDSToDisplay.value);
			var TDS = TDSToDisplay.value;
			
			var TCSToDisplay = document.getElementsByName('partBTTI.taxPaid.taxesPaid.tcs')[0];
			TCSToDisplay.value = coalesce(TCSToDisplay.value);
			var TCS = TCSToDisplay.value;		

			var balTaxPayable = document.getElementsByName('partBTTI.computationOfTaxLiability.netTaxLiability')[0].value;
			balTaxPayable = coalesce(balTaxPayable);
			//var balTaxPayable = balTaxPayable.value;
			
			var dueDate234A = getDueDate234A();
			
			var selfAssessmentTax234A = calculateSelfAsstTax(dueDate234A);
			
			var intrst234Aprinciple	;
			if(parseInt(balTaxPayable,10) - parseInt(advanceTax ,10) - parseInt(selfAssessmentTax234A ,10) - parseInt(TDS ,10) - parseInt(TCS ,10) < 0){
				intrst234Aprinciple = parseInt('0' ,10);
				}else {

				intrst234Aprinciple = parseInt(balTaxPayable ,10) - parseInt(advanceTax ,10) - parseInt(selfAssessmentTax234A ,10) - parseInt(TDS ,10) - parseInt(TCS ,10);

				// Rounding off to previous hundered
					if(parseInt(intrst234Aprinciple,10) > 100){
						intrst234Aprinciple= Math.floor(parseInt(intrst234Aprinciple,10)/100)*parseInt('100' ,10);
					}
			}
			
			var currentDate = document.getElementsByName('verification.date')[0].value;
			var filingType = document.getElementsByName('partAGEN1.filingStatus.returnFileSec')[0].value;
			
			if(checkFirstDateBefore(currentDate, getCurrentDate())){
				currentDate = getCurrentDate();
			}
			
			var actualdate = currentDate;
			
			var originalFilingDate = document.getElementsByName('partAGEN1.filingStatus.origRetFiledDate')[0].value;
			if((filingType=='17' || filingType=='19' || filingType=='18' ) && originalFilingDate !=undefined && originalFilingDate!=null && originalFilingDate!=''){
			currentDate = originalFilingDate;
		}
			
			if(dueDate234A == Filing_dueDate){
				
				dueDate234A = Int_start_date_234A;
			}else if(dueDate234A == '07/11/2017'){
				dueDate234A = '08/11/2017';
				
			}else if(dueDate234A == '30/11/2017'){
				dueDate234A = '01/12/2017';
			}
		
			var MonthsAfterDueDate =  calcNoOfMonths(currentDate , dueDate234A);
			
			
			var intrst234A = parseInt(intrst234Aprinciple,10) * parseFloat('0.01') * parseInt(MonthsAfterDueDate) ;
			
			       
			var intrst234B = parseInt('0' ,10);
			var	intrst234C = parseInt('0' ,10);
			
			
			var slab0 = parseInt('0' ,10);
			var slab1 = parseInt('0' ,10);
			var slab2 = parseInt('0' ,10);
			var slab3 = parseInt('0' ,10);
			var slab4 = parseInt('0' ,10);
			
			var state = document.getElementsByName('partAGEN1.personalInfo.address.stateCode')[0];

			/*if(state.value== '25' || state.value == '29'){
				
				slab2_end_date='31/12/2015';
				slab3_start_date='01/01/2016';
				
			}else{
				
				var slab2_end_date = '15/12/2015';
				var slab3_start_date = '16/12/2015';
			}
*/

				var tab4 = document.getElementById('scheduleIt');
				var allInputTags = tab4.getElementsByTagName('input');
				for(var i = 0; i < allInputTags.length; i++) {
					if (allInputTags[i].name.match("dateDep$")) {
						
	                    if(checkFirstDateBefore(FY_start_date , allInputTags[i].value) && checkFirstDateBefore( allInputTags[i].value , slab0_end_date ) ){
							slab0 = eval(parseInt(slab0 ,10) + parseInt(isNVL(allInputTags[i+2].value) ,10));
							
						}else if(checkFirstDateBefore(slab1_start_date , allInputTags[i].value) && checkFirstDateBefore( allInputTags[i].value , slab1_end_date ) ){
							slab1 = eval(parseInt(slab1 ,10) + parseInt(isNVL(allInputTags[i+2].value) ,10));
						}
	                    
						else if(checkFirstDateBefore(slab2_start_date , allInputTags[i].value) && checkFirstDateBefore( allInputTags[i].value , slab2_end_date ) ){
							slab2 = eval(parseInt(slab2 ,10) + parseInt(isNVL(allInputTags[i+2].value) ,10));
						}
					
						else if(checkFirstDateBefore(slab3_start_date , allInputTags[i].value) && checkFirstDateBefore( allInputTags[i].value , slab3_end_date ) ){
							slab3 = eval(parseInt(slab3 ,10) + parseInt(isNVL(allInputTags[i+2].value) ,10));
						}
					
						else if(checkFirstDateBefore(slab4_start_date , allInputTags[i].value) && checkFirstDateBefore( allInputTags[i].value , FY_end_date ) ){
							slab4 = eval(parseInt(slab4 ,10) + parseInt(isNVL(allInputTags[i+2].value) ,10));
						}
					}
				}
	        intrst234C = calculate234cIntrst(TDS, TCS, [slab0, slab1, slab2, slab3, slab4], cgosIncome);
			
			// ===============Interest234B calculation=======================

				var presInc44AD = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44AD')[0];
	   	 	var dtaa = document.getElementsByName('scheduleSI.splCodeRateTax[1].splRateIncTax')[0].value;
	   	 	
	   	 	
	   	 var winLottRacePuzz = parseInt(coalesceSetRet('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls[0].sourceAmount'));
			var rebateOnAgriInc = parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnTI.rebateOnAgriInc'), 10);
			var totalCG = 	  parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.stcg.prctg30, 10)))
							+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.stcg.prctgAr, 10)))
							+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.stcg.prctg15.sec111a, 10)))
							+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii, 10)))
							+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.ltcg.prctg20.sec112, 10)))
							+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.ltcg.prctg20.sec11EA, 10)))
							+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.ltcg.prctg10.secProviso, 10)))
							+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2, 10)))
							+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AC_1, 10)))
							+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1, 10)))
							+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AD_3, 10)))
							+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115E_b, 10)));
			var normalBalIncome = eval(
								parseInt(coalesceSetRet('partBTI.grossTotalIncome')) 
								- totalCG
								- parseInt(coalesceSetRet('partBTI.totalDeductionsUnderScheduleVIA'))
	                                                     - parseInt(coalesceSetRet('partBTI.deductionsUnder10Aor10AA'))
								- parseInt(winLottRacePuzz)
								);	
			if(parseInt(rebateOnAgriInc, 10) > parseInt('0', 10)){
				normalBalIncome = eval(parseInt(normalBalIncome, 10) 
				+ parseInt(coalesceSetRet('partBTI.netAgricultureIncomeOrOtherIncomeForRate'), 10));
			}
			
			
			var surchrge1 = parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnTI.surcharge'));
			var totalInc = parseInt(coalesceSetRet('partBTI.totalIncome'));
					
	   	 	presInc44AD = coalesce(parseInt(presInc44AD.value,10));
	   	 	if(presInc44AD > 0 &&((coalesce(parseInt(document.getElementsByName('scheduleVIA.deductUndChapVIA.totalDeductionPartc')[0].value, 10))+
					(coalesce(parseInt(document.getElementsByName('schedule10A.deductSEZ.dedUs10Detail.totalDedUs10Sub')[0].value, 10)))+
					(coalesce(parseInt(document.getElementsByName('schedule10AA.deductSEZ.dedUs10Detail.totalDedUs10Sub')[0].value, 10))) == 0))){
	   	 	
	 		//surcharge= (surchrge1*(totalInc-coalesce(parseInt(document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44AD')[0].value, 10)))/totalInc);
	 		surcharge= surchrge1;
	 		var sumSIWithDtaa = calculatePureSITax()- parseInt(coalesce(dtaa),10);
	   	 		var totSplRateIncTax = document.getElementsByName('scheduleSI.totSplRateIncTax')[0].value;
	   	 		
	   	 		var pureSIIncFor234B = totSplRateIncTax - parseInt(sumSIWithDtaa);
	   	 	//	balTaxPayable = (parseInt(calcVirtualTaxPayableOnTI(),10)); 
	   	 		
	   	 		//call the function to calculate virtualBalTaxPayable
	   	 	} 
			var intrst234Bprinciple;
			var intrst234Bi=parseInt('0',10);
			var noOfMonthsTillSelfasst= parseInt('0',10);
			
			if(balTaxPayable - parseInt(TDS,10) - parseInt(TCS ,10)>= parseInt('10000' ,10)) {
				if(parseInt(advanceTax,10) < ((balTaxPayable - parseInt(TDS,10) - parseInt(TCS ,10)) * parseFloat('0.90'))) {

					intrst234Bprinciple = (balTaxPayable - parseInt(advanceTax ,10) - parseInt(TDS,10) - parseInt(TCS ,10));

					// Rounding off to previous hundered
					if(parseInt(intrst234Bprinciple,10) > 100){
						intrst234Bprinciple= Math.floor(parseInt(intrst234Bprinciple,10)/100)*parseInt('100' ,10);
					}
					
					
					//======== Interest 234B first part calc==========

					var selfAsspaidDates=new Array();
					var selfAsspaidAmts=new Array();
					var x=parseInt('0',10);
					var tempDate=parseInt('0',10);
					var tempAmt=parseInt('0',10);

					
					currentDate = actualdate;

					// to get all self assesment tax values
					for(var p = 0; p < allInputTags.length; p++) {
						if(allInputTags[p].name.match("dateDep$")){
							if( checkFirstDateBefore(AY_start_date , allInputTags[p].value) && checkFirstDateBefore(allInputTags[p].value, currentDate) ){
								
								if(allInputTags[p+2].value!=0){
								selfAsspaidDates[x]=allInputTags[p].value;
								selfAsspaidAmts[x]=allInputTags[p+2].value;
								x++;
							}
						}
					}
				}

									
					if(selfAsspaidDates.length > 1){
						for(var q = 0; q < selfAsspaidDates.length-1; q++) {
							for(var r = q+1; r < selfAsspaidDates.length; r++) {
								if(checkFirstDateBefore(selfAsspaidDates[q], selfAsspaidDates[r])){

								}else{
									tempDate=selfAsspaidDates[q];
									tempAmt=selfAsspaidAmts[q];

									selfAsspaidDates[q]=selfAsspaidDates[r];
									selfAsspaidAmts[q]=selfAsspaidAmts[r];

									selfAsspaidDates[r]=tempDate;
									selfAsspaidAmts[r]=tempAmt;
								}
							}
						}
						var arrLen = selfAsspaidDates.length;
						var lastMonth = 0;
						var lastIndex = -1;
						var lastYear =0;
						for(var q = 0; q < arrLen; q++) {
							if(parseInt(selfAsspaidDates[q].substr(3,2), 10) == lastMonth && parseInt(selfAsspaidDates[q].substr(8,2), 10) == lastYear){
								selfAsspaidAmts[lastIndex] = parseInt(selfAsspaidAmts[lastIndex], 10) + parseInt(selfAsspaidAmts[q], 10);
							}else{
								lastMonth = parseInt(selfAsspaidDates[q].substr(3,2), 10);
								lastYear = parseInt(selfAsspaidDates[q].substr(8,2), 10);
								selfAsspaidAmts[++lastIndex] = selfAsspaidAmts[q];
								selfAsspaidDates[lastIndex] = selfAsspaidDates[q];
							}
						}
						selfAsspaidAmts.length = ++lastIndex;
						selfAsspaidDates.length = lastIndex;
					}

					if(selfAsspaidDates.length==0){
						noOfMonthsTillSelfasst=calcNoOfMonths(currentDate,AY_start_date);
					}else{
						noOfMonthsTillSelfasst=calcNoOfMonths(selfAsspaidDates[0],AY_start_date);
					}

					intrst234Bi= parseInt(intrst234Bprinciple,10) * parseFloat('0.01') * parseInt(noOfMonthsTillSelfasst) ;



					//======== Interest 234B second part calc==========
					var intrst234Bprinciple2=parseInt('0',10);  // intrst234Bprinciple if self assesment is paid
					var noOfMonthsTillSelfasst2;
					var intrst234Bii=parseInt('0',10);
					var partialSelfAssPaid=parseInt('0',10);
					var k=parseInt('0',10);
					var interestFrom;
					var interestTill;

					if(selfAsspaidDates.length!=0){

						for(var i = 0; i < selfAsspaidDates.length; i++) {
							partialSelfAssPaid= eval(parseInt(partialSelfAssPaid ,10) +parseInt(selfAsspaidAmts[i] ,10));

							intrst234Bprinciple2=zeroOrMore(eval(balTaxPayable - parseInt(advanceTax ,10) - parseInt(TDS,10) - parseInt(TCS ,10)+
									parseInt(intrst234A ,10)+parseInt(intrst234C ,10)+parseInt(intrst234Bi ,10)+parseInt(intrst234Bii ,10)
									-parseInt(partialSelfAssPaid,10)));

							// Rounding off to previous hundered
							if(parseInt(intrst234Bprinciple2,10) > parseInt('100' ,10)){
								intrst234Bprinciple2= Math.floor(parseInt(intrst234Bprinciple2,10)/100)*parseInt('100' ,10);
							}
							//calclulating remaining months to levy interest

							interestTill=currentDate;
							interestFrom=selfAsspaidDates[i];

							if(i != eval(selfAsspaidDates.length-parseInt('1' ,10))){

									for(k=i;k < eval(selfAsspaidDates.length-parseInt('1' ,10)); k++){
										if(selfAsspaidDates[k]!=selfAsspaidDates[k+1]){
											interestTill=selfAsspaidDates[k+1];
											interestFrom=selfAsspaidDates[k];
											k=selfAsspaidDates.length;
										}
									}
							}

							noOfMonthsTillSelfasst2=calcNoOfMonths(interestTill,interestFrom)-parseInt('1' ,10) ;
							if(parseInt(intrst234Bprinciple2,10) < parseInt(intrst234Bprinciple,10)){
								intrst234Bprinciple = intrst234Bprinciple2;
								intrst234Bii= eval(parseInt(intrst234Bii,10) +
									(parseInt(intrst234Bprinciple2,10) * parseFloat('0.01') * parseInt(noOfMonthsTillSelfasst2))) ;
							}else{
								intrst234Bii= eval(parseInt(intrst234Bii,10) +
									(parseInt(intrst234Bprinciple,10) * parseFloat('0.01') * parseInt(noOfMonthsTillSelfasst2))) ;
							}
						}
					}
					intrst234B=eval(parseInt(intrst234Bi,10) +parseInt(intrst234Bii,10));
				}
			}else{
				intrst234B = parseInt('0' ,10);
			}
			
			intrst234A = parseInt(intrst234A ,10);
			intrst234B = parseInt(intrst234B ,10);
			intrst234C = parseInt(intrst234C ,10);	
			
			
			var intrstPayUs234A = document.getElementsByName('partBTTI.computationOfTaxLiability.intrstPay.intrstPayUs234A')[0];
			if(intrstPayUs234A.old!=intrst234A){
				intrstPayUs234A.old = intrst234A;
				intrstPayUs234A.value = 	intrst234A;
			}
			
			var intrstPayUs234B = document.getElementsByName('partBTTI.computationOfTaxLiability.intrstPay.intrstPayUs234B')[0];
			if(intrstPayUs234B.old!=intrst234B){
				intrstPayUs234B.old = intrst234B;
				intrstPayUs234B.value = 	intrst234B;
			}
			
			var intrstPayUs234C = document.getElementsByName('partBTTI.computationOfTaxLiability.intrstPay.intrstPayUs234C')[0];
			if(intrstPayUs234C.old!=intrst234C){
				intrstPayUs234C.old = intrst234C;
				intrstPayUs234C.value = 	intrst234C;
			}
			
		//	document.getElementsByName('partBTTI.computationOfTaxLiability.intrstPay.intrstPayUs234B')[0].value=parseInt(intrstPayUs234B.value,10);
		var intrstPayable = document.getElementsByName('partBTTI.computationOfTaxLiability.intrstPay.totalIntrstPay')[0]; intrstPayable.value = coalesce(intrstPayable.value);
		intrstPayable.value = Math.round(eval(parseInt(intrstPayUs234A.value ,10) + parseInt(intrstPayUs234B.value ,10) + parseInt(intrstPayUs234C.value ,10)));

		var balTaxPay = document.getElementsByName('partBTTI.computationOfTaxLiability.netTaxLiability')[0]; balTaxPay.value = coalesce(balTaxPay.value);
		var totIntrstPay = document.getElementsByName('partBTTI.computationOfTaxLiability.intrstPay.totalIntrstPay')[0]; totIntrstPay.value = coalesce(totIntrstPay.value);
		var totTaxIntrstPay = document.getElementsByName('partBTTI.computationOfTaxLiability.aggregateTaxInterestLiability')[0]; totTaxIntrstPay.value = coalesce(totTaxIntrstPay.value);

		totTaxIntrstPay.value = eval(balTaxPay.value) + eval(totIntrstPay.value);

		}catch(e){
			alert('Exception in calcInterestPayable() = ' + e.stack);
		}

}

// Check if Marginal Relief Applicable.
function isMarginalRelfApplcbl(){
	var surcharge = document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.surcharge')[0];
	var taxPybl = document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxPayable')[0];
	if(parseInt(surcharge.value) > 0){
		if(parseInt(surcharge.value * 0.15) != taxPybl.value){
			return true;
		}
	}
	return false;
}

//Check if Marginal Relief Applicable.
function isMarginalRelfApplcblCheck(){
	var surcharge = document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.surcharge')[0];
	var taxPybl = document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxPayable')[0];
	if(parseInt(surcharge.value) > 0){
		if(parseInt(surcharge.value ) != parseInt(taxPybl.value* 0.15)){
			return true;
		}
	}
	return false;
}

// Calculate Interest for Section 234C.
function calculate234cIntrst(TDS, TCS, slabs, cgosIncome){
		try{
			var slab0 = parseInt(slabs[0] ,10);
			var slab1 = parseInt(slabs[1] ,10);
			var slab2 = parseInt(slabs[2] ,10);
			var slab3 = parseInt(slabs[3] ,10);
			var slab4 = parseInt(slabs[4] ,10);
		
		var winLottRacePuzz = parseInt(coalesceSetRet('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls[0].sourceAmount'));
		var rebateOnAgriInc = parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnTI.rebateOnAgriInc'), 10);
		var totalCG = 	  parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.stcg.prctg30, 10)))
						+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.stcg.prctgAr, 10)))
						+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.stcg.prctg15.sec111a, 10)))
						+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii, 10)))
						+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.ltcg.prctg20.sec112, 10)))
						+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.ltcg.prctg20.sec11EA, 10)))
						+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.ltcg.prctg10.secProviso, 10)))
						+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2, 10)))
						+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AC_1, 10)))
						+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1, 10)))
						+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AD_3, 10)))
						+ parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115E_b, 10)));
		
		var normalBalIncome = eval(
							parseInt(coalesceSetRet('partBTI.grossTotalIncome')) 
							- totalCG - parseInt(coalesceSetRet('partBTI.incFromOS.incChargeSplRate')) - parseInt(coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.incRecCredPLOthHeads.us115BBF'))
							- parseInt(coalesceSetRet('partBTI.totalDeductionsUnderScheduleVIA'))
                                                        - parseInt(coalesceSetRet('partBTI.deductionsUnder10Aor10AA'))			
							);	
		
		if(parseInt(rebateOnAgriInc, 10) > parseInt('0', 10)){
			normalBalIncome = eval(parseInt(normalBalIncome, 10) 
			+ parseInt(coalesceSetRet('partBTI.netAgricultureIncomeOrOtherIncomeForRate'), 10));
		}
		var normalBalIncIncl44Ad = normalBalIncome;
		var dtaa = document.getElementsByName('scheduleSI.splCodeRateTax[1].splRateIncTax')[0].value;
		var sec44AD = parseInt(document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44AD')[0].value, 10);		
		var sec44ADA = parseInt(document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44ADA')[0].value, 10);		
		var siexmption = getLTCG20ExmpFrmSI();
		var exemption10Pct = eval(siexmption["10"]);
		var exemption15Pct = eval(parseInt(coalesceSetRet('scheduleSI.splCodeRateTax[2].splRateInc')) - parseInt(coalesceSetRet('scheduleSI.splCodeRateTax[2].taxableInc')));
		var exemption20Pct = eval(siexmption["20"]);	
		var exemption30Pct = eval(parseInt(coalesceSetRet('scheduleSI.splCodeRateTax[6].splRateInc')) - parseInt(coalesceSetRet('scheduleSI.splCodeRateTax[6].taxableInc')));		
		var exemptionOth111A = parseInt(getExemption()) -  eval(
								parseInt(exemption10Pct) 
								+ parseInt(exemption15Pct) 
								+ parseInt(exemption20Pct) 
								+ parseInt(exemption30Pct) 
								);			
		//Calculate tax on CG
		var intrstRates = [0.1, 0.2, 0.15,0.3];
		var appRateSurcharge = 1;
		
		
		var totalIncome = coalesceSetRet('partBTI.totalIncome');
		
		var marginal = isMarginalRelfApplcbl();
		
		var totalUpto15Of6 = 0;
		var totalUpto15Of9 = 0;
		var totalUp16Of9To15Of12 = 0;
		var totalUp16Of12To15Of3 = 0;
		var totalUp16Of3To31Of3=0;
		var taxOnWinLottRacePuzz = 0;
		var balTaxPayable = document.getElementsByName('partBTTI.computationOfTaxLiability.netTaxLiability')[0];
		var netTaxLiability = balTaxPayable.value;
		var TaxPayableAftrRebate = document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxPayable')[0].value;
		var othExemptions = 0;
		var siTax=0;
		var marginal1 = isMarginalRelfApplcblCheck();
		
		if(parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnDeemedTI.totalTax'))!=
			parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.grossTaxPayable'))){
			
			siTax = parseInt(coalesceSetRet('scheduleSI.totSplRateIncTax')) - calculatePureSITax()-parseInt(coalesce(dtaa),10);
		
		var incOSSI = parseInt(coalesceSetRet('partBTI.incFromOS.otherSrcThanOwnRaceHorse')) + parseInt(coalesceSetRet('partBTI.incFromOS.incChargeSplRate'));
		var SISurcharge = 0;
		
		var remove115BBE = eval(parseInt(
				coalesceSetRet('scheduleOS.incChargblSplRateOS.115BBE'),
				10));
		
		var totalInc = parseInt(document.getElementsByName('partBTI.totalIncome')[0].value) - remove115BBE;
		
		
		var SurchargeOtherThan44AD = 0;
		//var Taxpayable44AD = 0;
		// 44ADA included
		var Taxpayable44AD_44ADA=0;
		var taxpayableIncSec44 =0;
		var temp44AD_44ADA =0;
		
		if (sec44AD>0 && sec44ADA>0){
			temp44AD_44ADA = sec44AD + sec44ADA;
		}	
			else if (sec44AD>0 && sec44ADA<=0){
				temp44AD_44ADA = sec44AD;
			}
			else if (sec44AD<=0 && sec44ADA>0){
				temp44AD_44ADA = sec44ADA;
			}
			else{
				temp44AD_44ADA=0;	
			}
		
		
		if(temp44AD_44ADA>0 &&((coalesce(parseInt(document.getElementsByName('scheduleVIA.deductUndChapVIA.totalDeductionPartc')[0].value, 10))+
				(coalesce(parseInt(document.getElementsByName('schedule10A.deductSEZ.dedUs10Detail.totalDedUs10Sub')[0].value, 10)))+
				(coalesce(parseInt(document.getElementsByName('schedule10AA.deductSEZ.dedUs10Detail.totalDedUs10Sub')[0].value, 10))) == 0))){
			
			
			taxpayableIncSec44=calculateTaxPayable(normalBalIncome+parseInt(( parseInt(cgosIncome.cgInc.stcg.prctgAr, 10))))+parseInt(document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxAtSpecialRates')[0].value);
			Taxpayable44AD_44ADA=calculateTaxPayable(normalBalIncome+parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.stcg.prctgAr, 10)))-temp44AD_44ADA)+parseInt(document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxAtSpecialRates')[0].value)-(remove115BBE*0.6)-rebateOnAgriInc;
			SurchargeOtherThan44AD=(parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnTI.exceeds1crSurcharge'))*((totalInc-temp44AD_44ADA)/totalInc));
			
			var TaxpayableOnTotalInc=calculateTaxPayable(normalBalIncome+parseInt(zeroOrMore( parseInt(cgosIncome.cgInc.stcg.prctgAr, 10))))+parseInt(document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxAtSpecialRates')[0].value)-rebateOnAgriInc;
			var TaxPayableOnly44AD= eval(parseInt(TaxpayableOnTotalInc)-parseInt(Taxpayable44AD_44ADA)- (remove115BBE*0.6));
			
			var SurchargeOnly44AD=(parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnTI.exceeds1crSurcharge'))-SurchargeOtherThan44AD);
			
			
		}else{
			SurchargeOtherThan44AD=document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.exceeds1crSurcharge')[0].value;
			Taxpayable44AD_44ADA=eval(document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxPayable')[0].value - (remove115BBE*0.6));
			taxpayableIncSec44=document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxPayable')[0].value;
			TaxPayableOnly44AD=0;
			
		}

		if(parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnTI.exceeds1crSurcharge'))>0){
			if(marginal1 ||(temp44AD_44ADA>0&&((coalesce(parseInt(document.getElementsByName('scheduleVIA.deductUndChapVIA.totalDeductionPartc')[0].value, 10))+
					(coalesce(parseInt(document.getElementsByName('schedule10A.deductSEZ.dedUs10Detail.totalDedUs10Sub')[0].value, 10)))+
					(coalesce(parseInt(document.getElementsByName('schedule10AA.deductSEZ.dedUs10Detail.totalDedUs10Sub')[0].value, 10))) == 0)))){
			//SISurcharge= (parseInt(SurchargeOtherThan44AD)*(parseInt(coalesce(siTax/Taxpayable44AD_44ADA))));
				SISurcharge= parseInt((parseInt(SurchargeOtherThan44AD)*(coalesce((siTax-(remove115BBE*0.6))/Taxpayable44AD_44ADA))),10);
			

		}else {
			//SISurcharge=siTax*0.15;
			
			SISurcharge=(siTax -(remove115BBE*0.6)) *0.15;
		}
	}
		
		
		taxOnWinLottRacePuzz = parseInt(winLottRacePuzz) *  intrstRates[3];
		if(temp44AD_44ADA>0 &&((coalesce(parseInt(document.getElementsByName('scheduleVIA.deductUndChapVIA.totalDeductionPartc')[0].value, 10))+
				(coalesce(parseInt(document.getElementsByName('schedule10A.deductSEZ.dedUs10Detail.totalDedUs10Sub')[0].value, 10)))+
				(coalesce(parseInt(document.getElementsByName('schedule10AA.deductSEZ.dedUs10Detail.totalDedUs10Sub')[0].value, 10))) == 0))){
		normalBalIncome = zeroOrMore(normalBalIncome - temp44AD_44ADA);
		}else if(temp44AD_44ADA>0){
			
			temp44AD_44ADA=0;
			
		}
		
	//App Rate
		if(parseInt(normalBalIncome) > parseInt(exemptionOth111A)){
			normalBalIncome = parseInt(normalBalIncome) - parseInt(exemptionOth111A);
			exemptionOth111A = 0;
		}else if(parseInt(normalBalIncome, 0) > 0){
			exemptionOth111A = parseInt(exemptionOth111A) - parseInt(normalBalIncome);
			normalBalIncome = 0;
		}
		
		
		var taxOnstcgOthers0 =     eval(parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.shortTermUnderAppRate.upto15Of6'), 10)  + parseInt(normalBalIncome));
		var taxOnstcgOthers1 =     eval(parseInt(taxOnstcgOthers0) + parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.shortTermUnderAppRate.upto15Of9'), 10) );
		var taxOnstcgOthers2 =     eval(parseInt(taxOnstcgOthers1) + parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.shortTermUnderAppRate.up16Of9To15Of12'), 10) );
		var taxOnstcgOthers3 =     eval(parseInt(taxOnstcgOthers2) + parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.shortTermUnderAppRate.up16Of12To15Of3'), 10) + parseInt(temp44AD_44ADA));
		var taxOnstcgOthers4 =     eval(parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.shortTermUnderAppRate.up16Of3To31Of3'), 10)   + parseInt(taxOnstcgOthers3, 10) );
		
		

		var shortTermUnder30Per0 = eval(parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.shortTermUnder30Per.upto15Of6'), 10) );
		var shortTermUnder30Per1 = eval(parseInt(shortTermUnder30Per0) + parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.shortTermUnder30Per.upto15Of9'), 10) );
		var shortTermUnder30Per2 = eval(parseInt(shortTermUnder30Per1) + parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.shortTermUnder30Per.up16Of9To15Of12'), 10) );
		var shortTermUnder30Per3 = eval(parseInt(shortTermUnder30Per2) + parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.shortTermUnder30Per.up16Of12To15Of3'), 10) );
		var shortTermUnder30Per4 = eval(parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.shortTermUnder30Per.up16Of3To31Of3'), 10) );
		
						
		var taxOnltcgNonProviso0 = eval(parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.longTermUnder20Per.upto15Of6'), 10) );
		var taxOnltcgNonProviso1 = eval(parseInt(taxOnltcgNonProviso0) + parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.longTermUnder20Per.upto15Of9'), 10) );
		var taxOnltcgNonProviso2 = eval(parseInt(taxOnltcgNonProviso1) + parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.longTermUnder20Per.up16Of9To15Of12'), 10) );
		var taxOnltcgNonProviso3 = eval(parseInt(taxOnltcgNonProviso2) + parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.longTermUnder20Per.up16Of12To15Of3'), 10) );
		var taxOnltcgNonProviso4 = eval(parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.longTermUnder20Per.up16Of3To31Of3'), 10) );
		
		
		var taxOnstcg111A0 =       eval(parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.shortTermUnder15Per.upto15Of6'), 10)  );
		var taxOnstcg111A1 =       eval(parseInt(taxOnstcg111A0) + parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.shortTermUnder15Per.upto15Of9'), 10) );
		var taxOnstcg111A2 =       eval(parseInt(taxOnstcg111A1) + parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.shortTermUnder15Per.up16Of9To15Of12'), 10) );
		var taxOnstcg111A3 =       eval(parseInt(taxOnstcg111A2) + parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.shortTermUnder15Per.up16Of12To15Of3'), 10) );
		var taxOnstcg111A4 =       eval(parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.shortTermUnder15Per.up16Of3To31Of3'), 10) );
		
			
		//10%
		var taxOnltcgProviso0 =    eval(parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.longTermUnder10Per.upto15Of6'), 10) );
		var taxOnltcgProviso1 =    eval(parseInt(taxOnltcgProviso0) + parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.longTermUnder10Per.upto15Of9'), 10) );
		var taxOnltcgProviso2 =    eval(parseInt(taxOnltcgProviso1) + parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.longTermUnder10Per.up16Of9To15Of12'), 10) );
		var taxOnltcgProviso3 =    eval(parseInt(taxOnltcgProviso2) + parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.longTermUnder10Per.up16Of12To15Of3'), 10) );
		var taxOnltcgProviso4 =    eval( parseInt(coalesceSetRet('scheduleCGPost45.accruOrRecOfCG.longTermUnder10Per.up16Of3To31Of3'), 10) );
		

		var temp = applyExemption2017([taxOnltcgProviso0,taxOnltcgProviso1,taxOnltcgProviso2,taxOnltcgProviso3,taxOnltcgProviso4], exemption10Pct);
		taxOnltcgProviso0=temp[0],taxOnltcgProviso1 = temp[1],taxOnltcgProviso2 = temp[2],taxOnltcgProviso3 = temp[3],taxOnltcgProviso4 = temp[4];
		taxOnltcgProviso0 *= intrstRates[0],taxOnltcgProviso1 *= intrstRates[0],taxOnltcgProviso2*= intrstRates[0],taxOnltcgProviso3 *= intrstRates[0],taxOnltcgProviso4 *= intrstRates[0];
		
		temp = applyExemption2017([shortTermUnder30Per0,shortTermUnder30Per1,shortTermUnder30Per2,shortTermUnder30Per3,shortTermUnder30Per4], exemption30Pct);
		shortTermUnder30Per0=temp[0],shortTermUnder30Per1=temp[1], shortTermUnder30Per2=temp[2], shortTermUnder30Per3=temp[3], shortTermUnder30Per4=temp[4];
		shortTermUnder30Per0 *= intrstRates[3],shortTermUnder30Per1 *= intrstRates[3],shortTermUnder30Per2 *= intrstRates[3],shortTermUnder30Per3 *= intrstRates[3],shortTermUnder30Per4 *= intrstRates[3];
				
		
		temp = applyExemption2017([taxOnltcgNonProviso0,taxOnltcgNonProviso1,taxOnltcgNonProviso2,taxOnltcgNonProviso3,taxOnltcgNonProviso4], exemption20Pct);
		taxOnltcgNonProviso0=temp[0],taxOnltcgNonProviso1=temp[1],taxOnltcgNonProviso2=temp[2],taxOnltcgNonProviso3=temp[3],taxOnltcgNonProviso4=temp[4];
		taxOnltcgNonProviso0 *= intrstRates[1],taxOnltcgNonProviso1 *= intrstRates[1],taxOnltcgNonProviso2 *= intrstRates[1],taxOnltcgNonProviso3 *= intrstRates[1],taxOnltcgNonProviso4 *= intrstRates[1];

		
		temp = applyExemption2017([taxOnstcg111A0,taxOnstcg111A1,taxOnstcg111A2,taxOnstcg111A3,taxOnstcg111A4], exemption15Pct);
		taxOnstcg111A0=temp[0],taxOnstcg111A1=temp[1],taxOnstcg111A2=temp[2],taxOnstcg111A3=temp[3],taxOnstcg111A4=temp[4];
		taxOnstcg111A0 *= intrstRates[2],taxOnstcg111A1 *= intrstRates[2],taxOnstcg111A2 *= intrstRates[2],taxOnstcg111A3 *= intrstRates[2],taxOnstcg111A4 *= intrstRates[2];
		
		
		
		temp = applyExemption2017([taxOnstcgOthers0,taxOnstcgOthers1,taxOnstcgOthers2,taxOnstcgOthers3,taxOnstcgOthers4], exemptionOth111A, true);
		taxOnstcgOthers0=temp[0],taxOnstcgOthers1=temp[1],taxOnstcgOthers2=temp[2],taxOnstcgOthers3=temp[3],taxOnstcgOthers4=temp[4];
		
		
		var surcharge;
		surcharge = parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnTI.exceeds1crSurcharge')) ;
		
		var dtaa = document.getElementsByName('scheduleSI.splCodeRateTax[1].splRateIncTax')[0].value;

		
		if(totalCG>0){
			taxOnstcgOthers0 = ((calculateSlabbedTax(taxOnstcgOthers0)  + parseInt(coalesce(dtaa))) * appRateSurcharge ) ;
			taxOnstcgOthers1 = ((calculateSlabbedTax(taxOnstcgOthers1)  + parseInt(coalesce(dtaa))) * appRateSurcharge ) ;
			taxOnstcgOthers2 = ((calculateSlabbedTax(taxOnstcgOthers2)  + parseInt(coalesce(dtaa))) * appRateSurcharge ) ;
			taxOnstcgOthers3 = calculateSlabbedTax(taxOnstcgOthers3);
			if ((calculateSlabbedTax(taxOnstcgOthers4) - parseInt(taxOnstcgOthers3)- parseInt(coalesce(dtaa))) > 0) {
			taxOnstcgOthers4 = ((zeroOrMore(calculateSlabbedTax(taxOnstcgOthers4) - parseInt(taxOnstcgOthers3) - parseInt(coalesce(dtaa)))))  ;
			} else{
			taxOnstcgOthers4 = 0;
			}
			taxOnstcgOthers3 = ((taxOnstcgOthers3   + parseInt(coalesce(dtaa))) * appRateSurcharge);
		}else{
			taxOnstcgOthers0 = (calculateSlabbedTax(taxOnstcgOthers0) + parseInt(coalesce(dtaa)))  ;
			taxOnstcgOthers1 = (calculateSlabbedTax(taxOnstcgOthers1)  + parseInt(coalesce(dtaa)))  ;
			taxOnstcgOthers2 = (calculateSlabbedTax(taxOnstcgOthers2) + parseInt(coalesce(dtaa)) );
			taxOnstcgOthers3 = calculateSlabbedTax(taxOnstcgOthers3);
			if ((calculateSlabbedTax(taxOnstcgOthers4) - parseInt(taxOnstcgOthers3) - parseInt(coalesce(dtaa))) > 0) {
			taxOnstcgOthers4 = (zeroOrMore(calculateSlabbedTax(taxOnstcgOthers4) - parseInt(taxOnstcgOthers3)  - parseInt(coalesce(dtaa))))  ;
			} else{
			taxOnstcgOthers4 = 0;
			}
			taxOnstcgOthers3 = (taxOnstcgOthers3   + parseInt(coalesce(dtaa)) ) ;
		}
		
		
		// siTax= (siTax-(remove115BBE*0.6));
		// siTax = (siTax+SISurcharge);
		
		totalUpto15Of6 = taxOnltcgProviso0 + taxOnltcgNonProviso0 + taxOnstcg111A0 + taxOnstcgOthers0 + shortTermUnder30Per0 +siTax;
		totalUpto15Of9 = taxOnltcgProviso1 + taxOnltcgNonProviso1 + taxOnstcg111A1 + taxOnstcgOthers1 + shortTermUnder30Per1 + siTax;
		 totalUp16Of9To15Of12 = taxOnltcgProviso2 + taxOnltcgNonProviso2 + taxOnstcg111A2 + taxOnstcgOthers2 + shortTermUnder30Per2 + siTax;
		 totalUp16Of12To15Of3 = taxOnltcgProviso3 + taxOnltcgNonProviso3 + taxOnstcg111A3 + taxOnstcgOthers3 + shortTermUnder30Per3 + siTax;
		 totalUp16Of3To31Of3 = taxOnltcgProviso4 + taxOnltcgNonProviso4 + taxOnstcg111A4 + taxOnstcgOthers4 + shortTermUnder30Per4 ;
		 

		 var rebate87A = document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.rebate87A')[0].value;
			
			
			//for checking rebate
			
			var oldTotalUpto15Of6 = totalUpto15Of6;
			var oldTotalUp16Of6To15Of9 = totalUpto15Of9;
			var oldTotalUp16Of9To15Of12 = totalUp16Of9To15Of12;
			var oldTotalUp16Of12To15Of3 = totalUp16Of12To15Of3;
			var oldTotalUp16Of3To31Of3 =totalUp16Of3To31Of3;
			var avaTdsTcs =0;
		 
		 totalUpto15Of6= zeroOrMore(eval(parseInt(totalUpto15Of6)- parseInt(rebate87A)));
		 totalUpto15Of9= zeroOrMore(eval(parseInt(totalUpto15Of9)- parseInt(rebate87A)));
		 totalUp16Of9To15Of12= zeroOrMore(eval(parseInt(totalUp16Of9To15Of12)- parseInt(rebate87A)));
		 totalUp16Of12To15Of3= zeroOrMore(eval(parseInt(totalUp16Of12To15Of3)- parseInt(rebate87A)));
					
		 var avaRebate =parseInt(rebate87A) - Math.min(parseInt(rebate87A), parseInt(oldTotalUp16Of12To15Of3));
			
			totalUp16Of3To31Of3 = zeroOrMore(eval(parseInt(totalUp16Of3To31Of3)- parseInt(avaRebate)));
			
			
			
			//for checking Agriculture rebate
			
			var oldTotalUpto15Of6 = totalUpto15Of6;
			var oldTotalUp16Of6To15Of9 = totalUpto15Of9;
			var oldTotalUp16Of9To15Of12 = totalUp16Of9To15Of12;
			var oldTotalUp16Of12To15Of3 = totalUp16Of12To15Of3;
			
		 
			
		 totalUpto15Of6= zeroOrMore(eval(parseInt(totalUpto15Of6)- parseInt(rebateOnAgriInc)));
		 totalUpto15Of9= zeroOrMore(eval(parseInt(totalUpto15Of9)- parseInt(rebateOnAgriInc)));
		 totalUp16Of9To15Of12= zeroOrMore(eval(parseInt(totalUp16Of9To15Of12)- parseInt(rebateOnAgriInc)));
		 totalUp16Of12To15Of3= zeroOrMore(eval(parseInt(totalUp16Of12To15Of3)- parseInt(rebateOnAgriInc)));
					
		 var avaRebate =parseInt(rebateOnAgriInc) - Math.min(parseInt(rebateOnAgriInc), parseInt(oldTotalUp16Of12To15Of3));
			
			totalUp16Of3To31Of3 = zeroOrMore(eval(parseInt(totalUp16Of3To31Of3)- parseInt(avaRebate)));
			
		 
		 var totalUpto15Of6Act = zeroOrMore(eval(parseInt(totalUpto15Of6)
					- parseInt(remove115BBE)*0.6));
		var	totalUpto15Of9Act = zeroOrMore(eval(parseInt(totalUpto15Of9) - parseInt(remove115BBE)*0.6));
		var	totalUp16Of9To15Of12Act = zeroOrMore(eval(parseInt(totalUp16Of9To15Of12) - parseInt(remove115BBE)*0.6));
		var	totalUp16Of12To15Of3Act = zeroOrMore(eval(parseInt(totalUp16Of12To15Of3)- parseInt(remove115BBE)*0.6));

			var actualTax = [ (totalUpto15Of6Act),
					(totalUpto15Of9Act - totalUpto15Of6Act),
					(totalUp16Of9To15Of12Act - totalUpto15Of9Act),
					(totalUp16Of12To15Of3Act - totalUp16Of9To15Of12Act),
					(totalUp16Of3To31Of3) ];
		 
		// var actualTax = [(totalUpto15Of6),(totalUpto15Of9 - totalUpto15Of6),(totalUp16Of9To15Of12 - totalUpto15Of9),(totalUp16Of12To15Of3- totalUp16Of9To15Of12),(totalUp16Of3To31Of3)];
	
		 
		 var surcharge115BBE= document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.25perSurcharge')[0].value;
		 
		 if(marginal1 ||(temp44AD_44ADA>0&&((coalesce(parseInt(document.getElementsByName('scheduleVIA.deductUndChapVIA.totalDeductionPartc')[0].value, 10))+
					(coalesce(parseInt(document.getElementsByName('schedule10A.deductSEZ.dedUs10Detail.totalDedUs10Sub')[0].value, 10)))+
					(coalesce(parseInt(document.getElementsByName('schedule10AA.deductSEZ.dedUs10Detail.totalDedUs10Sub')[0].value, 10))) == 0)))){
			
			
			 
			 totalUpto15Of6 = (parseInt(totalUpto15Of6) +parseInt(surcharge115BBE)+ parseInt(coalesce(parseInt(SurchargeOtherThan44AD) * coalesce(actualTax[0]/Taxpayable44AD_44ADA)))) * 1.03;
			 totalUpto15Of9 = parseInt(totalUpto15Of6) + (parseInt(actualTax[1]) + parseInt(coalesce(parseInt(SurchargeOtherThan44AD) * coalesce(actualTax[1]/Taxpayable44AD_44ADA)))) * 1.03;
			 totalUp16Of9To15Of12 = parseInt(totalUpto15Of9) + (parseInt(actualTax[2]) + parseInt(coalesce(parseInt(SurchargeOtherThan44AD) * coalesce(actualTax[2]/Taxpayable44AD_44ADA)))) * 1.03;
			 
			 
			
									
			/* totalUp16Of12To15Of3 = (parseInt(coalesce(totalUp16Of9To15Of12), 10)+(parseInt(coalesce(actualTax[3]), 10)+
						parseInt(coalesce(SurchargeOnly44AD), 10) +	(parseInt(coalesce(SurchargeOtherThan44AD), 10) *
								(parseInt(coalesce( (zeroOrMore(eval( (parseInt(coalesce(actualTax[3]), 10) - parseInt(coalesce(TaxPayableOnly44AD), 10)))))/(parseInt(coalesce(Taxpayable44AD_44ADA), 10)) ),10))))* 1.03);
			 
			 */
			 totalUp16Of12To15Of3 = (parseInt(coalesce(totalUp16Of9To15Of12), 10)+(parseInt(coalesce(actualTax[3]), 10)+
						parseInt(coalesce(SurchargeOnly44AD), 10) +	(parseInt(coalesce(SurchargeOtherThan44AD), 10) *
								((parseInt(coalesce(actualTax[3]), 10)-parseInt(coalesce(TaxPayableOnly44AD), 10))/
										parseInt(coalesce(Taxpayable44AD_44ADA), 10))))* 1.03); // old working changes
			
			if (parseInt(coalesce(Taxpayable44AD_44ADA), 10) == 0)
				{
				totalUp16Of12To15Of3 = (parseInt(coalesce(totalUp16Of9To15Of12), 10)+(parseInt(coalesce(actualTax[3]), 10)+ parseInt(coalesce(SurchargeOnly44AD), 10) )* 1.03);
				}
			
			//totalUp16Of12To15Of3 = parseInt(totalUp16Of9To15Of12) +(parseInt(actualTax[3])+ parseInt(SurchargeOnly44AD)+(parseInt(coalesce( parseInt(SurchargeOtherThan44AD) * parseInt(coalesce((actualTax[3]-TaxPayableOnly44AD)/Taxpayable44AD_44ADA),10))))) * 1.03;
			 
			
			totalUp16Of3To31Of3 = (parseInt(actualTax[4]) + parseInt(coalesce( parseInt(SurchargeOtherThan44AD) * actualTax[4]/Taxpayable44AD_44ADA))) * 1.03;
			 
			 
			}else{
			if(SurchargeOtherThan44AD>0){
			 totalUpto15Of6 =parseInt( (parseInt(totalUpto15Of6)+ parseInt(surcharge115BBE) + parseInt(actualTax[0])*0.15) * 1.03);
			 totalUpto15Of9 = parseInt(totalUpto15Of6) + (parseInt(actualTax[1]) + actualTax[1]*0.15) * 1.03;
			 totalUp16Of9To15Of12 = parseInt(totalUpto15Of9) + (parseInt(actualTax[2]) + actualTax[2]*0.15) * 1.03;
			 totalUp16Of12To15Of3 = parseInt(totalUp16Of9To15Of12) + (parseInt(actualTax[3]) + actualTax[3]*0.15) * 1.03;
			 totalUp16Of3To31Of3 = (parseInt(actualTax[4]) + actualTax[4]*0.15) * 1.03;
			}
			else{
			totalUpto15Of6 = parseInt((parseInt(totalUpto15Of6)+ parseInt(surcharge115BBE) ) * 1.03);
			totalUpto15Of9 = parseInt(totalUpto15Of6) + (parseInt(actualTax[1]) ) * 1.03;
			 totalUp16Of9To15Of12 = parseInt(totalUpto15Of9) + (parseInt(actualTax[2]) ) * 1.03;
			 totalUp16Of12To15Of3 = parseInt(totalUp16Of9To15Of12) + (parseInt(actualTax[3])) * 1.03;
			 totalUp16Of3To31Of3 = (parseInt(actualTax[4]) ) * 1.03;
			}
			}
		 
			netTaxLiability = 0;

		othExemptions = eval(
			//parseInt(rebateOnAgriInc, 10) * 1.03 +
			parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxRelief.totTaxRelief'), 10)
		+ parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.creditUS115JD'), 10)
		);
		
		}else{
			taxOnWinLottRacePuzz = 0;
			totSplRateIncTax = 0;
			othExemptions = 0;
		}
		
		var intrst234C0 = parseInt('0' ,10);
		var intrst234Ci = parseInt('0' ,10);
		var intrst234Cii = parseInt('0' ,10);
		var intrst234Ciii = parseInt('0' ,10);
		var intrst234Civ = parseInt('0' ,10);
		
		var tempintrstBeforeSlab0 = parseInt('0' ,10);
		var tempintrstBeforeSlab1 = parseInt('0' ,10);
		var tempintrstBeforeSlab2 = parseInt('0' ,10);
		var tempintrstBeforeSlab3 = parseInt('0' ,10);
		var totSlab = parseInt('0' ,10);
		
		
		if(( eval(parseInt(balTaxPayable.value ,10) - parseInt(TDS ,10) - parseInt(TCS ,10)) >=  parseInt('10000',10))){
			
			var totSplRateIncTax = 0;
			if(parseInt(slab0 ,10) < eval((parseInt(netTaxLiability, 10)  + parseInt(totSplRateIncTax ,10) + totalUpto15Of6  - parseInt(othExemptions)  - parseInt(TDS ,10) - parseInt(TCS ,10)) * parseFloat('0.12'))){
				tempintrstBeforeSlab0 = (parseInt(netTaxLiability, 10) + parseInt(totSplRateIncTax ,10) + totalUpto15Of6   - parseInt(othExemptions) - parseInt(TDS ,10) - parseInt(TCS ,10)  * parseFloat('0.15'));
				
				var tempintrst234C0 = (((parseInt(netTaxLiability, 10) + parseInt(totSplRateIncTax ,10) + totalUpto15Of6   - parseInt(othExemptions) - parseInt(TDS ,10) - parseInt(TCS ,10)) * parseFloat('0.15'))  - parseInt(slab0 ,10));
				if(parseInt(tempintrst234C0,10) > 100){
					tempintrst234C0= Math.floor(parseInt(tempintrst234C0,10)/100)*parseInt('100' ,10);
				}
				intrst234C0=parseInt(tempintrst234C0,10)* parseFloat('0.01') * parseInt('3' ,10);
				
			}
			if(eval(parseInt(slab0 ,10) + parseInt(slab1 ,10)) < eval((parseInt(netTaxLiability, 10)  + parseInt(totSplRateIncTax ,10)+ totalUpto15Of9  - parseInt(othExemptions) -  parseInt(TDS ,10) - parseInt(TCS ,10)) * parseFloat('0.36'))){
				tempintrstBeforeSlab1 = ((parseInt(netTaxLiability, 10)  + parseInt(totSplRateIncTax ,10)+ totalUpto15Of9  - parseInt(othExemptions) - parseInt(TDS ,10) - parseInt(TCS ,10))* parseFloat('0.45')) ;
				var tempintrst234Ci = (((parseInt(netTaxLiability, 10)  + parseInt(totSplRateIncTax ,10) + totalUpto15Of9  - parseInt(othExemptions) - parseInt(TDS ,10) - parseInt(TCS ,10)) * parseFloat('0.45'))  - parseInt(slab0 ,10) - parseInt(slab1 ,10));
				if(parseInt(tempintrst234Ci,10) > 100){
					tempintrst234Ci= Math.floor(parseInt(tempintrst234Ci,10)/100)*parseInt('100' ,10);
				}
				intrst234Ci=parseInt(tempintrst234Ci,10)* parseFloat('0.01') * parseInt('3' ,10);
			}

			if(eval(parseInt(slab0 ,10) + parseInt(slab1 ,10) + parseInt(slab2 ,10)) < eval((parseInt(netTaxLiability, 10)  + parseInt(totSplRateIncTax ,10) + totalUp16Of9To15Of12  - parseInt(othExemptions) -  parseInt(TDS ,10) - parseInt(TCS ,10)) * parseFloat('0.75') )){
				tempintrstBeforeSlab2 =((parseInt(netTaxLiability, 10) + parseInt(totSplRateIncTax ,10) + totalUp16Of9To15Of12 - parseInt(othExemptions) - parseInt(TDS ,10) - parseInt(TCS ,10)) * parseFloat('0.75')) ;				
				var tempintrst234Cii = (((parseInt(netTaxLiability, 10) + parseInt(totSplRateIncTax ,10) + totalUp16Of9To15Of12  - parseInt(othExemptions) - parseInt(TDS ,10) - parseInt(TCS ,10)) * parseFloat('0.75') )  - parseInt(slab0 ,10) -parseInt(slab1 ,10) - parseInt(slab2 ,10) );
				if(parseInt(tempintrst234Cii,10) > 100){
					tempintrst234Cii= Math.floor(parseInt(tempintrst234Cii,10)/100)*parseInt('100' ,10);
				}
				intrst234Cii=parseInt(tempintrst234Cii,10)* parseFloat('0.01') * parseInt('3' ,10) ;
			}
			

			var tempintrstForAdvTax = zeroOrMore((parseInt(netTaxLiability, 10)  + parseInt(totSplRateIncTax ,10)  + totalUp16Of12To15Of3  - parseInt(othExemptions)  - parseInt(TDS ,10) - parseInt(TCS ,10)) * parseFloat('1'));
			
			if(eval(parseInt(slab0 ,10) + parseInt(slab1 ,10) + parseInt(slab2 ,10) + parseInt(slab3 ,10)) < eval((parseInt(netTaxLiability, 10)  + parseInt(totSplRateIncTax ,10) + totalUp16Of12To15Of3 - parseInt(othExemptions) -  parseInt(TDS ,10) - parseInt(TCS ,10)) * parseFloat('1' ,10))){
				
				tempintrstBeforeSlab3 = ((parseInt(netTaxLiability, 10)  + parseInt(totSplRateIncTax ,10)  + totalUp16Of12To15Of3 - parseInt(othExemptions)  - parseInt(TDS ,10) - parseInt(TCS ,10)) * parseFloat('1'));
				
				var tempintrst234Ciii = zeroOrMore(((parseInt(netTaxLiability, 10)  + parseInt(totSplRateIncTax ,10)  + totalUp16Of12To15Of3 - parseInt(othExemptions)  - parseInt(TDS ,10) - parseInt(TCS ,10)) * parseFloat('1')) - parseInt(slab0 ,10)- parseInt(slab1 ,10)- parseInt(slab2 ,10) - parseInt(slab3 ,10) );
				
				if(parseInt(tempintrst234Ciii,10) > 100){
					tempintrst234Ciii= Math.floor(parseInt(tempintrst234Ciii,10)/100)*parseInt('100' ,10);
				}
				intrst234Ciii=parseInt(tempintrst234Ciii,10)* parseFloat('0.01') * parseInt('1' ,10) ;
			}
			
			totSlab =  parseInt(slab0 ,10) + parseInt(slab1 ,10) + parseInt(slab2 ,10) + parseInt(slab3 ,10);
			
			var usedTdsTcs = parseInt(TDS, 10) + parseInt( TCS, 10) + parseInt(othExemptions) ;
			
			avaTdsTcs = parseInt(usedTdsTcs) - Math.min(parseInt(usedTdsTcs), parseInt(totalUp16Of12To15Of3));
			
			totalUp16Of3To31Of3 =zeroOrMore(eval( totalUp16Of3To31Of3 - parseInt(avaTdsTcs, 10)));
			
			//////////////////////////////////////////////
			if( parseInt(tempintrstBeforeSlab3,10) == 0){
				var avalSlab = parseInt(totSlab) - Math.min(parseInt(totSlab), parseInt(tempintrstForAdvTax));
			}
			
			else {
			//var 
			avalSlab = parseInt(totSlab) - Math.min(parseInt(totSlab), parseInt(tempintrstBeforeSlab3));
			}
			///////////////////////////////
														
			if(eval( parseInt(slab4 ,10)) < totalUp16Of3To31Of3){
				var tempintrst234Civ =zeroOrMore(totalUp16Of3To31Of3 -  parseInt(slab4 ,10) -  parseInt(avalSlab ,10));
				if(parseInt(tempintrst234Civ,10) > 100){
					tempintrst234Civ= Math.floor(parseInt(tempintrst234Civ,10)/100)*parseInt('100' ,10);
				}
				intrst234Civ=parseInt(tempintrst234Civ,10)* parseFloat('0.01') * parseInt('1' ,10) ;
			}
		}
		else {
			 intrst234C0 = parseInt('0',10);
			 intrst234Ci = parseInt('0',10);
			 intrst234Cii = parseInt('0',10);
			 intrst234Ciii = parseInt('0',10);
			 intrst234Civ = parseInt('0',10);
		}

		intrst234C = eval(parseInt(intrst234C0 ,10)  + parseInt(intrst234Ci ,10) + parseInt(intrst234Cii ,10) + parseInt(intrst234Ciii ,10) + parseInt(intrst234Civ ,10));
		
		
		if((temp44AD_44ADA>0 &&((coalesce(parseInt(document.getElementsByName('scheduleVIA.deductUndChapVIA.totalDeductionPartc')[0].value, 10))+
				(coalesce(parseInt(document.getElementsByName('schedule10A.deductSEZ.dedUs10Detail.totalDedUs10Sub')[0].value, 10)))+
				(coalesce(parseInt(document.getElementsByName('schedule10AA.deductSEZ.dedUs10Detail.totalDedUs10Sub')[0].value, 10))) == 0))) && ((parseInt((taxpayableIncSec44-othExemptions-rebate87A)*1.03)- parseInt(TDS ,10) - parseInt(TCS ,10))  <  parseInt('10000',10))){
				
			intrst234C = parseInt('0',10);
		} 
		}
		catch(e){
			alert('Error in calculate234cIntrst: ' + e.stack);
		}
		
		return intrst234C;

}

// Calculate Tax Based on Slab-Rates.
function calculateSlabbedTax(netTxblIncome, dontAddExemption){
	var incTax = 0;
	if(!dontAddExemption){
	netTxblIncome = parseInt(netTxblIncome) + getExemption();
	}
	var age = calcAge();
	var resStatus=document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0].value;
	var status=document.getElementsByName('partAGEN1.personalInfo.status')[0].value; 
	
	if( status == 'I' && (resStatus=='RES' || resStatus =='NOR') && parseInt(age, 10) > 59 && parseInt(age, 10) < 80 ){
		if(parseInt(netTxblIncome,10) >= parseInt('0',10) && parseInt(netTxblIncome,10) <= parseInt('300000',10)){
			incTax = parseInt('0',10);
		}else if(parseInt(netTxblIncome,10) >= parseInt('300001',10) && parseInt(netTxblIncome,10) <= parseInt('500000',10)){
			incTax = Math.round(eval( eval(parseInt(netTxblIncome,10) - parseInt('300000',10) )  * parseFloat('0.1'))) ;
		}else if(parseInt(netTxblIncome,10) >= parseInt('500001',10) && parseInt(netTxblIncome,10) <= parseInt('1000000',10)){
			incTax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('500000',10) )* parseFloat('0.2')) + parseInt('20000',10)));
		}else if(parseInt(netTxblIncome,10) >= parseInt('1000001',10)){
			incTax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('1000000',10) )* parseFloat('0.3')) + parseInt('120000',10)));
		}
	}
	else if( status == 'I' && (resStatus=='RES' || resStatus =='NOR') && parseInt(age, 10) >= 80 ){
		if(parseInt(netTxblIncome,10) >= parseInt('0',10) && parseInt(netTxblIncome,10) <= parseInt('500000',10)){
			incTax = parseInt('0',10);
		}else if(parseInt(netTxblIncome,10) >= parseInt('500001',10) && parseInt(netTxblIncome,10) <= parseInt('1000000',10)){
			incTax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('500000',10) )* parseFloat('0.2'))));
		}else if(parseInt(netTxblIncome,10) >= parseInt('1000001',10)){
			incTax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('1000000',10) )* parseFloat('0.3')) + parseInt('100000',10)));
		}
	}else{
		if(parseInt(netTxblIncome,10) >= parseInt('0',10) && parseInt(netTxblIncome,10) <= parseInt('250000',10)){
			incTax = parseInt('0',10);
		}else if(parseInt(netTxblIncome,10) >= parseInt('250001',10) && parseInt(netTxblIncome,10) <= parseInt('500000',10)){
			incTax = Math.round(eval( eval(parseInt(netTxblIncome,10) - parseInt('250000',10) )  * parseFloat('0.1'))) ;
		}else if(parseInt(netTxblIncome,10) >= parseInt('500001',10) && parseInt(netTxblIncome,10) <= parseInt('1000000',10)){
			incTax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('500000',10) )* parseFloat('0.2')) + parseInt('25000',10)));
		}else if(parseInt(netTxblIncome,10) >= parseInt('1000001',10)){
			incTax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('1000000',10) )* parseFloat('0.3')) + parseInt('125000',10)));
		}
	}
	return incTax;
}

// Apply Exemption.
function applyExemption(original, exemption, appRate){
		var remaining = exemption;
		var nonZero = 0;
		for(var i=original.length-1;i>=0;i--){
			if(i>0 && (i<original.length-1 || (appRate && i<original.length))){
				original[i] = original[i]-original[i-1];
			}
			if(original[i]!=0){
				nonZero++;
			}
		}
		if(nonZero==0 ){
			return original;
		}
		var total = 0;
		for(var i=0;i<original.length;i++){
			if(parseInt(original[i], 10)>parseInt(0, 10)){
				var part = remaining / nonZero--;
				if(parseInt(original[i]) > parseInt(part)){
					remaining = remaining - part;
					original[i] = original[i] - part;
				}else{
					remaining = remaining - original[i];
					original[i] = 0;
				}
			}
			if(i>0 && (i<original.length-1 || (appRate && i<original.length))){
				original[i] = original[i] + original[i-1];
			}
			total = eval(parseInt(total, 10) + parseInt(original[i]));
		}
		if(parseInt(remaining,10) > parseInt(0, 10) && total > parseInt(0,10)){
			original = applyExemption(original, remaining);
		}
		
	return original;
}
	
// Round-Off value to Nearest Tens.
function rndOffNrsTen(newVar){

    if(  parseInt(newVar.toString().charAt(newVar.toString().length-1),10) >= parseInt('5',10)){
            newVar = eval(Math.floor(eval(parseInt(newVar,10) / parseInt('10',10))) * parseInt('10',10));
            newVar = eval(parseInt(newVar,10) + parseInt('10',10));

            return newVar;
    }else{
            newVar = eval(Math.floor(eval(parseInt(newVar,10) / parseInt('10',10))) * parseInt('10',10));

            return newVar;
    }

}	
	
// Calcualte Income for PartB-TTI.
function calculatePartBTTI_second(cgosIncome){
	try{
	//6
	document.getElementsByName('partBTTI.computationOfTaxLiability.creditUS115JD')[0].value = 0;
	
	surcharge201718();
	
	if(parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.grossTaxLiability'),10) > parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnDeemedTI.totalTax'),10)){
		document.getElementsByName('partBTTI.computationOfTaxLiability.creditUS115JD')[0].value = eval(
			parseInt(coalesceSetRet('itrScheduleAMTC.taxSection115JD'),10)
			);
	}
	//7
	document.getElementsByName('partBTTI.computationOfTaxLiability.taxPaidUnderCredit')[0].value = eval(
		parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.grossTaxPayable'),10)
		- parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.creditUS115JD'),10)
		);

	//8
	document.getElementsByName('partBTTI.computationOfTaxLiability.taxRelief.section90')[0].value = eval(
	parseInt(coalesceSetRet('scheduleTR1.totalIncomeOutIndia'),10)
		);
	document.getElementsByName('partBTTI.computationOfTaxLiability.taxRelief.section91')[0].value = eval(
		parseInt(coalesceSetRet('scheduleTR1.totalIncomeOutIndiaDTAA'),10)
		);
	document.getElementsByName('partBTTI.computationOfTaxLiability.taxRelief.totTaxRelief')[0].value = eval(
		parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxRelief.section89'),10)
		+ parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxRelief.section90'),10)
		+ parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxRelief.section91'),10)
		);
	//9
	document.getElementsByName('partBTTI.computationOfTaxLiability.netTaxLiability')[0].value = zeroOrMore(eval(
		parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPaidUnderCredit'),10)
		- parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxRelief.totTaxRelief'),10)
		));
	//10
	calculateAdvancedTax();
	calculateTCS();
	calculateTDS();
	calcInterestPayable(cgosIncome);
	
	//12
	document.getElementsByName('partBTTI.taxPaid.taxesPaid.totalTaxesPaid')[0].value = eval(
		parseInt(coalesceSetRet('partBTTI.taxPaid.taxesPaid.advanceTax'),10)
		+ parseInt(coalesceSetRet('partBTTI.taxPaid.taxesPaid.selfAssessmentTax'),10)
		+ parseInt(coalesceSetRet('partBTTI.taxPaid.taxesPaid.tds'),10)
		+ parseInt(coalesceSetRet('partBTTI.taxPaid.taxesPaid.tcs'),10)
		);

	//13
	document.getElementsByName('partBTTI.taxPaid.balTaxPayable')[0].value = rndOffNrsTen(zeroOrMore(eval(
		parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.aggregateTaxInterestLiability'),10)
		- parseInt(coalesceSetRet('partBTTI.taxPaid.taxesPaid.totalTaxesPaid'),10)
		)).toString());
	
	//14
	document.getElementsByName('partBTTI.refundsDue')[0].value = rndOffNrsTen(zeroOrMore(eval(
		parseInt(coalesceSetRet('partBTTI.taxPaid.taxesPaid.totalTaxesPaid'),10)
		- parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.aggregateTaxInterestLiability'),10)
		)).toString());
		
	if(document.getElementsByName('partBTTI.taxPaid.balTaxPayable')[0].value > 0){
		document.getElementsByName('partAGEN1.filingStatus.taxStatus')[0].value = 'TP';
	}else if(document.getElementsByName('partBTTI.refundsDue')[0].value > 0){
		document.getElementsByName('partAGEN1.filingStatus.taxStatus')[0].value = 'TR';
	}else{
		document.getElementsByName('partAGEN1.filingStatus.taxStatus')[0].value = 'NT';
	}
	
	showEpay();
		
	}catch(e){
		alert(e.stack);
	}
}

// Validate Section 89.
function validateSection89(){

	var sec89 = coalesceSetRet('partBTTI.computationOfTaxLiability.taxRelief.section89');
	if(parseInt(sec89, 10) < 0){
		j.setFieldError('partBTTI.computationOfTaxLiability.taxRelief.section89',
						'The amount Section 89 cannot be negative');
	}
}

// Calculate Income for Schedule CYLA.
function calculateCYLA(cgosIncome){
	try{
		//prefill the CYLA-schedule
		prefillCYLA();

		//doing successive setoffs
		//Income of current year (Fill this column only if income is zero or positive)

		setOffOthSrcLossCYLA(cgosIncome);
				
		// Current year's Income remaining after set off
		document.getElementsByName('scheduleCYLA.Salaries.incCYLA.incOfCurYrAfterSetOff')[0].value =
			coalescePath('scheduleCYLA.Salaries.incCYLA.incOfCurYrUnderThatHead') -
			coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
			coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff');
		if(coalescePath('scheduleCYLA.Salaries.incCYLA.incOfCurYrAfterSetOff')<0){
			addErrorXHTML(document.getElementsByName('scheduleCYLA.Salaries.incCYLA.incOfCurYrAfterSetOff')[0],
				'This figure cannot be negative. Please rearrange your figures',true);
			j.setFieldError('scheduleCYLA.Salaries.incCYLA.incOfCurYrAfterSetOff',
				'This figure cannot be negative. Please rearrange your figures');
			
		}
		
		// Current year's Income remaining after set off
		document.getElementsByName('scheduleCYLA.houseProperty.incCYLA.incOfCurYrAfterSetOff')[0].value =
			coalescePath('scheduleCYLA.houseProperty.incCYLA.incOfCurYrUnderThatHead') -
			coalescePath('scheduleCYLA.houseProperty.incCYLA.busLossSetoff')-
			coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff');
		if(coalescePath('scheduleCYLA.Salaries.incCYLA.incOfCurYrAfterSetOff')<0){
			addErrorXHTML(document.getElementsByName('scheduleCYLA.houseProperty.incCYLA.incOfCurYrAfterSetOff')[0],
				'This figure cannot be negative. Please rearrange your figures',true);
			j.setFieldError('scheduleCYLA.houseProperty.incCYLA.incOfCurYrAfterSetOff',
				'This figure cannot be negative. Please rearrange your figures');
			
		}
		
		document.getElementsByName('scheduleCYLA.busProfInclSpecProf.incCYLA.incOfCurYrAfterSetOff')[0].value =
			coalescePath('scheduleCYLA.busProfInclSpecProf.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.busProfInclSpecProf.incCYLA.hPlossCurYrSetoff')-
			coalescePath('scheduleCYLA.busProfInclSpecProf.incCYLA.othSrcLossNoRaceHorseSetoff');
		if(coalescePath('scheduleCYLA.busProfInclSpecProf.incCYLA.incOfCurYrAfterSetOff')<0){
			addErrorXHTML(document.getElementsByName('scheduleCYLA.busProfInclSpecProf.incCYLA.incOfCurYrAfterSetOff')[0],
				'This figure cannot be negative. Please rearrange your figures',true);
			j.setFieldError('scheduleCYLA.busProfInclSpecProf.incCYLA.incOfCurYrAfterSetOff',
				'This figure cannot be negative. Please rearrange your figures');

				
		}
		
		// Speculative Income
		document.getElementsByName('scheduleCYLA.speculativeInc.incCYLA.incOfCurYrAfterSetOff')[0].value =
			coalescePath('scheduleCYLA.speculativeInc.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.speculativeInc.incCYLA.hPlossCurYrSetoff')-
			coalescePath('scheduleCYLA.speculativeInc.incCYLA.othSrcLossNoRaceHorseSetoff');
		if(coalescePath('scheduleCYLA.speculativeInc.incCYLA.incOfCurYrAfterSetOff')<0){
			addErrorXHTML(document.getElementsByName('scheduleCYLA.speculativeInc.incCYLA.incOfCurYrAfterSetOff')[0],
				'This figure cannot be negative. Please rearrange your figures',true);
			j.setFieldError('scheduleCYLA.speculativeInc.incCYLA.incOfCurYrAfterSetOff',
				'This figure cannot be negative. Please rearrange your figures');
		}
		
		// Specified Business Income
		document.getElementsByName('scheduleCYLA.specifiedInc.incCYLA.incOfCurYrAfterSetOff')[0].value =
			coalescePath('scheduleCYLA.specifiedInc.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.specifiedInc.incCYLA.hPlossCurYrSetoff')-
			coalescePath('scheduleCYLA.specifiedInc.incCYLA.othSrcLossNoRaceHorseSetoff');
		if(coalescePath('scheduleCYLA.specifiedInc.incCYLA.incOfCurYrAfterSetOff')<0){
			addErrorXHTML(document.getElementsByName('scheduleCYLA.specifiedInc.incCYLA.incOfCurYrAfterSetOff')[0],
				'This figure cannot be negative. Please rearrange your figures',true);
			j.setFieldError('scheduleCYLA.specifiedInc.incCYLA.incOfCurYrAfterSetOff',
				'This figure cannot be negative. Please rearrange your figures');
		}
		
		
		//Short-term capital gain taxable @ 15%
		document.getElementsByName('scheduleCYLA.stcg.stcg15Per.incCYLA.incOfCurYrAfterSetOff')[0].value =
			coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.hPlossCurYrSetoff')-
			coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.busLossSetoff')-
			coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff');
		if(coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.incOfCurYrAfterSetOff')<0){
			addErrorXHTML(document.getElementsByName('scheduleCYLA.stcg.stcg15Per.incCYLA.incOfCurYrAfterSetOff')[0],
				'This figure cannot be negative. Please rearrange your figures',true);
			j.setFieldError('scheduleCYLA.stcg.stcg15Per.incCYLA.incOfCurYrAfterSetOff',
				'This figure cannot be negative. Please rearrange your figures');
		}
		//Short-term capital gain taxable @ 30%
		document.getElementsByName('scheduleCYLA.stcg.stcg30Per.incCYLA.incOfCurYrAfterSetOff')[0].value =
			coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')-
			coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.busLossSetoff')-
			coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff');
		if(coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.incOfCurYrAfterSetOff')<0){
			addErrorXHTML(document.getElementsByName('scheduleCYLA.stcg.stcg30Per.incCYLA.incOfCurYrAfterSetOff')[0],
				'This figure cannot be negative. Please rearrange your figures',true);
			j.setFieldError('scheduleCYLA.stcg.stcg30Per.incCYLA.incOfCurYrAfterSetOff',
				'This figure cannot be negative. Please rearrange your figures');
		}
		
		//Short-term capital gain taxable at applicable rates
		document.getElementsByName('scheduleCYLA.stcg.stcgAppRate.incCYLA.incOfCurYrAfterSetOff')[0].value =
			coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff')-
			coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.busLossSetoff')-
			coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff');
		if(coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.incOfCurYrAfterSetOff')<0){
			addErrorXHTML(document.getElementsByName('scheduleCYLA.stcg.stcgAppRate.incCYLA.incOfCurYrAfterSetOff')[0],
				'This figure cannot be negative. Please rearrange your figures',true);
			j.setFieldError('scheduleCYLA.stcg.stcgAppRate.incCYLA.incOfCurYrAfterSetOff',
				'This figure cannot be negative. Please rearrange your figures');
		}
		// 	Long term capital gain taxable @ 10%
		document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.incOfCurYrAfterSetOff')[0].value =
			coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')-
			coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.busLossSetoff')-
			coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff');
		if(coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.incOfCurYrAfterSetOff')<0){
			addErrorXHTML(document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.incOfCurYrAfterSetOff')[0],
				'This figure cannot be negative. Please rearrange your figures',true);			
			j.setFieldError('scheduleCYLA.ltcg.ltcg10Per.incCYLA.incOfCurYrAfterSetOff',
				'This figure cannot be negative. Please rearrange your figures');
			
		}
		// 	Long term capital gain taxable @ 20%
		document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.incOfCurYrAfterSetOff')[0].value =
			coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')-
			coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.busLossSetoff')-
			coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff');
		if(coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.incOfCurYrAfterSetOff')<0){
			addErrorXHTML(document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.incOfCurYrAfterSetOff')[0],
				'This figure cannot be negative. Please rearrange your figures',true);			
			j.setFieldError('scheduleCYLA.ltcg.ltcg20Per.incCYLA.incOfCurYrAfterSetOff',
				'This figure cannot be negative. Please rearrange your figures');
			
		}
		
		// 	Other sources
		document.getElementsByName('scheduleCYLA.othSrcInclRaceHorse.incCYLA.incOfCurYrAfterSetOff')[0].value=
			coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.busLossSetoff')-
			coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff');
		if(coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.incOfCurYrAfterSetOff')<0){
			addErrorXHTML(document.getElementsByName('scheduleCYLA.othSrcInclRaceHorse.incCYLA.incOfCurYrAfterSetOff')[0],
				'This figure cannot be negative. Please rearrange your figures',true);
			j.setFieldError('scheduleCYLA.othSrcInclRaceHorse.incCYLA.incOfCurYrAfterSetOff',
				'This figure cannot be negative. Please rearrange your figures');
		}
		// Profit from owning and maintaining race horses
		document.getElementsByName('scheduleCYLA.profitFrmRaceHorse.incCYLA.incOfCurYrAfterSetOff')[0].value=
			coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')-
			coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.busLossSetoff')-
			coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff');
		if(coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.incOfCurYrAfterSetOff')<0){
			addErrorXHTML(document.getElementsByName('scheduleCYLA.profitFrmRaceHorse.incCYLA.incOfCurYrAfterSetOff')[0],
				'This figure cannot be negative. Please rearrange your figures',true);
			j.setFieldError('scheduleCYLA.profitFrmRaceHorse.incCYLA.incOfCurYrAfterSetOff',
				'This figure cannot be negative. Please rearrange your figures');
		}

		//total loss setoff
		document.getElementsByName('scheduleCYLA.totalLossSetOff.totHPlossCurYrSetoff')[0].value=
			coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')+
			coalescePath('scheduleCYLA.busProfInclSpecProf.incCYLA.hPlossCurYrSetoff')+
			coalescePath('scheduleCYLA.speculativeInc.incCYLA.hPlossCurYrSetoff')+
			coalescePath('scheduleCYLA.specifiedInc.incCYLA.hPlossCurYrSetoff')+
			coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.hPlossCurYrSetoff')+
			coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')+
			coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff')+
			coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')+
			coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')+
			coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')+
			coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff');
		
		// Business
		document.getElementsByName('scheduleCYLA.totalLossSetOff.totBusLossSetoff')[0].value=
			coalescePath('scheduleCYLA.houseProperty.incCYLA.busLossSetoff')+
			coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.busLossSetoff')+
			coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.busLossSetoff')+
			coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.busLossSetoff')+
			coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.busLossSetoff')+
			coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.busLossSetoff')+
			coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.busLossSetoff')+
			coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.busLossSetoff');
		
		document.getElementsByName('scheduleCYLA.totalLossSetOff.totOthSrcLossNoRaceHorseSetoff')[0].value=
			coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')+
			coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')+
			coalescePath('scheduleCYLA.busProfInclSpecProf.incCYLA.othSrcLossNoRaceHorseSetoff')+
			coalescePath('scheduleCYLA.speculativeInc.incCYLA.othSrcLossNoRaceHorseSetoff')+
			coalescePath('scheduleCYLA.specifiedInc.incCYLA.othSrcLossNoRaceHorseSetoff')+
			coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff')+
			coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff')+
			coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff')+
			coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')+
			coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')+
			coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff');
		
		//Loss remaining after set-off
		document.getElementsByName('scheduleCYLA.lossRemAftSetOff.balHPlossCurYrAftSetoff')[0].value=
			coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-coalescePath('scheduleCYLA.totalLossSetOff.totHPlossCurYrSetoff');
		if(coalescePath('scheduleCYLA.lossRemAftSetOff.balHPlossCurYrAftSetoff')<0){
			addErrorXHTML(document.getElementsByName('scheduleCYLA.lossRemAftSetOff.balHPlossCurYrAftSetoff')[0],
				'This figure cannot be negative. Please rearrange your figures',true);
			j.setFieldError('scheduleCYLA.lossRemAftSetOff.balHPlossCurYrAftSetoff',
				'This figure cannot be negative. Please rearrange your figures');
		}
		
		document.getElementsByName('scheduleCYLA.lossRemAftSetOff.balBusLossAftSetoff')[0].value=
			coalescePath('scheduleCYLA.totalCurYr.totBusLoss')-coalescePath('scheduleCYLA.totalLossSetOff.totBusLossSetoff');
		if(coalescePath('scheduleCYLA.lossRemAftSetOff.balBusLossAftSetoff')<0){
			addErrorXHTML(document.getElementsByName('scheduleCYLA.lossRemAftSetOff.balBusLossAftSetoff')[0],
				'This figure cannot be negative. Please rearrange your figures',true);
			j.setFieldError('scheduleCYLA.lossRemAftSetOff.balBusLossAftSetoff',
				'This figure cannot be negative. Please rearrange your figures');
			
		}
		
		document.getElementsByName('scheduleCYLA.lossRemAftSetOff.balOthSrcLossNoRaceHorseAftSetoff')[0].value=
			coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-coalescePath('scheduleCYLA.totalLossSetOff.totOthSrcLossNoRaceHorseSetoff');
		if(coalescePath('scheduleCYLA.lossRemAftSetOff.balOthSrcLossNoRaceHorseAftSetoff')<0){
			addErrorXHTML(document.getElementsByName('scheduleCYLA.lossRemAftSetOff.balOthSrcLossNoRaceHorseAftSetoff')[0],
				'This figure cannot be negative. Please rearrange your figures',true);
			j.setFieldError('scheduleCYLA.lossRemAftSetOff.balOthSrcLossNoRaceHorseAftSetoff',
				'This figure cannot be negative. Please rearrange your figures');
			
		}
		
		cgosIncome.cgInc.stcg.prctgAr = coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.incOfCurYrAfterSetOff');
		cgosIncome.cgInc.stcg.prctg30 = coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.incOfCurYrAfterSetOff');
		cgosIncome.bpNetInc = coalescePath('scheduleCYLA.busProfInclSpecProf.incCYLA.incOfCurYrAfterSetOff');
		
		calcBFLA(cgosIncome);

	}catch(e){
		alert('error in calcCYLA=' + e.stack);
	}
}

// Set-Off Business Loss for Schedule CYLA.
function setOffBussLossCYLA(cgosIncome){
	try{
		var stcgPercent15Sec111a = cgosIncome.cgInc.stcg.prctg15.sec111a;
		var stcgPercent15Sec115ad_1_b_ii = cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii;
		var ltcgPrctg20Sec112 = cgosIncome.cgInc.ltcg.prctg20.sec112;
		var ltcgPrctg20Sec11EA = cgosIncome.cgInc.ltcg.prctg20.sec11EA;
		var ltcgPrctg10SecProviso = cgosIncome.cgInc.ltcg.prctg10.secProviso;
		var ltcgPrctg10Sec112c2 = cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2;
		var ltcgPrctg10Sec115AC1 = cgosIncome.cgInc.ltcg.prctg10.sec115AC_1;
		var ltcgPrctg10Sec115ACA1 = cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1;
		var ltcgPrctg10Sec115AD3 = cgosIncome.cgInc.ltcg.prctg10.sec115AD_3;
		var ltcgPrctg10Sec115Eb = cgosIncome.cgInc.ltcg.prctg10.sec115E_b;
		
		document.getElementsByName('scheduleCYLA.houseProperty.incCYLA.busLossSetoff')[0].value = 0;
		document.getElementsByName('scheduleCYLA.stcg.stcg15Per.incCYLA.busLossSetoff')[0].value = 0;
		document.getElementsByName('scheduleCYLA.stcg.stcg30Per.incCYLA.busLossSetoff')[0].value = 0;
		document.getElementsByName('scheduleCYLA.stcg.stcgAppRate.incCYLA.busLossSetoff')[0].value = 0;
		document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.busLossSetoff')[0].value = 0;
		document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.busLossSetoff')[0].value = 0;
		document.getElementsByName('scheduleCYLA.othSrcInclRaceHorse.incCYLA.busLossSetoff')[0].value = 0;
		document.getElementsByName('scheduleCYLA.profitFrmRaceHorse.incCYLA.busLossSetoff')[0].value = 0;
		
		
		/* 			
		Order of adjustment :-
			1) HP Income
			2) Other sources
			3) Profit from owning and maintaining race horses
			4) Short-term capital gain taxable @ 30% 
			5) Short-term capital gain taxable at applicable rates 
			6) Long term capital gain taxable @ 20% (1.cgosIncome.cgInc.ltcg.prctg20.sec112, 2.cgosIncome.cgInc.ltcg.prctg20.sec11EA)
			7) Short-term capital gain taxable @ 15% 
			8) Long term capital gain taxable @ 10% (1. cgosIncome.cgInc.ltcg.prctg10.secProviso,
													2. cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2,
													3. cgosIncome.cgInc.ltcg.prctg10.sec115AC_1,
													4. cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1,
													5. cgosIncome.cgInc.ltcg.prctg10.sec115AD_3,
													6. cgosIncome.cgInc.ltcg.prctg10.sec115E_b)
		*/
		
		// 1. HP Income	
		var hpSetOffRem = zeroOrMore(coalescePath('scheduleCYLA.houseProperty.incCYLA.incOfCurYrUnderThatHead')-
					coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff'));
		var prevSetOffRem = coalescePath('scheduleCYLA.totalCurYr.totBusLoss');
		var setOffRem = prevSetOffRem - hpSetOffRem;
		
		if(setOffRem>=0){
			if(coalescePath('scheduleCYLA.totalCurYr.totBusLoss')==0){
				document.getElementsByName('scheduleCYLA.houseProperty.incCYLA.busLossSetoff')[0].value = 0;
			}else{
					document.getElementsByName('scheduleCYLA.houseProperty.incCYLA.busLossSetoff')[0].value = hpSetOffRem;					
			}
		}else{
				document.getElementsByName('scheduleCYLA.houseProperty.incCYLA.busLossSetoff')[0].value =
					coalescePath('scheduleCYLA.totalCurYr.totBusLoss');				
			setOffRem =0 ;
		}
		
		// 2. Other sources	
		var osIncSetOffRem = zeroOrMore(coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.incOfCurYrUnderThatHead')-
					coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff'));
		prevSetOffRem = setOffRem;
		setOffRem = prevSetOffRem - osIncSetOffRem;
		
		if(setOffRem>=0){	
			if(prevSetOffRem==0){
				document.getElementsByName('scheduleCYLA.othSrcInclRaceHorse.incCYLA.busLossSetoff')[0].value = 0;
			}else{
					document.getElementsByName('scheduleCYLA.othSrcInclRaceHorse.incCYLA.busLossSetoff')[0].value =	osIncSetOffRem;					
			}
		}else{			
				document.getElementsByName('scheduleCYLA.othSrcInclRaceHorse.incCYLA.busLossSetoff')[0].value = prevSetOffRem;			
			setOffRem =0 ;
		}
		
		//3) Profit from owning and maintaining race horse
		var raceHrsSetOffRem = zeroOrMore(coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')-
			coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff'));
		
		prevSetOffRem = setOffRem;
		setOffRem = setOffRem - raceHrsSetOffRem;
		if(setOffRem>=0){
			if(prevSetOffRem==0){
				document.getElementsByName('scheduleCYLA.profitFrmRaceHorse.incCYLA.busLossSetoff')[0].value = 0;
			}else{				
					document.getElementsByName('scheduleCYLA.profitFrmRaceHorse.incCYLA.busLossSetoff')[0].value = raceHrsSetOffRem;					
			}
		}else{
				document.getElementsByName('scheduleCYLA.profitFrmRaceHorse.incCYLA.busLossSetoff')[0].value = prevSetOffRem;				
			setOffRem =0 ;
		}
		
		// 4) Short-term capital gain taxable @ 30%
		
		var stcg30PercntSetOffRem = zeroOrMore(coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff')-
			coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff'));
		
		prevSetOffRem = setOffRem;
		setOffRem = setOffRem - stcg30PercntSetOffRem;
		if(setOffRem>=0){
			if(prevSetOffRem==0){
				document.getElementsByName('scheduleCYLA.stcg.stcg30Per.incCYLA.busLossSetoff')[0].value = 0;
			}else{				
				document.getElementsByName('scheduleCYLA.stcg.stcg30Per.incCYLA.busLossSetoff')[0].value = stcg30PercntSetOffRem;					
			}
		}else{
				document.getElementsByName('scheduleCYLA.stcg.stcg30Per.incCYLA.busLossSetoff')[0].value = prevSetOffRem;				
				setOffRem =0 ;
		}
		
		// 5) Short-term capital gain taxable at applicable rates
		
		var stcgAppRateSetOffRem = zeroOrMore(coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff')-
			coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff'));
		
		prevSetOffRem = setOffRem;
		setOffRem = setOffRem - stcgAppRateSetOffRem;
		if(setOffRem>=0){
			if(prevSetOffRem==0){
				document.getElementsByName('scheduleCYLA.stcg.stcgAppRate.incCYLA.busLossSetoff')[0].value = 0;
			}else{				
				document.getElementsByName('scheduleCYLA.stcg.stcgAppRate.incCYLA.busLossSetoff')[0].value = stcgAppRateSetOffRem;					
			}
		}else{
				document.getElementsByName('scheduleCYLA.stcg.stcgAppRate.incCYLA.busLossSetoff')[0].value = prevSetOffRem;				
				setOffRem =0 ;
		}
		
		// 6) Long term capital gain taxable @ 20%
		prevSetOffRem = setOffRem;
		var ltcg20PercntSetOffRem = zeroOrMore(coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')-
			coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff'));
		if(ltcg20PercntSetOffRem>=0 && setOffRem>=0){
			if(ltcg20PercntSetOffRem>=setOffRem){
				var tempAk = setOffRem;
				setOffRem = setOffRem - parseInt(ltcg20PercntSetOffRem,10);
				
				if(setOffRem>=0){
						document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.busLossSetoff')[0].value = parseInt(ltcg20PercntSetOffRem,10);
						ltcgPrctg20Sec112 = 0;
						ltcgPrctg20Sec11EA = 0;
						
					ltcg20PercntSetOffRem = zeroOrMore(ltcg20PercntSetOffRem - coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.busLossSetoff'));
				}else{
						document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.busLossSetoff')[0].value = tempAk;
						setOffRem=0;
						// sec break up

						if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg20Sec11EA, 10) > parseInt(tempAk, 10)){
							ltcgPrctg20Sec11EA = parseInt(ltcgPrctg20Sec11EA, 10) - 
																	parseInt(tempAk, 10);
							tempAk = 0;
						}else{							
							tempAk = parseInt(tempAk, 10) - 
										parseInt(ltcgPrctg20Sec11EA, 10) ;
							ltcgPrctg20Sec11EA = 0;
						}
						
						if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg20Sec112, 10) > parseInt(tempAk, 10)){
							ltcgPrctg20Sec112 = parseInt(ltcgPrctg20Sec112, 10) - 
																	parseInt(tempAk, 10);
							tempAk = 0;
						}else{
							tempAk = parseInt(tempAk, 10) - 
										parseInt(ltcgPrctg20Sec112, 10) ;
							ltcgPrctg20Sec112 = 0;
						}

					ltcg20PercntSetOffRem = zeroOrMore(ltcg20PercntSetOffRem - coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.busLossSetoff'));
				}
			}else{
				var prevLtcgSetOffRem= ltcg20PercntSetOffRem;
				
				if(ltcg20PercntSetOffRem >=0){
						document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.busLossSetoff')[0].value = parseInt(ltcg20PercntSetOffRem,10);
						ltcg20PercntSetOffRem = 0;
						ltcgPrctg20Sec112 = 0;
						ltcgPrctg20Sec11EA = 0;	
					setOffRem = zeroOrMore(setOffRem - coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.busLossSetoff'));
				}else{
						document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.busLossSetoff')[0].value = prevLtcgSetOffRem;					
						ltcg20PercntSetOffRem =0 ;
						ltcgPrctg20Sec112=0;
						ltcgPrctg20Sec11EA = 0;
					setOffRem = zeroOrMore(setOffRem - coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.busLossSetoff'));
				}
			}
		}
		
		// 7) Short-term capital gain taxable @ 15% 
		var stcg15PercntSetOffRem = zeroOrMore(coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff')-
			coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.hPlossCurYrSetoff'));
		
		prevSetOffRem = setOffRem;
		setOffRem = setOffRem - stcg15PercntSetOffRem;
		if(setOffRem>=0){
			if(prevSetOffRem==0){
				document.getElementsByName('scheduleCYLA.stcg.stcg15Per.incCYLA.busLossSetoff')[0].value = 0;
			}else{				
					document.getElementsByName('scheduleCYLA.stcg.stcg15Per.incCYLA.busLossSetoff')[0].value = stcg15PercntSetOffRem;
					stcg15PercntSetOffRem = 0;
					stcgPercent15Sec111a = 0;
					stcgPercent15Sec115ad_1_b_ii = 0;
					
			}
		}else{
				document.getElementsByName('scheduleCYLA.stcg.stcg15Per.incCYLA.busLossSetoff')[0].value = prevSetOffRem;	
				
				// sec break up
				if(parseInt(prevSetOffRem, 10) >= 0 && parseInt(stcgPercent15Sec115ad_1_b_ii, 10) > parseInt(prevSetOffRem, 10)){
					stcgPercent15Sec115ad_1_b_ii = parseInt(stcgPercent15Sec115ad_1_b_ii, 10) - 
															parseInt(prevSetOffRem, 10);
					prevSetOffRem = 0;
				}else{
					prevSetOffRem = parseInt(prevSetOffRem, 10) - 
								parseInt(stcgPercent15Sec115ad_1_b_ii, 10) ;
					stcgPercent15Sec115ad_1_b_ii = 0;
				}

				if(parseInt(prevSetOffRem, 10) >= 0 && parseInt(stcgPercent15Sec111a, 10) > parseInt(prevSetOffRem, 10)){
					stcgPercent15Sec111a = parseInt(stcgPercent15Sec111a, 10) - 
															parseInt(prevSetOffRem, 10);
					prevSetOffRem = 0;
				}else{
					prevSetOffRem = parseInt(prevSetOffRem, 10) - 
								parseInt(stcgPercent15Sec111a, 10) ;
					stcgPercent15Sec111a = 0;
				}
				
			setOffRem =0 ;
		}
		
		// 8) Long term capital gain taxable @ 10%
		prevSetOffRem = setOffRem;
		var ltcg10PercntSetOffRem = zeroOrMore(coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')-
			coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff'));
		if(ltcg10PercntSetOffRem>=0 && setOffRem>=0){
			if(ltcg10PercntSetOffRem>=setOffRem){
				var tempAk = setOffRem;
				setOffRem = setOffRem - parseInt(ltcg10PercntSetOffRem,10);
				
				if(setOffRem>=0){
						document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.busLossSetoff')[0].value = parseInt(ltcg10PercntSetOffRem,10);					
						ltcgPrctg10Sec112c2 = 0;
						ltcgPrctg10Sec115AC1 = 0;
						ltcgPrctg10Sec115ACA1 = 0;
						ltcgPrctg10Sec115AD3 = 0;
						ltcgPrctg10Sec115Eb = 0;
						ltcgPrctg10SecProviso = 0;
						
					ltcg10PercntSetOffRem = zeroOrMore(ltcg10PercntSetOffRem - coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.busLossSetoff'));
				}else{
						document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.busLossSetoff')[0].value = tempAk;
						setOffRem=0;
						
						//Section break up

						if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg10Sec112c2, 10) > parseInt(tempAk, 10)){
							ltcgPrctg10Sec112c2 = parseInt(ltcgPrctg10Sec112c2, 10) - 
																	parseInt(tempAk, 10);
							tempAk = 0;
						}else{							
							tempAk = parseInt(tempAk, 10) - 
										parseInt(ltcgPrctg10Sec112c2, 10) ;
							ltcgPrctg10Sec112c2 = 0;
						}	

						if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg10Sec115AC1, 10) > parseInt(tempAk, 10)){
							ltcgPrctg10Sec115AC1 = parseInt(ltcgPrctg10Sec115AC1, 10) - 
																	parseInt(tempAk, 10);
							tempAk = 0;
						}else{							
							tempAk = parseInt(tempAk, 10) - 
										parseInt(ltcgPrctg10Sec115AC1, 10) ;
							ltcgPrctg10Sec115AC1 = 0;
						}

						if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg10Sec115ACA1, 10) > parseInt(tempAk, 10)){
							ltcgPrctg10Sec115ACA1 = parseInt(ltcgPrctg10Sec115ACA1, 10) - 
																	parseInt(tempAk, 10);
							tempAk = 0;
						}else{
							tempAk = parseInt(tempAk, 10) - 
										parseInt(ltcgPrctg10Sec115ACA1, 10) ;
							ltcgPrctg10Sec115ACA1 = 0;
						}	
						
						if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg10Sec115AD3, 10) > parseInt(tempAk, 10)){
							ltcgPrctg10Sec115AD3 = parseInt(ltcgPrctg10Sec115AD3, 10) - 
																	parseInt(tempAk, 10);
							tempAk = 0;
						}else{							
							tempAk = parseInt(tempAk, 10) - 
										parseInt(ltcgPrctg10Sec115AD3, 10) ;
							ltcgPrctg10Sec115AD3 = 0;
						}

						if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg10Sec115Eb, 10) > parseInt(tempAk, 10)){
							ltcgPrctg10Sec115Eb = parseInt(ltcgPrctg10Sec115Eb, 10) - 
																	parseInt(tempAk, 10);
							tempAk = 0;
						}else{							
							tempAk = parseInt(tempAk, 10) - 
										parseInt(ltcgPrctg10Sec115Eb, 10) ;
							ltcgPrctg10Sec115Eb = 0;
						}
						
						if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg10SecProviso, 10) > parseInt(tempAk, 10)){
							ltcgPrctg10SecProviso = parseInt(ltcgPrctg10SecProviso, 10) - parseInt(tempAk, 10);
							tempAk = 0;
						}else{
							tempAk = parseInt(tempAk, 10) - parseInt(ltcgPrctg10SecProviso, 10) ;
							ltcgPrctg10SecProviso = 0;
						}
					ltcg10PercntSetOffRem = zeroOrMore(ltcg10PercntSetOffRem - coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.busLossSetoff'));
				}
			}else{
				
				if(ltcg10PercntSetOffRem >=0){
						document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.busLossSetoff')[0].value = parseInt(ltcg10PercntSetOffRem,10);
						ltcg10PercntSetOffRem=0;
						ltcgPrctg10Sec112c2 = 0;
						ltcgPrctg10Sec115AC1 = 0;
						ltcgPrctg10Sec115ACA1 = 0;
						ltcgPrctg10Sec115AD3 = 0;
						ltcgPrctg10Sec115Eb = 0;
						ltcgPrctg10SecProviso = 0;
					setOffRem = zeroOrMore(setOffRem - coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.busLossSetoff'));
				}
			}
		}
		
		cgosIncome.cgInc.stcg.prctg15.sec111a = stcgPercent15Sec111a;
		cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii = stcgPercent15Sec115ad_1_b_ii;
		cgosIncome.cgInc.ltcg.prctg20.sec112 = ltcgPrctg20Sec112;
		cgosIncome.cgInc.ltcg.prctg20.sec11EA = ltcgPrctg20Sec11EA;
		cgosIncome.cgInc.ltcg.prctg10.secProviso = ltcgPrctg10SecProviso;
		cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2 = ltcgPrctg10Sec112c2;
		cgosIncome.cgInc.ltcg.prctg10.sec115AC_1 = ltcgPrctg10Sec115AC1;
		cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1 = ltcgPrctg10Sec115ACA1;
		cgosIncome.cgInc.ltcg.prctg10.sec115AD_3 = ltcgPrctg10Sec115AD3;
		cgosIncome.cgInc.ltcg.prctg10.sec115E_b = ltcgPrctg10Sec115Eb;
		
		
	}catch(e){
		alert('error in  setOffBussLossCYLA() = ' + e.stack);
	}
}

// set-Off HP Loss for Schedule CYLA.
function setOffHPLossCYLA(cgosIncome){
	try{
		
		var stcgPercent15Sec111a = cgosIncome.cgInc.stcg.prctg15.sec111a;
		var stcgPercent15Sec115ad_1_b_ii = cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii;
		var ltcgPrctg20Sec112 = cgosIncome.cgInc.ltcg.prctg20.sec112;
		var ltcgPrctg20Sec11EA = cgosIncome.cgInc.ltcg.prctg20.sec11EA;
		var ltcgPrctg10SecProviso = cgosIncome.cgInc.ltcg.prctg10.secProviso;
		var ltcgPrctg10Sec112c2 = cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2;
		var ltcgPrctg10Sec115AC1 = cgosIncome.cgInc.ltcg.prctg10.sec115AC_1;
		var ltcgPrctg10Sec115ACA1 = cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1;
		var ltcgPrctg10Sec115AD3 = cgosIncome.cgInc.ltcg.prctg10.sec115AD_3;
		var ltcgPrctg10Sec115Eb = cgosIncome.cgInc.ltcg.prctg10.sec115E_b;
		
		if( !checkIfChanged('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')){
			document.getElementsByName('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')[0].value = 0;
		}else{
			checkHPeditableValidity('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff',
				'scheduleCYLA.Salaries.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff'
				,'scheduleCYLA.totalCurYr.totHPlossCurYr',
				coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr'));
		}
		
		document.getElementsByName('scheduleCYLA.busProfInclSpecProf.incCYLA.hPlossCurYrSetoff')[0].value = 0;
		document.getElementsByName('scheduleCYLA.speculativeInc.incCYLA.hPlossCurYrSetoff')[0].value = 0;
		document.getElementsByName('scheduleCYLA.specifiedInc.incCYLA.hPlossCurYrSetoff')[0].value = 0;
				
		if( !checkIfChanged('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')){
			document.getElementsByName('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')[0].value = 0;
		}else{
			checkFirstLessThanMinOthTwo('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff',
				'scheduleCYLA.othSrcInclRaceHorse.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totHPlossCurYr',
				coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
				coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff'));
		}
		
		if(!checkIfChanged('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')){
			document.getElementsByName('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')[0].value = 0;
		}else{
			checkHPeditableValidity('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff',
				'scheduleCYLA.profitFrmRaceHorse.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff'
				,'scheduleCYLA.totalCurYr.totHPlossCurYr',
				coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
				coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff'));
		}
		
		if(!checkIfChanged('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')){
			document.getElementsByName('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')[0].value = 0;
		}else{
			checkHPeditableValidity('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff',
				'scheduleCYLA.stcg.stcg30Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff'
				,'scheduleCYLA.totalCurYr.totHPlossCurYr',
				coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
				coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff'));
		}
		
		if(!checkIfChanged('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff')){
			document.getElementsByName('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff')[0].value = 0;
		}else{
			checkHPeditableValidity('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff',
				'scheduleCYLA.stcg.stcgAppRate.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff'
				,'scheduleCYLA.totalCurYr.totHPlossCurYr',
				coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
				coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff'));
		}
		
		if(!checkIfChanged('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')){
			document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')[0].value = 0;
		}else{
			checkHPeditableValidity('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff',
				'scheduleCYLA.ltcg.ltcg20Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff'
				,'scheduleCYLA.totalCurYr.totHPlossCurYr',
				coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
				coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff'));
		}
		
		if(!checkIfChanged('scheduleCYLA.stcg.stcg15Per.incCYLA.hPlossCurYrSetoff')){
			document.getElementsByName('scheduleCYLA.stcg.stcg15Per.incCYLA.hPlossCurYrSetoff')[0].value = 0;
		}else{
			checkHPeditableValidity('scheduleCYLA.stcg.stcg15Per.incCYLA.hPlossCurYrSetoff',
				'scheduleCYLA.stcg.stcg15Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff'
				,'scheduleCYLA.totalCurYr.totHPlossCurYr',
				coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
				coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff'));
		}
		
		if(!checkIfChanged('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')){
			document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value = 0;
		}else{
			checkHPeditableValidity('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff',
				'scheduleCYLA.ltcg.ltcg10Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff'
				,'scheduleCYLA.totalCurYr.totHPlossCurYr',
				coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
				coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')-
				coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.hPlossCurYrSetoff'));
		}
	
				/* 			
		Order of adjustment :-
			1) Salaries
			2) Business Income
			3) Speculative Income
			4) Specified Income			
			5) Other sources
			6) Profit from owning and maintaining race horses
			7) Short-term capital gain taxable @ 30% 
			8) Short-term capital gain taxable at applicable rates 
			9) Long term capital gain taxable @ 20% (1.cgosIncome.cgInc.ltcg.prctg20.sec112, 2.cgosIncome.cgInc.ltcg.prctg20.sec11EA)
			10) Short-term capital gain taxable @ 15% 
			11) Long term capital gain taxable @ 10% (1. cgosIncome.cgInc.ltcg.prctg10.secProviso,
													2. cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2,
													3. cgosIncome.cgInc.ltcg.prctg10.sec115AC_1,
													4. cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1,
													5. cgosIncome.cgInc.ltcg.prctg10.sec115AD_3,
													6. cgosIncome.cgInc.ltcg.prctg10.sec115E_b)
		*/


		// 1. salary Income	
		var salarySetOffRem = zeroOrMore(coalescePath('scheduleCYLA.Salaries.incCYLA.incOfCurYrUnderThatHead')-
					coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff'));
		var prevSetOffRem = coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr');
		var setOffRem = prevSetOffRem - salarySetOffRem;
		
		if(setOffRem>=0){
			if(coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')==0){
				document.getElementsByName('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')[0].value = 0;
			}else{
				if( !checkIfChanged('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')){					
					document.getElementsByName('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')[0].value = salarySetOffRem;					
				}else {					
					checkHPeditableValidity('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff',
						'scheduleCYLA.Salaries.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff'
						,'scheduleCYLA.totalCurYr.totHPlossCurYr',
						coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr'));
					
					setOffRem = parseInt(prevSetOffRem,10) - coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff');
				}		
			}
		}else{
			if( !checkIfChanged('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')){				
				document.getElementsByName('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')[0].value =
					coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr');				
			}else {				
				checkHPeditableValidity('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff',
						'scheduleCYLA.Salaries.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff'
						,'scheduleCYLA.totalCurYr.totHPlossCurYr',
						coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr'));
			}
			setOffRem =0 ;
		}
		
		// 2.  Business Income	
		var busIncSetOffRem = zeroOrMore(coalescePath('scheduleCYLA.busProfInclSpecProf.incCYLA.incOfCurYrUnderThatHead')-
					coalescePath('scheduleCYLA.busProfInclSpecProf.incCYLA.othSrcLossNoRaceHorseSetoff'));
		prevSetOffRem = setOffRem;
		setOffRem = prevSetOffRem - busIncSetOffRem;
		
		if(setOffRem>=0){		
			if(prevSetOffRem==0){
				document.getElementsByName('scheduleCYLA.busProfInclSpecProf.incCYLA.hPlossCurYrSetoff')[0].value = 0;
			}else{
				if( !checkIfChanged('scheduleCYLA.busProfInclSpecProf.incCYLA.hPlossCurYrSetoff')){					
					document.getElementsByName('scheduleCYLA.busProfInclSpecProf.incCYLA.hPlossCurYrSetoff')[0].value =	busIncSetOffRem;					
				}else{					
					checkFirstLessThanMinOthTwo('scheduleCYLA.busProfInclSpecProf.incCYLA.hPlossCurYrSetoff',
						'scheduleCYLA.busProfInclSpecProf.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totHPlossCurYr',
						coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
						coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff'));
					
					setOffRem = parseInt(prevSetOffRem,10) - coalescePath('scheduleCYLA.busProfInclSpecProf.incCYLA.hPlossCurYrSetoff');
				}
			}
		}else{			
			if( !checkIfChanged('scheduleCYLA.busProfInclSpecProf.incCYLA.hPlossCurYrSetoff')){				
				document.getElementsByName('scheduleCYLA.busProfInclSpecProf.incCYLA.hPlossCurYrSetoff')[0].value = prevSetOffRem;			
			}else{				
				checkFirstLessThanMinOthTwo('scheduleCYLA.busProfInclSpecProf.incCYLA.hPlossCurYrSetoff',
						'scheduleCYLA.busProfInclSpecProf.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totHPlossCurYr',
						coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
						coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff'));
			}
			setOffRem =0 ;
		}
		
		// 3.  Speculative Income
		var specltvIncSetOffRem = zeroOrMore(coalescePath('scheduleCYLA.speculativeInc.incCYLA.incOfCurYrUnderThatHead')-
					coalescePath('scheduleCYLA.speculativeInc.incCYLA.othSrcLossNoRaceHorseSetoff'));
		prevSetOffRem = setOffRem;
		setOffRem = prevSetOffRem - specltvIncSetOffRem;
		
		if(setOffRem>=0){		
			if(prevSetOffRem==0){
				document.getElementsByName('scheduleCYLA.speculativeInc.incCYLA.hPlossCurYrSetoff')[0].value = 0;
			}else{
					document.getElementsByName('scheduleCYLA.speculativeInc.incCYLA.hPlossCurYrSetoff')[0].value =	specltvIncSetOffRem;					
			}
		}else{			
				document.getElementsByName('scheduleCYLA.speculativeInc.incCYLA.hPlossCurYrSetoff')[0].value = prevSetOffRem;			
			setOffRem =0 ;
		}
		
		// 4.  Specified Income
		var specfidIncSetOffRem = zeroOrMore(coalescePath('scheduleCYLA.specifiedInc.incCYLA.incOfCurYrUnderThatHead')-
					coalescePath('scheduleCYLA.specifiedInc.incCYLA.othSrcLossNoRaceHorseSetoff'));
		prevSetOffRem = setOffRem;
		setOffRem = prevSetOffRem - specfidIncSetOffRem;
		
		if(setOffRem>=0){		
			if(prevSetOffRem==0){
				document.getElementsByName('scheduleCYLA.specifiedInc.incCYLA.hPlossCurYrSetoff')[0].value = 0;
			}else{
					document.getElementsByName('scheduleCYLA.specifiedInc.incCYLA.hPlossCurYrSetoff')[0].value =	specfidIncSetOffRem;					
			}
		}else{			
				document.getElementsByName('scheduleCYLA.specifiedInc.incCYLA.hPlossCurYrSetoff')[0].value = prevSetOffRem;			
			setOffRem =0 ;
		}
		
		//5) Other sources (excluding profit from owning race horses)
		
		prevSetOffRem = setOffRem;		
		setOffRem = setOffRem - coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.incOfCurYrUnderThatHead');
		if(setOffRem>=0){		
			if(prevSetOffRem==0){		
				document.getElementsByName('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')[0].value = 0;
			}else{
				if( !checkIfChanged('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')){					
					document.getElementsByName('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')[0].value =
						coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.incOfCurYrUnderThatHead');					
				}else{					
					checkFirstLessThanMinOthTwo('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff',
						'scheduleCYLA.othSrcInclRaceHorse.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totHPlossCurYr',
						coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
						coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff'));
					
					setOffRem = parseInt(prevSetOffRem,10) - coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff');
				}
			}
		}else{			
			if( !checkIfChanged('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')){				
				document.getElementsByName('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')[0].value = prevSetOffRem;			
			}else{				
				checkFirstLessThanMinOthTwo('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff',
						'scheduleCYLA.othSrcInclRaceHorse.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totHPlossCurYr',
						coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
						coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff'));
			}
			setOffRem =0 ;
		}
				
		//6) Profit from owning and maintaining race horse
		var raceHrsSetOffRem = zeroOrMore(coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff'));
		
		prevSetOffRem = setOffRem;
		setOffRem = setOffRem - raceHrsSetOffRem;
		if(setOffRem>=0){
			if(prevSetOffRem==0){
				document.getElementsByName('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')[0].value = 0;
			}else{				
				if(!checkIfChanged('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')){					
					document.getElementsByName('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')[0].value = raceHrsSetOffRem;					
				}else{					
					checkHPeditableValidity('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff',
						'scheduleCYLA.profitFrmRaceHorse.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff'
						,'scheduleCYLA.totalCurYr.totHPlossCurYr',
						coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
						coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff'));
					
					setOffRem = parseInt(prevSetOffRem,10) - coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff');
				}
			}
		}else{
			if( !checkIfChanged('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')){				
				document.getElementsByName('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')[0].value = prevSetOffRem;				
			}else{				
				checkHPeditableValidity('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff',
						'scheduleCYLA.profitFrmRaceHorse.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff'
						,'scheduleCYLA.totalCurYr.totHPlossCurYr',
						coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
						coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff'));
			}		
			setOffRem =0 ;
		}
		
		// 7) Short-term capital gain taxable @ 30%
		
		var stcg30PercntSetOffRem = zeroOrMore(coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
		
		prevSetOffRem = setOffRem;
		setOffRem = setOffRem - stcg30PercntSetOffRem;
		if(setOffRem>=0){
			if(prevSetOffRem==0){
				document.getElementsByName('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')[0].value = 0;
			}else{				
				if(!checkIfChanged('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')){					
					document.getElementsByName('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')[0].value = stcg30PercntSetOffRem;					
				}else{					
					checkHPeditableValidity('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff',
						'scheduleCYLA.stcg.stcg30Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff'
						,'scheduleCYLA.totalCurYr.totHPlossCurYr',
						coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
						coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff'));
					
					setOffRem = parseInt(prevSetOffRem,10) - coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff');
				}
			}
		}else{
			if( !checkIfChanged('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')){				
				document.getElementsByName('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')[0].value = prevSetOffRem;				
			}else{				
				checkHPeditableValidity('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff',
						'scheduleCYLA.stcg.stcg30Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff'
						,'scheduleCYLA.totalCurYr.totHPlossCurYr',
						coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
						coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff'));
			}		
			setOffRem =0 ;
		}
		
		// 8) Short-term capital gain taxable at applicable rates
		
		var stcgAppRateSetOffRem = zeroOrMore(coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff'));
		
		prevSetOffRem = setOffRem;
		setOffRem = setOffRem - stcgAppRateSetOffRem;
		if(setOffRem>=0){
			if(prevSetOffRem==0){
				document.getElementsByName('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff')[0].value = 0;
			}else{				
				if(!checkIfChanged('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff')){					
					document.getElementsByName('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff')[0].value = stcgAppRateSetOffRem;					
				}else{					
					checkHPeditableValidity('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff',
						'scheduleCYLA.stcg.stcgAppRate.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff'
						,'scheduleCYLA.totalCurYr.totHPlossCurYr',
						coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
						coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff'));
					
					setOffRem = parseInt(prevSetOffRem,10) - coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff');
				}
			}
		}else{
			if( !checkIfChanged('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff')){				
				document.getElementsByName('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff')[0].value = prevSetOffRem;				
			}else{				
				checkHPeditableValidity('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff',
						'scheduleCYLA.stcg.stcgAppRate.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff'
						,'scheduleCYLA.totalCurYr.totHPlossCurYr',
						coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
						coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff'));
			}		
			setOffRem =0 ;
		}
		
		// 9) Long term capital gain taxable @ 20%
		prevSetOffRem = setOffRem;
		var ltcg20PercntSetOffRem = zeroOrMore(coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
		if(ltcg20PercntSetOffRem>=0 && setOffRem>=0){
			if(ltcg20PercntSetOffRem>=setOffRem){
				var tempAk = setOffRem;
				setOffRem = setOffRem - parseInt(ltcg20PercntSetOffRem,10);//mod
				
				if(setOffRem>=0){
					if(!checkIfChanged('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')){
						document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')[0].value = parseInt(ltcg20PercntSetOffRem,10);
						ltcgPrctg20Sec112 = 0;
						ltcgPrctg20Sec11EA = 0;
						
					}else{
					
						checkHPeditableValidity('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff',
							'scheduleCYLA.ltcg.ltcg20Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff'
							,'scheduleCYLA.totalCurYr.totHPlossCurYr',
							coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
							coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff'));
							
						if(parseInt(ltcgPrctg20Sec112,10) >= document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')[0].value){
							ltcgPrctg20Sec112 = parseInt(ltcgPrctg20Sec112,10) - document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')[0].value;
						}else{
							var remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg20Sec112,10);
							ltcgPrctg20Sec112 = 0;
							if(parseInt(ltcgPrctg20Sec11EA,10) >= remaLTCGcomplete){
								ltcgPrctg20Sec11EA = parseInt(ltcgPrctg20Sec11EA,10) - remaLTCGcomplete;
							}else{
								ltcgPrctg20Sec11EA=0;
							}
						}
					}
					ltcg20PercntSetOffRem = zeroOrMore(ltcg20PercntSetOffRem - coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff'));
				}else{
					if(!checkIfChanged('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')){
						document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')[0].value = tempAk;
						setOffRem=0;
						// sec break up

						if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg20Sec11EA, 10) > parseInt(tempAk, 10)){
							ltcgPrctg20Sec11EA = parseInt(ltcgPrctg20Sec11EA, 10) - 
																	parseInt(tempAk, 10);
							tempAk = 0;
						}else{							
							tempAk = parseInt(tempAk, 10) - 
										parseInt(ltcgPrctg20Sec11EA, 10) ;
							ltcgPrctg20Sec11EA = 0;
						}
						
						if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg20Sec112, 10) > parseInt(tempAk, 10)){
							ltcgPrctg20Sec112 = parseInt(ltcgPrctg20Sec112, 10) - 
																	parseInt(tempAk, 10);
							tempAk = 0;
						}else{
							tempAk = parseInt(tempAk, 10) - 
										parseInt(ltcgPrctg20Sec112, 10) ;
							ltcgPrctg20Sec112 = 0;
						}

					}else{
					
						checkHPeditableValidity('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff',
							'scheduleCYLA.ltcg.ltcg20Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff'
							,'scheduleCYLA.totalCurYr.totHPlossCurYr',
							coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
							coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff'));
							
						if(parseInt(ltcgPrctg20Sec112,10) >= document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')[0].value){
							ltcgPrctg20Sec112 = parseInt(ltcgPrctg20Sec112,10) - document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')[0].value;
						}else{
							var remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg20Sec112,10);
							ltcgPrctg20Sec112 = 0;
							if(parseInt(ltcgPrctg20Sec11EA,10) >= remaLTCGcomplete){
								ltcgPrctg20Sec11EA = parseInt(ltcgPrctg20Sec11EA,10) - remaLTCGcomplete;
							}else{
								ltcgPrctg20Sec11EA=0;
							}
						}
					}
					ltcg20PercntSetOffRem = zeroOrMore(ltcg20PercntSetOffRem - coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff'));
				}
			}else{
				var prevLtcgSetOffRem= ltcg20PercntSetOffRem;
				
				if(ltcg20PercntSetOffRem >=0){
					if(!checkIfChanged('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')){
						document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')[0].value = parseInt(ltcg20PercntSetOffRem,10);
						ltcg20PercntSetOffRem = 0;
						ltcgPrctg20Sec112 = 0;
						ltcgPrctg20Sec11EA = 0;	
					}else{
					
						checkHPeditableValidity('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff',
							'scheduleCYLA.ltcg.ltcg20Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff'
							,'scheduleCYLA.totalCurYr.totHPlossCurYr',
							coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
							coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff'));
							
						if(parseInt(ltcgPrctg20Sec112,10) >= document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')[0].value){
							ltcgPrctg20Sec112 = parseInt(ltcgPrctg20Sec112,10) - document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')[0].value;
						}else{
							var remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg20Sec112,10);
							ltcgPrctg20Sec112 = 0;
							if(parseInt(ltcgPrctg20Sec11EA,10) >= remaLTCGcomplete){
								ltcgPrctg20Sec11EA = parseInt(ltcgPrctg20Sec11EA,10) - remaLTCGcomplete;
							}else{
								ltcgPrctg20Sec11EA=0;
							}
						}
					}
					setOffRem = zeroOrMore(setOffRem - coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff'));
				}else{
					if(!checkIfChanged('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')){
						document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')[0].value = prevLtcgSetOffRem;					
						ltcg20PercntSetOffRem =0 ;
						ltcgPrctg20Sec112=0;
						ltcgPrctg20Sec11EA = 0;
					}else{
						
						checkHPeditableValidity('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff',
							'scheduleCYLA.ltcg.ltcg20Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff'
							,'scheduleCYLA.totalCurYr.totHPlossCurYr',
							coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
							coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff'));
							
						if(parseInt(ltcgPrctg20Sec112,10) >= document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')[0].value){
							ltcgPrctg20Sec112 = parseInt(ltcgPrctg20Sec112,10) - document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')[0].value;
						}else{
							var remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg20Sec112,10);
							ltcgPrctg20Sec112 = 0;
							if(parseInt(ltcgPrctg20Sec11EA,10) >= remaLTCGcomplete){
								ltcgPrctg20Sec11EA = parseInt(ltcgPrctg20Sec11EA,10) - remaLTCGcomplete;
							}else{
								ltcgPrctg20Sec11EA=0;
							}
						}
					}
					setOffRem = zeroOrMore(setOffRem - coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff'));
				}
			}
		}
		
		// 10) Short-term capital gain taxable @ 15% 
		var stcg15PercntSetOffRem = zeroOrMore(coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
		
		prevSetOffRem = setOffRem;
		setOffRem = setOffRem - stcg15PercntSetOffRem;
		if(setOffRem>=0){
			if(prevSetOffRem==0){
				document.getElementsByName('scheduleCYLA.stcg.stcg15Per.incCYLA.hPlossCurYrSetoff')[0].value = 0;
			}else{				
				if(!checkIfChanged('scheduleCYLA.stcg.stcg15Per.incCYLA.hPlossCurYrSetoff')){					
					document.getElementsByName('scheduleCYLA.stcg.stcg15Per.incCYLA.hPlossCurYrSetoff')[0].value = stcg15PercntSetOffRem;
					stcg15PercntSetOffRem = 0;
					stcgPercent15Sec111a = 0;
					stcgPercent15Sec115ad_1_b_ii = 0;
					
				}else{					
					checkHPeditableValidity('scheduleCYLA.stcg.stcg15Per.incCYLA.hPlossCurYrSetoff',
						'scheduleCYLA.stcg.stcg15Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff'
						,'scheduleCYLA.totalCurYr.totHPlossCurYr',
						coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
						coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff'));
					
					setOffRem = parseInt(prevSetOffRem,10) - coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.hPlossCurYrSetoff');
				}
			}
		}else{
			if( !checkIfChanged('scheduleCYLA.stcg.stcg15Per.incCYLA.hPlossCurYrSetoff')){				
				document.getElementsByName('scheduleCYLA.stcg.stcg15Per.incCYLA.hPlossCurYrSetoff')[0].value = prevSetOffRem;	
				
				// sec break up
				if(parseInt(prevSetOffRem, 10) >= 0 && parseInt(stcgPercent15Sec115ad_1_b_ii, 10) > parseInt(prevSetOffRem, 10)){
					stcgPercent15Sec115ad_1_b_ii = parseInt(stcgPercent15Sec115ad_1_b_ii, 10) - 
															parseInt(prevSetOffRem, 10);
					prevSetOffRem = 0;
				}else{
					prevSetOffRem = parseInt(prevSetOffRem, 10) - 
								parseInt(stcgPercent15Sec115ad_1_b_ii, 10) ;
					stcgPercent15Sec115ad_1_b_ii = 0;
				}

				if(parseInt(prevSetOffRem, 10) >= 0 && parseInt(stcgPercent15Sec111a, 10) > parseInt(prevSetOffRem, 10)){
					stcgPercent15Sec111a = parseInt(stcgPercent15Sec111a, 10) - 
															parseInt(prevSetOffRem, 10);
					prevSetOffRem = 0;
				}else{
					prevSetOffRem = parseInt(prevSetOffRem, 10) - 
								parseInt(stcgPercent15Sec111a, 10) ;
					stcgPercent15Sec111a = 0;
				}
				
			}else{				
				checkHPeditableValidity('scheduleCYLA.stcg.stcg15Per.incCYLA.hPlossCurYrSetoff',
						'scheduleCYLA.stcg.stcg15Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff'
						,'scheduleCYLA.totalCurYr.totHPlossCurYr',
						coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
						coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff')-
						coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff'));
			}		
			setOffRem =0 ;
		}
		
		// 11) Long term capital gain taxable @ 10%
		prevSetOffRem = setOffRem;
		var ltcg10PercntSetOffRem = zeroOrMore(coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.incOfCurYrUnderThatHead')-
			coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
		if(ltcg10PercntSetOffRem>=0 && setOffRem>=0){
			if(ltcg10PercntSetOffRem>=setOffRem){
				var tempAk = setOffRem;
				setOffRem = setOffRem - parseInt(ltcg10PercntSetOffRem,10);//mod
				
				if(setOffRem>=0){
					if(!checkIfChanged('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')){
						document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value = parseInt(ltcg10PercntSetOffRem,10);					
						ltcgPrctg10Sec112c2 = 0;
						ltcgPrctg10Sec115AC1 = 0;
						ltcgPrctg10Sec115ACA1 = 0;
						ltcgPrctg10Sec115AD3 = 0;
						ltcgPrctg10Sec115Eb = 0;
						ltcgPrctg10SecProviso = 0;
						
					}else{
					
						checkHPeditableValidity('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff',
							'scheduleCYLA.ltcg.ltcg10Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff'
							,'scheduleCYLA.totalCurYr.totHPlossCurYr',
							coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
							coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.hPlossCurYrSetoff'));
							
						if(parseInt(ltcgPrctg10SecProviso,10) >= document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value){
							ltcgPrctg10SecProviso = parseInt(ltcgPrctg10SecProviso,10) - document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value;
						}else{
							var remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg10SecProviso,10);
							ltcgPrctg10SecProviso = 0;
							if(parseInt(ltcgPrctg10Sec112c2,10) >= remaLTCGcomplete){
								ltcgPrctg10Sec112c2 = parseInt(ltcgPrctg10Sec112c2,10) - remaLTCGcomplete;
							}else{
								remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg10Sec112c2,10);
								ltcgPrctg10Sec112c2=0;
								if(parseInt(ltcgPrctg10Sec115AC1,10) >= remaLTCGcomplete){
									ltcgPrctg10Sec115AC1 = parseInt(ltcgPrctg10Sec115AC1,10) - remaLTCGcomplete;
								}else{
									remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg10Sec115AC1,10);
									ltcgPrctg10Sec115AC1=0;
									if(parseInt(ltcgPrctg10Sec115ACA1,10) >= remaLTCGcomplete){
										ltcgPrctg10Sec115ACA1 = parseInt(ltcgPrctg10Sec115ACA1,10) - remaLTCGcomplete;
									}else{
										remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg10Sec115ACA1,10);
										ltcgPrctg10Sec115ACA1=0;
										if(parseInt(ltcgPrctg10Sec115AD3,10) >= remaLTCGcomplete){
											ltcgPrctg10Sec115AD3 = parseInt(ltcgPrctg10Sec115AD3,10) - remaLTCGcomplete;
										}else{
											remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg10Sec115AD3,10);
											ltcgPrctg10Sec115AD3=0;
											if(parseInt(ltcgPrctg10Sec115Eb,10) >= remaLTCGcomplete){
												ltcgPrctg10Sec115Eb = parseInt(ltcgPrctg10Sec115Eb,10) - remaLTCGcomplete;
											}else{
												remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg10Sec115Eb,10);
												ltcgPrctg10Sec115Eb=0;
											}
										}
									}
								}
							}
						}
					}
					ltcg10PercntSetOffRem = zeroOrMore(ltcg10PercntSetOffRem - coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff'));
				}else{
					if(!checkIfChanged('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')){
						document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value = tempAk;
						setOffRem=0;
						
						//Section break up

						if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg10Sec112c2, 10) > parseInt(tempAk, 10)){
							ltcgPrctg10Sec112c2 = parseInt(ltcgPrctg10Sec112c2, 10) - 
																	parseInt(tempAk, 10);
							tempAk = 0;
						}else{							
							tempAk = parseInt(tempAk, 10) - 
										parseInt(ltcgPrctg10Sec112c2, 10) ;
							ltcgPrctg10Sec112c2 = 0;
						}	

						if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg10Sec115AC1, 10) > parseInt(tempAk, 10)){
							ltcgPrctg10Sec115AC1 = parseInt(ltcgPrctg10Sec115AC1, 10) - 
																	parseInt(tempAk, 10);
							tempAk = 0;
						}else{							
							tempAk = parseInt(tempAk, 10) - 
										parseInt(ltcgPrctg10Sec115AC1, 10) ;
							ltcgPrctg10Sec115AC1 = 0;
						}

						if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg10Sec115ACA1, 10) > parseInt(tempAk, 10)){
							ltcgPrctg10Sec115ACA1 = parseInt(ltcgPrctg10Sec115ACA1, 10) - 
																	parseInt(tempAk, 10);
							tempAk = 0;
						}else{
							tempAk = parseInt(tempAk, 10) - 
										parseInt(ltcgPrctg10Sec115ACA1, 10) ;
							ltcgPrctg10Sec115ACA1 = 0;
						}	
						
						if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg10Sec115AD3, 10) > parseInt(tempAk, 10)){
							ltcgPrctg10Sec115AD3 = parseInt(ltcgPrctg10Sec115AD3, 10) - 
																	parseInt(tempAk, 10);
							tempAk = 0;
						}else{							
							tempAk = parseInt(tempAk, 10) - 
										parseInt(ltcgPrctg10Sec115AD3, 10) ;
							ltcgPrctg10Sec115AD3 = 0;
						}

						if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg10Sec115Eb, 10) > parseInt(tempAk, 10)){
							ltcgPrctg10Sec115Eb = parseInt(ltcgPrctg10Sec115Eb, 10) - 
																	parseInt(tempAk, 10);
							tempAk = 0;
						}else{							
							tempAk = parseInt(tempAk, 10) - 
										parseInt(ltcgPrctg10Sec115Eb, 10) ;
							ltcgPrctg10Sec115Eb = 0;
						}
						
						if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg10SecProviso, 10) > parseInt(tempAk, 10)){
							ltcgPrctg10SecProviso = parseInt(ltcgPrctg10SecProviso, 10) - parseInt(tempAk, 10);
							tempAk = 0;
						}else{
							tempAk = parseInt(tempAk, 10) - parseInt(ltcgPrctg10SecProviso, 10) ;
							ltcgPrctg10SecProviso = 0;
						}
					}else{
					
						checkHPeditableValidity('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff',
							'scheduleCYLA.ltcg.ltcg10Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff'
							,'scheduleCYLA.totalCurYr.totHPlossCurYr',
							coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
							coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.hPlossCurYrSetoff'));
							
						if(parseInt(ltcgPrctg10SecProviso,10) >= document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value){
							ltcgPrctg10SecProviso = parseInt(ltcgPrctg10SecProviso,10) - document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value;
						}else{
							var remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg10SecProviso,10);
							ltcgPrctg10SecProviso = 0;
							if(parseInt(ltcgPrctg10Sec112c2,10) >= remaLTCGcomplete){
								ltcgPrctg10Sec112c2 = parseInt(ltcgPrctg10Sec112c2,10) - remaLTCGcomplete;
							}else{
								remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg10Sec112c2,10);
								ltcgPrctg10Sec112c2=0;
								if(parseInt(ltcgPrctg10Sec115AC1,10) >= remaLTCGcomplete){
									ltcgPrctg10Sec115AC1 = parseInt(ltcgPrctg10Sec115AC1,10) - remaLTCGcomplete;
								}else{
									remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg10Sec115AC1,10);
									ltcgPrctg10Sec115AC1=0;
									if(parseInt(ltcgPrctg10Sec115ACA1,10) >= remaLTCGcomplete){
										ltcgPrctg10Sec115ACA1 = parseInt(ltcgPrctg10Sec115ACA1,10) - remaLTCGcomplete;
									}else{
										remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg10Sec115ACA1,10);
										ltcgPrctg10Sec115ACA1=0;
										if(parseInt(ltcgPrctg10Sec115AD3,10) >= remaLTCGcomplete){
											ltcgPrctg10Sec115AD3 = parseInt(ltcgPrctg10Sec115AD3,10) - remaLTCGcomplete;
										}else{
											remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg10Sec115AD3,10);
											ltcgPrctg10Sec115AD3=0;
											if(parseInt(ltcgPrctg10Sec115Eb,10) >= remaLTCGcomplete){
												ltcgPrctg10Sec115Eb = parseInt(ltcgPrctg10Sec115Eb,10) - remaLTCGcomplete;
											}else{
												remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg10Sec115Eb,10);
												ltcgPrctg10Sec115Eb=0;
											}
										}
									}
								}
							}
						}
					}
					ltcg10PercntSetOffRem = zeroOrMore(ltcg10PercntSetOffRem - coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff'));
				}
			}else{
				
				if(ltcg10PercntSetOffRem >=0){
					if(!checkIfChanged('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')){
						document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value = parseInt(ltcg10PercntSetOffRem,10);
						ltcg10PercntSetOffRem=0;
						ltcgPrctg10Sec112c2 = 0;
						ltcgPrctg10Sec115AC1 = 0;
						ltcgPrctg10Sec115ACA1 = 0;
						ltcgPrctg10Sec115AD3 = 0;
						ltcgPrctg10Sec115Eb = 0;
						ltcgPrctg10SecProviso = 0;
					}else{
					
						checkHPeditableValidity('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff',
							'scheduleCYLA.ltcg.ltcg10Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff'
							,'scheduleCYLA.totalCurYr.totHPlossCurYr',
							coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr')-
							coalescePath('scheduleCYLA.Salaries.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.hPlossCurYrSetoff')-
							coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.hPlossCurYrSetoff'));
							
						if(parseInt(ltcgPrctg10SecProviso,10) >= document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value){
							ltcgPrctg10SecProviso = parseInt(ltcgPrctg10SecProviso,10) - document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value;
						}else{
							var remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg10SecProviso,10);
							ltcgPrctg10SecProviso = 0;
							if(parseInt(ltcgPrctg10Sec112c2,10) >= remaLTCGcomplete){
								ltcgPrctg10Sec112c2 = parseInt(ltcgPrctg10Sec112c2,10) - remaLTCGcomplete;
							}else{
								remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg10Sec112c2,10);
								ltcgPrctg10Sec112c2=0;
								if(parseInt(ltcgPrctg10Sec115AC1,10) >= remaLTCGcomplete){
									ltcgPrctg10Sec115AC1 = parseInt(ltcgPrctg10Sec115AC1,10) - remaLTCGcomplete;
								}else{
									remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg10Sec115AC1,10);
									ltcgPrctg10Sec115AC1=0;
									if(parseInt(ltcgPrctg10Sec115ACA1,10) >= remaLTCGcomplete){
										ltcgPrctg10Sec115ACA1 = parseInt(ltcgPrctg10Sec115ACA1,10) - remaLTCGcomplete;
									}else{
										remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg10Sec115ACA1,10);
										ltcgPrctg10Sec115ACA1=0;
										if(parseInt(ltcgPrctg10Sec115AD3,10) >= remaLTCGcomplete){
											ltcgPrctg10Sec115AD3 = parseInt(ltcgPrctg10Sec115AD3,10) - remaLTCGcomplete;
										}else{
											remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg10Sec115AD3,10);
											ltcgPrctg10Sec115AD3=0;
											if(parseInt(ltcgPrctg10Sec115Eb,10) >= remaLTCGcomplete){
												ltcgPrctg10Sec115Eb = parseInt(ltcgPrctg10Sec115Eb,10) - remaLTCGcomplete;
											}else{
												remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff')[0].value - parseInt(ltcgPrctg10Sec115Eb,10);
												ltcgPrctg10Sec115Eb=0;
											}
										}
									}
								}
							}
						}
					}
					setOffRem = zeroOrMore(setOffRem - coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.hPlossCurYrSetoff'));
				}
			}
		}
		
		cgosIncome.cgInc.stcg.prctg15.sec111a = stcgPercent15Sec111a;
		cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii = stcgPercent15Sec115ad_1_b_ii;
		cgosIncome.cgInc.ltcg.prctg20.sec112 = ltcgPrctg20Sec112;
		cgosIncome.cgInc.ltcg.prctg20.sec11EA = ltcgPrctg20Sec11EA;
		cgosIncome.cgInc.ltcg.prctg10.secProviso = ltcgPrctg10SecProviso;
		cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2 = ltcgPrctg10Sec112c2;
		cgosIncome.cgInc.ltcg.prctg10.sec115AC_1 = ltcgPrctg10Sec115AC1;
		cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1 = ltcgPrctg10Sec115ACA1;
		cgosIncome.cgInc.ltcg.prctg10.sec115AD_3 = ltcgPrctg10Sec115AD3;
		cgosIncome.cgInc.ltcg.prctg10.sec115E_b = ltcgPrctg10Sec115Eb;
		setOffBussLossCYLA(cgosIncome);
	}catch(e){
		alert('error in setOffHPLossCYLA = ' + e.stack);
	}
}

// Set-Off Other Source Loss for Schedule CYLA.
function setOffOthSrcLossCYLA(cgosIncome){
	try{
		var stcgPercent15Sec111a = zeroOrMore(cgosIncome.cgInc.stcg.prctg15.sec111a);
		var stcgPercent15Sec115ad_1_b_ii = zeroOrMore(cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii);
		var ltcgPrctg20Sec112 = zeroOrMore(cgosIncome.cgInc.ltcg.prctg20.sec112);
		var ltcgPrctg20Sec11EA = zeroOrMore(cgosIncome.cgInc.ltcg.prctg20.sec11EA);
		var ltcgPrctg10SecProviso = zeroOrMore(cgosIncome.cgInc.ltcg.prctg10.secProviso);
		var ltcgPrctg10Sec112c2 = zeroOrMore(cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2);
		var ltcgPrctg10Sec115AC1 = zeroOrMore(cgosIncome.cgInc.ltcg.prctg10.sec115AC_1);
		var ltcgPrctg10Sec115ACA1 = zeroOrMore(cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1);
		var ltcgPrctg10Sec115AD3 = zeroOrMore(cgosIncome.cgInc.ltcg.prctg10.sec115AD_3);
		var ltcgPrctg10Sec115Eb = zeroOrMore(cgosIncome.cgInc.ltcg.prctg10.sec115E_b);
		
		
		document.getElementsByName('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = 0;
				
		if( !checkIfChanged('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff') ){	
			document.getElementsByName('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = 0;			
		}else{			
			checkFirstLessThanMinOthTwo('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff',
					'scheduleCYLA.Salaries.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
					coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
					coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff'));
		}
		
		if( !checkIfChanged('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff') ){			
			document.getElementsByName('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = 0;			
		}else{
			checkFirstLessThanMinOthTwo('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff',
					'scheduleCYLA.houseProperty.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
					coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
					coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff'));
					
		}
		
		document.getElementsByName('scheduleCYLA.busProfInclSpecProf.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = 0;
		document.getElementsByName('scheduleCYLA.speculativeInc.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = 0;
		document.getElementsByName('scheduleCYLA.specifiedInc.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = 0;
		
		if(!checkIfChanged('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff')){			
			document.getElementsByName('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = 0;			
		}else{
			checkFirstLessThanMinOthTwo('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff',
				'scheduleCYLA.stcg.stcg15Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
				coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
				coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
				coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')-
				coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff'));
		}
		
		if( !checkIfChanged('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff')){			
			document.getElementsByName('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = 0 ;			
		}else{
			checkFirstLessThanMinOthTwo('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff',
				'scheduleCYLA.stcg.stcgAppRate.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
				coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
				coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
				coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')-
				coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')-
				coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
		}
		
		if( !checkIfChanged('scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff')){			
			document.getElementsByName('scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = 0 ;			
		}else{
			checkFirstLessThanMinOthTwo('scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff',
				'scheduleCYLA.stcg.stcg15Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
				coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
				coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
				coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')-
				coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')-
				coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff')-
				coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff'));
		}
		
		if( !checkIfChanged('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')){			
			document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = 0 ;			
		}else{
			checkFirstLessThanMinOthTwo('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff',
				'scheduleCYLA.ltcg.ltcg10Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
				coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
				coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
				coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')-
				coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')-
				coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff')-
				coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff')-
				coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
		}
		
		if( !checkIfChanged('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')){			
			document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = 0 ;			
		}else{
			checkFirstLessThanMinOthTwo('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff',
				'scheduleCYLA.ltcg.ltcg20Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
				coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
				coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
				coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')-
				coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')-
				coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff')-
				coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff')-
				coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff')-
				coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
		}
		
		/* 			
		Order of adjustment :-
			1) Profit from owning and maintaining race horses
			2) Salaries
			3) HP Income
			4) Business Income
			5) Speculative Income
			6) specified Income
			7) Short-term capital gain taxable @ 30% 
			8) Short-term capital gain taxable at applicable rates 
			9) Long term capital gain taxable @ 20% (1.cgosIncome.cgInc.ltcg.prctg20.sec112, 2.cgosIncome.cgInc.ltcg.prctg20.sec11EA)
			10) Short-term capital gain taxable @ 15% 
			11) Long term capital gain taxable @ 10% (1. cgosIncome.cgInc.ltcg.prctg10.secProviso,
													2. cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2,
													3. cgosIncome.cgInc.ltcg.prctg10.sec115AC_1,
													4. cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1,
													5. cgosIncome.cgInc.ltcg.prctg10.sec115AD_3,
													6. cgosIncome.cgInc.ltcg.prctg10.sec115E_b)
		*/
		
		var setOffRem = coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
			coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.incOfCurYrUnderThatHead');
			
		// 1. Race Horse
		if(parseInt(setOffRem,10)>=0){
			document.getElementsByName('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value =
					coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.incOfCurYrUnderThatHead');
			
		}else{
			document.getElementsByName('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value =
				coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse');
			setOffRem =0 ;
		}
		
		//2.salary
		var prevSetOffRem = setOffRem;
		setOffRem = parseInt(setOffRem,10) - coalescePath('scheduleCYLA.Salaries.incCYLA.incOfCurYrUnderThatHead');
		
		if(parseInt(setOffRem,10)>=0){
			if( !checkIfChanged('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')){				
				document.getElementsByName('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value =
					coalescePath('scheduleCYLA.Salaries.incCYLA.incOfCurYrUnderThatHead');				
			}else{
				checkFirstLessThanMinOthTwo('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff',
						'scheduleCYLA.Salaries.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
						coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
						coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff'));
				
				setOffRem = parseInt(prevSetOffRem,10) - coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff');
			}
		}else{
			if( !checkIfChanged('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')){				
				document.getElementsByName('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = prevSetOffRem;
			}else{
				checkFirstLessThanMinOthTwo('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff',
						'scheduleCYLA.Salaries.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
						coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
						coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff'));
			}		
			setOffRem =0 ;
		}
		
		//3.House property
		prevSetOffRem = setOffRem;
		setOffRem = parseInt(setOffRem,10) - coalescePath('scheduleCYLA.houseProperty.incCYLA.incOfCurYrUnderThatHead');
		if(parseInt(setOffRem,10)>=0){		
			if( !checkIfChanged('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')){				
				document.getElementsByName('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value =
					coalescePath('scheduleCYLA.houseProperty.incCYLA.incOfCurYrUnderThatHead');				
			}else{
				checkFirstLessThanMinOthTwo('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff',
					'scheduleCYLA.houseProperty.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
					coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
					coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff'));
				
				setOffRem = parseInt(prevSetOffRem,10) - coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff');
			}
		}else{
		
			if( !checkIfChanged('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')){				
				document.getElementsByName('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = prevSetOffRem;				
			}else{				
				checkFirstLessThanMinOthTwo('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff',
					'scheduleCYLA.houseProperty.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
					coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
					coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff'));
			}			
			setOffRem =0 ;
		}
		
		//4. Business Income
		prevSetOffRem = setOffRem;
		setOffRem = parseInt(setOffRem,10) - coalescePath('scheduleCYLA.busProfInclSpecProf.incCYLA.incOfCurYrUnderThatHead');
		if(parseInt(setOffRem,10)>=0){		
			if( !checkIfChanged('scheduleCYLA.busProfInclSpecProf.incCYLA.othSrcLossNoRaceHorseSetoff')){				
				document.getElementsByName('scheduleCYLA.busProfInclSpecProf.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value =
					coalescePath('scheduleCYLA.busProfInclSpecProf.incCYLA.incOfCurYrUnderThatHead');				
			}else{
				checkFirstLessThanMinOthTwo('scheduleCYLA.busProfInclSpecProf.incCYLA.othSrcLossNoRaceHorseSetoff',
					'scheduleCYLA.busProfInclSpecProf.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
					coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
					coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff'));
				
				setOffRem = parseInt(prevSetOffRem,10) - coalescePath('scheduleCYLA.busProfInclSpecProf.incCYLA.othSrcLossNoRaceHorseSetoff');
			}
		}else{
		
			if( !checkIfChanged('scheduleCYLA.busProfInclSpecProf.incCYLA.othSrcLossNoRaceHorseSetoff')){				
				document.getElementsByName('scheduleCYLA.busProfInclSpecProf.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = prevSetOffRem;				
			}else{				
				checkFirstLessThanMinOthTwo('scheduleCYLA.busProfInclSpecProf.incCYLA.othSrcLossNoRaceHorseSetoff',
					'scheduleCYLA.busProfInclSpecProf.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
					coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
					coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff'));
			}			
			setOffRem =0 ;
		}
		
		//5. Speculative Income
		prevSetOffRem = setOffRem;
		setOffRem = parseInt(setOffRem,10) - coalescePath('scheduleCYLA.speculativeInc.incCYLA.incOfCurYrUnderThatHead');
		if(parseInt(setOffRem,10)>=0){		
				document.getElementsByName('scheduleCYLA.speculativeInc.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value =
					coalescePath('scheduleCYLA.speculativeInc.incCYLA.incOfCurYrUnderThatHead');				
		} else{
		
			document.getElementsByName('scheduleCYLA.speculativeInc.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = prevSetOffRem;				
			setOffRem =0 ;
		}
		
		//6. specified Income
		prevSetOffRem = setOffRem;
		setOffRem = parseInt(setOffRem,10) - coalescePath('scheduleCYLA.specifiedInc.incCYLA.incOfCurYrUnderThatHead');
		if(parseInt(setOffRem,10)>=0){		
				document.getElementsByName('scheduleCYLA.specifiedInc.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value =
					coalescePath('scheduleCYLA.specifiedInc.incCYLA.incOfCurYrUnderThatHead');				
		} else{
		
			document.getElementsByName('scheduleCYLA.specifiedInc.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = prevSetOffRem;				
			setOffRem =0 ;
		}
		
		//7. Short-term capital gain taxable @ 30% 
		prevSetOffRem = setOffRem;
		setOffRem = parseInt(setOffRem,10) - coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.incOfCurYrUnderThatHead');
		if(parseInt(setOffRem,10)>=0){
			if( !checkIfChanged('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff')){				
				document.getElementsByName('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value =
					coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.incOfCurYrUnderThatHead');				
			}else{
				checkFirstLessThanMinOthTwo('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff',
					'scheduleCYLA.stcg.stcg30Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
					coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
					coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff'));
				
				setOffRem = parseInt(prevSetOffRem,10) - coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff');
			}
		}else{
		
			if( !checkIfChanged('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff')){				
				document.getElementsByName('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = prevSetOffRem;				
			}else{				
				checkFirstLessThanMinOthTwo('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff',
					'scheduleCYLA.stcg.stcg30Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
					coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
					coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff'));
			}			
			setOffRem =0 ;
		}
		
		//8.Short-term capital gain taxable at applicable rates
		prevSetOffRem = setOffRem;
		setOffRem = parseInt(setOffRem,10) - coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.incOfCurYrUnderThatHead');
		if(parseInt(setOffRem,10)>=0){		
			if( !checkIfChanged('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff')){				
				document.getElementsByName('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value =
					coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.incOfCurYrUnderThatHead');				
			}else{
				checkFirstLessThanMinOthTwo('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff',
					'scheduleCYLA.stcg.stcgAppRate.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
					coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
					coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
				
				setOffRem = parseInt(prevSetOffRem,10) - coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff');
			}
		}else{
		
			if( !checkIfChanged('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff')){				
				document.getElementsByName('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = prevSetOffRem;				
			}else{				
				checkFirstLessThanMinOthTwo('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff',
					'scheduleCYLA.stcg.stcgAppRate.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
					coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
					coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
			}			
			setOffRem =0 ;
		}
		
		// 9)Long term capital gain taxable @ 20%
		prevSetOffRem = setOffRem;
		var ltcgSetOffRem = coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.incOfCurYrUnderThatHead');
		if(ltcgSetOffRem>=0 && setOffRem>=0){
			if(ltcgSetOffRem>=setOffRem){
				var tempAk = setOffRem;
				setOffRem = setOffRem - parseInt(ltcgSetOffRem,10);
				if(setOffRem>=0){
					if(!checkIfChanged('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')){
						document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = parseInt(ltcgSetOffRem,10);
						ltcgPrctg20Sec112 = 0;
						ltcgPrctg20Sec11EA = 0;						
					}else{
						checkFirstLessThanMinOthTwo('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff',
							'scheduleCYLA.ltcg.ltcg20Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
							coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
							coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff'));
							
						if(parseInt(ltcgPrctg20Sec112,10) >= document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value){
							ltcgPrctg20Sec112 = parseInt(ltcgPrctg20Sec112,10) - document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value;
						}else{
							var remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg20Sec112,10);
							ltcgPrctg20Sec112 = 0;
							if(parseInt(ltcgPrctg20Sec11EA,10) >= remaLTCGcomplete){
								ltcgPrctg20Sec11EA = parseInt(ltcgPrctg20Sec11EA,10) - remaLTCGcomplete;
							}else{
								remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg20Sec11EA,10);
								ltcgPrctg20Sec11EA=0;
							}
						}
					}					
					ltcgSetOffRem = zeroOrMore(ltcgSetOffRem - coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
				}else{
					if(!checkIfChanged('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')){
						document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = tempAk;
						setOffRem=0;						
						// sec break up
						if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg20Sec11EA, 10) > parseInt(tempAk, 10)){
							ltcgPrctg20Sec11EA = parseInt(ltcgPrctg20Sec11EA, 10) - 
																	parseInt(tempAk, 10);
							tempAk = 0;
						} else{
							tempAk = parseInt(tempAk, 10) - 
										parseInt(ltcgPrctg20Sec11EA, 10) ;
							ltcgPrctg20Sec11EA = 0;
						}
						
						if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg20Sec112, 10) > parseInt(tempAk, 10)){
							ltcgPrctg20Sec112 = parseInt(ltcgPrctg20Sec112, 10) - 
																	parseInt(tempAk, 10);
							tempAk = 0;
						}else{
							tempAk = parseInt(tempAk, 10) - 
										parseInt(ltcgPrctg20Sec112, 10) ;
							ltcgPrctg20Sec112 = 0;
						}

					}else{
						checkFirstLessThanMinOthTwo('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff',
							'scheduleCYLA.ltcg.ltcg20Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
							coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
							coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff'));
					
						if(parseInt(ltcgPrctg20Sec112,10) >= document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value){
							ltcgPrctg20Sec112 = parseInt(ltcgPrctg20Sec112,10) - document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value;
						}else{
							var remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg20Sec112,10);
							ltcgPrctg20Sec112 = 0;
							if(parseInt(ltcgPrctg20Sec11EA,10) >= remaLTCGcomplete){
								ltcgPrctg20Sec11EA = parseInt(ltcgPrctg20Sec11EA,10) - remaLTCGcomplete;
							}else{
								remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg20Sec11EA,10);
								ltcgPrctg20Sec11EA=0;								
							}
						}
					}
					ltcgSetOffRem = zeroOrMore(ltcgSetOffRem - coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
				}
			}else{
				var prevLtcgSetOffRem= ltcgSetOffRem;
				
				if(ltcgSetOffRem >=0){
					if(!checkIfChanged('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')){
						document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = parseInt(ltcgSetOffRem,10);
						ltcgSetOffRem=0;
						ltcgPrctg20Sec112=0;
						ltcgPrctg20Sec11EA = 0;						
					}else{
					
						checkFirstLessThanMinOthTwo('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff',
							'scheduleCYLA.ltcg.ltcg20Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
							coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
							coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff'));
				
						var remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg20Sec112,10);
						ltcgPrctg20Sec112 = 0;
						if(parseInt(ltcgPrctg20Sec11EA,10) >= remaLTCGcomplete){
							ltcgPrctg20Sec11EA = parseInt(ltcgPrctg20Sec11EA,10) - remaLTCGcomplete;
						}else{
							remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg20Sec11EA,10);
							ltcgPrctg20Sec11EA=0;							
						}
					}
					setOffRem = zeroOrMore(setOffRem - coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
				}else{
					if(!checkIfChanged('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')){
						document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = prevLtcgSetOffRem;					
						ltcgSetOffRem =0 ;
						ltcgPrctg20Sec112=0;
						ltcgPrctg20Sec11EA = 0;	
					}else{
					
						checkFirstLessThanMinOthTwo('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff',
							'scheduleCYLA.ltcg.ltcg20Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
							coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
							coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff'));
							
						var remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg20Sec112,10);
						ltcgPrctg20Sec112 = 0;
						if(parseInt(ltcgPrctg20Sec11EA,10) >= remaLTCGcomplete){
							ltcgPrctg20Sec11EA = parseInt(ltcgPrctg20Sec11EA,10) - remaLTCGcomplete;
						}else{
							remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg20Sec11EA,10);
							ltcgPrctg20Sec11EA=0;
						}
					}
					setOffRem = zeroOrMore(setOffRem - coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
				}
			}
		}
		
		//10.Short-term capital gain taxable @ 15%
		prevSetOffRem = setOffRem;
		setOffRem = parseInt(setOffRem,10) - coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.incOfCurYrUnderThatHead');
		if(parseInt(setOffRem,10)>=0){		
			if( !checkIfChanged('scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff')){				
				document.getElementsByName('scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value =
					coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.incOfCurYrUnderThatHead');
				stcgPercent15Sec111a = 0;
				stcgPercent15Sec115ad_1_b_ii = 0;
			}else{
				checkFirstLessThanMinOthTwo('scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff',
					'scheduleCYLA.stcg.stcg15Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
					coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
					coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
				
				setOffRem = parseInt(prevSetOffRem,10) - coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff');
			}
		}else{
		
			if( !checkIfChanged('scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff')){				
				document.getElementsByName('scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = prevSetOffRem;
				
				// sec break up
				if(parseInt(prevSetOffRem, 10) >= 0 && parseInt(stcgPercent15Sec115ad_1_b_ii, 10) > parseInt(prevSetOffRem, 10)){
					stcgPercent15Sec115ad_1_b_ii = parseInt(stcgPercent15Sec115ad_1_b_ii, 10) - 
															parseInt(prevSetOffRem, 10);
					prevSetOffRem = 0;
				}else{
					prevSetOffRem = parseInt(prevSetOffRem, 10) - 
								parseInt(stcgPercent15Sec115ad_1_b_ii, 10) ;
					stcgPercent15Sec115ad_1_b_ii = 0;
				}

				if(parseInt(prevSetOffRem, 10) >= 0 && parseInt(stcgPercent15Sec111a, 10) > parseInt(prevSetOffRem, 10)){
					stcgPercent15Sec111a = parseInt(stcgPercent15Sec111a, 10) - 
															parseInt(prevSetOffRem, 10);
					prevSetOffRem = 0;
				}else{
					prevSetOffRem = parseInt(prevSetOffRem, 10) - 
								parseInt(stcgPercent15Sec111a, 10) ;
					stcgPercent15Sec111a = 0;
				}
				
				
			}else{				
				checkFirstLessThanMinOthTwo('scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff',
					'scheduleCYLA.stcg.stcg15Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
					coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
					coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff')-
					coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
			}			
			setOffRem =0 ;
		}
		
		// 11)Long term capital gain taxable @ 10%
		prevSetOffRem = setOffRem;
		var ltcgSetOffRem = coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.incOfCurYrUnderThatHead');
		if(ltcgSetOffRem>=0 && setOffRem>=0){
			if(ltcgSetOffRem>=setOffRem){
				var tempAk = setOffRem;
				setOffRem = setOffRem - parseInt(ltcgSetOffRem,10);
				
				if(setOffRem>=0){
					if(!checkIfChanged('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')){
						document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = parseInt(ltcgSetOffRem,10);
						
						ltcgPrctg10Sec112c2 = 0;
						ltcgPrctg10Sec115AC1 = 0;
						ltcgPrctg10Sec115ACA1 = 0;
						ltcgPrctg10Sec115AD3 = 0;
						ltcgPrctg10Sec115Eb = 0;
						ltcgPrctg10SecProviso = 0;
						
					}else{
						checkFirstLessThanMinOthTwo('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff',
							'scheduleCYLA.ltcg.ltcg10Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
							coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
							coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
							
						if(parseInt(ltcgPrctg10SecProviso,10) >= document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value){
							ltcgPrctg10SecProviso = parseInt(ltcgPrctg10SecProviso,10) - document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value;
						}else{
							var remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg10SecProviso,10);
							ltcgPrctg10SecProviso = 0;
							if(parseInt(ltcgPrctg10Sec112c2,10) >= remaLTCGcomplete){
								ltcgPrctg10Sec112c2 = parseInt(ltcgPrctg10Sec112c2,10) - remaLTCGcomplete;
							}else{
								remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg10Sec112c2,10);
								ltcgPrctg10Sec112c2=0;
								if(parseInt(ltcgPrctg10Sec115AC1,10) >= remaLTCGcomplete){
									ltcgPrctg10Sec115AC1 = parseInt(ltcgPrctg10Sec115AC1,10) - remaLTCGcomplete;
								}else{
									remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg10Sec115AC1,10);
									ltcgPrctg10Sec115AC1=0;
									if(parseInt(ltcgPrctg10Sec115ACA1,10) >= remaLTCGcomplete){
										ltcgPrctg10Sec115ACA1 = parseInt(ltcgPrctg10Sec115ACA1,10) - remaLTCGcomplete;
									}else{
										remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg10Sec115ACA1,10);
										ltcgPrctg10Sec115ACA1=0;
										if(parseInt(ltcgPrctg10Sec115AD3,10) >= remaLTCGcomplete){
											ltcgPrctg10Sec115AD3 = parseInt(ltcgPrctg10Sec115AD3,10) - remaLTCGcomplete;
										}else{
											remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg10Sec115AD3,10);
											ltcgPrctg10Sec115AD3=0;
											if(parseInt(ltcgPrctg10Sec115Eb,10) >= remaLTCGcomplete){
												ltcgPrctg10Sec115Eb = parseInt(ltcgPrctg10Sec115Eb,10) - remaLTCGcomplete;
											}else{
												ltcgPrctg10Sec115Eb=0;
											}
										}
									}
								}
							}
						}
					}					
					ltcgSetOffRem = zeroOrMore(ltcgSetOffRem - coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
				}else{
					if(!checkIfChanged('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')){
						document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = tempAk;
						setOffRem=0;						
						//Section break up
	
							if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg10Sec112c2, 10) > parseInt(tempAk, 10)){
								ltcgPrctg10Sec112c2 = parseInt(ltcgPrctg10Sec112c2, 10) - 
																		parseInt(tempAk, 10);
								tempAk = 0;
							}else{
								tempAk = parseInt(tempAk, 10) - 
											parseInt(ltcgPrctg10Sec112c2, 10) ;
								ltcgPrctg10Sec112c2 = 0;
							}	
	
							if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg10Sec115AC1, 10) > parseInt(tempAk, 10)){
								ltcgPrctg10Sec115AC1 = parseInt(ltcgPrctg10Sec115AC1, 10) - 
																		parseInt(tempAk, 10);
								tempAk = 0;
							}else{
								tempAk = parseInt(tempAk, 10) - 
											parseInt(ltcgPrctg10Sec115AC1, 10) ;
								ltcgPrctg10Sec115AC1 = 0;
							}
	
							if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg10Sec115ACA1, 10) > parseInt(tempAk, 10)){
								ltcgPrctg10Sec115ACA1 = parseInt(ltcgPrctg10Sec115ACA1, 10) - 
																		parseInt(tempAk, 10);
								tempAk = 0;
							}else{								
								tempAk = parseInt(tempAk, 10) - 
											parseInt(ltcgPrctg10Sec115ACA1, 10) ;
								ltcgPrctg10Sec115ACA1 = 0;
							}	
							
							if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg10Sec115AD3, 10) > parseInt(tempAk, 10)){
								ltcgPrctg10Sec115AD3 = parseInt(ltcgPrctg10Sec115AD3, 10) - 
																		parseInt(tempAk, 10);
								tempAk = 0;
							}else{								
								tempAk = parseInt(tempAk, 10) - 
											parseInt(ltcgPrctg10Sec115AD3, 10) ;
								ltcgPrctg10Sec115AD3 = 0;
							}
							if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg10Sec115Eb, 10) > parseInt(tempAk, 10)){
								ltcgPrctg10Sec115Eb = parseInt(ltcgPrctg10Sec115Eb, 10) - 
																		parseInt(tempAk, 10);
								tempAk = 0;
							}else{
								tempAk = parseInt(tempAk, 10) - 
											parseInt(ltcgPrctg10Sec115Eb, 10) ;
								ltcgPrctg10Sec115Eb = 0;
							}
							if(parseInt(tempAk, 10) >= 0 && parseInt(ltcgPrctg10SecProviso, 10) > parseInt(tempAk, 10)){
								ltcgPrctg10SecProviso = parseInt(ltcgPrctg10SecProviso, 10) - parseInt(tempAk, 10);
								tempAk = 0;
							} else{
								tempAk = parseInt(tempAk, 10) - parseInt(ltcgPrctg10SecProviso, 10) ;
								ltcgPrctg10SecProviso = 0;
							}
					}else{
						checkFirstLessThanMinOthTwo('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff',
							'scheduleCYLA.ltcg.ltcg10Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
							coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
							coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
					
						if(parseInt(ltcgPrctg10SecProviso,10) >= document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value){
							ltcgPrctg10SecProviso = parseInt(ltcgPrctg10SecProviso,10) - document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value;
						}else{
							var remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg10SecProviso,10);
							ltcgPrctg10SecProviso = 0;
							if(parseInt(ltcgPrctg10Sec112c2,10) >= remaLTCGcomplete){
								ltcgPrctg10Sec112c2 = parseInt(ltcgPrctg10Sec112c2,10) - remaLTCGcomplete;
							}else{
								remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg10Sec112c2,10);
								ltcgPrctg10Sec112c2=0;
								if(parseInt(ltcgPrctg10Sec115AC1,10) >= remaLTCGcomplete){
									ltcgPrctg10Sec115AC1 = parseInt(ltcgPrctg10Sec115AC1,10) - remaLTCGcomplete;
								}else{
									remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg10Sec115AC1,10);
									ltcgPrctg10Sec115AC1=0;
									if(parseInt(ltcgPrctg10Sec115ACA1,10) >= remaLTCGcomplete){
										ltcgPrctg10Sec115ACA1 = parseInt(ltcgPrctg10Sec115ACA1,10) - remaLTCGcomplete;
									}else{
										remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg10Sec115ACA1,10);
										ltcgPrctg10Sec115ACA1=0;
										if(parseInt(ltcgPrctg10Sec115AD3,10) >= remaLTCGcomplete){
											ltcgPrctg10Sec115AD3 = parseInt(ltcgPrctg10Sec115AD3,10) - remaLTCGcomplete;
										}else{
											remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg10Sec115AD3,10);
											ltcgPrctg10Sec115AD3=0;
											if(parseInt(ltcgPrctg10Sec115Eb,10) >= remaLTCGcomplete){
												ltcgPrctg10Sec115Eb = parseInt(ltcgPrctg10Sec115Eb,10) - remaLTCGcomplete;
											}else{
												ltcgPrctg10Sec115Eb=0;
											}
										}
									}
								}
							}
						}
					}
					ltcgSetOffRem = zeroOrMore(ltcgSetOffRem - coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
				}
			}else{
				
				if(ltcgSetOffRem >=0){
					if(!checkIfChanged('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')){
						document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value = parseInt(ltcgSetOffRem,10);
						ltcgSetOffRem=0;
						ltcgPrctg10Sec112c2 = 0;
						ltcgPrctg10Sec115AC1 = 0;
						ltcgPrctg10Sec115ACA1 = 0;
						ltcgPrctg10Sec115AD3 = 0;
						ltcgPrctg10Sec115Eb = 0;
						ltcgPrctg10SecProviso = 0;
					}else{
					
						checkFirstLessThanMinOthTwo('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff',
							'scheduleCYLA.ltcg.ltcg10Per.incCYLA.incOfCurYrUnderThatHead','scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse',
							coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')-
							coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.Salaries.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.houseProperty.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.othSrcLossNoRaceHorseSetoff')-
							coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
				
						var remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg10SecProviso,10);
						ltcgPrctg10SecProviso = 0;
						if(parseInt(ltcgPrctg10Sec112c2,10) >= remaLTCGcomplete){
							ltcgPrctg10Sec112c2 = parseInt(ltcgPrctg10Sec112c2,10) - remaLTCGcomplete;
						}else{
							remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg10Sec112c2,10);
							ltcgPrctg10Sec112c2=0;
							if(parseInt(ltcgPrctg10Sec115AC1,10) >= remaLTCGcomplete){
								ltcgPrctg10Sec115AC1 = parseInt(ltcgPrctg10Sec115AC1,10) - remaLTCGcomplete;
							}else{
								remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg10Sec115AC1,10);
								ltcgPrctg10Sec115AC1=0;
								if(parseInt(ltcgPrctg10Sec115ACA1,10) >= remaLTCGcomplete){
									ltcgPrctg10Sec115ACA1 = parseInt(ltcgPrctg10Sec115ACA1,10) - remaLTCGcomplete;
								}else{
									remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg10Sec115ACA1,10);
									ltcgPrctg10Sec115ACA1=0;
									if(parseInt(ltcgPrctg10Sec115AD3,10) >= remaLTCGcomplete){
										ltcgPrctg10Sec115AD3 = parseInt(ltcgPrctg10Sec115AD3,10) - remaLTCGcomplete;
									}else{
										remaLTCGcomplete = document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff')[0].value - parseInt(ltcgPrctg10Sec115AD3,10);
										ltcgPrctg10Sec115AD3=0;
										if(parseInt(ltcgPrctg10Sec115Eb,10) >= remaLTCGcomplete){
											ltcgPrctg10Sec115Eb = parseInt(ltcgPrctg10Sec115Eb,10) - remaLTCGcomplete;
										}else{
											ltcgPrctg10Sec115Eb=0;
										}
									}
								}
							}
						}
					}
					setOffRem = zeroOrMore(setOffRem - coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.othSrcLossNoRaceHorseSetoff'));
				}
			}
		}
		cgosIncome.cgInc.stcg.prctg15.sec111a = stcgPercent15Sec111a;
		cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii = stcgPercent15Sec115ad_1_b_ii;
		cgosIncome.cgInc.ltcg.prctg20.sec112 = ltcgPrctg20Sec112;
		cgosIncome.cgInc.ltcg.prctg20.sec11EA = ltcgPrctg20Sec11EA;
		cgosIncome.cgInc.ltcg.prctg10.secProviso = ltcgPrctg10SecProviso;
		cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2 = ltcgPrctg10Sec112c2;
		cgosIncome.cgInc.ltcg.prctg10.sec115AC_1 = ltcgPrctg10Sec115AC1;
		cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1 = ltcgPrctg10Sec115ACA1;
		cgosIncome.cgInc.ltcg.prctg10.sec115AD_3 = ltcgPrctg10Sec115AD3;
		cgosIncome.cgInc.ltcg.prctg10.sec115E_b = ltcgPrctg10Sec115Eb;
		
		setOffHPLossCYLA(cgosIncome);
	}catch(e){
		alert('error in setOffOthSrcLossCYLA()=' + e.stack);
	}
}

// Prefill schedule CYLA.
function prefillCYLA(){
	try{
		
		//prefilling column :: Income of current year Salaries  (Fill this column only if income is zero or positive) - House Property
		//Field 7 of Sch s , only if field 7 is positive
		document.getElementsByName('scheduleCYLA.Salaries.incCYLA.incOfCurYrUnderThatHead')[0].value =
			zeroOrMore(coalescePath('scheduleS.incomeChargeable'));
		
		//Field 3c of Schedule HP) , only if 3c is positive
		document.getElementsByName('scheduleCYLA.houseProperty.incCYLA.incOfCurYrUnderThatHead')[0].value =
			zeroOrMore(coalescePath('scheduleHP.totalIncomeChargeableUnHP'));
		
		
		//prefilling column :: Income of current year (Fill this column only if income is zero or positive)- Business (excluding speculation income and income from specified business)
		// A37 of Sch BP,only if A37 is positive
		coalescePath('scheduleCYLA.busProfInclSpecProf.incCYLA.incOfCurYrUnderThatHead');
		coalescePath('scheduleCYLA.speculativeInc.incCYLA.incOfCurYrUnderThatHead');
		coalescePath('scheduleCYLA.specifiedInc.incCYLA.incOfCurYrUnderThatHead');
		
		// Business income
		document.getElementsByName('scheduleCYLA.busProfInclSpecProf.incCYLA.incOfCurYrUnderThatHead')[0].value =
			zeroOrMore(coalescePath('itr4ScheduleBP.businessIncOthThanSpec.netPLBusOthThanSpec7A7B7C'));
		
		// Speculative Income
		document.getElementsByName('scheduleCYLA.speculativeInc.incCYLA.incOfCurYrUnderThatHead')[0].value =
			zeroOrMore(coalescePath('itr4ScheduleBP.busSetoffCurYr.speculativeInc.incOfCurYrAfterSetOff'));
		
		// Specified Business Income
		document.getElementsByName('scheduleCYLA.specifiedInc.incCYLA.incOfCurYrUnderThatHead')[0].value =
			zeroOrMore(coalescePath('itr4ScheduleBP.busSetoffCurYr.specifiedInc.incOfCurYrAfterSetOff'));
				
		//prefilling column :: Short-term capital gain taxable @ 15%
		//Field (7ii of item E of schedule CG)
		document.getElementsByName('scheduleCYLA.stcg.stcg15Per.incCYLA.incOfCurYrUnderThatHead')[0].value =
			coalescePath('scheduleCGPost45.currYrLosses.inStcg15Per.CurrYrLosSetOff');
		
		//prefilling column :: Short-term capital gain taxable @ 30%
		//Field (7iii of item E of schedule CG)
		document.getElementsByName('scheduleCYLA.stcg.stcg30Per.incCYLA.incOfCurYrUnderThatHead')[0].value =
			coalescePath('scheduleCGPost45.currYrLosses.inStcg30Per.currYrLosSetOff');
			
		//prefilling column :: Short-term capital gain taxable at applicable rates
		//Field (7iv of item E of schedule CG)
		document.getElementsByName('scheduleCYLA.stcg.stcgAppRate.incCYLA.incOfCurYrUnderThatHead')[0].value =
			coalescePath('scheduleCGPost45.currYrLosses.inStcgAppRate.currYrLosSetOff');
			
		//prefilling column :: Long term capital gain taxable @ 10%
		//Field (7v of item E of schedule CG)
		document.getElementsByName('scheduleCYLA.ltcg.ltcg10Per.incCYLA.incOfCurYrUnderThatHead')[0].value =
			coalescePath('scheduleCGPost45.currYrLosses.inLtcg10Per.currYrLosSetOff');
		
		//prefilling column :: Long term capital gain taxable @ 20%
		//Field (7vi of item E of schedule CG)
		document.getElementsByName('scheduleCYLA.ltcg.ltcg20Per.incCYLA.incOfCurYrUnderThatHead')[0].value =
			coalescePath('scheduleCGPost45.currYrLosses.inLtcg20Per.CurrYrLosSetOff');
			
		//prefilling column :: Other sources income
		//Field (1i of schedule OS)
		document.getElementsByName('scheduleCYLA.othSrcInclRaceHorse.incCYLA.incOfCurYrUnderThatHead')[0].value =
			zeroOrMore(coalescePath('scheduleOS.balanceNoRaceHorse'));
		
		//prefilling column :: Profit from owning and maintaining race horses
		//Field (3c of schedule OS)
		document.getElementsByName('scheduleCYLA.profitFrmRaceHorse.incCYLA.incOfCurYrUnderThatHead')[0].value =
			zeroOrMore(coalescePath('scheduleOS.incFromOwnHorse.balanceOwnRaceHorse'));
		
		// populating losses in the respective heads
		coalescePath('scheduleCYLA.totalCurYr.totHPlossCurYr');
		if(!isPostv('scheduleHP.totalIncomeChargeableUnHP')){
			document.getElementsByName('scheduleCYLA.totalCurYr.totHPlossCurYr')[0].value =
				Math.abs(coalescePath('scheduleHP.totalIncomeChargeableUnHP'));
		}else{
			document.getElementsByName('scheduleCYLA.totalCurYr.totHPlossCurYr')[0].value = 0;
		}
		
		coalescePath('scheduleCYLA.totalCurYr.totBusLoss');
		document.getElementsByName('scheduleCYLA.totalCurYr.totBusLoss')[0].value =
			coalescePath('itr4ScheduleBP.busSetoffCurYr.lossRemainSetOffOnBus');
		
		coalescePath('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse');
		if(!isPostv('scheduleOS.balanceNoRaceHorse')){			
			document.getElementsByName('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')[0].value = 
				Math.abs(coalescePath('scheduleOS.balanceNoRaceHorse')) ;
		}else{
			document.getElementsByName('scheduleCYLA.totalCurYr.totOthSrcLossNoRaceHorse')[0].value = 0;
		}

	}catch(e){
		alert('error in prefillCYLA()=' + e.stack);
	}
}

// Prefill schedule BFLA.
function prefillBFLA(){
	try{

		document.getElementsByName('scheduleBFLA.salary.incBFLA.incOfCurYrUndHeadFromCYLA')[0].value = coalescePath('scheduleCYLA.Salaries.incCYLA.incOfCurYrAfterSetOff');
		document.getElementsByName('scheduleBFLA.salary.incBFLA.incOfCurYrAfterSetOffBFLosses')[0].value = coalescePath('scheduleCYLA.Salaries.incCYLA.incOfCurYrAfterSetOff');
		document.getElementsByName('scheduleBFLA.hp.incBFLA.incOfCurYrUndHeadFromCYLA')[0].value = coalescePath('scheduleCYLA.houseProperty.incCYLA.incOfCurYrAfterSetOff');
		document.getElementsByName('scheduleBFLA.busProfInclSpecProf.incBFLA.incOfCurYrUndHeadFromCYLA')[0].value =  coalescePath('scheduleCYLA.busProfInclSpecProf.incCYLA.incOfCurYrAfterSetOff');
		document.getElementsByName('scheduleBFLA.speculativeInc.incBFLA.incOfCurYrUndHeadFromCYLA')[0].value =  coalescePath('scheduleCYLA.speculativeInc.incCYLA.incOfCurYrAfterSetOff');
		document.getElementsByName('scheduleBFLA.specifiedInc.incBFLA.incOfCurYrUndHeadFromCYLA')[0].value =  coalescePath('scheduleCYLA.specifiedInc.incCYLA.incOfCurYrAfterSetOff');
		document.getElementsByName('scheduleBFLA.stcg.stcg15Per.incBFLA.incOfCurYrUndHeadFromCYLA')[0].value =  coalescePath('scheduleCYLA.stcg.stcg15Per.incCYLA.incOfCurYrAfterSetOff');//4iv of CYLA --> 3i of BFLA
		document.getElementsByName('scheduleBFLA.stcg.stcg30Per.incBFLA.incOfCurYrUndHeadFromCYLA')[0].value =  coalescePath('scheduleCYLA.stcg.stcg30Per.incCYLA.incOfCurYrAfterSetOff');//4v of CYLA --> 4i of BFLA
		document.getElementsByName('scheduleBFLA.stcg.stcgAppRate.incBFLA.incOfCurYrUndHeadFromCYLA')[0].value =  coalescePath('scheduleCYLA.stcg.stcgAppRate.incCYLA.incOfCurYrAfterSetOff');//4Vi of CYLA --> 5i of BFLA 
		document.getElementsByName('scheduleBFLA.ltcg.ltcg10Per.incBFLA.incOfCurYrUndHeadFromCYLA')[0].value =  coalescePath('scheduleCYLA.ltcg.ltcg10Per.incCYLA.incOfCurYrAfterSetOff');//4Vii of CYLA --> 6i of BFLA
		document.getElementsByName('scheduleBFLA.ltcg.ltcg20Per.incBFLA.incOfCurYrUndHeadFromCYLA')[0].value =  coalescePath('scheduleCYLA.ltcg.ltcg20Per.incCYLA.incOfCurYrAfterSetOff');//4Viii of CYLA --> 7i of BFLA
		document.getElementsByName('scheduleBFLA.othSrcInclRaceHorse.incBFLA.incOfCurYrUndHeadFromCYLA')[0].value =  coalescePath('scheduleCYLA.othSrcInclRaceHorse.incCYLA.incOfCurYrAfterSetOff');
		document.getElementsByName('scheduleBFLA.profitFrmRaceHorse.incBFLA.incOfCurYrUndHeadFromCYLA')[0].value =  coalescePath('scheduleCYLA.profitFrmRaceHorse.incCYLA.incOfCurYrAfterSetOff');


	}catch(e){
		alert('error in prefillBFLA' + e.stack);
	}
}

function setFirstToSecondMax(first,second,target){
	try{
		if(coalescePath(first) > coalescePath(second)){
			document.getElementsByName(target)[0].value= coalescePath(second);
		}else{
			document.getElementsByName(target)[0].value= coalescePath(first);
		}
	}catch(e){
		alert('error in setFirstToSecondMax= '+e.stack );
	}
}

// Calculate Income for BFLA.
function calcBFLA(cgosIncome){
	try{
		prefillBFLA();
		calcCFL_sumAll();
		setFirstToSecondMax('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.hpLossCF',
							'scheduleBFLA.hp.incBFLA.incOfCurYrUndHeadFromCYLA',
							'scheduleBFLA.hp.incBFLA.bFlossPrevYrUndSameHeadSetoff');

		setFirstToSecondMax('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.busLossOthThanSpecLossCF',
							'scheduleBFLA.busProfInclSpecProf.incBFLA.incOfCurYrUndHeadFromCYLA',
							'scheduleBFLA.busProfInclSpecProf.incBFLA.bFlossPrevYrUndSameHeadSetoff');

		setFirstToSecondMax('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.lossFrmSpecBusCF',
							'scheduleBFLA.speculativeInc.incBFLA.incOfCurYrUndHeadFromCYLA',
							'scheduleBFLA.speculativeInc.incBFLA.bFlossPrevYrUndSameHeadSetoff');

		var specltvIncSetOff = document.getElementsByName('scheduleBFLA.speculativeInc.incBFLA.bFlossPrevYrUndSameHeadSetoff')[0].value ;
		
		setFirstToSecondMax('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.lossFrmSpecifiedBusCF',
							'scheduleBFLA.specifiedInc.incBFLA.incOfCurYrUndHeadFromCYLA',
							'scheduleBFLA.specifiedInc.incBFLA.bFlossPrevYrUndSameHeadSetoff');
		
		var specfdIncSetOff = document.getElementsByName('scheduleBFLA.specifiedInc.incBFLA.bFlossPrevYrUndSameHeadSetoff')[0].value ;

		
		setFirstToSecondMax('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.stcgLossCF',
						'scheduleBFLA.stcg.stcg30Per.incBFLA.incOfCurYrUndHeadFromCYLA',
						'scheduleBFLA.stcg.stcg30Per.incBFLA.bFlossPrevYrUndSameHeadSetoff');
						
		setFirstToSecondMax('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.stcgLossCF',
						'scheduleBFLA.stcg.stcgAppRate.incBFLA.incOfCurYrUndHeadFromCYLA',
						'scheduleBFLA.stcg.stcgAppRate.incBFLA.bFlossPrevYrUndSameHeadSetoff');
		
		setFirstToSecondMax('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.stcgLossCF',
						'scheduleBFLA.stcg.stcg15Per.incBFLA.incOfCurYrUndHeadFromCYLA',
						'scheduleBFLA.stcg.stcg15Per.incBFLA.bFlossPrevYrUndSameHeadSetoff');
		setFirstToSecondMax('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.ltcgLossCF',
						'scheduleBFLA.ltcg.ltcg10Per.incBFLA.incOfCurYrUndHeadFromCYLA',
						'scheduleBFLA.ltcg.ltcg10Per.incBFLA.bFlossPrevYrUndSameHeadSetoff');
		setFirstToSecondMax('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.ltcgLossCF',
						'scheduleBFLA.ltcg.ltcg20Per.incBFLA.incOfCurYrUndHeadFromCYLA',
						'scheduleBFLA.ltcg.ltcg20Per.incBFLA.bFlossPrevYrUndSameHeadSetoff');

		setFirstToSecondMax('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.othSrcLossRaceHorseCF',
							'scheduleBFLA.profitFrmRaceHorse.incBFLA.incOfCurYrUndHeadFromCYLA',
							'scheduleBFLA.profitFrmRaceHorse.incBFLA.bFlossPrevYrUndSameHeadSetoff');

		// setting off loss from business		
		var setOffBusLoss = coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.busLossOthThanSpecLossCF')-
		coalescePath('scheduleBFLA.busProfInclSpecProf.incBFLA.bFlossPrevYrUndSameHeadSetoff');											
		
				//b
		var setOffNotDoneInSpecInc = coalescePath('scheduleBFLA.speculativeInc.incBFLA.incOfCurYrUndHeadFromCYLA')-
			coalescePath('scheduleBFLA.speculativeInc.incBFLA.bFlossPrevYrUndSameHeadSetoff');
		var prevSetOffBusLoss = setOffBusLoss;
		setOffBusLoss = setOffBusLoss - setOffNotDoneInSpecInc;
		if(setOffBusLoss>=0){
			document.getElementsByName('scheduleBFLA.speculativeInc.incBFLA.bFlossPrevYrUndSameHeadSetoff')[0].value = 
				coalescePath('scheduleBFLA.speculativeInc.incBFLA.bFlossPrevYrUndSameHeadSetoff') + setOffNotDoneInSpecInc;			
		}else{
			document.getElementsByName('scheduleBFLA.speculativeInc.incBFLA.bFlossPrevYrUndSameHeadSetoff')[0].value = 
				coalescePath('scheduleBFLA.speculativeInc.incBFLA.bFlossPrevYrUndSameHeadSetoff') + prevSetOffBusLoss;			
			setOffBusLoss = 0;
		}
		
				//c
		var setOffNotDoneInSpecfdInc = coalescePath('scheduleBFLA.specifiedInc.incBFLA.incOfCurYrUndHeadFromCYLA')-
			coalescePath('scheduleBFLA.specifiedInc.incBFLA.bFlossPrevYrUndSameHeadSetoff');
		prevSetOffBusLoss = setOffBusLoss;
		setOffBusLoss = setOffBusLoss - setOffNotDoneInSpecfdInc;
		if(setOffBusLoss>=0){
			document.getElementsByName('scheduleBFLA.specifiedInc.incBFLA.bFlossPrevYrUndSameHeadSetoff')[0].value = 
				coalescePath('scheduleBFLA.specifiedInc.incBFLA.bFlossPrevYrUndSameHeadSetoff') + setOffNotDoneInSpecfdInc;			
			
		}else{
			document.getElementsByName('scheduleBFLA.specifiedInc.incBFLA.bFlossPrevYrUndSameHeadSetoff')[0].value = 
				coalescePath('scheduleBFLA.specifiedInc.incBFLA.bFlossPrevYrUndSameHeadSetoff') + prevSetOffBusLoss;			
			setOffBusLoss = 0;
		}
		
		
		//setting off STCG and LTCG
		var stcgCFL = coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.stcgLossCF');  var tempstcgCFL = stcgCFL;
		var ltcgCFL = coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.ltcgLossCF');	 var tempLtcgCFL = ltcgCFL;
		
		var stcgBreakUp1  = cgosIncome.cgInc.stcg.prctg30;
		var stcgBreakUp2  = cgosIncome.cgInc.stcg.prctgAr;
		var stcgBreakUp3  = cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii;
		var stcgBreakUp4  = cgosIncome.cgInc.stcg.prctg15.sec111a;
		
		var ltcgBreakUp2 = cgosIncome.cgInc.ltcg.prctg20.sec11EA;
		var ltcgBreakUp1 = cgosIncome.cgInc.ltcg.prctg20.sec112;
		var ltcgBreakUp4 = cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2;
		var ltcgBreakUp5 = cgosIncome.cgInc.ltcg.prctg10.sec115AC_1;
		var ltcgBreakUp6 = cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1;
		var ltcgBreakUp7 = cgosIncome.cgInc.ltcg.prctg10.sec115AD_3;
		var ltcgBreakUp8 = cgosIncome.cgInc.ltcg.prctg10.sec115E_b;
		var ltcgBreakUp3 = cgosIncome.cgInc.ltcg.prctg10.secProviso;
		
		var tempstcgBreakUp1  = parseInt(stcgBreakUp1,10);
		var tempstcgBreakUp2  = parseInt(stcgBreakUp2,10);
		var tempstcgBreakUp3  = parseInt(stcgBreakUp3,10);
		var tempstcgBreakUp4  = parseInt(stcgBreakUp4,10);
		
		var templtcgBreakUp1 = parseInt(ltcgBreakUp1,10);
		var templtcgBreakUp2 = parseInt(ltcgBreakUp2,10);
		var templtcgBreakUp3 = parseInt(ltcgBreakUp3,10);
		var templtcgBreakUp4 = parseInt(ltcgBreakUp4,10);
		var templtcgBreakUp5 = parseInt(ltcgBreakUp5,10);
		var templtcgBreakUp6 = parseInt(ltcgBreakUp6,10);
		var templtcgBreakUp7 = parseInt(ltcgBreakUp7,10);
		var templtcgBreakUp8 = parseInt(ltcgBreakUp8,10);
		
		
		//stage-1 setting off LTCG_CFL
		//setting with templtcgBreakUp1
		
		if(tempLtcgCFL>templtcgBreakUp2){
			tempLtcgCFL = tempLtcgCFL - templtcgBreakUp2;
			templtcgBreakUp2 =0;
		}else{
			templtcgBreakUp2 = zeroOrMore(templtcgBreakUp2 - tempLtcgCFL);
			tempLtcgCFL=0;
		}
		
		if(tempLtcgCFL>templtcgBreakUp1){
			tempLtcgCFL = tempLtcgCFL - templtcgBreakUp1;
			templtcgBreakUp1 =0;
		}else{
			templtcgBreakUp1 = zeroOrMore(templtcgBreakUp1 - tempLtcgCFL);
			tempLtcgCFL=0;
		}
		
		if(tempLtcgCFL>templtcgBreakUp4){
			tempLtcgCFL = tempLtcgCFL - templtcgBreakUp4;
			templtcgBreakUp4 =0;
		}else{
			templtcgBreakUp4= zeroOrMore(templtcgBreakUp4 - tempLtcgCFL);
			tempLtcgCFL=0;
		}
		
		if(tempLtcgCFL>templtcgBreakUp5){
			tempLtcgCFL = tempLtcgCFL - templtcgBreakUp5;
			templtcgBreakUp5 =0;
		}else{
			templtcgBreakUp5 = zeroOrMore(templtcgBreakUp5 - tempLtcgCFL);
			tempLtcgCFL=0;
		}
		
		if(tempLtcgCFL>templtcgBreakUp6){
			tempLtcgCFL = tempLtcgCFL - templtcgBreakUp6;
			templtcgBreakUp6 =0;
		}else{
			templtcgBreakUp6 = zeroOrMore(templtcgBreakUp6 - tempLtcgCFL);
			tempLtcgCFL=0;
		}
		
		if(tempLtcgCFL>templtcgBreakUp7){
			tempLtcgCFL = tempLtcgCFL - templtcgBreakUp7;
			templtcgBreakUp7 =0;
		}else{
			templtcgBreakUp7 = zeroOrMore(templtcgBreakUp7 - tempLtcgCFL);
			tempLtcgCFL=0;
		}
		
		if(tempLtcgCFL>templtcgBreakUp8){
			tempLtcgCFL = tempLtcgCFL - templtcgBreakUp8;
			templtcgBreakUp8 =0;
		}else{
			templtcgBreakUp8 = zeroOrMore(templtcgBreakUp8 - tempLtcgCFL);
			tempLtcgCFL=0;
		}
		
		
		if(tempLtcgCFL>templtcgBreakUp3){
			tempLtcgCFL = tempLtcgCFL - templtcgBreakUp3;
			templtcgBreakUp3 =0;
		}else{
			templtcgBreakUp3 = zeroOrMore(templtcgBreakUp3 - tempLtcgCFL);
			tempLtcgCFL=0;
		}
		
		//setting the "adjustment of above losses in BFLA" - LTCG value in CFL
		document.getElementsByName('scheduleCFL.adjTotBFLossInBFLA.lossSummaryDetail.ltcgLossCF')[0].value = 
				parseInt(zeroOrMore(parseInt(ltcgBreakUp1,10) - templtcgBreakUp1),10) +
				parseInt(zeroOrMore(parseInt(ltcgBreakUp2,10) - templtcgBreakUp2),10) +
				parseInt(zeroOrMore(parseInt(ltcgBreakUp3,10) - templtcgBreakUp3),10) +
				parseInt(zeroOrMore(parseInt(ltcgBreakUp4,10) - templtcgBreakUp4),10) +
				parseInt(zeroOrMore(parseInt(ltcgBreakUp5,10) - templtcgBreakUp5),10) +
				parseInt(zeroOrMore(parseInt(ltcgBreakUp6,10) - templtcgBreakUp6),10) +
				parseInt(zeroOrMore(parseInt(ltcgBreakUp7,10) - templtcgBreakUp7),10) +
				parseInt(zeroOrMore(parseInt(ltcgBreakUp8,10) - templtcgBreakUp8),10) ;
				
		
		
		var storeSTCG1 = tempstcgBreakUp1;
		var storeSTCG2 = tempstcgBreakUp2;
		var storeSTCG3 = tempstcgBreakUp3;
		var storeSTCG4 = tempstcgBreakUp4;
		var storeLTCG1 = templtcgBreakUp1;
		var storeLTCG2 = templtcgBreakUp2;
		var storeLTCG3 = templtcgBreakUp3;
		var storeLTCG4 = templtcgBreakUp4;
		var storeLTCG5 = templtcgBreakUp5;
		var storeLTCG6 = templtcgBreakUp6;
		var storeLTCG7 = templtcgBreakUp7;
		var storeLTCG8 = templtcgBreakUp8;
		
		
		
		if(tempstcgCFL>tempstcgBreakUp1){
			tempstcgCFL = tempstcgCFL - tempstcgBreakUp1;
			tempstcgBreakUp1 =0;
		}else{
			tempstcgBreakUp1 = zeroOrMore(tempstcgBreakUp1 - tempstcgCFL);
			tempstcgCFL=0;
		}
		
		if(tempstcgCFL>tempstcgBreakUp2){
			tempstcgCFL = tempstcgCFL - tempstcgBreakUp2;
			tempstcgBreakUp2 =0;
		}else{
			tempstcgBreakUp2 = zeroOrMore(tempstcgBreakUp2 - tempstcgCFL);
			tempstcgCFL=0;
		}
		
		if(tempstcgCFL>templtcgBreakUp2){
			tempstcgCFL = tempstcgCFL - templtcgBreakUp2;
			templtcgBreakUp2 =0;
		}else{
			templtcgBreakUp2 = zeroOrMore(templtcgBreakUp2 - tempstcgCFL);
			tempstcgCFL=0;
		}
		
		if(tempstcgCFL>templtcgBreakUp1){
			tempstcgCFL = tempstcgCFL - templtcgBreakUp1;
			templtcgBreakUp1 =0;
		}else{
			templtcgBreakUp1 = zeroOrMore(templtcgBreakUp1 - tempstcgCFL);
			tempstcgCFL=0;
		}
		
		if(tempstcgCFL>tempstcgBreakUp3){
			tempstcgCFL = tempstcgCFL - tempstcgBreakUp3;
			tempstcgBreakUp3 =0;
		}else{
			tempstcgBreakUp3 = zeroOrMore(tempstcgBreakUp3 - tempstcgCFL);
			tempstcgCFL=0;
		}
		
		if(tempstcgCFL>tempstcgBreakUp4){
			tempstcgCFL = tempstcgCFL - tempstcgBreakUp4;
			tempstcgBreakUp4 =0;
		}else{
			tempstcgBreakUp4 = zeroOrMore(tempstcgBreakUp4 - tempstcgCFL);
			tempstcgCFL=0;
		}
		
		// adjusting STCG first
		
		
		if(tempstcgCFL>templtcgBreakUp4){
			tempstcgCFL = tempstcgCFL - templtcgBreakUp4;
			templtcgBreakUp4 =0;
		}else{
			templtcgBreakUp4 = zeroOrMore(templtcgBreakUp4 - tempstcgCFL);
			tempstcgCFL=0;
		}
		
		if(tempstcgCFL>templtcgBreakUp5){
			tempstcgCFL = tempstcgCFL - templtcgBreakUp5;
			templtcgBreakUp5 =0;
		}else{
			templtcgBreakUp5= zeroOrMore(templtcgBreakUp5 - tempstcgCFL);
			tempstcgCFL=0;
		}
		
		if(tempstcgCFL>templtcgBreakUp6){
			tempstcgCFL = tempstcgCFL - templtcgBreakUp6;
			templtcgBreakUp6 =0;
		}else{
			templtcgBreakUp6 = zeroOrMore(templtcgBreakUp6 - tempstcgCFL);
			tempstcgCFL=0;
		}
		
		if(tempstcgCFL>templtcgBreakUp7){
			tempstcgCFL = tempstcgCFL - templtcgBreakUp7;
			templtcgBreakUp7 =0;
		}else{
			templtcgBreakUp7 = zeroOrMore(templtcgBreakUp7 - tempstcgCFL);
			tempstcgCFL=0;
		}
		
		if(tempstcgCFL>templtcgBreakUp8){
			tempstcgCFL = tempstcgCFL - templtcgBreakUp8;
			templtcgBreakUp8 =0;
		}else{
			templtcgBreakUp8 = zeroOrMore(templtcgBreakUp8 - tempstcgCFL);
			tempstcgCFL=0;
		}
		
		if(tempstcgCFL>templtcgBreakUp3){
			tempstcgCFL = tempstcgCFL - templtcgBreakUp3;
			templtcgBreakUp3 =0;
		}else{
			templtcgBreakUp3 = zeroOrMore(templtcgBreakUp3 - tempstcgCFL);
			tempstcgCFL=0;
		}
		
		//adjusting with LTCG
		
		if(tempLtcgCFL>templtcgBreakUp2){
			tempLtcgCFL = tempLtcgCFL - templtcgBreakUp2;
			templtcgBreakUp2 =0;
		}else{
			templtcgBreakUp2 = zeroOrMore(templtcgBreakUp2 - tempLtcgCFL);
			tempLtcgCFL=0;
		}
		
		if(tempLtcgCFL>templtcgBreakUp1){
			tempLtcgCFL = tempLtcgCFL - templtcgBreakUp1;
			templtcgBreakUp1 =0;
		}else{
			templtcgBreakUp1 = zeroOrMore(templtcgBreakUp1 - tempLtcgCFL);
			tempLtcgCFL=0;
		}
		
		if(tempLtcgCFL>templtcgBreakUp4){
			tempLtcgCFL = tempLtcgCFL - templtcgBreakUp4;
			templtcgBreakUp4 =0;
		}else{
			templtcgBreakUp4 = zeroOrMore(templtcgBreakUp4 - tempLtcgCFL);
			tempLtcgCFL=0;
		}
		
		if(tempLtcgCFL>templtcgBreakUp5){
			tempLtcgCFL = tempLtcgCFL - templtcgBreakUp5;
			templtcgBreakUp5 =0;
		}else{
			templtcgBreakUp5= zeroOrMore(templtcgBreakUp5 - tempLtcgCFL);
			tempLtcgCFL=0;
		}
		
		if(tempLtcgCFL>templtcgBreakUp6){
			tempLtcgCFL = tempLtcgCFL - templtcgBreakUp6;
			templtcgBreakUp6 =0;
		}else{
			templtcgBreakUp6 = zeroOrMore(templtcgBreakUp6 - tempLtcgCFL);
			tempLtcgCFL=0;
		}
		
		if(tempLtcgCFL>templtcgBreakUp7){
			tempLtcgCFL = tempLtcgCFL - templtcgBreakUp7;
			templtcgBreakUp7 =0;
		}else{
			templtcgBreakUp7 = zeroOrMore(templtcgBreakUp7 - tempLtcgCFL);
			tempLtcgCFL=0;
		}
		
		if(tempLtcgCFL>templtcgBreakUp8){
			tempLtcgCFL = tempLtcgCFL - templtcgBreakUp8;
			templtcgBreakUp8 =0;
		}else{
			templtcgBreakUp8 = zeroOrMore(templtcgBreakUp8 - tempLtcgCFL);
			tempLtcgCFL=0;
		}
		
		if(tempLtcgCFL>templtcgBreakUp3){
			tempLtcgCFL = tempLtcgCFL - templtcgBreakUp3;
			templtcgBreakUp3 =0;
		}else{
			templtcgBreakUp3 = zeroOrMore(templtcgBreakUp3 - tempLtcgCFL);
			tempLtcgCFL=0;
		}
	
		
		//stage-2 setting off STCG_CFL
		
		
		document.getElementsByName('scheduleBFLA.stcg.stcg30Per.incBFLA.bFlossPrevYrUndSameHeadSetoff')[0].value = 
		parseInt(zeroOrMore(parseInt(stcgBreakUp1,10) - tempstcgBreakUp1),10);
		document.getElementsByName('scheduleBFLA.stcg.stcgAppRate.incBFLA.bFlossPrevYrUndSameHeadSetoff')[0].value = 
		parseInt(zeroOrMore(parseInt(stcgBreakUp2,10) - tempstcgBreakUp2),10);
		document.getElementsByName('scheduleBFLA.stcg.stcg15Per.incBFLA.bFlossPrevYrUndSameHeadSetoff')[0].value = 
		parseInt(zeroOrMore(parseInt(stcgBreakUp3,10) - tempstcgBreakUp3),10) + 
		parseInt(zeroOrMore(parseInt(stcgBreakUp4,10) - tempstcgBreakUp4),10);
		document.getElementsByName('scheduleBFLA.ltcg.ltcg20Per.incBFLA.bFlossPrevYrUndSameHeadSetoff')[0].value = 
		parseInt(zeroOrMore(parseInt(ltcgBreakUp1,10) - templtcgBreakUp1),10) + 
		parseInt(zeroOrMore(parseInt(ltcgBreakUp2,10) - templtcgBreakUp2),10);
		document.getElementsByName('scheduleBFLA.ltcg.ltcg10Per.incBFLA.bFlossPrevYrUndSameHeadSetoff')[0].value = 
		parseInt(zeroOrMore(parseInt(ltcgBreakUp3,10) - templtcgBreakUp3),10) + 
		parseInt(zeroOrMore(parseInt(ltcgBreakUp4,10) - templtcgBreakUp4),10) + 
		parseInt(zeroOrMore(parseInt(ltcgBreakUp5,10) - templtcgBreakUp5),10) + 
		parseInt(zeroOrMore(parseInt(ltcgBreakUp6,10) - templtcgBreakUp6),10) + 
		parseInt(zeroOrMore(parseInt(ltcgBreakUp7,10) - templtcgBreakUp7),10) + 
		parseInt(zeroOrMore(parseInt(ltcgBreakUp8,10) - templtcgBreakUp8),10);
		
				
		document.getElementsByName('scheduleCFL.adjTotBFLossInBFLA.lossSummaryDetail.stcgLossCF')[0].value = 
				parseInt(zeroOrMore( storeSTCG1 - tempstcgBreakUp1 ),10)+
				parseInt(zeroOrMore( storeSTCG2 - tempstcgBreakUp2 ),10)+
				parseInt(zeroOrMore( storeSTCG3 - tempstcgBreakUp3 ),10)+
				parseInt(zeroOrMore( storeSTCG4 - tempstcgBreakUp4 ),10)+
				parseInt(zeroOrMore( storeLTCG1 - templtcgBreakUp1 ),10)+
				parseInt(zeroOrMore( storeLTCG2 - templtcgBreakUp2 ),10)+
				parseInt(zeroOrMore( storeLTCG3 - templtcgBreakUp3 ),10)+
				parseInt(zeroOrMore( storeLTCG4 - templtcgBreakUp4 ),10)+
				parseInt(zeroOrMore( storeLTCG5 - templtcgBreakUp5 ),10)+
				parseInt(zeroOrMore( storeLTCG6 - templtcgBreakUp6 ),10)+
				parseInt(zeroOrMore( storeLTCG7 - templtcgBreakUp7 ),10)+
				parseInt(zeroOrMore( storeLTCG8 - templtcgBreakUp8 ),10);
		
	var totalUDDeprctn = document.getElementsByName('itrScheduleUD.totalamtDepCurYr')[0].value;
	
	var busProfSpecProfset=coalescePath('scheduleBFLA.busProfInclSpecProf.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.busProfInclSpecProf.incBFLA.bFlossPrevYrUndSameHeadSetoff');
	
	if(busProfSpecProfset>0){
    	if(busProfSpecProfset<=totalUDDeprctn){
		document.getElementsByName('scheduleBFLA.busProfInclSpecProf.incBFLA.bfUnabsorbedDeprSetoff')[0].value = busProfSpecProfset;
		totalUDDeprctn = totalUDDeprctn - busProfSpecProfset;
		
	} else {
		document.getElementsByName('scheduleBFLA.busProfInclSpecProf.incBFLA.bfUnabsorbedDeprSetoff')[0].value = totalUDDeprctn;
		totalUDDeprctn = 0;
		
	}
	} else {
		document.getElementsByName('scheduleBFLA.busProfInclSpecProf.incBFLA.bfUnabsorbedDeprSetoff')[0].value = 0;
		
	}
	
	var Speculativeset=coalescePath('scheduleBFLA.speculativeInc.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.speculativeInc.incBFLA.bFlossPrevYrUndSameHeadSetoff');
	if(Speculativeset>0){
	if(Speculativeset<=totalUDDeprctn){
		document.getElementsByName('scheduleBFLA.speculativeInc.incBFLA.bfUnabsorbedDeprSetoff')[0].value = Speculativeset;
		totalUDDeprctn = totalUDDeprctn - Speculativeset;
		
	} else {
		document.getElementsByName('scheduleBFLA.speculativeInc.incBFLA.bfUnabsorbedDeprSetoff')[0].value = totalUDDeprctn;
		totalUDDeprctn = 0;
	
	}
	} else {
		document.getElementsByName('scheduleBFLA.speculativeInc.incBFLA.bfUnabsorbedDeprSetoff')[0].value = 0;
		
	}
	
	var specifiedSet=coalescePath('scheduleBFLA.specifiedInc.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.specifiedInc.incBFLA.bFlossPrevYrUndSameHeadSetoff');
	if(specifiedSet>0){
	if(specifiedSet<=totalUDDeprctn){
		document.getElementsByName('scheduleBFLA.specifiedInc.incBFLA.bfUnabsorbedDeprSetoff')[0].value = specifiedSet;
		totalUDDeprctn = totalUDDeprctn - specifiedSet;
		
	} else {
		document.getElementsByName('scheduleBFLA.specifiedInc.incBFLA.bfUnabsorbedDeprSetoff')[0].value = totalUDDeprctn;
		totalUDDeprctn = 0;
		
	}
	} else {
		document.getElementsByName('scheduleBFLA.specifiedInc.incBFLA.bfUnabsorbedDeprSetoff')[0].value = 0;
		
	}
	
	var hpset=coalescePath('scheduleBFLA.hp.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.hp.incBFLA.bFlossPrevYrUndSameHeadSetoff');
	if(hpset>0){
	if(hpset<=totalUDDeprctn){
		document.getElementsByName('scheduleBFLA.hp.incBFLA.bfUnabsorbedDeprSetoff')[0].value = hpset;
		totalUDDeprctn = totalUDDeprctn - hpset;
		
	} else {
		document.getElementsByName('scheduleBFLA.hp.incBFLA.bfUnabsorbedDeprSetoff')[0].value = totalUDDeprctn;
		totalUDDeprctn = 0;
		
	}
	} else {
		document.getElementsByName('scheduleBFLA.hp.incBFLA.bfUnabsorbedDeprSetoff')[0].value = 0;
		
	}
	
	var otherSrcset=coalescePath('scheduleBFLA.othSrcInclRaceHorse.incBFLA.incOfCurYrUndHeadFromCYLA');
	if(otherSrcset>0){
	if(otherSrcset<=totalUDDeprctn){
		document.getElementsByName('scheduleBFLA.othSrcInclRaceHorse.incBFLA.bfUnabsorbedDeprSetoff')[0].value = otherSrcset;
		totalUDDeprctn = totalUDDeprctn - otherSrcset;
		
	} else {
		document.getElementsByName('scheduleBFLA.othSrcInclRaceHorse.incBFLA.bfUnabsorbedDeprSetoff')[0].value = totalUDDeprctn;
		totalUDDeprctn = 0;
		
	}
	} else {
		document.getElementsByName('scheduleBFLA.othSrcInclRaceHorse.incBFLA.bfUnabsorbedDeprSetoff')[0].value = 0;
		
	}
	
	var profitOwnset=coalescePath('scheduleBFLA.profitFrmRaceHorse.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.profitFrmRaceHorse.incBFLA.bFlossPrevYrUndSameHeadSetoff');
	if(profitOwnset>0){
	if(profitOwnset<=totalUDDeprctn){
		document.getElementsByName('scheduleBFLA.profitFrmRaceHorse.incBFLA.bfUnabsorbedDeprSetoff')[0].value = profitOwnset;
		totalUDDeprctn = totalUDDeprctn - profitOwnset;
		
	} else {
		document.getElementsByName('scheduleBFLA.profitFrmRaceHorse.incBFLA.bfUnabsorbedDeprSetoff')[0].value = totalUDDeprctn;
		totalUDDeprctn = 0;
		
	}
	} else {
		document.getElementsByName('scheduleBFLA.profitFrmRaceHorse.incBFLA.bfUnabsorbedDeprSetoff')[0].value = 0;
		
	}
	
	//1
	var stcg30Perset=coalescePath('scheduleBFLA.stcg.stcg30Per.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.stcg.stcg30Per.incBFLA.bFlossPrevYrUndSameHeadSetoff');
	if(stcg30Perset>0){
	if(stcg30Perset<=totalUDDeprctn){
		document.getElementsByName('scheduleBFLA.stcg.stcg30Per.incBFLA.bfUnabsorbedDeprSetoff')[0].value = stcg30Perset;
		totalUDDeprctn = totalUDDeprctn - stcg30Perset;
		
	} else {
		document.getElementsByName('scheduleBFLA.stcg.stcg30Per.incBFLA.bfUnabsorbedDeprSetoff')[0].value = totalUDDeprctn;
		totalUDDeprctn = 0;
		
	}
	} else {
		document.getElementsByName('scheduleBFLA.stcg.stcg30Per.incBFLA.bfUnabsorbedDeprSetoff')[0].value = 0;
		
	}
	
	var stcgAppset=coalescePath('scheduleBFLA.stcg.stcgAppRate.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.stcg.stcgAppRate.incBFLA.bFlossPrevYrUndSameHeadSetoff');
	if(stcgAppset>0){
	if(stcgAppset<=totalUDDeprctn){
		document.getElementsByName('scheduleBFLA.stcg.stcgAppRate.incBFLA.bfUnabsorbedDeprSetoff')[0].value = stcgAppset;
		totalUDDeprctn = totalUDDeprctn - stcgAppset;
		
	} else {
		document.getElementsByName('scheduleBFLA.stcg.stcgAppRate.incBFLA.bfUnabsorbedDeprSetoff')[0].value = totalUDDeprctn;
		totalUDDeprctn = 0;
		
	}
	} else {
		document.getElementsByName('scheduleBFLA.stcg.stcgAppRate.incBFLA.bfUnabsorbedDeprSetoff')[0].value = 0;
		
	}
	var ltcg20Perset=coalescePath('scheduleBFLA.ltcg.ltcg20Per.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.ltcg.ltcg20Per.incBFLA.bFlossPrevYrUndSameHeadSetoff');
	if(ltcg20Perset>0){
	if(ltcg20Perset<=totalUDDeprctn){
		document.getElementsByName('scheduleBFLA.ltcg.ltcg20Per.incBFLA.bfUnabsorbedDeprSetoff')[0].value = ltcg20Perset;
		totalUDDeprctn = totalUDDeprctn - ltcg20Perset;
		
	} else {
		document.getElementsByName('scheduleBFLA.ltcg.ltcg20Per.incBFLA.bfUnabsorbedDeprSetoff')[0].value = totalUDDeprctn;
		totalUDDeprctn = 0;
		
	}
	} else {
		document.getElementsByName('scheduleBFLA.ltcg.ltcg20Per.incBFLA.bfUnabsorbedDeprSetoff')[0].value = 0;
		
	}
	
	var stcg15Perset=coalescePath('scheduleBFLA.stcg.stcg15Per.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.stcg.stcg15Per.incBFLA.bFlossPrevYrUndSameHeadSetoff');
	if(stcg15Perset>0){
	if(stcg15Perset<=totalUDDeprctn){
		document.getElementsByName('scheduleBFLA.stcg.stcg15Per.incBFLA.bfUnabsorbedDeprSetoff')[0].value = stcg15Perset;
		totalUDDeprctn = totalUDDeprctn - stcg15Perset;
		
	} else {
		document.getElementsByName('scheduleBFLA.stcg.stcg15Per.incBFLA.bfUnabsorbedDeprSetoff')[0].value = totalUDDeprctn;
		totalUDDeprctn = 0;
	
	}
	} else {
		document.getElementsByName('scheduleBFLA.stcg.stcg15Per.incBFLA.bfUnabsorbedDeprSetoff')[0].value = 0;
		
	}
	
	var ltcg10Perset=coalescePath('scheduleBFLA.ltcg.ltcg10Per.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.ltcg.ltcg10Per.incBFLA.bFlossPrevYrUndSameHeadSetoff');
	if(ltcg10Perset>0){
	if(ltcg10Perset<=totalUDDeprctn){
		document.getElementsByName('scheduleBFLA.ltcg.ltcg10Per.incBFLA.bfUnabsorbedDeprSetoff')[0].value = ltcg10Perset;
		totalUDDeprctn = totalUDDeprctn - ltcg10Perset;
		
	} else {
		document.getElementsByName('scheduleBFLA.ltcg.ltcg10Per.incBFLA.bfUnabsorbedDeprSetoff')[0].value = totalUDDeprctn;
		totalUDDeprctn = 0;
		
	}
	} else {
		document.getElementsByName('scheduleBFLA.ltcg.ltcg10Per.incBFLA.bfUnabsorbedDeprSetoff')[0].value = 0;
	}
		
	// calculating sum of column 3
	document.getElementsByName('scheduleBFLA.totalBFLossSetOff.totUnabsorbedDeprSetoff')[0].value =
		coalescePath('scheduleBFLA.hp.incBFLA.bfUnabsorbedDeprSetoff')+
		coalescePath('scheduleBFLA.busProfInclSpecProf.incBFLA.bfUnabsorbedDeprSetoff')+
		coalescePath('scheduleBFLA.speculativeInc.incBFLA.bfUnabsorbedDeprSetoff')+
		coalescePath('scheduleBFLA.specifiedInc.incBFLA.bfUnabsorbedDeprSetoff')+
		coalescePath('scheduleBFLA.stcg.stcg30Per.incBFLA.bfUnabsorbedDeprSetoff')+
		coalescePath('scheduleBFLA.stcg.stcg15Per.incBFLA.bfUnabsorbedDeprSetoff')+
		coalescePath('scheduleBFLA.stcg.stcgAppRate.incBFLA.bfUnabsorbedDeprSetoff')+
		coalescePath('scheduleBFLA.ltcg.ltcg20Per.incBFLA.bfUnabsorbedDeprSetoff')+
		coalescePath('scheduleBFLA.ltcg.ltcg10Per.incBFLA.bfUnabsorbedDeprSetoff')+
		coalescePath('scheduleBFLA.othSrcInclRaceHorse.incBFLA.bfUnabsorbedDeprSetoff')+
		coalescePath('scheduleBFLA.profitFrmRaceHorse.incBFLA.bfUnabsorbedDeprSetoff');
	
		
	//checking max limits of "Brought forward depreciation set off" --- column 4
	
	var busProfSpecAllwnceSet = (coalescePath('scheduleBFLA.busProfInclSpecProf.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.busProfInclSpecProf.incBFLA.bFlossPrevYrUndSameHeadSetoff')-
		 coalescePath('scheduleBFLA.busProfInclSpecProf.incBFLA.bfUnabsorbedDeprSetoff'));
	var totalUDAllwnce = document.getElementsByName('itrScheduleUD.amountASACYIncome')[0].value;
	
	
	if(busProfSpecAllwnceSet>0){
	if(busProfSpecAllwnceSet<=totalUDAllwnce){
		document.getElementsByName('scheduleBFLA.busProfInclSpecProf.incBFLA.bfAllUs35Cl4Setoff')[0].value = busProfSpecAllwnceSet;
		totalUDAllwnce = totalUDAllwnce - busProfSpecAllwnceSet;
		
	} else {
		document.getElementsByName('scheduleBFLA.busProfInclSpecProf.incBFLA.bfAllUs35Cl4Setoff')[0].value = totalUDAllwnce;
		totalUDAllwnce = 0;
	}
	} else {
		document.getElementsByName('scheduleBFLA.busProfInclSpecProf.incBFLA.bfAllUs35Cl4Setoff')[0].value = 0;
	}
	
	var SpeculatvAllwnceSet = (coalescePath('scheduleBFLA.speculativeInc.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.speculativeInc.incBFLA.bFlossPrevYrUndSameHeadSetoff')-
		 coalescePath('scheduleBFLA.speculativeInc.incBFLA.bfUnabsorbedDeprSetoff'));
		
	if(SpeculatvAllwnceSet>0){
	if(SpeculatvAllwnceSet<=totalUDAllwnce){
		document.getElementsByName('scheduleBFLA.speculativeInc.incBFLA.bfAllUs35Cl4Setoff')[0].value = SpeculatvAllwnceSet;
		totalUDAllwnce = totalUDAllwnce - SpeculatvAllwnceSet;
		
	} else {
		document.getElementsByName('scheduleBFLA.speculativeInc.incBFLA.bfAllUs35Cl4Setoff')[0].value = totalUDAllwnce;
		totalUDAllwnce = 0;
	
	}
	} else {
		document.getElementsByName('scheduleBFLA.speculativeInc.incBFLA.bfAllUs35Cl4Setoff')[0].value = 0;
	}
	
	
	var SpecfiedAllwnceSet = (coalescePath('scheduleBFLA.specifiedInc.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.specifiedInc.incBFLA.bFlossPrevYrUndSameHeadSetoff')-
		 coalescePath('scheduleBFLA.specifiedInc.incBFLA.bfUnabsorbedDeprSetoff'));
		
	if(SpecfiedAllwnceSet>0){
	if(SpecfiedAllwnceSet<=totalUDAllwnce){
		document.getElementsByName('scheduleBFLA.specifiedInc.incBFLA.bfAllUs35Cl4Setoff')[0].value = SpecfiedAllwnceSet;
		totalUDAllwnce = totalUDAllwnce - SpecfiedAllwnceSet;
		
	} else {
		document.getElementsByName('scheduleBFLA.specifiedInc.incBFLA.bfAllUs35Cl4Setoff')[0].value = totalUDAllwnce;
		totalUDAllwnce = 0;
	
	}
	} else {
		document.getElementsByName('scheduleBFLA.specifiedInc.incBFLA.bfAllUs35Cl4Setoff')[0].value = 0;
	}
	
	var hpAllwnceSet = (coalescePath('scheduleBFLA.hp.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.hp.incBFLA.bFlossPrevYrUndSameHeadSetoff')-
		 coalescePath('scheduleBFLA.hp.incBFLA.bfUnabsorbedDeprSetoff'));
		
	if(hpAllwnceSet>0){
	if(hpAllwnceSet<=totalUDAllwnce){
		document.getElementsByName('scheduleBFLA.hp.incBFLA.bfAllUs35Cl4Setoff')[0].value = hpAllwnceSet;
		totalUDAllwnce = totalUDAllwnce - hpAllwnceSet;
		
	} else {
		document.getElementsByName('scheduleBFLA.hp.incBFLA.bfAllUs35Cl4Setoff')[0].value = totalUDAllwnce;
		totalUDAllwnce = 0;
	
	}
	} else {
		document.getElementsByName('scheduleBFLA.hp.incBFLA.bfAllUs35Cl4Setoff')[0].value = 0;
	}
	
	var othrSrcAllwnceSet = (coalescePath('scheduleBFLA.othSrcInclRaceHorse.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.othSrcInclRaceHorse.incBFLA.bfUnabsorbedDeprSetoff'));
		
	if(othrSrcAllwnceSet>0){
	if(othrSrcAllwnceSet<=totalUDAllwnce){
		document.getElementsByName('scheduleBFLA.othSrcInclRaceHorse.incBFLA.bfAllUs35Cl4Setoff')[0].value = othrSrcAllwnceSet;
		totalUDAllwnce = totalUDAllwnce - othrSrcAllwnceSet;
		
	} else {
		document.getElementsByName('scheduleBFLA.othSrcInclRaceHorse.incBFLA.bfAllUs35Cl4Setoff')[0].value = totalUDAllwnce;
		totalUDAllwnce = 0;
	
	}
	} else {
		document.getElementsByName('scheduleBFLA.othSrcInclRaceHorse.incBFLA.bfAllUs35Cl4Setoff')[0].value = 0;
	}
	
	var profitAllwnceSet = (coalescePath('scheduleBFLA.profitFrmRaceHorse.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.profitFrmRaceHorse.incBFLA.bFlossPrevYrUndSameHeadSetoff')-
		 coalescePath('scheduleBFLA.profitFrmRaceHorse.incBFLA.bfUnabsorbedDeprSetoff'));
		
	if(profitAllwnceSet>0){
	if(profitAllwnceSet<=totalUDAllwnce){
		document.getElementsByName('scheduleBFLA.profitFrmRaceHorse.incBFLA.bfAllUs35Cl4Setoff')[0].value = profitAllwnceSet;
		totalUDAllwnce = totalUDAllwnce - profitAllwnceSet;
		
	} else {
		document.getElementsByName('scheduleBFLA.profitFrmRaceHorse.incBFLA.bfAllUs35Cl4Setoff')[0].value = totalUDAllwnce;
		totalUDAllwnce = 0;
	
	}
	} else {
		document.getElementsByName('scheduleBFLA.profitFrmRaceHorse.incBFLA.bfAllUs35Cl4Setoff')[0].value = 0;
	}
	
	//1
	var stcg30PerAllwnceSet = (coalescePath('scheduleBFLA.stcg.stcg30Per.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.stcg.stcg30Per.incBFLA.bFlossPrevYrUndSameHeadSetoff')-
		 coalescePath('scheduleBFLA.stcg.stcg30Per.incBFLA.bfUnabsorbedDeprSetoff'));
		
	if(stcg30PerAllwnceSet>0){
	if(stcg30PerAllwnceSet<=totalUDAllwnce){
		document.getElementsByName('scheduleBFLA.stcg.stcg30Per.incBFLA.bfAllUs35Cl4Setoff')[0].value = stcg30PerAllwnceSet;
		totalUDAllwnce = totalUDAllwnce - stcg30PerAllwnceSet;
		
	} else {
		document.getElementsByName('scheduleBFLA.stcg.stcg30Per.incBFLA.bfAllUs35Cl4Setoff')[0].value = totalUDAllwnce;
		totalUDAllwnce = 0;
	
	}
	} else {
		document.getElementsByName('scheduleBFLA.stcg.stcg30Per.incBFLA.bfAllUs35Cl4Setoff')[0].value = 0;
	}
	
	var stcgAppAllwnceSet = (coalescePath('scheduleBFLA.stcg.stcgAppRate.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.stcg.stcgAppRate.incBFLA.bFlossPrevYrUndSameHeadSetoff')-
		 coalescePath('scheduleBFLA.stcg.stcgAppRate.incBFLA.bfUnabsorbedDeprSetoff'));
		
	if(stcgAppAllwnceSet>0){
	if(stcgAppAllwnceSet<=totalUDAllwnce){
		document.getElementsByName('scheduleBFLA.stcg.stcgAppRate.incBFLA.bfAllUs35Cl4Setoff')[0].value = stcgAppAllwnceSet;
		totalUDAllwnce = totalUDAllwnce - stcgAppAllwnceSet;
		
	} else {
		document.getElementsByName('scheduleBFLA.stcg.stcgAppRate.incBFLA.bfAllUs35Cl4Setoff')[0].value = totalUDAllwnce;
		totalUDAllwnce = 0;
	
	}
	} else {
		document.getElementsByName('scheduleBFLA.stcg.stcgAppRate.incBFLA.bfAllUs35Cl4Setoff')[0].value = 0;
	}
	
	var ltcg20PerAllwnceSet = (coalescePath('scheduleBFLA.ltcg.ltcg20Per.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.ltcg.ltcg20Per.incBFLA.bFlossPrevYrUndSameHeadSetoff')-
		 coalescePath('scheduleBFLA.ltcg.ltcg20Per.incBFLA.bfUnabsorbedDeprSetoff'));
		
	if(ltcg20PerAllwnceSet>0){
	if(ltcg20PerAllwnceSet<=totalUDAllwnce){
		document.getElementsByName('scheduleBFLA.ltcg.ltcg20Per.incBFLA.bfAllUs35Cl4Setoff')[0].value = ltcg20PerAllwnceSet;
		totalUDAllwnce = totalUDAllwnce - ltcg20PerAllwnceSet;
		
	} else {
		document.getElementsByName('scheduleBFLA.ltcg.ltcg20Per.incBFLA.bfAllUs35Cl4Setoff')[0].value = totalUDAllwnce;
		totalUDAllwnce = 0;
	
	}
	} else {
		document.getElementsByName('scheduleBFLA.ltcg.ltcg20Per.incBFLA.bfAllUs35Cl4Setoff')[0].value = 0;
	}
	
	var stcg15PerAllwnceSet = (coalescePath('scheduleBFLA.stcg.stcg15Per.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.stcg.stcg15Per.incBFLA.bFlossPrevYrUndSameHeadSetoff')-
		 coalescePath('scheduleBFLA.stcg.stcg15Per.incBFLA.bfUnabsorbedDeprSetoff'));
		
	if(stcg15PerAllwnceSet>0){
	if(stcg15PerAllwnceSet<=totalUDAllwnce){
		document.getElementsByName('scheduleBFLA.stcg.stcg15Per.incBFLA.bfAllUs35Cl4Setoff')[0].value = stcg15PerAllwnceSet;
		totalUDAllwnce = totalUDAllwnce - stcg15PerAllwnceSet;
		
	} else {
		document.getElementsByName('scheduleBFLA.stcg.stcg15Per.incBFLA.bfAllUs35Cl4Setoff')[0].value = totalUDAllwnce;
		totalUDAllwnce = 0;
	
	}
	} else {
		document.getElementsByName('scheduleBFLA.stcg.stcg15Per.incBFLA.bfAllUs35Cl4Setoff')[0].value = 0;
	}
	
	var ltcg10PerAllwnceSet = (coalescePath('scheduleBFLA.ltcg.ltcg10Per.incBFLA.incOfCurYrUndHeadFromCYLA')-
		 coalescePath('scheduleBFLA.ltcg.ltcg10Per.incBFLA.bFlossPrevYrUndSameHeadSetoff')-
		 coalescePath('scheduleBFLA.ltcg.ltcg10Per.incBFLA.bfUnabsorbedDeprSetoff'));
		
	if(ltcg10PerAllwnceSet>0){
	if(ltcg10PerAllwnceSet<=totalUDAllwnce){
		document.getElementsByName('scheduleBFLA.ltcg.ltcg10Per.incBFLA.bfAllUs35Cl4Setoff')[0].value = ltcg10PerAllwnceSet;
		totalUDAllwnce = totalUDAllwnce - ltcg10PerAllwnceSet;
		
	} else {
		document.getElementsByName('scheduleBFLA.ltcg.ltcg10Per.incBFLA.bfAllUs35Cl4Setoff')[0].value = totalUDAllwnce;
		totalUDAllwnce = 0;
	
	}
	} else {
		document.getElementsByName('scheduleBFLA.ltcg.ltcg10Per.incBFLA.bfAllUs35Cl4Setoff')[0].value = 0;
	}
	
	//calculating the income after setOff
		document.getElementsByName('scheduleBFLA.hp.incBFLA.incOfCurYrAfterSetOffBFLosses')[0].value =
			coalescePath('scheduleBFLA.hp.incBFLA.incOfCurYrUndHeadFromCYLA')-
			coalescePath('scheduleBFLA.hp.incBFLA.bFlossPrevYrUndSameHeadSetoff')-
			coalescePath('scheduleBFLA.hp.incBFLA.bfUnabsorbedDeprSetoff')-
			coalescePath('scheduleBFLA.hp.incBFLA.bfAllUs35Cl4Setoff');
		
		document.getElementsByName('scheduleBFLA.busProfInclSpecProf.incBFLA.incOfCurYrAfterSetOffBFLosses')[0].value =
			coalescePath('scheduleBFLA.busProfInclSpecProf.incBFLA.incOfCurYrUndHeadFromCYLA')-
			coalescePath('scheduleBFLA.busProfInclSpecProf.incBFLA.bFlossPrevYrUndSameHeadSetoff')-
			coalescePath('scheduleBFLA.busProfInclSpecProf.incBFLA.bfUnabsorbedDeprSetoff')-
			coalescePath('scheduleBFLA.busProfInclSpecProf.incBFLA.bfAllUs35Cl4Setoff');
		document.getElementsByName('scheduleBFLA.speculativeInc.incBFLA.incOfCurYrAfterSetOffBFLosses')[0].value =
			coalescePath('scheduleBFLA.speculativeInc.incBFLA.incOfCurYrUndHeadFromCYLA')-
			coalescePath('scheduleBFLA.speculativeInc.incBFLA.bFlossPrevYrUndSameHeadSetoff')-
			coalescePath('scheduleBFLA.speculativeInc.incBFLA.bfUnabsorbedDeprSetoff')-
			coalescePath('scheduleBFLA.speculativeInc.incBFLA.bfAllUs35Cl4Setoff');
		document.getElementsByName('scheduleBFLA.specifiedInc.incBFLA.incOfCurYrAfterSetOffBFLosses')[0].value =
			coalescePath('scheduleBFLA.specifiedInc.incBFLA.incOfCurYrUndHeadFromCYLA')-
			coalescePath('scheduleBFLA.specifiedInc.incBFLA.bFlossPrevYrUndSameHeadSetoff')-
			coalescePath('scheduleBFLA.specifiedInc.incBFLA.bfUnabsorbedDeprSetoff')-
			coalescePath('scheduleBFLA.specifiedInc.incBFLA.bfAllUs35Cl4Setoff');
		document.getElementsByName('scheduleBFLA.stcg.stcg15Per.incBFLA.incOfCurYrAfterSetOffBFLosses')[0].value =
			coalescePath('scheduleBFLA.stcg.stcg15Per.incBFLA.incOfCurYrUndHeadFromCYLA')-
			coalescePath('scheduleBFLA.stcg.stcg15Per.incBFLA.bFlossPrevYrUndSameHeadSetoff')-
			coalescePath('scheduleBFLA.stcg.stcg15Per.incBFLA.bfUnabsorbedDeprSetoff')-
			coalescePath('scheduleBFLA.stcg.stcg15Per.incBFLA.bfAllUs35Cl4Setoff');
		document.getElementsByName('scheduleBFLA.stcg.stcg30Per.incBFLA.incOfCurYrAfterSetOffBFLosses')[0].value =
			coalescePath('scheduleBFLA.stcg.stcg30Per.incBFLA.incOfCurYrUndHeadFromCYLA')-
			coalescePath('scheduleBFLA.stcg.stcg30Per.incBFLA.bFlossPrevYrUndSameHeadSetoff')-
			coalescePath('scheduleBFLA.stcg.stcg30Per.incBFLA.bfUnabsorbedDeprSetoff')-
			coalescePath('scheduleBFLA.stcg.stcg30Per.incBFLA.bfAllUs35Cl4Setoff');
		document.getElementsByName('scheduleBFLA.stcg.stcgAppRate.incBFLA.incOfCurYrAfterSetOffBFLosses')[0].value =
			coalescePath('scheduleBFLA.stcg.stcgAppRate.incBFLA.incOfCurYrUndHeadFromCYLA')-
			coalescePath('scheduleBFLA.stcg.stcgAppRate.incBFLA.bFlossPrevYrUndSameHeadSetoff')-
			coalescePath('scheduleBFLA.stcg.stcgAppRate.incBFLA.bfUnabsorbedDeprSetoff')-
			coalescePath('scheduleBFLA.stcg.stcgAppRate.incBFLA.bfAllUs35Cl4Setoff');
		document.getElementsByName('scheduleBFLA.ltcg.ltcg10Per.incBFLA.incOfCurYrAfterSetOffBFLosses')[0].value =
			coalescePath('scheduleBFLA.ltcg.ltcg10Per.incBFLA.incOfCurYrUndHeadFromCYLA')-
			coalescePath('scheduleBFLA.ltcg.ltcg10Per.incBFLA.bFlossPrevYrUndSameHeadSetoff')-
			coalescePath('scheduleBFLA.ltcg.ltcg10Per.incBFLA.bfUnabsorbedDeprSetoff')-
			coalescePath('scheduleBFLA.ltcg.ltcg10Per.incBFLA.bfAllUs35Cl4Setoff');
		document.getElementsByName('scheduleBFLA.ltcg.ltcg20Per.incBFLA.incOfCurYrAfterSetOffBFLosses')[0].value =
			coalescePath('scheduleBFLA.ltcg.ltcg20Per.incBFLA.incOfCurYrUndHeadFromCYLA')-
			coalescePath('scheduleBFLA.ltcg.ltcg20Per.incBFLA.bFlossPrevYrUndSameHeadSetoff')-
			coalescePath('scheduleBFLA.ltcg.ltcg20Per.incBFLA.bfUnabsorbedDeprSetoff')-
			coalescePath('scheduleBFLA.ltcg.ltcg20Per.incBFLA.bfAllUs35Cl4Setoff');
		document.getElementsByName('scheduleBFLA.othSrcInclRaceHorse.incBFLA.incOfCurYrAfterSetOffBFLosses')[0].value =
			coalescePath('scheduleBFLA.othSrcInclRaceHorse.incBFLA.incOfCurYrUndHeadFromCYLA')-
			coalescePath('scheduleBFLA.othSrcInclRaceHorse.incBFLA.bfUnabsorbedDeprSetoff')-
			coalescePath('scheduleBFLA.othSrcInclRaceHorse.incBFLA.bfAllUs35Cl4Setoff');
		document.getElementsByName('scheduleBFLA.profitFrmRaceHorse.incBFLA.incOfCurYrAfterSetOffBFLosses')[0].value =
			coalescePath('scheduleBFLA.profitFrmRaceHorse.incBFLA.incOfCurYrUndHeadFromCYLA')-
			coalescePath('scheduleBFLA.profitFrmRaceHorse.incBFLA.bFlossPrevYrUndSameHeadSetoff')-
			coalescePath('scheduleBFLA.profitFrmRaceHorse.incBFLA.bfUnabsorbedDeprSetoff')-
			coalescePath('scheduleBFLA.profitFrmRaceHorse.incBFLA.bfAllUs35Cl4Setoff');
		// Total of brought forward loss set off			
		document.getElementsByName('scheduleBFLA.totalBFLossSetOff.totBFLossSetoff')[0].value =
			coalescePath('scheduleBFLA.hp.incBFLA.bFlossPrevYrUndSameHeadSetoff')+
			coalescePath('scheduleBFLA.busProfInclSpecProf.incBFLA.bFlossPrevYrUndSameHeadSetoff')+
			coalescePath('scheduleBFLA.speculativeInc.incBFLA.bFlossPrevYrUndSameHeadSetoff')+
			coalescePath('scheduleBFLA.specifiedInc.incBFLA.bFlossPrevYrUndSameHeadSetoff')+
			coalescePath('scheduleBFLA.stcg.stcg15Per.incBFLA.bFlossPrevYrUndSameHeadSetoff')+
			coalescePath('scheduleBFLA.stcg.stcg30Per.incBFLA.bFlossPrevYrUndSameHeadSetoff')+
			coalescePath('scheduleBFLA.stcg.stcgAppRate.incBFLA.bFlossPrevYrUndSameHeadSetoff')+
			coalescePath('scheduleBFLA.ltcg.ltcg10Per.incBFLA.bFlossPrevYrUndSameHeadSetoff')+
			coalescePath('scheduleBFLA.ltcg.ltcg20Per.incBFLA.bFlossPrevYrUndSameHeadSetoff')+
			coalescePath('scheduleBFLA.profitFrmRaceHorse.incBFLA.bFlossPrevYrUndSameHeadSetoff');
		document.getElementsByName('scheduleBFLA.totalBFLossSetOff.totUnabsorbedDeprSetoff')[0].value =
			coalescePath('scheduleBFLA.hp.incBFLA.bfUnabsorbedDeprSetoff')+
			coalescePath('scheduleBFLA.busProfInclSpecProf.incBFLA.bfUnabsorbedDeprSetoff')+
			coalescePath('scheduleBFLA.speculativeInc.incBFLA.bfUnabsorbedDeprSetoff')+
			coalescePath('scheduleBFLA.specifiedInc.incBFLA.bfUnabsorbedDeprSetoff')+
			coalescePath('scheduleBFLA.stcg.stcg15Per.incBFLA.bfUnabsorbedDeprSetoff')+
			coalescePath('scheduleBFLA.stcg.stcg30Per.incBFLA.bfUnabsorbedDeprSetoff')+
			coalescePath('scheduleBFLA.stcg.stcgAppRate.incBFLA.bfUnabsorbedDeprSetoff')+
			coalescePath('scheduleBFLA.ltcg.ltcg10Per.incBFLA.bfUnabsorbedDeprSetoff')+
			coalescePath('scheduleBFLA.othSrcInclRaceHorse.incBFLA.bfUnabsorbedDeprSetoff')+
			coalescePath('scheduleBFLA.ltcg.ltcg20Per.incBFLA.bfUnabsorbedDeprSetoff')+
			coalescePath('scheduleBFLA.profitFrmRaceHorse.incBFLA.bfUnabsorbedDeprSetoff');
		document.getElementsByName('scheduleBFLA.totalBFLossSetOff.totAllUs35Cl4Setoff')[0].value =
			coalescePath('scheduleBFLA.hp.incBFLA.bfAllUs35Cl4Setoff')+
			coalescePath('scheduleBFLA.busProfInclSpecProf.incBFLA.bfAllUs35Cl4Setoff')+
			coalescePath('scheduleBFLA.speculativeInc.incBFLA.bfAllUs35Cl4Setoff')+
			coalescePath('scheduleBFLA.specifiedInc.incBFLA.bfAllUs35Cl4Setoff')+
			coalescePath('scheduleBFLA.stcg.stcg15Per.incBFLA.bfAllUs35Cl4Setoff')+
			coalescePath('scheduleBFLA.stcg.stcg30Per.incBFLA.bfAllUs35Cl4Setoff')+
			coalescePath('scheduleBFLA.stcg.stcgAppRate.incBFLA.bfAllUs35Cl4Setoff')+
			coalescePath('scheduleBFLA.ltcg.ltcg10Per.incBFLA.bfAllUs35Cl4Setoff')+
			coalescePath('scheduleBFLA.ltcg.ltcg20Per.incBFLA.bfAllUs35Cl4Setoff')+
			coalescePath('scheduleBFLA.othSrcInclRaceHorse.incBFLA.bfAllUs35Cl4Setoff')+
			coalescePath('scheduleBFLA.profitFrmRaceHorse.incBFLA.bfAllUs35Cl4Setoff');
		//x :: sum
		document.getElementsByName('scheduleBFLA.incomeOfCurrYrAftCYLABFLA')[0].value =
			coalescePath('scheduleBFLA.salary.incBFLA.incOfCurYrAfterSetOffBFLosses')+
			coalescePath('scheduleBFLA.hp.incBFLA.incOfCurYrAfterSetOffBFLosses')+
			coalescePath('scheduleBFLA.busProfInclSpecProf.incBFLA.incOfCurYrAfterSetOffBFLosses')+
			coalescePath('scheduleBFLA.speculativeInc.incBFLA.incOfCurYrAfterSetOffBFLosses')+
			coalescePath('scheduleBFLA.specifiedInc.incBFLA.incOfCurYrAfterSetOffBFLosses')+
			coalescePath('scheduleBFLA.stcg.stcg15Per.incBFLA.incOfCurYrAfterSetOffBFLosses')+
			coalescePath('scheduleBFLA.stcg.stcg30Per.incBFLA.incOfCurYrAfterSetOffBFLosses')+
			coalescePath('scheduleBFLA.stcg.stcgAppRate.incBFLA.incOfCurYrAfterSetOffBFLosses')+
			coalescePath('scheduleBFLA.ltcg.ltcg10Per.incBFLA.incOfCurYrAfterSetOffBFLosses')+
			coalescePath('scheduleBFLA.ltcg.ltcg20Per.incBFLA.incOfCurYrAfterSetOffBFLosses')+
			coalescePath('scheduleBFLA.othSrcInclRaceHorse.incBFLA.incOfCurYrAfterSetOffBFLosses')+
			coalescePath('scheduleBFLA.profitFrmRaceHorse.incBFLA.incOfCurYrAfterSetOffBFLosses');

		var sumUD35_4_stcg15Per = coalescePath('scheduleBFLA.stcg.stcg15Per.incBFLA.bfUnabsorbedDeprSetoff')+
			coalescePath('scheduleBFLA.stcg.stcg15Per.incBFLA.bfAllUs35Cl4Setoff');
		var sumUD35_4_stcg30Per = coalescePath('scheduleBFLA.stcg.stcg30Per.incBFLA.bfUnabsorbedDeprSetoff')+
			coalescePath('scheduleBFLA.stcg.stcg30Per.incBFLA.bfAllUs35Cl4Setoff');
		var sumUD35_4_stcgAppPer = coalescePath('scheduleBFLA.stcg.stcgAppRate.incBFLA.bfUnabsorbedDeprSetoff')+
			coalescePath('scheduleBFLA.stcg.stcgAppRate.incBFLA.bfAllUs35Cl4Setoff');
		var sumUD35_4_ltcg20Per = coalescePath('scheduleBFLA.ltcg.ltcg20Per.incBFLA.bfUnabsorbedDeprSetoff')+
			coalescePath('scheduleBFLA.ltcg.ltcg20Per.incBFLA.bfAllUs35Cl4Setoff');
		var sumUD35_4_ltcg10Per = coalescePath('scheduleBFLA.ltcg.ltcg10Per.incBFLA.bfUnabsorbedDeprSetoff')+
			coalescePath('scheduleBFLA.ltcg.ltcg10Per.incBFLA.bfAllUs35Cl4Setoff');
		
		if(sumUD35_4_stcg30Per>tempstcgBreakUp1){
			sumUD35_4_stcg30Per = sumUD35_4_stcg30Per - tempstcgBreakUp1;
			tempstcgBreakUp1 =0;
		}else{
			tempstcgBreakUp1 = zeroOrMore(tempstcgBreakUp1 - sumUD35_4_stcg30Per);
			sumUD35_4_stcg30Per=0;
		}
		
		if(sumUD35_4_stcgAppPer>tempstcgBreakUp2){
			sumUD35_4_stcgAppPer = sumUD35_4_stcgAppPer - tempstcgBreakUp2;
			tempstcgBreakUp2 =0;
		}else{
			tempstcgBreakUp2 = zeroOrMore(tempstcgBreakUp2 - sumUD35_4_stcgAppPer);
			sumUD35_4_stcgAppPer=0;
		}
		
		if(sumUD35_4_ltcg20Per>templtcgBreakUp2){
			sumUD35_4_ltcg20Per = sumUD35_4_ltcg20Per - templtcgBreakUp2;
			templtcgBreakUp2 =0;
		}else{
			templtcgBreakUp2 = zeroOrMore(templtcgBreakUp2 - sumUD35_4_ltcg20Per);
			sumUD35_4_ltcg20Per=0;
		}
		
		if(sumUD35_4_ltcg20Per>templtcgBreakUp1){
			sumUD35_4_ltcg20Per = sumUD35_4_ltcg20Per - templtcgBreakUp1;
			templtcgBreakUp1 =0;
		}else{
			templtcgBreakUp1 = zeroOrMore(templtcgBreakUp1 - sumUD35_4_ltcg20Per);
			sumUD35_4_ltcg20Per=0;
		}
		
		if(sumUD35_4_stcg15Per>tempstcgBreakUp3){
			sumUD35_4_stcg15Per = sumUD35_4_stcg15Per - tempstcgBreakUp3;
			tempstcgBreakUp3 =0;
		}else{
			tempstcgBreakUp3 = zeroOrMore(tempstcgBreakUp3 - sumUD35_4_stcg15Per);
			sumUD35_4_stcg15Per=0;
		}
		
		if(sumUD35_4_stcg15Per>tempstcgBreakUp4){
			sumUD35_4_stcg15Per = sumUD35_4_stcg15Per - tempstcgBreakUp4;
			tempstcgBreakUp4 =0;
		}else{
			tempstcgBreakUp4 = zeroOrMore(tempstcgBreakUp4 - sumUD35_4_stcg15Per);
			sumUD35_4_stcg15Per=0;
		}
		
		// adjusting STCG first
		
		
		if(sumUD35_4_ltcg10Per>templtcgBreakUp4){
			sumUD35_4_ltcg10Per = sumUD35_4_ltcg10Per - templtcgBreakUp4;
			templtcgBreakUp4 =0;
		}else{
			templtcgBreakUp4 = zeroOrMore(templtcgBreakUp4 - sumUD35_4_ltcg10Per);
			sumUD35_4_ltcg10Per=0;
		}
		
		if(sumUD35_4_ltcg10Per>templtcgBreakUp5){
			sumUD35_4_ltcg10Per = sumUD35_4_ltcg10Per - templtcgBreakUp5;
			templtcgBreakUp5 =0;
		}else{
			templtcgBreakUp5= zeroOrMore(templtcgBreakUp5 - sumUD35_4_ltcg10Per);
			sumUD35_4_ltcg10Per=0;
		}
		
		if(sumUD35_4_ltcg10Per>templtcgBreakUp6){
			sumUD35_4_ltcg10Per = sumUD35_4_ltcg10Per - templtcgBreakUp6;
			templtcgBreakUp6 =0;
		}else{
			templtcgBreakUp6 = zeroOrMore(templtcgBreakUp6 - sumUD35_4_ltcg10Per);
			sumUD35_4_ltcg10Per=0;
		}
		
		if(sumUD35_4_ltcg10Per>templtcgBreakUp7){
			sumUD35_4_ltcg10Per = sumUD35_4_ltcg10Per - templtcgBreakUp7;
			templtcgBreakUp7 =0;
		}else{
			templtcgBreakUp7 = zeroOrMore(templtcgBreakUp7 - sumUD35_4_ltcg10Per);
			sumUD35_4_ltcg10Per=0;
		}
		
		if(sumUD35_4_ltcg10Per>templtcgBreakUp8){
			sumUD35_4_ltcg10Per = sumUD35_4_ltcg10Per - templtcgBreakUp8;
			templtcgBreakUp8 =0;
		}else{
			templtcgBreakUp8 = zeroOrMore(templtcgBreakUp8 - sumUD35_4_ltcg10Per);
			sumUD35_4_ltcg10Per=0;
		}
		
		if(sumUD35_4_ltcg10Per>templtcgBreakUp3){
			sumUD35_4_ltcg10Per = sumUD35_4_ltcg10Per - templtcgBreakUp3;
			templtcgBreakUp3 =0;
		}else{
			templtcgBreakUp3 = zeroOrMore(templtcgBreakUp3 - sumUD35_4_ltcg10Per);
			sumUD35_4_ltcg10Per=0;
		}
			
		if(sumUD35_4_ltcg20Per>templtcgBreakUp2){
			sumUD35_4_ltcg20Per = sumUD35_4_ltcg20Per - templtcgBreakUp2;
			templtcgBreakUp2 =0;
		}else{
			templtcgBreakUp2 = zeroOrMore(templtcgBreakUp2 - sumUD35_4_ltcg20Per);
			sumUD35_4_ltcg20Per=0;
		}
		
		if(sumUD35_4_ltcg20Per>templtcgBreakUp1){
			sumUD35_4_ltcg20Per = sumUD35_4_ltcg20Per - templtcgBreakUp1;
			templtcgBreakUp1 =0;
		}else{
			templtcgBreakUp1 = zeroOrMore(templtcgBreakUp1 - sumUD35_4_ltcg20Per);
			sumUD35_4_ltcg20Per=0;
		}
		
		if(sumUD35_4_ltcg10Per>templtcgBreakUp4){
			sumUD35_4_ltcg10Per = sumUD35_4_ltcg10Per - templtcgBreakUp4;
			templtcgBreakUp4 =0;
		}else{
			templtcgBreakUp4 = zeroOrMore(templtcgBreakUp4 - sumUD35_4_ltcg10Per);
			sumUD35_4_ltcg10Per=0;
		}
		
		if(sumUD35_4_ltcg10Per>templtcgBreakUp5){
			sumUD35_4_ltcg10Per = sumUD35_4_ltcg10Per - templtcgBreakUp5;
			templtcgBreakUp5 =0;
		}else{
			templtcgBreakUp5= zeroOrMore(templtcgBreakUp5 - sumUD35_4_ltcg10Per);
			sumUD35_4_ltcg10Per=0;
		}
		
		if(sumUD35_4_ltcg10Per>templtcgBreakUp6){
			sumUD35_4_ltcg10Per = sumUD35_4_ltcg10Per - templtcgBreakUp6;
			templtcgBreakUp6 =0;
		}else{
			templtcgBreakUp6 = zeroOrMore(templtcgBreakUp6 - sumUD35_4_ltcg10Per);
			sumUD35_4_ltcg10Per=0;
		}
		
		if(sumUD35_4_ltcg10Per>templtcgBreakUp7){
			sumUD35_4_ltcg10Per = sumUD35_4_ltcg10Per - templtcgBreakUp7;
			templtcgBreakUp7 =0;
		}else{
			templtcgBreakUp7 = zeroOrMore(templtcgBreakUp7 - sumUD35_4_ltcg10Per);
			sumUD35_4_ltcg10Per=0;
		}
		
		if(sumUD35_4_ltcg10Per>templtcgBreakUp8){
			sumUD35_4_ltcg10Per = sumUD35_4_ltcg10Per - templtcgBreakUp8;
			templtcgBreakUp8 =0;
		}else{
			templtcgBreakUp8 = zeroOrMore(templtcgBreakUp8 - sumUD35_4_ltcg10Per);
			sumUD35_4_ltcg10Per=0;
		}
		
		if(sumUD35_4_ltcg10Per>templtcgBreakUp3){
			sumUD35_4_ltcg10Per = sumUD35_4_ltcg10Per - templtcgBreakUp3;
			templtcgBreakUp3 =0;
		}else{
			templtcgBreakUp3 = zeroOrMore(templtcgBreakUp3 - sumUD35_4_ltcg10Per);
			sumUD35_4_ltcg10Per=0;
		}
		
		
		cgosIncome.cgInc.stcg.prctg30 = tempstcgBreakUp1;
		cgosIncome.cgInc.stcg.prctgAr = tempstcgBreakUp2;
		cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii = tempstcgBreakUp3;
		cgosIncome.cgInc.stcg.prctg15.sec111a = tempstcgBreakUp4;
		cgosIncome.cgInc.ltcg.prctg20.sec112 = templtcgBreakUp1;
		cgosIncome.cgInc.ltcg.prctg20.sec11EA = templtcgBreakUp2;
		cgosIncome.cgInc.ltcg.prctg10.secProviso = templtcgBreakUp3;
		cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2 = templtcgBreakUp4;
		cgosIncome.cgInc.ltcg.prctg10.sec115AC_1 = templtcgBreakUp5;
		cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1 = templtcgBreakUp6;
		cgosIncome.cgInc.ltcg.prctg10.sec115AD_3 = templtcgBreakUp7;
		cgosIncome.cgInc.ltcg.prctg10.sec115E_b = templtcgBreakUp8;
		                    
		calcCFL(specltvIncSetOff, specfdIncSetOff);

	}catch(e){
		alert('error in calcBFLA' + e.stack);
	}
}

// Calculate Income for Schedule CFL.
function calcCFL(specltvIncSetOff, specfdIncSetOff){

	try {
	
	document.getElementsByName('scheduleCFL.adjTotBFLossInBFLA.lossSummaryDetail.hpLossCF')[0].value = zeroOrMore(document.getElementsByName('scheduleBFLA.hp.incBFLA.bFlossPrevYrUndSameHeadSetoff')[0].value);
	
	document.getElementsByName('scheduleCFL.adjTotBFLossInBFLA.lossSummaryDetail.busLossOthThanSpecLossCF')[0].value = 
				parseInt(zeroOrMore(document.getElementsByName('scheduleBFLA.busProfInclSpecProf.incBFLA.bFlossPrevYrUndSameHeadSetoff')[0].value),10)+
				parseInt(zeroOrMore(coalescePath('scheduleBFLA.speculativeInc.incBFLA.bFlossPrevYrUndSameHeadSetoff') - specltvIncSetOff),10)+
				parseInt(zeroOrMore(coalescePath('scheduleBFLA.specifiedInc.incBFLA.bFlossPrevYrUndSameHeadSetoff') - specfdIncSetOff),10);
		
		document.getElementsByName('scheduleCFL.adjTotBFLossInBFLA.lossSummaryDetail.lossFrmSpecBusCF')[0].value = specltvIncSetOff;
		document.getElementsByName('scheduleCFL.adjTotBFLossInBFLA.lossSummaryDetail.lossFrmSpecifiedBusCF')[0].value = specfdIncSetOff;
		
		document.getElementsByName('scheduleCFL.adjTotBFLossInBFLA.lossSummaryDetail.othSrcLossRaceHorseCF')[0].value = zeroOrMore(document.getElementsByName('scheduleBFLA.profitFrmRaceHorse.incBFLA.bFlossPrevYrUndSameHeadSetoff')[0].value);
		
		// scheduleCFL.adjTotBFLossInBFLA.lossSummaryDetail.hpLossCF
		document.getElementsByName('scheduleCFL.currentAYloss.lossSummaryDetail.hpLossCF')[0].value =
			Math.abs(coalescePath('scheduleCYLA.lossRemAftSetOff.balHPlossCurYrAftSetoff'));
		document.getElementsByName('scheduleCFL.currentAYloss.lossSummaryDetail.busLossOthThanSpecLossCF')[0].value =
			Math.abs(coalescePath('scheduleCYLA.lossRemAftSetOff.balBusLossAftSetoff'));
		
		// setting values to 0 before populating - specu, specified, stcg , ltcg
		document.getElementsByName('scheduleCFL.currentAYloss.lossSummaryDetail.lossFrmSpecBusCF')[0].value = parseInt(0,10);
		document.getElementsByName('scheduleCFL.currentAYloss.lossSummaryDetail.lossFrmSpecifiedBusCF')[0].value = parseInt(0,10);
		document.getElementsByName('scheduleCFL.currentAYloss.lossSummaryDetail.stcgLossCF')[0].value = parseInt(0,10);
		document.getElementsByName('scheduleCFL.currentAYloss.lossSummaryDetail.ltcgLossCF')[0].value = parseInt(0,10);
		
		// speculative  ---- mod(B41) of schedule BP if B41 is -ve
		if(coalescePath('itr4ScheduleBP.specBusinessInc.adjustedPLFrmSpecuBus') < 0 ){
			document.getElementsByName('scheduleCFL.currentAYloss.lossSummaryDetail.lossFrmSpecBusCF')[0].value =
				Math.abs(coalescePath('itr4ScheduleBP.specBusinessInc.adjustedPLFrmSpecuBus'));
		}
		
		// specified   ---- mod(C47)  of schedule BP only if C47 is -ve
		if(coalescePath('itr4ScheduleBP.specifiedBusinessInc.pLFrmSpecifiedBus') < 0){
			document.getElementsByName('scheduleCFL.currentAYloss.lossSummaryDetail.lossFrmSpecifiedBusCF')[0].value =
				Math.abs(coalescePath('itr4ScheduleBP.specifiedBusinessInc.pLFrmSpecifiedBus'));
		}
		
		
		
		var totalSTCG = coalescePath('scheduleCGPost45.currYrLosses.lossRemainSetOff.stclSetoff15Per') +
			coalescePath('scheduleCGPost45.currYrLosses.lossRemainSetOff.stclSetoff30Per') +
			coalescePath('scheduleCGPost45.currYrLosses.lossRemainSetOff.stclSetoffAppRate');

		var totalLTCG = coalescePath('scheduleCGPost45.currYrLosses.lossRemainSetOff.ltclSetOff10Per') +
				coalescePath('scheduleCGPost45.currYrLosses.lossRemainSetOff.ltclSetOff20Per') ;
				
		
		document.getElementsByName('scheduleCFL.currentAYloss.lossSummaryDetail.stcgLossCF')[0].value = totalSTCG;
		
		document.getElementsByName('scheduleCFL.currentAYloss.lossSummaryDetail.ltcgLossCF')[0].value = totalLTCG;
		
		// os ----- Enter current year OS if any from 4c of Sch OS. ie. any negative figure.
		document.getElementsByName('scheduleCFL.currentAYloss.lossSummaryDetail.othSrcLossRaceHorseCF')[0].value = parseInt(0,10);
		if(coalescePath('scheduleOS.incFromOwnHorse.balanceOwnRaceHorse') < 0){
			document.getElementsByName('scheduleCFL.currentAYloss.lossSummaryDetail.othSrcLossRaceHorseCF')[0].value =
				Math.abs(coalescePath('scheduleOS.incFromOwnHorse.balanceOwnRaceHorse'));
		}
		
		var firstHp = document.getElementsByName('scheduleCFL.lossCFFromPrev8ThYearFromAY.carryFwdLossDetail.hpLossCF')[0].value;
		var firstBus = document.getElementsByName('scheduleCFL.lossCFFromPrev8ThYearFromAY.carryFwdLossDetail.busLossOthThanSpecLossCF')[0].value;
		var firstSpeculatvBus = document.getElementsByName('scheduleCFL.lossCFFromPrev4ThYearFromAY.carryFwdLossDetail.lossFrmSpecBusCF')[0].value;
		var firstShortTerm = document.getElementsByName('scheduleCFL.lossCFFromPrev8ThYearFromAY.carryFwdLossDetail.stcgLossCF')[0].value;
		var firstLongTerm = document.getElementsByName('scheduleCFL.lossCFFromPrev8ThYearFromAY.carryFwdLossDetail.ltcgLossCF')[0].value;
		var firstOth = document.getElementsByName('scheduleCFL.lossCFFromPrev4ThYearFromAY.carryFwdLossDetail.othSrcLossRaceHorseCF')[0].value;
		
		var adjstHp = document.getElementsByName('scheduleCFL.adjTotBFLossInBFLA.lossSummaryDetail.hpLossCF')[0].value;
		var adjstBus = document.getElementsByName('scheduleCFL.adjTotBFLossInBFLA.lossSummaryDetail.busLossOthThanSpecLossCF')[0].value;
		var adjstSpeculatvBus = document.getElementsByName('scheduleCFL.adjTotBFLossInBFLA.lossSummaryDetail.lossFrmSpecBusCF')[0].value;
		var adjstSpecifdBus = document.getElementsByName('scheduleCFL.adjTotBFLossInBFLA.lossSummaryDetail.lossFrmSpecifiedBusCF')[0].value;
		var adjstShortTerm = document.getElementsByName('scheduleCFL.adjTotBFLossInBFLA.lossSummaryDetail.stcgLossCF')[0].value;
		var adjstLongTerm = document.getElementsByName('scheduleCFL.adjTotBFLossInBFLA.lossSummaryDetail.ltcgLossCF')[0].value;
		var adjstOth = document.getElementsByName('scheduleCFL.adjTotBFLossInBFLA.lossSummaryDetail.othSrcLossRaceHorseCF')[0].value;
		
		if(parseInt(firstHp, 10)>parseInt(adjstHp, 10)){
		document.getElementsByName('scheduleCFL.totalLossCFSummary.lossSummaryDetail.hpLossCF')[0].value =
			zeroOrMore(coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.hpLossCF') - firstHp +
			coalescePath('scheduleCFL.currentAYloss.lossSummaryDetail.hpLossCF'));
		}else{
		document.getElementsByName('scheduleCFL.totalLossCFSummary.lossSummaryDetail.hpLossCF')[0].value =
			zeroOrMore(coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.hpLossCF') - adjstHp +
			coalescePath('scheduleCFL.currentAYloss.lossSummaryDetail.hpLossCF'));			
		}
		
		if(parseInt(firstBus, 10)>parseInt(adjstBus, 10)){
		document.getElementsByName('scheduleCFL.totalLossCFSummary.lossSummaryDetail.busLossOthThanSpecLossCF')[0].value =
			zeroOrMore(coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.busLossOthThanSpecLossCF')- firstBus +
			coalescePath('scheduleCFL.currentAYloss.lossSummaryDetail.busLossOthThanSpecLossCF'));
		}else{
		document.getElementsByName('scheduleCFL.totalLossCFSummary.lossSummaryDetail.busLossOthThanSpecLossCF')[0].value =
			zeroOrMore(coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.busLossOthThanSpecLossCF')- adjstBus +
			coalescePath('scheduleCFL.currentAYloss.lossSummaryDetail.busLossOthThanSpecLossCF'));		
		}
		
		if(parseInt(firstSpeculatvBus, 10) > parseInt(adjstSpeculatvBus, 10)){
		document.getElementsByName('scheduleCFL.totalLossCFSummary.lossSummaryDetail.lossFrmSpecBusCF')[0].value =
			zeroOrMore(coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.lossFrmSpecBusCF')-firstSpeculatvBus+
			coalescePath('scheduleCFL.currentAYloss.lossSummaryDetail.lossFrmSpecBusCF'));
		}else{
		document.getElementsByName('scheduleCFL.totalLossCFSummary.lossSummaryDetail.lossFrmSpecBusCF')[0].value =
			zeroOrMore(coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.lossFrmSpecBusCF')-adjstSpeculatvBus+
			coalescePath('scheduleCFL.currentAYloss.lossSummaryDetail.lossFrmSpecBusCF'));		
		}
		

		document.getElementsByName('scheduleCFL.totalLossCFSummary.lossSummaryDetail.lossFrmSpecifiedBusCF')[0].value =
			zeroOrMore(coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.lossFrmSpecifiedBusCF')-adjstSpecifdBus+
			coalescePath('scheduleCFL.currentAYloss.lossSummaryDetail.lossFrmSpecifiedBusCF'));		
		
		if(parseInt(firstShortTerm, 10)>parseInt(adjstShortTerm, 10)){
		document.getElementsByName('scheduleCFL.totalLossCFSummary.lossSummaryDetail.stcgLossCF')[0].value =
			zeroOrMore(coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.stcgLossCF')-firstShortTerm+
			coalescePath('scheduleCFL.currentAYloss.lossSummaryDetail.stcgLossCF'));
		}else{
		document.getElementsByName('scheduleCFL.totalLossCFSummary.lossSummaryDetail.stcgLossCF')[0].value =
			zeroOrMore(coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.stcgLossCF')-adjstShortTerm+
			coalescePath('scheduleCFL.currentAYloss.lossSummaryDetail.stcgLossCF'));		
		}
		
		if(parseInt(firstLongTerm, 10)>parseInt(adjstLongTerm, 10)){
		document.getElementsByName('scheduleCFL.totalLossCFSummary.lossSummaryDetail.ltcgLossCF')[0].value =
			zeroOrMore(coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.ltcgLossCF')-firstLongTerm+
			coalescePath('scheduleCFL.currentAYloss.lossSummaryDetail.ltcgLossCF'));
		}else{
		document.getElementsByName('scheduleCFL.totalLossCFSummary.lossSummaryDetail.ltcgLossCF')[0].value =
			zeroOrMore(coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.ltcgLossCF')-adjstLongTerm+
			coalescePath('scheduleCFL.currentAYloss.lossSummaryDetail.ltcgLossCF'));		
		}
		
		if(parseInt(firstOth, 10)>parseInt(adjstOth, 10)){
		document.getElementsByName('scheduleCFL.totalLossCFSummary.lossSummaryDetail.othSrcLossRaceHorseCF')[0].value =
			zeroOrMore(coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.othSrcLossRaceHorseCF')-firstOth+
			coalescePath('scheduleCFL.currentAYloss.lossSummaryDetail.othSrcLossRaceHorseCF'));

		}else{
		document.getElementsByName('scheduleCFL.totalLossCFSummary.lossSummaryDetail.othSrcLossRaceHorseCF')[0].value =
			zeroOrMore(coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.othSrcLossRaceHorseCF')-adjstOth+
			coalescePath('scheduleCFL.currentAYloss.lossSummaryDetail.othSrcLossRaceHorseCF'));		

		}
		
		}catch(e){
		alert('error in calcCFL()= '+e.stack);
	}

}

// Calculate Income for Schedule UD.
function calcUD(){
	try{
		//validateUD();
		var table = document.getElementById('scheduleUD');
		var rowCount = table.rows.length;
		var sumTotal=0;
		for(var i=0;i<rowCount-5;i++){
			if(document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].amtBFUD')[0].value!='' || document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].amtDepCurYr')[0].value!=''
                                 || coalesce(document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].amountBFUA')[0].value)!='' || document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].amountASACYIncome')[0].value!=''  )
                             {

				document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].balCFNY')[0].value =
				eval(parseInt(coalesce(document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].amtBFUD')[0].value) ,10)-
				parseInt(coalesce(document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].amtDepCurYr')[0].value) ,10));
                            
                               document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].balOfAllowance')[0].value =
				eval(parseInt(coalesce(document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].amountBFUA')[0].value) ,10)-
				parseInt(coalesce(document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].amountASACYIncome')[0].value) ,10));
                            
                            
                            
				if(document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].balCFNY')[0].value <0)  {
					document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].balCFNY')[0].value=0;
                                       
				}
                                if(document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].balOfAllowance')[0].value <0)  {
					document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].balOfAllowance')[0].value=0;
                                       
				}
				
			}
                        else{
			 document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].balCFNY')[0].value = '';
			}
				sumTotal = eval( parseInt(sumTotal,10) + parseInt(coalesce(document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].balCFNY')[0].value),10));

		}

		
		coalesceSetRet('itrScheduleUD.totalBalCFNY');
	
		//calcTotalUD();
	}
        catch(e){
		alert(e);
	}
}

// Calculate Total Income for Schedule UD.
function calcTotalUD(){
    try{ 
        var table = document.getElementById('scheduleUD');
        var rowCount = table.rows.length;
        var totalamtBFUD = 0;
        var totalamtDepCurYr = 0;
        var totalbalCFNY = 0;
        var totalamountBFUA = 0;
        var totalamountASACYIncome = 0;
        var totalbalOfAllowance = 0;
        for(var i=0;i<rowCount-5;i++){
		
	         totalamtBFUD=eval( parseInt(totalamtBFUD,10) + parseInt(coalesce(document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].amtBFUD')[0].value),10));
	         totalamtDepCurYr=eval( parseInt(totalamtDepCurYr,10) + parseInt(coalesce(document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].amtDepCurYr')[0].value),10));
	         totalbalCFNY=eval( parseInt(totalbalCFNY,10) + parseInt(coalesce(document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].balCFNY')[0].value),10));
	         totalamountBFUA=eval( parseInt(totalamountBFUA,10) + parseInt(coalesce(document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].amountBFUA')[0].value),10));
	         totalamountASACYIncome=eval( parseInt(totalamountASACYIncome,10) + parseInt(coalesce(document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].amountASACYIncome')[0].value),10));
	         totalbalOfAllowance=eval( parseInt(totalbalOfAllowance,10) + parseInt(coalesce(document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].balOfAllowance')[0].value),10));
              
              if((document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].amtBFUD')[0].value)< (document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].amtDepCurYr')[0].value)) {
					document.getElementsByName('itrScheduleUD.totalamtDepCurYr')[0].value=0;
              }    
		 }
		 
		var CurYrbalCFNY = parseInt(coalesce(document.getElementsByName('itrScheduleUD.scheduleUD.CurYrbalCFNY')[0].value),10);
		var CurYrbalOfAllowance = parseInt(coalesce(document.getElementsByName('itrScheduleUD.scheduleUD.CurYrbalOfAllowance')[0].value),10);
		
	    document.getElementsByName('itrScheduleUD.totalamtBFUD')[0].value =parseInt(totalamtBFUD,10);
	    document.getElementsByName('itrScheduleUD.totalamtDepCurYr')[0].value =parseInt(totalamtDepCurYr,10);
	    document.getElementsByName('itrScheduleUD.totalBalCFNY')[0].value =parseInt(totalbalCFNY,10)+parseInt(CurYrbalCFNY,10);
	    document.getElementsByName('itrScheduleUD.totalamountBFUA')[0].value =parseInt(totalamountBFUA,10);
	    document.getElementsByName('itrScheduleUD.amountASACYIncome')[0].value =parseInt(totalamountASACYIncome,10);
	    document.getElementsByName('itrScheduleUD.totalbalOfAllowance')[0].value =parseInt(totalbalOfAllowance,10)+parseInt(CurYrbalOfAllowance,10);
	    
	     if(document.getElementsByName('itrScheduleUD.totalamtBFUD')[0].value <0)  {
				document.getElementsByName('itrScheduleUD.totalamtBFUD')[0].value=0;
	     }       
	     if(document.getElementsByName('itrScheduleUD.totalamtDepCurYr')[0].value <0)  {
				document.getElementsByName('itrScheduleUD.totalamtDepCurYr')[0].value=0;
	     } 
	     if(document.getElementsByName('itrScheduleUD.totalBalCFNY')[0].value <0)  {
				document.getElementsByName('itrScheduleUD.totalBalCFNY')[0].value=0;
	     } 
	     
	     if(document.getElementsByName('itrScheduleUD.totalamountBFUA')[0].value <0)  {
				document.getElementsByName('itrScheduleUD.totalamountBFUA')[0].value=0;
	     } 
	     if(document.getElementsByName('itrScheduleUD.amountASACYIncome')[0].value <0)  {
				document.getElementsByName('itrScheduleUD.amountASACYIncome')[0].value=0;
	     } 
	     if(document.getElementsByName('itrScheduleUD.totalbalOfAllowance')[0].value <0)  {
				document.getElementsByName('itrScheduleUD.totalbalOfAllowance')[0].value=0;
	     }
    }
     catch(e){
        alert(e.stack);
    }

}


//Calculate Total Income for Schedule ICDS.
function calcTotalICDS(){
    try{ 
        var totalNatEffect = document.getElementsByName('itrScheduleICDS.totNetEffect')[0];
		
        totalNatEffect.value=eval( parseInt(coalesce(document.getElementsByName('itrScheduleICDS.accntPolicies')[0].value),10) + 
        		parseInt(coalesce(document.getElementsByName('itrScheduleICDS.valInventories')[0].value),10) + 
        		parseInt(coalesce(document.getElementsByName('itrScheduleICDS.constructionCon')[0].value),10) + 
        		parseInt(coalesce(document.getElementsByName('itrScheduleICDS.revenueRecog')[0].value),10) + 
        		parseInt(coalesce(document.getElementsByName('itrScheduleICDS.tangFixedAssets')[0].value),10) + 
        		parseInt(coalesce(document.getElementsByName('itrScheduleICDS.foriegnExcRates')[0].value),10) + 
        		parseInt(coalesce(document.getElementsByName('itrScheduleICDS.govGrants')[0].value),10) + 
        		parseInt(coalesce(document.getElementsByName('itrScheduleICDS.securities')[0].value),10) + 
        		parseInt(coalesce(document.getElementsByName('itrScheduleICDS.assets')[0].value),10) + 
        		parseInt(coalesce(document.getElementsByName('itrScheduleICDS.borrowingCosts')[0].value),10))
        		
        		//populates to OI point 3
        		document.getElementsByName('partaoi.profDeviatDueAcctMeth')[0].value = parseInt(coalesce(totalNatEffect.value),10);
        		
    }
     catch(e){
        alert(e.stack);
    }

}

// Delete Row for Schedule UD.
function deleteRowTableScheduleUD(tx,ty,tz){

	deleteRowTableUD(tx,ty,tz);
	calcUD();
}

// Calculate Tax Deduction for Schedule 10A.
function calc10A(){
	try{
		var table = document.getElementById('taxDed10AId');
		var rowCount = table.rows.length;
		var sumTotal=0;
		for(var i=0;i<rowCount-4;i++){
			sumTotal = eval(parseInt(sumTotal,10) + parseInt(coalesce(document.getElementsByName('schedule10A.deductSEZ.dedUs10Detail['+i+'].dedFromUndertaking')[0].value),10));
		}

		document.getElementsByName('schedule10A.deductSEZ.dedUs10Detail.totalDedUs10Sub')[0].value  = parseInt(sumTotal,10);
		document.getElementsByName('schedule10A.totalDedUs10A')[0].value  = parseInt(coalesce(sumTotal),10);

	}catch(e){
			alert(e.stack);
	}
}

// Add Row to Schedule 10A.
function addRowToTable10A(tx,ty,tz){
	addRowToTable(tx,ty,tz);
	var table = document.getElementById('taxDed10AId');
	var rowCount = table.rows.length;
	for(var i=0;i<rowCount-4;i++){
			document.getElementsByName('schedule10A.deductSEZ.dedUs10Detail['+i+'].dedFromUndertaking')[0].parentNode.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML=
				'Undertaking No.'+eval(parseInt(i,10)+1);
	}
}

// Delete Row for Schedule 10A.
function deleteRowTableTaxDed10AId(tx,ty,tz){
	deleteRowTable(tx,ty,tz);
	calc10A();
	var table = document.getElementById('taxDed10AId');
	var rowCount = table.rows.length;
	for(var i=0;i<rowCount-3;i++){
			document.getElementsByName('schedule10A.deductSEZ.dedUs10Detail['+i+'].dedFromUndertaking')[0].parentNode.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML=
				'Undertaking No.'+eval(parseInt(i,10)+1);
	}
}

// Calculate Tax for Schedule 10AA.
function calc10AA(){
	try{
		var table = document.getElementById('taxDed10AAId');
		var rowCount = table.rows.length;
		var sumTotal=0;
		for(var i=0;i<rowCount-4;i++){
			sumTotal = eval(parseInt(sumTotal,10) + parseInt(coalesce(document.getElementsByName('schedule10AA.deductSEZ.dedUs10Detail['+i+'].dedFromUndertaking')[0].value),10));
		}
		coalesceSetRet('schedule10AA.deductSEZ.dedUs10Detail.totalDedUs10Sub');
		document.getElementsByName('schedule10AA.deductSEZ.dedUs10Detail.totalDedUs10Sub')[0].value  = parseInt(coalesce(sumTotal),10);

	}catch(e){
			alert(e.stack);
	}
}

function set10ASlNoOnload() {
	
	var table = document.getElementById('taxDed10AId');
	var rowCount = table.rows.length;
	for(var i=0;i<rowCount-4;i++){
			document.getElementsByName('schedule10A.deductSEZ.dedUs10Detail['+i+'].dedFromUndertaking')[0].parentNode.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML=
				'Undertaking No.'+eval(parseInt(i,10)+1);
	}
	
	var table = document.getElementById('taxDed10AAId');
	var rowCount = table.rows.length;
	for(var i=0;i<rowCount-4;i++){
			document.getElementsByName('schedule10AA.deductSEZ.dedUs10Detail['+i+'].dedFromUndertaking')[0].parentNode.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML=
				'Undertaking No.'+eval(parseInt(i,10)+1);
	}
	
}

// Add Row to Schedule 10AA.
function addRowToTable10AA(tx,ty,tz){
	addRowToTable(tx,ty,tz);
	var table = document.getElementById('taxDed10AAId');
	var rowCount = table.rows.length;
	for(var i=0;i<rowCount-4;i++){
			document.getElementsByName('schedule10AA.deductSEZ.dedUs10Detail['+i+'].dedFromUndertaking')[0].parentNode.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML=
				'Undertaking No.'+eval(parseInt(i,10)+1);
	}
}

// delete Row to Schedule 10AA.
function deleteRowTableTaxDed10AAId(tx,ty,tz){
	deleteRowTable(tx,ty,tz);
	calc10AA();
	var table = document.getElementById('taxDed10AAId');
	var rowCount = table.rows.length;
	for(var i=0;i<rowCount-3;i++){
			document.getElementsByName('schedule10AA.deductSEZ.dedUs10Detail['+i+'].dedFromUndertaking')[0].parentNode.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML=
				'Undertaking No.'+eval(parseInt(i,10)+1);
	}
}

// Function to validate Schedule UD.
function validateUD(){
	var tab = document.getElementById('scheduleUD');
	var allInputTags = tab.getElementsByTagName('input');
	for(var i = 0; i < allInputTags.length; i++) {
			if (allInputTags[i].name.match("amtDepCurYr$")) {
				if(parseInt(allInputTags[i].value,10) >  parseInt(allInputTags[i-1].value,10)){
					j.setFieldError(allInputTags[i].name,'Amount of depreciation set-off against the current year income cannot be more than Amount of brought forward unabsorbed depreciation.');
					addError(allInputTags[i],'Amount of depreciation set-off against the current year income cannot be more than Amount of brought forward unabsorbed depreciation.',true);
				}
			}
                        if (allInputTags[i].name.match("amountASACYIncome$")) {
				if(parseInt(allInputTags[i].value,10) >  parseInt(allInputTags[i-1].value,10)){
					j.setFieldError(allInputTags[i].name,'Amount of allowance set-off against the current year income cannot exceed amount of brought forward unabsorbed allowance.');
					addError(allInputTags[i],'Amount of allowance set-off against the current year income cannot exceed amount of brought forward unabsorbed allowance.',true);
				}
			}
		}
}

// Add Row to Schedule 80G Tables.
function addRowToTable80(tx,ty,tz,tn){
	addRowToTable(tx,ty,tz);
	var table = document.getElementById(tx);
	var rowCount = table.rows.length;
	for(var i=0;i<rowCount-2;i++){
            var name=tn+'['+i+']';
			document.getElementsByName(name)[0].parentNode.previousSibling.previousSibling.innerHTML=
				'Undertaking No.'+eval(parseInt(i,10)+1);
	}
}

// Delete Row to Schedule 80G Tables.
function deleteRowTableTaxDed80(tx,ty,tz,tn){
	deleteRowTable(tx,ty,tz);
	
	var table = document.getElementById(tx);
	var rowCount = table.rows.length;
	for(var i=0;i<rowCount-2;i++){
            var name=tn+'['+i+']';
			document.getElementsByName(name)[0].parentNode.previousSibling.previousSibling.innerHTML=
				'Undertaking No.'+eval(parseInt(i,10)+1);
	}
}

// Delete Schedule HP.
function delScheduleHPForITR4(){

	if($('#scheduleHPAddRow')[0].parentNode.children.length>50){
		for(var i=0;i<21;i++){
			$('#scheduleHPAddRow')[0].parentNode.deleteRow($('#scheduleHPAddRow')[0].parentNode.children.length-6);
		}
		if($('#scheduleHPAddRow')[0].parentNode.children.length==47){
			$('#delHPButtonId').prop('disabled', true);
		}
	}else if($('#scheduleHPAddRow')[0].parentNode.children.length==47){
		$('#delHPButtonId').prop('disabled', true);
	}
	
	($('#scheduleHPLast')[0].children)[0].innerHTML =  parseInt(($('#scheduleHPLast')[0].children)[0].innerHTML) - 1;
	
	var totRow=document.getElementById('scheduleHPLast').cells[0].textContent;
	
	var newVal = eval( parseInt(totRow));
	var newText='Total (';
	for(var k=1;k<newVal;k++){
		newText=newText+k+'j +'; //j will be according to the html sl no
	}
	newText=newText+newVal+'a  )';
	document.getElementById('scheduleHPLast').cells[0].innerHTML=newVal;
	document.getElementById('scheduleHPLast').nextElementSibling.cells[3].innerHTML=newVal+'a';
	document.getElementById('scheduleHPLast').nextElementSibling.nextElementSibling.cells[2].innerHTML=newVal+'b';
	document.getElementById('scheduleHPLast').nextElementSibling.nextElementSibling.cells[1].innerHTML=newText;
	var table=document.getElementById('scheduleHPMain');
	
	modifyRow(table);
	calcITR4();
}

// Calculate Tax for Schedule TCS.
function calculateTCS(){
	var TCS = parseInt('0' ,10);
	var tcsTAB = document.getElementById('scheduleTCS');
	var allInputTags = tcsTAB.getElementsByTagName('input');
		for(var i = 0; i < allInputTags.length; i++) {
			if (allInputTags[i].name.match("amtTCSClaimedThisYear$")) {
				
			if(eval(parseInt(coalesce(allInputTags[i].value),10)) >  eval(parseInt(coalesce(allInputTags[i-1].value),10) + parseInt(coalesce(allInputTags[i-2].value),10))){
				
					addError(allInputTags[i],'Amount claimed cannot exceed Total Tax collected',true);
					j.setFieldError(allInputTags[i].name,'Amount claimed cannot exceed Total Tax collected');
					allInputTags[i].value = '0';
					
					TCS = eval(parseInt(TCS ,10) + parseInt(isNVL(allInputTags[i].value) ,10));
				}else{
					TCS = eval(parseInt(TCS ,10) + parseInt(isNVL(allInputTags[i].value) ,10));
				}
			allInputTags[i+1].value=eval(parseInt(isNVL(allInputTags[i-1].value) ,10) + parseInt(isNVL(allInputTags[i-2].value) ,10)-parseInt(isNVL(allInputTags[i].value) ,10));
			}
		}
	document.getElementsByName('partBTTI.taxPaid.taxesPaid.tcs')[0].value = parseInt(TCS,10);
	document.getElementsByName('itr4.scheduleTCS.totalTcSSalary')[0].value = parseInt(TCS,10);
	return TCS;
}

// calculate Income for PartA-OI.
function calcPartAOI(){
try{
	//5f
	coalesceSetRet('partaoi.noCredToPLAmt.totNoCredToPLAmt');
	document.getElementsByName('partaoi.noCredToPLAmt.totNoCredToPLAmt')[0].value = eval(
		parseInt(coalesceSetRet('partaoi.noCredToPLAmt.section28Items'),10)+
		parseInt(coalesceSetRet('partaoi.noCredToPLAmt.proformaCreditsDue'),10)+
		parseInt(coalesceSetRet('partaoi.noCredToPLAmt.prevYrEscalClaim'),10)+
		parseInt(coalesceSetRet('partaoi.noCredToPLAmt.othItemInc'),10)+
		parseInt(coalesceSetRet('partaoi.noCredToPLAmt.capReceipt'),10));

	//6r
	coalesceSetRet('partaoi.amtDisallUs36.totAmtDisallUs36');
	document.getElementsByName('partaoi.amtDisallUs36.totAmtDisallUs36')[0].value = eval(
		parseInt(coalesceSetRet('partaoi.amtDisallUs36.stkInsurPrem'),10)+
		parseInt(coalesceSetRet('partaoi.amtDisallUs36.empHealthInsurPrem'),10)+
		parseInt(coalesceSetRet('partaoi.amtDisallUs36.empBonusCommSum'),10)+
		parseInt(coalesceSetRet('partaoi.amtDisallUs36.intOnBorrCap'),10)+
		parseInt(coalesceSetRet('partaoi.amtDisallUs36.zeroCoupBondDisc'),10)+
		parseInt(coalesceSetRet('partaoi.amtDisallUs36.recogPFContribAmt'),10)+
		parseInt(coalesceSetRet('partaoi.amtDisallUs36.appSuperAnnFundAmt'),10)+
                parseInt(coalesceSetRet('partaoi.amtDisallUS36.pensionAmt80CCD'),10)+
		parseInt(coalesceSetRet('partaoi.amtDisallUs36.appGratFundAmt'),10)+
		parseInt(coalesceSetRet('partaoi.amtDisallUs36.othFundAmt'),10)+
                parseInt(coalesceSetRet('partaoi.amtDisallUs36.empContributionCredits'),10)+
		parseInt(coalesceSetRet('partaoi.amtDisallUs36.badDebtDoubtAmt'),10)+
		parseInt(coalesceSetRet('partaoi.amtDisallUs36.badDebtDoubtProvn'),10)+
		parseInt(coalesceSetRet('partaoi.amtDisallUs36.specResrvTranfr'),10)+
		parseInt(coalesceSetRet('partaoi.amtDisallUs36.famPlanPromoExp'),10)+
                parseInt(coalesceSetRet('partaoi.amtDisallUS36.securityAmt'),10)+
		parseInt(coalesceSetRet('partaoi.amtDisallUs36.anyOthDisallowance'),10)
		);

		//7j
	coalesceSetRet('partaoi.amtDisallUs37.totAmtDisallUs37');
	document.getElementsByName('partaoi.amtDisallUs37.totAmtDisallUs37')[0].value = eval(
                parseInt(coalesceSetRet('partaoi.amtDisallUS37.capNatureExp'),10)+
		parseInt(coalesceSetRet('partaoi.amtDisallUs37.personalExp'),10)+
                parseInt(coalesceSetRet('partaoi.amtDisallUS37.bussinessExp'),10)+
		parseInt(coalesceSetRet('partaoi.amtDisallUs37.politicPartyExp'),10)+
		parseInt(coalesceSetRet('partaoi.amtDisallUs37.lawVoilatPenalExp'),10)+
		parseInt(coalesceSetRet('partaoi.amtDisallUs37.othPenalFineExp'),10)+
		parseInt(coalesceSetRet('partaoi.amtDisallUs37.offenceExp'),10)+
		parseInt(coalesceSetRet('partaoi.amtDisallUs37.contigentLiability'),10)+
		parseInt(coalesceSetRet('partaoi.amtDisallUs37.othAmtNotAllowUs37'),10)
		);

	//8j
	coalesceSetRet('partaoi.amtDisallUs40.totAmtDisallUs40');
	document.getElementsByName('partaoi.amtDisallUs40.totAmtDisallUs40')[0].value = eval(
			parseInt(coalesceSetRet('partaoi.amtDisallUs40.nonCompChapXVIIBAmt'),10)+
                        parseInt(coalesceSetRet('partaoi.amtDisallUs40.nonCompSection40aiaAmt'),10)+
                        parseInt(coalesceSetRet('partaoi.amtDisallUs40.nonCompSection40aiiiAmt'),10)+
			parseInt(coalesceSetRet('partaoi.amtDisallUs40.taxAmtOnProfits'),10)+
			parseInt(coalesceSetRet('partaoi.amtDisallUs40.wtAmt'),10)+
			parseInt(coalesceSetRet('partaoi.amtDisallUs40.ncAmt'),10)+
            parseInt(coalesceSetRet('partaoi.amtDisallUs40.rolyatyOrServiceFee'),10)+
			parseInt(coalesceSetRet('partaoi.amtDisallUs40.intSalBonPartner'),10)+
			parseInt(coalesceSetRet('partaoi.amtDisallUs40.anyOthDisallowance'),10)
		);


	//9f
	coalesceSetRet('partaoi.amtDisallUs40A.totAmtDisallUs40A');
	document.getElementsByName('partaoi.amtDisallUs40A.totAmtDisallUs40A')[0].value = eval(
			parseInt(coalesceSetRet('partaoi.amtDisallUs40A.amtPaidUs40A2B'),10)+
			parseInt(coalesceSetRet('partaoi.amtDisallUs40A.amtGT20KCash'),10)+
			parseInt(coalesceSetRet('partaoi.amtDisallUs40A.provPmtGrat'),10)+
			parseInt(coalesceSetRet('partaoi.amtDisallUs40A.contToSetupTrust'),10)+
			parseInt(coalesceSetRet('partaoi.amtDisallUs40A.anyOthDisallowance'),10)
		);

	//10h
	coalesceSetRet('partaoi.amtDisallUs43BPyNowAll.amtUs43B.totAmtUs43B');
	document.getElementsByName('partaoi.amtDisallUs43BPyNowAll.amtUs43B.totAmtUs43B')[0].value = eval(
			parseInt(coalesceSetRet('partaoi.amtDisallUs43BPyNowAll.amtUs43B.taxDutyCesAmt'),10)+
			parseInt(coalesceSetRet('partaoi.amtDisallUs43BPyNowAll.amtUs43B.contToEmpPFSFGF'),10)+
			parseInt(coalesceSetRet('partaoi.amtDisallUs43BPyNowAll.amtUs43B.empBonusComm'),10)+
			parseInt(coalesceSetRet('partaoi.amtDisallUs43BPyNowAll.amtUs43B.intPayaleToFI'),10)+
			parseInt(coalesceSetRet('partaoi.amtDisallUs43BPyNowAll.amtUs43B.intPayaleToFISchBank'),10)+
			parseInt(coalesceSetRet('partaoi.amtDisallUs43BPyNowAll.amtUs43B.leaveEncashPayable'),10)
			);

	//11g
	coalesceSetRet('partaoi.amtDisall43B.amtUs43B.totAmtUs43B');
	document.getElementsByName('partaoi.amtDisall43B.amtUs43B.totAmtUs43B')[0].value = eval(
			parseInt(coalesceSetRet('partaoi.amtDisall43B.amtUs43B.taxDutyCesAmt'),10)+
			parseInt(coalesceSetRet('partaoi.amtDisall43B.amtUs43B.contToEmpPFSFGF'),10)+
			parseInt(coalesceSetRet('partaoi.amtDisall43B.amtUs43B.empBonusComm'),10)+
			parseInt(coalesceSetRet('partaoi.amtDisall43B.amtUs43B.intPayaleToFI'),10)+
			parseInt(coalesceSetRet('partaoi.amtDisall43B.amtUs43B.intPayaleToFISchBank'),10)+
			parseInt(coalesceSetRet('partaoi.amtDisall43B.amtUs43B.leaveEncashPayable'),10)+
			parseInt(coalesceSetRet('partaoi.amtDisall43B.amtUs43B.railwayAssetsPayable'),10)
			);

	//12e
	coalesceSetRet('partaoi.amtExciseCustomsVATOutstanding.exciseCustomsVAT.totExciseCustomsVAT');
	document.getElementsByName('partaoi.amtExciseCustomsVATOutstanding.exciseCustomsVAT.totExciseCustomsVAT')[0].value = eval(
			parseInt(coalesceSetRet('partaoi.amtExciseCustomsVATOutstanding.exciseCustomsVAT.unionExciseDuty'),10)+
			parseInt(coalesceSetRet('partaoi.amtExciseCustomsVATOutstanding.exciseCustomsVAT.serviceTax'),10)+
			parseInt(coalesceSetRet('partaoi.amtExciseCustomsVATOutstanding.exciseCustomsVAT.vaTorSaleTax'),10)+
			parseInt(coalesceSetRet('partaoi.amtExciseCustomsVATOutstanding.exciseCustomsVAT.othDutyTaxCess'),10)
			);
}catch(e){
	alert(e.stack);
}
}

// calculate Income for Schedule S.
function calSchS(tableId){
	try{

		var tab = document.getElementById(tableId);
		var rowcount= tab.rows.length;
		var salaryCount = parseInt(rowcount/14,10);// 14 --> Total number of fields will be added for each click 'Add Salary'
		var sumTotal=0;
		var salaryTotal=0;
		var exemptUs10Total = 0;

	for(var i = 0; i < salaryCount; i++) {

	var salary = document.getElementsByName('scheduleS.salaries['+i+'].salarys.salary')[0]; salary.value = coalesce(salary.value);
	var allowancesNotExempt = document.getElementsByName('scheduleS.salaries['+i+'].salarys.allowancesNotExempt')[0]; allowancesNotExempt.value = coalesce(allowancesNotExempt.value);
    var travelConcession = document.getElementsByName('scheduleS.salaries['+i+'].salarys.travelConcession')[0]; travelConcession.value = coalesce(travelConcession.value);
    var taxPaidNonMonetary = document.getElementsByName('scheduleS.salaries['+i+'].salarys.TaxPaidNonMonetary')[0]; taxPaidNonMonetary.value = coalesce(taxPaidNonMonetary.value);
    var allowanceExpHouseRent = document.getElementsByName('scheduleS.salaries['+i+'].salarys.allowanceExpHouseRent')[0]; allowanceExpHouseRent.value = coalesce(allowanceExpHouseRent.value);
    var otherAllowances = document.getElementsByName('scheduleS.salaries['+i+'].salarys.otherAllowances')[0]; otherAllowances.value = coalesce(otherAllowances.value);
	var valueOfPerquisites = document.getElementsByName('scheduleS.salaries['+i+'].salarys.valueOfPerquisites')[0]; valueOfPerquisites.value = coalesce(valueOfPerquisites.value);
	var profitsInLieuOfSalary = document.getElementsByName('scheduleS.salaries['+i+'].salarys.profitsinLieuOfSalary')[0]; profitsInLieuOfSalary.value = coalesce(profitsInLieuOfSalary.value);
	var deductionUS16 = document.getElementsByName('scheduleS.salaries['+i+'].salarys.deductionUnderSection16')[0]; deductionUS16.value = coalesce(deductionUS16.value);
	var incomeChargeable = document.getElementsByName('scheduleS.salaries['+i+'].salarys.incomeFromSalary')[0]; incomeChargeable.value = coalesce(incomeChargeable.value);
	
	salaryTotal = eval(parseInt( coalesce(salary.value) ,10) + parseInt( coalesce(allowancesNotExempt.value) ,10)
			+ parseInt( coalesce(valueOfPerquisites.value) ,10) + parseInt( coalesce(profitsInLieuOfSalary.value) ,10));
			
	 if((parseInt(salaryTotal,0) < parseInt( coalesce(deductionUS16.value)  ,10)) || parseInt( coalesce(deductionUS16.value),10) > 7500) {
				addErrorXHTML(document.getElementsByName('scheduleS.salaries['+i+'].salarys.deductionUnderSection16')[0],'Deduction u/s 16 should not exceed ' + Math.min(7500,zeroOrMore(salaryTotal)),true);
				document.getElementsByName('scheduleS.salaries['+i+'].salarys.deductionUnderSection16')[0].value="0";
		}
		
	incomeChargeable.value=eval(parseInt(salary.value,10)+parseInt(valueOfPerquisites.value,10)+parseInt(profitsInLieuOfSalary.value,10)+parseInt(allowancesNotExempt.value,10)-parseInt(deductionUS16.value,10));

	if(incomeChargeable.value<0){
		incomeChargeable.value=parseInt('0',10);
	}
	sumTotal = eval(parseInt(sumTotal,10) + parseInt(coalesce(document.getElementsByName('scheduleS.salaries['+i+'].salarys.incomeFromSalary')[0].value),10));
	exemptUs10Total = eval(parseInt(travelConcession.value,10)+parseInt(taxPaidNonMonetary.value,10)+parseInt(allowanceExpHouseRent.value,10)+parseInt(otherAllowances.value,10));
	document.getElementsByName('scheduleS.incomeChargeable')[0].value  = parseInt(sumTotal,10);
	document.getElementsByName('scheduleS.salaries['+i+'].salarys.allowancesExemptUSection10')[0].value = parseInt(exemptUs10Total,10);
    }


	}catch(e){
	alert('error in calSchS' +e);
	}
}

// add Row to Schedule Salary(S).
function addScheduleSalary(){
	var mainTable=document.getElementById('scheduleSalaryMain').rows;
	var tobeInsertBefore=document.getElementById('scheduleSalaryAddRow');
	var flag=false;
	var totRow=Math.floor(mainTable.length / 14) + 1;// 14 --> Total number of fields will be added for each click 'Add Salary'
	var iterate=eval(parseInt(totRow)-1);
	for(var i=0;i<mainTable.length;i++){
	var cloneNode=mainTable[i].cloneNode(true);
		if(mainTable[i].id =='scheduleSalary1st'){
		flag=true;
		cloneNode.cells[0].innerHTML=totRow;
		}

	if(flag ){
		
		var cellsTot=cloneNode.cells;
		for(var j=0;j<cellsTot.length;j++){
			cloneNode.cells[j].innerHTML=cloneNode.cells[j].
			
			
			innerHTML.replace('1a',totRow+'a').replace('1b',totRow+'b').replace('1c',totRow+'c').replace('1d',totRow+'d').replace('1e',totRow+'e').replace('1f',totRow+'f').replace('1g',totRow+'g').replace('1h',totRow+'h').replace('1i',totRow+'i').replace('property 1','property '+totRow).replace('property 1','property '+totRow);
		}
		
		var inputTags=cloneNode.getElementsByTagName('input');
		for(var a=0;a<inputTags.length;a++){
			inputTags[a].name=inputTags[a].name.replace('[0]','['+iterate+']');
		   inputTags[a].id=inputTags[a].name.replace(/([\.\[\]])/g,'_').replace(/(__)/g,'_');
		  
		   var blurAttr=inputTags[a].getAttribute('onblur');
			if(blurAttr!=null){
				blurAttr=blurAttr+";";
			}else{
				blurAttr="";
			}
			inputTags[a].setAttribute('onblur',blurAttr+'j.blur(this,this.name,this.value);');
		}
		
		var selectTags=cloneNode.getElementsByTagName('select');
		for(var a=0;a<selectTags.length;a++){
			selectTags[a].name=selectTags[a].name.replace('[0]','['+iterate+']');
			selectTags[a].value='';
						selectTags[a].id=selectTags[a].name.replace(/([\.\[\]])/g,'_').replace(/(__)/g,'_');
						
						var blurAttr=selectTags[a].getAttribute('onblur');
						if(blurAttr!=null){
							blurAttr=blurAttr+";";
						}else{
							blurAttr="";
						}
						selectTags[a].setAttribute('onblur',blurAttr+'j.blur(this,this.name,this.value);');
		}
		
		var textareaTags=cloneNode.getElementsByTagName('textarea');
		for(var a=0;a<textareaTags.length;a++){
			textareaTags[a].name=textareaTags[a].name.replace('[0]','['+iterate+']');
			textareaTags[a].value='';
						textareaTags[a].id=textareaTags[a].name.replace(/([\.\[\]])/g,'_').replace(/(__)/g,'_');
						
						var blurAttr=textareaTags[a].getAttribute('onblur');
						if(blurAttr!=null){
							blurAttr=blurAttr+";";
						}else{
							blurAttr="";
						}
						textareaTags[a].setAttribute('onblur',blurAttr+'j.blur(this,this.name,this.value);');
		}
		
		document.getElementById('scheduleSalaryMain').getElementsByTagName('tr')[0].parentNode.insertBefore(cloneNode,tobeInsertBefore);
		}
	if(mainTable[i].id =='scheduleSalaryEnd'){
		flag=false;
		break;
		}
	}

	var newVal = eval( parseInt(totRow) + 1);
		document.getElementById('scheduleSlast').cells[0].innerHTML=newVal;

	if($('#scheduleSalaryAddRow')[0].parentNode.children.length==11){
		$('#delSalaryButtonId').prop('disabled', true);
	}else if($('#scheduleSalaryAddRow')[0].parentNode.children.length>11){
		$('#delSalaryButtonId').prop('disabled', false);
	}

	var table=document.getElementById('scheduleSalaryMain');
	modifyRow(table);
	checkMaxLengthLimit();
	}

// Delete Schedule S.
function delScheduleSalary(){

	if($('#scheduleSalaryAddRow')[0].parentNode.children.length>16){

		for(var i=0;i<14;i++){
		
			$('#scheduleSalaryAddRow')[0].parentNode.deleteRow($('#scheduleSalaryAddRow')[0].parentNode.children.length-3);
		}
		
	}
	var totRow=document.getElementById('scheduleSlast').cells[0].textContent;
	var newVal = eval( parseInt(totRow)-1);
		var newText='Total (';
		for(var k=1;k<newVal;k++){
			newText=newText+k+'i +';
		}
		newText=newText+newVal+'a +'+newVal+'b )';
		document.getElementById('scheduleSlast').cells[0].innerHTML=newVal;


	if($('#scheduleSalaryAddRow')[0].parentNode.children.length==16){
		$('#delSalaryButtonId').prop('disabled', true);
	}else if($('#scheduleSalaryAddRow')[0].parentNode.children.length>16){
		$('#delSalaryButtonId').prop('disabled', false);
	}		
	calcITR4();
	}

// Calculate Tax for Schedule BP.
function calcSchBPBalFor4(){
try{
	var profBfrTaxPL = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.profBfrTaxPL')[0]; profBfrTaxPL.value = coalesce(profBfrTaxPL.value);
	var netPLFromSpecBus = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.netPLFromSpecBus')[0]; netPLFromSpecBus.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.netPLFromSpecBus');
	var netProfLossSpecifiedBus = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.netProfLossSpecifiedBus')[0]; netProfLossSpecifiedBus.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.netProfLossSpecifiedBus');
	var incRecCredPLOthHeadsSalary = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.incRecCredPLOthHeads.salary')[0]; incRecCredPLOthHeadsSalary.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.incRecCredPLOthHeads.salary');
	var incRecCredPLOthHeadsHouseProperty = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.incRecCredPLOthHeads.houseProperty')[0]; incRecCredPLOthHeadsHouseProperty.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.incRecCredPLOthHeads.houseProperty');
	var incRecCredPLOthHeadsCapitalGains = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.incRecCredPLOthHeads.capitalGains')[0]; incRecCredPLOthHeadsCapitalGains.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.incRecCredPLOthHeads.capitalGains');
	var incRecCredPLOthHeadsOthSources = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.incRecCredPLOthHeads.othSources')[0]; incRecCredPLOthHeadsOthSources.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.incRecCredPLOthHeads.othSources');
	var incRecCredPLOthHeads115BBF = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.incRecCredPLOthHeads.us115BBF')[0]; incRecCredPLOthHeads115BBF.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.incRecCredPLOthHeads.us115BBF');
	
	
	var  plUs44SChapXIIG = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.plUs44SChapXIIG')[0]; plUs44SChapXIIG.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.plUs44SChapXIIG');
	var firmShareInc = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.incCredPL.firmShareInc')[0]; firmShareInc.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.incCredPL.firmShareInc');
	var aopboiSharInc = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.incCredPL.aopboiSharInc')[0]; aopboiSharInc.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.incCredPL.aopboiSharInc');
	var totExempInc = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.incCredPL.totExempIncPL')[0];  totExempInc.value = coalesce(totExempInc.value);
	var balancePLOthThanSpecBus = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.balancePLOthThanSpecBus')[0]; balancePLOthThanSpecBus.value = coalesce(balancePLOthThanSpecBus.value);
	
	var expDebToPLOthHeadsSalary = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.expDebToPLOthHeads.salary')[0]; expDebToPLOthHeadsSalary.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.expDebToPLOthHeads.salary');
	var expDebToPLOthHeadsHouseProperty = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.expDebToPLOthHeads.houseProperty')[0]; expDebToPLOthHeadsHouseProperty.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.expDebToPLOthHeads.houseProperty');
	var expDebToPLOthHeadsCapitalGains = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.expDebToPLOthHeads.capitalGains')[0]; expDebToPLOthHeadsCapitalGains.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.expDebToPLOthHeads.capitalGains');
	var expDebToPLOthHeadsOthSources = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.expDebToPLOthHeads.othSources')[0]; expDebToPLOthHeadsOthSources.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.expDebToPLOthHeads.othSources');
	var expDebToPLOthHeads115BBF = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.expDebToPLOthHeads.us115BBF')[0]; expDebToPLOthHeads115BBF.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.expDebToPLOthHeads.us115BBF');
	
	var expDebToPLExemptInc = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.expDebToPLExemptInc')[0];  expDebToPLExemptInc.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.expDebToPLExemptInc');
	var totExpDebPL = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.totExpDebPL')[0]; totExpDebPL.value = coalesce(totExpDebPL.value);
	var adjustedPLOthThanSpecBus = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.adjustedPLOthThanSpecBus')[0]; adjustedPLOthThanSpecBus.value = coalesce(adjustedPLOthThanSpecBus.value);
	var depreciationDebPLCosAct = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.depreciationDebPLCosAct')[0]; depreciationDebPLCosAct.value = coalesce(depreciationDebPLCosAct.value);
	var depreciationAllowUs321Ii = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.depreciationAllowITAct32.depreciationAllowUs321Ii')[0]; depreciationAllowUs321Ii.value = coalesce(depreciationAllowUs321Ii.value);
	var depreciationAllowUs321I = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.depreciationAllowITAct32.depreciationAllowUs321I')[0]; depreciationAllowUs321I.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.depreciationAllowITAct32.depreciationAllowUs321I');
	var totDeprAllowITAct = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.depreciationAllowITAct32.totDeprAllowITAct')[0]; totDeprAllowITAct.value = coalesce(totDeprAllowITAct.value);
	var adjustPLAfterDeprOthSpecInc = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.adjustPLAfterDeprOthSpecInc')[0]; adjustPLAfterDeprOthSpecInc.value = coalesce(adjustPLAfterDeprOthSpecInc.value);
	var amtDebPLDisallowUs36 = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.amtDebPLDisallowUs36')[0]; amtDebPLDisallowUs36.value = coalesce(amtDebPLDisallowUs36.value);
	var amtDebPLDisallowUs37 = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.amtDebPLDisallowUs37')[0]; amtDebPLDisallowUs37.value = coalesce(amtDebPLDisallowUs37.value);
	var amtDebPLDisallowUs40 = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.amtDebPLDisallowUs40')[0]; amtDebPLDisallowUs40.value = coalesce(amtDebPLDisallowUs40.value);
	var amtDebPLDisallowUs40A = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.amtDebPLDisallowUs40A')[0]; amtDebPLDisallowUs40A.value = coalesce(amtDebPLDisallowUs40A.value);
	var amtDebPLDisallowUs43B = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.amtDebPLDisallowUs43B')[0]; amtDebPLDisallowUs43B.value = coalesce(amtDebPLDisallowUs43B.value);
	var interestDisAllowUs23SMEAct = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.interestDisAllowUs23SMEAct')[0]; interestDisAllowUs23SMEAct.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.interestDisAllowUs23SMEAct');
	var deemIncUs41 = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemIncUs41')[0]; deemIncUs41.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.deemIncUs41');
	var deemIncUs3380HHD80IA = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemIncUs3380HHD80IA')[0]; deemIncUs3380HHD80IA.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.deemIncUs3380HHD80IA');
	
	var deemedIncomeUs43CA = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemedIncomeUs43CA')[0]; deemedIncomeUs43CA.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.deemedIncomeUs43CA');
	
	var othItemDisallowUs28To44DA = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.othItemDisallowUs28To44DA')[0]; othItemDisallowUs28To44DA.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.othItemDisallowUs28To44DA');
	var anyOthIncNotInclInExpDisallowPL = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.anyOthIncNotInclInExpDisallowPL')[0];  anyOthIncNotInclInExpDisallowPL.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.anyOthIncNotInclInExpDisallowPL');
	var totAfterAddToPLDeprOthSpecInc =  document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.totAfterAddToPLDeprOthSpecInc')[0]; totAfterAddToPLDeprOthSpecInc.value = coalesce(totAfterAddToPLDeprOthSpecInc.value);
	var deductUs321Iii =  document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deductUs321Iii')[0]; deductUs321Iii.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.deductUs321Iii');
	var deductUs32AD  = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deductUs32AD')[0]; deductUs32AD.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.deductUs32AD');
	var debPLUs35ExcessAmt = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.debPLUs35ExcessAmt')[0];  debPLUs35ExcessAmt.value = coalesce(debPLUs35ExcessAmt.value);
	var amtDisallUs40NowAllow =  document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.amtDisallUs40NowAllow')[0];  amtDisallUs40NowAllow.value = coalesce(amtDisallUs40NowAllow.value);
	var amtDisallUs43BNowAllow =  document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.amtDisallUs43BNowAllow')[0]; amtDisallUs43BNowAllow.value = coalesce(amtDisallUs43BNowAllow.value);
	var debPL35ACAmt =  document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deductUs35AC.debPL35ACAmt')[0]; debPL35ACAmt.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.deductUs35AC.debPL35ACAmt');
	var amtAllowUs35ACt =  document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deductUs35AC.amtAllowUs35ACt')[0]; amtAllowUs35ACt.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.deductUs35AC.amtAllowUs35ACt');
	var excessAmtDeduct35AC =  document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deductUs35AC.excessAmtDeduct35AC')[0]; excessAmtDeduct35AC.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.deductUs35AC.excessAmtDeduct35AC');
	var anyOthAmtAllDeduct =  document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.anyOthAmtAllDeduct')[0]; anyOthAmtAllDeduct.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.anyOthAmtAllDeduct');
	var totDeductionAmts =  document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.totDeductionAmts')[0]; totDeductionAmts.value = coalesce(totDeductionAmts.value);
	var plAftAdjDedBusOthThanSpec =  document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.plAftAdjDedBusOthThanSpec')[0]; plAftAdjDedBusOthThanSpec.value = coalesce(plAftAdjDedBusOthThanSpec.value);
	
	var section44AD = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44AD')[0];  section44AD.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44AD'); 
	var section44ADA = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44ADA')[0];  section44ADA.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44ADA'); 
	var section44AE = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44AE')[0];  section44AE.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44AE');
	var section44B = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44B')[0];  section44B.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44B');
	var section44BB = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44BB')[0];  section44BB.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44BB');
	var section44BBA = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44BBA')[0];  section44BBA.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44BBA');
	var section44BBB = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44BBB')[0];  section44BBB.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44BBB');
	var section44D = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44D')[0];  section44D.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44D');
	var section44DA = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44DA')[0];  section44DA.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44DA');
	var firstSchTAct = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.firstSchTAct')[0];  firstSchTAct.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.firstSchTAct');
	var totDeemedProfitBusUs = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.totDeemedProfitBusUs')[0];   totDeemedProfitBusUs.value = coalesce(totDeemedProfitBusUs.value);
	var netPLAftAdjBusOthThanSpec =  document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.netPLAftAdjBusOthThanSpec')[0];   netPLAftAdjBusOthThanSpec.value = coalesce(netPLAftAdjBusOthThanSpec.value);
	var netPLBusOthThanSpec7A7B7CI = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.netPLBusOthThanSpec7A7B7CI')[0];   netPLBusOthThanSpec7A7B7CI.value = coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.netPLBusOthThanSpec7A7B7CI');
	var netPLBusOthThanSpec7A7B7C = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.netPLBusOthThanSpec7A7B7C')[0];   netPLBusOthThanSpec7A7B7C.value = coalesce(netPLBusOthThanSpec7A7B7C.value);
	var netPLFrmSpecBus = document.getElementsByName('itr4ScheduleBP.specBusinessInc.netPLFrmSpecBus')[0]; netPLFrmSpecBus.value = coalesce(netPLFrmSpecBus.value);
	var additionUs28To44DA = document.getElementsByName('itr4ScheduleBP.specBusinessInc.additionUs28To44DA')[0]; additionUs28To44DA.value = coalesceSetRet('itr4ScheduleBP.specBusinessInc.additionUs28To44DA');
	var deductUs28To44DA = document.getElementsByName('itr4ScheduleBP.specBusinessInc.deductUs28To44DA')[0];  deductUs28To44DA.value = coalesceSetRet('itr4ScheduleBP.specBusinessInc.deductUs28To44DA');
	var adjustedPLFrmSpecuBus = document.getElementsByName('itr4ScheduleBP.specBusinessInc.adjustedPLFrmSpecuBus')[0];  adjustedPLFrmSpecuBus.value = coalesce(adjustedPLFrmSpecuBus.value);

	var netPLFrmSpecifiedBus = document.getElementsByName('itr4ScheduleBP.specifiedBusinessInc.netPLFrmSpecifiedBus')[0];  netPLFrmSpecifiedBus.value = coalesce(netPLFrmSpecifiedBus.value);
	var addSec28To44DA = document.getElementsByName('itr4ScheduleBP.specifiedBusinessInc.addSec28To44DA')[0]; addSec28To44DA.value = coalesceSetRet('itr4ScheduleBP.specifiedBusinessInc.addSec28To44DA');
	var dedSec28To44DAOTDedSec35AD = document.getElementsByName('itr4ScheduleBP.specifiedBusinessInc.dedSec28To44DAOTDedSec35AD')[0];  dedSec28To44DAOTDedSec35AD.value = coalesceSetRet('itr4ScheduleBP.specifiedBusinessInc.dedSec28To44DAOTDedSec35AD');
	var profitLossSpecifiedBusiness = document.getElementsByName('itr4ScheduleBP.specifiedBusinessInc.profitLossSpecifiedBusiness')[0]; profitLossSpecifiedBusiness.value = coalesce(profitLossSpecifiedBusiness.value);
	var dedSec35AD = document.getElementsByName('itr4ScheduleBP.specifiedBusinessInc.deductionUs35AD')[0]; dedSec35AD.value = coalesceSetRet('itr4ScheduleBP.specifiedBusinessInc.deductionUs35AD');
	var profitLossSpecifiedBusFinal = document.getElementsByName('itr4ScheduleBP.specifiedBusinessInc.pLFrmSpecifiedBus')[0]; profitLossSpecifiedBusFinal.value =coalesceSetRet('itr4ScheduleBP.specifiedBusinessInc.pLFrmSpecifiedBus');
	
	var incChrgUnHdProftGain = document.getElementsByName('itr4ScheduleBP.incChrgUnHdProftGain')[0]; incChrgUnHdProftGain.value = coalesce(incChrgUnHdProftGain.value);

	
	var tab = document.getElementById('scheduleBP1');
	var Count_SCH_BP=document.getElementsByName('Count_SCH_BP')[0]; Count_SCH_BP.value =0;

	for(var i = 0; i < tab.rows.length-3; i++) {

		Count_SCH_BP.value = eval(parseInt(Count_SCH_BP.value,10) + parseInt(coalesce(document.getElementsByName('itr4ScheduleBP.otherExempt['+i+'].totalAmount')[0].value),10));

	}
		document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.incCredPL.othExempInc')[0].value = addBPExmptInc('scheduleBP1');
        profBfrTaxPL.value = eval(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.pbt')[0].value)) + eval(coalesceSetRet('partapl.noBooksOfAccPL.totalNetProfit'));
        //11. Depreciation and amoritisation debited to profit and loss account. as from 42 of part A- P&L
        depreciationDebPLCosAct.value = zeroOrMore(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.depreciationAmort')[0].value));
        
		
        // 12. Depreciation allowable under section 32(1)(ii) (column 6 of Schedule-DEP)
        depreciationAllowUs321Ii.value = coalesce(document.getElementsByName('scheduleDEP.summaryFromDeprSch.totalDepreciation')[0].value);
        // 14. Amounts debited to the profit and loss account, to the extent disallowable under section 36 (6p of Part-OI)
        amtDebPLDisallowUs36.value = coalesce(document.getElementsByName('partaoi.amtDisallUs36.totAmtDisallUs36')[0].value);
        // 15. Amounts debited to the profit and loss account, to the extent disallowable under section 37 (7h of Part-OI)
        amtDebPLDisallowUs37.value = coalesce(document.getElementsByName('partaoi.amtDisallUs37.totAmtDisallUs37')[0].value);
        // 16. Amounts debited to the profit and loss account, to the extent disallowable under section 40 (8Af of Part-OI)
        amtDebPLDisallowUs40.value = coalesce(document.getElementsByName('partaoi.amtDisallUs40.totAmtDisallUs40')[0].value);
        // 17. Amounts debited to the profit and loss account, to the extent disallowable under section 40A (9f of Part-OI)
        amtDebPLDisallowUs40A.value = coalesce(document.getElementsByName('partaoi.amtDisallUs40A.totAmtDisallUs40A')[0].value);
        // 18. Any amount debited to profit and loss account of the previous year but disallowable under section 43B (11g of Part-OI)
        amtDebPLDisallowUs43B.value = coalesce(document.getElementsByName('partaoi.amtDisall43B.amtUs43B.totAmtUs43B')[0].value);
        // 26. Amount of deduction under section 35 in excess of the amount debited to profit and loss account (item vii(4) of Schedule ESR)
        debPLUs35ExcessAmt.value = coalesce(document.getElementsByName('scheduleESR.deductionUs35.totUs35.deductUs35.excessAmtOverDebPL')[0].value);
        // 27. Any amount disallowed under section 40 in any preceding previous year but allowable during the previous year(8B of Part-OI)
        amtDisallUs40NowAllow.value = coalesce(document.getElementsByName('partaoi.amtDisallUs40.anyAmtOfSec40AllowPrevYr')[0].value);
        // 28. Any amount disallowed under section 43B in any preceding previous year but allowable during the previous year(10 g of Part-OI)
        amtDisallUs43BNowAllow.value = coalesce(document.getElementsByName('partaoi.amtDisallUs43BPyNowAll.amtUs43B.totAmtUs43B')[0].value);
        // 35. Deductions under section - This field auto populates from item e of Sch 10A.
        //section10A.value = coalesce(document.getElementsByName('schedule10A.deductSEZ.dedUs10Detail.totalDedUs10Sub')[0].value);
        // 35. Deductions under section - This field auto populates from item e of Sch 10AA.
        //section10AA.value = coalesce(document.getElementsByName('schedule10AA.deductSEZ.dedUs10Detail.totalDedUs10Sub')[0].value);


        // 34. Deduction allowable under section 32(1)(iii)
        totDeemedProfitBusUs.value = eval(parseInt(section44AD.value,10)) + eval(parseInt(section44ADA.value,10))  + eval(parseInt(section44AE.value,10)) + eval(parseInt(section44B.value,10)) + eval(parseInt(section44BB.value,10)) + eval(parseInt(section44BBA.value,10)) + eval(parseInt(section44BBB.value,10)) + eval(parseInt(section44D.value,10)) + eval(parseInt(section44DA.value,10)) + eval(parseInt(firstSchTAct.value,10));
        // 4. Profit or loss included in 1, 44AE etc Chapter-XII-G/ populates from point 33(xi)
        plUs44SChapXIIG.value = eval(parseInt(totDeemedProfitBusUs.value,10));
        // 5. Income credited to Profit and Loss account (included in 1)which is exempt
        totExempInc.value = eval(parseInt(firmShareInc.value ,10)) + eval(parseInt(aopboiSharInc.value ,10)) + eval(parseInt(Count_SCH_BP.value,10));
        // 6. Balance ((1- 2a - 2b - 3a -3b - 3c - 3d - 4 - 5d))
        balancePLOthThanSpecBus.value = eval(parseInt(profBfrTaxPL.value ,10)) - eval(parseInt(netPLFromSpecBus.value ,10)) - eval(parseInt(netProfLossSpecifiedBus.value,10)) - eval(parseInt(incRecCredPLOthHeadsSalary.value,10)) - eval(parseInt(incRecCredPLOthHeadsHouseProperty.value,10))- eval(parseInt(incRecCredPLOthHeadsCapitalGains.value,10))- eval(parseInt(incRecCredPLOthHeadsOthSources.value,10)) - eval(parseInt(incRecCredPLOthHeads115BBF.value,10))- eval(parseInt(plUs44SChapXIIG.value,10)) - eval(parseInt(totExempInc.value,10));
        // 9. Total (7 + 8)
        totExpDebPL.value =  eval(parseInt(expDebToPLOthHeadsSalary.value,10)) + eval(parseInt(expDebToPLOthHeadsHouseProperty.value,10)) +eval(parseInt(expDebToPLOthHeadsCapitalGains.value,10)) +eval(parseInt(expDebToPLOthHeadsOthSources.value,10))+eval(parseInt(expDebToPLOthHeads115BBF.value,10)) + eval(parseInt(expDebToPLExemptInc.value,10)) ;
        // 10. Adjusted profit or loss (6+9)
        adjustedPLOthThanSpecBus.value = eval(parseInt(balancePLOthThanSpecBus.value,10)) + eval(parseInt(totExpDebPL.value,10));
        // 12. Depreciation allowable under Income-tax Act
        totDeprAllowITAct.value = eval(parseInt(depreciationAllowUs321Ii.value,10)) + eval(parseInt(depreciationAllowUs321I.value,10));
        // 13. Profit or loss after adjustment for depreciation (10 +11 - 12iii)
        adjustPLAfterDeprOthSpecInc.value = eval(parseInt(adjustedPLOthThanSpecBus.value,10)) + eval(parseInt(depreciationDebPLCosAct.value,10)) - eval(parseInt(totDeprAllowITAct.value,10));
        // 25. Total (14 + 15 + 16 + 17 + 18 + 19 + 20 + 21+22 +23+24)
        totAfterAddToPLDeprOthSpecInc.value = eval(parseInt(amtDebPLDisallowUs36.value,10)) + eval(parseInt(deemedIncomeUs43CA.value,10)) + eval(parseInt(amtDebPLDisallowUs37.value,10)) + eval(parseInt(amtDebPLDisallowUs40.value,10)) + eval(parseInt(amtDebPLDisallowUs40A.value,10)) + eval(parseInt(amtDebPLDisallowUs43B.value,10)) + eval(parseInt(interestDisAllowUs23SMEAct.value,10)) + eval(parseInt(deemIncUs41.value,10)) + eval(parseInt(deemIncUs3380HHD80IA.value,10)) + eval(parseInt(othItemDisallowUs28To44DA.value,10)) + eval(parseInt(anyOthIncNotInclInExpDisallowPL.value,10));
        

        // 30. Deduction under section 35AC
        excessAmtDeduct35AC.value = eval(parseInt(amtAllowUs35ACt.value,10)) - eval(parseInt(debPL35ACAmt.value,10));
        if(eval(excessAmtDeduct35AC.value) < 0)
        	excessAmtDeduct35AC.value = 0;

        // 32. Total (26 + 27+28 +29 +30 + 31c + 32)
        totDeductionAmts.value = eval(parseInt(deductUs321Iii.value,10)) + eval(parseInt(debPLUs35ExcessAmt.value,10)) + eval(parseInt(amtDisallUs40NowAllow.value,10)) + eval(parseInt(amtDisallUs43BNowAllow.value,10)) + eval(parseInt(excessAmtDeduct35AC.value,10)) + eval(parseInt(anyOthAmtAllDeduct.value,10))  + eval(parseInt(deductUs32AD.value,10));
        // 33. Income (13 + 25 ? 32)
        plAftAdjDedBusOthThanSpec.value = eval(parseInt(adjustPLAfterDeprOthSpecInc.value,10)) + eval(parseInt(totAfterAddToPLDeprOthSpecInc.value,10)) - eval(parseInt(totDeductionAmts.value,10));

        // 34. Profit or loss before deduction under section 10A/10AA/10B/10BA (32 + 33xi)
       // profitLossBfrDeductUs10S.value = eval(parseInt(plAftAdjDedBusOthThanSpec.value,10)) + eval(parseInt(totDeemedProfitBusUs.value,10));

        // 35. Net profit or loss from business or profession other than speculative and specified business(33 + 34x)
        	netPLAftAdjBusOthThanSpec.value = eval(parseInt(plAftAdjDedBusOthThanSpec.value,10)) + eval(parseInt(totDeemedProfitBusUs.value,10));
        // 37. Net Profit or loss from business or profession other than speculative business and specified business after applying rule  7A, 7B  or 7C, if applicable (If rule 7A, 7B or 7C is not applicable, enter same figure as in 36)
        
		coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.netPLBusOthThanSpec7A7B7CI');		
		
		if(coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.netPLBusOthThanSpec7A7B7CI') != 0) {
			document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.netPLBusOthThanSpec7A7B7C')[0].value = 
				coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.netPLBusOthThanSpec7A7B7CI');
		} else {
			document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.netPLBusOthThanSpec7A7B7C')[0].value = 
				coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.netPLAftAdjBusOthThanSpec');
		}
		
        // 38. Net profit or loss from speculative business as per profit or loss account - auto populates from field 2A of Sch BP
        netPLFrmSpecBus.value = eval(parseInt(netPLFromSpecBus.value,10)) ;


        // B40. Computation of income from speculative business
        adjustedPLFrmSpecuBus.value = eval(parseInt(netPLFrmSpecBus.value,10)) + eval(parseInt(additionUs28To44DA.value,10)) - eval(parseInt(deductUs28To44DA.value,10));
        // 42. Net profit or loss from specified business as per profit or loss account (populates from 2B of Sch BP)
        netPLFrmSpecifiedBus.value = eval(parseInt(netProfLossSpecifiedBus.value,10));
        // 45. Profit or loss from specified business (42+43-44)
        profitLossSpecifiedBusiness.value = eval(parseInt(netPLFrmSpecifiedBus.value,10)) + eval(parseInt(addSec28To44DA.value,10)) - eval(parseInt(dedSec28To44DAOTDedSec35AD.value,10));
        // 47 Profit or loss from specified business (44-45) (enter nil if loss)
        profitLossSpecifiedBusFinal.value = eval(parseInt(profitLossSpecifiedBusiness.value,10)) - eval(parseInt(dedSec35AD.value,10));
                
        var tempPLFrmSpecuBus = adjustedPLFrmSpecuBus.value ;
        var tempSpecifiedBusFinal = profitLossSpecifiedBusFinal.value;
                
        if(parseInt(tempPLFrmSpecuBus,10) < 0){
        	tempPLFrmSpecuBus = parseInt(0,10);
        } 
        if(parseInt(tempSpecifiedBusFinal,10) < 0){
        	tempSpecifiedBusFinal = parseInt(0,10);
        }        
        // D. Income chargeable under the head 'Profits and gains' (A37+B41+C47)
        incChrgUnHdProftGain.value = eval(parseInt(netPLBusOthThanSpec7A7B7C.value,10)) + eval(parseInt(tempPLFrmSpecuBus,10)) + eval(parseInt(tempSpecifiedBusFinal,10));
        
        setOffSchBP();
        
	}catch(e){
		alert(' error in calcSchBPBalFor4 =  ' + e.stack);
	}
}

// Calculate Set-Off for Schedule BP.
function setOffSchBP() {
	try{
		prefillSchBP();
		setOffBPBusLoss();
	} catch(e){
		alert('error in setOffSchBP()=' + e.stack);
	}
	
}

// Prefill Schedule BP.
function prefillSchBP() {
	try{
		//prefilling column :: Income from speculative business
		//Field (B40 of schedule BP)
		
		document.getElementsByName('itr4ScheduleBP.busSetoffCurYr.speculativeInc.incOfCurYrUnderThatHead')[0].value =
			zeroOrMore(coalescePath('itr4ScheduleBP.specBusinessInc.adjustedPLFrmSpecuBus'));
	
		//prefilling column ::  	Income from specified business
		//Field (C46 of schedule BP)
		document.getElementsByName('itr4ScheduleBP.busSetoffCurYr.specifiedInc.incOfCurYrUnderThatHead')[0].value =
			zeroOrMore(coalescePath('itr4ScheduleBP.specifiedBusinessInc.pLFrmSpecifiedBus'));
	
		// populating losses Business loss set off
		//Field (A36 of schedule BP)
		coalescePath('itr4ScheduleBP.busSetoffCurYr.lossSetOffOnBusLoss');
		if(!isPostv('itr4ScheduleBP.businessIncOthThanSpec.netPLBusOthThanSpec7A7B7C')){
			document.getElementsByName('itr4ScheduleBP.busSetoffCurYr.lossSetOffOnBusLoss')[0].value =
				Math.abs(coalescePath('itr4ScheduleBP.businessIncOthThanSpec.netPLBusOthThanSpec7A7B7C'));
		}else{
			document.getElementsByName('itr4ScheduleBP.busSetoffCurYr.lossSetOffOnBusLoss')[0].value = 0;
		}
	} catch(e){
		alert('error in prefillSchBP()=' + e.stack);
	}
}

// Set-Off Business Loss for Schedule BP.
function setOffBPBusLoss() {
	try{
		document.getElementsByName('itr4ScheduleBP.busSetoffCurYr.speculativeInc.busLossSetoff')[0].value = 0;
		document.getElementsByName('itr4ScheduleBP.busSetoffCurYr.specifiedInc.busLossSetoff')[0].value = 0;
		
		/* 			
		Order of adjustment :-
			1) Income from speculative business
			2) Income from specified business
			*/
		
		var setOffRem = coalescePath('itr4ScheduleBP.busSetoffCurYr.lossSetOffOnBusLoss')-
		coalescePath('itr4ScheduleBP.busSetoffCurYr.speculativeInc.incOfCurYrUnderThatHead');
		
		// 1. Income from speculative business
		if(parseInt(setOffRem,10)>=0){
			document.getElementsByName('itr4ScheduleBP.busSetoffCurYr.speculativeInc.busLossSetoff')[0].value =
					coalescePath('itr4ScheduleBP.busSetoffCurYr.speculativeInc.incOfCurYrUnderThatHead');
			
		}else{
			document.getElementsByName('itr4ScheduleBP.busSetoffCurYr.speculativeInc.busLossSetoff')[0].value =
				coalescePath('itr4ScheduleBP.busSetoffCurYr.lossSetOffOnBusLoss');
			setOffRem =0 ;
		}
		
		//2. Income from specified business
		var prevSetOffRem = setOffRem;
		setOffRem = parseInt(setOffRem,10) - coalescePath('itr4ScheduleBP.busSetoffCurYr.specifiedInc.incOfCurYrUnderThatHead');
		
		if(parseInt(setOffRem,10)>=0){
				document.getElementsByName('itr4ScheduleBP.busSetoffCurYr.specifiedInc.busLossSetoff')[0].value =
					coalescePath('itr4ScheduleBP.busSetoffCurYr.specifiedInc.incOfCurYrUnderThatHead');				
		}else{
				document.getElementsByName('itr4ScheduleBP.busSetoffCurYr.specifiedInc.busLossSetoff')[0].value = prevSetOffRem;
			setOffRem =0 ;
		}
		
		// Income from speculative business income remaining after set off
		document.getElementsByName('itr4ScheduleBP.busSetoffCurYr.speculativeInc.incOfCurYrAfterSetOff')[0].value=
			coalescePath('itr4ScheduleBP.busSetoffCurYr.speculativeInc.incOfCurYrUnderThatHead')-
			coalescePath('itr4ScheduleBP.busSetoffCurYr.speculativeInc.busLossSetoff');
		
		//  	Income from specified business income remaining after set off
		document.getElementsByName('itr4ScheduleBP.busSetoffCurYr.specifiedInc.incOfCurYrAfterSetOff')[0].value=
			coalescePath('itr4ScheduleBP.busSetoffCurYr.specifiedInc.incOfCurYrUnderThatHead')-
			coalescePath('itr4ScheduleBP.busSetoffCurYr.specifiedInc.busLossSetoff');
		
		
		//total loss setoff
		document.getElementsByName('itr4ScheduleBP.busSetoffCurYr.totLossSetOffOnBus')[0].value=
			coalescePath('itr4ScheduleBP.busSetoffCurYr.speculativeInc.busLossSetoff')+
			coalescePath('itr4ScheduleBP.busSetoffCurYr.specifiedInc.busLossSetoff');
		
		//Loss remaining after set-off
		document.getElementsByName('itr4ScheduleBP.busSetoffCurYr.lossRemainSetOffOnBus')[0].value=
			coalescePath('itr4ScheduleBP.busSetoffCurYr.lossSetOffOnBusLoss')-coalescePath('itr4ScheduleBP.busSetoffCurYr.totLossSetOffOnBus');
	} catch(e){
		alert('error in setOffBPBusLoss()=' + e.stack);
	}
}

// calculate Income for Schedule SI.
function calcScheduleSI(){
    try{
        var secCode1A =  document.getElementsByName('scheduleSI.splCodeRateTax[2].secCode')[0]; secCode1A.value = coalesceString(secCode1A.value);
	var splRatePercent1A = document.getElementsByName('scheduleSI.splCodeRateTax[2].splRatePercent')[0]; splRatePercent1A.value = coalesce(splRatePercent1A.value);
	var splRateInc1A = document.getElementsByName('scheduleSI.splCodeRateTax[2].splRateInc')[0]; splRateInc1A.value = coalesce(splRateInc1A.value);
	var taxableInc1A = document.getElementsByName('scheduleSI.splCodeRateTax[2].taxableInc')[0]; taxableInc1A.value = coalesce(taxableInc1A.value);
	var splRateIncTax1A = document.getElementsByName('scheduleSI.splCodeRateTax[2].splRateIncTax')[0]; splRateIncTax1A.value = coalesce(splRateIncTax1A.value);

	var secCode22 =  document.getElementsByName('scheduleSI.splCodeRateTax[4].secCode')[0]; secCode22.value = coalesceString(secCode22.value);
	var splRatePercent22 = document.getElementsByName('scheduleSI.splCodeRateTax[4].splRatePercent')[0]; splRatePercent22.value = coalesce(splRatePercent22.value);
	var splRateInc22 = document.getElementsByName('scheduleSI.splCodeRateTax[4].splRateInc')[0]; splRateInc22.value = coalesce(splRateInc22.value);
	var taxableInc22 = document.getElementsByName('scheduleSI.splCodeRateTax[4].taxableInc')[0]; taxableInc22.value = coalesce(taxableInc22.value);
	var splRateIncTax22 = document.getElementsByName('scheduleSI.splCodeRateTax[4].splRateIncTax')[0]; splRateIncTax22.value = coalesce(splRateIncTax22.value);

	var secCode21ciii =  document.getElementsByName('scheduleSI.splCodeRateTax[5].secCode')[0]; secCode21ciii.value = coalesceString(secCode21ciii.value);
	var splRatePercent21ciii = document.getElementsByName('scheduleSI.splCodeRateTax[5].splRatePercent')[0]; splRatePercent21ciii.value = coalesce(splRatePercent21ciii.value);
	var splRateInc21ciii = document.getElementsByName('scheduleSI.splCodeRateTax[5].splRateInc')[0]; splRateInc21ciii.value = coalesce(splRateInc21ciii.value);
	var taxableInc21ciii = document.getElementsByName('scheduleSI.splCodeRateTax[5].taxableInc')[0]; taxableInc21ciii.value = coalesce(taxableInc21ciii.value);
	var splRateIncTax21ciii = document.getElementsByName('scheduleSI.splCodeRateTax[5].splRateIncTax')[0]; splRateIncTax21ciii.value = coalesce(splRateIncTax21ciii.value);
	
	var secCode21 =  document.getElementsByName('scheduleSI.splCodeRateTax[3].secCode')[0]; secCode21.value = coalesceString(secCode21.value);
	var splRatePercent21 = document.getElementsByName('scheduleSI.splCodeRateTax[3].splRatePercent')[0]; splRatePercent21.value = coalesce(splRatePercent21.value);
	var splRateInc21 = document.getElementsByName('scheduleSI.splCodeRateTax[3].splRateInc')[0]; splRateInc21.value = coalesce(splRateInc21.value);
	var taxableInc21 = document.getElementsByName('scheduleSI.splCodeRateTax[3].taxableInc')[0]; taxableInc21.value = coalesce(taxableInc21.value);
	var splRateIncTax21 = document.getElementsByName('scheduleSI.splCodeRateTax[3].splRateIncTax')[0]; splRateIncTax21.value = coalesce(splRateIncTax21.value);

	var secCode5BB =  document.getElementsByName('scheduleSI.splCodeRateTax[6].secCode')[0]; secCode5BB.value = coalesceString(secCode5BB.value);
	var splRatePercent5BB = document.getElementsByName('scheduleSI.splCodeRateTax[6].splRatePercent')[0]; splRatePercent5BB.value = coalesce(splRatePercent5BB.value);
	var splRateInc5BB = document.getElementsByName('scheduleSI.splCodeRateTax[6].splRateInc')[0]; splRateInc5BB.value = coalesce(splRateInc5BB.value);
	var taxableInc5BB = document.getElementsByName('scheduleSI.splCodeRateTax[6].taxableInc')[0]; taxableInc5BB.value = coalesce(taxableInc5BB.value);
	var splRateIncTax5BB = document.getElementsByName('scheduleSI.splCodeRateTax[6].splRateIncTax')[0]; splRateIncTax5BB.value = coalesce(splRateIncTax5BB.value);

        var secCode1 =  document.getElementsByName('scheduleSI.splCodeRateTax[0].secCode')[0]; secCode1.value = coalesceString(secCode1.value);
	var splRatePercent1 = document.getElementsByName('scheduleSI.splCodeRateTax[0].splRatePercent')[0]; splRatePercent1.value = coalesce(splRatePercent1.value);
	var splRateInc1 = document.getElementsByName('scheduleSI.splCodeRateTax[0].splRateInc')[0]; splRateInc1.value = coalesce(splRateInc1.value);
	var taxableInc1 = document.getElementsByName('scheduleSI.splCodeRateTax[0].taxableInc')[0]; 
	var splRateIncTax1 = document.getElementsByName('scheduleSI.splCodeRateTax[0].splRateIncTax')[0]; 

	var splRateIncDTAA = document.getElementsByName('scheduleSI.splCodeRateTax[1].splRateInc')[0];
	var taxableIncDTAA = document.getElementsByName('scheduleSI.splCodeRateTax[1].taxableInc')[0];
	var splRateIncTaxDTAA = document.getElementsByName('scheduleSI.splCodeRateTax[1].splRateIncTax')[0];
	

	var exemption = getExemption_SI();
	
	var partbSetoffInc = parseInt(coalescePath('partBTI.totalIncome'),10) - parseInt(coalescePath('partBTI.incChargeTaxSplRate111A112'),10) ;
	
	
	// second :: setoff income with total income - final loss setooff
	if(partbSetoffInc > 0){
	if(partbSetoffInc >= exemption){
		exemption = 0;
	}else{
		exemption = exemption - partbSetoffInc;		
	} }
	
	
	if(exemption<=splRateInc21.value){
		taxableInc21.value=zeroOrMore(splRateInc21.value - exemption);
		exemption=0;
	}else{
		taxableInc21.value = 0;
		exemption = zeroOrMore(exemption - splRateInc21.value);
	}
	
	if(exemption<=splRateInc1A.value){
		taxableInc1A.value=zeroOrMore(splRateInc1A.value - exemption);
		exemption=0;
	}else{
		taxableInc1A.value = 0;
		exemption = zeroOrMore(exemption - splRateInc1A.value);
	}
	
	if(exemption<=splRateInc22.value){
		taxableInc22.value=zeroOrMore(splRateInc22.value - exemption);
		exemption=0;
	}else{
		taxableInc22.value = 0;
		exemption = zeroOrMore(exemption - splRateInc22.value);
	}
	
	//Taxable Income autopoulate		
	taxableInc21ciii.value=zeroOrMore(splRateInc21ciii.value);	
	taxableInc5BB.value=zeroOrMore(splRateInc5BB.value);
	taxableIncDTAA.value=zeroOrMore(splRateIncDTAA.value);

	
	//Column 'Tax thereon' values for fixed rows
	splRateIncTax1A.value = Math.round((15*eval(parseInt(taxableInc1A.value,10)))/parseInt('100' ,10));
	splRateIncTax22.value = Math.round((10*eval(parseInt(taxableInc22.value,10)))/parseInt('100' ,10));
	splRateIncTax21ciii.value = Math.round((10*eval(parseInt(taxableInc21ciii.value,10)))/parseInt('100' ,10));
	splRateIncTax21.value = Math.round((20*eval(parseInt(taxableInc21.value,10)))/parseInt('100' ,10));
	splRateIncTax5BB.value = Math.round((30*eval(parseInt(taxableInc5BB.value,10)))/parseInt('100' ,10));



	var totSplRateInc = eval(parseInt(splRateInc1A.value ,10)) + eval(parseInt(splRateInc22.value ,10))+ eval(parseInt(splRateInc21ciii.value ,10)) + eval(parseInt(splRateInc21.value ,10)) + eval(parseInt(splRateInc5BB.value ,10))
                            + eval(parseInt(coalesce(splRateIncDTAA.value) ,10)) + eval(parseInt(splRateInc1.value ,10));
	var totSplRateIncTax = eval(parseInt(splRateIncTax1A.value ,10)) + eval(parseInt(splRateIncTax22.value ,10)) + eval(parseInt(splRateIncTax21ciii.value ,10)) + eval(parseInt(splRateIncTax21.value ,10)) + eval(parseInt(splRateIncTax5BB.value ,10))
                         + eval(parseInt(coalesce(splRateIncTaxDTAA.value) ,10)) + eval(parseInt(coalesce(splRateIncTax1.value) ,10));
	
	var totTaxableInc= eval(parseInt(taxableInc1A.value ,10)) + eval(parseInt(taxableInc22.value ,10)) + eval(parseInt(taxableInc21ciii.value ,10)) + eval(parseInt(taxableInc21.value ,10)) + eval(parseInt(taxableInc5BB.value ,10))
                        + eval(parseInt(coalesce(taxableIncDTAA.value) ,10)) + eval(parseInt(coalesce(taxableInc1.value) ,10));


	var rowCount1=countRowInTable('scheduleSI.splCodeRateTax','splRateInc');
	

	for(var i = 7; i < rowCount1; i++) {
		
		var splCodeValue=document.getElementsByName('scheduleSI.splCodeRateTax['+i+'].splRateInc')[0].value;
		var splRatePercent = document.getElementsByName('scheduleSI.splCodeRateTax['+i+'].splRatePercent')[0].value;
		document.getElementsByName('scheduleSI.splCodeRateTax['+i+'].taxableInc')[0].value=zeroOrMore(coalesce(splCodeValue));
		document.getElementsByName('scheduleSI.splCodeRateTax['+i+'].splRateIncTax')[0].value=Math.round(eval((parseFloat(coalesce(splRatePercent) ,10) * parseInt(coalesce(splCodeValue),10))/parseInt('100' ,10) ));

					totSplRateInc = eval ( parseInt(totSplRateInc ,10) + parseInt( coalesce(splCodeValue) ,10) );
					totSplRateIncTax = eval ( parseInt(totSplRateIncTax ,10) + parseInt( coalesce(document.getElementsByName('scheduleSI.splCodeRateTax['+i+'].splRateIncTax')[0].value) ,10) );
					totTaxableInc=eval ( parseInt(totTaxableInc ,10) + parseInt( coalesce(document.getElementsByName('scheduleSI.splCodeRateTax['+i+'].taxableInc')[0].value) ,10) );
		
    }
	document.getElementsByName('scheduleSI.totSplRateIncTax')[0].value = zeroOrMore(totSplRateIncTax);
	document.getElementsByName('scheduleSI.totSplRateInc')[0].value = zeroOrMore(totSplRateInc);
	document.getElementsByName('scheduleSI.totSplRateTaxableInc')[0].value = zeroOrMore(totTaxableInc);
	
    }catch(e){
        alert('Errror in SI:'+e);
    }
}

// Calculate Exemption for Schedule SI.
function getExemption_SI(){
	var age	= calcAgeCommon(document.getElementsByName('partAGEN1.personalInfo.dob')[0]);
	var resStatus = document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0]; //RES , NRI
	var taxPayer = document.getElementsByName('partAGEN1.personalInfo.status')[0];  
		if(taxPayer.value=='I' && age > 59 && age < 80 && (resStatus.value=='RES' || resStatus.value=='NOR')){
			return 300000;
		}else if(taxPayer.value=='I' && age >= 80 && (resStatus.value=='RES'  || resStatus.value=='NOR')){
			return 500000;
		}else if( (taxPayer.value=='I' || taxPayer.value=='H') && (resStatus.value=='RES'  || resStatus.value=='NOR')){
			return 250000;
		}else{
			return 0;
		}
	}

// Calculate Total Tax for Schedule AMTC.
function calcTotScheduleAMTC(){
    try{
        var totAmtcCredGrossPY1 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[0].amtCreditFwd')[0];
        var totAmtcCredSetOffPY1 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[0].amtCreditSetOfEy')[0];
        var totAmtcCredBFPY1 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[0].amtCreditBalBroughtFwd')[0];
        var totAmtcCredUtilPY1 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[0].amtCreditUtilized')[0];
        var totBalAmtcCredCFPY1 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[0].balAmtCreditCarryFwd')[0];
        
        var balAmtcCreditCarriedFwdCY = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.balAmtCreditCarryFwd')[0];
        var totAmtcCredGross = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.amtCreditFwd')[0];
        
        var totAmtcCredGrossPY2 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[1].amtCreditFwd')[0];
        var totAmtcCredSetOffPY2 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[1].amtCreditSetOfEy')[0];
        var totAmtcCredBFPY2 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[1].amtCreditBalBroughtFwd')[0];
        var totAmtcCredUtilPY2 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[1].amtCreditUtilized')[0];
        var totBalAmtcCredCFPY2 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[1].balAmtCreditCarryFwd')[0];
        
        var totAmtcCredGrossPY3 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[2].amtCreditFwd')[0];
        var totAmtcCredSetOffPY3 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[2].amtCreditSetOfEy')[0];
        var totAmtcCredBFPY3 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[2].amtCreditBalBroughtFwd')[0];
        var totAmtcCredUtilPY3 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[2].amtCreditUtilized')[0];
        var totBalAmtcCredCFPY3 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[2].balAmtCreditCarryFwd')[0];
        
        var totAmtcCredGrossCY = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[3].amtCreditFwd')[0];
        var totAmtcCredBFCY = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[3].amtCreditBalBroughtFwd')[0];
        var totAmtcCredUtilCY = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[3].amtCreditUtilized')[0];
        var totBalAmtcCredCFCY = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[3].balAmtCreditCarryFwd')[0];
     
        totAmtcCredBFPY1.value = eval(parseInt(coalesce(totAmtcCredGrossPY1.value),10))-eval(parseInt(coalesce(totAmtcCredSetOffPY1.value),10));
        totAmtcCredBFPY2.value = eval(parseInt(coalesce(totAmtcCredGrossPY2.value),10))-eval(parseInt(coalesce(totAmtcCredSetOffPY2.value),10));
        totAmtcCredBFPY3.value = eval(parseInt(coalesce(totAmtcCredGrossPY3.value),10))-eval(parseInt(coalesce(totAmtcCredSetOffPY3.value),10));
      
        totBalAmtcCredCFPY1.value = eval(parseInt(coalesce(totAmtcCredBFPY1.value),10))-eval(parseInt(coalesce(totAmtcCredUtilPY1.value),10));
        
        totAmtcCredBFCY.value = eval(parseInt(coalesce(totAmtcCredGrossCY.value),10));
        totBalAmtcCredCFCY.value = eval(parseInt(coalesce(totAmtcCredBFCY.value),10))-eval(parseInt(coalesce(totAmtcCredUtilCY.value),10));
       
   
        totBalAmtcCredCFPY2.value = eval(parseInt(coalesce(totAmtcCredBFPY2.value),10))-eval(parseInt(coalesce(totAmtcCredUtilPY2.value),10));
        
        totBalAmtcCredCFPY3.value = eval(parseInt(coalesce(totAmtcCredBFPY3.value),10))-eval(parseInt(coalesce(totAmtcCredUtilPY3.value),10));
        document.getElementsByName('itrScheduleAMTC.totAmtCreditUtilisedCY')[0].value=eval(parseInt(coalesce(totAmtcCredUtilPY1.value),10))+eval(parseInt(coalesce(totAmtcCredUtilPY2.value),10))+eval(parseInt(coalesce(totAmtcCredUtilPY3.value),10))+eval(parseInt(coalesce(totAmtcCredUtilCY.value),10));
        
        balAmtcCreditCarriedFwdCY.value = totAmtcCredGross.value;
	
        document.getElementsByName('itrScheduleAMTC.totAMTGross')[0].value=eval(parseInt(coalesce(totAmtcCredGross.value,10))) + eval(coalesce(parseInt(totAmtcCredGrossPY1.value,10))) + eval(coalesce(parseInt(totAmtcCredGrossPY2.value,10)))+ eval(coalesce(parseInt(totAmtcCredGrossPY3.value,10)))+ eval(coalesce(parseInt(totAmtcCredGrossCY.value,10)));
        document.getElementsByName('itrScheduleAMTC.totSetOffEys')[0].value=eval(parseInt(coalesce(totAmtcCredSetOffPY1.value,10))) + eval(parseInt(coalesce(totAmtcCredSetOffPY2.value,10)))+ eval(parseInt(coalesce(totAmtcCredSetOffPY3.value,10)));
        document.getElementsByName('itrScheduleAMTC.totBalBF')[0].value=eval(parseInt(coalesce(totAmtcCredBFPY1.value,10))) +eval(parseInt(coalesce(totAmtcCredBFPY2.value,10))) +eval(parseInt(coalesce(totAmtcCredBFPY3.value,10)))+eval(parseInt(coalesce(totAmtcCredBFCY.value,10))) ;
        
        document.getElementsByName('itrScheduleAMTC.totBalAMTCreditCF')[0].value=eval(parseInt(coalesce(totBalAmtcCredCFPY1.value,10))) + eval(parseInt(coalesce(totBalAmtcCredCFPY2.value,10)))+ eval(parseInt(coalesce(totBalAmtcCredCFPY3.value,10)))+ eval(coalesce(parseInt(balAmtcCreditCarriedFwdCY.value,10))) + eval(parseInt(coalesce(totBalAmtcCredCFCY.value,10)));

        document.getElementsByName('itrScheduleAMTC.taxSection115JD')[0].value = document.getElementsByName('itrScheduleAMTC.totAmtCreditUtilisedCY')[0].value;

        document.getElementsByName('itrScheduleAMTC.amtLiabilityAvailable')[0].value= document.getElementsByName('itrScheduleAMTC.totBalAMTCreditCF')[0].value;
        
    }catch(e){
    	alert('error in amtc:'+e.stack);
    }
}

// Validate Schedule AMTC.
function validateAMTC(){
	
	 var totAmtcCredGrossPY1 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[0].amtCreditFwd')[0];
     var totAmtcCredSetOffPY1 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[0].amtCreditSetOfEy')[0];
     var totAmtcCredBFPY1 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[0].amtCreditBalBroughtFwd')[0];
     var totAmtcCredUtilPY1 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[0].amtCreditUtilized')[0];
     var totBalAmtcCredCFPY1 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[0].balAmtCreditCarryFwd')[0];
     
     var totAmtcCredGrossPY2 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[1].amtCreditFwd')[0];
     var totAmtcCredSetOffPY2 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[1].amtCreditSetOfEy')[0];
     var totAmtcCredBFPY2 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[1].amtCreditBalBroughtFwd')[0];
     var totAmtcCredUtilPY2 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[1].amtCreditUtilized')[0];
     var totBalAmtcCredCFPY2 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[1].balAmtCreditCarryFwd')[0];
     
     
     var totAmtcCredGrossPY3 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[2].amtCreditFwd')[0];
     var totAmtcCredSetOffPY3 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[2].amtCreditSetOfEy')[0];
     var totAmtcCredBFPY3 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[2].amtCreditBalBroughtFwd')[0];
     var totAmtcCredUtilPY3 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[2].amtCreditUtilized')[0];
     var totBalAmtcCredCFPY3 = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[2].balAmtCreditCarryFwd')[0];
     
     var totAmtcCredGrossCY = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[3].amtCreditFwd')[0];
     var totAmtcCredBFCY = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[3].amtCreditBalBroughtFwd')[0];
     var totAmtcCredUtilCY = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[3].amtCreditUtilized')[0];
     var totBalAmtcCredCFCY = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[3].balAmtCreditCarryFwd')[0];
     
     if(parseInt(coalesce(totAmtcCredSetOffPY1.value),10) > parseInt(coalesce(totAmtcCredGrossPY1.value),10)){
     	
     	j.setFieldError('scheduleAMTC.scheduleAMTCUtil.prevAY[0].amtCreditSetOfEy','The amount of AMT credit B2 cannot exceed B1');
 		addErrorXHTML(document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[0].amtCreditSetOfEy')[0],'The amount of AMT credit B2 cannot exceed B1',true);
 		totAmtcCredSetOffPY1.value=parseInt(0,10);
 		totAmtcCredBFPY1.value=parseInt(0,10);
     }
     
     
     if(parseInt(coalesce(totAmtcCredUtilPY1.value),10) > parseInt(coalesce(totAmtcCredBFPY1.value),10)){
         
     	j.setFieldError('scheduleAMTC.scheduleAMTCUtil.prevAY.amtCreditUtilized','The amount of AMT credit C cannot exceed B3');
 		addErrorXHTML(document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[0].amtCreditUtilized')[0],'The amount of AMT credit C cannot exceed B3',true);
 		totBalAmtcCredCFPY1.value=parseInt(0,10);
 		totAmtcCredUtilPY1.value=parseInt(0,10);
 		document.getElementsByName('itrScheduleAMTC.totAmtCreditUtilisedCY')[0].value=eval(parseInt(coalesce(totAmtcCredUtilPY1.value),10))+eval(parseInt(coalesce(totAmtcCredUtilPY2.value),10));
     }
     
     if(parseInt(coalesce(totAmtcCredSetOffPY2.value),10) > parseInt(coalesce(totAmtcCredGrossPY2.value),10)){
      	
      	j.setFieldError('scheduleAMTC.scheduleAMTCUtil.prevAY[1].amtCreditSetOfEy','The amount of AMT credit B2 cannot exceed B1');
  		addErrorXHTML(document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[1].amtCreditSetOfEy')[0],'The amount of AMT credit B2 cannot exceed B1',true);
  		totAmtcCredSetOffPY2.value=parseInt(0,10);
  		totAmtcCredBFPY2.value=parseInt(0,10);
      }
      
     
     if(parseInt(coalesce(totAmtcCredUtilPY2.value),10) > parseInt(coalesce(totAmtcCredBFPY2.value),10)){
         
      	j.setFieldError('scheduleAMTC.scheduleAMTCUtil.prevAY[1].amtCreditUtilized','The amount of AMT credit C cannot exceed B3');
  		addErrorXHTML(document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[1].amtCreditUtilized')[0],'The amount of AMT credit C cannot exceed B3',true);
  		totBalAmtcCredCFPY2.value=parseInt(0,10);
  		totAmtcCredUtilPY2.value=parseInt(0,10);
  		document.getElementsByName('itrScheduleAMTC.totAmtCreditUtilisedCY')[0].value=eval(parseInt(coalesce(totAmtcCredUtilPY1.value),10))+eval(parseInt(coalesce(totAmtcCredUtilPY2.value),10));
      }
     
     if(parseInt(coalesce(totAmtcCredSetOffPY3.value),10) > parseInt(coalesce(totAmtcCredGrossPY3.value),10)){
       	
       	j.setFieldError('scheduleAMTC.scheduleAMTCUtil.prevAY[2].amtCreditSetOfEy','The amount of AMT credit B2 cannot exceed B1');
   		addErrorXHTML(document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[2].amtCreditSetOfEy')[0],'The amount of AMT credit B2 cannot exceed B1',true);
   		totAmtcCredSetOffPY3.value=parseInt(0,10);
   		totAmtcCredBFPY3.value=parseInt(0,10);
       }
       
      
      if(parseInt(coalesce(totAmtcCredUtilPY3.value),10) > parseInt(coalesce(totAmtcCredBFPY3.value),10)){
          
       	j.setFieldError('scheduleAMTC.scheduleAMTCUtil.prevAY[2].amtCreditUtilized','The amount of AMT credit C cannot exceed B3');
   		addErrorXHTML(document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[2].amtCreditUtilized')[0],'The amount of AMT credit C cannot exceed B3',true);
   		totBalAmtcCredCFPY3.value=parseInt(0,10);
   		totAmtcCredUtilPY3.value=parseInt(0,10);
   		document.getElementsByName('itrScheduleAMTC.totAmtCreditUtilisedCY')[0].value=eval(parseInt(coalesce(totAmtcCredUtilPY1.value),10))+eval(parseInt(coalesce(totAmtcCredUtilPY2.value),10));
       }
     
     if(parseInt(coalesce(totAmtcCredUtilCY.value),10) > parseInt(coalesce(totAmtcCredBFCY.value),10)){
         
       	j.setFieldError('scheduleAMTC.scheduleAMTCUtil.prevAY[3].amtCreditUtilized','The amount of AMT credit C cannot exceed B3');
   		addErrorXHTML(document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.prevAY[3].amtCreditUtilized')[0],'The amount of AMT credit C cannot exceed B3',true);
   		totBalAmtcCredCFCY.value=parseInt(0,10);
   		totAmtcCredUtilCY.value=parseInt(0,10);
   		document.getElementsByName('itrScheduleAMTC.totAmtCreditUtilisedCY')[0].value=eval(parseInt(coalesce(totAmtcCredUtilPY.value),10))+eval(parseInt(coalesce(totAmtcCredUtilCY.value),10));
       }
	
     
     var totAmtCreditUtilisedCY = document.getElementsByName('itrScheduleAMTC.totAmtCreditUtilisedCY')[0];
     var amtTaxCreditAvaliableChk = document.getElementsByName('itrScheduleAMTC.amtTaxCreditAvailable')[0];
     if(parseInt(coalesce(totAmtCreditUtilisedCY.value),10) > parseInt(coalesce(amtTaxCreditAvaliableChk.value),10)){
     	
     	j.setFieldError('itrScheduleAMTC.totAmtCreditUtilisedCY','The amount of AMT credit C cannot exceed Point 3');
 		addErrorXHTML(document.getElementsByName('itrScheduleAMTC.totAmtCreditUtilisedCY')[0],'The amount of AMT credit C cannot exceed Point 3',true);
     }
     
     calcTotScheduleAMTC();
     
}


// Calculate Deductions for Schedule VIA.
function caclDedSchVIA(){
	try{
	
		var grossTotInc = document.getElementsByName('partBTI.grossTotalIncome')[0]; 
		var incChrgable=document.getElementsByName('partBTI.incChargeTaxSplRate111A112')[0]; 
		var deductionsUnder10Aor10AA=document.getElementsByName('partBTI.deductionsUnder10Aor10AA')[0]; 
		var resStatus=document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0].value;
		var status=document.getElementsByName('partAGEN1.personalInfo.status')[0].value;
		
		if(parseInt(grossTotInc.value ,10) <0){
			
			grossTotInc.value='0';
		}

		if(parseInt(incChrgable.value ,10) <0){
			
			incChrgable.value='0';
		}
		
		

	var gtiLimit=eval(parseInt(coalesce(grossTotInc.value),10)-parseInt(coalesce(incChrgable.value),10)
						-parseInt(coalesce(deductionsUnder10Aor10AA.value),10));
	
	if(gtiLimit<0){
		gtiLimit=0;
	}
	
	var sec80C=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80C')[0];
	var sec80CSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80C')[0];
	
	var sec80CCC=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80CCC')[0];
	var sec80CCCSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80CCC')[0];
	
	var sec80CCDi=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80CCDi')[0];
	var sec80CCDiSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80CCDi')[0];
	
	var sec80CCD1B=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80CCD1B')[0];
	var sec80CCD1BSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80CCD1B')[0];
	
	var sec80CCDii=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80CCDii')[0];
	var sec80CCDiiSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80CCDii')[0];
	
	var sec80CCG=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80CCG')[0];

	var sec80CCGSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80CCG')[0];

	var sec80D=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80D')[0];
	var sec80DSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80D')[0];
	
	var sec80DD=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80DD')[0];
	var sec80DDSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80DD')[0];
	
	var sec80DDB=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80DDB')[0];
	var sec80DDBSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80DDB')[0];
	
	var sec80E=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80E')[0];
	var sec80ESysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80E')[0];

	var sec80EE=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80EE')[0];
	var sec80EESysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80EE')[0];
	
	var sec80G=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80G')[0]; 
	var sec80GSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80G')[0];
	var totalElgblAmt80G=document.getElementsByName('schedule80G.totalEligibleDonationsUs80G')[0];

	var sec80GG=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80GG')[0]; 
	var sec80GGSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80GG')[0]; 



	var sec80GGC=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80GGC')[0]; 
	var sec80GGCSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80GGC')[0]; 
	
	var sec80IBA=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80IBA')[0]; 
	var sec80IBASysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80IBA')[0]; 

	var sch80IA=document.getElementsByName('schedule80IA.totSchedule80IA')[0];
	var sec80IA=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80IA')[0]; 
	var sec80IASysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80IA')[0]; 

	
	var sec80IAB=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80IAB')[0]; 
	var sec80IABSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80IAB')[0]; 

	var sch80IB=document.getElementsByName('schedule80IB.totSchedule80IB')[0]; 
	var sec80IB=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80IB')[0]; 
	var sec80IBSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80IB')[0]; 


	var sch80IC=document.getElementsByName('schedule80IC.totSchedule80IC')[0]; 
	var sec80IC=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80IC')[0]; 
	var sec80ICSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80IC')[0]; 

	var sec80ID=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80ID')[0]; 
	var sec80IDSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80ID')[0]; 

	var sec80JJA=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80JJA')[0]; 
	var sec80JJASysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80JJA')[0]; 

    var sec80JJAA=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80JJAA')[0];
	var sec80JJAASysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80JJAA')[0];
	
	var sec80QQB=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80QQB')[0]; 
	var sec80QQBSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80QQB')[0]; 
	
	var sec80RRB=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80RRB')[0]; 
	var sec80RRBSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80RRB')[0]; 
	
	var sec80TTA=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80TTA')[0]; 
	var sec80TTASysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80TTA')[0]; 
	
	var sec80U=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80U')[0]; 
	var sec80USysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80U')[0]; 


	var totalDedVIA=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.totalChapVIADeductions')[0]; totalDedVIA.value=coalesce(totalDedVIA.value);
	var totalDedVIASysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.totalChapVIADeductions')[0]; totalDedVIASysCal.value=coalesce(totalDedVIASysCal.value);

	var salaries=document.getElementsByName('partBTI.salaries')[0];

	//80C
	
	if(parseInt(gtiLimit,10)> eval('150000') ){
		if( parseInt(coalesce(sec80C.value),10) > eval('150000')) {
			sec80CSysCal.value = '150000' ;
		} else {
			sec80CSysCal.value = parseInt(coalesce(sec80C.value),10);
		}

	}else{
		
		if( parseInt(coalesce(sec80C.value),10) > parseInt(gtiLimit,10)) {
			sec80CSysCal.value = gtiLimit ;
		} else {
			sec80CSysCal.value = parseInt(coalesce(sec80C.value),10);
		}
	}
	//80CCC

		if(status =='I'){
			
	if(parseInt(gtiLimit,10)> eval('150000') ){		
		if( parseInt(coalesce(sec80CCC.value),10) > eval('150000')) {
			sec80CCCSysCal.value = '150000' ;
		} else {
			sec80CCCSysCal.value= parseInt(coalesce(sec80CCC.value),10);
		}
		
	 }else{
		 
		 if( parseInt(coalesce(sec80CCC.value),10) > parseInt(gtiLimit,10)) {
				sec80CCCSysCal.value = gtiLimit ;
			} else {
				sec80CCCSysCal.value= parseInt(coalesce(sec80CCC.value),10);
			}
				
			}
		
	}else{
		
		sec80CCCSysCal.value= parseInt('0',10);
		
	}

	
	
	// CHECK FOR 80CCDii (EMPLOYER CONTRIBUTIION)
	var temp = Math.round(eval(parseInt(coalesce(salaries.value),10)) * eval('0.10'));
	if(status =='I' ){
	if( parseInt(sec80CCDii.value,10) > temp ) {
		sec80CCDiiSysCal.value = temp ;
	} else {
		sec80CCDiiSysCal.value = parseInt(sec80CCDii.value,10);
	}
	}
	else{
		sec80CCDiiSysCal.value=parseInt('0',10);
	}
	


	// CHECK FOR 80CCDi(EMPLOYEE)

	var salUppLimit = Math.round(eval(parseInt(coalesce(salaries.value),10)) * eval('0.10'));
	var gtiUppLimit = Math.round(eval(parseInt(coalesce(grossTotInc.value),10)) * eval('0.10'));
	
	
	// CHECK FOR 80CCD1B (NOTIFIED PENSION SCHEME)
	var temp = Math.round(eval(parseInt(coalesce(salaries.value),10)) * eval('0.10'));
	if(status =='I' ){
		if( parseInt(sec80CCD1B.value,10) >= parseInt('50000' ,10) ) {
			sec80CCD1BSysCal.value = parseInt('50000' ,10) ;
		} else {
			sec80CCD1BSysCal.value = parseInt(sec80CCD1B.value,10);
		}
		if(Math.round(eval(parseInt(coalesce(grossTotInc.value),10))) < parseInt('0',10)){
			sec80CCD1BSysCal.value=parseInt('0',10);
		}
	}
	else{
		sec80CCD1BSysCal.value=parseInt('0',10);
	}
	
	
	if(status =='I'){		
	if(parseInt(coalesce(salaries.value)) == parseInt('0' , 10)){
			if(gtiUppLimit > parseInt('150000' ,10)){
				if( parseInt(coalesce(sec80CCDi.value),10) > eval('150000')) {
					sec80CCDiSysCal.value = '150000' ;
				} else {
					sec80CCDiSysCal.value = parseInt(coalesce(sec80CCDi.value),10);
				}
			} else {
				if( parseInt(coalesce(sec80CCDi.value),10) > gtiUppLimit ) {
					sec80CCDiSysCal.value = gtiUppLimit ;
				} else {
					sec80CCDiSysCal.value = parseInt(coalesce(sec80CCDi.value),10);
				}
				}	
	}else{
	
		if(salUppLimit > parseInt('150000' ,10)){
			if( parseInt(coalesce(sec80CCDi.value),10) > eval('150000')) {
				sec80CCDiSysCal.value = '150000' ;
			} else {
				sec80CCDiSysCal.value = parseInt(coalesce(sec80CCDi.value),10);
			}
		} else {
			if( parseInt(coalesce(sec80CCDi.value),10) > salUppLimit ) {
				sec80CCDiSysCal.value = salUppLimit ;
			} else {
				sec80CCDiSysCal.value = parseInt(coalesce(sec80CCDi.value),10);
			}
		}	
		
	}
	} else if(status =='H' ){
		sec80CCDiSysCal.value = parseInt('0',10);
	}
		//80CCG
	if(status =='I'){	
		 if(resStatus=='RES' || resStatus=='NOR'){
			 
			 if(parseInt(coalesce(grossTotInc.value),10) <= parseInt('1200000',10)){
				 
				 if(gtiLimit > parseInt('25000' ,10)){
					 
					 if( parseInt(coalesce(sec80CCG.value),10) > eval('25000')){
						 sec80CCGSysCal.value = '25000';
					  } else {
						  sec80CCGSysCal.value=  parseInt(coalesce(sec80CCG.value),10);
					  } 
					 
					 
				 }else{
					 
					 
					 if( parseInt(coalesce(sec80CCG.value),10) > gtiLimit ) {
						 sec80CCGSysCal.value = gtiLimit ;
						} else {
							sec80CCGSysCal.value = parseInt(coalesce(sec80CCG.value),10);
						}
						}
					 
				 }else{
					 sec80CCGSysCal.value= parseInt('0',10);
				 }
				 
				 
			 }else{
				 
				 sec80CCGSysCal.value= parseInt('0',10);
			 }
			 
			 
		 }else{
			sec80CCGSysCal.value= parseInt('0',10);
		}
			
		 //80D
			 
		 var age = calcAge();
		 var option80D = document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80DUsrType')[0].value;

		if(status =='I'){
			if(option80D == '1'){
				if( parseInt(sec80D.value,10) > eval('25000')){
					sec80DSysCal.value = '25000';
				} else {
					sec80DSysCal.value =  parseInt(sec80D.value,10);
				}
			}else if(option80D== '2' && (resStatus =='RES' || resStatus =='NOR')){
				if( parseInt(sec80D.value,10) > eval('30000')){
					sec80DSysCal.value = '30000';
				} else {
					sec80DSysCal.value =  parseInt(sec80D.value,10);
				}
			}else if(option80D== '2'){
				if( parseInt(sec80D.value,10) > eval('25000')){
					sec80DSysCal.value = '25000';
				} else {
					sec80DSysCal.value =  parseInt(sec80D.value,10);
				}
			}else if(option80D== '3'){
				if( parseInt(sec80D.value,10) > eval('25000')){
					sec80DSysCal.value = '25000';
				} else {
					sec80DSysCal.value =  parseInt(sec80D.value,10);
				}
			}else if(option80D== '4'){
				if( parseInt(sec80D.value,10) > eval('30000')){
					sec80DSysCal.value = '30000';
				} else {
					sec80DSysCal.value =  parseInt(sec80D.value,10);
				}
			}else if(option80D== '5'){
				if( parseInt(sec80D.value,10) > eval('50000')){
					sec80DSysCal.value = '50000';
				} else {
					sec80DSysCal.value =  parseInt(sec80D.value,10);
				}
			}else if(option80D== '6'){
				if( parseInt(sec80D.value,10) > eval('55000')){
					sec80DSysCal.value = '55000';
				} else {
					sec80DSysCal.value =  parseInt(sec80D.value,10);
				}
			}else if(option80D== '7' ){
				if(age > eval('59') && (resStatus =='RES' || resStatus =='NOR')){
					if( parseInt(sec80D.value,10) > eval('60000')){
						sec80DSysCal.value = '60000';
					} else {
						sec80DSysCal.value =  parseInt(sec80D.value,10);
					}
				}else{
					if( parseInt(sec80D.value,10) > eval('55000')){
						sec80DSysCal.value = '55000';
					} else {
						sec80DSysCal.value =  parseInt(sec80D.value,10);
					}
				}
			}else{
				sec80DSysCal.value= parseInt('0',10);
			}
			if(parseInt(gtiLimit ,10) < sec80DSysCal.value){
					sec80DSysCal.value = gtiLimit;
			}	
		} else {
				if(gtiLimit > parseInt('30000' ,10)){
			if( parseInt(coalesce(sec80D.value),10) > eval('30000')){
					
					sec80DSysCal.value = '30000';
				} else {
					sec80DSysCal.value = parseInt(coalesce(sec80D.value),10);
				}
				}else{
					
					if( parseInt(coalesce(sec80D.value),10) > gtiLimit ) {
						sec80DSysCal.value = gtiLimit ;
					} else {
						sec80DSysCal.value = parseInt(coalesce(sec80D.value),10);
					}
				}
				}
		
// CHECK FOR 80DD	
	if(resStatus =='RES' || resStatus =='NOR'){
		
		if(parseInt(gtiLimit,10)> eval('125000') ){
		
			if( parseInt(coalesce(sec80DD.value),10) > eval('125000')){
				sec80DDSysCal.value= '125000';
			}else{
				sec80DDSysCal.value = parseInt(coalesce(sec80DD.value),10);
			}
			
		}else{
			
			if( parseInt(coalesce(sec80DD.value),10) > eval(parseInt(gtiLimit,10))){
				sec80DDSysCal.value= gtiLimit;
			}else{
				sec80DDSysCal.value = parseInt(coalesce(sec80DD.value),10);
			}
			
		}
		}else {
			sec80DDSysCal.value= parseInt('0',10);
		}
//CHECK FOR 80DDB
	if(resStatus =='RES' || resStatus =='NOR'){
		
		if(parseInt(gtiLimit,10)> eval('80000') ){
		
		if(parseInt(coalesce(sec80DDB.value) ,10) > eval('80000')){
				sec80DDBSysCal.value = '80000';
			} else {
				sec80DDBSysCal.value = parseInt(coalesce(sec80DDB.value) ,10);
			}
		
		}else{
			if(parseInt(coalesce(sec80DDB.value) ,10) > eval(parseInt(gtiLimit,10))){
				sec80DDBSysCal.value = gtiLimit;
			} else {
				sec80DDBSysCal.value = parseInt(coalesce(sec80DDB.value) ,10);
			}
		}
	} else {
		sec80DDBSysCal.value =parseInt('0',10);
	}
	

	// CHECK FOR 80E
	if(status =='I'){
		if(eval(parseInt(coalesce(gtiLimit),10)>parseInt(coalesce(sec80E.value),10))){
			sec80ESysCal.value = parseInt(coalesce(sec80E.value),10);
		}else{
			sec80ESysCal.value = parseInt(coalesce(gtiLimit),10);
		}
	}else{
		sec80ESysCal.value = parseInt('0',10);
	}
	
	// CHECK FOR 80EE
	if(status =='I'){
            
            if(parseInt(coalesce(gtiLimit),10)> eval('50000') ){
		
		if(parseInt(coalesce(sec80EE.value) ,10) > eval('50000')){
				sec80EESysCal.value = '50000';
			} else {
				sec80EESysCal.value = parseInt(coalesce(sec80EE.value) ,10);
			}
		
		}else{
			if(parseInt(coalesce(sec80EE.value) ,10) > eval(parseInt(coalesce(gtiLimit),10))){
				sec80EESysCal.value = gtiLimit;
			} else {
				sec80EESysCal.value = parseInt(coalesce(sec80EE.value) ,10);
			}
		}
            
	}else{
		sec80EESysCal.value = parseInt('0',10);
	}
		 
	//Autopopulate 80G
	sec80GSysCal.value=totalElgblAmt80G.value;
	sec80G.value=totalElgblAmt80G.value;
	

	//80GGC
	if(eval(parseInt(coalesce(sec80GGC.value),10)>parseInt(coalesce(gtiLimit),10))){

		sec80GGCSysCal.value=parseInt(coalesce(gtiLimit),10);
	}else{
		sec80GGCSysCal.value = parseInt(coalesce(sec80GGC.value),10);
	}
	
	
	var profGainSpecifiedBus = document.getElementsByName('partBTI.profBusGain.profGainSpecifiedBus')[0];
	var gtiLimitC = zeroOrMore(parseInt(coalesce(gtiLimit),10) - parseInt(coalesce(profGainSpecifiedBus.value),10));

	//80IAB
	if(eval(parseInt(coalesce(sec80IAB.value),10)>parseInt(coalesce(gtiLimitC),10))){

		sec80IABSysCal.value=parseInt(coalesce(gtiLimitC),10);
	}else{
		sec80IABSysCal.value = parseInt(coalesce(sec80IAB.value),10);
	}
	
	//80IBA
	if(eval(parseInt(coalesce(sec80IBA.value),10)>parseInt(coalesce(gtiLimitC),10))){

		sec80IBASysCal.value=parseInt(coalesce(gtiLimitC),10);
	}else{
		sec80IBASysCal.value = parseInt(coalesce(sec80IBA.value),10);
	}
	
	//Autopoulate 80IA
	
	if(eval(parseInt(coalesce(sec80IA.value),10)>parseInt(coalesce(gtiLimitC),10))){

		sec80IA.value = parseInt(coalesce(sch80IA.value),10);
		sec80IASysCal.value = parseInt(gtiLimitC,10);
	}else{
		sec80IA.value = parseInt(coalesce(sch80IA.value),10);
		sec80IASysCal.value = parseInt(coalesce(sch80IA.value),10);
	}
	
	

	
	//Autopoulate 80IB
	
	if(eval(parseInt(coalesce(sec80IB.value),10)>parseInt(coalesce(gtiLimitC),10))){

		sec80IB.value = parseInt(coalesce(sch80IB.value),10);
		sec80IBSysCal.value = parseInt(gtiLimitC,10);
	}else{
		
		sec80IB.value = parseInt(coalesce(sch80IB.value),10);
		sec80IBSysCal.value = parseInt(coalesce(sch80IB.value),10);
	}
	
	
	//Autopoulate 80IC
	
	if(eval(parseInt(coalesce(sec80IC.value),10)>parseInt(coalesce(gtiLimitC),10))){

		sec80IC.value = parseInt(coalesce(sch80IC.value),10);
		sec80ICSysCal.value = parseInt(gtiLimitC,10);
	}else{
		sec80IC.value = parseInt(coalesce(sch80IC.value),10);
		sec80ICSysCal.value = parseInt(coalesce(sch80IC.value),10);
	}
	
	
	

	//80ID
	
	
	if(eval(parseInt(coalesce(sec80ID.value),10)>parseInt(coalesce(gtiLimitC),10))){

		sec80IDSysCal.value=parseInt(coalesce(gtiLimitC),10);
	}else{
		sec80IDSysCal.value = parseInt(coalesce(sec80ID.value),10);
	}

	

	//80JJA
	if(eval(parseInt(coalesce(sec80JJA.value),10)>parseInt(coalesce(gtiLimitC),10))){

		sec80JJASysCal.value=parseInt(coalesce(gtiLimitC),10);
	}else{
		sec80JJASysCal.value = parseInt(coalesce(sec80JJA.value),10);
	}
	
	//80JJAA

		if(eval(parseInt(coalesce(sec80JJAA.value),10)>parseInt(coalesce(gtiLimitC),10))){
	
			sec80JJAASysCal.value=parseInt(coalesce(gtiLimitC),10);
		}else{
			sec80JJAASysCal.value = parseInt(coalesce(sec80JJAA.value),10);
		}
	
//80QQB
	
	
	if(status =='I'){
	
	if(resStatus=='RES' || resStatus=='NOR'){	
		if(parseInt(coalesce(gtiLimitC),10)> eval('300000') ){
			if( parseInt(coalesce(sec80QQB.value),10) > eval('300000')) {
				sec80QQBSysCal.value = '300000' ;
			} else {
				sec80QQBSysCal.value = parseInt(coalesce(sec80QQB.value),10);
			}

		}else{
			
			if( parseInt(coalesce(sec80QQB.value),10) > parseInt(coalesce(gtiLimitC),10)) {
				sec80QQBSysCal.value = gtiLimitC ;
			} else {
				sec80QQBSysCal.value = parseInt(coalesce(sec80QQB.value),10);
			}
		}	
	}else{
		sec80QQBSysCal.value =parseInt('0',10);
	}
		}else{
		sec80QQBSysCal.value =parseInt('0',10);
	}
	

	
	
	
	// CHECK FOR 80RRB
	
	if(status =='I'){
		
	
		if(resStatus=='RES' || resStatus=='NOR'){	
			if(parseInt(coalesce(gtiLimitC),10)> eval('300000') ){
				if( parseInt(coalesce(sec80RRB.value),10) > eval('300000')) {
					sec80RRBSysCal.value = '300000' ;
				} else {
					sec80RRBSysCal.value = parseInt(coalesce(sec80RRB.value),10);
				}

			}else{
				
				if( parseInt(coalesce(sec80RRB.value),10) > parseInt(coalesce(gtiLimitC),10)) {
					sec80RRBSysCal.value = gtiLimitC ;
				} else {
					sec80RRBSysCal.value = parseInt(coalesce(sec80RRB.value),10);
				}
			}	
		}else{
			sec80RRBSysCal.value =parseInt('0',10);
		}
		
	}else{
		sec80RRBSysCal.value =parseInt('0',10);
	}

	
	// CHECK FOR 80TTA
	var incOs = document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.interestGross')[0].value;
	if( parseInt(coalesce(gtiLimit),10) >0 ){
		if(parseInt(isNVL(sec80TTA.value),10) > parseInt('0',10)){
			sec80TTASysCal.value=Math.min(parseInt(incOs,10),parseInt(gtiLimit ,10),10000,parseInt(isNVL(sec80TTA.value),10));
		} else{
			sec80TTASysCal.value= parseInt('0',10);
		}
	} else {
		sec80TTASysCal.value= parseInt('0',10);
	}
	
	
	
	// CHECK FOR 80U
	
	if(status =='I'){
		if(resStatus=='RES' || resStatus=='NOR'){	
			if(parseInt(coalesce(gtiLimit),10)> eval('125000') ){
				if( parseInt(coalesce(sec80U.value),10) > eval('125000')) {
					sec80USysCal.value = '125000' ;
				} else {
					sec80USysCal.value = parseInt(coalesce(sec80U.value),10);
				}

			}else{
				
				if( parseInt(coalesce(sec80U.value),10) > parseInt(coalesce(gtiLimit),10)) {
					sec80USysCal.value = gtiLimit ;
				} else {
					sec80USysCal.value = parseInt(coalesce(sec80U.value),10);
				}
			}	
		}else{
			sec80USysCal.value =parseInt('0',10);
		}
				
	}else{
		sec80USysCal.value =parseInt('0',10);
	}
	
	

	checkSum80C80CCC();

	sumUserEntrdDed();
	sec80GGSysCal.value=0;
	sumDeductionsWithout80GG(sec80CSysCal,sec80CCCSysCal,sec80CCDiSysCal,sec80CCD1BSysCal,sec80CCDiiSysCal,
			sec80DSysCal,sec80DDSysCal,sec80DDBSysCal,sec80ESysCal,sec80EESysCal,sec80GSysCal,sec80GGCSysCal,sec80IBASysCal,
			sec80IASysCal,sec80IABSysCal,sec80IBSysCal,sec80ICSysCal,sec80IDSysCal,sec80JJASysCal,sec80JJAASysCal,
			sec80USysCal,sec80CCGSysCal,sec80RRBSysCal,sec80QQBSysCal,sec80TTASysCal);

	// CHECK FOR 80GG again
	var totInc = document.getElementsByName('partBTI.totalIncome')[0];	
	if(totInc.value < 0){	
		totInc.value = eval(parseInt('0', 10));
	}
	var oneFrthTI =  Math.round(eval(totInc.value) * eval(0.25));
	
	if(status =='I' ){		
		if(eval(oneFrthTI) < eval('60000')) {
			if(eval(sec80GG.value) > eval(oneFrthTI)){
				sec80GGSysCal.value = eval(oneFrthTI);
			} else {
				sec80GGSysCal.value = sec80GG.value;
			}
		} else{
			if(eval(sec80GG.value) > eval('60000')){
				sec80GGSysCal.value = eval('60000');
			}else {
				sec80GGSysCal.value = sec80GG.value;
			}
		}
	}else{		
		sec80GGSysCal.value = eval(parseInt('0', 10));
	}
	
	
	// Do the sum of deductions again after adding 80GG and 80G
	sumDeductions(sec80CSysCal,sec80CCCSysCal,sec80CCDiSysCal,sec80CCD1BSysCal,sec80CCDiiSysCal,
			sec80DSysCal,sec80DDSysCal,sec80DDBSysCal,sec80ESysCal,sec80EESysCal,sec80GSysCal,sec80GGSysCal,sec80GGCSysCal,sec80IBASysCal,
			sec80IASysCal,sec80IABSysCal,sec80IBSysCal,sec80ICSysCal,sec80IDSysCal,sec80JJASysCal,sec80JJAASysCal,
			sec80USysCal,sec80CCGSysCal,sec80RRBSysCal,sec80QQBSysCal,sec80TTASysCal);
	

                        

	}catch(e){
		alert('Error in Schedule V1A' +e);
	}

}


// Total Sum of Deductions as entered by the user.
function sumUserEntrdDed() {
try{
var sec80C=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80C')[0];
var sec80CCC=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80CCC')[0];	
var sec80CCDi=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80CCDi')[0];
var sec80CCD1B=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80CCD1B')[0];
var sec80CCDii=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80CCDii')[0];
var sec80CCG=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80CCG')[0];
var sec80D=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80D')[0];
var sec80DD=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80DD')[0];
var sec80DDB=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80DDB')[0];
var sec80E=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80E')[0];
var sec80EE=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80EE')[0];
var sec80G=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80G')[0];
var sec80GG=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80GG')[0]; 
var sec80GGC=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80GGC')[0]; 	
var sec80IBA=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80IBA')[0]; 
var sec80IA=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80IA')[0]; 
var sec80IAB=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80IAB')[0]; 
var sec80IB=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80IB')[0]; 
var sec80IC=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80IC')[0]; 
var sec80ID=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80ID')[0]; 
var sec80JJA=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80JJA')[0]; 
var sec80JJAA=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80JJAA')[0]; 

var sec80QQB=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80QQB')[0]; 
var sec80RRB=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80RRB')[0]; 
var sec80TTA=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80TTA')[0]; 
var sec80U=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80U')[0];

var userEntrdDedPartB=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.totalDeductionPartb')[0];
var userEntrdDedPartC=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.totalDeductionPartc')[0];
var userEntrdDedPartCA=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.totalDeductionPartca')[0];

userEntrdDedPartB.value=eval(parseInt(coalesce(sec80C.value) ,10))+
						 eval(parseInt(coalesce(sec80CCC.value) ,10))+
						 eval(parseInt(coalesce(sec80CCDi.value) ,10))+
						 eval(parseInt(coalesce(sec80CCD1B.value) ,10))+
						 eval(parseInt(coalesce(sec80CCDii.value) ,10))+
                                                 eval(parseInt(coalesce(sec80CCG.value) ,10))+
						 eval(parseInt(coalesce(sec80D.value) ,10))+
						 eval(parseInt(coalesce(sec80DD.value) ,10))+
						 eval(parseInt(coalesce(sec80DDB.value) ,10))+
						 eval(parseInt(coalesce(sec80E.value) ,10))+
						 eval(parseInt(coalesce(sec80EE.value) ,10))+
						 eval(parseInt(coalesce(sec80G.value) ,10))+
						 eval(parseInt(coalesce(sec80GG.value) ,10))+
						 eval(parseInt(coalesce(sec80GGC.value) ,10));

   
  userEntrdDedPartC.value= eval(parseInt(coalesce(sec80IA.value) ,10))+
						 eval(parseInt(coalesce(sec80IAB.value) ,10))+
						 eval(parseInt(coalesce(sec80IB.value) ,10))+
						 eval(parseInt(coalesce(sec80IBA.value) ,10))+
						 eval(parseInt(coalesce(sec80IC.value) ,10))+
						 eval(parseInt(coalesce(sec80ID.value) ,10))+
						 eval(parseInt(coalesce(sec80JJA.value) ,10))+
						 eval(parseInt(coalesce(sec80JJAA.value) ,10))+
                                                 eval(parseInt(coalesce(sec80RRB.value) ,10))+
						 eval(parseInt(coalesce(sec80QQB.value) ,10));
userEntrdDedPartCA.value=eval(parseInt(coalesce(sec80U.value) ,10))+eval(parseInt(coalesce(sec80TTA.value) ,10));
	
        var userEntrdDed = document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.totalChapVIADeductions')[0];
	userEntrdDed.value =eval(parseInt(coalesce(userEntrdDedPartB.value) ,10))+eval(parseInt(coalesce(userEntrdDedPartC.value) ,10))+
            eval(parseInt(coalesce(userEntrdDedPartCA.value) ,10));
						 
}catch(e){
	alert('error'+e);
}					 					 
						 
	}

// check Total sum 80CCC.
function checkSum80C80CCC(){
	var sec80CSysCalc = document.getElementsByName('scheduleVIA.deductUndChapVIA.section80C')[0];
	var sec80CCCSysCalc = document.getElementsByName('scheduleVIA.deductUndChapVIA.section80CCC')[0];
	var sec80CCDempeContrSysCalc = document.getElementsByName('scheduleVIA.deductUndChapVIA.section80CCDi')[0];
	var netSum = eval(sec80CSysCalc.value) + eval(sec80CCCSysCalc.value) + eval(sec80CCDempeContrSysCalc.value);

	if(eval(netSum) >  eval('150000')) {
		var residue = eval(netSum) - eval('150000');
		if(sec80CCDempeContrSysCalc.value >= residue) {
			sec80CCDempeContrSysCalc.value = eval(sec80CCDempeContrSysCalc.value) - eval(residue);
		}else {
			residue = eval(residue) - eval(sec80CCDempeContrSysCalc.value);
			sec80CCDempeContrSysCalc.value =eval('0');

			if(sec80CCCSysCalc.value >= residue){
				sec80CCCSysCalc.value = eval(sec80CCCSysCalc.value) -eval(residue);
			} else {
				residue = eval(residue) - eval(sec80CCCSysCalc.value);
				sec80CCCSysCalc.value =eval('0');
			}
		}
	}
}

// Calculate Total sum of Deductions.
function sumDeductions(sec80CSysCalc,sec80CCCSysCalc,sec80CCDiSysCalc,sec80CCD1BSysCalc,sec80CCDiiSysCalc,
	sec80DSysCalc,sec80DDSysCalc,sec80DDBSysCalc,sec80ESysCalc,sec80EESysCalc,sec80GSysCalc,sec80GGSysCalc,sec80GGCSysCalc,
	sec80IASysCal,sec80IABSysCal,sec80IBSysCal,sec80ICSysCal,sec80IDSysCal,sec80JJASysCal,sec80JJAASysCal,sec80IBASysCal,
	sec80USysCalc,sec80CCGSysCalc,sec80RRBSysCalc,sec80QQBSysCalc,sec80TTASysCalc){

sec80CSysCalc.value 			= coalesce(sec80CSysCalc.value); 				sec80CCCSysCalc.value			= coalesce(sec80CCCSysCalc.value);
sec80CCDiSysCalc.value 		= coalesce(sec80CCDiSysCalc.value); 				
sec80CCD1BSysCalc.value 		= coalesce(sec80CCD1BSysCalc.value);                 sec80CCDiiSysCalc.value 	= coalesce(sec80CCDiiSysCalc.value);
sec80DSysCalc.value 			= coalesce(sec80DSysCalc.value);
sec80DDSysCalc.value 			= coalesce(sec80DDSysCalc.value); 				sec80DDBSysCalc.value			= coalesce(sec80DDBSysCalc.value);
sec80ESysCalc.value 			= coalesce(sec80ESysCalc.value);                sec80EESysCalc.value 			= coalesce(sec80EESysCalc.value);
sec80GSysCalc.value 			= coalesce(sec80GSysCalc.value);
sec80GGSysCalc.value 			= coalesce(sec80GGSysCalc.value); 				sec80JJASysCal.value=   coalesce(sec80JJASysCal.value); sec80JJAASysCal.value=   coalesce(sec80JJAASysCal.value);
sec80GGCSysCalc.value 			= coalesce(sec80GGCSysCalc.value); 				sec80USysCalc.value 			= coalesce(sec80USysCalc.value);
sec80CCGSysCalc.value 			= coalesce(sec80CCGSysCalc.value);				sec80RRBSysCalc.value 			= coalesce(sec80RRBSysCalc.value);
sec80QQBSysCalc.value 			= coalesce(sec80QQBSysCalc.value);				sec80TTASysCalc.value 			= coalesce(sec80TTASysCalc.value);
sec80IASysCal.value = coalesce(sec80IASysCal.value);                sec80IABSysCal.value = coalesce(sec80IABSysCal.value);
sec80ICSysCal.value = coalesce(sec80ICSysCal.value);                sec80IDSysCal.value = coalesce(sec80IDSysCal.value); sec80IBASysCal.value 			= coalesce(sec80IBASysCal.value);
sec80IBSysCal.value = coalesce(sec80IBSysCal.value);

var dedPartB=document.getElementsByName('scheduleVIA.deductUndChapVIA.totalDeductionPartb')[0];
var dedPartC=document.getElementsByName('scheduleVIA.deductUndChapVIA.totalDeductionPartc')[0];
var dedPartCA=document.getElementsByName('scheduleVIA.deductUndChapVIA.totalDeductionPartca')[0];

dedPartB.value=eval(sec80CSysCalc.value) + eval(sec80CCCSysCalc.value) + eval(sec80CCDiiSysCalc.value) + eval(sec80CCD1BSysCalc.value) +
			eval(sec80CCDiSysCalc.value) + eval(sec80DSysCalc.value) +
			eval(sec80DDSysCalc.value) + eval(sec80DDBSysCalc.value) + eval(sec80ESysCalc.value) +eval(sec80EESysCalc.value) +
			eval(sec80GSysCalc.value)+ eval(sec80GGSysCalc.value)+eval(sec80CCGSysCalc.value)+eval(sec80GGCSysCalc.value);
dedPartC.value=  eval(sec80IASysCal.value)+ eval(sec80IABSysCal.value)+eval(sec80ICSysCal.value)+ eval(sec80IDSysCal.value)+ eval(sec80IBSysCal.value)+ eval(sec80IBASysCal.value)+
                eval(sec80JJASysCal.value)+eval(sec80JJAASysCal.value)+eval(sec80RRBSysCalc.value)+ eval(sec80QQBSysCalc.value);
dedPartCA.value=eval(sec80TTASysCalc.value)+eval(sec80USysCalc.value);



var dedVIA = document.getElementsByName('scheduleVIA.deductUndChapVIA.totalChapVIADeductions')[0];

var grossTotInc = document.getElementsByName('partBTI.grossTotalIncome')[0]; 
var incChrgable=document.getElementsByName('partBTI.incChargeTaxSplRate111A112')[0];
var deductionsUnder10Aor10AA = document.getElementsByName('partBTI.deductionsUnder10Aor10AA')[0]; 
var gtiLimit=eval(parseInt(coalesce(grossTotInc.value),10)-parseInt(coalesce(incChrgable.value),10)
					-parseInt(coalesce(deductionsUnder10Aor10AA.value),10));
var profGainSpecifiedBus = document.getElementsByName('partBTI.profBusGain.profGainSpecifiedBus')[0];
var gtiLimitC = zeroOrMore(parseInt(coalesce(gtiLimit),10) - parseInt(coalesce(profGainSpecifiedBus.value),10));

if(gtiLimit<0){
	gtiLimit=0;
}

dedPartB.value = Math.min(dedPartB.value, gtiLimit);
dedPartCA.value = Math.min(dedPartCA.value, gtiLimit);
dedPartC.value = Math.min(dedPartC.value, gtiLimitC);

var temp2 = eval(parseInt(dedPartB.value,10) + parseInt(dedPartCA.value,10) + parseInt(dedPartC.value,10));

if(coalesce(grossTotInc.value) > parseInt('0',10)){
	if( temp2 >  parseInt(coalesce(gtiLimit) ,10)){
		dedVIA.value = parseInt(coalesce(gtiLimit) ,10);
	} else{
		dedVIA.value = temp2;
	}
}else{
	dedVIA.value = temp2;
}

}

// Total Sum of deductions Without 80GG.
function sumDeductionsWithout80GG(sec80CSysCalc,sec80CCCSysCalc,sec80CCDiSysCalc,sec80CCD1BSysCalc,sec80CCDiiSysCalc,
	sec80DSysCalc,sec80DDSysCalc,sec80DDBSysCalc,sec80ESysCalc,sec80EESysCalc,sec80GSysCalc,sec80GGCSysCalc,sec80IBASysCal,
	sec80IASysCal,sec80IABSysCal,sec80IBSysCal,sec80ICSysCal,sec80IDSysCal,sec80JJASysCal,sec80JJAASysCal,
	sec80USysCalc,sec80CCGSysCalc,sec80RRBSysCalc,sec80QQBSysCalc,sec80TTASysCalc){

sec80CSysCalc.value = coalesce(sec80CSysCalc.value); 				sec80CCCSysCalc.value	= coalesce(sec80CCCSysCalc.value);
sec80CCDiSysCalc.value 	= coalesce(sec80CCDiSysCalc.value); 		
sec80CCD1BSysCalc.value 	= coalesce(sec80CCD1BSysCalc.value);          sec80CCDiiSysCalc.value = coalesce(sec80CCDiiSysCalc.value);
sec80DSysCalc.value = coalesce(sec80DSysCalc.value);				sec80JJASysCal.value = coalesce(sec80JJASysCal.value);
sec80DDSysCalc.value = coalesce(sec80DDSysCalc.value); 				sec80DDBSysCalc.value	= coalesce(sec80DDBSysCalc.value);
sec80ESysCalc.value = coalesce(sec80ESysCalc.value);                sec80JJAASysCal.value = coalesce(sec80JJAASysCal.value);
sec80GSysCalc.value 	= coalesce(sec80GSysCalc.value);			sec80EESysCalc.value = coalesce(sec80EESysCalc.value); 
sec80GGCSysCalc.value = coalesce(sec80GGCSysCalc.value); 			sec80USysCalc.value 	= coalesce(sec80USysCalc.value);
sec80CCGSysCalc.value = coalesce(sec80CCGSysCalc.value);			sec80RRBSysCalc.value 	= coalesce(sec80RRBSysCalc.value);
sec80QQBSysCalc.value = coalesce(sec80QQBSysCalc.value);			sec80TTASysCalc.value 	= coalesce(sec80TTASysCalc.value);
sec80IASysCal.value = coalesce(sec80IASysCal.value);                sec80IABSysCal.value = coalesce(sec80IABSysCal.value);
sec80ICSysCal.value = coalesce(sec80ICSysCal.value);                sec80IDSysCal.value = coalesce(sec80IDSysCal.value);
sec80IBSysCal.value = coalesce(sec80IBSysCal.value);				sec80IBASysCal.value = coalesce(sec80IBASysCal.value);

var dedPartB=document.getElementsByName('scheduleVIA.deductUndChapVIA.totalDeductionPartb')[0];
var dedPartC=document.getElementsByName('scheduleVIA.deductUndChapVIA.totalDeductionPartc')[0];
var dedPartCA=document.getElementsByName('scheduleVIA.deductUndChapVIA.totalDeductionPartca')[0];

dedPartB.value=eval(sec80CSysCalc.value) + eval(sec80CCCSysCalc.value) + eval(sec80CCDiiSysCalc.value) + eval(sec80CCD1BSysCalc.value) +
			eval(sec80CCDiSysCalc.value) + eval(sec80DSysCalc.value) +
			eval(sec80DDSysCalc.value) + eval(sec80DDBSysCalc.value) + eval(sec80ESysCalc.value) + eval(sec80EESysCalc.value) +
			eval(sec80GSysCalc.value)+eval(sec80CCGSysCalc.value)+eval(sec80GGCSysCalc.value);
dedPartC.value=  eval(sec80IASysCal.value)+ eval(sec80IABSysCal.value)+eval(sec80ICSysCal.value)+ eval(sec80IDSysCal.value)+ eval(sec80IBSysCal.value)+ eval(sec80IBASysCal.value)+
                eval(sec80JJASysCal.value)+eval(sec80JJAASysCal.value)+eval(sec80RRBSysCalc.value)+ eval(sec80QQBSysCalc.value);
dedPartCA.value=eval(sec80TTASysCalc.value)+eval(sec80USysCalc.value);

var dedVIA = document.getElementsByName('scheduleVIA.deductUndChapVIA.totalChapVIADeductions')[0];
var temp2 = eval(sec80CSysCalc.value) + eval(sec80CCCSysCalc.value) + eval(sec80CCDiiSysCalc.value) +  eval(sec80CCD1BSysCalc.value) +
			eval(sec80CCDiSysCalc.value) + eval(sec80DSysCalc.value) +
			eval(sec80DDSysCalc.value) + eval(sec80DDBSysCalc.value) + eval(sec80ESysCalc.value) + eval(sec80EESysCalc.value) +
			eval(sec80GSysCalc.value) + eval(sec80JJASysCal.value)+ eval(sec80JJAASysCal.value)+
			eval(sec80GGCSysCalc.value)+ eval(sec80USysCalc.value)+ eval(sec80CCGSysCalc.value)+ eval(sec80RRBSysCalc.value)+ 
			eval(sec80QQBSysCalc.value)+ eval(sec80TTASysCalc.value)+
			eval(sec80IASysCal.value)+ eval(sec80IABSysCal.value)+eval(sec80ICSysCal.value)+ eval(sec80IDSysCal.value)+ eval(sec80IBSysCal.value) + eval(sec80IBASysCal.value)
			;

var grossTotInc = document.getElementsByName('partBTI.grossTotalIncome')[0]; 
var incChrgable=document.getElementsByName('partBTI.incChargeTaxSplRate111A112')[0];
var deductionsUnder10Aor10AA = document.getElementsByName('partBTI.deductionsUnder10Aor10AA')[0]; 
var gtiLimit=eval(parseInt(coalesce(grossTotInc.value),10)-parseInt(coalesce(incChrgable.value),10)
					-parseInt(coalesce(deductionsUnder10Aor10AA.value),10));
var profGainSpecifiedBus = document.getElementsByName('partBTI.profBusGain.profGainSpecifiedBus')[0];
var gtiLimitC = zeroOrMore(parseInt(coalesce(gtiLimit),10) - parseInt(coalesce(profGainSpecifiedBus.value),10));

if(gtiLimit<0){
	gtiLimit=0;
}

dedPartB.value = Math.min(dedPartB.value, gtiLimit);
dedPartCA.value = Math.min(dedPartCA.value, gtiLimit);
dedPartC.value = Math.min(dedPartC.value, gtiLimitC);

if(coalesce(grossTotInc.value) > parseInt('0',10)){
	if( temp2 >  parseInt(coalesce(gtiLimit) ,10)){
		dedVIA.value = parseInt(coalesce(gtiLimit) ,10);
	} else{
		dedVIA.value = temp2;
	}
}else{
	dedVIA.value = temp2;
}

var totInc = document.getElementsByName('partBTI.totalIncome')[0];
totInc.value = eval(parseInt(coalesce(grossTotInc.value) ,10) - parseInt(coalesce(dedVIA.value) ,10));
}

// Calculate Total 80G Deductions.
function calcTotal80GDeductions (tableId,noOfRow,last,amt5BBC,amt5Ea)  {
 try {

		 	var grossTotalIncome = coalesce(document.getElementsByName('partBTI.grossTotalIncome')[0].value);
		 	var incChrgable= coalesce(document.getElementsByName('partBTI.incChargeTaxSplRate111A112')[0].value);
			var status = document.getElementsByName('partAGEN1.personalInfo.status')[0].value;
			var pan = document.getElementsByName('partAGEN1.personalInfo.pan')[0].value;
		 	
		 	
		 	if(parseInt(grossTotalIncome ,10)< 0){
		 		
		 		grossTotalIncome='0';
		 		
		 	}
		 	
		 	var residue50Perc;
		
			var usr80GG=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80GG')[0]; 
			usr80GG.value = coalesce(usr80GG.value);
			
			var ChapVIASumWithout80G80GG = ( parseInt(coalesce(document.getElementsByName('scheduleVIA.deductUndChapVIA.section80C')[0].value),10) +
											parseInt(coalesce(document.getElementsByName('scheduleVIA.deductUndChapVIA.section80CCC')[0].value),10) +
											parseInt(coalesce(document.getElementsByName('scheduleVIA.deductUndChapVIA.section80CCDi')[0].value),10) +
											parseInt(coalesce(document.getElementsByName('scheduleVIA.deductUndChapVIA.section80CCDii')[0].value),10) +
											parseInt(coalesce(document.getElementsByName('scheduleVIA.deductUndChapVIA.section80CCD1B')[0].value),10) +
											parseInt(coalesce(document.getElementsByName('scheduleVIA.deductUndChapVIA.section80CCG')[0].value),10) +
											parseInt(coalesce(document.getElementsByName('scheduleVIA.deductUndChapVIA.section80D')[0].value),10) +
											parseInt(coalesce(document.getElementsByName('scheduleVIA.deductUndChapVIA.section80DD')[0].value),10) +
											parseInt(coalesce(document.getElementsByName('scheduleVIA.deductUndChapVIA.section80DDB')[0].value),10) +
											parseInt(coalesce(document.getElementsByName('scheduleVIA.deductUndChapVIA.section80E')[0].value),10) +
											parseInt(coalesce(document.getElementsByName('scheduleVIA.deductUndChapVIA.section80EE')[0].value),10) +
											parseInt(coalesce(document.getElementsByName('scheduleVIA.deductUndChapVIA.section80GGC')[0].value),10) +
											parseInt(coalesce(document.getElementsByName('scheduleVIA.deductUndChapVIA.totalDeductionPartc')[0].value),10) +
											parseInt(coalesce(document.getElementsByName('scheduleVIA.deductUndChapVIA.totalDeductionPartca')[0].value),10)
											);
					

			var deductionsSysTotal=0;
			if((pan.substring(3,4)=='P' || pan.substring(3,4)=='p') && (status == 'I')) {
			deductionsSysTotal=zeroOrMore(eval(parseInt(ChapVIASumWithout80G80GG,10)+parseInt(usr80GG.value ,10)));
			} else {
			deductionsSysTotal=zeroOrMore(eval(parseInt(ChapVIASumWithout80G80GG,10)));
			}
			
			if(parseInt(deductionsSysTotal ,10)> parseInt(grossTotalIncome ,10)){
				
				deductionsSysTotal=grossTotalIncome;
			}
		
			var gtiLimit=eval(parseInt(coalesce(grossTotalIncome),10)-parseInt(coalesce(incChrgable),10)) ;
			
			if(gtiLimit<0){
				gtiLimit=0;
			}
			
			var tab = document.getElementById(tableId);
			var allInputTags = tab.getElementsByTagName('input');

			if ( tableId == 'ded100PerWithoutQual' ) {
				for(var i = 0; i < allInputTags.length; i++) {
					if (allInputTags[i].name.match("eligibleDonationAmt$")) {					
						allInputTags[i].value = coalesce(allInputTags[i - 1].value);
							if( parseInt(allInputTags[i].value,10) > parseInt(gtiLimit ,10)) {
								allInputTags[i].value = gtiLimit;
							}					
					}
				}
				calcTableTotEligAmt('ded100PerWithoutQual',qualifyingLimit,residue50Perc);
			}

			if ( tableId == 'ded50WithoutQual' ) {
				for(var i = 0; i < allInputTags.length; i++) {
					if (allInputTags[i].name.match("eligibleDonationAmt$")) {
		
						allInputTags[i].value = parseInt(Math.round(coalesce(allInputTags[i - 1].value)/2) , 10);
							if( parseInt(allInputTags[i].value ,10) > parseInt(gtiLimit ,10) ) {
								allInputTags[i].value = gtiLimit;
							}
						
					}
				}
				calcTableTotEligAmt('ded50WithoutQual',qualifyingLimit,residue50Perc);
			}


			//Net Qualifyin Limit calculation

			
			var adjstGTI;
			if(grossTotalIncome == eval(parseInt(ChapVIASumWithout80G80GG,10))){
				adjstGTI=0;
			}else{

				 adjstGTI = eval(parseInt(grossTotalIncome,10))-eval(parseInt(deductionsSysTotal,10))
		 			-eval(incChrgable) 
		 			+ parseInt(document.getElementsByName('scheduleSI.splCodeRateTax[0].splRateInc')[0].value)
		 			+ parseInt(coalesce(amt5BBC))
		 			+ parseInt(coalesce(amt5Ea));
				}

			
			var qualifyingLimit = eval(parseInt(adjstGTI ,10) * parseFloat('0.10'));
			

			if(parseInt(qualifyingLimit,10) <0){
				qualifyingLimit='0';
			}
			var totEligAmtTableC = document.getElementsByName('schedule80G.don100PercentApprReqd.totEligibleDon100PercentApprReqd')[0]; 

			if ( tableId == 'ded100Qual' ) {
				for(var i = 0; i < allInputTags.length; i++) {
					if (allInputTags[i].name.match("eligibleDonationAmt$")) {
						
						
						
					
						allInputTags[i].value = parseInt(Math.round(coalesce(allInputTags[i - 1].value)) , 10);
							if( parseInt(allInputTags[i].value ,10) > parseInt(qualifyingLimit , 10)) {
								allInputTags[i].value = parseInt(qualifyingLimit , 10);
							}
							
						
						
					}
				}
				calcTableTotEligAmt('ded100Qual',qualifyingLimit,residue50Perc);
			}

		
			var residue;
			if(parseInt(qualifyingLimit , 10) > parseInt(coalesce(totEligAmtTableC.value) , 10)) {

					residue = eval(parseInt(qualifyingLimit , 10)) -eval( parseInt(totEligAmtTableC.value , 10) );
				} else {
					residue = parseInt('0' ,10) ;
				}


			 residue50Perc = eval( parseInt(residue , 10) * parseFloat( '0.50' ));

			
			if ( tableId == 'ded50WithQual' ) {
				for(var i = 0; i < allInputTags.length; i++) {
					if (allInputTags[i].name.match("eligibleDonationAmt$")) {
						
					
						
						allInputTags[i].value = parseInt(Math.round(coalesce(allInputTags[i - 1].value)/2) , 10);
							if( parseInt(allInputTags[i].value ,10) > parseInt(residue50Perc , 10)) {
								allInputTags[i].value = parseInt(residue50Perc , 10);
						
							
						
						}
					}
				}
				calcTableTotEligAmt('ded50WithQual',qualifyingLimit,residue50Perc);
			}


		}
		catch (e) {
			alert ('Uma :- ' + e.stack);
		}

}

// Calculate Total Amount of Eligible Deductions.
function calcTableTotEligAmt(tableId,qualifyingLimit,residue50Perc){
try{

		var tab = document.getElementById(tableId);
		var allInputTags = tab.getElementsByTagName('input');
		var sumOfAll = parseInt('0' ,10);
		var sumOfAlluserEntredValue = parseInt('0' ,10);
			for(var i = 0; i < allInputTags.length; i++) {
				if (allInputTags[i].name.match("eligibleDonationAmt$")) {
					sumOfAll = eval ( parseInt(sumOfAll ,10) + parseInt( allInputTags[i].value ,10) );
					sumOfAlluserEntredValue = eval ( parseInt(sumOfAlluserEntredValue ,10) + parseInt( coalesce(allInputTags[i-1].value) ,10) );
				}
			}
		

		var grossTotalIncome = coalesce(document.getElementsByName('partBTI.grossTotalIncome')[0].value);
		
		if(parseInt(grossTotalIncome ,10)< 0){
	 		
	 		grossTotalIncome='0';
	 		
	 	}
		
		if( parseInt(sumOfAll ,10) > parseInt(grossTotalIncome ,10)) {
			sumOfAll = grossTotalIncome;
		}

	
		
		if(tableId == 'ded100PerWithoutQual'){
				var temp1 = document.getElementsByName('schedule80G.don100Percent.totEligibleDon100Percent')[0] ;
				var temp2 = document.getElementsByName('schedule80G.don100Percent.totDon100Percent')[0] ;

				temp1.value = parseInt(sumOfAll ,10);

				temp2.value = parseInt(sumOfAlluserEntredValue ,10);
				
				
			}
		else if(tableId == 'ded50WithoutQual'){
				var temp1 = document.getElementsByName('schedule80G.don50PercentNoApprReqd.totEligibleDon50Percent')[0] ;
				var temp2 = document.getElementsByName('schedule80G.don50PercentNoApprReqd.totDon50PercentNoApprReqd')[0] ;
				temp1.value = parseInt(sumOfAll ,10);
				temp2.value = parseInt(sumOfAlluserEntredValue ,10);
			}
		else if(tableId == 'ded100Qual'){
				var temp1 = document.getElementsByName('schedule80G.don100PercentApprReqd.totEligibleDon100PercentApprReqd')[0] ;
				var temp2 = document.getElementsByName('schedule80G.don100PercentApprReqd.totDon100PercentApprReqd')[0] ;
				temp1.value = parseInt(sumOfAll ,10);
				temp2.value = parseInt(sumOfAlluserEntredValue ,10);
				
				if(parseInt(temp1.value ,10) > parseInt(qualifyingLimit ,10)){
					
					temp1.value=parseInt(qualifyingLimit ,10);;
				}
				
		}
		else if(tableId == 'ded50WithQual'){

				var temp1 = document.getElementsByName('schedule80G.don50PercentApprReqd.totEligibleDon50PercentApprReqd')[0] ;
				var temp2 = document.getElementsByName('schedule80G.don50PercentApprReqd.totDon50PercentApprReqd')[0] ;

				temp1.value = parseInt(sumOfAll ,10);
				temp2.value = parseInt(sumOfAlluserEntredValue ,10);
				
				if(parseInt(temp1.value ,10) > parseInt(residue50Perc ,10)){
					
					temp1.value=parseInt(residue50Perc ,10);;
				}

		}

		calcTotalDonations80G();
		calcEligbDonations80G();
}catch(e){
	//alert(e);
}
}

// Calculate Total Donations for Schedule 80G.
function calcTotalDonations80G(){

	 var tot80GAuserEntrd =  document.getElementsByName('schedule80G.don100Percent.totDon100Percent')[0]; tot80GAuserEntrd.value = coalesce(tot80GAuserEntrd.value);
	 var tot80GBuserEntrd =  document.getElementsByName('schedule80G.don50PercentNoApprReqd.totDon50PercentNoApprReqd')[0]; tot80GBuserEntrd.value = coalesce(tot80GBuserEntrd.value);
	 var tot80GCuserEntrd =  document.getElementsByName('schedule80G.don100PercentApprReqd.totDon100PercentApprReqd')[0]; tot80GCuserEntrd.value = coalesce(tot80GCuserEntrd.value);
	 var tot80GDuserEntrd =  document.getElementsByName('schedule80G.don50PercentApprReqd.totDon50PercentApprReqd')[0]; tot80GDuserEntrd.value = coalesce(tot80GDuserEntrd.value);
	 var tot80GDonuserEntrd =  document.getElementsByName('schedule80G.totalDonationsUs80G')[0]; tot80GDonuserEntrd.value = coalesce(tot80GDonuserEntrd.value);

	 tot80GDonuserEntrd.value = eval(tot80GAuserEntrd.value)+ eval(tot80GBuserEntrd.value)+ eval(tot80GCuserEntrd.value)+ eval(tot80GDuserEntrd.value) ;

	}

// Calculate Eligible Donations for Schedule 80G.
function calcEligbDonations80G(){
	var grossTotalIncome = coalesce(document.getElementsByName('partBTI.grossTotalIncome')[0].value);
	var incChrgable= coalesce(document.getElementsByName('partBTI.incChargeTaxSplRate111A112')[0].value); 
	var gtiLimit=eval(parseInt(coalesce(grossTotalIncome),10)-parseInt(coalesce(incChrgable),10)) ;
	 var tot80GAelig =  document.getElementsByName('schedule80G.don100Percent.totEligibleDon100Percent')[0]; tot80GAelig.value = coalesce(tot80GAelig.value);
	 var tot80GBelig =  document.getElementsByName('schedule80G.don50PercentNoApprReqd.totEligibleDon50Percent')[0]; tot80GBelig.value = coalesce(tot80GBelig.value);
	 var tot80GCelig =  document.getElementsByName('schedule80G.don100PercentApprReqd.totEligibleDon100PercentApprReqd')[0]; tot80GCelig.value = coalesce(tot80GCelig.value);
	 var tot80GDelig =  document.getElementsByName('schedule80G.don50PercentApprReqd.totEligibleDon50PercentApprReqd')[0]; tot80GDelig.value = coalesce(tot80GDelig.value);
	 var tot80GDonelig =  document.getElementsByName('schedule80G.totalEligibleDonationsUs80G')[0]; tot80GDonelig.value = coalesce(tot80GDonelig.value);

	 tot80GDonelig.value = eval(tot80GAelig.value)+ eval(tot80GBelig.value)+ eval(tot80GCelig.value)+ eval(tot80GDelig.value) ;

	 if(tot80GDonelig.value> gtiLimit){
		 tot80GDonelig.value=gtiLimit;
	 }
}

// Calculate Total Sum for Section 80IA.
function calcTotal80IA(){
	
	var grossTotalIncome = coalesce(document.getElementsByName('partBTI.grossTotalIncome')[0].value);
	 
 	if(parseInt(grossTotalIncome ,10)< 0){
 		
 		grossTotalIncome='';
 		
 	}
	
	var table = document.getElementById('taxDed80IA4iiID');
		var rowCount = table.rows.length;
		var sumTotal80IAa=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80IAa = eval(parseInt(sumTotal80IAa,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80IAa['+i+']'),10));
		}
		
	var table = document.getElementById('taxDed80IA4iiiID');
		var rowCount = table.rows.length;
		var sumTotal80IAb=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80IAb = eval(parseInt(sumTotal80IAb,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80IAb['+i+']'),10));
		}
		
	var table = document.getElementById('taxDed80IA4ivID');
		var rowCount = table.rows.length;
		var sumTotal80IAc=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80IAc = eval(parseInt(sumTotal80IAc,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80IAc['+i+']'),10));
		}
		
	var table = document.getElementById('taxDed80IA4vID');
		var rowCount = table.rows.length;
		var sumTotal80IAd=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80IAd = eval(parseInt(sumTotal80IAd,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80IAd['+i+']'),10));
		}
		
		document.getElementsByName('schedule80IA.totSchedule80IA')[0].value=sumTotal80IAa+sumTotal80IAb+sumTotal80IAc+sumTotal80IAd;
	
}

// Calculate Total Sum for Section 80IB.
function calcTotal80IB(){

	var grossTotalIncome = coalesce(document.getElementsByName('partBTI.grossTotalIncome')[0].value);
	 
 	if(parseInt(grossTotalIncome ,10)< 0){
 		
 		grossTotalIncome='';
 		
 	}
	
	
	var table = document.getElementById('deductJKLocUs80IB4');
		var rowCount = table.rows.length;
		var sumTotal80IBa=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80IBa = eval(parseInt(sumTotal80IBa,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80IBa['+i+']'),10));
		}
	
	var table = document.getElementById('deductBackStatesUs80IB4');
		var rowCount = table.rows.length;
		var sumTotal80IBb=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80IBb = eval(parseInt(sumTotal80IBb,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80IBb['+i+']'),10));
		}
	
	var table = document.getElementById('deductBackDisttUs80IB5');
		var rowCount = table.rows.length;
		var sumTotal80IBc=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80IBc = eval(parseInt(sumTotal80IBc,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80IBc['+i+']'),10));
		}
	
	var table = document.getElementById('deductMultiplexUs80IB7A');
		var rowCount = table.rows.length;
		var sumTotal80IBd=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80IBd = eval(parseInt(sumTotal80IBd,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80IBd['+i+']'),10));
		}
	
	var table = document.getElementById('deductConvCentUs80IB7B');
		var rowCount = table.rows.length;
		var sumTotal80IBe=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80IBe = eval(parseInt(sumTotal80IBe,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80IBe['+i+']'),10));
		}
	
	var table = document.getElementById('deductMinOilUs80IB9');
		var rowCount = table.rows.length;
		var sumTotal80IBf=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80IBf = eval(parseInt(sumTotal80IBf,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80IBf['+i+']'),10));
		}
	
	var table = document.getElementById('deductHousUs80IB10');
		var rowCount = table.rows.length;
		var sumTotal80IBg=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80IBg = eval(parseInt(sumTotal80IBg,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80IBg['+i+']'),10));
		}
	
	var table = document.getElementById('deductColdChainUs80IB11');
		var rowCount = table.rows.length;
		var sumTotal80IBh=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80IBh = eval(parseInt(sumTotal80IBh,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80IBh['+i+']'),10));
		}
	
	var table = document.getElementById('deductFruitVegUs80IB11A');
		var rowCount = table.rows.length;
		var sumTotal80IBi=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80IBi = eval(parseInt(sumTotal80IBi,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80IBi['+i+']'),10));
		}
	
	var table = document.getElementById('deductFoodGrainUs80IB11A');
		var rowCount = table.rows.length;
		var sumTotal80IBj=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80IBj = eval(parseInt(sumTotal80IBj,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80IBj['+i+']'),10));
		}
	
	var table = document.getElementById('deductRurHospUs80IB11B');
		var rowCount = table.rows.length;
		var sumTotal80IBk=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80IBk = eval(parseInt(sumTotal80IBk,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80IBk['+i+']'),10));
		}
	
	var table = document.getElementById('deductHospAnyAreaUs80IB11C');
		var rowCount = table.rows.length;
		var sumTotal80IBl=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80IBl = eval(parseInt(sumTotal80IBl,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80IBl['+i+']'),10));
		}
	
	document.getElementsByName('schedule80IB.totSchedule80IB')[0].value=
	sumTotal80IBa+
	sumTotal80IBb+
	sumTotal80IBc+
	sumTotal80IBd+
	sumTotal80IBe+
	sumTotal80IBf+
	sumTotal80IBg+
	sumTotal80IBh+
	sumTotal80IBi+
	sumTotal80IBj+
	sumTotal80IBk+
	sumTotal80IBl;	


}

// Calculate total sum for Section 80-IC.
function calcTotal80IC(){
	var grossTotalIncome = coalesce(document.getElementsByName('partBTI.grossTotalIncome')[0].value);
	 
 	if(parseInt(grossTotalIncome ,10)< 0){
 		
 		grossTotalIncome='';
 		
 	}
	
	var table = document.getElementById('deductInSikkim');
		var rowCount = table.rows.length;
		var sumTotal80ICa=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80ICa = eval(parseInt(sumTotal80ICa,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80ICa['+i+']'),10));
		}
	var table = document.getElementById('deductInHimachalP');
		var rowCount = table.rows.length;
		var sumTotal80ICb=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80ICb = eval(parseInt(sumTotal80ICb,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80ICb['+i+']'),10));
		}
	var table = document.getElementById('deductInUttaranchal');
		var rowCount = table.rows.length;
		var sumTotal80ICc=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80ICc = eval(parseInt(sumTotal80ICc,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80ICc['+i+']'),10));
		}
	var table = document.getElementById('deductInNorthEastAassam');
		var rowCount = table.rows.length;
		var sumTotal80ICda=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80ICda = eval(parseInt(sumTotal80ICda,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80ICda['+i+']'),10));
		}
	var table = document.getElementById('deductInNorthEastArunachalPradesh');
		var rowCount = table.rows.length;
		var sumTotal80ICdb=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80ICdb = eval(parseInt(sumTotal80ICdb,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80ICdb['+i+']'),10));
		}
	var table = document.getElementById('deductInNorthEastManipur');
		var rowCount = table.rows.length;
		var sumTotal80ICdc=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80ICdc = eval(parseInt(sumTotal80ICdc,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80ICdc['+i+']'),10));
		}
	var table = document.getElementById('deductInNorthEastMizoram');
		var rowCount = table.rows.length;
		var sumTotal80ICdd=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80ICdd = eval(parseInt(sumTotal80ICdd,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80ICdd['+i+']'),10));
		}
	var table = document.getElementById('deductInNorthEastMeghalaya');
		var rowCount = table.rows.length;
		var sumTotal80ICde=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80ICde = eval(parseInt(sumTotal80ICde,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80ICde['+i+']'),10));
		}
	var table = document.getElementById('deductInNorthEastNagaland');
		var rowCount = table.rows.length;
		var sumTotal80ICdf=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80ICdf = eval(parseInt(sumTotal80ICdf,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80ICdf['+i+']'),10));
		}
	var table = document.getElementById('deductInNorthEastTripura');
		var rowCount = table.rows.length;
		var sumTotal80ICdg=0;
		for(var i=0;i<rowCount-2;i++){
			sumTotal80ICdg = eval(parseInt(sumTotal80ICdg,10) + parseInt(coalesceSetRet('schedule80.dedUs80Detail.dedFromUndertaking.80ICdg['+i+']'),10));
		}
	
	var totDeductInNorthEast=$('[name="schedule80IC.deductInNorthEast.totDeductInNorthEast"]')[0];

	totDeductInNorthEast.value=
	sumTotal80ICda+
	sumTotal80ICdb+
	sumTotal80ICdc+
	sumTotal80ICdd+
	sumTotal80ICde+
	sumTotal80ICdf+
	sumTotal80ICdg;
	
	
	document.getElementsByName('schedule80IC.totSchedule80IC')[0].value=
	sumTotal80ICa+
	sumTotal80ICb+
	sumTotal80ICc+
	sumTotal80ICda+
	sumTotal80ICdb+
	sumTotal80ICdc+
	sumTotal80ICdd+
	sumTotal80ICde+
	sumTotal80ICdf+
	sumTotal80ICdg;
	
}

// Populate Amounts for Schedule AMTC.
function populateAMTC(){
	try{
	var taxSec115JC=$('[name="itrScheduleAMTC.taxSection115JC"]')[0];
	var taxProvAct=$('[name="itrScheduleAMTC.taxOthProvision"]')[0];
	var amtCreditAvail=$('[name="itrScheduleAMTC.amtTaxCreditAvailable"]')[0];
	var partBttiTotalTax=$('[name="partBTTI.computationOfTaxLiability.taxPayableOnDeemedTI.totalTax"]')[0];
	var partBttiGrossTaxLiability=$('[name="partBTTI.computationOfTaxLiability.grossTaxLiability"]')[0];
	
	taxSec115JC.value=partBttiTotalTax.value;
	taxProvAct.value=partBttiGrossTaxLiability.value;
	
	if(eval(parseInt(coalesce(taxProvAct.value),10)) > eval(parseInt(coalesce(taxSec115JC.value),10))){
		
		amtCreditAvail.value=eval(parseInt(coalesce(taxProvAct.value),10))-eval(parseInt(coalesce(taxSec115JC.value),10));
	}else{
		amtCreditAvail.value=parseInt('0',10);
	}
	
	var amtCreditFwd=document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.amtCreditFwd')[0];
	amtCreditFwd.value = zeroOrMore(coalesce(taxSec115JC.value)-coalesce(taxProvAct.value));
	
	}catch(e){
		alert('error in populateAMTC:-' +e);
	}
}

// Populate Amounts for Schedule AMT.
function populateAMT(){
	
	var totIncomeTi=$('[name="partBTI.totalIncome"]')[0];
	var amtTotIncome=$('[name="itrScheduleAMT.totalIncItem11"]')[0];
	var deductClaimSec6A=$('[name="itrScheduleAMT.adjustmentSec115JC.deductClaimSec6A"]')[0];
	var deductClaimSec10AA=$('[name="itrScheduleAMT.adjustmentSec115JC.deductClaimSec10AA"]')[0];
	var deductClaimSec35AD=$('[name="itrScheduleAMT.adjustmentSec115JC.deductClaimSec35AD"]')[0];
	
	var sec115JCTotal=$('[name="itrScheduleAMT.adjustmentSec115JC.total"]')[0];
	var adjustedUnderSec115JC=$('[name="itrScheduleAMT.adjustedUnderSec115JC"]')[0];
	var taxPayableUnderSec115JC=$('[name="itrScheduleAMT.taxPayableUnderSec115JC"]')[0];
	
	var dedUnder10AA=$('[name="schedule10AA.deductSEZ.dedUs10Detail.totalDedUs10Sub"]')[0];
	
	var grossTotInc = document.getElementsByName('partBTI.grossTotalIncome')[0];
	var incChargeSplRate=document.getElementsByName('partBTI.incChargeTaxSplRate111A112')[0];
	var sec80IASysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80IA')[0]; 
	var sec80IABSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80IAB')[0]; 
	var sec80IBSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80IB')[0];
	var sec80IBASysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80IBA')[0];
	var sec80ICSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80IC')[0]; 
	var sec80IDSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80ID')[0]; 
	var sec80JJASysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80JJA')[0]; 
	var sec80JJAASysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80JJAA')[0]; 
	var sec80QQBSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80QQB')[0];
	var sec80RRBSysCal=document.getElementsByName('scheduleVIA.deductUndChapVIA.section80RRB')[0];
	
	
	/*	Total of Schedule AMT Change*/
	
	var partBTotal6 = document.getElementsByName('partBTI.totalTI')[0].value;
	var partBCurntYerLoss7 = document.getElementsByName('partBTI.currentYearLoss')[0].value;
	var partBbrtFwdLossSetOff9 = document.getElementsByName('partBTI.broughtFwdLossesSetoff')[0].value;
	var partBTotInc14 = document.getElementsByName('partBTI.totalIncome')[0].value;
	
	var schBPAProfBefTaxA1 = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.profBfrTaxPL')[0].value;
	var schBPnetProfLossSpecifiedBus2B = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.netProfLossSpecifiedBus')[0].value;
	var schBPdeductionUs35ADC46 = document.getElementsByName('itr4ScheduleBP.specifiedBusinessInc.deductionUs35AD')[0].value;
	var schBPpLFrmSpecifiedBus47 = document.getElementsByName('itr4ScheduleBP.specifiedBusinessInc.pLFrmSpecifiedBus')[0].value;
	
	/*	End*/
	
	var dedVIA=eval(parseInt(coalesce(sec80IASysCal.value),10))+eval(parseInt(coalesce(sec80IABSysCal.value),10))+eval(parseInt(coalesce(sec80IBSysCal.value),10))+eval(parseInt(coalesce(sec80IBASysCal.value),10))+
	eval(parseInt(coalesce(sec80ICSysCal.value),10))+eval(parseInt(coalesce(sec80IDSysCal.value),10))+eval(parseInt(coalesce(sec80JJASysCal.value),10))+ eval(parseInt(coalesce(sec80JJAASysCal.value),10))+
	eval(parseInt(coalesce(sec80QQBSysCal.value),10))+eval(parseInt(coalesce(sec80RRBSysCal.value),10));
    

        
      	var deductionsUnder10Aor10AA=document.getElementsByName('partBTI.deductionsUnder10Aor10AA')[0];
      	var profGainSpecifiedBus=document.getElementsByName('partBTI.profBusGain.profGainSpecifiedBus')[0];
	var gtiLimit=eval(parseInt(coalesce(grossTotInc.value),10)-parseInt(coalesce(incChargeSplRate.value),10)
						- parseInt(coalesce(deductionsUnder10Aor10AA.value),10)- parseInt(coalesce(profGainSpecifiedBus.value),10));
    if(gtiLimit < 0){gtiLimit=0;}
	if(eval(parseInt(coalesce(dedVIA),10)) > eval(parseInt(coalesce(gtiLimit),10))){
		dedVIA=gtiLimit;
	}
	
	
	if(partBTotal6 == 0 && partBCurntYerLoss7 == 0 && partBbrtFwdLossSetOff9 == 0 && partBTotInc14 == 0 && (schBPAProfBefTaxA1 == schBPnetProfLossSpecifiedBus2B) && schBPdeductionUs35ADC46 > 0 && schBPpLFrmSpecifiedBus47 < 0 ){
		amtTotIncome.value=schBPpLFrmSpecifiedBus47;
	}else{
		amtTotIncome.value=totIncomeTi.value;
	}
	
	deductClaimSec6A.value=dedVIA;
	
	var ded10A10AAAlwd = parseInt(coalesceSetRet('scheduleBFLA.busProfInclSpecProf.incBFLA.incOfCurYrAfterSetOffBFLosses'));
	
	deductClaimSec10AA.value=Math.min(dedUnder10AA.value,ded10A10AAAlwd);
	
	//2c=2a+2b
	sec115JCTotal.value=eval(parseInt(coalesce(deductClaimSec6A.value),10))+eval(parseInt(coalesce(deductClaimSec10AA.value),10))+eval(parseInt(coalesce(deductClaimSec35AD.value),10));
	//3=1+2c
	adjustedUnderSec115JC.value=returnZeroIfNegative(eval(parseInt(coalesce(amtTotIncome.value),10))+eval(parseInt(coalesce(sec115JCTotal.value),10)));
	//4
	
	
	
	if((eval(parseInt(coalesce(adjustedUnderSec115JC.value),10)) > eval('2000000'))
			&& (eval(parseInt(coalesce(sec115JCTotal.value),10)) >eval('0'))){
		
		taxPayableUnderSec115JC.value=Math.round((18.5 * eval(parseInt(
				coalesce(adjustedUnderSec115JC.value), 10))) / 100);
		
	}else{
		taxPayableUnderSec115JC.value=parseInt('0',10);
	}
	
	
}

// Calculate Total Amt for Schedule 5A.
function totAmtOfSched5A(){
	document.getElementsByName('schedule5A2014.totalHeadIncome.incRecvdUndHead')[0].value=eval(
		parseInt(coalesce(document.getElementsByName('schedule5A2014.hPHeadIncome.incRecvdUndHead')[0].value),10)+
                parseInt(coalesce(document.getElementsByName('schedule5A2014.busHeadIncome.incRecvdUndHead')[0].value),10)+    
		parseInt(coalesce(document.getElementsByName('schedule5A2014.capGainHeadIncome.incRecvdUndHead')[0].value),10)+
		parseInt(coalesce(document.getElementsByName('schedule5A2014.otherSourcesHeadIncome.incRecvdUndHead')[0].value),10));
	
	document.getElementsByName('schedule5A2014.totalHeadIncome.amtApprndOfSpouse')[0].value=eval(
			parseInt(coalesce(document.getElementsByName('schedule5A2014.hPHeadIncome.amtApprndOfSpouse')[0].value),10)+
                        parseInt(coalesce(document.getElementsByName('schedule5A2014.busHeadIncome.amtApprndOfSpouse')[0].value),10)+    
			parseInt(coalesce(document.getElementsByName('schedule5A2014.capGainHeadIncome.amtApprndOfSpouse')[0].value),10)+
			parseInt(coalesce(document.getElementsByName('schedule5A2014.otherSourcesHeadIncome.amtApprndOfSpouse')[0].value),10));
	
	document.getElementsByName('schedule5A2014.totalHeadIncome.amtTDSDeducted')[0].value=eval(
			parseInt(coalesce(document.getElementsByName('schedule5A2014.hPHeadIncome.amtTDSDeducted')[0].value),10)+
                        parseInt(coalesce(document.getElementsByName('schedule5A2014.busHeadIncome.amtTDSDeducted')[0].value),10)+    
			parseInt(coalesce(document.getElementsByName('schedule5A2014.capGainHeadIncome.amtTDSDeducted')[0].value),10)+
			parseInt(coalesce(document.getElementsByName('schedule5A2014.otherSourcesHeadIncome.amtTDSDeducted')[0].value),10));
	
	document.getElementsByName('schedule5A2014.totalHeadIncome.tDSApprndOfSpouse')[0].value=eval(
			parseInt(coalesce(document.getElementsByName('schedule5A2014.hPHeadIncome.tDSApprndOfSpouse')[0].value),10)+
                            parseInt(coalesce(document.getElementsByName('schedule5A2014.busHeadIncome.tDSApprndOfSpouse')[0].value),10)+
			parseInt(coalesce(document.getElementsByName('schedule5A2014.capGainHeadIncome.tDSApprndOfSpouse')[0].value),10)+
			parseInt(coalesce(document.getElementsByName('schedule5A2014.otherSourcesHeadIncome.tDSApprndOfSpouse')[0].value),10));
}

// Check if Schedule 5A is filled if Portugese Code is selected Y.
function checkSchedule5A(){
var hpIncome1 =document.getElementsByName('schedule5A2014.hPHeadIncome.incRecvdUndHead')[0].value;
var busHeadIncome1 =document.getElementsByName('schedule5A2014.hPHeadIncome.amtApprndOfSpouse')[0].value;
if(parseInt(busHeadIncome1,10) > parseInt(hpIncome1,10)){
	j.setFieldError('schedule5A2014.hPHeadIncome.amtApprndOfSpouse','Amount apportioned in the hands of the spouse in House Property cannot exceed Income received under the head');
		addErrorXHTML(document.getElementsByName('schedule5A2014.hPHeadIncome.amtApprndOfSpouse')[0],'Amount apportioned in the hands of the spouse in House Property cannot exceed Income received under the head',true);	
}

var hpIncome2 =document.getElementsByName('schedule5A2014.hPHeadIncome.amtTDSDeducted')[0].value;
var busHeadIncome2 =document.getElementsByName('schedule5A2014.hPHeadIncome.tDSApprndOfSpouse')[0].value;
if(parseInt(busHeadIncome2,10) > parseInt(hpIncome2,10)){
	j.setFieldError('schedule5A2014.hPHeadIncome.tDSApprndOfSpouse','TDS apportioned in the hands of spouse in House Property cannot exceed Amount of TDS deducted on income at (ii)');
		addErrorXHTML(document.getElementsByName('schedule5A2014.hPHeadIncome.tDSApprndOfSpouse')[0],'TDS apportioned in the hands of spouse in House Property cannot exceed Amount of TDS deducted on income at (ii)',true);	
}

var hpIncome3 =document.getElementsByName('schedule5A2014.busHeadIncome.incRecvdUndHead')[0].value;
var busHeadIncome3 =document.getElementsByName('schedule5A2014.busHeadIncome.amtApprndOfSpouse')[0].value;
if(parseInt(busHeadIncome3,10) > parseInt(hpIncome3,10)){
	j.setFieldError('schedule5A2014.busHeadIncome.amtApprndOfSpouse','Amount apportioned in the hands of the spouse in Business/Profession cannot exceed Income received under the head');
		addErrorXHTML(document.getElementsByName('schedule5A2014.busHeadIncome.amtApprndOfSpouse')[0],'Amount apportioned in the hands of the spouse in Business/Profession cannot exceed Income received under the head',true);	
}

var hpIncome4 =document.getElementsByName('schedule5A2014.busHeadIncome.amtTDSDeducted')[0].value;
var busHeadIncome4 =document.getElementsByName('schedule5A2014.busHeadIncome.tDSApprndOfSpouse')[0].value;
if(parseInt(busHeadIncome4,10) > parseInt(hpIncome4,10)){
	j.setFieldError('schedule5A2014.busHeadIncome.tDSApprndOfSpouse','TDS apportioned in the hands of spouse in Business/Profession cannot exceed Amount of TDS deducted on income at (ii)');
		addErrorXHTML(document.getElementsByName('schedule5A2014.busHeadIncome.tDSApprndOfSpouse')[0],'TDS apportioned in the hands of spouse in Business/Profession cannot exceed Amount of TDS deducted on income at (ii)',true);	
}

var hpIncome5 =document.getElementsByName('schedule5A2014.capGainHeadIncome.incRecvdUndHead')[0].value;
var busHeadIncome5 =document.getElementsByName('schedule5A2014.capGainHeadIncome.amtApprndOfSpouse')[0].value;
if(parseInt(busHeadIncome5,10) > parseInt(hpIncome5,10)){
	j.setFieldError('schedule5A2014.capGainHeadIncome.amtApprndOfSpouse','Amount apportioned in the hands of the spouse in Capital Gains cannot exceed Income received under the head');
		addErrorXHTML(document.getElementsByName('schedule5A2014.capGainHeadIncome.amtApprndOfSpouse')[0],'Amount apportioned in the hands of the spouse in Capital Gains cannot exceed Income received under the head',true);	
}

var hpIncome6 =document.getElementsByName('schedule5A2014.capGainHeadIncome.amtTDSDeducted')[0].value;
var busHeadIncome6 =document.getElementsByName('schedule5A2014.capGainHeadIncome.tDSApprndOfSpouse')[0].value;
if(parseInt(busHeadIncome6,10) > parseInt(hpIncome6,10)){
	j.setFieldError('schedule5A2014.capGainHeadIncome.tDSApprndOfSpouse','TDS apportioned in the hands of spouse in Capital Gains cannot exceed Amount of TDS deducted on income at (ii)');
		addErrorXHTML(document.getElementsByName('schedule5A2014.capGainHeadIncome.tDSApprndOfSpouse')[0],'TDS apportioned in the hands of spouse in Capital Gains cannot exceed Amount of TDS deducted on income at (ii)',true);	
}

var hpIncome7 =document.getElementsByName('schedule5A2014.otherSourcesHeadIncome.incRecvdUndHead')[0].value;
var busHeadIncome7 =document.getElementsByName('schedule5A2014.otherSourcesHeadIncome.amtApprndOfSpouse')[0].value;
if(parseInt(busHeadIncome7,10) > parseInt(hpIncome7,10)){
	j.setFieldError('schedule5A2014.otherSourcesHeadIncome.amtApprndOfSpouse','Amount apportioned in the hands of the spouse in Other sources cannot exceed Income received under the head');
		addErrorXHTML(document.getElementsByName('schedule5A2014.otherSourcesHeadIncome.amtApprndOfSpouse')[0],'Amount apportioned in the hands of the spouse in Other sources cannot exceed Income received under the head',true);	
}

var hpIncome8 =document.getElementsByName('schedule5A2014.otherSourcesHeadIncome.amtTDSDeducted')[0].value;
var busHeadIncome8 =document.getElementsByName('schedule5A2014.otherSourcesHeadIncome.tDSApprndOfSpouse')[0].value;
if(parseInt(busHeadIncome8,10) > parseInt(hpIncome8,10)){
	j.setFieldError('schedule5A2014.otherSourcesHeadIncome.tDSApprndOfSpouse','TDS apportioned in the hands of spouse in Other sources cannot exceed Amount of TDS deducted on income at (ii)');
		addErrorXHTML(document.getElementsByName('schedule5A2014.otherSourcesHeadIncome.tDSApprndOfSpouse')[0],'TDS apportioned in the hands of spouse in Other sources cannot exceed Amount of TDS deducted on income at (ii)',true);	
}

}

//To calculate the total amount of Schedule AL
/*function totAmtOfSchedAL(){
	var totalIncome = parseInt(coalesce(document.getElementsByName('partBTI.totalIncome')[0].value) ,10);
	if(totalIncome <= eval('5000000')){
		document.getElementsByName('scheduleAL.movableAsset.totalImmovablMovablAssets')[0].value=eval(
				coalesceSetRet('scheduleAL.immovableAssetLand')+
				coalesceSetRet('scheduleAL.immovableAssetBuilding')+
				coalesceSetRet('scheduleAL.movableAsset.depositsInBank')+
				coalesceSetRet('scheduleAL.movableAsset.sharesAndSecurities')+
				coalesceSetRet('scheduleAL.movableAsset.insurancePolicies')+
				coalesceSetRet('scheduleAL.movableAsset.loansAndAdvancesGiven')+
				coalesceSetRet('scheduleAL.movableAsset.cashInHand')+
				coalesceSetRet('scheduleAL.movableAsset.jewelleryBullionEtc')+
				coalesceSetRet('scheduleAL.movableAsset.archCollDrawPaintSulpArt')+
				coalesceSetRet('scheduleAL.movableAsset.vehiclYachtsBoatsAircrafts'));
		
		coalesceSetRet('scheduleAL.liabilityInRelatAssets');
	}else{
		document.getElementsByName('scheduleAL.movableAsset.totalImmovablMovablAssets')[0].value=eval(
				parseInt(coalesce(document.getElementsByName('scheduleAL.immovableAssetLand')[0].value),10)+
				parseInt(coalesce(document.getElementsByName('scheduleAL.immovableAssetBuilding')[0].value),10)+
				parseInt(coalesce(document.getElementsByName('scheduleAL.movableAsset.depositsInBank')[0].value),10)+
				parseInt(coalesce(document.getElementsByName('scheduleAL.movableAsset.sharesAndSecurities')[0].value),10)+
				parseInt(coalesce(document.getElementsByName('scheduleAL.movableAsset.insurancePolicies')[0].value),10)+
				parseInt(coalesce(document.getElementsByName('scheduleAL.movableAsset.loansAndAdvancesGiven')[0].value),10)+
				parseInt(coalesce(document.getElementsByName('scheduleAL.movableAsset.cashInHand')[0].value),10)+
				parseInt(coalesce(document.getElementsByName('scheduleAL.movableAsset.jewelleryBullionEtc')[0].value),10)+
				parseInt(coalesce(document.getElementsByName('scheduleAL.movableAsset.archCollDrawPaintSulpArt')[0].value),10)+
				parseInt(coalesce(document.getElementsByName('scheduleAL.movableAsset.vehiclYachtsBoatsAircrafts')[0].value),10));
	}
}*/

// Calculate TDS.
function calculateTDS(){
	
	var TDS = parseInt('0' ,10);
	var TDS1 = parseInt('0' ,10);
	var tab2 = document.getElementById('scheduleTDS1');
	var allInputTags = tab2.getElementsByTagName('input');
	
	for(var i = 0; i < allInputTags.length; i++) {
		if (allInputTags[i].name.match("totalTDSSal$")) {
			if(parseInt(allInputTags[i].value,10) >  parseInt(allInputTags[i-1].value,10) ){
				addError(allInputTags[i],'Total Tax deducted cannot exceed Income chargeable under Salaries',true);
				j.setFieldError(allInputTags[i].name,'Total Tax deducted cannot exceed Income chargeable under Salaries');
				allInputTags[i].value = '0';
				TDS1 = eval(parseInt(TDS1 ,10) + parseInt(isNVL(allInputTags[i].value) ,10));
				
			}else{
				TDS1 = eval(parseInt(TDS1 ,10) + parseInt(isNVL(allInputTags[i].value) ,10));
			}
		}
	}
	var TDS2 = parseInt('0' ,10);
	var tab2 = document.getElementById('scheduleTDS2');
	var allInputTags = tab2.getElementsByTagName('input');
	
	for(var i = 0; i < allInputTags.length; i++) {
		if (allInputTags[i].name.match("claimOwnHands$")) {
			if(eval(parseInt(coalesce(allInputTags[i].value),10)+parseInt(coalesce(allInputTags[i+1].value),10)) >  eval(parseInt(coalesce(allInputTags[i-1].value),10) + parseInt(coalesce(allInputTags[i-2].value),10))){
				addError(allInputTags[i],'Amount claimed for this year cannot be more than total tax deducted',true);
				j.setFieldError(allInputTags[i].name,'Amount claimed for this year cannot be more than total tax deducted');
				//allInputTags[i].value = '0';
				TDS2 = eval(parseInt(TDS2 ,10) + parseInt(isNVL(allInputTags[i].value) ,10));
			}else{
				TDS2 = eval(parseInt(TDS2 ,10) + parseInt(isNVL(allInputTags[i].value) ,10));
			}
			allInputTags[i+2].value = zeroOrMore(parseInt(coalesce(allInputTags[i-2].value)) + parseInt(coalesce(allInputTags[i-1].value))- parseInt(coalesce(allInputTags[i].value)) - parseInt(coalesce(allInputTags[i+1].value)));
		}
	}
	var TDS3 = parseInt('0' ,10);
	var tab3 = document.getElementById('scheduleTDS3');
	var allInputTagsTDS3 = tab3.getElementsByTagName('input');
	
	for(var i = 0; i < allInputTagsTDS3.length; i++) {
		if (allInputTagsTDS3[i].name.match("claimOwnHands$")) {
			if(eval(parseInt(coalesce(allInputTagsTDS3[i].value),10)+parseInt(coalesce(allInputTagsTDS3[i+1].value),10)) >  eval(parseInt(coalesce(allInputTagsTDS3[i-1].value),10) + parseInt(coalesce(allInputTagsTDS3[i-2].value),10))){
				addError(allInputTagsTDS3[i],'Amount claimed for this year cannot be more than total tax deducted',true);
				j.setFieldError(allInputTagsTDS3[i].name,'Amount claimed for this year cannot be more than total tax deducted');
				//allInputTagsTDS3[i].value = '0';
				TDS3 = eval(parseInt(TDS3 ,10) + parseInt(isNVL(allInputTagsTDS3[i].value) ,10));
			}else{
				TDS3 = eval(parseInt(TDS3 ,10) + parseInt(isNVL(allInputTagsTDS3[i].value) ,10));
			}
			allInputTagsTDS3[i+2].value = zeroOrMore(parseInt(coalesce(allInputTagsTDS3[i-2].value)) + parseInt(coalesce(allInputTagsTDS3[i-1].value))- parseInt(coalesce(allInputTagsTDS3[i].value)) - parseInt(coalesce(allInputTagsTDS3[i+1].value)));
		}
	}
	TDS=eval(parseInt(TDS1,10)+parseInt(TDS2,10)+parseInt(TDS3,10));
	document.getElementsByName('partBTTI.taxPaid.taxesPaid.tds')[0].value = parseInt(TDS,10);
	document.getElementsByName('itr4.scheduleTDS1.tdSonOthThanSal.totalTDSonSalaries')[0].value = parseInt(TDS1,10);
	document.getElementsByName('itr4.scheduleTDS2.tdSonOthThanSal.totalTDSonOthThanSals')[0].value = parseInt(TDS2,10);
	document.getElementsByName('itr4.scheduleTDS3.tdSonOthThanSal.totalTDS3OnOthThanSal')[0].value = parseInt(TDS3,10);
	
	return TDS;
}

// Calculate Total amount for Schedule PL.
function calculatePL()
{
	
	var tableOprtRevTableId = document.getElementById('oprtRevTableId');
	var rowCountOprtRevTableId = tableOprtRevTableId.rows.length;
	var sumTotalOprtRevTableId=0;
	for(var i=0;i<rowCountOprtRevTableId-3;i++){
		sumTotalOprtRevTableId = eval(parseInt(sumTotalOprtRevTableId,10) + 
										parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.otherOperatingRevenueDtls['+i+'].operatingRevenueAmt')[0].value),10));	
	}
	var totExciseCustomsVAT2 = document.getElementsByName('partapl.creditsToPL.operatingRevenueTotAmt')[0];
	totExciseCustomsVAT2.value = coalesce(totExciseCustomsVAT2.value);
	totExciseCustomsVAT2.value =parseInt(sumTotalOprtRevTableId,10) ;
	
	var businessReceipts = document.getElementsByName('partapl.creditsToPL.businessReceipts')[0];
	businessReceipts.value = coalesce(businessReceipts.value);
	businessReceipts.value= eval(
		parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.saleOfGoods')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.saleOfServices')[0].value,10))+
		parseInt(totExciseCustomsVAT2.value,10));
	
	var totExciseCustomsVAT = document.getElementsByName('partapl.creditsToPL.exciseCustomsVAT.totExciseCustomsVAT')[0];
	totExciseCustomsVAT.value = coalesce(totExciseCustomsVAT.value);
	totExciseCustomsVAT.value= eval(
		parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.exciseCustomsVAT.unionExciseDuty')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.exciseCustomsVAT.serviceTax')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.exciseCustomsVAT.vaTorSaleTax')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.exciseCustomsVAT.othDutyTaxCess')[0].value,10)));
	
	//Gross receipts from Profession starts
	var totGrossFromProfession = document.getElementsByName('partapl.creditsToPL.grossFromProfession')[0];
	totGrossFromProfession.value = coalesce(totGrossFromProfession.value);
	 //Gross receipts from Profession ends

	var totRevenueFrmOperations1= document.getElementsByName('partapl.creditsToPL.totRevenueFrmOperations')[0];
	totRevenueFrmOperations1.value = coalesce(totRevenueFrmOperations1.value);
	totRevenueFrmOperations1.value= eval(
		parseInt(totExciseCustomsVAT.value,10)+ parseInt(totGrossFromProfession.value,10)+
		parseInt(businessReceipts.value,10));
	
	var tableOthIncTableId = document.getElementById('othIncTableId');
	var rowCountOthIncTableId = tableOthIncTableId.rows.length;
	var sumTotalOthIncTableId=0;
	for(var i=0;i<rowCountOthIncTableId-3;i++){
		sumTotalOthIncTableId = eval(parseInt(sumTotalOthIncTableId,10) + 
										parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.othIncome.otherIncDtls['+i+'].amount')[0].value),10));	
	}
	var miscOthIncome = document.getElementsByName('partapl.creditsToPL.othIncome.miscOthIncome')[0];
	miscOthIncome.value = coalesce(miscOthIncome.value);
	miscOthIncome.value =parseInt(sumTotalOthIncTableId,10) ;
	
	
	var totOthIncome2 = document.getElementsByName('partapl.creditsToPL.othIncome.totOthIncome')[0];
	totOthIncome2.value = coalesce(totOthIncome2.value);
	totOthIncome2.value= eval(
		parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.othIncome.rentInc')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.othIncome.comissions')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.othIncome.dividends')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.othIncome.interestInc')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.othIncome.profitOnSaleFixedAsset')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.othIncome.profitOnInvChrSTT')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.othIncome.profitOnOthInv')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.othIncome.profitOnCurrFluct')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.othIncome.profitOnAgriIncome')[0].value,10))+		
		parseInt(miscOthIncome.value,10));
	
	var closingStock3= document.getElementsByName('partapl.creditsToPL.closingStockDtls.closingStock')[0];
	closingStock3.value = coalesce(closingStock3.value);
	closingStock3.value= eval(
		parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.closingStockDtls.rawMaterial')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.closingStockDtls.workInProgress')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.closingStockDtls.finishedGoods')[0].value,10)));
	
	var totCreditsToPL4= document.getElementsByName('partapl.creditsToPL.totCreditsToPL')[0];
	totCreditsToPL4.value = coalesce(totCreditsToPL4.value);
	totCreditsToPL4.value= eval(
		parseInt(totRevenueFrmOperations1.value,10)+
		parseInt(totOthIncome2.value,10)+
		parseInt(closingStock3.value,10));
	
	
	
	var openingStock5= document.getElementsByName('partapl.debitsToPL.debitPlAcnt.openingStockDtls.openingStock')[0];
	openingStock5.value = coalesce(openingStock5.value);
	openingStock5.value= eval(
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.openingStockDtls.rawMaterial')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.openingStockDtls.workInProgress')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.openingStockDtls.finishedGoods')[0].value,10)));
	
	var totExciseCustomsVAT7= document.getElementsByName('partapl.debitsToPL.debitPlAcnt.dutyTaxPay.exciseCustomsVAT.totExciseCustomsVAT')[0];
	totExciseCustomsVAT7.value = coalesce(totExciseCustomsVAT7.value);
	totExciseCustomsVAT7.value= eval(
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.dutyTaxPay.exciseCustomsVAT.customDuty')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.dutyTaxPay.exciseCustomsVAT.counterVailDuty')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.dutyTaxPay.exciseCustomsVAT.splAddDuty')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.dutyTaxPay.exciseCustomsVAT.unionExciseDuty')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.dutyTaxPay.exciseCustomsVAT.serviceTax')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.dutyTaxPay.exciseCustomsVAT.vaTorSaleTax')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.dutyTaxPay.exciseCustomsVAT.othDutyTaxCess')[0].value,10)));
	
	
	var totEmployeeComp14xi= document.getElementsByName('partapl.debitsToPL.debitPlAcnt.employeeComp.totEmployeeComp')[0];
	totEmployeeComp14xi.value = coalesce(totEmployeeComp14xi.value);
	totEmployeeComp14xi.value= eval(
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.employeeComp.salsWages')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.employeeComp.bonus')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.employeeComp.medExpReimb')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.employeeComp.leaveEncash')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.employeeComp.leaveTravelBenft')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.employeeComp.contToSuperAnnFund')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.employeeComp.contToPF')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.employeeComp.contToGratFund')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.employeeComp.contToOthFund')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.employeeComp.othEmpBenftExpdr')[0].value,10)));
	
	
	var totInsurances15= document.getElementsByName('partapl.debitsToPL.debitPlAcnt.insurances.totInsurances')[0];
	totInsurances15.value = coalesce(totInsurances15.value);
	totInsurances15.value= eval(
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.insurances.medInsur')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.insurances.lifeInsur')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.insurances.keyManInsur')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.insurances.othInsur')[0].value,10)));
		
		
	var total22= document.getElementsByName('partapl.debitsToPL.debitPlAcnt.commissionExpdrDtls.total')[0];
	total22.value = coalesce(total22.value);
	total22.value= eval(
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.commissionExpdrDtls.nonResOtherCompany')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.commissionExpdrDtls.others')[0].value,10)));
	
	
	var total23= document.getElementsByName('partapl.debitsToPL.debitPlAcnt.royalityDtls.total')[0];
	total23.value = coalesce(total23.value);
	total23.value= eval(
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.royalityDtls.nonResOtherCompany')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.royalityDtls.others')[0].value,10)));
	
	
	var total24= document.getElementsByName('partapl.debitsToPL.debitPlAcnt.professionalConstDtls.total')[0];
	total24.value = coalesce(total24.value);
	total24.value= eval(
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.professionalConstDtls.nonResOtherCompany')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.professionalConstDtls.others')[0].value,10)));
	
	
	var totExciseCustomsVAT36= document.getElementsByName('partapl.debitsToPL.debitPlAcnt.ratesTaxesPays.exciseCustomsVAT.totExciseCustomsVAT')[0];
	totExciseCustomsVAT36.value = coalesce(totExciseCustomsVAT36.value);
	totExciseCustomsVAT36.value= eval(
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.ratesTaxesPays.exciseCustomsVAT.unionExciseDuty')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.ratesTaxesPays.exciseCustomsVAT.serviceTax')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.ratesTaxesPays.exciseCustomsVAT.vaTorSaleTax')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.ratesTaxesPays.exciseCustomsVAT.cess')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.ratesTaxesPays.exciseCustomsVAT.othDutyTaxCess')[0].value,10)));
		
	var tableExpPLTableId = document.getElementById('othExpPLTableId');
	var rowCountExpPLTableId = tableExpPLTableId.rows.length;
	var sumTotalExpPLTableId=0;
	for(var i=0;i<rowCountExpPLTableId-3;i++){
		sumTotalExpPLTableId = eval(parseInt(sumTotalExpPLTableId,10) + 
										parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.otherExpensesDtls['+i+'].amount')[0].value),10));	
	}
	var otherExpenses38 = document.getElementsByName('partapl.debitsToPL.debitPlAcnt.otherExpenses')[0];
	otherExpenses38.value = coalesce(otherExpenses38.value);
	otherExpenses38.value =parseInt(sumTotalExpPLTableId,10) ;
	
	
	var tablebadDebtPL = document.getElementById('badDebtPL');
	var rowCountbadDebtPL = tablebadDebtPL.rows.length;
	var sumTotalbadDebtPL39=0;
	for(var i=0;i<rowCountbadDebtPL-2;i++){
		sumTotalbadDebtPL39 = eval(parseInt(sumTotalbadDebtPL39,10) + 
										parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.badDebtDtls.badDebtAmtDtls['+i+'].amount')[0].value),10));	
	}
	
	
	var badDebt39 = document.getElementsByName('partapl.debitsToPL.debitPlAcnt.badDebtDtls.badDebt')[0];
	badDebt39.value = coalesce(badDebt39.value);
	badDebt39.value= eval(
		parseInt(sumTotalbadDebtPL39,10)+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.badDebtDtls.othersWherePANNotAvlble')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.badDebtDtls.othersAmtLt1Lakh')[0].value,10)));

	
	var pbidta42 = document.getElementsByName('partapl.debitsToPL.debitPlAcnt.pbidta')[0];
	pbidta42.value = coalesce(pbidta42.value);
	pbidta42.value= eval(
		parseInt(totCreditsToPL4.value,10)-(
		parseInt(openingStock5.value,10)+
		parseInt(totExciseCustomsVAT7.value,10)+

		parseInt(totEmployeeComp14xi.value,10)+

		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.purchases')[0].value,10))+

		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.freight')[0].value,10))+

		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.consumptionOfStores')[0].value,10))+

		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.powerFuel')[0].value,10))+

		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.rentExpdr')[0].value,10))+

		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.repairsBldg')[0].value,10))+

		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.repairMach')[0].value,10))+

		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.staffWelfareExp')[0].value,10))+

		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.entertainment')[0].value,10))+

		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.hospitality')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.conference')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.salePromoExp')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.advertisement')[0].value,10))+
		parseInt(totInsurances15.value,10)+
		parseInt(total22.value,10)+
		parseInt(total23.value,10)+
		parseInt(total24.value,10)+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.hotelBoardLodge')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.travelExp')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.foreignTravelExp')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.conveyanceExp')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.telephoneExp')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.guestHouseExp')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.clubExp')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.festivalCelebExp')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.scholarship')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.gift')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.donation')[0].value,10))+
		parseInt(totExciseCustomsVAT36.value,10)+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.auditFee')[0].value,10))+
		parseInt(otherExpenses38.value,10)+
		parseInt(badDebt39.value,10)+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.provForBadDoubtDebt')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.othProvisionsExpdr')[0].value,10))));
	
	
	var interestExpdr43 = document.getElementsByName('partapl.debitsToPL.debitPlAcnt.interestExpdrtDtls.interestExpdr')[0];
	interestExpdr43.value = coalesce(interestExpdr43.value);
	interestExpdr43.value= eval(
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.interestExpdrtDtls.nonResOtherCompany')[0].value,10))+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.interestExpdrtDtls.others')[0].value,10)));
	
	var pbt45 = document.getElementsByName('partapl.debitsToPL.debitPlAcnt.pbt')[0];
	pbt45.value = coalesce(pbt45.value);
	pbt45.value= eval(
		parseInt(pbidta42.value,10)-parseInt(interestExpdr43.value,10)-
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.debitPlAcnt.depreciationAmort')[0].value,10)));
	
	
	var profitAfterTax48 = document.getElementsByName('partapl.debitsToPL.taxProvAppr.profitAfterTax')[0];
	profitAfterTax48.value = coalesce(profitAfterTax48.value);
	profitAfterTax48.value= eval(
		parseInt(pbt45.value,10)-
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.taxProvAppr.provForCurrTax')[0].value,10))-
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.taxProvAppr.provDefTax')[0].value,10)));
	
	var amtAvlAppr50 = document.getElementsByName('partapl.debitsToPL.taxProvAppr.amtAvlAppr')[0];
	amtAvlAppr50.value = coalesce(amtAvlAppr50.value);
	amtAvlAppr50.value= eval(
		parseInt(profitAfterTax48.value,10)+
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.taxProvAppr.balBFPrevYr')[0].value,10)));
	
	var partnerAccBalTrf52 = document.getElementsByName('partapl.debitsToPL.taxProvAppr.partnerAccBalTrf')[0];
	partnerAccBalTrf52.value = coalesce(partnerAccBalTrf52.value);
	partnerAccBalTrf52.value= eval(
		parseInt(amtAvlAppr50.value,10)-
		parseInt(coalesce(document.getElementsByName('partapl.debitsToPL.taxProvAppr.trfToReserves')[0].value,10)));
	
	//53(i)d
	document.getElementsByName('partapl.noBooksOfAccPL.netProfit')[0].value = eval(
			parseInt(coalesce(document.getElementsByName('partapl.noBooksOfAccPL.grossProfit')[0].value),10)-
			parseInt(coalesce(document.getElementsByName('partapl.noBooksOfAccPL.expenses')[0].value),10));
	
	//53(ii)d
	document.getElementsByName('partapl.noBooksOfAccPL.netProfitProfession')[0].value = eval(
			parseInt(coalesce(document.getElementsByName('partapl.noBooksOfAccPL.grossProfitProfession')[0].value),10)-
			parseInt(coalesce(document.getElementsByName('partapl.noBooksOfAccPL.expensesProfession')[0].value),10));
	
	// Total (53(i)d + 53(ii)d)
	document.getElementsByName('partapl.noBooksOfAccPL.totalNetProfit')[0].value = eval(
			parseInt(coalesce(document.getElementsByName('partapl.noBooksOfAccPL.netProfit')[0].value),10)+
			parseInt(coalesce(document.getElementsByName('partapl.noBooksOfAccPL.netProfitProfession')[0].value),10));
	
}

// Calculate Amount for Schedule ESR.
function calcSchESRFor4() {
	
	  var amtDebPL1i = document.getElementsByName('scheduleESR.deductionUs35.section351I.deductUs35.amtDebPL')[0];						coalesceSetRet('scheduleESR.deductionUs35.section351I.deductUs35.amtDebPL');
	    var amtUs35Allowable1i = document.getElementsByName('scheduleESR.deductionUs35.section351I.deductUs35.amtUs35Allowable')[0];		coalesceSetRet('scheduleESR.deductionUs35.section351I.deductUs35.amtUs35Allowable');
	    var excessAmtOverDebPL1i = document.getElementsByName('scheduleESR.deductionUs35.section351I.deductUs35.excessAmtOverDebPL')[0];	coalesceSetRet('scheduleESR.deductionUs35.section351I.deductUs35.excessAmtOverDebPL');

	    var amtDebPL1ii = document.getElementsByName('scheduleESR.deductionUs35.section351Ii.deductUs35.amtDebPL')[0];						coalesceSetRet('scheduleESR.deductionUs35.section351Ii.deductUs35.amtDebPL');
	    var amtUs35Allowable1ii = document.getElementsByName('scheduleESR.deductionUs35.section351Ii.deductUs35.amtUs35Allowable')[0]; 		coalesceSetRet('scheduleESR.deductionUs35.section351Ii.deductUs35.amtUs35Allowable');
	    var excessAmtOverDebPL1ii = document.getElementsByName('scheduleESR.deductionUs35.section351Ii.deductUs35.excessAmtOverDebPL')[0];	coalesceSetRet('scheduleESR.deductionUs35.section351Ii.deductUs35.excessAmtOverDebPL');
		
		var amtDebPL1iia = document.getElementsByName('scheduleESR.deductionUs35.section351Iia.deductUs35.amtDebPL')[0];						coalesceSetRet('scheduleESR.deductionUs35.section351Iia.deductUs35.amtDebPL');
	    var amtUs35Allowable1iia = document.getElementsByName('scheduleESR.deductionUs35.section351Iia.deductUs35.amtUs35Allowable')[0]; 		coalesceSetRet('scheduleESR.deductionUs35.section351Iia.deductUs35.amtUs35Allowable');
	    var excessAmtOverDebPL1iia = document.getElementsByName('scheduleESR.deductionUs35.section351Iia.deductUs35.excessAmtOverDebPL')[0];	coalesceSetRet('scheduleESR.deductionUs35.section351Iia.deductUs35.excessAmtOverDebPL');

	    var amtDebPL1iii = document.getElementsByName('scheduleESR.deductionUs35.section351Iii.deductUs35.amtDebPL')[0];					coalesceSetRet('scheduleESR.deductionUs35.section351Iii.deductUs35.amtDebPL');
	    var amtUs35Allowable1iii = document.getElementsByName('scheduleESR.deductionUs35.section351Iii.deductUs35.amtUs35Allowable')[0];	coalesceSetRet('scheduleESR.deductionUs35.section351Iii.deductUs35.amtUs35Allowable');
	    var excessAmtOverDebPL1iii = document.getElementsByName('scheduleESR.deductionUs35.section351Iii.deductUs35.excessAmtOverDebPL')[0];coalesceSetRet('scheduleESR.deductionUs35.section351Iii.deductUs35.excessAmtOverDebPL');

	    var amtDebPL1iiv = document.getElementsByName('scheduleESR.deductionUs35.section351Iv.deductUs35.amtDebPL')[0];						coalesceSetRet('scheduleESR.deductionUs35.section351Iv.deductUs35.amtDebPL');
	    var amtUs35Allowable1iiv = document.getElementsByName('scheduleESR.deductionUs35.section351Iv.deductUs35.amtUs35Allowable')[0];		coalesceSetRet('scheduleESR.deductionUs35.section351Iv.deductUs35.amtUs35Allowable');
	    var excessAmtOverDebPL1iv = document.getElementsByName('scheduleESR.deductionUs35.section351Iv.deductUs35.excessAmtOverDebPL')[0];	coalesceSetRet('scheduleESR.deductionUs35.section351Iv.deductUs35.excessAmtOverDebPL');

	    var amtDebPL2AA = document.getElementsByName('scheduleESR.deductionUs35.section352AA.deductUs35.amtDebPL')[0];						coalesceSetRet('scheduleESR.deductionUs35.section352AA.deductUs35.amtDebPL');
	    var amtUs35Allowable2AA = document.getElementsByName('scheduleESR.deductionUs35.section352AA.deductUs35.amtUs35Allowable')[0];		coalesceSetRet('scheduleESR.deductionUs35.section352AA.deductUs35.amtUs35Allowable');
	    var excessAmtOverDebPL2AA = document.getElementsByName('scheduleESR.deductionUs35.section352AA.deductUs35.excessAmtOverDebPL')[0];	coalesceSetRet('scheduleESR.deductionUs35.section352AA.deductUs35.excessAmtOverDebPL');

	    var amtDebPL2AB = document.getElementsByName('scheduleESR.deductionUs35.section352AB.deductUs35.amtDebPL')[0];						coalesceSetRet('scheduleESR.deductionUs35.section352AB.deductUs35.amtDebPL');
	    var amtUs35Allowable2AB = document.getElementsByName('scheduleESR.deductionUs35.section352AB.deductUs35.amtUs35Allowable')[0];		coalesceSetRet('scheduleESR.deductionUs35.section352AB.deductUs35.amtUs35Allowable');
	    var excessAmtOverDebPL2AB = document.getElementsByName('scheduleESR.deductionUs35.section352AB.deductUs35.excessAmtOverDebPL')[0];	coalesceSetRet('scheduleESR.deductionUs35.section352AB.deductUs35.excessAmtOverDebPL');
		
		var amtDebPLCCC = document.getElementsByName('scheduleESR.deductionUs35.section35CCC.deductUs35.amtDebPL')[0];						coalesceSetRet('scheduleESR.deductionUs35.section35CCC.deductUs35.amtDebPL');
	    var amtUs35AllowableCCC = document.getElementsByName('scheduleESR.deductionUs35.section35CCC.deductUs35.amtUs35Allowable')[0];		coalesceSetRet('scheduleESR.deductionUs35.section35CCC.deductUs35.amtUs35Allowable');
	    var excessAmtOverDebPLCCC = document.getElementsByName('scheduleESR.deductionUs35.section35CCC.deductUs35.excessAmtOverDebPL')[0];	coalesceSetRet('scheduleESR.deductionUs35.section35CCC.deductUs35.excessAmtOverDebPL');
		
		var amtDebPLCCD = document.getElementsByName('scheduleESR.deductionUs35.section35CCD.deductUs35.amtDebPL')[0];						coalesceSetRet('scheduleESR.deductionUs35.section35CCD.deductUs35.amtDebPL');
	    var amtUs35AllowableCCD = document.getElementsByName('scheduleESR.deductionUs35.section35CCD.deductUs35.amtUs35Allowable')[0];		coalesceSetRet('scheduleESR.deductionUs35.section35CCD.deductUs35.amtUs35Allowable');
	    var excessAmtOverDebPLCCD = document.getElementsByName('scheduleESR.deductionUs35.section35CCD.deductUs35.excessAmtOverDebPL')[0];	coalesceSetRet('scheduleESR.deductionUs35.section35CCD.deductUs35.excessAmtOverDebPL');

	    var amtDebPLTot = document.getElementsByName('scheduleESR.deductionUs35.totUs35.deductUs35.amtDebPL')[0];							coalesceSetRet('scheduleESR.deductionUs35.totUs35.deductUs35.amtDebPL');
	    var amtUs35AllowableTot = document.getElementsByName('scheduleESR.deductionUs35.totUs35.deductUs35.amtUs35Allowable')[0];			coalesceSetRet('scheduleESR.deductionUs35.totUs35.deductUs35.amtUs35Allowable');
	    var excessAmtOverDebPL1iTot = document.getElementsByName('scheduleESR.deductionUs35.totUs35.deductUs35.excessAmtOverDebPL')[0];		coalesceSetRet('scheduleESR.deductionUs35.totUs35.deductUs35.excessAmtOverDebPL');

	    excessAmtOverDebPL1i.value = eval(parseInt(amtUs35Allowable1i.value,10)) - eval(parseInt(amtDebPL1i.value,10));
	    if(eval(excessAmtOverDebPL1i.value,10) < 0){
	     excessAmtOverDebPL1i.value =  parseInt(0,10);
	    }

	    excessAmtOverDebPL1ii.value = eval(parseInt(amtUs35Allowable1ii.value,10)) - eval(parseInt(amtDebPL1ii.value,10));
	    if(eval(excessAmtOverDebPL1ii.value,10) < 0){
	     excessAmtOverDebPL1ii.value =  parseInt(0,10);
	    }
	
		excessAmtOverDebPL1iia.value = eval(parseInt(amtUs35Allowable1iia.value,10)) - eval(parseInt(amtDebPL1iia.value,10));
	    if(eval(excessAmtOverDebPL1iia.value,10) < 0){
	     excessAmtOverDebPL1iia.value =  parseInt(0,10);
	    }

	    excessAmtOverDebPL1iii.value = eval(parseInt(amtUs35Allowable1iii.value,10)) - eval(parseInt(amtDebPL1iii.value,10));
	    if(eval(excessAmtOverDebPL1iii.value,10) < 0){
	     excessAmtOverDebPL1iii.value =  parseInt(0,10);
	    }

	    excessAmtOverDebPL1iv.value = eval(parseInt(amtUs35Allowable1iiv.value,10)) - eval(parseInt(amtDebPL1iiv.value,10));
	    if(eval(excessAmtOverDebPL1iv.value,10) < 0){
	     excessAmtOverDebPL1iv.value =  parseInt(0,10);
	    }

	    excessAmtOverDebPL2AA.value = eval(parseInt(amtUs35Allowable2AA.value,10)) - eval(parseInt(amtDebPL2AA.value,10));
	    if(eval(excessAmtOverDebPL2AA.value,10) < 0){
	     excessAmtOverDebPL2AA.value =  parseInt(0,10);
	    }

	    excessAmtOverDebPL2AB.value = eval(parseInt(amtUs35Allowable2AB.value,10)) - eval(parseInt(amtDebPL2AB.value,10));
	    if(eval(excessAmtOverDebPL2AB.value,10) < 0){
	     excessAmtOverDebPL2AB.value =  parseInt(0,10);
	    }

		excessAmtOverDebPLCCC.value = eval(parseInt(amtUs35AllowableCCC.value,10)) - eval(parseInt(amtDebPLCCC.value,10));
	    if(eval(excessAmtOverDebPLCCC.value,10) < 0){
	     excessAmtOverDebPLCCC.value =  parseInt(0,10);
	    }
		
		excessAmtOverDebPLCCD.value = eval(parseInt(amtUs35AllowableCCD.value,10)) - eval(parseInt(amtDebPLCCD.value,10));
	    if(eval(excessAmtOverDebPLCCD.value,10) < 0){
	     excessAmtOverDebPLCCD.value =  parseInt(0,10);
	    }
		
	    amtDebPLTot.value = eval(parseInt(amtDebPL1i.value,10)) + eval(parseInt(amtDebPL1ii.value,10))+ eval(parseInt(amtDebPL1iia.value,10))+ eval(parseInt(amtDebPL1iii.value,10))+ eval(parseInt(amtDebPL1iiv.value,10))+ eval(parseInt(amtDebPL2AA.value,10))+ eval(parseInt(amtDebPL2AB.value,10))+ eval(parseInt(amtDebPLCCC.value,10))+ eval(parseInt(amtDebPLCCD.value,10));
	    amtUs35AllowableTot.value = eval(parseInt(amtUs35Allowable1i.value,10)) + eval(parseInt(amtUs35Allowable1ii.value,10))+ eval(parseInt(amtUs35Allowable1iia.value,10))+ eval(parseInt(amtUs35Allowable1iii.value,10))+ eval(parseInt(amtUs35Allowable1iiv.value,10))+ eval(parseInt(amtUs35Allowable2AA.value,10))+ eval(parseInt(amtUs35Allowable2AB.value,10))+ eval(parseInt(amtUs35AllowableCCC.value,10))+ eval(parseInt(amtUs35AllowableCCD.value,10));
	    excessAmtOverDebPL1iTot.value = eval(parseInt(excessAmtOverDebPL1i.value,10)) + eval(parseInt(excessAmtOverDebPL1ii.value,10))+ eval(parseInt(excessAmtOverDebPL1iia.value,10))+ eval(parseInt(excessAmtOverDebPL1iii.value,10))+ eval(parseInt(excessAmtOverDebPL1iv.value,10))+ eval(parseInt(excessAmtOverDebPL2AA.value,10))+ eval(parseInt(excessAmtOverDebPL2AB.value,10))+ eval(parseInt(excessAmtOverDebPLCCC.value,10))+ eval(parseInt(excessAmtOverDebPLCCD.value,10));
	    
	
}

// Calculate Advance Tax.
function calculateAdvancedTax(){
	var advanceTax = parseInt('0' ,10) ;
	var selfAssessmentTax = parseInt('0' ,10) ;
	var tab3 = document.getElementById('scheduleIt');
	var allInputTags = tab3.getElementsByTagName('input');
	for(var i = 0; i < allInputTags.length; i++) {
		if(allInputTags[i].name.match("dateDep$")){
			if(checkFirstDateBefore('01/04/2016' , allInputTags[i].value) && checkFirstDateBefore(allInputTags[i].value , '31/03/2017')){
					advanceTax = eval( parseInt(isNVL(advanceTax) ,10) + parseInt(isNVL(allInputTags[i+2].value) ,10));
				}else if( checkFirstDateBefore(FY_start_date , allInputTags[i].value)){
					selfAssessmentTax = eval(parseInt(isNVL(selfAssessmentTax) ,10) + parseInt(isNVL(allInputTags[i+2].value) ,10)) ;
				}
		}
	}
	document.getElementsByName('partBTTI.taxPaid.taxesPaid.advanceTax')[0].value = advanceTax;
	document.getElementsByName('partBTTI.taxPaid.taxesPaid.selfAssessmentTax')[0].value = selfAssessmentTax;
	return advanceTax;
	}

// Check Return filed under section.
function revisedSetFor6(section, type) {
	  var fileSec=document.getElementsByName(section)[0].value;
	    var fileType=document.getElementsByName(type)[0];

		if(fileSec=='17' && fileType.value!='R'){

			
			document.getElementsByName(type)[0].value='R';
			document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].value='';
			document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].value='';
			document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].disabled=false;
			document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].disabled=false;

			document.getElementsByName("partAGEN1.filingStatus.noticeNo")[0].value='';
			document.getElementsByName("partAGEN1.filingStatus.noticeNo")[0].disabled=true;
			
	       } else if(fileSec=='19'){
	                document.getElementsByName(type)[0].value='O';
		        document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].value='';
			document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].value='';
			document.getElementsByName("partAGEN1.filingStatus.noticeDateUnderSec")[0].value='';
			document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].disabled=false;
			document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].disabled=false;
			document.getElementsByName("partAGEN1.filingStatus.noticeDateUnderSec")[0].disabled=false;
		   
	       }else if(fileSec=='18'){
	                document.getElementsByName(type)[0].value='O';
		        document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].value='';
			document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].value='';
			document.getElementsByName("partAGEN1.filingStatus.noticeDateUnderSec")[0].value='';
			document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].disabled=false;
			document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].disabled=false;
			document.getElementsByName("partAGEN1.filingStatus.noticeDateUnderSec")[0].disabled=false;
			document.getElementsByName("partAGEN1.filingStatus.noticeNo")[0].disabled=false;
		   
	       }else if(fileSec !='17' || fileType.value!='R'){
	    	   
			document.getElementsByName(type)[0].value='O';
			 document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].value='';
			 document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].value='';
			document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].disabled=true;
			document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].disabled=true;
	       }
	       if(fileSec=='18') {
	                document.getElementsByName("partAGEN1.filingStatus.noticeNo")[0].disabled=false;
			document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].disabled=false;
			document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].disabled=false;
	       }else{
	               document.getElementsByName("partAGEN1.filingStatus.noticeNo")[0].value='';
	               document.getElementsByName("partAGEN1.filingStatus.noticeNo")[0].disabled=true;
	       }
	       
	       if(fileSec=='13' || fileSec=='14' || fileSec=='15' || fileSec=='16' || fileSec=='18' || fileSec=='19'){
			enableField('partAGEN1.filingStatus.returnFileSec',fileSec,'partAGEN1.filingStatus.noticeDateUnderSec');
	       }
	       
	       else if(fileSec=='11' || fileSec=='12' || fileSec=='17' || fileSec=='20'){
	    	   
			document.getElementsByName("partAGEN1.filingStatus.noticeDateUnderSec")[0].value='';
	        document.getElementsByName("partAGEN1.filingStatus.noticeDateUnderSec")[0].disabled=true;
	       }
	       
	       
	       if(fileSec=='11' || fileSec=='12' || fileSec=='13' || fileSec=='14' || fileSec=='15' || fileSec=='16'){
			document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].value='';
			document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].value='';
			document.getElementsByName("partAGEN1.filingStatus.noticeNo")[0].value='';
	                document.getElementsByName("partAGEN1.filingStatus.noticeNo")[0].disabled=true;
			document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].disabled=true;
			document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].disabled=true;
	      }

}

//Check Return filed under section.
function sectionSetFor6(section,type){
    var fileSec=document.getElementsByName(section)[0].value;
    var fileType=document.getElementsByName(type)[0];

	if(fileSec=='17' && fileType.value!='R'){

		document.getElementsByName(type)[0].value='R';
		
		document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].disabled=false;
		document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].disabled=false;

		document.getElementsByName("partAGEN1.filingStatus.noticeNo")[0].value='';
		document.getElementsByName("partAGEN1.filingStatus.noticeNo")[0].disabled=true;
		
       }
	   else if(fileSec=='19'){
	   document.getElementsByName(type)[0].value='O';
			document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].disabled=false;
			document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].disabled=false;
	   
	   }
	   else if(fileSec=='18'){
	   document.getElementsByName(type)[0].value='O';
			document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].disabled=false;
			document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].disabled=false;
	   
	   }
       else if(fileSec !='17' || fileType.value!='R'){
		   document.getElementsByName(type)[0].value='O';
			document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].disabled=true;
			document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].disabled=true;
       }
           if(fileSec=='18') {
               document.getElementsByName("partAGEN1.filingStatus.noticeNo")[0].disabled=false;
				document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].disabled=false;
				document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].disabled=false;
           } else {
               document.getElementsByName("partAGEN1.filingStatus.noticeNo")[0].value='';
               document.getElementsByName("partAGEN1.filingStatus.noticeNo")[0].disabled=true;


           }
		   if(fileSec=='13' || fileSec=='14' || fileSec=='15' || fileSec=='16' || fileSec=='18' || fileSec=='19'){
		      enableField('partAGEN1.filingStatus.returnFileSec',fileSec,
		'partAGEN1.filingStatus.noticeDateUnderSec'
		);
		   }else{
		   document.getElementsByName("partAGEN1.filingStatus.noticeDateUnderSec")[0].value='';
               document.getElementsByName("partAGEN1.filingStatus.noticeDateUnderSec")[0].disabled=true;
		   }
}

// Function to adjust Form.
function adjustForm(){
		enableField('partAGEN1.filingStatus.asseseeRepFlg','Y',
		'partAGEN1.filingStatus.assesseeRep.repName',
		'partAGEN1.filingStatus.assesseeRep.repAddress',
		'partAGEN1.filingStatus.assesseeRep.repPAN'
		);

		enableField('partAGEN2.auditInfo.liableSec44ABflg','Y',
				'partAGEN2.auditInfo.auditAcctflg',
				'scheduleVIA.usrDeductUndChapVIA.section80JJAA'
		);	
		
		enableField('partAGEN2.liableSec92Eflg','Y',
				'partAGEN2.sec92Edate'
		);	
		
		enableField('partAGEN2.auditInfo.auditAcctflg','Y',
		'partAGEN2.auditInfo.auditReportFurnishDate',
		'partAGEN2.auditInfo.auditorName',
		'partAGEN2.auditInfo.auditorMemNo',
		'partAGEN2.auditInfo.audFrmName',
		'partAGEN2.auditInfo.audFrmRegno',
		'partAGEN2.auditInfo.audFrmPAN',
		'partAGEN2.auditInfo.auditDate'
		);
		
		enableField('partAGEN1.filingStatus.residentialStatus',['RES',''],'partBTTI.assetOutIndiaFlag');
		
		
		enableField('scheduleTR1.taxPaidOutsideIndFlg','YES',
				'scheduleTR1.amtTaxRefunded',
				'scheduleTR1.assmtYrTaxRelief'
				);
		enableField('partAGEN1.filingStatus.residentialStatus','NRI',
				'partAGEN1.filingStatus.assesseeRep.permanentEstablishment'
				);
		enableField('partAGEN1.filingStatus.residentialStatus',['RES','NOR'],
				'itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44AD',
				'itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44ADA'
				);
		enableField('partAGEN1.filingStatus.residentialStatus',['RES','NOR'],
				'itr4ScheduleBP.businessIncOthThanSpec.incRecCredPLOthHeads.us115BBF',
				'itr4ScheduleBP.businessIncOthThanSpec.expDebToPLOthHeads.us115BBF'
				);
		
		
		adjustTDS2();
		adjustCG();
		adjustOS();
}

// Calculate Tax for Schedule TDS2.
function adjustTDS2(){
	var tab = document.getElementById('scheduleTDS2');
	var inputs = tab.getElementsByTagName('INPUT');
        var tab3=document.getElementById('scheduleTDS3');
        var inputs3 = tab3.getElementsByTagName('INPUT');
	var portCode = document.getElementsByName('partAGEN1.filingStatus.portugeseCC5A')[0].value;
	for(var i=0;i<inputs.length;i++){
		if(inputs[i].name.match('claimSpouseHands$')){
			if(portCode=='Y'){
				inputs[i].disabled = false;
			}else{
				inputs[i].disabled = true;
				inputs[i].value = '';
			}
		}
	}
        
        
        for(var k=0;k<inputs3.length;k++){
		if(inputs3[k].name.match('claimSpouseHands$')){
			if(portCode=='Y'){
				inputs3[k].disabled = false;
			}else{
				inputs3[k].disabled = true;
				inputs3[k].value = '';
			}
		}
	}
}

// Adjust Schedule OS.
function adjustOS() {
	var tabl = document.getElementById('schduleOsf');
	
	var allSelects = tabl.getElementsByTagName('SELECT');
	
	for(var i = 0; i < allSelects.length; i++) {	
			var name = allSelects[i].name;
			var index = name.substring(name.indexOf('[')+1, name.indexOf(']'));
			if(allSelects[i].value=='Others'){
				document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ index +'].otherDesc')[0].style.display='';
			} else {
				document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ index +'].otherDesc')[0].style.display='none';
				document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ index +'].otherDesc')[0].value='';
			}
	}
}

// Adjust Schedule CG.
function adjustCG() {
	
	var ben115HFlg = document.getElementsByName('partAGEN1.filingStatus.benefitUs115HFlg')[0].value;
	
	enableTable('scheduleCGPost45.LongTermCapGainPost45.unutilizedCapgainFlag','Y','scheduleLtcgunUtilizedCapGain54');
	enableTableWithOutCB('scheduleCGPost45.LongTermCapGainPost45.unutilizedCapgainFlag','Y','scheduleLtcgunUtilizedCapGain54B');
	enableTable('scheduleCGPost45.shortTermCapGainPost45.unutilizedCapgainFlag','Y','scheduleStcgunUtilizedCapGain54');
	enableTableWithOutCB('scheduleCGPost45.shortTermCapGainPost45.unutilizedCapgainFlag','Y','scheduleStcgunUtilizedCapGain54B');
	enableNRItables();
	
	if(document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0].value=='NRI' || ben115HFlg == 'Y'){
		//A3
		document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRITransacSec48Dtl.nRItaxSTTPaid')[0].readOnly=false;
		document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRITransacSec48Dtl.nRItaxSTTNotPaid')[0].readOnly=false;
		//A4
		document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.fullConsideration')[0].readOnly=false;
		document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.deductSec48.aquisitCost')[0].readOnly=false;
		document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.deductSec48.improveCost')[0].readOnly=false;
		document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.deductSec48.expOnTrans')[0].readOnly=false;
		document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.lossSec94of7Or94of8')[0].readOnly=false;
		document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.deductSec48.aquisitCost')[0].readOnly=false;

		//B4
		document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIProvisoSec48.ltcgWithoutBenefit')[0].readOnly=false;
		document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIProvisoSec48.exemptionOrDednUs54')[0].readOnly=false;

		
		//B5
		var tab = document.getElementById('stcg10pctTab'); 
		var inputs = tab.getElementsByTagName('INPUT');
		var selects =  tab.getElementsByTagName('SELECT'); 
		for(var i=0;i<inputs.length;i++){
			if(!(inputs[i].classList.contains("readonly"))){
				inputs[i].readOnly=false;
			}
		}
		for(var i=0;i<selects.length;i++){
			if( !(selects[i].classList.contains("readonly"))){
				selects[i].disabled=false;
			}
		}			
		
		//B6
		document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.saleonSpecAsset')[0].readOnly=false;
		document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.dednSpecAssetus115')[0].readOnly=false;
		document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.saleOtherSpecAsset')[0].readOnly=false;
		document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.dednOtherSpecAssetus115')[0].readOnly=false;
		
		//B4
		
		tab = document.getElementById('scheduleCGltcg4_ded1'); 
		inputs = tab.getElementsByTagName('INPUT');
		selects =  tab.getElementsByTagName('SELECT'); 
		for(var i=0;i<inputs.length;i++){
			if(!(inputs[i].classList.contains("readonly"))){
				inputs[i].readOnly=false;
			}
		}
		for(var i=0;i<selects.length;i++){
			if( !(selects[i].classList.contains("readonly"))){
				selects[i].disabled=false;
			}
		}			
		
		document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIProvisoSec48.exemptionOrDednUs54')[0].readOnly=true;
		
	}else{
		//A3
		var nRItaxSTTPaid = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRITransacSec48Dtl.nRItaxSTTPaid')[0];
		nRItaxSTTPaid.readOnly=true;
		nRItaxSTTPaid.value = 0;
		
		var nRItaxSTTNotPaid = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRITransacSec48Dtl.nRItaxSTTNotPaid')[0];
		nRItaxSTTNotPaid.readOnly=true;
		nRItaxSTTNotPaid.value = 0;
		
		//A4
		var fullConsideration = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.fullConsideration')[0];
		fullConsideration.readOnly=true;
		fullConsideration.value = 0;
		var aquisitCost = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.deductSec48.aquisitCost')[0];
		aquisitCost.readOnly=true;
		aquisitCost.value = 0;
		var improveCost = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.deductSec48.improveCost')[0];
		improveCost.readOnly=true;
		improveCost.value = 0;
		var expOnTrans = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.deductSec48.expOnTrans')[0];
		expOnTrans.readOnly=true;
		expOnTrans.value = 0;
		var lossSec94of7Or94of8 = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.lossSec94of7Or94of8')[0];
		lossSec94of7Or94of8.readOnly=true;
		lossSec94of7Or94of8.value = 0;
		var aquisitCost = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.deductSec48.aquisitCost')[0];
		aquisitCost.readOnly=true;
		aquisitCost.value = 0;

		//B4
		var ltcgWithoutBenefit = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIProvisoSec48.ltcgWithoutBenefit')[0];
		ltcgWithoutBenefit.readOnly=true;
		ltcgWithoutBenefit.value = 0;
		var exemptionOrDednUs54 = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIProvisoSec48.exemptionOrDednUs54')[0];
		exemptionOrDednUs54.readOnly=true;
		exemptionOrDednUs54.value = 0;

		
		//B5
		var tab = document.getElementById('stcg10pctTab');
		var inputs = tab.getElementsByTagName('INPUT');
		var selects =  tab.getElementsByTagName('SELECT');
		for(var i=0;i<inputs.length;i++){
			if(!inputs[i].classList.contains("readonly")){
				inputs[i].readOnly=true;
				inputs[i].value = '';
			}
		}
		for(var i=0;i<selects.length;i++){
			if(!selects[i].classList.contains("readonly")){
				selects[i].disabled=true;
				selects[i].selectedIndex=0;
			}
		}			
		
		//B6
		var saleonSpecAsset = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.saleonSpecAsset')[0];
		saleonSpecAsset.readOnly=true;
		saleonSpecAsset.value=0;
		var dednSpecAssetus115 = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.dednSpecAssetus115')[0];
		dednSpecAssetus115.readOnly=true;
		dednSpecAssetus115.value=0;
		var saleOtherSpecAsset = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.saleOtherSpecAsset')[0];
		saleOtherSpecAsset.readOnly=true;
		saleOtherSpecAsset.value=0;
		var dednOtherSpecAssetus115 = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.dednOtherSpecAssetus115')[0];
		dednOtherSpecAssetus115.readOnly=true;
		dednOtherSpecAssetus115.value=0;
		
		//B4
		var tab = document.getElementById('scheduleCGltcg4_ded1');
		var inputs = tab.getElementsByTagName('INPUT');
		var selects =  tab.getElementsByTagName('SELECT');
		
		$("#scheduleCGltcg4_ded1 input").attr("checked" , true);
	    deleteRowTable('scheduleCGltcg4_ded1',1,2);
		$("#scheduleCGltcg4_ded1 input").attr("checked" , false);
		
		for(var i=0;i<inputs.length;i++){
			if(!inputs[i].classList.contains("readonly")){
				inputs[i].readOnly=true;
				inputs[i].value = '';
			}
		}
		for(var i=0;i<selects.length;i++){
			if(!selects[i].classList.contains("readonly")){
				selects[i].disabled=true;
				selects[i].selectedIndex=0;
			}
		}		
	}
}

//Enable Tables if NRI is Selected in PART-A Filing Status.
function enableNRItables(){
	var resStatus =document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0].value;
	if(resStatus == "NRI"){
	 enableTableForNRI('partAGEN1.filingStatus.residentialStatus','NRI','scheduleStcgDtaa');
	 enableTableForNRI('partAGEN1.filingStatus.residentialStatus','NRI','scheduleLtcgDtaa');
	 enableTableForNRI('partAGEN1.filingStatus.residentialStatus','NRI','scheduleOsNriIncTaxDtaa');
}else{
	enableOSTableFor115H('partAGEN1.filingStatus.benefitUs115HFlg','Y','scheduleStcgDtaa');
	enableOSTableFor115H('partAGEN1.filingStatus.benefitUs115HFlg','Y','scheduleLtcgDtaa');
	enableOSTableFor115H('partAGEN1.filingStatus.benefitUs115HFlg','Y','scheduleOsNriIncTaxDtaa');
}
}

// enable Fields.
function enableField(src,val,targets){ 
	var srcField = document.getElementsByName(src)[0];
	if(contains(val,srcField.value)){
		for(var i=2;i<arguments.length; i++){	
			var targetField = document.getElementsByName(arguments[i])[0];		
				targetField.disabled= false;
				targetField.readOnly=false;
		}
	}else{
		for(var i=2;i<arguments.length; i++){
			var targetField = document.getElementsByName(arguments[i])[0];		
			if(targetField.type=='select-one'){
				targetField.selectedIndex = 0;
			}else{
				targetField.value='';
			}
			targetField.disabled= true;
			targetField.readOnly=true;
		}	
	}
	
}

function contains(arr, val){
	if(arr.constructor.name=="Array"){
		for(var i=0;i<arr.length; i++){
			if(arr[i]==val){
				return true;
			}
		}
		return false;
	}else{
		return (arr==val);
	}
}

// Function to enable / disable fields on Change of Status.
function onStatusChange() {
	var gender = document.getElementsByName('partAGEN1.personalInfo.gender')[0];
	var genderdisplay = gender.value;
	var status = document.getElementsByName('partAGEN1.personalInfo.status')[0];
	var portugeseCC5A = document
			.getElementsByName('partAGEN1.filingStatus.portugeseCC5A')[0];
	if (status.value == 'I') {
		for (var i = 0; gender.options.length > 0; i++) {
			gender.options.remove(0);
		}
		gender.options[0] = new Option('Select', '');
		gender.options[1] = new Option('Male', 'M');
		gender.options[2] = new Option('Female', 'F');
		gender.options[3] = new Option('Transgender', 'T');
		gender.disabled = false;

		if (genderdisplay == 'F' || genderdisplay == 'M'|| genderdisplay == 'T') {
			gender.value = genderdisplay;
		}

		document.getElementsByName('partAGEN1.filingStatus.portugeseCC5A')[0].disabled = false;
		if (portugeseCC5A.value == "") {
			portugeseCC5A.value = 'N';
		}
		document.getElementsByName('partAGEN1.personalInfo.aadhaarEnrolmentId')[0].disabled = false;
		document.getElementsByName('partAGEN1.personalInfo.adharNumber')[0].disabled = false;

		document
				.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80DUsrType')[0].disabled = false;
	} else if (status.value == 'H') {
		for (var i = 0; gender.options.length > 0; i++) {
			gender.options.remove(0);
		}
		gender.options[0] = new Option('Not Applicable', 'X');
		gender.options[0].selected = true;
		gender.disabled = true;

		document.getElementsByName('partAGEN1.filingStatus.portugeseCC5A')[0].value = '';
		document.getElementsByName('partAGEN1.filingStatus.portugeseCC5A')[0].disabled = true;

		document.getElementsByName('partAGEN1.personalInfo.adharNumber')[0].value = '';
		document.getElementsByName('partAGEN1.personalInfo.adharNumber')[0].disabled = true;

		document.getElementsByName('partAGEN1.personalInfo.aadhaarEnrolmentId')[0].value = '';
		document.getElementsByName('partAGEN1.personalInfo.aadhaarEnrolmentId')[0].disabled = true;

		document
				.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80DUsrType')[0].value = '';
		document
				.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80DUsrType')[0].disabled = true;
	} else if (status.value == '') {

		for (var i = 0; gender.options.length > 0; i++) {
			gender.options.remove(0);
		}
		gender.options[0] = new Option('Select', '');
		gender.options[1] = new Option('Male', 'M');
		gender.options[2] = new Option('Female', 'F');
		gender.options[3] = new Option('Transgender', 'T');
		gender.options[4] = new Option('Not Applicable', 'X');
		gender.options[0].selected = true;
		gender.disabled = false;
		document.getElementsByName('partAGEN1.filingStatus.portugeseCC5A')[0].disabled = false;
		if (portugeseCC5A.value == "") {
			portugeseCC5A.value = 'N';
		}
		document.getElementsByName('partAGEN1.personalInfo.aadhaarEnrolmentId')[0].disabled = false;
		document.getElementsByName('partAGEN1.personalInfo.adharNumber')[0].disabled = false;

		document
				.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80DUsrType')[0].disabled = false;
	}
	onChngPCC5A();
	disableSchedule5A();
}

//Function to enable / disable fields on Change of Gender.
function onGenderChange(){
	var gender = document.getElementsByName('partAGEN1.personalInfo.gender')[0];
	var status = document.getElementsByName('partAGEN1.personalInfo.status')[0];
	if(gender.value == 'X'){
		status.options[2].selected = true;
	}else if(gender.value == 'F' || gender.value == 'M'|| gender.value == 'T'){
		status.options[1].selected = true;
	}
}

// Check Portugese Code selected is Y.
function onChngPCC5A(){
	var typeHP = document.getElementsByName('partAGEN1.filingStatus.portugeseCC5A')[0].value;
	if(typeHP=='Y'){
		addErrorXHTML('','You have selected to be governed by Sec 5A. Please enter only your share of  Income from'+
		'House Property and Income from Other Sources.Refer to instructions (A22) for further clarification');
	}
	adjustTDS2();
}

// delete Row for Schedule SI.
function deleteRowToTableScheduleSI(tableId,noOfRow,last){

	deleteRowTableModified(tableId,noOfRow,last);
	calcScheduleSI();

}

// Validate PAN.
function panStatusCheck(){

var status = document.getElementsByName('partAGEN1.personalInfo.status')[0].value;
var pan = document.getElementsByName('partAGEN1.personalInfo.pan')[0].value;

if((pan.substring(3,4)=='P' || pan.substring(3,4)=='p') && (status == 'I')){
		document.getElementsByName('verification.declaration.assesseeVerPAN')[0].value=document.getElementsByName('partAGEN1.personalInfo.pan')[0].value.toUpperCase();
		} else {
	document.getElementsByName('verification.declaration.assesseeVerPAN')[0].value="";
		}

if((pan.substring(3,4)=='P' || pan.substring(3,4)=='p') && (status == 'H')){
		addErrorXHTML('' ,'Since PAN entered is Individual PAN, Select Status as Individual');	
		j.setFieldError('partAGEN1.personalInfo.pan','Since PAN entered is Individual PAN, Select Status as Individual');
		} else if((pan.substring(3,4)=='H' || pan.substring(3,4)=='h') && (status == 'I')){
	addErrorXHTML('' ,'Since PAN entered is HUF PAN, Select Status as HUF');	
	j.setFieldError('partAGEN1.personalInfo.pan','Since PAN entered is HUF PAN, Select Status as HUF');
	}

}

// On Change of State Code.
function onStateChng(){
	try{
		var state = document.getElementsByName('partAGEN1.personalInfo.address.stateCode')[0];
		var country = document.getElementsByName('partAGEN1.personalInfo.address.country')[0];
		var pinCode = document.getElementsByName('partAGEN1.personalInfo.address.pinCode')[0];
		
		if(state.value != '99' && state.value != '-1'){
			country.value='91';
			pinCode.value='';
			$('.country').selectmenu('refresh', true);
		}else if(state.value == '99'){
			pinCode.value='999999';
		}
	}catch(e){
		alert(e.stack);
	}	
}

// Add Row to Schedule TR.
function addRowSchedTR(tableId,noOfRow,last){

	addRowToTable(tableId,noOfRow,last);
	totAmtOfSchedTRFor6 (tableId);

}

// Delete Row from Schedule TR.
function delRowSchedTR(tableId,noOfRow,last){

	deleteRowTable(tableId,noOfRow,last);
	totAmtOfSchedTRFor6 (tableId);

}

// Function to check if Schedule FA is Mandatory.
function checkSchFAMandatory() {
    
    	var table1 = checkRowBlank('schFADtlsFrignAssets', 2, 1);
		var table2 = checkRowBlank('schFADtlsFinIntrest', 2, 1);
		var table3 = checkRowBlank('schFADtlsImmvbleProp', 2, 1);
		var table4 = checkRowBlank('schFADtlsOtherAsset', 2, 1);
		var table5 = checkRowBlank('schFADtlsSigningAuth', 2, 1);
		var table6 = checkRowBlank('schFADtlsTrusts', 2, 1);
		var table7 = checkRowBlank('DetailsOthIncomeOutsideIndia', 2, 1);

	if(document.getElementsByName('partBTTI.assetOutIndiaFlag')[0].value=='YES' && document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0].value!='NRI') {		
		if(table1 && table2 && table3 && table4 && table5 && table6 && table7 ) {
			j.setFieldError('scheduleFA.detailsForiegnBank[0].countryCode','Please enter any one table in Schedule FA.');
			addErrorXHTML('','Please enter any one table in Schedule FA.');
		}
	}
        if(document.getElementsByName('partBTTI.assetOutIndiaFlag')[0].value=='NO' && document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0].value!='NRI') {		
		if( !(table1 && table2 && table3 && table4 && table5 && table6 && table7) ) {
			j.setFieldError('partBTTI.assetOutIndiaFlag','Please correct your selection of assets outside India in Part B -TTI.');
			addErrorXHTML('','Please correct your selection of assets outside India in Part B -TTI.');
		}
	}
}

// Validate Schedule HP.
function validateScheduleHP(){
	var tab = document.getElementById('scheduleHPMain');
	var allInputTags = tab.getElementsByTagName('select');
	var count = 0;
	for(var i=0; i<allInputTags.length; i++ ){
		if(allInputTags[i].name.match("ifLetOut$")){
			if(allInputTags[i].value=="N"){
				if(++count > 1){
					j.setFieldError(allInputTags[i].name,'Where there is more than one Self occupied House property(SOP) , one of them shall be treated as SOP and all other House properties shall be deemed to be let out');
					break;
				}
			}
		}
	}
}

// Validate Raw Material Mandatory Fields.
function checkQDRawMatMandatory(tableId1,tableId2){
	try{
	var tab = document.getElementById(tableId1);
	var allInputTags = tab.getElementsByTagName('input');
	
	var tabFin = document.getElementById(tableId2);
	var allInputTagsFin = tabFin.getElementsByTagName('input');
	
	var rawMatCheck=false;
	var finGoodsCheck=false;
	
	var allInputTagsSelect = tab.getElementsByTagName('select');
	var allInputTagsSelectFin = tabFin.getElementsByTagName('select');
	
	if(tableId1=='scheduleQDRaw'){
		
		for(var i=0;i<allInputTags.length;i++ ){
			
		if(allInputTags[i].value !='' && !rawMatCheck && allInputTags[i].type !='checkbox' && allInputTags[i].type !='hidden'){
	
			rawMatCheck=true;
			break;
	
		} 
		}
	
		for(var i=0;i<allInputTagsSelect.length;i++ ){
			if( allInputTagsSelect[i].value !='' && !rawMatCheck){
				rawMatCheck=true;
				break;
		
			}
			}
		
	}
	
	if(tableId2=='scheduleQDFin'){
		
		for(var i=0;i<allInputTagsFin.length;i++ ){
		if(allInputTagsFin[i].value !='' && !finGoodsCheck && allInputTagsFin[i].type !='checkbox' && allInputTagsFin[i].type !='hidden'){
			finGoodsCheck=true;
			break;
			}
		}
		
		
		for(var i=0;i<allInputTagsSelectFin.length;i++ ){
			if(allInputTagsSelectFin[i].value !='' && !finGoodsCheck ){
				finGoodsCheck=true;
			
				break;
			}
			}
		
	}

	if(rawMatCheck && !finGoodsCheck){
		
		addErrorXHTML('','At least one entry is required in Finished goods in the sheet Quantitative Details');
		j.setFieldError('partaqd.manfactrConcern.finishrByProd.quantitDet[0].itemName','At least one entry is required in Finished goods in the sheet Quantitative Details');
	}
	
	if(!rawMatCheck && finGoodsCheck){
		
		addErrorXHTML('','At least one entry is required in Raw Materials in the sheet Quantitative Details');
		j.setFieldError('partaqd.manfactrConcern.rawMaterial.quantitDet[0].itemName','At least one entry is required in Raw Materials in the sheet Quantitative Details');
		
	}
	}catch(e){
		alert('error: ' +e);
	}
}


// Check if Schedule FSI is Mandatory.
function checkTRFSIMandatory(){
	
	var trFilled= checkRowBlank('scheduleTR', 3, 1);
	var fsiFilled=checkFSIRowBlank('scheduleFSI', 3, 1);
	var resStatus=document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0].value;
	if(resStatus=='RES'){
	if(!trFilled && fsiFilled ){
		
		j.setFieldError('itrScheduleFSI.scheduleFSI[0].countryCode','Schedule FSI is mandatory as you have filled schedule TR');
		addErrorXHTML('','Schedule FSI is mandatory as you have filled schedule TR');
	}
	}
}

// Check for Blank row for Schedule FSI.
function checkFSIRowBlank(tableId, noOfRow, last){
	var isRowBlank = true;
	try{
	var tab = document.getElementById(tableId);
	var rowCount = tab.rows.length;
	var trOfLastRow = tab.getElementsByTagName('tr')[rowCount - noOfRow];
	var allInputTags = trOfLastRow.getElementsByTagName('input');
	var allSelectTags = trOfLastRow.getElementsByTagName('select');
	var allTextareaTags = trOfLastRow.getElementsByTagName('textarea');
	
	for ( var i = 0; i < allInputTags.length; i++) {
		if(!allInputTags[i].name.match(".chosenCheckBox$")){
			if(allInputTags[i] != undefined || allInputTags[i].value != null){
				if((allInputTags[i].getAttribute("readonly") == null ) || 
					(allInputTags[i].getAttribute("readonly") != 'readonly')){
						if( allInputTags[i].parentNode.style.display != "none"  && allInputTags[i].getAttribute('type')!='hidden' ){
							var str = allInputTags[i].value.replace(/^\s+|\s+$/g,'');	
							
							if(!allInputTags[i].name.match("totalCountryWise$")){
							if(str!=''){
								isRowBlank = false;
								break;
							}
							}
						}
				}
			}
		}
	}
	
	for ( var i = 0; i < allTextareaTags.length; i++) {
		if(allTextareaTags[i] != undefined || allTextareaTags[i].value != null ){
			var str = allTextareaTags[i].value.replace(/^\s+|\s+$/g,'');
			if(str!=''){
				isRowBlank = false;
				break;
			}
		}
	}
	
	for ( var i = 0; i < allSelectTags.length; i++) {
		if(allSelectTags[i].value != '-1' && allSelectTags[i].value != ''){
			isRowBlank = false;
			break;
		}
	}
	}catch(e){
		alert(e);
	}
	return isRowBlank;
}

// Disable Schedule 5A.
function disableSchedule5A(){
	
	var tabl = document.getElementById('schedule5A');
	var allInputTags = tabl.getElementsByTagName('input');
	
	var portugeseStatus=document.getElementsByName('partAGEN1.filingStatus.portugeseCC5A')[0].value;
	
	for(var i = 0; i < allInputTags.length; i++) {
		if(portugeseStatus=='Y'){			
			allInputTags[i].disabled=false;
			allInputTags[i].readOnly=false;		
			
			document.getElementsByName('schedule5A2014.totalHeadIncome.incRecvdUndHead')[0].disabled=true;
			document.getElementsByName('schedule5A2014.totalHeadIncome.amtApprndOfSpouse')[0].disabled=true;
			document.getElementsByName('schedule5A2014.totalHeadIncome.amtTDSDeducted')[0].disabled=true;
			document.getElementsByName('schedule5A2014.totalHeadIncome.tDSApprndOfSpouse')[0].disabled=true;
			tabs.enableTabs(42);
			
		}else{
		
			allInputTags[i].disabled=true;
			allInputTags[i].readOnly=true;
			allInputTags[i].value="";	
			
	
		}
	}

}

// Check if more than 3 rows are added for Nature of Business.
function natureOfBusChck(tableId){
	var noRows=4;
	var tab = document.getElementById(tableId);
	var rowCount = tab.rows.length;
	if(rowCount > noRows) {
	addErrorXHTML('','Cannot insert more than 3 rows');
	return false;
	}
	return true;

}

// Tax Calculations begins from here.
function calculateTax(){
clearOldValues();
calcITR4();
}

// Validate Balance Sheets.
function balSheetWarnig(){
var totLaibilty = document.getElementsByName('partabs.fundSrc.totFundSrc')[0].value;
var totAsests = document.getElementsByName('partabs.fundApply.totFundApply')[0].value;

if(totLaibilty != totAsests){
	addErrorXHTML('','Sources of funds must be equal to Total application of funds');
}

}

// Enable / Disable Section 80GG.
function enable80GG(){
	
	var status=document.getElementsByName('partAGEN1.personalInfo.status')[0].value;
	var sec80GG=document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80GG')[0];
	
	if(status=='I'){
		sec80GG.disabled=false;
		sec80GG.readOnly=false;
		
	}else 
	{
	if(status=='H'){		
		sec80GG.disabled=true;
		sec80GG.readOnly=true;
		sec80GG.value="";
		document.getElementsByName('scheduleVIA.deductUndChapVIA.section80GG')[0].value="";
	}
}	
}

// set serial Number for Schedule HP co-Owners.
function setSerialNumber(element,header){
	
	try{
		 var tableId=element.getAttribute('onclick').substring(20,element.getAttribute('onclick').lastIndexOf('\''));
		 var index=tableId.substring(10);
		 index=eval(index-1);
		 var table = document.getElementById(tableId);
		 var noOfRows = table.rows.length;
		 
		 for ( var i = 0; i < eval(parseInt(noOfRows, 10) - header); i++) {
			 document.getElementsByName('scheduleHP.propertyDetails['+index+'].coOwners['+i+'].coOwnersSNo')[0].value=i+1;
		 }
	}catch(e){
		alert('errror:' +e);
	}
}

// Set Serial Number for Schedule HP Co-Tenants.
function setSerialNumberTenants(element,header){
	try{
		var tableId=element.getAttribute('onclick').substring(27,element.getAttribute('onclick').lastIndexOf('\''));
		var index=tableId.substring(16);
		index=eval(index-1);
		var table = document.getElementById(tableId);
		var noOfRows = table.rows.length;
		for ( var i = 0; i < eval(parseInt(noOfRows, 10) - header); i++) {
			document.getElementsByName('scheduleHP.propertyDetails['+index+'].coTenants['+i+'].coTenantsSNo')[0].value=i+1;
		}
	}catch(e){
		alert('errror:' +e);
	}
}

// Validate Schedule AMTC.
function checkAMTC(){
	
	try{
	var taxSec115JC=$('[name="itrScheduleAMTC.taxSection115JC"]')[0];
	var taxProvAct=$('[name="itrScheduleAMTC.taxOthProvision"]')[0];
	var totAmtcCredGross = document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.amtCreditFwd')[0];
	
	var amtCreditAvail=eval(parseInt(coalesce(taxSec115JC.value),10))-eval(parseInt(coalesce(taxProvAct.value),10));

	if(amtCreditAvail<0){
		amtCreditAvail=0;
	}
	
	if(totAmtcCredGross.value > amtCreditAvail){
		
		j.setFieldError('scheduleAMTC.scheduleAMTCUtil.amtCreditFwd','The amount of AMT credit B1 cannot exceed 1-2');
		addErrorXHTML(document.getElementsByName('scheduleAMTC.scheduleAMTCUtil.amtCreditFwd')[0],'The amount of AMT credit B1 cannot exceed 1-2',true);
		totAmtcCredGross.value=0;
	}
	}catch(e){
		alert('error in checkAMTC' +e);
	}
	
}

// Check for Alternate Due Dates.
function checkAlternateDueDate(){
	var blankSchIf= checkRowBlank('scheduleIF', 3, 1);
	var audit44AB=document.getElementsByName('partAGEN2.auditInfo.liableSec44ABflg')[0].value;
	var altDueDate=document.getElementsByName('verification.alternateDueDate')[0].value;
	
	if(blankSchIf && audit44AB=='N' && altDueDate=='2'){
		j.setFieldError('verification.alternateDueDate','Please check your Alternate Due date in Verification/Part B TTI.It cannot be 30/09/2013 unless you are liable for audit u/s 44AB or in Sch IF  , there is a partnesrship /firm which is liable for audit u/s 44AB');
		addErrorXHTML('','Please check your Alternate Due date in Verification/Part B TTI. It cannot be 30/09/2013 unless you are liable for audit u/s 44AB or in Sch IF  , there is a partnesrship /firm which is liable for audit u/s 44ABr',true);
	}
}

// Generate Warnings for Schedule PL.
function profLossWarning(){
	
	var businessReceipts=document.getElementsByName('partapl.creditsToPL.businessReceipts')[0];
	
	if(businessReceipts.value > parseInt('10000000',10)){
		addErrorXHTML(businessReceipts,'Sales /Gross Receipts(1 of Part A-P & L) of Business & Profession is greater than 1 crore then AUDIT INFORMATION must be completely filled',true);
	}
}

// Check if new changes are made.
function checkIfChanged(pathToCheck){
	if( (document.getElementsByName(pathToCheck)[0].fieldChanged == undefined) ||
			(document.getElementsByName(pathToCheck)[0].fieldChanged != undefined &&
			 document.getElementsByName(pathToCheck)[0].fieldChanged =='false')){
		return false;
	}else{
		return true;
	}
}

// Check Min of two values.
function checkFirstLessThanMinOthTwo(path1, path2, path3,verticalCeiling){
	if(coalesceSetRet(path2) <= verticalCeiling){
		if(coalesceSetRet(path1) > coalesceSetRet(path2)){
			addErrorXHTML(document.getElementsByName(path1)[0] , 'This value cannot be greater than '+ coalesceSetRet(path2),true );
			document.getElementsByName(path1)[0].value = coalesceSetRet(path2);
		}
	}else if(verticalCeiling < coalesceSetRet(path2)){
		if(coalesceSetRet(path1) > verticalCeiling){
			addErrorXHTML(document.getElementsByName(path1)[0] , 'This value cannot be greater than '+ verticalCeiling,true );
			document.getElementsByName(path1)[0].value = verticalCeiling;
		}
	}
}

// check if HP is enabled / disabled.
function checkHPeditableValidity(path1,path2,path4,path3,verticalCeilingHP){
	var tempVal =coalesceSetRet(path2)- coalesceSetRet(path4);	
	if(tempVal <= verticalCeilingHP){
		if(coalesceSetRet(path1) > tempVal){			
			addErrorXHTML(document.getElementsByName(path1)[0] , 'This value cannot be greater than '+tempVal,true );
			document.getElementsByName(path1)[0].value = tempVal;
		}
	}else if(verticalCeilingHP < tempVal){
		if(coalesceSetRet(path1) > verticalCeilingHP){			
			addErrorXHTML(document.getElementsByName(path1)[0] , 'This value cannot be greater than '+ verticalCeilingHP,true );
			document.getElementsByName(path1)[0].value = verticalCeilingHP;
		}
	}
	
}

// Check if Schedule BP is enabled / disabled.
function checkBPeditableValidity(path1,path2,path4,path5,path3,verticalCeilingBP){

	var tempVal = coalesceSetRet(path2)-coalesceSetRet(path4)-coalesceSetRet(path5);
	
	if(tempVal <= verticalCeilingBP){
		if(coalesceSetRet(path1) > tempVal){			
			addErrorXHTML(document.getElementsByName(path1)[0] , 'This value cannot be greater than '+tempVal,true );
			document.getElementsByName(path1)[0].value = tempVal;
		}
	}else if(verticalCeilingBP < tempVal){
		if(coalesceSetRet(path1) > verticalCeilingBP){			
			addErrorXHTML(document.getElementsByName(path1)[0] , 'This value cannot be greater than '+ verticalCeilingBP,true );
			document.getElementsByName(path1)[0].value = verticalCeilingBP;
		}
	}
}

// Validate Schedule HP Rent.
function validateHPRent(){
	              
	var tab=document.getElementById('scheduleHPMain');
	var allInputTags = tab.getElementsByTagName('input');
	
	for(var i = 0; i < allInputTags.length; i++) {
		if (allInputTags[i].name.match("rentdetails.annualLetableValue$")) {
			if( parseInt(allInputTags[i+1].value,10) > parseInt(allInputTags[i].value ,10)) {
				
				addError(allInputTags[i+1],'Rent not realized cannot exceed Annual Letable Value',true);
				j.setFieldError(allInputTags[i+1].name,'Rent not realized cannot exceed Annual Letable Value');
				break;
			}
		}
	}
}

// Set Zero if no data is entered.
function onEmptySetZero(element){
	
	if(element.value==""){
	
		element.value='0';
	}
	
}

// Check PAN entered based on Status selected.
function panStatusCheckValdt(){

var status = document.getElementsByName('partAGEN1.personalInfo.status')[0].value;
var pan = document.getElementsByName('partAGEN1.personalInfo.pan')[0].value;
var assesseeVerPAN = document.getElementsByName('verification.declaration.assesseeVerPAN')[0].value;

if((pan.substring(3,4)=='P' || pan.substring(3,4)=='p') && (status == 'I') && (assesseeVerPAN=='' || assesseeVerPAN==undefined || assesseeVerPAN == null)){
		assesseeVerPAN=document.getElementsByName('partAGEN1.personalInfo.pan')[0].value.toUpperCase();
		} 

if((pan.substring(3,4)=='P' || pan.substring(3,4)=='p') && (status == 'H')){
		addErrorXHTML('' ,'Since PAN entered is Individual PAN, Select Status as Individual');	
		j.setFieldError('partAGEN1.personalInfo.pan','Since PAN entered is Individual PAN, Select Status as Individual');
		} else if((pan.substring(3,4)=='H' || pan.substring(3,4)=='h') && (status == 'I')){
	addErrorXHTML('' ,'Since PAN entered is HUF PAN, Select Status as HUF');	
	j.setFieldError('partAGEN1.personalInfo.pan','Since PAN entered is HUF PAN, Select Status as HUF');
	}

}

// Populate PAN.
function getPan(){

var pan = document.getElementsByName('partAGEN1.personalInfo.pan')[0].value;
return pan;
}

// Calculate Tax Payable based on Slab-Rates.
function calculateTaxPayable(netTxblIncome){
    
	var taxPayer = document.getElementsByName('partAGEN1.personalInfo.status')[0];
	//IN-I,HUF-H
	var resStatus 			= document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0]; //RES , NRI 
	
	var age	= calcAge();

	var incTax = parseInt('0', 10);	

	if(taxPayer.value=='I' && age > 59 && age < 80 && (resStatus.value=='RES' || resStatus.value=='NOR')){

		if(parseInt(netTxblIncome,10) >= parseInt('0',10) && parseInt(netTxblIncome,10) <= parseInt('300000',10)){
		incTax = parseInt('0',10);
		}else if(parseInt(netTxblIncome,10) >= parseInt('300001',10) && parseInt(netTxblIncome,10) <= parseInt('500000',10)){
			incTax = Math.round(eval( eval(parseInt(netTxblIncome,10) - parseInt('300000',10) )  * parseFloat('0.1'))) ;
		}else if(parseInt(netTxblIncome,10) >= parseInt('500001',10) && parseInt(netTxblIncome,10) <= parseInt('1000000',10)){
			incTax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('500000',10) )* parseFloat('0.2')) + parseInt('20000',10)));
		}else if(parseInt(netTxblIncome,10) >= parseInt('1000001',10)){
			incTax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('1000000',10) )* parseFloat('0.3')) + parseInt('120000',10)));
		}
	
	}else if(taxPayer.value=='I' && age >= 80 && (resStatus.value=='RES' || resStatus.value=='NOR')){
			   
		if(parseInt(netTxblIncome,10) >= parseInt('0',10) && parseInt(netTxblIncome,10) <= parseInt('500000',10)){
			incTax = parseInt('0',10);
		}else if(parseInt(netTxblIncome,10) >= parseInt('500001',10) && parseInt(netTxblIncome,10) <= parseInt('1000000',10)){
			incTax = Math.round(eval( eval(parseInt(netTxblIncome,10) - parseInt('500000',10) )  * parseFloat('0.2'))) ;
					
		}else if(parseInt(netTxblIncome,10) >= parseInt('1000001',10)){
			incTax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('1000000',10) )* parseFloat('0.3')) + parseInt('100000',10)));             
		}
			   
		
	}else if( (taxPayer.value=='I') || taxPayer.value=='H' ){
		
		if(parseInt(netTxblIncome,10) >= parseInt('0',10) && parseInt(netTxblIncome,10) <= parseInt('250000',10)){
		incTax = parseInt('0',10);
		}else if(parseInt(netTxblIncome,10) >= parseInt('250001',10) && parseInt(netTxblIncome,10) <= parseInt('500000',10)){
			incTax = Math.round(eval( eval(parseInt(netTxblIncome,10) - parseInt('250000',10) )  * parseFloat('0.1'))) ;
		}else if(parseInt(netTxblIncome,10) >= parseInt('500001',10) && parseInt(netTxblIncome,10) <= parseInt('1000000',10)){
			incTax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('500000',10) )* parseFloat('0.2')) + parseInt('25000',10)));
		}else if(parseInt(netTxblIncome,10) >= parseInt('1000001',10)){
			incTax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('1000000',10) )* parseFloat('0.3')) + parseInt('125000',10)));
		}
		
	}
	
	return incTax;
	
}

// Function to disable Schedule FA.
function disableScheduleFA(){

	var resStatus=document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0].value;
	
    removeTableData('schFADtlsFrignAssets',resStatus);
    removeTableData('schFADtlsFinIntrest',resStatus);
    removeTableData('schFADtlsImmvbleProp',resStatus);
    removeTableData('schFADtlsOtherAsset',resStatus);
    removeTableData('schFADtlsSigningAuth',resStatus);
    removeTableData('schFADtlsTrusts',resStatus);
    removeTableData('DetailsOthIncomeOutsideIndia',resStatus);
}

// Enable Fields for Point-E for Schedule FA.
function enableFieldsForPointE(tableId){
	
	var tab = document.getElementById(tableId);
	var rows = tab.getElementsByTagName('tr');
	var rowCount = rows.length;
	
	for(var  i = 0; i<rowCount - 4; i++){
		var selectedOptionId = document.getElementsByName('scheduleFA.detailsOfAccntsHvngSigningAuth['+i+'].taxableIncomeFlag')[0];
		var selectedOption = selectedOptionId.options[selectedOptionId.selectedIndex].value;
				
		if (selectedOption == 'Y'){
			document.getElementsByName('scheduleFA.detailsOfAccntsHvngSigningAuth['+i+'].interestInAccount')[0].disabled = false;
			document.getElementsByName('scheduleFA.detailsOfAccntsHvngSigningAuth['+i+'].amount')[0].disabled = false;
			document.getElementsByName('scheduleFA.detailsOfAccntsHvngSigningAuth['+i+'].scheduleOffered')[0].disabled = false;
			document.getElementsByName('scheduleFA.detailsOfAccntsHvngSigningAuth['+i+'].itemNo')[0].disabled = false;
		
		}else{
			document.getElementsByName('scheduleFA.detailsOfAccntsHvngSigningAuth['+i+'].interestInAccount')[0].disabled = true;
			document.getElementsByName('scheduleFA.detailsOfAccntsHvngSigningAuth['+i+'].amount')[0].disabled = true;
			document.getElementsByName('scheduleFA.detailsOfAccntsHvngSigningAuth['+i+'].scheduleOffered')[0].disabled = true;
			document.getElementsByName('scheduleFA.detailsOfAccntsHvngSigningAuth['+i+'].itemNo')[0].disabled = true;
			
			document.getElementsByName('scheduleFA.detailsOfAccntsHvngSigningAuth['+i+'].interestInAccount')[0].value='';
			document.getElementsByName('scheduleFA.detailsOfAccntsHvngSigningAuth['+i+'].amount')[0].value = '';
			document.getElementsByName('scheduleFA.detailsOfAccntsHvngSigningAuth['+i+'].scheduleOffered')[0].value= '';
			document.getElementsByName('scheduleFA.detailsOfAccntsHvngSigningAuth['+i+'].itemNo')[0].value = '';
			
		}
	}
}

//Enable Fields for Point-F for Schedule FA.
function enableFieldsForPointF(tableId){
	
	var tab = document.getElementById(tableId);
	var rows = tab.getElementsByTagName('tr');
	var rowCount = rows.length;
	
	for(var  i = 0; i<rowCount - 4; i++){
		var selectedOptionId = document.getElementsByName('scheduleFA.detailsOfTrustOutIndiaTrustee['+i+'].trustIncomeFlag')[0];
		var selectedOption = selectedOptionId.options[selectedOptionId.selectedIndex].value;
				
		if (selectedOption == 'Y'){
			document.getElementsByName('scheduleFA.detailsOfTrustOutIndiaTrustee['+i+'].trustIncome')[0].disabled = false;
			document.getElementsByName('scheduleFA.detailsOfTrustOutIndiaTrustee['+i+'].amount')[0].disabled = false;
			document.getElementsByName('scheduleFA.detailsOfTrustOutIndiaTrustee['+i+'].scheduleOffered')[0].disabled = false;
			document.getElementsByName('scheduleFA.detailsOfTrustOutIndiaTrustee['+i+'].itemNo')[0].disabled = false;
		
		}else{
			document.getElementsByName('scheduleFA.detailsOfTrustOutIndiaTrustee['+i+'].trustIncome')[0].disabled = true;
			document.getElementsByName('scheduleFA.detailsOfTrustOutIndiaTrustee['+i+'].amount')[0].disabled = true;
			document.getElementsByName('scheduleFA.detailsOfTrustOutIndiaTrustee['+i+'].scheduleOffered')[0].disabled = true;
			document.getElementsByName('scheduleFA.detailsOfTrustOutIndiaTrustee['+i+'].itemNo')[0].disabled = true;
			
			document.getElementsByName('scheduleFA.detailsOfTrustOutIndiaTrustee['+i+'].trustIncome')[0].value = '';
			document.getElementsByName('scheduleFA.detailsOfTrustOutIndiaTrustee['+i+'].amount')[0].value = '';
			document.getElementsByName('scheduleFA.detailsOfTrustOutIndiaTrustee['+i+'].scheduleOffered')[0].value = '';
			document.getElementsByName('scheduleFA.detailsOfTrustOutIndiaTrustee['+i+'].itemNo')[0].value = '';
			
		}
	}
}

//Enable Fields for Point-G for Schedule FA.
function enableFieldsForPointG(tableId){
	
	var tab = document.getElementById(tableId);
	var rows = tab.getElementsByTagName('tr');
	var rowCount = rows.length;
	
	for(var  i = 0; i<rowCount - 4; i++){
		var selectedOptionId = document.getElementsByName('scheduleFA.detailsOfOtherIncome['+i+'].trustIncomeFlag')[0];
		var selectedOption = selectedOptionId.options[selectedOptionId.selectedIndex].value;
				
		if (selectedOption == 'Y'){
			document.getElementsByName('scheduleFA.detailsOfOtherIncome['+i+'].amount')[0].disabled = false;
			document.getElementsByName('scheduleFA.detailsOfOtherIncome['+i+'].scheduleOffered')[0].disabled = false;
			document.getElementsByName('scheduleFA.detailsOfOtherIncome['+i+'].itemNo')[0].disabled = false;
		
		}else{
			
			document.getElementsByName('scheduleFA.detailsOfOtherIncome['+i+'].amount')[0].disabled = true;
			document.getElementsByName('scheduleFA.detailsOfOtherIncome['+i+'].scheduleOffered')[0].disabled = true;
			document.getElementsByName('scheduleFA.detailsOfOtherIncome['+i+'].itemNo')[0].disabled = true;
			
			document.getElementsByName('scheduleFA.detailsOfOtherIncome['+i+'].amount')[0].value = '';
			document.getElementsByName('scheduleFA.detailsOfOtherIncome['+i+'].scheduleOffered')[0].value = '';
			document.getElementsByName('scheduleFA.detailsOfOtherIncome['+i+'].itemNo')[0].value = '';
		}
	}
}

// Delete Data from table.
function removeTableData(tableID, resStatus) {
	
	var tab = document.getElementById(tableID);
    var asstFlag = document.getElementsByName('partBTTI.assetOutIndiaFlag')[0].value;
    
    if(!((resStatus=='RES'||resStatus=='NOR') && asstFlag=='YES')){
    $('#'+tableID+' input').attr("checked" , true);
    deleteRowTable(tableID,3,1);
    $('#'+tableID+' input').attr("checked" , false);
    }
            
	var allInputTags = tab.getElementsByTagName('input');
var selectTags=tab.getElementsByTagName('select');

	for(var i = 0; i < allInputTags.length; i++) {
		if((resStatus=='RES'||resStatus=='NOR') && asstFlag=='YES'){
			allInputTags[i].disabled=false;
			allInputTags[i].readOnly=false;	
			
	}else{		
		
		allInputTags[i].disabled=true;
		allInputTags[i].readOnly=true;
		allInputTags[i].value="";	
	}
}
for(var i = 0; i < selectTags.length; i++){
	if((resStatus=='RES'||resStatus=='NOR') && asstFlag=='YES'){
		  selectTags[i].disabled=false;		
	}else{
		selectTags[i].disabled=true;
		selectTags[i].value="";	
                  	
	}
} 
if ((resStatus == 'RES' || resStatus == 'NOR') && asstFlag == 'YES') {
	tabs.enableTabs(41);
}
}

// Check No. of Co-Owners for Schedule HP.
function numberOfCoOwnersCheck(tableId,noRows){
	var tab = document.getElementById(tableId);
	var rowCount = tab.rows.length;
	if(rowCount > noRows) {
	addErrorXHTML('','Cannot insert more than 5 rows',true);
	return false;
	}
	return true;

}

// Check No. of Rows for Schedule QD.
function numberOfRowsForQDCheck(tableId){
	var noRows=21;
	var tab = document.getElementById(tableId);
	var rowCount = tab.rows.length;
	if(rowCount > noRows) {
	addErrorXHTML('','Cannot insert more than 20 rows');
	return false;
	}
	return true;

}

// Add Row to Schedule HP Co-Owners.
function addRowToTableSchHp(tableId, noOfRow, last,elem) {
	
	addRowToTable(tableId,noOfRow,last);
	setSerialNumber(elem,2);
}

// Add Row to Schedule HP Co-Tenants.
function addRowToTableSchHpTenants(tableId, noOfRow, last,elem) {
	
	addRowToTable(tableId,noOfRow,last);
	setSerialNumberTenants(elem,2);
}

// Validate Membership No. Length.
function checkMembershipNoLength(memberShipNO) {
	if(memberShipNO.value.length==5) {
		memberShipNO.value=0+memberShipNO.value;
	} else if(memberShipNO.value.length==4) {
		memberShipNO.value='00'+memberShipNO.value;
	} else if(memberShipNO.value.length==3) {
		memberShipNO.value='000'+memberShipNO.value;
	} else if(memberShipNO.value.length==2) {
		memberShipNO.value='0000'+memberShipNO.value;
	} else if(memberShipNO.value.length==1 && memberShipNO.value!=0) {
		memberShipNO.value='00000'+memberShipNO.value;
	}
}

/*//Validate Registration No. Length.
function checkRegistrationNoLength(RegNO) {
	if(RegNO.value.length==7) {
		RegNO.value=0+RegNO.value;
	} else if(RegNO.value.length==6) {
		RegNO.value='00'+RegNO.value;
	} else if(RegNO.value.length==5) {
		RegNO.value='000'+RegNO.value;
	} else if(RegNO.value.length==4) {
		RegNO.value='0000'+RegNO.value;
	} else if(RegNO.value.length==3) {
		RegNO.value='00000'+RegNO.value;
	} else if(RegNO.value.length==2) {
		RegNO.value='000000'+RegNO.value;
	} else if(RegNO.value.length==1 && RegNO.value!=0) {
		RegNO.value='0000000'+RegNO.value;
	}
}*/

function checkRegistrationNoLength(RegNO) {
	if(RegNO.value=="00000000") {
		var regno = document.getElementsByName('partAGEN2.auditInfo.audFrmRegno')[0];
        addErrorXHTML(regno,'Please enter valid Registration No. of the proprietorship/firm.',true);	
	
}
}

// Calculate Total Sum Section-wise for Schedule CG.
function sumSectionWise(tableId, arr){
	var tab = document.getElementById(tableId);
	var selects = tab.getElementsByTagName("SELECT");
	for(var i=0;i<selects.length;i++){
		if((selects[i].name.match('section$') || selects[i].name.match('deductedSecCode$')) && selects[i].value!=''){
			var name = selects[i].name;
			var str1 = name.substr(0,name.lastIndexOf('[')+1);
			var amt = document.getElementsByName(str1+i+'].amount')[0];
			if(tableId=='schduleCGDed'){
				amt = document.getElementsByName(str1+i+'].amtDed')[0];
			}
			arr[selects[i].value] = parseInt(arr[selects[i].value]) + parseInt(coalesce(amt.value));
		}
	}
	return arr;
}

// Validate Schedule CG Deductions Date.
function validateCGDedDate(){
	var tab = document.getElementById('schduleCGDed');
	var selects  = tab.getElementsByTagName('SELECT');
	for(var i=0; i<selects.length;i++){
		var name = selects[i].name;
		var index = name.substring(name.indexOf("[")+1,name.indexOf("]"));
		var dedDt = document.getElementsByName('scheduleCGPost45.deducClaimInfo.deducClaimDtls['+index+'].dateofAcquist')[0];
		if(dedDt!='' && selects[i].value!=''){
			if(isFirstDateBefore(dedDt.value, Cg_ded_start_date) || isFirstDateBefore(Cg_ded_end_date, dedDt.value)){
	            j.setFieldError(dedDt.name,'Date must be between 01/04/2015 and 31/03/2019');
	            addErrorXHTML(dedDt,'Date must be between 01/04/2015 and 31/03/2019',true);
			}
	}
}
}

// Validate CG Section-wise Deduction Amounts.
function validateCGSecwiseDed(){
	var arr = {'54':0,'54B':0,'54EC':0,'54F':0,'54GB':0,'115F':0,'54D':0,'54G':0,'54GA':0,'54EE':0};
	var arrDed = {'54':0,'54B':0,'54EC':0,'54F':0,'54GB':0,'115F':0,'54D':0,'54G':0,'54GA':0,'54EE':0};
	sumSectionWise('stcgDeduction1', arr);
	sumSectionWise('stcgDeduction2', arr);
	sumSectionWise('ltcgDeduction1', arr);
	sumSectionWise('ltcgDeduction2', arr);	
	sumSectionWise('ltcgDeduction3', arr);
	sumSectionWise('scheduleCGltcg7', arr);
	sumSectionWise('scheduleCGltcg4_ded1', arr);
	
	
	
	arr['115F'] = parseInt(arr['115F']) + coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.dednSpecAssetus115');
	arr['115F'] = parseInt(arr['115F']) + coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.dednOtherSpecAssetus115');
	
	var len = document.getElementById('scheduleCGltcg3').tBodies.length;
	for(var i=0;i<len;i++){
		sumSectionWise('scheduleCGltcg3_ded'+(i+1), arr);
	}
	len = document.getElementById('stcg10pctTab').tBodies.length;
	for(var i=0;i<len;i++){
		sumSectionWise('stcg10pctTab_ded'+(i+1), arr);
	}	

	sumSectionWise('schduleCGDed', arrDed);

	if(arr['54']!=arrDed['54']){
		j.setFieldError('scheduleCGPost45.deducClaimInfo.deducClaimDtls[0].deductedSecCode','Deduction under 54 must match with deduction in table D');
		addErrorXHTML('','Deduction under 54 must match with deduction in table D',true);		
	}
	if(arr['54B']!=arrDed['54B']){
		j.setFieldError('scheduleCGPost45.deducClaimInfo.deducClaimDtls[0].deductedSecCode','Deduction under 54B must match with deduction in table D');
		addErrorXHTML('','Deduction under 54B must match with deduction in table D',true);		
	}
	if(arr['54EC']!=arrDed['54EC']){
		j.setFieldError('scheduleCGPost45.deducClaimInfo.deducClaimDtls[0].deductedSecCode','Deduction under 54EC must match with deduction in table D');
		addErrorXHTML('','Deduction under 54EC must match with deduction in table D',true);		
	}
	if(arr['54EE']!=arrDed['54EE']){
		j.setFieldError('scheduleCGPost45.deducClaimInfo.deducClaimDtls[0].deductedSecCode','Deduction under 54EE must match with deduction in table D');
		addErrorXHTML('','Deduction under 54EE must match with deduction in table D',true);		
	}
	if(arr['54F']!=arrDed['54F']){
		j.setFieldError('scheduleCGPost45.deducClaimInfo.deducClaimDtls[0].deductedSecCode','Deduction under 54F must match with deduction in table D');
		addErrorXHTML('','Deduction under 54F must match with deduction in table D',true);		
	}
	if(arr['54GB']!=arrDed['54GB']){
		j.setFieldError('scheduleCGPost45.deducClaimInfo.deducClaimDtls[0].deductedSecCode','Deduction under 54GB must match with deduction in table D');
		addErrorXHTML('','Deduction under 54GB must match with deduction in table D',true);		
	}	
	if(arr['115F']!=arrDed['115F']){
		j.setFieldError('scheduleCGPost45.deducClaimInfo.deducClaimDtls[0].deductedSecCode','Deduction under 115F must match with deduction in table D');
		addErrorXHTML('','Deduction under 115F must match with deduction in table D',true);		
	}
	if(arr['54D']!=arrDed['54D']){
		j.setFieldError('scheduleCGPost45.deducClaimInfo.deducClaimDtls[0].deductedSecCode','Deduction under 54D must match with deduction in table D');
		addErrorXHTML('','Deduction under 54D must match with deduction in table D',true);		
	}	
	if(arr['54G']!=arrDed['54G']){
		j.setFieldError('scheduleCGPost45.deducClaimInfo.deducClaimDtls[0].deductedSecCode','Deduction under 54G must match with deduction in table D');
		addErrorXHTML('','Deduction under 54G must match with deduction in table D',true);		
	}	
	if(arr['54GA']!=arrDed['54GA']){
		j.setFieldError('scheduleCGPost45.deducClaimInfo.deducClaimDtls[0].deductedSecCode','Deduction under 54GA must match with deduction in table D');
		addErrorXHTML('','Deduction under 54GA must match with deduction in table D',true);		
	}	
}

// Add Row to Schedule SI.
function addSchSIRow(SecCode,SecCodeValue){
	
    try{
    var tableId=document.getElementById('scheduleSI');
    var mainTable=document.getElementById('scheduleSI').rows;
    var noOfRows=tableId.rows.length;
    var toInsertBefore=document.getElementById('scheduleSILastRow');
   
    var lastIndex=eval(parseInt(noOfRows,10)-2);
    
    
    
    var cloneNode=mainTable[lastIndex].cloneNode(true);
    var newSlNo=cloneNode.cells[0].textContent;
    
    
    var iterate=eval(parseInt(newSlNo,10)-1);
    ;
    cloneNode.cells[0].innerHTML=eval(parseInt(newSlNo,10)+1);
    //getSection
    cloneNode.cells[1].innerHTML=getSectionTextMap(SecCode);
    var inputTags=cloneNode.getElementsByTagName('input');
		for(var a=0;a<inputTags.length;a++){
                   
			inputTags[a].name=inputTags[a].name.replace('['+iterate+']','['+lastIndex+']');
			
                        inputTags[a].id=inputTags[a].name.replace(/([\.\[\]])/g,'_').replace(/(__)/g,'_');
                        //Display Section Rate
                        inputTags[1].value=getSectionTaxRate(SecCode);
                        //Income
                        inputTags[2].value=zeroOrMore(parseInt(SecCodeValue,10));
                        
                        
                        if(inputTags[a].getAttribute('type')=='hidden' && inputTags[a].name.match("secCode$")){
                            inputTags[a].value=SecCode;
                        }
                        
                        
                        var blurAttr=inputTags[a].getAttribute('onblur');
            			if(blurAttr!=null){
            				blurAttr=blurAttr+";";
            			}else{
            				blurAttr="";
            			}
            			inputTags[a].setAttribute('onblur',blurAttr+'j.blur(this,this.name,this.value);');
		}
    document.getElementById('scheduleSI').getElementsByTagName('tr')[0].parentNode.insertBefore(cloneNode,toInsertBefore);
    
    
}catch(e){
        alert('addSchSIRow'+e);
    }
}

// Populate Schedule SI.
function populateSI(cgosIncome,simap){
   try{ 
	   updateMapForSI(cgosIncome, simap);
	   
      //111
    document.getElementsByName('scheduleSI.splCodeRateTax[0].splRateInc')[0].value= zeroOrMore(parseInt(cgosIncome.osInc.sec111,10));
    
  //DTAAOS
    document.getElementsByName('scheduleSI.splCodeRateTax[1].splRateInc')[0].value= zeroOrMore(parseInt(document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa.totAmtUnderDtaa')[0].value,10));
   
    //111A
    document.getElementsByName('scheduleSI.splCodeRateTax[2].splRateInc')[0].value= zeroOrMore(parseInt(cgosIncome.cgInc.stcg.prctg15.sec111a,10));
  
     //112
    document.getElementsByName('scheduleSI.splCodeRateTax[3].splRateInc')[0].value = zeroOrMore(parseInt(cgosIncome.cgInc.ltcg.prctg20.sec112,10) );
  
    //112proviso
    document.getElementsByName('scheduleSI.splCodeRateTax[4].splRateInc')[0].value = zeroOrMore(parseInt(cgosIncome.cgInc.ltcg.prctg10.secProviso,10)); 
  
    //112(1)(c)(iii)
    document.getElementsByName('scheduleSI.splCodeRateTax[5].splRateInc')[0].value = zeroOrMore(parseInt(cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2,10)); 
  
  //5BB
   document.getElementsByName('scheduleSI.splCodeRateTax[6].splRateInc')[0].value = zeroOrMore(parseInt(cgosIncome.osInc.sec115BB)); 
   
   //5ADii
   document.getElementsByName('scheduleSI.splCodeRateTax[7].splRateInc')[0].value = zeroOrMore(parseInt(cgosIncome.cgInc.stcg.prctg30,10));
   
 //5BBF_BP
   document.getElementsByName('scheduleSI.splCodeRateTax[8].splRateInc')[0].value= zeroOrMore(parseInt(document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.incRecCredPLOthHeads.us115BBF')[0].value,10));
  
        
     deleteSIRow();
   
  
    for(var i in simap){
        if(simap[i]!='undefined' && simap[i]!=null && simap[i]!=0){
            var secAdded=checkSectionAddedSI(i,simap[i]);
            if(!secAdded && !(i=='68' || i=='69' ||i=='69A' || i=='69B' ||i=='69C' || i=='69D')){
            addSchSIRow(i,simap[i]);
          }
        }
       
    }
    for(var si in simap){
      
     simap[si]='';
    }
    calcScheduleSI();
   }catch(e){
       alert('Error in populateSI:' +e);
   }
   
}

// Validate Sections added for Schedule SI.
function checkSectionAddedSI(secCode,secValue){
    try{
    var tab=document.getElementById('scheduleSI');
    var noofRows=tab.rows.length;
    var secAdded=false;
    for(var i=0;i<eval(parseInt(noofRows,10)-4);i++){
       
        if(document.getElementsByName('scheduleSI.splCodeRateTax['+i+'].secCode')[0].value==secCode ){
            document.getElementsByName('scheduleSI.splCodeRateTax['+i+'].splRateInc')[0].value=zeroOrMore(parseInt(secValue,10));
            secAdded=true;
            }
        
    }
    }catch(e){
       alert('error in checkSectionAddedSI' +e); 
    }
    return secAdded;
}

// delete Row for Schedule SI.
function deleteSIRow(){
    try{
    var siTable=document.getElementById('scheduleSI');
    var noRows=siTable.rows.length;
    if(parseInt(noRows,10) > 11){
    
    for(var i=9;i<parseInt(noRows,10)-2;i++){
       siTable.deleteRow(10); 
    }
    
    }
   
    }catch(e){
        alert('Error in deleteSIRow:'+e)
    }
   }


// Get Section based on key.
function getSectionTextMap(key){
    var sectionTextMap={"1":"111 - Tax on accumulated balance of recognised PF",
            "1A":"111A (STCG on shares where STT paid)",
            "21":"112 (LTCG on others)",
            "22":"112 proviso (LTCG on listed securities/ units without indexation)",
            "21ciii":"112(1)(c)(iii)(LTCG on unlisted securities in case of non-residents)",
            "5A1ai":"115A(1)(a)(i)- Dividends interest and income from units purchase in foreign currency",
            "5A1aii":"115A(1)(a)(ii)- Interest received from govt/Indian Concerns recived in Foreign Currency",
            "5A1aiia":"115A(1) (a)(iia) -Interest from Infrastructure Debt Fund",
            "5A1aiiaa":"115A(1) (a)(iiaa) -Interest as per Sec. 194LC",
            "5A1aiiab":"115A(1) (a)(iiab) -Interest as per Sec. 194LD",
            "5A1aiiac":"115A(1)(a)(iiac) -Interest as per Sec. 194LBA",
            "5A1aiii":"115A(1) (a)(iii) - Income received in respect of units of UTI purchased in Foreign Currency",
            "5A1bA":"115A(1)(b)(A)- Income from royalty & technical services",
            "5A1bB":"115A(1)(b)(B) Income from royalty & technical services",
            "5AC1ab":"115AC(1)(a & b) - Income from bonds or GDR purchased in foreign currency - non-resident",
            "5AC1c":"115AC(1)(c) -LTCG arising from the transfer of bonds or GDR purchased in foreign currency - non-resident",
            "5ACA1a":"115ACA(1)(a) - Income from GDR purchased in foreign currency -resident",
            "5ACA1b":"115ACA(1)(b) - LTCG arising from the transfer of GDR purchased in foreign currency -resident",
            "5AD1i":"115AD(1)(i) -Income received by an FII in respect of securities (other than units as per Sec 115AB)",
            "5AD1iP":"115AD(1)(i) -Income received by an FII in respect of bonds or government securities as per Sec 194LD ",
            "5ADii":"115AD(1)(ii) -STCG (other than on equity share or equity oriented mutual fund referred to in section 111A) by an FII",
            "5ADiii":"115AD(1)(iii)-Long term capital gains by an FII",
            "5B":"115B - Profits and gains of life insurance business",
            "5BB":"115BB (Winnings from lotteries, puzzles, races, games etc.)",
            "5BBA":"115BBA - Tax on non-residents sportsmen or sports associations",
            "5BBC":"115BBC - Anonymous donations",
            "5BBDA":"115BBDA -Tax on certain dividends received from domestic companies",
            "5BBF":"115BBF -Tax on income from patent (Income under head other sources)",
            "5BBF_BP":"115BBF -Tax on income from patent(Income under head business or profession )",
            "5BBE":"115BBE - Tax on income referred to in sections 68 or 69 or 69A or 69B or 69C or 69D",
            "5Ea":"115E(a) - Investment income",
            "5Eacg":"115E(a)-LTCG on any asset other than a specified asset-non resident Indian",
            "5Eb":"115E(b) - Income by way of long term capital gains",
            "DTAAOS":"Chargeable under DTAA rate",
            "5AD1biip":"115AD(1)(b)(ii)- Short term capital gains referred to in section 111A",
            "Others":"Others"
};

return sectionTextMap[key];
}

// Get Rates based on Key values.
function getSectionTaxRate(key){
    var sectionRateMap={"1A":"15",
            "21":"20",
            "22":"10",
            "21ciii":"10",
            "5A1ai":"20",
            "5A1aii":"20",
            "5A1aiia":"5",
            "5A1aiiaa":"5",
            "5A1aiiab":"5",
            "5A1aiiac":"5",
            "5A1aiii":"20",
            "5A1bA":"10",
            "5A1bB":"10",
            "5AC1ab":"10",
            "5AC1c":"10",
            "5ACA1a":"10",
            "5ACA1b":"10",
            "5AD1i":"20",
            "5AD1iP":"5",
            "5ADii":"30",
            "5ADiii":"10",
            "5B":"12.5",
            "5BB":"30",
            "5BBA":"20",
            "5BBC":"30",
            "5BBE":"60",
            "5Ea":"20",
            "5Eacg":"20",
            "5Eb":"10",
            "5BBDA":"10",
            "5BBF":"10",
            "5BBF_BP":"10",
            "5AD1biip":"15"
};

return sectionRateMap[key];

}

// Populate Schedule TR.
function populateTR() {
	try {
		deleteTRRow();
		var fsiTable = document.getElementById('scheduleFSI');
		var noRows = (fsiTable.rows.length-4)/6;
		var pos = document.getElementsByName('itrScheduleFSI.scheduleFSI[0].countryCode')[0].selectedIndex;
		
		document.getElementsByName('scheduleTR1.scheduleTR[0].countryCode')[0].value = document.getElementsByName('itrScheduleFSI.scheduleFSI[0].countryCode')[0].value;
		document.getElementsByName('scheduleTR1.scheduleTR[0].countryName')[0].value = document.getElementsByName('itrScheduleFSI.scheduleFSI[0].countryName')[0].value;
		
		if(document.getElementsByName('itrScheduleFSI.scheduleFSI[0].countryCode')[0].options[pos].text=="Select") {
			document.getElementsByName('scheduleTR1.scheduleTR[0].countryCodeName')[0].value = '';
		} else {
			document.getElementsByName('scheduleTR1.scheduleTR[0].countryCodeName')[0].value = document.getElementsByName('itrScheduleFSI.scheduleFSI[0].countryCode')[0].options[pos].text;
		}
		
		document.getElementsByName('scheduleTR1.scheduleTR[0].taxIdentificationNo')[0].value = document.getElementsByName('itrScheduleFSI.scheduleFSI[0].taxIdentificationNo')[0].value;
		document.getElementsByName('scheduleTR1.scheduleTR[0].taxPaidOutsideIndia')[0].value = document.getElementsByName('itrScheduleFSI.scheduleFSI[0].totalCountryWise.taxPaidOutsideInd')[0].value;
		document.getElementsByName('scheduleTR1.scheduleTR[0].taxReliefOutsideIndia')[0].value = document.getElementsByName('itrScheduleFSI.scheduleFSI[0].totalCountryWise.taxReliefinInd')[0].value;
		
		var firstSecCode = document.getElementsByName('scheduleTR1.scheduleTR[0].countryCodeName')[0].value+'_'+document.getElementsByName('scheduleTR1.scheduleTR[0].taxIdentificationNo')[0].value;
		
		document.getElementsByName('scheduleTR1.scheduleTR[0].relavantArticleDTAA')[0].value=sectionClaimed[firstSecCode];
		
		if(noRows>1) {
			
			var countryCodeName='';
			var taxIdentificationNo='';
			var taxPaidOutsideIndia='';
			var taxReliefOutsideIndia='';

			for(var i=1;i<noRows;i++) {
				var index = document.getElementsByName('itrScheduleFSI.scheduleFSI['+i+'].countryCode')[0].selectedIndex;
				
				countryCodeName = document.getElementsByName('itrScheduleFSI.scheduleFSI['+i+'].countryCode')[0].options[index].text;
				
				if(countryCodeName=="Select"){
					countryCodeName = '';
				}
				
				taxIdentificationNo = document.getElementsByName('itrScheduleFSI.scheduleFSI['+i+'].taxIdentificationNo')[0].value;
				taxPaidOutsideIndia = document.getElementsByName('itrScheduleFSI.scheduleFSI['+i+'].totalCountryWise.taxPaidOutsideInd')[0].value;
				taxReliefOutsideIndia = document.getElementsByName('itrScheduleFSI.scheduleFSI['+i+'].totalCountryWise.taxReliefinInd')[0].value;
				
				addSchTRRow(countryCodeName,taxIdentificationNo,taxPaidOutsideIndia,taxReliefOutsideIndia);
				
				var countryCode=document.getElementsByName('scheduleTR1.scheduleTR['+i+'].countryCode')[0];
				var countryName=document.getElementsByName('scheduleTR1.scheduleTR['+i+'].countryName')[0];
				
				countryCode.value = document.getElementsByName('itrScheduleFSI.scheduleFSI['+i+'].countryCode')[0].value;
				countryName.value = document.getElementsByName('itrScheduleFSI.scheduleFSI['+i+'].countryName')[0].value;
				
				
				document.getElementsByName('scheduleTR1.scheduleTR['+i+'].relavantArticleDTAA')[0].value = sectionClaimed[countryCodeName+'_'+taxIdentificationNo];
					
				
			}
			
		}
		
		totAmtOfSchedTRFor6('scheduleTR');
	} catch (e) {
		alert('Error in populateTR:' + e);
	}

}

var sectionClaimed = {};

// Delete Row for Schedule TR.
function deleteTRRow() {
	try {
		var trTable = document.getElementById('scheduleTR');
		var noRows = trTable.rows.length;
		
		if (parseInt(noRows, 10) > 4) {
			for ( var i = 2; i < parseInt(noRows, 10) - 3; i++) {
				var countryCode = document.getElementsByName('scheduleTR1.scheduleTR['+(i-1)+'].countryCodeName')[0];
				var taxIdentificationNo = document.getElementsByName('scheduleTR1.scheduleTR['+(i-1)+'].taxIdentificationNo')[0];
				sectionClaimed[countryCode.value+'_'+taxIdentificationNo.value] = document.getElementsByName('scheduleTR1.scheduleTR['+(i-1)+'].relavantArticleDTAA')[0].value;
				trTable.deleteRow(3);
			}
		}
		sectionClaimed[document.getElementsByName('scheduleTR1.scheduleTR[0].countryCodeName')[0].value+'_'+document.getElementsByName('scheduleTR1.scheduleTR[0].taxIdentificationNo')[0].value] = document.getElementsByName('scheduleTR1.scheduleTR[0].relavantArticleDTAA')[0].value;
		
		document.getElementsByName('scheduleTR1.scheduleTR[0].countryCode')[0].value='';
		document.getElementsByName('scheduleTR1.scheduleTR[0].taxIdentificationNo')[0].value='';
		document.getElementsByName('scheduleTR1.scheduleTR[0].taxPaidOutsideIndia')[0].value='';
		document.getElementsByName('scheduleTR1.scheduleTR[0].taxReliefOutsideIndia')[0].value='';
		 

	} catch (e) {
		alert('Error in deleteTRRow:' + e);
	}
}

// Add Row for Schedule TR.
function addSchTRRow(countryCodeName, taxIdentificationNo, taxPaidOutsideIndia,taxReliefOutsideIndia) {
	try {
		var tableId = document.getElementById('scheduleTR');
		var mainTable = document.getElementById('scheduleTR').rows;
		var noOfRows = tableId.rows.length;
		var toInsertBefore = document.getElementById('scheduleTRLastRow');

		var lastIndex = eval(parseInt(noOfRows, 10) - 3);

		var cloneNode = mainTable[lastIndex].cloneNode(true);
		var newSlNo = cloneNode.cells[0].textContent;

		var iterate = eval(parseInt(newSlNo, 10) - 1);

		cloneNode.cells[0].innerHTML = eval(parseInt(newSlNo, 10) + 1);
		var inputTags = cloneNode.getElementsByTagName('input');
		var selectTags = cloneNode.getElementsByTagName('select');
		for ( var a = 0; a < inputTags.length; a++) {
			inputTags[a].name = inputTags[a].name.replace('[' + iterate + ']','[' + (lastIndex - 1) + ']');

			inputTags[a].id = inputTags[a].name.replace(/([\.\[\]])/g, '_').replace(/(__)/g, '_');

			inputTags[0].value = countryCodeName;

			inputTags[3].value = taxIdentificationNo;

			inputTags[4].value = parseInt(taxPaidOutsideIndia, 10);
			inputTags[5].value = parseInt(taxReliefOutsideIndia, 10);

			var blurAttr = inputTags[a].getAttribute('onblur');
			if (blurAttr != null) {
				blurAttr = blurAttr + ";";
			} else {
				blurAttr = "";
			}
			inputTags[a].setAttribute('onblur', blurAttr+ 'j.blur(this,this.name,this.value);');
		}

		for ( var a = 0; a < selectTags.length; a++) {
			selectTags[a].name = selectTags[a].name.replace('[' + iterate + ']', '[' + (lastIndex - 1) + ']');
			selectTags[a].id = selectTags[a].name.replace(/([\.\[\]])/g, '_').replace(/(__)/g, '_');
			
			var blurAttr = inputTags[a].getAttribute('onblur');
			if (blurAttr != null) {
				blurAttr = blurAttr + ";";
			} else {
				blurAttr = "";
			}
			selectTags[a].setAttribute('onblur', blurAttr+ 'j.blur(this,this.name,this.value);');
		}
		document.getElementById('scheduleTR').getElementsByTagName('tr')[0].parentNode.insertBefore(cloneNode, toInsertBefore);
		
	} catch (e) {
		alert('addSchTRRow' + e);
	}
}

// Validate Schedule TR on Load.
function schTRonLoad() {
	
	var fsiTable = document.getElementById('scheduleFSI');
	var noRows = (fsiTable.rows.length-4)/6;
	
	for(var i=0;i<noRows;i++) {
		var index = document.getElementsByName('itrScheduleFSI.scheduleFSI['+i+'].countryCode')[0].selectedIndex;
		var countryCodeName = document.getElementsByName('scheduleTR1.scheduleTR['+i+'].countryCodeName')[0];
		
		countryCodeName.value = document.getElementsByName('itrScheduleFSI.scheduleFSI['+i+'].countryCode')[0].options[index].text;
		
		if(countryCodeName.value == "Select"){
			countryCodeName.value = '';
		}
	}
	totAmtOfSchedTRFor6();
}


// Check HP Share of Property.
function CheckHPShareProperty(){
	var totHp=eval(parseInt(document.getElementById('scheduleHPLast').cells[0].textContent)-1);
		
	for(var i=0;i<totHp;i++){
		
		if(document.getElementsByName('scheduleHP.propertyDetails['+i+'].propCoOwnedFlg')[0].value=='YES') {
			var count = i;
			var AssessPerc = document.getElementsByName('scheduleHP.propertyDetails['+i+'].asseseeShareProperty')[0];
			var tab = document.getElementById('scheduleHP'+(++count));
		
			var sumOfCoOwner = parseFloat('0');
			
			var rowCount = tab.rows.length;
			
			for(var k=0;k<rowCount-2;k++) {
				
				sumOfCoOwner = sumOfCoOwner + (mulFloatBy100(document.getElementsByName('scheduleHP.propertyDetails['+i+'].coOwners['+k+'].percentShareProperty')[0].value));
			}
			
			if(checkHPShareSum((parseInt(sumOfCoOwner)+mulFloatBy100(AssessPerc.value))/100)){
				addErrorXHTML(AssessPerc,'Sum of Assessee Percentage and Co-owner(s) Percentage should be equal to 100 percent',true);
				j.setFieldError('scheduleHP.propertyDetails['+i+'].asseseeShareProperty','Sum of Assessee Percentage and Co-owner(s) Percentage should be equal to 100 percent');
			}
		}
	}
}

// Check total % sum.
function checkHPShareSum(total) {
	if(total>=99.9 && total<=100) {
		return false;
	}
	return true;
}

// Enable Schedule OS Others Section.
function enableScheduleOSOther(){
	var tabl = document.getElementById('schduleOsf');
		var allSelects = tabl.getElementsByTagName('SELECT'); 
		for(var i = 0; i < allSelects.length; i++) {	
				var name = allSelects[i].name;
				var index = name.substring(name.indexOf('[')+1, name.indexOf(']'));
				if(allSelects[i].value=='Others'){
					document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ index +'].otherDesc')[0].style.display='';
				} else {
					document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ index +'].otherDesc')[0].style.display='none';
					document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+ index +'].otherDesc')[0].value='';
				}
		}
	}

// Enable 54GBCompany PAN Field in HTML.
function enable54GBCompanyPAN() {
	var tab = document.getElementById('schduleCGDed');
	var inputs = tab.getElementsByTagName('SELECT');
	var tempPAN = '';
	if(document.getElementsByName('scheduleCGPost45.deducClaimInfo.deductPAN')[0].value != null && document.getElementsByName('scheduleCGPost45.deducClaimInfo.deductPAN')[0].value != undefined) {
		tempPAN = document.getElementsByName('scheduleCGPost45.deducClaimInfo.deductPAN')[0].value;
	}
	for(var i=0; i<inputs.length; i++){
		if(inputs[i].name.match('deductedSecCode$')){
			
			if( inputs[i].value == '54GB' ) {
				document.getElementsByName('scheduleCGPost45.deducClaimInfo.deductPAN')[0].readOnly=false;
				document.getElementsByName('scheduleCGPost45.deducClaimInfo.deductPAN')[0].value=tempPAN;
				break;
			} else {
				document.getElementsByName('scheduleCGPost45.deducClaimInfo.deductPAN')[0].readOnly=true;
				document.getElementsByName('scheduleCGPost45.deducClaimInfo.deductPAN')[0].value='';
			}
		}
	}
	
}

// Valiadate BFLA Mismatch.
function CheckBFLAUDMismatch(){
if(coalescePath('scheduleBFLA.totalBFLossSetOff.totUnabsorbedDeprSetoff') 
		!= coalescePath('itrScheduleUD.totalamtDepCurYr')){
		addErrorXHTML(document.getElementsByName('itrScheduleUD.totalamtDepCurYr')[0],
			'This figure must match with Total of brought forward loss set off in BFLA',true);
		j.setFieldError('itrScheduleUD.totalamtDepCurYr',
			'This figure must match with Total of brought forward loss set off in BFLA');
	}
	
	
	if(coalescePath('scheduleBFLA.totalBFLossSetOff.totAllUs35Cl4Setoff') 
		!= coalescePath('itrScheduleUD.amountASACYIncome')){
		addErrorXHTML(document.getElementsByName('itrScheduleUD.amountASACYIncome')[0],
			'This figure must match with Total of brought forward loss set off in BFLA',true);
		j.setFieldError('itrScheduleUD.amountASACYIncome',
			'This figure must match with Total of brought forward loss set off in BFLA');
	}
}

// Validate Schedule FSI.
function validateFSI() {
	var table=document.getElementById('scheduleFSI');
    var noOfRows=table.rows.length;
    var indexValue=eval(((parseInt(noOfRows,10)-4)/6));
    var empty1,empty2,empty3,empty4;
    for(var i=0;i<indexValue;i++){	
		if(document.getElementsByName('itrScheduleFSI.scheduleFSI['+i+'].countryCode')[0].value!=''){
		var empty = true;
			var errors = ['Income from outside India(included in PART B-TI) is required',
			              'Tax paid outside India is required',
						  'Tax payable on such income under normal provisions in India is required',
			              'Relevant article of DTAA if relief claimed u/s 90 or 90A is required'];
			empty1 = empty && !validateAllFilled(['itrScheduleFSI.scheduleFSI['+i+'].incFromSal.incFrmOutsideInd',
			                                     'itrScheduleFSI.scheduleFSI['+i+'].incFromSal.taxPaidOutsideInd',
			                                     'itrScheduleFSI.scheduleFSI['+i+'].incFromSal.taxPayableinInd',
			                                     'itrScheduleFSI.scheduleFSI['+i+'].incFromSal.dtaaReliefUs90or90A'],errors);
			empty2 = empty && !validateAllFilled(['itrScheduleFSI.scheduleFSI['+i+'].incFromHP.incFrmOutsideInd',
			                                     'itrScheduleFSI.scheduleFSI['+i+'].incFromHP.taxPaidOutsideInd',
			                                     'itrScheduleFSI.scheduleFSI['+i+'].incFromHP.taxPayableinInd',
			                                     'itrScheduleFSI.scheduleFSI['+i+'].incFromHP.dtaaReliefUs90or90A'],errors);
			empty3 = empty && !validateAllFilled(['itrScheduleFSI.scheduleFSI['+i+'].incCapGain.incFrmOutsideInd',
			                                     'itrScheduleFSI.scheduleFSI['+i+'].incCapGain.taxPaidOutsideInd',
			                                     'itrScheduleFSI.scheduleFSI['+i+'].incCapGain.taxPayableinInd',
			                                     'itrScheduleFSI.scheduleFSI['+i+'].incCapGain.dtaaReliefUs90or90A'],errors);
			empty4 = empty && !validateAllFilled(['itrScheduleFSI.scheduleFSI['+i+'].incOthSrc.incFrmOutsideInd',
			                                     'itrScheduleFSI.scheduleFSI['+i+'].incOthSrc.taxPaidOutsideInd',
			                                     'itrScheduleFSI.scheduleFSI['+i+'].incOthSrc.taxPayableinInd',
			                                     'itrScheduleFSI.scheduleFSI['+i+'].incOthSrc.dtaaReliefUs90or90A'],errors);
			empty5 = empty && !validateAllFilled(['itrScheduleFSI.scheduleFSI['+i+'].incFromBusiness.incFrmOutsideInd',
			                                     'itrScheduleFSI.scheduleFSI['+i+'].incFromBusiness.taxPaidOutsideInd',
			                                     'itrScheduleFSI.scheduleFSI['+i+'].incFromBusiness.taxPayableinInd',
			                                     'itrScheduleFSI.scheduleFSI['+i+'].incFromBusiness.dtaaReliefUs90or90A'],errors);
			if(empty1&&empty2&&empty3&&empty4&&empty5){
	            j.setFieldError('itrScheduleFSI.scheduleFSI['+i+'].incFromSal.incFrmOutsideInd','Please fill atleast one income');
	            addErrorXHTML(document.getElementsByName('itrScheduleFSI.scheduleFSI['+i+'].incFromSal.incFrmOutsideInd')[0],'Please fill atleast one income',true);
			}
		}
    }
}

// Validate All fields before Save / Submit.
function validateAllFilled(fieldNames,errors){
	var fields = [];
	var filled = 0;
	for(var i=0; i<fieldNames.length; i++){
		fields[i] = document.getElementsByName(fieldNames[i])[0];
		if(fields[i].value!='' && fields[i].value!=undefined){
			filled++;
		}
	}
	if(filled>0){
		for(var i=0; i<fieldNames.length; i++){
			if(fields[i].value=='' || fields[i].value==undefined){
				if(i==fieldNames.length-1){
					if(Math.min(coalesce(fields[1].value),coalesce(fields[2].value)) == parseInt(0)){
						continue;
					}
				}
	            j.setFieldError(fieldNames[i],errors[i]);
	            addErrorXHTML(fields[i],errors[i],true);
	            break;
			}
		}		
		return true;
	}
	return false;
}

// Check Amount in Haands of Spouse based on Schedule TDS2 and TDS3.
function checkEmptyAmtSpouse(){
var tab = document.getElementById('scheduleTDS2');
var allInputTags = tab.getElementsByTagName('INPUT');

var tab3 = document.getElementById('scheduleTDS3');
var allInputTags3 = tab3.getElementsByTagName('INPUT');

var portuVal = document.getElementsByName('partAGEN1.filingStatus.portugeseCC5A')[0].value;
var isRowBlank = checkRowBlank('scheduleTDS2', 3, 2);
var isRowBlankTDS3=checkRowBlank('scheduleTDS3', 3, 2);
	if(portuVal=='Y' && isRowBlank == false){
			for(var i = 0; i < allInputTags.length; i++) {
				if (allInputTags[i].name.match("claimSpouseHands$")) {
						if(allInputTags[i].value==''){
							addError(allInputTags[i],' Amount claimed in the hands  of spouse is mandatory as the assessee is governed by Portuguese Civil Code under Sec 5A. In case of nil amount, please enter zero',true);
							j.setFieldError(allInputTags[i].name,'Amount claimed in the hands  of spouse is mandatory as the assessee is governed by Portuguese Civil Code under Sec 5A. In case of nil amount, please enter zero');
						}
					}
				}
		}
                
                
                
               if(portuVal=='Y' && isRowBlankTDS3 == false){
			for(var k = 0; k < allInputTags3.length; k++) {
				if (allInputTags3[k].name.match("claimSpouseHands$")) {
						if(allInputTags3[k].value==''){
							addError(allInputTags3[k],' Amount claimed in the hands  of spouse is mandatory as the assessee is governed by Portuguese Civil Code under Sec 5A. In case of nil amount, please enter zero',true);
							j.setFieldError(allInputTags3[k].name,'Amount claimed in the hands  of spouse is mandatory as the assessee is governed by Portuguese Civil Code under Sec 5A. In case of nil amount, please enter zero');
						}
					}
				}
		}
                
}

// Set hidden Fields for Schedule 80G.
function setSch80HiddenField(tableId,SecDesc){
	var tab = document.getElementById(tableId);
	var inputs = tab.getElementsByTagName('INPUT');
	
	for(var i=0;i<inputs.length;i++){
		
		if(inputs[i].name.match('SectionDesc$')){
			inputs[i].value=SecDesc;
		}
	}
	
}


// Enable / Disable Receipt No, Filed Date based on Return filed under Section.
function revisedSetFor6OnLoad(section,type){

    var fileSec=document.getElementsByName(section)[0].value;
    var fileType=document.getElementsByName(type)[0];

	if(fileSec=='17' && fileType.value!='R'){

		document.getElementsByName(type)[0].value='R';
		
		document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].disabled=false;
		document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].disabled=false;

		document.getElementsByName("partAGEN1.filingStatus.noticeNo")[0].value='';
		document.getElementsByName("partAGEN1.filingStatus.noticeNo")[0].disabled=true;
		
       }
	   else if(fileSec=='19'){
	   document.getElementsByName(type)[0].value='O';
			document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].disabled=false;
			document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].disabled=false;
	   
	   }
	   else if(fileSec=='18'){
	   document.getElementsByName(type)[0].value='O';
			document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].disabled=false;
			document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].disabled=false;
	   
	   }
       else if(fileSec !='17' || fileType.value!='R'){
		   document.getElementsByName(type)[0].value='O';
			document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].disabled=true;
			document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].disabled=true;
       }
           if(fileSec=='18') {
               document.getElementsByName("partAGEN1.filingStatus.noticeNo")[0].disabled=false;
				document.getElementsByName("partAGEN1.filingStatus.receiptNo")[0].disabled=false;
				document.getElementsByName("partAGEN1.filingStatus.origRetFiledDate")[0].disabled=false;
           } else {
               document.getElementsByName("partAGEN1.filingStatus.noticeNo")[0].value='';
               document.getElementsByName("partAGEN1.filingStatus.noticeNo")[0].disabled=true;
				document.getElementsByName("partAGEN1.filingStatus.noticeDateUnderSec")[0].disabled=true;

           }
		   if(fileSec=='13' || fileSec=='14' || fileSec=='15' || fileSec=='16' || fileSec=='18' || fileSec=='19'){
		      enableField('partAGEN1.filingStatus.returnFileSec',fileSec,
		'partAGEN1.filingStatus.noticeDateUnderSec'
		);
		   }
}

// Check PL Expenses computed.
function CheckPLExpenses(){
var grossRec = document.getElementsByName('partapl.noBooksOfAccPL.grossReceipt')[0].value;
var grosProf = document.getElementsByName('partapl.noBooksOfAccPL.grossProfit')[0].value;
var expnses = document.getElementsByName('partapl.noBooksOfAccPL.expenses')[0].value;
if((grossRec+grosProf)<=0 && expnses>0){
	addErrorXHTML(document.getElementsByName('partapl.noBooksOfAccPL.expenses')[0],
			'In order claim Expenses, Either Gross Receipts or Gross Profit must be greater than zero',true);
		j.setFieldError('partapl.noBooksOfAccPL.expenses',
			'In order claim Expenses, Either Gross Receipts or Gross Profit must be greater than zero');
}

// Added for Profession

var grossRecProfession = document.getElementsByName('partapl.noBooksOfAccPL.grossReceiptProfession')[0].value;
var grosProfProfession = document.getElementsByName('partapl.noBooksOfAccPL.grossProfitProfession')[0].value;
var expnsesProfession = document.getElementsByName('partapl.noBooksOfAccPL.expensesProfession')[0].value;
if((grossRecProfession+grosProfProfession)<=0 && expnsesProfession>0){
	addErrorXHTML(document.getElementsByName('partapl.noBooksOfAccPL.expenses')[0],
			'In order claim Expenses, Either Gross Receipts or Gross Profit must be greater than zero',true);
		j.setFieldError('partapl.noBooksOfAccPL.expenses',
			'In order claim Expenses, Either Gross Receipts or Gross Profit must be greater than zero');
}


}

// Check for empty Schedule UD.
function checkEmptySchUDAmt(){
var tab1 = document.getElementById('scheduleUD');
var rowCount = tab1.rows.length;
	for(var i = 0; i < rowCount - 5; i++) {
		var assYr = document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].assYr')[0].value;
		if(assYr != '' && assYr != undefined && assYr !=null){
			var amtBFUD = document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].amtBFUD')[0];
			var amountBFUA = document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].amountBFUA')[0];
			
			var amtDepCurYr = document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].amtDepCurYr')[0];
			var amountASACYIncome = document.getElementsByName('itrScheduleUD.scheduleUD['+i+'].amountASACYIncome')[0];
			
			if(amtBFUD.value == ''&& amountBFUA.value == ''){
				addError(amtBFUD,'Please enter amount of brought forward unabsorbed depreciation or Allowance u/s 35(4)',true);
				j.setFieldError(amtBFUD.name,'Please enter amount of brought forward unabsorbed depreciation or Allowance u/s 35(4)');
			} else {
			if(amtBFUD.value>0 && amtDepCurYr.value==''){
				addError(amtDepCurYr,'Please enter amount of depreciation set-off against the current year income u/s 35(4)',true);
				j.setFieldError(amtDepCurYr.name,'Please enter amount of depreciation set-off against the current year income u/s 35(4)');
			}
			if(amountBFUA.value>0 && amountASACYIncome.value==''){
				addError(amountASACYIncome,'Please enter amount of allowance set-off against the current year income u/s 35(4)',true);
				j.setFieldError(amountASACYIncome.name,'Please enter amount of allowance set-off against the current year income u/s 35(4)');
			}
			}
		
		}
	}
}

// Check for Schedule SI Amount.
function checkSIAmount(){
var taxableInc1 = document.getElementsByName('scheduleSI.splCodeRateTax[0].taxableInc')[0]; taxableInc1.value = coalesce(taxableInc1.value);
var splRateInc1 = document.getElementsByName('scheduleSI.splCodeRateTax[0].splRateInc')[0]; splRateInc1.value = coalesce(splRateInc1.value);
if(parseInt(taxableInc1.value,10) > parseInt(splRateInc1.value,10)){
			addError(taxableInc1,'Taxable Income after adjusting cannot be greater than Income shown in Schedule OS',true);
			j.setFieldError(taxableInc1.name,'Taxable Income after adjusting cannot be greater than Income shown in Schedule OS');
		}
}



// Validate Pure Schedule SI Tax.
function calculatePureSITax(){
	
	var rowCount1=countRowInTable('scheduleSI.splCodeRateTax','splRateInc');
	var sum = 0;
	var sumWithDtaa = 0;
	for(var i = 0; i < rowCount1; i++) {

		var section = document.getElementsByName('scheduleSI.splCodeRateTax[' + i +'].secCode')[0].value;
		
		if(section=='1A'||section=='21'||section=='22'||section=='21ciii'||section=='5AC1c'||section=='5ACA1b'||section=='5ADii'||section=='5ADiii'||section=='5Eacg'||section=='5AD1biip'||section=='5Eb'){
			sum = parseInt(sum) + parseInt(document.getElementsByName('scheduleSI.splCodeRateTax['+i+'].splRateIncTax')[0].value); 
		}
			
	}
	sumWithDtaa = sum;
	return parseInt(sumWithDtaa);
	
}

// Calculate Virtual Tax Payable on PartB-TI.
function calcVirtualTaxPayableOnTI(){
	 try{
	 var totInc = document.getElementsByName('partBTI.aggregateIncome')[0];
	 var presInc44AD = document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44AD')[0]; 
	 presInc44AD.value = coalesce(parseInt(presInc44AD.value,10));


	 var age = calcAge();
	
	 var resStatus=document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0].value;
		var virtualTotInc=parseInt('0',10);;
		if(resStatus=='RES' || resStatus=='NOR'){
			//virtualTotInc = eval(parseInt(totInc.value,10) - parseInt( presInc44AD.value ,10)); // new changes done.
			virtualTotInc = parseInt(totInc.value,10);
		}else{
			virtualTotInc = parseInt(totInc.value,10);
		}
		
	  var virtualTaxPayable;
		var status = document.getElementsByName('partAGEN1.personalInfo.status')[0].value;
		if((status=='I') && (resStatus == 'RES' || resStatus=='NOR') && ( eval(age)> eval(59) ) &&  (eval(age) <= eval(79))){
			if ( eval(virtualTotInc) <= eval('300000')){
				virtualTaxPayable = '0';
			} else {
				if((eval(virtualTotInc) >= eval('300001')) && (eval(virtualTotInc) <= eval('500000'))){
					var temp = (eval(virtualTotInc) - eval ('300000')) * eval('0.10');
					virtualTaxPayable = Math.round(eval(temp));
				} else if((eval(virtualTotInc) >= eval('500001')) && (eval(virtualTotInc) <= eval('1000000'))) {
					var temp = (eval(virtualTotInc) - eval ('500000')) * eval('0.20');
					virtualTaxPayable = Math.round(eval(temp) + eval('20000'));
				} else if(eval(virtualTotInc) >= eval('1000001')) {
					var temp = (eval(virtualTotInc) - eval ('1000000')) * eval('0.30');
					virtualTaxPayable = Math.round(eval(temp) + eval('120000'));
				}
			}
		} else if((status=='I') && (resStatus == 'RES' || resStatus=='NOR') &&  ( eval(age)> eval(79))){
			if ( eval(virtualTotInc) <= eval('500000')){
				virtualTaxPayable = '0';
			} else {
				if((eval(virtualTotInc) >= eval('500001')) && (eval(virtualTotInc) <= eval('1000000'))){
					var temp = (eval(virtualTotInc) - eval ('500000')) * eval('0.20');
					virtualTaxPayable = Math.round(eval(temp));
				}
				else if(eval(virtualTotInc) >= eval('1000001')) {
					var temp = (eval(virtualTotInc) - eval ('1000000')) * eval('0.30');
					virtualTaxPayable = Math.round(eval(temp) + eval('100000'));
				}
			}
		}else {
			if ( eval(virtualTotInc) <= eval('250000')){
				virtualTaxPayable = '0';
			} else {
				if((eval(virtualTotInc) >= eval('250001')) && (eval(virtualTotInc) <= eval('500000'))){
					var temp = (eval(virtualTotInc) - eval ('250000')) * eval('0.10');
					virtualTaxPayable = Math.round(eval(temp));  
				} else if((eval(virtualTotInc) >= eval('500001')) && (eval(virtualTotInc) <= eval('1000000'))) {
					var temp = (eval(virtualTotInc) - eval ('500000')) * eval('0.20');
					virtualTaxPayable = Math.round(eval(temp) + eval('25000')); 
				} else if(eval(virtualTotInc) >= eval('1000001')) {
					var temp = (eval(virtualTotInc) - eval ('1000000')) * eval('0.30');
					virtualTaxPayable = Math.round(eval(temp) + eval('125000'));
				}
			}
		}
		var rebate87A = document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.rebate87A')[0].value;  
		rebate87A = coalesce(parseInt(rebate87A,10));
		
		
		surcharge = coalesce(parseInt(surcharge));
		virtualTaxPayable= parseInt(virtualTaxPayable) - parseInt(document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.rebateOnAgriInc')[0].value) + parseInt(document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxAtSpecialRates')[0].value);
		var virtualEduCess= Math.round(eval(parseInt(virtualTaxPayable,10)-parseInt(rebate87A) + parseInt(surcharge))* eval('0.03'));
		var virtualTotalTaxWithEduCess = eval(parseInt(virtualTaxPayable)) + parseInt(surcharge) + eval(parseInt(virtualEduCess))-parseInt(rebate87A);
		

		var sec899091 = document.getElementsByName('partBTTI.computationOfTaxLiability.taxRelief.totTaxRelief')[0]; sec899091.value = coalesce(sec899091.value);
		var virtualBalTaxPayable = Math.round(eval(parseInt(virtualTotalTaxWithEduCess ,10)-parseInt(sec899091.value ,10)));

		
		if(virtualBalTaxPayable < eval('0')) {
			virtualBalTaxPayable = '0';
		}
		
		return parseInt(virtualBalTaxPayable);
		}catch(e){
			alert('Exception in calcVirtualTaxPayableOnTI = ' + e.stack);
		}
}

// mandatory Field A6.
function mandateA6()
{
	var valueA13=document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.saleofLandBuild.fullConsideration50C')[0].value;
	var valueAb4=document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.saleofLandBuild.deductSec48.totalDedn')[0].value;
	var valueA1d=document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.saleofLandBuild.exemptionOrDednUs54')[0].value;
	

	var valueA2ia=document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.equityMFonSTT[0].fullConsideration')[0].value;
	var valueA2b4=document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.equityMFonSTT[0].deductSec48.totalDedn')[0].value;
	var valueA2d=document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.equityMFonSTT[0].lossSec94of7Or94of8')[0].value;
	

	var valueA3a=document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRITransacSec48Dtl.nRItaxSTTPaid')[0].value;
	var valueA3b=document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRITransacSec48Dtl.nRItaxSTTNotPaid')[0].value;
	
	
	var valueA4a=document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.fullConsideration')[0].value;
	var valueA44=document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.deductSec48.totalDedn')[0].value;
	var valueA4d=document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.capgainonAssets')[0].value;
	
	
	var valueA5a=document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.saleOnOtherAssets.fullConsideration')[0].value;
	var valueA54=document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.saleOnOtherAssets.deductSec48.totalDedn')[0].value;
	var valueA5d=document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.saleOnOtherAssets.capgainonAssets')[0].value;

	var valueA6=document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54.totAmtStcgUnderDtaa')[0].value;
	//var valueA8=document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.amtDeemedCGDepAssets')[0];
	
	var valueSTCG= valueA13+valueAb4+valueA1d+valueA2ia+valueA2b4+valueA2d+valueA3a+valueA3b+valueA4a+valueA44+valueA4d+valueA5a+valueA54+valueA5d+valueA6;
	
	

	var fieldSTCG=document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unutilizedCapgainFlag')[0];

	var fieldLTCG=document.getElementsByName('scheduleCGPost45.LongTermCapGainPost45.unutilizedCapgainFlag')[0];
	if(valueSTCG >0 && fieldSTCG.value=="")
	{			
		j.setFieldError('scheduleCGPost45.shortTermCapGainPost45.unutilizedCapgainFlag','Please select whether any amount of unutilized capital gain on asset transferred during the previous years in A7a of Schedule CG');		
		addErrorXHTML(fieldSTCG,'Please select whether any amount of unutilized capital gain on asset transferred during the previous years in A7 of Schedule CG',true);
	}
	if(valueSTCG>0 && fieldLTCG.value=='')
	{
		addErrorXHTML(fieldLTCG,'Please select whether any amount of unutilized capital gain on asset transferred during the previous years in B9 of Schedule CG',true);
		j.setFieldError('scheduleCGPost45.LongTermCapGainPost45.unutilizedCapgainFlag','Please select whether any amount of unutilized capital gain on asset transferred during the previous years in B9 of Schedule CG');
	}
	
}

// Mandatory Field B8.
function mandateB8()
{
	
	var valueBa3=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofLandBuild.fullConsideration50C')[0].value;
	var valueB1d=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofLandBuild.exemptionOrDednUs54')[0].value;
	
	var valueB2a=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofBondsDebntr.fullConsideration')[0].value;
	var valueBb4=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofBondsDebntr.deductSec48.totalDedn')[0].value;
	var valueB2d=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofBondsDebntr.exemptionOrDednUs54')[0].value;
	
	var valueB3a=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.proviso112Applicable[0].fullConsideration')[0].value;
	var valueB34=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.proviso112Applicable[0].deductSec48.totalDedn')[0].value;
	var valueB3d=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.proviso112Applicable[0].exemptionOrDednUs54S')[0].value;
	
	var valueB4a=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIProvisoSec48.ltcgWithoutBenefit')[0].value;
	var valueB4b=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIProvisoSec48.exemptionOrDednUs54')[0].value;
	
	var valueB5a=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115[0].fullConsideration')[0].value;
	var valueB54=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115[0].deductSec48.totalDedn')[0].value;
	var valueB5d=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115[0].exemptionOrDednUs54S')[0].value;
	
	var valueB6a=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.saleonSpecAsset')[0].value;
	var valueB6b=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.dednSpecAssetus115')[0].value;
	var valueB6d=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.saleOtherSpecAsset')[0].value;
	var valueB6e=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.dednOtherSpecAssetus115')[0].value;
	
	var valueB7a=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofAssetNA.deductSec48.fullConsideration')[0].value;
	var valueB74=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofAssetNA.deductSec48.totalDedn')[0].value;
	var valueB7d=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofAssetNA.exemptionOrDednUs54S')[0].value;
	
	
	var valueB9=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.ltcgUnderDtaa.totAmtLtcgUnderDtaa')[0].value;
	
	var valueB8=document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.stcgUnderDtaa.totAmtStcgUnderDtaa')[0].value;
	
	var fieldLTCG=document.getElementsByName('scheduleCGPost45.LongTermCapGainPost45.unutilizedCapgainFlag')[0];
	
	var valueLTCG=valueBa3+valueBb4+valueB1d+valueB2a+valueBb4+valueB2d+valueB3a+valueB34+valueB3d+valueB4a+valueB4b+valueB5a+valueB54+valueB5d+valueB6a+valueB6b+valueB6d+valueB6e+valueB7a+valueB74+valueB7d+valueB9+valueB8;
	
	var fieldSTCG=document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unutilizedCapgainFlag')[0];
	
	if((valueLTCG!=null || valueLTCG!=undefined ) && valueLTCG >0 && fieldLTCG.value=="")
	{			
			addErrorXHTML(fieldLTCG,'Please select whether any amount of unutilized capital gain on asset transferred during the previous years in B9 of Schedule CG',true);
			j.setFieldError('scheduleCGPost45.LongTermCapGainPost45.unutilizedCapgainFlag','Please select whether any amount of unutilized capital gain on asset transferred during the previous years in B9 of Schedule CG');
	}
	if(valueLTCG>0 && fieldSTCG.value=='')
	{
		j.setFieldError('scheduleCGPost45.shortTermCapGainPost45.unutilizedCapgainFlag','Please select whether any amount of unutilized capital gain on asset transferred during the previous years in A7a of Schedule CG');		
		addErrorXHTML(fieldSTCG,'Please select whether any amount of unutilized capital gain on asset transferred during the previous years in A7 of Schedule CG',true);
	}
}

// Calculate a6 Total Sum.
function calCGA6TotalSum() {

	var tab1 = document.getElementById('scheduleStcgunUtilizedCapGain54');
    var noOfRows=tab1.rows.length;
	var sum = 0;
	for ( var i = 0; i < (noOfRows-4); i++) {
		var amt = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54['+i+'].amountUnUtilized')[0].value;
			sum = eval(parseInt(sum,10) + parseInt(coalesce(amt),10));
		}
	var total = eval(parseInt(sum,10) 
				+ parseInt(coalesce(document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54B.amountUnUtilized')[0].value),10)
				+ parseInt(coalesce(document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54.amtDeemedStcg')[0].value),10));
	document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54.totAmtStcgUnderDtaa')[0].value = total;
}

// Calculate Point B8 Total.
function calCGPointB8Total() {

	var tab1 = document.getElementById('scheduleLtcgunUtilizedCapGain54');
    var noOfRows=tab1.rows.length;
	var sum = 0;
	for ( var i = 0; i < (noOfRows-4); i++) {
		var amt = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54['+i+'].amountUnUtilized')[0].value;
			sum = eval(parseInt(sum,10) + parseInt(coalesce(amt),10));
	}
	var total = eval(parseInt(sum,10) 
				+ parseInt(coalesce(document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54B.amountUnUtilized')[0].value),10)
				+ parseInt(coalesce(document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54.amtDeemedLtcg')[0].value),10));
	document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.stcgUnderDtaa.totAmtStcgUnderDtaa')[0].value = total;
}

// Enable / Disable Table.
function enableTable(element, value, tableId){

	var flag =document.getElementsByName(element)[0].value;
	var tabId = "#"+tableId;
		
	$(tabId).find(':input').prop('disabled', true);
	$(tabId).find('.addbtn').prop('hidden', true);
	
	if(flag==value){
			$(tabId).find('.addbtn').prop('hidden', false);
			$(tabId).find(':input').prop('disabled', false);
		}else{
			$(tabId).find('[type=\"checkbox\"]').attr('checked','checked');
			if(tableId == 'scheduleLtcgunUtilizedCapGain54' || tableId == 'scheduleStcgunUtilizedCapGain54') {
				deleteRowTable(tableId,2,2);
			} else {
				deleteRowTable(tableId,2,1);
			}
			$(tabId).find(':input').prop('disabled', true);
			$(tabId).find('.addbtn').prop('hidden', true);
		}
}

// Enable / Disable Table for NRI.
function enableTableForNRI(element, value, tableId){

	var flag =document.getElementsByName(element)[0].value;
	var tabId = "#"+tableId;
		
	$(tabId).find(':input').prop('disabled', true);
	$(tabId).find('.addbtn').prop('hidden', true);
	
	if(flag==value){
			$(tabId).find('.addbtn').prop('hidden', false);
			$(tabId).find(':input').prop('disabled', false);
		}else{
			$(tabId).find('[type=\"checkbox\"]').attr('checked','checked');
			deleteRowTable(tableId,1,1);
			$(tabId).find(':input').prop('disabled', true);
			$(tabId).find('.addbtn').prop('hidden', true);
		}
}

// Enable Table Without CB.
function enableTableWithOutCB(element, value, tableId){
	var flag =document.getElementsByName(element)[0].value;
	var tabId = "#"+tableId;
	if(flag!=value){
		if(tableId == 'scheduleStcgunUtilizedCapGain54B'){
			document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54B.yearConst')[0].value = '';
			document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54B.amountUtilized')[0].value = ''; 
			document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54B.amountUnUtilized')[0].value = '';
			document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54.totAmtStcgUnderDtaa')[0].value = '0';
			
		}else if(tableId == 'scheduleLtcgunUtilizedCapGain54B'){
			document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54B.yearConst')[0].value = '';
			document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54B.amountUtilized')[0].value = ''; 
			document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54B.amountUnUtilized')[0].value = '';
			document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.stcgUnderDtaa.totAmtStcgUnderDtaa')[0].value = '0';
		}
		$(tabId).find(':input').prop('disabled', false);
		$(tabId).find('.addbtn').prop('hidden', false);
	}else{
		$(tabId).find(':input').prop('disabled', true);
		$(tabId).find('.addbtn').prop('hidden', true);
	}
	calCGA6TotalSum();
	calCGPointB8Total();
}

// Validate STCG Section Wise along with DTAA.
function validateSTCGSectionWiseDTAA() {
	var arr = {'A1e':0,'A2c':0,'A3e_111A':0,'A3e_115AD':0,'A4a':0,'A4b':0,'A5e':0,'A6g':0,'A7':0};
	var tab = document.getElementById('scheduleStcgDtaa');
	  var rowCount = tab.rows.length -2;
	  for(var i=0; i<rowCount; i++) {
	    var itemIncluded = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.stcgUnderDtaa['+ i +'].itemIncluded')[0].value;
	    var amount = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.stcgUnderDtaa['+ i +'].amount')[0].value;  
	   if(itemIncluded == 'A1e') {
	       arr['A1e'] = parseInt(arr['A1e'],10) +  parseInt(coalesce(amount),10);
	    } else if(itemIncluded == 'A2c') {
		       arr['A2c'] = parseInt(arr['A2c'],10) +  parseInt(coalesce(amount),10);
		} else if(itemIncluded == 'A4a') {
		       arr['A4a'] = parseInt(arr['A4a'],10) +  parseInt(coalesce(amount),10);
		} else if(itemIncluded == 'A4b') {
		       arr['A4b'] = parseInt(arr['A4b'],10) +  parseInt(coalesce(amount),10);
		} else if(itemIncluded == 'A5e') {
		       arr['A5e'] = parseInt(arr['A5e'],10) +  parseInt(coalesce(amount),10);
		} else if(itemIncluded == 'A6g') {
		       arr['A6g'] = parseInt(arr['A6g'],10) +  parseInt(coalesce(amount),10);
		} else if(itemIncluded == 'A3e_111A') {
			   arr['A3e_111A'] = parseInt(arr['A3e_111A'],10) +  parseInt(coalesce(amount),10);
		} else if(itemIncluded == 'A3e_115AD') {
		       arr['A3e_115AD'] = parseInt(arr['A3e_115AD'],10) +  parseInt(coalesce(amount),10);
		} else if(itemIncluded == 'A7') {
		       arr['A7'] = parseInt(arr['A7'],10) +  parseInt(coalesce(amount),10);
		} 
	  }
	
	var table = document.getElementById('scheduleStcgDtaa');
	var rowCount = table.rows.length -2;
	
	var dtaaSection = [];
	
	for(var i=0; i<rowCount; i++) {
		var itemIncluded = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.stcgUnderDtaa['+ i +'].itemIncluded')[0].value;
		if(itemIncluded != '' && dtaaSection.indexOf(itemIncluded) == -1) {
			dtaaSection.push(itemIncluded);
		}
	}
	
	var table1 = document.getElementById('scheduleCGstcg2');
	var rowCount1 = table1.rows.length/10;
	  
	var arrSection2 = [];
	var arrAmount2 = {'1A':0,'5AD1biip':0};
	
	for(var k=0; k<rowCount1; k++) {
	 var section = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.equityMFonSTT['+ k +'].section')[0].value;
	 var amount = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.equityMFonSTT['+ k +'].fullConsideration')[0].value;
		  if(section != '' && arrSection2.indexOf(section) == -1) {
			  arrSection2.push(section);
			  arrAmount2[section] = amount;
			}
	 }
	
	var fullConsideration50C = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.saleofLandBuild.fullConsideration50C')[0];
	if(dtaaSection.indexOf('A1e') != -1 && arr['A1e'] > 0 && fullConsideration50C.value == 0) {
		j.setFieldError('scheduleCGPost45.shortTermCapGainPost45.saleofLandBuild.fullConsideration50C','A1(aiii) value should not be zero as there is an entry in DTAA table.');
		addErrorXHTML(fullConsideration50C,'A1(aiii) value should not be zero as there is an entry in DTAA table.',true);	
	}
	
	var fullConsideration = document.getElementsByName('scheduleCGFor4.shortTermCapGainFor4.capGainSlumpSale.fullConsideration')[0];
	if(dtaaSection.indexOf('A2c') != -1 && arr['A2c'] > 0 && fullConsideration.value == 0) {
		j.setFieldError('scheduleCGFor4.shortTermCapGainFor4.capGainSlumpSale.fullConsideration','A2a value should not be zero as there is an entry in DTAA table.');
		addErrorXHTML(fullConsideration,'A2a value should not be zero as there is an entry in DTAA table.',true);	
	}
	
	
	if(dtaaSection.indexOf('A3e_111A') != -1 && arr['A3e_111A'] > 0 && (arrSection2.indexOf('1A') == -1 || arrAmount2['1A'] == 0)) {
		j.setFieldError('scheduleCGPost45.shortTermCapGainPost45.equityMFonSTT[0].section','111A section in A3 should be selected and amount should not be zero, as there is an entry in DTAA table.');
		addErrorXHTML(document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.equityMFonSTT[0].section')[0],'111A section in A3 should be selected and amount should not be zero, as there is an entry in DTAA table.',true);
	}
	
	if(dtaaSection.indexOf('A3e_115AD') != -1 && arr['A3e_115AD'] > 0 && (arrSection2.indexOf('5AD1biip') == -1 || arrAmount2['5AD1biip'] == 0)) {
		j.setFieldError('scheduleCGPost45.shortTermCapGainPost45.equityMFonSTT[0].section','115AD(1)(b)(ii) section in A3 should be selected and amount should not be zero, as there is an entry in DTAA table.');
		addErrorXHTML(document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.equityMFonSTT[0].section')[0],'115AD(1)(b)(ii) section in A3 should be selected and amount should not be zero, as there is an entry in DTAA table.',true);	
	}
	
	var nRItaxSTTPaid = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRITransacSec48Dtl.nRItaxSTTPaid')[0];
	if(dtaaSection.indexOf('A4a') != -1 && arr['A4a'] > 0 && nRItaxSTTPaid.value == 0) {
		j.setFieldError('scheduleCGPost45.shortTermCapGainPost45.nRITransacSec48Dtl.nRItaxSTTPaid','A4a value should not be zero as there is an entry in DTAA table.');
		addErrorXHTML(nRItaxSTTPaid,'A4a value should not be zero as there is an entry in DTAA table.',true);	
	}
	
	var nRItaxSTTNotPaid = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRITransacSec48Dtl.nRItaxSTTNotPaid')[0];
	if(dtaaSection.indexOf('A4b') != -1 && arr['A4b'] > 0 && nRItaxSTTNotPaid.value == 0) {
		j.setFieldError('scheduleCGPost45.shortTermCapGainPost45.nRITransacSec48Dtl.nRItaxSTTNotPaid','A4b value should not be zero as there is an entry in DTAA table.');
		addErrorXHTML(nRItaxSTTNotPaid,'A4b value should not be zero as there is an entry in DTAA table.',true);	
	}
	
	var fullConsideration = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.fullConsideration')[0];
	if(dtaaSection.indexOf('A5e') != -1 && arr['A5e'] > 0 && fullConsideration.value == 0) {
		j.setFieldError('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.fullConsideration','A5a value should not be zero as there is an entry in DTAA table.');
		addErrorXHTML(fullConsideration,'A5a value should not be zero as there is an entry in DTAA table.',true);	
	}
	
	var fullConsiderationA6f = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.saleOnOtherAssets.fullConsideration')[0];
	if(dtaaSection.indexOf('A6g') != -1 && arr['A6g'] > 0 && fullConsiderationA6f.value == 0) {
		j.setFieldError('scheduleCGPost45.shortTermCapGainPost45.saleOnOtherAssets.fullConsideration','A6a value should not be zero as there is an entry in DTAA table.');
		addErrorXHTML(fullConsiderationA6f,'A6a value should not be zero as there is an entry in DTAA table.',true);	
	}
	
	var totAmtStcgUnderDtaa = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54.totAmtStcgUnderDtaa')[0];
	if(dtaaSection.indexOf('A7') != -1 && arr['A7'] > 0 && totAmtStcgUnderDtaa.value == 0) {
		j.setFieldError('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54.totAmtStcgUnderDtaa','A7 value should not be zero as there is an entry in DTAA table.');
		addErrorXHTML(totAmtStcgUnderDtaa,'A7 value should not be zero as there is an entry in DTAA table.',true);	
	}
	
}

// Validate LTCG Section-wise along with DTAA.
function validateLTCGSectionWiseDTAA() {
	
	var arr = {'B1e':0,'B2e':0,'B3e':0,'B4e_22':0,'B4e_5ACA1b':0,'B5c':0,'B6e_21ciii':0,'B6e_5AC1c':0,'B6e_5ADiii':0,'B7c':0,'B7f':0,'B8e':0,'B9':0};
	var tab = document.getElementById('scheduleLtcgDtaa');
	  var rowCount = tab.rows.length -2;
	  for(var i=0; i<rowCount; i++) {
	    var itemIncluded = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.ltcgUnderDtaa['+ i +'].itemIncluded')[0].value;
	    var amount = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.ltcgUnderDtaa['+ i +'].amount')[0].value;  
	   if(itemIncluded == 'B1e') {
	       arr['B1e'] = parseInt(arr['B1e'],10) +  parseInt(coalesce(amount),10);
	    } else if(itemIncluded == 'B2e') {
		       arr['B2e'] = parseInt(arr['B2e'],10) +  parseInt(coalesce(amount),10);
		} else if(itemIncluded == 'B3e') {
		       arr['B3e'] = parseInt(arr['B3e'],10) +  parseInt(coalesce(amount),10);
		} else if(itemIncluded == 'B4e_22') {
		       arr['B4e_22'] = parseInt(arr['B4e_22'],10) +  parseInt(coalesce(amount),10);
		} else if(itemIncluded == 'B4e_5ACA1b') {
		       arr['B4e_5ACA1b'] = parseInt(arr['B4e_5ACA1b'],10) +  parseInt(coalesce(amount),10);
		} else if(itemIncluded == 'B5c') {
		       arr['B5c'] = parseInt(arr['B5c'],10) +  parseInt(coalesce(amount),10);
		} else if(itemIncluded == 'B6e_21ciii') {
		       arr['B6e_21ciii'] = parseInt(arr['B6e_21ciii'],10) +  parseInt(coalesce(amount),10);
		} else if(itemIncluded == 'B6e_5AC1c') {
			   arr['B6e_5AC1c'] = parseInt(arr['B6e_5AC1c'],10) +  parseInt(coalesce(amount),10);
		} else if(itemIncluded == 'B6e_5ADiii') {
		       arr['B6e_5ADiii'] = parseInt(arr['B6e_5ADiii'],10) +  parseInt(coalesce(amount),10);
		} else if(itemIncluded == 'B7c') {
		       arr['B7c'] = parseInt(arr['B7c'],10) +  parseInt(coalesce(amount),10);
		} else if(itemIncluded == 'B7f') {
		       arr['B7f'] = parseInt(arr['B7f'],10) +  parseInt(coalesce(amount),10);
		} else if(itemIncluded == 'B8e') {
		       arr['B8e'] = parseInt(arr['B8e'],10) +  parseInt(coalesce(amount),10);
		} else if(itemIncluded == 'B9') {
		       arr['B9'] = parseInt(arr['B9'],10) +  parseInt(coalesce(amount),10);
		}
	  }
	
	var table = document.getElementById('scheduleLtcgDtaa');
	var rowCount = table.rows.length -2;
	
	var dtaaSection = [];
	
	for(var i=0; i<rowCount; i++) {
		var itemIncluded = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.ltcgUnderDtaa['+ i +'].itemIncluded')[0].value;
		if(itemIncluded != '' && dtaaSection.indexOf(itemIncluded) == -1) {
			dtaaSection.push(itemIncluded);
		}
	}

	var fullConsideration50C = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofLandBuild.fullConsideration50C')[0];
	if(dtaaSection.indexOf('B1e') != -1 && arr['B1e'] > 0 && fullConsideration50C.value == 0) {
		j.setFieldError('scheduleCGPost45.longTermCapGainPost45.saleofLandBuild.fullConsideration50C','B1(aiii) value should not be zero as there is an entry in DTAA table.');
		addErrorXHTML(fullConsideration50C,'B1(aiii) value should not be zero as there is an entry in DTAA table.',true);	
	}
	
	var fullConsideration = document.getElementsByName('scheduleCGFor4.shortTermCapGainFor4.capGainSlumpSale.fullConsiderationB')[0];
	if(dtaaSection.indexOf('B2e') != -1 && arr['B2e'] > 0  && fullConsideration.value == 0) {
		j.setFieldError('scheduleCGFor4.shortTermCapGainFor4.capGainSlumpSale.fullConsiderationB','B2a value should not be zero as there is an entry in DTAA table.');
		addErrorXHTML(fullConsideration,'B2a value should not be zero as there is an entry in DTAA table.',true);	
	}
	
	var fullConsiderationB3e = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofBondsDebntr.fullConsideration')[0];
	if(dtaaSection.indexOf('B3e') != -1 && arr['B3e'] > 0  && fullConsiderationB3e.value == 0) {
		j.setFieldError('scheduleCGPost45.longTermCapGainPost45.saleofBondsDebntr.fullConsideration','B3a value should not be zero as there is an entry in DTAA table.');
		addErrorXHTML(fullConsiderationB3e,'B3a value should not be zero as there is an entry in DTAA table.',true);	
	}
	
	var table1 = document.getElementById('scheduleCGltcg3');
	var rowCount1 = table1.rows.length/11;
	  
	var arrSection = [];
	var arrAmount = {'22':0,'5ACA1b':0};
	
	for(var k=0; k<rowCount1; k++) {
	 var sectionCode = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.proviso112Applicable['+k+'].sectionCode')[0].value;
	 var fullConsideration = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.proviso112Applicable['+k+'].fullConsideration')[0].value;
		  if(sectionCode != '' && arrSection.indexOf(sectionCode) == -1) {
			  arrSection.push(sectionCode);
			  arrAmount[sectionCode] = fullConsideration;
			}
	 }
	
	if(dtaaSection.indexOf('B4e_22') != -1 && arr['B4e_22'] > 0 && (arrSection.indexOf('22') == -1 || arrAmount['22'] == 0)) {
		j.setFieldError('scheduleCGPost45.longTermCapGainPost45.proviso112Applicable[0].sectionCode','22 section in B4 should be selected and amount should not be zero, as there is an entry in DTAA table.');
		addErrorXHTML(document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.proviso112Applicable[0].sectionCode')[0],'22 section in B4 should be selected and amount should not be zero, as there is an entry in DTAA table.',true);
	}
	if(dtaaSection.indexOf('B4e_5ACA1b') != -1 && arr['B4e_5ACA1b'] > 0 && (arrSection.indexOf('5ACA1b') == -1 || arrAmount['5ACA1b'] == 0)) {
		j.setFieldError('scheduleCGPost45.longTermCapGainPost45.proviso112Applicable[0].sectionCode','5ACA1b section in B4 should be selected and amount should not be zero, as there is an entry in DTAA table.');
		addErrorXHTML(document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.proviso112Applicable[0].sectionCode')[0],'5ACA1b section in B4 should be selected and amount should not be zero, as there is an entry in DTAA table.',true);
	}
	
	var BalanceCG = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIProvisoSec48.BalanceCG')[0];
	if(dtaaSection.indexOf('B5c') != -1 && arr['B5c'] > 0 && BalanceCG.value == 0) {
		j.setFieldError('scheduleCGPost45.longTermCapGainPost45.nRIProvisoSec48.BalanceCG','B5c value should not be zero as there is an entry in DTAA table.');
		addErrorXHTML(BalanceCG,'B5c value should not be zero as there is an entry in DTAA table.',true);	
	}
	
	
	var table2 = document.getElementById('stcg10pctTab');
	var rowCount2 = table2.rows.length/11;
	  
	var arrSection1 = [];
	var arrAmount1 = {'21ciii':0,'5AC1c':0,'5ADiii':0};
	
	for(var a=0; a<rowCount2; a++) {
	 var sectionCode = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115['+a+'].sectionCode')[0].value;
	 var amount = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115['+a+'].fullConsideration')[0].value;
		  if(sectionCode != '' && arrSection1.indexOf(sectionCode) == -1) {
			  arrSection1.push(sectionCode);
			  arrAmount1[sectionCode] = amount;
			}
	 }
	
	if(dtaaSection.indexOf('B6e_21ciii') != -1 && arr['B6e_21ciii'] > 0 && (arrSection1.indexOf('21ciii') == -1 || arrAmount1['21ciii'] == 0)) {
		j.setFieldError('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115[0].sectionCode','21ciii section in B6 should be selected and amount should not be zero, as there is an entry in DTAA table.');
		addErrorXHTML(document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115[0].sectionCode')[0],'21ciii section in B6 should be selected and amount should not be zero, as there is an entry in DTAA table.',true);
	}
	
	if(dtaaSection.indexOf('B6e_5AC1c') != -1 && arr['B6e_5AC1c'] > 0 && (arrSection1.indexOf('5AC1c') == -1 || arrAmount1['5AC1c'] == 0)) {
		j.setFieldError('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115[0].sectionCode','5AC1c section in B6 should be selected and amount should not be zero, as there is an entry in DTAA table.');
		addErrorXHTML(document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115[0].sectionCode')[0],'5AC1c section in B6 should be selected and amount should not be zero, as there is an entry in DTAA table.',true);
	}
	
	if(dtaaSection.indexOf('B6e_5ADiii') != -1 && arr['B6e_5ADiii'] > 0 && (arrSection1.indexOf('5ADiii') == -1 || arrAmount1['5ADiii'] == 0)) {
		j.setFieldError('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115[0].sectionCode','5ADiii section in B6 should be selected and amount should not be zero, as there is an entry in DTAA table.');
		addErrorXHTML(document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115[0].sectionCode')[0],'5ADiii section in B6 should be selected and amount should not be zero, as there is an entry in DTAA table.',true);
	}
	
	var balonSpeciAsset = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.balonSpeciAsset')[0];
	if(dtaaSection.indexOf('B7c') != -1 && arr['B7c'] > 0 && balonSpeciAsset.value == 0) {
		j.setFieldError('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.balonSpeciAsset','B7c value should not be zero as there is an entry in DTAA table.');
		addErrorXHTML(balonSpeciAsset,'B7c value should not be zero as there is an entry in DTAA table.',true);	
	}
	
	var balOtherthanSpecAsset = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.balOtherthanSpecAsset')[0];
	if(dtaaSection.indexOf('B7f') != -1 && arr['B7f'] > 0 && balOtherthanSpecAsset.value == 0) {
		j.setFieldError('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.balOtherthanSpecAsset','B7f value should not be zero as there is an entry in DTAA table.');
		addErrorXHTML(balOtherthanSpecAsset,'B7f value should not be zero as there is an entry in DTAA table.',true);	
	}
	
	var fullConsiderationB8e = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofAssetNA.deductSec48.fullConsideration')[0];
	if(dtaaSection.indexOf('B8e') != -1 && arr['B8e'] > 0  && fullConsiderationB8e.value == 0) {
		j.setFieldError('scheduleCGPost45.longTermCapGainPost45.saleofAssetNA.deductSec48.fullConsideration','B8a value should not be zero as there is an entry in DTAA table.');
		addErrorXHTML(fullConsiderationB8e,'B8a value should not be zero as there is an entry in DTAA table.',true);	
	}
	
	var totAmtStcgUnderDtaa = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.stcgUnderDtaa.totAmtStcgUnderDtaa')[0];
	if(dtaaSection.indexOf('B9') != -1 && arr['B9'] > 0 && totAmtStcgUnderDtaa.value == 0) {
		j.setFieldError('scheduleCGPost45.longTermCapGainPost45.stcgUnderDtaa.totAmtStcgUnderDtaa','B9 value should not be zero as there is an entry in DTAA table.');
		addErrorXHTML(totAmtStcgUnderDtaa,'B9 value should not be zero as there is an entry in DTAA table.',true);	
	}
}

// Set Values for Schedule CG for Section 54B.
function setValuesCG54B() {

	var yearConstant = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54B.yearConst')[0].value;
	var amountUtilized = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54B.amountUtilized')[0].value;
	var amountUnUtilized = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54B.amountUnUtilized')[0].value;

	if (yearConstant == "" && amountUtilized == "" && amountUnUtilized == "") {
		document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54B.section')[0].value = '';
		document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54B.year')[0].value = '';
	} else {
		document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54B.section')[0].value = '54B';
		document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54B.year')[0].value = '2014-15';
	}

	var tab = document.getElementById('scheduleLtcgunUtilizedCapGain54');
	var rowCount = tab.rows.length - 4;
	for ( var k = 0; k < rowCount; k++) {
		var section = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54['+ k + '].section')[0].value;
		var yearConst = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54['+ k + '].yearConst')[0].value;
		var amountUtilized = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54['+ k + '].amountUtilized')[0].value;
		var amountUnUtilized = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54['+ k + '].amountUnUtilized')[0].value;
		var ay = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.unUtilizedCapGain54['+ k + '].ay')[0];
		if (section == "" && yearConst == "" && amountUtilized == "" && amountUnUtilized == "") {
			ay.value = '';
		} else {
			ay.value = '2013-14';
		}
	}
	
	var yearConstantStcg = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54B.yearConst')[0].value;
	var amountUtilizedStcg = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54B.amountUtilized')[0].value;
	var amountUnUtilizedStcg = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54B.amountUnUtilized')[0].value;

	if (yearConstantStcg == "" && amountUtilizedStcg == "" && amountUnUtilizedStcg == "") {
		document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54B.section')[0].value = '';
		document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54B.year')[0].value = '';
	} else {
		document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54B.section')[0].value = '54B';
		document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54B.year')[0].value = '2014-15';
	}

	var tab1 = document.getElementById('scheduleStcgunUtilizedCapGain54');
	var rowCount1 = tab1.rows.length - 4;
	for ( var k = 0; k < rowCount1; k++) {
		var section = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54['+ k + '].section')[0].value;
		var yearConst = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54['+ k + '].yearConst')[0].value;
		var amountUtilized = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54['+ k + '].amountUtilized')[0].value;
		var amountUnUtilized = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54['+ k + '].amountUnUtilized')[0].value;
		var ay = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54['+ k + '].ay')[0];
		if (section == "" && yearConst == "" && amountUtilized == "" && amountUnUtilized == "") {
			ay.value = '';
		} else {
			ay.value = '2013-14';
		}
	}
}

// Calculate Total Tax for Schedule-IT.
function calculateTotalTaxIT(tableId){
	
	var tab1 = document.getElementById('scheduleIt');
	var noOfRows=tab1.rows.length;
	var sum = 0;
	var amt = 0;
	
	for ( var i = 0; i < (noOfRows-3); i++) {
		amt = document.getElementsByName('scheduleIT.taxPayment['+i+'].amt')[0].value;
		sum = eval(parseInt(sum,10) + parseInt(coalesce(amt),10));
	}
	document.getElementsByName('scheduleIT.taxPayment.totalTaxPayments')[0].value = parseInt(sum,10);	
}

// Calculate Net Agricultural Income for Schedule-EI.
function calculateNetAgricultureIncomeforEI(){
	
	var grossAgriReceipt7B8 = document.getElementsByName('scheduleEI.grossAgriReceipt7B8')[0].value;
	var expendAgriculture = document.getElementsByName('scheduleEI.expendAgriculture')[0].value;
	var expendAgricultureUnabsorbed = document.getElementsByName('scheduleEI.expendAgricultureUnabsorbed')[0].value;
	
	var result = zeroOrMore(zeroOrMore(grossAgriReceipt7B8) - zeroOrMore(expendAgriculture) - zeroOrMore(expendAgricultureUnabsorbed));
	document.getElementsByName('scheduleEI.netAgriIncOrOthrIncRule7')[0].value = result;
}

//To set Aadhar option
function setAadharOption() {
	var status = document.getElementsByName('partAGEN1.personalInfo.status')[0].value;
	var aadhar = document.getElementsByName('partAGEN1.personalInfo.adharNoOption')[0];

	if (status == 'I') {
		removeAll(aadhar);
		addOption(aadhar, 'Yes', 'Y');
		addOption(aadhar, 'No', 'N');
	} else if (status == 'H') {
		removeAll(aadhar);
		addOption(aadhar, 'NA', 'X');
	} else {

		removeAll(aadhar);
		addOption(aadhar, 'Yes', 'Y');
		addOption(aadhar, 'No', 'N');
		addOption(aadhar, 'NA', 'X');

	}
}

// Remove all Options from Drop-Down.
function removeAll(selectbox) {

	for ( var i = selectbox.options.length - 1; i > 0; i--) {
		selectbox.removeChild(selectbox[i]);

	}
}

// Add Options to Drop-down.
function addOption(selectbox, text, value) {
	var optn = document.createElement("option");
	optn.text = text;
	optn.value = value;
	selectbox.options.add(optn);
}

// Set Aadhar-No Option on load.
function setAadharOptionOnLoad() {
	var aadhar = document.getElementsByName('partAGEN1.personalInfo.adharNoOption')[0].value;
	setAadharOption();
	document.getElementsByName('partAGEN1.personalInfo.adharNoOption')[0].value = aadhar;
}


//To enable passport when status I
/*function enablePassport() {
	var status = document.getElementsByName('partAGEN1.personalInfo.status')[0].value;
	if (status == 'I') {
		document.getElementsByName('partAGEN1.personalInfo.passportNumber')[0].disabled = false;
		document.getElementsByName('partAGEN1.personalInfo.passportNumber')[0].readOnly = false;

	}
	if (status == 'H') {
		document.getElementsByName('partAGEN1.personalInfo.passportNumber')[0].disabled = true;
		document.getElementsByName('partAGEN1.personalInfo.passportNumber')[0].readOnly = true;
		document.getElementsByName('partAGEN1.personalInfo.passportNumber')[0].value = '';
	}
}*/

//To validate passport
/*function validatePassport() {

	var value = document.getElementsByName('partAGEN1.personalInfo.passportNumber')[0].value;

	if (value == '00000000000000') {
		addErrorXHTML(document.getElementsByName('partAGEN1.personalInfo.passportNumber')[0],'Passport number should be alpha-numeric', true);
		j.setFieldError('partAGEN1.personalInfo.passportNumber','Passport number should be alpha-numeric');
	}
}
*/
//To validate spaces in passport
/*function validatePassportforSpaces() {
	var value = document.getElementsByName('partAGEN1.personalInfo.passportNumber')[0].value;
	if (value.trim() == "") {

		addErrorXHTML(document.getElementsByName('partAGEN1.personalInfo.passportNumber')[0],'Passport number should be alpha-numeric', true);
		j.setFieldError('partAGEN1.personalInfo.passportNumber','Passport number should be alpha-numeric');
	}
}
*/


//To get ifsc bank name
function getIfscBankName(field) {
	
	document.getElementsByName('itr.refund.depositToBankAccount.bankName')[0].value = main.getBankName(field.value);
}

//To get Ifsc Bank Details
function getIfscBankDetails(elem) {
	
	var position = parseInt(elem.name.substring(elem.name.indexOf("[") + 1,elem.name.indexOf("]")));
	var ifscCode = document.getElementsByName('itr.scheduleBA[' + position + '].ifscCode')[0].value;
	document.getElementsByName('itr.scheduleBA[' + position + '].bankName')[0].value = main.getBankName(ifscCode);
}

// Validate PartB-TTI Refund.
function onChngBTTIRefund() {
	
	var typeHP = document.getElementsByName('partBTTI.assetOutIndiaFlag')[0].value;
	if (typeHP == 'YES') {
		addErrorXHTML('','Schedule FA is mandatory. Ensure all the details in Schedule FA are filled');
	}
}


//To alert user
function alertItr4User() {
	var incSal = document.getElementsByName('partBTI.salaries')[0].value;
	//var netProfit = document.getElementsByName('partapl.noBooksOfAccPL.netProfit')[0].value;
	var netProfit = document.getElementsByName('partapl.noBooksOfAccPL.totalNetProfit')[0].value;
	var checkForBPAlert = coalesceSetRet('partabs.fundSrc.totFundSrc') 
							+ coalesceSetRet('partabs.noBooksOfAccBS.totSundryDbtAmt')
							+ coalesceSetRet('partabs.noBooksOfAccBS.totSundryCrdAmt')
							+ coalesceSetRet('partabs.noBooksOfAccBS.totStkInTradAmt')
							+ coalesceSetRet('partabs.noBooksOfAccBS.cashBalAmt');
	
	var inchBPAlert=document.getElementsByName('itr4ScheduleBP.incChrgUnHdProftGain')[0].value;	
	var tab1 = document.getElementById('scheduleTDS1');
    var noOfRows=tab1.rows.length;
	var sum = 0;
	var amt = 0;
		
	for ( var i = 0; i < (noOfRows-3); i++) {
		amt = document.getElementsByName('scheduleTDS1.tdSonOthThanSal['+i+'].incChrgSal')[0].value;
		sum = eval(parseInt(sum,10) + parseInt(coalesce(amt),10));
	}
	
	if(netProfit < 0)
	{
		addErrorXHTML('','In No Accounts Case, Net Profit cannot be negative.');
	}

	var tdsSalminusTenPer = sum*parseFloat('0.90');
	var errText="";
	var i=1;
	var amountPayable = document.getElementsByName('partBTTI.taxPaid.balTaxPayable')[0].value;
	var fileSec = document.getElementsByName('partAGEN1.filingStatus.returnFileSec')[0].value;
	
	if(incSal < tdsSalminusTenPer){
		errText+=(i++)+". The amount of salary disclosed in \"Income details/Part BTI\" is less than 90% of Salary reported in TDS1.\n\n";
	}
	
	if(fileSec=='20'){
		errText+=(i++)+". Section 139 read with section 119(2)(b) for AY 2017-18 can be filed only after 31st March 2018.\n\n";
	}
	if(fileSec=='19'){
		errText+=(i++)+".  To file return u/s 92CD, post login in e-Filing portal, go to 'e-File' --> 'Income Tax Return' and select the applicable AY, ITR and other options.\n\n";
	}
	if (checkForBPAlert == 0 && inchBPAlert > 120000){
		errText+=(i++)+". Please ensure that the relevant fields of Profit & Loss and Balance Sheet are filled, else Return of Income may be treated as defective u/s 139(9).\n";
	}
	/*if (amountPayable > 0){
		errText+=(i++)+". Please ensure that the taxes are paid before the submission of the return, else return shall be treated as defective.\n";
	}*/
	main.generateMsgDialogWithOk(errText,"");
}

//To open Save file dialog
function popupWithOk()
{
	  j.popup();
}

//To display 92CD Verification based on the filing section
function display92CDVerification(type) {

	var fileSec=document.getElementsByName('partAGEN1.filingStatus.returnFileSec')[0].value;
	
	if(fileSec=='19') {
		   document.getElementById('92cdVerification').style.display='';
	   } else {
		   document.getElementById('92cdVerification').style.display='none';
	   }
	
	if(type != 'onload' && fileSec == '20'){
		addErrorXHTML('','Section 139 read with section 119(2)(b) for AY 2017-18 can be filed only after 31st March 2018.');
	}
	if(type != 'onload' && fileSec == '19'){
		addErrorXHTML('','To file return u/s 92CD, post login in e-Filing portal, go to "e-File" --> "Income Tax Return" and select the applicable AY, ITR and other options.');
	}
}

//To check the value selected in DTAA table is selected in the 1d table or not 
function checkDropdownSelectedin1d() {
	var table = document.getElementById('scheduleOsNriIncTaxDtaa');
	var rowCount = table.rows.length - 2;
	var itemIncluded = [];
	
	var tabl = document.getElementById('schduleOsf');
	var rowCountTab1 = tabl.rows.length - 3;
	var sourceDescriptionMap = [];
	
	for(var i=0; i<rowCount; i++) {
		var section = document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+i+'].itemIncluded')[0];
		if(section.value != '' && section.value != '56i' && section.value != '56' && itemIncluded.indexOf(section.value) == -1) {
			itemIncluded.push(section.value);
		}
	}
	
	for(var i=1; i<rowCountTab1; i++) {
		var sourceDescription = document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+i+'].sourceDescription')[0];
		
		if(sourceDescription.value != '' && sourceDescriptionMap.indexOf(sourceDescription.value) == -1) {
			sourceDescriptionMap.push(sourceDescription.value);
		}
	}
	var index = 0;
	for(var i=0; i<itemIncluded.length; i++) {
		if(sourceDescriptionMap.indexOf(itemIncluded[i]) == -1) {
			for(var k=0; k<rowCount; k++) {
				var section = document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+k+'].itemIncluded')[0];
				if(section.value != '' && section.value == itemIncluded[i] ) {
					index = k;
				}
			}
			addErrorXHTML(document.getElementsByName('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+index+'].itemIncluded')[0]  ,'Please select this section in table 1d.',true);
			j.setFieldError('scheduleOS.incChargblSplRateOS.nriIncTaxDtaa['+index+'].itemIncluded','Please select this section in table 1d.');
		}
	}
}

function panValidation80G(tableId) {

	var pan = document.getElementsByName('partAGEN1.personalInfo.pan')[0].value;
	var verificationPAN = document.getElementsByName('verification.declaration.assesseeVerPAN')[0].value;
	var table = document.getElementById(tableId);
	var allInputTags = table.getElementsByTagName('input');
	for(var i = 0; i < allInputTags.length; i++) {
		if (allInputTags[i].name.match("doneePanNo$")) {
			if(allInputTags[i].value != '' && (allInputTags[i].value == pan || allInputTags[i].value == verificationPAN )){
				j.setFieldError(allInputTags[i].name,'Enter the PAN of the person to whom the donation is made.');

			}
		}
	}
}

function surchargeEditable(){
	var splRateIncTax = parseInt(coalesce(document.getElementsByName('scheduleSI.splCodeRateTax[1].splRateIncTax')[0].value));
	
	if(splRateIncTax>0){
		document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.exceeds1crSurcharge')[0].readOnly = false;
		document.getElementsByName('partBTTI.computationOfTaxLiability.educationCess')[0].readOnly = false;
	}else{
		document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.exceeds1crSurcharge')[0].readOnly = true;
		document.getElementsByName('partBTTI.computationOfTaxLiability.educationCess')[0].readOnly = true;
	}
	
}
function clearOldSurchargeValue(){
	var surcharge = document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.exceeds1crSurcharge')[0];
		if(surcharge.old!=undefined){
			surcharge.old = undefined;
		}
		if(surcharge.oldvalue!=undefined){
			surcharge.oldvalue = undefined;
		}
}

//To populate zero
function populateZero() {
	var val = document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls[0].sourceAmount')[0];
	

	if (val.value == '') {
		val.value = parseInt(0, 10);
	}
	
	
}

function returnZeroIfNegative(value){	
	if (value < 0) {
		return 0;
	}else{
	return value;
	}
}

//To calculate exemptions
function applyExemption2017(original, exemption,appRate) {
	var remaining = exemption;
	var nonZero = 0;
	for (var i = original.length - 1; i >= 0; i--) {
		if (i > 0 && (i < original.length - 1 || (appRate && i < original.length))) {
			original[i] = original[i] - original[i - 1];
		}
		if (original[i] != 0) {
			nonZero++;
		}
	}
	if (nonZero == 0) {
		return original;
	}
	var total = 0;
	for (var i = 0; i < original.length; i++) {
		if (parseInt(original[i], 10) > parseInt(0, 10)) {
		//	var part = remaining / nonZero--;
			if (parseInt(original[i]) > parseInt(remaining)) {
				original[i] = (parseInt(original[i], 10)) - remaining;
				remaining = 0;
			} else {
				remaining = remaining - original[i];
				original[i] = 0;
			}
		}
		if (i > 0
				&& (i < original.length - 1 || (appRate && i < original.length))) {
			original[i] = original[i] + original[i - 1];
		}
		total = eval(parseInt(total, 10) + parseInt(original[i]));
	}
	if (parseInt(remaining, 10) > parseInt(0, 10) && total > parseInt(0, 10)) {
		original = applyExemption2017(original, remaining);
	}
	return original;
}

function coalesce234C(value){	
	if (isNaN(value) || value=='') {
		value = parseInt(0, 10);
	}
	return parseInt(value,10);
}

/*function surchargeTotal201718(){
		document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.surcharge')[0].value = eval(
			parseInt(coalesce(document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.25perSurcharge')[0].value),10)+
			parseInt(coalesce(document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.exceeds1crSurcharge')[0].value),10));
	
}*/


function surcharge201718(){
	
 	/*document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.25perSurcharge')[0].value=0;
	document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.exceeds1crSurcharge')[0].value=0;
	*/
	
		
	document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.25perSurcharge')[0].value = eval(
		parseInt(coalesceSetRet('scheduleOS.incChargblSplRateOS.115BBE'),10) * 0.60* 0.25);

	document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.surcharge')[0].value = eval(
			parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnTI.25perSurcharge'),10)+
			parseInt(coalesceSetRet('partBTTI.computationOfTaxLiability.taxPayableOnTI.exceeds1crSurcharge'),10));
	
	
	
}

function OSSubCal(){
	

	
/*	document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls[7].sourceAmount')[0].value = eval(
			parseInt(coalesce(document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls[1].sourceAmount')[0].value),10)+
			parseInt(coalesce(document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls[2].sourceAmount')[0].value),10)+
			parseInt(coalesce(document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls[3].sourceAmount')[0].value),10)+
			parseInt(coalesce(document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls[4].sourceAmount')[0].value),10)+
			parseInt(coalesce(document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls[5].sourceAmount')[0].value),10)+
			parseInt(coalesce(document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls[6].sourceAmount')[0].value),10));
	*/
	
		document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls[7].sourceAmount')[0].value = eval(
			parseInt(coalesceSetRet('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls[1].sourceAmount'),10)+
			parseInt(coalesceSetRet('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls[2].sourceAmount'),10)+
			parseInt(coalesceSetRet('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls[3].sourceAmount'),10)+
			parseInt(coalesceSetRet('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls[4].sourceAmount'),10)+
			parseInt(coalesceSetRet('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls[5].sourceAmount'),10)+
			parseInt(coalesceSetRet('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls[6].sourceAmount'),10));
	
	
				
}



function removeIncomeDtls(){
	
	var status = document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0].value;
	
	if (status == 'NRI') {
		document.getElementsByName('scheduleOS.incChargblSplRateOS.115BBDA')[0].value=0;
		document.getElementsByName('scheduleOS.incChargblSplRateOS.115BBF')[0].value=0;
	}
	
}

function removeIncomeDtls1(){
	
	var status = document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0].value;
	
	if (status == 'NRI' || status == 'RES' || status == 'NOR')  {
		document.getElementsByName('scheduleOS.incChargblSplRateOS.115BBDA')[0].value=0;
		document.getElementsByName('scheduleOS.incChargblSplRateOS.115BBF')[0].value=0;
	}
	
}

function clearFields(){
	document.getElementsByName('scheduleOS.incChargblSplRateOS.115BBDA')[0].value=0;
	document.getElementsByName('scheduleOS.incChargblSplRateOS.115BBF')[0].value=0;

}

function income115BBF_BP(){
	document.getElementsByName('partBTI.profBusGain.profIncome115BBF')[0].value=
		parseInt(coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.incRecCredPLOthHeads.us115BBF'),10);
	
}

function disableFields_AL(){
	
	var listOfTr = document.getElementById('scheduleAL').getElementsByTagName('tr');
	var noOfRows = eval(parseInt(listOfTr.length, 10) - 4);
	
	
	for (var j = 0; j < noOfRows; j++) {
	
		var flag = document.getElementsByName('itr2.scheduleAL.immovableFlag')[0].value;
		if(flag=="Y")
		{
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].description')[0].disabled=false;
		 
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].residenceNo')[0].disabled=false;
		 
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].residenceName')[0].disabled=false;
		 
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].roadOrStreet')[0].disabled=false;
		 
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].localityOrArea')[0].disabled=false;
		 
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].cityOrTownOrDistrict')[0].disabled=false;
		 
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].stateCode')[0].disabled=false;
		 
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].country')[0].disabled=false;
		 
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].pinCode')[0].disabled=false;
		 
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].amount')[0].disabled=false;
		 
		
		}
	else{
		
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].description')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].description')[0].value="";
		 
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].residenceNo')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].residenceNo')[0].value="";
		 
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].residenceName')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].residenceName')[0].value="";
		 
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].roadOrStreet')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].roadOrStreet')[0].value="";
		 
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].localityOrArea')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].localityOrArea')[0].value="";
		 
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].cityOrTownOrDistrict')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].cityOrTownOrDistrict')[0].value="";
		 
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].stateCode')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].stateCode')[0].value="";
		 
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].country')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].country')[0].value="";
		 
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].pinCode')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].pinCode')[0].value="";
		 
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].amount')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.immovableDtls['+j+'].amount')[0].value="";
		 
    
		}
	
	}
}


function mandtryAL(){
	
	var totalin = document.getElementsByName('partBTI.grossTotalIncome')[0].value; 
	var immflag = document.getElementsByName('itr2.scheduleAL.immovableFlag')[0].value;
	var jewflag = document.getElementsByName('itr2.scheduleAL.movableAsset.jewelleryBullionEtc')[0].value;
	var archflag = document.getElementsByName('itr2.scheduleAL.movableAsset.archCollDrawPaintSulpArt')[0].value;
	var vehiflag = document.getElementsByName('itr2.scheduleAL.movableAsset.vehiclYachtsBoatsAircrafts')[0].value;
	var deposflag = document.getElementsByName('itr2.scheduleAL.movableAsset.depositsinbank')[0].value;
	var shreflag = document.getElementsByName('itr2.scheduleAL.movableAsset.sharesandsecurities')[0].value;
	var insurflag = document.getElementsByName('itr2.scheduleAL.movableAsset.insurancepolicies')[0].value;
	var loanflag = document.getElementsByName('itr2.scheduleAL.movableAsset.loansandadvancesgiven')[0].value;
	var cashflag = document.getElementsByName('itr2.scheduleAL.movableAsset.cashInHand')[0].value;
	var AOPflag = document.getElementsByName('itr2.scheduleAL.interstAOPFlag')[0].value;
	var liabflag = document.getElementsByName('itr2.scheduleAL.liabilityInRelatAssets')[0].value;
	

	if(totalin <= 5000000 )
		{
		
	if ((immflag != ""))
	{
		if((jewflag =="")||(archflag =="")||(vehiflag =="") ||(deposflag =="") ||(shreflag =="") ||(insurflag =="") ||(loanflag =="")
				||(cashflag =="")||(AOPflag =="")||(liabflag =="")){
		
			addErrorXHTML('' ,'Please fill all the fields in schedule AL.');	
			j.setFieldError('itr2.scheduleAL','Please fill all the fields in schedule AL.');}
			
		}
	if ((jewflag != ""))
	{
		if((immflag =="")||(archflag =="")||(vehiflag =="") ||(deposflag =="") ||(shreflag =="") ||(insurflag =="") ||(loanflag =="")
				||(cashflag =="")||(AOPflag =="")||(liabflag =="")){
		
			addErrorXHTML('' ,'Please fill all the fields in schedule AL ..');	
			j.setFieldError('itr2.scheduleAL','Please fill all the fields in schedule AL.');}
			
		}
	if ((archflag != ""))
	{
		if((immflag =="")||(jewflag =="")||(vehiflag =="") ||(deposflag =="") ||(shreflag =="") ||(insurflag =="") ||(loanflag =="")
				||(cashflag =="")||(AOPflag =="")||(liabflag =="")){
		
			addErrorXHTML('' ,'Please fill all the fields in schedule AL.');	
			j.setFieldError('itr2.scheduleAL','Please fill all the fields in schedule AL.');}
			
		}
	if ((vehiflag != ""))
	{
		if((immflag =="")||(jewflag =="")||(archflag =="") ||(deposflag =="") ||(shreflag =="") ||(insurflag =="") ||(loanflag =="")
				||(cashflag =="")||(AOPflag =="")||(liabflag =="")){
		
			addErrorXHTML('' ,'Please fill all the fields in schedule AL.');	
			j.setFieldError('itr2.scheduleAL','Please fill all the fields in schedule AL.');}
			
		}
	if ((deposflag != ""))
	{
		if((immflag =="")||(jewflag =="")||(vehiflag =="") ||(archflag =="") ||(shreflag =="") ||(insurflag =="") ||(loanflag =="")
				||(cashflag =="")||(AOPflag =="")||(liabflag =="")){
		
			addErrorXHTML('' ,'Please fill all the fields in schedule AL.');	
			j.setFieldError('itr2.scheduleAL','Please fill all the fields in schedule AL.');}
			
		}
	if ((shreflag != ""))
	{
		if((immflag =="")||(jewflag =="")||(vehiflag =="") ||(deposflag =="") ||(archflag =="") ||(insurflag =="") ||(loanflag =="")
				||(cashflag =="")||(AOPflag =="")||(liabflag =="")){
		
			addErrorXHTML('' ,'Please fill all the fields in schedule AL.');	
			j.setFieldError('itr2.scheduleAL','Please fill all the fields in schedule AL.');}
			
		}
	if ((insurflag != ""))
	{
		if((immflag =="")||(jewflag =="")||(vehiflag =="") ||(deposflag =="") ||(shreflag =="") ||(archflag =="") ||(loanflag =="")
				||(cashflag =="")||(AOPflag =="")||(liabflag =="")){
		
			addErrorXHTML('' ,'Please fill all the fields in schedule AL.');	
			j.setFieldError('itr2.scheduleAL','Please fill all the fields in schedule AL.');}
			
		}
	if ((loanflag != ""))
	{
		if((immflag =="")||(jewflag =="")||(vehiflag =="") ||(deposflag =="") ||(shreflag =="") ||(archflag =="") ||(insurflag =="")
				||(cashflag =="")||(AOPflag =="")||(liabflag =="")){
		
			addErrorXHTML('' ,'Please fill all the fields in schedule AL.');	
			j.setFieldError('itr2.scheduleAL','Please fill all the fields in schedule AL.');}
			
		}
	if ((cashflag != ""))
	{
		if((immflag =="")||(jewflag =="")||(vehiflag =="") ||(deposflag =="") ||(shreflag =="") ||(archflag =="") ||(insurflag =="")
				||(loanflag =="")||(AOPflag =="")||(liabflag =="")){
		
			addErrorXHTML('' ,'Please fill all the fields in schedule AL.');	
			j.setFieldError('itr2.scheduleAL','Please fill all the fields in schedule AL.');}
			
		}
	
	if ((AOPflag != ""))
	{
		if((immflag =="")||(jewflag =="")||(vehiflag =="") ||(deposflag =="") ||(shreflag =="") ||(archflag =="") ||(insurflag =="")
				||(loanflag =="")||(cashflag =="")||(liabflag =="")){
		
			addErrorXHTML('' ,'Please fill all the fields in schedule AL.');	
			j.setFieldError('itr2.scheduleAL','Please fill all the fields in schedule AL.');}
			
		}
	
	if ((liabflag != ""))
	{
		if((immflag =="")||(jewflag =="")||(vehiflag =="") ||(deposflag =="") ||(shreflag =="") ||(archflag =="") ||(insurflag =="")
				||(loanflag =="")||(AOPflag =="")||(cashflag =="")){
		
			addErrorXHTML('' ,'Please fill all the fields in schedule AL.');	
			j.setFieldError('itr2.scheduleAL','Please fill all the fields in schedule AL.');}
			
		}
	
		}
	}


function disableFields_AOP(){
	
	var listOfTr = document.getElementById('scheduleALInt').getElementsByTagName('tr');
	var noOfRows = eval(parseInt(listOfTr.length, 10) - 3);
	
	
	for (var j = 0; j < noOfRows; j++) {
	
		var flag = document.getElementsByName('itr2.scheduleAL.interstAOPFlag')[0].value;
		if(flag=="Y")
		{
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].nameOfFirm')[0].disabled=false;
		 
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].residenceNo')[0].disabled=false;
		 
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].residenceName')[0].disabled=false;
		 
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].roadOrStreet')[0].disabled=false;
		 
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].localityOrArea')[0].disabled=false;
		 
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].cityOrTownOrDistrict')[0].disabled=false;
		 
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].stateCode')[0].disabled=false;
		 
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].country')[0].disabled=false;
		 
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].pinCode')[0].disabled=false;
		 
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].panOfFirm')[0].disabled=false;
		 
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].assesseInvestment')[0].disabled=false;
		 
		
		}
	else{
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].nameOfFirm')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].nameOfFirm')[0].value="";
		 
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].residenceNo')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].residenceNo')[0].value="";
		 
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].residenceName')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].residenceName')[0].value="";
		 
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].roadOrStreet')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].roadOrStreet')[0].value="";
		 
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].localityOrArea')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].localityOrArea')[0].value="";
		 
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].cityOrTownOrDistrict')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].cityOrTownOrDistrict')[0].value="";
		 
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].stateCode')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].stateCode')[0].value="";
		 
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].country')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].country')[0].value="";
		 
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].pinCode')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].pinCode')[0].value="";
		 
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].panOfFirm')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].panOfFirm')[0].value="";
		 
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].assesseInvestment')[0].disabled=true;
		 document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+j+'].assesseInvestment')[0].value="";
		 
    
		}
	
	}
}


function disableImmovableAsset(){

	var immovableFlag=document.getElementsByName('itr2.scheduleAL.immovableFlag')[0].value;
	
        removeTableDataAL('scheduleAL',immovableFlag);

}

//To remove Table Data
function removeTableDataAL(tableID,immovableFlag){
    
    var tab = document.getElementById(tableID);
    
    if(immovableFlag!='Y'){
    $('#'+tableID+' input').attr("checked" , true);
    deleteRowTable(tableID,3,1);
    $('#'+tableID+' input').attr("checked" , false);
    }
            
	var allInputTags = tab.getElementsByTagName('input');
    var selectTags=tab.getElementsByTagName('select');


	for(var i = 0; i < allInputTags.length; i++) {
		if(immovableFlag=='Y'){
			allInputTags[i].disabled=false;
			allInputTags[i].readOnly=false;	
			
	}else{		
		
		allInputTags[i].disabled=true;
		allInputTags[i].readOnly=true;
		allInputTags[i].value="";	
	}
}
for(var i = 0; i < selectTags.length; i++){
	if(immovableFlag=='Y'){
		  selectTags[i].disabled=false;		
	}else{
		selectTags[i].disabled=true;
		selectTags[i].value="";	
                  	
	}
}

}


function disableAOP(){
	
	var interestFlag = document.getElementsByName('itr2.scheduleAL.interstAOPFlag')[0].value;	
	removeTableData1('scheduleALInt',interestFlag);
	
}


function removeTableData1(tableID,interestFlag){
    
	var tab = document.getElementById(tableID);

	if(interestFlag!='Y'){
	$('#'+tableID+' input').attr("checked" , true);
	deleteRowTable(tableID,2,1);
	$('#'+tableID+' input').attr("checked" , false);
	}
	        
	var allInputTags = tab.getElementsByTagName('input');
	var selectTags=tab.getElementsByTagName('select');


	for(var i = 0; i < allInputTags.length; i++) {
		if(interestFlag=='Y'){
			allInputTags[i].disabled=false;
			allInputTags[i].readOnly=false;	
			
			
	}else{		
		
		
		allInputTags[i].disabled=true;
		allInputTags[i].readOnly=true;
		allInputTags[i].value="";	
	}
	}
	for(var i = 0; i < selectTags.length; i++){
	if(interestFlag=='Y'){
		
		
		  selectTags[i].disabled=false;		
	}else{
		selectTags[i].disabled=true;
		selectTags[i].value="";	
	              	
	}
	} 

}


function onStateChngAL(){
	
	var listOfTr = document.getElementById('scheduleAL').getElementsByTagName('tr');
	var noOfRows = eval(parseInt(listOfTr.length, 10) - 3);
	
	
	for (var i = 0; i < noOfRows; i++) {
	var state = document.getElementsByName('itr2.scheduleAL.immovableDtls['+ i +'].stateCode')[0];
	var country = document.getElementsByName('itr2.scheduleAL.immovableDtls['+ i +'].country')[0];
	var pinCode = document.getElementsByName('itr2.scheduleAL.immovableDtls['+ i +'].pinCode')[0];
	
	if(state.value != '99' && state.value != '' )
	{		
		if(country.value!='91'){
				country.value='91';
				pinCode.value='';	
			}			
	}
	else if(state.value == '99')
	{
	
		if (pinCode.value != null || pinCode.value != '' ) 
		{
		
			pinCode.value='999999';
			country.value='';
		}
	}
}
}

function onCountryChngAL(){

var listOfTr = document.getElementById('scheduleAL').getElementsByTagName('tr');
var noOfRows = eval(parseInt(listOfTr.length, 10) - 3);


for (var i = 0; i < noOfRows; i++) {
var state = document.getElementsByName('itr2.scheduleAL.immovableDtls['+ i +'].stateCode')[0];
var country = document.getElementsByName('itr2.scheduleAL.immovableDtls['+ i +'].country')[0];
var pinCode = document.getElementsByName('itr2.scheduleAL.immovableDtls['+ i +'].pinCode')[0];

try{
	if(country.value=='91' && state.value == "99"){
		
		state.value = "";
		pincode.value = '';
			
		
	} else if(country.value!='' && country.value !="91"){
		state.value = "99";
		pincode.value = '999999';
	
		
	}
	
		}catch (e) {
	}
}

}
function onStateChngAOP(){
	
	var listOfTr = document.getElementById('scheduleALInt').getElementsByTagName('tr');
	var noOfRows = eval(parseInt(listOfTr.length, 10) - 3);
	
	for (var i = 0; i < noOfRows; i++) {
	
	
	var state = document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+ i +'].stateCode')[0];
	var country = document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+ i +'].country')[0];
	var pinCode = document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+ i +'].pinCode')[0];
	
	if(state.value != '99' && state.value != '' )
	{		
		if(country.value!='91'){
				country.value='91';
				pinCode.value='';	
			}			
	}
	else if(state.value == '99')
	{
	
		if (pinCode.value != null || pinCode.value != '' ) 
		{
		
			pinCode.value='999999';
			country.value='';
		}
	}
}
}


function onCountryChngAOP(){

var listOfTr = document.getElementById('scheduleALInt').getElementsByTagName('tr');
var noOfRows = eval(parseInt(listOfTr.length, 10) - 3);

for (var i = 0; i < noOfRows; i++) {


var state = document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+ i +'].stateCode')[0];
var country = document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+ i +'].country')[0];
var pinCode = document.getElementsByName('itr2.scheduleAL.interestHeldInaAssetDtls['+ i +'].pinCode')[0];

try{
	if(country.value=='91' && state.value == "99"){
		
		state.value = "";
		pincode.value = '';
			
		
	} else if(country.value!='' && country.value !="91"){
		state.value = "99";
		pincode.value = '999999';
	
		
	}
	
		}catch (e) {
	}
}
}

function oi_33AB_ABA(){

	document.getElementsByName('partaoi.deemedProfUs33ABs')[0].value = eval(
			parseInt(coalesceSetRet('partaoi.deemedProfUs33ABs.section33AB'),10)+
			parseInt(coalesceSetRet('partaoi.deemedProfUs33ABs.section33ABA'),10));
}

function bp_sections(){

	document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemIncUs3380HHD80IA')[0].value = eval(
			parseInt(coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.section32AD'),10)+
			parseInt(coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.section33AB'),10)+
			parseInt(coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.dsection33ABA'),10)+
			parseInt(coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.section35ABA'),10)+
			parseInt(coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.section35ABB'),10)+
			parseInt(coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.section40A'),10)+
			parseInt(coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.section72A'),10)+
			parseInt(coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.section80HHD'),10)+
			parseInt(coalesceSetRet('itr4ScheduleBP.businessIncOthThanSpec.section80IA'),10));
}

function bp_35AD1_AD1A(){

	document.getElementsByName('itr4ScheduleBP.specifiedBusinessInc.deductionUs35AD')[0].value = eval(
			parseInt(coalesceSetRet('itr4ScheduleBP.specifiedBusinessInc.deductionUs35AD1'),10)+
			parseInt(coalesceSetRet('itr4ScheduleBP.specifiedBusinessInc.deductionUs35AD1A'),10));
}

function setCountryForStateItr3(){
	
	
	try {
		
		var state = document.getElementsByName('partAGEN1.personalInfo.address.stateCode')[0];
		var country = document.getElementsByName('partAGEN1.personalInfo.address.country')[0];
		
		if(state.value=='99' ){	
			
			country.value = '';
						
		} else if(state.value==''){
			
			country.value = '';
			
		}else{
			
			country.value = "91";
			
		}
		
	} catch (e) {
	}
}
function checkPinOnStateChangeVer()
{
	var state = document.getElementsByName('partAGEN1.personalInfo.address.stateCode')[0];
	var country = document.getElementsByName('partAGEN1.personalInfo.address.country')[0];
	
	if ( state.value == "99" || country.value != "91")
		{
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode.pChosenCheckBox')[0].checked=false;
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode.pChosenCheckBox')[0].disabled=false;
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode')[0].disabled=true;
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode')[0].value="";
		document.getElementsByName('partAGEN1.personalInfo.address.zipCode')[0].disabled=false;
		
		}
	else 
		{
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode.pChosenCheckBox')[0].checked=false;
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode.pChosenCheckBox')[0].disabled=true;
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode')[0].disabled=false;
		document.getElementsByName('partAGEN1.personalInfo.address.zipCode')[0].disabled=true;
		document.getElementsByName('partAGEN1.personalInfo.address.zipCode')[0].value="";
		}
	
	//populateZipCodeVer();
		
}
function checkPinOnCountryChangeVer()
{
	var state = document.getElementsByName('partAGEN1.personalInfo.address.stateCode')[0];
	var country = document.getElementsByName('partAGEN1.personalInfo.address.country')[0];
	
	var zipCode =document.getElementsByName('partAGEN1.personalInfo.address.zipCode')[0].value
	if (country.value == "91" || country.value== "-1"){
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode.pChosenCheckBox')[0].checked=false;
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode.pChosenCheckBox')[0].disabled=true;
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode')[0].disabled=false;
		document.getElementsByName('partAGEN1.personalInfo.address.zipCode')[0].disabled=true;
		document.getElementsByName('partAGEN1.personalInfo.address.zipCode')[0].value="";
		}
	else 
		{
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode.pChosenCheckBox')[0].checked=false;
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode.pChosenCheckBox')[0].disabled=false;
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode')[0].disabled=true;
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode')[0].value="";
		document.getElementsByName('partAGEN1.personalInfo.address.zipCode')[0].disabled=false;
		
		
		}
	
	//populateZipCodeVer();
		
}
function setStateForCountryitr3(){
	
	var state = document.getElementsByName('partAGEN1.personalInfo.address.stateCode')[0];
	var country = document.getElementsByName('partAGEN1.personalInfo.address.country')[0];
	
	try{
	if(country.value=='91'){
		
		state.value = '';
	
	} else if(country.value!='91'){
		state.value = "99";
		
	}
	}catch (e) {
	}
}
function populateZipCodeVer(){
	
	var zipCodeCheck= document.getElementsByName('partAGEN1.personalInfo.address.pinCode.pChosenCheckBox')[0];
	var country = document.getElementsByName('partAGEN1.personalInfo.address.country')[0];
	
	if(zipCodeCheck.checked==true && country.value !='91' && country.value !="" ){
		
		document.getElementsByName('partAGEN1.personalInfo.address.zipCode')[0].value="XXXXXX";
		document.getElementsByName('partAGEN1.personalInfo.address.zipCode')[0].readOnly=true;
		zipCodeCheck.value=true;
		
	}else{
		
		document.getElementsByName('partAGEN1.personalInfo.address.zipCode')[0].value="";
		document.getElementsByName('partAGEN1.personalInfo.address.zipCode')[0].readOnly=false;
		zipCodeCheck.value=false;
	}
	
}
function checkPinZipOnload()
{
	var state = document.getElementsByName('partAGEN1.personalInfo.address.stateCode')[0];
	var country = document.getElementsByName('partAGEN1.personalInfo.address.country')[0];
	var zipCode =document.getElementsByName('partAGEN1.personalInfo.address.zipCode')[0].value
	if (country.value == "91" || country.value== "-1"){
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode.pChosenCheckBox')[0].checked=false;
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode.pChosenCheckBox')[0].disabled=true;
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode')[0].disabled=false;
		document.getElementsByName('partAGEN1.personalInfo.address.zipCode')[0].disabled=true;
		document.getElementsByName('partAGEN1.personalInfo.address.zipCode')[0].value="";
		}
	else 
		{
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode.pChosenCheckBox')[0].checked=false;
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode.pChosenCheckBox')[0].disabled=false;
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode')[0].disabled=true;
		document.getElementsByName('partAGEN1.personalInfo.address.pinCode')[0].value="";
		if(zipCode=="XXXXXX"){
			
			document.getElementsByName('partAGEN1.personalInfo.address.zipCode')[0].readOnly=true;
			document.getElementsByName('partAGEN1.personalInfo.address.pinCode.pChosenCheckBox')[0].checked=true;
		}else{
			
			document.getElementsByName('partAGEN1.personalInfo.address.zipCode')[0].readOnly=false;
			document.getElementsByName('partAGEN1.personalInfo.address.pinCode.pChosenCheckBox')[0].checked=false;
		}
	
		
		}
	
	//populateZipCodeVer();
		
}

function priBankMandtry()
{
	var bankDtlflag = document.getElementsByName('itr.refund.scheduleBA.bankDtlsFlag')[0].value;
	var bankName = document.getElementsByName('itr.refund.depositToBankAccount.bankName')[0].value;
	var ifscCode = document.getElementsByName('itr.refund.depositToBankAccount.iFSCCode')[0].value;
	var bankAcctNo = document.getElementsByName('itr.refund.bankAccountNumber')[0].value;
	var cashDeposit = document.getElementsByName('itr.refund.depositAmt')[0].value;
	
	var tab = document.getElementById('scheduleBA');
	var allInputTags = tab.getElementsByTagName('input');
	
	
	if(bankDtlflag=='N' )
	{
		if(bankName !="" && (ifscCode=="" || bankAcctNo=="")){
			
			addErrorXHTML('' ,'Please fill all the fields under Indian Bank Account details.');	
			j.setFieldError('itr.refund.depositToBankAccount','Please fill all the fields under Indian Bank Account details.');
		}
	
	if(ifscCode !="" && (bankName=="" || bankAcctNo=="")){
		
		addErrorXHTML('' ,'Please fill all the fields under Indian Bank Account details.');	
		j.setFieldError('itr.refund.depositToBankAccount','Please fill all the fields under Indian Bank Account details.');
	}

	if(bankAcctNo !="" && (ifscCode=="" || bankName=="")){
	
	addErrorXHTML('' ,'Please fill all the fields under Indian Bank Account details.');	
	j.setFieldError('itr.refund.depositToBankAccount','Please fill all the fields under Indian Bank Account details.');
   }

   if(cashDeposit !="" && (ifscCode=="" || bankAcctNo==""||bankName=="")){
	
	addErrorXHTML('' ,'Please fill all the fields under Indian Bank Account details.');	
	j.setFieldError('itr.refund.depositToBankAccount','Please fill all the fields under Indian Bank Account details.');
   }
		
	}
	
	for(var i = 0; i < allInputTags.length; i++) {
		if (allInputTags[i].name.match("ifscCode$") && allInputTags[i+1].name.match("bankName$") && allInputTags[i+2].name.match("accNo$") && allInputTags[i+3].name.match("depositAmt$")) {
				if(allInputTags[i+3].value!='' && (allInputTags[i].value=='' || allInputTags[i+1].value=='' || allInputTags[i+2].value=='')){
					addError('','Please fill all the fields under Other Bank account details.',true);
					j.setFieldError('itr.scheduleBA[0].ifscCode','Please fill all the fields under Other Bank account details.');
					//allInputTags[i].value = parseInt('0',10);
			}
		}
	}
	
	
}

function onLoadSection80DType(){
	
	var status = document.getElementsByName('partAGEN1.personalInfo.status')[0];
	if(status.value == 'I'){
		document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80DUsrType')[0].disabled = false;
	} else{
		document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80DUsrType')[0].value = '';
		document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80DUsrType')[0].disabled = true;
	}
	
}

function enableFieldsFor115HFlg()
{
	var ben115HFlg = document.getElementsByName('partAGEN1.filingStatus.benefitUs115HFlg')[0].value;

  if(ben115HFlg == 'Y') {
		document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxAtNormalRatesOnAggrInc')[0].readOnly = false;
		document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxAtSpecialRates')[0].readOnly = false;
		document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.rebateOnAgriInc')[0].readOnly = false;
		document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.exceeds1crSurcharge')[0].readOnly = false;
	}else
		{
		document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxAtNormalRatesOnAggrInc')[0].readOnly = true;
		document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxAtSpecialRates')[0].readOnly = true;
		document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.rebateOnAgriInc')[0].readOnly = true;
		document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.exceeds1crSurcharge')[0].readOnly = true;
		surchargeEditable();

		}

}


//To display sech OS sec 115BDA
function displaySec115BBDA() {

	var tabl = document.getElementById('schduleOsf');
	var allSelects = tabl.getElementsByTagName('SELECT');
	var flag115h = document.getElementsByName('partAGEN1.filingStatus.benefitUs115HFlg')[0].value;
	
	if(flag115h == 'Y'){
		for(var i = 0; i < allSelects.length; i++) {
			if (allSelects[i].name.match("sourceDescription")) {
				var sec115BBDA = document.getElementsByName('scheduleOS.incOthThanOwnRaceHorse.othersGrossDtls['+i+'].sourceDescription')[0].value;
				if(sec115BBDA=='5BBDA'){
					
					addErrorXHTML('','Please enter the amount, if Dividend income from domestic company exceeds Rs.10 lakh.');
					
				}

			}		
			
			
		}
	}
	
}

function enableOSTableFor115H(element, value, tableId){

	var flag =document.getElementsByName(element)[0].value;
	var tabId = "#"+tableId;
		
	$(tabId).find(':input').prop('disabled', true);
	$(tabId).find('.addbtn').prop('hidden', true);
	
	if(flag==value){
			$(tabId).find('.addbtn').prop('hidden', false);
			$(tabId).find(':input').prop('disabled', false);
		}else{
			$(tabId).find('[type=\"checkbox\"]').attr('checked','checked');
			deleteRowTable(tableId,1,1);
			$(tabId).find(':input').prop('disabled', true);
			$(tabId).find('.addbtn').prop('hidden', true);
		}
}


function enable115HFlag()
{
	var status = document.getElementsByName('partAGEN1.personalInfo.status')[0].value;
	var res = document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0].value;
	
	if ( status == 'I' &&  (res == 'RES' || res == 'NOR') )
		{
		document.getElementsByName('partAGEN1.filingStatus.benefitUs115HFlg')[0].disabled = false;
		}else
			{
			document.getElementsByName('partAGEN1.filingStatus.benefitUs115HFlg')[0].disabled = true;
			document.getElementsByName('partAGEN1.filingStatus.benefitUs115HFlg')[0].value = "";
			}
}

//To calculate Tax Payable On Total Income for partB-TTI 1 d
function calculateTaxPayableOnTotalIncFor2a(srcElementName, destElementName){
            
	var totalIncome = zeroOrMore( parseInt(coalesceSetRet(srcElementName),10));
	var taxPayer = document.getElementsByName('partAGEN1.personalInfo.status')[0];
	//IN-I,HUF-H
	var resStatus 			= document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0]; //RES , NRI 
	
	var age	= calcAge();
	
	var netTxblIncome 		= totalIncome;
	
	var tax = 0;
	
	var incTax 				= document.getElementsByName(destElementName)[0];	
	var pan = document.getElementsByName('partAGEN1.personalInfo.pan')[0].value; 
	if((pan.substring(3,4)=='P' || pan.substring(3,4)=='p') && taxPayer.value=='I' && age > 59 && age < 80 && (resStatus.value=='RES' || resStatus.value=='NOR')){

		if(parseInt(netTxblIncome,10) >= parseInt('0',10) && parseInt(netTxblIncome,10) <= parseInt('300000',10)){
			tax = parseInt('0',10);
		}else if(parseInt(netTxblIncome,10) >= parseInt('300001',10) && parseInt(netTxblIncome,10) <= parseInt('500000',10)){
			tax = Math.round(eval( eval(parseInt(netTxblIncome,10) - parseInt('300000',10) )  * parseFloat('0.1'))) ;
		}else if(parseInt(netTxblIncome,10) >= parseInt('500001',10) && parseInt(netTxblIncome,10) <= parseInt('1000000',10)){
			tax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('500000',10) )* parseFloat('0.2')) + parseInt('20000',10)));
		}else if(parseInt(netTxblIncome,10) >= parseInt('1000001',10)){
			tax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('1000000',10) )* parseFloat('0.3')) + parseInt('120000',10)));
		}
	
	}else if((pan.substring(3,4)=='P' || pan.substring(3,4)=='p') && taxPayer.value=='I' && age >= 80 && (resStatus.value=='RES' || resStatus.value=='NOR')){
			   
		if(parseInt(netTxblIncome,10) >= parseInt('0',10) && parseInt(netTxblIncome,10) <= parseInt('500000',10)){
			tax = parseInt('0',10);
		}else if(parseInt(netTxblIncome,10) >= parseInt('500001',10) && parseInt(netTxblIncome,10) <= parseInt('1000000',10)){
			tax = Math.round(eval( eval(parseInt(netTxblIncome,10) - parseInt('500000',10) )  * parseFloat('0.2'))) ;
					
		}else if(parseInt(netTxblIncome,10) >= parseInt('1000001',10)){
			tax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('1000000',10) )* parseFloat('0.3')) + parseInt('100000',10)));             
		}
			   
		
	}else if( (taxPayer.value=='I') || taxPayer.value=='H' ){
		
		if(parseInt(netTxblIncome,10) >= parseInt('0',10) && parseInt(netTxblIncome,10) <= parseInt('250000',10)){
			tax = parseInt('0',10);
		}else if(parseInt(netTxblIncome,10) >= parseInt('250001',10) && parseInt(netTxblIncome,10) <= parseInt('500000',10)){
			tax = Math.round(eval( eval(parseInt(netTxblIncome,10) - parseInt('250000',10) )  * parseFloat('0.1'))) ;
		}else if(parseInt(netTxblIncome,10) >= parseInt('500001',10) && parseInt(netTxblIncome,10) <= parseInt('1000000',10)){
			tax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('500000',10) )* parseFloat('0.2')) + parseInt('25000',10)));
		}else if(parseInt(netTxblIncome,10) >= parseInt('1000001',10)){
			tax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('1000000',10) )* parseFloat('0.3')) + parseInt('125000',10)));
		}
		
	}
	
	var falg115H = document.getElementsByName('partAGEN1.filingStatus.benefitUs115HFlg')[0].value;
	if(falg115H=="Y"){
		setEditableFieldValue(incTax,tax);
	}else{
		incTax.value = tax;
	}
	
}

//Calculate Tax payable on Total Income for rebate
function calculateTaxPayableOnTotalIncRebate(srcElementName, destElementName, forRebate){
            
	var totalIncome = zeroOrMore( parseInt(coalesceSetRet(srcElementName),10));
	var taxPayer = document.getElementsByName('partAGEN1.personalInfo.status')[0];
	//IN-I,HUF-H
	var resStatus 			= document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0]; //RES , NRI 
	
	var age	= calcAge();
	
	var netTxblIncome 		= totalIncome;
	if(forRebate==true){
		netTxblIncome = parseInt(totalIncome, 10) + parseInt(getExemption(), 10);
	}
	
	var tax = 0;
	
	var incTax 				= document.getElementsByName(destElementName)[0];	
	var pan = document.getElementsByName('partAGEN1.personalInfo.pan')[0].value; 
	if((pan.substring(3,4)=='P' || pan.substring(3,4)=='p') && taxPayer.value=='I' && age > 59 && age < 80 && (resStatus.value=='RES' || resStatus.value=='NOR')){

		if(parseInt(netTxblIncome,10) >= parseInt('0',10) && parseInt(netTxblIncome,10) <= parseInt('300000',10)){
			tax = parseInt('0',10);
		}else if(parseInt(netTxblIncome,10) >= parseInt('300001',10) && parseInt(netTxblIncome,10) <= parseInt('500000',10)){
			tax = Math.round(eval( eval(parseInt(netTxblIncome,10) - parseInt('300000',10) )  * parseFloat('0.1'))) ;
		}else if(parseInt(netTxblIncome,10) >= parseInt('500001',10) && parseInt(netTxblIncome,10) <= parseInt('1000000',10)){
			tax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('500000',10) )* parseFloat('0.2')) + parseInt('20000',10)));
		}else if(parseInt(netTxblIncome,10) >= parseInt('1000001',10)){
			tax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('1000000',10) )* parseFloat('0.3')) + parseInt('120000',10)));
		}
	
	}else if((pan.substring(3,4)=='P' || pan.substring(3,4)=='p') && taxPayer.value=='I' && age >= 80 && (resStatus.value=='RES' || resStatus.value=='NOR')){
			   
		if(parseInt(netTxblIncome,10) >= parseInt('0',10) && parseInt(netTxblIncome,10) <= parseInt('500000',10)){
			tax = parseInt('0',10);
		}else if(parseInt(netTxblIncome,10) >= parseInt('500001',10) && parseInt(netTxblIncome,10) <= parseInt('1000000',10)){
			tax = Math.round(eval( eval(parseInt(netTxblIncome,10) - parseInt('500000',10) )  * parseFloat('0.2'))) ;
					
		}else if(parseInt(netTxblIncome,10) >= parseInt('1000001',10)){
			tax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('1000000',10) )* parseFloat('0.3')) + parseInt('100000',10)));             
		}
			   
		
	}else if( (taxPayer.value=='I') || taxPayer.value=='H' ){
		
		if(parseInt(netTxblIncome,10) >= parseInt('0',10) && parseInt(netTxblIncome,10) <= parseInt('250000',10)){
			tax = parseInt('0',10);
		}else if(parseInt(netTxblIncome,10) >= parseInt('250001',10) && parseInt(netTxblIncome,10) <= parseInt('500000',10)){
			tax = Math.round(eval( eval(parseInt(netTxblIncome,10) - parseInt('250000',10) )  * parseFloat('0.1'))) ;
		}else if(parseInt(netTxblIncome,10) >= parseInt('500001',10) && parseInt(netTxblIncome,10) <= parseInt('1000000',10)){
			tax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('500000',10) )* parseFloat('0.2')) + parseInt('25000',10)));
		}else if(parseInt(netTxblIncome,10) >= parseInt('1000001',10)){
			tax = Math.round(eval(eval(eval(parseInt(netTxblIncome,10) - parseInt('1000000',10) )* parseFloat('0.3')) + parseInt('125000',10)));
		}
		
	}
	var falg115H = document.getElementsByName('partAGEN1.filingStatus.benefitUs115HFlg')[0].value;
	if(forRebate && falg115H=="Y" ){
		setEditableFieldValue(incTax,tax);
	}else{
		incTax.value = tax;
	}
		
}
function clearOldSpecialRateTaxValue(){
	var surcharge = document.getElementsByName('partBTTI.computationOfTaxLiability.taxPayableOnTI.taxAtSpecialRates')[0];
		if(surcharge.old!=undefined){
			surcharge.old = undefined;
		}
		if(surcharge.oldvalue!=undefined){
			surcharge.oldvalue = undefined;
		}
}
function clearAadharEnrollment()
{
	var aadharNo = document.getElementsByName('partAGEN1.personalInfo.adharNumber')[0].value;
	if(aadharNo.length > 12){
		
		document.getElementsByName('partAGEN1.personalInfo.adharNumber')[0].value = '';
	}

}


function enableBankDtls()
{

	enableField('itr.refund.scheduleBA.bankDtlsFlag','Y','itr.refund.depositToBankAccount.iFSCCode');
	enableField('itr.refund.scheduleBA.bankDtlsFlag','Y','itr.refund.depositToBankAccount.bankName');
	enableField('itr.refund.scheduleBA.bankDtlsFlag','Y','itr.refund.bankAccountNumber');
	enableField('itr.refund.scheduleBA.bankDtlsFlag','Y','itr.refund.depositAmt');
	
	enableTableForNRI('itr.refund.scheduleBA.bankDtlsFlag', 'Y','scheduleBA');
	
	enableField('itr.refund.scheduleBA.bankDtlsFlag','N','itr.refund.scheduleBA.foreignBankDtls[0].ibanSwiftCode');
	enableField('itr.refund.scheduleBA.bankDtlsFlag','N','itr.refund.scheduleBA.foreignBankDtls[0].bankName');
	enableField('itr.refund.scheduleBA.bankDtlsFlag','N','itr.refund.scheduleBA.foreignBankDtls[0].countryCode');
	enableField('itr.refund.scheduleBA.bankDtlsFlag','N','itr.refund.scheduleBA.foreignBankDtls[0].bankAccountNo');
	
}

function checkSchEIxmlblock()
{
	var resStatus = document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0].value; 
	
	var divIncome = parseInt(coalesce(document.getElementsByName('scheduleEI.dividendInc')[0].value));
	
	if( (resStatus == 'RES' || resStatus == 'NOR') && divIncome > 1000000)
		{
		j.setFieldError('scheduleEI.dividendInc','Dividend income from domestic company should not be entered more than Rs. 10 lakh');
 		addErrorXHTML(document.getElementsByName('scheduleEI.dividendInc')[0],'Dividend income from domestic company should not be entered more than Rs. 10 lakh',true);
		}
	
}

function populateBankFlg()
{

	var residentialStatus  = document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0].value;
	
	if(residentialStatus == 'RES' || residentialStatus == 'NOR')
		{
		document.getElementsByName('itr.refund.scheduleBA.bankDtlsFlag')[0].value = 'Y';
		document.getElementsByName('itr.refund.scheduleBA.bankDtlsFlag')[0].disabled=true;
		}else
			{
			document.getElementsByName('itr.refund.scheduleBA.bankDtlsFlag')[0].disabled=false;
			}
	enableBankDtls();
}
function setSchHPPinZipOnLoad(){
	
	var totHp=eval(parseInt(document.getElementById('scheduleHPLast').cells[0].textContent)-1);

	var state ;
	var country ;
	
	for(var i=0 ;i<totHp;i++){
		
		state = document.getElementsByName('scheduleHP.propertyDetails['+i+'].addressDetail.stateCode')[0].value;
		country = document.getElementsByName('scheduleHP.propertyDetails['+i+'].addressDetail.country')[0].value;
		
		if(country == '91' ){
			document.getElementsByName('scheduleHP.propertyDetails['+i+'].addressDetail.zipCode')[0].value='';
			document.getElementsByName('scheduleHP.propertyDetails['+i+'].addressDetail.zipCode')[0].disabled=true;
		}else if(state =='99'){
			document.getElementsByName('scheduleHP.propertyDetails['+i+'].addressDetail.pinCode')[0].value='';
			document.getElementsByName('scheduleHP.propertyDetails['+i+'].addressDetail.pinCode')[0].disabled=true;
		}else{
			document.getElementsByName('scheduleHP.propertyDetails['+i+'].addressDetail.zipCode')[0].value='';
			document.getElementsByName('scheduleHP.propertyDetails['+i+'].addressDetail.zipCode')[0].disabled=true;
		}
	}
	
}


function section80DChk()
{
	var age = calcAge();
	
	var sec80D  = document.getElementsByName('scheduleVIA.usrDeductUndChapVIA.section80DUsrType')[0].value;
	if( (sec80D == '2' || sec80D == '7' ) && age < 60)
		{
		j.setFieldError('scheduleVIA.usrDeductUndChapVIA.section80DUsrType','Please select a valid option from the dropdown of Sec.80D under Chapter VI-A');
		addErrorXHTML('','Please select a valid option from the dropdown of Sec.80D under Chapter VI-A',true);
		}

}

function genWarningMsgForNRI() {
	
	var resStatus = document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0].value;
	var bankDtlsFlg = document.getElementsByName('itr.refund.scheduleBA.bankDtlsFlag')[0].value;
	if( resStatus == 'NRI' && bankDtlsFlg == 'N' ){
	  addErrorXHTML('','Currently refund will be credited to a bank account located in India and not to a bank account located in a foreign country.');
	  j.setFieldError('itr.refund.scheduleBA.bankDtlsFlag','Currently refund will be credited to a bank account located in India and not to a bank account located in a foreign country.');
	}
}

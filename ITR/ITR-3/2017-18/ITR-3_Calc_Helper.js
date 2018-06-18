//To set Editable FieldValue
function setEditableFieldValue(element, newVal){
    if(element.oldvalue!=newVal){
    	element.value = newVal;
    	element.oldvalue = newVal;
    }
}

////////////////////////////// CG Calculation Starts /////////////////////////////////

//To caluclate sum of CG Deductions
function addCGDeductions(tableId){
	var tab = document.getElementById(tableId);
	var inputs = tab.getElementsByTagName("INPUT");
	var sum = 0;
	for(var i=0;i<inputs.length;i++){
		if(inputs[i].name.match('amount$')){
			sum = parseInt(sum) + parseInt(coalesce(inputs[i].value));
		}
	}
	return sum;
}

function calculateCGDeductions(){
	var tab = document.getElementById('schduleCGDed');
	var inputs = tab.getElementsByTagName('INPUT');
	var sum = 0;
	for(var i=0; i<inputs.length; i++){
		if(inputs[i].name.match('amtDed$')){
			sum = parseInt(sum, 10) + parseInt(coalesce(inputs[i].value), 10);
		}
	}
	var totDeductClaim = document.getElementsByName('scheduleCGPost45.deducClaimInfo.totDeductClaim')[0];
	totDeductClaim.value = sum;
}
//To setOfff STCG With A7
function calcBulidingSellSTCG(){
    
    //calculate deduction
    var totalDedn = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.saleofLandBuild.deductSec48.totalDedn')[0];
    totalDedn.value = eval(coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.saleofLandBuild.deductSec48.aquisitCost') + 
                           coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.saleofLandBuild.deductSec48.improveCost') +  
                           coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.saleofLandBuild.deductSec48.expOnTrans'));
                       
   //calcBalance                  
   var balanceCG = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.saleofLandBuild.balanceCG')[0];
   balanceCG.value = eval(coalesce(document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.saleofLandBuild.fullConsideration50C')[0].value) -
                    coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.saleofLandBuild.deductSec48.totalDedn'));
   
   //gain on asset                  
   var capgainonAssets = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.saleofLandBuild.capgainonAssets')[0];
   var exemptionOrDednUs54 = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.saleofLandBuild.exemptionOrDednUs54')[0];
   exemptionOrDednUs54.value = addCGDeductions('stcgDeduction1');
   if(balanceCG.value > parseInt(0,10)){
   capgainonAssets.value = zeroOrMore(eval(balanceCG.value -
                    		parseInt(exemptionOrDednUs54.value)));
	} else {
		capgainonAssets.value = balanceCG.value;
	}
}

function calcSlumpSaleSTCG(){
	   var netWorthOfUTDivn = document.getElementsByName('scheduleCGFor4.shortTermCapGainFor4.capGainSlumpSale.cgSlumpSale')[0];
	   netWorthOfUTDivn.value = coalesceSetRet('scheduleCGFor4.shortTermCapGainFor4.capGainSlumpSale.fullConsideration')
	   							- coalesceSetRet('scheduleCGFor4.shortTermCapGainFor4.capGainSlumpSale.netWorthOfUTDivn');;
	 
}

function calcEquitySellSTCG(cgosIncome){
	
	var tab = document.getElementById('scheduleCGstcg2');
	var len = tab.tBodies.length;
	var sum = 0;
	for(var i=0;i<len;i++){	
		//Calc deduction
	    var totalDedn = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.equityMFonSTT['+ i +'].deductSec48.totalDedn')[0];
	    totalDedn.value = eval(coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.equityMFonSTT['+ i +'].deductSec48.aquisitCost') + 
	                           coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.equityMFonSTT['+ i +'].deductSec48.improveCost') +  
	                           coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.equityMFonSTT['+ i +'].deductSec48.expOnTrans'));
	    
	    //calcBalance                  
	    var balanceCG = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.equityMFonSTT['+ i +'].balanceCG')[0];
	    balanceCG.value = eval(coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.equityMFonSTT['+ i +'].fullConsideration') -
	    					   totalDedn.value);
	    
	    //gain on equity share
	    var capgainonAssets = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.equityMFonSTT['+ i +'].capgainonAssets')[0];
	    capgainonAssets.value = eval(parseInt(balanceCG.value, 10) +
	                     coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.equityMFonSTT['+ i +'].lossSec94of7Or94of8'));

	    var section = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.equityMFonSTT[' + i +  '].section')[0].value;
	    if(section=='1A'){
	    	sum = parseInt(sum) + parseInt(capgainonAssets.value); 
	    }else if(section=='5AD1biip'){
	    	cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii = capgainonAssets.value;
	    }	    
	    
	}
	return sum;
}

//To calculate securities sell STCG
function calcSecuritiesSellSTCG(){
	//Calc deduction
    var totalDedn = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.deductSec48.totalDedn')[0];
    totalDedn.value = eval(coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.deductSec48.aquisitCost') + 
                           coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.deductSec48.improveCost') +  
                           coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.deductSec48.expOnTrans'));
    
    //calcBalance                  
    var balanceCG = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.balanceCG')[0];
    balanceCG.value = eval(coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.fullConsideration') -
    					   totalDedn.value);
    
    //gain on Securities
    var capgainonAssets = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.capgainonAssets')[0];
    capgainonAssets.value = eval(parseInt(balanceCG.value, 10) +
                     coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.lossSec94of7Or94of8'));     
}

//To calculate other STCG assets
function calcOtherAssetSellSTCG(){
	//Calc deduction
    var totalDedn = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.saleOnOtherAssets.deductSec48.totalDedn')[0];
    totalDedn.value = eval(coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.saleOnOtherAssets.deductSec48.aquisitCost') + 
                           coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.saleOnOtherAssets.deductSec48.improveCost') +  
                           coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.saleOnOtherAssets.deductSec48.expOnTrans'));
    
    //calcBalance                  
    var balanceCG = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.saleOnOtherAssets.balanceCG')[0];
    balanceCG.value = eval(coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.saleOnOtherAssets.fullConsideration') -
    					   totalDedn.value);
    
    var exemptionOrDednUs54 = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.saleOnOtherAssets.exemptionOrDednUs54')[0];
    exemptionOrDednUs54.value = addCGDeductions('stcgDeduction2');
    //gain on Securities
    var capgainonAssets = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.saleOnOtherAssets.capgainonAssets')[0];
    capgainonAssets.value = eval(parseInt(balanceCG.value, 10) +
                     coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.saleOnOtherAssets.lossSec94of7Or94of8') + coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.amtDeemedCGDepAssets')); 
    if(capgainonAssets.value>0){
    	capgainonAssets.value = zeroOrMore(capgainonAssets.value - coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.saleOnOtherAssets.exemptionOrDednUs54'));
    }
}

//To calculate STCG DTAA tax
function calcDtaaTaxSTCG(){
	
	var totAmtStcgUnderDtaa = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.stcgUnderDtaa.totAmtStcgUnderDtaa')[0];
	   
	totAmtStcgUnderDtaa.value = addCGDeductions('scheduleStcgDtaa');
	
}

//To calculate STCG
function calculateSTCG(cgosIncome){
	calcBulidingSellSTCG();
	calcSlumpSaleSTCG();
    var sum = calcEquitySellSTCG(cgosIncome);
    calcSecuritiesSellSTCG();
    
    var amtDeemedCGDepAssets = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.amtDeemedCGDepAssets')[0];
    amtDeemedCGDepAssets.value =coalesceSetRet('scheduleDCG.summaryFromDeprSchCG.totalDepreciation');
    
    calcOtherAssetSellSTCG();
    calcDtaaTaxSTCG();
       
    var totalSTCG = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.totalSTCG')[0];
    totalSTCG.value = eval(coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.saleofLandBuild.capgainonAssets') + 
    						coalesceSetRet('scheduleCGFor4.shortTermCapGainFor4.capGainSlumpSale.cgSlumpSale') +
            				parseInt(sum) +  
            				parseInt(cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii) + 
            				coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.nRITransacSec48Dtl.nRItaxSTTPaid') +  
            				coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.nRITransacSec48Dtl.nRItaxSTTNotPaid') +  
            				coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.capgainonAssets') +  
            				coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.saleOnOtherAssets.capgainonAssets') +  
            				coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54.totAmtStcgUnderDtaa') -
            				coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.stcgUnderDtaa.totAmtStcgUnderDtaa'));
  
	cgosIncome.cgInc.stcg.prctg30 = coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.nRISecur115AD.capgainonAssets');
	
	cgosIncome.cgInc.stcg.prctgAr = eval(coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.saleofLandBuild.capgainonAssets') +
										coalesceSetRet('scheduleCGFor4.shortTermCapGainFor4.capGainSlumpSale.cgSlumpSale') +
										coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.nRITransacSec48Dtl.nRItaxSTTNotPaid') +
										coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.saleOnOtherAssets.capgainonAssets') +
										//coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.amtDeemedCGDepAssets') +
										coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.unUtilizedCapGain54.totAmtStcgUnderDtaa')); 
		
	cgosIncome.cgInc.stcg.prctg15.sec111a = eval(parseInt(sum) + 
										 coalesceSetRet('scheduleCGPost45.shortTermCapGainPost45.nRITransacSec48Dtl.nRItaxSTTPaid') );
    
}

//To calculate building sell LTCG
function calcBulidingSellLTCG(){
    
    //calculate deduction
    var totalDedn = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofLandBuild.deductSec48.totalDedn')[0];
    totalDedn.value = eval(coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.saleofLandBuild.deductSec48.aquisitCost') + 
                           coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.saleofLandBuild.deductSec48.improveCost') +  
                           coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.saleofLandBuild.deductSec48.expOnTrans'));
                       
   //calcBalance                  
   var balanceCG = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofLandBuild.balanceCG')[0];
   balanceCG.value = eval(coalesce(document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofLandBuild.fullConsideration50C')[0].value) -
                    	  coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.saleofLandBuild.deductSec48.totalDedn'));
   
   //gain on asset                  
   var capgainonAssets = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofLandBuild.capgainonAssets')[0];
    
   var exemptionOrDednUs54 = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofLandBuild.exemptionOrDednUs54')[0];
   
   exemptionOrDednUs54.value = addCGDeductions('ltcgDeduction1');
   
   if(balanceCG.value > parseInt(0,10)){
   capgainonAssets.value = zeroOrMore(eval(balanceCG.value -
                    			parseInt(exemptionOrDednUs54.value)));
	} else {
	capgainonAssets.value = balanceCG.value;
	}
}

function calcSlumpSaleLTCG(){
	   var netWorthOfUTDivn = document.getElementsByName('scheduleCGFor4.shortTermCapGainFor4.capGainSlumpSale.cgSlumpSaleB')[0];
	   netWorthOfUTDivn.value = coalesceSetRet('scheduleCGFor4.shortTermCapGainFor4.capGainSlumpSale.fullConsiderationB')
	   							- coalesceSetRet('scheduleCGFor4.shortTermCapGainFor4.capGainSlumpSale.netWorthOfUTDivnB');
	    var exemptionOrDednUs54 = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.capGainSlumpSale.exemptionOrDednUs54')[0];
	    exemptionOrDednUs54.value = addCGDeductions('ltcgDeduction3');
	    var longTCgains = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.capGainSlumpSale.capgainonAssets')[0];	    
	    if(parseInt(netWorthOfUTDivn.value) < 0){
	    	longTCgains.value = netWorthOfUTDivn.value;
	    }else{
	    	longTCgains.value = zeroOrMore(netWorthOfUTDivn.value - exemptionOrDednUs54.value);
	    }
}

function calcBondSellLTCG(){
	//Calc deduction
    var totalDedn = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofBondsDebntr.deductSec48.totalDedn')[0];
    totalDedn.value = eval(coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.saleofBondsDebntr.deductSec48.aquisitCost') + 
                           coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.saleofBondsDebntr.deductSec48.improveCost') +  
                           coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.saleofBondsDebntr.deductSec48.expOnTrans'));
    
    //calcBalance                  
    var balanceCG = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofBondsDebntr.balanceCG')[0];
    balanceCG.value = eval(coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.saleofBondsDebntr.fullConsideration') -
    					   totalDedn.value);
    
    //gain on Assets
    var capgainonAssets = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofBondsDebntr.capgainonAssets')[0];
    var exemptionOrDednUs54 = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofBondsDebntr.exemptionOrDednUs54')[0];
    exemptionOrDednUs54.value = addCGDeductions('ltcgDeduction2');
	if(balanceCG.value > parseInt(0,10)){
    capgainonAssets.value = zeroOrMore(eval(balanceCG.value -
                     			 parseInt(exemptionOrDednUs54.value)));    
	} else {
	capgainonAssets.value = balanceCG.value;
	}
}

//To calculate  listed secuirities sell LTCG
function calcListedSecuritiesSellLTCG(cgosIncome){
	
	var tab = document.getElementById('scheduleCGltcg3');
	var len = tab.tBodies.length;
	var sum = 0;
	for(var i=0;i<len;i++){
	
		//Calc deduction
	    var totalDedn = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.proviso112Applicable['+ i +'].deductSec48.totalDedn')[0];
	    totalDedn.value = eval(coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.proviso112Applicable['+ i +'].deductSec48.aquisitCost') + 
	                           coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.proviso112Applicable['+ i +'].deductSec48.improveCost') +  
	                           coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.proviso112Applicable['+ i +'].deductSec48.expOnTrans'));
	    
	    //calcBalance                  
	    var balanceCG = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.proviso112Applicable['+ i +'].balanceCG')[0];
	    balanceCG.value = eval(coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.proviso112Applicable['+ i +'].fullConsideration') -
	    					   totalDedn.value);
	    
	    //gain on Assets
	    var capgainonAssets = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.proviso112Applicable['+ i +'].capgainonAssets')[0];
	    var exemptionOrDednUs54S = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.proviso112Applicable['+ i +'].exemptionOrDednUs54S')[0];
	    exemptionOrDednUs54S.value = addCGDeductions('scheduleCGltcg3_ded' + (i+1));
	
	    if(balanceCG.value > parseInt(0,10)){
	    capgainonAssets.value = zeroOrMore(eval(balanceCG.value -
	                     			 parseInt(exemptionOrDednUs54S.value)));     
		} else {
									 
			capgainonAssets.value = balanceCG.value;
		}
	    
	    var section = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.proviso112Applicable[' + i +  '].sectionCode')[0].value;
	    if(section=='22'){
	    	sum = parseInt(sum) + parseInt(capgainonAssets.value); 
	    }else if(section=='5ACA1b'){
	    	cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1 = capgainonAssets.value;
	    }
	}
	
	return sum;
}

//To calculate  NRI proviso
function calcNRIProvisoSec48LTCG(){
	var balanceCG = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIProvisoSec48.BalanceCG')[0];
	var ltcgWithoutBenefit = coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.nRIProvisoSec48.ltcgWithoutBenefit');
	var exemptionOrDednUs54 = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIProvisoSec48.exemptionOrDednUs54')[0];
	exemptionOrDednUs54.value = addCGDeductions('scheduleCGltcg4_ded1');
	if(coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.nRIProvisoSec48.ltcgWithoutBenefit') > parseInt(0, 10)){
		balanceCG.value = zeroOrMore(eval( ltcgWithoutBenefit - exemptionOrDednUs54.value));
	}else{
		balanceCG.value = coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.nRIProvisoSec48.ltcgWithoutBenefit');
	}    
}

//To calculate unlisted securities sell
function calcUnlistedSecuritiesSellLTCG(cgosIncome){
	//Calc deduction
	
	var tab = document.getElementById('stcg10pctTab');
	var len = tab.tBodies.length;
	var sum = 0;
	for(var i=0;i<len;i++){
	    var totalDedn = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115[' + i +  '].deductSec48.totalDedn')[0];
	    totalDedn.value = eval(coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115[' + i +  '].deductSec48.aquisitCost') + 
	                           coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115[' + i +  '].deductSec48.improveCost') +  
	                           coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115[' + i +  '].deductSec48.expOnTrans'));
	    
	    //calcBalance                  
	    var balanceCG = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115[' + i +  '].balanceCG')[0];
	    balanceCG.value = eval(coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115[' + i +  '].fullConsideration') -
	    					   totalDedn.value);
	    
	    //gain on Assets
	    var capgainonAssets = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115[' + i +  '].capgainonAssets')[0];
		var exemptionOrDednUs54S = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115[' + i +  '].exemptionOrDednUs54S')[0];
		exemptionOrDednUs54S.value = addCGDeductions('stcg10pctTab_ded' + (i+1));
		
		
		if(balanceCG.value > parseInt(0,10)){
	    capgainonAssets.value = zeroOrMore(eval(balanceCG.value -
	    							 parseInt(exemptionOrDednUs54S.value)));
		} else {
		capgainonAssets.value = balanceCG.value;
		}
	    sum = parseInt(sum, 10) + parseInt(capgainonAssets.value, 10);
	    var section = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115[' + i +  '].sectionCode')[0].value;
	    if(section=='21ciii'){
	    	cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2 = parseInt(capgainonAssets.value, 10); 
	    }else if(section=='5AC1c'){
	    	cgosIncome.cgInc.ltcg.prctg10.sec115AC_1 = parseInt(capgainonAssets.value, 10);
	    }else if(section=='5ACA1b'){
	    	cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1 = parseInt(capgainonAssets.value, 10);
	    }else if(section=='5ADiii'){
	    	cgosIncome.cgInc.ltcg.prctg10.sec115AD_3 = parseInt(capgainonAssets.value, 10);
	    } 
	}
	return sum;
}

//To calculate for LTCG asset
function calcForexAssetLTCG(){
	var balonSpeciAsset = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.balonSpeciAsset')[0];
	var dednSpecAssetus115 = coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.dednSpecAssetus115');
	var saleonSpecAsset = coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.saleonSpecAsset');

	if(parseInt(saleonSpecAsset) > parseInt(0, 10)){
		balonSpeciAsset.value = zeroOrMore(eval(parseInt(saleonSpecAsset) - 
							   		 parseInt(dednSpecAssetus115)));
	}else{
		balonSpeciAsset.value = saleonSpecAsset;
	} 	
	
	var balOtherthanSpecAsset = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.balOtherthanSpecAsset')[0];
	var dednOtherSpecAssetus115 = coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.dednOtherSpecAssetus115');
	var saleOtherSpecAsset = coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.saleOtherSpecAsset');
	
	if(parseInt(saleOtherSpecAsset) > parseInt(0, 10)){
		balOtherthanSpecAsset.value = zeroOrMore(eval(parseInt(saleOtherSpecAsset) - 
							   		 parseInt(dednOtherSpecAssetus115)));
	}else{
		balOtherthanSpecAsset.value = saleOtherSpecAsset;
	} 
}

//To calculate  other LTCG assets
function calcOthAssetLTCG(){
	//Calc deduction
    var totalDedn = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofAssetNA.deductSec48.totalDedn')[0];
    totalDedn.value = eval(coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.saleofAssetNA.deductSec48.aquisitCost') + 
                           coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.saleofAssetNA.deductSec48.improveCost') +  
                           coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.saleofAssetNA.deductSec48.expOnTrans'));
    
    //calcBalance                  
    var balanceCG = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofAssetNA.balanceCG')[0];
    balanceCG.value = eval(coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.saleofAssetNA.deductSec48.fullConsideration') -
    					   totalDedn.value);
    
    //gain on Assets
    var capgainonAssets = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofAssetNA.capgainonAssets')[0];
    var exemptionOrDednUs54S = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.saleofAssetNA.exemptionOrDednUs54S')[0];
    exemptionOrDednUs54S.value = addCGDeductions('scheduleCGltcg7');
    if(parseInt(balanceCG.value) > 0){
    capgainonAssets.value = zeroOrMore(eval(balanceCG.value -
    							 parseInt(exemptionOrDednUs54S.value)));
    }else{
    	capgainonAssets.value = balanceCG.value;
    }
}

//To calculate DTAA tax 
function calcDtaaTaxLTCG(){
	var totAmtLtcgUnderDtaa = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.ltcgUnderDtaa.totAmtLtcgUnderDtaa')[0];
	   
	totAmtLtcgUnderDtaa.value = addCGDeductions('scheduleLtcgDtaa');
	
}

//To calculate  lTCG
function calculateLTCG(cgosIncome){
    
	calcBulidingSellLTCG();
	calcSlumpSaleLTCG();
	calcBondSellLTCG();
	var secSell = calcListedSecuritiesSellLTCG(cgosIncome);
	calcNRIProvisoSec48LTCG();
	var sum = calcUnlistedSecuritiesSellLTCG(cgosIncome);
	calcForexAssetLTCG();
	calcOthAssetLTCG();	
	calcDtaaTaxLTCG();
    var totalLTCG = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.totalLTCG')[0];
   
    totalLTCG.value = eval( coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.saleofLandBuild.capgainonAssets') + 
    						coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.capGainSlumpSale.capgainonAssets') + 
            				coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.saleofBondsDebntr.capgainonAssets') +  
            				parseInt(secSell) +
            				parseInt(coalesce(cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1)) +              				
            				parseInt(sum, 10) +  
            				coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.balonSpeciAsset') +  
            				coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.balOtherthanSpecAsset') +  
            				coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.saleofAssetNA.capgainonAssets') +  
            				coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.nRIProvisoSec48.BalanceCG') +
            				coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.stcgUnderDtaa.totAmtStcgUnderDtaa') -
            				coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.ltcgUnderDtaa.totAmtLtcgUnderDtaa'));

	cgosIncome.cgInc.ltcg.prctg20.sec112 = eval(coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.saleofLandBuild.capgainonAssets') + 
												coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.capGainSlumpSale.capgainonAssets') + 
												coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.saleofBondsDebntr.capgainonAssets') +  
												coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.nRIProvisoSec48.BalanceCG')  +
												coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.saleofAssetNA.capgainonAssets')+
												coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.stcgUnderDtaa.totAmtStcgUnderDtaa')
												- setOffWithDtaa('sec112'));
	
	
	cgosIncome.cgInc.ltcg.prctg20.sec11EA = coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.balOtherthanSpecAsset') - setOffWithDtaa('sec11EA');
		
	cgosIncome.cgInc.ltcg.prctg10.secProviso = eval(parseInt(secSell) - setOffWithDtaa('secProviso'));
	
	cgosIncome.cgInc.ltcg.prctg10.sec115E_b = coalesceSetRet('scheduleCGPost45.longTermCapGainPost45.nRISaleofForeignAsset.balonSpeciAsset') - setOffWithDtaa('sec115E_b');
	
}

// To setoff CG
function doCGSetOff(cgosIncome){
	populateCGTab(cgosIncome);
	setOffPctg30Loss(cgosIncome);
	setOffPctgArLoss(cgosIncome);
	setOffPctg20Loss(cgosIncome);	
	setOffPctg15Loss(cgosIncome);
	setOffPctg10Loss(cgosIncome);
}
	
//To setOfff STCG With A9
function setOffSTCGWithA9(cgosIncome) {
	
	var sec111a= parseInt(cgosIncome.cgInc.stcg.prctg15.sec111a,10);
	var sec115ad_1_b_ii = parseInt(cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii,10);
	
	var tab = document.getElementById('scheduleStcgDtaa');
	var noOfRows = tab.rows.length - 2;
	
	var sectionValue;
	var amount;
	
	for(var i=0; i<noOfRows; i++){
		sectionValue = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.stcgUnderDtaa['+i+'].itemIncluded')[0].value;
		amount = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.stcgUnderDtaa['+i+'].amount')[0].value;
		
		if(sectionValue=='A3e_111A' || sectionValue=='A4a' ){
			sec111a -= amount;
		}
		else if(sectionValue=='A3e_115AD'){
			sec115ad_1_b_ii -= amount;
		}
		else if(sectionValue=='A5e'){
			cgosIncome.cgInc.stcg.prctg30 -= amount;			
		}
		else if(sectionValue=='A1e'||sectionValue=='A4b'||sectionValue=='A6g'||sectionValue=='A7' ||sectionValue=='A2c'){
			cgosIncome.cgInc.stcg.prctgAr -= amount;
		}
	}
	
	cgosIncome.cgInc.stcg.prctg15.sec111a = sec111a;
	cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii=sec115ad_1_b_ii;
	
}

//To setOff LTCG With B10
function setOffLTCGWithB10(cgosIncome) {
	
	var tab = document.getElementById('scheduleStcgDtaa');
	var rowCount = tab.rows.length - 2;
	var sectionValue;
	var amount;
	for(var i=0; i<rowCount; i++){
		sectionValue = document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.stcgUnderDtaa['+i+'].itemIncluded')[0].value;
		amount = parseInt(document.getElementsByName('scheduleCGPost45.shortTermCapGainPost45.stcgUnderDtaa['+i+'].amount')[0].value,10);
		if(sectionValue == 'B4e_22'){
			cgosIncome.cgInc.ltcg.prctg10.secProviso -= amount;
		} else if(sectionValue == 'B4e_5ACA1b'){
			cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1 -= amount;
		} else if(sectionValue == 'B6e_21ciii'){
			cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2 -= amount;
		} else if(sectionValue == 'B6e_5AC1c'){
			cgosIncome.cgInc.ltcg.prctg10.sec115AC_1 -= amount;
		} else if(sectionValue == 'B6e_5ADiii'){
			cgosIncome.cgInc.ltcg.prctg10.sec115AD_3 -= amount;
		} else if(sectionValue == 'B7c'){
			cgosIncome.cgInc.ltcg.prctg10.sec115E_b -= amount;
		} else if(sectionValue == 'B1e' || sectionValue == 'B2e' || sectionValue == 'B3e' || sectionValue == 'B5c' || sectionValue == 'B8e' || sectionValue == 'B9'){
			cgosIncome.cgInc.ltcg.prctg20.sec112 -= amount;
		} else if(sectionValue == 'B7f'){
			cgosIncome.cgInc.ltcg.prctg20.sec11EA -= amount;
		}
	}
	
}
//To populate CG Tab values
function populateCGTab(cgosIncome){

	setOffSTCGWithA9(cgosIncome);
	setOffLTCGWithB10(cgosIncome);
	var stcg = cgosIncome.cgInc.stcg;
	var prctg15 = cgosIncome.cgInc.stcg.prctg15;
	var prctg15Sum = eval( parseInt(prctg15.sec111a,10) + 
							 parseInt(prctg15.sec115ad_1_b_ii,10));
	
	var neg15 = 0;
	if(zeroOrLess(prctg15.sec111a) < 0){
		neg15 = parseInt(neg15) + parseInt(prctg15.sec111a);
		prctg15.sec111a = 0;
	}
	if(zeroOrLess(prctg15.sec115ad_1_b_ii) < 0){
		neg15 = parseInt(neg15) + parseInt(prctg15.sec115ad_1_b_ii);
		prctg15.sec115ad_1_b_ii = 0;
	}	
	
	if(neg15 < 0){
		var setOff = setOffAgainst111a(neg15, cgosIncome);
		neg15 = parseInt(neg15) + parseInt(setOff);
		setOff = setOffAgainst115ad_1_b_ii(neg15, cgosIncome);
		neg15 = parseInt(neg15) + parseInt(setOff);
		prctg15.sec111a = parseInt(neg15) + parseInt(prctg15.sec111a);
	}
	
	setProfitLoss(prctg15Sum, 'scheduleCGPost45.currYrLosses.inLossSetOff.stclSetoff15Per', 'scheduleCGPost45.currYrLosses.inStcg15Per.currYearIncome');
	setProfitLoss(stcg.prctg30, 'scheduleCGPost45.currYrLosses.inLossSetOff.StclSetoff30Per', 'scheduleCGPost45.currYrLosses.inStcg30Per.currYearIncome');
	setProfitLoss(stcg.prctgAr, 'scheduleCGPost45.currYrLosses.inLossSetOff.StclSetoffAppRate', 'scheduleCGPost45.currYrLosses.inStcgAppRate.currYearIncome');
	
	var prctg10 = cgosIncome.cgInc.ltcg.prctg10;
	prctg10.sec115ACA_1 = prctg10.sec115ACA_1 - setOffWithDtaa('sec115ACA_1');
	prctg10.sec112_1_c_2 = prctg10.sec112_1_c_2 - setOffWithDtaa('sec112_1_c_2');
	prctg10.sec115AC_1 = prctg10.sec115AC_1 -  setOffWithDtaa('sec115AC_1');
	prctg10.sec115AD_3 = prctg10.sec115AD_3 - setOffWithDtaa('sec115AD_3');
	
	var prctg10Sum = eval( parseInt(prctg10.secProviso,10) + 
							 parseInt(prctg10.sec112_1_c_2,10) + 
							 parseInt(prctg10.sec115AC_1,10) + 
							 parseInt(prctg10.sec115ACA_1,10) + 
							 parseInt(prctg10.sec115AD_3,10) + 
							 parseInt(prctg10.sec115E_b,10) );
					 
	var neg10 = 0;
	
	if(zeroOrLess(prctg10.secProviso) < 0){
		neg10 = parseInt(neg10) + parseInt(prctg10.secProviso);
		prctg10.secProviso = 0;
	}
	if(zeroOrLess(prctg10.sec112_1_c_2) < 0){
		neg10 = parseInt(neg10) + parseInt(prctg10.sec112_1_c_2);
		prctg10.sec112_1_c_2 = 0;
	}
	if(zeroOrLess(prctg10.sec115AC_1) < 0){
		neg10 = parseInt(neg10) + parseInt(prctg10.sec115AC_1);
		prctg10.sec115AC_1 = 0;
	}
	if(zeroOrLess(prctg10.sec115ACA_1) < 0){
		neg10 = parseInt(neg10) + parseInt(prctg10.sec115ACA_1);
		prctg10.sec115ACA_1 = 0;
	}
	if(zeroOrLess(prctg10.sec115AD_3) < 0){
		neg10 = parseInt(neg10) + parseInt(prctg10.sec115AD_3);
		prctg10.sec115AD_3 = 0;
	}
	if(zeroOrLess(prctg10.sec115E_b) < 0){
		neg10 = parseInt(neg10) + parseInt(prctg10.sec115E_b);
		prctg10.sec115E_b = 0;
	}

	if(neg10 < 0){
		var setOff = setOffAgainst112_1_c_2(neg10, cgosIncome);
		neg10 = parseInt(neg10) + parseInt(setOff);
		setOff = setOffAgainst115AC_1(neg10, cgosIncome);
		neg10 = parseInt(neg10) + parseInt(setOff);
		setOff = setOffAgainst115ACA_1(neg10, cgosIncome);
		neg10 = parseInt(neg10) + parseInt(setOff);
		setOff = setOffAgainst115AD_3(neg10, cgosIncome);
		neg10 = parseInt(neg10) + parseInt(setOff);
		setOff = setOffAgainst115E_b(neg10, cgosIncome);
		neg10 = parseInt(neg10) + parseInt(setOff);
		setOff = setOffAgainstsecProviso(neg10, cgosIncome);
		neg10 = parseInt(neg10) + parseInt(setOff);	
		prctg10.sec112_1_c_2 = parseInt(neg10) + parseInt(prctg10.sec112_1_c_2);	
	}
		
	
	var prctg20 = cgosIncome.cgInc.ltcg.prctg20;
	var prctg20Sum = eval( parseInt(prctg20.sec112,10) + 
							 parseInt(prctg20.sec11EA,10));
	
	var neg20 = 0;
	if(zeroOrLess(prctg20.sec112) < 0){
		neg20 = parseInt(neg20) + parseInt(prctg20.sec112);
		prctg20.sec112 = 0;
	}
	if(zeroOrLess(prctg20.sec11EA) < 0){
		neg20 = parseInt(neg20) + parseInt(prctg20.sec11EA);
		prctg20.sec11EA = 0;
	}	
	
	if(neg20 < 0){
		var setOff = setOffAgainst112(neg20, cgosIncome);
		neg20 = parseInt(neg20) + parseInt(setOff);
		setOff = setOffAgainst115Ea(neg20, cgosIncome);
		neg20 = parseInt(neg20) + parseInt(setOff);
		prctg20.sec112 = parseInt(neg20) + parseInt(prctg20.sec112 );
	}	
	
	setProfitLoss(prctg10Sum, 'scheduleCGPost45.currYrLosses.inLossSetOff.LtclSetOff10Per', 'scheduleCGPost45.currYrLosses.inLtcg10Per.currYearIncome');
	setProfitLoss(prctg20Sum, 'scheduleCGPost45.currYrLosses.inLossSetOff.LtclSetOff20Per', 'scheduleCGPost45.currYrLosses.inLtcg20Per.currYearIncome');
	

}



//To setOff 30 Percentage Loss
function setOffPctg30Loss(cgosIncome){
	var inStcgAppRate = document.getElementsByName('scheduleCGPost45.currYrLosses.inStcgAppRate.stclSetoff30Per')[0];
	var inStcg15Per = document.getElementsByName('scheduleCGPost45.currYrLosses.inStcg15Per.stclSetoff30Per')[0];
	var inLtcg20Per = document.getElementsByName('scheduleCGPost45.currYrLosses.inLtcg20Per.StclSetoff30Per')[0];
	var inLtcg10Per = document.getElementsByName('scheduleCGPost45.currYrLosses.inLtcg10Per.stclSetoff30Per')[0];
	
	var amtSetOff = 0;
	
	amtSetOff = setOffAgainstAr(parseInt(cgosIncome.cgInc.stcg.prctg30, 10), cgosIncome);
	cgosIncome.cgInc.stcg.prctg30 = eval( parseInt(amtSetOff, 10) +
										  parseInt(cgosIncome.cgInc.stcg.prctg30, 10));
	inStcgAppRate.value = Math.abs(parseInt(amtSetOff, 10));	

	amtSetOff = setOffAgainst20(parseInt(cgosIncome.cgInc.stcg.prctg30, 10), cgosIncome);
	cgosIncome.cgInc.stcg.prctg30 = eval( parseInt(amtSetOff, 10) +
										  parseInt(cgosIncome.cgInc.stcg.prctg30, 10));
	inLtcg20Per.value = Math.abs(parseInt(amtSetOff, 10));	
	
	amtSetOff = setOffAgainst15(parseInt(cgosIncome.cgInc.stcg.prctg30, 10), cgosIncome);
	cgosIncome.cgInc.stcg.prctg30 = eval( parseInt(amtSetOff, 10) +
										  parseInt(cgosIncome.cgInc.stcg.prctg30, 10));
	inStcg15Per.value = Math.abs(parseInt(amtSetOff, 10));
	
	amtSetOff = setOffAgainst10(parseInt(cgosIncome.cgInc.stcg.prctg30, 10), cgosIncome);
	cgosIncome.cgInc.stcg.prctg30 = eval( parseInt(amtSetOff, 10) +
										  parseInt(cgosIncome.cgInc.stcg.prctg30, 10));
	inLtcg10Per.value = Math.abs(parseInt(amtSetOff, 10));
}

//To setOff Percentage Applicable rates Loss
function setOffPctgArLoss(cgosIncome){
	var inStcg30Per = document.getElementsByName('scheduleCGPost45.currYrLosses.inStcg30Per.stclSetoffAppRate')[0];
	var inStcg15Per = document.getElementsByName('scheduleCGPost45.currYrLosses.inStcg15Per.StclSetoffAppRate')[0];
	var inLtcg20Per = document.getElementsByName('scheduleCGPost45.currYrLosses.inLtcg20Per.StclSetoffAppRate')[0];
	var inLtcg10Per = document.getElementsByName('scheduleCGPost45.currYrLosses.inLtcg10Per.stclSetoffAppRate')[0];
	
	var amtSetOff = 0;
	
	amtSetOff = setOffAgainst30(parseInt(cgosIncome.cgInc.stcg.prctgAr, 10), cgosIncome);
	cgosIncome.cgInc.stcg.prctgAr = eval( parseInt(amtSetOff, 10) +
										  parseInt(cgosIncome.cgInc.stcg.prctgAr, 10));
	inStcg30Per.value = Math.abs(parseInt(amtSetOff, 10));	

	amtSetOff = setOffAgainst20(parseInt(cgosIncome.cgInc.stcg.prctgAr, 10), cgosIncome);
	cgosIncome.cgInc.stcg.prctgAr = eval( parseInt(amtSetOff, 10) +
										  parseInt(cgosIncome.cgInc.stcg.prctgAr, 10));
	inLtcg20Per.value = Math.abs(parseInt(amtSetOff, 10));	
	
	amtSetOff = setOffAgainst15(parseInt(cgosIncome.cgInc.stcg.prctgAr, 10), cgosIncome);
	cgosIncome.cgInc.stcg.prctgAr = eval( parseInt(amtSetOff, 10) +
										  parseInt(cgosIncome.cgInc.stcg.prctgAr, 10));
	inStcg15Per.value = Math.abs(parseInt(amtSetOff, 10));
	
	amtSetOff = setOffAgainst10(parseInt(cgosIncome.cgInc.stcg.prctgAr, 10), cgosIncome);
	cgosIncome.cgInc.stcg.prctgAr = eval( parseInt(amtSetOff, 10) +
										  parseInt(cgosIncome.cgInc.stcg.prctgAr, 10));
	inLtcg10Per.value = Math.abs(parseInt(amtSetOff, 10));
}

//To setOff Percentage 15 Loss
function setOffPctg15Loss(cgosIncome){
	var inStcg30Per = document.getElementsByName('scheduleCGPost45.currYrLosses.inStcg30Per.stclSetoff15Per')[0];
	var inStcgAppRate = document.getElementsByName('scheduleCGPost45.currYrLosses.inStcgAppRate.stclSetoff15Per')[0];
	var inLtcg20Per = document.getElementsByName('scheduleCGPost45.currYrLosses.inLtcg20Per.StclSetoff15Per')[0];
	var inLtcg10Per = document.getElementsByName('scheduleCGPost45.currYrLosses.inLtcg10Per.stclSetoff15Per')[0];
	
	var amtSetOff = 0;
	var totalSetOff = 0;

	var prctg15 = cgosIncome.cgInc.stcg.prctg15;
	var prctg15Sum = eval( parseInt(prctg15.sec111a,10) + 
							 parseInt(prctg15.sec115ad_1_b_ii,10));
	
	amtSetOff = setOffAgainst30(parseInt(prctg15Sum, 10), cgosIncome);
	prctg15Sum = eval( parseInt(amtSetOff, 10) +
					   parseInt(prctg15Sum, 10));
	totalSetOff = amtSetOff;
	inStcg30Per.value = Math.abs(parseInt(amtSetOff, 10));	

	amtSetOff = setOffAgainstAr(parseInt(prctg15Sum, 10), cgosIncome);
	prctg15Sum = eval( parseInt(amtSetOff, 10) +
										  parseInt(prctg15Sum, 10));
	totalSetOff = parseInt(totalSetOff) + parseInt(amtSetOff);
	inStcgAppRate.value = Math.abs(parseInt(amtSetOff, 10));

	amtSetOff = setOffAgainst20(parseInt(prctg15Sum, 10), cgosIncome);
	prctg15Sum = eval( parseInt(amtSetOff, 10) +
										  parseInt(prctg15Sum, 10));
	totalSetOff = parseInt(totalSetOff) + parseInt(amtSetOff);
	inLtcg20Per.value = Math.abs(parseInt(amtSetOff, 10));
	
	amtSetOff = setOffAgainst10(parseInt(prctg15Sum, 10), cgosIncome);
	prctg15Sum = eval( parseInt(amtSetOff, 10) +
										  parseInt(prctg15Sum, 10));
	totalSetOff = parseInt(totalSetOff) + parseInt(amtSetOff);
	inLtcg10Per.value = Math.abs(parseInt(amtSetOff, 10));
	
	if(parseInt(totalSetOff, 10) >= 0 && Math.abs(parseInt(cgosIncome.cgInc.stcg.prctg15.sec111a, 10)) > parseInt(totalSetOff, 10)){
		cgosIncome.cgInc.stcg.prctg15.sec111a = parseInt(cgosIncome.cgInc.stcg.prctg15.sec111a, 10) + 
												parseInt(totalSetOff, 10);
		amtSetOff = 0;
	}else if(parseInt(totalSetOff, 10) >= 0 && parseInt(cgosIncome.cgInc.stcg.prctg15.sec111a, 10) < 0){
		amtSetOff = parseInt(totalSetOff, 10) + 
			parseInt(cgosIncome.cgInc.stcg.prctg15.sec111a, 10) ;
		cgosIncome.cgInc.stcg.prctg15.sec111a = 0;
	}

	if(parseInt(totalSetOff, 10) >= 0 && Math.abs(parseInt(cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii, 10)) > parseInt(totalSetOff, 10)){
		cgosIncome.cgInc.ltcg.prctg20.sec115ad_1_b_ii = parseInt(cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii, 10) + 
												parseInt(totalSetOff, 10);
		amtSetOff = 0;
	}else if(parseInt(totalSetOff, 10) >= 0 && parseInt(cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii, 10) < 0){
		amtSetOff = parseInt(totalSetOff, 10) + 
					parseInt(cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii, 10) ;
		cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii = 0;
	}		
	
}

//To setOff Percentage 20 Loss
function setOffPctg20Loss(cgosIncome){
	var inLtcg10Per = document.getElementsByName('scheduleCGPost45.currYrLosses.inLtcg10Per.ltclSetOff20Per')[0];

	var amtSetOff = 0;
					 
	var prctg20 = cgosIncome.cgInc.ltcg.prctg20;
	var prctg20Sum = eval( parseInt(prctg20.sec112,10) + 
							 parseInt(prctg20.sec11EA,10));
	
	amtSetOff = setOffAgainst10(parseInt(prctg20Sum, 10), cgosIncome);
	
	inLtcg10Per.value = Math.abs(parseInt(amtSetOff, 10));
	
	if(parseInt(amtSetOff, 10) >= 0 && Math.abs(parseInt(cgosIncome.cgInc.ltcg.prctg20.sec112, 10)) > parseInt(amtSetOff, 10)){
		cgosIncome.cgInc.ltcg.prctg20.sec112 = parseInt(cgosIncome.cgInc.ltcg.prctg20.sec112, 10) + 
												parseInt(amtSetOff, 10);
		amtSetOff = 0;
	}else if(parseInt(amtSetOff, 10) >= 0 && parseInt(cgosIncome.cgInc.ltcg.prctg20.sec112, 10) < 0){
		amtSetOff = parseInt(amtSetOff, 10) + 
			parseInt(cgosIncome.cgInc.ltcg.prctg20.sec112, 10) ;
		cgosIncome.cgInc.ltcg.prctg20.sec112 = 0;
	}

	if(parseInt(amtSetOff, 10) >= 0 && Math.abs(parseInt(cgosIncome.cgInc.ltcg.prctg20.sec11EA, 10)) > parseInt(amtSetOff, 10)){
		cgosIncome.cgInc.ltcg.prctg20.sec11EA = parseInt(cgosIncome.cgInc.ltcg.prctg20.sec11EA, 10) + 
												parseInt(amtSetOff, 10);
		amtSetOff = 0;
	}else if(parseInt(amtSetOff, 10) >= 0 && parseInt(cgosIncome.cgInc.ltcg.prctg20.sec11EA, 10) < 0){
		amtSetOff = parseInt(amtSetOff, 10) + 
					parseInt(cgosIncome.cgInc.ltcg.prctg20.sec11EA, 10) ;
		cgosIncome.cgInc.ltcg.prctg20.sec11EA = 0;
	}		

}

//To setOff Percentage 10 Loss
function setOffPctg10Loss(cgosIncome){
	var inLtcg20Per = document.getElementsByName('scheduleCGPost45.currYrLosses.inLtcg20Per.LtclSetOff10Per')[0];
	
	var amtSetOff = 0;
	
	
	var prctg10 = cgosIncome.cgInc.ltcg.prctg10;
	var prctg10Sum = eval( parseInt(prctg10.secProviso,10) + 
							 parseInt(prctg10.sec112_1_c_2,10) + 
							 parseInt(prctg10.sec115AC_1,10) + 
							 parseInt(prctg10.sec115ACA_1,10) + 
							 parseInt(prctg10.sec115AD_3,10) + 
							 parseInt(prctg10.sec115E_b,10) );

	amtSetOff = setOffAgainst20(parseInt(prctg10Sum, 10), cgosIncome);
	
	inLtcg20Per.value = Math.abs(parseInt(amtSetOff, 10));
	
	if(parseInt(amtSetOff, 10) >= 0 && Math.abs(parseInt(cgosIncome.cgInc.ltcg.prctg10.secProviso, 10)) > parseInt(amtSetOff, 10)){
		cgosIncome.cgInc.ltcg.prctg10.secProviso = parseInt(cgosIncome.cgInc.ltcg.prctg10.secProviso, 10) + 
												parseInt(amtSetOff, 10);
		amtSetOff = 0;
	}else if(parseInt(amtSetOff, 10) >= 0 && parseInt(cgosIncome.cgInc.ltcg.prctg10.secProviso, 10) < 0){
		amtSetOff = parseInt(amtSetOff, 10) + 
					parseInt(cgosIncome.cgInc.ltcg.prctg10.secProviso, 10) ;
		cgosIncome.cgInc.ltcg.prctg10.secProviso = 0;
	}

	if(parseInt(amtSetOff, 10) >= 0 && Math.abs(parseInt(cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2, 10)) > parseInt(amtSetOff, 10)){
		cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2 = parseInt(cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2, 10) +
												parseInt(amtSetOff, 10);
		amtSetOff = 0;
	}else if(parseInt(amtSetOff, 10) >= 0 && parseInt(cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2, 10) < 0){
		amtSetOff = parseInt(amtSetOff, 10) + 
					parseInt(cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2, 10) ;
		cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2 = 0;
	}	

	if(parseInt(amtSetOff, 10) >= 0 && Math.abs(parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AC_1, 10)) > parseInt(amtSetOff, 10)){
		cgosIncome.cgInc.ltcg.prctg10.sec115AC_1 = parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AC_1, 10) + 
												parseInt(amtSetOff, 10);
		amtSetOff = 0;
	}else if(parseInt(amtSetOff, 10) >= 0 && parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AC_1, 10) < 0){
		amtSetOff = parseInt(amtSetOff, 10) + 
					parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AC_1, 10) ;
		cgosIncome.cgInc.ltcg.prctg10.sec115AC_1 = 0;
	}

	if(parseInt(amtSetOff, 10) >= 0 && Math.abs(parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1, 10)) > parseInt(amtSetOff, 10)){
		cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1 = parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1, 10) + 
												parseInt(amtSetOff, 10);
		amtSetOff = 0;
	}else if(parseInt(amtSetOff, 10) >= 0 && parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1, 10) < 0){
		amtSetOff = parseInt(amtSetOff, 10) + 
					parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1, 10) ;
		cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1 = 0;
	}	
	
	if(parseInt(amtSetOff, 10) >= 0 && Math.abs(parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AD_3, 10)) > parseInt(amtSetOff, 10)){
		cgosIncome.cgInc.ltcg.prctg10.sec115AD_3 = parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AD_3, 10) + 
												parseInt(amtSetOff, 10);
		amtSetOff = 0;
	}else if(parseInt(amtSetOff, 10) >= 0 && parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AD_3, 10) < 0){
		amtSetOff = parseInt(amtSetOff, 10) + 
					parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AD_3, 10) ;
		cgosIncome.cgInc.ltcg.prctg10.sec115AD_3 = 0;
	}

	if(parseInt(amtSetOff, 10) >= 0 && Math.abs(parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115E_b, 10)) > parseInt(amtSetOff, 10)){
		cgosIncome.cgInc.ltcg.prctg10.sec115E_b = parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115E_b, 10) + 
												parseInt(amtSetOff, 10);
		amtSetOff = 0;
	}else if(parseInt(amtSetOff, 10) >= 0 && parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115E_b, 10) < 0){
		amtSetOff = parseInt(amtSetOff, 10) + 
					parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115E_b, 10) ;
		cgosIncome.cgInc.ltcg.prctg10.sec115E_b = 0;
	}	
	
	calcCYCgRemaining(cgosIncome);
	calcTotalSetOffs();
	calcLossRemaining(cgosIncome);

}

//To calculate Cg Remaining income
function calcCYCgRemaining(cgosIncome){
	var inStcg15Per = document.getElementsByName('scheduleCGPost45.currYrLosses.inStcg15Per.CurrYrLosSetOff')[0];
	var inStcg30Per = document.getElementsByName('scheduleCGPost45.currYrLosses.inStcg30Per.currYrLosSetOff')[0];
	var inStcgAppRate = document.getElementsByName('scheduleCGPost45.currYrLosses.inStcgAppRate.currYrLosSetOff')[0];
	var inLtcg10Per = document.getElementsByName('scheduleCGPost45.currYrLosses.inLtcg10Per.currYrLosSetOff')[0];
	var inLtcg20Per = document.getElementsByName('scheduleCGPost45.currYrLosses.inLtcg20Per.CurrYrLosSetOff')[0];
	
	var prctg15 = cgosIncome.cgInc.stcg.prctg15;
	var prctg15Sum = eval( parseInt(prctg15.sec111a,10) + 
							 parseInt(prctg15.sec115ad_1_b_ii,10));	
	inStcg15Per.value = zeroOrMore(prctg15Sum);

	inStcg30Per.value = zeroOrMore(cgosIncome.cgInc.stcg.prctg30);

	inStcgAppRate.value = zeroOrMore(cgosIncome.cgInc.stcg.prctgAr);
	
	var prctg10 = cgosIncome.cgInc.ltcg.prctg10;
	var prctg10Sum = eval( parseInt(prctg10.secProviso,10) + 
							 parseInt(prctg10.sec112_1_c_2,10) + 
							 parseInt(prctg10.sec115AC_1,10) + 
							 parseInt(prctg10.sec115ACA_1,10) + 
							 parseInt(prctg10.sec115AD_3,10) + 
							 parseInt(prctg10.sec115E_b,10) );
	
	
	inLtcg10Per.value = zeroOrMore(prctg10Sum);
	
	var prctg20 = cgosIncome.cgInc.ltcg.prctg20;
	var prctg20Sum = eval( parseInt(prctg20.sec112,10) + 
							 parseInt(prctg20.sec11EA,10));
	
	inLtcg20Per.value = zeroOrMore(prctg20Sum);	
}

//To calculate Total SetOffs
function calcTotalSetOffs(){
	var stclSetoff15Per = document.getElementsByName('scheduleCGPost45.currYrLosses.totLossSetOff.stclSetoff15Per')[0];
	var stclSetoff30Per = document.getElementsByName('scheduleCGPost45.currYrLosses.totLossSetOff.stclSetoff30Per')[0];
	var stclSetoffAppRate = document.getElementsByName('scheduleCGPost45.currYrLosses.totLossSetOff.stclSetoffAppRate')[0];
	var ltclSetOff10Per = document.getElementsByName('scheduleCGPost45.currYrLosses.totLossSetOff.ltclSetOff10Per')[0];
	var ltclSetOff20Per = document.getElementsByName('scheduleCGPost45.currYrLosses.totLossSetOff.ltclSetOff20Per')[0];
	
	ltclSetOff20Per.value = eval(coalesceSetRet('scheduleCGPost45.currYrLosses.inLtcg10Per.ltclSetOff20Per') );

	ltclSetOff10Per.value = eval(coalesceSetRet('scheduleCGPost45.currYrLosses.inLtcg20Per.LtclSetOff10Per') );
	
	stclSetoffAppRate.value = eval(coalesceSetRet('scheduleCGPost45.currYrLosses.inStcg15Per.StclSetoffAppRate') + 
			 coalesceSetRet('scheduleCGPost45.currYrLosses.inStcg30Per.stclSetoffAppRate') +
			 coalesceSetRet('scheduleCGPost45.currYrLosses.inLtcg10Per.stclSetoffAppRate') + 
			 coalesceSetRet('scheduleCGPost45.currYrLosses.inLtcg20Per.StclSetoffAppRate') );
	
	stclSetoff30Per.value = eval(coalesceSetRet('scheduleCGPost45.currYrLosses.inStcg15Per.stclSetoff30Per') + 
				 coalesceSetRet('scheduleCGPost45.currYrLosses.inStcgAppRate.stclSetoff30Per') +
				 coalesceSetRet('scheduleCGPost45.currYrLosses.inLtcg10Per.stclSetoff30Per') + 
				 coalesceSetRet('scheduleCGPost45.currYrLosses.inLtcg20Per.StclSetoff30Per') );
	
	stclSetoff15Per.value = eval(coalesceSetRet('scheduleCGPost45.currYrLosses.inStcg30Per.stclSetoff15Per') + 
				 coalesceSetRet('scheduleCGPost45.currYrLosses.inStcgAppRate.stclSetoff15Per') +
				 coalesceSetRet('scheduleCGPost45.currYrLosses.inLtcg10Per.stclSetoff15Per') + 
				 coalesceSetRet('scheduleCGPost45.currYrLosses.inLtcg20Per.StclSetoff15Per') );		
}

//To calculate Loss Remaining
function calcLossRemaining(cgosIncome){
	var stclSetoff15Per = document.getElementsByName('scheduleCGPost45.currYrLosses.lossRemainSetOff.stclSetoff15Per')[0];
	var stclSetoff30Per = document.getElementsByName('scheduleCGPost45.currYrLosses.lossRemainSetOff.stclSetoff30Per')[0];
	var stclSetoffAppRate = document.getElementsByName('scheduleCGPost45.currYrLosses.lossRemainSetOff.stclSetoffAppRate')[0];
	var ltclSetOff10Per = document.getElementsByName('scheduleCGPost45.currYrLosses.lossRemainSetOff.ltclSetOff10Per')[0];
	var ltclSetOff20Per = document.getElementsByName('scheduleCGPost45.currYrLosses.lossRemainSetOff.ltclSetOff20Per')[0];

	var prctg15 = cgosIncome.cgInc.stcg.prctg15;
	var prctg15Sum = eval( parseInt(prctg15.sec111a,10) + 
							 parseInt(prctg15.sec115ad_1_b_ii,10));	
	
	stclSetoff15Per.value = Math.abs(zeroOrLess(prctg15Sum));

	stclSetoff30Per.value = Math.abs(zeroOrLess(cgosIncome.cgInc.stcg.prctg30));

	stclSetoffAppRate.value = Math.abs(zeroOrLess(cgosIncome.cgInc.stcg.prctgAr));
	
	var prctg10 = cgosIncome.cgInc.ltcg.prctg10;
	var prctg10Sum = eval( parseInt(prctg10.secProviso,10) + 
							 parseInt(prctg10.sec112_1_c_2,10) + 
							 parseInt(prctg10.sec115AC_1,10) + 
							 parseInt(prctg10.sec115ACA_1,10) + 
							 parseInt(prctg10.sec115AD_3,10) + 
							 parseInt(prctg10.sec115E_b,10) );
	
	ltclSetOff10Per.value = Math.abs(zeroOrLess(prctg10Sum));
	
	var prctg20 = cgosIncome.cgInc.ltcg.prctg20;
	var prctg20Sum = eval( parseInt(prctg20.sec112,10) + 
							 parseInt(prctg20.sec11EA,10));
	
	ltclSetOff20Per.value = Math.abs(zeroOrLess(prctg20Sum));	
}

//To setOff Against applicable rate
function setOffAgainstAr(value, cgosIncome){
	var amtSetOff = 0;
	if(parseInt(value, 10) < 0 && parseInt(cgosIncome.cgInc.stcg.prctgAr, 10) > 0){
		if(parseInt(cgosIncome.cgInc.stcg.prctgAr, 10) >= Math.abs(parseInt(value, 10))){
			cgosIncome.cgInc.stcg.prctgAr = eval( parseInt(cgosIncome.cgInc.stcg.prctgAr, 10) +
												  parseInt(value, 10));
			amtSetOff = Math.abs(parseInt(value, 10));
		}else{
			amtSetOff = Math.abs(parseInt(cgosIncome.cgInc.stcg.prctgAr, 10));	
			cgosIncome.cgInc.stcg.prctgAr = 0;	
		}
	}
	return amtSetOff;
}

//To setOff Against percent 30
function setOffAgainst30(value, cgosIncome){
	var amtSetOff = 0;
	if(parseInt(value, 10) < 0 && parseInt(cgosIncome.cgInc.stcg.prctg30, 10) > 0){
		if(parseInt(cgosIncome.cgInc.stcg.prctg30, 10) >= Math.abs(parseInt(value, 10))){
			cgosIncome.cgInc.stcg.prctg30 = eval( parseInt(cgosIncome.cgInc.stcg.prctg30, 10) +
												  parseInt(value, 10));
			amtSetOff = Math.abs(parseInt(value, 10));
		}else{
			amtSetOff = Math.abs(parseInt(cgosIncome.cgInc.stcg.prctg30, 10));	
			cgosIncome.cgInc.stcg.prctg30 = 0;	
		}
	}
	return amtSetOff;
}

//To setOff Against percent 15
function setOffAgainst15(value, cgosIncome){
	
	var amtSetOff111a = 0;
	var amtSetOff115ad_1_b_ii = 0;
	if(value<0){
		
		amtSetOff115ad_1_b_ii = setOffAgainst115ad_1_b_ii(value , cgosIncome);
		amtSetOff111a = setOffAgainst111a(value + amtSetOff115ad_1_b_ii, cgosIncome);
		
	}
	return parseInt(amtSetOff111a, 10) + parseInt(amtSetOff115ad_1_b_ii, 10);	

}

//To setOff Against percent 20
function setOffAgainst20(value, cgosIncome){
	var amtSetOff112 = 0;
	var amtSetOff115ea = 0;
	if(value<0){
		
		amtSetOff115ea = setOffAgainst115Ea(value , cgosIncome);
		amtSetOff112 = setOffAgainst112(value + amtSetOff115ea, cgosIncome);
		
	}
	return parseInt(amtSetOff112, 10) + parseInt(amtSetOff115ea, 10);
}

//To setOff Against percent 10
function setOffAgainst10(value, cgosIncome){
	var amtSetOff = 0;
	if(value < 0){
		
		amtSetOff = eval(parseInt(amtSetOff, 10) + parseInt(setOffAgainst112_1_c_2(value + amtSetOff, cgosIncome), 10));
		amtSetOff = eval(parseInt(amtSetOff, 10) + parseInt(setOffAgainst115AC_1(value + amtSetOff, cgosIncome), 10));
		amtSetOff = eval(parseInt(amtSetOff, 10) + parseInt(setOffAgainst115ACA_1(value + amtSetOff, cgosIncome), 10));
		amtSetOff = eval(parseInt(amtSetOff, 10) + parseInt(setOffAgainst115AD_3(value + amtSetOff, cgosIncome), 10));
		amtSetOff = eval(parseInt(amtSetOff, 10) + parseInt(setOffAgainst115E_b(value + amtSetOff, cgosIncome), 10));
		amtSetOff = eval(parseInt(amtSetOff, 10) + parseInt(setOffAgainstsecProviso(value + amtSetOff, cgosIncome), 10));
		
	}
	return amtSetOff;
}

//To setOff Against section 111a
function setOffAgainst111a(value, cgosIncome){
	
	
	var prctg15 = cgosIncome.cgInc.stcg.prctg15;
	var prctg15Sum = eval( parseInt(prctg15.sec111a,10) + 
							 parseInt(prctg15.sec115ad_1_b_ii,10));			
	
	var amtSetOff = 0;
	if(parseInt(value, 10) < 0 && parseInt(cgosIncome.cgInc.stcg.prctg15.sec111a, 10) > 0){
		if(parseInt(cgosIncome.cgInc.stcg.prctg15.sec111a, 10) >= Math.abs(parseInt(value, 10))){
			cgosIncome.cgInc.stcg.prctg15.sec111a = eval( parseInt(cgosIncome.cgInc.stcg.prctg15.sec111a, 10) +
												  parseInt(value, 10));
			amtSetOff = Math.abs(parseInt(value, 10));
		}else{
			amtSetOff = Math.abs(parseInt(cgosIncome.cgInc.stcg.prctg15.sec111a, 10));	
			cgosIncome.cgInc.stcg.prctg15.sec111a = 0;	
		}
		if(parseInt(amtSetOff) > parseInt(prctg15Sum)){
			cgosIncome.cgInc.stcg.prctg15.sec111a = parseInt(cgosIncome.cgInc.stcg.prctg15.sec111a) + parseInt(amtSetOff) - parseInt(prctg15Sum);
			amtSetOff = parseInt(prctg15Sum);
		}
	}

	return amtSetOff;
}

//To setOff Against section 115ad_1_b_ii
function setOffAgainst115ad_1_b_ii(value, cgosIncome){
	
	
	var prctg15 = cgosIncome.cgInc.stcg.prctg15;
	var prctg15Sum = eval( parseInt(prctg15.sec111a,10) + 
							 parseInt(prctg15.sec115ad_1_b_ii,10));			
	
	var amtSetOff = 0;
	if(parseInt(value, 10) < 0 && parseInt(cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii, 10) > 0){
		if(parseInt(cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii, 10) >= Math.abs(parseInt(value, 10))){
			cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii = eval( parseInt(cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii, 10) +
												  parseInt(value, 10));
			amtSetOff = Math.abs(parseInt(value, 10));
		}else{
			amtSetOff = Math.abs(parseInt(cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii, 10));	
			cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii = 0;	
		}
		if(parseInt(amtSetOff) > parseInt(prctg15Sum)){
			cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii = parseInt(cgosIncome.cgInc.stcg.prctg15.sec115ad_1_b_ii) + parseInt(amtSetOff) - parseInt(prctg15Sum);
			amtSetOff = parseInt(prctg15Sum);
		}
	}

	return amtSetOff;
}

//To setOff Against section 112
function setOffAgainst112(value, cgosIncome){
	
	
	var prctg20 = cgosIncome.cgInc.ltcg.prctg20;
	var prctg20Sum = zeroOrMore(eval( parseInt(prctg20.sec112,10) + 
							 parseInt(prctg20.sec11EA,10)));		
	
	var amtSetOff = 0;
	if(parseInt(value, 10) < 0 && parseInt(cgosIncome.cgInc.ltcg.prctg20.sec112, 10) > 0){
		if(parseInt(cgosIncome.cgInc.ltcg.prctg20.sec112, 10) >= Math.abs(parseInt(value, 10))){
			cgosIncome.cgInc.ltcg.prctg20.sec112 = eval( parseInt(cgosIncome.cgInc.ltcg.prctg20.sec112, 10) +
												  parseInt(value, 10));
			amtSetOff = Math.abs(parseInt(value, 10));
		}else{
			amtSetOff = Math.abs(parseInt(cgosIncome.cgInc.ltcg.prctg20.sec112, 10));	
			cgosIncome.cgInc.ltcg.prctg20.sec112 = 0;	
		}
		if(parseInt(amtSetOff) > parseInt(prctg20Sum)){
			cgosIncome.cgInc.ltcg.prctg20.sec112 = parseInt(cgosIncome.cgInc.ltcg.prctg20.sec112) + parseInt(amtSetOff) - parseInt(prctg20Sum);
			amtSetOff = parseInt(prctg20Sum);
		}
	}

	return amtSetOff;
}

//To setOff Against section 112
function setOffAgainst112(value, cgosIncome){
	
	
	var prctg20 = cgosIncome.cgInc.ltcg.prctg20;
	var prctg20Sum = zeroOrMore(eval( parseInt(prctg20.sec112,10) + 
							 parseInt(prctg20.sec11EA,10)));		
	
	var amtSetOff = 0;
	if(parseInt(value, 10) < 0 && parseInt(cgosIncome.cgInc.ltcg.prctg20.sec112, 10) > 0){
		if(parseInt(cgosIncome.cgInc.ltcg.prctg20.sec112, 10) >= Math.abs(parseInt(value, 10))){
			cgosIncome.cgInc.ltcg.prctg20.sec112 = eval( parseInt(cgosIncome.cgInc.ltcg.prctg20.sec112, 10) +
												  parseInt(value, 10));
			amtSetOff = Math.abs(parseInt(value, 10));
		}else{
			amtSetOff = Math.abs(parseInt(cgosIncome.cgInc.ltcg.prctg20.sec112, 10));	
			cgosIncome.cgInc.ltcg.prctg20.sec112 = 0;	
		}
		if(parseInt(amtSetOff) > parseInt(prctg20Sum)){
			cgosIncome.cgInc.ltcg.prctg20.sec112 = parseInt(cgosIncome.cgInc.ltcg.prctg20.sec112) + parseInt(amtSetOff) - parseInt(prctg20Sum);
			amtSetOff = parseInt(prctg20Sum);
		}
	}

	return amtSetOff;
}

//To setOff Against section 115EA
function setOffAgainst115Ea(value, cgosIncome){
	var prctg20 = cgosIncome.cgInc.ltcg.prctg20;
	var prctg20Sum = zeroOrMore(eval( parseInt(prctg20.sec112,10) + 
							 parseInt(prctg20.sec11EA,10)));	
	var amtSetOff = 0;
	if(parseInt(value, 10) < 0 && parseInt(cgosIncome.cgInc.ltcg.prctg20.sec11EA, 10) > 0){
		if(parseInt(cgosIncome.cgInc.ltcg.prctg20.sec11EA, 10) >= Math.abs(parseInt(value, 10))){
			cgosIncome.cgInc.ltcg.prctg20.sec11EA = eval( parseInt(cgosIncome.cgInc.ltcg.prctg20.sec11EA, 10) +
												  parseInt(value, 10));
			amtSetOff = Math.abs(parseInt(value, 10));
		}else{
			amtSetOff = Math.abs(parseInt(cgosIncome.cgInc.ltcg.prctg20.sec11EA, 10));	
			cgosIncome.cgInc.ltcg.prctg20.sec11EA = 0;	
		}
		if(parseInt(amtSetOff) > parseInt(prctg20Sum)){
			cgosIncome.cgInc.ltcg.prctg20.sec11EA = parseInt(cgosIncome.cgInc.ltcg.prctg20.sec11EA) + parseInt(amtSetOff) - parseInt(prctg20Sum);
			amtSetOff = parseInt(prctg20Sum);
		}	
	}
	

	return amtSetOff;
}

//To setOff Against section Proviso
function setOffAgainstsecProviso(value, cgosIncome){
	var prctg10 = cgosIncome.cgInc.ltcg.prctg10;
	var prctg10Sum = zeroOrMore(eval( parseInt(prctg10.secProviso,10) + 
			 parseInt(prctg10.sec112_1_c_2,10) + 
			 parseInt(prctg10.sec115AC_1,10) + 
			 parseInt(prctg10.sec115ACA_1,10) + 
			 parseInt(prctg10.sec115AD_3,10) + 
			 parseInt(prctg10.sec115E_b,10) ));	
	var amtSetOff = 0;
	if(parseInt(value, 10) < 0 && parseInt(cgosIncome.cgInc.ltcg.prctg10.secProviso, 10) > 0){
		if(parseInt(cgosIncome.cgInc.ltcg.prctg10.secProviso, 10) >= Math.abs(parseInt(value, 10))){
			cgosIncome.cgInc.ltcg.prctg10.secProviso = eval( parseInt(cgosIncome.cgInc.ltcg.prctg10.secProviso, 10) +
												  parseInt(value, 10));
			amtSetOff = Math.abs(parseInt(value, 10));
		}else{
			amtSetOff = Math.abs(parseInt(cgosIncome.cgInc.ltcg.prctg10.secProviso, 10));	
			cgosIncome.cgInc.ltcg.prctg10.secProviso = 0;	
		}
		if(parseInt(amtSetOff) > parseInt(prctg10Sum)){
			cgosIncome.cgInc.ltcg.prctg10.secProviso = parseInt(cgosIncome.cgInc.ltcg.prctg10.secProviso) + parseInt(amtSetOff) - parseInt(prctg10Sum);
			amtSetOff = parseInt(prctg10Sum);
		}		
	}

	

	return amtSetOff;
}
//To setOff Against section 112_1_c_2
function setOffAgainst112_1_c_2(value, cgosIncome){
	var prctg10 = cgosIncome.cgInc.ltcg.prctg10;
	var prctg10Sum = zeroOrMore(eval( parseInt(prctg10.secProviso,10) + 
			 parseInt(prctg10.sec112_1_c_2,10) + 
			 parseInt(prctg10.sec115AC_1,10) + 
			 parseInt(prctg10.sec115ACA_1,10) + 
			 parseInt(prctg10.sec115AD_3,10) + 
			 parseInt(prctg10.sec115E_b,10) ));
	var amtSetOff = 0;
	if(parseInt(value, 10) < 0 && parseInt(cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2, 10) > 0){
		if(parseInt(cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2, 10) >= Math.abs(parseInt(value, 10))){
			cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2 = eval( parseInt(cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2, 10) +
												  parseInt(value, 10));
			amtSetOff = Math.abs(parseInt(value, 10));
		}else{
			amtSetOff = Math.abs(parseInt(cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2, 10));	
			cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2 = 0;	
		}
		if(parseInt(amtSetOff) > parseInt(prctg10Sum)){
			cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2 = parseInt(cgosIncome.cgInc.ltcg.prctg10.sec112_1_c_2) + parseInt(amtSetOff) - parseInt(prctg10Sum);
			amtSetOff = parseInt(prctg10Sum);
		}	
	}
	
	return amtSetOff;
}
//To setOff Against section 115AC_1
function setOffAgainst115AC_1(value, cgosIncome){
	var prctg10 = cgosIncome.cgInc.ltcg.prctg10;
	var prctg10Sum = zeroOrMore(eval( parseInt(prctg10.secProviso,10) + 
			 parseInt(prctg10.sec112_1_c_2,10) + 
			 parseInt(prctg10.sec115AC_1,10) + 
			 parseInt(prctg10.sec115ACA_1,10) + 
			 parseInt(prctg10.sec115AD_3,10) + 
			 parseInt(prctg10.sec115E_b,10) ));
	var amtSetOff = 0;
	if(parseInt(value, 10) < 0 && parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AC_1, 10) > 0){
		if(parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AC_1, 10) >= Math.abs(parseInt(value, 10))){
			cgosIncome.cgInc.ltcg.prctg10.sec115AC_1 = eval( parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AC_1, 10) +
												  parseInt(value, 10));
			amtSetOff = Math.abs(parseInt(value, 10));
		}else{
			amtSetOff = Math.abs(parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AC_1, 10));	
			cgosIncome.cgInc.ltcg.prctg10.sec115AC_1 = 0;	
		}
		if(parseInt(amtSetOff) > parseInt(prctg10Sum)){
			cgosIncome.cgInc.ltcg.prctg10.sec115AC_1 = parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AC_1) + parseInt(amtSetOff) - parseInt(prctg10Sum);
			amtSetOff = parseInt(prctg10Sum);
		}		
		
	}

		
	
	return amtSetOff;
}
//To setOff Against section 115ACA_1
function setOffAgainst115ACA_1(value, cgosIncome){
	var prctg10 = cgosIncome.cgInc.ltcg.prctg10;
	var prctg10Sum = zeroOrMore(eval( parseInt(prctg10.secProviso,10) + 
			 parseInt(prctg10.sec112_1_c_2,10) + 
			 parseInt(prctg10.sec115AC_1,10) + 
			 parseInt(prctg10.sec115ACA_1,10) + 
			 parseInt(prctg10.sec115AD_3,10) + 
			 parseInt(prctg10.sec115E_b,10) ));
	var amtSetOff = 0;
	if(parseInt(value, 10) < 0 && parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1, 10) > 0){
		if(parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1, 10) >= Math.abs(parseInt(value, 10))){
			cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1 = eval( parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1, 10) +
												  parseInt(value, 10));
			amtSetOff = Math.abs(parseInt(value, 10));
		}else{
			amtSetOff = Math.abs(parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1, 10));	
			cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1 = 0;	
		}
		
		if(parseInt(amtSetOff) > parseInt(prctg10Sum)){
			cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1 = parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115ACA_1) + parseInt(amtSetOff) - parseInt(prctg10Sum);
			amtSetOff = parseInt(prctg10Sum);
		}
	}
	
	return amtSetOff;
}
//To setOff Against section 115AD_3
function setOffAgainst115AD_3(value, cgosIncome){
	var prctg10 = cgosIncome.cgInc.ltcg.prctg10;
	var prctg10Sum = zeroOrMore(eval( parseInt(prctg10.secProviso,10) + 
			 parseInt(prctg10.sec112_1_c_2,10) + 
			 parseInt(prctg10.sec115AC_1,10) + 
			 parseInt(prctg10.sec115ACA_1,10) + 
			 parseInt(prctg10.sec115AD_3,10) + 
			 parseInt(prctg10.sec115E_b,10) ));
	var amtSetOff = 0;
	if(parseInt(value, 10) < 0 && parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AD_3, 10) > 0){
		if(parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AD_3, 10) >= Math.abs(parseInt(value, 10))){
			cgosIncome.cgInc.ltcg.prctg10.sec115AD_3 = eval( parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AD_3, 10) +
												  parseInt(value, 10));
			amtSetOff = Math.abs(parseInt(value, 10));
		}else{
			amtSetOff = Math.abs(parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AD_3, 10));	
			cgosIncome.cgInc.ltcg.prctg10.sec115AD_3 = 0;	
		}
		if(parseInt(amtSetOff) > parseInt(prctg10Sum)){
			cgosIncome.cgInc.ltcg.prctg10.sec115AD_3 = parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115AD_3) + parseInt(amtSetOff) - parseInt(prctg10Sum);
			amtSetOff = parseInt(prctg10Sum);
		}
	}

	return amtSetOff;
}
//To setOff Against section 115E_b
function setOffAgainst115E_b(value, cgosIncome){
	var prctg10 = cgosIncome.cgInc.ltcg.prctg10;
	var prctg10Sum = zeroOrMore(eval( parseInt(prctg10.secProviso,10) + 
							 parseInt(prctg10.sec112_1_c_2,10) + 
							 parseInt(prctg10.sec115AC_1,10) + 
							 parseInt(prctg10.sec115ACA_1,10) + 
							 parseInt(prctg10.sec115AD_3,10) + 
							 parseInt(prctg10.sec115E_b,10) ));
	var amtSetOff = 0;
	if(parseInt(value, 10) < 0 && parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115E_b, 10) > 0){
		if(parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115E_b, 10) >= Math.abs(parseInt(value, 10))){
			cgosIncome.cgInc.ltcg.prctg10.sec115E_b = eval( parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115E_b, 10) +
												  parseInt(value, 10));
			amtSetOff = Math.abs(parseInt(value, 10));
		}else{
			amtSetOff = Math.abs(parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115E_b, 10));	
			cgosIncome.cgInc.ltcg.prctg10.sec115E_b = 0;	
		}
		if(parseInt(amtSetOff) > parseInt(prctg10Sum)){
			cgosIncome.cgInc.ltcg.prctg10.sec115E_b = parseInt(cgosIncome.cgInc.ltcg.prctg10.sec115E_b) + parseInt(amtSetOff) - parseInt(prctg10Sum);
			amtSetOff = parseInt(prctg10Sum);
		}
	}	
	
	return amtSetOff;
}

//To set Profit Loss
function setProfitLoss(value, lossFld, profitFld){
	if(parseInt(value, 10) < 0){
		document.getElementsByName(lossFld)[0].value = Math.abs(value);
		document.getElementsByName(profitFld)[0].value = 0;
	}else if(parseInt(value, 10) > 0){
		document.getElementsByName(lossFld)[0].value = 0;
		document.getElementsByName(profitFld)[0].value = Math.abs(value);
	}else{
		document.getElementsByName(lossFld)[0].value = 0;
		document.getElementsByName(profitFld)[0].value = 0;
	}
	alert(profitFld+"after  "+document.getElementsByName(profitFld)[0].value);

}

//////////////////////////////CG Calculation Ends/////////////////////////////////

function calcCFL_sumAll(){
	try{
		//HP Loss :: total of earlier year losses
		coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.hpLossCF');
		document.getElementsByName('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.hpLossCF')[0].value =
			coalescePath('scheduleCFL.lossCFFromPrev8ThYearFromAY.carryFwdLossDetail.hpLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev7ThYearFromAY.carryFwdLossDetail.hpLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev6ThYearFromAY.carryFwdLossDetail.hpLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev5ThYearFromAY.carryFwdLossDetail.hpLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev4ThYearFromAY.carryFwdLossDetail.hpLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev3RdYearFromAY.carryFwdLossDetail.hpLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev2NdYearFromAY.carryFwdLossDetail.hpLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrevYrToAY.carryFwdLossDetail.hpLossCF');

		// Loss from business other than loss from speculative business and specified business :: total of earlier year losses
		coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.busLossOthThanSpecLossCF');
		document.getElementsByName('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.busLossOthThanSpecLossCF')[0].value =
			coalescePath('scheduleCFL.lossCFFromPrev8ThYearFromAY.carryFwdLossDetail.busLossOthThanSpecLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev7ThYearFromAY.carryFwdLossDetail.busLossOthThanSpecLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev6ThYearFromAY.carryFwdLossDetail.busLossOthThanSpecLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev5ThYearFromAY.carryFwdLossDetail.busLossOthThanSpecLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev4ThYearFromAY.carryFwdLossDetail.busLossOthThanSpecLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev3RdYearFromAY.carryFwdLossDetail.busLossOthThanSpecLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev2NdYearFromAY.carryFwdLossDetail.busLossOthThanSpecLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrevYrToAY.carryFwdLossDetail.busLossOthThanSpecLossCF');

		//  Loss from speculative business :: total of earlier year losses
		coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.lossFrmSpecBusCF');
		document.getElementsByName('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.lossFrmSpecBusCF')[0].value =
			coalescePath('scheduleCFL.lossCFFromPrev4ThYearFromAY.carryFwdLossDetail.lossFrmSpecBusCF')+
			coalescePath('scheduleCFL.lossCFFromPrev3RdYearFromAY.carryFwdLossDetail.lossFrmSpecBusCF')+
			coalescePath('scheduleCFL.lossCFFromPrev2NdYearFromAY.carryFwdLossDetail.lossFrmSpecBusCF')+
			coalescePath('scheduleCFL.lossCFFromPrevYrToAY.carryFwdLossDetail.lossFrmSpecBusCF');

		//Loss from specified business :: total of earlier year losses
		coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.lossFrmSpecifiedBusCF');
		document.getElementsByName('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.lossFrmSpecifiedBusCF')[0].value =
			coalescePath('scheduleCFL.lossCFFromPrev7ThYearFromAY.carryFwdLossDetail.lossFrmSpecifiedBusCF')+
			coalescePath('scheduleCFL.lossCFFromPrev6ThYearFromAY.carryFwdLossDetail.lossFrmSpecifiedBusCF')+
			coalescePath('scheduleCFL.lossCFFromPrev5ThYearFromAY.carryFwdLossDetail.lossFrmSpecifiedBusCF')+
			coalescePath('scheduleCFL.lossCFFromPrev4ThYearFromAY.carryFwdLossDetail.lossFrmSpecifiedBusCF')+
			coalescePath('scheduleCFL.lossCFFromPrev3RdYearFromAY.carryFwdLossDetail.lossFrmSpecifiedBusCF')+
			coalescePath('scheduleCFL.lossCFFromPrev2NdYearFromAY.carryFwdLossDetail.lossFrmSpecifiedBusCF')+
			coalescePath('scheduleCFL.lossCFFromPrevYrToAY.carryFwdLossDetail.lossFrmSpecifiedBusCF');

		//Short-term capital loss
		coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.stcgLossCF');
		document.getElementsByName('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.stcgLossCF')[0].value =
			coalescePath('scheduleCFL.lossCFFromPrev8ThYearFromAY.carryFwdLossDetail.stcgLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev7ThYearFromAY.carryFwdLossDetail.stcgLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev6ThYearFromAY.carryFwdLossDetail.stcgLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev5ThYearFromAY.carryFwdLossDetail.stcgLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev4ThYearFromAY.carryFwdLossDetail.stcgLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev3RdYearFromAY.carryFwdLossDetail.stcgLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev2NdYearFromAY.carryFwdLossDetail.stcgLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrevYrToAY.carryFwdLossDetail.stcgLossCF');

		//Long-term Capital loss
		coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.ltcgLossCF');
		document.getElementsByName('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.ltcgLossCF')[0].value =
			coalescePath('scheduleCFL.lossCFFromPrev8ThYearFromAY.carryFwdLossDetail.ltcgLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev7ThYearFromAY.carryFwdLossDetail.ltcgLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev6ThYearFromAY.carryFwdLossDetail.ltcgLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev5ThYearFromAY.carryFwdLossDetail.ltcgLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev4ThYearFromAY.carryFwdLossDetail.ltcgLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev3RdYearFromAY.carryFwdLossDetail.ltcgLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrev2NdYearFromAY.carryFwdLossDetail.ltcgLossCF')+
			coalescePath('scheduleCFL.lossCFFromPrevYrToAY.carryFwdLossDetail.ltcgLossCF');


		//Other sources loss (from owning race horses)
		coalescePath('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.othSrcLossRaceHorseCF');
		document.getElementsByName('scheduleCFL.totalOfBFLossesEarlierYrs.lossSummaryDetail.othSrcLossRaceHorseCF')[0].value =
			coalescePath('scheduleCFL.lossCFFromPrev4ThYearFromAY.carryFwdLossDetail.othSrcLossRaceHorseCF')+
			coalescePath('scheduleCFL.lossCFFromPrev3RdYearFromAY.carryFwdLossDetail.othSrcLossRaceHorseCF')+
			coalescePath('scheduleCFL.lossCFFromPrev2NdYearFromAY.carryFwdLossDetail.othSrcLossRaceHorseCF')+
			coalescePath('scheduleCFL.lossCFFromPrevYrToAY.carryFwdLossDetail.othSrcLossRaceHorseCF');


	}catch(e){
		alert('error in calcCFL_sumALL=' + e.stack);
	}
}

//To get LTCG 20 ExmpFrmSI
function getLTCG20ExmpFrmSI(){
	var inc = {"10":0, "20":0};
	var afterExmp = {"10":0, "20":0};
	var tab = document.getElementById('scheduleSI');
	var allInput = tab.getElementsByTagName("INPUT");
	for(var i=0;i<allInput.length;i++){
		if(allInput[i].name.match('secCode$')){
			index = allInput[i].name.substring(allInput[i].name.indexOf('[')+1,allInput[i].name.indexOf(']'));
			if(allInput[i].value=='22'){
				inc["10"] = eval(parseInt(inc["10"]) + coalesceSetRet('scheduleSI.splCodeRateTax[' + index + '].splRateInc'));
				afterExmp["10"] = eval(parseInt(afterExmp["10"]) + coalesceSetRet('scheduleSI.splCodeRateTax[' + index + '].taxableInc'));
				
			}else if(allInput[i].value=='21'){
				inc["20"] = eval(parseInt(inc["20"]) + coalesceSetRet('scheduleSI.splCodeRateTax[' + index + '].splRateInc'));
				afterExmp["20"] = eval(parseInt(afterExmp["20"]) + coalesceSetRet('scheduleSI.splCodeRateTax[' + index + '].taxableInc'));
				
			}
		}
	}
	return {"10":(inc["10"]-afterExmp["10"]), "20":(inc["20"]-afterExmp["20"])};
	
}

//To delete Row from FSI
function deleteRowFSI(tableId , noOfHeader , noOfFooter){
	try{
		var mytable = document.getElementById(tableId);
		var rowCount = mytable.rows.length;
		var itemCount = (rowCount - 4 )/ 6;
		noOfHeader = parseInt(noOfHeader , 10);
		var isChecked=false;
		var listOfCheckBox = mytable.getElementsByTagName('input');
		var totalChecked = 0;
		for(var z=0; z<listOfCheckBox.length; z++){
			if(listOfCheckBox[z].name.match(".chosenCheckBox$")){
				if(listOfCheckBox[z].checked==true){
					totalChecked = eval( parseInt(totalChecked,10) +1);
					isChecked=true;
				}
			}
		}
		if(!isChecked){
			addErrorXHTML('','Please select a checkbox for deleting row');
		}

		for(var j=1; j<=totalChecked ; j++){      // iterate for total number of checkboxes
			var totalNoOfInput = mytable.getElementsByTagName('input');

			for(var z=0; z<totalNoOfInput.length; z++){
				if(totalNoOfInput[z].name.match(".chosenCheckBox$")){		// if its a chosenCheckBox element

					var akhilIndex1 = eval(parseInt(totalNoOfInput[z].name.lastIndexOf('[') ,10)+1);
					var akhilIndex2 = eval(parseInt(totalNoOfInput[z].name.lastIndexOf(']') ,10));
					var rowNumber = totalNoOfInput[z].name.substring(akhilIndex1, akhilIndex2);
					rowNumber = parseInt(rowNumber ,10);
					
					var myCurrtable = document.getElementById(tableId);
					var rowCurrCount = myCurrtable.rows.length;

					
					if(totalNoOfInput[z].checked==true){
						if((rowNumber!=0) || (rowNumber==0 &&  parseInt(eval(rowCurrCount-noOfHeader-noOfFooter)/6)>1) ){
							rowNumber = eval(parseInt(rowNumber,10) * 6 + noOfHeader);
							for(var i=0;i<6;i++){
								mytable.deleteRow(rowNumber);
							}
							//To Do - reset the name of row for all input , textarea, select
							var newTrList = mytable.getElementsByTagName('tr');
							var newTrListLength = eval(parseInt(newTrList.length ,10)-noOfFooter);
							for( var q=rowNumber; q < newTrListLength ; q++ ){	//iterate over all rows from delete point to second last row
								var p = parseInt((q-noOfHeader) /6) + noOfHeader;
								//set the serial number;
								if((q-noOfHeader)%6==0){
									if(noOfHeader==2){
										newTrList[q].getElementsByTagName('td')[0].innerHTML = parseInt(p-1,10);
									}else if(noOfHeader==1){
										newTrList[q].getElementsByTagName('td')[0].innerHTML = parseInt(p,10);
									}else if(noOfHeader==3){
										newTrList[q].getElementsByTagName('td')[0].innerHTML = parseInt(p-2,10);
									}
								}
								var allInputTags = newTrList[q].getElementsByTagName('input');

								for(var zz=0; zz<allInputTags.length ; zz++ ){
									var index1= allInputTags[zz].name.lastIndexOf('[');
									var index2= allInputTags[zz].name.lastIndexOf(']');

									var str1 = allInputTags[zz].name.substring(0, index1);
									var str3 = allInputTags[zz].name.substring(index2 + 1, allInputTags[zz].name.length);

									allInputTags[zz].name = str1+'[' +eval(parseInt(p,10)-noOfHeader) +']'+str3;
								}

								var allSelectTags = newTrList[q].getElementsByTagName('select');

								for(var zz=0; zz<allSelectTags.length ; zz++ ){
									var index1= allSelectTags[zz].name.lastIndexOf('[');
									var index2= allSelectTags[zz].name.lastIndexOf(']');

									var str1 = allSelectTags[zz].name.substring(0, index1);
									var str3 = allSelectTags[zz].name.substring(index2 + 1, allSelectTags[zz].name.length);

									allSelectTags[zz].name = str1+'[' +eval(parseInt(p,10)-noOfHeader) +']'+str3;
								}

								var allTextAreaTags = newTrList[q].getElementsByTagName('textarea');

								for(var zz=0; zz<allTextAreaTags.length ; zz++ ){
									var index1= allTextAreaTags[zz].name.lastIndexOf('[');
									var index2= allTextAreaTags[zz].name.lastIndexOf(']');

									var str1 = allTextAreaTags[zz].name.substring(0, index1);
									var str3 = allTextAreaTags[zz].name.substring(index2 + 1, allTextAreaTags[zz].name.length);

									allTextAreaTags[zz].name = str1+'[' +eval(parseInt(p,10)-noOfHeader) +']'+str3;
								}
							}
							break;
						}else if((rowNumber==0)  && (parseInt(eval(rowCurrCount-noOfHeader-noOfFooter)/6)==1)){
							//Vacate the content if its first row

							for(var m=0; m<6; m++){ 
								var firstRow = mytable.getElementsByTagName('tr')[parseInt(noOfHeader) + m];
	
								var firstInputBox = firstRow.getElementsByTagName('input')[0];
								firstInputBox.checked = false;
	
								var allInputTags = firstRow.getElementsByTagName('input');
								for ( var i = 0; i < allInputTags.length; i++) {
									allInputTags[i].value = "";
								}
								var allSelectTags = firstRow.getElementsByTagName('select');
								for ( var i = 0; i < allSelectTags.length; i++) {
									var elem = allSelectTags[i];
									elem[0].selected = true;
								}
								var allTextAreaTags = firstRow.getElementsByTagName('textarea');
								for ( var i = 0; i < allTextAreaTags.length; i++) {
									allTextAreaTags[i].value = "";
								}
							}
						}
					}
				}
			}
		}
	}catch(e){
		alert('exception caught in =' +e.stack );
	}
}

//To set sch SI Description
function setSIDesc(){
	var tab = document.getElementById('scheduleSI');
	var inputs = tab.getElementsByTagName("INPUT");
	for(var i=0;i<inputs.length;i++){
		if(inputs[i].name.match('secCode$')){
			var row = inputs[i].parentNode.parentNode;
			row.cells[1].innerHTML = getSectionTextMap(inputs[i].value);
		}
	}
}

//To get Slabbed Income
function getSlabbedIncome(totalIncome){
	
	var taxPayer = document.getElementsByName('partAGEN1.personalInfo.status')[0];
	//IN-I,HUF-H
	var resStatus 			= document.getElementsByName('partAGEN1.filingStatus.residentialStatus')[0]; //RES , NRI 
	
	var age	= calcAge();
	
	var netTxblIncome 		= totalIncome;

	var inc = {"10":0,"20":0,"30":0};
	
	if(taxPayer.value=='I' && age > 59 && age < 80 && (resStatus.value=='RES' || resStatus.value=='NOR')){
		
		if(parseInt(netTxblIncome,10) >= parseInt('0',10) && parseInt(netTxblIncome,10) <= parseInt('300000',10)){
			inc = {"10":0, "20":0, "30":0};
		}else if(parseInt(netTxblIncome,10) >= parseInt('300001',10) && parseInt(netTxblIncome,10) <= parseInt('500000',10)){
			inc = {"10":(parseInt(netTxblIncome,10) - 300000), "20":0, "30":0};
		}else if(parseInt(netTxblIncome,10) >= parseInt('500001',10) && parseInt(netTxblIncome,10) <= parseInt('1000000',10)){
			inc = {"10":200000, "20":(parseInt(netTxblIncome,10) - 500000), "30":0};
		}else if(parseInt(netTxblIncome,10) >= parseInt('1000001',10)){
			inc = {"10":200000, "20":500000, "30":(parseInt(netTxblIncome,10) - 1000000)};
		}
	
	}else if(taxPayer.value=='I' && age >= 80 && (resStatus.value=='RES' || resStatus.value=='NOR')){
			   
		if(parseInt(netTxblIncome,10) >= parseInt('0',10) && parseInt(netTxblIncome,10) <= parseInt('500000',10)){
			inc = {"10":0, "20":0, "30":0};
		}else if(parseInt(netTxblIncome,10) >= parseInt('500001',10) && parseInt(netTxblIncome,10) <= parseInt('1000000',10)){
			inc = {"10":0, "20":(parseInt(netTxblIncome,10) - 500000), "30":0};
					
		}else if(parseInt(netTxblIncome,10) >= parseInt('1000001',10)){
			inc = {"10":0, "20":500000, "30":(parseInt(netTxblIncome,10) - 1000000)}; 
		}
			   
		
	}else if( (taxPayer.value=='I') || taxPayer.value=='H' ){
		
		if(parseInt(netTxblIncome,10) >= parseInt('0',10) && parseInt(netTxblIncome,10) <= parseInt('250000',10)){
			inc = {"10":0, "20":0, "30":0};
		}else if(parseInt(netTxblIncome,10) >= parseInt('250001',10) && parseInt(netTxblIncome,10) <= parseInt('500000',10)){
			inc = {"10":(parseInt(netTxblIncome,10) - 250001), "20":0, "30":0};
		}else if(parseInt(netTxblIncome,10) >= parseInt('500001',10) && parseInt(netTxblIncome,10) <= parseInt('1000000',10)){
			inc = {"10":250000, "20":(parseInt(netTxblIncome,10) - 500000), "30":0};
		}else if(parseInt(netTxblIncome,10) >= parseInt('1000001',10)){
			inc = {"10":250000, "20":500000, "30":(parseInt(netTxblIncome,10) - 1000000)};
		}
		
	}
	return inc;
}

//To do custom Import
function customImport(fieldId,rowCount,type){
	if(((fieldId.indexOf('scheduleCGPost45.longTermCapGainPost45.nRIOnSec112and115')!=-1 &&
		fieldId.indexOf('.exemptionOrDedn[')==-1) || 
		fieldId.indexOf('scheduleCGPost45.shortTermCapGainPost45.equityMFonSTT')!=-1 || 
		(fieldId.indexOf('scheduleCGPost45.longTermCapGainPost45.proviso112Applicable')!=-1 && 
		fieldId.indexOf('.exemptionOrDedn[')==-1))){
			addRowToCG(getTableId(fieldId));
			return true;
	}
	return false;
    }

//To check Unique sch OS Sec
function checkUniqueOSSec(){
	
	checkUniqueTableCol('schduleOsf', 'sourceDescription$');
	checkUniqueTableCol('scheduleCGstcg2', 'section$');
	checkUniqueTableCol('ltcgDeduction1', 'section$');
	checkUniqueTableCol('ltcgDeduction3', 'section$');
	checkUniqueTableCol('ltcgDeduction2', 'section$');
	checkUniqueTableCol('stcgDeduction1', 'section$');
	checkUniqueTableCol('stcgDeduction2', 'section$');
	checkUniqueTableCol('scheduleCGltcg3', 'sectionCode$');
	var i = 1;
	while(document.getElementById('scheduleCGltcg3_ded'+i)){
		checkUniqueTableCol('scheduleCGltcg3_ded'+i, 'section$');
		i++;
	}
	i=1;
	while(document.getElementById('stcg10pctTab_ded'+i)){
		checkUniqueTableCol('stcg10pctTab_ded'+i, 'section$');
		i++;
	}
	checkUniqueTableCol('stcgDeduction1', 'section$');
	checkUniqueTableCol('stcgDeduction2', 'section$');
	checkUniqueTableCol('scheduleCGltcg7', 'section$');

	checkUniqueTableCol('scheduleCGltcg4_ded1', 'section$');
}

//To check Unique Table Column in schedule
function checkUniqueTableCol(tableId, colname,errorMesg){
	
	var tab = document.getElementById(tableId);
	var selects = tab.getElementsByTagName('SELECT');
	var arr = new Array();
	for(var i=0;i<selects.length;i++){
		if(selects[i].name.match(colname) && selects[i].value!=''){
			if(arr.indexOf(selects[i].value)==-1 ){
				arr.push(selects[i].value);
			}else if(selects[i].value!='Others'){
				var msg = errorMesg || 'A particular drop down cannot be selected twice';
				j.setFieldError(selects[i].name, msg);
				addErrorXHTML(selects[i], msg ,true);	
			}
		}
	}
}

function ltcgPoint8Sum(){

var exemptionOrDednUs54 = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.amtDeemedCGSec54')[0];
exemptionOrDednUs54.value = addCGDeductions('ltcgDeduction8');
checkUniqueTableCol('ltcgDeduction8', 'section$');
}

function addBPExmptInc(tableId){
	var tab = document.getElementById(tableId);
	var inputs = tab.getElementsByTagName("INPUT");
	var sum = 0;
	for(var i=0;i<inputs.length;i++){
		if(inputs[i].name.match('totalAmount$')){
			sum = parseInt(sum) + parseInt(coalesce(inputs[i].value));
		}
	}
	return sum;
}


function setOffWithDtaa(sectionCode) {

	var arr = {
		'B1e' : 0,
		'B2e' : 0,
		'B3e' : 0,
		'B4e_22' : 0,
		'B4e_5ACA1b' : 0,
		'B5c' : 0,
		'B6e_21ciii' : 0,
		'B6e_5AC1c' : 0,
		'B6e_5ADiii' : 0,
		'B7c' : 0,
		'B7f' : 0,
		'B8e' : 0,
		'B9' : 0
	};
	var tab = document.getElementById('scheduleLtcgDtaa');
	var rowCount = tab.rows.length - 2;
	var total = 0;

	for ( var i = 0; i < rowCount; i++) {
		var itemIncluded = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.ltcgUnderDtaa['+ i + '].itemIncluded')[0].value;
		var amount = document.getElementsByName('scheduleCGPost45.longTermCapGainPost45.ltcgUnderDtaa['+ i + '].amount')[0].value;
		if (itemIncluded == 'B1e') {
			arr['B1e'] = parseInt(arr['B1e'], 10)+ parseInt(coalesce(amount), 10);
		} else if (itemIncluded == 'B2e') {
			arr['B2e'] = parseInt(arr['B2e'], 10)+ parseInt(coalesce(amount), 10);
		} else if (itemIncluded == 'B3e') {
			arr['B3e'] = parseInt(arr['B3e'], 10)+ parseInt(coalesce(amount), 10);
		} else if (itemIncluded == 'B4e_22') {
			arr['B4e_22'] = parseInt(arr['B4e_22'], 10)	+ parseInt(coalesce(amount), 10);
		} else if (itemIncluded == 'B4e_5ACA1b') {
			arr['B4e_5ACA1b'] = parseInt(arr['B4e_5ACA1b'], 10)	+ parseInt(coalesce(amount), 10);
		} else if (itemIncluded == 'B5c') {
			arr['B5c'] = parseInt(arr['B5c'], 10)+ parseInt(coalesce(amount), 10);
		} else if (itemIncluded == 'B6e_21ciii') {
			arr['B6e_21ciii'] = parseInt(arr['B6e_21ciii'], 10)	+ parseInt(coalesce(amount), 10);
		} else if (itemIncluded == 'B6e_5AC1c') {
			arr['B6e_5AC1c'] = parseInt(arr['B6e_5AC1c'], 10)+ parseInt(coalesce(amount), 10);
		} else if (itemIncluded == 'B6e_5ADiii') {
			arr['B6e_5ADiii'] = parseInt(arr['B6e_5ADiii'], 10)+ parseInt(coalesce(amount), 10);
		} else if (itemIncluded == 'B7c') {
			arr['B7c'] = parseInt(arr['B7c'], 10) + parseInt(coalesce(amount), 10);
		} else if (itemIncluded == 'B7f') {
			arr['B7f'] = parseInt(arr['B7f'], 10)+ parseInt(coalesce(amount), 10);
		} else if (itemIncluded == 'B8e') {
			arr['B8e'] = parseInt(arr['B8e'], 10) + parseInt(coalesce(amount), 10);
		} else if (itemIncluded == 'B9') {
			arr['B9'] = parseInt(arr['B9'], 10)	+ parseInt(coalesce(amount), 10);
		}
	}

	if (sectionCode == 'sec112') {
		total = arr['B1e'] + arr['B2e']+ arr['B3e'] + arr['B8e'] + arr['B5c'] + arr['B9'];
	} else if (sectionCode == 'sec11EA') {
		total = arr['B7f'];
	} else if (sectionCode == 'secProviso') {
		total = arr['B4e_22'] ;
	} else if (sectionCode == 'sec115E_b') {
		total = arr['B7c'];
	} else if (sectionCode == 'sec115ACA_1') {
		total = arr['B4e_5ACA1b'];
	} else if(sectionCode == 'sec112_1_c_2') {
	    total = arr['B6e_21ciii'];
    } else if(sectionCode == 'sec115AC_1') {
	    total = arr['B6e_5AC1c'];
    } else if(sectionCode == 'sec115AD_3') {
	    total = arr['B6e_5ADiii'];
    }
	return total;

}

function isDSCMandatory(){
	var count = 0;
	
	var i=0;
	var limit = 5000000;
	var msg = 'Liable for audit u/s 44AB as turnover exceeds  Rs. 50 lakh. Please check 44AB selection.';
	var code06Count =0;
	var codeOther06Count =0 ;
	var transpoterCodeCount = 0;
	
	var grossRcpt = parseInt(coalesce(document.getElementsByName('partapl.noBooksOfAccPL.grossReceipt')[0].value));
	var totRevenueFrmOperations = parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.totRevenueFrmOperations')[0].value));
	
	var grossRcptFrmSales = parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.businessReceipts')[0].value));
	var grossRcptFrmProf = parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.grossFromProfession')[0].value));
	var grossRcptFrmVat = parseInt(coalesce(document.getElementsByName('partapl.creditsToPL.exciseCustomsVAT.totExciseCustomsVAT')[0].value));
	var grossRcptFrmCringProf = parseInt(coalesce(document.getElementsByName('partapl.noBooksOfAccPL.grossReceiptProfession')[0].value));
	var sec44AD = parseInt(coalesce(document.getElementsByName('itr4ScheduleBP.businessIncOthThanSpec.deemedProfitBusUs.section44AD')[0].value));
	var auditFlag = document.getElementsByName('partAGEN2.auditInfo.liableSec44ABflg')[0];
	

	while(document.getElementsByName('partAGEN2For4.natOfBus.natureOfBusiness['+i+'].code')[0] && 
			document.getElementsByName('partAGEN2For4.natOfBus.natureOfBusiness['+i+'].code')[0].value){
		
		if(document.getElementsByName('partAGEN2For4.natOfBus.natureOfBusiness['+i+'].code')[0].value.match('0712')){			
			transpoterCodeCount++;
		}
		
		if(document.getElementsByName('partAGEN2For4.natOfBus.natureOfBusiness['+i+'].code')[0].value.match('060[1-7]')){			
			code06Count++;
		}
		
		if(!document.getElementsByName('partAGEN2For4.natOfBus.natureOfBusiness['+i+'].code')[0].value.match('060[1-7]')){			
			codeOther06Count++;
		}
		
		i++;
	}
	
	if ( transpoterCodeCount > 0){		
		return;
	}	
	
	if(code06Count == 0 && codeOther06Count > 0 ){
		
		if( sec44AD > 0){	
			limit=20000000;
			msg = 'Liable for audit u/s 44AB as turnover exceeds  Rs. 2 crore . Please check 44AB selection.';
		}else{
			
			limit=10000000;
			msg = 'Liable for audit u/s 44AB as turnover exceeds  Rs. 1 crore . Please check 44AB selection.';
		}
		
		if(parseInt(grossRcpt) + parseInt(grossRcptFrmSales) + parseInt(grossRcptFrmVat) > limit){
			
			if(auditFlag.value!='Y'){
				j.setFieldError(auditFlag.name, msg);
				addErrorXHTML(auditFlag, msg ,true);
			}
		}
	}else if(code06Count > 0 && codeOther06Count == 0){
		
		if(parseInt(grossRcptFrmProf) + parseInt(grossRcptFrmCringProf)  > limit){
			
			if(auditFlag.value!='Y'){
				j.setFieldError(auditFlag.name, msg);
				addErrorXHTML(auditFlag, msg ,true);
			}
		}
		
	}else if(code06Count > 0 && codeOther06Count > 0){
		
		if(parseInt(grossRcptFrmProf) + parseInt(grossRcptFrmCringProf)  > limit){
			
			if(auditFlag.value!='Y'){
				j.setFieldError(auditFlag.name, msg);
				addErrorXHTML(auditFlag, msg ,true);
			}
		}else {
			
			if( sec44AD > 0){	
				limit=20000000;
				msg = 'Liable for audit u/s 44AB as turnover exceeds  Rs. 2 crore . Please check 44AB selection.';
			}else{
				
				limit=10000000;
				msg = 'Liable for audit u/s 44AB as turnover exceeds  Rs. 1 crore . Please check 44AB selection.';
			}
			
			if(parseInt(grossRcpt) + parseInt(grossRcptFrmSales) + parseInt(grossRcptFrmVat) > limit){
				if(auditFlag.value!='Y'){
					j.setFieldError(auditFlag.name, msg);
					addErrorXHTML(auditFlag, msg ,true);
				}
			}
		}		
	}
}

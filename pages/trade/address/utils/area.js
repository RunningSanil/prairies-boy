var each=require('../../../../utils/each'),formatAreaData=function(a,b){var c={},d=a.toString().slice(0,2)||-1,e=a.toString().slice(0,4)||-1;return c.province=filterAndFormatAreaData(0,b.province,'\u7701\u4EFD'),c.city=filterAndFormatAreaData(d,b.city,'\u57CE\u5E02'),c.county=filterAndFormatAreaData(e,b.county,'\u533A\u53BF'),c},filterAndFormatAreaData=function(a,b,c){var d=[];return c&&d.push({text:c,code:a}),each(b,(e,f)=>{a&&0!==f.indexOf(a)||d.push({text:e,code:f})}),d};module.exports={formatAreaData};
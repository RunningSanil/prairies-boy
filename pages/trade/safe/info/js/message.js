var multiUpload=require('../../../../../utils/multi_uploader'),request=require('../utils/request'),cdnImage=require('../../../../../utils/cdnImage');module.exports={showMessageDialog(){this.setData({'messageDialog.show':!0})},hideMessageDialog(){this.setData({'messageDialog.show':!1})},onMessageDialogTextChange(a){this.setData({'messageDialog.message':a.detail.value})},submitMessageDialog(){var a=this.data.messageDialog;return a.message?this.validateImages(a.imgs)?void(this.isSubmitingMessage||(this.isSubmitingMessage=!0,request.submitMessage(this.data,b=>{this.isSubmitingMessage=!1;var c=this.data.messageDialog||{};c.message='',c.imgs=[],c.show=!1;var d=b;d.ext_info=d.ext_info.map(g=>({src:g,srcPreview:cdnImage(g,'!200x200.jpg')}));var f=this.data.log||[];f.unshift(d),this.setData({log:f,messageDialog:c})},b=>{this.isSubmitingMessage=!1,this.showZuiToast(b||'\u7F51\u7EDC\u6296\u4E86\u4E0B\uFF0C\u8BF7\u7A0D\u5019\u518D\u8BD5~')}))):void this.showZuiToast('\u8FD8\u6709\u90E8\u5206\u56FE\u7247\u8FD8\u6CA1\u6709\u4E0A\u4F20\u5B8C\u6210\uFF0C\u8BF7\u7A0D\u5019\u518D\u8BD5~'):void this.showZuiToast('\u8BF7\u586B\u5199\u7559\u8A00\u4FE1\u606F')},chooseMessageImages(){var a=this.data,b=a.MAX_PICTURES-a.messageDialog.imgs.length;b=0<b?b:0,wx.chooseImage({count:b,sizeType:['compressed'],success:c=>{var d=c.tempFilePaths||[],f=this.data.messageDialog.imgs||[],g=[];return f.length+d.length>a.MAX_PICTURES?void this.showZuiToast(`最多一共只能上传${a.MAX_PICTURES}张图片~`):void(d.forEach(h=>{g.push({uploading:!0,src:h,srcPreview:h,key:this.generateKey()})}),this.uploadMessageImgs(g),f=f.concat(g),this.setData({'messageDialog.imgs':f}))}})},onMessageImageDelete(a){var b=a.currentTarget.dataset||{},c=b.key||'',d=this.data.messageDialog.imgs||[],f=d.findIndex(g=>{return g.key==c});0>f||(d.splice(f,1),this.setData({'messageDialog.imgs':d}))},uploadMessageImgs(a=[]){multiUpload(a,{afterUploadSuccess:(b,c)=>{var d=this.data.messageDialog.imgs,f=d.findIndex(h=>{return c.key==h.key});if(!(0>f)){var g=d[f];g.src=b,g.srcPreview=cdnImage(b,'!100x100.jpg'),g.uploading=!1,this.setData({'messageDialog.imgs':d})}},afterUploadFail:b=>{var c=this.data.messageDialog.imgs,d=c.findIndex(f=>{return b.key==f.key});0>d||(c.splice(d,1),this.setData({'messageDialog.imgs':c}),this.showZuiToast('\u90E8\u5206\u56FE\u7247\u4E0A\u4F20\u51FA\u9519\uFF0C\u5DF2\u7ECF\u81EA\u52A8\u5254\u9664'))}})}};
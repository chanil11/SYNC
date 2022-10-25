sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast" 
    ],function(Controller, JSONModel, MessageToast) {
        "use strict";
    return Controller.extend("b02.sd.common.sdorder1.controller.View1", {
       
        onInit: function( ) {
            this.bus = this.getOwnerComponent().getEventBus();
            var oData = {
              
            ProductData : [],
            oCart : [],
            oTotal : null,
            oSdprice : []
            };

            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "view");
        },
        onBeforeRendering: function(){
            this._getData();
        },
        _getData: function(){
            var oDataModel = this.getView().getModel();
            var oViewModel = this.getView().getModel("view");

        oDataModel.read("/ProductListSet",{
            success: function (oData) {

                var oProductData = oData.results;
                var iLength = oProductData.length;

                for( var i = 0; i < iLength; i++ ){
                    oProductData[i].image = "../images/" + oProductData[i].Matrc + ".jpg"                    
                }
        
                oViewModel.setProperty("/ProductData", oProductData);
   
            },
            error: function (oError){
                console.log(oError);
            }})
        },
        handleNavigateToMidColumnPress: function () {
            this.bus.publish("flexible", "setDetailPage");
            
        },
        onInCart: function(){
        var oTable =  this.getView().byId("products");
        var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
        var oCompoModel = this.getOwnerComponent().getModel('Compo');

        var oProductsModel = this.getView().getModel("view");
        
        var aSelecteditems = [];
        if(itemIndex !== -1) {
            var oItems = oTable.getSelectedItems();

            for(var i=0; i<oItems.length; i++){
                var sData = oItems[i].getBindingContextPath();

                aSelecteditems.push(oProductsModel.getProperty(sData));
                
            }
            this.getOwnerComponent().getModel("myModel").setProperty("/cart", aSelecteditems, null, true);
        } 

        var aCart   = this.getOwnerComponent().getModel("myModel").oData.cart
        var iLength = aCart.length;
        var iTotal  = 0;
        var sTotal  = null;

        for(var ii=0; ii<iLength; ii++){
            iTotal += aCart[ii].iResult;
        };

        sTotal = String(iTotal);
        if(sTotal.length > 3 && sTotal.length < 7){
            var iNum = sTotal.length - 3;
            sTotal = sTotal.substring(0,iNum) + ',' + sTotal.slice(-3);
        } else if(sTotal.length > 6 && sTotal.length < 10){
            var iNum = sTotal.length - 6;
            sTotal = sTotal.substring(0,iNum) + ',' + sTotal.substring(iNum, iNum+3) + ',' + sTotal.slice(-3); 
        }

        sTotal = '총합: ' + sTotal + ' 원'

        oCompoModel.setProperty('/sTotal', sTotal);
        
        var msg = "장바구니에 담았습니다.";
        MessageToast.show(msg);   
    },
    onLiveChange: function(oEvent){
        
        var oViewModel = this.getView().getModel("view");  // 모델불러오기
      
        
        var iIndex = oEvent.oSource.oParent.sId.slice(-1); //oEvent가 발생한 index 
        var oProductData = oViewModel.getProperty('/ProductData'); // 제이슨 모델을 불러옴
       
        oProductData[iIndex].iResult = parseInt(oProductData[iIndex].Quantity) * parseInt(oProductData[iIndex].Sdprice);
        // 선택한 행의 iResult 값 = 선택한 행의 Quantity * 선택한 행의 Sdprice.
        
        oViewModel.setProperty('/ProductData', oProductData); //ProductData 값을 변경된 값이 든 모델로 세팅 
      
    },

    onTest: function(){
        var oViewModel = this.getView().getModel('view');
        debugger;
    }
    
    })
});
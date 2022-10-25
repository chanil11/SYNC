sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel", 
	"sap/m/MessageToast"
], function (Controller, History, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("b02.sd.common.sdorder1.controller.View3", {
		onInit: function () {
			this.bus = this.getOwnerComponent().getEventBus();

			var oData = {
				sToday : "Today", //value는 string	
				dateFormat : "yyyy-MM-dd",
				VendorData : []
			};
			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel, "view2");
		},
		handleNavigateToMidColumnPress: function () {
			this.bus.publish("flexible", "setDetailPage");
		},
		onBeforeRendering: function(){
            this._getData();
        },
        _getData: function(){
            var oDataModel = this.getView().getModel();
            var oViewModel = this.getView().getModel("view2");
			
        oDataModel.read("/VendorListSet",{
            success: function (oData) {

                var oProductData = oData.results;
        
                oViewModel.setProperty("/VendorData", oProductData);
				
            }.bind(this),
            error: function (oError){
                console.log(oError);
            }})
        },
		onSelectDate : function (oEvent) { 
			MessageToast.show(oEvent.getSource().getValue());
			
		},

		onDebugger : function () {
			debugger;
		}
		
	});
});
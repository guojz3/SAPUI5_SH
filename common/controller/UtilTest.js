sap.ui.define([
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(MessageToast, MessageBox) {
	"use strict";
	var UtilTest = {
		
		onDeleteItem: function(oEvent, that) {
			//delete index
			that.sDeleteItemIndex = oEvent.getParameter("listItem").getBindingContext("model_edit").getPath().split("/").reverse()[0];
			//newintem
			that.getView().getModel("model_edit").getData().Item.splice(that.sDeleteItemIndex, 1);
			var odata = that.getView().getModel("model_edit").getData();
			var list = [];
			odata.Item.forEach(function(rst) {
				delete rst.NO;
				list.push(rst);
			});
			var newlist = list;
			list.map(function(rst, index) {
				newlist[index].NO = index + 1;
			});
			odata.Item = newlist;
			odata.ItemCount = odata.ItemCount - 1;
			that.getView().getModel("model_edit").refresh();
		}


	};
	return UtilTest;
});
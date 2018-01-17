/*global location*/
sap.ui.define([
	"sh/bz/common/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sh/bz/common/controller/formatter",
	"sh/bz/common/controller/Util"
], function(
	BaseController,
	JSONModel,
	History,
	formatter,
	Util
) {
	"use strict";

	return BaseController.extend("sh.bz.common.controller.Ysxq", {
		formatter: formatter,
		/* ================================BaseController=========================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		onInit: function() {

			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("DETAIL_CL").attachPatternMatched(this._onObjectMatched, this);
			this.getRouter().getRoute("DETAIL_JK").attachPatternMatched(this._onObjectMatched, this);
			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function() {
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				this.getRouter().navTo("worklist", {}, true);
			}
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */
		_onObjectMatched: function(oEvent) {
			this.getView().setModel(this.getView().getModel("CLMODEL"));
			var data = {};
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");
			var sObjectId = oEvent.getParameter("arguments").id;
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("Clbx_headerSet", {
					Recode: sObjectId
				});

				this._bindView("/" + sObjectPath);
			}.bind(this));

			//显示数据
			var str = oEvent.getParameter("arguments").id;
			var bukrs = str.substring(2, 6);
			var Ryear = str.substring(6, 10);
			var Path = "/FMAVCTSET?$filter=Bukrs eq '" + bukrs + "' and  Ryear eq '" + Ryear + "' and  Recode eq '" + str + "' ";
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_YS_SEARCH_SRV/", true);
			var that = this;
			oModel.read(Path, {
				success: function(oData, response) {
					var Item_data = new sap.ui.model.json.JSONModel(oData).getData();
					that.getView().setModel(new sap.ui.model.json.JSONModel(Item_data), "item_data");
				},
				error: function(oError) {

				},
				async: false
			});

		},

		_bindView: function(sObjectPath) {

		},

		_onBindingChange: function() {}

	});

});
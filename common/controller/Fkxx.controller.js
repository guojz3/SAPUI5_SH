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
	return BaseController.extend("sh.bz.common.controller.Fkxx", {
		// debugger;
		formatter: formatter,
		/* ================================BaseController=========================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		onInit: function() {
			// debugger;
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
				// Restore original busy indicator delay for the object view
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
			this.id = sObjectId;
			var Bukrs = sap.ui.getCore().AppContext.Bukrs;
			this.getView().byId('Todo_IP_Recode').setValue(sObjectId);
			this.getView().byId('Todo_IP_Bukrs').setValue(Bukrs);
			//初始化输入框
			var view = this.getView();
			var inputs = [
				view.byId("Todo_IP_Fkfzh"),
				view.byId("Todo_IP_Hbkid"),
				view.byId("Todo_IP_Bankn"),
				view.byId("Todo_IP_Rstgr")
			];
			var i;
			for (i = 0; i < inputs.length; i++) {
				var vauleI = inputs[i].getValue();
				inputs[i].setValueState();
			}
			var that = this;
			that.getView().byId("view_Fkxx_save").setEnabled(true);
			that.getView().byId("Todo_IP_Fkfzh").setEditable(true);
			that.getView().byId("Todo_IP_Rstgr").setEditable(true);
			that.getView().byId("Todo_IP_Hbkid").setEditable(true);
			that.getView().byId("Todo_IP_Bankn").setEditable(true);
			that.getView().byId("Todo_IP_Zzhth").setEditable(true);
			that.getView().byId("Todo_IP_Zzzjjh").setEditable(true);
			that.getView().byId("Todo_IP_Prctr").setEditable(true);
			//根据编号获取付款详情
			this.readFKXX(this);
		},
		readFKXX: function(that) {
			//根据编号获取付款信息
			var Recode = that.getView().byId('Todo_IP_Recode').getValue();
			// var sPath = "/DATASAVESet?$filter=Recode eq '" + Recode + "' ";
			var sPath = "/DATASAVESet('" + Recode + "')";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROCWSP_SRV/", true);
			var that = this;
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "fkxx_data");
					if (model.oData.Flag_gz === 'X') {
						that.getView().byId("view_Fkxx_save").setEnabled(false);
						that.getView().byId("Todo_IP_Fkfzh").setEditable(false);
						that.getView().byId("Todo_IP_Rstgr").setEditable(false);
						that.getView().byId("Todo_IP_Hbkid").setEditable(false);
						that.getView().byId("Todo_IP_Bankn").setEditable(false);
						that.getView().byId("Todo_IP_Zzhth").setEditable(false);
						that.getView().byId("Todo_IP_Zzzjjh").setEditable(false);
						that.getView().byId("Todo_IP_Prctr").setEditable(false);
					}
				},
				error: function(oError) {

				},
				async: false
			});
		},

		//保存付款信息
		TodoListFkxxsavePressed: function(oEvent) {
			// 保存时候的校验	
			this.validateInputHead();
			var that = this;
			// var path = that.getView().getBindingContext().getPath() + "/";
			var Recode = that.getView().byId('Todo_IP_Recode').getValue();
			 var Data = that.getView().getModel("fkxx_data").getData();
			if (this.type) {
				if (Data.Flag === '') {
					var oEntry = {
						"Recode": Recode, //单据编号
						"Bukrs": Data.Bukrs, //公司代码 
						"Fkfzh": Data.Fkfzh, //付款方账户名称
						"Rstgr": Data.Rstgr, //原因代码
						"Zzhth": Data.Zzhth, //合同号
						"Hbkid": Data.Hbkid, //付款银行	
						"Banka": Data.Banka,
						"Bankn": Data.Bankn, //付款银行账户	
						"Prctr": Data.Prctr, //利润中心
						"Zzzjjh": Data.Zzzjjh, //资金计划项目	
						"Flag": "N"
					};
					var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROCWSP_SRV/", true);
					var sPath = "/DATASAVESet";
					oModel.create(sPath, oEntry, {
						success: function(oData, oResponse) {
							Util.showInfo("保存成功");
							sap.ui.getCore().doc.getController().initdata(that.id);
						},
						error: function(error) {
							Util.showError("保存失败!");
						}
					});
				} else {
					var oEntry = {
						"Recode": Recode, //单据编号
						"Bukrs": Data.Bukrs, //公司代码 
						"Fkfzh": Data.Fkfzh, //付款方账户名称
						"Rstgr":Data.Rstgr, //原因代码
						"Zzhth": Data.Zzhth, //合同号
						"Hbkid": Data.Hbkid, //付款银行	
						"Banka": Data.Banka,
						"Bankn": Data.Bankn, //付款银行账户	
						"Prctr": Data.Prctr, //利润中心	
						"Zzzjjh": Data.Zzzjjh, //资金计划项目	
						"Flag": "U"
					};
					var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROCWSP_SRV/", true);
					var sPath = "/DATASAVESet('" + Recode + "')";
					oModel.update(sPath, oEntry, {
						success: function(oData, oResponse) {
							Util.showInfo("保存成功");
							sap.ui.getCore().doc.getController().initdata(that.id);
						},
						error: function(error) {
							Util.showError("保存失败!");
						},
						async: false
					});
				}
			}
		},
		validateInputHead: function() {
			var view = this.getView();
			var inputs = [
				view.byId("Todo_IP_Fkfzh"),
				view.byId("Todo_IP_Hbkid"),
				view.byId("Todo_IP_Bankn"),
				view.byId("Todo_IP_Rstgr")
			];
			var i;
			var canContinue = true;
			this.type = canContinue;
			for (i = 0; i < inputs.length; i++) {
				var vauleI = inputs[i].getValue();
				if (!vauleI) {
					inputs[i].setValueState("Error");
					canContinue = false;
				} else {
					inputs[i].setValueState();
				}
			}
			this.type = canContinue;
			if (canContinue) {} else {
				Util.showError("请输入必输字段!");
			}
		},

		//合同号
		rowSelectedZzhth: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Zzhth").getPath();
			this.getView().getModel("model_Zzhth").setProperty("/sPath", sPath);
			var data = this.getView().getModel("fkxx_data").oData;
			data.Zzhth = this.getView().getModel("model_Zzhth").getProperty(sPath + "/" + "Zzhth");
			data.Zzhthms = this.getView().getModel("model_Zzhth").getProperty(sPath + "/" + "Zzhthms");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "fkxx_data");
			this.getView().getModel("fkxx_data").refresh();
			this.oDialogZzhthHelp.close();
			this.getView().getModel("model_Zzhth").setData(null);
		},
		//yuany原因原因
		rowSelectedRstgr: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Rstgr").getPath();
			this.getView().getModel("model_Rstgr").setProperty("/sPath", sPath);
			var data = this.getView().getModel("fkxx_data").oData;
			data.Rstgr = this.getView().getModel("model_Rstgr").getProperty(sPath + "/" + "Rstgr");
			data.Txt20 = this.getView().getModel("model_Rstgr").getProperty(sPath + "/" + "Txt20");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "fkxx_data");
			this.getView().getModel("fkxx_data").refresh();
			this.oDialogRstgrHelp.close();
			this.getView().getModel("model_Rstgr").setData(null);
		},
		//

		// 3.付款银行名称
		rowSelectedHbkid: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Hbkid").getPath();
			this.getView().getModel("model_Hbkid").setProperty("/sPath", sPath);
			var data = this.getView().getModel("fkxx_data").oData;
			data.Hbkid = this.getView().getModel("model_Hbkid").getProperty(sPath + "/" + "Hbkid");
			data.Banka = this.getView().getModel("model_Hbkid").getProperty(sPath + "/" + "Banka");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "fkxx_data");
			this.getView().getModel("fkxx_data").refresh();
			this.oDialogHbkidHelp.close();
			this.getView().getModel("model_Hbkid").setData(null);
			this.getView().byId('Todo_IP_Bankn').setValue(null);
		},

		//付款银行账号

		rowSelectedBankn: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Bankn").getPath();
			this.getView().getModel("model_Bankn").setProperty("/sPath", sPath);
			var data = this.getView().getModel("fkxx_data").oData;
			data.Bankn = this.getView().getModel("model_Bankn").getProperty(sPath + "/" + "Bankn");
			data.Text1 = this.getView().getModel("model_Bankn").getProperty(sPath + "/" + "Text1");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "fkxx_data");
			this.getView().getModel("fkxx_data").refresh();
			this.oDialogBanknHelp.close();
			this.getView().getModel("model_Bankn").setData(null);
		},

		// 资金计划项
		rowSelectedZzzjjh: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Zzzjjh").getPath();
			this.getView().getModel("model_Zzzjjh").setProperty("/sPath", sPath);
			var data = this.getView().getModel("fkxx_data").oData;
			data.Zzzjjh = this.getView().getModel("model_Zzzjjh").getProperty(sPath + "/" + "Zzzjjh");
			data.Zzzjjhms = this.getView().getModel("model_Zzzjjh").getProperty(sPath + "/" + "Zzzjjhms");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "fkxx_data");
			this.getView().getModel("fkxx_data").refresh();
			this.oDialogZzzjjhHelp.close();
			this.getView().getModel("model_Zzzjjh").setData(null);
		},
		// 利润中心付款信息
		rowSelectedCostCenterBukrs: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_CostCenter").getPath();
			this.getView().getModel("model_CostCenter").setProperty("/sPath", sPath);
			var data = this.getView().getModel("fkxx_data").oData;
			data.Prctr = this.getView().getModel("model_CostCenter").getProperty(sPath + "/" + "Prctr");
			data.KtextPrctr = this.getView().getModel("model_CostCenter").getProperty(sPath + "/" + "Ktext");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "fkxx_data");
			this.getView().getModel("fkxx_data").refresh();
			this.oDialogCostCenterHelp.close();
			this.getView().getModel("model_CostCenter").setData(null);
		},

		_bindView: function(sObjectPath) {},

		_onBindingChange: function() {}

	});

});
/*global location*/
sap.ui.define([
	"sh/bz/common/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sh/bz/common/controller/formatter",
	"sh/bz/common/controller/Util",
	"sap/ui/core/BusyIndicator"
], function(
	BaseController,
	JSONModel,
	History,
	formatter,
	Util,
	BusyIndicator
) {
	"use strict";

	return BaseController.extend("sh.bz.common.controller.DocPost", {
		formatter: formatter,
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
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
			sap.ui.getCore().doc = this.getView();
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
			var sObjectId = oEvent.getParameter("arguments").id;
			this.initdata(sObjectId);
		},
		initdata: function(sObjectId) {

			this.getView().setModel(this.getView().getModel("CLMODEL"));
			var data = {};
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");

			this.getView().byId('view_CODE').setValue(sObjectId);
			//初始化时间 
			// var new_date = {
			// 	"budat": new Date(),
			// 	"bldat": new Date()
			// };
			// var Model = new JSONModel(new_date);
			// this.getView().setModel(Model, "JSdate");
			//初始化输入框
			var view = this.getView();
			var inputs = [
				view.byId("view_BLDAT"),
				view.byId("view_BUDAT"),
				view.byId("view_KURSF")
			];
			var i;
			for (i = 0; i < inputs.length; i++) {
				var vauleI = inputs[i].getValue();
				inputs[i].setValueState();
			}
			var that = this;
			that.getView().byId("view_Doc_post").setEnabled(true);
			that.getView().byId("view_BLDAT").setEditable(true);
			that.getView().byId("view_BUDAT").setEditable(true);
			that.getView().byId("view_KURSF").setEditable(true);
			that.getView().byId("view_BKTXT").setEditable(true);
			that.getView().byId("view_NUMPG").setEditable(true);
			//初始化输入表单数据 
			var sPath = "/HEADINITIALSet('" + sObjectId + "')";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROPZGZ_SRV/", true);
			var that = this;
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "header_data");
				},
				error: function(oError) {},
				async: false
			});

			that.getView().byId("view_BLDAT").setDateValue(new Date());
			that.getView().byId("view_BUDAT").setDateValue(new Date());
			var sPath = "/HEADERSAVESet('" + sObjectId + "')";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROPZGZ_SRV/", true);
			var that = this;
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "header_data");
					if (model.oData.Belnr !== '') {
						that.getView().byId("view_Doc_post").setEnabled(false);
						that.getView().byId("view_BLDAT").setEditable(false);
						that.getView().byId("view_BUDAT").setEditable(false);
						that.getView().byId("view_KURSF").setEditable(false);
						that.getView().byId("view_BKTXT").setEditable(false);
						that.getView().byId("view_NUMPG").setEditable(false);
					}
				},
				error: function(oError) {},
				async: false
			});

			var belnr = that.getView().byId("view_BELNR").getValue();
			if (belnr === '') {
				var sPath = "/HEADINITIALSet('" + sObjectId + "')";
				var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROPZGZ_SRV/", true);
				var that = this;
				oDataModel.read(sPath, {
					success: function(oData, response) {
						var model = new sap.ui.model.json.JSONModel(oData);
						if (model.oData.Numpg === "000") {
							model.oData.Numpg = "";
						}
						that.getView().setModel(model, "header_data");
					},
					error: function(oError) {},
					async: false
				});
			}

			var Path = "/ITEMINITIALSet?$filter=Recode eq '" + sObjectId + "'  ";
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROPZGZ_SRV/", true);
			oModel.read(Path, {
				success: function(oData, response) {
					var Item_data = new sap.ui.model.json.JSONModel(oData).getData();
					var Bktxt = that.getView().byId("view_BKTXT").getValue();
					for (i = 0; i < Item_data.results.length; i++) {
						Item_data.results[i].Sgtxt = Bktxt;
						if (Item_data.results[i].Shkzg === "S") {
							Item_data.results[i].Shkzg = "借";
						} else {
							Item_data.results[i].Shkzg = "贷";
						}
					}

					that.getView().setModel(new sap.ui.model.json.JSONModel(Item_data), "item_data");
				},
				error: function(oError) {},
				async: false
			});
		},
		//过账
		DocPostPress: function() {
			// 抬头信息保存时候的校验	
			this.validateInputHead();
			var that = this;
			var Data = that.getView().getModel("header_data").getData();
			Data.Bldat.setHours(8);
			Data.Budat.setHours(8);
			if (this.type) {
				var oEntry = {
					"Bldat": Data.Bldat, //凭证日期
					"Budat": Data.Budat, //过账日期
					"Blart": Data.Blart, //凭证类型
					"Bukrs": Data.Bukrs, //公司代码 
					"Numpg": Data.Numpg, //附件张数
					"Bktxt": Data.Bktxt, //抬头文本
					"Usnam": Data.Usnam, //用户名
					"Waers": Data.Waers, //货币
					"Kursf": Data.Kursf, //汇率
					"Recode": Data.Recode
				};
				var Model = this.getView().getModel("GZMODEL");
				var sPath = "/HEADERSAVESet";
				that.setBusy(true);
				Model.create(sPath, oEntry, {
					success: function(oData, oResponse) {
						var model = new sap.ui.model.json.JSONModel(oData);
						that.getView().setModel(model, "header_data");
						if (model.oData.Zmark === 'E' || model.oData.Belnr === '') {
							Util.showError(model.oData.Zflag);
							that.setBusy(false);
						} else {
							that.getView().byId("view_Doc_post").setEnabled(false);
							that.getView().byId("view_BLDAT").setEditable(false);
							that.getView().byId("view_BUDAT").setEditable(false);
							that.getView().byId("view_KURSF").setEditable(false);
							that.getView().byId("view_BKTXT").setEditable(false);
							that.getView().byId("view_NUMPG").setEditable(false);
							Util.showInfo("过账成功");
							that.setBusy(false);
						}
					},
					error: function(error) {
						Util.showError("过账失败:" + error.message);
						that.setBusy(false);
					}
				});

				var header_Data = that.getView().getModel("header_data").getData();
				var Data = that.getView().getModel("item_data").getData();
				for (var i = 0; i < Data.results.length; i++) {
					var Shkzg;
					if (Data.results[i].Shkzg === "借") {
						Shkzg = "S";
					} else {
						Shkzg = "H";
					}
					var itemdata = {
						"Recode": Data.results[i].Recode,
						"Reitem": Data.results[i].Reitem,
						"Bschl": Data.results[i].Bschl,
						"Hkont": Data.results[i].Hkont,
						"Shkzg": Shkzg,
						"Wrbtr": Data.results[i].Wrbtr,
						"Lifnr": Data.results[i].Lifnr,
						"Kunnr": Data.results[i].Kunnr,
						"Sgtxt": header_Data.Bktxt,
						"Kostl": Data.results[i].Kostl,
						"Prctr": Data.results[i].Prctr,
						"Zuonr": Data.results[i].Zuonr,
						"Aufnr": Data.results[i].Aufnr,
						"Posid": Data.results[i].Posid,
						"Koart": Data.results[i].Koart,
						"Monat": Data.results[i].Monat,
						"Rstgr": Data.results[i].Rstgr,
						"Vbund": Data.results[i].Vbund,
						"Bukrs": Data.results[i].Bukrs,
						"Gjahr": Data.results[i].Gjahr,
						"Zzjshkdw": Data.results[i].Zzjshkdw,
						"Zzzjjh": Data.results[i].Zzzjjh,
						"Zzflht": Data.results[i].Zzflht,
						"Zzcx": Data.results[i].Zzcx,
						"Zzch": Data.results[i].Zzch,
						"Zzdqlb": Data.results[i].Zzdqlb,
						"Zzfxcb": Data.results[i].Zzfxcb,
						"Zzfzhs01": Data.results[i].Zzfzhs01,
						"Zzfzhs02": Data.results[i].Zzfzhs02,
						"Zzfzhs03": Data.results[i].Zzfzhs03,
						"Zzfzhs04": Data.results[i].Zzfzhs04,
						"Zzfzhslb": Data.results[i].Zzfzhslb,
						"Zzfzhsnr": Data.results[i].Zzfzhsnr,
						"Zzghjh": Data.results[i].Zzghjh,
						"Fkber": Data.results[i].Fkber,
						"Menge": Data.results[i].Menge,
						"Mwskz": Data.results[i].Mwskz
					};
					var sdealPath = "/ITEMSAVESet";
					Model.create(sdealPath, itemdata, {
						success: function(oData, oResponse) {
							// Util.showInfo("成功");
							that.setBusy(false);
						},
						error: function(error) {
							// Util.showError("保存失败!");
							that.setBusy(false);
						}
					});

				}
			}
		},

		validateInputHead: function() {
			var view = this.getView();
			var numpg = this.getView().byId("view_NUMPG").getValue();
			var inputs = [
				view.byId("view_BLDAT"),
				view.byId("view_BUDAT"),
				view.byId("view_KURSF"),
				// view.byId("view_NUMPG")
			];
			var i;
			var canContinue = true;
			this.type = canContinue;
			for (i = 0; i < inputs.length; i++) {
				var vauleI = inputs[i].getValue();
				vauleI = vauleI.replace(new RegExp(" ", "gm"), "");
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

			numpg = numpg.replace(new RegExp(" ", "gm"), "");
			if (numpg.match(/^\d+$/) === null) {
				canContinue = false;
				this.getView().byId("view_NUMPG").setValueState("Error");
				Util.showError("请输入有效有效数字!");
			} else {
				this.getView().byId("view_NUMPG").setValueState();
			}
			this.type = canContinue;
		},

		_bindView: function(sObjectPath) {

		},

		_onBindingChange: function() {}

	});

});
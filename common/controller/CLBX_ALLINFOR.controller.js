/*global location*/
sap.ui.define([
	"sh/bz/common/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sh/bz/common/controller/Formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/BusyIndicator",
	"sh/bz/common/controller/Util",
	"sh/bz/common/controller/UtilWorkFlow"
], function(BaseController, JSONModel, History, Formatter, Filter, FilterOperator, BusyIndicator, Util, UtilWorkFlow) {
	"use strict";
	//var reg_NO = /^\d+$/;
	var reg_NO = /^[0-9]+(.[0-9]{1,2})?$/;
	var reg_BankNO = /^\d{0,18}$/;
	var reg_PHONE = /^1[35678]\d{9}$|^((0\d{2}-)?\d{8}(-\d{1,4})?)$|^(0\d{3}-\d{7,8}(-\d{1,4})?)$/;
	return BaseController.extend("sh.bz.common.controller.CLBX_ALLINFOR", {

		formatter: Formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */

		//1 申请人选择
		rowSelected: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_PROPOSER").getPath();
			this.getView().getModel("model_PROPOSER").setProperty("/sPath", sPath);
			var path = this.getView().getBindingContext().getPath() + "/";
			var PernrS = this.getView().getModel("model_PROPOSER").getProperty(sPath + "/" + "Pernr");
			var SnameS = this.getView().getModel("model_PROPOSER").getProperty(sPath + "/" + "Sname");
			var Bukrs = this.getView().getModel("model_PROPOSER").getProperty(sPath + "/" + "Bukrs");
			var Butxt = this.getView().getModel("model_PROPOSER").getProperty(sPath + "/" + "Butxt");
			var Kostl = this.getView().getModel("model_PROPOSER").getProperty(sPath + "/" + "Kostl");
			var Ktext = this.getView().getModel("model_PROPOSER").getProperty(sPath + "/" + "Ktext");
			var Telnum = this.getView().getModel("model_PROPOSER").getProperty(sPath + "/" + "Ptel");
			var UsridS = this.getView().getModel("model_PROPOSER").getProperty(sPath + "/" + "Usrid");
			/* for fysq */
			/* 
			this.getView().getModel().setProperty(path + "PernrS", PernrS);
			this.getView().getModel().setProperty(path + "SnameS", SnameS);
			*/
			this.getView().getModel().setProperty(path + "PernrB", PernrS);
			this.getView().getModel().setProperty(path + "SnameB", SnameS);
			this.getView().getModel().setProperty(path + "Bukrs", Bukrs);
			this.getView().getModel().setProperty(path + "Butxt", Butxt);
			this.getView().getModel().setProperty(path + "Kostl", Kostl);
			this.getView().getModel().setProperty(path + "Ktext", Ktext);
			this.getView().getModel().setProperty(path + "Telnum", Telnum);
			this.getView().getModel().setProperty(path + "UsridS", UsridS);
			var data = {};
			var model = [];
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_PROPOSER");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_search");
			this.oDialogCostCenterHelpName.close();
		},

		//2 利润中心选择
		rowSelectedPROPOSER_PRCTR: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_PROPOSER_PRCTR").getPath();
			this.getView().getModel("model_PROPOSER_PRCTR").setProperty("/sPath", sPath);
			var path = this.getView().getBindingContext().getPath() + "/";
			/* for fysq */
			/*
			var Prctr = this.getView().getModel("model_PROPOSER_PRCTR").getProperty(sPath + "/" + "Prctr");
			var KtextPrctr = this.getView().getModel("model_PROPOSER_PRCTR").getProperty(sPath + "/" + "Ktext");
			this.getView().getModel().setProperty(path + "Prctr", Prctr);
			this.getView().getModel().setProperty(path + "KtextPrctr", KtextPrctr);
			*/
			/* for clbx */
			var Prctr = this.getView().getModel("model_PROPOSER_PRCTR").getProperty(sPath + "/" + "Prctr");
			var PrctrKtext = this.getView().getModel("model_PROPOSER_PRCTR").getProperty(sPath + "/" + "Ktext");
			this.getView().getModel().setProperty(path + "Prctr", Prctr);
			this.getView().getModel().setProperty(path + "PrctrKtext", PrctrKtext);

			var data = {};
			var model = [];
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_PROPOSER_PRCTR");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_search");
			this.oDialogCostCenterHelp.close();
		},

		//3 部门选择
		rowSelectedPROPOSER_KOSTL: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_PROPOSER_KOSTL").getPath();
			this.getView().getModel("model_PROPOSER_KOSTL").setProperty("/sPath", sPath);
			var path = this.getView().getBindingContext().getPath() + "/";
			var Orgeh = this.getView().getModel("model_PROPOSER_KOSTL").getProperty(sPath + "/" + "Orgeh");
			var OrgehText = this.getView().getModel("model_PROPOSER_KOSTL").getProperty(sPath + "/" + "OrgehText");
			this.getView().getModel().setProperty(path + "Orgeh", Orgeh);
			this.getView().getModel().setProperty(path + "OrgehText", OrgehText);
			var Kostl = this.getView().getModel("model_PROPOSER_KOSTL").getProperty(sPath + "/" + "Kostl");
			var KostlText = this.getView().getModel("model_PROPOSER_KOSTL").getProperty(sPath + "/" + "KostlText");
			this.getView().getModel().setProperty(path + "Kostl", Kostl);
			this.getView().getModel().setProperty(path + "Ktext", KostlText);
			var data = {};
			var model = [];
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_PROPOSER");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_search");
			this.oDialogCostPartHelp.close();
		},

		//4 费用类型选择
		rowSelectedEtdsc: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Etdsc").getPath();
			this.getView().getModel("model_Etdsc").setProperty("/sPath", sPath);
			var path = this.getView().getBindingContext().getPath() + "/";
			var Etkd = this.getView().getModel("model_Etdsc").getProperty(sPath + "/" + "Etkd");
			var Etnm = this.getView().getModel("model_Etdsc").getProperty(sPath + "/" + "Etnm");
			this.getView().getModel().setProperty(path + "Etkd", Etkd);
			this.getView().getModel().setProperty(path + "Etnm", Etnm);
			var data = this.getView().getModel("model_edit");
			data.Lcid = this.getView().getModel("model_Etdsc").getProperty(sPath + "/" + "Lcid");
			data.Lcbm = this.getView().getModel("model_Etdsc").getProperty(sPath + "/" + "Lcbm");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");
			var data = {};
			var model = [];
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_Etdsc");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_search");
			this.oDialogEtdscHelp.close();
		},

		//5 订单选择
		rowSelectedAufnr: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Aufnr").getPath();
			this.getView().getModel("model_Aufnr").setProperty("/sPath", sPath);
			var path = this.getView().getBindingContext().getPath() + "/";
			var Aufnr = this.getView().getModel("model_Aufnr").getProperty(sPath + "/" + "Aufnr");
			var KtextAufnr = this.getView().getModel("model_Aufnr").getProperty(sPath + "/" + "Ktext");
			this.getView().getModel().setProperty(path + "Aufnr", Aufnr);
			this.getView().getModel().setProperty(path + "KtextAufnr", KtextAufnr);
			var data = {};
			var model = [];
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_Aufnr");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_search");
			this.oDialogAufnrHelp.close();
		},

		//付款方式6 窗口 选择一行数据
		rowSelectedZlsch: function(oEvent) {
			var path = oEvent.getSource().getBindingContext().getPath() + "/";
			var model = this.getView().byId("zlschlist").getModel();
			var Zlsch = model.getProperty(path + "Zlsch");
			var Text2 = model.getProperty(path + "Text2");

			var path = this.getView().getBindingContext().getPath() + "/";
			this.getView().getModel().setProperty(path + "Zlsch", Zlsch);
			this.getView().getModel().setProperty(path + "TextZlsch", Text2);

			var data = this.getView().getModel("model_edit").getData();
			data.ZlschText = Text2;
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");

			this.oDialogZlschHelp.close();
		},

		//7 公司选择
		rowSelectedBukr: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_BUKRS").getPath();
			this.getView().getModel("model_BUKRS").setProperty("/sPath", sPath);
			var path = this.getView().getBindingContext().getPath() + "/";
			var Bxbukrs = this.getView().getModel("model_BUKRS").getProperty(sPath + "/" + "Bxbukrs");
			var Butxt = this.getView().getModel("model_BUKRS").getProperty(sPath + "/" + "Butxt");
			var Orgeh = this.getView().getModel("model_BUKRS").getProperty(sPath + "/" + "Orgeh");
			var Short = this.getView().getModel("model_BUKRS").getProperty(sPath + "/" + "Short");
			var Etkd = this.getView().getModel("model_BUKRS").getProperty(sPath + "/" + "Etkd");
			var Etnm = this.getView().getModel("model_BUKRS").getProperty(sPath + "/" + "Etnm");
			var Prctr = this.getView().getModel("model_BUKRS").getProperty(sPath + "/" + "Prctr");
			var KtextPrctr = this.getView().getModel("model_BUKRS").getProperty(sPath + "/" + "KtextPrctr");
			var Kostl = this.getView().getModel("model_BUKRS").getProperty(sPath + "/" + "Kostl");
			var Ktext = this.getView().getModel("model_BUKRS").getProperty(sPath + "/" + "Ktext");
			this.getView().getModel().setProperty(path + "Bukrs", Bxbukrs);
			this.getView().getModel().setProperty(path + "Butxt", Butxt);
			this.getView().getModel().setProperty(path + "Orgeh", Orgeh);
			this.getView().getModel().setProperty(path + "OrgehText", Short);
			this.getView().getModel().setProperty(path + "Etkd", Etkd);
			this.getView().getModel().setProperty(path + "Etnm", Etnm);
			this.getView().getModel().setProperty(path + "Prctr", Prctr);
			this.getView().getModel().setProperty(path + "PrctrKtext", KtextPrctr);
			this.getView().getModel().setProperty(path + "Kostl", Kostl);
			this.getView().getModel().setProperty(path + "Ktext", Ktext);
			var data = {};
			var model = [];
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_BUKRS");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_BUKRS");
			this.oDialogBukrs.close();
		},

		onShowEtdscHelp: function(oEvent) {
			var data = this.getView().getModel("GLOBLEDATA").oData.DKKD;
			if (data === "BX") {
				var Dkkd = "BX";
			} else {
				var Dkkd = "CL";
			}
			Util.onShowEtdscHelp(oEvent, this, Dkkd);
		},
		//费用类型搜索
		onSearchEtdsc: function(oEvent) {
			var data = this.getView().getModel("GLOBLEDATA").oData.DKKD;
			if (data === "BX") {
				var DKKD = "BX";
			} else {
				var DKKD = "CL";
			}
			// var DKKD = "CL";
			Util.onSearchEtdsc(oEvent, this, DKKD);
		},

		onInit: function() {
			this.getView().addStyleClass(this.getContentDensityClass());
			var oViewModel,
				iOriginalBusyDelay;
			this.clxx_num = 0;
			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			// iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._oTableSearchState = [];
			if (!sap.ui.getCore().AppContext) {
				sap.ui.getCore().AppContext = new Object();
			}
			// sap.ui.getCore().AppContext = {};
			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				saveAsTileTitle: this.getResourceBundle().getText("worklistViewTitle"),
				shareOnJamTitle: this.getResourceBundle().getText("worklistViewTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "worklistView");
			if (this.getRouter().getRoute("DETAIL_CL")) {
				this.getRouter().getRoute("DETAIL_CL").attachPatternMatched(this._onObjectMatched, this);
			};
			if (this.getRouter().getRoute("Home_CL")) {
				this.getRouter().getRoute("Home_CL").attachPatternMatched(this._onObjectMatched, this);
			};
			if (this.getRouter().getRoute("DETAIL_CL_my")) {
				this.getRouter().getRoute("DETAIL_CL_my").attachPatternMatched(this._onObjectMatched, this);
			};
		},
		_onObjectMatched: function(oEvent) {
			//add by sunfeng start
			if (this.getView().getModel("model_edit") === undefined) {
				var data = {};
				this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");
			}
			if (this.getView().getModel("CLMODEL") !== undefined) {
				this.getView().setModel(this.getView().getModel("CLMODEL"));
				this.getView().getModel().setRefreshAfterChange();
			} else {
				var sDKKD = this.getView().getModel("GLOBLEDATA").getProperty("/DKKD");
				if (sDKKD === "CL") {
					document.title = '差旅报销';
				} else {
					document.title = '费用报销';
				};
			};
			//发票合计model
			// var oJson = {
			// 	bhxje: "",
			// 	bhxse: "",
			// 	hsje: ""
			// };
			// var oJson = new sap.ui.model.json.JSONModel(oJson);
			// this.setModel(oJson, "fphjmodel");
			//if(!this.getView().getModel("fphjmodel")){this.setModel(oJson, "fphjmodel");};

			//清空发票
			// this.getView().getModel("fphjmodel").setProperty("/bhxje", 0.00)
			// this.getView().getModel("fphjmodel").setProperty("/bhxse", 0.00);
			// this.getView().getModel("fphjmodel").setProperty("/hsje", 0.00);
			//add by sunfeng end
			//报销金额
			// if(item){}
			// for(var i=0;i<item.length;i++){
			// 	// var header.Wrbtr = item[i].getBindingContext().getProperty().Wrbtr;
			// 	var Wrbtr = item[i].getBindingContext().getProperty().Wrbtr;
			// 	this.getView().getModel().setProperty(path + "Wrbtr", Wrbtr, true);
			// }

			var that = this;
			var opara = oEvent.getParameter("arguments");
			//this.setBusy(true);
			this.getModel().metadataLoaded().then(function() {
				if (this.getView().byId("Panel_h").getBindingContext() == null) {

					if (!opara.id) {
						this.prepareNewData();
						this.setscreen("");
					} else {
						this.showData(opara);
						this._id = opara.id;
					};
				} else {
					// if (opara.id !== this._id) {
					// 	this.showData(opara);
					// 	this._id = opara.id;
					// } else {
					// 	this.setscreen(this.getOwnerComponent()._status);
					// };
					// this.setBusy(false);

					if (this._nav === "X") {
						this._nav = "";
					} else {
						this.showData(opara);
					};
				};
			}.bind(this));
			//计算报销金额 Bchxje
			this.changeBxje();
			// //增加发票合计
			// this.getFphj();
		},
		//计算报销金额 Bchxje
		changeBxje: function() {
			var item = this.getView().byId("CLBX_CLXX_table").getItems();
			if (this.getView().byId("Panel_h").getBindingContext() !== undefined) {
				var path = this.getView().byId("Panel_h").getBindingContext().getPath() + "/";
				var header = this.getView().byId("Panel_h").getBindingContext().getProperty();
				var wrbtr = 0.00;
				this.getView().getModel().setProperty(path + "Wrbtr", "0.00", true);
				this.getView().getModel().setProperty(path + "Bczfje", "0.00", true);
				for (var i = 0; i < item.length; i++) {
					var itemWrbtr = 0;
					if (item[i].getBindingContext().getProperty().Wrbtr !== undefined) {
						itemWrbtr = item[i].getBindingContext().getProperty().Wrbtr;
					}
					wrbtr = parseFloat(wrbtr) + parseFloat(itemWrbtr);
					var zfje = wrbtr - parseFloat(header.Bchxje);
					var Wrbtr = Formatter.FloatFormat(wrbtr);
					var Bczfje = Formatter.FloatFormat(zfje);
					this.getView().getModel().setProperty(path + "Wrbtr", Wrbtr, true);
					this.getView().getModel().setProperty(path + "Bczfje", Bczfje, true);
				}
			}
		},
		getFphj: function() {
			var item = this.getView().byId("table_fp").getItems();
			if (this.getView().byId("Panel_h").getBindingContext() !== undefined) {
				// this.getModel("CONTROL").getProperty("/control") === 'AL')
				// var header = this.getView().byId("Panel_h").getBindingContext().getProperty();
				var bhsje = 0.00;
				var se = 0.00;
				var hsje = 0.00;
				// this.getView().getModel().setProperty(path + "Wrbtr", "0.00", true);
				// this.getView().getModel().setProperty(path + "Bczfje", "0.00", true);
				for (var i = 0; i < item.length; i++) {
					var itembhsje = 0;
					var itemse = 0;
					var itemhsje = 0;
					if (item[i].getBindingContext().getProperty().Awotax !== undefined) {
						itembhsje = item[i].getBindingContext().getProperty().Awotax;
					}
					bhsje = parseFloat(bhsje) + parseFloat(itembhsje);

					if (item[i].getBindingContext().getProperty().Taxamount !== undefined) {
						itemse = item[i].getBindingContext().getProperty().Taxamount;
					}
					se = parseFloat(se) + parseFloat(itemse);

					if (item[i].getBindingContext().getProperty().Awtax !== undefined) {
						itemhsje = item[i].getBindingContext().getProperty().Awtax;
					}
					hsje = parseFloat(hsje) + parseFloat(itemhsje);

					var bhsje = Formatter.FloatFormat(bhsje);
					var se = Formatter.FloatFormat(se);
					var hsje = Formatter.FloatFormat(hsje);
					this.getView().getModel("fphjmodel").setProperty("/bhxje", bhsje);
					this.getView().getModel("fphjmodel").setProperty("/bhxse", se);
					this.getView().getModel("fphjmodel").setProperty("/hsje", hsje);
				}
			}
		},
		//add by ymz s
		setscreen: function(status, sdata, sflag1, sflag2) {
			var that = this;
			if (status === "A" || status === "" || status === undefined || status === "D" || status === "R") {
				//起草
				if (sdata !== undefined) {
					if (sdata === "") {
						this.getView().byId("IP_BUKRS").setEditable(false);
					}
				}
				var sViewinfor = [];
				this.addfiledcontrol(sViewinfor, 'IP_ETNAME', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_PERNR_B', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_Orgeh', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_PRCTR', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_ZLSCH', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_TELNUM', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_ACCOUNTNAME', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_FJZS', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_BANKA', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_NOTE', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_BANKN', null, null, true);
				this.addfiledcontrol(sViewinfor, 'ip_Bchxje', null, null, true);

				this.addfiledcontrol(sViewinfor, 'CLBX_ITEM_ONBUTTON', true, true, null);
				this.addfiledcontrol(sViewinfor, 'CLBX_ITEM_ONDELETE', true, true, null);
				this.addfiledcontrol(sViewinfor, 'CLBX_SQD_ONBUTTON', true, true, null);
				this.addfiledcontrol(sViewinfor, 'CLBX_SQD_ONDELETE', true, true, null);
				this.addfiledcontrol(sViewinfor, 'CLBX_hx_ONBUTTON', true, true, null);
				this.addfiledcontrol(sViewinfor, 'CLBX_hx_ONDELETE', true, true, null);
				this.addfiledcontrol(sViewinfor, 'CLBX_FP_ONBUTTON', true, true, null);
				this.addfiledcontrol(sViewinfor, 'CLBX_FP_ONDELETE', true, true, null);

				this.addfiledcontrol(sViewinfor, 'view_Edit_save', true, true, null);
				// if (sdata.Recode !== "" && sdata.Recode !== undefined) {
				//未保存过时
				if (status === "" || status === undefined) {
					this.addfiledcontrol(sViewinfor, 'view_Edit_submit', true, false, null);
				} else {
					this.addfiledcontrol(sViewinfor, 'view_Edit_submit', true, true, null);
				};

				for (var i = 0; i < sViewinfor.length; i++) {
					if (sViewinfor[i].visible !== null) {
						this.getView().byId(sViewinfor[i].element).setVisible(sViewinfor[i].visible);
					}
					if (sViewinfor[i].enable !== null) {
						this.getView().byId(sViewinfor[i].element).setEnabled(sViewinfor[i].enable);
					}
					if (sViewinfor[i].editable !== null) {
						this.getView().byId(sViewinfor[i].element).setEditable(sViewinfor[i].editable);
					}
				};
				if (this.getView().byId("CLBXPAGE")) {
					this.getView().byId("CLBXPAGE").setShowFooter(true);
				}
				if (this.getView().byId("CLBX_page_HOME")) {
					this.getView().byId("CLBX_page_HOME").setShowFooter(true);
				}

				this.getView().byId("fileUploader").setVisible(true);
				this.getView().byId("fileUpload_delete").setVisible(true);
				debugger;
			} else if (status === "C" || status === "E") {
				//审批中 已审批
				this.getView().byId("fileUploader").setVisible(false);
				var elements = that.getView().findElements(true);
				this.getView().byId("ip_Bchxje").setEditable(false);
				for (var i = 0; i < elements.length; i++) {
					if (elements[i].getMetadata().getName() === "sap.m.MultiInput" || elements[i].getMetadata().getName() === "sap.m.Input") {
						elements[i].setEditable(false);
					}
					if (elements[i].getMetadata().getName() === "sap.m.Button") {
						elements[i].setVisible(false);
					}
					if (elements[i].getMetadata().getName() === "sap.m.Page") {
						elements[i].setShowFooter(false);
					}

				}
			}
		},

		addfiledcontrol: function(sViewinfor, selement, svisible, senable, seditable) {
			var wa = {
				element: selement,
				visible: svisible,
				enable: senable,
				editable: seditable,
			};
			sViewinfor.splice(0, 0, wa);
			return sViewinfor;
		},
		//add by ymz e
		onAfterRendering: function() {
			//Util.oview = this;
			this.checkScreenSize(this);
			//sap.ui.Device.resize.attachHandler(this.checkScreenSize);

		},

		showData: function(opara) {
			Util.setBusy(true);
			var that = this;
			var sObjectId = opara.id;
			var sObjectPath = this.getView().getModel().createKey("Clbx_headerSet", {
				Recode: sObjectId
			});
			sObjectPath = "/" + sObjectPath;
			this.getView().unbindElement();
			debugger;

			//发票合计model
			var oJson = {
				bhxje: "",
				bhxse: "",
				hsje: ""
			};
			var oJson = new sap.ui.model.json.JSONModel(oJson);
			this.setModel(oJson, "fphjmodel");
			this.getView().getModel("fphjmodel").setProperty("/bhxje", 0.00)
			this.getView().getModel("fphjmodel").setProperty("/bhxse", 0.00);
			this.getView().getModel("fphjmodel").setProperty("/hsje", 0.00);
			
			var sdata = this.getView().getModel().getProperty(sObjectPath);
			if (sdata) {
				//this.getView().getModel().refresh();
				that.setscreen(sdata.Spzt, sdata.Btmark);
				Util.setBusy(false);
			};
			this.getView().bindElement({
				path: sObjectPath,
				events: {
					dataRequested: function() {
						console.log("发起");
					},
					dataReceived: function(oData, response) {
						Util.setBusy(false);
						var model = oData.getParameters();
						var Recode = model.data.Recode;
						that.getFiles(that, Recode);
						// if (model.data.Spzt === "A" || model.data.Spzt === "D" || model.data.Spzt === "R") {
						// that.getView().byId("view_Edit_save").setEnabled(true);
						// that.getView().byId("view_Edit_submit").setEnabled(true);
						// } else {
						// that.getView().byId("view_Edit_save").setEnabled(false);
						// that.getView().byId("view_Edit_submit").setEnabled(false);
						// }
						if (sap.ui.getCore().AppContext.Apps === "Todolist") {
							// that.getView().byId("view_Edit_save").setVisible(false);
							// that.getView().byId("view_Edit_submit").setVisible(false);
						}
						if (that.getOwnerComponent()._status === undefined || that.getOwnerComponent()._status === "") {
							that.setscreen(model.data.Spzt, model.data.Btmark);
						} else {
							that.setscreen(that.getOwnerComponent()._status);
						};
					}
				}
			});
			if (this.getView().getBindingContext() !== undefined) {
				var model = this.getView().getBindingContext().getProperty();
				// if (model.Spzt === "A" || model.Spzt === "D" || model.Spzt === "R") {
				// 	that.getView().byId("view_Edit_save").setEnabled(true);
				// 	that.getView().byId("view_Edit_submit").setEnabled(true);
				// } else {
				// 	that.getView().byId("view_Edit_save").setEnabled(false);
				// 	that.getView().byId("view_Edit_submit").setEnabled(false);
				// }
			}
		},
		prepareNewData: function() {
			var that = this;
			if (that.getView().byId("view_Edit_save") === undefined) {
				var data = that.getView().getModel("model_edit");
				data.button_save_enabled = true;
				data.button_submit_enabled = false;
				that.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");
			} else {
				// that.getView().byId("view_Edit_save").setEnabled(true);
				// that.getView().byId("view_Edit_submit").setEnabled(false);

			}

			//初始化输入表单数据 数据校验
			var data = {
				"Item": []
			};
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_file");
			//add
			this.byId("CLBX_CLXX_table").unbindAggregation("items");
			this.byId("table_sq").unbindAggregation("items");
			this.byId("table_hx").unbindAggregation("items");
			this.byId("table_fp").unbindAggregation("items");

			//发票合计model
			var oJson = {
				bhxje: "",
				bhxse: "",
				hsje: ""
			};
			var oJson = new sap.ui.model.json.JSONModel(oJson);
			this.setModel(oJson, "fphjmodel");

			// var bhsje = Formatter.FloatFormat(bhsje);
			// var se = Formatter.FloatFormat(se);
			// var hsje = Formatter.FloatFormat(hsje);

			//清空发票
			this.getView().getModel("fphjmodel").setProperty("/bhxje", 0.00)
			this.getView().getModel("fphjmodel").setProperty("/bhxse", 0.00);
			this.getView().getModel("fphjmodel").setProperty("/hsje", 0.00);

			//初始化输入表单数据 数据校验
			var data = {
				"WrbtrValueState": "None",
				"WrbtrValueStateText": "",
				"Kursf_editable": false,
				"button_save_enabled": true,
				"button_submit_enabled": false,
			};
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");

			//初始化登录人信息
			// if (sap.ushell != null) {
			// 	this.getOwnerComponent()._userid = sap.ushell.Container.getService("UserInfo").getId();
			// } else {
			// 	this.getOwnerComponent()._userid = "ZZLIYJ";
			// };
			var loc = location.href.toLowerCase();
			if (loc.indexOf("fiorilaunchpad.html") > 0) {
				this.getOwnerComponent()._userid = sap.ushell.Container.getService("UserInfo").getId();
			} else {
				this.getOwnerComponent()._userid = "ZZLIYJ";
			};

			//初始化输入表单数据 总表 空数据
			var oEntry = this.getView().getModel().createEntry("Clbx_headerSet");
			this.getView().byId("Panel_h").setBindingContext(oEntry);
			this.getView().setBindingContext(oEntry);
			var opath = oEntry.getPath();

			this.getView().getModel().setRefreshAfterChange(true);
			this.getpersoninfo();

		},

		getpersoninfo: function() {

			var that = this;
			var userid = this.getOwnerComponent()._userid;
			var loc = location.href.toLowerCase();
			if (loc.indexOf("fiorilaunchpad.html") > 0) {
				this.getOwnerComponent()._userid = sap.ushell.Container.getService("UserInfo").getId();
			} else {
				this.getOwnerComponent()._userid = "ZZLIYJ";
			};
			var omodel = this.getView().getModel();
			// var sPath = "/RybhSet('" + userid + "')";
			var sPathroot = this.getView().byId("Panel_h").getBindingContext().getPath();
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV/", true);
			var sPath = "/RybhSet?$filter=Usrid eq '" + userid + "'";
			// this.getView().getModel().read(sPath, {
			oDataModel.read(sPath, {
				success: function(oData) {
					if (oData.results[0].Btmark === "") {
						that.getView().byId("IP_BUKRS").setEditable(false);
					}
					//初始化主页面的个别数据 主model没有的字段也可
					that.getView().getModel().setProperty(sPathroot + "/Recode", "");
					that.getView().getModel().setProperty(sPathroot + "/Redate", oData.results[0].Datum);

					that.getView().getModel().setProperty(sPathroot + "/PernrB", oData.results[0].Pernr);
					that.getView().getModel().setProperty(sPathroot + "/SnameB", oData.results[0].Sname);

					that.getView().getModel().setProperty(sPathroot + "/Pernr", oData.results[0].Pernr);
					that.getView().getModel().setProperty(sPathroot + "/Sname", oData.results[0].Sname);

					that.getView().getModel().setProperty(sPathroot + "/Usrid", userid);
					that.getView().getModel().setProperty(sPathroot + "/UsridS", oData.results[0].Usrid);

					that.getView().getModel().setProperty(sPathroot + "/Kostl", oData.results[0].Kostl);
					that.getView().getModel().setProperty(sPathroot + "/Ktext", oData.results[0].Ktext);

					that.getView().getModel().setProperty(sPathroot + "/Orgeh", oData.results[0].Orgeh);
					that.getView().getModel().setProperty(sPathroot + "/OrgehText", oData.results[0].OrgehText);

					that.getView().getModel().setProperty(sPathroot + "/Butxt", oData.results[0].Butxt);
					that.getView().getModel().setProperty(sPathroot + "/Bukrs", oData.results[0].Bukrs);

					that.getView().getModel().setProperty(sPathroot + "/Telnum", oData.results[0].Ptel);
					that.getView().getModel().setProperty(sPathroot + "/Accountname", oData.results[0].Sname);
					that.getView().getModel().setProperty(sPathroot + "/Banka", oData.results[0].Banka);
					that.getView().getModel().setProperty(sPathroot + "/Bankn", oData.results[0].Bankn);

					that.getView().getModel().setProperty(sPathroot + "/Prctr", oData.results[0].Prctr);
					that.getView().getModel().setProperty(sPathroot + "/PrctrKtext", oData.results[0].KtextPrctr);

					that.getView().getModel().setProperty(sPathroot + "/Wrbtr", "0.00");
					that.getView().getModel().setProperty(sPathroot + "/Bczfje", "0.00");
					that.getView().getModel().setProperty(sPathroot + "/Bchxje", "0.00");

					// that.getView().getModel().setProperty(sPathroot + "/Fjzs", "0");

					//初始化报销类型
					that.readBEType(that);

					that.setBusy(false);
				},
				error: function(oData) {

				},
				async: false
			});
		},
		readBEType: function(that) {
			var path = that.getView().byId("Panel_h").getBindingContext().getPath() + "/";
			var model = that.getView().getModel();
			var Bukrs = model.getProperty(path + "Bukrs");

			var data = that.getView().getModel("GLOBLEDATA").oData.DKKD;
			if (data === "BX") {
				var DKKD = "BX";
			} else {
				var DKKD = "CL";
			}

			//var sPath = "/BETYPESet?$filter=( Bukrs eq '" + Bukrs + "' ) and ( Dkkd eq '" + DKKD + "' ) and (Etkd eq '" + ETKD + "')";
			var sPath = "/BETYPESet?$filter=( Bukrs eq '" + Bukrs + "' ) and ( Dkkd eq '" + DKKD + "' )";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					if (oData.results.length > 0) {
						that.getView().getModel().setProperty(path + "Etkd", oData.results[0].Etkd);
						that.getView().getModel().setProperty(path + "Etnm", oData.results[0].Etnm);
						var data = {};
						data.Etdsc = oData.results[0].Etdsc;
						data.Lcid = oData.results[0].Lcid;
						data.Lcbm = oData.results[0].Lcbm;
						var model = new sap.ui.model.json.JSONModel(data);
						that.getView().setModel(model, "model_edit");
					} else {

					}

				},
				error: function(oError) {

				},
				async: false
			});
		},
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function(oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},
		onUpdateFinishedfp: function(oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
			//增加发票合计
			this.getFphj();
		},
		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will navigate to the shell home
		 * @public
		 */
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: "#Shell-home"
					}
				});
			}
		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function() {
			var oViewModel = this.getModel("worklistView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		onSearch: function(oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var oTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					oTableSearchState = [new Filter("Recode", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(oTableSearchState);
			}

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function() {
			var oTable = this.byId("CLBX_CLXX_table");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function(oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("Recode")
			});
		},
		onPress_clxx: function(oEvent) {
			sap.ui.getCore().CLBX_HOMEVIEW = this.getView();
			this.getRouter().navTo("Clinfor", {
				entityid: oEvent.getSource().getBindingContext().getPath().substring(1)
			});

			//add
			this._nav = "X";
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {object} oTableSearchState an array of filters for the search
		 * @private
		 */
		_applySearch: function(oTableSearchState) {
			var oTable = this.byId("CLBX_CLXX_table"),
				oViewModel = this.getModel("worklistView");
			oTable.getBinding("items").filter(oTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (oTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		},

		onAddCLINFOR: function(OEvent) {
			// clxx_num += 1;
			// var newData = {Recode:clxx_num};
			// var oEntry = this.getView().getModel().createEntry("Clbx_itemSet", {
			// 	properties: newData,
			// 	success: function() {
			// 	},
			// 	error: function() {
			// 	}

			// });

			// var table = this.byId("table");
			// var tmp = this._tmp_table;

			// var table_item_clone = this.getView().byId("table_item").clone();

			// table_item_clone.setBindingContext(oEntry);

			// var table = this.getView().byId("table");

			// table.addItem(table_item_clone);

			// // table.bindAggregation("items", {
			// // 	path: "/Clbx_itemSet",
			// // 	template: tmp
			// // });

			// this.getRouter().navTo("Clinfor",{entityid:oEntry.getPath().substring(1)});

			var table = this.byId("CLBX_CLXX_table");
			table.setModel(this.getView().getModel());
			var SHeader = this.getView().byId("Panel_h").getBindingContext().getProperty();
			var Bukrs = SHeader.Bukrs;
			var Etkd = SHeader.Etkd;
			sap.ui.getCore().AppContext.Bukrs = Bukrs;
			sap.ui.getCore().AppContext.Etkd = Etkd;
			sap.ui.getCore().CLBX_HOMEVIEW = this.getView();
			this.getRouter().navTo("Clinfor");

			//add
			this._nav = "X";
		},
		onGlsqd: function() {
			//this.getRouter().navTo("Glsqd");
			var that = this;
			this._oGLSQDDialog = this.getView().byId("CLBX_Dialog_glsqd");
			var oFragmentController = {
				onDialogBack: function() {
					that._oGLSQDDialog.close();

					//that._oView.getController().callbackConfirm();
				},
				onDialogSave: function(oEvent) {

				}
			};

			if (!this._oGLSQDDialog) {
				this._oGLSQDDialog = sap.ui.xmlfragment(this.getView().getId(), "sh.bz.common.fragment.CLBX_DIALOG_Glsqd", this.getView().getController());

				this.getView().addDependent(this._oGLSQDDialog);
			}
			var spath;
			//this.getView().getModel()

			spath = "/FysqSet";
			//?$filter=PernrS eq '20003431'

			this._oGLSQDDialog.bindElement({
				change: this._onBindingChange.bind(this),
				path: spath,
				events: {
					dataRequested: function() {

					},
					dataReceived: function() {

					}
				}
			});
			this._oGLSQDDialog.setModel(this.getView().getModel());
			this._oGLSQDDialog.open();
			// this.getView().getModel().attachRequestCompleted(function (oEvent) {
			var sdata = this.getView().byId("Panel_h").getBindingContext().getProperty();
			var PernrS = sdata.PernrB;
			// var sEtkd = sdata.Etkd;
			// spernrs = "20003431";
			// sEtkd = "EX01";
			var oFilter1 = new sap.ui.model.Filter("PernrS", sap.ui.model.FilterOperator.EQ, PernrS);
			// var oFilter2 = new sap.ui.model.Filter("Etkd", sap.ui.model.FilterOperator.EQ, sEtkd);

			var ofilterall = [];
			ofilterall.push(oFilter1);
			// ofilterall.push(oFilter2);
			var otable = this.byId("table_sq");
			var allitems = otable.getItems();
			//去掉已经选择的借款单号
			for (var i = 0; i < allitems.length; i++) {
				ofilterall.push(new sap.ui.model.Filter("Recode", sap.ui.model.FilterOperator.NE, allitems[i].getBindingContext().getProperty().Recode));
			};

			this.byId("CLBX_dialogtable_sq").getBinding("items").filter(ofilterall);
			//});

		},
		onDialogBackGL: function() {
			this._oGLSQDDialog.close();

			//that._oView.getController().callbackConfirm();
		},
		onDialogBackFp: function() {
			this._oFpDialog.close();

			//that._oView.getController().callbackConfirm();
		},
		onDialogBackHx: function() {
			this._oHxDialog.close();

			//that._oView.getController().callbackConfirm();
		},
		onDialogSaveGL: function(oEvent) {
			var oseltable = this.getView().byId("CLBX_dialogtable_sq");
			var oselcontext = oseltable.getSelectedContexts();
			// var otable = this.getView().byId("table_sq");
			// var otable_item_clone = oselcontext[0];
			// otable.addItem(otable_item_clone);
			for (var i = 0; i < oselcontext.length; i++) {
				var otable = this.getView().byId("table_sq");
				this.byId("table_sq").destroyItems();
				var otable_item_clone = this.getView().byId("table_item_sq").clone();
				otable_item_clone.setBindingContext(oselcontext[i]);
				otable.addItem(otable_item_clone);
			}
			this.onDialogBackGL();
		},

		_onBindingChange: function() {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			var oFilter = new sap.ui.model.Filter("PernrS", sap.ui.model.FilterOperator.EQ, '20003431');
			this.byId("CLBX_dialogtable_sq").getBinding("items").filter([oFilter]);

		},
		onHx: function() {
			//this.getRouter().navTo("Hx");
			//this.getRouter().navTo("Glsqd");
			var that = this;
			this._oHxDialog = this.getView().byId("CLBX_dialog_hx");
			if (!this._oHxDialog) {
				this._oHxDialog = sap.ui.xmlfragment(this.getView().getId(), "sh.bz.common.fragment.CLBX_DIALOG_Hx", this.getView().getController());

				this.getView().addDependent(this._oHxDialog);
			}
			var spath;
			//this.getView().getModel()

			spath = "/HxSet";
			//?$filter=PernrS eq '20003431'

			this._oHxDialog.bindElement({
				//change: this._onBindingChange.bind(this),
				path: spath,
				events: {
					dataRequested: function() {

					},
					dataReceived: function() {

					}
				}
			});
			this._oHxDialog.setModel(this.getView().getModel());
			this._oHxDialog.open();
			var sdata = this.getView().byId("Panel_h").getBindingContext().getProperty();
			var sPernrJ = sdata.PernrB;
			//sPernrJ = "10001099";
			var oFilter1 = new sap.ui.model.Filter("PernrJ", sap.ui.model.FilterOperator.EQ, sPernrJ);

			var ofilterall = [];
			ofilterall.push(oFilter1);
			var otable = this.byId("table_hx");
			var allitems = otable.getItems();

			for (var i = 0; i < allitems.length; i++) {
				ofilterall.push(new sap.ui.model.Filter("Jkdh", sap.ui.model.FilterOperator.NE, allitems[i].getBindingContext().getProperty().Jkdh));
			}
			this.byId("CLBX_dialogtable_hx").getBinding("items").filter(ofilterall);
		},
		onFp: function() {
			//this.getRouter().navTo("Fp");
			//this.getRouter().navTo("Hx");
			//this.getRouter().navTo("Glsqd");
			var that = this;
			this._oFpDialog = this.getView().byId("CLBX_Dialog_Fp");
			if (!this._oFpDialog) {
				this._oFpDialog = sap.ui.xmlfragment(this.getView().getId(), "sh.bz.common.fragment.CLBX_DIALOG_Fp", this.getView().getController());

				this.getView().addDependent(this._oFpDialog);

			}
			var spath;
			//this.getView().getModel()

			spath = "/FysqSet";
			//spath = "/FysqSet";
			//?$filter=PernrS eq '20003431'
			//spath = "/FPLISTSet?$filter=Userid eq ' " +  + "'";
			//spath = "/FPLISTSet?$filter=Userid eq 'ZZLIYJ'";
			//spath = "/FPLISTSet";
			spath = "/ZzspSet";

			this._oFpDialog.bindElement({
				//change: this._onBindingChange.bind(this),
				path: spath,
				events: {
					dataRequested: function() {

					},
					dataReceived: function() {

					}
				}
			});
			//this._oFpDialog.setModel(this.getView().getModel());
			this._oFpDialog.open();
			var sdata = this.getView().byId("Panel_h").getBindingContext().getProperty();
			var UsridS = sdata.UsridS;
			// var loc = location.href.toLowerCase();
			// if (loc.indexOf("fiorilaunchpad.html") > 0) {
			// 	this.getOwnerComponent()._userid = sap.ushell.Container.getService("UserInfo").getId();
			// } else {
			// 	this.getOwnerComponent()._userid = "ZZLIYJ";
			// }
			var oFilter1 = new sap.ui.model.Filter("Crby", sap.ui.model.FilterOperator.EQ, UsridS);
			//this.byId("CLBX_dialogtable_fp").getBinding("items").filter([oFilter1]);

			var ofilterall = [];
			ofilterall.push(oFilter1);
			var otable = this.byId("table_fp");
			var allitems = otable.getItems();

			for (var i = 0; i < allitems.length; i++) {
				ofilterall.push(new sap.ui.model.Filter("Invoiceid", sap.ui.model.FilterOperator.NE, allitems[i].getBindingContext().getProperty()
					.Invoiceid));
			};

			this.byId("CLBX_dialogtable_fp").getBinding("items").filter(ofilterall);

		},
		onDialogSaveHx: function(oEvent) {

			var oseltable = this.getView().byId("CLBX_dialogtable_hx");
			var oselcontext = oseltable.getSelectedContexts();
			//this.getView().byId("table_hx").destroyItems();
			for (var i = 0; i < oselcontext.length; i++) {
				var otable = this.getView().byId("table_hx");
				var otable_item_clone = this.getView().byId("table_item_hx").clone();
				otable_item_clone.setBindingContext(oselcontext[i]);
				otable_item_clone.getBindingContext().getProperty().Bchxje = null;
				otable.addItem(otable_item_clone);

				//add
				this.getView().getModel().setProperty("Hxdjh", "", oselcontext[i], true);
			}
			this.onDialogBackHx();
			//this.doHxRowNumber();
		},
		onDialogSaveFp: function(oEvent) {

			var oseltable = this.getView().byId("CLBX_dialogtable_fp");
			var oselcontext = oseltable.getSelectedContexts();

			var bhsje;
			var se;
			var hsje;
			bhsje = this.getView().getModel("fphjmodel").getProperty("/bhxje", bhsje);
			se = this.getView().getModel("fphjmodel").getProperty("/bhxse", se);
			hsje = this.getView().getModel("fphjmodel").getProperty("/hsje", hsje);
			//this.getView().byId("table_fp").destroyItems();
			for (var i = 0; i < oselcontext.length; i++) {
				var otable = this.getView().byId("table_fp");
				var otable_item_clone = this.getView().byId("table_item_fp").clone();
				otable_item_clone.setBindingContext(oselcontext[i]);
				otable.addItem(otable_item_clone);
				//add
				//this.getView().getModel().setProperty("fplist", "", oselcontext[i], true);
				//计算发票金额 
				var itembhsje = 0;
				var itemse = 0;
				var itemhsje = 0;
				if (otable_item_clone.getBindingContext().getProperty().Awotax !== undefined) {
					itembhsje = otable_item_clone.getBindingContext().getProperty().Awotax;
				}
				bhsje = parseFloat(bhsje) + parseFloat(itembhsje);

				if (otable_item_clone.getBindingContext().getProperty().Taxamount !== undefined) {
					itemse = otable_item_clone.getBindingContext().getProperty().Taxamount;
				}
				se = parseFloat(se) + parseFloat(itemse);
				if (otable_item_clone.getBindingContext().getProperty().Awtax !== undefined) {
					itemhsje = otable_item_clone.getBindingContext().getProperty().Awtax;
				}
				hsje = parseFloat(hsje) + parseFloat(itemhsje);

			};
			var bhsje = Formatter.FloatFormat(bhsje);
			var se = Formatter.FloatFormat(se);
			var hsje = Formatter.FloatFormat(hsje);
			this.getView().getModel("fphjmodel").setProperty("/bhxje", bhsje)
			this.getView().getModel("fphjmodel").setProperty("/bhxse", se);
			this.getView().getModel("fphjmodel").setProperty("/hsje", hsje);

			this.onDialogBackFp();

		},
		onDeleteHx: function(oEvent) {

			var oselcontext = this.byId("table_hx").getSelectedItems();
			for (var i = 0; i < oselcontext.length; i++) {
				this.byId("table_hx").removeItem(oselcontext[i]);
				if (oselcontext[i].getBindingContext().getProperty().Bxdh === "" ||
					oselcontext[i].getBindingContext().getProperty().Bxdh === undefined) {
					this.getView().getModel().deleteCreatedEntry(oselcontext[i].getBindingContext());
				} else {
					var wa = {
						path: oselcontext[i].getBindingContext().getPath()
					};
					if (this._deleteHxdata === undefined) {
						this._deleteHxdata = [];
						this._deleteHxdata.splice(0, 0, wa);
					} else {
						this._deleteHxdata.splice(0, 0, wa);
					}
				}
			}
			this.changeBchxje();
		},
		onDeleteGL: function(oEvent) {
			//deal delete 
			//这个直接在后台控制,select出之前的申请单,然后取消关联标志,然后把新的放进去 前台不处理
			// var allitems_glsqd = this.getView().byId("table_sq").getItems();
			// if (allitems_glsqd[0] !== undefined) {
			// 	var Sitemdata_glsqd = allitems_glsqd[0].getBindingContext().getProperty();
			// 	SHeader.Bxsqd = Sitemdata_glsqd.Recode;
			// } else {
			// 	SHeader.Bxsqd = "";
			// };

			this.byId("table_sq").destroyItems();

		},
		onDeleteFp: function(oEvent) {
			debugger;
			var oselcontext = this.byId("table_fp").getSelectedItems();
			for (var i = 0; i < oselcontext.length; i++) {
				//处理发票金额 s
				var bhsje;
				var se;
				var hsje;
				bhsje = this.getView().getModel("fphjmodel").getProperty("/bhxje", bhsje);
				se = this.getView().getModel("fphjmodel").getProperty("/bhxse", se);
				hsje = this.getView().getModel("fphjmodel").getProperty("/hsje", hsje);

				if (oselcontext[i].getBindingContext().getProperty().Awotax !== undefined) {
					var itembhsje = oselcontext[i].getBindingContext().getProperty().Awotax;
				}
				bhsje = parseFloat(bhsje) - parseFloat(itembhsje);

				if (oselcontext[i].getBindingContext().getProperty().Taxamount !== undefined) {
					var itemse = oselcontext[i].getBindingContext().getProperty().Taxamount;
				}
				se = parseFloat(se) - parseFloat(itemse);
				if (oselcontext[i].getBindingContext().getProperty().Awtax !== undefined) {
					var itemhsje = oselcontext[i].getBindingContext().getProperty().Awtax;
				}
				hsje = parseFloat(hsje) - parseFloat(itemhsje);
				//处理发票金额 e

				this.byId("table_fp").removeItem(oselcontext[i]);
				if (oselcontext[i].getBindingContext().getProperty().Recode === "" ||
					oselcontext[i].getBindingContext().getProperty().Recode === undefined) {
					this.getView().getModel().deleteCreatedEntry(oselcontext[i].getBindingContext());
				} else {
					var wa = {
						path: oselcontext[i].getBindingContext().getPath()
					};
					if (this._deleteFpdata === undefined) {
						this._deleteFpdata = [];
						this._deleteFpdata.splice(0, 0, wa);
					} else {
						this._deleteFpdata.splice(0, 0, wa);
					};

				};
			};
			//处理发票金额 s
			var bhsje = Formatter.FloatFormat(bhsje);
			var se = Formatter.FloatFormat(se);
			var hsje = Formatter.FloatFormat(hsje);
			this.getView().getModel("fphjmodel").setProperty("/bhxje", bhsje);
			this.getView().getModel("fphjmodel").setProperty("/bhxse", se);
			this.getView().getModel("fphjmodel").setProperty("/hsje", hsje);
			//处理发票金额 e
		},

		//小数点
		onTwoAmountsum: function(oEvent) {
			var value = oEvent.getSource().getValue();
			var path = this.getView().byId("Panel_h").getBindingContext().getPath() + "/";
			var sum = Formatter.FloatFormat(value);
			//this.getView().getModel().setProperty(path + "Amountsum", sum);
			oEvent.getSource().setValue(sum);
		},

		onDeleteXX: function(oEvent) {

			var oselcontext = this.byId("CLBX_CLXX_table").getSelectedItems();
			for (var i = 0; i < oselcontext.length; i++) {
				this.byId("CLBX_CLXX_table").removeItem(oselcontext[i]);
				if (oselcontext[i].getBindingContext().getProperty().Recode === "" ||
					oselcontext[i].getBindingContext().getProperty().Recode === undefined) {
					this.getView().getModel().deleteCreatedEntry(oselcontext[i].getBindingContext());
				} else {
					var wa = {
						path: oselcontext[i].getBindingContext().getPath()
					};
					if (this._deleteXXdata === undefined) {
						this._deleteXXdata = [];
						this._deleteXXdata.splice(0, 0, wa);
					} else {
						this._deleteXXdata.splice(0, 0, wa);
					}
				}
			}

			//计算报销金额 Bchxje
			this.changeBxje();
		},

		onCancelCheckName: function(oEvent) {
			var model = [];
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_CHECK");
			this.oDialogCheckName.close();
		},

		onDeleteItem: function(oEvent) {
			//读取选中的行的下标（数组）
			var contexts = this.getView().byId("JKD_IP_table_file").getSelectedContexts();
			//读取选中的行的内容（数组）
			var items = contexts.map(function(c) {
				return c.getObject();
			});
			var items_Length = items.length;
			Util.debug(JSON.stringify(items));

			//从后台删除选中的数据 TODO
			for (var i = 0; i < items_Length; i++) {
				//Util.showInfo("文件 " + items[i].Filename + " removed");
			}

			//从原始的数组 删除 选中的数组
			var data = this.getView().getModel("model_file").getData().Item;
			for (var i = 0; i < items.length; i++) {
				for (var j = 0; j < data.length; j++) {
					if (data[j] == items[i]) {
						data.splice(j, 1);
						j = j - 1;
					}
				}
			};

			//更新显示
			var model = {
				Item: data
			};
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_file");
		},

		saveallorder: function(oEvent) {
			//保存时候的录入数据校验
			var objs = [{
				idStr: "IP_PERNR_B", //报销人
				validNull: true
			}, {
				idStr: "IP_PRCTR", //利润中心
				validNull: true
			}, {
				idStr: "IP_TELNUM", //联系方式
				validNull: true,
				reg: reg_PHONE, //验证手机号
				msg: "需输入有效手机号"
			}, {
				idStr: "IP_ACCOUNTNAME", //户名
				validNull: true
			}, {
				idStr: "IP_FJZS", //附件张数
				validNull: true,
				reg: reg_NO, //验证数字
				msg: "需输入有效数字"
			}, {
				idStr: "IP_FJZS", //附件张数
				validNull: true,
				reg: /^(0|([1-9]\d{0,2}))$/, //验证数字
				msg: "需输入有效数字，最多999张附件"
			}, {
				idStr: "IP_BANKA", //收款银行
				validNull: true
			}, {
				idStr: "IP_NOTE", //出差事由
				validNull: true
			}, {
				idStr: "IP_BANKN", //收款账号
				validNull: true,
				reg: reg_BankNO, //验证18位数字
				msg: "需输入有效收款账号(最多18位数字)"
			}, {
				idStr: "IP_WRBTR", //报销金额
				validNull: true
			}, {
				idStr: "IP_ZLSCH", //付款方式
				validNull: true
			}, {
				idStr: "IP_ETNAME", //费用类型
				validNull: true
			}, {
				idStr: "IP_Orgeh", //报销人部门
				validNull: true
			}];
			if (this.validForm(oEvent, this, objs))
				return;

			var view = this.getView();
			var ipWrbtr = view.byId("IP_WRBTR").getValue();
			var ipBchxje = view.byId("IP_BCHXJE").getValue();

			if (parseFloat(ipWrbtr) <= 0) {
				Util.showError("请新增费用明细");
				return;
			}
			
			var valAllitems = this.getView().byId("CLBX_CLXX_table").getItems();
			var aufnr = [];
			for (var i = 0; i < valAllitems.length; i++) {
				var Sitemdata = valAllitems[i].getBindingContext().getProperty();
				if (Sitemdata && Sitemdata.Aufnr) {
					if (aufnr.length > 0) {
						if (aufnr[0] !== Sitemdata.Aufnr) {
							Util.showError("费用明细行信息中订单不一致");
							return;
						}
					}
					aufnr.push(Sitemdata.Aufnr);
				}
			}
			
			if (parseFloat(ipWrbtr) < parseFloat(ipBchxje)) {
				Util.showError("核销金额超出报销金额");
				return;
			}
			var table_hx = view.byId("table_hx").getItems();
			if (table_hx.length > 0) {
				for (var i = 0; i < table_hx.length; i++) {
					var t = parseFloat(table_hx[i].getBindingContext().getProperty().Bchxje);
					if (!t || t === 0) {
						Util.showError("请填写核销借款行核销金额");
						return;
					}
				}
			}
			var table_sq = view.byId("table_sq").getItems();
			if (table_sq.length > 0) {
				for (var i = 0; i < table_sq.length; i++) {
					var t = parseFloat(table_sq[i].getBindingContext().getProperty().Amountsum);
					if (parseFloat(ipWrbtr) > parseFloat(table_sq[i].getBindingContext().getProperty().Amountsum)) {
						Util.showError("报销金额超出申请金额,请检查 “差旅信息” 或 “关联申请单”");
						return;
					}
				}
			}
			// var inputss = [
			// 	view.byId("IP_WRBTR"), //出差事由
			// 	view.byId("Bchxje"), //报销金额
			// ];
			// if (!this.inputCheck(inputss)) {
			// 	//Util.showError("需输入必填字段");
			// 	Util.debug("需输入必填字段");
			// 	return;
			// }
			//return;
			// this.setBusy(true);
			var SHeader = this.getView().byId("Panel_h").getBindingContext().getProperty();
			var sheaderpath = this.getView().byId("Panel_h").getBindingContext().getPath();

			// if (sap.ushell != null)
			// 	userid = sap.ushell.Container.getService("UserInfo").getId(); //in Fiori FLP
			// else
			// 	var userid = "ZZLIYJ"; //in SAP WebIDE test environment
			var saveSuccess = false;
			var that = this;
			var Recode = SHeader.Recode;
			if (Recode !== "") {
				// var sdealPath = "/HEADERSAVESet('" + Recode + "')";
				// var oEntry = this.getView().getBindingContext().getProperty();
				// //delete oEntry.Uzeitcr;
				// //console.log(oEntry);
				// this.getView().getModel().update(sdealPath, oEntry, {
				// 	merge: true,
				// 	success: function(oData, oResponse) {
				// 		//Util.showInfo("保存成功");
				// 		// that.getView().byId("view_Edit_save").setEnabled(true);
				// 		// that.getView().byId("view_Edit_submit").setEnabled(true);
				// 	},
				// 	error: function(error) {
				// 		//Util.showError("保存失败!");
				// 		// that.getView().byId("view_Edit_save").setEnabled(true);
				// 		// that.getView().byId("view_Edit_submit").setEnabled(true);
				// 	},
				// 	async: false
				// });
				this.updateall();
			} else {
				//有问题 禁用
				// this.getView().getModel().submitChanges({
				// 	success: function(oData) {
				// 		console.log("submit change success:" + oData);
				// 		var recode = oData.__batchResponses[0].__changeResponses[0].data.Recode;
				// 		that.getView().getModel().setProperty(sheaderpath + "/Recode", recode);
				// 	},
				// 	error: function(oData) {
				// 		console.log("submit change failed:" + oData);
				// 	}
				// });
				// return;

				//var date = new Date();
				//var Recode = that.getRecode(that);
				// var adata = that.getView().getBindingContext().getProperty(path + "/" + "Redate");
				//this.getView().getModel().setDeferredBatchGroups(["grpCRT"]);
				var sdealPath = "/Clbx_headerSet";
				// console.log(this.getView().byId("Panel_h").getBindingContext().getProperty());
				that.getView().getModel().setProperty(sheaderpath + "/Spzt", "A");
				that.getView().getModel().setProperty(sheaderpath + "/Spztms", "起草");
				var data = that.getView().getModel("GLOBLEDATA").oData.DKKD;
				if (data === "BX") {
					that.getView().getModel().setProperty(sheaderpath + "/Dkkd", "BX");
				} else {
					that.getView().getModel().setProperty(sheaderpath + "/Dkkd", "CL");
				}
				// SHeader.Spzt = "A";
				// SHeader.Spztms = "起草";
				// SHeader.Dkkd = "CL";
				var SHeader = this.getView().byId("Panel_h").getBindingContext().getProperty();
				delete SHeader.Ktext;
				delete SHeader.Butxt;
				delete SHeader.PernrS;
				delete SHeader.Etnm;
				delete SHeader.PrctrKtext;
				delete SHeader.OrgehText;
				// delete SHeader.ZlschText;
				var allitems_glsqd = this.getView().byId("table_sq").getItems();
				if (allitems_glsqd[0] !== undefined) {
					var Sitemdata_glsqd = allitems_glsqd[0].getBindingContext().getProperty();
					SHeader.Bxsqd = Sitemdata_glsqd.Recode;
				} else {
					SHeader.Bxsqd = "";
				};

				console.log(this.getView().byId("Panel_h").getBindingContext().getProperty());
				this.getView().getModel().create(sdealPath, SHeader, {
					success: function(oData, oResponse) {
						debugger;
						that.getView().getModel().setProperty(sheaderpath + "/Recode", oData.Recode);
						Util.showInfo("保存成功");
						that.setscreen("A");
						if (that.getView().byId("view_Edit_save") === undefined) {
							var data = that.getView().getModel("model_edit");
							data.button_save_enabled = true;
							data.button_submit_enabled = true;
							that.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");
						} else {
							// that.getView().byId("view_Edit_save").setEnabled(true);
							// that.getView().byId("view_Edit_submit").setEnabled(true);
						}
						that.setBusy(false);
					},
					error: function(error) {
						debugger;
						//that.setBusy(false);
					},
					async: false,
					groupId: "grpCRT"
				});
				SHeader = this.getView().byId("Panel_h").getBindingContext().getProperty();
				var allitems = this.getView().byId("CLBX_CLXX_table").getItems();
				// var itempath = this.getView().byId("CLBX_CLXX_table").getBindingContext().getPath();
				var Sitem = [];
				for (var i = 0; i < allitems.length; i++) {
					var Sitemdata = allitems[i].getBindingContext().getProperty();
					Sitemdata.Recode = SHeader.Recode;
					// Sitemdata.Kostl = SHeader.Kostl; //公司
					Sitemdata.Pjzs = parseInt(Sitemdata.Pjzs);
					if (!Sitemdata.Cfrq) {
						Sitemdata.Cfrq = null;
					} else {
						Sitemdata.Cfrq.setHours(8);
						Sitemdata.Cfrq = new Date(Sitemdata.Cfrq);
					};
					if (!Sitemdata.Ddrq) {
						Sitemdata.Cfrq = null;
					} else {
						Sitemdata.Ddrq.setHours(8);
						Sitemdata.Ddrq = new Date(Sitemdata.Ddrq);
					};

					// Sitem.push(Sitemdata);
					delete Sitemdata.Ktext;
					delete Sitemdata.Aufnr_Ktext;
					delete Sitemdata.Mwskz_Text1;
					delete Sitemdata.Vektp_Veknm;
					delete Sitemdata.Zzdqlbms;
					delete Sitemdata.Vektp_Veknm;
					delete Sitemdata.Sps_Spsdsc;
					delete Sitemdata.Ctkd_Ctnm;
					delete Sitemdata.Fkber_Fkbtx;
					delete Sitemdata.Zzch_Zzchms;
					delete Sitemdata.Zzcx_Zzcxms;
					delete Sitemdata.Zzfxcb_Zzfxcbms;
					delete Sitemdata.Zzfzhs01_Zzfzhs01ms;
					delete Sitemdata.Zzfzhs02_Zzfzhs02ms;
					delete Sitemdata.Zzfzhs03_Zzfzhs03ms;
					delete Sitemdata.Zzfzhs04_Zzfzhs04ms;
					delete Sitemdata.Zzfzhs05_Zzfzhs05ms;
					delete Sitemdata.Zzfzhslb_Zzfzhslbms;
					delete Sitemdata.Zzfzhsnr_Zzfzhsnrms;
					delete Sitemdata.Zzghjh_Zzghjhms;
					delete Sitemdata.Zzhtbh_Zzhtbhms;
					delete Sitemdata.Zzjshkdw_Zzjshkdwms;
					// if(Sitemdata.Sfzp === undefined){
					// 	that.getView().getModel().setProperty(itempath + "/Sfzp", "X");
					//      //Sitemdata.Sfzp = "X";
					// }
					if (Sitemdata.Mwskz === "") {
						Sitemdata.Mwskz = "0";
					};
					if (Sitemdata.Netpr === "") {
						Sitemdata.Netpr = "0";
					}
					if (Sitemdata.Wmwst === "") {
						Sitemdata.Wmwst = "0";
					}
					Sitemdata.Posnr = String(i + 1);
					//Sitemdata.Pjzs = String(Sitemdata.Pjzs);
					Sitemdata.Pjzs = parseInt(Sitemdata.Pjzs);
					console.log(Sitemdata);
					sdealPath = "/Clbx_itemSet";
					that._clxxupdatefinish = ""; //this 同步出现
					this.getView().getModel().create(sdealPath, Sitemdata, {
						success: function(oData, oResponse) {

							if (that._clxxupdatefinish == "") {
								for (var i = 0; i < allitems.length; i++) {
									that.getView().getModel().setProperty(allitems[i].getBindingContext().getPath() + "/Recode", oData.Recode);
								}
								that._clxxupdatefinish == "X";
							};

						},
						error: function(error) {

							//Util.showError("submit update failed:" + error);
						},
						groupId: "grpCRT"
					});

				};
				//start sqd
				SHeader = this.getView().byId("Panel_h").getBindingContext().getProperty();
				var allitemssq = this.getView().byId("table_sq").getItems();
				var Sitemfp = [];
				for (var i = 0; i < allitemssq.length; i++) {
					var Sitemsqdata = allitemssq[i].getBindingContext().getProperty();
					sdealPath = "/FysqSet";
					//that._clhxupdatefinish = ""; //this 同步出现
					// console.log(Sitemsqdata)
					this.getView().getModel().create(sdealPath, Sitemsqdata, {
						success: function(oData, oResponse) {

							if (that._clfpupdatefinish === "") {
								for (var i = 0; i < allitemssq.length; i++) {
									that.getView().getModel().setProperty(allitemssq[i].getBindingContext().getPath() + "/Recode", oData.Recode);
								}
								that._clfpupdatefinish = "X";
							};

						},
						error: function(error) {

							//Util.showError("submit update failed:" + error);
						},
						groupId: "grpCRT"
					});

				};
				//end  sqd
				SHeader = this.getView().byId("Panel_h").getBindingContext().getProperty();
				var allitemshx = this.getView().byId("table_hx").getItems();
				var Sitemhx = [];
				for (var i = 0; i < allitemshx.length; i++) {
					var Sitemhxdata = allitemshx[i].getBindingContext().getProperty();
					Sitemhxdata.Bxdh = SHeader.Recode;
					//Sitemhxdata.Bchxje = "1";

					// Sitemhxdata.Pjzs = parseInt(Sitemhxdata.Pjzs);
					// Sitemhxdata.Cfrq = new Date(Sitemhxdata.Cfrq);
					// Sitemhxdata.Ddrq = new Date(Sitemhxdata.Ddrq);
					// Sitem.push(Sitemdata);

					sdealPath = "/HxSet";
					//that._clhxupdatefinish = ""; //this 同步出现

					this.getView().getModel().create(sdealPath, Sitemhxdata, {
						success: function(oData, oResponse) {

							//if (that._clhxupdatefinish == "") {
							for (var i = 0; i < allitemshx.length; i++) {
								if (allitemshx[i].getBindingContext().getProperty().Jkdh == oData.Jkdh) {
									that.getView().getModel().setProperty(allitemshx[i].getBindingContext().getPath() + "/Hxdjh", oData.Hxdjh);
									that.getView().getModel().setProperty(allitemshx[i].getBindingContext().getPath() + "/Bxdh", oData.Bxdh);
								}
							}
							//that._clhxupdatefinish == "X";
							//};

						},
						error: function(error) {

							//Util.showError("submit update failed:" + error);
						},
						groupId: "grpCRT"
					});

				};

				SHeader = this.getView().byId("Panel_h").getBindingContext().getProperty();
				var allitemsfp = this.getView().byId("table_fp").getItems();
				var Sitemfp = [];
				for (var i = 0; i < allitemsfp.length; i++) {
					var Sitemfpdata = allitemsfp[i].getBindingContext().getProperty();
					//Sitemfpdata.Bxdh = SHeader.Recode;
					//Sitemhxdata.Bchxje = "1";

					// Sitemhxdata.Pjzs = parseInt(Sitemhxdata.Pjzs);
					// Sitemhxdata.Cfrq = new Date(Sitemhxdata.Cfrq);
					// Sitemhxdata.Ddrq = new Date(Sitemhxdata.Ddrq);
					// Sitem.push(Sitemdata);

					sdealPath = "/ZzspSet";
					that._clfpupdatefinish = ""; //this 同步出现

					this.getView().getModel().create(sdealPath, Sitemfpdata, {
						success: function(oData, oResponse) {

							if (that._clfpupdatefinish === "") {
								for (var i = 0; i < allitemsfp.length; i++) {
									that.getView().getModel().setProperty(allitemsfp[i].getBindingContext().getPath() + "/Recode", oData.Recode);
								}
								that._clfpupdatefinish = "X";
							};

						},
						error: function(error) {

							//Util.showError("submit update failed:" + error);
						},
						groupId: "grpCRT"
					});

				};

				//有问题 禁用
				// this.getView().getModel().submitChanges({
				// 	batchGroupId: "grpCRT",
				// 	success: function(oData) {
				// 		console.log("submit change success:" + oData);
				// 		var recode = oData.__batchResponses[0].__changeResponses[0].data.Recode;
				// 		that.getView().getModel().setProperty(sheaderpath + "/Recode", recode);
				// 	},
				// 	error: function(oData) {
				// 		console.log("submit change failed:" + oData);
				// 	}
				// });
			}
		},
		updateall: function() {
			debugger;
			// this.setBusy(true);
			var SHeader = this.getView().byId("Panel_h").getBindingContext().getProperty();
			var sheaderpath = this.getView().byId("Panel_h").getBindingContext().getPath();

			var that = this;
			var Recode = SHeader.Recode;

			//优先处理删除
			if (this._deleteHxdata !== undefined) {
				for (var i = 0; i < this._deleteHxdata.length; i++) {

					var sdata1 = this.getView().getModel().getProperty(this._deleteHxdata[i].path);
					var sdealPath1 = "/HxSet(Hxdjh='" + sdata1.Hxdjh + "')";
					this.getView().getModel().remove(sdealPath1, {
						//merge: false,
						success: function(oData, oResponse) {
							debugger;
							that._deleteHxdata = [];
						},
						error: function(error) {
							debugger;
						},
						groupId: "grpCRT"
					});
				};
			};

			if (this._deleteFpdata !== undefined) {
				for (var i = 0; i < this._deleteFpdata.length; i++) {
					var sdata2 = this.getView().getModel().getProperty(this._deleteFpdata[i].path);
					var sdealPath2 = "/ZzspSet(Invoiceid='" + sdata2.Invoiceid + "')";
					this.getView().getModel().remove(sdealPath2, {
						success: function(oData, oResponse) {
							debugger;
							that._deleteFpdata = [];
						},
						error: function(error) {
							debugger;
						},
						groupId: "grpCRT"
					});
				};
			};

			if (this._deleteXXdata !== undefined) {
				for (var i = 0; i < this._deleteXXdata.length; i++) {
					var sdata3 = this.getView().getModel().getProperty(this._deleteXXdata[i].path);
					var sdealPath3 = "/Clbx_itemSet(Recode='" + sdata3.Recode + "',Posnr='" + sdata3.Posnr + "')";
					this.getView().getModel().remove(sdealPath3, {
						success: function(oData, oResponse) {
							debugger;
							that._deleteXXdata = [];
						},
						error: function(error) {
							debugger;
						},
						groupId: "grpCRT"
					});
				};
			};

			var sdealPath = "/Clbx_headerSet('" + Recode + "')";
			// SHeader.Spzt = "A";
			// SHeader.Spztms = "起草";
			// SHeader.Dkkd = "CL";
			//console.log(this.getView().byId("Panel_h").getBindingContext().getProperty());
			delete SHeader.Ktext;
			delete SHeader.Butxt;
			delete SHeader.PernrS;
			delete SHeader.Etnm;
			delete SHeader.PrctrKtext;
			delete SHeader.OrgehText;
			var allitems_glsqd = this.getView().byId("table_sq").getItems();
			if (allitems_glsqd[0] !== undefined) {
				var Sitemdata_glsqd = allitems_glsqd[0].getBindingContext().getProperty();
				SHeader.Bxsqd = Sitemdata_glsqd.Recode;
			} else {
				SHeader.Bxsqd = "";
			};
			//console.log(this.getView().byId("Panel_h").getBindingContext().getProperty());

			this.getView().getModel().update(sdealPath, SHeader, {
				merge: true,
				success: function(oData, oResponse) {

					// that.getView().getModel().setProperty(sheaderpath + "/Recode", oData.Recode);
					Util.showInfo("保存成功");
					that.setscreen("A");
					that.setBusy(false);
				},
				error: function(error) {

					that.setBusy(false);
				},
				groupId: "grpCRT"
			});

			SHeader = this.getView().byId("Panel_h").getBindingContext().getProperty();
			var allitems = this.getView().byId("CLBX_CLXX_table").getItems();
			var Sitem = [];
			for (var i = 0; i < allitems.length; i++) {
				var Sitemdata = allitems[i].getBindingContext().getProperty();
				Sitemdata.Kostl = SHeader.Kostl; //公司
				// Sitemdata.Pjzs = parseInt(Sitemdata.Pjzs);
				Sitemdata.Pjzs = parseInt(Sitemdata.Pjzs);
				if (!Sitemdata.Cfrq) {
					Sitemdata.Cfrq = null;
				} else {
					Sitemdata.Cfrq.setHours(8);
					Sitemdata.Cfrq = new Date(Sitemdata.Cfrq);
				};
				if (!Sitemdata.Ddrq) {
					Sitemdata.Ddrq = null;
				} else {
					Sitemdata.Ddrq.setHours(8);
					Sitemdata.Ddrq = new Date(Sitemdata.Ddrq);
				};
				delete Sitemdata.Ktext;
				delete Sitemdata.Aufnr_Ktext;
				delete Sitemdata.Mwskz_Text1;
				delete Sitemdata.Vektp_Veknm;
				delete Sitemdata.Zzdqlbms;
				delete Sitemdata.Vektp_Veknm;
				delete Sitemdata.Sps_Spsdsc;
				delete Sitemdata.Ctkd_Ctnm;
				delete Sitemdata.Fkber_Fkbtx;
				delete Sitemdata.Zzch_Zzchms;
				delete Sitemdata.Zzcx_Zzcxms;
				delete Sitemdata.Zzfxcb_Zzfxcbms;
				delete Sitemdata.Zzfzhs04_Zzfzhs04ms;
				delete Sitemdata.Zzfzhslb_Zzfzhslbms;
				delete Sitemdata.Zzfzhsnr_Zzfzhsnrms;
				delete Sitemdata.Zzghjh_Zzghjhms;
				delete Sitemdata.Zzhtbh_Zzhtbhms;
				delete Sitemdata.Zzjshkdw_Zzjshkdwms;
				if (Sitemdata.Mwskz === "") {
					Sitemdata.Mwskz = "0";
				};
				if (Sitemdata.Netpr === "") {
					Sitemdata.Netpr = "0";
				}
				if (Sitemdata.Wmwst === "") {
					Sitemdata.Wmwst = "0";
				}
				debugger;
				Sitemdata.Posnr = String(i + 1);
				//Sitemdata.Pjzs = String(Sitemdata.Pjzs);
				Sitemdata.Pjzs = parseInt(Sitemdata.Pjzs);
				// Sitem.push(Sitemdata);
				if (Sitemdata.Recode === "" || Sitemdata.Recode === undefined) {
					Sitemdata.Recode = SHeader.Recode;
					sdealPath = "/Clbx_itemSet";
					that._clxxupdatefinish = ""; //this 同步出现

					this.getView().getModel().create(sdealPath, Sitemdata, {
						success: function(oData, oResponse) {

							if (that._clxxupdatefinish == "") {
								for (var i = 0; i < allitems.length; i++) {
									if (allitems[i].getBindingContext().getProperty().Recode === "" || allitems[i].getBindingContext().getProperty().Recode ===
										undefined) {
										that.getView().getModel().setProperty(allitems[i].getBindingContext().getPath() + "/Recode", oData.Recode);
									}
								}
								that._clxxupdatefinish == "X";
							};

						},
						error: function(error) {

							//Util.showError("submit update failed:" + error);
						},
						groupId: "grpCRT"
					});
				} else {

					sdealPath = "/Clbx_itemSet(Recode='" + SHeader.Recode + "',Posnr='" + Sitemdata.Posnr + "')";
					that._clxxupdatefinish = ""; //this 同步出现

					this.getView().getModel().update(sdealPath, Sitemdata, {
						merge: true,
						success: function(oData, oResponse) {

							// if (that._clxxupdatefinish == "") {
							// 	for (var i = 0; i < allitems.length; i++) {
							// 		that.getView().getModel().setProperty(allitems[i].getBindingContext().getPath() + "/Recode", oData.Recode);
							// 	}
							// 	that._clxxupdatefinish == "X";
							// };

						},
						error: function(error) {

							//Util.showError("submit update failed:" + error);
						},
						groupId: "grpCRT"
					});
				};

			};

			SHeader = this.getView().byId("Panel_h").getBindingContext().getProperty();
			var allitemshx = this.getView().byId("table_hx").getItems();
			var Sitemhx = [];
			for (var i = 0; i < allitemshx.length; i++) {
				var Sitemhxdata = allitemshx[i].getBindingContext().getProperty();
				if (Sitemhxdata.Bxdh === "" || Sitemhxdata.Bxdh === undefined) {
					Sitemhxdata.Bxdh = SHeader.Recode;
					//Sitemhxdata.Bchxje = "1";

					sdealPath = "/HxSet";
					//that._clhxupdatefinish = ""; //this 同步出现

					this.getView().getModel().create(sdealPath, Sitemhxdata, {
						success: function(oData, oResponse) {

							//if (that._clhxupdatefinish == "") {
							for (var i = 0; i < allitemshx.length; i++) {
								if (allitemshx[i].getBindingContext().getProperty().Jkdh == oData.Jkdh) {
									that.getView().getModel().setProperty(allitemshx[i].getBindingContext().getPath() + "/Hxdjh", oData.Hxdjh);
									that.getView().getModel().setProperty(allitemshx[i].getBindingContext().getPath() + "/Bxdh", oData.Bxdh);
								}
							}
							//that._clhxupdatefinish == "X";
							//};

						},
						error: function(error) {

							//Util.showError("submit update failed:" + error);
						},
						groupId: "grpCRT"
					});
				} else {
					Sitemhxdata.Bxdh = SHeader.Recode;
					//Sitemhxdata.Bchxje = "1";

					sdealPath = "/HxSet(Hxdjh='" + Sitemhxdata.Hxdjh + "')";

					this.getView().getModel().update(sdealPath, Sitemhxdata, {
						merge: true,
						success: function(oData, oResponse) {

							//if (that._clhxupdatefinish == "") {
							// for (var i = 0; i < allitemshx.length; i++) {
							// 	if (allitemshx[i].getBindingContext().getProperty().Jkdh == oData.Jkdh) {
							// 		that.getView().getModel().setProperty(allitemshx[i].getBindingContext().getPath() + "/Hxdjh", oData.Hxdjh);
							// 	}
							// }
							//that._clhxupdatefinish == "X";
							//};

						},
						error: function(error) {

							//Util.showError("submit update failed:" + error);
						},
						groupId: "grpCRT"
					});

				};

			};

			SHeader = this.getView().byId("Panel_h").getBindingContext().getProperty();
			var allitemsfp = this.getView().byId("table_fp").getItems();
			var Sitemfp = [];
			for (var i = 0; i < allitemsfp.length; i++) {
				var Sitemfpdata = allitemsfp[i].getBindingContext().getProperty();
				if (Sitemfpdata.Recode === "" || Sitemfpdata.Recode === undefined) {
					Sitemfpdata.Recode = SHeader.Recode;
					//Sitemhxdata.Bchxje = "1";

					sdealPath = "/ZzspSet";
					that._clfpupdatefinish = ""; //this 同步出现

					this.getView().getModel().create(sdealPath, Sitemfpdata, {
						success: function(oData, oResponse) {

							if (that._clfpupdatefinish == "") {
								for (var i = 0; i < allitemsfp.length; i++) {
									that.getView().getModel().setProperty(allitemshx[i].getBindingContext().getPath() + "/Recode", oData.Recode);

								}
								that._clfpupdatefinish = "X";
							};

						},
						error: function(error) {

							//Util.showError("submit update failed:" + error);
						},
						groupId: "grpCRT"
					});
				} else {
					Sitemfpdata.Recode = SHeader.Recode;
					//Sitemhxdata.Bchxje = "1";

					sdealPath = "/ZzspSet(Invoiceid='" + Sitemfpdata.Invoiceid + "')";

					this.getView().getModel().update(sdealPath, Sitemfpdata, {
						merge: true,
						success: function(oData, oResponse) {

							//if (that._clhxupdatefinish == "") {
							// for (var i = 0; i < allitemshx.length; i++) {
							// 	if (allitemshx[i].getBindingContext().getProperty().Jkdh == oData.Jkdh) {
							// 		that.getView().getModel().setProperty(allitemshx[i].getBindingContext().getPath() + "/Hxdjh", oData.Hxdjh);
							// 	}
							// }
							//that._clhxupdatefinish == "X";
							//};

						},
						error: function(error) {

							//Util.showError("submit update failed:" + error);
						},
						groupId: "grpCRT"
					});

				};

			};

		},
		submitorder: function(oEvent) {
			var that = this;
			if (this.getView().getModel("model_edit").oData.Lcid === undefined) {
				var SHeader = that.getView().byId("Panel_h").getBindingContext().getProperty();
				var allitems = this.getView().byId("CLBX_CLXX_table").getItems();
				var aufnr = [];
				for (var i = 0; i < allitems.length; i++) {
					var Sitemdata = allitems[i].getBindingContext().getProperty();
					if (Sitemdata.Aufnr !== undefined) {
						aufnr.push(Sitemdata.Aufnr);
						break;
					}
				}
				var Aufnr = aufnr.join("");
				var Bukrs = SHeader.Bukrs;
				if (SHeader.Dkkd === "CL") {
					var DKKD = "CL";
				} else {
					var DKKD = "BX";
				}
				var sPath = "/BETYPESet?$filter=( Bukrs eq '" + Bukrs + "' ) and ( Dkkd eq '" + DKKD + "' )";
				var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
				oDataModel.read(sPath, {
					success: function(oData, response) {
						var model = new sap.ui.model.json.JSONModel(oData).oData.results[0];
						var id = model.Lcid;
						var ZSlbm = model.Lcbm;
						// var path = that.getView().getBindingContext().getPath() + "/";
						var name = SHeader.SnameB; //申请人
						var e_business_code = SHeader.Recode; //单据编号
						var e_business_name = SHeader.Note; //费用申请说明
						var e_business_count = SHeader.Wrbtr; //申请金额
						var Orgeh = SHeader.Orgeh;
						if (sap.ushell != null)
							userid = sap.ushell.Container.getService("UserInfo").getId(); //in Fiori FLP
						else
							var userid = "ZZLIYJ"; //in SAP WebIDE test environment
						var sPaths = "/Clbx_headerSet('" + e_business_code + "')";
						var oDataModeld = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV/", true);
						oDataModeld.read(sPaths, {
							success: function(oData, response) {
								var model = new sap.ui.model.json.JSONModel(oData);
								if (model.oData.Slbm === "") {
									if (SHeader.Spzt === "R") {
										var obj = {};
										obj.id = id;
										obj.amountsum = e_business_count;
										obj.name = name;
										obj.business_code = e_business_code;
										obj.business_name = e_business_name;
										obj.userid = userid;
										obj.Orgeh = Orgeh;
										obj.Aufnr = Aufnr;
										var oEntry = {
											Zslbm: model.oData.Slbm,
											Zlcid: id,
											Zyhm: userid
										};
										UtilWorkFlow.clrestartflow(oEntry, that, obj);
									} else {
										var obj = {};
										obj.id = id;
										obj.amountsum = e_business_count;
										obj.name = name;
										obj.business_code = e_business_code;
										obj.business_name = e_business_name;
										obj.userid = userid;
										obj.Orgeh = Orgeh;
										obj.Aufnr = Aufnr;
										UtilWorkFlow.ys_submited(obj, that);
									}
								} else {
									if (SHeader.Spzt === "R") {
										var obj = {};
										obj.id = id;
										obj.amountsum = e_business_count;
										obj.name = name;
										obj.business_code = e_business_code;
										obj.business_name = e_business_name;
										obj.userid = userid;
										obj.Orgeh = Orgeh;
										obj.Aufnr = Aufnr;
										var oEntry = {
											Zslbm: model.oData.Slbm,
											Zlcid: id,
											Zyhm: userid
										};
										UtilWorkFlow.clrestartflow(oEntry, that, obj);
									} else {
										var obj = {
											amountsum: e_business_count,
											name: name,
											business_code: e_business_code,
											business_name: e_business_name,
											Zslbm: model.oData.Slbm,
											Zyhm: userid,
											Orgeh: Orgeh,
											Aufnr: Aufnr
										};
										UtilWorkFlow.Ys_subed(obj, that);
									}
								}
								// if(model.resu){}
								// console.log(model)
								//Util.debug(model);
							},
							error: function(oError) {
								// MessageToast.show("get RYBHSet error!");
							},
							async: false
						});
						// Util.debug(model);
					},
					error: function(oError) {
						Util.showError("get RECODESet error!");
					}
				});
			} else {
				var data = that.getView().getModel("model_edit").getData();
				var SHeader = that.getView().byId("Panel_h").getBindingContext().getProperty();

				var allitems = this.getView().byId("CLBX_CLXX_table").getItems();
				var aufnr = [];
				for (var i = 0; i < allitems.length; i++) {
					var Sitemdata = allitems[i].getBindingContext().getProperty();
					if (Sitemdata.Aufnr !== undefined) {
						aufnr.push(Sitemdata.Aufnr);
						break;
					}
				}
				var Aufnr = aufnr.join("");
				var id = data.Lcid; //流程id
				// console.log(data, SHeader);
				var name = SHeader.SnameB; //申请人
				var e_business_code = SHeader.Recode; //单据编号
				var e_business_name = SHeader.Note; //费用申请说明
				var e_business_count = SHeader.Wrbtr; //申请金额
				var Orgeh = SHeader.Orgeh;
				if (sap.ushell != null)
					userid = sap.ushell.Container.getService("UserInfo").getId(); //in Fiori FLP
				else
					var userid = "ZZLIYJ"; //in SAP WebIDE test environment
				var sPath = "/Clbx_headerSet('" + e_business_code + "')";
				var oDataModeld = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV/", true);
				oDataModeld.read(sPath, {
					success: function(oData, response) {
						var model = new sap.ui.model.json.JSONModel(oData);
						if (model.oData.Slbm === "") {
							var obj = {};
							obj.id = id;
							obj.amountsum = e_business_count;
							obj.name = name;
							obj.business_code = e_business_code;
							obj.business_name = e_business_name;
							obj.userid = userid;
							obj.Orgeh = Orgeh;
							obj.Aufnr = Aufnr;
							UtilWorkFlow.ys_submited(obj, that);
						} else {
							if (SHeader.Spzt === "R") {
								var obj = {
									amountsum: e_business_count,
									name: name,
									business_code: e_business_code,
									business_name: e_business_name,
									Zslbm: model.oData.Slbm,
									Aufnr: Aufnr,
									Zyhm: userid,
									Orgeh: Orgeh
								};
								var oEntry = {
									Zslbm: model.oData.Slbm,
									Zlcid: id,
									Zyhm: userid
								};
								UtilWorkFlow.clrestartflow(oEntry, that, obj);
							} else {
								var obj = {
									amountsum: e_business_count,
									name: name,
									business_code: e_business_code,
									business_name: e_business_name,
									Zslbm: model.oData.Slbm,
									Zyhm: userid,
									Orgeh: Orgeh,
									Aufnr: Aufnr
								};
								UtilWorkFlow.Ys_subed(obj, that);
							}
						}
						// if(model.resu){}
						// console.log(model)
						//Util.debug(model);
					},
					error: function(oError) {
						// MessageToast.show("get RYBHSet error!");
					},
					async: false
				});
			}

		},

		onConfirmCheckName: function(oEvent, that) {
			UtilWorkFlow.onConfirmCheckName(oEvent, this);
		},

		changeBchxje: function(oEvent) {
			var otable = this.byId("table_hx");
			var allitems = otable.getItems();
			if (allitems.length > 0 && (oEvent.getSource().getValue() <= 0 || !oEvent.getSource().getValue().match(reg_NO))) {
				Util.showError("核销金额请输入正数且最多可带两位小数");
				oEvent.getSource().setValue(null);
				return;
			}
			var path = this.getView().byId("Panel_h").getBindingContext().getPath() + "/";
			var sum = 0.00;
			var header = this.getView().byId("Panel_h").getBindingContext().getProperty();
			for (var i = 0; i < allitems.length; i++) {
				sum = parseFloat(sum) + parseFloat(allitems[i].getBindingContext().getProperty().Bchxje);
				if (oEvent) {
					var a = allitems[i].getBindingContext().getProperty().Bchxje;
					var b = allitems[i].getBindingContext().getProperty().Dmbtr;
					var c = allitems[i].getBindingContext().getProperty().Yhxje;
					if (a > b - c) {
						Util.showError("填写的核销金额超出限制，最多可核销金额:" + (b - c));
						oEvent.getSource().setValue(null);
						this.onTwoAmountsum(oEvent);
						return;
					}
				}
			}
			var zfje = parseFloat(header.Wrbtr) - parseFloat(sum);
			if (zfje < 0) {
				zfje = 0;
			}
			var Bczfje = Formatter.FloatFormat(zfje);
			var Bchxje = Formatter.FloatFormat(sum);
			this.getView().getModel().setProperty(path + "Bczfje", Bczfje, true);
			this.getView().getModel().setProperty(path + "Bchxje", Bchxje, true);
			// if (oEvent) {
			// 	this.onTwoAmountsum(oEvent);
			// }
		},

		//公司
		onShowBUKRS: function(oEvent) {
			// DialogCostConHelp
			var that = this;
			if (!that.oDialogBukrs) {
				that.oDialogBukrs = sap.ui.xmlfragment("sh.bz.common.fragment.DialogBukrs", that);
				that.getView().addDependent(that.oDialogBukrs);
			}
			that.oDialogBukrs.open();
			this._onSearchBurks(oEvent);
		},

		_onSearchBurks: function(oEvent) {
			var data = this.getView().getModel("GLOBLEDATA").oData.DKKD;
			if (data === "BX") {
				var Dkkd = "BX";
			} else {
				var Dkkd = "CL";
			}
			if (oEvent === undefined) {
				var value = "";
			} else {
				var value = oEvent.getParameter("query");
			}
			var loc = location.href.toLowerCase();
			if (loc.indexOf("fiorilaunchpad.html") > 0) {
				this.getOwnerComponent()._userid = sap.ushell.Container.getService("UserInfo").getId();
			} else {
				this.getOwnerComponent()._userid = "ZZLIYJ";
			};
			var userid = this.getOwnerComponent()._userid;
			var sPath = "/T001Set?$filter=Userid  eq '" + userid + "' and Dkkd eq '" + Dkkd + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			Util.setBusy(true);
			var that = this;
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_BUKRS");
					//按条件搜索
					var obj = {
						id: "Burklists",
						params: ["Bxbukrs", "Butxt"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					that.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get TaxcodeSet error!");
					Util.setBusy(false);
				}
			});
		},

		onCancelBukrsSelects: function() {
				this.oDialogBukrs.close();
			}
			// //申请人选择
			// rowSelected: function(oEvent) {
			// 	var sPath = oEvent.getSource().getBindingContext("model_PROPOSER").getPath();
			// 	this.getView().getModel("model_PROPOSER").setProperty("/sPath", sPath);
			// 	var path = this.getView().getBindingContext().getPath() + "/";
			// 	var PernrB = this.getView().getModel("model_PROPOSER").getProperty(sPath + "/" + "Pernr");
			// 	var SnameB = this.getView().getModel("model_PROPOSER").getProperty(sPath + "/" + "Sname");
			// 	var Bukrs = this.getView().getModel("model_PROPOSER").getProperty(sPath + "/" + "Bukrs");
			// 	var Butxt = this.getView().getModel("model_PROPOSER").getProperty(sPath + "/" + "Butxt");
			// 	var Kostl = this.getView().getModel("model_PROPOSER").getProperty(sPath + "/" + "Kostl");
			// 	var Ktext = this.getView().getModel("model_PROPOSER").getProperty(sPath + "/" + "Ktext");
			// 	var Telnum = this.getView().getModel("model_PROPOSER").getProperty(sPath + "/" + "Ptel");
			// 	this.getView().getModel().setProperty(path + "PernrB", PernrB);
			// 	this.getView().getModel().setProperty(path + "SnameB", SnameB);
			// 	this.getView().getModel().setProperty(path + "Bukrs", Bukrs);
			// 	this.getView().getModel().setProperty(path + "Butxt", Butxt);
			// 	this.getView().getModel().setProperty(path + "Kostl", Kostl);
			// 	this.getView().getModel().setProperty(path + "Ktext", Ktext);
			// 	this.getView().getModel().setProperty(path + "Telnum", Telnum);
			// 	var data = {};
			// 	var model = [];
			// 	this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_PROPOSER");
			// 	this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_search");
			// 	this.oDialogCostCenterHelpName.close();
			// }

	});
});
// sap.ui.define([
// 	"sh/bz/common/controller/BaseController",
// 	"sap/ui/model/json/JSONModel",
// 	"sap/ui/core/routing/History",
// 	"sh/bz/common/controller/formatter"
// ], function(
// 	BaseController,
// 	JSONModel,
// 	History,
// 	formatter
// ) {
// 	"use strict";

// 	return BaseController.extend("sh.bz.common.controller.CLBX_ALLINFOR", {

// 		formatter: formatter,

// 		/* ================================BaseController=========================== */
// 		/* lifecycle methods                                           */
// 		/* =========================================================== */

// 		/**
// 		 * Called when the worklist controller is instantiated.
// 		 * @public
// 		 */
// 		onInit: function() {
// 			
// 			// Model used to manipulate control states. The chosen values make sure,
// 			// detail page is busy indication immediately so there is no break in
// 			// between the busy indication for loading the view's meta data
// 			var iOriginalBusyDelay,
// 				oViewModel = new JSONModel({
// 					busy: true,
// 					delay: 0
// 				});

// 			this.getRouter().getRoute("DETAIL").attachPatternMatched(this._onObjectMatched, this);

// 			// Store original busy indicator delay, so it can be restored later on
// 			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
// 			this.setModel(oViewModel, "objectView");
// 			this.getOwnerComponent().getModel().metadataLoaded().then(function() {
// 				// Restore original busy indicator delay for the object view
// 				oViewModel.setProperty("/delay", iOriginalBusyDelay);
// 			});
// 		},

// 		/* =========================================================== */
// 		/* event handlers                                              */
// 		/* =========================================================== */

// 		/**
// 		 * Event handler when the share in JAM button has been clicked
// 		 * @public
// 		 */
// 		onShareInJamPress: function() {
// 			var oViewModel = this.getModel("objectView"),
// 				oShareDialog = sap.ui.getCore().createComponent({
// 					name: "sap.collaboration.components.fiori.sharing.dialog",
// 					settings: {
// 						object: {
// 							id: location.href,
// 							share: oViewModel.getProperty("/shareOnJamTitle")
// 						}
// 					}
// 				});
// 			oShareDialog.open();
// 		},

// 		/**
// 		 * Event handler  for navigating back.
// 		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
// 		 * If not, it will replace the current entry of the browser history with the worklist route.
// 		 * @public
// 		 */
// 		onNavBack: function() {
// 			var sPreviousHash = History.getInstance().getPreviousHash(),
// 				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

// 			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
// 				history.go(-1);
// 			} else {
// 				this.getRouter().navTo("worklist", {}, true);
// 			}
// 		},

// 		/* =========================================================== */
// 		/* internal methods                                            */
// 		/* =========================================================== */

// 		/**
// 		 * Binds the view to the object path.
// 		 * @function
// 		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
// 		 * @private
// 		 */
// 		_onObjectMatched: function(oEvent) {
// 			
// 			this.getView().setModel(this.getView().getModel("CLMODEL"));
// 			var data = {};
// 			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");
// 			var sObjectId = oEvent.getParameter("arguments").id;
// 			this.getModel().metadataLoaded().then(function() {
// 				var sObjectPath = this.getModel().createKey("Clbx_headerSet", {
// 					Recode: sObjectId
// 				});
// 				this._bindView("/" + sObjectPath);
// 			}.bind(this));
// 		},

// 		/**
// 		 * Binds the view to the object path.
// 		 * @function
// 		 * @param {string} sObjectPath path to the object to be bound
// 		 * @private
// 		 */
// 		_bindView: function(sObjectPath) {
// 			var oViewModel = this.getModel("objectView"),
// 				oDataModel = this.getModel();

// 			this.getView().bindElement({
// 				path: sObjectPath,
// 				events: {
// 					//change: this._onBindingChange.bind(this),
// 					dataRequested: function() {
// 						oDataModel.metadataLoaded().then(function() {
// 							// Busy indicator on view should only be set if metadata is loaded,
// 							// otherwise there may be two busy indications next to each other on the
// 							// screen. This happens because route matched handler already calls '_bindView'
// 							// while metadata is loaded.
// 							oViewModel.setProperty("/busy", true);
// 						});
// 					},
// 					dataReceived: function() {
// 						oViewModel.setProperty("/busy", false);
// 					}
// 				}
// 			});
// 		},

// 		_onBindingChange: function() {
// 			var oView = this.getView(),
// 				oViewModel = this.getModel("objectView"),
// 				oElementBinding = oView.getElementBinding();

// 			// No data for the binding
// 			if (!oElementBinding.getBoundContext()) {
// 				this.getRouter().getTargets().display("objectNotFound");
// 				return;
// 			}

// 			var oResourceBundle = this.getResourceBundle(),
// 				oObject = oView.getBindingContext().getObject(),
// 				sObjectId = oObject.Recode,
// 				sObjectName = oObject.Recode;

// 			// Everything went fine.
// 			oViewModel.setProperty("/busy", false);
// 			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
// 			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
// 			oViewModel.setProperty("/shareSendEmailSubject",
// 				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
// 			oViewModel.setProperty("/shareSendEmailMessage",
// 				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
// 		},
// 		saveallorder: function() {
// 			
// 		},

// 		submitorder: function() {
// 			
// 		}
// 	});

// });
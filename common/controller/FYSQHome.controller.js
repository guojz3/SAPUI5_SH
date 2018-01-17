sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sh/bz/common/controller/BaseController",
	"sh/bz/common/controller/Util",
	"sh/bz/common/controller/UtilTest",
	"sh/bz/common/controller/Formatter",
	"sh/bz/common/controller/UtilWorkFlow"
], function(Controller, BaseController, Util, UtilTest, Formatter, UtilWorkFlow) {
	"use strict";
	var reg_JE = /^\d+(.\d{2})?$/;
	var reg_PHONE = /^1[35678]\d{9}$|^((0\d{2}-)?\d{8}(-\d{1,4})?)$|^(0\d{3}-\d{7,8}(-\d{1,4})?)$/;
	return BaseController.extend("sh.bz.common.controller.FYSQHome", {

		//保存小数点
		onTwoAmountsum: function(oEveniew_Edit_RECEIPT_CODEt) {
			var value = this.getView().byId("view_Edit_AMOUNTSUM").getValue();
			var path = this.getView().getBindingContext().getPath() + "/";
			var sum = Formatter.FloatFormat(value);
			this.getView().getModel().setProperty(path + "Amountsum", sum);
		},

		onCancelCheckName: function(oEvent) {
			var model = [];
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_CHECK");
			this.oDialogCheckName.close();
		},

		// 清除校验错误提示
		onClearValueState: function(oEvent) {
			Util.onClearValueState(oEvent);
		},

		//new列表删除
		onBudgetDelete: function(oEvent, that) {
			that.getView().getModel("model_edit").getData().DZItem.splice(that.sDeleteItemIndex, 1);
			that.getView().getModel("model_edit").refresh();
		},

		//import  new onDeleteItem
		onDeleteItem: function(oEvent) {
			UtilTest.onDeleteItem(oEvent, this);
		},
		//获取单据编号
		getRecode: function(that) {
			//查询单据编号
			var Recode = "";
			var path = that.getView().getBindingContext().getPath() + "/";
			var Bukrs = that.getView().getModel().getProperty(path + "Bukrs");
			var sPath = "/RECODESet?$filter=(Dkkd eq 'SQ') and (Bukrs eq '" + Bukrs + "')";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
			var bError = false;
			oDataModel.read(sPath, {
				success: function(oData, response) {
					Recode = oData.results[0].Recode;
				},
				error: function(oError) {
					Util.showError("get RECODESet error!");
					bError = true;
				},
				async: false //false 同步操作 async operation
			});
			if (bError)
				return "";
			else
				return Recode;
		},

		//费用类型搜索
		onSearchEtdsc: function(oEvent) {
			var DKKD = "SQ";
			Util.onSearchEtdsc(oEvent, this, DKKD);
		},
		// 保存
		savePressed: function(oEvent) {
			//保存时候的录入数据校验2
			var objs = [{
				idStr: "view_Edit_AMOUNTSUM", //申请金额
				validNull: true,
				reg: reg_JE, // float保留两位精度
				msg: "需输入有效金额"
			}, {
				idStr: "view_Edit_PROPOSER_PRCTR", //利润中心
				validNull: true
			}, {
				idStr: "view_Edit_ETDSC", //费用类型
				validNull: true
			}, {
				idStr: "view_Edit_TELNUM", //联系方式
				validNull: true,
				reg: reg_PHONE, //验证手机号
				msg: "需输入有效手机号"
			}, {
				idStr: "view_Edit_ACCOUNTFOR", //费用用途
				validNull: true
			}];
			if (sap.ui.getCore().AppContext.Bukrs === "9200") {
				objs.push({
					idStr: "view_Edit_AUFNR", //订单
					validNull: true
				});
			}
			if (this.validForm(oEvent, this, objs))
				return;

			/* if (sap.ushell != null)
				userid = sap.ushell.Container.getService("UserInfo").getId(); //in Fiori FLP
			else
				var userid = "ZZLIYJ"; //in SAP WebIDE test environment  
				*/
			var userid = Util.getUserId();
			var saveSuccess = false;
			var that = this;
			var path = that.getView().getBindingContext().getPath() + "/";
			var Recode = that.getView().getModel().getProperty(path + "Recode");
			if (Recode !== "") {
				var sPath = "/HEADERSAVESet('" + Recode + "')";
				var oEntry = that.getView().getBindingContext().getProperty();
				delete oEntry.Uzeit_cr;
				delete oEntry.OrgehText;
				that.getView().getModel().update(sPath, oEntry, {
					merge: true,
					success: function(oData, oResponse) {
						Util.showInfo("保存成功");
						that.setscreen("A");
						that.getView().byId("view_Edit_save").setEnabled(true);
						that.getView().byId("view_Edit_submit").setEnabled(true);
					},
					error: function(error) {
						Util.showError("保存失败!");
						that.getView().byId("view_Edit_save").setEnabled(true);
						that.getView().byId("view_Edit_submit").setEnabled(true);
					},
					async: false
				});
			} else {
				var data = new Date();
				// var Recode = that.getRecode(that);
				// var adata = that.getView().getBindingContext().getProperty(path + "/" + "Redate");
				that.getView().getModel().setProperty(path + "Recode", Recode);
				that.getView().getModel().setProperty(path + "Spzt", "A");
				that.getView().getModel().setProperty(path + "Spztms", "起草");
				that.getView().getModel().setProperty(path + "Dkkd", "SQ");
				that.getView().getModel().setProperty(path + "Usrid", userid);
				// that.getView().getModel().setProperty(path + "Uzeitcr", data);
				var sPath = "/HEADERSAVESet";
				var oEntry = that.getView().getBindingContext().getProperty();
				// delete oEntry.__metadata;
				// delete oEntry.__proto__;
				delete oEntry.Uzeit_cr;
				delete oEntry.OrgehText;
				Util.debug(oEntry);
				var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/");
				oModel.create(sPath, oEntry, {
					success: function(oData, oResponse) {
						if (oData.Recode === "") {
							Util.showError("保存失败");
						} else {
							that.getView().getModel().setProperty(path + "Recode", oData.Recode);
							Util.showInfo("保存成功");
							that.setscreen("A");
							that.getView().byId("view_Edit_save").setEnabled(true);
							that.getView().byId("view_Edit_submit").setEnabled(true);
						}
					},
					error: function(error) {
						Util.showError("submit update failed:" + error);
					}
				});
			}
		},

		//费用类型打开
		onShowEtdscHelp: function(oEvent) {
			var Dkkd = "SQ";
			Util.onShowEtdscHelp(oEvent, this, Dkkd);
		},

		//提交
		submitPressed: function() {
			var data = this.getView().getModel("model_edit").getData();
			var that = this;
			if (data.Lcid === undefined) {
				var oEntry = that.getView().getBindingContext().getProperty();
				var Bukrs = oEntry.Bukrs;
				var DKKD = "SQ";
				var sPath = "/BETYPESet?$filter=( Bukrs eq '" + Bukrs + "' ) and ( Dkkd eq '" + DKKD + "' )";
				var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
				oDataModel.read(sPath, {
					success: function(oData, response) {
						var model = new sap.ui.model.json.JSONModel(oData).oData.results[0];
						var id = model.Lcid;
						var ZSlbm = model.Lcbm;
						var path = that.getView().getBindingContext().getPath() + "/";
						var name = oEntry.Sname; //申请人
						var Orgeh = oEntry.Orgeh;
						var e_business_code = oEntry.Recode; //单据编号
						var e_business_name = oEntry.Accountfor; //费用申请说明
						var e_business_count = oEntry.Amountsum; //申请金额
						var Aufnr = oEntry.Aufnr;
						var userid = Util.getUserId();
						var sPaths = "/HEADERSAVESet?$filter=Recode eq '" + e_business_code + "'";
						var oDataModels = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
						oDataModels.read(sPaths, {
							success: function(oData, response) {
								var oEntryd = that.getView().getBindingContext().getProperty();
								var model = new sap.ui.model.json.JSONModel(oData);
								if (model.oData.results[0].Slbm === "") {
									if (oEntryd.Spzt === "R") {
										var obj = {};
										obj.id = id;
										obj.amountsum = e_business_count;
										obj.name = name;
										obj.business_code = e_business_code;
										obj.business_name = e_business_name;
										obj.userid = userid;
										obj.Zslbm = ZSlbm;
										obj.Orgeh = Orgeh;
										obj.Aufnr = Aufnr;
										var oEntry = {
											Zslbm: ZSlbm,
											Zlcid: id,
											Zyhm: userid
										};
										UtilWorkFlow.restartflow(oEntry, that, obj);
									} else {
										var obj = {};
										obj.id = id;
										obj.amountsum = e_business_count;
										obj.name = name;
										obj.business_code = e_business_code;
										obj.business_name = e_business_name;
										obj.userid = userid;
										obj.Zslbm = ZSlbm;
										obj.Orgeh = Orgeh;
										obj.Aufnr = Aufnr;
										UtilWorkFlow.submited(obj, that);
									}
								} else {
									if (oEntryd.Spzt === "R") {
										var obj = {};
										obj.id = id;
										obj.amountsum = e_business_count;
										obj.name = name;
										obj.business_code = e_business_code;
										obj.business_name = e_business_name;
										obj.userid = userid;
										obj.Zslbm = model.oData.results[0].Slbm;
										obj.Orgeh = Orgeh;
										obj.Aufnr = Aufnr;
										var oEntry = {
											Zslbm: model.oData.results[0].Slbm,
											Zlcid: id,
											Zyhm: userid
										};
										UtilWorkFlow.restartflow(oEntry, that, obj);
									} else {
										var obj = {
											amountsum: e_business_count,
											name: name,
											business_code: e_business_code,
											business_name: e_business_name,
											Zslbm: model.oData.results[0].Slbm,
											Zyhm: userid,
											Orgeh: Orgeh,
											Aufnr :Aufnr
										};
										UtilWorkFlow.subed(obj, that);
									}

								}
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
				var path = this.getView().getBindingContext().getPath() + "/";
				var id = data.Lcid; //流程id
				var Zslbm = data.Lcbm; //
				var oEntryd = that.getView().getBindingContext().getProperty();
				var name = that.getView().getModel().getProperty(path + "SnameS"); //申请人
				var e_business_code = that.getView().getModel().getProperty(path + "Recode"); //单据编号
				var e_business_name = that.getView().getModel().getProperty(path + "Accountfor"); //费用申请说明
				var e_business_count = that.getView().getModel().getProperty(path + "Amountsum"); //申请金额
				var Aufnr = that.getView().getModel().getProperty(path + "Aufnr"); //申请金额
				var Orgeh = that.getView().getModel().getProperty(path + "Orgeh");
				var userid = Util.getUserId();
				var sPath = "/HEADERSAVESet?$filter=Recode eq '" + e_business_code + "'";
				var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
				oDataModel.read(sPath, {
					success: function(oData, response) {
						var model = new sap.ui.model.json.JSONModel(oData);
						if (model.oData.results[0].Slbm === "") {
							var obj = {};
							obj.id = id;
							obj.amountsum = e_business_count;
							obj.name = name;
							obj.business_code = e_business_code;
							obj.business_name = e_business_name;
							obj.userid = userid;
							obj.Zslbm = Zslbm;
							obj.Orgeh = Orgeh;
							obj.Aufnr = Aufnr;
							UtilWorkFlow.submited(obj, that);
						} else {
							if (oEntryd.Spzt === "R") {
								var obj = {};
								obj.id = id;
								obj.amountsum = e_business_count;
								obj.name = name;
								obj.business_code = e_business_code;
								obj.business_name = e_business_name;
								obj.userid = userid;
								obj.Zslbm = model.oData.results[0].Slbm;
								obj.Orgeh = Orgeh;
								obj.Aufnr = Aufnr;
								var oEntry = {
									Zslbm: model.oData.results[0].Slbm,
									Zlcid: id,
									Zyhm: userid
								};
								UtilWorkFlow.restartflow(oEntry, that, obj);
							} else {
								var obj = {
									amountsum: e_business_count,
									name: name,
									business_code: e_business_code,
									business_name: e_business_name,
									Zslbm: model.oData.results[0].Slbm,
									Zyhm: userid,
									Orgeh: Orgeh,
									Aufnr : Aufnr
								};
								UtilWorkFlow.subed(obj, that);
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

		//flag:3的时候的流程确认操作
		onConfirmCheckName: function(oEvent, that) {
			UtilWorkFlow.onConfirmCheckName(oEvent, this);
		},

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
			var UsridS = this.getView().getModel("model_PROPOSER").getProperty(sPath + "/" + "UsridS");
			this.getView().getModel().setProperty(path + "PernrS", PernrS);
			this.getView().getModel().setProperty(path + "SnameS", SnameS);
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
			var Prctr = this.getView().getModel("model_PROPOSER_PRCTR").getProperty(sPath + "/" + "Prctr");
			var KtextPrctr = this.getView().getModel("model_PROPOSER_PRCTR").getProperty(sPath + "/" + "Ktext");
			this.getView().getModel().setProperty(path + "Prctr", Prctr);
			this.getView().getModel().setProperty(path + "KtextPrctr", KtextPrctr);
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

		//初始化数据
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.getView().addStyleClass(this.getContentDensityClass());
			oRouter.getRoute("DETAIL_SQ").attachMatched(this._onRouteMatched, this);
			this.getView().byId("view_Edit_submit").setEnabled(false);
		},

		//付款方式3 窗口 选择一行数据
		rowSelectedZlsch: function(oEvent) {
			var path = oEvent.getSource().getBindingContext().getPath() + "/";
			var model = this.getView().byId("zlschlist").getModel();
			var Zlsch = model.getProperty(path + "Zlsch");
			var Text2 = model.getProperty(path + "Text2");

			var path = this.getView().getBindingContext().getPath() + "/";
			this.getView().getModel().setProperty(path + "Zlsch", Zlsch);

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
			this.getView().getModel().setProperty(path + "Bukrs", Bxbukrs);
			this.getView().getModel().setProperty(path + "Butxt", Butxt);
			this.getView().getModel().setProperty(path + "Orgeh", Orgeh);
			this.getView().getModel().setProperty(path + "OrgehText", Short);
			this.getView().getModel().setProperty(path + "Etkd", Etkd);
			this.getView().getModel().setProperty(path + "Etnm", Etnm);
			this.getView().getModel().setProperty(path + "Prctr", Prctr);
			this.getView().getModel().setProperty(path + "KtextPrctr", KtextPrctr);
			var data = {};
			var model = [];
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_BUKRS");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_BUKRS");
			this.oDialogBukrs.close();
		},
		prepareNewData: function(that) {
			var data = {};
			that.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");
			//初始化输入表单数据 总表 空数据
			var oEntry = this.getView().getModel().createEntry("HEADERSAVESet");
			this.getView().setBindingContext(oEntry);
			this.getView().bindElement(oEntry.getPath());
			this.getView().getModel().setRefreshAfterChange(true);
			//初始化输入表单数据 总表
			/*
			if (sap.ushell != null)
				Userid = sap.ushell.Container.getService("UserInfo").getId(); //in Fiori FLP
			else
				var Userid = "ZZLIYJ"; //in SAP WebIDE test environment
			*/
			var userid = Util.getUserId();
			this.readRYBH(this, userid);
			var path = this.getView().getBindingContext().getPath() + "/";
			this.onintFysqFz(this.getView().getModel().getProperty(path + "Bukrs"));
			Util.debug("prepareNewData completed");
		},

		//Fysq
		onintFysqFz: function(Bukrs) {
			sap.ui.getCore().AppContext.Bukrs = Bukrs;
			if (sap.ui.getCore().AppContext.Bukrs === '9200') {
				this.getView().byId("FYSQ_IP_Aufnr_label").setRequired(true);
			} else {
				this.getView().byId("FYSQ_IP_Aufnr_label").setRequired(false);
			}
		},

		readRYBH: function(that, Userid) {
			var path = this.getView().getBindingContext().getPath() + "/";
			//查询人员信息
			var sPath = "/RYBHSet?$filter=Usrid eq '" + Userid + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					if (oData.results.length === 1) {
						var model = new sap.ui.model.json.JSONModel(oData).getData();
						var Bukrs = model.results[0].Bukrs;
						var DKKD = "SQ";
						var ETKD = "";
						var ETDSC = "";
						var LCID = "";
						var LCBM = "";
						var sPath = "/BETYPESet?$filter=( Bukrs eq '" + Bukrs + "' ) and ( Dkkd eq '" + DKKD + "' )";
						var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
						oDataModel.read(sPath, {
							success: function(oData, responses) {
								if (model.results[0].Btmark === "") {
									that.getView().byId("IP_BUKRS").setEditable(false);
								}
								that.getView().getModel().setProperty(path + "Recode", "");
								that.getView().getModel().setProperty(path + "Bukrs", model.results[0].Bukrs);
								that.getView().getModel().setProperty(path + "Butxt", model.results[0].Butxt);
								that.getView().getModel().setProperty(path + "Orgeh", model.results[0].Orgeh);
								that.getView().getModel().setProperty(path + "OrgehText", model.results[0].OrgehText);
								that.getView().getModel().setProperty(path + "Sname", model.results[0].Sname);
								that.getView().getModel().setProperty(path + "Pernr", model.results[0].Pernr);
								that.getView().getModel().setProperty(path + "PernrS", model.results[0].Pernr);
								that.getView().getModel().setProperty(path + "SnameS", model.results[0].Sname);
								that.getView().getModel().setProperty(path + "Redate", model.results[0].Datum);
								that.getView().getModel().setProperty(path + "Telnum", model.results[0].Ptel);
								that.getView().getModel().setProperty(path + "Etkd", oData.results[0].Etkd);
								that.getView().getModel().setProperty(path + "Dkkd", oData.results[0].Dkkd);
								that.getView().getModel().setProperty(path + "Etnm", oData.results[0].Etnm);

								that.getView().getModel().setProperty(path + "Prctr", model.results[0].Prctr);
								that.getView().getModel().setProperty(path + "KtextPrctr", model.results[0].KtextPrctr);
								that.getView().getModel().setProperty(path + "UsridS", model.results[0].Usrid);
								var data = {};
								data.Lcid = oData.results[0].Lcid;
								data.Lcbm = oData.results[0].Lcbm;
								that.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");
							},
							error: function(oError) {
								Util.showError("readRYBH error!");
							},
							async: false
						});
						//that.readBEType(that);
					}
				},
				error: function(oError) {
					Util.showError("readRYBH error!");
				},
				async: false
			});

		},
		validateInputHead: function(oEvent) {
			var bInputValid = Util.validateInputFields(this);
			return bInputValid;
		},

		onAddItem: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("edititem", {
				"id": "new"
			}, false);
		},

		_onRouteMatched: function(oEvent) {
			this.setscreen(this.getOwnerComponent()._status);
			this.getView().setModel(this.getView().getModel("FYSQMODEL"));
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			this._id = oArgs.id;

			var data = {};
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");

			if (oArgs.id === undefined) {
				//if (oArgs.id == "new") {
				this.setscreen("");
				if (!sap.ui.getCore().AppContext) {
					sap.ui.getCore().AppContext = new Object();
				}
				if (!sap.ui.getCore().AppContext.shbzfysq) {
					sap.ui.getCore().AppContext.shbzfysq = new Object();
				}

				if (sap.ui.getCore().AppContext.shbzfysq.haveNewItem) {
					sap.ui.getCore().AppContext.shbzfysq.haveNewItem = false;

					var model_edit = this.getView().getModel("model_edit");
					var data = model_edit.oData;
					if (data.ItemCount === undefined) {
						data.ItemCount = 1;
					} else {
						data.ItemCount = data.ItemCount + 1;
					}
					sap.ui.getCore().AppContext.shbzfysq.Item.NO = data.ItemCount;
					sap.ui.getCore().AppContext.shbzfysq.Item.AMOUNT = Formatter.FloatFormat(sap.ui.getCore().AppContext.shbzfysq.Item.AMOUNT);
					data.Item.push(sap.ui.getCore().AppContext.shbzfysq.Item);

					var amount = parseFloat(sap.ui.getCore().AppContext.shbzfysq.Item.AMOUNT);
					var amountsum = parseFloat(data.AMOUNTSUM) + amount;
					data.AMOUNTSUM = Formatter.FloatFormat(amountsum);
					this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");
					this.getView().getModel("model_edit").refresh(true);
				} else if (sap.ui.getCore().AppContext.shbzfysq.haveUpdateItem) {
					//TODO
					//var data = sap.ui.getCore().AppContext.Item;

					//sap.ui.getCore().AppContext.haveUpdateItem = false;
				} else {
					this.prepareNewData(this);
				}
			} else {
				this.getData(this);
			};
			//	console.info(oArgs.id);
			//this._toPage(oArgs.id);
			Util.debug("");
		},
		//add by ymz s
		setscreen: function(status, sdata) {
			var that = this;
			if (this.getOwnerComponent().getModel("CONTROL") && this.getOwnerComponent().getModel("CONTROL").getProperty("/control") === 'AL') {
				status = 'C';
			};
			if (status === "A" || status === "" || status === undefined || status === "D" || status === "R") {
				//起草
				if (sdata !== undefined) {
					if (sdata === "") {
						this.getView().byId("IP_BUKRS").setEditable(false);
					}
				}
				var sViewinfor = [];
				//this.addfiledcontrol(sViewinfor, 'view_Edit_RECEIPT_CODE', null, null, true);
				//this.addfiledcontrol(sViewinfor, 'view_Edit_SNAME', null, null, true);
				this.addfiledcontrol(sViewinfor, 'view_Edit_PROPOSER', null, null, true);
				//this.addfiledcontrol(sViewinfor, 'view_Edit_REDATE', null, null, true);
				//this.addfiledcontrol(sViewinfor, 'view_Edit_BUTXT', null, null, true);
				this.addfiledcontrol(sViewinfor, 'view_Edit_PROPOSER_KOSTL', null, null, true);
				this.addfiledcontrol(sViewinfor, 'view_Edit_AMOUNTSUM', null, null, true);
				this.addfiledcontrol(sViewinfor, 'view_Edit_PROPOSER_PRCTR', null, null, true);
				this.addfiledcontrol(sViewinfor, 'view_Edit_AUFNR', null, null, true);
				this.addfiledcontrol(sViewinfor, 'view_Edit_ETDSC', null, null, true);
				this.addfiledcontrol(sViewinfor, 'view_Edit_TELNUM', null, null, true);
				this.addfiledcontrol(sViewinfor, 'view_Edit_ACCOUNTFOR', null, null, true);
				// for buttom
				this.addfiledcontrol(sViewinfor, 'fileUploader', true, null, null);
				this.addfiledcontrol(sViewinfor, 'fileUpload_delete', true, null, null);

				this.addfiledcontrol(sViewinfor, 'view_Edit_save', true, null, null);
				// this.addfiledcontrol(sViewinfor, 'view_Edit_submit', true, null, null);

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
				if (this.getView().byId("SQPAGE")) {
					this.getView().byId("SQPAGE").setShowFooter(true);
				}

				//未保存过时
				if (status === "" || status === undefined) {
					this.addfiledcontrol(sViewinfor, 'view_Edit_submit', true, false, null);
				} else {
					this.addfiledcontrol(sViewinfor, 'view_Edit_submit', true, true, null);
				};

				debugger;
			} else if (status === "C" || status === "E") {
				this.getView().byId("fileUploader").setVisible(false);
				var elements = that.getView().findElements(true);
				for (var i = 0; i < elements.length; i++) {
					if (elements[i].getMetadata().getName() === "sap.m.MultiInput" || elements[i].getMetadata().getName() === "sap.m.Input" ||
						elements[i].getMetadata().getName() === "sap.m.TextArea" || elements[i].getMetadata().getName() === "sap.m.DatePicker") {
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
		_toPage: function(key) {

		},
		//import
		onCancelPressed: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("homefysq", {}, false);
		},

		onBeforeRendering: function() {

		},
		getData: function(that) {
			var spath = "/HEADERSAVESet('" + that._id + "')";
			that.getView().bindElement({
				path: spath,
				events: {
					dataRequested: function() {
						Util.debug("dataRequested");
					},
					dataReceived: function(oData, response) {
						var model = oData.getParameters();
						var Recode = model.data.Recode;
						that.getFiles(that, Recode);
						// if (model.data.Spzt === "A" || model.data.Spzt === "D" || model.data.Spzt === "R") {
						// 	that.getView().byId("view_Edit_save").setEnabled(true);
						// 	that.getView().byId("view_Edit_submit").setEnabled(true);
						// } else {
						// 	that.getView().byId("view_Edit_save").setEnabled(false);
						// 	that.getView().byId("view_Edit_submit").setEnabled(false);
						// }
						if (sap.ui.getCore().AppContext.Apps === "Todolist") {
							// that.getView().byId("view_Edit_save").setVisible(false);
							// that.getView().byId("view_Edit_submit").setVisible(false);
						}
						that.setscreen(model.data.Spzt, model.data.Btmark);
					}
				}
			});
			if (this.getView().getBindingContext() !== undefined) {
				// var model = this.getView().getBindingContext().getProperty();
				// if (model.Spzt === "A" || model.Spzt === "D" || model.Spzt === "R") {
				// 	that.getView().byId("view_Edit_save").setEnabled(true);
				// 	that.getView().byId("view_Edit_submit").setEnabled(true);
				// } else {
				// 	that.getView().byId("view_Edit_save").setEnabled(false);
				// 	that.getView().byId("view_Edit_submit").setEnabled(false);
				// }
			}

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
			var Dkkd = "SQ";
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
	});
});
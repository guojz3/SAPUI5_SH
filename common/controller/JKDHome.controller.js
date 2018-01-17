sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sh/bz/common/controller/BaseController",
	"sh/bz/common/controller/Util",
	"sh/bz/common/controller/Base64",
	"sh/bz/common/controller/UtilTest",
	"sh/bz/common/controller/Formatter",
	"sh/bz/common/controller/UtilWorkFlow",
], function(Controller, BaseController, Util, Base64, UtilTest, Formatter, UtilWorkFlow, FileUploaderParameter) {
	"use strict";
	//手机号、固话正则表达
	var reg_PHONE = /^1[35678]\d{9}$|^((0\d{2}-)?\d{8}(-\d{1,4})?)$|^(0\d{3}-\d{7,8}(-\d{1,4})?)$/;
	
	return BaseController.extend("sh.bz.common.controller.JKDHome", {
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
			/* for fysq */
			/* 
			this.getView().getModel().setProperty(path + "PernrS", PernrS);
			this.getView().getModel().setProperty(path + "SnameS", SnameS);
			*/
			/* for cbbx */
			/*
			this.getView().getModel().setProperty(path + "PernrB", PernrS);
			this.getView().getModel().setProperty(path + "SnameB", SnameS);
			*/
			/* for jkd */
			this.getView().getModel().setProperty(path + "PernrJ", PernrS);
			this.getView().getModel().setProperty(path + "SnameJ", SnameS);
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
			/* for fysq, jkd */

			var Prctr = this.getView().getModel("model_PROPOSER_PRCTR").getProperty(sPath + "/" + "Prctr");
			var KtextPrctr = this.getView().getModel("model_PROPOSER_PRCTR").getProperty(sPath + "/" + "Ktext");
			this.getView().getModel().setProperty(path + "Prctr", Prctr);
			this.getView().getModel().setProperty(path + "KtextPrctr", KtextPrctr);
			/* for clbx */
			/*
			var Prctr = this.getView().getModel("model_PROPOSER_PRCTR").getProperty(sPath + "/" + "Prctr");
			var PrctrKtext = this.getView().getModel("model_PROPOSER_PRCTR").getProperty(sPath + "/" + "Ktext");
			this.getView().getModel().setProperty(path + "Prctr", Prctr);
			this.getView().getModel().setProperty(path + "PrctrKtext", PrctrKtext);
			*/

			var data = {};
			var model = [];
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_PROPOSER_PRCTR");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_search");
			this.oDialogCostCenterHelp.close();
		},
		//往来业务类型
		rowSelectedZzjshkdw: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Zzjshkdw").getPath();
			this.getView().getModel("model_Zzjshkdw").setProperty("/sPath", sPath);
			var path = this.getView().getBindingContext().getPath() + "/";
			var Zzjshkdw = this.getView().getModel("model_Zzjshkdw").getProperty(sPath + "/" + "Zzjshkdw");
			var Zzjshkdwms = this.getView().getModel("model_Zzjshkdw").getProperty(sPath + "/" + "Zzjshkdwms");
			this.getView().getModel().setProperty(path + "Zzjshkdw", Zzjshkdw);
			this.getView().getModel().setProperty(path + "Zzjshkdwms", Zzjshkdwms);
			var data = {};
			var model = [];
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_PROPOSER");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_search");
			this.oDialogZzjshkdwHelp.close();
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

		//付款方式6 窗口 选择一行数据
		rowSelectedZlsch: function(oEvent) {
			var path = oEvent.getSource().getBindingContext().getPath() + "/";
			var model = this.getView().byId("zlschlist").getModel();
			var Zlsch = model.getProperty(path + "Zlsch");
			var Text2 = model.getProperty(path + "Text2");

			var path = this.getView().getBindingContext().getPath() + "/";
			this.getView().getModel().setProperty(path + "Zlsch", Zlsch);
			this.getView().getModel().setProperty(path + "Text2", Text2);

			this.oDialogZlschHelp.close();
		},

		//货币7 选择
		rowSelectedWaers: function(oEvent) {
			var path = oEvent.getSource().getBindingContext().getPath() + "/";
			var model = this.getView().byId("waerslist").getModel();
			var Waers = model.getProperty(path + "Waers");
			var Ktext = model.getProperty(path + "Ktext");
			var path = this.getView().getBindingContext().getPath() + "/";
			this.getView().getModel().setProperty(path + "Currency", Waers);
			this.getView().getModel().setProperty(path + "Ktext_waers", Ktext);
			this.onCurrencyChange();
			this.oDialogWaersHelp.close();
		},

		//8 公司选择
		rowSelectedBukrs: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_BUKRS").getPath();
			this.getView().getModel("model_BUKRS").setProperty("/sPath", sPath);
			var path = this.getView().getBindingContext().getPath() + "/";
			var Bxbukrs = this.getView().getModel("model_BUKRS").getProperty(sPath + "/" + "Bxbukrs");
			var Butxt = this.getView().getModel("model_BUKRS").getProperty(sPath + "/" + "Butxt");
			var Orgeh = this.getView().getModel("model_BUKRS").getProperty(sPath + "/" + "Orgeh");
			var Short = this.getView().getModel("model_BUKRS").getProperty(sPath + "/" + "Short");
			var Prctr = this.getView().getModel("model_BUKRS").getProperty(sPath + "/" + "Prctr");
			var KtextPrctr = this.getView().getModel("model_BUKRS").getProperty(sPath + "/" + "KtextPrctr");
			this.getView().getModel().setProperty(path + "Bukrs", Bxbukrs);
			this.getView().getModel().setProperty(path + "Butxt", Butxt);
			this.getView().getModel().setProperty(path + "Orgeh", Orgeh);
			this.getView().getModel().setProperty(path + "OrgehText", Short);
			this.getView().getModel().setProperty(path + "Prctr", Prctr);
			this.getView().getModel().setProperty(path + "KtextPrctr", KtextPrctr);
			var data = {};
			var model = [];
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_BUKRS");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_BUKRS");
			this.oDialogBukrsHelp.close();
		},
		//flag:3的时候的流程确认操作
		onConfirmCheckName: function(oEvent, that) {
			UtilWorkFlow.onConfirmCheckName(oEvent, this);
		},

		onCancelCheckName: function(oEvent) {
			var model = [];
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_CHECK");
			this.oDialogCheckName.close();
		},

		//初始化数据
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.getView().addStyleClass(this.getContentDensityClass());
			oRouter.getRoute("DETAIL_JK").attachMatched(this._onRouteMatched, this);
			Util.debug("jkd version 0.102");
			this.yjhkDate(this); //预计还款日期 范围控制
		},
		//预计还款日期 范围控制
		yjhkDate: function() {
			var currentDate = new Date(),
				yjhkrq = this.byId("JKD_IP_Yjhkrq");
			// currentDate.setDate(currentDate.getDate() - 1);
			currentDate.setHours(0, 0, 0, 0);
			yjhkrq.setMinDate(currentDate);
		},

		//费用类型搜索
		onSearchEtdsc: function(oEvent) {
			var DKKD = "JK";
			Util.onSearchEtdsc(oEvent, this, DKKD);
		},

		savePressed: function(oEvent) {
			//保存时候的录入数据校验2
			var objs = [{
				idStr: "JKD_IP_PernrJ", //借款人
				validNull: true
			}, {
				idStr: "JKD_IP_Pernr", //经办人ID
				validNull: true
			}, {
				idStr: "JKD_IP_Kostl", //借款人部门
				validNull: true
			}, {
				idStr: "JKD_IP_Prctr", //利润中心
				validNull: true
			}, {
				// 	idStr: "JKD_IP_Zlsch", //付款方式
				// 	validNull: true
				// }, {
				idStr: "IP_BUKRS", //借款人公司
				validNull: true
			}, {
				idStr: "JKD_IP_Kursf", //汇率
				validNull: true
			}, {
				idStr: "JKD_IP_Wrbtr", //借款金额
				validNull: true,
				reg: /^\d+\.\d\d$/, // float保留两位精度
				msg: "需输入有效数值"
			}, {
				idStr: "JKD_IP_Numpg", //附件张数
				validNull: true,
				reg: /^\d+$/, // float保留两位精度
				msg: "需输入数字"
			}, {
				idStr: "JKD_IP_Telnum", //联系方式
				validNull: true,
				reg: reg_PHONE, //验证手机号
				msg: "需输入有效手机号"
			}, {
				idStr: "JKD_IP_Yjhkrq", //预计还款日期
				validNull: true,
				reg: /^[1-9]\d{3}\/(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])$/, // 日期
				msg: "需选择有效日期"
			}, {
				idStr: "JKD_IP_Accountfor", //借款用途
				validNull: true
			}, {
				idStr: "JKD_IP_Accountname", //户名
				validNull: true
			}, {
				idStr: "JKD_IP_Banka", //开户行
				validNull: true
			}, {
				idStr: "JKD_IP_Bankn", //账号
				validNull: true
			}, {
				idStr: "JKD_IP_Zzjshkdw", //往来业务性质
				validNull: true
			}];
			if (sap.ui.getCore().AppContext.Bukrs === '9200')
				objs.push({
					idStr: "JKD_IP_Aufnr", //订单
					validNull: true
				});
			/*借款金额不能为0*/
			var $Wrbtr = this.getView().byId("JKD_IP_Wrbtr"),
				WrbtrVal = Number($Wrbtr._lastValue);
			if (WrbtrVal <= 0) {
				$Wrbtr.setValue("");
			}
			if (this.validForm(oEvent, this, objs))
				return;

			//借款单 计算  本位币金额=借款金额x汇率
			this.doCaculate(this);

			//保存主表
			/*
			if (sap.ushell != null)
				userid = sap.ushell.Container.getService("UserInfo").getId(); //in Fiori FLP
			else
				var userid = "ZZLIYJ"; //in SAP WebIDE test environment
			*/
			var userid = Util.getUserId();
			var saveSuccess = false;
			var that = this;
			var path = that.getView().getBindingContext().getPath() + "/";
			var Recode = that.getView().getModel().getProperty(path + "Recode");
			//MERGE
			if (that.getView().getModel().getProperty(path + "Usrid") !== undefined) {
				var sPath = "/HEADERSAVESet('" + Recode + "')";
				var oEntry = that.getView().getBindingContext().getProperty();
				oEntry.Yjhkrq = new Date(oEntry.Yjhkrq); //预计还款日期
				oEntry.Yjhkrq.setHours(8);
				Util.debug(oEntry.Yjhkrq);
				delete oEntry.Uzeitcr; //创建时间		TODO
				delete oEntry.Uzeit_Cr; //创建时间		TODO
				delete oEntry.Zzjshkdwms; //往来业务类型  
				delete oEntry.OrgehText;
				Util.debug(oEntry);
				that.getView().getModel().update(sPath, oEntry, {
					merge: true,
					success: function(oData, oResponse) {
						var data = that.getView().getModel("model_edit").getData();
						data.button_save_enabled = true;
						data.button_submit_enabled = true;
						that.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");
						that.getView().getModel("model_edit").refresh();
						Util.showInfo("更新保存成功");
						that.setscreen("A");
					},
					error: function(error) {
						Util.showInfo("更新保存失败");
					},
					async: false
				});
			} else { //CREATE
				// var Recode = that.getRecode(that);
				that.getView().getModel().setProperty(path + "Recode", Recode);
				that.getView().getModel().setProperty(path + "Yhxje", "0.00");
				that.getView().getModel().setProperty(path + "Spzt", "A");
				that.getView().getModel().setProperty(path + "Spztms", "起草");
				that.getView().getModel().setProperty(path + "Dkkd", "JK");
				that.getView().getModel().setProperty(path + "Dknm", "借款单"); //2017-12-11
				that.getView().getModel().setProperty(path + "UsridS", userid); //2017-12-11

				that.getView().getModel().setProperty(path + "Usrid", userid);
				var sPath = "/HEADERSAVESet";
				var oEntry = that.getView().getBindingContext().getProperty();
				oEntry.Yjhkrq = new Date(oEntry.Yjhkrq); //预计还款日期
				oEntry.Yjhkrq.setHours(8);
				Util.debug(oEntry.Yjhkrq);
				delete oEntry.Uzeitcr; //创建时间		TODO
				delete oEntry.Uzeit_Cr; //创建时间		TODO
				delete oEntry.Zzjshkdwms; //往来业务类型
				delete oEntry.OrgehText;
				Util.debug(oEntry);
				var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROJKD_SRV/");
				oModel.create(sPath, oEntry, {
					success: function(oData, oResponse) {
						if (oData.Recode === "") {
							Util.showError("保存失败");
						} else {
							that.getView().getModel().setProperty(path + "Recode", oData.Recode);
							var data = that.getView().getModel("model_edit").getData();
							data.button_save_enabled = true;
							data.button_submit_enabled = true;
							that.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");
							that.getView().getModel("model_edit").refresh();
							that.setscreen("A");
							Util.showInfo("保存成功");
						}

					},
					error: function(error) {
						that.getView().getModel().setProperty(path + "Usrid", undefined);
						Util.showError("保存失败:" + error);
					}
				});
			}
		},

		//提交
		submitPressed: function() {
			//TODO 保存时候的校验
			// this.validateInputHead();
			var that = this;
			if (this.getView().getModel("model_workflow") === undefined) {
				var oEntry = that.getView().getBindingContext().getProperty();
				var Bukrs = oEntry.Bukrs;
				var DKKD = "JK";
				var sPath = "/BETYPESet?$filter=( Bukrs eq '" + Bukrs + "' ) and ( Dkkd eq '" + DKKD + "' )";
				var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
				oDataModel.read(sPath, {
					success: function(oData, response) {
						var model = new sap.ui.model.json.JSONModel(oData).oData.results[0];
						var id = model.Lcid;
						var ZSlbm = model.Lcbm;
						var path = that.getView().getBindingContext().getPath() + "/";
						var name = oEntry.Sname; //申请人
						var e_business_code = oEntry.Recode; //单据编号
						var e_business_name = oEntry.Accountfor; //费用申请说明
						var e_business_count = oEntry.Dmbtr; //申请金额
						var Orgeh = oEntry.Orgeh;
						var Aufnr = oEntry.Aufnr;
						/*
						if (sap.ushell != null)
							userid = sap.ushell.Container.getService("UserInfo").getId(); //in Fiori FLP
						else
							var userid = "ZZLIYJ"; //in SAP WebIDE test environment
						*/
						var userid = Util.getUserId();
						var sPaths = "/HEADERSAVESet('" + e_business_code + "')";
						var oDataModels = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROJKD_SRV/", true);
						oDataModels.read(sPaths, {
							success: function(oData, response) {
								var model = new sap.ui.model.json.JSONModel(oData);
								var oEntryd = that.getView().getBindingContext().getProperty();
								if (model.oData.Slbm === "") {
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
								} else {
									if (oEntryd.Spzt === "R") {
										var obj = {};
										obj.id = id;
										obj.amountsum = e_business_count;
										obj.name = name;
										obj.business_code = e_business_code;
										obj.business_name = e_business_name;
										obj.userid = userid;
										obj.Zslbm = model.oData.Slbm;
										obj.Orgeh = Orgeh;
										obj.Aufnr = Aufnr;
										var oEntry = {
											Zslbm: model.oData.Slbm,
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
											Zslbm: model.oData.Slbm,
											Zyhm: userid,
											Orgeh: Orgeh,
											Aufnr : Aufnr
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
				var data = this.getView().getModel("model_workflow").getData();
				var id = data.Lcid;
				var ZSlbm = data.Lcbm;
				var path = that.getView().getBindingContext().getPath() + "/";
				var model = this.getView().getModel();
				var name = model.getProperty(path + "Sname"); //申请人
				var e_business_code = model.getProperty(path + "Recode"); //单据编号
				var e_business_name = model.getProperty(path + "Accountfor"); //费用申请说明
				var e_business_count = model.getProperty(path + "Dmbtr"); //申请金额
				var Orgeh = model.getProperty(path + "Orgeh");
				var Aufnr = model.getProperty(path + "Aufnr");
				var userid = Util.getUserId();
				var sPath = "/HEADERSAVESet('" + e_business_code + "')";
				var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROJKD_SRV/", true);
				oDataModel.read(sPath, {
					success: function(oData, response) {
						var oEntryd = that.getView().getBindingContext().getProperty();
						var model = new sap.ui.model.json.JSONModel(oData);
						if (model.oData.Slbm === "") {
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
						} else {
							if (oEntryd.Spzt === "R") {
								var obj = {};
								obj.id = id;
								obj.amountsum = e_business_count;
								obj.name = name;
								obj.business_code = e_business_code;
								obj.business_name = e_business_name;
								obj.userid = userid;
								obj.Zslbm = model.oData.Slbm;
								obj.Orgeh = Orgeh;
								obj.Aufnr = Aufnr;
								var oEntry = {
									Zslbm: model.oData.Slbm,
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
									Zslbm: model.oData.Slbm,
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

		readBEType: function(that) {
			var path = that.getView().getBindingContext().getPath() + "/";
			var model = that.getView().getModel();
			var Bukrs = model.getProperty(path + "Bukrs");

			var DKKD = "JK"; //SQ, JK

			//var sPath = "/BETYPESet?$filter=( Bukrs eq '" + Bukrs + "' ) and ( Dkkd eq '" + DKKD + "' ) and (Etkd eq '" + ETKD + "')";
			var sPath = "/BETYPESet?$filter=( Bukrs eq '" + Bukrs + "' ) and ( Dkkd eq '" + DKKD + "' )";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
			Util.debug("BETYPESet " + sPath);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					if (oData.results.length === 1) {
						that.getView().getModel().setProperty(path + "Etkd", oData.results[0].Etkd);
						that.getView().getModel().setProperty(path + "Dkkd", oData.results[0].Dkkd);
						var data = {};
						data.Etdsc = oData.results[0].Etdsc;
						data.Lcid = oData.results[0].Lcid;
						data.Lcbm = oData.results[0].Lcbm;
						var model = new sap.ui.model.json.JSONModel(data);
						that.getView().setModel(model, "model_workflow");
						Util.debug("get BETYPESet success!");
						Util.debug("Lcid " + data.Lcid);
					} else
						Util.showError("get BETYPESet error!");
				},
				error: function(oError) {
					Util.showError("get BETYPESet error!");
				},
				async: false
			});
		},

		//借款单  判断 人名币
		onCurrencyChange: function(oEvent) {
			var path = this.getView().getBindingContext().getPath() + "/";
			var model = this.getView().getModel();

			if (model.getProperty(path + "Currency") === "CNY") {
				this.getView().byId("JKD_IP_Kursf").setEditable(false);
			} else {
				this.getView().byId("JKD_IP_Kursf").setEditable(true);
			}

			/*
			var data = this.getView().getModel("model_edit").getData();
			if (model.getProperty(path + "Currency") === "CNY") {
				data.Kursf_editable = false;
			} else {
				data.Kursf_editable = true;
			}
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");
			*/
			this.doCaculate(this);

		},

		//借款单 计算  本位币金额=借款金额x汇率
		doCaculate: function(that) {
			var path = that.getView().getBindingContext().getPath() + "/";
			var model = that.getView().getModel();
			//TODO JKD 判断 人名币 条件不对
			if (model.getProperty(path + "Currency") === "CNY") {
				model.setProperty(path + "Kursf", "1.00000"); //汇率
			}

			model.setProperty(path + "Wrbtr", Formatter.FloatFormat(model.getProperty(path + "Wrbtr"))); //金额
			var value = parseFloat(model.getProperty(path + "Wrbtr")) * parseFloat(model.getProperty(path + "Kursf"));
			value = Formatter.FloatFormat(value);
			model.setProperty(path + "Dmbtr", value); //本位币金额
		},

		getRecode: function(that) {
			//查询单据编号
			var Recode = "";

			var path = that.getView().getBindingContext().getPath() + "/";
			var Bukrs = that.getView().getModel().getProperty(path + "Bukrs");
			var sPath = "/RECODESet?$filter=(Dkkd eq 'JK') and (Bukrs eq '" + Bukrs + "')";
			//var sPath = "/RECODESet?$filter=(Dkkd eq 'JK') and (Bukrs eq '1001')";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROJKD_SRV/", true);
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

		readRYBH: function(that, Userid) {
			var path = that.getView().getBindingContext().getPath() + "/";

			//查询人员信息
			var sPath = "/RYBHSet?$filter=Usrid eq '" + Userid + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01", true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					if (oData.results.length === 1) {
						if (oData.results[0].Btmark === "") {
							that.getView().byId("IP_BUKRS").setEditable(false);
						}
						//example model.setProperty("/RYBHSet('ZZLIYJ')/Sname", "zz");
						//that.getView().getModel().setProperty(path + "Recode", "XX");
						that.getView().getModel().setProperty(path + "Currency", "CNY");
						that.getView().getModel().setProperty(path + "Ktext_waers", "人民币");
						// that.getView().getModel().setProperty(path + "Wrbtr", 0.00);
						that.getView().getModel().setProperty(path + "Kursf", "1.00000"); //汇率
						that.getView().getModel().setProperty(path + "Wrbtr", ""); //借款金额
						that.getView().getModel().setProperty(path + "Dmbtr", "0.00");
						// that.getView().getModel().setProperty(path + "Numpg", 0); //附件张数

						that.getView().getModel().setProperty(path + "Redate", oData.results[0].Datum);
						that.getView().getModel().setProperty(path + "PernrJ", oData.results[0].Pernr);
						that.getView().getModel().setProperty(path + "SnameJ", oData.results[0].Sname);
						that.getView().getModel().setProperty(path + "Pernr", oData.results[0].Pernr);
						that.getView().getModel().setProperty(path + "Sname", oData.results[0].Sname);
						// that.getView().getModel().setProperty(path + "Kostl", oData.results[0].Kostl);
						// that.getView().getModel().setProperty(path + "Ktext", oData.results[0].Ktext);
						that.getView().getModel().setProperty(path + "Orgeh", oData.results[0].Orgeh);
						that.getView().getModel().setProperty(path + "OrgehText", oData.results[0].OrgehText);
						that.getView().getModel().setProperty(path + "Butxt", oData.results[0].Butxt);
						that.getView().getModel().setProperty(path + "Bukrs", oData.results[0].Bukrs);
						that.getView().getModel().setProperty(path + "Ktext", oData.results[0].Ktext);
						that.getView().getModel().setProperty(path + "Telnum", oData.results[0].Ptel);
						that.getView().getModel().setProperty(path + "Accountname", oData.results[0].Sname);
						that.getView().getModel().setProperty(path + "Banka", oData.results[0].Banka);
						that.getView().getModel().setProperty(path + "Bankn", oData.results[0].Bankn);
						that.getView().getModel().setProperty(path + "Prctr", oData.results[0].Prctr);
						that.getView().getModel().setProperty(path + "KtextPrctr", oData.results[0].KtextPrctr);
						that.readBEType(that);
					}
				},
				error: function(oError) {
					Util.showError("readRYBH error!");
				},
				async: false
			});

		},

		//
		onintJkdFz: function(Bukrs) {
			sap.ui.getCore().AppContext.Bukrs = Bukrs;
			if (sap.ui.getCore().AppContext.Bukrs === '9200') {
				this.getView().byId("JKD_IP_Aufnr_label").setRequired(true);
			} else {
				this.getView().byId("JKD_IP_Aufnr_label").setRequired(false);
			}
		},

		//初始化输入表单数据
		prepareNewData: function(that) {
			//初始化输入表单数据 附件上传
			//TODO attachment API
			var data = {
				"Item": []
			};
			that.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_file");

			//初始化输入表单数据 数据校验
			var data = {
				"WrbtrValueState": "None",
				"WrbtrValueStateText": "",
				"Kursf_editable": false,
				"button_save_enabled": true,
				"button_submit_enabled": false,
			};
			that.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");

			//初始化输入表单数据 总表 空数据
			var oEntry = this.getView().getModel().createEntry("HEADERSAVESet");
			that.getView().setBindingContext(oEntry);
			that.getView().bindElement(oEntry.getPath());
			that.getView().getModel().setRefreshAfterChange(true);

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
			this.onintJkdFz(this.getView().getModel().getProperty(path + "Bukrs"));
			Util.debug("prepareNewData completed");
		},

		validateInputHead: function(oEvent) {
			var bInputValid = Util.validateInputFields(this);
			return bInputValid;
		},

		_onRouteMatched: function(oEvent) {
			this.setscreen(this.getOwnerComponent()._status);
			this.getView().setModel(this.getView().getModel("JKMODEL"));
			Util.debug("_onRouteMatched called");
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			this._id = oArgs.id;
			//if (oArgs.id == "new") {
			if (oArgs.id === undefined) {
				this.setscreen("");
				if (!sap.ui.getCore().AppContext) {
					sap.ui.getCore().AppContext = new Object();
				}
				if (!sap.ui.getCore().AppContext.shbzjkd) {
					sap.ui.getCore().AppContext.shbzjkd = new Object();
				}

				if (sap.ui.getCore().AppContext.shbzjkd.haveNewItem) {
					sap.ui.getCore().AppContext.shbzjkd.haveNewItem = false;

					var model_edit = this.getView().getModel("model_edit");
					var data = model_edit.oData;
					if (data.ItemCount === undefined) {
						data.ItemCount = 1;
					} else {
						data.ItemCount = data.ItemCount + 1;
					}
					sap.ui.getCore().AppContext.shbzjkd.Item.NO = data.ItemCount;
					sap.ui.getCore().AppContext.shbzjkd.Item.AMOUNT = Formatter.FloatFormat(sap.ui.getCore().AppContext.shbzjkd.Item.AMOUNT);
					data.Item.push(sap.ui.getCore().AppContext.shbzjkd.Item);

					var amount = parseFloat(sap.ui.getCore().AppContext.shbzjkd.Item.AMOUNT);
					var amountsum = parseFloat(data.AMOUNTSUM) + amount;
					data.AMOUNTSUM = Formatter.FloatFormat(amountsum);
					this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");
					this.getView().getModel("model_edit").refresh(true);
				} else if (sap.ui.getCore().AppContext.shbzjkd.haveUpdateItem) {
					//TODO
					//var data = sap.ui.getCore().AppContext.Item;

					//sap.ui.getCore().AppContext.haveUpdateItem = false;
				} else {
					var that = this;
					this.getView().getModel().metadataLoaded().then(function() {
						that.prepareNewData(that);
					});
				}
			} else {
				this.getData(this);
			}
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
				//this.addfiledcontrol(sViewinfor, 'JKD_IP_Recode', null, null, true);
				//this.addfiledcontrol(sViewinfor, 'JKD_IP_Pernr', null, null, true);
				this.addfiledcontrol(sViewinfor, 'JKD_IP_PernrJ', null, null, true);
				this.addfiledcontrol(sViewinfor, 'JKD_IP_Wrbtr', null, null, true);
				//this.addfiledcontrol(sViewinfor, 'JKD_IP_Dmbtr', null, null, true);
				this.addfiledcontrol(sViewinfor, 'JKD_IP_Zlsch', null, null, true);
				this.addfiledcontrol(sViewinfor, 'JKD_IP_Aufnr', null, null, true);
				this.addfiledcontrol(sViewinfor, 'JKD_IP_Prctr', null, null, true);
				//this.addfiledcontrol(sViewinfor, 'JKD_IP_Redate', null, null, true);
				//this.addfiledcontrol(sViewinfor, 'JKD_IP_Bukrs', null, null, true);
				this.addfiledcontrol(sViewinfor, 'JKD_IP_Kostl', null, null, true);
				this.addfiledcontrol(sViewinfor, 'JKD_IP_Currency', null, null, true);

				//this.addfiledcontrol(sViewinfor, 'JKD_IP_Kursf', null, null, true);
				this.addfiledcontrol(sViewinfor, 'JKD_IP_Numpg', null, null, true);
				this.addfiledcontrol(sViewinfor, 'JKD_IP_Yjhkrq', null, null, true);
				this.addfiledcontrol(sViewinfor, 'JKD_IP_Telnum', null, null, true);
				this.addfiledcontrol(sViewinfor, 'JKD_IP_Accountfor', null, null, true);

				this.addfiledcontrol(sViewinfor, 'JKD_IP_Accountname', null, null, true);
				this.addfiledcontrol(sViewinfor, 'JKD_IP_Banka', null, null, true);
				this.addfiledcontrol(sViewinfor, 'JKD_IP_Bankn', null, null, true);
				this.addfiledcontrol(sViewinfor, 'JKD_IP_Zzjshkdw', null, null, true);
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
				if (this.getView().byId("JKPAGE")) {
					this.getView().byId("JKPAGE").setShowFooter(true);
				}

				//未保存过时
				if (status === "" || status === undefined) {
					this.addfiledcontrol(sViewinfor, 'view_Edit_submit', true, false, null);
				} else {
					this.addfiledcontrol(sViewinfor, 'view_Edit_submit', true, true, null);
				};

			} else if (status === "C" || status === "E") {
				this.getView().byId("fileUploader").setVisible(false);
				var elements = that.getView().findElements(true);
				this.getView().byId("JKD_IP_Kursf").setEditable(false);
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

		onAfterRendering: function() {

		},

		getData: function(that) {
			//初始化model_edit
			var data = {};
			that.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");

			var spath = "/HEADERSAVESet('" + that._id + "')";
			// this.getView().bindElement(spath);
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
		}
	});
});
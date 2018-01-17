sap.ui.define([
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
], function(MessageToast, MessageBox, BusyIndicator) {
	"use strict";
	var Util = {
		pageinfo: null,

		uuid: function() {
			var s = [];
			var hexDigits = "0123456789abcdef";
			for (var i = 0; i < 36; i++) {
				s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
			}
			s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
			s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
			s[8] = s[13] = s[18] = s[23] = "-";

			var uuid = s.join("");
			return uuid;
		},
		//todolist CX code 
		readFYSQByBusinessCode: function(code, that) {
			var sPath = "/HEADERSAVESet?$filter=Recode eq '" + code + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);

					Util.debug(model);
					that.getView().setModel(model, "model_edit");
					// console.log(model)
					//Util.debug(model);
				},
				error: function(oError) {
					MessageToast.show("get RYBHSet error!");
				},
				async: false
			});
		},
		//QUERY CX code
		readGrdjcx: function(code, that) {
			var Dkkd = code.slice(0, 2);
			var sPath = this.checkDkkd(Dkkd);
			console.log(sPath);
			// var path = that.getView().getBindingContext().getPath() + "/";
			// var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROSQDTB_SRV/", true);
			// that.getView().bindElement({
			// 	path: sPath,
			// 	events: {
			// 		dataRequested: function() {
			// 			Util.debug("dataRequested");
			// 		},
			// 		dataReceived: function(oData, response) {
			// 			var model = oData.getParameters();
			// 			if (model.Spzt === "A" || model.Spzt === "D" || model.Spzt === "R") {
			// 				that.getView().byId("view_Edit_save").setEnabled(true);
			// 				that.getView().byId("view_Edit_submit").setEnabled(true);
			// 			} else {
			// 				that.getView().byId("view_Edit_save").setEnabled(false);
			// 				that.getView().byId("view_Edit_submit").setEnabled(false);
			// 			}
			// 		}
			// 	}
			// });
			// this.setBusy(true);
			// var a = this;
			// oDataModel.read(sPath, {
			// 	success: function(oData, response) {
			// 		a.setBusy(false);
			// 		var model = new sap.ui.model.json.JSONModel(oData).getData();
			// 		Util.debug(model);
			// 		if (model.results[0].Spzt === "A" || model.results[0].Spzt === "D" || model.results[0].Spzt ===
			// 			"R") {
			// 			that.getView().getModel().setProperty(path + "Spzt", model.results[0].Spzt);
			// 			that.getView().getModel().setProperty(path + "Recode", model.results[0].Recode);
			// 			that.getView().getModel().setProperty(path + "Accountfor", model.results[0].Accountfor);
			// 			that.getView().getModel().setProperty(path + "Amountsum", model.results[0].Amountsum);
			// 			that.getView().getModel().setProperty(path + "Aufnr", model.results[0].Aufnr);
			// 			that.getView().getModel().setProperty(path + "Bukrs", model.results[0].Bukrs);
			// 			that.getView().getModel().setProperty(path + "Butxt", model.results[0].Butxt);
			// 			that.getView().getModel().setProperty(path + "Dkkd", model.results[0].Dkkd);
			// 			that.getView().getModel().setProperty(path + "Dknm", model.results[0].Dknm);
			// 			that.getView().getModel().setProperty(path + "Etkd", model.results[0].Etkd);
			// 			that.getView().getModel().setProperty(path + "Etnm", model.results[0].Etnm);
			// 			that.getView().getModel().setProperty(path + "Kostl", model.results[0].Kostl);
			// 			that.getView().getModel().setProperty(path + "Ktext", model.results[0].Ktext);
			// 			that.getView().getModel().setProperty(path + "KtextAufnr", model.results[0].KtextAufnr);
			// 			that.getView().getModel().setProperty(path + "KtextPrctr", model.results[0].KtextPrctr);
			// 			that.getView().getModel().setProperty(path + "Pernr", model.results[0].Pernr);
			// 			that.getView().getModel().setProperty(path + "PernrS", model.results[0].PernrS);
			// 			that.getView().getModel().setProperty(path + "Prctr", model.results[0].Prctr);
			// 			that.getView().getModel().setProperty(path + "Redate", model.results[0].Redate);
			// 			that.getView().getModel().setProperty(path + "Slbm", model.results[0].Slbm);
			// 			that.getView().getModel().setProperty(path + "Sname", model.results[0].Sname);
			// 			that.getView().getModel().setProperty(path + "SnameS", model.results[0].SnameS);
			// 			that.getView().getModel().setProperty(path + "Telnum", model.results[0].Telnum);
			// 			that.getView().getModel().setProperty(path + "Usrid", model.results[0].Usrid);
			// 			that.getView().byId("view_Edit_save").setEnabled(true);
			// 			that.getView().byId("view_Edit_submit").setEnabled(true);
			// 		} else {
			// 			that.getView().getModel().setProperty(path + "Spzt", model.results[0].Spzt);
			// 			that.getView().getModel().setProperty(path + "Recode", model.results[0].Recode);
			// 			that.getView().getModel().setProperty(path + "Accountfor", model.results[0].Accountfor);
			// 			that.getView().getModel().setProperty(path + "Amountsum", model.results[0].Amountsum);
			// 			that.getView().getModel().setProperty(path + "Aufnr", model.results[0].Aufnr);
			// 			that.getView().getModel().setProperty(path + "Bukrs", model.results[0].Bukrs);
			// 			that.getView().getModel().setProperty(path + "Butxt", model.results[0].Butxt);
			// 			that.getView().getModel().setProperty(path + "Dkkd", model.results[0].Dkkd);
			// 			that.getView().getModel().setProperty(path + "Dknm", model.results[0].Dknm);
			// 			that.getView().getModel().setProperty(path + "Etkd", model.results[0].Etkd);
			// 			that.getView().getModel().setProperty(path + "Etnm", model.results[0].Etnm);
			// 			that.getView().getModel().setProperty(path + "Kostl", model.results[0].Kostl);
			// 			that.getView().getModel().setProperty(path + "Ktext", model.results[0].Ktext);
			// 			that.getView().getModel().setProperty(path + "KtextAufnr", model.results[0].KtextAufnr);
			// 			that.getView().getModel().setProperty(path + "KtextPrctr", model.results[0].KtextPrctr);
			// 			that.getView().getModel().setProperty(path + "Pernr", model.results[0].Pernr);
			// 			that.getView().getModel().setProperty(path + "PernrS", model.results[0].PernrS);
			// 			that.getView().getModel().setProperty(path + "Prctr", model.results[0].Prctr);
			// 			that.getView().getModel().setProperty(path + "Redate", model.results[0].Redate);
			// 			that.getView().getModel().setProperty(path + "Slbm", model.results[0].Slbm);
			// 			that.getView().getModel().setProperty(path + "Sname", model.results[0].Sname);
			// 			that.getView().getModel().setProperty(path + "SnameS", model.results[0].SnameS);
			// 			that.getView().getModel().setProperty(path + "Telnum", model.results[0].Telnum);
			// 			that.getView().getModel().setProperty(path + "Usrid", model.results[0].Usrid);
			// 			that.getView().byId("view_Edit_save").setEnabled(false);
			// 			that.getView().byId("view_Edit_submit").setEnabled(false);
			// 		}

			// 	},
			// 	error: function(oError) {
			// 		this.setBusy(false);
			// 		MessageToast.show("get RYBHSet error!");
			// 	},
			// 	async: false
			// });
		},

		//选择单据类型
		checkDkkd: function(Dkkd) {
			switch (Dkkd) {
				case "SQ":
					var Spath = "/HEADERSAVESet";
					break;
				case "JK":
					var Spath = "/HEADERSAVESet";
					break;
					// case CL:

					// 	break;
				default:
					// n 与
			}
			return Spath;
		},

		//设置BUSY状态
		setBusy: function(busy) {
			jQuery.sap.require("sap.ui.core.BusyIndicator");
			busy ? BusyIndicator.show(0) : BusyIndicator.hide();
		},

		//shenqingren//申请人 点击搜索
		onSearchPROPOSE: function(oEvent, that) {
			var path = that.getView().getBindingContext().getPath() + "/";
			var Bukrs = that.getView().getModel().getProperty(path + "Bukrs");
			var value = oEvent.getParameter("query");
			//判断是否含有中文
			if (!/^[\u4e00-\u9fa5]/.test(value)) {
				var sPath = "/RYBHSet?$filter=Bukrs eq '" + Bukrs + "' and substringof( '" + (value ? value : '') + "',Pernr)";
				var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
				oDataModel.read(sPath, {
					success: function(oData, response) {
						var model = new sap.ui.model.json.JSONModel(oData);
						that.getView().setModel(model, "model_PROPOSER");
						Util.debug(model);
					},
					error: function(oError) {
						MessageToast.show("get RYBHSet error!");
					}
				});
			} else {
				var sPath = "/RYBHSet?$filter=Bukrs eq '" + Bukrs + "' and substringof( '" + (value ? value : '') + "',Sname)";
				var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
				oDataModel.read(sPath, {
					success: function(oData, response) {
						var model = new sap.ui.model.json.JSONModel(oData);
						that.getView().setModel(model, "model_PROPOSER");
						// that.getView().setModel(model, "model_PROPOSER");
						Util.debug(model);
					},
					error: function(oError) {
						MessageToast.show("get RYBHSet error!");
					}
				});
			}
		},
		//成本
		onSearchPROPOSER_KOSTLed: function(oEvent, that) {
			var path = that.getView().getBindingContext().getPath() + "/";
			var Bukrs = sap.ui.getCore().AppContext.Bukrs;
			if (oEvent === undefined) {
				var value = "";
			} else {
				var value = oEvent.getParameter("query");
			}
			//value = (Array(10).join(0) + value).slice(-10);
			if (!/^[\u4e00-\u9fa5]/.test(value)) {
				var sPath = "/CSKSSet?$filter=Bukrs eq '" + Bukrs + "' and substringof( '" + (value ? value : '') + "',Kostl)";
				//var sPath = "/CSKSSet?$filter=Kostl eq '" + (value?value:'') + "'";
				var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
				oDataModel.read(sPath, {
					success: function(oData, response) {
						var model = new sap.ui.model.json.JSONModel(oData);
						that.getView().setModel(model, "model_PROPOSER_KOSTLed");
						Util.debug(model);
					},
					error: function(oError) {
						MessageToast.show("get RYBHSet error!");
					}
				});
			} else {
				var sPath = "/CSKSSet?$filter=Bukrs eq '" + Bukrs + "' and substringof( '" + (value ? value : '') + "',Ktext)";
				var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
				oDataModel.read(sPath, {
					success: function(oData, response) {
						var model = new sap.ui.model.json.JSONModel(oData);
						that.getView().setModel(model, "model_PROPOSER_KOSTLed");
						// that.getView().setModel(model, "model_PROPOSER");
						Util.debug(model);
					},
					error: function(oError) {
						MessageToast.show("get RYBHSet error!");
					}
				});
			}
		},
		//搜索订单
		onSearchAufnr: function(oEvent, that) {
			var path = that.getView().getBindingContext().getPath() + "/";
			var Bukrs = that.getView().getModel().getProperty(path + "Bukrs");
			var value = oEvent.getParameter("query");
			if (!/^[\u4e00-\u9fa5]/.test(value)) {
				var sPath = "/AUFKSet?$filter=Bukrs eq '" + Bukrs + "' and substringof( '" + (value ? value : '') + "',Aufnr)";
				var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
				oDataModel.read(sPath, {
					success: function(oData, response) {
						var model = new sap.ui.model.json.JSONModel(oData);
						that.getView().setModel(model, "model_Aufnr");
						Util.debug(model);
					},
					error: function(oError) {
						MessageToast.show("get RYBHSet error!");
					}
				});
			} else {
				var sPath = "/AUFKSet?$filter=Bukrs eq '" + Bukrs + "' and substringof( '" + (value ? value : '') + "',Ktext)";
				var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
				oDataModel.read(sPath, {
					success: function(oData, response) {
						var model = new sap.ui.model.json.JSONModel(oData);
						that.getView().setModel(model, "model_Aufnr");
						Util.debug(model);
					},
					error: function(oError) {
						MessageToast.show("get RYBHSet error!");
					}
				});
			}
		},

		onShowPROPOSERHelp: function(oEvent, that) {
			// var cl = that.getView().byId("CLBX_CLXX_table").getItems().length !== 0;

			var hxobj = that.getView().byId("table_hx");
			var sqobj = that.getView().byId("table_sq");
			var fpobj = that.getView().byId("table_fp");
			if (hxobj && sqobj && fpobj) {
				var hx = hxobj.getItems().length !== 0;
				var sq = sqobj.getItems().length !== 0;
				var fp = fpobj.getItems().length !== 0;
				if (hx || sq || fp) {
					Util.showError("更改报销人，需先删除" + (fp ? " “增值税发票” " : "") +
						(sq ? " “关联申请单” " : "") + (hx ? " “核销借款” " : "") + "的行信息");
					return;
				}
			}

			if (!that.oDialogCostCenterHelpName) {
				that.oDialogCostCenterHelpName = sap.ui.xmlfragment("sh.bz.common.fragment.DialogCostCenterHelpName", that);
				//jQuery.sap.syncStyleClass(that.getOwnerComponent().getContentDensityClass(),that.getView(), that.oDialogCostCenterHelp);
				that.getView().addDependent(that.oDialogCostCenterHelpName);
				//console.log(that.byId('view_Edit_PROPOSER'));
				//sap.ui.getCore().byId('Namelist').removeSelections();
			}
			that.oDialogCostCenterHelpName.open();
		},

		onShowCheckName: function(that) {
			if (!that.oDialogCheckName) {
				that.oDialogCheckName = sap.ui.xmlfragment("sh.bz.common.fragment.DialogCheckName", that);
				//jQuery.sap.syncStyleClass(that.getOwnerComponent().getContentDensityClass(),that.getView(), that.oDialogCostCenterHelp);
				that.getView().addDependent(that.oDialogCheckName);
				//console.log(that.byId('view_Edit_PROPOSER'));
				//sap.ui.getCore().byId('Namelist').removeSelections();
			}
			that.oDialogCheckName.open();
		},

		//bumen
		//部门点击搜索
		onSearchPROPOSER_KOSTL: function(oEvent, that) {
			var path = that.getView().getBindingContext().getPath() + "/";
			var Bukrs = that.getView().getModel().getProperty(path + "Bukrs");
			var value = oEvent.getParameter("query");
			//value = (Array(10).join(0) + value).slice(-10);
			if (!/^[\u4e00-\u9fa5]/.test(value)) {
				var sPath = "/ORGEHSet?$filter=Bukrs eq '" + Bukrs + "' and substringof( '" + (value ? value : '') + "',Orgeh)";
				//var sPath = "/CSKSSet?$filter=Kostl eq '" + (value?value:'') + "'";
				var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
				oDataModel.read(sPath, {
					success: function(oData, response) {
						var model = new sap.ui.model.json.JSONModel(oData);
						that.getView().setModel(model, "model_PROPOSER_KOSTL");
						Util.debug(model);
					},
					error: function(oError) {
						MessageToast.show("get RYBHSet error!");
					}
				});
			} else {
				var sPath = "/ORGEHSet?$filter=Bukrs eq '" + Bukrs + "' and substringof( '" + (value ? value : '') + "',OrgehText)";
				var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
				oDataModel.read(sPath, {
					success: function(oData, response) {
						var model = new sap.ui.model.json.JSONModel(oData);
						that.getView().setModel(model, "model_PROPOSER_KOSTL");
						// that.getView().setModel(model, "model_PROPOSER");
						Util.debug(model);
					},
					error: function(oError) {
						MessageToast.show("get RYBHSet error!");
					}
				});
			}
		},

		//搜索费用类型
		onSearchEtdsc: function(oEvent, that, DKKD) {
			var path = that.getView().getBindingContext().getPath() + "/";
			var Bukrs = that.getView().getModel().getProperty(path + "Bukrs");
			var value = oEvent.getParameter("query");
			var sPath = "/BETYPESet?$filter=( Bukrs eq '" + Bukrs + "' ) and ( Dkkd eq '" + DKKD + "' )";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
			that.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Etdsc");
					//按条件搜索
					var obj = {
						id: "Etdsclist",
						params: ["Etkd", "Etdsc"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					that.setBusy(false);
				},
				error: function(oError) {
					Util.showError("get RECODESet error!");
				}
			});
		},

		onShowCostPartHelp: function(oEvent, that) {
			if (!that.oDialogCostPartHelp) {
				that.oDialogCostPartHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogCostPartHelp", that);
				//jQuery.sap.syncStyleClass(that.getOwnerComponent().getContentDensityClass(),that.getView(), that.oDialogCostCenterHelp);
				that.getView().addDependent(that.oDialogCostPartHelp);
				//sap.ui.getCore().byId('Partlist').removeSelections();
			}
			that.oDialogCostPartHelp.open();
		},
		//展开订单
		onShowAufnrHelp: function(oEvent, that) {
			if (!that.oDialogAufnrHelp) {
				that.oDialogAufnrHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogAufnrHelp", that);
				//jQuery.sap.syncStyleClass(that.getOwnerComponent().getContentDensityClass(),that.getView(), that.oDialogCostCenterHelp);
				that.getView().addDependent(that.oDialogAufnrHelp);
				//sap.ui.getCore().byId('Partlist').removeSelections();
			}
			that.oDialogAufnrHelp.open();
			var value = "";
			var path = that.getView().getBindingContext().getPath() + "/";
			var Bukrs = that.getView().getModel().getProperty(path + "Bukrs");
			var sPath = "/AUFKSet?$filter=Bukrs eq '" + Bukrs + "' and substringof( '" + (value ? value : '') + "',Aufnr)";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Aufnr");
					Util.debug(model);
				},
				error: function(oError) {
					MessageToast.show("get RYBHSet error!");
				}
			});
		},

		onShowCostConHelp: function(oEvent, that) {
			if (!that.oDialogCostConHelp) {
				that.oDialogCostConHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogCostConHelp", that);
				//jQuery.sap.syncStyleClass(that.getOwnerComponent().getContentDensityClass(),that.getView(), that.oDialogCostCenterHelp);
				that.getView().addDependent(that.oDialogCostConHelp);
				//sap.ui.getCore().byId('conlist').removeSelections();
			}
			that.oDialogCostConHelp.open();
		},
		//lirunzhongxin	
		//利润中心点击搜索
		onSearchPROPOSER_PRCTR: function(oEvent, that) {
			var path = that.getView().getBindingContext().getPath() + "/";
			var Bukrs = that.getView().getModel().getProperty(path + "Bukrs");
			var value = oEvent.getParameter("query");
			if (!/^[\u4e00-\u9fa5]/.test(value)) {
				var sPath = "/CEPC_BUKRSSet?$filter=Bukrs eq '" + Bukrs + "' and substringof( '" + (value ? value : '') + "',Prctr)";
				var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
				oDataModel.read(sPath, {
					success: function(oData, response) {
						var model = new sap.ui.model.json.JSONModel(oData);
						that.getView().setModel(model, "model_PROPOSER_PRCTR");
						//console.log(model)
						Util.debug(model);
					},
					error: function(oError) {
						MessageToast.show("get RYBHSet error!");
					}
				});
			} else {
				var sPath = "/CEPC_BUKRSSet?$filter=Bukrs eq '" + Bukrs + "' and substringof( '" + (value ? value : '') + "',Ktext)";
				var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
				oDataModel.read(sPath, {
					success: function(oData, response) {
						var model = new sap.ui.model.json.JSONModel(oData);
						that.getView().setModel(model, "model_PROPOSER_PRCTR");
						// that.getView().setModel(model, "model_PROPOSER");
						Util.debug(model);
					},
					error: function(oError) {
						MessageToast.show("get RYBHSet error!");
					}
				});
			}
		},
		//OPEN费用类型
		onShowEtdscHelp: function(oEvent, that, Dkkd) {
			if (!that.oDialogEtdscHelp) {
				that.oDialogEtdscHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogEtdscHelp", that);
				//jQuery.sap.syncStyleClass(that.getOwnerComponent().getContentDensityClass(),that.getView(), that.oDialogCostCenterHelp);
				that.getView().addDependent(that.oDialogEtdscHelp);
				//sap.ui.getCore().byId('centerlist').removeSelections();
			}
			that.oDialogEtdscHelp.open();
			Util.onSearchEtdsc(oEvent, that, Dkkd);
		},

		onShowCostCenterHelp: function(oEvent, that) {
			if (!that.oDialogCostCenterHelp) {
				that.oDialogCostCenterHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogCostCenterHelp", that);
				//jQuery.sap.syncStyleClass(that.getOwnerComponent().getContentDensityClass(),that.getView(), that.oDialogCostCenterHelp);
				that.getView().addDependent(that.oDialogCostCenterHelp);
				//sap.ui.getCore().byId('centerlist').removeSelections();
			}
			that.oDialogCostCenterHelp.open();
			var value = "";
			var path = that.getView().getBindingContext().getPath() + "/";
			var Bukrs = that.getView().getModel().getProperty(path + "Bukrs");
			var sPath = "/CEPC_BUKRSSet?$filter=Bukrs eq '" + Bukrs + "' and substringof( '" + (value ? value : '') + "',Prctr)";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROFYSQD_SRV_01/", true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_PROPOSER_PRCTR");
					//console.log(model)
					Util.debug(model);
				},
				error: function(oError) {
					MessageToast.show("get RYBHSet error!");
				}
			});
		},

		//费用项目      
		onShowEINM: function(oEvent, that) {
			if (!that.oDialogEinm) {
				that.oDialogEinm = sap.ui.xmlfragment("sh.bz.common.fragment.DialogEinm", that);
				//jQuery.sap.syncStyleClass(that.getOwnerComponent().getContentDensityClass(),that.getView(), that.oDialogCostCenterHelp);
				that.getView().addDependent(that.oDialogEinm);
				//sap.ui.getCore().byId('centerlist').removeSelections();
			}
			that.oDialogEinm.open();
		},

		debug: function(msg) {
			console.info(msg);
		},

		showInfo: function(msg) {
			MessageToast.show(msg);
		},

		showError: function(sDetails) {
			if (this._bMessageOpen) {
				return;
			}
			this._bMessageOpen = true;
			MessageBox.error(
				sDetails, {
					id: "serviceErrorMessageBox",
					//	details: sDetails,
					//	styleClass: this._oComponent.getContentDensityClass(),
					actions: [MessageBox.Action.CLOSE],
					onClose: function() {
						this._bMessageOpen = false;
					}.bind(this)
				}
			);
		},

		onSearchBUKRS: function(oEvent, that) {
			if (oEvent === undefined) {
				var value = "";
			} else {
				var value = oEvent.getParameter("query");
			}
			var loc = location.href.toLowerCase();
			if (loc.indexOf("fiorilaunchpad.html") > 0) {
				that.getOwnerComponent()._userid = sap.ushell.Container.getService("UserInfo").getId();
			} else {
				that.getOwnerComponent()._userid = "ZZLIYJ";
			};
			var userid = that.getOwnerComponent()._userid;
			var sPath = "/T001Set?$filter=Userid  eq '" + userid + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			Util.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_BUKRS");
					//按条件搜索
					var obj = {
						id: "Burklist",
						params: ["Bxbukrs", "Butxt"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					Util.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get TaxcodeSet error!");
					Util.setBusy(false);
				}
			});
		},

		validateSeachFields: function(oEvent, that) {
			var thatView = that.getView(),
				data = thatView.getModel("model_search").oData;
			if (sap.ushell != null)
				userid = sap.ushell.Container.getService("UserInfo").getId(); //in Fiori FLP
			else
				var userid = "ZZLIYJ"; //in SAP WebIDE test environment

			//add search all function s
			var control = that.getOwnerComponent().getModel("CONTROL").getProperty("/control");
			var sPath;
			if (control === 'AL') {

				sPath = "/GRCXSet?$filter=Bukrs eq '" + data.Bukrs + "' and substringof( '" + data.Recode + "',Recode)  and substringof( '" + data.Sname +
					"',Sname) and substringof( '" + data.SnameC + "',SnameC) and substringof( '" + data.Spzt +
					"',Spzt) and substringof( '" + data.OrgehText + "',OrgehText) and substringof( '" + data.Dkkd + "',Dkkd) and substringof( '" +
					data.Zfzt + "',Zfzt)";
			} else {
				sPath = "/GRCXSet?$filter=Usrid eq '" + userid + "' and substringof( '" + data.Recode + "',Recode)  and substringof( '" + data.Sname +
					"',Sname) and substringof( '" + data.SnameC + "',SnameC) and substringof( '" + data.Spzt +
					"',Spzt) and substringof( '" + data.OrgehText + "',OrgehText) and substringof( '" + data.Dkkd + "',Dkkd) and substringof( '" +
					data.Zfzt + "',Zfzt) and Bukrs eq '" + data.Bukrs + "'";
			};
			//add search all function e
			// var that = this;
			// var sPath = "/GRCXSet?$filter=Usrid eq '" + userid + "' and substringof( '" + data.Recode + "',Recode)  and substringof( '" + data.Sname +
			// 	"',Sname) and substringof( '" + data.SnameC + "',SnameC) and substringof( '" + data.Spzt +
			// 	"',Spzt) and substringof( '" + data.OrgehText + "',OrgehText) and substringof( '" + data.Dkkd + "',Dkkd) and substringof( '" +
			// 	data.Zfzt + "',Zfzt)";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROSQDTB_SRV/", true);
			oDataModel.read(encodeURI(sPath), {
				success: function(oData, response) {
					var data_all = new sap.ui.model.json.JSONModel(oData).getData();
					that.getView().setModel(new sap.ui.model.json.JSONModel(data_all), "model_data_all");
					that.toFirstPage(data_all);
				},
				error: function(oError) {
					Util.showError("get RYBHSet error!");
				}
			});
		},
		// 清除校验错误提示
		onClearValueState: function(oEvent) {
			oEvent.getSource().setValueState("None");
			oEvent.getSource().setValueStateText("");
		},

		// 校验数据
		validateInputFields: function(that) {
			var bInputValid = true;
			var bFocus = false;
			var data = that.getView().getModel("model_edit").getData();
			//判断申请人code是否为空
			if (that.byId("view_Edit_PROPOSER")) {
				if (!data.PROPOSERNumber || !data.PROPOSERNumber.trim()) {
					bInputValid = false;
					data.PROPOSERValueState = "Error";
					data.PROPOSERValueStateText = "必填项不能为空";
					if (!bFocus) {
						bFocus = true;
						that.byId("view_Edit_PROPOSER").focus();
					}
				}
			}
			//判断申请人部门code是否为空
			if (that.byId("view_Edit_PROPOSER_KOSTL")) {
				if (!data.PROPOSER_KOSTLNumber || !data.PROPOSER_KOSTLNumber.trim()) {
					bInputValid = false;
					data.PROPOSER_KOSTLState = "Error";
					data.PROPOSER_KOSTLtateText = "必填项不能为空";
					if (!bFocus) {
						bFocus = true;
						that.byId("view_Edit_PROPOSER_KOSTL").focus();
					}
				}
			}
			//金额判断
			if (that.byId("view_Edit_AMOUNTSUM")) {
				if (data.AMOUNTSUM <= 0) {
					bInputValid = false;
					data.AMOUNTSUMState = "Error";
					data.AMOUNTSUMStateText = "请输入正确的金额";
					if (!bFocus) {
						bFocus = true;
						that.byId("view_Edit_AMOUNTSUM").focus();
					}
				}
			}
			//联系方式
			if (that.byId("view_Edit_TELNUM")) {
				if (!(/^(1[3578])\d{9}$/.test(data.TELNUM))) {
					bInputValid = false;
					data.TELNUMState = "Error";
					data.TELNUMStateText = "请输入正确的手机号";
					if (!bFocus) {
						bFocus = true;
						that.byId("view_Edit_TELNUM").focus();
					}
				}
			}
			// 判断利润中心code是否为空
			if (that.byId("view_Edit_PROPOSER_PRCTR")) {
				if (!data.PROPOSER_PRCTRNumber || !data.PROPOSER_PRCTRNumber.trim()) {
					bInputValid = false;
					data.PROPOSER_PRCTRState = "Error";
					data.PROPOSER_PRCTRStateText = "必填项不能为空";
					if (!bFocus) {
						bFocus = true;
						that.byId("view_Edit_PROPOSER_PRCTR").focus();
					}
				}
			}

			//判断费用用途是否为空
			if (that.byId("view_Edit_ACCOUNTFOR")) {
				if (!data.ACCOUNTFOR || !data.ACCOUNTFOR.trim()) {
					bInputValid = false;
					data.ACCOUNTFORState = "Error";
					data.ACCOUNTFORStateText = "必填项不能为空";
					if (!bFocus) {
						bFocus = true;
						that.byId("view_Edit_ACCOUNTFOR").focus();
					}
				}
			}

			that.getView().getModel("model_edit").refresh();
			return bInputValid;
		},

		// =================费用项目====================
		// 2.搜索odata帮助
		onSearchEinm: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			// var data = that.getView().getModel("GLOBLEDATA").oData.DKKD;
			var path = sap.ui.getCore().CLBX_HOMEVIEW.getBindingContext();
			var kostl = sap.ui.getCore().CLBX_HOMEVIEW.getModel().getProperty(path + "/Kostl");
			var Etkd = sap.ui.getCore().CLBX_HOMEVIEW.getModel().getProperty(path + "/Etkd");
			var Bukrs = sap.ui.getCore().CLBX_HOMEVIEW.getModel().getProperty(path + "/Bukrs");
			var sPath = "/BetitmSet?$filter=Etkd eq '" + Etkd + "' and Bukrs eq '" + Bukrs + "' and Kostl eq '" + kostl + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			Util.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Einm");
					//按条件搜索
					var obj = {
						id: "Einmlist",
						params: ["Einm", "Eikd"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					Util.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get RybhSet error!");
					Util.setBusy(false);
				}
			});
		},
		// =================税码====================
		// 2.搜索odata帮助
		onSearchMwskz: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			// var value = oEvent.getParameter("query");
			var sPath = "/TaxcodeSet";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			Util.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Mwskz");
					//按条件搜索
					var obj = {
						id: "Mwskzlist",
						params: ["Mwskz", "Text1"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					Util.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get TaxcodeSet error!");
					Util.setBusy(false);
				}
			});
		},
		// =================订单====================
		// 2.搜索odata帮助
		onSearchAufnrClbx: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			var Bukrs = sap.ui.getCore().AppContext.Bukrs;
			var sPath = "/AufkSet?$filter=Bukrs eq '" + Bukrs + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			Util.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Aufnr");
					//按条件搜索
					var obj = {
						id: "Aufnrlist",
						params: ["Aufnr", "Ktext"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					Util.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get AufkSet error!");
					Util.setBusy(false);
				}
			});
		},
		// =================交通工具====================
		// 2.搜索odata帮助
		onSearchVektp: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			var sPath = "/VekSet";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			Util.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Vektp");
					//按条件搜索
					var obj = {
						id: "Vektplist",
						params: ["Vektp", "Veknm"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					Util.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get VekSet error!");
					Util.setBusy(false);
				}
			});
		},
		// =================舱位席别====================
		// 2.搜索odata帮助
		onSearchSps: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			var path = that.getView().getBindingContext().getPath() + "/";
			var Vektp = that.getView().getModel().getProperty(path).Vektp;
			if (!Vektp) {
				sap.m.MessageBox.information("请先选择交通工具", {
					title: "警告",
					onClose: null,
					styleClass: "",
					initialFocus: null,
					textDirection: sap.ui.core.TextDirection.Inherit
				});
				return;
			}
			var sPath = "/VeksSet?$filter=Vektp eq '" + Vektp + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			Util.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Sps");
					//按条件搜索
					var obj = {
						id: "Spslist",
						params: ["Sps", "Spsdsc"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					Util.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get VekSet error!");
					Util.setBusy(false);
				}
			});
		},
		// =================城市====================
		// 2.搜索odata帮助
		onSearchCtkd: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			var Bukrs = sap.ui.getCore().AppContext.Bukrs;
			var sPath = "/BctSet?$filter=Bukrs eq '" + Bukrs + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			Util.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Ctkd");
					//按条件搜索
					var obj = {
						id: "Ctkdlist",
						params: ["Ctkd", "Ctnm"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					Util.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get BctSet error!");
					Util.setBusy(false);
				}
			});
		},
		// =================地区类别====================
		// 2.搜索odata帮助
		onSearchDqlb: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			var sPath = "/DqlbSet?$filter=substringof('" + (value ? value : '') + "',Zzdqlbms)";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			Util.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Dqlb");
					//按条件搜索
					var obj = {
						id: "Zzdqlblist",
						params: ["Zzdqlb", "Zzdqlbms"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					Util.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get BctSet error!");
					Util.setBusy(false);
				}
			});
		},
		// =================功能范围====================
		// 2.搜索odata帮助
		onSearchFkber: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			var sPath = "/TfkbtSet";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			that.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Fkber");
					//按条件搜索
					var obj = {
						id: "Fkberlist",
						params: ["Fkber", "Fkbtx"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					that.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get TfkbtSet error!");
					that.setBusy(false);
				}
			});
		},
		// =================车型====================
		// 2.搜索odata帮助
		onSearchZzcx: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			var Bukrs = sap.ui.getCore().AppContext.Bukrs;
			var sPath = "/CxSet?$filter=Bukrs eq '" + Bukrs + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			that.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Zzcx");
					//按条件搜索
					var obj = {
						id: "Zzcxlist",
						params: ["Zzcx", "Zzcxms"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					that.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get ZzcxSet error!");
					that.setBusy(false);
				}
			});
		},
		// =================车号====================
		// 2.搜索odata帮助
		onSearchZzch: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			var path = that.getView().getBindingContext().getPath() + "/";
			var Zzcx = that.getView().getModel().getProperty(path).Zzcx;
			if (!Zzcx) {
				sap.m.MessageBox.information("请先选择车型", {
					title: "警告",
					onClose: null,
					styleClass: "",
					initialFocus: null,
					textDirection: sap.ui.core.TextDirection.Inherit
				});
				return;
			}
			var Bukrs = sap.ui.getCore().AppContext.Bukrs;
			var sPath = "/ChSet?$filter=Bukrs eq '" + Bukrs + "' and Zzcx eq '" + Zzcx + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			that.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Zzch");
					//按条件搜索
					var obj = {
						id: "Zzchlist",
						params: ["Zzch", "Zzchms"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					that.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get HTHSet error!");
					that.setBusy(false);
				}
			});
		},
		// =================分线核算====================
		// 2.搜索odata帮助
		onSearchZzfxcb: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			var Bukrs = sap.ui.getCore().AppContext.Bukrs;
			var sPath = "/FxcbSet?$filter=Bukrs eq '" + Bukrs + "' and substringof('" + (value ? value : '') + "',Zzfxcb)";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			that.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Zzfxcb");
					//按条件搜索
					var obj = {
						id: "Zzfxcblist",
						params: ["Zzfxcb", "Zzfxcbms"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					that.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get FxcbSet error!");
					that.setBusy(false);
				}
			});
		},
		// =================辅助核算01====================
		// 2.搜索odata帮助
		onSearchZzfzhs01: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			var Bukrs = sap.ui.getCore().AppContext.Bukrs;
			var sPath = "/Fzhs01Set?$filter=Bukrs eq '" + Bukrs + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			that.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Zzfzhs01");
					//按条件搜索
					var obj = {
						id: "Zzfzhs01slist",
						params: ["Zzfzhs01", "Zzfzhs01ms"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					that.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get HTHSet error!");
					that.setBusy(false);
				}
			});
		},
		// =================辅助核算02====================
		// 2.搜索odata帮助
		onSearchZzfzhs02: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			var Bukrs = sap.ui.getCore().AppContext.Bukrs;
			var sPath = "/Fzhs02Set?$filter=Bukrs eq '" + Bukrs + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			that.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Zzfzhs02");
					//按条件搜索
					var obj = {
						id: "Zzfzhs02slist",
						params: ["Zzfzhs02", "Zzfzhs02ms"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					that.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get HTHSet error!");
					that.setBusy(false);
				}
			});
		},
		// =================辅助核算03====================
		// 2.搜索odata帮助
		onSearchZzfzhs03: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			var Bukrs = sap.ui.getCore().AppContext.Bukrs;
			var sPath = "/Fzhs03Set?$filter=Bukrs eq '" + Bukrs + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			that.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Zzfzhs03");
					//按条件搜索
					var obj = {
						id: "Zzfzhs03slist",
						params: ["Zzfzhs03", "Zzfzhs03ms"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					that.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get HTHSet error!");
					that.setBusy(false);
				}
			});
		},
		// =================辅助核算04====================
		// 2.搜索odata帮助
		onSearchZzfzhs04: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			var Bukrs = sap.ui.getCore().AppContext.Bukrs;
			var sPath = "/Fzhs04Set?$filter=Bukrs eq '" + Bukrs + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			that.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Zzfzhs04");
					//按条件搜索
					var obj = {
						id: "Zzfzhs04slist",
						params: ["Zzfzhs04", "Zzfzhs04ms"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					that.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get HTHSet error!");
					that.setBusy(false);
				}
			});
		},
		// =================辅助核算05====================
		// 2.搜索odata帮助
		onSearchZzfzhs05: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			var Bukrs = sap.ui.getCore().AppContext.Bukrs;
			var sPath = "/Fzhs05Set?$filter=Bukrs eq '" + Bukrs + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			that.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Zzfzhs05");
					//按条件搜索
					var obj = {
						id: "Zzfzhs05slist",
						params: ["Zzfzhs05", "Zzfzhs05ms"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					that.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get HTHSet error!");
					that.setBusy(false);
				}
			});
		},
		// =================辅助核算类别====================
		// 2.搜索odata帮助
		onSearchZzfzhslb: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			var Bukrs = sap.ui.getCore().AppContext.Bukrs;
			var sPath = "/FzlbSet?$filter=Bukrs eq '" + Bukrs + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			that.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Zzfzhslb");
					//按条件搜索
					var obj = {
						id: "Zzfzhslblist",
						params: ["Zzfzhslb", "Zzfzhslbms"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					that.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get HTHSet error!");
					that.setBusy(false);
				}
			});
		},
		// =================辅助核算内容====================
		// 2.搜索odata帮助
		onSearchZzfzhsnr: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			var Bukrs = sap.ui.getCore().AppContext.Bukrs;
			var sPath = "/FznrSet?$filter=Bukrs eq '" + Bukrs + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			that.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Zzfzhsnr");
					//按条件搜索
					var obj = {
						id: "Zzfzhsnrlist",
						params: ["Zzfzhsnr", "Zzfzhsnrms"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					that.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get HTHSet error!");
					that.setBusy(false);
				}
			});
			// var oFilter = new sap.ui.model.Filter("Fbkid", sap.ui.model.FilterOperator.Contains, value);
			// this.getView().byId("Fbkidlist").getBinding("items").filter([oFilter]);
		},
		// =================业务类型====================
		// 2.搜索odata帮助
		onSearchZzghjh: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			var Bukrs = sap.ui.getCore().AppContext.Bukrs;
			var sPath = "/GhjfxmSet?$filter=Bukrs eq '" + Bukrs + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			that.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Zzghjh");
					//按条件搜索
					var obj = {
						id: "Zzghjhlist",
						params: ["Zzghjh", "Zzghjhms"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					that.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get HTHSet error!");
					that.setBusy(false);
				}
			});
			// var oFilter = new sap.ui.model.Filter("Fbkid", sap.ui.model.FilterOperator.Contains, value);
			// this.getView().byId("Fbkidlist").getBinding("items").filter([oFilter]);
		},
		// // =================合同编号====================
		// 2.搜索odata帮助
		onSearchZzhtbh: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			var Bukrs = sap.ui.getCore().AppContext.Bukrs;
			var sPath = "/HthSet?$filter=Bukrs eq '" + Bukrs + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			that.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Zzhtbh");
					//按条件搜索
					var obj = {
						id: "Zzhtbhlist",
						params: ["Zzhth", "Zzhthms"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					that.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get HthSet error!");
					that.setBusy(false);
				}
			});
		},
		// =================往来业务性质====================
		// 2.搜索odata帮助
		onSearchZzjshkdw: function(oEvent, that) {
			var value = "";
			if (oEvent !== undefined) {
				value = oEvent.getParameter("query");
			}
			var path = that.getView().getBindingContext().getPath() + "/";
			var Bukrs = that.getView().getModel().getProperty(path + "Bukrs");
			var sPath = "/JshkdwSet?$filter=Bukrs eq '" + Bukrs + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			that.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Zzjshkdw");
					//按条件搜索
					var obj = {
						id: "Zzjshkdwlist",
						params: ["Zzjshkdw", "Zzjshkdwms"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					that.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get HTHSet error!");
					that.setBusy(false);
				}
			});
		},

		getUserId: function() {
			//cache
			if (this._userid) {
				return this._userid;
			}

			var loc = location.href.toLowerCase();
			if (loc.indexOf("fiorilaunchpad.html") > 0) {
				this._userid = sap.ushell.Container.getService("UserInfo").getId();
			} else {
				this._userid = "ZZLIUC";
			}
			return this._userid;
		}

	};
	return Util;
});
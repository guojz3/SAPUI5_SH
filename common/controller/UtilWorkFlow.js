sap.ui.define([
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sh/bz/common/controller/Util"
], function(MessageToast, MessageBox, Util) {
	"use strict";

	var UtilWorkFlow = {
		submited: function(obj, that) {
			var sPath = "/STARTANDSUBSet?$filter=Zlcid eq '" + obj.id + "' and Zstsx eq '{AMT:" + obj.amountsum + ",SNAME_S:\"" + obj.name +
				"\",e_business_code:\"" + obj.business_code + "\",e_business_name:\"" + obj.business_name + "\",ORGEH:\"" + obj.Orgeh +
				"\",AUFNR:\"" + obj.Aufnr + "\"}' and Zyhm eq '" + obj.userid + "'";
			var Zstsx = " {AMT:" + obj.amountsum + ",SNAME_S:\"" + obj.name +
				"\",e_business_code:\"" + obj.business_code + "\",e_business_name:\"" + obj.business_name + "\",ORGEH:\"" + obj.Orgeh + "\",AUFNR:\"" + obj.Aufnr + "\"}";
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPRO_WF_FYBX_SRV/", true);
			Util.debug(sPath);
			Util.setBusy(true);
			oModel.read(sPath, {
				success: function(oData, oResponse) {
					Util.setBusy(false);
					Util.debug(oData);
					if (oData.results[0].Flag === "3") {
						oData.results[0].Zstsx = Zstsx;
						oData.results[0].Zslbm = obj.Zslbm;
						oData.results[0].Zyhm = obj.userid;
						that.getView().setModel(new sap.ui.model.json.JSONModel(oData), "model_CHECK");
						Util.onShowCheckName(that);
					} else if (oData.results[0].Flag === "0") {
						Util.showInfo("单据提交成功");
						that.setscreen("C");
						if (that.getView().byId("view_Edit_save") === undefined) {
							var data = that.getView().getModel("model_edit");
							data.button_save_enabled = false;
							data.button_submit_enabled = true;
							that.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");
						} else {
							that.setscreen("C");
						}

					} else {
						Util.showError(oData.results[0].Msg);
					}
				},
				error: function(error) {
					Util.setBusy(false);
					Util.showError("单据提交失败! " + error.message);
					Util.debug(error);
				},
				async: true
			});
		},

		onConfirmCheckName: function(oEvent, that) {
			var odata = that.getView().getModel("model_CHECK").getData();
			var contexts = sap.ui.getCore().byId("table1").getSelectedContextPaths();
			var index = contexts.map(function(c) {
				return c.split("/")[2];
			}); //shuzu xiabiao
			var data = that.getView().getModel("model_CHECK").getData();
			var value = index.map(function(dex) {
				return data.results[dex];
			});
			var id = value.map(function(obj) {
				return obj.Userid;
			});
			var Zslbm = odata.results[0].Instancecode;
			var Zstsx = odata.results[0].Zstsx;
			var Zspr = id.join(",");
			var Zyhm = odata.results[0].Zyhm;
			var sPath = "SUBMITSet?$filter=Zslbm eq '" + Zslbm + "' and Zstsx eq '" + Zstsx + "' and Zspr eq '" + Zspr + "' and Zyhm eq '" +
				Zyhm + "'";
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPRO_WF_FYBX_SRV/", true);
			Util.debug(sPath);
			Util.setBusy(true);
			//var that = this;
			oModel.read(sPath, {
				success: function(oData, oResponse) {
					Util.setBusy(false);
					Util.debug(oData);
					if (oData.results[0].Flag === "3") {
						Util.showInfo("单据提交失败! " + oData.results[0].Msg);
					} else if (oData.results[0].Flag === "0") {
						Util.showInfo("单据提交成功");
						that.getView().byId("fileUploader").setVisible(false);
						that.getView().byId("fileUpload_delete").setVisible(false);
						var model = [];
						that.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_CHECK");
						that.oDialogCheckName.close();
						if (that.getView().byId("view_Edit_save") === undefined) {
							var data = that.getView().getModel("model_edit");
							data.button_save_enabled = false;
							data.button_submit_enabled = false;
							that.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");
						} else {
							that.setscreen("C");
						}
					} else {
						Util.showInfo("单据提交失败! " + oData.results[0].Msg);
					}
				},
				error: function(error) {
					Util.setBusy(false);
					Util.showInfo("单据提交失败! " + error.message);
					Util.debug(error);
				},
				async: true
			});
		},
		//重启并提交  //slbm lcid useid
		restartflow: function(oEntry, that, obj) {
			Util.setBusy(true);
			var Zstsx = " {AMT:" + obj.amountsum + ",SNAME_S:\"" + obj.name +
				"\",e_business_code:\"" + obj.business_code + "\",e_business_name:\"" + obj.business_name + "\",ORGEH:\"" + obj.Orgeh + "\",AUFNR:\"" + obj.Aufnr + "\"}";
			var sPath = "/RESTARTINSTANSet";
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPRO_WF_FYBX_SRV/");
			oModel.create(sPath, oEntry, {
				success: function(oData, oResponse) {
					Util.setBusy(false);
					if (oData.Flag === "0") {
						Util.showInfo("成功");
						//提交流程
						var oModels = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPRO_WF_FYBX_SRV/");
						var sPaths = "/SUBMITSet?$filter=Zslbm eq '" + oEntry.Zslbm + "' and Zstsx eq '" + Zstsx + "' and Zyhm eq '" +
							oEntry.Zyhm + "' ";
						Util.setBusy(true);
						oModels.read(sPaths, {
							success: function(oDatas, oResponses) {
								Util.setBusy(false);
								if (oDatas.results[0].Flag === "0") {
									Util.showInfo("单据提交成功");
									that.getView().byId("fileUploader").setVisible(false);
									that.getView().byId("fileUpload_delete").setVisible(false);
									that.setscreen("C");
								} else if (oDatas.Flag === "E") {
									Util.showError("链接失败。请重新撤回");
								} else if (oDatas.results[0].Flag === "2") {
									oDatas.results[0].Zstsx = Zstsx;
									oDatas.results[0].Zslbm = oEntry.Zslbm;
									oDatas.results[0].Zyhm = oEntry.Zyhm;
									that.getView().setModel(new sap.ui.model.json.JSONModel(oDatas), "model_CHECK");
									Util.onShowCheckName(that);
								} else {
									Util.showError(oDatas.Msg);
								}
							},
							error: function(error) {
								Util.setBusy(false);
								Util.showError("失败!");
							},
							async: false
						});
						// that.preparedata();
					} else if (oData.Flag === "E") {
						Util.showError("链接失败。请重新撤回");
					} else {
						Util.showError(oData.Msg);
					}
				},
				error: function(error) {
					Util.showError("失败!");
				},
				async: false
			});
		},

		//CL重新流程
		clrestartflow: function(oEntry, that, obj) {
			Util.setBusy(true);
			var Zstsx = " {AMT:" + obj.amountsum + ",SNAME_S:\"" + obj.name +
				"\",e_business_code:\"" + obj.business_code + "\",e_business_name:\"" + obj.business_name + "\",ORGEH:\"" + obj.Orgeh + "\",AUFNR:\"" + obj.Aufnr + "\"}";
			var sPath = "/RESTARTINSTANSet";
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPRO_WF_FYBX_SRV/");
			oModel.create(sPath, oEntry, {
				success: function(oData, oResponse) {
					Util.setBusy(false);
					if (oData.Flag === "0") {
						Util.showInfo("成功");
						//提交流程
						var oModels = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPRO_WF_YS_FYBX_SRV/");
						var sPaths = "/YS_SUBMITSet?$filter=Zslbm eq '" + oEntry.Zslbm + "' and Zstsx eq '" + Zstsx + "' and Zyhm eq '" +
							oEntry.Zyhm + "' and Recode eq '" + obj.business_code + "'";
						Util.setBusy(true);
						oModels.read(sPaths, {
							success: function(oDatas, oResponses) {
								Util.setBusy(false);
								if (oDatas.results[0].Flag === "0") {
									Util.showInfo("单据提交成功");
									that.setscreen("C");
								} else if (oDatas.Flag === "E") {
									Util.showError("链接失败。请重新撤回");
								} else if (oDatas.results[0].Flag === "2") {
									oDatas.results[0].Zstsx = Zstsx;
									oDatas.results[0].Zslbm = oEntry.Zslbm;
									oDatas.results[0].Zyhm = oEntry.Zyhm;
									that.getView().setModel(new sap.ui.model.json.JSONModel(oDatas), "model_CHECK");
									Util.onShowCheckName(that);
								} else {
									Util.showError(oDatas.Msg);
								}
							},
							error: function(error) {
								Util.setBusy(false);
								Util.showError("失败!");
							},
							async: false
						});
						// that.preparedata();
					} else if (oData.Flag === "E") {
						Util.showError("链接失败。请重新撤回");
					} else {
						Util.showError(oData.Msg);
					}
				},
				error: function(error) {
					Util.showError("失败!");
				},
				async: false
			});
		},

		//提交流程
		subed: function(obj, that) {
			Util.setBusy(true);
			var Zstsx = "{AMT:" + obj.amountsum + ",SNAME_S:\"" + obj.name +
				"\",e_business_code:\"" + obj.business_code + "\",e_business_name:\"" + obj.business_name + "\",ORGEH:\"" + obj.Orgeh + "\",AUFNR:\"" + obj.Aufnr + "\"}";
			var oModels = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPRO_WF_FYBX_SRV/");
			var sPaths = "/SUBMITSet?$filter=Zslbm eq '" + obj.Zslbm + "' and Zstsx eq '" + Zstsx + "' and Zyhm eq '" +
				obj.Zyhm + "'";
			oModels.read(sPaths, {
				success: function(oDatas, oResponses) {
					Util.setBusy(false);
					if (oDatas.results[0].Flag === "0") {
						Util.showInfo("单据提交成功");
						that.getView().byId("fileUploader").setVisible(false);
						that.getView().byId("fileUpload_delete").setVisible(false);
						that.setscreen("C");
					} else if (oDatas.Flag === "E") {
						Util.showError("链接失败。请重新撤回");
					} else if (oDatas.results[0].Flag === "2") {
						oDatas.results[0].Zstsx = Zstsx;
						oDatas.results[0].Zslbm = obj.Zslbm;
						oDatas.results[0].Zyhm = obj.Zyhm;
						that.getView().setModel(new sap.ui.model.json.JSONModel(oDatas), "model_CHECK");
						Util.onShowCheckName(that);
					} else {
						Util.showError(oDatas.results[0].Msg);
					}
				},
				error: function(error) {
					Util.setBusy(false);
					Util.showError("失败!");
				},
				async: true
			});
		},

		ys_submited: function(obj, that) {
			var sPath = "/YS_STARTANDSUBMITSet?$filter=Zlcid eq '" + obj.id + "' and Zstsx eq '{AMT:" + obj.amountsum + ",SNAME_S:\"" + obj.name +
				"\",e_business_code:\"" + obj.business_code + "\",e_business_name:\"" + obj.business_name + "\",ORGEH:\"" + obj.Orgeh +
				"\",AUFNR:\"" + obj.Aufnr + "\"}' and Zyhm eq '" + obj.userid + "' and Recode eq '" + obj.business_code + "'";
			var Zstsx = "{AMT:" + obj.amountsum + ",SNAME_S:\"" + obj.name +
				"\",e_business_code:\"" + obj.business_code + "\",e_business_name:\"" + obj.business_name + "\",ORGEH:\"" + obj.Orgeh + "\",AUFNR:\"" + obj.Aufnr + "\"}";
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPRO_WF_YS_FYBX_SRV/", true);
			Util.debug(sPath);
			Util.setBusy(true);
			oModel.read(sPath, {
				success: function(oData, oResponse) {
					Util.setBusy(false);
					Util.debug(oData);
					if (oData.results[0].Flag === "3") {
						oData.results[0].Zstsx = Zstsx;
						oData.results[0].Zslbm = obj.Zslbm;
						oData.results[0].Zyhm = obj.userid;
						that.getView().setModel(new sap.ui.model.json.JSONModel(oData), "model_CHECK");
						Util.onShowCheckName(that);
					} else if (oData.results[0].Flag === "0") {
						Util.showInfo("单据提交成功");
						that.getView().byId("fileUploader").setVisible(false);
						that.getView().byId("fileUpload_delete").setVisible(false);
						if (that.getView().byId("view_Edit_save") === undefined) {
							var data = that.getView().getModel("model_edit");
							data.button_save_enabled = false;
							data.button_submit_enabled = true;
							that.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_edit");
						} else {
							that.setscreen("C");
						}

					} else {
						Util.showError("单据提交失败! " + oData.results[0].Msg);
					}
				},
				error: function(error) {
					Util.setBusy(false);
					Util.showError("单据提交失败! " + error.message);
					Util.debug(error);
				},
				async: true
			});
		},

		Ys_subed: function(obj, that) {
			Util.setBusy(true);
			var Zstsx = "{AMT:" + obj.amountsum + ",SNAME_S:\"" + obj.name +
				"\",e_business_code:\"" + obj.business_code + "\",e_business_name:\"" + obj.business_name + "\",ORGEH:\"" + obj.Orgeh + "\",AUFNR:\"" + obj.Aufnr + "\"}";
			var oModels = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPRO_WF_YS_FYBX_SRV/");
			var sPaths = "/YS_SUBMITSet?$filter=Zslbm eq '" + obj.Zslbm + "' and Zstsx eq '" + Zstsx + "' and Zyhm eq '" +
				obj.Zyhm + "' and Recode eq '" + obj.business_code + "'";
			oModels.read(sPaths, {
				success: function(oDatas, oResponses) {
					Util.setBusy(false);
					if (oDatas.results[0].Flag === "0") {
						Util.showInfo("单据提交成功");
						that.getView().byId("fileUploader").setVisible(false);
						that.getView().byId("fileUpload_delete").setVisible(false);
						that.setscreen("C");
					} else if (oDatas.Flag === "E") {
						Util.showError("链接失败。请重新撤回");
					} else if (oDatas.results[0].Flag === "2") {
						oDatas.results[0].Zstsx = Zstsx;
						oDatas.results[0].Zslbm = obj.Zslbm;
						oDatas.results[0].Zyhm = obj.Zyhm;
						that.getView().setModel(new sap.ui.model.json.JSONModel(oDatas), "model_CHECK");
						Util.onShowCheckName(that);
					} else {
						Util.showError(oDatas.results[0].Msg);
					}
				},
				error: function(error) {
					Util.setBusy(false);
					Util.showError("失败!");
				},
				async: true
			});
		}
	};
	return UtilWorkFlow;
});
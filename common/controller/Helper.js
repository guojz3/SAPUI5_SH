sap.ui.define([], function() {

	var Helper = {

		getUserInfo: function() { //取登录用户的相关信息放到"OtherUserInfoModel"中
			sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(), "UserInfoModel");
			// If on Fiori Launchpad
			var userId = sap.ushell.Container.getService("UserInfo").getId();

			// Read logon user info from Gateway
			//var userId = "ZHANGYING";// test userId
			var oBpNumberModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZJKODATA_SRV/", true);
			var sPath = "PERSIDSet('" + userId + "')";
			oBpNumberModel.read(sPath, {
				async: false,
				success: function(BpData) {
					var sBpNumber = BpData.Psnid; //人员代码
					var sBpName = BpData.Pernm; //人员名称
					var sOrgId = BpData.Bukrs; //机构代码
					var sOrgName = BpData.Buktx; //机构名称
					var sFistl = BpData.Fistl; //部门代码（预算中心）
					var sNamex = BpData.Namex; //部门名称
					var sJobnr = BpData.Jobnr; //岗位代码
					var sJobxt = BpData.Jobxt; //岗位名称
					var sGrdnr = BpData.Grdnr; //职级代码
					var sBxlvl = BpData.Bxlvl; //报销级别
					var sUntid = BpData.Untid; //单位代码
					var sUntnm = BpData.Untnm; //单位名称
					var sDepid = BpData.Depid; //部门代码
					var sDepnm = BpData.Depnm; //部门名称

					sap.ui.getCore().getModel("UserInfoModel").setProperty("/UserBpNumber", sBpNumber);
					sap.ui.getCore().getModel("UserInfoModel").setProperty("/UserBpName", sBpName);
					sap.ui.getCore().getModel("UserInfoModel").setProperty("/Org", sOrgId);
					sap.ui.getCore().getModel("UserInfoModel").setProperty("/Orgx", sOrgName);
					sap.ui.getCore().getModel("UserInfoModel").setProperty("/Fistl", sFistl);
					sap.ui.getCore().getModel("UserInfoModel").setProperty("/Namex", sNamex);
					sap.ui.getCore().getModel("UserInfoModel").setProperty("/Jobnr", sJobnr);
					sap.ui.getCore().getModel("UserInfoModel").setProperty("/Jobxt", sJobxt);
					sap.ui.getCore().getModel("UserInfoModel").setProperty("/Grdnr", sGrdnr);
					sap.ui.getCore().getModel("UserInfoModel").setProperty("/Bxlvl", sBxlvl);
					sap.ui.getCore().getModel("UserInfoModel").setProperty("/Bxlvl", sBxlvl);
					sap.ui.getCore().getModel("UserInfoModel").setProperty("/Untid", sUntid);
					sap.ui.getCore().getModel("UserInfoModel").setProperty("/Untnm", sUntnm);
					sap.ui.getCore().getModel("UserInfoModel").setProperty("/Depid", sDepid);
					sap.ui.getCore().getModel("UserInfoModel").setProperty("/Depnm", sDepnm);
					userId = sBpNumber;
				}
			});
			return userId;
		},

		getOtherUserInfo: function(userId) { //根据用户ID取用户的相关信息放到"OtherUserInfoModel"中
			sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(), "OtherUserInfoModel");
			var oBpNumberModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZJKODATA_SRV/", true);
			var sPath = "PERSIDSet('" + userId + "')";
			oBpNumberModel.read(sPath, {
				async: false,
				success: function(BpData) {
					var sBpNumber = BpData.Psnid; //人员代码
					var sBpName = BpData.Pernm; //人员名称
					var sOrgId = BpData.Bukrs; //机构代码
					var sOrgName = BpData.Buktx; //机构名称
					var sFistl = BpData.Fistl; //部门代码
					var sNamex = BpData.Namex; //部门名称
					var sJobnr = BpData.Jobnr; //岗位代码
					var sJobxt = BpData.Jobxt; //岗位名称
					var sGrdnr = BpData.Grdnr; //职级代码
					var sBxlvl = BpData.Bxlvl; //报销级别
					var sUntid = BpData.Untid; //单位代码
					var sUntnm = BpData.Untnm; //单位名称
					var sDepid = BpData.Depid; //部门代码
					var sDepnm = BpData.Depnm; //部门名称
					sap.ui.getCore().getModel("OtherUserInfoModel").setProperty("/UserBpNumber", sBpNumber);
					sap.ui.getCore().getModel("OtherUserInfoModel").setProperty("/UserBpName", sBpName);
					sap.ui.getCore().getModel("OtherUserInfoModel").setProperty("/Org", sOrgId);
					sap.ui.getCore().getModel("OtherUserInfoModel").setProperty("/Orgx", sOrgName);
					sap.ui.getCore().getModel("OtherUserInfoModel").setProperty("/Fistl", sFistl);
					sap.ui.getCore().getModel("OtherUserInfoModel").setProperty("/Namex", sNamex);
					sap.ui.getCore().getModel("OtherUserInfoModel").setProperty("/Jobnr", sJobnr);
					sap.ui.getCore().getModel("OtherUserInfoModel").setProperty("/Jobxt", sJobxt);
					sap.ui.getCore().getModel("OtherUserInfoModel").setProperty("/Grdnr", sGrdnr);
					sap.ui.getCore().getModel("OtherUserInfoModel").setProperty("/Bxlvl", sBxlvl);
					sap.ui.getCore().getModel("OtherUserInfoModel").setProperty("/Untid", sUntid);
					sap.ui.getCore().getModel("OtherUserInfoModel").setProperty("/Untnm", sUntnm);
					sap.ui.getCore().getModel("OtherUserInfoModel").setProperty("/Depid", sDepid);
					sap.ui.getCore().getModel("OtherUserInfoModel").setProperty("/Depnm", sDepnm);
					userId = sBpNumber;
				}
			});
			return userId;
		},

		StringtoDecimal: function(sValue) {
			/*var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
      	  minFractionDigits: 2,
  		  maxFractionDigits: 2,
  		  groupingEnabled: true,
  		  groupingSeparator: "",
  		  decimalSeparator: "."
  		});
    	return oNumberFormat.format(Str);*/
			if (!sValue) {
				return "0.00";
			}
			return parseFloat(sValue).toFixed(2).toString();
		},

		DateToUTC: function(date) {
			var y = date.getUTCFullYear();
			var m = date.getUTCMonth();
			var d = date.getUTCDate();
			var iM = Date.UTC(y, m, d);
			var UtcDate = new Date(iM);
			if (date.getDate() > UtcDate.getDate()) {
				UtcDate = new Date(UtcDate.setDate(UtcDate.getDate() + 1));
			}
			return UtcDate;
		},
		
		DateDiff: function(sDate1, sDate2) { //sDate1和sDate2是2006-12-18格式  
			var aDate, oDate1, oDate2, iDays
			aDate = sDate1.split("-")
			oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //转换为12-18-2006格式  
			aDate = sDate2.split("-")
			oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
			iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数  
			return iDays
		},
		/**
		 * Deep clone object
		 * 
		 * @param {Object} obj the original object
		 * @return {Object} the cloned object
		 */
		deepClone: function(obj) {
			var objClone;
			if (!obj) {
				return null;
			}
			if (obj.constructor === Object) {
				objClone = new obj.constructor();
			} else {
				objClone = new obj.constructor(obj.valueOf());
			}
			for (var key in obj) {
				if (objClone[key] !== obj[key]) {
					if (typeof(obj[key]) === "object") {
						objClone[key] = this.deepClone(obj[key]);
					} else {
						objClone[key] = obj[key];
					}
				}
			}
			objClone.toString = obj.toString;
			objClone.valueOf = obj.valueOf;
			return objClone;
		},
		
		//访问odata
		_initData: function(odataModel, spath, modelName, that) {
			var oDataModel = new sap.ui.model.odata.ODataModel(odataModel, true);
			var sPath = spath;
			//oDataModel.refreshSecurityToken();
			oDataModel.read(sPath, {
				//async: true,
				success: function(data, response) {
					// Success call back function
					that.getView().setModel(new sap.ui.model.json.JSONModel(data), modelName)
						//sap.m.MessageToast.show("Submit success!");
				},
				error: function(error) {
					// Fail call back function
				}
			});
		},
		
		// 清除校验错误提示
		onClearValueState: function(oEvent) {
			oEvent.getSource().setValueState("None");
			oEvent.getSource().setValueStateText("");
		},

	};

	return Helper;
});
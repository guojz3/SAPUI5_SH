sap.ui.define([
	"sap/ui/core/format/DateFormat"
], function(DateFormat) {

	var Formatter = {
		FloatFormat: function(sValue) {
			if (typeof sValue === "number")
				return sValue.toFixed(2);

			if (!sValue) {
				return "";
			}
			if (typeof sValue === "string") {
				var sValue = sValue.replace(/,/g, '');
				sValue = parseFloat(sValue);
			}
			return sValue.toFixed(2);
		},
		//发票类型
		IntypeString: function(value) {
			switch (value) {
				case "c":
					return "普纸";
					break;
				case "s":
					return "专纸";
					break;
				case "ce":
					return "电票";
					break;
				case "v":
					return "机动车票";
					break;
				case "fj":
					return "附件";
					break;
				default:
					return ""
			}

		},

		DateToString: function(oDate, spattern) {
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: spattern
			});

			return oDateFormat.format(oDate);
		},

		formatDate: function(date) {
			if (date === null || date === undefined || date === "") {
				return "";
			} else {
				//Cover time to timestrmp
				var timestrmp = Date.parse(date);
				var newDate = new Date();
				newDate.setTime(timestrmp);
     			
     			/*
     			var formatter = DateFormat.getDateInstance({
					style: "medium",
					UTC: true
				});
				*/
				var formatter = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "YYYY/MM/dd"});
    			return formatter.format(newDate, false);
			}

		}
	};

	return Formatter;

});
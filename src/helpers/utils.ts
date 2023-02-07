import _ from "lodash";
import { documentStatus } from "@config/constant";

export const removeVietnameseTones = (str) => {
	str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
	str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
	str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
	str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
	str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
	str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
	str = str.replace(/đ/g, "d");
	str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
	str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
	str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
	str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
	str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
	str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
	str = str.replace(/Đ/g, "D");
	return str;
};
export const formatNumber = (num: number) => {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const phoneNumberSGP = (value: any) => {
	let re = /^([3|6|8|9]\d{7}|65[3|6|8|9]\d{7}|\+65(\s)?[3|6|8|9]\d{7})$/;
	if (!re.test(String(value).toLowerCase())) {
		return false;
	}
	return true;
};

export const generateSetId = (items) => {
	let hIds = items.map((item) => item.hId);
	hIds = _.sortBy(hIds);
	// console.log(hIds);
	return hIds.join("|");
};

export const getMinQuantitySet = (items) => {
	let minQuantity = 99999;
	items.map((item) => {
		if (minQuantity > item.minQuantity) minQuantity = item.minQuantity;
	});
	return minQuantity;
};

export const getCountByStatus = (data: any) => {
	return _.countBy(data, "status");
};

export const checkStatusColor = (status: any) => {
	const colorObj = {
		padding: "4px 8px",
		borderRadius: "5px",
		color: "#b22222",
		backgroundColor: "#fff6f6",
		width: "75px",
	};

	switch (status) {
		case "Approve":
		case 1:
			return {
				...colorObj,
				color: "#17B169",
				backgroundColor: "#cefad0",
				width: "70px",
			};

		case "To Be Reviewed":
		case 2:
			return {
				...colorObj,
				color: "#DAA520",
				backgroundColor: "#FFF8DC",
				width: "120px",
			};
		case "Rejected":
		case 3:
			return {
				...colorObj,
				color: "#b22222",
				backgroundColor: "#fff6f6",
				width: "75px",
			};
	  case "Submitted":
		case 6:
			return {
				...colorObj,
				color: "#17B169",
				backgroundColor: "#f7e8e8",
				width: "85px",
			};
    default:
			return {};
	}
};

export const checkStatusByName = (status: any) => {
	switch (status) {
		case "Approve":
		case 1:
			return documentStatus[status];
		case "To Be Reviewed":
		case 2:
			return documentStatus[status];
		case "Rejected":
    	case 3:
			return documentStatus[status];
		case "Submitted":
		case 6:
     		return documentStatus[status];
		default:
			return "";
	}
};
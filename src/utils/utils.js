/**
 * 时间戳处理
 * @param inputTime :时间戳
 * @param format: 返回的时间格式，默认yyyy-MM-dd hh:mm
 */
export const formatDateTime = (inputTime,format) => {
    if(!inputTime){
        return "";
    }
    try{
        var date = new Date(inputTime);
        if(!format){
            format = "yyyy-MM-dd hh:mm";
        }
        var o = {
             "M+" : date.getMonth()+1, //month
             "d+" : date.getDate(),    //day
             "h+" : date.getHours(),   //hour
             "m+" : date.getMinutes(), //minute
             "s+" : date.getSeconds(), //second
             "q+" : Math.floor((date.getMonth()+3)/3),  //quarter
             "S" : date.getMilliseconds() //millisecond
        }
        if(/(y+)/.test(format)){
            format = format.replace(RegExp.$1,(date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o){
            if(new RegExp("("+ k +")").test(format)){
                format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
            }
        }
        return format;
    }catch(err){
        return inputTime;
    }
}

/**
 * 存储localStorage
 */
export const setLocalStorage = (name, value) => {
	if (!name) return;
	if (typeof value !== 'string') {
		value = JSON.stringify(value);
	}
	window.localStorage.setItem(name, value);
}

/**
 * 获取localStorage
 */
export const getLocalStorage = name => {
	if (!name) return;
	return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const removeLocalStorage = name => {
	if (!name) return;
	window.localStorage.removeItem(name);
}
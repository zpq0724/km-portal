const pathLists = {
    //用户管理
    'user': '用户管理',
    'userList': '基本信息',
    'userListshow': '用户详情',
    // 问卷管理
    // 'questionnaire': '问卷管理',
    //'coinList': '数币信息',
    // 'commentList': '评论列表',
    // 调研管理
    'investigation': '调研管理',
    //'requestList': '调研列表',
    'templetList': '模板列表',
    'questionnaireList': '问卷列表',
    //'completedList': '已完成列表',
    'completedDetail': '查看详情',
    'templetShow': '模板详情',
    'questionShow': '问卷详情',
    //'communityRating': '社区评级',
    //'reportList': '报告列表',
}

export const selectTitleFromList = (path) => {
    let res = ''
    Object.keys(pathLists).forEach((key) => {
        if (path == key) {
            res = pathLists[key];
        }
    });
    return res;
}
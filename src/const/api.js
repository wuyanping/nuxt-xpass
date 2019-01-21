const version = '/api/v1'
/*
会员中心
*/
const memberCenter = '/deepexi-member-center' + version

/*
& -> 会员管理
*/
const members = memberCenter + '/members'
/*
& -> 黑名单管理
*/
// 黑名单列表
export const memberBlacklists = memberCenter + '/memberBlacklists'

// 添加会员 这个接口后台会员账号有重命名的验证
export const membersAdd = members + '/add'
// 获取某个会员信息
export const getMember = members + '/getMember'
// 获取所有会员
export const memberslist = members + '/list'


 const userSQL = {
    queryAll: 'select * from user',   //查询所有用户
    queryByName: 'select * from  user where username=?',  //通过用户名索引查询用户
    insert: 'insert into user set ?'  //插入新用户
}

module.exports = userSQL
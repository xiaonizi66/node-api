const { pool, router, Result } = require('../connect')
const userSQL = require('../db/userSQL')
router.get('/login', (req, res) => {
    let user = {
        username: req.query.name,
        realname: req.query.password
    }
    let _data;
    pool.getConnection((err, conn) => {
        conn.query(userSQL.queryByName, user.username, (e, result) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            if(result) {
                result.forEach(user => {
                    _data = {
                        code: -1,
                        msg: e
                    }
                });
            }
            res.json(Result(_data))
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})

/**
 * 注册用户功能
 */

router.get('/register', (req, res) => {
    // 获取前台页面传过来的参数
    let user = {
        username: req.query.name,
        realname: req.query.password,
        password: req.query.realname
    }
    // 判断参数是否为空
    if (!user.username) {
        return res.json(Result({
            code: -1,
            msg: '用户名不能为空'
        }))
    }
    if (!user.realname) {
        return res.json(Result({
            code: -1,
            msg: '真实姓名不能为空'
        }))
    }
    if (!user.password) {
        return res.json(Result({
            code: -1,
            msg: '密码不能为空'
        }))
    }
    let _data;
    // 整合参数
    // 从连接池获取连接
    pool.getConnection((err, conn) => {
        // 查询数据库该用户是否已存在
        conn.query(userSQL.queryByName, user.username, (e, r) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            if(r) {
                //判断用户列表是否为空
                if (r.length) {
                    //如不为空，则说明存在此用户
                    _data = {
                        code: 1,
                        msg: '用户已存在'
                    }
                } else {
                    //插入用户信息
                    conn.query(userSQL.insert, user, (err, result) => {
                        if (result) {
                            _data = {
                                msg: '注册成功'
                            }
                        } else {
                            _data = {
                                code: -1,
                                msg: '注册失败'
                            }
                        }
                    })
                }
            }
            setTimeout(() => {
                //把操作结果返回给前台页面
                res.json(Result(_data))
            }, 200);
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})
module.exports = router;
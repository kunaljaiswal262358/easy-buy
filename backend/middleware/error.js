module.exports = function() {
    return function (err, req, res, next) {
        if(err) return res.status(500).send(err.message)
        
        next()
    }
}
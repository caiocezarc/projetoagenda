module.exports.paginaInicial = (req, res) => {
    res.render('index');
    return;
};

module.exports.trataPost = (req, res) => {
    res.send(req.body);
    return;
};
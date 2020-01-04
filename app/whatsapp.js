var useragent = require('express-useragent');
const phone = process.env.PHONE_WHATSAPP;

exports.sendWhatsapp = function(req, res) {
    var source = req.header('user-agent');
    var ua = useragent.parse(source);
    
    var text = req.params.text
    
    if (text == 'null' || text == undefined) text = '';

    if (ua.isDesktop) {
        res.status(308).redirect('https://web.whatsapp.com/send?phone=+'+ phone +'&text=' + text);
    } else if (ua.isMobile) {
        res.status(308).redirect('whatsapp://send?phone=+'+ phone +'&text=' + text);
    } else {
        res.status(400).json({status: "error"});
    }
}
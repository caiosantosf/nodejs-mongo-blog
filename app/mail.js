const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const to = process.env.EMAIL_TO_SEND;

var date = new Date()
var hour = date.getHours() + ':' + date.getMinutes();
var mes = date.getMonth() + 1
var dia = date.getDate()
date = ('0' + dia).slice(-2) + '/' + ('0' + mes).slice(-2) + '/' + 
       date.getFullYear();

exports.sendMail = function(data, res) {

  if (data.name) {
    var name = data.name, email = data.email, subject = 'Contato Site: ' + data.subject
    var html = data.message + ' <br><br> ' + name + ' <br> ' + email 
  } else {
    var name = data.joinname, email = data.joinemail, subject = 'Site'
    var html = name + ' <br> ' + email + ' <br> Nascimento: ' + 
               data.birthday + ' <br> Cpf: ' + data.cpf + ' <br> Fone: ' + data.phone
  }

  sgMail.send({
      to: to,
      from: name + ' <' + email + '>',
      subject: subject,
      html: html + ' <br> <strong>Data: ' + date + ' Hora: ' + hour + '</strong>'
    }, function (error, body) {if (error) res.sendStatus(500); else res.sendStatus(200);
  });
};
function sendMail(data) {
    $.ajax({
      type: "POST",
      url: '/sendMail',
      data: data,
      statusCode: {
        200: function(d){
          if (deparam(data).name)
            $("#msg-success").show("slow");
          else
            $("#msg-success-join").show("slow");
        },
        500: function(d){
          if (deparam(data).name)
            $("#msg-error").show("slow");
          else
            $("#msg-error-join").show("slow");
        },
      } 
    });
  }
  
  $('#contactModal').on('shown.bs.modal', function() {
    $('#contact-form')[0].reset();
    $("#msg-success").hide();
    $("#msg-error").hide();
    $('#name').focus();
  })
  
  $("#contact-form").submit(function(e){
    e.preventDefault();
    sendMail($(this).serialize());
  });
  
  $('#joinModal').on('shown.bs.modal', function() {
    $('#joinform')[0].reset();
    $("#msg-success-join").hide();
    $("#msg-error-join").hide();
    $('#joinname').focus();
  });
  
  $("#joinform").submit(function(e){
    e.preventDefault();
    sendMail($(this).serialize());
  });
  
  $("#cpf").mask('000.000.000-00', {reverse: true});
  
  var SPMaskBehavior = function (val) {
    return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
  },
  spOptions = {
    onKeyPress: function(val, e, field, options) {
        field.mask(SPMaskBehavior.apply({}, arguments), options);
      }
  };
  $("#phone").mask(SPMaskBehavior, spOptions);

  function deparam(query) {
    var pairs, i, keyValuePair, key, value, map = {};
    if (query.slice(0, 1) === '?') {
        query = query.slice(1);
    }
    if (query !== '') {
        pairs = query.split('&');
        for (i = 0; i < pairs.length; i += 1) {
            keyValuePair = pairs[i].split('=');
            key = decodeURIComponent(keyValuePair[0]);
            value = (keyValuePair.length > 1) ? decodeURIComponent(keyValuePair[1]) : undefined;
            map[key] = value;
        }
    }
    return map;
}
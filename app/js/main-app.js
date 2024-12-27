//Convierte el texto con la clase upper a mayúsculas
$(function () {
    $('input.upper').keyup(function () {
        this.value = this.value.toUpperCase();
    });
});
//Convierte el texto con la clase lower a minúsculas
$(function () {
    $('input.lower').keyup(function () {
        this.value = this.value.toUpperCase();
    });
});

$('.descripcion').keyup(function (e) {
    if (e.which === 13) {
        var value = $(".descripcion").val();
        if (value.length < 250) {
            var max = $(".descripcion").attr('maxlength');
            max = parseInt(max) + 1;
            $(".descripcion").attr('maxlength', max);
        }
    }
});





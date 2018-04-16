/**
 * Created by anune on 15/03/2017.
 */
var ids = ['#1', '#2', '#3', '#4', '#5', '#6', '#7', '#8', '#9'];
var tdh = ['<td>Username</td>', '<td>Email</td>', '<td>First Name</td>', '<td>Last Name</td>', '<td>Date of birth</td>',
    '<td>Gender</td>', '<td>Country</td>', '<td>City</td>', '<td>District</td>'];
var portugal = {
    'Aveiro': ['Albergaria-a-Velha', 'Agueda','Anadia', 'Arouca', 'Aveiro', 'Castelo de Paiva',  'Espinho', 'Estarreja',
        'Ilhavo','Mealhada', 'Murtosa', 'Oliveira de Azimeis', 'Oliveira do Bairro', 'Ovar',
        'Santa Maria da Feira', 'Sever do Vouga', 'Sao Joao da Madeira', 'Vagos', 'Vale de Cambra'],

    'Beja': ['Aljustrel', 'Almodovar', 'Alvito', 'Barrancos', 'Beja', 'Castro Verde', 'Cuba', 'Ferreira do Alentejo',
        'Moura', 'Mertola', 'Odemira', 'Ourique', 'Serpa', 'Vidigueira'],

    'Braga': ['Amares', 'Barcelos', 'Braga', 'Cabeceiras de Basto', 'Celorico de Basto', 'Esposende', 'Fafe',
        'Guimaraes', 'Povoa de Lanhoso', 'Terras de Bouro', 'Vieira do Minho', 'Vila Nova de Famalicao',
        'Vila Verde', 'Vizela'],

    'Braganca': ['Alfandega da Fe', 'Bragança', 'Carrazeda de Ansiaes', 'Freixo de Espada a Cinta',
        'Macedo de Cavaleiros', 'Miranda do Douro', 'Mirandela', 'Mogadouro', 'Torre de Moncorvo', 'Vila Flor',
        'Vimioso', 'Vinhais'],

    'Castelo Branco': ['Belmonte', 'Castelo Branco', 'Covilha', 'Fundao', 'Idanha-a-Nova', 'Oleiros', 'Penamacor',
        'Proenca-a-Nova', 'Serta', 'Vila de Rei', 'Vila Velha de Rodao'],

    'Coimbra': ['Arganil', 'Cantanhede', 'Coimbra', 'Condeixa-a-Nova', 'Figueira da Foz', 'Gois', 'Lousa', 'Mira',
        'Miranda do Corvo', 'Montemor-o-Velho', 'Oliveira do Hospital', 'Pampilhosa da Serra', 'Penacova',
        'Penela', 'Soure', 'Tabua', 'Vila Nova de Poiares'],

    'Evora': ['Alandroal', 'Arraiolos', 'Borba', 'Estremoz', 'Montemor-o-Novo', 'Mora', 'Mourao', 'Portel', 'Redondo',
        'Reguengos de Monsaraz', 'Vendas Novas', 'Viana do Alentejo', 'Vila Vicosa', 'Evora'],

    'Faro': ['Albufeira', 'Alcoutim', 'Aljezur', 'Castro Marim', 'Faro', 'Lagoa', 'Lagos', 'Loule', 'Monchique',
        'Olhao', 'Portimao', 'Silves', 'Sao Bras de Alportel', 'Tavira', 'Vila do Bispo',
        'Vila Real de Santo Antonio'],

    'Guarda': ['Aguiar da Beira', 'Almeida', 'Celorico da Beira', 'Figueira de Castelo Rodigo', 'Fornos de Algodres',
        'Gouveia', 'Guarda', 'Manteigas', 'Meda', 'Pinhel', 'Sabugal', 'Seia', 'Trancoso',
        'Vila Nova de Foz Coa'],

    'Leiria': ['Alcobaça', 'Alvaiazere', 'Ansiao', 'Batalha', 'Bombarral', 'Caldas da Rainha', 'Castanheira de Pera',
        'Figueiro dos Vinhos', 'Leiria', 'Marinha Grande', 'Nazare', 'Pedrogao Grande', 'Peniche', 'Pombal',
        'Porto de Mos', 'Obidos'],

    'Lisboa': ['Alenquer', 'Amadora', 'Arruda dos Vinhos', 'Azambuja', 'Cadaval', 'Cascais', 'Lisboa', 'Loures',
        'Lourinha', 'Mafra', 'Odivelas', 'Oeiras', 'Sintra', 'Sobral de Monte Agraco', 'Torres Vedras',
        'Vila Franca de Xira'],

    'Portalegre': ['Alter do Chao', 'Arronches', 'Avis', 'Campo Maior', 'Castelo de Vide', 'Crato', 'Elvas',
        'Fronteira', 'Gaviao', 'Marvao', 'Monforte', 'Nisa', 'Ponte de Sor', 'Portalegre', 'Sousel'],

    'Porto': ['Amarante', 'Baiao', 'Felgueiras', 'Gondomar', 'Lousada', 'Maia', 'Marco de Canaveses', 'Matosinhos',
        'Paredes', 'Pacos de Ferreira', 'Penafiel', 'Porto', 'Povoa do Varzim', 'Santo Tirso', 'Trofa',
        'Valongo', 'Vila do Conde', 'Vila Nova de Gaia'],

    'Santarem': ['Abrantes', 'Alcanena', 'Almeirim', 'Alpiarca', 'Benavente', 'Cartaxo', 'Chamusca', 'Constancia',
        'Coruche', 'Entroncamento', 'Ferreira do Zezere', 'Golega', 'Macao', 'Ourem', 'Rio Maior',
        'Salvaterra de Magos', 'Santarem', 'Sardoal', 'Tomar', 'Torres Novas', 'Vila Nova da Barquinha'],

    'Setubal': ['Alcochete', 'Alcacer do Sal', 'Almada', 'Barreiro', 'Grandola', 'Moita', 'Montijo', 'Palmela',
        'Santiago do Cacem', 'Seixal', 'Sesimbra', 'Setubal', 'Sines'],

    'Viana do Castelo': ['Arcos de Valdevez', 'Caminha', 'Melgaco', 'Moncao', 'Paredes de Coura', 'Ponte da Barca',
        'Ponte de Lima', 'Valenca', 'Viana do Castelo', 'Vila Nova da Cerveira'],

    'Vila Real': ['Alijo', 'Boticas', 'Chaves', 'Mesao Frio', 'Mondim de Basto', 'Montalegre', 'Murca',
        'Peso da Regua', 'Ribeira da Pena', 'Sabrosa', 'Santa Marta de Penaguiao', 'Valpacos',
        'Vila Pouca de Aguiar', 'Vila Real'],

    'Viseu': ['Armamar', 'Carregal do Sal', 'Castro Daire', 'Cinfaes', 'Lamego', 'Mangualde', 'Moimenta da Beira',
        'Mortagua', 'Nelas', 'Oliveira de Frades', 'Penalva do Castelo', 'Penedono', 'Resende',
        'Santa Comba Dao', 'Sernacelhe', 'Satao', 'Sao Joao da Pesqueira', 'Sao Pedro do Sul', 'Tabuaco',
        'Tarouca', 'Tondela', 'Vila Nova de Paiva', 'Viseu', 'Vouzela']
};

//option1 - find by username or email
function optionONE() {
    "use strict";
    $.get('/admin/optionONE', {username: $('#username').val(), email: $('#email').val()}, function (user) {
        if(jQuery.isEmptyObject(user)) {
            window.alert('Username not available...');
        }
        else {
            createTable();
            appendUser(user.user);
        }
    });
}

//option2 - find by first name or last name
function optionTWO() {
    "use strict";
    $.get('/admin/optionTWO', {firstname: $('#firstname').val(), lastname: $('#lastname').val()}, function (user) {
        console.log(user['allusers']);
        if(user['allusers'].length == 0) {
            window.alert('Name not available...');
        }
        else {
            createTable();
            for (var i = 0; i < user.allusers.length; i++) {
                console.log(user.allusers[i])
                appendUser(user.allusers[i]);
            }
        }
    })
}

//option3 - find by gender
function optionTHREE() {
    "use strict";
    $.get('/admin/optionTHREE', {gender: $("input[type='radio']:checked").val()},  function (user) {
        if(jQuery.isEmptyObject(user)) {
            window.alert('No Users registed yet...');
        }
        else {
            createTable();
            for (var i = 0; i < user.allusers.length; i++) {
                console.log(user.allusers[i])
                appendUser(user.allusers[i]);
            }
        }
    });
}

//option4 - find by country, city or district
function optionFOUR() {
    "use strict";
    $.get('/admin/optionFOUR', {country: $('#country').val(), city: $('#city').val(), district: $('#district').val()}, function (user) {
        if(jQuery.isEmptyObject(user)) {
            window.alert('No Users found!');
        }
        else {
            createTable();
            for (var i = 0; i < user.allusers.length; i++) {
                console.log(user.allusers[i])
                appendUser(user.allusers[i]);
            }
        }
    })
}

//option5 - find all games
function optionFIVE() {
    "use strict";
    $.get('/admin/optionFIVE', {}, function (games) {
        if(jQuery.isEmptyObject(games)) {
            window.alert('No games found!');
        }
        else {
            clearTable();
            for (var i = 0; i < games.allgames.length; i++) {
                console.log(games.allgames[i])
                createAllGames(games.allgames[i]);
            }
        }
    })
}

//option6 - find all games
function optionSIX() {
    "use strict";
    $.get('/admin/optionSIX', {gname: $('#gamename').val(), gaid: $('#gameid').val(), gdesc: $('#description').val(), gcreator: $("#creatorname").val()}, function (games) {
        if(jQuery.isEmptyObject(games)) {
            window.alert('No games found!');
        }
        else {
            clearTable();
            for (var i = 0; i < games.allgames.length; i++) {
                console.log(games.allgames[i])
                createAllGames(games.allgames[i]);
            }
        }
    })
}

function createAllGames(game) {
    "use strict";
    var d = document.createElement('div');
    $(d).addClass('option')
        .appendTo($("#games")); //main div
    $(d).append("<p style='color:red; font-size: 30px;'>Game " + game.id + " (" + game.name +")</p><br>");
    $(d).append("<p style='font-size: 20px;'>Description: " + game.description + "</p><br>");
    $(d).append("<p style='font-size: 20px;'>Players: " + game.countPlayers + " / " + game.maxPlayers + "</p><br>");
    $(d).append("<p style='font-size: 20px;'>First bet: " + game.first_bet + " CR</p><br>");
    $(d).append("<p style='font-size: 20px;'>Owner: " + game.ownerName+ "</p><br><br>");
    $(d).append("<button class='btn btn-default'>View</button>");
}

function createTable() {
    "use strict";
    for (var i=0; i<10; i++) {
        $(ids[i]).empty();
        $(ids[i]).append($(tdh[i]));
    }
}

function clearTable() {
    "use strict";
    for (var i=0; i<10; i++) {
        $(ids[i]).empty();
    }
    $("#games").empty();
}

function appendUser(user) {
    "use strict";
    $('#1').append($('<td>'+user.username+'</td>'));
    $('#2').append($('<td>'+user.email+'</td>'));
    $('#3').append($('<td>'+user.firstname+'</td>'));
    $('#4').append($('<td>'+user.lastname+'</td>'));
    $('#5').append($('<td>'+user.birthday+'</td>'));
    $('#6').append($('<td>'+user.gender+'</td>'));
    $('#7').append($('<td>'+user.country+'</td>'));
    $('#8').append($('<td>'+user.city+'</td>'));
    $('#9').append($('<td>'+user.district+'</td>'));

}

function validateEmail(email) {
    "use strict";
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function country_selected() {
    "use strict";

    for (var city in portugal) {
        $("#city").append('<option value="' + city + '">' + city +'</option>');
    }
}

function city_selected() {
    var city = $("#city").val();
    console.log(portugal[s])

    for (var district in portugal[city]) {
        console.log(portugal[s][district]);
        $("#district").append('<option value="' + portugal[city][district] + '">' + portugal[city][district] +'</option>');
    }

    $('#districtL').show();
    $('#district').show();
}


function main() {

    for (var a in portugal) {
        $("#city").append('<option value="' + a + '">' + a +'</option>');
    }

    for (var a in portugal[s]) {
        $("#district").append('<option value="' + portugal[s][a] + '">' + portugal[s][a] +'</option>');
    }
}

window.onload = main;
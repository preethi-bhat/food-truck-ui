// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    //populateTable();

   $('#btnCarSearch').on('click', doCarSearch);


});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

   //alert('hello');
    // jQuery AJAX call for JSON
    $.getJSON( 'http://localhost:3001/car/results', function( data ) {
    $('#carResults table tbody tr').remove()
     var row = 0;
        $.each(data.results, function(index, solution){
            $.each(solution.pgoods, function(index, pgood) {
                var tableContent = ""

                row++;
                var isOpaque = 'Y';
                if(pgood.isOpaque == false) {
                    isOpaque = 'N';
                }
                tableContent += '<tr class="item-' + row%2 + '">';
                tableContent += '<td>' + pgood.carType + '</td>';
                tableContent += '<td>' + pgood.carVendor + '</td>';
                tableContent += '<td>' + pgood.price + '</td>';
                tableContent += '<td>' + pgood.depositType +'</td>';
                tableContent += '<td>' + isOpaque +'</td>'
                tableContent += '</tr>';
                $('#carResults table').last().append(tableContent);
            })
        })
    });
};



function doCarSearch(event) {
    event.preventDefault();


    // If it is, compile all user info into one object
    var carSearchParams = {
        'destination': 'Houston,TX',
        'checkin': '3/1/2015',
        'checkout': '3/2/2015'
    }

    var start = new Date().getTime();
    $.ajax({
        type: 'POST',
        data: carSearchParams,
        url: 'http://localhost:3001/car/search',
        dataType: 'JSON'
    });
    var executionTime = new Date().getTime() - start;

    populateTable();
    $('#carResultsTime').text('Execution time (ms) = ' + executionTime);
}

// Add User
function addUser(event) {
    event.preventDefault();


    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSONP'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};




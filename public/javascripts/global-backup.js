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

    // jQuery AJAX call for JSON
    $.getJSON( 'http://localhost:3001/car/results', function( data ) {
    
    	// Stick our user data array into a userlist variable in the global object
    	userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data.results, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.carType + '</td>';
            tableContent += '<td>' + this.carVendor + '</td>';
            tableContent += '<td>' + this.price + '</td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#carResults table tbody').html(tableContent);
    });
};



function doCarSearch(event) {
    var start = new Date().getTime();
    event.preventDefault();


    // If it is, compile all user info into one object
    var carSearchParams = {
        'destination': 'Houston,TX',
        'checkin': '3/1/2015',
        'checkout': '3/2/2015'
    }


    $.ajax({
        type: 'POST',
        data: carSearchParams,
        url: 'http://localhost:3001/car/search',
        dataType: 'JSON'
    });
    populateTable();
    var executionTime = new Date().getTime() - start;
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




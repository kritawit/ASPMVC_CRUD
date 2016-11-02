$(document).ready(function () {
    LoadContacts();
    $('body').on("click", "a.butpopup", function (e) {
        e.preventDefault();
        $('#bodys').html('<img src="/Content/loader.gif" />&nbsp; Loading Form...');
        var page = $(this).attr('href');
        OpenPopup(page);
    });

    //Cascade dropsdown
    $('body').on("change", "#CountryID", function () {
        var countryID = $(this).val();
        LoadStates(countryID);
    });


    $('body').on("submit", "#saveForm", function (e) {

        SaveContacts();
        e.preventDefault();
    });

    $('body').on("submit", "#deleteForm", function (e) {

        DeleteContact();
        e.preventDefault();
    });



});

function LoadContacts() {
    $('#update_panel').html('<img src="/Content/loader.gif" />&nbsp; Loading Data...');
    setTimeout(function () {
        $.ajax({
            url: '/Home/GetContacts',
            type: 'GET',
            dataType: 'json',
            success: function (d) {
                if (d.length > 0) {
                    var $data = $('<table></table>').addClass('table table-bordered');
                    var header = "<thead><tr><th>Contact Person</th><th>Contact No</th><th>Country</th><th>State</th></tr></thead>";
                    $data.append(header);

                    $.each(d, function (i, row) {
                        var $row = $('<tr/>');
                        $row.append($('<td />').html(row.ContactPerson));
                        $row.append($('<td />').html(row.ContactNo));
                        $row.append($('<td />').html(row.CountryName));
                        $row.append($('<td />').html(row.StateName));
                        $row.append($('<td />').html("<a href='/home/save/" + row.ContactID + "' class='btn btn-warning butpopup' id='btnEdit' >Edit</a>&nbsp;|&nbsp;<a href='/home/Delete/" + row.ContactID + "' class='btn btn-danger butpopup' id='btnDelete'>Delete</a>"));
                        $data.append($row);
                    });

                    $('#update_panel').html($data);
                } else {
                    var $noData = $('<div/>').html('No Data Found!');
                    $('#update_panel').html($noData);
                }
            },
            error: function () {
                alert('Error! Please try again.');
            }
        });
    }, 500);

}


function OpenPopup(Page) {
    $('.popup').modal('show');
    setTimeout(function () {
        $('.modal-body').load(Page);

    }, 500);
}


function LoadStates(countryID) {
    var $state = $('#StateID');
    $state.empty();
    $state.append($('<option></option>').val('').html('Please wait...'));
    if (countryID == null | countryID == "") {
        $state.empty();
        $state.append($('<option></option>').val('').html('Select State'));
        return;
    }

    $.ajax({
        url: '/Home/GetStateList',
        type: 'GET',
        data: { 'countryID': countryID },
        dataType: 'json',
        success: function (d) {
            $state.empty();
            $state.append($('<option></option>').val('').html('Select State'));
            $.each(d, function (i, val) {
                $state.append($('<option></option>').val(val.StateID).html(val.StateName));
            });
        },
        error: function () {
            alert('State has the problem.');
        }
    });
}

function SaveContacts() {

    var contact = {
        ContactID: $('#ContactID').val() == '' ? '0' : $('#ContactID').val(),
        ContactPerson: $('#ContactPerson').val().trim(),
        ContactNo: $('#ContactNo').val().trim(),
        CountryID: $('#CountryID').val().trim(),
        StateID: $('#StateID').val().trim()
    };

    contact.__RequestVerificationToken = $('input[name=__RequestVerificationToken]').val();

    var token = $('#saveForm input[name=__RequestVerificationToken]').val();

    var headers = {};

    headers['__RequestVerificationToken'] = token;

    $.ajax({
        url: '/Home/Save',
        type: 'POST',
        data: contact,
        traditional: true,
        dataType: 'json',
        cache: false,
        headers: headers,
        success: function (data) {
            $('#messages').html('<div class="alert alert-success">' +
    '<strong>Message</strong> : ' + data.message +
    '</div>');
            if (data.status) {
                document.getElementById("saveForm").reset();
            }
        },
        error: function (e) {
            $('#messages').html('<div class="alert alert-danger">' +
    '<strong>Danger!</strong> Error! Please try again. : ' + e.toString() +
    '</div>');
        }
    });


}


function ValidateFormConfig() {


    //$("#saveForm").bootstrapValidator({
    //    container: '#messages',
    //    feedbackIcons: {
    //        valid: 'glyphicon glyphicon-ok',
    //        invalid: 'glyphicon glyphicon-remove',
    //        validating: 'glyphicon glyphicon-refresh'
    //    },
    //    fields: {
    //        ContactPerson: {
    //            validators: {
    //                notEmpty: {
    //                    message: 'The Contact person is required and cannot be empty'
    //                },
    //                numeric: {
    //                    message: 'The down payment is not a number',
    //                    thousandsSeparator: '',
    //                    decimalSeparator: '.'
    //                }
    //            }
    //        },
    //        interest_rate: {
    //            validators: {
    //                notEmpty: {
    //                    message: 'The interest rate is required and cannot be empty'
    //                },
    //                numeric: {
    //                    message: 'The interest rate is not a number',
    //                    thousandsSeparator: '',
    //                    decimalSeparator: '.'
    //                }
    //            }
    //        },
    //        loan_type: {
    //            validators: {
    //                notEmpty: {
    //                    message: 'The loan type is required and cannot be empty'
    //                }
    //            }
    //        },
    //        period: {
    //            validators: {
    //                notEmpty: {
    //                    message: 'The period is required and cannot be empty'
    //                }
    //            }
    //        },
    //        loan_amount: {
    //            validators: {
    //                notEmpty: {
    //                    message: 'The loan amount is required and cannot be empty'
    //                }
    //            }
    //        }
    //    }
    //});

}


function DeleteContact() {
    $.ajax({
        url: '/Home/Delete',
        type: 'POST',
        dataType: 'json',
        data: {
            'id': $('#ContactID').val(),
            '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val()
        },
        success: function (data) {
            if(data.status){
                $('.popup').modal('hide');
                LoadContacts();
            }
        },
        error: function (e) {
            $('#messages').html('<div class="alert alert-danger">' +
    '<strong>Danger!</strong> Error! Please try again. : ' + e.toString() +
    '</div>');
        }
    });
}
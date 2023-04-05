var window_size = window.matchMedia('(min-width: 767px)');

function generator(){
    $('#startButton').on('click', ()=>{
        $('header').slideUp();
        if (window.matchMedia('(min-width: 767px)').matches){
            $('.mainer').css('display', 'flex');
            $('aside').css('display', 'inline-block');
            $('aside').css('width', '30%');
            $('main').css('display', 'inline-block');
            $('.info').slideUp();
        }
        else {
            $('.mainer').css('display', 'flex');
            $('aside').css('display', 'block');
            $('.info').slideUp();
        }
        
    });

    // Obsługa guzików formularza 

    $('.detailsReady').on('click', (event)=>{
        if ($('#kwota').val() != ""){
            if($('#vendorName').val() ==""){
                $('.vendorDetails').slideDown();
                $('.vendorReady').slideDown();
            }
          $('.invoiceDetails').slideToggle();
          $(event.currentTarget).toggleClass("ready");
        } else {
            $('#invoiceDate').focus();
        }
    });

    $('.vendorReady').on('click', (event)=>{
        if ($('#vendorName').val() != ""){
            if($('#buyerName').val()==""){
                $('.buyerDetails').slideDown();
                $('.buyerReady').slideDown();
            }
            $('.vendorDetails').slideToggle();
            $(event.currentTarget).toggleClass("ready")
        } else {
            $('#vendorName').focus();
        }
    });

    $('.buyerReady').on('click', (event)=>{
        if($('#buyerName').val()!=""){
            $('.buyerDetails').slideToggle();
            $(event.currentTarget).toggleClass("ready");
            $('main').css('display', 'inline-block');
            $('.closeAside').slideDown();
            $('#closeInfo').slideDown();
        } else {
            $('#buyerName').focus();
        }
    });
    
    $('.closeButton').on('click', event=>{
        $(event.currentTarget).parent().slideUp();
        $('main').css('box-shadow', 'none');
        $('main').css('border', '1px solid cornflowerblue');
    })

    // Uzupełnianie danych faktury

    $('#invoiceDate').on('change', event=>{
        $('.invoiceDate').html($('#invoiceDate').val());
        $dataPL = $('#invoiceDate').val();
        $month = $dataPL.slice(5,7);
        $year = $dataPL.slice(2,4);        
    });

    $('#dueDate').on('change', event=>{
        $('#invoiceDueDate').html($('#dueDate').val());
    });

    $('#invoiceNumber').on('change', event=>{
        if ($('#invoiceDate').val() == ""){
            alert('Uzupełnij datę wystawienia faktury!')
        } else {
            $('.invoiceNumber').html("A"+$(event.currentTarget).val()+"/"+$month+"/"+$year);
        }
    });

    $('#paymentMethod').on('change', event=>{
        if($(event.currentTarget).val() == "transfer"){
        $('.vendorAccountNr').slideDown();
        $('#invoiceMethod').html('Przelew')}
        else {
        $('.vendorAccountNr').slideUp();
        $('#invoiceMethod').html('Gotówka');
        }
    });

    $('#invoiceNumber').on('keyup', event=>{
            if ($('#invoiceDate').val() == ""){
                alert('Uzupełnij datę wystawienia faktury!')
            } else {
                $('.invoiceNumber').html("A"+$(event.currentTarget).val()+"/"+$month+"/"+$year);
            }
        });

    //Dodawanie pozycji do faktury i usuwanie

    //podsumy na fakturze
    $invoiceNettTotal = 0.00;
    $invoiceVATTotal = 0.00;
    $invoiceGrossTotal = 0.00;
    //lista pozycji, które będą dodane do faktury:

    $invoiceTableContent = "";
    $tableInterim ="";

    $('#addProduct').on('click', event=>{

        if($('#product').val() != ""){
            if($('#nettPrice').val() != ""){
                if($('#vat').val() != ""){

        $productName = $('#product').val(); // nazwa pozycji
        $productNetPrice = (parseFloat($('#nettPrice').val(), 10)).toFixed(2); // cena jednostkowa netto
        $productVAT = $('#vat').val(); // stawka vat
        $VATamount = (parseFloat($productNetPrice, 10) * parseFloat($productVAT, 10)/100).toFixed(2); // kwota vat za sztukę
        $productQuantity = $('#quantity').val(); // ilość
        $productGrossPrice = (parseFloat($('#nettPrice').val(), 10) + parseFloat($('#nettPrice').val(), 10) * parseFloat($('#vat').val(), 10)/100).toFixed(2); // brutto za sztukę
        $nettTotal = parseFloat($productNetPrice*$productQuantity, 10).toFixed(2); // łącznie netto
        $grossTotal = parseFloat($productGrossPrice*$productQuantity, 10).toFixed(2); // łącznie brutto

        $('#addProductList').slideDown();
        $('#addProductList').css('display', 'inline-flex');
        $('#clearProductList').slideDown();
        $('#clearProductList').css('display', 'inline-flex');

    //Dodawanie pozycji na formularzu
        $productInForm = "<p>" + $productQuantity + " szt. " + $productName + " " + $productNetPrice + " zł netto za sztukę / łącznie: " + $nettTotal + " zł netto / " + $grossTotal + " zł brutto, w tym: " + $productVAT + "% VAT</p>";
        $tableInterim += "<tr><td>"+$productName+"</td><td>"+$productQuantity+"</td><td>"+$productNetPrice+" zł</td><td>"+$productVAT+"%</td><td>"+$nettTotal+" zł</td><td>"+$VATamount*$productQuantity+" zł</td><td>"+$grossTotal+" zł</td>";
        
    //Sumowanie kwot do podsumy na fakturze
            $invoiceNettTotal = parseFloat($nettTotal + $invoiceNettTotal, 10).toFixed(2);
            $invoiceGrossTotal = parseFloat($grossTotal + $invoiceGrossTotal, 10).toFixed(2);
            $invoiceVATTotal = parseFloat($VATamount + $invoiceVATTotal, 10).toFixed(2);

    //Dodawanie pozycji do tabeli na fakturze
        $('#addProductList').click(()=>{
                $('.invoiceTableContent').html($tableInterim);
                $('#invoiceNettTotal').html($invoiceNettTotal  + " zł");
                $('#invoiceGrossTotal').html($invoiceGrossTotal + " zł");
                $('#invoiceVATTotal').html($invoiceVATTotal + " zł");
                });
                
                function clearInterim(){
                    $invoiceNettTotal = 0.00;
                    $invoiceVATTotal = 0.00;
                    $invoiceGrossTotal = 0.00;
                    $tableInterim = '';
                }
                
                setTimeout(100, clearInterim);

    //Czyszczenie tabeli na fakturze
        $('#clearProductList').click(()=>{
            $('.invoiceTableContent').html('');
            $('#invoiceNettTotal').html('');
            $('#invoiceGrossTotal').html('');
            $('#invoiceVATTotal').html('');
            $invoiceTableContent='';
            $tableInterim = '';
            $invoiceNettTotal = 0.00;
            $invoiceVATTotal = 0.00;
            $invoiceGrossTotal = 0.00;
            $('#tableInterim').html('');
            $('#addProductList').slideUp();
            $('#clearProductList').slideUp();

        });
    //Dodawanie pozycji na formularzu
        $('#tableInterim').append($productInForm);
    }
}
        } else {
            alert("Uzupełnij dane!");
        }
    });
    
    

//Sprzedawca dane

    $('#vendorName').keyup(()=>{
        $('.vendorName').html($('#vendorName').val());
    });

    $('#vendorAddress').keyup(()=>{
        $('.vendorAddress').html($('#vendorAddress').val());
    });

    $('#vendorZipCity').keyup(()=>{
        $('.vendorZipCity').html($('#vendorZipCity').val());
    });

    $('#vendorNIP').keyup(()=>{
        $('.vendorNIP').html("NIP: "+$('#vendorNIP').val());
    });

    $('#vendorPhone').keyup(()=>{
        $('.vendorPhone').html("Tel: "+$('#vendorPhone').val());
    });
    
    $('#vendorEmail').keyup(()=>{
        $('.vendorEmail').html($('#vendorEmail').val());
    });

    $('#vendorAccountNr').keyup(()=>{
        $('#invoiceAccountNr').html($('#vendorAccountNr').val());
    });

// Kupujący dane

    $('#buyerName').keyup(()=>{
            $('.buyerName').html($('#buyerName').val());
        });

        $('#buyerAddress').keyup(()=>{
            $('.buyerAddress').html($('#buyerAddress').val());
        });

        $('#buyerZipCity').keyup(()=>{
            $('.buyerZipCity').html($('#buyerZipCity').val());
        });

        $('#buyerNIP').keyup(()=>{
            $('.buyerNIP').html("NIP: "+$('#buyerNIP').val());
        });

        $('#buyerPhone').keyup(()=>{
            $('.buyerPhone').html("Tel: "+$('#buyerPhone').val());
        });

        $('#buyerEmail').keyup(()=>{
            $('.buyerEmail').html($('#buyerEmail').val());
        });

        $('#buyerAccountNr').keyup(()=>{
            $('.buyerAccountNr').html($('#buyerAccountNr').val());
        });
}


$(document).ready(generator);
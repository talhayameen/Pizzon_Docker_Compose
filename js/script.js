

function cleardata(){
    var testObject = { 'users': [], 'orders':[], 'carts':{},'section':''};
    localStorage.setItem('data', JSON.stringify(testObject));
    console.log('clear data successfully')
}

$( document ).ready(function() {
    var localdata = JSON.parse(localStorage.getItem('data'));
    if(localdata!=null){
        if(localdata.section!=''){
            try{
                
                document.getElementById('logoutbtn').style.display = "";
                document.getElementById('signupbtn').style.display = "none";
                document.getElementById('loginbtn').style.display = "none";
                document.getElementById('odh').style.display = "";
                if(localdata.carts.items.length > 0){
                        var carticon = document.getElementById("lblCartCount");
                        carticon.innerHTML = localdata.carts.items.length;
                }
            }
            catch(err){
        
            }
            
        }
    }
});
function customerRegistration(e){
    e.preventDefault();
    document.getElementById('regbtn').disabled = true;
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const name = firstname+" "+lastname;
    const gender = document.getElementById('gender').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const obj ={firstname,lastname,name,gender,address,email,password};
    const cartobj = {items:[]};
    var localdata = JSON.parse(localStorage.getItem('data'));
    if(localdata==null){
        var rawdata = { 'users': [obj], 'orders':[],'carts':cartobj,'section':''};
    }
    else{
        var retrievedData = JSON.parse(localStorage.getItem('data'));
        var i=0;
        for (i; i < retrievedData.users.length;i++) {
            console.log('email check point:'+i);
            if(email==retrievedData.users[i].email){
                console.log('email already exitest');
                var x = document.getElementById("snackbar");
                x.innerHTML = " Email already exitest"
                x.className = "show";
                setTimeout(function () { 
                    x.className = x.className.replace("show", "");
                }, 2000);
                document.getElementById('regbtn').disabled = false;
                return false
            }
        }
        retrievedData.users.push(obj);
        retrievedData.carts=cartobj;
        var rawdata =retrievedData;
    }
    localStorage.setItem("data",JSON.stringify(rawdata));
    var x = document.getElementById("snackbar");
    x.innerHTML = " Registration Successfully"
    x.className = "show";
    setTimeout(function () { 
        x.className = x.className.replace("show", "");
        window.location.href = 'index.html';
        
    }, 2000);
    var retrievedObject = localStorage.getItem('data');
    var retrievedObject =  JSON.parse(retrievedObject);
    console.log('retrievedObject: ', retrievedObject);
}

function customerLogin(e){
    e.preventDefault();
    document.getElementById('logbtn').disabled = true;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    var localdata = JSON.parse(localStorage.getItem('data'));
    if(localdata==null){
        console.log('invalid cerdencial');
        document.getElementById('loginError').style.display = "";
        document.getElementById('loginError').innerHTML = "Invalid credentials";
        document.getElementById('logbtn').disabled = false;
        return false;
    }
    else{
        var retrievedData = JSON.parse(localStorage.getItem('data'));
        var i=0;
        for (i; i < retrievedData.users.length;i++) {
            if(email==retrievedData.users[i].email && password==retrievedData.users[i].password){
                console.log('login successfully');
                retrievedData.section=email;
                localStorage.setItem("data",JSON.stringify(retrievedData));
                document.getElementById('logbtn').disabled = false;
                document.getElementById('signupbtn').style.display = "none";
                document.getElementById('loginError').style.display = "none";
                location.reload();
                return true;
            }
        }
        console.log('invalid cerdencial');
        document.getElementById('loginError').style.display = "";
        document.getElementById('loginError').innerHTML = "Invalid credentials";
        document.getElementById('logbtn').disabled = false;
        return false;
    }
}

function loginModelView(){
    $("#loginModal").modal("toggle");
    
}

function customerLogout(){
    var localdata = JSON.parse(localStorage.getItem('data'));
    localdata.section="";
    localdata.carts={items:[]};
    localStorage.setItem("data",JSON.stringify(localdata));
    window.location.href = 'index.html';
}

var cartData = new Array();
var listitems ;


function addToCart(id, name, price) {
    var localdata = JSON.parse(localStorage.getItem('data'));
    if(localdata==null){
        loginModelView()
    }
    else{
        if(localdata.section!=''){
            var checkid=-1;
            var quality = 1
            var i=0;
            for (i; i < localdata.carts.items.length;i++) {
                if(localdata.carts.items[i].id == id){
                    checkid=i;
                }
            }
            if(checkid>=0){
                localdata.carts.items[checkid].quality=parseInt(localdata.carts.items[checkid].quality) + 1;
            }
            else{
                var cart=[]
                var cartobj={ id, name, price, quality };
                localdata.carts.items.push(cartobj);
            }
            
            var carticon = document.getElementById("lblCartCount");
            carticon.innerHTML = localdata.carts.items.length;
            localStorage.setItem("data",JSON.stringify(localdata));
            var x = document.getElementById("snackbar");
            x.innerHTML = name + " add in cart successfully"
            x.className = "show";
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 1500);
        }
        else{
            loginModelView()
        }
    }
    
}

function cartremove(id){
    var temarray=[];
    var i = 0;
    var localdata = JSON.parse(localStorage.getItem('data'));
    if(localdata!=null){
        for (i; i < localdata.carts.items.length;i++) {
            if(localdata.carts.items[i].id != id){
                temarray.push(localdata.carts.items[i])
            }
        }
        localdata.carts.items=temarray;
        localStorage.setItem("data",JSON.stringify(localdata));
        cartdata()
        try{
            var carticon = document.getElementById("lblCartCount");
            if(localdata.carts.items.length>0){

                carticon.innerHTML = localdata.carts.items.length;
            }
            else{
                carticon.innerHTML = '';
                $("#carModal").modal("hide");
            }
        }
        catch(err){

        }
        
    }
    
}
function cartView() {
    var localdata = JSON.parse(localStorage.getItem('data'));
    if(localdata.carts.items.length>0){
        cartdata()    
        $("#carModal").modal("toggle");
    }
}
function cartdata() {
    var localdata = JSON.parse(localStorage.getItem('data'));
    if(localdata!=null){
        if(localdata.section!=''){
            var i = 0;
            var totalprice=0;
            var placedata = document.getElementById("listdata");
            listitems = '<div class="placeorderHeader"><h5>Cart</h5></div><table class="table"> <thead> <tr> <th scope="col" class="border-0 bg-light"> <div class="p-2 px-3 text-uppercase">Product</div> </th> <th scope="col" class="border-0 bg-light"> <div class="py-2 text-uppercase">Price</div> </th> <th scope="col" class="border-0 bg-light"> <div class="py-2 text-uppercase">Quantity</div> </th> <th scope="col" class="border-0 bg-light"> <div class="py-2 text-uppercase">Remove</div> </th> </tr> </thead> ';
            for (i; i < localdata.carts.items.length;i++) {
                    totalprice=totalprice + parseInt(localdata.carts.items[i].price);
                    listitems += '<tr> <th scope="row" class="border-0"> <strong class="mb-0">'+localdata.carts.items[i].name+'</strong></th> <td class="border-0 align-middle"><strong>$'+localdata.carts.items[i].price+'</strong></td> <td class="border-0 align-middle"><strong>'+localdata.carts.items[i].quality+'</strong></td> <td class="border-0 align-middle"><strong onclick="cartremove('+localdata.carts.items[i].id+')" class="text-dark"><i class="fa fa-trash"></i></strong></td> </tr>';
            }
            listitems += '<tr> <th scope="row" class="border-0"> <strong class="mb-0">Total</strong></th> <td class="border-0 align-middle"><strong>$'+totalprice+'</strong></td> <td class="border-0 align-middle"><strong></strong></td> <td class="border-0 align-middle"></td> </tr>';
            listitems += '<tbody></table>'
            placedata.innerHTML=listitems;
           
        }
        
    }
  
}
function cartOrder() {
    var localdata = JSON.parse(localStorage.getItem('data'));
    if(localdata!=null){
        if(localdata.section!=''){
            var i = 0;
            var totalprice=0;
            var placedata = document.getElementById("listdata");
            listitems = '<div class="placeorderHeader"><h5>Cart</h5></div><table class="table"> <thead> <tr> <th scope="col" class="border-0 bg-light"> <div class="p-2 px-3 text-uppercase">Product</div> </th> <th scope="col" class="border-0 bg-light"> <div class="py-2 text-uppercase">Price</div> </th> <th scope="col" class="border-0 bg-light"> <div class="py-2 text-uppercase">Quantity</div> </th> <th scope="col" class="border-0 bg-light"> <div class="py-2 text-uppercase"></div> </th> </tr> </thead> ';
            for (i; i < localdata.carts.items.length;i++) {
                    totalprice=totalprice + parseInt(localdata.carts.items[i].price);
                    listitems += '<tr> <th scope="row" class="border-0"> <strong class="mb-0">'+localdata.carts.items[i].name+'</strong></th> <td class="border-0 align-middle"><strong>$'+localdata.carts.items[i].price+'</strong></td> <td class="border-0 align-middle"><strong>'+localdata.carts.items[i].quality+'</strong></td> <td class="border-0 align-middle"></td> </tr>';
            }
            listitems += '<tr> <th scope="row" class="border-0"> <strong class="mb-0">Total</strong></th> <td class="border-0 align-middle"><strong>$'+totalprice+'</strong></td> <td class="border-0 align-middle"><strong></strong></td> <td class="border-0 align-middle"></td> </tr>';
            listitems += '<tbody></table>'
            placedata.innerHTML=listitems;
           
        }
        
    }
  
}

function placeOrder(e){
    e.preventDefault();
    var localdata = JSON.parse(localStorage.getItem('data'));
    if(localdata.section!=''){
    var i = 0;
    var totalprice=0;
    const name = document.getElementById('firstname').value +" "+document.getElementById('lastname').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value;
    const paymenttype = document.getElementById('paymentType').value;
    const cart = [];
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var CurrentDateTime = date+' '+time;
    const todaydate = CurrentDateTime;
    for (i; i < localdata.carts.items.length;i++) {
        totalprice+=parseInt(localdata.carts.items[i].price);
        cart.push({name:localdata.carts.items[i].name,quality:localdata.carts.items[i].quality,price:localdata.carts.items[i].price});
    }
    var orderobj={name,address,email,paymenttype,cart,totalprice,date:todaydate}
    localdata.orders.push(orderobj)
    localdata.carts={items:[]};
    localStorage.setItem("data",JSON.stringify(localdata));
    var x = document.getElementById("snackbar");
    x.innerHTML = " Order place Successfully"
    x.className = "show";
    setTimeout(function () { 
        x.className = x.className.replace("show", "");
        window.location.href = 'index.html';
        
    }, 2000);
    }
}

function orderHistory(){
    var localdata = JSON.parse(localStorage.getItem('data'));
    if(localdata!=null){
        if(localdata.section!=''){
            var i = 0;
            var placedata = document.getElementById("orderlist");
            var listitems='';
            for (i; i < localdata.orders.length;i++) {
                if(localdata.orders[i].email == localdata.section){
                    var j = 0;
                    listitems += '<div class="placeorderHeader1"><p>Name: <strong>'+localdata.orders[i].name+'</strong></p><p>Address: <strong>'+localdata.orders[i].address+'</strong></p><p>Eamil: <strong>'+localdata.orders[i].email+'</strong></p><p>Payment Type: <strong>'+localdata.orders[i].paymenttype+'</strong></p><p>Date: <strong>'+localdata.orders[i].date+'</strong></p></div><table class="table"> <thead> <tr> <th scope="col" class="border-0 bg-light"> <div class="p-2 px-3 text-uppercase">Product</div> </th> <th scope="col" class="border-0 bg-light"> <div class="py-2 text-uppercase">Price</div> </th> <th scope="col" class="border-0 bg-light"> <div class="py-2 text-uppercase">Quantity</div> </th> <th scope="col" class="border-0 bg-light"> <div class="py-2 text-uppercase"></div> </th> </tr> </thead> ';
                    for(j;j<localdata.orders[i].cart.length;j++){
                        console.log(i)
                        listitems += '<tr> <th scope="row" class="border-0"> <strong class="mb-0">'+localdata.orders[i].cart[j].name+'</strong></th> <td class="border-0 align-middle"><strong>$'+localdata.orders[i].cart[j].price+'</strong></td> <td class="border-0 align-middle"><strong>'+localdata.orders[i].cart[j].quality+'</strong></td> <td class="border-0 align-middle"></td> </tr>';
                    }
                    listitems += '<tr> <th scope="row" class="border-0"> <strong class="mb-0">Total</strong></th> <td class="border-0 align-middle"><strong>$'+localdata.orders[i].totalprice+'</strong></td> <td class="border-0 align-middle"><strong></strong></td> <td class="border-0 align-middle"></td> </tr>';
                    listitems += '<tbody></table>'
                }
            }
            placedata.innerHTML=listitems;
           
        }
        
    }
}


















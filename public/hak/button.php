<!DOCTYPE html>
<html>
<head>

    <link rel="stylesheet" href="build/css/intlTelInput.css">
    <link rel="stylesheet" href="build/css/demo.css">
</head>

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script src="build/js/intlTelInput.js"></script>
	<script>
	
	function loadXMLDoc()
	{
	var xmlhttp;
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.onreadystatechange=function()
	  {
	  
	  if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
		document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
		/////////////////////////////////////
		  $("#phone").intlTelInput({
			//allowExtensions: true,
			//autoFormat: false,
			//autoHideDialCode: false,
			//autoPlaceholder: false,
			//defaultCountry: "auto",
			//ipinfoToken: "yolo",
			//nationalMode: false,
			//numberType: "MOBILE",
			//onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
			//preferredCountries: ['cn', 'jp'],
			utilsScript: "lib/libphonenumber/build/utils.js"
			
		  });
				$("form").submit(function() {              
		var fullnumber = $("#phone").intlTelInput("getNumber");
		$("#phone").val(fullnumber);     
	});
alert(fullnumber);
		}		
	  }
	xmlhttp.open("GET","demo.php",true);
	xmlhttp.send();
	}


</script>

<body>

	<button type="button" onclick="loadXMLDoc()">Submit a Complaint</button>
	<div id="myDiv"><h2></h2></div>
	
  
	 

</body>
</html>


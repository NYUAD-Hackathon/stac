<!DOCTYPE html>
<html>
<body>

<p>Click the button to display todays day of the month.</p>

<button onclick="myFunction()">Try it</button>

<p id="demo"></p>

<script>
function myFunction() {
    var datetime ="2000-01-01 01:00:00 UTC";
var myTime = datetime.substr(11, 2);
alert(myTime)
}
</script>

</body>
</html>

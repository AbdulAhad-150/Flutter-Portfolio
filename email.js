function sendMail() {
    let parms ={
          name : document.getElementById('name').value,
         email : document.getElementById('email').value,
         projectType : document.getElementById('project').value,
         message : document.getElementById('message').value,
    }
    emailjs.send("service_6w1786b","template_lyokn5q",parms).then(alert("Email Sent!!"));
}
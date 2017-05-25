var webdriver = require('selenium-webdriver')

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var driver = new webdriver.Builder().forBrowser('phantomjs');
//var driver = new webdriver.Builder().forBrowser('chrome');
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies


var By = webdriver.By;

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})

app.post('/sendMessage', (request, response) => {
    //Get Credentials
    let responseSent = false;
    try {
        var username = request.body.username;
        var password = request.body.password;
        var recipientId = request.body.recipientId;
        var message = request.body.message;
        var driver = driver.build();
        let error = (e) => {
                if (!responseSent) {
                    console.error('Error', e);
                    response.status(412).send(e);
                    responseSent = true;
                }
            }
            //Login
        driver.get('https://www.facebook.com/messages/t/' + recipientId).catch(error);
        //Write the message and press Return
        driver.findElement(By.xpath("//input[@id='email']")).sendKeys(username).catch(error);
        driver.findElement(By.xpath("//input[@id='pass']")).sendKeys(password).catch(error);
        driver.findElement(By.xpath("//*[@id='loginbutton']")).click().catch(error);
        driver.wait(function() {
            return driver.getTitle().then((title) => {
                return title.includes('Messenger');
            });
        }, 2000).catch(error);
        //Access to messenger directly to page to write
        driver.findElement(By.xpath("//*[@contenteditable='true' and @role='combobox']")).sendKeys(message, webdriver.Key.ENTER).catch(error);

        driver.quit().then(() => {
            if (!responseSent) {
                response.status(201).send('Done');
                responseSent = true;
            }
        }, error);
    } catch (e) {
        console.log(e);
        if (!responseSent) {
            response.status(500).send(JSON.stringify(e));
            responseSent = true;
        }
    }
});
var webdriver = require('selenium-webdriver');
var express = require('express')
var app = express()

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var port = process.env.PORT || 8000;
var By = webdriver.By;
var until = webdriver.until;


app.post('/sendMessage', function(req, res) {
    //Get Credentials
    var username = req.body.username;
    var password = req.body.password;
    var recipientId = req.body.recipientId;
    var message = req.body.message;
    var driver = undefined;
    try {
        driver = new webdriver.Builder()
            .forBrowser('phantomjs')
            .build();
    } catch (e) {
        res.status(501).send(e);
        return;
    }


    driver.get('https://facebook.com/login/');
    driver.wait(function() {
        return driver.getTitle().then(function(title) {
            //Login User
            driver.findElement(By.xpath("//input[@id='email']")).sendKeys(username);
            driver.findElement(By.xpath("//input[@id='pass']")).sendKeys(password);
            driver.findElement(By.xpath("//*[@id='loginbutton']")).click();

            //Access to messenger directly to page to write
            driver.get('https://www.facebook.com/messages/t/' + recipientId);
            return true;
        });
    }, 5000).then(function() {
        //Write the message and press Return
        driver.findElement(By.xpath("//*[@contenteditable='true' and @role='combobox']")).sendKeys(message, webdriver.Key.RETURN);
        res.status(201).send('Done');
    }, function(error) {
        //future send error to org
        res.status(500).send(error);
    });

    //Close the test
    driver.quit();
});


app.get('/test', function(req, res) {
    res.status(200).send('test');
});

app.listen(port, function() {
        console.log('Example app listening on port: ', port)
    }) //
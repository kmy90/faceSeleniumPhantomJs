var webdriver = require('selenium-webdriver')

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var direverBuider = new webdriver.Builder().forBrowser('phantomjs');

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies


var By = webdriver.By;

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))


app.get('/', function(request, response) {
    response.send('Hello World!')
})

app.get('/testA', function(req, res) {
    var driver = new webdriver.Builder()
        .forBrowser('phantomjs')
        .build();
    driver.get('http://www.google.com/ncr');
    driver.findElement(By.name('q')).sendKeys('webdriver', webdriver.Key.ENTER);
    //driver.findElement(By.name('btnG')).click();
    driver.wait(function() {
        return driver.getTitle().then(function(title) {
            console.log(title);
            return title === 'webdriver - Google Search';
        });
    }, 5000).then(function() {
        res.status(200).send('Done');
    }, function(error) {
        res.status(200).send(error);
    });
    driver.quit();
});


app.get('/error', function(request, response) {
    try {
        var u = undefined;
        u.a.b();
        response.status(200).send("done");
    } catch (e) {
        response.status(500).send(JSON.stringify(e));
    }
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})

app.post('/sendMessage', (request, response) => {
    //Get Credentials
    let responseSed = false;
    try {
        var username = request.body.username;
        var password = request.body.password;
        var recipientId = request.body.recipientId;
        var message = request.body.message;

        var driver = direverBuider.build();
        let error = (e) => {
            if(!responseSed) {
                console.error('Error', e);
                response.status(412).send(e);
                responseSed = true;
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
        /*
        //Close Account
        driver.findElement(By.xpath("//*[@id='userNavigationLabel']")).click().catch(error);;
        var logoutKey = '"{"ref":"async_menu","logout_menu_click":"menu_logout"}';
        driver.findElement(By.xpath("//a[@data-gt='" + logoutKey + "']")).click().catch(error);;


        //*/
        driver.quit().then(()=>{
            if(!responseSed) {
                response.status(200).send('Done');
                responseSed = true;
            }
        },error);
        //response.status(200).send('Done');
    } catch (e) {
        console.log(e);
        if(!responseSed) {
            response.status(500).send(JSON.stringify(e));
            responseSed = true;
        }
    }
});

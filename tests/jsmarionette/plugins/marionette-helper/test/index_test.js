'use strict';
var assert = require('assert');

marionette('MarionetteHelper', function() {
  var subject;

  marionette.plugin('helper', require('../index'));
  marionette.plugin('apps', require('marionette-apps'));

  var client = marionette.client({
    profile: {
      settings: {
        'ftu.manifestURL': null,
        'lockscreen.enabled': false
      },
    }
  });

  setup(function() {
    subject = client.helper;
    client.setSearchTimeout(2000);
    client.executeScript(function() {
      // start with a clean slate
      document.body.innerHTML = '';
    });
  });

  suite('#wait', function() {
    test('basic operation', function() {
      var before = new Date().getTime();
      subject.wait(1000);
      var after = new Date().getTime();
      assert.ok(after - before >= 1000);
    });

    test('durations longer than current `scriptTimeout`', function() {
      client.setScriptTimeout(23);
      subject.wait(300);
      assert.equal(client.scriptTimeout, 23);
    });
  });

  test('#waitFor', function(done) {
    var i = 0;
    subject.waitFor(function() {
      i++;
      return i > 4;
    }, function() {
      assert.strictEqual(i, 5);
      done();
    }, 50, 200);
  });

  test('#waitForElement, element added to DOM', function() {
    var myRandomID = 'YAAAAAAYRandomWow' + Date.now();
    client.executeScript(function(myRandomID) {
      setTimeout(function() {
        var el = document.createElement('div');
        el.id = myRandomID;
        el.innerHTML = 'Hello Test!';
        document.body.appendChild(el);
      }, 500);
    }, [myRandomID]);
    subject.waitForElement('#' + myRandomID);
  });

  test('#waitForElement, element displayed with CSS', function() {
    var myRandomID = 'YAAAAAAYRandomWow' + Date.now();
    client.executeScript(function(myRandomID) {
      var el = document.createElement('div');
      el.id = myRandomID;
      el.innerHTML = 'Hello Test!';
      el.style.display = 'none';
      document.body.appendChild(el);
      setTimeout(function() {
        el.style.display = 'block';
      }, 500);
    }, [myRandomID]);
    subject.waitForElement('#' + myRandomID);
  });

  test('#waitForElement with custom timeout', function(done) {
    this.timeout(10000); // make this fail fast.
    var myRandomID = 'YAAAAAAYRandomWow' + Date.now();
    client.executeScript(function(myRandomID) {
      setTimeout(function() {
        var el = document.createElement('div');
        el.id = myRandomID;
        el.innerHTML = 'Hello Test!';
        document.body.appendChild(el);
      }, 500);
    }, [myRandomID]);

    // Ensure the waitFor times out.
    client.onScriptTimeout = function() {
      assert(true, 'this should timeout');
      done();
    };

    try {
      subject.waitForElementToDisappear('#' + myRandomID, { timeout: 10 });
      assert(false, 'should timeout before disappearing');
    } catch (e) {}
  });

  test('#waitForChild, element added to DOM', function() {
    var myRandomID = 'YAAAAAAYRandomWow' + Date.now();
    client.executeScript(function(myRandomID) {
      var parent = document.createElement('div');
      parent.id = 'parent';
      document.body.appendChild(parent);
      setTimeout(function() {
        var el = document.createElement('div');
        el.id = myRandomID;
        el.innerHTML = 'Hello Test!';
        parent.appendChild(el);
      }, 500);
    }, [myRandomID]);
    var parent = client.findElement('#parent');
    subject.waitForChild(parent, '#' + myRandomID);
  });

  test('#waitForChild, element displayed with CSS', function() {
    var myRandomID = 'YAAAAAAYRandomWow' + Date.now();
    client.executeScript(function(myRandomID) {
      var parent = document.createElement('div');
      parent.id = 'parent';
      document.body.appendChild(parent);
      var el = document.createElement('div');
      el.id = myRandomID;
      el.innerHTML = 'Hello Test!';
      el.style.display = 'none';
      parent.appendChild(el);
      setTimeout(function() {
        el.style.display = 'block';
      }, 500);
    }, [myRandomID]);
    var parent = client.findElement('#parent');
    subject.waitForChild(parent, '#' + myRandomID);
  });

  test('#waitForElementToDisappear DOM with an Element', function() {
    var myRandomID = 'YAAAAAAYRandomWow' + Date.now();
    client.executeScript(function(myRandomID) {
      var el = document.createElement('div');
      el.id = myRandomID;
      el.innerHTML = 'Hello Test!';
      document.body.appendChild(el);
      setTimeout(function() {
        document.body.removeChild(el);
      }, 500);
    }, [myRandomID]);
    var el = client.findElement('#' + myRandomID);
    subject.waitForElementToDisappear(el);
  });

  test('#waitForElementToDisappear DOM with a string', function() {
    var myRandomID = 'YAAAAAAYRandomWow' + Date.now();
    client.executeScript(function(myRandomID) {
      var el = document.createElement('div');
      el.id = myRandomID;
      el.innerHTML = 'Hello Test!';
      document.body.appendChild(el);
      setTimeout(function() {
        document.body.removeChild(el);
      }, 500);
    }, [myRandomID]);
    subject.waitForElementToDisappear('#' + myRandomID);
  });

  test('#waitForElementToDisappear CSS with an Element', function() {
    var myRandomID = 'YAAAAAAYRandomWow' + Date.now();
    client.executeScript(function(myRandomID) {
      var el = document.createElement('div');
      el.id = myRandomID;
      el.innerHTML = 'Hello Test!';
      document.body.appendChild(el);
      setTimeout(function() {
        el.style.display = 'none';
      }, 500);
    }, [myRandomID]);
    var el = client.findElement('#' + myRandomID);
    subject.waitForElementToDisappear(el);
  });

  test('#waitForElementToDisappear DOM with a string', function() {
    var myRandomID = 'YAAAAAAYRandomWow' + Date.now();
    client.executeScript(function(myRandomID) {
      var el = document.createElement('div');
      el.id = myRandomID;
      el.innerHTML = 'Hello Test!';
      document.body.appendChild(el);
      setTimeout(function() {
        el.style.display = 'none';
      }, 500);
    }, [myRandomID]);
    subject.waitForElementToDisappear('#' + myRandomID);
  });

  test('#waitForElementToDisappear with custom timeout', function(done) {
    this.timeout(10000); // make this fail fast.
    var myRandomID = 'YAAAAAAYRandomWow' + Date.now();
    client.executeScript(function(myRandomID) {
      var el = document.createElement('div');
      el.id = myRandomID;
      el.innerHTML = 'Hello Test!';
      document.body.appendChild(el);
      setTimeout(function() {
        el.style.display = 'none';
      }, 500);
    }, [myRandomID]);

    // Ensure the waitFor times out.
    client.onScriptTimeout = function() {
      assert(true, 'this should timeout');
      done();
    };

    try {
      subject.waitForElementToDisappear('#' + myRandomID, { timeout: 10 });
      assert(false, 'should timeout before disappearing');
    } catch (e) {}
  });

  suite.skip('#waitForAlert', function() {
    setup(function() {
      console.log('Will alert!');
      client.executeScript(function() {
        alert('lololololololol');
      });
    });

    test('should wait for substring sync', function() {
      subject.waitForAlert('lol');
    });

    test('should wait for substring async', function(done) {
      subject.waitForAlert('lol', done);
    });

    test('should wait for RegExp sync', function() {
      subject.waitForAlert(/(lo)*l/);
    });

    test('should wait for RegExp async', function(done) {
      subject.waitForAlert(/(lo)*l/, done);
    });
  });
});

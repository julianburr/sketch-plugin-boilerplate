---
layout: docs
id: utils/fetch
title: Utils &rsaquo; Fetch
---

# Fetch and More

From Sketch 54 (include 54), CocoaScript js can call ObjC-Block-API.

So I think this is a very useful feature.

## Fetch
And we can write out fetch easily in js just wrap the MacOS ObjC API.

```js
const mySession = (function() {
  const cookieStorage = NSHTTPCookieStorage.sharedCookieStorageForGroupContainerIdentifier('seCrET')

  const configuration = NSURLSessionConfiguration.defaultSessionConfiguration()
  configuration.setHTTPCookieStorage(cookieStorage)

  const session = NSURLSession.sessionWithConfiguration(configuration)
  return session
})()

function myFetch(request, completionHandler) {
  return new Promise(function(resolve, reject) {
    const task = mySession.dataTaskWithRequest_completionHandler(
      request,
      __mocha__.createBlock_function(
        'v32@?0@"NSData"8@"NSURLResponse"16@"NSError"24',
        function (data, response, error) {
          completionHandler(resolve, reject)(data, response, error)
        }
      )
    )
    task.resume()
  })
}

export function fetchExample() {
  let request = NSMutableURLRequest.new()
  request.setHTTPMethod("GET")
  request.setURL(NSURL.URLWithString(`https://jsonplaceholder.typicode.com/todos/1`))
  return myFetch(request, (resolve, reject) => (data, response, error) => {
    if (error) {
      reject(Error('Fetch Example Error'))
      return
    }
    const responseJsonStr = NSString.alloc().initWithData_encoding(data, 4) // type is NSString
    const responseJson = JSON.parse(responseJsonStr) // type is jsObject
    resolve(responseJson)
  })
}

// later somewhere call below
async function testFetchExample() {
  const result = await WebViewUtils.fetchExample()
  document.showMessage(`I fetched ${JSON.stringify(result)}`)
}
```

You can see the `fetchExample` works to press `Send Http Request` Menu Button.

## Notices:
#### Because we already set the environment true (See the code below) and never set it false, so above `myFetch` code works well.
  
```js
coscript.setShouldKeepAround(true);
```

#### You see here is very flexible, so I just write some code for demonstrate the idea,
you can write your fetch, wrap any MacOS network ObjC-Block-API, or just use `myFetch`, 😀

#### Have a look at `'v32@?0@"NSData"8@"NSURLResponse"16@"NSError"24'`
I think this is the string you have to write, from the parameter data type of the block

Here, we call the ObjC-API

```objc
(NSURLSessionDataTask *)dataTaskWithRequest:(NSURLRequest *)request completionHandler:(void (^)(NSData *data, NSURLResponse *response, NSError *error))completionHandler;
```

So, this mysterious string should be concatenate by: 
```js
v32@?0@ // 8*4=32
"NSData"8@ // 8, 8 is the pointer size?!
"NSURLResponse"16@ // 8*2=16
"NSError"24 // 8*3=24, no more @
```

I don't understand exactly what is going on here, may be you could see this <a href='https://github.com/sketch-hq/CocoaScript'>CocoaScript</a>.

I think here is the type information the CocoaScript needs to dynamically generate and call the C data structure.

#### Because the fetch call the native API, so there is no cross-domain problems here.
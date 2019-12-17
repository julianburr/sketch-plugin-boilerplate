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

// later somewhere
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

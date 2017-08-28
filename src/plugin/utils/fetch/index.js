import { createRequest } from './request';
import ObjCClass from 'cocoascript-class';
import { storeOnMainThread } from 'utils/core';

let sessionConfig = NSURLSessionConfiguration.defaultSessionConfiguration();
let SessionDataDelegate = new ObjCClass({
  'URLSession:dataTask:didReceiveResponse:completionHandler:': function (session, task, response, completionHandler) {
    log('URLSession:dataTask:didReceiveResponse:completionHandler:')
    log(session)
    log(task)
    log(response)
    completionHandler(NSURLSessionResponseAllow);
    session = null;
    task = null;
    response = null;
  },
  'URLSession:dataTask:didReceiveData:': function (session, task, data) {
    log('URLSession:dataTask:didReceiveData:')
    log(session)
    log(task)
    let dataString = NSString.alloc().initWithData_encoding(data, NSUTF8StringEncoding);
    log(dataString)
    log('Task ID')
    log(task.processIdentifier)
    data = null;
    dataString.release();
    dataString = null;
    task = null;
    session = null;
  },
  // 'URLSession:task:didCompleteWithError:': function (session, task, error) {
  //   log('URLSession:task:didCompleteWithError:')
  //   log(session)
  //   log(task)
  //   log(error)
  //   log('Task ID')
  //   log(task.processIdentifier)
  //   session = null;
  //   task = null;
  //   error = null;
  // },
  // 'URLSession:didBecomeInvalidWithError:': function (session, error) {
  //   log('URLSession:didBecomeInvalidWithError:')
  //   log(session);
  //   log(error)
  //   session.release();
  // }
});

// let counter = 0;

export default function (url, options = {}) {
  try {
    let delegate = SessionDataDelegate.alloc().init();
    let session = NSURLSession
      .sessionWithConfiguration_delegate_delegateQueue(sessionConfig, delegate, null);
    return new Promise((resolve, reject) => {
      let request = createRequest({url, ...options});
      let task = session.dataTaskWithRequest(request);
      // task.processIdentifier = counter;
      task.resume();
      request = null;
      session = null;
      task = null;
      delegate.release();
      delegate = null;
      resolve();
    });
  } catch (e) {
    log('Caught')
    log(e)
  }
}

// export {
//   sharedSession
// };